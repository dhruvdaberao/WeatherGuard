import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WeatherPreference } from '../users/enums/weather-preference.enum';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string | undefined;
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
  }

  async fetchWeather(city: string): Promise<any> {
    try {
      if (!this.apiKey) {
        this.logger.error('OPENWEATHER_API_KEY is not defined');
        return null;
      }
      const response = await firstValueFrom(
        this.httpService.get(this.apiUrl, {
          params: {
            q: city,
            appid: this.apiKey,
            units: 'metric',
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${city}: ${error.message}`);
      return null;
    }
  }

  matchPreferences(weatherData: any, preferences: WeatherPreference[]): WeatherPreference[] {
    if (!weatherData || !preferences || preferences.length === 0) return [];

    const matched: WeatherPreference[] = [];
    const conditionStr = weatherData.weather?.[0]?.main?.toLowerCase() || '';
    const temp = weatherData.main?.temp;
    const windSpeed = weatherData.wind?.speed;
    const humidity = weatherData.main?.humidity;

    for (const pref of preferences) {
      switch (pref) {
        case WeatherPreference.RAIN:
          if (conditionStr.includes('rain') || conditionStr.includes('drizzle')) matched.push(pref);
          break;
        case WeatherPreference.THUNDERSTORM:
          if (conditionStr.includes('thunderstorm')) matched.push(pref);
          break;
        case WeatherPreference.SNOW:
          if (conditionStr.includes('snow')) matched.push(pref);
          break;
        case WeatherPreference.FOG:
          if (conditionStr.includes('fog') || conditionStr.includes('mist') || conditionStr.includes('haze')) matched.push(pref);
          break;
        case WeatherPreference.HIGH_TEMPERATURE:
          if (temp >= 35) matched.push(pref);
          break;
        case WeatherPreference.LOW_TEMPERATURE:
          if (temp <= 5) matched.push(pref);
          break;
        case WeatherPreference.HIGH_WIND:
          if (windSpeed >= 10) matched.push(pref); // > 10 m/s is quite windy
          break;
        case WeatherPreference.HUMIDITY:
          if (humidity >= 85) matched.push(pref);
          break;
        case WeatherPreference.SEVERE_WEATHER:
          if (conditionStr.includes('tornado') || conditionStr.includes('squall')) matched.push(pref);
          break;
        case WeatherPreference.UV_INDEX:
          // High UV index warning during clear sunny daytime conditions
          const isDaytime = weatherData.dt >= (weatherData.sys?.sunrise || 0) && weatherData.dt <= (weatherData.sys?.sunset || Infinity);
          const isClearSky = conditionStr.includes('clear') || (weatherData.clouds?.all !== undefined && weatherData.clouds.all <= 25);
          if (isDaytime && isClearSky && temp >= 26) matched.push(pref);
          break;
      }
    }

    return matched;
  }

  generateAlertMessage(city: string, matchedAlerts: WeatherPreference[], weatherData: any): string {
    const temp = Math.round(weatherData.main?.temp);
    
    let msg = `🌦 *WeatherGuard Alert*\n`;
    msg += `📍 *${city}*\n\n`;

    // Map matched alerts to user-friendly descriptions
    const alertDescriptions = matchedAlerts.map(alert => {
      switch (alert) {
        case WeatherPreference.RAIN: return '🌧 Rain expected today.';
        case WeatherPreference.THUNDERSTORM: return '⚡ Thunderstorms in the area.';
        case WeatherPreference.SNOW: return '❄️ Snow is expected.';
        case WeatherPreference.FOG: return '🌫️ Foggy or hazy conditions.';
        case WeatherPreference.HIGH_TEMPERATURE: return `🔥 High temperatures alert.`;
        case WeatherPreference.LOW_TEMPERATURE: return `🥶 Freezing temperatures.`;
        case WeatherPreference.HIGH_WIND: return `💨 High winds expected.`;
        case WeatherPreference.HUMIDITY: return `💧 Very high humidity.`;
        case WeatherPreference.SEVERE_WEATHER: return `⚠️ Severe weather alert!`;
        case WeatherPreference.UV_INDEX: return `☀️ High UV Index warning (Clear bright sunlight).`;
        default: return '';
      }
    }).filter(desc => desc !== '');

    if (alertDescriptions.length > 0) {
      msg += alertDescriptions.join('\n') + '\n\n';
    } else {
      msg += `Conditions matched your preferences.\n\n`;
    }

    msg += `🌡 Temperature:\n${temp}°C\n\n`;
    
    // Add dynamic advice
    let advice = '';
    if (matchedAlerts.includes(WeatherPreference.RAIN) || matchedAlerts.includes(WeatherPreference.THUNDERSTORM)) {
      advice = `Stay hydrated and carry an umbrella.`;
    } else if (matchedAlerts.includes(WeatherPreference.HIGH_TEMPERATURE) || matchedAlerts.includes(WeatherPreference.UV_INDEX)) {
      advice = `Apply sunscreen, wear sunglasses, and avoid prolonged sun exposure.`;
    } else if (matchedAlerts.includes(WeatherPreference.LOW_TEMPERATURE) || matchedAlerts.includes(WeatherPreference.SNOW)) {
      advice = `Bundle up and stay warm.`;
    } else if (matchedAlerts.includes(WeatherPreference.HIGH_WIND) || matchedAlerts.includes(WeatherPreference.SEVERE_WEATHER)) {
      advice = `Stay safe and secure loose objects.`;
    }
    
    if (advice) {
      msg += `${advice}\n\n`;
    }

    msg += `— WeatherGuard`;
    return msg;
  }
}
