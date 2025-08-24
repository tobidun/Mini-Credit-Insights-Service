import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
} from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @ApiProperty({ description: "Username", minLength: 3 })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: "Email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Password", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}

export class UpdateUserDto {
  @ApiProperty({ description: "Username", minLength: 3, required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiProperty({ description: "Email address", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
