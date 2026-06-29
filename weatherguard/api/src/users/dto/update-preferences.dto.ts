import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WeatherPreference } from '../enums/weather-preference.enum';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(WeatherPreference, { each: true })
  weatherPreferences?: WeatherPreference[];
}
