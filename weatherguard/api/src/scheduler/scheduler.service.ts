import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { WeatherService } from '../weather/weather.service';
import { TelegramService } from '../telegram/telegram.service';
import { Status } from '../users/enums/status.enum';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private usersService: UsersService,
    private weatherService: WeatherService,
    private telegramService: TelegramService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyWeatherAlerts() {
    this.logger.log('Starting hourly weather alerts check...');
    
    // Fetch users with connected telegram and approved status
    // Using findWithFilters or manual query on UsersService. For this we might need a custom method.
    // Let's assume we can fetch them via a method we will add: getActiveTelegramUsers
    const users = await this.usersService.getActiveTelegramUsers();
    
    let sentCount = 0;

    for (const user of users) {
      if (!user.city) continue;

      try {
        const weatherData = await this.weatherService.fetchWeather(user.city);
        if (!weatherData) continue;

        const matchedPrefs = this.weatherService.matchPreferences(weatherData, user.weatherPreferences || []);
        
        if (matchedPrefs.length === 0) continue;

        // If user explicitly toggled off automated scheduled alerts, skip routine cron scheduling
        if (user.autoAlertsEnabled === false) continue;

        // Anti-spam & custom schedule frequency logic:
        // Cooldown hours dynamically calculated based on user's alertsPerDay preference (defaults to 6 times daily / ~4 hours)
        const targetFrequency = user.alertsPerDay || 6;
        const cooldownHours = Math.max(1, (24 / targetFrequency) - 0.5);

        const prevTypes = user.lastAlertTypes || [];
        const hasNewAlerts = matchedPrefs.some(p => !prevTypes.includes(p));
        const hoursSinceLastAlert = user.lastAlertSentAt 
          ? (new Date().getTime() - new Date(user.lastAlertSentAt).getTime()) / (1000 * 60 * 60)
          : Infinity;

        if (hasNewAlerts || hoursSinceLastAlert >= cooldownHours) {
          const alertType = hasNewAlerts ? 'URGENT' : 'SCHEDULED';
          const message = this.weatherService.generateAlertMessage(user.city, matchedPrefs, weatherData, alertType);
          await this.telegramService.sendMessage(user.telegramChatId, message);
          
          await this.usersService.updateAlertHistory(user._id.toString(), matchedPrefs);
          sentCount++;
          this.logger.log(`Sent weather alert to user ${user.email}`);
        }
      } catch (error) {
        this.logger.error(`Failed to process user ${user.email} for weather alerts: ${error.message}`);
      }
    }

    this.logger.log(`Finished hourly weather alerts check. Sent ${sentCount} alerts.`);
  }

  // Method for manual test alert from user
  async sendManualTestAlert(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new Error('User not found');
    if (!user.telegramConnected || !user.telegramChatId) throw new Error('Telegram not connected');
    if (!user.city) throw new Error('City not set');

    const weatherData = await this.weatherService.fetchWeather(user.city);
    if (!weatherData) throw new Error('Failed to fetch weather data for your city');

    const matchedPrefs = this.weatherService.matchPreferences(weatherData, user.weatherPreferences || []);
    const message = this.weatherService.generateAlertMessage(user.city, matchedPrefs, weatherData, 'TEST');
    
    await this.telegramService.sendMessage(user.telegramChatId, message);
    return { success: true, message: 'Test alert sent successfully' };
  }

  // Method for admin broadcast
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
