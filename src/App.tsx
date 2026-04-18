import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { seedTemplates } from './lib/firebase-utils';
import { isSupabaseConfigured } from './lib/supabase-fallback';

const Today = lazy(() => import('./pages/Today'));
const Leads = lazy(() => import('./pages/Leads'));
const LeadDetail = lazy(() => import('./pages/LeadDetail'));
const Cases = lazy(() => import('./pages/Cases'));
const CaseDetail = lazy(() => import('./pages/CaseDetail'));
const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Activity = lazy(() => import('./pages/Activity'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Billing = lazy(() => import('./pages/Billing'));
const Templates = lazy(() => import('./pages/Templates'));
const Clients = lazy(() => import('./pages/Clients'));
const ClientDetail = lazy(() => import('./pages/ClientDetail'));

function FullScreenLoader({ label = 'Ładowanie aplikacji...' }: { label?: string }) {
  return (
    <div className="flex h-screen items-center justify-center app-shell-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="animate-pulse font-medium app-muted">{label}</p>
      </div>
    </div>
  );
}

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center app-shell-bg px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-sm font-medium app-muted">Wczytywanie widoku...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      if (!user) {
        if (isMounted) {
          setProfile(null);
          setProfileLoading(false);
        }
        return;
      }

      if (isMounted) {
        setProfileLoading(true);
      }

      if (isSupabaseConfigured()) {
        if (isMounted) {
          setProfile({
            email: user.email || '',
            fullName: user.displayName || '',
          });
          setProfileLoading(false);
        }
        return;
      }

      try {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (!isMounted) {
          return;
        }

        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        } else {
          setProfile(null);
        }

        await seedTemplates();
      } catch {
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading || profileLoading) {
    return <FullScreenLoader />;
  }

  return (
    <TooltipProvider>
      <Router>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/portal/:token" element={<ClientPortal />} />
            <Route path="/portal/:caseId/:token" element={<ClientPortal />} />

            <Route path="/" element={user ? <Today /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/leads" element={user ? <Leads /> : <Navigate to="/login" />} />
            <Route path="/leads/:leadId" element={user ? <LeadDetail /> : <Navigate to="/login" />} />
            <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={user ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/cases" element={user ? <Cases /> : <Navigate to="/login" />} />
            <Route path="/case/:caseId" element={user ? <CaseDetail /> : <Navigate to="/login" />} />
            <Route path="/activity" element={user ? <Activity /> : <Navigate to="/login" />} />
            <Route path="/billing" element={user ? <Billing /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/templates" element={user ? <Templates /> : <Navigate to="/login" />} />
            <Route path="/clients" element={user ? <Clients /> : <Navigate to="/login" />} />
            <Route path="/clients/:clientId" element={user ? <ClientDetail /> : <Navigate to="/login" />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </Router>
    </TooltipProvider>
  );
}
