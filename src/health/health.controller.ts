import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Credit Insights Service",
      version: "1.0.0",
    };
  }

  @Get("metrics")
  @ApiOperation({ summary: "Application metrics endpoint" })
  async getMetrics() {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    // Check database connection
    let dbStatus = "unknown";
    try {
      await this.dataSource.query("SELECT 1");
      dbStatus = "connected";
    } catch (error) {
      dbStatus = "disconnected";
    }

    return {
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime),
        formatted: this.formatUptime(uptime),
      },
      memory: {
        rss: this.formatBytes(memUsage.rss),
        heapTotal: this.formatBytes(memUsage.heapTotal),
        heapUsed: this.formatBytes(memUsage.heapUsed),
        external: this.formatBytes(memUsage.external),
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      system: {
        cpuUsage: process.cpuUsage(),
        resourceUsage: process.resourceUsage(),
      },
      database: {
        status: dbStatus,
        type: this.dataSource.options.type,
        database: this.dataSource.options.database,
        ...(this.dataSource.options.type === "mysql" && {
          host: (this.dataSource.options as any).host,
          port: (this.dataSource.options as any).port,
        }),
      },
      performance: {
        memoryUsagePercent: Math.round(
          (memUsage.heapUsed / memUsage.heapTotal) * 100
        ),
        uptimeHours: Math.round(uptime / 3600),
      },
    };
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
