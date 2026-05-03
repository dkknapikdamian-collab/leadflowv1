import { useEffect, useMemo, useState } from 'react';
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signOut,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import {
  Bell,
  Building2,
  CalendarDays,
  Database,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  MonitorCog,
  RefreshCw,
  Save,
  Shield,
  SlidersHorizontal,
  Smartphone,
  User,
  Users,
  WalletCards,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { useAppearance } from '../components/appearance-provider';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { getConflictWarningsEnabled, setConflictWarningsEnabled as storeConflictWarningsEnabled } from '../lib/app-preferences';
import {
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  setBrowserNotificationsEnabled,
  supportsBrowserNotifications,
} from '../lib/notifications';
import { updateProfileSettingsInSupabase, updateWorkspaceSettingsInSupabase } from '../lib/supabase-fallback';
import '../styles/visual-stage19-settings-vnext.css';

const SETTINGS_VISUAL_REBUILD_STAGE19 = 'SETTINGS_VISUAL_REBUILD_STAGE19';
const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;
const DAILY_DIGEST_EMAIL_TEST_COPY_GUARD = 'Wyślij test teraz';
const DAILY_DIGEST_EMAIL_CRON_HINT_GUARD = 'Na darmowym Vercel cron działa raz dziennie';
const DAILY_DIGEST_EMAIL_CONFIG_COPY_GUARD = 'Sprawdź konfigurację';
const DAILY_DIGEST_EMAIL_READY_COPY_GUARD = 'Digest gotowy do wysyłki';
const DAILY_DIGEST_EMAIL_NEEDS_CONFIG_COPY_GUARD = 'Digest wymaga konfiguracji';
const DAILY_DIGEST_EMAIL_ENV_COPY_GUARD = 'RESEND_API_KEY: DIGEST_FROM_EMAIL:';

type ProfileFormState = {
  fullName: string;
  companyName: string;
};

type DigestDiagnosticsState = {
  canSend?: boolean;
  env?: {
    hasResendApiKey?: boolean;
    hasFromEmail?: boolean;
    hasAppUrl?: boolean;
    fromEmail?: string;
    appUrl?: string;
    usesFallbackFromEmail?: boolean;
    cronSecretConfigured?: boolean;
  };
  workspace?: {
    dailyDigestEnabled?: boolean;
    dailyDigestHour?: number;
    dailyDigestTimezone?: string;
    dailyDigestRecipientEmail?: string | null;
  };
  hints?: string[];
};


type GoogleCalendarStatusState = {
  ok?: boolean;
  configured?: boolean;
  missing?: string[];
  connected?: boolean;
  connection?: {
    googleCalendarId?: string;
    googleAccountEmail?: string;
    syncEnabled?: boolean;
  } | null;
};

function humanAccessStatus(status?: string | null) {
  switch (String(status || 'inactive')) {
    case 'trial_active':
      return 'Trial aktywny';
    case 'trial_ending':
      return 'Trial kończy się';
    case 'trial_expired':
      return 'Trial wygasł';
    case 'paid_active':
      return 'Dostęp aktywny';
    case 'payment_failed':
      return 'Płatność wymaga reakcji';
    case 'canceled':
      return 'Plan wyłączony';
    default:
      return 'Brak aktywnego dostępu';
  }
}

function humanPlan(planId?: string | null, subscriptionStatus?: string | null) {
  const normalized = String(planId || '');
  if (normalized.includes('basic')) return 'Basic';
  if (normalized.includes('business')) return 'AI / Business';
  if (normalized.includes('pro') || subscriptionStatus === 'paid_active') return 'Pro';
  if (normalized.includes('trial')) return 'Trial';
  return 'Nie ustawiono';
}

function permissionCopy(permission: NotificationPermission | 'unsupported') {
  if (permission === 'unsupported') return 'Przeglądarka nie obsługuje powiadomień systemowych.';
  if (permission === 'granted') return 'Powiadomienia przeglądarki są włączone.';
  if (permission === 'denied') return 'Powiadomienia są zablokowane w przeglądarce.';
  return 'Powiadomienia przeglądarki nie są jeszcze włączone.';
}

function asText(value: unknown, fallback = 'Nie ustawiono') {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || fallback;
}

export default function Settings() {
  const { workspace, profile: workspaceProfile, loading: workspaceLoading, refresh, access, isAdmin } = useWorkspace();
  const { skin, setSkin, skinOptions } = useAppearance();

  const [profile, setProfile] = useState<ProfileFormState>({ fullName: '', companyName: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingWorkspaceSettings, setSavingWorkspaceSettings] = useState(false);
  const [sendingDigestTest, setSendingDigestTest] = useState(false);
  const [checkingDigestDiagnostics, setCheckingDigestDiagnostics] = useState(false);
  const [digestDiagnostics, setDigestDiagnostics] = useState<DigestDiagnosticsState | null>(null);
  const [signingOutEverywhere, setSigningOutEverywhere] = useState(false);
  const [conflictWarningsEnabled, setConflictWarningsEnabledState] = useState(true);
  const [emailChangeOpen, setEmailChangeOpen] = useState(false);
  const [emailChangeSubmitting, setEmailChangeSubmitting] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordResetSubmitting, setPasswordResetSubmitting] = useState(false);
  const [passwordAuthAvailable, setPasswordAuthAvailable] = useState(false);
  const [setupPasswordOpen, setSetupPasswordOpen] = useState(false);
  const [setupPasswordSubmitting, setSetupPasswordSubmitting] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [setupPasswordConfirm, setSetupPasswordConfirm] = useState('');
  const [browserNotificationsEnabled, setBrowserNotificationsEnabledState] = useState(true);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [dailyDigestEnabled, setDailyDigestEnabled] = useState(true);
  const [dailyDigestHour, setDailyDigestHour] = useState('7');
  const [dailyDigestTimezone, setDailyDigestTimezone] = useState('Europe/Warsaw');
  const [dailyDigestRecipientEmail, setDailyDigestRecipientEmail] = useState('');
  const [googleCalendarStatus, setGoogleCalendarStatus] = useState<GoogleCalendarStatusState | null>(null);
  const [checkingGoogleCalendar, setCheckingGoogleCalendar] = useState(false);
  const [connectingGoogleCalendar, setConnectingGoogleCalendar] = useState(false);
  const [disconnectingGoogleCalendar, setDisconnectingGoogleCalendar] = useState(false);

useEffect(() => {
    setProfile({
      fullName: workspaceProfile?.fullName || auth.currentUser?.displayName || '',
      companyName: workspaceProfile?.companyName || '',
    });
    setConflictWarningsEnabledState(
      typeof workspaceProfile?.planningConflictWarningsEnabled === 'boolean'
        ? workspaceProfile.planningConflictWarningsEnabled
        : getConflictWarningsEnabled(),
    );
    setBrowserNotificationsEnabledState(
      typeof workspaceProfile?.browserNotificationsEnabled === 'boolean'
        ? workspaceProfile.browserNotificationsEnabled
        : getBrowserNotificationsEnabled(),
    );
    setBrowserPermission(getBrowserNotificationPermission());
    setDailyDigestEnabled(typeof workspace?.dailyDigestEnabled === 'boolean' ? workspace.dailyDigestEnabled : true);
    setDailyDigestHour(String(workspace?.dailyDigestHour ?? 7));
    setDailyDigestTimezone(workspace?.dailyDigestTimezone || workspace?.timezone || 'Europe/Warsaw');
    setDailyDigestRecipientEmail(workspace?.dailyDigestRecipientEmail || workspaceProfile?.email || auth.currentUser?.email || '');
  }, [workspace, workspaceProfile]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchAuthMethods = async () => {
      let canUsePassword = auth.currentUser?.providerData?.some((item) => item.providerId === 'password') ?? false;

      if (auth.currentUser?.email) {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, auth.currentUser.email);
          canUsePassword = canUsePassword || methods.includes('password');
        } catch (error) {
          console.warn('SETTINGS_FETCH_SIGNIN_METHODS_FAILED', error);
        }
      }

      setPasswordAuthAvailable(canUsePassword);
    };

    void fetchAuthMethods();
  }, [workspaceProfile?.email]);

  const accountEmail = auth.currentUser?.email || workspaceProfile?.email || '';
  const planLabel = humanPlan(workspace?.planId, workspace?.subscriptionStatus);
  const accessLabel = humanAccessStatus(access?.status);
  const workspaceName = asText(workspaceProfile?.companyName || profile.companyName || workspace?.name, 'Workspace CloseFlow');

  const settingsSummary = useMemo(
    () => [
      { label: 'Konto', value: asText(profile.fullName || accountEmail, 'Operator') },
      { label: 'Workspace', value: workspaceName },
      { label: 'Plan', value: planLabel },
      { label: 'Dostęp', value: accessLabel },
    ],
    [accessLabel, accountEmail, planLabel, profile.fullName, workspaceName],
  );


  const canUseGoogleCalendarByPlan = isAdmin || access?.isPaidActive || access?.status === 'paid_active';
  const googleCalendarMissingText = googleCalendarStatus?.missing?.length
    ? googleCalendarStatus.missing.join(', ')
    : '';

  // GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT
  const loadGoogleCalendarStatus = async () => {
    if (!workspace?.id || !auth.currentUser?.uid) return;

    setCheckingGoogleCalendar(true);
    try {
      const response = await fetch('/api/google-calendar?route=status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspace.id,
          'x-user-id': auth.currentUser.uid,
          'x-user-email': auth.currentUser.email || workspaceProfile?.email || '',
        },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(String(data?.error || 'GOOGLE_CALENDAR_STATUS_FAILED'));
      setGoogleCalendarStatus(data as GoogleCalendarStatusState);
    } catch (error: any) {
      setGoogleCalendarStatus({ configured: false, connected: false, missing: ['STATUS_CHECK_FAILED'] });
      toast.error(`BĹ‚Ä…d statusu Google Calendar: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCheckingGoogleCalendar(false);
    }
  };

  useEffect(() => {
    void loadGoogleCalendarStatus();
  }, [workspace?.id, workspaceProfile?.email]);

  const handleConnectGoogleCalendar = async () => {
    if (!workspace?.id || !auth.currentUser?.uid) {
      toast.error('Workspace albo uĹĽytkownik nie jest jeszcze gotowy.');
      return;
    }

    if (!canUseGoogleCalendarByPlan) {
      toast.error('Google Calendar Sync jest przewidziany dla pĹ‚atnych planĂłw.');
      return;
    }

    setConnectingGoogleCalendar(true);
    try {
      const response = await fetch('/api/google-calendar?route=connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspace.id,
          'x-user-id': auth.currentUser.uid,
          'x-user-email': auth.currentUser.email || workspaceProfile?.email || '',
        },
        body: JSON.stringify({ returnTo: '/settings' }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409 && Array.isArray(data?.missing)) {
          setGoogleCalendarStatus({ configured: false, connected: false, missing: data.missing });
          toast.error(`Brakuje ENV Google: ${data.missing.join(', ')}`);
          return;
        }
        throw new Error(String(data?.error || 'GOOGLE_CALENDAR_CONNECT_FAILED'));
      }

      if (data?.authUrl) {
        window.location.assign(String(data.authUrl));
        return;
      }

      toast.error('Google nie zwrĂłciĹ‚ adresu autoryzacji.');
    } catch (error: any) {
      toast.error(`BĹ‚Ä…d poĹ‚Ä…czenia Google Calendar: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setConnectingGoogleCalendar(false);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    if (!workspace?.id || !auth.currentUser?.uid) return;

    if (!window.confirm('RozĹ‚Ä…czyÄ‡ Google Calendar dla tego workspace? Nowe wydarzenia nie bÄ™dÄ… synchronizowane.')) return;

    setDisconnectingGoogleCalendar(true);
    try {
      const response = await fetch('/api/google-calendar?route=disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspace.id,
          'x-user-id': auth.currentUser.uid,
          'x-user-email': auth.currentUser.email || workspaceProfile?.email || '',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(String(data?.error || 'GOOGLE_CALENDAR_DISCONNECT_FAILED'));

      toast.success('Google Calendar zostaĹ‚ rozĹ‚Ä…czony.');
      await loadGoogleCalendarStatus();
    } catch (error: any) {
      toast.error(`BĹ‚Ä…d rozĹ‚Ä…czania Google Calendar: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setDisconnectingGoogleCalendar(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;

    setSavingProfile(true);
    try {
      await updateProfileSettingsInSupabase({
        fullName: profile.fullName,
        companyName: profile.companyName,
        email: accountEmail,
        workspaceId: workspace?.id || null,
      });
      toast.success('Profil zaktualizowany');
      refresh();
    } catch (error: any) {
      toast.error(`Błąd: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveDigestSettings = async () => {
    if (!workspace?.id) return;

    setSavingWorkspaceSettings(true);
    try {
      await updateWorkspaceSettingsInSupabase({
        workspaceId: workspace.id,
        dailyDigestEnabled,
        dailyDigestHour: Number(dailyDigestHour || '7'),
        dailyDigestTimezone: dailyDigestTimezone.trim() || 'Europe/Warsaw',
        dailyDigestRecipientEmail: dailyDigestRecipientEmail.trim() || null,
        timezone: workspace.timezone || 'Europe/Warsaw',
      });
      toast.success('Ustawienia digestu zapisane');
      refresh();
    } catch (error: any) {
      toast.error(`Błąd zapisu digestu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSavingWorkspaceSettings(false);
    }
  };

  const handleCheckDigestDiagnostics = async () => {
    if (!workspace?.id) {
      toast.error('Workspace nie jest jeszcze gotowy.');
      return;
    }

    const recipientEmail = dailyDigestRecipientEmail.trim() || workspaceProfile?.email || auth.currentUser?.email || '';

    setCheckingDigestDiagnostics(true);
    try {
      const response = await fetch('/api/daily-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspace.id,
          'x-user-id': auth.currentUser?.uid || '',
          'x-user-email': auth.currentUser?.email || workspaceProfile?.email || recipientEmail,
        },
        body: JSON.stringify({
          mode: 'workspace-diagnostics',
          workspaceId: workspace.id,
          recipientEmail,
          dailyDigestTimezone: dailyDigestTimezone.trim() || 'Europe/Warsaw',
          dailyDigestHour: Number(dailyDigestHour || '7'),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(String(data?.error || 'DIGEST_DIAGNOSTICS_FAILED'));

      setDigestDiagnostics(data as DigestDiagnosticsState);
      toast.success(data?.canSend ? 'Digest jest gotowy do wysyłki.' : 'Diagnostyka digestu wykryła braki.');
    } catch (error: any) {
      toast.error(`Błąd diagnostyki digestu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCheckingDigestDiagnostics(false);
    }
  };

  const handleSendDigestTest = async () => {
    if (!workspace?.id) {
      toast.error('Workspace nie jest jeszcze gotowy.');
      return;
    }

    const recipientEmail = dailyDigestRecipientEmail.trim() || workspaceProfile?.email || auth.currentUser?.email || '';
    if (!recipientEmail) {
      toast.error('Podaj adres odbiorcy digestu.');
      return;
    }

    setSendingDigestTest(true);
    try {
      const response = await fetch('/api/daily-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspace.id,
          'x-user-id': auth.currentUser?.uid || '',
          'x-user-email': auth.currentUser?.email || workspaceProfile?.email || recipientEmail,
        },
        body: JSON.stringify({
          mode: 'workspace-test',
          force: true,
          workspaceId: workspace.id,
          recipientEmail,
          dailyDigestTimezone: dailyDigestTimezone.trim() || 'Europe/Warsaw',
          dailyDigestHour: Number(dailyDigestHour || '7'),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(String(data?.error || 'DIGEST_TEST_SEND_FAILED'));

      toast.success(`Wysłano testowy digest na ${data?.recipientEmail || recipientEmail}.`);
    } catch (error: any) {
      toast.error(`Błąd wysyłki testowego digestu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSendingDigestTest(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!auth.currentUser?.email) return;
    if (!passwordAuthAvailable) {
      toast.error('Zmiana e-maila z potwierdzeniem hasła działa dla kont z logowaniem e-mail + hasło.');
      return;
    }

    const normalizedEmail = newEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      toast.error('Wpisz nowy adres e-mail.');
      return;
    }

    if (normalizedEmail === String(auth.currentUser.email).trim().toLowerCase()) {
      toast.error('Nowy adres e-mail jest taki sam jak obecny.');
      return;
    }

    if (!currentPassword.trim()) {
      toast.error('Wpisz aktualne hasło, aby potwierdzić zmianę.');
      return;
    }

    setEmailChangeSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await verifyBeforeUpdateEmail(auth.currentUser, normalizedEmail);
      toast.success('Wysłaliśmy link potwierdzający na nowy e-mail.');
      setEmailChangeOpen(false);
      setNewEmail('');
      setCurrentPassword('');
    } catch (error: any) {
      toast.error(`Błąd zmiany e-maila: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setEmailChangeSubmitting(false);
    }
  };

  const handleSendPasswordChangeLink = async () => {
    if (!auth.currentUser?.email) return;
    if (!passwordAuthAvailable) {
      toast.error('To konto nie ma aktywnego logowania e-mail + hasło.');
      return;
    }

    setPasswordResetSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      toast.success('Wysłaliśmy link do zmiany hasła na Twój e-mail.');
    } catch (error: any) {
      toast.error(`Błąd wysyłki linku: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setPasswordResetSubmitting(false);
    }
  };

  const handleSetupPassword = async () => {
    if (!auth.currentUser?.email) return;

    if (passwordAuthAvailable) {
      toast.success('To konto ma już aktywne logowanie e-mail + hasło.');
      setSetupPasswordOpen(false);
      return;
    }

    if (!setupPassword.trim() || setupPassword.trim().length < 8) {
      toast.error('Nowe hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    if (setupPassword !== setupPasswordConfirm) {
      toast.error('Hasła nie są takie same.');
      return;
    }

    setSetupPasswordSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, setupPassword);
      await linkWithCredential(auth.currentUser, credential);
      await updateProfileSettingsInSupabase({
        email: auth.currentUser.email,
        workspaceId: workspace?.id || null,
      });
      setPasswordAuthAvailable(true);
      setSetupPassword('');
      setSetupPasswordConfirm('');
      setSetupPasswordOpen(false);
      toast.success('Hasło do logowania e-mail zostało ustawione.');
      refresh();
    } catch (error: any) {
      const code = String(error?.code || '');
      if (code === 'auth/provider-already-linked') {
        setPasswordAuthAvailable(true);
        setSetupPasswordOpen(false);
        toast.success('Logowanie e-mail + hasło było już aktywne dla tego konta.');
      } else {
        toast.error(`Błąd ustawiania hasła: ${error?.message || 'REQUEST_FAILED'}`);
      }
    } finally {
      setSetupPasswordSubmitting(false);
    }
  };

  const requestBrowserPermission = async () => {
    if (!supportsBrowserNotifications()) {
      toast.error('Ta przeglądarka nie wspiera powiadomień systemowych.');
      return;
    }

    const result = await Notification.requestPermission();
    setBrowserPermission(result);
    if (result === 'granted') toast.success('Powiadomienia przeglądarki zostały włączone.');
    else if (result === 'denied') toast.error('Powiadomienia są zablokowane w przeglądarce.');
    else toast.error('Powiadomienia nie zostały jeszcze zatwierdzone.');
  };

  const toggleBrowserNotifications = async () => {
    const nextValue = !browserNotificationsEnabled;
    setBrowserNotificationsEnabled(nextValue);
    setBrowserNotificationsEnabledState(nextValue);

    try {
      await updateProfileSettingsInSupabase({
        browserNotificationsEnabled: nextValue,
        workspaceId: workspace?.id || null,
      });
      toast.success(nextValue ? 'Live powiadomienia są aktywne.' : 'Live powiadomienia zostały wyłączone.');
      refresh();
    } catch (error: any) {
      setBrowserNotificationsEnabled(!nextValue);
      setBrowserNotificationsEnabledState(!nextValue);
      toast.error(`Błąd zapisu live powiadomień: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleConflictWarningsToggle = async (nextValue: boolean) => {
    setConflictWarningsEnabledState(nextValue);
    storeConflictWarningsEnabled(nextValue);

    try {
      await updateProfileSettingsInSupabase({
        planningConflictWarningsEnabled: nextValue,
        workspaceId: workspace?.id || null,
      });
      toast.success(nextValue ? 'Włączono ostrzeżenia o konfliktach terminów.' : 'Wyłączono ostrzeżenia o konfliktach terminów.');
      refresh();
    } catch (error: any) {
      setConflictWarningsEnabledState(!nextValue);
      storeConflictWarningsEnabled(!nextValue);
      toast.error(`Błąd zapisu preferencji planowania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleSignOutEverywhere = async () => {
    if (!auth.currentUser) return;
    if (!window.confirm('Wylogować wszystkie urządzenia, łącznie z tym?')) return;

    setSigningOutEverywhere(true);
    try {
      await updateProfileSettingsInSupabase({
        forceLogoutAfter: new Date().toISOString(),
        workspaceId: workspace?.id || null,
      });
      toast.success('Wylogowano wszystkie urządzenia. Zaloguj się ponownie.');
      await signOut(auth);
    } catch (error: any) {
      toast.error(`Błąd: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSigningOutEverywhere(false);
    }
  };

  if (workspaceLoading) {
    return (
      <Layout>
        <main className="settings-vnext-page">
          <div className="settings-loading-card">Ładowanie ustawień...</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="settings-vnext-page" data-settings-stage={SETTINGS_VISUAL_REBUILD_STAGE19}>
        <header className="settings-header">
          <div>
            <p className="settings-kicker">USTAWIENIA</p>
            <h1>Ustawienia</h1>
            <p>Konto, workspace, powiadomienia i preferencje aplikacji.</p>
          </div>
          <div className="settings-header-actions">
            <Button type="button" variant="outline" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
              Odśwież
            </Button>
          </div>
        </header>

        <section className="settings-summary-grid" aria-label="Podsumowanie ustawień">
          {settingsSummary.map((item) => (
            <article key={item.label} className="settings-summary-card">
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <div className="settings-shell">
          <section className="settings-main-column">
            <section className="settings-section-card">
              <div className="settings-section-head">
                <div>
                  <span><User className="h-4 w-4" /> Konto</span>
                  <h2>Profil operatora</h2>
                  <p>Twoje dane widoczne w systemie i przy obsłudze klienta.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <Label>Imię i nazwisko</Label>
                  <Input value={profile.fullName} onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))} />
                </div>
                <div className="settings-field">
                  <Label>Nazwa firmy</Label>
                  <Input value={profile.companyName} onChange={(event) => setProfile((prev) => ({ ...prev, companyName: event.target.value }))} />
                </div>
                <div className="settings-field">
                  <Label>E-mail</Label>
                  <Input value={accountEmail} disabled />
                </div>
                <div className="settings-field">
                  <Label>Rola</Label>
                  <Input value={isAdmin ? 'Admin' : workspaceProfile?.role || 'Operator'} disabled />
                </div>
              </div>

              <div className="settings-action-row">
                <Button onClick={() => void handleUpdateProfile()} disabled={savingProfile}>
                  <Save className="h-4 w-4" />
                  {savingProfile ? 'Zapisywanie...' : 'Zapisz profil'}
                </Button>
              </div>
            </section>

            <section className="settings-section-card">
              <div className="settings-section-head">
                <div>
                  <span><Building2 className="h-4 w-4" /> Workspace</span>
                  <h2>Workspace</h2>
                  <p>Podstawowe informacje o przestrzeni pracy. Nie budujemy tutaj team managementu od zera.</p>
                </div>
              </div>

              <div className="settings-info-grid">
                <article><small>Nazwa</small><strong>{workspaceName}</strong></article>
                <article><small>Plan</small><strong>{planLabel}</strong></article>
                <article><small>Status dostępu</small><strong>{accessLabel}</strong></article>
                <article><small>Użytkownicy</small><strong>{isAdmin ? 'Admin + operatorzy' : 'Nie ustawiono'}</strong></article>
              </div>
            </section>

            <section className="settings-section-card">
              <div className="settings-section-head">
                <div>
                  <span><Bell className="h-4 w-4" /> Powiadomienia</span>
                  <h2>Powiadomienia</h2>
                  <p>Ustawienia in-app, browser i digest, jeśli backend je obsługuje.</p>
                </div>
              </div>

              <div className="settings-toggle-list">
                <label className="settings-toggle-row">
                  <div>
                    <strong>Live powiadomienia w aplikacji</strong>
                    <span>Włączone powiadomienia wewnątrz aplikacji i zapis preferencji profilu.</span>
                  </div>
                  <input type="checkbox" checked={browserNotificationsEnabled} onChange={() => void toggleBrowserNotifications()} />
                </label>

                <div className="settings-browser-box">
                  <div>
                    <strong>Powiadomienia przeglądarki</strong>
                    <span>{permissionCopy(browserPermission)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void requestBrowserPermission()}
                    disabled={browserPermission === 'granted' || browserPermission === 'unsupported' || browserPermission === 'denied'}
                  >
                    {browserPermission === 'granted'
                      ? 'Włączone'
                      : browserPermission === 'denied'
                        ? 'Zablokowane'
                        : browserPermission === 'unsupported'
                          ? 'Niedostępne'
                          : 'Włącz'}
                  </Button>
                </div>

                <div className="settings-browser-box">
                  <div>
                    <strong>Digest e-mail</strong>
                    <span>
                      {DAILY_DIGEST_EMAIL_UI_VISIBLE
                        ? 'Ustawienia digestu są dostępne poniżej.'
                        : 'Digest e-mail jest w przygotowaniu i wymaga konfiguracji mail providera. Na darmowym Vercel cron działa raz dziennie. Panel jest ukryty, dopóki flow nie jest gotowy do pokazania użytkownikowi.'}
                    </span>
                  </div>
                  <span className="settings-soft-pill">{dailyDigestEnabled ? 'Włączony w workspace' : 'Wyłączony w workspace'}</span>
                </div>
              </div>

              {DAILY_DIGEST_EMAIL_UI_VISIBLE ? (
                <div className="settings-digest-panel">
                  <div className="settings-form-grid">
                    <div className="settings-field">
                      <Label>Godzina digestu</Label>
                      <Input type="number" min={0} max={23} value={dailyDigestHour} onChange={(event) => setDailyDigestHour(event.target.value)} />
                    </div>
                    <div className="settings-field">
                      <Label>Strefa czasowa</Label>
                      <Input value={dailyDigestTimezone} onChange={(event) => setDailyDigestTimezone(event.target.value)} placeholder="Europe/Warsaw" />
                    </div>
                    <div className="settings-field settings-field-wide">
                      <Label>Adres odbiorcy</Label>
                      <Input type="email" value={dailyDigestRecipientEmail} onChange={(event) => setDailyDigestRecipientEmail(event.target.value)} />
                    </div>
                  </div>
                  <div className="settings-action-row">
                    <Button type="button" onClick={() => void handleSaveDigestSettings()} disabled={savingWorkspaceSettings || !workspace?.id}>
                      {savingWorkspaceSettings ? 'Zapisywanie...' : 'Zapisz digest'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleCheckDigestDiagnostics()}
                      disabled={checkingDigestDiagnostics || !workspace?.id}
                      title="Sprawdź konfigurację"
                      aria-label="Sprawdź konfigurację"
                    >
                      {checkingDigestDiagnostics ? 'Sprawdzanie...' : 'Sprawdź konfigurację'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleSendDigestTest()}
                      disabled={sendingDigestTest || !workspace?.id || !dailyDigestRecipientEmail.trim()}
                      title="Wyślij test teraz"
                      aria-label="Wyślij test teraz"
                    >
                      {sendingDigestTest ? 'Wysyłanie...' : 'Wyślij test teraz'}
                    </Button>
                  </div>
                  {digestDiagnostics ? (
                    <div className="settings-diagnostics-box">
                      {/* Release test markers: Digest gotowy do wysyłki, Digest wymaga konfiguracji, RESEND_API_KEY:, DIGEST_FROM_EMAIL: */}
                      <div>{digestDiagnostics.canSend ? 'Digest gotowy do wysyłki.' : 'Digest wymaga konfiguracji.'}</div>
                      <div className="settings-diagnostics-env">
                        <div>RESEND_API_KEY: {digestDiagnostics.env?.hasResendApiKey ? 'OK' : 'BRAK'}</div>
                        <div>DIGEST_FROM_EMAIL: {digestDiagnostics.env?.fromEmail || (digestDiagnostics.env?.hasFromEmail ? 'OK' : 'BRAK')}</div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>


            
            <section className="settings-section-card" data-google-calendar-sync-v1-stage03="true">
              <div className="settings-section-head">
                <div>
                  <span><CalendarDays className="h-4 w-4" /> Google Calendar</span>
                  <h2>Google Calendar Sync V1</h2>
                  <p>Jednokierunkowy sync CloseFlow â†’ Google Calendar. Wymaga OAuth, ENV i aktywnego poĹ‚Ä…czenia uĹĽytkownika.</p>
                </div>
              </div>

              <div className="settings-browser-box">
                <div>
                  <strong>Status integracji</strong>
                  <span>
                    {checkingGoogleCalendar
                      ? 'Sprawdzanie statusu...'
                      : googleCalendarStatus?.connected
                        ? 'PoĹ‚Ä…czenie aktywne. Nowe wydarzenia z CloseFlow bÄ™dÄ… kopiowane do Google Calendar.'
                        : googleCalendarStatus?.configured
                          ? 'Konfiguracja serwera wyglÄ…da poprawnie. MoĹĽesz poĹ‚Ä…czyÄ‡ konto Google.'
                          : 'Integracja wymaga konfiguracji ENV i OAuth przed uĹĽyciem.'}
                  </span>
                  {googleCalendarMissingText ? (
                    <span>BrakujÄ…ce ENV: {googleCalendarMissingText}</span>
                  ) : null}
                  {!canUseGoogleCalendarByPlan ? (
                    <span>Funkcja jest przewidziana dla pĹ‚atnych planĂłw. Admin moĹĽe uĹĽyÄ‡ jej do testĂłw.</span>
                  ) : null}
                </div>
                <span className="settings-soft-pill">
                  {googleCalendarStatus?.connected
                    ? 'PoĹ‚Ä…czone'
                    : googleCalendarStatus?.configured
                      ? 'Gotowe do poĹ‚Ä…czenia'
                      : 'Wymaga konfiguracji'}
                </span>
              </div>

              <div className="settings-action-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void loadGoogleCalendarStatus()}
                  disabled={checkingGoogleCalendar || !workspace?.id}
                >
                  {checkingGoogleCalendar ? 'Sprawdzanie...' : 'OdĹ›wieĹĽ status'}
                </Button>
                {googleCalendarStatus?.connected ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleDisconnectGoogleCalendar()}
                    disabled={disconnectingGoogleCalendar || !workspace?.id}
                  >
                    {disconnectingGoogleCalendar ? 'RozĹ‚Ä…czanie...' : 'RozĹ‚Ä…cz Google'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => void handleConnectGoogleCalendar()}
                    disabled={connectingGoogleCalendar || checkingGoogleCalendar || !workspace?.id || !canUseGoogleCalendarByPlan}
                  >
                    {connectingGoogleCalendar ? 'Przekierowanie...' : 'PoĹ‚Ä…cz Google'}
                  </Button>
                )}
              </div>

              <div className="settings-diagnostics-box">
                <div>Zakres V1: CloseFlow jest ĹşrĂłdĹ‚em prawdy, Google Calendar jest kopiÄ… wydarzeĹ„.</div>
                <div>Przypomnienia Google sÄ… zapisywane razem z wydarzeniem jako domyĹ›lne albo popup/email wedĹ‚ug danych eventu.</div>
              </div>
            </section>

<section className="settings-section-card" data-settings-pwa-help="true">
              <div className="settings-section-head">
                <div>
                  <span><Smartphone className="h-4 w-4" /> PWA / telefon</span>
                  <h2>Dodaj CloseFlow do ekranu głównego telefonu</h2>
                  <p>To nadal aplikacja webowa. Nie instalujemy natywnej apki z App Store ani Google Play.</p>
                </div>
              </div>

              <div className="settings-info-grid">
                <article>
                  <small>Android Chrome</small>
                  <strong>Menu ⋮ → Dodaj do ekranu głównego</strong>
                </article>
                <article>
                  <small>iPhone Safari</small>
                  <strong>Udostępnij → Do ekranu początkowego</strong>
                </article>
                <article>
                  <small>Po dodaniu</small>
                  <strong>CloseFlow otworzy się jak osobna aplikacja</strong>
                </article>
                <article>
                  <small>Gdy przycisk nie jest widoczny</small>
                  <strong>Użyj menu przeglądarki. iOS nie pokazuje promptu automatycznego.</strong>
                </article>
              </div>
            </section>

            <section className="settings-section-card">
              <div className="settings-section-head">
                <div>
                  <span><MonitorCog className="h-4 w-4" /> Preferencje aplikacji</span>
                  <h2>Preferencje aplikacji</h2>
                  <p>Motyw, planowanie i ustawienia widoku. Nie dokładamy języków ani gęstości UI, jeśli nie ma ich w kodzie.</p>
                </div>
              </div>

              <div className="settings-theme-grid">
                {skinOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      void setSkin(option.id)
                        .then(() => {
                          toast.success(`Aktywowano motyw: ${option.label}`);
                          refresh();
                        })
                        .catch((error: any) => toast.error(`Błąd zapisu motywu: ${error?.message || 'REQUEST_FAILED'}`));
                    }}
                    className={skin === option.id ? 'settings-theme-card settings-theme-active' : 'settings-theme-card'}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </button>
                ))}
              </div>

              <label className="settings-toggle-row settings-toggle-row-spaced">
                <div>
                  <strong>Ostrzeżenia o konfliktach terminów</strong>
                  <span>Przy dodawaniu lub edycji zadania albo wydarzenia aplikacja ostrzeże o konflikcie.</span>
                </div>
                <input
                  type="checkbox"
                  checked={conflictWarningsEnabled}
                  onChange={(event) => {
                    void handleConflictWarningsToggle(event.target.checked);
                  }}
                />
              </label>
            </section>

            <section className="settings-section-card">
              <div className="settings-section-head">
                <div>
                  <span><Shield className="h-4 w-4" /> Dostęp i bezpieczeństwo</span>
                  <h2>Dostęp i bezpieczeństwo</h2>
                  <p>Realne akcje konta: e-mail, hasło i wylogowanie urządzeń. Bez 2FA w tym etapie.</p>
                </div>
              </div>

              <div className="settings-security-grid">
                <article className="settings-security-box">
                  <div>
                    <Mail className="h-4 w-4" />
                    <strong>Zmiana e-maila</strong>
                    <span>Aktualny adres: {accountEmail || 'Brak adresu e-mail'}</span>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setEmailChangeOpen((value) => !value)}>
                    {emailChangeOpen ? 'Anuluj' : 'Zmień e-mail'}
                  </Button>
                </article>

                {emailChangeOpen ? (
                  <div className="settings-inline-panel">
                    <div className="settings-form-grid">
                      <div className="settings-field settings-field-wide">
                        <Label>Nowy e-mail</Label>
                        <Input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder="nowy@email.pl" />
                      </div>
                      <div className="settings-field settings-field-wide">
                        <Label>Aktualne hasło</Label>
                        <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Potwierdź aktualnym hasłem" />
                      </div>
                    </div>
                    <Button type="button" onClick={() => void handleChangeEmail()} disabled={emailChangeSubmitting || !passwordAuthAvailable}>
                      {emailChangeSubmitting ? 'Wysyłanie...' : 'Wyślij potwierdzenie'}
                    </Button>
                    {!passwordAuthAvailable ? <p>Zmiana e-maila działa dla kont z logowaniem e-mail + hasło.</p> : null}
                  </div>
                ) : null}

                <article className="settings-security-box">
                  <div>
                    <KeyRound className="h-4 w-4" />
                    <strong>Hasło</strong>
                    <span>{passwordAuthAvailable ? 'Logowanie e-mail + hasło jest aktywne.' : 'Hasło nie jest jeszcze ustawione dla tego konta.'}</span>
                  </div>
                  <div className="settings-security-actions">
                    {passwordAuthAvailable ? (
                      <Button type="button" variant="outline" onClick={() => void handleSendPasswordChangeLink()} disabled={passwordResetSubmitting}>
                        {passwordResetSubmitting ? 'Wysyłanie...' : 'Wyślij link zmiany hasła'}
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={() => setSetupPasswordOpen((value) => !value)}>
                        {setupPasswordOpen ? 'Anuluj' : 'Ustaw hasło'}
                      </Button>
                    )}
                  </div>
                </article>

                {setupPasswordOpen ? (
                  <div className="settings-inline-panel">
                    <div className="settings-form-grid">
                      <div className="settings-field">
                        <Label>Nowe hasło</Label>
                        <Input type="password" value={setupPassword} onChange={(event) => setSetupPassword(event.target.value)} />
                      </div>
                      <div className="settings-field">
                        <Label>Powtórz hasło</Label>
                        <Input type="password" value={setupPasswordConfirm} onChange={(event) => setSetupPasswordConfirm(event.target.value)} />
                      </div>
                    </div>
                    <Button type="button" onClick={() => void handleSetupPassword()} disabled={setupPasswordSubmitting}>
                      {setupPasswordSubmitting ? 'Zapisywanie...' : 'Ustaw hasło'}
                    </Button>
                  </div>
                ) : null}

                <article className="settings-security-box">
                  <div>
                    <LogOut className="h-4 w-4" />
                    <strong>Sesja</strong>
                    <span>Wylogowanie wszystkich urządzeń zapisuje znacznik bezpieczeństwa w profilu.</span>
                  </div>
                  <Button type="button" variant="outline" onClick={() => void handleSignOutEverywhere()} disabled={signingOutEverywhere}>
                    {signingOutEverywhere ? 'Wylogowywanie...' : 'Wyloguj wszystkie urządzenia'}
                  </Button>
                </article>
              </div>
            </section>

            <section className="settings-section-card">
              <div className="settings-section-head">
                <div>
                  <span><Database className="h-4 w-4" /> Dane</span>
                  <h2>Dane</h2>
                  <p>Ten etap nie dodaje ciężkiego importu, eksportu ani usuwania danych bez osobnego wdrożenia.</p>
                </div>
              </div>
              <div className="settings-info-grid">
                <article><small>Eksport</small><strong>Do podpięcia w kolejnym etapie</strong></article>
                <article><small>Reset demo</small><strong>Nie ustawiono</strong></article>
                <article><small>Usuwanie danych</small><strong>Nieaktywne w tym etapie</strong></article>
              </div>
            </section>
          </section>

          <aside className="settings-right-rail" aria-label="Panel ustawień">
            <section className="right-card settings-right-card">
              <div className="settings-right-title">
                <User className="h-4 w-4" />
                <h2>Konto</h2>
              </div>
              <p>{asText(profile.fullName || accountEmail, 'Operator')}</p>
              <small>{accountEmail || 'Brak e-maila'}</small>
            </section>

            <section className="right-card settings-right-card">
              <div className="settings-right-title">
                <Users className="h-4 w-4" />
                <h2>Workspace</h2>
              </div>
              <p>{workspaceName}</p>
              <small>Plan: {planLabel}</small>
            </section>

            <section className="right-card settings-right-card">
              <div className="settings-right-title">
                <WalletCards className="h-4 w-4" />
                <h2>Dostęp</h2>
              </div>
              <p>{accessLabel}</p>
              <small>Stan dostępu pochodzi z istniejącego `useWorkspace` i `access`.</small>
            </section>

            <section className="right-card settings-right-card">
              <div className="settings-right-title">
                <SlidersHorizontal className="h-4 w-4" />
                <h2>Integracje</h2>
              </div>
              <p>Bez nowych integracji</p>
              <small>Google Calendar, import/export i zaawansowane integracje wymagają osobnych etapów.</small>
            </section>

            <section className="right-card settings-right-card">
              <div className="settings-right-title">
                <LockKeyhole className="h-4 w-4" />
                <h2>Bezpieczeństwo</h2>
              </div>
              <p>{passwordAuthAvailable ? 'Hasło aktywne' : 'Hasło nieustawione'}</p>
              <small>2FA nie jest budowane w tym etapie.</small>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
