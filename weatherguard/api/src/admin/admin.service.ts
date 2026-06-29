import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Status } from '../users/enums/status.enum';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  async getDashboardStats() {
    const [totalUsers, pendingUsers, approvedUsers, rejectedUsers] = await Promise.all([
      this.usersService.count(),
      this.usersService.count({ status: Status.PENDING }),
      this.usersService.count({ status: Status.APPROVED }),
      this.usersService.count({ status: Status.REJECTED }),
    ]);

    return { totalUsers, pendingUsers, approvedUsers, rejectedUsers };
  }

  async getUsers(status?: Status, search?: string, limit: number = 10, page: number = 1) {
    return this.usersService.findWithFilters(status, search, limit, page);
  }

  async approveUser(id: string) {
    return this.usersService.updateStatus(id, Status.APPROVED);
  }

  async rejectUser(id: string) {
    return this.usersService.updateStatus(id, Status.REJECTED);
  }
}

