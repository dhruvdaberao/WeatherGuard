import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('cron')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get('weather')
  async runWeatherCron(@Req() req: any) {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    const isVercelCron = req.headers['x-vercel-cron'] === '1' || req.headers['user-agent']?.includes('vercel-cron');
    
    if (cronSecret && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
      throw new UnauthorizedException('Invalid cron secret');
    }

    await this.schedulerService.handleHourlyWeatherAlerts();
    return { success: true, message: 'Weather cron executed successfully' };
  }
}
