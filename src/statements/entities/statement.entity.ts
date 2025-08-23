import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Transaction } from "./transaction.entity";
import { Insight } from "../../insights/entities/insight.entity";

export enum StatementStatus {
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

@Entity("statements")
export class Statement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ length: 255 })
  filename: string;

  @CreateDateColumn({ name: "upload_date" })
  uploadDate: Date;

  @Column({
    type: "enum",
    enum: StatementStatus,
    default: StatementStatus.PROCESSING,
  })
  status: StatementStatus;

  @Column({
    name: "parsing_success_rate",
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  parsingSuccessRate: number;

  @Column({ name: "total_transactions", type: "int", default: 0 })
  totalTransactions: number;

  @ManyToOne(() => User, (user) => user.statements)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.statement)
  transactions: Transaction[];

  @OneToMany(() => Insight, (insight) => insight.statement)
  insights: Insight[];
}
