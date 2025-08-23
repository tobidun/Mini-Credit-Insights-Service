import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Get,
  Param,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { StatementsService } from "./statements.service";

@ApiTags("Statements")
@Controller("statements")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatementsController {
  constructor(private readonly statementsService: StatementsService) {}

  @Get()
  @ApiOperation({ summary: "Get all statements for the authenticated user" })
  async getUserStatements(@Request() req) {
    return this.statementsService.getUserStatements(req.user.id);
  }

  @Post("upload")
  @ApiOperation({ summary: "Upload CSV bank statement" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async uploadStatement(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return this.statementsService.uploadStatement(file, req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get statement details" })
  async getStatement(@Param("id") id: string, @Request() req) {
    return this.statementsService.getStatement(parseInt(id), req.user.id);
  }
}
