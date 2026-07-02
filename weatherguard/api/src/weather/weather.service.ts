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

  generateAlertMessage(city: string, matchedAlerts: WeatherPreference[], weatherData: any, alertType: 'SCHEDULED' | 'URGENT' | 'TEST' | 'ON_DEMAND' = 'SCHEDULED'): string {
    const temp = Math.round(weatherData.main?.temp || 0);
    
    let msg = '';
    if (alertType === 'URGENT') {
      msg += `🚨 *URGENT WEATHER ADVISORY* 🚨\n`;
      msg += `⚡ *Immediate Condition Update*\n`;
    } else if (alertType === 'TEST') {
      msg += `🧪 *WEATHERGUARD TELEMETRY VERIFICATION*\n`;
      msg += `📡 *Real-Time System Check*\n`;
    } else if (alertType === 'ON_DEMAND') {
      msg += `📡 *LIVE WEATHER DISPATCH*\n`;
      msg += `🛰️ *On-Demand Current Status*\n`;
    } else {
      msg += `🌦️ *WeatherGuard Intelligence Report*\n`;
      msg += `🕒 *Scheduled Routine Dispatch*\n`;
    }
    
    msg += `📍 *Location:* ${city}\n\n`;

    // Map matched alerts to professional, captivating descriptions
    const alertDescriptions = matchedAlerts.map(alert => {
      switch (alert) {
        case WeatherPreference.RAIN: return '🌧️ *Precipitation Advisory*: Showers or rain expected today. Keep umbrella ready.';
        case WeatherPreference.THUNDERSTORM: return '⛈️ *Severe Storm Warning*: Thunderstorms and electrical activity detected.';
        case WeatherPreference.SNOW: return '❄️ *Winter Weather Watch*: Freezing conditions and snowfall expected.';
        case WeatherPreference.FOG: return '🌫️ *Low Visibility Notice*: Fog, mist, or dense atmospheric haze reported.';
        case WeatherPreference.HIGH_TEMPERATURE: return `🔥 *Extreme Heat Alert*: Elevated temperatures recorded. Risk of heat stress.`;
        case WeatherPreference.LOW_TEMPERATURE: return `🥶 *Freezing Advisory*: Sub-zero or freezing temperatures detected.`;
        case WeatherPreference.HIGH_WIND: return `💨 *High Wind Warning*: Strong gusty winds exceeding 10 m/s recorded.`;
        case WeatherPreference.HUMIDITY: return `💧 *High Humidity Notice*: Relative humidity exceeding 85%. Muggy conditions.`;
        case WeatherPreference.SEVERE_WEATHER: return `🌪️ *Severe Hazard Warning*: Extreme atmospheric activity or severe squalls reported.`;
        case WeatherPreference.UV_INDEX: return `☀️ *High UV Index Alert*: Intense solar radiation under bright clear skies.`;
        default: return '';
      }
    }).filter(desc => desc !== '');

    if (alertDescriptions.length > 0) {
      msg += `⚠️ *Active Alert Summary:*\n` + alertDescriptions.join('\n\n') + '\n\n';
    } else {
      msg += `✅ *Atmospheric Conditions:* All monitored indicators are stable.\n\n`;
    }

    msg += `📊 *Live Telemetry Overview*\n`;
    msg += `• 🌡️ *Temperature:* ${temp}°C\n`;
    if (weatherData.main?.humidity !== undefined) msg += `• 💧 *Humidity:* ${weatherData.main.humidity}%\n`;
    if (weatherData.wind?.speed !== undefined) msg += `• 💨 *Wind Speed:* ${weatherData.wind.speed} m/s\n`;
    if (weatherData.weather?.[0]?.description) {
      const desc = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);
      msg += `• ☁️ *Conditions:* ${desc}\n`;
    }
    msg += `\n`;
    
    // Add actionable executive guidance
    let advice = '';
    if (matchedAlerts.includes(WeatherPreference.RAIN) || matchedAlerts.includes(WeatherPreference.THUNDERSTORM)) {
      advice = `Carry waterproof gear and avoid open electrical areas during thunderstorms.`;
    } else if (matchedAlerts.includes(WeatherPreference.HIGH_TEMPERATURE) || matchedAlerts.includes(WeatherPreference.UV_INDEX)) {
      advice = `Apply SPF 30+ sunscreen, stay hydrated, and minimize direct midday sun exposure.`;
    } else if (matchedAlerts.includes(WeatherPreference.LOW_TEMPERATURE) || matchedAlerts.includes(WeatherPreference.SNOW)) {
      advice = `Wear insulated thermal clothing and exercise extreme caution on icy pathways.`;
    } else if (matchedAlerts.includes(WeatherPreference.HIGH_WIND) || matchedAlerts.includes(WeatherPreference.SEVERE_WEATHER)) {
      advice = `Secure loose outdoor structures and stay indoors until high wind warnings subside.`;
    }
    
    if (advice) {
      msg += `🛡️ *Actionable Guidance*\n👉 ${advice}\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n🤖 *WeatherGuard Automated Dispatch*`;
    return msg;
  }
}
