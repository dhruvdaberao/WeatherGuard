import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';
import { Status } from '../enums/status.enum';
import { WeatherPreference } from '../enums/weather-preference.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  provider: string;

  @Prop()
  providerId: string;

  @Prop()
  avatar: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: String, enum: Status, default: Status.PENDING })
  status: Status;

  @Prop()
  telegramChatId: string;

  @Prop({ type: Boolean, default: false })
  telegramConnected: boolean;

  @Prop()
  telegramConnectionToken: string;

  @Prop()
  telegramTokenExpires: Date;

  @Prop()
  telegramConnectedAt: Date;

  @Prop({ type: Boolean, default: false })
  hasEverConnectedTelegram: boolean;

  @Prop()
  city: string;

  @Prop({ type: [String], enum: WeatherPreference, default: [] })
  weatherPreferences: WeatherPreference[];

  @Prop({ type: Boolean, default: true })
  autoAlertsEnabled: boolean;

  @Prop({ type: Number, default: 6 })
  alertsPerDay: number;

  @Prop()
  lastAlertSentAt: Date;

  @Prop({ type: [String], default: [] })
  lastAlertTypes: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
