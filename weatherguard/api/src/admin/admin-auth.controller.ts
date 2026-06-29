import { Controller, Post, Body, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import type { Response } from 'express';

@Controller('admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('password') password: string, @Res({ passthrough: true }) res: Response) {
    const adminUser = this.authService.adminLogin(password);
    if (!adminUser) {
      throw new UnauthorizedException('Invalid admin password');
    }

    const jwt = this.authService.generateJwt(adminUser);
    
    res.cookie('Authentication', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { success: true, role: adminUser.role };
  }
}
