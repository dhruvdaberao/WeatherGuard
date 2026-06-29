import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  async handleWebhook(@Body() update: any) {
    await this.telegramService.handleWebhookUpdate(update);
    return { ok: true };
  }

  @Post('register-webhook')
  async registerWebhook(@Req() req: any) {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    // Using CRON_SECRET as a generic admin/system secret to protect this endpoint
    if (authHeader !== `Bearer ${cronSecret}`) {
      throw new UnauthorizedException('Invalid secret');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://weatherguard.vercel.app';
    const webhookUrl = `${frontendUrl}/api/telegram/webhook`; // Assume backend is mapped to /api on the same domain
    
    await this.telegramService.setWebhook(webhookUrl);
    return { success: true, message: `Webhook registered to ${webhookUrl}` };
  }
}
