import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BureauController } from './bureau.controller';
import { BureauService } from './bureau.service';
import { BureauReport } from './entities/bureau-report.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BureauReport]),
    AuditModule,
  ],
  controllers: [BureauController],
  providers: [BureauService],
  exports: [BureauService],
})
export class BureauModule {} 