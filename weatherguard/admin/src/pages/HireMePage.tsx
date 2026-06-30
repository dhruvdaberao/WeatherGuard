import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, ShieldCheck, Zap, GitCommit, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { Logo } from '../components/shared/Logo';

const CATEGORIES = [
  {
    id: 'ux',
    title: 'UI/UX Engineering Polish',
    icon: Palette,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10 text-blue-500',
    badge: 'Front-End Mastery',
    points: [
      'Architected a responsive, mobile-first interface optimized for seamless navigation across all viewport dimensions.',
      'Implemented cohesive HSL design tokens, smooth micro-transitions, and a persistent dark/light theme engine.',
      'Replaced default browser placeholders and native OS dialogs with scalable custom vector components.',
      'Prioritized accessibility and user feedback loops via proactive, non-blocking toast notifications.'
    ]
  },
  {
    id: 'arch',
    title: 'Full-Stack NestJS & React Query',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10 text-amber-500',
    badge: 'Enterprise Scalability',
    points: [
      'Built a modular NestJS serverless backend deployed on Vercel Node runtime with clean separation of concerns.',
      'Utilized TanStack React Query for intelligent server-state caching, optimistic updates, and automatic query invalidation.',
      'Engineered an anti-spam weather notification scheduler and idempotent webhook pipeline for Telegram bot delivery.',
      'Integrated Open-Meteo geocoding APIs with strict input validation and robust fallback handling.'
    ]
  },
  {
    id: 'sec',
    title: 'Fortified Security & RBAC',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10 text-emerald-500',
    badge: 'Zero Trust Architecture',
    points: [
      'Enforced HttpOnly, secure JWT cookie authentication to safeguard sessions against XSS and CSRF vulnerabilities.',
      'Supported multi-provider OAuth authentication (Google & GitHub) with unified identity resolution.',
      'Implemented strict Role-Based Access Control (RBAC) separating standard user privileges from administration.',
      'Constructed an administrative vetting queue requiring explicit verification before alert dispatches.'
    ]
  },
  {
    id: 'speed',
    title: 'Production Execution',
    icon: GitCommit,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10 text-purple-500',
    badge: 'High Velocity Shipped',
    points: [
      'Delivered a fully verified, production-ready SaaS application strictly within assignment deadlines.',
      'Maintained 100% strict TypeScript type safety across frontend components, API contracts, and database schemas.',
      'Configured proactive error boundary resilience to gracefully handle network anomalies and API rate limits.',
      'Prepared detailed engineering documentation, clean commit histories, and automated test environments.'
    ]
  }
];

export function HireMePage() {
  const [activeTab, setActiveTab] = useState('ux');
  const activeData = CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-background text-foreground relative overflow-x-hidden font-sans">
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <div className="p-1 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
      <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50">
        <Link to="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm text-xs sm:text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Back</span>
        </Link>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-repeat opacity-40 dark:opacity-10" style={{ backgroundImage: `url(/quirky-child-weather.png)`, backgroundSize: '800px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] dark:bg-secondary/5"></div>
      </div>

      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 py-14 sm:py-20 flex flex-col items-center flex-1 justify-center">
        {/* Header Title with Frosted Glass Backdrop and Bluish Glow Border */}
        <div className="text-center space-y-3 bg-background/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-[#229ED9]/40 dark:border-[#229ED9]/50 shadow-[0_4px_25px_rgba(34,158,217,0.12)] mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-6 duration-500 w-full">
          <div className="flex justify-center">
            <Logo className="w-14 h-14 sm:w-16 sm:h-16 text-slate-900 dark:text-slate-100 drop-shadow-md transition-transform duration-500 hover:scale-110" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" /> Engineer Showcase
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-[#229ED9] to-secondary bg-clip-text text-transparent">
            Why Am I a Great Match For This Role & Company?
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            I don't just complete assignments—I architect high-speed, secure, and visually immaculate SaaS applications. Here is my technical contribution to your team:
          </p>
        </div>

        {/* Interactive Compact Switcher Card with Bluish Glow Border */}
        <div className="w-full bg-card/95 backdrop-blur-xl rounded-3xl border-2 border-[#229ED9]/40 dark:border-[#229ED9]/50 shadow-[0_8px_30px_rgba(34,158,217,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Tab Navigation with Explicit Pill Borders */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border/50 bg-muted/40 p-2 gap-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border ${
                    isActive 
                      ? 'bg-background text-foreground border-[#229ED9] shadow-md scale-[1.02]' 
                      : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-background/50 hover:border-border'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${cat.bgColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{cat.title.split(' ')[0]} {cat.title.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content - Uncluttered Clean Rows */}
          <div className="p-5 sm:p-8 space-y-5 animate-in fade-in duration-300 min-h-[220px] flex flex-col justify-center">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${activeData.bgColor}`}>
                  <activeData.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-xl text-foreground">{activeData.title}</h2>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{activeData.badge}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {activeData.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1.5 text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Footer inside Card */}
          <div className="bg-muted/50 border-t border-border/50 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <div className="font-bold text-xs sm:text-sm text-foreground">Ready for an immediate contribution?</div>
              <div className="text-[11px] text-muted-foreground">Available for immediate technical interviews & deployment.</div>
            </div>
            
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a 
                href="mailto:dhruvdaberao777@gmail.com?subject=Interview%20Invitation%20-%20AI47Labs"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 h-11 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#1d8ac0] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
              >
                <Mail className="w-4 h-4 shrink-0" /> Hire Dhruv Now
              </a>
              <a 
                href="https://linkedin.com/in/dhruvdaberao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-1.5 w-11 h-11 rounded-xl border border-[#0A66C2]/40 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 transition-colors text-[#0A66C2] shadow-sm shrink-0 active:scale-95"
                title="LinkedIn Profile"
              >
                <svg className="w-6.5 h-6.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/dhruvdaberao/WeatherGuard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-1.5 w-11 h-11 rounded-xl border border-border bg-muted/60 hover:bg-muted transition-colors text-foreground shadow-sm shrink-0 active:scale-95"
                title="GitHub Repository"
              >
                <svg className="w-6.5 h-6.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
