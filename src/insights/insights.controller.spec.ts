import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InsightsController } from "./insights.controller";
import { InsightsService } from "./insights.service";
import { Insight } from "./entities/insight.entity";
import { User } from "../users/entities/user.entity";

describe("InsightsController", () => {
  let controller: InsightsController;
  let insightsService: InsightsService;

  const mockInsightsService = {
    computeInsights: jest.fn(),
    getInsight: jest.fn(),
    getUserInsights: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsightsController],
      providers: [
        {
          provide: InsightsService,
          useValue: mockInsightsService,
        },
        {
          provide: getRepositoryToken(Insight),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<InsightsController>(InsightsController);
    insightsService = module.get<InsightsService>(InsightsService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("runInsights", () => {
    it("should compute insights successfully", async () => {
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

      const mockRequest = {
        body: { statementId: 1 },
        user: mockUser,
      };

      mockInsightsService.computeInsights.mockResolvedValue(mockInsight);

      const result = await controller.runInsights(mockRequest, mockRequest.body);

      expect(result).toEqual(mockInsight);
      expect(insightsService.computeInsights).toHaveBeenCalledWith(
        1,
        mockUser.id
      );
    });

    it("should handle errors when computing insights", async () => {
      const errorMessage = "Statement not found";
      const mockRequest = {
        body: { statementId: 999 },
        user: mockUser,
      };

      mockInsightsService.computeInsights.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(controller.runInsights(mockRequest, mockRequest.body)).rejects.toThrow(
        errorMessage
      );
      expect(insightsService.computeInsights).toHaveBeenCalledWith(
        999,
        mockUser.id
      );
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

      const mockRequest = {
        user: mockUser,
      };

      mockInsightsService.getInsight.mockResolvedValue(mockInsight);

      const result = await controller.getInsight("1", mockRequest);

      expect(result).toEqual(mockInsight);
      expect(insightsService.getInsight).toHaveBeenCalledWith(1, mockUser.id);
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

      const mockRequest = {
        user: mockUser,
      };

      mockInsightsService.getUserInsights.mockResolvedValue(mockInsights);

      const result = await controller.getUserInsights(mockRequest);

      expect(result).toEqual(mockInsights);
      expect(insightsService.getUserInsights).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
