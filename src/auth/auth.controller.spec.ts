import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, AuthResponseDto } from "./dto/auth.dto";
import { UserRole } from "../users/entities/user.entity";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    const registerDto: RegisterDto = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const mockResponse: AuthResponseDto = {
      access_token: "jwt-token",
      user: {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        role: UserRole.USER,
      },
    };

    it("should register a new user successfully", async () => {
      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it("should handle registration errors", async () => {
      const error = new Error("Registration failed");
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(
        "Registration failed"
      );
    });
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      username: "testuser",
      password: "password123",
    };

    const mockResponse: AuthResponseDto = {
      access_token: "jwt-token",
      user: {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        role: UserRole.USER,
      },
    };

    it("should login user successfully", async () => {
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it("should handle login errors", async () => {
      const error = new Error("Login failed");
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow("Login failed");
    });
  });
});
