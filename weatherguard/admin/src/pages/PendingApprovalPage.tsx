import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { RequestStatusCard } from '../components/preferences/RequestStatusCard';
import { CitySelector } from '../components/preferences/CitySelector';
import { WeatherPreferenceSelector, WeatherPreference } from '../components/preferences/WeatherPreferenceSelector';
import { Button } from '../components/ui/Button';
import { LogOut, Save } from 'lucide-react';
import { Status } from '../types/auth';

export function PendingApprovalPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  
  const [city, setCity] = useState(user?.city || '');
  const [preferences, setPreferences] = useState<WeatherPreference[]>(
    (user?.weatherPreferences as WeatherPreference[]) || []
  );

  const mutation = useMutation({
    mutationFn: async (data: { city: string; weatherPreferences: WeatherPreference[] }) => {
      const response = await api.patch('/users/preferences', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const handleSave = () => {
    mutation.mutate({ city, weatherPreferences: preferences });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Account Setup</h1>
          <Button variant="ghost" onClick={logout} className="gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <RequestStatusCard status={Status.PENDING} />

        <div className="bg-card rounded-xl border p-6 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Configure Your Alerts</h2>
            <p className="text-sm text-muted-foreground mb-6">
              While waiting for admin approval, you can pre-configure the types of weather alerts you'd like to receive and for which city.
            </p>
          </div>
          
          <CitySelector value={city} onChange={setCity} />
          
          <WeatherPreferenceSelector selected={preferences} onChange={setPreferences} />

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2">
              <Save className="w-4 h-4" />
              {mutation.isPending ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
