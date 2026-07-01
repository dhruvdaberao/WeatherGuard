import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { UserProfileCard } from '../components/shared/UserProfileCard';
import { RequestStatusCard } from '../components/preferences/RequestStatusCard';
import { Status } from '../types/auth';
import { CitySelector } from '../components/preferences/CitySelector';
import { WeatherPreferenceSelector, WeatherPreference } from '../components/preferences/WeatherPreferenceSelector';
import { api } from '../services/api';
import { MapPin, Save, Edit2, X, Lock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { TelegramLogo } from '../components/shared/TelegramLogo';
import { LoadingState } from '../components/shared/LoadingState';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { TelegramConnectModal } from '../components/preferences/TelegramConnectModal';
import { Logo } from '../components/shared/Logo';

export function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [showMissingPreferencesModal, setShowMissingPreferencesModal] = useState(false);
  const [city, setCity] = useState(user?.city || '');

  const testAlertMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/me/test-alert');
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Test alert sent successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send test alert';
      toast.error(message);
    }
  });

  const normalizePreferences = (prefs: any[]) => {
    if (!prefs) return [];
    return prefs.map((p) => {
      if (p === 'HIGH_TEMP' || p === 'TEMPERATURE') return WeatherPreference.HIGH_TEMPERATURE;
      if (p === 'LOW_TEMP') return WeatherPreference.LOW_TEMPERATURE;
      if (p === 'STORM') return WeatherPreference.THUNDERSTORM;
      if (p === 'SEVERE') return WeatherPreference.SEVERE_WEATHER;
      return p as WeatherPreference;
    });
  };

  const [preferences, setPreferences] = useState<WeatherPreference[]>(
    normalizePreferences(user?.weatherPreferences as any)
  );

  useEffect(() => {
    if (user && !isEditing) {
      setCity(user.city || '');
      setPreferences(normalizePreferences(user.weatherPreferences as any));
    }
  }, [user, isEditing]);

  const mutation = useMutation({
    mutationFn: async (data: { city: string; weatherPreferences: WeatherPreference[] }) => {
      const response = await api.patch('/users/preferences', data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      setIsEditing(false);
      if (!updatedUser.telegramConnected && user?.telegramConnected) {
        toast.success('Alert preferences cleared. Telegram bot disconnected automatically.');
      } else {
        toast.success('Preferences updated successfully!');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update preferences. Please try again.');
    },
  });

  const handleSave = () => {
    mutation.mutate({ city, weatherPreferences: preferences });
  };

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/users/me/telegram');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Telegram account disconnected.');
    },
  });

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><LoadingState /></div>;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const isLocked = user.status !== Status.APPROVED;

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-repeat opacity-40 dark:opacity-10" style={{ backgroundImage: `url(/quirky-child-weather.png)`, backgroundSize: '800px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="text-center space-y-2 pt-2 sm:pt-0">
            <div className="flex justify-center group">
              <Logo className="text-slate-900 dark:text-slate-100 w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-1" />
            </div>
            <h1 className="font-bubble text-2xl sm:text-3xl font-bold tracking-normal flex items-center justify-center text-center">
              <span className="text-secondary drop-shadow-sm">WEATHER</span>
              <span className="text-primary mx-1">-</span>
              <span className="text-primary drop-shadow-sm">GUARD</span>
            </h1>
          </div>

          <UserProfileCard
            name={user.name}
            email={user.email}
            avatar={user.avatar}
            role={user.role}
            onLogout={logout}
          />

          <RequestStatusCard status={user.status} />

          <div className="grid gap-6 lg:grid-cols-3 items-start relative">
            
            <div className={`lg:col-span-2 bg-card rounded-2xl border border-blue-200/80 dark:border-blue-800/50 shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 space-y-6 relative overflow-hidden ${isLocked ? 'pointer-events-none' : ''}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6">
                <div>
                  <h3 className="font-semibold text-xl tracking-tight">Your Preferences</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage your active weather alerts.</p>
                </div>
                {!isLocked && (
                  !isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="gap-2 shadow-md bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold border-none text-sm px-6">
                      <Edit2 className="w-4 h-4" /> Edit
                    </Button>
                  ) : (
                    <Button onClick={() => setIsEditing(false)} variant="ghost" className="gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold border-none shadow-md text-sm px-6">
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  )
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-border/40">
                    <span className="text-muted-foreground font-medium mb-2 sm:mb-0">Alert City</span>
                    {user.city ? (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-full border border-blue-500/20 flex items-center gap-1.5 shadow-sm w-fit">
                        <MapPin className="w-4 h-4" />
                        {user.city}
                      </span>
                    ) : (
                      <span className="font-semibold text-sm text-muted-foreground">Not set</span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-4">
                    <span className="text-muted-foreground font-medium mb-3 sm:mb-0">Alert Types</span>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {user.weatherPreferences?.length ? (
                        user.weatherPreferences.map(pref => (
                          <span key={pref} className="px-3 py-1 bg-primary/10 text-primary text-[11px] sm:text-xs font-bold rounded-full uppercase tracking-wider border border-primary/20 shadow-sm">
                            {pref.replace(/_/g, ' ')}
                          </span>
                        ))
                      ) : (
                        <span className="font-semibold text-sm text-muted-foreground">None selected</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <CitySelector value={city} onChange={setCity} />
                  <WeatherPreferenceSelector selected={preferences} onChange={setPreferences} />
                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2 h-11 px-8 shadow-md">
                      <Save className="w-4 h-4" />
                      {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}

              {isLocked && (
                <div className="absolute inset-0 z-20 bg-background/70 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
                   <div className="p-5 bg-card/95 rounded-2xl shadow-xl border border-border flex flex-col items-center max-w-xs animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 shadow-sm">
                        <Lock className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-base text-foreground">Preferences Locked</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Only approved accounts can configure active weather alerts and locations.</p>
                   </div>
                </div>
              )}
            </div>
            
            <div className={`lg:col-span-1 bg-card rounded-2xl border border-blue-200/80 dark:border-blue-800/50 shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden ${isLocked ? 'pointer-events-none' : ''}`}>
              <TelegramLogo className="w-16 h-16 shrink-0" />
              <div className="w-full">
                <h3 className="font-semibold text-lg tracking-tight mb-2">Telegram Integration</h3>
                
                {user.telegramConnected ? (
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" strokeWidth={2.5} /> Connected
                    </span>
                    {user.telegramConnectedAt && (
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        Connected At: {new Date(user.telegramConnectedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20 shadow-sm">
                        <XCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" strokeWidth={2.5} /> Not Connected
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Connect your Telegram account to instantly receive live active weather alerts on your phone.
                    </p>
                  </>
                )}
              </div>

              {user.telegramConnected ? (
                <div className="w-full max-w-xs mx-auto space-y-3">
                  <Button 
                    className="w-full h-11 gap-2 shadow-sm" 
                    disabled={isLocked || testAlertMutation.isPending}
                    onClick={() => testAlertMutation.mutate()}
                  >
                    {testAlertMutation.isPending ? 'Sending...' : 'Send Test Alert'}
                  </Button>
                  <Button 
                    className="w-full h-11 gap-2 shadow-md bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold border-none" 
                    disabled={isLocked || disconnectMutation.isPending}
                    onClick={() => disconnectMutation.mutate()}
                  >
                    {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full h-12 gap-2 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" 
                  style={{ backgroundColor: '#229ED9' }}
                  disabled={isLocked}
                  onClick={() => {
                    if (!user?.weatherPreferences || user.weatherPreferences.length === 0) {
                      setShowMissingPreferencesModal(true);
                      return;
                    }
                    setIsTelegramModalOpen(true);
                  }}
                >
                  <TelegramLogo className="w-5 h-5 shrink-0" /> Connect Telegram
                </Button>
              )}

              {isLocked && (
                <div className="absolute inset-0 z-20 bg-background/70 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
                   <div className="p-5 bg-card/95 rounded-2xl shadow-xl border border-border flex flex-col items-center max-w-xs animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 shadow-sm">
                        <Lock className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="font-semibold text-base text-foreground">Integration Locked</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Only approved accounts can connect Telegram automated bots.</p>
                   </div>
                </div>
              )}
            </div>

            {isTelegramModalOpen && (
              <TelegramConnectModal 
                isOpen={isTelegramModalOpen} 
                onClose={() => setIsTelegramModalOpen(false)} 
              />
            )}

            {showMissingPreferencesModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
                <div className="relative w-full max-w-sm sm:max-w-md p-6 bg-card rounded-2xl shadow-2xl border-2 border-amber-500/70 text-left space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 shrink-0 shadow-sm border border-amber-500/30">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                        Alert Preferences Required
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        You haven't selected any weather alert conditions yet! Without configuring preferences (like Rain, Thunderstorm, or Extreme Heat), the Telegram bot won't know when to notify you.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60">
                    <Button
                      variant="outline"
                      onClick={() => setShowMissingPreferencesModal(false)}
                      className="w-full h-10 text-xs sm:text-sm font-semibold rounded-xl border border-border hover:bg-muted"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowMissingPreferencesModal(false);
                        setIsEditing(true);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className="w-full h-10 text-xs sm:text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transition-all truncate px-2"
                    >
                      Set Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

