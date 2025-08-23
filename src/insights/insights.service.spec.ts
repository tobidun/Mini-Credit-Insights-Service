import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InsightsService } from "./insights.service";
import { Insight } from "./entities/insight.entity";
import { Statement } from "../statements/entities/statement.entity";
import { Transaction } from "../statements/entities/transaction.entity";
import { User } from "../users/entities/user.entity";
import { AuditService } from "../audit/audit.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("InsightsService", () => {
  let service: InsightsService;
  let insightRepository: Repository<Insight>;
  let statementRepository: Repository<Statement>;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;
  let auditService: AuditService;

  const mockInsightRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
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
    auditService = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("computeInsights", () => {
    it("should compute insights for a valid statement", async () => {
      const mockStatement = {
        id: 1,
        userId: 1,
        transactions: [
          {
            id: 1,
            amount: 5000,
            description: "Salary",
            transactionDate: new Date("2024-01-15"),
          },
          {
            id: 2,
            amount: -100,
            description: "Grocery shopping",
            transactionDate: new Date("2024-01-16"),
          },
        ],
      };

      const mockInsight = {
        id: 1,
        statementId: 1,
        userId: 1,
        threeMonthAvgIncome: 5000,
        totalInflow: 5000,
        totalOutflow: 100,
        netAmount: 4900,
        spendBuckets: { "Food & Dining": 100 },
        riskFlags: [],
      };

      mockStatementRepository.findOne.mockResolvedValue(mockStatement);
      mockInsightRepository.findOne.mockResolvedValue(null);
      mockInsightRepository.create.mockReturnValue(mockInsight);
      mockInsightRepository.save.mockResolvedValue(mockInsight);

      const result = await service.computeInsights(1, 1);

      expect(result).toEqual(mockInsight);
      expect(mockInsightRepository.create).toHaveBeenCalledWith({
        statementId: 1,
        userId: 1,
        threeMonthAvgIncome: 5000,
        totalInflow: 5000,
        totalOutflow: 100,
        netAmount: 4900,
        spendBuckets: { "Food & Dining": 100 },
        riskFlags: [],
      });
    });

    it("should return existing insight if already computed", async () => {
      const mockInsight = { id: 1, statementId: 1, userId: 1 };
      mockInsightRepository.findOne.mockResolvedValue(mockInsight);

      const result = await service.computeInsights(1, 1);

      expect(result).toEqual(mockInsight);
      expect(mockInsightRepository.create).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException if statement not found", async () => {
      mockStatementRepository.findOne.mockResolvedValue(null);

      await expect(service.computeInsights(999, 1)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("income detection", () => {
    it("should calculate three-month average income correctly", async () => {
      const transactions = [
        { amount: 5000, transactionDate: new Date("2024-01-15") },
        { amount: 5000, transactionDate: new Date("2024-02-15") },
        { amount: 5000, transactionDate: new Date("2024-03-15") },
        { amount: 6000, transactionDate: new Date("2024-04-15") },
      ] as any;

      const result = await service["calculateThreeMonthAvgIncome"](
        transactions
      );
      expect(result).toBe(5333); // Should average last 3 months (5000, 5000, 6000)
    });

    it("should return 0 for no income transactions", async () => {
      const transactions = [
        { amount: -100, transactionDate: new Date("2024-01-15") },
        { amount: -200, transactionDate: new Date("2024-01-16") },
      ] as any;

      const result = await service["calculateThreeMonthAvgIncome"](
        transactions
      );
      expect(result).toBe(0);
    });

    it("should handle single month income", async () => {
      const transactions = [
        { amount: 5000, transactionDate: new Date("2024-01-15") },
      ] as any;

      const result = await service["calculateThreeMonthAvgIncome"](
        transactions
      );
      expect(result).toBe(5000);
    });
  });

  describe("spend bucket categorization", () => {
    it("should categorize food transactions correctly", async () => {
      const transactions = [
        { amount: -100, description: "Grocery shopping at Walmart" },
        { amount: -50, description: "Restaurant dinner" },
        { amount: -25, description: "Coffee shop" },
      ] as any;

      const result = await service["categorizeSpending"](transactions);
      expect(result["Food & Dining"]).toBe(150);
    });

    it("should categorize transportation transactions correctly", async () => {
      const transactions = [
        { amount: -60, description: "Gas station" },
        { amount: -30, description: "Uber ride" },
        { amount: -45, description: "Fuel purchase" },
      ] as any;

      const result = await service["categorizeSpending"](transactions);
      expect(result["Transportation"]).toBe(135);
    });

    it("should categorize shopping transactions correctly", async () => {
      const transactions = [
        { amount: -200, description: "Amazon purchase" },
        { amount: -150, description: "Online shopping" },
      ] as any;

      const result = await service["categorizeSpending"](transactions);
      expect(result["Shopping"]).toBe(350);
    });

    it("should categorize housing transactions correctly", async () => {
      const transactions = [
        { amount: -1200, description: "Rent payment" },
        { amount: -200, description: "Utilities bill" },
      ] as any;

      const result = await service["categorizeSpending"](transactions);
      expect(result["Housing"]).toBe(1400);
    });

    it("should categorize entertainment transactions correctly", async () => {
      const transactions = [
        { amount: -15, description: "Netflix subscription" },
        { amount: -10, description: "Spotify premium" },
      ] as any;

      const result = await service["categorizeSpending"](transactions);
      expect(result["Entertainment"]).toBe(25);
    });

    it("should categorize unknown transactions as Other", async () => {
      const transactions = [
        { amount: -75, description: "Unknown transaction" },
      ] as any;

      const result = await service["categorizeSpending"](transactions);
      expect(result["Other"]).toBe(75);
    });

    it("should ignore positive transactions (income)", async () => {
      const transactions = [
        { amount: 5000, description: "Salary" },
        { amount: -100, description: "Grocery shopping" },
      ] as any;

      const result = await service["categorizeSpending"](transactions);
      expect(result["Food & Dining"]).toBe(100);
      expect(Object.keys(result)).toHaveLength(1);
    });
  });

  describe("risk flag identification", () => {
    it("should flag high spending relative to income", async () => {
      const transactions = [
        { amount: 1000, transactionDate: new Date("2024-01-15") }, // Income
        { amount: -900, transactionDate: new Date("2024-01-16") }, // Spending (90% of income)
      ] as any;

      const result = await service["identifyRiskFlags"](transactions);
      expect(result).toContain("High spending relative to income");
    });

    it("should flag frequent small transactions", async () => {
      const transactions = [
        { amount: 1000, transactionDate: new Date("2024-01-15") }, // Income
        { amount: -10, transactionDate: new Date("2024-01-16") },
        { amount: -15, transactionDate: new Date("2024-01-17") },
        { amount: -20, transactionDate: new Date("2024-01-18") },
        { amount: -25, transactionDate: new Date("2024-01-19") },
        { amount: -30, transactionDate: new Date("2024-01-20") },
        { amount: -35, transactionDate: new Date("2024-01-21") },
        { amount: -40, transactionDate: new Date("2024-01-22") },
        { amount: -45, transactionDate: new Date("2024-01-23") },
        { amount: -48, transactionDate: new Date("2024-01-24") },
        { amount: -49, transactionDate: new Date("2024-01-25") },
        { amount: -47, transactionDate: new Date("2024-01-26") }, // 11th small transaction
      ] as any;

      const result = await service["identifyRiskFlags"](transactions);
      expect(result).toContain(
        "Frequent small transactions (potential impulse spending)"
      );
    });

    it("should flag multiple negative balance occurrences", async () => {
      const transactions = [
        { amount: 1000, transactionDate: new Date("2024-01-15") }, // Start with 1000
        { amount: -1200, transactionDate: new Date("2024-01-16") }, // Goes to -200
        { amount: 500, transactionDate: new Date("2024-01-17") }, // Back to 300
        { amount: -400, transactionDate: new Date("2024-01-18") }, // Goes to -100
        { amount: 200, transactionDate: new Date("2024-01-19") }, // Back to 100
        { amount: -200, transactionDate: new Date("2024-01-20") }, // Goes to -100
      ] as any;

      const result = await service["identifyRiskFlags"](transactions);
      expect(result).toContain("Multiple negative balance occurrences");
    });

    it("should not flag when spending is reasonable", async () => {
      const transactions = [
        { amount: 1000, transactionDate: new Date("2024-01-15") }, // Income
        { amount: -300, transactionDate: new Date("2024-01-16") }, // Spending (30% of income)
      ] as any;

      const result = await service["identifyRiskFlags"](transactions);
      expect(result).toHaveLength(0);
    });
  });

  describe("getInsight", () => {
    it("should return insight for valid ID and user", async () => {
      const mockInsight = { id: 1, statementId: 1, userId: 1 };
      mockInsightRepository.findOne.mockResolvedValue(mockInsight);

      const result = await service.getInsight(1, 1);
      expect(result).toEqual(mockInsight);
    });

    it("should throw NotFoundException for non-existent insight", async () => {
      mockInsightRepository.findOne.mockResolvedValue(null);

      await expect(service.getInsight(999, 1)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("getUserInsights", () => {
    it("should return all insights for a user", async () => {
      const mockInsights = [
        { id: 1, statementId: 1, userId: 1 },
        { id: 2, statementId: 2, userId: 1 },
      ];
      mockInsightRepository.find.mockResolvedValue(mockInsights);

      const result = await service.getUserInsights(1);
      expect(result).toEqual(mockInsights);
      expect(mockInsightRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { generatedAt: "DESC" },
      });
    });
  });
});
