import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, ShieldCheck, Zap, Palette, Smartphone, GitCommit } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { Logo } from '../components/shared/Logo';

export function HireMePage() {
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
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] dark:bg-secondary/5"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto flex flex-col items-center">
        <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-top-8 duration-700">
          <Logo className="w-20 h-20 text-slate-900 dark:text-slate-100 drop-shadow-md" />
        </div>
        
        <div className="bg-card/90 backdrop-blur-md rounded-3xl border border-blue-200/60 dark:border-blue-900/40 p-8 md:p-12 lg:p-16 shadow-xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
              Why You Should Hire Me
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I didn't just build a functional assignment. I built a production-ready, beautifully designed web application that demonstrates my passion for engineering excellence and user experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              
              <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Obsessive UI/UX Polish</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Designed with custom micro-animations, glassmorphism effects, a sophisticated dynamic theme toggle, and a playful hand-drawn aesthetic that feels premium.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Robust Authentication</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Implemented secure JWT-based authentication featuring Google and GitHub OAuth, alongside a strict Role-Based Access Control (RBAC) system for Admins and Users.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Performant Architecture</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Powered by React Query for intelligent caching, optimistic updates, and seamless data synchronization without unnecessary loading states or UI flickering.
                  </p>
                </div>
              </div>

            </div>

            <div className="space-y-6">

              <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <GitCommit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Complex Integrations</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Integrated the Open-Meteo Geocoding API for strictly accurate city lookups, and built a seamless Telegram bot hook for real-time weather notifications.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Fully Responsive</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Engineered to look stunning on every device. Mobile-first CSS grids, dynamic typography scaling, and touch-friendly interface elements.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Clean Code Practices</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Strict TypeScript typing, modular component architecture, and scalable design patterns ensuring the codebase is highly maintainable and readable.
                  </p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="mt-16 text-center border-t border-border/50 pt-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Let's build something amazing together.</h2>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=dhruvdaberao@gmail.com&su=Job%20Opportunity%20/%20Hire%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
