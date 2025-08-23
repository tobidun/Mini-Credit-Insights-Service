import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Statement } from "./statement.entity";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "statement_id", nullable: true })
  statementId: number;

  @Column({ length: 255 })
  description: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number;

  @Column({ name: "transaction_date", type: "date" })
  transactionDate: Date;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  balance: number;

  @ManyToOne(() => Statement, (statement) => statement.transactions)
  @JoinColumn({ name: "statement_id" })
  statement: Statement;
}
