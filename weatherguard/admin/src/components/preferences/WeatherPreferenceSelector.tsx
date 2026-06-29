import { 
  CloudRain, 
  Wind,  
  CloudLightning, 
  CloudFog, 
  Snowflake, 
  AlertTriangle, 
  Sun, 
  Droplets,
  ThermometerSun,
  ThermometerSnowflake
} from 'lucide-react';
import { cn } from '../../utils/cn';

export enum WeatherPreference {
  RAIN = 'RAIN',
  HIGH_TEMPERATURE = 'HIGH_TEMPERATURE',
  LOW_TEMPERATURE = 'LOW_TEMPERATURE',
  HIGH_WIND = 'HIGH_WIND',
  THUNDERSTORM = 'THUNDERSTORM',
  FOG = 'FOG',
  SNOW = 'SNOW',
  SEVERE_WEATHER = 'SEVERE_WEATHER',
  UV_INDEX = 'UV_INDEX',
  HUMIDITY = 'HUMIDITY',
}

interface WeatherPreferenceSelectorProps {
  selected: WeatherPreference[];
  onChange: (selected: WeatherPreference[]) => void;
}

export function WeatherPreferenceSelector({ selected, onChange }: WeatherPreferenceSelectorProps) {
  const togglePreference = (pref: WeatherPreference) => {
    if (selected.includes(pref)) {
      onChange(selected.filter((p) => p !== pref));
    } else {
      onChange([...selected, pref]);
    }
  };

  const options = [
    { value: WeatherPreference.RAIN, label: 'Rain', icon: CloudRain },
    { value: WeatherPreference.HIGH_TEMPERATURE, label: 'High Temp', icon: ThermometerSun },
    { value: WeatherPreference.LOW_TEMPERATURE, label: 'Low Temp', icon: ThermometerSnowflake },
    { value: WeatherPreference.HIGH_WIND, label: 'High Wind', icon: Wind },
    { value: WeatherPreference.THUNDERSTORM, label: 'Storm', icon: CloudLightning },
    { value: WeatherPreference.FOG, label: 'Fog', icon: CloudFog },
    { value: WeatherPreference.SNOW, label: 'Snow', icon: Snowflake },
    { value: WeatherPreference.SEVERE_WEATHER, label: 'Severe', icon: AlertTriangle },
    { value: WeatherPreference.UV_INDEX, label: 'UV Index', icon: Sun },
    { value: WeatherPreference.HUMIDITY, label: 'Humidity', icon: Droplets },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">Alert Types</label>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        {options.map(({ value, label, icon: Icon }) => {
          const isSelected = selected.includes(value);
          return (
            <div
              key={value}
              onClick={() => togglePreference(value)}
              className={cn(
                'flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-muted/50 text-center gap-2',
                isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-input bg-transparent text-muted-foreground'
              )}
            >
              <Icon className={cn('w-6 h-6', isSelected ? 'text-primary' : 'text-muted-foreground')} />
              <span className="text-xs font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
