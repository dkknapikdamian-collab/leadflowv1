import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { getIdTokenResult, signOut } from 'firebase/auth';
import Today from './pages/Today';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import ClientPortal from './pages/ClientPortal';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Billing from './pages/Billing';
import SupportCenter from './pages/SupportCenter';
import NotificationsCenter from './pages/NotificationsCenter';
import NotificationRuntime from './components/NotificationRuntime';
import { Toaster } from './components/ui/sonner';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { TooltipProvider } from './components/ui/tooltip';
import { seedTemplates } from './lib/firebase-utils';
import { toast } from 'sonner';

const FORCE_LOGOUT_NOTICE_SESSION_KEY = 'closeflow:force-logout-notice';

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
          <Route path="/activity" element={user ? <Activity /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <NotificationsCenter /> : <Navigate to="/login" />} />
          <Route path="/billing" element={user ? <Billing /> : <Navigate to="/login" />} />
          <Route path="/help" element={user ? <SupportCenter /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <NotificationRuntime enabled={Boolean(user)} />
        <Toaster position="top-right" richColors />
      </Router>
    </TooltipProvider>
  );
}
