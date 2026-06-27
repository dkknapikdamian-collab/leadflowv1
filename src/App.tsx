import { lazy, Suspense, type ComponentType, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import NotificationRuntime from './components/NotificationRuntime';
import { Toaster } from './components/ui/sonner';

import { TooltipProvider } from './components/ui/tooltip';
import { fetchMeFromSupabase, isSupabaseConfigured } from './lib/supabase-fallback';
import { clearClientAuthSnapshot, setClientAuthSnapshot } from './lib/client-auth';
import { useSupabaseSession } from './hooks/useSupabaseSession';
import { isSupabaseEmailVerificationRequiredForUser, signOutFromSupabase } from './lib/supabase-auth';
import { clearCloseFlowAuthIntent, consumeCloseFlowAuthNotice, setCloseFlowAuthNotice } from './lib/auth-intent';
import { toast } from 'sonner';
import { AppChunkErrorBoundary } from './components/AppChunkErrorBoundary';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import EmailVerificationGate from './components/EmailVerificationGate';
import ClientDetailStatic from './pages/ClientDetail';
import LeadDetailStatic from './pages/LeadDetail';
import { CLOSEFLOW_ROUTES, caseDetailPath, loginPath, templatesPath, todayPath } from './lib/routes';
import './styles/closeflow-visual-source-truth.css';
import './styles/closeflow-action-tokens.css';
import './styles/closeflow-action-clusters.css';
import './styles/closeflow-form-actions.css';
import './styles/closeflow-card-readability.css';
import './styles/closeflow-surface-tokens.css';
import './styles/closeflow-modal-visual-system.css';
import './styles/closeflow-metric-tiles.css';
import './styles/closeflow-page-header.css';
import './styles/closeflow-list-row-tokens.css';
import './styles/closeflow-alert-severity.css';
import './styles/finance/closeflow-finance.css';
import './styles/closeflow-right-rail-source-truth.css';
import './styles/closeflow-command-actions-source-truth.css';
import './styles/closeflow-page-header-copy-source-truth.css';
import './styles/closeflow-page-header-action-semantics-packet1.css';
import './styles/closeflow-search-source-truth-stage134.css';
import './styles/closeflow-right-rail-heading-source-truth-stage135.css';
import './styles/closeflow-clean-desktop-app-shell-canvas-stage149.css';
import './styles/closeflow-panel-typography-and-width-source-truth-stage150.css';
import './styles/closeflow-compact-cards-source-truth-stage151.css';
import './styles/closeflow-dense-cards-80-percent-target-stage152.css';
import './styles/closeflow-real-density-tokens-no-zoom-stage156.css';
// STAGE200 disabled legacy visual/sidebar layer: import './styles/closeflow-viewport-zoom-80-source-truth-stage157.css';
import './styles/closeflow-overlay-portal-density-stage158.css';
import './styles/closeflow-overlay-real-density-and-footer-stage159.css';
import './styles/closeflow-modal-center-and-compact-all-stage160.css';
import './styles/closeflow-cf-modal-surface-center-fix-stage161.css';
import './styles/closeflow-cf-modal-surface-lower-smaller-stage162.css';
import './styles/closeflow-cf-modal-main-center-tall-compact-stage163.css';
import './styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css';
import './styles/closeflow-modal-unified-event-motif-source-truth-stage165.css';
import './styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css';
import './styles/closeflow-topic-contact-picker-readable-stage169.css';
import './styles/closeflow-task-dialog-relation-and-field-readability-stage170.css';
import './styles/closeflow-remove-modal-helper-copy-stage171.css';
import './styles/closeflow-global-client-create-dialog-stage172.css';
import './styles/closeflow-main-search-source-truth-stage173.css';
import './styles/closeflow-main-search-surface-and-text-normalization-stage174.css';
import './styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css';
import './styles/closeflow-leads-clients-list-layout-source-truth-stage177.css';
import './styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css';
import './styles/closeflow-secondary-pages-full-width-stage181ad.css';
import './styles/closeflow-app-viewport-scale-75-stage201.css';
import './styles/closeflow-ops-badges-and-icons-stretch-stage204.css';
import './styles/stage231h-r1e-case-finance-correction-modal-final.css';

const FORCE_LOGOUT_NOTICE_SESSION_KEY = 'closeflow:force-logout-notice';
const STAGE228R21_LEADDETAIL_STATIC_IMPORT_UNBLOCK = 'LeadDetail is statically imported to bypass lazy export/chunk runtime failure';
void STAGE228R21_LEADDETAIL_STATIC_IMPORT_UNBLOCK;
const STAGE228R7_R6_CLIENTDETAIL_STATIC_IMPORT_UNBLOCK = 'ClientDetail is statically imported to bypass lazy export runtime failure';
void STAGE228R7_R6_CLIENTDETAIL_STATIC_IMPORT_UNBLOCK;
const CLOSEFLOW_P1A_NO_GLOBAL_FOCUS_REFRESH_2026_05_13 = 'App bootstrap sync is one-shot; no focus/visibility/interval profile refresh on protected pages';

type LazyPageModule = { default?: ComponentType<any>; [key: string]: any };

const lazyPage = (loader: () => Promise<LazyPageModule>, exportName: string) =>
  lazy(async () => {
    const mod = await loader();
    const component = mod?.default ?? mod?.[exportName];

    if (!component) {
      console.error('CLOSEFLOW_LAZY_PAGE_EXPORT_MISSING', {
        exportName,
        moduleKeys: mod ? Object.keys(mod) : [],
      });
      throw new Error('Missing lazy page export: ' + exportName);
    }

    return { default: component as ComponentType<any> };
  });

const PublicLanding = lazyPage(() => import('./pages/PublicLanding'), 'PublicLanding');
const LegalPrivacy = lazyPage(() => import('./pages/LegalPrivacy'), 'LegalPrivacy');
const LegalTerms = lazyPage(() => import('./pages/LegalTerms'), 'LegalTerms');
const Today = lazyPage(() => import('./pages/TodayStable'), 'TodayStable');
const Leads = lazyPage(() => import('./pages/Leads'), 'Leads');
const SalesFunnel = lazyPage(() => import('./pages/SalesFunnel'), 'SalesFunnel');
const LeadDetail = LeadDetailStatic; // STAGE228R21_LEADDETAIL_STATIC_IMPORT_UNBLOCK
const Cases = lazyPage(() => import('./pages/Cases'), 'Cases');
const CaseDetail = lazyPage(() => import('./pages/CaseDetail'), 'CaseDetail');
const Clients = lazyPage(() => import('./pages/Clients'), 'Clients');
const ClientDetail = ClientDetailStatic; // STAGE228R7_R6_CLIENTDETAIL_STATIC_IMPORT_UNBLOCK
const ClientPortal = lazyPage(() => import('./pages/ClientPortal'), 'ClientPortal');
const Activity = lazyPage(() => import('./pages/Activity'), 'Activity');
const AiDrafts = lazyPage(() => import('./pages/AiDrafts'), 'AiDrafts');
const Settings = lazyPage(() => import('./pages/Settings'), 'Settings');
const AdminAiSettings = lazyPage(() => import('./pages/AdminAiSettings'), 'AdminAiSettings');
const Login = lazyPage(() => import('./pages/Login'), 'Login');
const Tasks = lazyPage(() => import('./pages/TasksStable'), 'TasksStable');
const Calendar = lazyPage(() => import('./pages/Calendar'), 'Calendar');
const Billing = lazyPage(() => import('./pages/Billing'), 'Billing');
const SupportCenter = lazyPage(() => import('./pages/SupportCenter'), 'SupportCenter');
const NotificationsCenter = lazyPage(() => import('./pages/NotificationsCenter'), 'NotificationsCenter');
const Templates = lazyPage(() => import('./pages/Templates'), 'Templates');
const ResponseTemplates = lazyPage(() => import('./pages/ResponseTemplates'), 'ResponseTemplates');
const UiPreviewVNextFull = lazyPage(() => import('./pages/UiPreviewVNextFull'), 'UiPreviewVNextFull');
const UiPreviewVNext = lazyPage(() => import('./pages/UiPreviewVNext'), 'UiPreviewVNext');

function AppRouteFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-500 font-medium animate-pulse">Ładowanie widoku...</p>
      </div>
    </div>
  );
}

function LegacyCaseRedirect() {
  const { caseId = '' } = useParams();
  return <Navigate to={caseDetailPath(caseId)} replace />;
}

function buildLocalProfile(user: any) {
  return {
    id: user?.uid || user?.id || '',
    fullName: user?.displayName || '',
    email: user?.email || '',
    role: 'member',
    isAdmin: false,
  };
}

export default function App() {
  const [user, loading] = useSupabaseSession();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    document.title = 'CloseFlow';
  }, []);

  useEffect(() => {
    if (!user) {
      clearClientAuthSnapshot();
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setClientAuthSnapshot({
      uid: user.uid,
      email: user.email || '',
      fullName: user.displayName || '',
    });

    if (isSupabaseEmailVerificationRequiredForUser(user)) {
      setProfile(buildLocalProfile(user));
      setProfileLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setProfile(buildLocalProfile(user));
      setProfileLoading(false);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    const syncProfileFromApi = async (showLoading = false) => {
      if (showLoading) setProfileLoading(true);
      try {
        const me = await fetchMeFromSupabase();
        clearCloseFlowAuthIntent();
        if (cancelled) return;

        const nextProfile = me.profile || null;
        const forceLogoutAfter = typeof nextProfile?.forceLogoutAfter === 'string' ? nextProfile.forceLogoutAfter : '';

        if (forceLogoutAfter) {
          const authTimeMs = Date.parse(String(user.lastSignInAt || ''));
          const forceLogoutMs = Date.parse(forceLogoutAfter);

          if (Number.isFinite(authTimeMs) && Number.isFinite(forceLogoutMs) && authTimeMs < forceLogoutMs) {
            if (typeof window !== 'undefined') window.sessionStorage.setItem(FORCE_LOGOUT_NOTICE_SESSION_KEY, '1');
            clearClientAuthSnapshot();
            setProfile(null);
            if (showLoading) setProfileLoading(false);
            await signOutFromSupabase();
            return;
          }
        }

        setProfile(nextProfile);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error || '');
        if (message.includes('REGISTER_FIRST_REQUIRED')) {
          setCloseFlowAuthNotice('register_first_required');
          clearCloseFlowAuthIntent();
          clearClientAuthSnapshot();
          setProfile(null);
          if (showLoading) setProfileLoading(false);
          await signOutFromSupabase().catch((signOutError) => console.error('REGISTER_FIRST_SIGNOUT_FAILED', signOutError));
          return;
        }
        console.error('PROFILE_API_BOOTSTRAP_FAILED', error);
        setProfile(buildLocalProfile(user));
      } finally {
        if (!cancelled && showLoading) setProfileLoading(false);
      }
    };
    void syncProfileFromApi(true);

    // CLOSEFLOW_P1A_NO_GLOBAL_FOCUS_REFRESH_2026_05_13
    // Nie odswiezamy profilu w tle, na focus ani po visibilitychange.
    // Wczesniejszy globalny refresh powodowal ponowne renderowanie widokow szczegolow
    // po zmianie zakladki przegladarki i potrafil cofnieac operatora do wczesniejszego ekranu.

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(FORCE_LOGOUT_NOTICE_SESSION_KEY) !== '1') return;
    window.sessionStorage.removeItem(FORCE_LOGOUT_NOTICE_SESSION_KEY);
    toast.success('Wylogowano tę sesję po globalnym wylogowaniu.');
  }, []);

  useEffect(() => {
    const notice = consumeCloseFlowAuthNotice();
    if (notice === 'register_first_required') {
      toast.error('Nie znaleźliśmy konta CloseFlow dla tego Google. Najpierw utwórz konto w zakładce Rejestracja.');
    }
  }, []);

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-500 font-medium animate-pulse">Ładowanie aplikacji...</p>
        </div>
      </div>
    );
  }

  const isLoggedIn = Boolean(user);
  const isDevelopmentPreviewEnabled = import.meta.env.DEV;

  if (isLoggedIn && user && isSupabaseEmailVerificationRequiredForUser(user)) {
    return (
      <TooltipProvider>
        <EmailVerificationGate user={user} />
        <Toaster position="top-center" richColors closeButton />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Router>
        <AppChunkErrorBoundary>
          <Suspense fallback={<AppRouteFallback />}>
            <Routes>
              <Route path={CLOSEFLOW_ROUTES.login} element={!isLoggedIn ? <Login /> : <Navigate to={todayPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.start} element={!isLoggedIn ? <Login /> : <Navigate to={todayPath()} replace />} />
              <Route path={CLOSEFLOW_ROUTES.privacy} element={<LegalPrivacy />} />
              <Route path={CLOSEFLOW_ROUTES.terms} element={<LegalTerms />} />
              <Route path={CLOSEFLOW_ROUTES.clientPortal} element={<ClientPortal />} />
              <Route path={CLOSEFLOW_ROUTES.root} element={isLoggedIn ? <Today /> : <Login />} />
              <Route path={CLOSEFLOW_ROUTES.today} element={isLoggedIn ? <Today /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.leads} element={isLoggedIn ? <Leads /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.devFunnel} element={import.meta.env.DEV ? <SalesFunnel /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.funnel} element={isLoggedIn ? <SalesFunnel /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.leadDetail} element={isLoggedIn ? <LeadDetail /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.tasks} element={isLoggedIn ? <Tasks /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.calendar} element={isLoggedIn ? <Calendar /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.cases} element={isLoggedIn ? <Cases /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.legacyCaseDetail} element={isLoggedIn ? <LegacyCaseRedirect /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.caseDetail} element={isLoggedIn ? <CaseDetail /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.clients} element={isLoggedIn ? <Clients /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.clientDetail} element={isLoggedIn ? <ClientDetail /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.activity} element={isLoggedIn ? <Activity /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.aiDrafts} element={isLoggedIn ? <AiDrafts /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.notifications} element={isLoggedIn ? <NotificationsCenter /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.templates} element={isLoggedIn ? <Templates /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.caseTemplates} element={isLoggedIn ? <Navigate to={templatesPath()} replace /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.responseTemplates} element={isLoggedIn ? <ResponseTemplates /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.billing} element={isLoggedIn ? <Billing /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.help} element={isLoggedIn ? <SupportCenter /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.support} element={isLoggedIn ? <SupportCenter /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.adminAiSettings} element={isLoggedIn ? <AdminAiSettings /> : <Navigate to={loginPath()} />} />
              <Route path={CLOSEFLOW_ROUTES.settings} element={isLoggedIn ? <Settings /> : <Navigate to={loginPath()} />} />
              <Route
                path={CLOSEFLOW_ROUTES.uiPreviewVNext}
                element={isDevelopmentPreviewEnabled ? <UiPreviewVNext /> : <Navigate to={loginPath()} replace />}
              />
              <Route
                path={CLOSEFLOW_ROUTES.uiPreviewVNextFull}
                element={isDevelopmentPreviewEnabled ? <UiPreviewVNextFull /> : <Navigate to={loginPath()} replace />}
              />
              <Route path="*" element={<Navigate to={todayPath()} />} />
            </Routes>
          </Suspense>
        </AppChunkErrorBoundary>
        <NotificationRuntime enabled={isLoggedIn} />
        <PwaInstallPrompt />
        <Toaster position="top-center" richColors closeButton />
      </Router>
    </TooltipProvider>
  );
}

/* PHASE0_AI_CONFIG_ROUTE_GUARD AdminAiSettings path="/settings/ai" */

/* PHASE0_AI_DRAFTS_ROUTE_GUARD AiDrafts path="/ai-drafts" */

/* STAGE16_FINAL_QA_RELEASE_CANDIDATE_2026_05_06: /today and /support route aliases are release-candidate smoke routes. */

/* STAGE231D_GOOGLE_AUTH_INTENT_GATE: / and /start show Login/Register for logged-out users; PublicLanding no longer creates a second auth entry. */
