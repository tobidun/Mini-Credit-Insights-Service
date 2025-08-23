import { Test, TestingModule } from "@nestjs/testing";
import { BureauController } from "./bureau.controller";
import { BureauService } from "./bureau.service";
import {
  BureauReport,
  BureauReportStatus,
} from "./entities/bureau-report.entity";

describe("BureauController", () => {
  let controller: BureauController;
  let bureauService: BureauService;

  const mockBureauService = {
    checkCredit: jest.fn(),
    getBureauReport: jest.fn(),
    getUserBureauReports: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    role: "user",
  };

  const mockRequest = {
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BureauController],
      providers: [
        {
          provide: BureauService,
          useValue: mockBureauService,
        },
      ],
    }).compile();

    controller = module.get<BureauController>(BureauController);
    bureauService = module.get<BureauService>(BureauService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("checkCredit", () => {
    const mockReport = {
      id: 1,
      userId: 1,
      creditScore: 750,
      riskBand: "Good",
      enquiries6m: 2,
      defaults: 0,
      openLoans: 1,
      tradeLines: 8,
      requestedAt: new Date(),
      status: BureauReportStatus.COMPLETED,
      errorMessage: null,
    } as BureauReport;

    it("should check credit successfully", async () => {
      mockBureauService.checkCredit.mockResolvedValue(mockReport);

      const result = await controller.checkCredit(mockRequest);

      expect(result).toEqual(mockReport);
      expect(bureauService.checkCredit).toHaveBeenCalledWith(mockUser.id);
    });

    it("should handle credit check errors", async () => {
      const error = new Error("Credit check failed");
      mockBureauService.checkCredit.mockRejectedValue(error);

      await expect(controller.checkCredit(mockRequest)).rejects.toThrow(
        "Credit check failed"
      );
    });
  });

  describe("getBureauReport", () => {
    const mockReport = {
      id: 1,
      userId: 1,
      creditScore: 750,
      riskBand: "Good",
      enquiries6m: 2,
      defaults: 0,
      openLoans: 1,
      tradeLines: 8,
      requestedAt: new Date(),
      status: BureauReportStatus.COMPLETED,
      errorMessage: null,
    } as BureauReport;

    it("should return bureau report by ID", async () => {
      mockBureauService.getBureauReport.mockResolvedValue(mockReport);

      const result = await controller.getBureauReport("1", mockRequest);

      expect(result).toEqual(mockReport);
      expect(bureauService.getBureauReport).toHaveBeenCalledWith(
        1,
        mockUser.id
      );
    });

    it("should handle report not found", async () => {
      const error = new Error("Report not found");
      mockBureauService.getBureauReport.mockRejectedValue(error);

      await expect(
        controller.getBureauReport("999", mockRequest)
      ).rejects.toThrow("Report not found");
    });

    it("should parse string ID to number", async () => {
      mockBureauService.getBureauReport.mockResolvedValue(mockReport);

      await controller.getBureauReport("123", mockRequest);

      expect(bureauService.getBureauReport).toHaveBeenCalledWith(
        123,
        mockUser.id
      );
    });
  });

  describe("getUserBureauReports", () => {
    const mockReports: BureauReport[] = [
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

    it("should return user bureau reports", async () => {
      mockBureauService.getUserBureauReports.mockResolvedValue(mockReports);

      const result = await controller.getUserBureauReports(mockRequest);

      expect(result).toEqual(mockReports);
      expect(bureauService.getUserBureauReports).toHaveBeenCalledWith(
        mockUser.id
      );
    });

    it("should handle service errors", async () => {
      const error = new Error("Failed to fetch reports");
      mockBureauService.getUserBureauReports.mockRejectedValue(error);

      await expect(
        controller.getUserBureauReports(mockRequest)
      ).rejects.toThrow("Failed to fetch reports");
    });
  });
});
