import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Insight } from "./entities/insight.entity";
import { Statement } from "../statements/entities/statement.entity";
import { Transaction } from "../statements/entities/transaction.entity";
import { User } from "../users/entities/user.entity";
import { AuditService } from "../audit/audit.service";
import { AuditAction } from "../audit/entities/audit-log.entity";

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Insight)
    private insightRepository: Repository<Insight>,
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private auditService: AuditService
  ) {}

  async computeInsights(statementId: number, userId: number): Promise<Insight> {
    const statement = await this.statementRepository.findOne({
      where: { id: statementId, userId },
      relations: ["transactions"],
    });

    if (!statement) {
      throw new NotFoundException("Statement not found");
    }

    const existingInsight = await this.insightRepository.findOne({
      where: { statementId, userId },
    });

    if (existingInsight) {
      return existingInsight;
    }

    const transactions = statement.transactions;
    const threeMonthAvgIncome = this.calculateThreeMonthAvgIncome(transactions);
    const spendingCategories = this.categorizeSpending(transactions);
    const riskFlags = this.identifyRiskFlags(transactions);

    const insight = this.insightRepository.create({
      statementId,
      userId,
      threeMonthAvgIncome,
      totalInflow: transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0),
      totalOutflow: Math.abs(
        transactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0)
      ),
      netAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      spendBuckets: spendingCategories,
      riskFlags: riskFlags,
    });

    const savedInsight = await this.insightRepository.save(insight);

    // Audit log insight computation
    await this.auditService.log({
      userId,
      action: AuditAction.COMPUTE,
      resource: "insight",
      resourceId: savedInsight.id,
      details: {
        statementId,
        avgIncome: savedInsight.threeMonthAvgIncome,
        totalInflow: savedInsight.totalInflow,
        totalOutflow: savedInsight.totalOutflow,
        netAmount: savedInsight.netAmount,
      },
    });

    return savedInsight;
  }

  private calculateThreeMonthAvgIncome(transactions: Transaction[]): number {
    const incomeTransactions = transactions.filter((t) => t.amount > 0);
    if (incomeTransactions.length === 0) return 0;

    const monthlyIncome = new Map<string, number>();
    for (const t of incomeTransactions) {
      const monthKey = t.transactionDate.toISOString().substring(0, 7);
      monthlyIncome.set(
        monthKey,
        (monthlyIncome.get(monthKey) || 0) + t.amount
      );
    }

    const sortedMonths = Array.from(monthlyIncome.keys()).sort().reverse();
    const lastThreeMonths = sortedMonths.slice(0, 3);

    if (lastThreeMonths.length === 0) return 0;

    const totalIncome = lastThreeMonths.reduce(
      (sum, month) => sum + monthlyIncome.get(month),
      0
    );
    return Math.round(totalIncome / lastThreeMonths.length);
  }

  private categorizeSpending(
    transactions: Transaction[]
  ): Record<string, number> {
    const categories: Record<string, number> = {};
    const outflowTransactions = transactions.filter((t) => t.amount < 0);

    for (const transaction of outflowTransactions) {
      const category = this.determineCategory(transaction.description);
      categories[category] =
        (categories[category] || 0) + Math.abs(transaction.amount);
    }

    return categories;
  }

  private determineCategory(description: string): string {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes("grocery") ||
      lowerDesc.includes("restaurant") ||
      lowerDesc.includes("food")
    ) {
      return "Food & Dining";
    } else if (
      lowerDesc.includes("gas") ||
      lowerDesc.includes("fuel") ||
      lowerDesc.includes("uber") ||
      lowerDesc.includes("lyft")
    ) {
      return "Transportation";
    } else if (
      lowerDesc.includes("amazon") ||
      lowerDesc.includes("online") ||
      lowerDesc.includes("shopping")
    ) {
      return "Shopping";
    } else if (
      lowerDesc.includes("rent") ||
      lowerDesc.includes("mortgage") ||
      lowerDesc.includes("utilities")
    ) {
      return "Housing";
    } else if (
      lowerDesc.includes("netflix") ||
      lowerDesc.includes("spotify") ||
      lowerDesc.includes("entertainment")
    ) {
      return "Entertainment";
    } else {
      return "Other";
    }
  }

  private identifyRiskFlags(transactions: Transaction[]): string[] {
    const flags: string[] = [];
    const totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalOutflow = Math.abs(
      transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    if (totalOutflow > totalIncome * 0.8) {
      flags.push("High spending relative to income");
    }

    const smallTransactions = transactions.filter(
      (t) => t.amount < 0 && Math.abs(t.amount) < 50
    );
    if (smallTransactions.length > 10) {
      flags.push("Frequent small transactions (potential impulse spending)");
    }

    let negativeBalanceCount = 0;
    let currentBalance = 0;
    for (const t of transactions.sort(
      (a, b) => a.transactionDate.getTime() - b.transactionDate.getTime()
    )) {
      currentBalance += t.amount;
      if (currentBalance < 0) negativeBalanceCount++;
    }

    if (negativeBalanceCount > 2) {
      flags.push("Multiple negative balance occurrences");
    }

    return flags;
  }

  async getInsight(insightId: number, userId: number): Promise<Insight> {
    const insight = await this.insightRepository.findOne({
      where: { id: insightId, userId },
    });

    if (!insight) {
      throw new NotFoundException("Insight not found");
    }

    return insight;
  }

  async getUserInsights(userId: number): Promise<Insight[]> {
    return this.insightRepository.find({
      where: { userId },
      order: { generatedAt: "DESC" },
    });
  }
}
