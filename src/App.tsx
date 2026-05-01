import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotificationRuntime from './components/NotificationRuntime';
import { Toaster } from './components/ui/sonner';
import { Suspense, lazy, useEffect, useState } from 'react';
import { TooltipProvider } from './components/ui/tooltip';
import { fetchMeFromSupabase, isSupabaseConfigured } from './lib/supabase-fallback';
import { clearClientAuthSnapshot, setClientAuthSnapshot } from './lib/client-auth';
import { useSupabaseSession } from './hooks/useSupabaseSession';
import { signOutFromSupabase } from './lib/supabase-auth';
import { toast } from 'sonner';
import { AppChunkErrorBoundary } from './components/AppChunkErrorBoundary';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

const FORCE_LOGOUT_NOTICE_SESSION_KEY = 'closeflow:force-logout-notice';

const Today = lazy(() => import('./pages/Today'));
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
const Tasks = lazy(() => import('./pages/Tasks'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Billing = lazy(() => import('./pages/Billing'));
const SupportCenter = lazy(() => import('./pages/SupportCenter'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));
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

    const interval = window.setInterval(() => void syncProfileFromApi(false), 60_000);
    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible') void syncProfileFromApi(false);
    };

    window.addEventListener('focus', handleVisibilityRefresh);
    document.addEventListener('visibilitychange', handleVisibilityRefresh);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityRefresh);
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

  return (
    <TooltipProvider>
      <Router>
        <AppChunkErrorBoundary>
          <Suspense fallback={<AppRouteFallback />}>
            <Routes>
              <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
              <Route path="/portal/:caseId/:token" element={<ClientPortal />} />
              <Route path="/" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />
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
              <Route path="/billing" element={isLoggedIn ? <Billing /> : <Navigate to="/login" />} />
              <Route path="/help" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />
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
        <Toaster position="top-right" richColors />
      </Router>
    </TooltipProvider>
  );
}
