import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { Logo } from '../components/shared/Logo';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="fixed top-4 left-4 z-50">
        <Link to="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/50">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-repeat opacity-40 dark:opacity-10" style={{ backgroundImage: `url(/quirky-child-weather.png)`, backgroundSize: '800px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] dark:bg-secondary/5"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-8 flex justify-center">
          <Logo className="w-16 h-16 text-slate-900 dark:text-slate-100 drop-shadow-md" />
        </div>
        
        <div className="bg-card/90 backdrop-blur-md rounded-3xl border border-blue-200/60 dark:border-blue-900/40 p-8 md:p-12 shadow-xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">Privacy Policy</h1>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed prose dark:prose-invert max-w-none">
            <p>At WeatherGuard, we take your privacy seriously. This policy describes how we collect and use your data.</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Information Collection</h3>
            <p>We collect information you provide directly to us when you create an account, such as your name, email address, and authentication provider details (Google/GitHub).</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Use of Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services, particularly to deliver accurate and timely weather alerts for your specified locations.</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Data Security</h3>
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Third-Party Services</h3>
            <p>We use third-party services like Telegram for notifications and Open-Meteo for weather data. Your interactions with these services are governed by their respective privacy policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
