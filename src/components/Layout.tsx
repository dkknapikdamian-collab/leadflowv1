import { ReactNode } from 'react';
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
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace';
import { parseISO, differenceInDays } from 'date-fns';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const user = auth.currentUser;
  const { workspace, hasAccess } = useWorkspace();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dziś', path: '/' },
    { icon: Users, label: 'Leady', path: '/leads' },
    { icon: CheckSquare, label: 'Zadania', path: '/tasks' },
    { icon: Calendar, label: 'Kalendarz', path: '/calendar' },
    { icon: Briefcase, label: 'Sprawy', path: '/cases' },
    { icon: History, label: 'Aktywność', path: '/activity' },
    { icon: CreditCard, label: 'Rozliczenia', path: '/billing' },
    { icon: Settings, label: 'Ustawienia', path: '/settings' },
  ];

  const trialDaysLeft = workspace?.trialEndsAt ? differenceInDays(parseISO(workspace.trialEndsAt), new Date()) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            Close Flow
          </h1>
          <Button variant="ghost" size="icon" className="md:hidden"><Menu className="w-6 h-6" /></Button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-11 rounded-xl px-4 transition-all ${
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
          })}
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
              {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
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

      <main className="flex-1 flex flex-col min-w-0 relative">
        {workspace && !hasAccess && (
          <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-center gap-3 sticky top-0 z-30 shadow-lg">
            <AlertTriangle className="w-4 h-4" />
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
    </div>
  );
}
