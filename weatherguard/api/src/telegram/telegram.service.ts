import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const TelegramBot = require('node-telegram-bot-api');
const BotConstructor = TelegramBot.default || TelegramBot.TelegramBot || TelegramBot;
import { User, UserDocument } from '../users/schemas/user.schema';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot: any;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private weatherService: WeatherService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      // Remove polling for Vercel deployment
      this.bot = new BotConstructor(token, { polling: false });
    } else {
      this.logger.warn('TELEGRAM_BOT_TOKEN not provided. Bot is disabled.');
    }
  }

  onModuleInit() {
    if (!this.bot) return;
    this.logger.log('Telegram Service initialized (Webhook mode).');
  }

  async setWebhook(url: string) {
    if (!this.bot) return;
    await this.bot.setWebHook(url);
    this.logger.log(`Webhook set to ${url}`);
  }

  async getWebhookInfo() {
    if (!this.bot) return { error: 'Bot not initialized' };
    try {
      return await this.bot.getWebHookInfo();
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async handleWebhookUpdate(update: any) {
    if (!this.bot) return;
    
    // Process incoming message
    const msg = update.message;
    if (!msg || !msg.text) return;

    const chatId = msg.chat.id;
    const text = msg.text;

    const parts = text.trim().split(/\s+/);
    if (parts[0].startsWith('/start') && parts.length > 1) {
      const token = parts[1].split('@')[0].trim();
      await this.processStartToken(chatId, token);
      return;
    }

    if (text === '/start' || text.startsWith('/start@')) {
      const existingConnectedUser = await this.userModel.findOne({
        telegramChatId: chatId.toString(),
        telegramConnected: true,
      });

      if (existingConnectedUser) {
        await this.sendMessage(
          chatId.toString(),
          `👋 *Welcome back, ${existingConnectedUser.name}!*\n\nYour account is already connected and active. Simply send any message (like \`hi\`, \`status\`, or \`weather\`) into this chat at any time to receive your instant live weather report!`
        );
      } else {
        await this.sendMessage(
          chatId.toString(),
          '👋 *Welcome to WeatherGuard!*\n\nTo connect your Telegram account and receive interactive on-demand reports + automated alerts:\n\n1️⃣ Open your **WeatherGuard Web Dashboard**\n2️⃣ Click **Copy Code** under Step 1\n3️⃣ Paste the copied command (`/start WG_XXXXXX`) right here in this chat and hit Send!'
        );
      }
      return;
    }

    // Handle interactive on-demand weather status requests ("hi", "status", "/weather", etc.)
    const existingConnectedUser = await this.userModel.findOne({
      telegramChatId: chatId.toString(),
      telegramConnected: true,
    });

    if (existingConnectedUser) {
      const city = existingConnectedUser.city || 'Pune';
      this.logger.log(`On-demand weather request from ${existingConnectedUser.email} (${city})`);
      const weatherData = await this.weatherService.fetchWeather(city);
      if (weatherData) {
        const matchedPrefs = this.weatherService.matchPreferences(weatherData, existingConnectedUser.weatherPreferences || []);
        const message = this.weatherService.generateAlertMessage(city, matchedPrefs, weatherData, 'ON_DEMAND');
        await this.sendMessage(chatId.toString(), message);
      } else {
        await this.sendMessage(
          chatId.toString(),
          `⚠️ *WeatherGuard Notice*\n\nCould not retrieve live telemetry for **${city}**. Please verify your configured city name in the web dashboard preferences.`
        );
      }
    } else {
      await this.sendMessage(
        chatId.toString(),
        '👋 *Welcome to WeatherGuard!*\n\nYour Telegram account is not linked yet. To connect:\n\n1️⃣ Open your **WeatherGuard Web Dashboard**\n2️⃣ Click **Copy Code** under Step 1\n3️⃣ Paste the copied command (`/start WG_XXXXXX`) in this chat!'
      );
    }
  }

  private async processStartToken(chatId: number, token: string) {
    try {
      const cleanToken = token.trim().toUpperCase();
      const user = await this.userModel.findOne({ 
        telegramConnectionToken: { $regex: new RegExp(`^${cleanToken}$`, 'i') } 
      });

      if (!user) {
        const existingConnectedUser = await this.userModel.findOne({
          telegramChatId: chatId.toString(),
          telegramConnected: true,
        });

        if (existingConnectedUser) {
          await this.bot.sendMessage(
            chatId,
            `Your Telegram account (${existingConnectedUser.name}) is already connected and active! You are all set to receive automated weather alerts.`
          );
          return;
        }

        await this.bot.sendMessage(
          chatId,
          'Invalid connection token. Please generate a new one from your dashboard.'
        );
        return;
      }

      if (user.telegramTokenExpires && user.telegramTokenExpires < new Date()) {
        await this.userModel.updateOne(
          { _id: user._id },
          { $unset: { telegramConnectionToken: "", telegramTokenExpires: "" } }
        );
        await this.bot.sendMessage(
          chatId,
          'This connection token has expired (valid for 24 hours). Please generate a new one from your dashboard.'
        );
        return;
      }

      // Disconnect any other user account currently using this same Telegram Chat ID to prevent multi-account conflicts
      await this.userModel.updateMany(
        { telegramChatId: chatId.toString(), _id: { $ne: user._id } },
        { $unset: { telegramChatId: "", telegramConnectedAt: "" }, $set: { telegramConnected: false } }
      );

      await this.userModel.updateOne(
        { _id: user._id },
        { 
          $set: {
            telegramChatId: chatId.toString(),
            telegramConnected: true,
            telegramConnectedAt: new Date()
          },
          $unset: {
            telegramConnectionToken: "",
            telegramTokenExpires: ""
          }
        }
      );

      await this.bot.sendMessage(
        chatId,
        `🎉 *Welcome to WeatherGuard, ${user.name}!* \n\nYour Telegram account has been connected successfully. You will now receive automated weather alerts.`,
        { parse_mode: 'Markdown' }
      );
      
      this.logger.log(`User ${user.email} connected to Telegram with ChatID ${chatId}`);
    } catch (error) {
      this.logger.error('Error connecting Telegram account', error);
      await this.bot.sendMessage(chatId, 'An error occurred while connecting your account. Please try again.');
    }
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (!this.bot) {
      this.logger.warn('Cannot send message: Telegram bot is not initialized');
      return;
    }
    try {
      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      this.logger.warn(`Markdown parse failed for ${chatId}, retrying without formatting: ${error.message}`);
      try {
        await this.bot.sendMessage(chatId, message.replace(/\*/g, ''));
      } catch (err) {
        this.logger.error(`Failed to send telegram message to ${chatId}: ${err.message}`);
      }
    }
  }
}
