import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as csv from "csv-parser";
import * as fs from "fs";
import { Statement, StatementStatus } from "./entities/statement.entity";
import { Transaction } from "./entities/transaction.entity";
import { User } from "../users/entities/user.entity";
import { AuditService } from "../audit/audit.service";
import { AuditAction } from "../audit/entities/audit-log.entity";

@Injectable()
export class StatementsService {
  constructor(
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private auditService: AuditService
  ) {}

  async uploadStatement(
    file: Express.Multer.File,
    userId: number
  ): Promise<Statement> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const statement = this.statementRepository.create({
      userId,
      filename: file.originalname,
      status: StatementStatus.PROCESSING,
    });

    const savedStatement = await this.statementRepository.save(statement);

    try {
      const transactions = await this.parseCSV(file.path, savedStatement.id);

      const savedTransactions = await this.transactionRepository.save(
        transactions
      );

      await this.statementRepository.update(savedStatement.id, {
        status: StatementStatus.COMPLETED,
        totalTransactions: savedTransactions.length,
        parsingSuccessRate: this.calculateSuccessRate(transactions),
      });

      // Audit log successful statement upload
      await this.auditService.log({
        userId,
        action: AuditAction.UPLOAD,
        resource: "statement",
        resourceId: savedStatement.id,
        details: {
          filename: file.originalname,
          totalTransactions: savedTransactions.length,
          parsingSuccessRate: this.calculateSuccessRate(transactions),
        },
      });

      return this.statementRepository.findOne({
        where: { id: savedStatement.id },
      });
    } catch (error) {
      await this.statementRepository.update(savedStatement.id, {
        status: StatementStatus.FAILED,
      });

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new BadRequestException(`Failed to process CSV: ${error.message}`);
    }
  }

  private async parseCSV(
    filePath: string,
    statementId: number
  ): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: Transaction[] = [];
      const results: any[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          try {
            console.log("CSV parsing results:", results);
            for (const row of results) {
              console.log("Processing row:", row);
              const amount = this.parseAmount(row.amount);
              const transactionDate = this.parseDate(row.date);
              console.log("Parsed amount:", amount, "date:", transactionDate);

              if (amount !== null && transactionDate !== null) {
                transactions.push(
                  this.transactionRepository.create({
                    statementId: statementId,
                    description: row.description || "Unknown",
                    amount,
                    transactionDate,
                    balance: parseFloat(row.balance) || 0,
                  })
                );
              }
            }

            if (transactions.length === 0) {
              reject(new Error("No valid transactions found in CSV"));
            }

            resolve(transactions);
          } catch (error) {
            reject(error);
          }
        })
        .on("error", reject);
    });
  }

  private parseAmount(amountStr: string): number | null {
    if (!amountStr || amountStr.trim() === "") return null;

    // Remove any extra whitespace and common currency symbols
    let cleanAmount = amountStr.trim().replace(/[^\d.-]/g, "");

    // Handle empty or invalid amounts
    if (!cleanAmount || cleanAmount === "") return null;

    let amount = parseFloat(cleanAmount);

    if (isNaN(amount)) {
      // Try to handle credit/debit notation
      const creditDebitMatch = amountStr.match(
        /(\d+(?:\.\d{2})?)\s*(CR|DR|credit|debit)/i
      );
      if (creditDebitMatch) {
        amount = parseFloat(creditDebitMatch[1]);
        if (creditDebitMatch[2].toUpperCase().includes("CR")) {
          amount = Math.abs(amount);
        } else {
          amount = -Math.abs(amount);
        }
      } else {
        return null;
      }
    }

    return amount;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  private calculateSuccessRate(transactions: Transaction[]): number {
    if (transactions.length === 0) return 0;
    return Math.round((transactions.length / transactions.length) * 100);
  }

  async getStatement(statementId: number, userId: number): Promise<Statement> {
    const statement = await this.statementRepository.findOne({
      where: { id: statementId, userId },
      relations: ["transactions"],
    });

    if (!statement) {
      throw new NotFoundException("Statement not found");
    }

    return statement;
  }

  async getUserStatements(userId: number): Promise<Statement[]> {
    return this.statementRepository.find({
      where: { userId },
      order: { uploadDate: "DESC" },
    });
  }
}
