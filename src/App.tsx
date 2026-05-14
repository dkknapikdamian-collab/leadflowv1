import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotificationRuntime from './components/NotificationRuntime';
import { Toaster } from './components/ui/sonner';
import { Suspense, lazy, useEffect, useState } from 'react';
import { TooltipProvider } from './components/ui/tooltip';
import { fetchMeFromSupabase, isSupabaseConfigured } from './lib/supabase-fallback';
import { clearClientAuthSnapshot, setClientAuthSnapshot } from './lib/client-auth';
import { useSupabaseSession } from './hooks/useSupabaseSession';
import { isSupabaseEmailVerificationRequiredForUser, signOutFromSupabase } from './lib/supabase-auth';
import { toast } from 'sonner';
import { AppChunkErrorBoundary } from './components/AppChunkErrorBoundary';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import EmailVerificationGate from './components/EmailVerificationGate';
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
import './styles/closeflow-right-rail-source-truth.css';

import './styles/closeflow-command-actions-source-truth.css';
import './styles/closeflow-page-header-copy-source-truth.css';
import './styles/closeflow-page-header-action-semantics-packet1.css';
const FORCE_LOGOUT_NOTICE_SESSION_KEY = 'closeflow:force-logout-notice';
const CLOSEFLOW_P1A_NO_GLOBAL_FOCUS_REFRESH_2026_05_13 = 'App bootstrap sync is one-shot; no focus/visibility/interval profile refresh on protected pages';

const PublicLanding = lazy(() => import('./pages/PublicLanding'));
const Today = lazy(() => import('./pages/TodayStable'));
const Leads = lazy(() => import('./pages/Leads'));
const LeadDetail = lazy(() => import('./pages/LeadDetail'));
const Cases = lazy(() => import('./pages/Cases'));
const CaseDetail = lazy(() => import('./pages/CaseDetail'));
const Clients = lazy(() => import('./pages/Clients'));
const ClientDetail = lazy(() => import('./pages/ClientDetail'));
const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const Activity = lazy(() => import('./pages/Activity'));
const AiDrafts = lazy(() => import('./pages/AiDrafts'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminAiSettings = lazy(() => import('./pages/AdminAiSettings'));
const Login = lazy(() => import('./pages/Login'));
const Tasks = lazy(() => import('./pages/TasksStable'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Billing = lazy(() => import('./pages/Billing'));
const SupportCenter = lazy(() => import('./pages/SupportCenter'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));
const Templates = lazy(() => import('./pages/Templates'));
const ResponseTemplates = lazy(() => import('./pages/ResponseTemplates'));
const UiPreviewVNextFull = lazy(() => import('./pages/UiPreviewVNextFull'));
const UiPreviewVNext = lazy(() => import('./pages/UiPreviewVNext'));

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
              <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
              <Route path="/start" element={!isLoggedIn ? <PublicLanding /> : <Navigate to="/" />} />
              <Route path="/portal/:caseId/:token" element={<ClientPortal />} />
              <Route path="/" element={isLoggedIn ? <Today /> : <PublicLanding />} />
              <Route path="/today" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />
              <Route path="/leads" element={isLoggedIn ? <Leads /> : <Navigate to="/login" />} />
              <Route path="/leads/:leadId" element={isLoggedIn ? <LeadDetail /> : <Navigate to="/login" />} />
              <Route path="/tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/login" />} />
              <Route path="/calendar" element={isLoggedIn ? <Calendar /> : <Navigate to="/login" />} />
              <Route path="/cases" element={isLoggedIn ? <Cases /> : <Navigate to="/login" />} />
              <Route path="/case/:caseId" element={isLoggedIn ? <CaseDetail /> : <Navigate to="/login" />} />
              <Route path="/cases/:caseId" element={isLoggedIn ? <CaseDetail /> : <Navigate to="/login" />} />
              <Route path="/clients" element={isLoggedIn ? <Clients /> : <Navigate to="/login" />} />
              <Route path="/clients/:clientId" element={isLoggedIn ? <ClientDetail /> : <Navigate to="/login" />} />
              <Route path="/activity" element={isLoggedIn ? <Activity /> : <Navigate to="/login" />} />
              <Route path="/ai-drafts" element={isLoggedIn ? <AiDrafts /> : <Navigate to="/login" />} />
              <Route path="/notifications" element={isLoggedIn ? <NotificationsCenter /> : <Navigate to="/login" />} />
              <Route path="/templates" element={isLoggedIn ? <Templates /> : <Navigate to="/login" />} />
              <Route path="/case-templates" element={isLoggedIn ? <Navigate to="/templates" replace /> : <Navigate to="/login" />} />
              <Route path="/response-templates" element={isLoggedIn ? <ResponseTemplates /> : <Navigate to="/login" />} />
              <Route path="/billing" element={isLoggedIn ? <Billing /> : <Navigate to="/login" />} />
              <Route path="/help" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />
              <Route path="/support" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />
              <Route path="/settings/ai" element={isLoggedIn ? <AdminAiSettings /> : <Navigate to="/login" />} />
              <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/ui-preview-vnext" element={<UiPreviewVNext />} />
              <Route path="/ui-preview-vnext-full" element={<UiPreviewVNextFull />} />
              <Route path="*" element={<Navigate to="/" />} />
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

/* CLOSEFLOW_PUBLIC_LANDING_ROUTE: / shows PublicLanding for logged-out users and Today for logged-in users. */
