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
      if (user.role === Role.ADMIN) {
        // Strip legacy admin privileges from OAuth users
        const userId = (user as any)._id ? (user as any)._id.toString() : (user as any).id;
        await this.usersService.updateRole(userId, Role.USER);
        user.role = Role.USER;
      }
      return user;
    }

    // All OAuth users default to USER and PENDING
    const newUser = await this.usersService.create({
      name: profile.name,
      email: profile.email,
      provider: profile.provider,
      providerId: profile.providerId,
      avatar: profile.avatar,
      role: Role.USER,
      status: Status.PENDING,
    });
    
    return newUser;
  }

  adminLogin(password: string) {
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin@123';
    if (!adminPassword || password !== adminPassword) {
      return null;
    }
    // Return a mock user object for JWT generation
    return {
      email: 'admin@weatherguard.local',
      id: 'admin_id',
      role: Role.ADMIN,
    };
  }

  generateJwt(user: any) {
    const payload = { email: user.email, sub: user._id || user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}


