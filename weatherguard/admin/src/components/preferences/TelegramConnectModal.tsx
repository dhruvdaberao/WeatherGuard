import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { TelegramLogo } from '../shared/TelegramLogo';
import { X, Copy, Check, Send, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface TelegramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TelegramConnectModal({ isOpen, onClose }: TelegramConnectModalProps) {
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();
  
  const generateTokenMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/users/me/telegram/token');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    }
  });

  useEffect(() => {
    if (isOpen && !generateTokenMutation.data && !generateTokenMutation.isPending && !generateTokenMutation.isError) {
      generateTokenMutation.mutate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (generateTokenMutation.data?.token) {
      navigator.clipboard.writeText(`/start ${generateTokenMutation.data.token}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Command copied to clipboard!');
    }
  };

  const handleDone = () => {
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl border shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <TelegramLogo className="w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold tracking-tight">Connect Telegram</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-8 h-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {generateTokenMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-10 h-10 border-4 border-[#229ED9]/30 border-t-[#229ED9] rounded-full animate-spin"></div>
              <p className="text-[#229ED9] font-medium animate-pulse">Generating your secure token...</p>
            </div>
          ) : generateTokenMutation.isError ? (
            <div className="text-center py-8 text-destructive">
              Failed to generate token. Please try again.
            </div>
          ) : generateTokenMutation.data && (
            <>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-primary mb-1">STEP 1</div>
                  <p className="text-sm text-foreground">Choose your platform to open the bot chat:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                    <a 
                      href={`https://t.me/${generateTokenMutation.data.botUsername}?start=${generateTokenMutation.data.token}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-white bg-[#229ED9] hover:bg-[#1d8ac0] font-semibold text-xs sm:text-sm px-3 py-2.5 rounded-xl shadow transition-all active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      Open Telegram App
                    </a>
                    <a 
                      href={`https://web.telegram.org/k/#@${generateTokenMutation.data.botUsername}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (generateTokenMutation.data?.token) {
                          navigator.clipboard.writeText(`/start ${generateTokenMutation.data.token}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                          toast.success('Command copied! Just Ctrl+V / Paste in Telegram Web');
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 text-[#229ED9] bg-[#229ED9]/10 hover:bg-[#229ED9]/20 font-semibold text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-[#229ED9]/30 transition-all active:scale-95"
                    >
                      <Globe className="w-4 h-4" />
                      Open Telegram Web
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-primary mb-1 mt-4">STEP 2</div>
                  <p className="text-sm text-foreground">Send the following command to the bot to link your account:</p>
                  
                  <div className="mt-3 flex items-center gap-2 p-3 bg-muted rounded-lg border">
                    <code className="flex-1 text-sm font-mono text-foreground font-semibold">
                      /start {generateTokenMutation.data.token}
                    </code>
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2 text-muted-foreground hover:text-foreground">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs text-yellow-600 dark:text-yellow-400">
                This secure token will expire in 24 hours. Do not share it with anyone.
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-muted/30 border-t border-border/50 flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="h-auto py-3 px-5 font-semibold">Cancel</Button>
          <Button onClick={handleDone} className="bg-[#229ED9] hover:bg-[#1d8ac0] text-white border-none h-auto py-3 px-6 leading-normal font-semibold shadow-md">
            I've sent the command
          </Button>
        </div>
      </div>
    </div>
  );
}
