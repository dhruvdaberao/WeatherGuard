import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { WeatherModule } from '../weather/weather.module';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [WeatherModule, UsersModule, TelegramModule],
  providers: [SchedulerService]
})
export class SchedulerModule {}
