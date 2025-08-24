import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminSeeder } from "./seeders/admin-seeder";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminSeeder],
  exports: [AdminSeeder],
})
export class DatabaseSeederModule {}
