import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { Logo } from '../components/shared/Logo';

export function TermsPage() {
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
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-8 flex justify-center">
          <Logo className="w-16 h-16 text-slate-900 dark:text-slate-100 drop-shadow-md" />
        </div>
        
        <div className="bg-card/90 backdrop-blur-md rounded-3xl border border-blue-200/60 dark:border-blue-900/40 p-8 md:p-12 shadow-xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">Terms of Service</h1>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed prose dark:prose-invert max-w-none">
            <p>Welcome to WeatherGuard. By accessing our application, you agree to these terms.</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h3>
            <p>By registering for and using WeatherGuard, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h3>
            <p>WeatherGuard provides automated weather intelligence and alert workflows. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Conduct</h3>
            <p>You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Intellectual Property</h3>
            <p>All content included on the site, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of WeatherGuard or its suppliers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
