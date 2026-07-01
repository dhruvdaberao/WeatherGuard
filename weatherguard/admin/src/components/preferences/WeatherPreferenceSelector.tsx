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
    <div className="space-y-2.5">
      <label className="text-sm font-semibold leading-none text-foreground">Alert Types</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
        {options.map(({ value, label, icon: Icon }) => {
          const isSelected = selected.includes(value);
          return (
            <div
              key={value}
              onClick={() => togglePreference(value)}
              className={cn(
                'flex items-center justify-start sm:justify-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none group shadow-2xs hover:shadow-sm active:scale-[0.98]',
                isSelected 
                  ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/30' 
                  : 'border-border/80 bg-card/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-lg transition-colors shrink-0',
                isSelected ? 'bg-primary/20 text-primary' : 'bg-muted/70 text-muted-foreground group-hover:text-foreground'
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium tracking-tight truncate">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
