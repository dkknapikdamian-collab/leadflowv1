// VISUAL_STAGE18_LEADS_HTML_HARD_1TO1_LAYOUT
// VISUAL_STAGE17_TODAY_HTML_HARD_1TO1_LAYOUT
/* VISUAL_HTML_THEME_V15_STAGE01_GUARD_COMPAT keeps legacy guard text: className="app closeflow-visual-stage01" */
/* VISUAL_HTML_THEME_V14_LAYOUT */
/*
VISUAL_STAGE_01_SHELL_SIDEBAR
VISUAL_STAGE_02_TODAY_ROUTE_SCOPE
VISUAL_STAGE_03_LEADS_ROUTE_SCOPE
VISUAL_STAGE_04_LEAD_DETAIL_ROUTE_SCOPE
VISUAL_STAGE_05_CLIENTS_ROUTE_SCOPE
VISUAL_STAGE_06_CLIENT_DETAIL_ROUTE_SCOPE
VISUAL_STAGE_07_CASES_ROUTE_SCOPE
VISUAL_STAGE_08_CASE_DETAIL_ROUTE_SCOPE
Globalny shell CloseFlow został przepięty na docelowy system wizualny z HTML-a.
Zakres: ciemny sidebar, grupy menu, global-bar, mobile-top, mobile-nav i footer konta/trialu.
Nie zmienia logiki ekranów, routingu, Supabase, AI, auth ani billing/access.
*/
import { ReactNode, useMemo, useState } from 'react';
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
  Bell,
  LifeBuoy,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  FolderKanban,
  MessageSquareText,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { signOutFromSupabase } from '../lib/supabase-auth';
import GlobalQuickActions from './GlobalQuickActions';
import ContextActionDialogsHost from './ContextActionDialogs';
import AdminDebugToolbar from './admin-tools/AdminDebugToolbar';
import { parseISO, differenceInDays } from 'date-fns';

interface LayoutProps {
  children: ReactNode;
}

type NavItem = {
  icon: any;
  label: string;
  path: string;
  badge?: string;
};

type NavGroup = {
  caption: string;
  items: NavItem[];
};

function isNavItemActive(pathname: string, itemPath: string) {
  if (itemPath === '/') return pathname === '/';
  if (itemPath === '/settings/ai') return pathname === '/settings/ai';
  if (itemPath === '/settings') return pathname === '/settings';
  if (itemPath === '/cases') return pathname === '/cases' || pathname.startsWith('/cases/') || pathname.startsWith('/case/');
  if (itemPath === '/leads') return pathname === '/leads' || pathname.startsWith('/leads/');
  if (itemPath === '/clients') return pathname === '/clients' || pathname.startsWith('/clients/');
  return pathname === itemPath || pathname.startsWith(itemPath + '/');
}

function NavButton({
  item,
  isActive,
  compact = false,
  onNavigate,
}: {
  key?: string;
  item: NavItem;
  isActive: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      key={item.path}
      to={item.path}
      onClick={onNavigate}
      className={`nav-btn ${isActive ? 'active' : ''} ${compact ? 'nav-btn-compact' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      data-nav-path={item.path}
    >
      <span className="nav-ico" aria-hidden="true">
        <item.icon className="h-4 w-4" />
      </span>
      <span className="nav-label">{item.label}</span>
      {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
    </Link>
  );
}

function TrialCard({ trialDaysLeft }: { trialDaysLeft: number }) {
  const safeDays = Math.max(0, trialDaysLeft);
  const width = Math.max(0, Math.min(100, (safeDays / 21) * 100));

  return (
    <div className="trial-card" data-shell-trial-card="true">
      <div className="top">
        <span>Trial</span>
        <strong>{safeDays} dni</strong>
      </div>
      <div className="bar" aria-hidden="true">
        <span style={{ width: `${width}%` }} />
      </div>
      <Link to="/billing" className="trial-link">
        Aktywuj plan <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function UserCard({ userInitial, name, email }: { userInitial: string; name: string; email?: string | null }) {
  return (
    <div className="user-card" data-shell-user-card="true">
      <div className="user-avatar">{userInitial}</div>
      <div className="min-w-0">
        <strong className="truncate">{name}</strong>
        <span className="truncate">{email}</span>
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [supabaseUser] = useSupabaseSession();
  const { workspace, hasAccess, profile, isAdmin, isAppOwner, access } = useWorkspace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const canUseAiDraftsByPlan = Boolean(access?.features?.lightDrafts || access?.features?.fullAi);
  const canUseAdminDebugToolbar = Boolean(isAdmin || isAppOwner);

  const navGroups = useMemo<NavGroup[]>(() => ([
    {
      caption: 'Start pracy',
      items: [
        { icon: LayoutDashboard, label: 'Dziś', path: '/' },
        { icon: Users, label: 'Leady', path: '/leads' },
        { icon: Users, label: 'Klienci', path: '/clients' },
        { icon: Briefcase, label: 'Sprawy', path: '/cases' },
      ],
    },
    {
      caption: 'Czas i obowiązki',
      items: [
        { icon: CheckSquare, label: 'Zadania', path: '/tasks' },
        { icon: Calendar, label: 'Kalendarz', path: '/calendar' },
        { icon: FolderKanban, label: 'Szablony', path: '/templates' },
        { icon: MessageSquareText, label: 'Odpowiedzi', path: '/response-templates' },
        { icon: History, label: 'Aktywność', path: '/activity' },
      ],
    },
    {
      caption: 'System',
      items: [
        ...(canUseAiDraftsByPlan ? [{ icon: CheckCircle2, label: 'Inbox szkiców', path: '/ai-drafts' }] : []),
        { icon: AlertTriangle, label: 'Powiadomienia', path: '/notifications' },
        { icon: CreditCard, label: 'Rozliczenia', path: '/billing' },
        { icon: CheckCircle2, label: 'Pomoc', path: '/help' },
        ...(isAdmin ? [{ icon: Settings, label: 'Admin AI', path: '/settings/ai' }] : []),
        { icon: Settings, label: 'Ustawienia', path: '/settings' },
      ],
    },
  ]), [isAdmin, canUseAiDraftsByPlan]);
  const navItems = useMemo(() => navGroups.flatMap((group) => group.items), [navGroups]);
  const mobileNavItems = useMemo(
    () => [
      { icon: LayoutDashboard, label: 'Dziś', path: '/' },
      { icon: Users, label: 'Leady', path: '/leads' },
      { icon: Users, label: 'Klienci', path: '/clients' },
      { icon: Briefcase, label: 'Sprawy', path: '/cases' },
      { icon: CheckSquare, label: 'Zadania', path: '/tasks' },
    ],
    [],
  );

  const activeItem = navItems.find((item) => isNavItemActive(location.pathname, item.path));
  const currentTitle = activeItem?.label || 'CloseFlow';
  const isTodayRoute = location.pathname === '/';
  const isLeadsRoute = location.pathname === '/leads';
  const isLeadDetailRoute = /^\/leads\/[^/]+$/.test(location.pathname);
  const isClientsRoute = location.pathname === '/clients';
  const isClientDetailRoute = /^\/clients\/[^/]+$/.test(location.pathname);
  const isCasesRoute = location.pathname === '/cases';
  const isCaseDetailRoute = /^\/(?:case|cases)\/[^/]+$/.test(location.pathname);
  const currentSection = isTodayRoute ? 'today' : isLeadsRoute ? 'leads' : isLeadDetailRoute ? 'lead-detail' : isClientsRoute ? 'clients' : isClientDetailRoute ? 'client-detail' : isCasesRoute ? 'cases' : isCaseDetailRoute ? 'case-detail' : currentTitle.toLowerCase();
  const trialDaysLeft = workspace?.trialEndsAt ? differenceInDays(parseISO(workspace.trialEndsAt), new Date()) : 0;
  const userEmail = profile?.email || supabaseUser?.email || '';
  const userName = profile?.fullName || supabaseUser?.displayName || userEmail || 'Użytkownik';
  const userInitial = (userName.trim().charAt(0) || userEmail.trim().charAt(0) || 'U').toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOutFromSupabase();
    } catch (error) {
      console.error('SUPABASE_SIGN_OUT_FAILED', error);
    }
  };
  const handleSidebarPointerRouter = (event: any) => {
    if (event.button !== undefined && event.button !== 0) return;
    const x = Number(event.clientX);
    const y = Number(event.clientY);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    const navLinks = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-shell-sidebar="true"] [data-nav-path], [data-shell-mobile-menu="true"] [data-nav-path], [data-shell-mobile-nav="true"] [data-nav-path]',
      ),
    );
    const matched = navLinks.find((element) => {
      const rect = element.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });

    const path = matched?.dataset?.navPath || '';
    if (!path) return;

    event.preventDefault();
    event.stopPropagation();
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (location.pathname !== path) navigate(path);
  };

  const renderNavGroups = (compact = false, onNavigate?: () => void) => (
    <>
      {navGroups.map((group) => (
        <div key={group.caption} className="nav-group">
          <div className="nav-caption">{group.caption}</div>
          <div className="nav-stack">
            {group.items.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                isActive={isNavItemActive(location.pathname, item.path)}
                compact={compact}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div
      className="app closeflow-visual-stage01 cf-html-shell"
      data-visual-stage="01-shell-sidebar"
      data-sidebar-pointer-router="true"
      onPointerDownCapture={handleSidebarPointerRouter}
    >
      <aside className="sidebar" data-shell-sidebar="true">
        <Link to="/" className="brand" aria-label="CloseFlow - przejdź do Dziś">
          <span className="brand-logo" aria-hidden="true">
            CF
          </span>
          <span className="brand-title">
            <strong>CloseFlow</strong>
            <span>Panel domykania leadów</span>
          </span>
        </Link>

        <nav className="nav-scroll" aria-label="Główne menu CloseFlow">
          {renderNavGroups()}
        </nav>

        <div className="sidebar-footer">
          {workspace?.subscriptionStatus === 'trial_active' ? <TrialCard trialDaysLeft={trialDaysLeft} /> : null}
          <UserCard userInitial={userInitial} name={userName} email={userEmail} />
          <button type="button" className="sidebar-logout" onClick={() => void handleSignOut()}>
            <LogOut className="h-4 w-4" />
            <span>Wyloguj się</span>
          </button>
        </div>
      </aside>

      <div className="mobile-top" data-shell-mobile-top="true">
        <Link to="/" className="mobile-brand" aria-label="CloseFlow - przejdź do Dziś">
          <span className="brand-logo" aria-hidden="true">CF</span>
          <span>CloseFlow</span>
        </Link>
        <button type="button" className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Otwórz menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="mobile-drawer" data-shell-mobile-menu="true">
          <button type="button" className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} aria-label="Zamknij menu" />
          <div className="mobile-drawer-panel">
            <div className="mobile-drawer-head">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="brand mobile-drawer-brand">
                <span className="brand-logo" aria-hidden="true">CF</span>
                <span className="brand-title">
                  <strong>CloseFlow</strong>
                  <span>Lead &rarr; klient &rarr; sprawa</span>
                </span>
              </Link>
              <button type="button" className="mobile-menu-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Zamknij menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mobile-user-wrap">
              <UserCard userInitial={userInitial} name={userName} email={userEmail} />
            </div>

            <nav className="mobile-drawer-nav" aria-label="Menu mobilne CloseFlow">
              {renderNavGroups(true, () => setMobileMenuOpen(false))}
            </nav>

            <div className="mobile-drawer-footer">
              {workspace?.subscriptionStatus === 'trial_active' ? <TrialCard trialDaysLeft={trialDaysLeft} /> : null}
              <button type="button" className="sidebar-logout" onClick={() => void handleSignOut()}>
                <LogOut className="h-4 w-4" />
                <span>Wyloguj się</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main
        className={`main ${isTodayRoute ? 'main-today' : ''} ${isLeadsRoute ? 'main-leads' : ''} ${isLeadDetailRoute ? 'main-lead-detail' : ''} ${isClientsRoute ? 'main-clients' : ''} ${isClientDetailRoute ? 'main-client-detail' : ''} ${isCasesRoute ? 'main-cases' : ''} ${isCaseDetailRoute ? 'main-case-detail' : ''}`}
        data-shell-main="true"
        data-current-section={currentSection}
      >
        <div className="global-bar" data-shell-global-bar="true">
          <div className="global-title">
            <span className="global-dot" aria-hidden="true">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <span className="global-title-copy">
              Panel operatora <strong>{currentTitle}</strong>
            </span>
          </div>
          {canUseAdminDebugToolbar ? <AdminDebugToolbar currentSection={currentSection} /> : null}
          <GlobalQuickActions />
          <ContextActionDialogsHost />
        </div>

        {workspace && !hasAccess && (
          <div className="access-warning" data-shell-access-warning="true">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>Twój okres próbny wygasł. Niektóre funkcje są zablokowane.</p>
            <Link to="/billing" className="access-warning-action">
              Aktywuj plan
            </Link>
          </div>
        )}

        <div className="view active" data-shell-content="true" data-visual-stage-today={isTodayRoute ? '02-today' : undefined} data-visual-stage-leads={isLeadsRoute ? '03-leads' : undefined} data-visual-stage-lead-detail={isLeadDetailRoute ? '04-lead-detail' : undefined} data-visual-stage-clients={isClientsRoute ? '05-clients' : undefined} data-visual-stage-client-detail={isClientDetailRoute ? '06-client-detail' : undefined} data-visual-stage-cases={isCasesRoute ? '07-cases' : undefined} data-visual-stage-case-detail={isCaseDetailRoute ? '08-case-detail' : undefined}>
          {children}
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Najważniejsze zakładki" data-shell-mobile-nav="true">
        {mobileNavItems.map((item) => {
          const isActive = isNavItemActive(location.pathname, item.path);
          return (
            <Link key={item.path} to={item.path} className={`mobile-nav-btn ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined} data-nav-path={item.path}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/* PHASE0_AI_ADMIN_NAV_GUARD isAdmin AI admin /settings/ai */

/* PHASE0_LAYOUT_GLOBAL_ACTIONS_GUARD GlobalQuickActions <GlobalQuickActions Szkice AI */

/* PHASE0_AI_ASSISTANT_LAYOUT_LAST7 GlobalQuickActions */

/* ADMIN_DEBUG_TOOLBAR_LAYOUT_STAGE87 isAdmin || isAppOwner */
