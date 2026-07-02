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
    
    await this.bot.setMyCommands([
      { command: 'start', description: 'Connect your WeatherGuard account' },
      { command: 'status', description: 'View connection status & current conditions' },
      { command: 'test', description: 'Receive a test weather notification' },
      { command: 'help', description: 'Show available commands' },
      { command: 'disconnect', description: 'Disconnect your Telegram account' },
    ]).catch((err: any) => this.logger.warn('Failed to register Telegram bot commands: ' + err?.message));
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
          `👋 *Welcome back, ${existingConnectedUser.name}!*\n\nYour account is already connected and active. Simply send any message (like \`hi\`, \`status\`, or \`weather\`) into this chat at any time to receive your instant live weather report!\n\n💡 *Tip:* Send \`/help\` anytime for commands & options.`
        );
      } else {
        await this.sendMessage(
          chatId.toString(),
          '👋 *Welcome to WeatherGuard!*\n\nTo connect your Telegram account and receive interactive on-demand reports + automated alerts:\n\n1️⃣ Open your **WeatherGuard Web Dashboard**\n2️⃣ Click **Copy Code** under Step 1\n3️⃣ Paste the copied command (`/start WG_XXXXXX`) right here in this chat and hit Send!'
        );
      }
      return;
    }

    const cleanCmd = text.trim().toLowerCase();

    // Handle /help command
    if (cleanCmd === '/help' || cleanCmd === '/help@weatherguard_bot') {
      await this.sendMessage(
        chatId.toString(),
        `🤖 *WeatherGuard Command Directory*\n\nHere are all the commands you can use:\n\n• \`/start WG_XXXXXX\` — Connect your WeatherGuard account\n• \`/status\` — View connection status & current conditions\n• \`/test\` — Receive a test weather notification\n• \`/help\` — Show available commands\n• \`/disconnect\` — Disconnect your Telegram account\n\n💡 *Tip:* You can also type \`hi\`, \`hello\`, or \`weather\` anytime for an instant condition report!`
      );
      return;
    }

    const existingConnectedUser = await this.userModel.findOne({
      telegramChatId: chatId.toString(),
      telegramConnected: true,
    });

    // Handle /disconnect command
    if (cleanCmd === '/disconnect' || cleanCmd === '/disconnect@weatherguard_bot') {
      if (!existingConnectedUser) {
        await this.sendMessage(
          chatId.toString(),
          '⚠️ *Account Not Connected*\n\nYour Telegram account is not currently linked to any active WeatherGuard profile.'
        );
        return;
      }
      await this.userModel.updateOne(
        { _id: existingConnectedUser._id },
        { $unset: { telegramChatId: "", telegramConnectedAt: "" }, $set: { telegramConnected: false } }
      );
      await this.sendMessage(
        chatId.toString(),
        `🛑 *Telegram Account Disconnected*\n\nYour profile (**${existingConnectedUser.email}**) has been unlinked safely. Automated alerts are now paused for this chat.\n\nTo reconnect at any time, visit your Web Dashboard and copy a fresh code!`
      );
      this.logger.log(`User ${existingConnectedUser.email} disconnected via /disconnect command`);
      return;
    }

    // Handle /test command
    if (cleanCmd === '/test' || cleanCmd === '/test@weatherguard_bot') {
      if (!existingConnectedUser) {
        await this.sendMessage(
          chatId.toString(),
          '⚠️ *Account Not Connected*\n\nPlease link your account using `/start WG_XXXXXX` before requesting a test notification.'
        );
        return;
      }
      const city = existingConnectedUser.city || 'Pune';
      const weatherData = await this.weatherService.fetchWeather(city);
      const matchedPrefs = existingConnectedUser.weatherPreferences || [];
      const message = this.weatherService.generateAlertMessage(city, matchedPrefs, weatherData || {}, 'TEST');
      await this.sendMessage(chatId.toString(), message);
      this.logger.log(`Manual /test alert dispatched to ${existingConnectedUser.email}`);
      return;
    }

    // Handle interactive on-demand weather status requests ("/status", "hi", "/weather", etc.)
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
          await this.sendMessage(
            chatId.toString(),
            `✅ *Account Already Connected!*\n\nWelcome back, **${existingConnectedUser.name}**! Your Telegram account is already linked and active.\n\nYou do not need to re-send your connection token. Simply type \`hi\`, \`status\`, or \`/weather\` right here whenever you want an instant live weather report!`
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

      const isReconnecting = user.hasEverConnectedTelegram === true;

      await this.userModel.updateOne(
        { _id: user._id },
        { 
          $set: {
            telegramChatId: chatId.toString(),
            telegramConnected: true,
            telegramConnectedAt: new Date(),
            hasEverConnectedTelegram: true
          },
          $unset: {
            telegramConnectionToken: "",
            telegramTokenExpires: ""
          }
        }
      );

      if (isReconnecting) {
        await this.sendMessage(
          chatId.toString(),
          `🔄 *Telegram Successfully Reconnected!*\n\nWelcome back, **${user.name}**! Your account is once again linked and active.\n\n• 🛡️ **Automated Alerts:** Active based on your saved schedule.\n• 💬 **Interactive Chat:** Type \`hi\`, \`status\`, or \`/weather\` anytime for instant updates!`
        );
      } else {
        await this.sendMessage(
          chatId.toString(),
          `🎉 *Welcome to WeatherGuard, ${user.name}!*\n\nYour Telegram account has been connected successfully!\n\n• 🛡️ **Automated Alerts:** Active based on your saved schedule.\n• 💬 **Interactive Chat:** Type \`hi\`, \`status\`, or \`/weather\` anytime for instant updates!`
        );
      }
      
      this.logger.log(`User ${user.email} ${isReconnecting ? 'reconnected' : 'connected'} to Telegram with ChatID ${chatId}`);
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
