import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum BureauReportStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

@Entity("bureau_reports")
export class BureauReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({
    type: "enum",
    enum: BureauReportStatus,
    default: BureauReportStatus.PENDING,
  })
  status: BureauReportStatus;

  @Column({ name: "credit_score", type: "int", nullable: true })
  creditScore: number;

  @Column({ name: "risk_band", length: 50, nullable: true })
  riskBand: string;

  @Column({ name: "enquiries_6m", type: "int", nullable: true })
  enquiries6m: number;

  @Column({ name: "defaults", type: "int", nullable: true })
  defaults: number;

  @Column({ name: "open_loans", type: "int", nullable: true })
  openLoans: number;

  @Column({ name: "trade_lines", type: "int", nullable: true })
  tradeLines: number;

  @Column({ name: "error_message", type: "text", nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: "requested_at" })
  requestedAt: Date;

  @ManyToOne(() => User, (user) => user.bureauReports)
  @JoinColumn({ name: "user_id" })
  user: User;
}
