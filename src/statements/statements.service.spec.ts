import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StatementsService } from "./statements.service";
import { Statement, StatementStatus } from "./entities/statement.entity";
import { Transaction } from "./entities/transaction.entity";
import { User } from "../users/entities/user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";

describe("StatementsService", () => {
  let service: StatementsService;
  let statementRepository: Repository<Statement>;
  let transactionRepository: Repository<Transaction>;
  let userRepository: Repository<User>;

  const mockStatementRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  const mockTransactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
        StatementsService,
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

    service = module.get<StatementsService>(StatementsService);
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

  describe("uploadStatement", () => {
    const mockFile = {
      fieldname: "file",
      originalname: "test-statement.csv",
      encoding: "7bit",
      mimetype: "text/csv",
      size: 1024,
      destination: "./uploads/",
      filename: "test-statement.csv",
      path: "./uploads/test-statement.csv",
      buffer: Buffer.from("test"),
    } as Express.Multer.File;

    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
    };

    it("should upload statement successfully", async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockStatementRepository.create.mockReturnValue({
        id: 1,
        userId: 1,
        filename: "test-statement.csv",
        status: StatementStatus.PROCESSING,
      });
      mockStatementRepository.save.mockResolvedValue({
        id: 1,
        userId: 1,
        filename: "test-statement.csv",
        status: StatementStatus.PROCESSING,
      });

      jest.spyOn(service as any, "parseCSV").mockResolvedValue([
        {
          date: "2024-01-01",
          description: "Salary",
          amount: "5000",
          balance: "10000",
        },
      ]);

      mockTransactionRepository.save.mockResolvedValue([
        {
          id: 1,
          statementId: 1,
          description: "Salary",
          amount: 5000,
          transactionDate: new Date("2024-01-01"),
          balance: 10000,
        },
      ]);

      mockStatementRepository.update.mockResolvedValue({ affected: 1 });
      mockStatementRepository.findOne.mockResolvedValue({
        id: 1,
        userId: 1,
        filename: "test-statement.csv",
        status: StatementStatus.COMPLETED,
        totalTransactions: 1,
        parsingSuccessRate: 100,
      });

      const result = await service.uploadStatement(mockFile, 1);

      expect(result.status).toBe(StatementStatus.COMPLETED);
      expect(result.totalTransactions).toBe(1);
      expect(result.parsingSuccessRate).toBe(100);
    });

    it("should throw NotFoundException if user not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.uploadStatement(mockFile, 999)).rejects.toThrow(
        new NotFoundException("User not found")
      );
    });

    it("should handle CSV parsing errors", async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockStatementRepository.create.mockReturnValue({
        id: 1,
        userId: 1,
        filename: "test-statement.csv",
        status: StatementStatus.PROCESSING,
      });
      mockStatementRepository.save.mockResolvedValue({
        id: 1,
        userId: 1,
        filename: "test-statement.csv",
        status: StatementStatus.PROCESSING,
      });

      jest
        .spyOn(service as any, "parseCSV")
        .mockRejectedValue(new Error("CSV parsing failed"));
      mockStatementRepository.update.mockResolvedValue({ affected: 1 });

      await expect(service.uploadStatement(mockFile, 1)).rejects.toThrow(
        new BadRequestException("Failed to process CSV: CSV parsing failed")
      );
    });
  });

  describe("getStatement", () => {
    it("should return statement if found", async () => {
      const mockStatement = {
        id: 1,
        userId: 1,
        filename: "test-statement.csv",
        status: StatementStatus.COMPLETED,
        transactions: [
          {
            id: 1,
            description: "Salary",
            amount: 5000,
            transactionDate: new Date("2024-01-01"),
            balance: 10000,
          },
        ],
      };

      mockStatementRepository.findOne.mockResolvedValue(mockStatement);

      const result = await service.getStatement(1, 1);

      expect(result).toEqual(mockStatement);
    });

    it("should throw NotFoundException if statement not found", async () => {
      mockStatementRepository.findOne.mockResolvedValue(null);

      await expect(service.getStatement(999, 1)).rejects.toThrow(
        new NotFoundException("Statement not found")
      );
    });
  });

  describe("getUserStatements", () => {
    it("should return user statements", async () => {
      const mockStatements = [
        {
          id: 2,
          userId: 1,
          filename: "statement-2.csv",
          status: StatementStatus.COMPLETED,
          uploadDate: new Date("2024-01-02"),
        },
        {
          id: 1,
          userId: 1,
          filename: "statement-1.csv",
          status: StatementStatus.COMPLETED,
          uploadDate: new Date("2024-01-01"),
        },
      ];

      mockStatementRepository.find.mockResolvedValue(mockStatements);

      const result = await service.getUserStatements(1);

      expect(result).toEqual(mockStatements);
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(1);
    });
  });
});
