import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Statement } from "../statements/entities/statement.entity";
import { Insight } from "../insights/entities/insight.entity";
import { BureauReport } from "../bureau/entities/bureau-report.entity";
import { AdminUsersService } from "./admin-users.service";
import { AdminUsersController } from "./admin-users.controller";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Statement, Insight, BureauReport]),
    AuditModule,
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [TypeOrmModule, AdminUsersService],
})
export class UsersModule {}
