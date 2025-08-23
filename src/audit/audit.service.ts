import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditLog, AuditAction } from "./entities/audit-log.entity";
import { User } from "../users/entities/user.entity";

export interface AuditLogData {
  userId: number;
  action: AuditAction;
  resource: string;
  resourceId?: number;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async log(data: AuditLogData): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    return this.auditLogRepository.save(auditLog);
  }

  async getUserAuditLogs(userId: number, limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  async getAuditLogsByAction(action: AuditAction, limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { action },
      order: { createdAt: "DESC" },
      take: limit,
      relations: ["user"],
    });
  }

  async getAuditLogsByResource(resource: string, resourceId?: number, limit: number = 50): Promise<AuditLog[]> {
    const where: any = { resource };
    if (resourceId) {
      where.resourceId = resourceId;
    }

    return this.auditLogRepository.find({
      where,
      order: { createdAt: "DESC" },
      take: limit,
      relations: ["user"],
    });
  }

  async getRecentAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { createdAt: "DESC" },
      take: limit,
      relations: ["user"],
    });
  }

  async getAuditLogById(id: number): Promise<AuditLog> {
    return this.auditLogRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async deleteOldAuditLogs(olderThanDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.auditLogRepository
      .createQueryBuilder()
      .delete()
      .from(AuditLog)
      .where("created_at < :cutoffDate", { cutoffDate })
      .execute();

    return result.affected || 0;
  }
} 