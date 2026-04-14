import { ReactNode, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  BarChart3,
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
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace';
import { differenceInDays, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { useAppearance } from './appearance-provider';

interface LayoutProps {
  children: ReactNode;
}

type NavItem = {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  mobile?: boolean;
};

function isPathActive(currentPath: string, itemPath: string) {
  if (itemPath === '/') {
    return currentPath === '/';
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const user = auth.currentUser;
  const { workspace, hasAccess, accessMeta, accessState } = useWorkspace();
  const { skin } = useAppearance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = useMemo<NavItem[]>(() => [
    { icon: LayoutDashboard, label: 'Dziś', path: '/', mobile: true },
    { icon: BarChart3, label: 'Panel', path: '/dashboard' },
    { icon: Users, label: 'Leady', path: '/leads', mobile: true },
    { icon: CheckSquare, label: 'Zadania', path: '/tasks', mobile: true },
    { icon: Calendar, label: 'Kalendarz', path: '/calendar', mobile: true },
    { icon: Briefcase, label: 'Sprawy', path: '/cases', mobile: true },
    { icon: History, label: 'Aktywność', path: '/activity' },
    { icon: CreditCard, label: 'Rozliczenia', path: '/billing' },
    { icon: Settings, label: 'Ustawienia', path: '/settings' },
  ], []);

  const mobileNavItems = navItems.filter((item) => item.mobile);
  const trialDaysLeft = workspace?.trialEndsAt
    ? Math.max(0, differenceInDays(parseISO(workspace.trialEndsAt), new Date()))
    : 0;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between border-b app-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm app-primary-chip">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold app-text">Forteca</p>
            <p className="text-xs app-muted">System uruchamiania klienta</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-xl"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = isPathActive(location.pathname, item.path);
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  'h-11 w-full justify-start gap-3 rounded-2xl px-4 font-medium transition-all',
                  isActive ? 'app-nav-active' : 'hover:bg-black/5 dark:hover:bg-white/5'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'opacity-100' : 'opacity-70')} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {(accessState === 'trial_active' || accessState === 'trial_ending') && (
        <div className="mx-4 mb-4 rounded-2xl border app-border p-3 app-surface-strong app-shadow">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] app-muted">Trial</span>
            <span className="rounded-full px-2 py-1 text-[10px] font-bold app-primary-chip">{trialDaysLeft} dni</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(6, Math.min(100, (trialDaysLeft / 7) * 100))}%`,
                backgroundColor: 'var(--app-primary)',
              }}
            />
          </div>
          <Link
            to="/billing"
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold"
            style={{ color: 'var(--app-primary)' }}
          >
            Rozliczenia <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      <div className="border-t app-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border app-border px-3 py-3 app-surface-strong">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-sm font-bold dark:bg-white/10">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold app-text">{user?.displayName || 'Użytkownik'}</p>
            <p className="truncate text-[11px] app-muted">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-11 w-full justify-start gap-3 rounded-2xl px-4 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
          onClick={() => auth.signOut()}
        >
          <LogOut className="h-5 w-5" />
          Wyloguj się
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen app-shell-bg md:flex">
      <header className="sticky top-0 z-40 border-b app-border app-sidebar backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] app-muted">{skin.replace('-', ' ')}</p>
            <h1 className="text-base font-bold app-text">Forteca</h1>
          </div>
          <div className="flex items-center gap-2">
            {(accessState === 'trial_active' || accessState === 'trial_ending') && (
              <Link to="/billing">
                <div className="rounded-full px-3 py-1 text-[11px] font-semibold app-primary-chip">
                  Trial {trialDaysLeft} dni
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className={cn(
        'fixed inset-0 z-50 md:hidden',
        mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
        <div
          className={cn(
            'absolute inset-0 bg-slate-950/40 transition-opacity',
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside
          className={cn(
            'absolute left-0 top-0 h-full w-[86vw] max-w-[340px] border-r app-sidebar app-shadow transition-transform duration-200',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">{sidebarContent}</div>
        </aside>
      </div>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r app-sidebar backdrop-blur-xl md:block">
        <div className="flex h-full flex-col">{sidebarContent}</div>
      </aside>

      <main className="relative min-w-0 flex-1 pb-24 md:pb-0">
        {workspace && !hasAccess && (
          <div className="sticky top-[57px] z-30 border-b border-rose-500/20 bg-rose-500 px-4 py-2 text-white shadow-lg md:top-0">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p className="text-sm font-semibold">{accessMeta.blockedReason}</p>
              <Link to="/billing">
                <Button size="sm" variant="secondary" className="h-8 rounded-xl px-4 text-xs font-semibold text-slate-900">
                  Odblokuj zapis
                </Button>
              </Link>
            </div>
          </div>
        )}
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t app-border app-sidebar px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const isActive = isPathActive(location.pathname, item.path);
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={cn(
                    'flex min-h-[60px] flex-col items-center justify-center rounded-2xl px-1 text-center transition-all',
                    isActive ? 'app-nav-active' : 'app-muted'
                  )}
                >
                  <item.icon className="mb-1 h-4 w-4" />
                  <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
