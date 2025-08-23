import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { AuditService } from "../audit/audit.service";
import { AuditAction } from "../audit/entities/audit-log.entity";
import axios, { AxiosResponse } from "axios";
import {
  BureauReport,
  BureauReportStatus,
} from "./entities/bureau-report.entity";

interface BureauResponse {
  score: number;
  risk_band: string;
  enquiries_6m: number;
  defaults: number;
  open_loans: number;
  trade_lines: number;
}

@Injectable()
export class BureauService {
  constructor(
    @InjectRepository(BureauReport)
    private bureauReportRepository: Repository<BureauReport>,
    private configService: ConfigService,
    private auditService: AuditService
  ) {}

  async checkCredit(userId: number): Promise<BureauReport> {
    const recentReport = await this.bureauReportRepository.findOne({
      where: {
        userId,
        status: BureauReportStatus.COMPLETED,
        requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    });

    if (recentReport) {
      return recentReport;
    }

    const report = this.bureauReportRepository.create({
      userId,
      status: BureauReportStatus.PENDING,
    });

    const savedReport = await this.bureauReportRepository.save(report);

    try {
      const bureauData = await this.callBureauAPIWithRetries();

      await this.bureauReportRepository.update(savedReport.id, {
        creditScore: bureauData.score,
        riskBand: bureauData.risk_band,
        enquiries6m: bureauData.enquiries_6m,
        defaults: bureauData.defaults,
        openLoans: bureauData.open_loans,
        tradeLines: bureauData.trade_lines,
        status: BureauReportStatus.COMPLETED,
      });

      const updatedReport = await this.bureauReportRepository.findOne({
        where: { id: savedReport.id },
      });

      // Audit log successful credit check
      await this.auditService.log({
        userId,
        action: AuditAction.COMPUTE,
        resource: "bureau_report",
        resourceId: updatedReport.id,
        details: {
          creditScore: bureauData.score,
          riskBand: bureauData.risk_band,
          status: "completed",
        },
      });

      return updatedReport;
    } catch (error) {
      await this.bureauReportRepository.update(savedReport.id, {
        status: BureauReportStatus.FAILED,
        errorMessage: error.message,
      });

      throw new BadRequestException(
        `Credit bureau check failed: ${error.message}`
      );
    }
  }

  private async callBureauAPIWithRetries(): Promise<BureauResponse> {
    const maxRetries =
      parseInt(this.configService.get("BUREAU_MAX_RETRIES")) || 3;
    const timeout = parseInt(this.configService.get("BUREAU_TIMEOUT")) || 10000;
    const apiUrl =
      this.configService.get("BUREAU_API_URL") ||
      "http://localhost:4000/v1/credit/check";
    const apiKey = this.configService.get("BUREAU_API_KEY") || "test-api-key";

    if (!apiUrl) {
      throw new Error("BUREAU_API_URL environment variable is not configured");
    }

    if (!apiKey) {
      throw new Error("BUREAU_API_KEY environment variable is not configured");
    }

    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response: AxiosResponse<BureauResponse> = await axios.post(
          apiUrl,
          {},
          {
            headers: {
              "X-API-KEY": apiKey,
              "Content-Type": "application/json",
            },
            timeout,
          }
        );

        return response.data;
      } catch (error) {
        lastError = error;

        if (
          error.response?.status >= 400 &&
          error.response?.status < 500 &&
          error.response?.status !== 429
        ) {
          throw new Error(
            `Bureau API error: ${error.response?.status} - ${
              error.response?.data?.message || "Unknown error"
            }`
          );
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(
      `Bureau API failed after ${maxRetries} attempts: ${lastError.message}`
    );
  }

  async getBureauReport(
    reportId: number,
    userId: number
  ): Promise<BureauReport> {
    const report = await this.bureauReportRepository.findOne({
      where: { id: reportId, userId },
    });

    if (!report) {
      throw new BadRequestException("Bureau report not found");
    }

    return report;
  }

  async getUserBureauReports(userId: number): Promise<BureauReport[]> {
    return this.bureauReportRepository.find({
      where: { userId },
      order: { requestedAt: "DESC" },
    });
  }

  async getDebugConfig() {
    return {
      apiUrl: this.configService.get("BUREAU_API_URL") || "http://localhost:4000/v1/credit/check",
      apiKey: this.configService.get("BUREAU_API_KEY") || "test-api-key",
      maxRetries: this.configService.get("BUREAU_MAX_RETRIES") || 3,
      timeout: this.configService.get("BUREAU_TIMEOUT") || 10000,
    };
  }
}
