import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { StatementsController } from './statements.controller';
import { StatementsService } from './statements.service';
import { Statement } from './entities/statement.entity';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statement, Transaction, User]),
    MulterModule.register({
      dest: './uploads',
    }),
    AuditModule,
  ],
  controllers: [StatementsController],
  providers: [StatementsService],
  exports: [StatementsService],
})
export class StatementsModule {} 