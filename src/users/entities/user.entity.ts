import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Statement } from "../../statements/entities/statement.entity";
import { Insight } from "../../insights/entities/insight.entity";
import { BureauReport } from "../../bureau/entities/bureau-report.entity";
import { AuditLog } from "../../audit/entities/audit-log.entity";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ name: "password_hash", length: 255 })
  passwordHash: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Statement, (statement) => statement.user)
  statements: Statement[];

  @OneToMany(() => Insight, (insight) => insight.user)
  insights: Insight[];

  @OneToMany(() => BureauReport, (report) => report.user)
  bureauReports: BureauReport[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];
}
