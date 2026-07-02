import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminAuthController } from './admin-auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TelegramModule } from '../telegram/telegram.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UsersModule, AuthModule, TelegramModule, EmailModule],
  providers: [AdminService],
  controllers: [AdminController, AdminAuthController]
})
export class AdminModule {}
