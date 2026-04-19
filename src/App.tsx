import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
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
import { Toaster } from './components/ui/sonner';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { TooltipProvider } from './components/ui/tooltip';
import { seedTemplates } from './lib/firebase-utils';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    document.title = 'Close Flow';
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        }
        seedTemplates();
      }
      setProfileLoading(false);
    }
    fetchProfile();
  }, [user]);

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
          <Route path="/billing" element={user ? <Billing /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </TooltipProvider>
  );
}
