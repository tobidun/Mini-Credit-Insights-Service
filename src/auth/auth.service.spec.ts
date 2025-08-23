import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException, ConflictException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User, UserRole } from "../users/entities/user.entity";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuditService } from "../audit/audit.service";

describe("AuthService", () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    const registerDto: RegisterDto = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "user",
    };

    it("should register a new user successfully", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        role: UserRole.USER,
      });
      mockUserRepository.save.mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        role: UserRole.USER,
      });
      mockJwtService.sign.mockReturnValue("jwt-token");

      const result = await service.register(registerDto);

      expect(result.access_token).toBe("jwt-token");
      expect(result.user.username).toBe("testuser");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user.role).toBe("user");
    });

    it("should throw ConflictException if user already exists", async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException("Username or email already exists")
      );
    });
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      username: "testuser",
      password: "password123",
    };

    it("should login user successfully with valid credentials", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        role: UserRole.USER,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(require("bcryptjs"), "compare").mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue("jwt-token");

      const result = await service.login(loginDto);

      expect(result.access_token).toBe("jwt-token");
      expect(result.user.username).toBe("testuser");
      expect(result.user.email).toBe("test@example.com");
    });

    it("should throw UnauthorizedException if user not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException("Invalid credentials")
      );
    });

    it("should throw UnauthorizedException if password is invalid", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        role: UserRole.USER,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(require("bcryptjs"), "compare").mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException("Invalid credentials")
      );
    });
  });

  describe("validateUser", () => {
    it("should return user if found", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser(1);

      expect(result).toEqual(mockUser);
    });
  });
});
