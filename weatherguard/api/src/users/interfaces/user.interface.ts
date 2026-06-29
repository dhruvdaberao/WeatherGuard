import { Role } from '../enums/role.enum';
import { Status } from '../enums/status.enum';
import { WeatherPreference } from '../enums/weather-preference.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  provider?: string;
  providerId?: string;
  avatar?: string;
  role: Role;
  status: Status;
  telegramChatId?: string;
  city?: string;
  weatherPreferences: WeatherPreference[];
  createdAt: Date;
  updatedAt: Date;
}
