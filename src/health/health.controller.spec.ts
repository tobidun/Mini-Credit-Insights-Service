import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
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
});
