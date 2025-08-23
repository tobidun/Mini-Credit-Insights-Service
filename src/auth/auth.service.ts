import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User, UserRole } from "../users/entities/user.entity";
import { LoginDto, RegisterDto, AuthResponseDto } from "./dto/auth.dto";
import { AuditService } from "../audit/audit.service";
import { AuditAction } from "../audit/entities/audit-log.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private auditService: AuditService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { username, email, password, role } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      username,
      email,
      passwordHash,
      role: role === "admin" ? UserRole.ADMIN : UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    // Audit log the user registration
    await this.auditService.log({
      userId: savedUser.id,
      action: AuditAction.CREATE,
      resource: "user",
      resourceId: savedUser.id,
      details: { username: savedUser.username, email: savedUser.email, role: savedUser.role },
    });

    const payload = {
      sub: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Audit log the successful login
    await this.auditService.log({
      userId: user.id,
      action: AuditAction.LOGIN,
      resource: "auth",
      details: { username: user.username, role: user.role },
    });

    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
