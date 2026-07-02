import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';
import { EmailService } from '../email/email.service';
import { Status } from '../users/enums/status.enum';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private usersService: UsersService,
    private telegramService: TelegramService,
    private emailService: EmailService
  ) {}

  async getDashboardStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalUsers, pendingUsers, approvedUsers, rejectedUsers, telegramConnectedUsers, alertsSentToday] = await Promise.all([
      this.usersService.count(),
      this.usersService.count({ status: Status.PENDING }),
      this.usersService.count({ status: Status.APPROVED }),
      this.usersService.count({ status: Status.REJECTED }),
      this.usersService.count({ telegramConnected: true }),
      this.usersService.count({ lastAlertSentAt: { $gte: startOfDay } })
    ]);

    return { totalUsers, pendingUsers, approvedUsers, rejectedUsers, telegramConnectedUsers, alertsSentToday };
  }

  async getUsers(status?: Status, search?: string, telegram?: string, limit: number = 10, page: number = 1) {
    return this.usersService.findWithFilters(status, search, telegram, limit, page);
  }

  async approveUser(id: string) {
    const updatedUser = await this.usersService.updateStatus(id, Status.APPROVED);
    if (updatedUser && updatedUser.email) {
      this.emailService.sendApprovalEmail(updatedUser.email, updatedUser.name).catch((err) => {
        this.logger.error(`Failed background approval email dispatch for ${updatedUser.email}: ${err.message}`);
      });
    }
    return updatedUser;
  }

  async rejectUser(id: string) {
    return this.usersService.updateStatus(id, Status.REJECTED);
  }

  async broadcastTestAlert() {
    const users = await this.usersService.getActiveTelegramUsers();
    let sentCount = 0;
    
    for (const user of users) {
      try {
        await this.telegramService.sendMessage(user.telegramChatId, '📢 *WeatherGuard Broadcast*\n\nThis is a system test alert from the administrators. Everything is functioning correctly!');
        sentCount++;
      } catch (e) {
        this.logger.error(`Broadcast failed for ${user.email}: ${e.message}`);
      }
    }
    
    return { success: true, sentCount };
  }
}

