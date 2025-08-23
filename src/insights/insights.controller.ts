import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  Body,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { InsightsService } from "./insights.service";

@ApiTags("Insights")
@Controller("insights")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post("run")
  @ApiOperation({ summary: "Compute insights for a statement" })
  async runInsights(@Request() req, @Body() body: any) {
    console.log("Request body:", body);
    console.log("Request user:", req.user);
    const { statementId } = body;
    console.log("Statement ID:", statementId);
    return this.insightsService.computeInsights(statementId, req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve computed insights" })
  async getInsight(@Param("id") id: string, @Request() req) {
    return this.insightsService.getInsight(parseInt(id), req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get user insights" })
  async getUserInsights(@Request() req) {
    return this.insightsService.getUserInsights(req.user.id);
  }
}
