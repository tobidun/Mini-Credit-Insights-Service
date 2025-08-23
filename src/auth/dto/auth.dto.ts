import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Username or email" })
  @IsString()
  username: string;

  @ApiProperty({ description: "Password" })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: "Username" })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: "Email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Password" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "User role",
    required: false,
    enum: ["user", "admin"],
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: "JWT access token" })
  access_token: string;

  @ApiProperty({ description: "User information" })
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}
