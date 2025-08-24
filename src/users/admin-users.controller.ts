import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { AdminUsersService } from "./admin-users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from "./dto/admin-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "./entities/user.entity";

@ApiTags("Admin - User Management")
@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Username or email already exists" })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Request() req
  ): Promise<UserResponseDto> {
    return this.adminUsersService.createUser(createUserDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get all users (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Users retrieved successfully",
    type: [UserResponseDto],
  })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.adminUsersService.getAllUsers();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User retrieved successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<UserResponseDto> {
    return this.adminUsersService.getUserById(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 409, description: "Username or email already exists" })
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ): Promise<UserResponseDto> {
    return this.adminUsersService.updateUser(id, updateUserDto, req.user.id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 204, description: "User deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteUser(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ): Promise<void> {
    return this.adminUsersService.deleteUser(id, req.user.id);
  }

  // Admin data access endpoints
  @Get("statements")
  @ApiOperation({ summary: "Get all users statements (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "All users statements retrieved successfully",
  })
  async getAllUsersStatements(): Promise<any[]> {
    return this.adminUsersService.getAllUsersStatements();
  }

  @Get("insights")
  @ApiOperation({ summary: "Get all users insights (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "All users insights retrieved successfully",
  })
  async getAllUsersInsights(): Promise<any[]> {
    return this.adminUsersService.getAllUsersInsights();
  }

  @Get("bureau/reports")
  @ApiOperation({ summary: "Get all users bureau reports (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "All users bureau reports retrieved successfully",
  })
  async getAllUsersBureauReports(): Promise<any[]> {
    return this.adminUsersService.getAllUsersBureauReports();
  }

  @Get("users/:id/statements")
  @ApiOperation({ summary: "Get specific user statements (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User statements retrieved successfully",
  })
  async getUserStatements(
    @Param("id", ParseIntPipe) id: number
  ): Promise<any[]> {
    return this.adminUsersService.getUserStatements(id);
  }

  @Get("users/:id/insights")
  @ApiOperation({ summary: "Get specific user insights (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User insights retrieved successfully",
  })
  async getUserInsights(@Param("id", ParseIntPipe) id: number): Promise<any[]> {
    return this.adminUsersService.getUserInsights(id);
  }

  @Get("users/:id/bureau/reports")
  @ApiOperation({ summary: "Get specific user bureau reports (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User bureau reports retrieved successfully",
  })
  async getUserBureauReports(
    @Param("id", ParseIntPipe) id: number
  ): Promise<any[]> {
    return this.adminUsersService.getUserBureauReports(id);
  }

  @Get("dashboard/stats")
  @ApiOperation({ summary: "Get admin dashboard statistics (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "Dashboard statistics retrieved successfully",
  })
  async getAdminDashboardStats(): Promise<any> {
    return this.adminUsersService.getAdminDashboardStats();
  }
}
