import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Status } from '../users/enums/status.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers(
    @Query('status') status?: Status,
    @Query('search') search?: string,
    @Query('telegram') telegram?: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1
  ) {
    return this.adminService.getUsers(status, search, telegram, limit, page);
  }

  @Get('users/pending')
  async getPendingUsers(
    @Query('search') search?: string,
    @Query('telegram') telegram?: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1
  ) {
    return this.adminService.getUsers(Status.PENDING, search, telegram, limit, page);
  }

  @Get('users/approved')
  async getApprovedUsers(
    @Query('search') search?: string,
    @Query('telegram') telegram?: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1
  ) {
    return this.adminService.getUsers(Status.APPROVED, search, telegram, limit, page);
  }

  @Get('users/rejected')
  async getRejectedUsers(
    @Query('search') search?: string,
    @Query('telegram') telegram?: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1
  ) {
    return this.adminService.getUsers(Status.REJECTED, search, telegram, limit, page);
  }

  @Patch('users/:id/approve')
  async approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(id);
  }

  @Patch('users/:id/reject')
  async rejectUser(@Param('id') id: string) {
    return this.adminService.rejectUser(id);
  }
}

