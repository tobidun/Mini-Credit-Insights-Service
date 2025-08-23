import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
  UPLOAD = "upload",
  COMPUTE = "compute",
}

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ length: 100 })
  action: AuditAction;

  @Column({ length: 255 })
  resource: string;

  @Column({ name: "resource_id", nullable: true })
  resourceId: number;

  @Column({ type: "json", nullable: true })
  details: Record<string, any>;

  @Column({ name: "ip_address", length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: "user_id" })
  user: User;
}
