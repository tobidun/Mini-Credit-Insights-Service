import { Test, TestingModule } from "@nestjs/testing";
import { StatementsController } from "./statements.controller";
import { StatementsService } from "./statements.service";
import { StatementUploadResponseDto } from "./dto/statement.dto";

describe("StatementsController", () => {
  let controller: StatementsController;
  let statementsService: StatementsService;

  const mockStatementsService = {
    uploadStatement: jest.fn(),
    getStatement: jest.fn(),
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
      controllers: [StatementsController],
      providers: [
        {
          provide: StatementsService,
          useValue: mockStatementsService,
        },
      ],
    }).compile();

    controller = module.get<StatementsController>(StatementsController);
    statementsService = module.get<StatementsService>(StatementsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("uploadStatement", () => {
    const mockFile = {
      originalname: "test.csv",
      path: "/tmp/test.csv",
      buffer: Buffer.from("test"),
    } as Express.Multer.File;

    const mockResponse: StatementUploadResponseDto = {
      id: 1,
      status: "completed",
      totalTransactions: 10,
      parsingSuccessRate: 95,
    };

    it("should upload CSV statement successfully", async () => {
      mockStatementsService.uploadStatement.mockResolvedValue(mockResponse);

      const result = await controller.uploadStatement(mockFile, mockRequest);

      expect(result).toEqual(mockResponse);
      expect(statementsService.uploadStatement).toHaveBeenCalledWith(
        mockFile,
        mockUser.id
      );
    });

    it("should handle upload errors", async () => {
      const error = new Error("Upload failed");
      mockStatementsService.uploadStatement.mockRejectedValue(error);

      await expect(
        controller.uploadStatement(mockFile, mockRequest)
      ).rejects.toThrow("Upload failed");
    });
  });

  describe("getStatement", () => {
    const mockStatement = {
      id: 1,
      filename: "test.csv",
      uploadDate: new Date(),
      status: "completed",
      totalTransactions: 10,
      parsingSuccessRate: 95,
    };

    it("should return statement details", async () => {
      mockStatementsService.getStatement.mockResolvedValue(mockStatement);

      const result = await controller.getStatement("1", mockRequest);

      expect(result).toEqual(mockStatement);
      expect(statementsService.getStatement).toHaveBeenCalledWith(
        1,
        mockUser.id
      );
    });

    it("should handle statement not found", async () => {
      const error = new Error("Statement not found");
      mockStatementsService.getStatement.mockRejectedValue(error);

      await expect(controller.getStatement("999", mockRequest)).rejects.toThrow(
        "Statement not found"
      );
    });

    it("should parse string ID to number", async () => {
      mockStatementsService.getStatement.mockResolvedValue(mockStatement);

      await controller.getStatement("123", mockRequest);

      expect(statementsService.getStatement).toHaveBeenCalledWith(
        123,
        mockUser.id
      );
    });
  });
});
