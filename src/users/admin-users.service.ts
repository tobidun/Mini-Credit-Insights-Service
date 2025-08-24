import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User, UserRole } from "./entities/user.entity";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "./dto/admin-user.dto";
import { AuditService } from "../audit/audit.service";
import { AuditAction } from "../audit/entities/audit-log.entity";
import { Statement } from "../statements/entities/statement.entity";
import { Insight } from "../insights/entities/insight.entity";
import { BureauReport } from "../bureau/entities/bureau-report.entity";

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
    @InjectRepository(Insight)
    private insightRepository: Repository<Insight>,
    @InjectRepository(BureauReport)
    private bureauReportRepository: Repository<BureauReport>,
    private auditService: AuditService
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    adminId: number
  ): Promise<UserResponseDto> {
    const { username, email, password, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      username,
      email,
      passwordHash,
      role: role || UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: AuditAction.CREATE,
      resource: "user",
      resourceId: savedUser.id,
      details: {
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        createdBy: adminId,
      },
    });

    return this.mapToResponseDto(savedUser);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: "DESC" },
    });

    return users.map((user) => this.mapToResponseDto(user));
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.mapToResponseDto(user);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    adminId: number
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if trying to update admin role (prevent privilege escalation)
    if (updateUserDto.role === UserRole.ADMIN && user.role !== UserRole.ADMIN) {
      throw new BadRequestException("Cannot promote user to admin role");
    }

    // Check for conflicts if updating username or email
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: [
          ...(updateUserDto.username
            ? [{ username: updateUserDto.username }]
            : []),
          ...(updateUserDto.email ? [{ email: updateUserDto.email }] : []),
        ].filter(Boolean),
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("Username or email already exists");
      }
    }

    // Update user
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: AuditAction.UPDATE,
      resource: "user",
      resourceId: updatedUser.id,
      details: {
        updatedFields: Object.keys(updateUserDto),
        updatedBy: adminId,
      },
    });

    return this.mapToResponseDto(updatedUser);
  }

  async deleteUser(id: number, adminId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Prevent admin from deleting themselves
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException("Cannot delete admin users");
    }

    await this.userRepository.remove(user);

    // Audit log
    await this.auditService.log({
      userId: adminId,
      action: AuditAction.DELETE,
      resource: "user",
      resourceId: id,
      details: {
        deletedUsername: user.username,
        deletedBy: adminId,
      },
    });
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Admin data access methods
  async getAllUsersStatements(): Promise<any[]> {
    const users = await this.userRepository.find({
      relations: ["statements", "statements.transactions"],
      order: { createdAt: "DESC" },
    });

    return users.flatMap((user) =>
      user.statements.map((statement) => ({
        ...statement,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      }))
    );
  }

  async getAllUsersInsights(): Promise<any[]> {
    const users = await this.userRepository.find({
      relations: ["insights"],
      order: { createdAt: "DESC" },
    });

    return users.flatMap((user) =>
      user.insights.map((insight) => ({
        ...insight,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      }))
    );
  }

  async getAllUsersBureauReports(): Promise<any[]> {
    const users = await this.userRepository.find({
      relations: ["bureauReports"],
      order: { createdAt: "DESC" },
    });

    return users.flatMap((user) =>
      user.bureauReports.map((report) => ({
        ...report,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      }))
    );
  }

  async getUserStatements(userId: number): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["statements", "statements.transactions"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.statements.map((statement) => ({
      ...statement,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }));
  }

  async getUserInsights(userId: number): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["insights"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.insights.map((insight) => ({
      ...insight,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }));
  }

  async getUserBureauReports(userId: number): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["bureauReports"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.bureauReports.map((report) => ({
      ...report,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    }));
  }

  async getAdminDashboardStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const adminUsers = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });
    const regularUsers = await this.userRepository.count({
      where: { role: UserRole.USER },
    });

    // Get statements count
    const usersWithStatements = await this.userRepository.find({
      relations: ["statements"],
    });
    const totalStatements = usersWithStatements.reduce(
      (sum, user) => sum + user.statements.length,
      0
    );

    // Get insights count
    const usersWithInsights = await this.userRepository.find({
      relations: ["insights"],
    });
    const totalInsights = usersWithInsights.reduce(
      (sum, user) => sum + user.insights.length,
      0
    );

    // Get bureau reports count
    const usersWithBureauReports = await this.userRepository.find({
      relations: ["bureauReports"],
    });
    const totalBureauReports = usersWithBureauReports.reduce(
      (sum, user) => sum + user.bureauReports.length,
      0
    );

    return {
      users: {
        total: totalUsers,
        admins: adminUsers,
        regular: regularUsers,
      },
      data: {
        statements: totalStatements,
        insights: totalInsights,
        bureauReports: totalBureauReports,
      },
      lastUpdated: new Date().toISOString(),
    };
  }
}
