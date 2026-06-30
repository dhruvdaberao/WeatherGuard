import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palette, ShieldCheck, Zap, GitCommit, Sparkles, Send, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { Logo } from '../components/shared/Logo';

const CATEGORIES = [
  {
    id: 'ux',
    title: 'Obsessive UI/UX Polish',
    icon: Palette,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10 text-blue-500',
    badge: 'Pixel Perfect',
    points: [
      'Zero-scroll responsive mobile architecture with 100dvh viewport engineering.',
      'Sleek glassmorphism modals, frosted feature locks, and HSL color harmony.',
      'Complete replacement of basic emojis with crisp vector Lucide status badges.',
      'Custom hand-drawn vector Logo illustration with symmetric sun rays and gradients.'
    ]
  },
  {
    id: 'arch',
    title: 'Full-Stack NestJS & React Query',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10 text-amber-500',
    badge: 'Enterprise Scalable',
    points: [
      'Modular NestJS serverless backend deployed seamlessly on Vercel Node runtime.',
      'React Query state synchronization with optimistic updates and instant caching.',
      'Idempotent webhook retry logic and anti-spam weather scheduler algorithms.',
      'Open-Meteo geocoding pipeline with strict city validation and fallback handling.'
    ]
  },
  {
    id: 'sec',
    title: 'Fortified Security & RBAC',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10 text-emerald-500',
    badge: 'Zero Trust Auth',
    points: [
      'HttpOnly secure JWT cookies protecting against XSS and CSRF attacks.',
      'Multi-provider OAuth support (Google & GitHub) with unified account linking.',
      'Strict Role-Based Access Control (RBAC) separating regular users from Admins.',
      'Admin vetting queue requiring explicit verification before Telegram dispatch.'
    ]
  },
  {
    id: 'speed',
    title: 'Production Readiness',
    icon: GitCommit,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10 text-purple-500',
    badge: 'Shipped & Live',
    points: [
      'Built, styled, tested, and deployed live to Vercel within tight deadlines.',
      'Strict TypeScript typing across 100% of frontend components and backend DTOs.',
      'Comprehensive documentation with live demo credentials and walkthrough video.',
      'Proactive error boundary resilience and responsive feedback toasts.'
    ]
  }
];

export function HireMePage() {
  const [activeTab, setActiveTab] = useState('ux');
  const activeData = CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-background text-foreground relative overflow-x-hidden font-sans">
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
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
        {/* Header Title */}
        <div className="text-center space-y-3 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-6 duration-500">
          <div className="flex justify-center">
            <Logo className="w-14 h-14 sm:w-16 sm:h-16 text-slate-900 dark:text-slate-100 drop-shadow-md transition-transform duration-500 hover:scale-110" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Engineer Showcase
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-[#229ED9] to-secondary bg-clip-text text-transparent">
            Why You Should Hire Dhruv
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            I don't just write code—I craft high-speed, secure, and visually captivating SaaS experiences. Here is what I bring to your engineering team:
          </p>
        </div>

        {/* Interactive Compact Switcher Card */}
        <div className="w-full bg-card/90 backdrop-blur-xl rounded-3xl border border-border/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border/50 bg-muted/40 p-1.5 gap-1.5">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-background text-foreground shadow-md scale-[1.02]' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
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

          {/* Active Tab Content */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {activeData.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
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
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dhruvdaberao@gmail.com&su=Interview%20Invitation%20-%20AI47Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#1d8ac0] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" /> Hire Dhruv Now
              </a>
              <a 
                href="https://linkedin.com/in/dhruvdaberao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="LinkedIn Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
