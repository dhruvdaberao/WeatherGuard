import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 hover:bg-transparent hover:opacity-70 shrink-0 flex items-center justify-center text-foreground transition-transform active:scale-95"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-7 h-7 text-slate-600" strokeWidth={2.75} />
      ) : (
        <Sun className="w-7 h-7 text-slate-300" strokeWidth={2.75} />
      )}
    </Button>
  );
}
