import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { WeatherPreference } from '../enums/weather-preference.enum';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(WeatherPreference, { each: true })
  weatherPreferences?: WeatherPreference[];

  @IsOptional()
  @IsBoolean()
  autoAlertsEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  alertsPerDay?: number;
}
