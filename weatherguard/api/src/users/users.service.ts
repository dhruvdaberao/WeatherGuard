import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Status } from './enums/status.enum';
import { Role } from './enums/role.enum';
import { WeatherService } from '../weather/weather.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private weatherService: WeatherService,
    @Inject(forwardRef(() => TelegramService)) private telegramService: TelegramService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async count(filter: any = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  async getActiveTelegramUsers(): Promise<UserDocument[]> {
    return this.userModel.find({ status: Status.APPROVED, telegramConnected: true }).exec();
  }

  async findWithFilters(
    status?: Status,
    search?: string,
    telegram?: string,
    limit: number = 10,
    page: number = 1
  ): Promise<{ data: User[], total: number }> {
    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (telegram === 'connected') query.telegramConnected = true;
    if (telegram === 'unconnected') query.telegramConnected = { $ne: true };
    
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(query).exec()
    ]);
    
    return { data, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateStatus(id: string, status: Status): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: { status, updatedAt: new Date() } },
      { new: true }
    ).exec();
    
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: { role, updatedAt: new Date() } },
      { new: true }
    ).exec();
    
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updatePreferences(id: string, updatePreferencesDto: UpdatePreferencesDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updatePreferencesDto },
      { new: true }
    ).exec();
    
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async generateTelegramToken(id: string): Promise<{ token: string, botUsername: string }> {
    const token = 'WG_' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    await this.userModel.findByIdAndUpdate(
      id,
      { $set: { telegramConnectionToken: token, telegramTokenExpires: expires } }
    ).exec();

    try {
      const frontendUrl = process.env.FRONTEND_URL || 'https://weather-guard-two.vercel.app';
      await this.telegramService.setWebhook(`${frontendUrl}/api/telegram/webhook`);
    } catch (e) {
      // ignore webhook setting errors
    }

    return { token, botUsername: process.env.TELEGRAM_BOT_USERNAME || 'WeatherGuard_Bot' };
  }

  async disconnectTelegram(id: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $unset: { telegramChatId: "", telegramConnectedAt: "", telegramConnectionToken: "", telegramTokenExpires: "" }, $set: { telegramConnected: false } },
      { new: true }
    ).exec();
    
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updateAlertHistory(id: string, alertTypes: string[]): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      $set: {
        lastAlertSentAt: new Date(),
        lastAlertTypes: alertTypes
      }
    }).exec();
  }

  async sendManualTestAlert(id: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new Error('User not found');
    if (!user.telegramConnected || !user.telegramChatId) throw new Error('Telegram not connected');
    if (!user.city) throw new Error('City not set');

    const weatherData = await this.weatherService.fetchWeather(user.city);
    if (!weatherData) throw new Error('Failed to fetch weather data for your city');

    const matchedPrefs = this.weatherService.matchPreferences(weatherData, user.weatherPreferences || []);
    const message = this.weatherService.generateAlertMessage(user.city, matchedPrefs, weatherData);
    
    await this.telegramService.sendMessage(user.telegramChatId, `🧪 [TEST ALERT]\n\n${message}`);
    return { success: true, message: 'Test alert sent successfully' };
  }
}
