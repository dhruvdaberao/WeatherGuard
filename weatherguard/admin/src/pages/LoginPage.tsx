import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { GitHubLoginButton } from '../components/auth/GitHubLoginButton';
import { Lock, X, Eye, EyeOff, Mail, Briefcase } from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
);
import { Logo } from '../components/shared/Logo';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const { isAuthenticated, adminLogin, user } = useAuth();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsLoggingIn(true);
    try {
      await adminLogin(adminPassword);
    } catch (err: any) {
      setAdminError('Invalid admin password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-background text-foreground relative overflow-hidden font-sans">
      {/* Subtle Background Gradients */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-repeat opacity-40 dark:opacity-20 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_90%)]" style={{ backgroundImage: `url(/quirky-child-weather.png)`, backgroundSize: '800px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] dark:bg-secondary/5"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-6 relative z-10 w-full max-w-md mx-auto">
        <div className="w-full space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          
          {/* Header Section */}
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="flex justify-center group">
              <Logo className="text-slate-900 dark:text-slate-100 w-12 h-12 sm:w-16 sm:h-16 drop-shadow-md transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-1" />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="font-bubble text-3xl sm:text-4xl md:text-5xl font-bold tracking-normal flex flex-wrap items-center justify-center text-center">
                <span className="text-secondary drop-shadow-sm">WEATHER</span>
                <span className="text-primary mx-1 sm:mx-1.5">-</span>
                <span className="text-primary drop-shadow-sm">GUARD</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-lg mx-auto px-2">
                Enterprise-grade weather intelligence and automated alert workflows.
              </p>
              <div className="text-[11px] sm:text-xs text-muted-foreground/80 leading-tight pt-0.5">
                <p>Assignment Project for AI47Labs.</p>
                <p>Designed and developed by Dhruv Daberao.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3 w-full pt-1">
            <GoogleLoginButton />
            <GitHubLoginButton />
            <Button 
              variant="outline" 
              className="w-full relative h-11 sm:h-12 flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 uppercase font-semibold tracking-wide text-xs sm:text-[13px]" 
              onClick={() => setIsAdminModalOpen(true)}
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-muted-foreground" />
              <span>Admin Login</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-2.5 px-4 relative z-10 border-t border-border/40 bg-background/50 backdrop-blur-md shrink-0">
        <div className="max-w-md mx-auto flex flex-col items-center gap-2">
          <Link 
            to="/hire-me" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#229ED9] to-[#1d8ac0] text-white font-bold text-sm sm:text-base shadow-md shadow-[#229ED9]/20 hover:shadow-lg hover:shadow-[#229ED9]/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Why you should hire me?</span>
          </Link>

          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 text-[11px] sm:text-xs font-medium text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Privacy Policy</Link>
            <button onClick={() => setIsContactModalOpen(true)} className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Contact Me</button>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-background border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex flex-row justify-between items-center border-b border-border/50">
              <h2 className="font-heading text-xl font-semibold">Admin Access</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" onClick={() => setIsAdminModalOpen(false)}>
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="px-6 py-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you are an administrator, please enter your secure password to continue.
                  <span className="block mt-2.5 p-2 bg-[#229ED9]/10 border border-[#229ED9]/20 rounded-lg text-[#229ED9] font-mono text-xs font-semibold text-center select-all">
                    Demo Admin Password: admin@123
                  </span>
                </p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2 relative">
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="* * * * * * * *" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      autoFocus
                      className="h-12 bg-muted/50 border-border pr-12 font-mono tracking-widest text-lg placeholder:tracking-normal placeholder:text-sm"
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {adminError && <p className="text-sm text-destructive font-medium">{adminError}</p>}
                </div>
                <Button type="submit" className="w-full h-12 font-medium" disabled={!adminPassword || isLoggingIn}>
                  {isLoggingIn ? 'Verifying...' : 'Login'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-background border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex flex-row justify-between items-center border-b border-border/50">
              <h2 className="font-heading text-xl font-semibold">Get in Touch</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" onClick={() => setIsContactModalOpen(false)}>
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dhruvdaberao@gmail.com"
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground truncate">dhruvdaberao@gmail.com</p>
                </div>
              </a>
              
              <a 
                href="https://linkedin.com/in/dhruvdaberao" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground">LinkedIn</h3>
                  <p className="text-sm text-muted-foreground truncate">linkedin.com/in/dhruvdaberao</p>
                </div>
              </a>

              <a 
                href="https://github.com/dhruvdaberao" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900/10 text-slate-900 dark:bg-slate-100/10 dark:text-slate-100 flex items-center justify-center shrink-0">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground">GitHub</h3>
                  <p className="text-sm text-muted-foreground truncate">github.com/dhruvdaberao</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
