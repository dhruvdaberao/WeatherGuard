import { Controller, Post, Get, Body, Req, UnauthorizedException } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('status')
  async getStatus() {
    const info = await this.telegramService.getWebhookInfo();
    return { success: true, webhookInfo: info };
  }

  @Get('fix-webhook')
  async fixWebhook(@Req() req: any) {
    let host = req.headers['x-forwarded-host'] || req.headers.host || 'weather-guard-two.vercel.app';
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      host = 'weather-guard-two.vercel.app';
    }
    const webhookUrl = `https://${host}/api/telegram/webhook`;
    await this.telegramService.setWebhook(webhookUrl);
    const info = await this.telegramService.getWebhookInfo();
    return { success: true, message: `Webhook re-registered successfully to ${webhookUrl}`, telegramInfo: info };
  }

  @Post('webhook')
  async handleWebhook(@Body() update: any) {
    await this.telegramService.handleWebhookUpdate(update);
    return { ok: true };
  }

  @Post('register-webhook')
  async registerWebhook(@Req() req: any) {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      throw new UnauthorizedException('Invalid secret');
    }

    let host = req.headers['x-forwarded-host'] || req.headers.host || 'weather-guard-two.vercel.app';
    if (host.includes('localhost')) host = 'weather-guard-two.vercel.app';
    const webhookUrl = `https://${host}/api/telegram/webhook`;
    
    await this.telegramService.setWebhook(webhookUrl);
    return { success: true, message: `Webhook registered to ${webhookUrl}` };
  }
}
