import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "../../users/entities/user.entity";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async seed() {
    try {
      // Check if admin already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { username: "admin" },
      });

      if (existingAdmin) {
        console.log("Admin user already exists, skipping seeding");
        return;
      }

      // Create default admin user
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash("admin123", saltRounds);

      const adminUser = this.userRepository.create({
        username: "admin",
        email: "admin@creditinsights.com",
        passwordHash,
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(adminUser);
      console.log("✅ Default admin user created successfully");
      console.log("📧 Username: admin");
      console.log("🔑 Password: admin123");
      console.log("⚠️  Please change these credentials after first login!");
    } catch (error) {
      console.error("❌ Error seeding admin user:", error);
    }
  }
}
