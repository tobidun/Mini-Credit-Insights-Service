import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { AuditService } from "./audit.service";

@ApiTags("Audit")
@Controller("audit")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("logs")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get recent audit logs (Admin only)" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getRecentLogs(@Query("limit") limit: number = 100) {
    return this.auditService.getRecentAuditLogs(limit);
  }

  @Get("logs/user")
  @ApiOperation({ summary: "Get current user's audit logs" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getUserLogs(@Request() req, @Query("limit") limit: number = 50) {
    return this.auditService.getUserAuditLogs(req.user.id, limit);
  }

  @Get("logs/action/:action")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get audit logs by action (Admin only)" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getLogsByAction(
    @Param("action") action: string,
    @Query("limit") limit: number = 50
  ) {
    return this.auditService.getAuditLogsByAction(action as any, limit);
  }

  @Get("logs/resource/:resource")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get audit logs by resource (Admin only)" })
  @ApiQuery({ name: "resourceId", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getLogsByResource(
    @Param("resource") resource: string,
    @Query("resourceId") resourceId?: number,
    @Query("limit") limit: number = 50
  ) {
    return this.auditService.getAuditLogsByResource(resource, resourceId, limit);
  }

  @Get("logs/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get specific audit log (Admin only)" })
  async getAuditLog(@Param("id") id: string) {
    return this.auditService.getAuditLogById(parseInt(id));
  }

  @Delete("logs/cleanup")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Clean up old audit logs (Admin only)" })
  @ApiQuery({ name: "days", required: false, type: Number, description: "Delete logs older than X days" })
  async cleanupOldLogs(@Query("days") days: number = 90) {
    const deletedCount = await this.auditService.deleteOldAuditLogs(days);
    return {
      message: `Deleted ${deletedCount} old audit logs`,
      deletedCount,
      olderThanDays: days,
    };
  }
} 