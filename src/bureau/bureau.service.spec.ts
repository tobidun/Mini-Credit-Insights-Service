import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { BureauService } from "./bureau.service";
import {
  BureauReport,
  BureauReportStatus,
} from "./entities/bureau-report.entity";
import { BadRequestException } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";

jest.mock("axios");
const mockAxios = require("axios");

describe("BureauService", () => {
  let service: BureauService;
  let bureauReportRepository: Repository<BureauReport>;
  let configService: ConfigService;

  const mockBureauReportRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BureauService,
        {
          provide: getRepositoryToken(BureauReport),
          useValue: mockBureauReportRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<BureauService>(BureauService);
    bureauReportRepository = module.get<Repository<BureauReport>>(
      getRepositoryToken(BureauReport)
    );
    configService = module.get<ConfigService>(ConfigService);

    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        BUREAU_API_URL: "http://localhost:3001/v1/credit/check",
        BUREAU_API_KEY: "test-api-key",
        BUREAU_TIMEOUT: "10000",
        BUREAU_MAX_RETRIES: "3",
      };
      return config[key];
    });

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("checkCredit", () => {
    const mockBureauResponse = {
      score: 750,
      risk_band: "Good",
      enquiries_6m: 2,
      defaults: 0,
      open_loans: 1,
      trade_lines: 8,
    };

    const mockReport = {
      id: 1,
      userId: 1,
      creditScore: null,
      riskBand: null,
      enquiries6m: null,
      defaults: null,
      openLoans: null,
      tradeLines: null,
      requestedAt: new Date(),
      status: BureauReportStatus.PENDING,
      errorMessage: null,
    };

    it("should return recent report if within 24 hours", async () => {
      const recentReport = {
        ...mockReport,
        status: BureauReportStatus.COMPLETED,
        requestedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        creditScore: 750,
        riskBand: "Good",
      };

      mockBureauReportRepository.findOne.mockResolvedValue(recentReport);

      const result = await service.checkCredit(1);

      expect(result).toEqual(recentReport);
      expect(mockBureauReportRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: 1,
          status: BureauReportStatus.COMPLETED,
          requestedAt: expect.any(Date),
        },
      });
    });

    it("should create new report and call bureau API successfully", async () => {
      mockBureauReportRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockReport);

      mockBureauReportRepository.create.mockReturnValue(mockReport);
      mockBureauReportRepository.save.mockResolvedValue(mockReport);

      mockAxios.post.mockResolvedValue({
        data: mockBureauResponse,
      });

      mockBureauReportRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.checkCredit(1);

      expect(result).toEqual(mockReport);
      expect(mockBureauReportRepository.create).toHaveBeenCalledWith({
        userId: 1,
        status: BureauReportStatus.PENDING,
      });
      expect(mockBureauReportRepository.save).toHaveBeenCalledWith(mockReport);
      expect(mockAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/v1/credit/check",
        {},
        {
          headers: {
            "X-API-KEY": "test-api-key",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
    });

    it("should handle API errors and update report status", async () => {
      mockBureauReportRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockReport);

      mockBureauReportRepository.create.mockReturnValue(mockReport);
      mockBureauReportRepository.save.mockResolvedValue(mockReport);

      mockAxios.post.mockRejectedValue(new Error("API Error"));

      mockBureauReportRepository.update.mockResolvedValue({ affected: 1 });

      await expect(service.checkCredit(1)).rejects.toThrow(
        new BadRequestException(
          "Credit bureau check failed: Bureau API failed after 3 attempts: API Error"
        )
      );

      expect(mockBureauReportRepository.update).toHaveBeenCalledWith(1, {
        status: BureauReportStatus.FAILED,
        errorMessage: "Bureau API failed after 3 attempts: API Error",
      });
    }, 15000);
  });

  describe("getBureauReport", () => {
    it("should be defined", () => {
      expect(service.getBureauReport).toBeDefined();
    });
  });

  describe("getUserBureauReports", () => {
    it("should return user bureau reports", async () => {
      const mockReports = [
        {
          id: 2,
          userId: 1,
          creditScore: 750,
          riskBand: "Good",
          enquiries6m: 2,
          defaults: 0,
          openLoans: 1,
          tradeLines: 8,
          requestedAt: new Date("2024-01-02"),
          status: BureauReportStatus.COMPLETED,
          errorMessage: null,
        } as BureauReport,
        {
          id: 1,
          userId: 1,
          creditScore: 700,
          riskBand: "Fair",
          enquiries6m: 3,
          defaults: 1,
          openLoans: 2,
          tradeLines: 6,
          requestedAt: new Date("2024-01-01"),
          status: BureauReportStatus.COMPLETED,
          errorMessage: null,
        } as BureauReport,
      ];

      mockBureauReportRepository.find.mockResolvedValue(mockReports);

      const result = await service.getUserBureauReports(1);

      expect(result).toEqual(mockReports);
      expect(mockBureauReportRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { requestedAt: "DESC" },
      });
    });
  });
});
