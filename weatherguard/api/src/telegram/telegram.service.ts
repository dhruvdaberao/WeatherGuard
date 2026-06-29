import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const TelegramBot = require('node-telegram-bot-api');
const BotConstructor = TelegramBot.default || TelegramBot.TelegramBot || TelegramBot;
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot: any;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new BotConstructor(token, { polling: true });
    } else {
      this.logger.warn('TELEGRAM_BOT_TOKEN not provided. Bot is disabled.');
    }
  }

  onModuleInit() {
    if (!this.bot) return;

    this.logger.log('Telegram Bot started polling.');

    this.bot.onText(/\/start (.+)/, async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      const token = match?.[1];
      if (!token) return;

      try {
        const user = await this.userModel.findOne({ telegramConnectionToken: token });

        if (!user) {
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
          `Welcome to WeatherGuard, ${user.name}! \n\nYour Telegram account has been connected successfully. You will now receive automated weather alerts.`,
        );
        
        this.logger.log(`User ${user.email} connected to Telegram with ChatID ${chatId}`);
      } catch (error) {
        this.logger.error('Error connecting Telegram account', error);
        await this.bot.sendMessage(chatId, 'An error occurred while connecting your account. Please try again.');
      }
    });

    this.bot.onText(/\/start$/, async (msg: any) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(
        chatId,
        'Welcome to WeatherGuard! To connect your account, please use the unique link provided in your web dashboard.',
      );
    });
  }
}
