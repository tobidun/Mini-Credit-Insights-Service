import { Test, TestingModule } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  const mockDataSource = {
    query: jest.fn().mockResolvedValue([{ '1': 1 }]),
    options: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'credit_insights'
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("check", () => {
    it("should return health status", () => {
      const result = controller.check();

      expect(result).toEqual({
        status: "ok",
        timestamp: expect.any(String),
        service: "Credit Insights Service",
        version: "1.0.0",
      });
    });

    it("should return valid timestamp", () => {
      const result = controller.check();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.getTime()).toBeGreaterThan(0);
      expect(timestamp).toBeInstanceOf(Date);
    });

    it("should return correct service information", () => {
      const result = controller.check();

      expect(result.service).toBe("Credit Insights Service");
      expect(result.version).toBe("1.0.0");
      expect(result.status).toBe("ok");
    });
  });

  describe("getMetrics", () => {
    it("should return metrics with database status", async () => {
      const result = await controller.getMetrics();

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('memory');
      expect(result).toHaveProperty('process');
      expect(result).toHaveProperty('system');
      expect(result).toHaveProperty('database');
      expect(result).toHaveProperty('performance');
      
      expect(result.database.status).toBe('connected');
      expect(result.database.type).toBe('mysql');
    });

    it("should handle database connection failure", async () => {
      mockDataSource.query.mockRejectedValueOnce(new Error('Connection failed'));
      
      const result = await controller.getMetrics();
      
      expect(result.database.status).toBe('disconnected');
    });
  });
});
