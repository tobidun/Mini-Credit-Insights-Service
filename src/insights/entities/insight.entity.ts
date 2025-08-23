import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Statement } from "../../statements/entities/statement.entity";

@Entity("insights")
export class Insight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "statement_id" })
  statementId: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({
    name: "three_month_avg_income",
    type: "decimal",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  threeMonthAvgIncome: number;

  @Column({ name: "total_inflow", type: "decimal", precision: 15, scale: 2 })
  totalInflow: number;

  @Column({ name: "total_outflow", type: "decimal", precision: 15, scale: 2 })
  totalOutflow: number;

  @Column({ name: "net_amount", type: "decimal", precision: 15, scale: 2 })
  netAmount: number;

  @Column({ name: "spend_buckets", type: "json" })
  spendBuckets: Record<string, number>;

  @Column({ name: "risk_flags", type: "json" })
  riskFlags: string[];

  @CreateDateColumn({ name: "generated_at" })
  generatedAt: Date;

  @ManyToOne(() => Statement, (statement) => statement.insights)
  @JoinColumn({ name: "statement_id" })
  statement: Statement;

  @ManyToOne(() => User, (user) => user.insights)
  @JoinColumn({ name: "user_id" })
  user: User;
}
