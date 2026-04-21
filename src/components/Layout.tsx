import { ReactNode, useMemo, useState } from 'react';
import { auth } from '../firebase';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  CheckCircle2,
  Briefcase,
  History,
  Calendar,
  CheckSquare,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Menu,
  X,
  LifeBuoy,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace';
import { parseISO, differenceInDays } from 'date-fns';

interface LayoutProps {
  children: ReactNode;
}

type NavItem = {
  icon: any;
  label: string;
  path: string;
};

function NavButton({ item, isActive, compact = false, onNavigate }: { item: NavItem; isActive: boolean; compact?: boolean; onNavigate?: () => void }) {
  return (
    <Link key={item.path} to={item.path} onClick={onNavigate}>
      <Button
        variant="ghost"
        className={`w-full justify-start gap-3 ${compact ? 'h-10 rounded-lg px-3 text-sm' : 'h-11 rounded-xl px-4'} transition-all ${
          isActive
            ? 'bg-primary/5 text-primary font-bold'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
        {item.label}
      </Button>
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const user = auth.currentUser;
  const { workspace, hasAccess } = useWorkspace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dziś', path: '/' },
    { icon: Users, label: 'Leady', path: '/leads' },
    { icon: CheckSquare, label: 'Zadania', path: '/tasks' },
    { icon: Calendar, label: 'Kalendarz', path: '/calendar' },
    { icon: Briefcase, label: 'Sprawy', path: '/cases' },
    { icon: History, label: 'Aktywność', path: '/activity' },
    { icon: CreditCard, label: 'Rozliczenia', path: '/billing' },
    { icon: LifeBuoy, label: 'Pomoc', path: '/help' },
    { icon: Settings, label: 'Ustawienia', path: '/settings' },
  ];

  const mobileNavItems = useMemo(() => navItems.slice(0, 4), [navItems]);
  const trialDaysLeft = workspace?.trialEndsAt ? differenceInDays(parseISO(workspace.trialEndsAt), new Date()) : 0;

  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="hidden md:flex md:w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            Close Flow
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavButton key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </nav>

        {workspace?.subscriptionStatus === 'trial_active' && (
          <div className="px-4 py-3 mx-4 mb-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Trial</p>
              <p className="text-[10px] font-bold text-indigo-600">{trialDaysLeft} dni</p>
            </div>
            <div className="w-full bg-indigo-200 h-1 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all"
                style={{ width: `${Math.max(0, Math.min(100, (trialDaysLeft / 14) * 100))}%` }}
              />
            </div>
            <Link to="/billing" className="mt-2 text-[10px] font-bold text-indigo-700 flex items-center gap-1 hover:underline">
              Ulepsz konto <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.displayName || 'Użytkownik'}</p>
              <p className="text-[10px] text-slate-500 truncate font-medium">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-4"
            onClick={() => auth.signOut()}
          >
            <LogOut className="w-5 h-5" />
            Wyloguj się
          </Button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="min-w-0 flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 truncate">Close Flow</span>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="md:hidden fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileMenuOpen(false)} aria-label="Zamknij menu" />
          <div className="absolute right-0 top-0 h-full w-[84%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="bg-primary p-1.5 rounded-lg shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-bold text-slate-900 truncate">Close Flow</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.displayName || 'Użytkownik'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path}
                  compact
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>

            {workspace?.subscriptionStatus === 'trial_active' && (
              <div className="mx-4 mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Trial</span>
                  <span className="text-[10px] font-bold text-indigo-600">{trialDaysLeft} dni</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-indigo-200">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${Math.max(0, Math.min(100, (trialDaysLeft / 14) * 100))}%` }}
                  />
                </div>
                <Link to="/billing" onClick={() => setMobileMenuOpen(false)} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-700">
                  Ulepsz konto <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            <div className="p-4 border-t border-slate-100">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-4"
                onClick={() => auth.signOut()}
              >
                <LogOut className="w-5 h-5" />
                Wyloguj się
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="flex-1 min-w-0 relative pt-16 pb-20 md:pt-0 md:pb-0">
        {workspace && !hasAccess && (
          <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-center gap-3 sticky top-16 md:top-0 z-30 shadow-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-sm font-bold">Twój okres próbny wygasł. Niektóre funkcje są zablokowane.</p>
            <Link to="/billing">
              <Button size="sm" variant="secondary" className="h-7 text-xs font-bold rounded-lg px-4">
                Wybierz plan
              </Button>
            </Link>
          </div>
        )}
        {children}
      </main>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-semibold ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}>
                <item.icon className="mb-1 h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
