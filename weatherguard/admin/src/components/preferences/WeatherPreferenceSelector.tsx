import * as React from 'react';
import { CloudRain, Thermometer, Wind } from 'lucide-react';
import { cn } from '../../utils/cn';

export enum WeatherPreference {
  RAIN = 'RAIN',
  TEMPERATURE = 'TEMPERATURE',
  WIND = 'WIND',
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
    { value: WeatherPreference.RAIN, label: 'Rain & Precipitation', icon: CloudRain },
    { value: WeatherPreference.TEMPERATURE, label: 'Extreme Temperatures', icon: Thermometer },
    { value: WeatherPreference.WIND, label: 'High Winds', icon: Wind },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">Alert Types</label>
      <div className="grid gap-3 sm:grid-cols-3">
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
              <span className="text-sm font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
