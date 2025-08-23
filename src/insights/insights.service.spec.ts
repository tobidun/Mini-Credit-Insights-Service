import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InsightsService } from "./insights.service";
import { Insight } from "./entities/insight.entity";
import {
  Statement,
  StatementStatus,
} from "../statements/entities/statement.entity";
import { Transaction } from "../statements/entities/transaction.entity";
import { User } from "../users/entities/user.entity";
import { NotFoundException } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";

describe("InsightsService", () => {
  let service: InsightsService;
  let insightRepository: Repository<Insight>;
  let statementRepository: Repository<Statement>;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;

  const mockInsightRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockStatementRepository = {
    findOne: jest.fn(),
  };

  const mockTransactionRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
        {
          provide: getRepositoryToken(Insight),
          useValue: mockInsightRepository,
        },
        {
          provide: getRepositoryToken(Statement),
          useValue: mockStatementRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
    insightRepository = module.get<Repository<Insight>>(
      getRepositoryToken(Insight)
    );
    statementRepository = module.get<Repository<Statement>>(
      getRepositoryToken(Statement)
    );
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction)
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("computeInsights", () => {
    const mockStatement = {
      id: 1,
      userId: 1,
      status: StatementStatus.COMPLETED,
      parsingSuccessRate: 95,
      transactions: [
        {
          amount: 5000,
          transactionDate: new Date("2024-01-01"),
          description: "Salary",
        },
        {
          amount: -200,
          transactionDate: new Date("2024-01-02"),
          description: "Grocery Store",
        },
        {
          amount: 5000,
          transactionDate: new Date("2024-02-01"),
          description: "Salary",
        },
        {
          amount: -150,
          transactionDate: new Date("2024-02-02"),
          description: "Gas Station",
        },
        {
          amount: 6000,
          transactionDate: new Date("2024-03-01"),
          description: "Salary",
        },
        {
          amount: -100,
          transactionDate: new Date("2024-03-02"),
          description: "Online Shopping",
        },
      ],
    };

    it("should compute insights successfully", async () => {
      mockStatementRepository.findOne.mockResolvedValue(mockStatement);
      mockInsightRepository.findOne.mockResolvedValue(null);
      mockInsightRepository.create.mockReturnValue({
        id: 1,
        statementId: 1,
        userId: 1,
        threeMonthAvgIncome: 5333,
        totalInflow: 16000,
        totalOutflow: 450,
        netAmount: 15550,
        spendBuckets: {
          "Food & Dining": 200,
          Transportation: 150,
          Shopping: 100,
        },
        riskFlags: [],
      });
      mockInsightRepository.save.mockResolvedValue({
        id: 1,
        statementId: 1,
        userId: 1,
        threeMonthAvgIncome: 5333,
        totalInflow: 16000,
        totalOutflow: 450,
        netAmount: 15550,
        spendBuckets: {
          "Food & Dining": 200,
          Transportation: 150,
          Shopping: 100,
        },
        riskFlags: [],
      });

      const result = await service.computeInsights(1, 1);

      expect(result.threeMonthAvgIncome).toBe(5333);
      expect(result.totalInflow).toBe(16000);
      expect(result.totalOutflow).toBe(450);
      expect(result.netAmount).toBe(15550);
      
      // Verify audit logging was called
      expect(mockAuditService.log).toHaveBeenCalledWith({
        userId: 1,
        action: "compute",
        resource: "insight",
        resourceId: 1,
        details: {
          statementId: 1,
          avgIncome: 5333,
          totalInflow: 16000,
          totalOutflow: 450,
          netAmount: 15550,
        },
      });
    });

    it("should return existing insights if already computed", async () => {
      const existingInsight = {
        id: 1,
        statementId: 1,
        userId: 1,
        threeMonthAvgIncome: 5000,
        totalInflow: 15000,
        totalOutflow: 300,
        netAmount: 14700,
        spendBuckets: { Other: 300 },
        riskFlags: [],
      };

      mockStatementRepository.findOne.mockResolvedValue(mockStatement);
      mockInsightRepository.findOne.mockResolvedValue(existingInsight);

      const result = await service.computeInsights(1, 1);

      expect(result).toEqual(existingInsight);
    });

    it("should throw NotFoundException if statement not found", async () => {
      mockStatementRepository.findOne.mockResolvedValue(null);

      await expect(service.computeInsights(999, 1)).rejects.toThrow(
        new NotFoundException("Statement not found")
      );
    });
  });

  describe("calculateThreeMonthAvgIncome", () => {
    it("should calculate average income correctly", () => {
      const transactions = [
        { amount: 5000, transactionDate: new Date("2024-01-01") },
        { amount: 5000, transactionDate: new Date("2024-02-01") },
        { amount: 6000, transactionDate: new Date("2024-03-01") },
      ] as any;

      const result = service["calculateThreeMonthAvgIncome"](transactions);

      expect(result).toBe(5333);
    });

    it("should return 0 if no income transactions", () => {
      const transactions = [
        { amount: -100, transactionDate: new Date("2024-01-01") },
        { amount: -200, transactionDate: new Date("2024-01-02") },
      ] as any;

      const result = service["calculateThreeMonthAvgIncome"](transactions);

      expect(result).toBe(0);
    });
  });

  describe("categorizeSpending", () => {
    it("should categorize spending correctly", () => {
      const transactions = [
        { amount: -100, description: "Grocery Store" },
        { amount: -125, description: "Restaurant ABC" },
        { amount: -45, description: "Gas Station" },
        { amount: -200, description: "Online Shopping" },
      ] as any;

      const result = service["categorizeSpending"](transactions);

      expect(result["Food & Dining"]).toBe(225);
      expect(result["Transportation"]).toBe(45);
      expect(result["Shopping"]).toBe(200);
    });
  });

  describe("determineCategory", () => {
    it("should categorize descriptions correctly", () => {
      expect(service["determineCategory"]("Grocery Store")).toBe(
        "Food & Dining"
      );
      expect(service["determineCategory"]("Restaurant ABC")).toBe(
        "Food & Dining"
      );
      expect(service["determineCategory"]("Gas Station")).toBe(
        "Transportation"
      );
      expect(service["determineCategory"]("Online Shopping")).toBe("Shopping");
      expect(service["determineCategory"]("Rent Payment")).toBe("Housing");
      expect(service["determineCategory"]("Netflix Subscription")).toBe(
        "Entertainment"
      );
      expect(service["determineCategory"]("Unknown Company")).toBe("Other");
    });
  });

  describe("identifyRiskFlags", () => {
    it("should identify high spending risk", () => {
      const transactions = [
        { amount: 1000, transactionDate: new Date("2024-01-01") },
        { amount: -950, transactionDate: new Date("2024-01-02") },
      ] as any;

      const result = service["identifyRiskFlags"](transactions);

      expect(result).toContain("High spending relative to income");
    });

    it("should identify frequent small transactions risk", () => {
      const transactions = [
        { amount: 2000, transactionDate: new Date("2024-01-01") },
        { amount: -5, transactionDate: new Date("2024-01-02") },
        { amount: -10, transactionDate: new Date("2024-01-03") },
        { amount: -15, transactionDate: new Date("2024-01-04") },
        { amount: -20, transactionDate: new Date("2024-01-05") },
        { amount: -25, transactionDate: new Date("2024-01-06") },
        { amount: -30, transactionDate: new Date("2024-01-07") },
        { amount: -35, transactionDate: new Date("2024-01-08") },
        { amount: -40, transactionDate: new Date("2024-01-09") },
        { amount: -45, transactionDate: new Date("2024-01-10") },
        { amount: -48, transactionDate: new Date("2024-01-11") },
        { amount: -49, transactionDate: new Date("2024-01-12") },
      ] as any;

      const result = service["identifyRiskFlags"](transactions);

      expect(result).toContain(
        "Frequent small transactions (potential impulse spending)"
      );
    });

    it("should identify negative balance risk", () => {
      const transactions = [
        { amount: 1000, transactionDate: new Date("2024-01-01") },
        { amount: -1200, transactionDate: new Date("2024-01-02") },
        { amount: 500, transactionDate: new Date("2024-01-03") },
        { amount: -800, transactionDate: new Date("2024-01-04") },
        { amount: -400, transactionDate: new Date("2024-01-05") },
      ] as any;

      const result = service["identifyRiskFlags"](transactions);

      expect(result).toContain("Multiple negative balance occurrences");
    });
  });

  describe("getInsight", () => {
    it("should return insight if found", async () => {
      const mockInsight = {
        id: 1,
        statementId: 1,
        userId: 1,
        threeMonthAvgIncome: 5000,
        totalInflow: 15000,
        totalOutflow: 300,
        netAmount: 14700,
        spendBuckets: { Other: 300 },
        riskFlags: [],
      };

      mockInsightRepository.findOne.mockResolvedValue(mockInsight);

      const result = await service.getInsight(1, 1);

      expect(result).toEqual(mockInsight);
    });

    it("should throw NotFoundException if insight not found", async () => {
      mockInsightRepository.findOne.mockResolvedValue(null);

      await expect(service.getInsight(999, 1)).rejects.toThrow(
        new NotFoundException("Insight not found")
      );
    });
  });

  describe("getUserInsights", () => {
    it("should return user insights", async () => {
      const mockInsights = [
        {
          id: 1,
          statementId: 1,
          userId: 1,
          threeMonthAvgIncome: 5000,
          totalInflow: 15000,
          totalOutflow: 300,
          netAmount: 14700,
          spendBuckets: { Other: 300 },
          riskFlags: [],
        },
      ];

      mockInsightRepository.find.mockResolvedValue(mockInsights);

      const result = await service.getUserInsights(1);

      expect(result).toEqual(mockInsights);
    });
  });
});
