import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BureauService } from './bureau.service';

@ApiTags('Credit Bureau')
@Controller('bureau')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BureauController {
  constructor(private readonly bureauService: BureauService) {}

  @Post('check')
  @ApiOperation({ summary: 'Check credit with bureau API' })
  async checkCredit(@Request() req) {
    return this.bureauService.checkCredit(req.user.id);
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get bureau report by ID' })
  async getBureauReport(@Param('id') id: string, @Request() req) {
    return this.bureauService.getBureauReport(parseInt(id), req.user.id);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get user bureau reports' })
  async getUserBureauReports(@Request() req) {
    return this.bureauService.getUserBureauReports(req.user.id);
  }

  @Get('debug-config')
  @ApiOperation({ summary: 'Debug bureau configuration' })
  @UseGuards() // Temporarily remove auth for debugging
  async getDebugConfig() {
    return this.bureauService.getDebugConfig();
  }

  @Get('debug-config-public')
  @ApiOperation({ summary: 'Debug bureau configuration (public)' })
  async getDebugConfigPublic() {
    return this.bureauService.getDebugConfig();
  }
} 