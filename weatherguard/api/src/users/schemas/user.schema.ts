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

  @Prop()
  city: string;

  @Prop({ type: [String], enum: WeatherPreference, default: [] })
  weatherPreferences: WeatherPreference[];
}

export const UserSchema = SchemaFactory.createForClass(User);
