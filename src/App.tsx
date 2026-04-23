import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { getIdTokenResult, signOut } from 'firebase/auth';
import NotificationRuntime from './components/NotificationRuntime';
import { Toaster } from './components/ui/sonner';
import { Suspense, lazy, useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { TooltipProvider } from './components/ui/tooltip';
import { seedTemplates } from './lib/firebase-utils';
import { fetchMeFromSupabase, isSupabaseConfigured } from './lib/supabase-fallback';
import { toast } from 'sonner';

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
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Billing = lazy(() => import('./pages/Billing'));
const SupportCenter = lazy(() => import('./pages/SupportCenter'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));

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

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    document.title = 'Close Flow';
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);

    if (isSupabaseConfigured()) {
      let cancelled = false;

      const syncProfileFromApi = async (showLoading = false) => {
        if (showLoading) setProfileLoading(true);

        try {
          const me = await fetchMeFromSupabase({
            uid: user.uid,
            email: user.email || undefined,
            fullName: user.displayName || undefined,
          });
          if (cancelled) return;

          const nextProfile = me.profile || null;
          const forceLogoutAfter = typeof nextProfile?.forceLogoutAfter === 'string' ? nextProfile.forceLogoutAfter : '';

          if (forceLogoutAfter) {
            try {
              const tokenResult = await getIdTokenResult(user);
              const authTimeMs = Date.parse(String(tokenResult.authTime || ''));
              const forceLogoutMs = Date.parse(forceLogoutAfter);

              if (Number.isFinite(authTimeMs) && Number.isFinite(forceLogoutMs) && authTimeMs < forceLogoutMs) {
                if (typeof window !== 'undefined') {
                  window.sessionStorage.setItem(FORCE_LOGOUT_NOTICE_SESSION_KEY, '1');
                }
                setProfile(null);
                if (showLoading) setProfileLoading(false);
                await signOut(auth);
                return;
              }
            } catch (error) {
              console.error('FORCE_LOGOUT_CHECK_FAILED', error);
            }
          }

          setProfile(nextProfile);
          seedTemplates();
        } catch (error) {
          if (cancelled) return;
          console.error('PROFILE_API_BOOTSTRAP_FAILED', error);
          setProfile({
            id: user.uid,
            fullName: user.displayName || '',
            email: user.email || '',
            role: 'member',
            isAdmin: false,
          });
        } finally {
          if (!cancelled && showLoading) {
            setProfileLoading(false);
          }
        }
      };

      void syncProfileFromApi(true);

      const interval = window.setInterval(() => {
        void syncProfileFromApi(false);
      }, 60_000);

      const handleVisibilityRefresh = () => {
        if (document.visibilityState === 'visible') {
          void syncProfileFromApi(false);
        }
      };

      window.addEventListener('focus', handleVisibilityRefresh);
      document.addEventListener('visibilitychange', handleVisibilityRefresh);

      return () => {
        cancelled = true;
        window.clearInterval(interval);
        window.removeEventListener('focus', handleVisibilityRefresh);
        document.removeEventListener('visibilitychange', handleVisibilityRefresh);
      };
    }

    const profileRef = doc(db, 'profiles', user.uid);
    const unsubscribe = onSnapshot(
      profileRef,
      (profileDoc) => {
        void (async () => {
          let nextProfile = profileDoc.exists() ? profileDoc.data() : null;
          const forceLogoutAfter = typeof nextProfile?.forceLogoutAfter === 'string' ? nextProfile.forceLogoutAfter : '';

          if (forceLogoutAfter) {
            try {
              const tokenResult = await getIdTokenResult(user);
              const authTimeMs = Date.parse(String(tokenResult.authTime || ''));
              const forceLogoutMs = Date.parse(forceLogoutAfter);

              if (Number.isFinite(authTimeMs) && Number.isFinite(forceLogoutMs) && authTimeMs < forceLogoutMs) {
                if (typeof window !== 'undefined') {
                  window.sessionStorage.setItem(FORCE_LOGOUT_NOTICE_SESSION_KEY, '1');
                }
                setProfile(null);
                setProfileLoading(false);
                await signOut(auth);
                return;
              }
            } catch (error) {
              console.error('FORCE_LOGOUT_CHECK_FAILED', error);
            }
          }

          const authEmail = user.email || null;
          if (authEmail && nextProfile?.email !== authEmail) {
            try {
              await setDoc(
                profileRef,
                {
                  email: authEmail,
                  updatedAt: serverTimestamp(),
                },
                { merge: true },
              );
              nextProfile = { ...(nextProfile || {}), email: authEmail };
            } catch (error) {
              console.error('PROFILE_EMAIL_SYNC_FAILED', error);
            }
          }

          setProfile(nextProfile);
          seedTemplates();
          setProfileLoading(false);
        })();
      },
      (error) => {
        console.error('PROFILE_SUBSCRIPTION_FAILED', error);
        setProfileLoading(false);
      },
    );

    return () => {
      unsubscribe();
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

  return (
    <TooltipProvider>
      <Router>
        <Suspense fallback={<AppRouteFallback />}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/portal/:caseId/:token" element={<ClientPortal />} />

            <Route path="/" element={user ? <Today /> : <Navigate to="/login" />} />
            <Route path="/leads" element={user ? <Leads /> : <Navigate to="/login" />} />
            <Route path="/leads/:leadId" element={user ? <LeadDetail /> : <Navigate to="/login" />} />
            <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={user ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/cases" element={user ? <Cases /> : <Navigate to="/login" />} />
            <Route path="/case/:caseId" element={user ? <CaseDetail /> : <Navigate to="/login" />} />
            <Route path="/clients" element={user ? <Clients /> : <Navigate to="/login" />} />
            <Route path="/clients/:clientId" element={user ? <ClientDetail /> : <Navigate to="/login" />} />
            <Route path="/activity" element={user ? <Activity /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <NotificationsCenter /> : <Navigate to="/login" />} />
            <Route path="/billing" element={user ? <Billing /> : <Navigate to="/login" />} />
            <Route path="/help" element={user ? <SupportCenter /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        <NotificationRuntime enabled={Boolean(user)} />
        <Toaster position="top-right" richColors />
      </Router>
    </TooltipProvider>
  );
}
