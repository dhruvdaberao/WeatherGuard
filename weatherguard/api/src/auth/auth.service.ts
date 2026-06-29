import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Role } from '../users/enums/role.enum';
import { Status } from '../users/enums/status.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateOAuthUser(profile: any) {
    const existingUsers = await this.usersService.findAll();
    const user = existingUsers.find(u => u.providerId === profile.providerId || u.email === profile.email);
    
    if (user) {
      if (!user.providerId) {
         // Link account if email matches but provider isn't set
      }
      return user;
    }

    // Determine Role
    let assignedRole = Role.USER;
    const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    
    if (superAdminEmail && profile.email === superAdminEmail) {
      assignedRole = Role.ADMIN;
    } else if (existingUsers.length === 0) {
      assignedRole = Role.ADMIN; // First user fallback
    }

    // Auto-create user
    const newUser = await this.usersService.create({
      name: profile.name,
      email: profile.email,
      provider: profile.provider,
      providerId: profile.providerId,
      avatar: profile.avatar,
      role: assignedRole,
      status: assignedRole === Role.ADMIN ? Status.APPROVED : Status.PENDING,
    });
    
    return newUser;
  }

  generateJwt(user: any) {
    const payload = { email: user.email, sub: user._id || user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}


