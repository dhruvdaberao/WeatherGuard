import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '../ui/Input';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
}

export function CitySelector({ value, onChange }: CitySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Alert City
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="e.g. San Francisco"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <p className="text-xs text-muted-foreground">Enter the primary city you want to receive weather alerts for.</p>
    </div>
  );
}
