import { useEffect, useMemo, useState } from 'react';
import { Building2, Calendar, CalendarDays, Database, KeyRound, LockKeyhole, LogOut, Mail, Menu, MonitorCog, RefreshCw, Save, Settings as SettingsIcon, Shield, SlidersHorizontal, Smartphone, User, Users, WalletCards } from 'lucide-react';
import {
  EntityIcon,
  NotificationEntityIcon
} from '../components/ui-system';

import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signOut,
  verifyBeforeUpdateEmail
} from 'firebase/auth';
import {
  toast
} from 'sonner';
import Layout from '../components/Layout';
import {
  Button
} from '../components/ui/button';
import {
  Input
} from '../components/ui/input';
import {
  Label
} from '../components/ui/label';
import {
  auth
} from '../firebase';
import {
  useWorkspace
} from '../hooks/useWorkspace';
import {
  useClientAuthSnapshot
} from '../hooks/useClientAuthSnapshot';
import {
  getConflictWarningsEnabled,
  setConflictWarningsEnabled as storeConflictWarningsEnabled
} from '../lib/app-preferences';
import {
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  setBrowserNotificationsEnabled,
  supportsBrowserNotifications
} from '../lib/notifications';
import {
  getReminderSettings,
  setReminderSettings
} from '../lib/reminders';
import {
  updateProfileSettingsInSupabase,
  updateWorkspaceSettingsInSupabase,
  isSupabaseConfigured
} from '../lib/supabase-fallback';
import {
  getSupabaseAccessToken
} from '../lib/supabase-auth';
import {
  GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS
} from '../lib/options';
import {
  getGoogleCalendarReminderPreference,
  setGoogleCalendarReminderPreference
} from '../lib/google-calendar-reminder-preferences';
import { DEFAULT_HIGH_VALUE_THRESHOLD_PLN, DEFAULT_OWNER_CONTROL_CRITICAL_DAYS, DEFAULT_OWNER_CONTROL_WARNING_DAYS } from '../lib/owner-control/owner-risk-rules';
import { readOwnerRiskSettings, writeOwnerRiskSettings, getOwnerRiskSettingsStorageNote } from '../lib/owner-control/owner-risk-settings';
import '../styles/visual-stage19-settings-vnext.css';
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-settings-form-control-readability-stage179.css';
import '../styles/closeflow-settings-tabs-stage181ac.css';
import '../styles/closeflow-settings-summary-right-rail-stage181ae.css';
import '../styles/closeflow-settings-profile-readability-stage181af.css';
import '../styles/closeflow-settings-safe-copy-cleanup-stage181ai.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
import '../styles/closeflow-canvas-runtime-source-truth-stage211j.css';
const SETTINGS_VISUAL_REBUILD_STAGE19 = 'SETTINGS_VISUAL_REBUILD_STAGE19';
const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;
const DAILY_DIGEST_EMAIL_TEST_COPY_GUARD = 'Wyślij test teraz';
const DAILY_DIGEST_EMAIL_CRON_HINT_GUARD = 'Na darmowym Vercel cron działa raz dziennie';
const DAILY_DIGEST_EMAIL_CONFIG_COPY_GUARD = 'Sprawdź konfigurację';
const DAILY_DIGEST_EMAIL_READY_COPY_GUARD = 'Digest gotowy do wysyłki';
const DAILY_DIGEST_EMAIL_NEEDS_CONFIG_COPY_GUARD = 'Digest wymaga konfiguracji';
const DAILY_DIGEST_EMAIL_ENV_COPY_GUARD = 'RESEND_API_KEY: DIGEST_FROM_EMAIL:';
const GOOGLE_CALENDAR_CONFIG_REQUIRED_IS_NOT_USER_ERROR_STAGE86 = 'Google Calendar wymaga konfiguracji w Vercel';
const CLOSEFLOW_FB1_SETTINGS_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';
const SETTINGS_DATA_SECTION_VISIBLE = false;
const STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP = 'Google Calendar disconnected users see connect CTA and connected users see account/sync/disconnect controls';
void STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP;

type SettingsTab = 'account' | 'notifications' | 'integrations' | 'app' | 'security' | 'data';

const SETTINGS_TAB_ITEMS: Array<{
  id: SettingsTab;
  label: string;
  eyebrow: string;
  description: string;
}> = [
  { id: 'account', label: 'Konto', eyebrow: 'Profil i workspace', description: 'Operator, firma, plan i przestrzeń pracy.' },
  { id: 'notifications', label: 'Powiadomienia', eyebrow: 'Alerty i digest', description: 'Live, in-app, browser, przypomnienia i digest.' },
  { id: 'integrations', label: 'Integracje', eyebrow: 'Google Calendar', description: 'Połączenie, synchronizacja i przypomnienia Google.' },
  { id: 'app', label: 'Aplikacja', eyebrow: 'Widok i telefon', description: 'Motyw, PWA i preferencje działania aplikacji.' },
  { id: 'security', label: 'Bezpieczeństwo', eyebrow: 'Dostęp', description: 'E-mail, hasło i sesje użytkownika.' },
  { id: 'data', label: 'Dane', eyebrow: 'Import / eksport', description: 'Eksport, reset demo i przyszłe operacje na danych.' },
];

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

type GoogleCalendarOutboundResultState = {
  ok?: boolean;
  connected?: boolean;
  mode?: string;
  connectedCalendarId?: string;
  scanned?: number;
  created?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
  errors?: Array<{ id?: string; title?: string; error?: string }>;
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
  const { workspace, profile: workspaceProfile, loading: workspaceLoading, refresh, access, isAdmin, isAppOwner } = useWorkspace();
const authSnapshot = useClientAuthSnapshot();
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('account');

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
  const [liveNotificationsEnabled, setLiveNotificationsEnabled] = useState(true);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [dailyDigestEnabled, setDailyDigestEnabled] = useState(true);
  const [defaultReminderMinutes, setDefaultReminderMinutes] = useState('30');
  const [defaultSnoozeMinutes, setDefaultSnoozeMinutes] = useState('15');
  const [dailyDigestHour, setDailyDigestHour] = useState('7');
  const [dailyDigestTimezone, setDailyDigestTimezone] = useState('Europe/Warsaw');
  const [dailyDigestRecipientEmail, setDailyDigestRecipientEmail] = useState('');
  const [googleCalendarStatus, setGoogleCalendarStatus] = useState<GoogleCalendarStatusState | null>(null);
  const [checkingGoogleCalendar, setCheckingGoogleCalendar] = useState(false);
  const [connectingGoogleCalendar, setConnectingGoogleCalendar] = useState(false);
  const [disconnectingGoogleCalendar, setDisconnectingGoogleCalendar] = useState(false);
  const [syncingGoogleCalendarOutbound, setSyncingGoogleCalendarOutbound] = useState(false);
  const [googleCalendarOutboundResult, setGoogleCalendarOutboundResult] = useState<GoogleCalendarOutboundResultState | null>(null);
  const [googleCalendarReminderMethod, setGoogleCalendarReminderMethod] = useState(() => getGoogleCalendarReminderPreference().method);
  const [googleCalendarReminderMinutes, setGoogleCalendarReminderMinutes] = useState(() => String(getGoogleCalendarReminderPreference().minutesBefore));
  const [ownerRiskHighValueThreshold, setOwnerRiskHighValueThreshold] = useState(() => String(readOwnerRiskSettings().highValueThresholdPln));
  const [ownerRiskWarningDays, setOwnerRiskWarningDays] = useState(() => String(readOwnerRiskSettings().warningDays));
  const [ownerRiskCriticalDays, setOwnerRiskCriticalDays] = useState(() => String(readOwnerRiskSettings().criticalDays));
  const [savingOwnerRiskSettings, setSavingOwnerRiskSettings] = useState(false);

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
    const reminderSettings = getReminderSettings();
    setLiveNotificationsEnabled(reminderSettings.liveNotificationsEnabled);
    setDefaultReminderMinutes(String(reminderSettings.defaultReminderMinutes));
    setDefaultSnoozeMinutes(String(reminderSettings.defaultSnoozeMinutes));
    setDailyDigestEnabled(typeof workspace?.dailyDigestEnabled === 'boolean' ? workspace.dailyDigestEnabled : true);
    setDailyDigestHour(String(workspace?.dailyDigestHour ?? 7));
    setDailyDigestTimezone(workspace?.dailyDigestTimezone || workspace?.timezone || 'Europe/Warsaw');
    setDailyDigestRecipientEmail(workspace?.dailyDigestRecipientEmail || workspaceProfile?.email || auth.currentUser?.email || '');
    const ownerRiskSettings = readOwnerRiskSettings(workspace);
    setOwnerRiskWarningDays(String(ownerRiskSettings.warningDays));
    setOwnerRiskCriticalDays(String(ownerRiskSettings.criticalDays));
    setOwnerRiskHighValueThreshold(String(ownerRiskSettings.highValueThresholdPln));
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

  const accountEmail = auth.currentUser?.email || authSnapshot.email || workspaceProfile?.email || '';
  const planLabel = humanPlan(workspace?.planId, workspace?.subscriptionStatus);
  const accessLabel = humanAccessStatus(access?.status);
  const workspaceName = asText(workspaceProfile?.companyName || profile.companyName || workspace?.name, 'Workspace CloseFlow');
  // GOOGLE_CALENDAR_STAGE07C_SUPABASE_AUTH_SNAPSHOT
  const activeUserId = auth.currentUser?.uid || authSnapshot.uid || workspaceProfile?.id || '';
  const activeUserEmail = auth.currentUser?.email || authSnapshot.email || workspaceProfile?.email || '';

  const settingsSummary = useMemo(
    () => [
      { label: 'Konto', value: asText(profile.fullName || accountEmail, 'Operator') },
      { label: 'Workspace', value: workspaceName },
      { label: 'Plan', value: planLabel },
      { label: 'Dostęp', value: accessLabel },
    ],
    [accessLabel, accountEmail, planLabel, profile.fullName, workspaceName],
  );
  const canUseGoogleCalendarByPlan = Boolean(isAdmin || isAppOwner || access?.features?.googleCalendar);
  const canUseDigestByPlan = Boolean(isAdmin || isAppOwner || access?.features?.digest);
  const digestUiVisibleByPlan = DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan;
  const digestActionsDisabled = !canUseDigestByPlan;
  const googleCalendarMissingText = googleCalendarStatus?.missing?.length
    ? googleCalendarStatus.missing.join(', ')
    : '';
  const googleCalendarConfigured = googleCalendarStatus?.configured === true;
  const googleCalendarConnected = googleCalendarStatus?.connected === true;
  const buildGoogleCalendarRequestHeaders = async () => {
    const token = await getSupabaseAccessToken().catch(() => '');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-workspace-id': workspace?.id || '',
      'x-user-id': activeUserId,
      'x-user-email': activeUserEmail,
    };
  };

  // GOOGLE_CALENDAR_SYNC_V1_STAGE03_SETTINGS_UI_CONNECT
  const loadGoogleCalendarStatus = async () => {
    if (!workspace?.id || !activeUserId) return;

    if (!canUseGoogleCalendarByPlan) {
      setGoogleCalendarStatus({ configured: false, connected: false, missing: ['DISABLED_BY_PLAN'] });
      return;
    }

    setCheckingGoogleCalendar(true);
    try {
      const response = await fetch('/api/google-calendar?route=status', {
        method: 'GET',
        headers: await buildGoogleCalendarRequestHeaders(),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(String(data?.error || 'GOOGLE_CALENDAR_STATUS_FAILED'));
      setGoogleCalendarStatus(data as GoogleCalendarStatusState);
    } catch (error: any) {
      setGoogleCalendarStatus({ configured: false, connected: false, missing: ['STATUS_CHECK_FAILED'] });
      console.warn('GOOGLE_CALENDAR_STATUS_FAILED', error);
    } finally {
      setCheckingGoogleCalendar(false);
    }
  };

  useEffect(() => {
    if (!canUseGoogleCalendarByPlan) {
      setGoogleCalendarStatus({ configured: false, connected: false, missing: ['DISABLED_BY_PLAN'] });
      return;
    }

    void loadGoogleCalendarStatus();
  }, [workspace?.id, activeUserId, activeUserEmail, canUseGoogleCalendarByPlan]);

  const handleConnectGoogleCalendar = async () => {
    if (!workspace?.id || !activeUserId) {
      toast.error('Workspace albo użytkownik nie jest jeszcze gotowy. Odśwież stronę po zalogowaniu.');
      return;
    }

    if (!canUseGoogleCalendarByPlan) {
      toast.error('Google Calendar Sync jest przewidziany dla płatnych planów.');
      return;
    }

    setConnectingGoogleCalendar(true);
    try {
      const response = await fetch('/api/google-calendar?route=connect', {
        method: 'POST',
        headers: await buildGoogleCalendarRequestHeaders(),
        body: JSON.stringify({ returnTo: '/settings' }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409 && Array.isArray(data?.missing)) {
          setGoogleCalendarStatus({ configured: false, connected: false, missing: data.missing });
          toast.message(`Google Calendar wymaga konfiguracji w Vercel: ${data.missing.join(', ')}`);
          return;
        }
        throw new Error(String(data?.error || 'GOOGLE_CALENDAR_CONNECT_FAILED'));
      }

      if (data?.authUrl) {
        window.location.assign(String(data.authUrl));
        return;
      }

      toast.error('Google nie zwrócił adresu autoryzacji.');
    } catch (error: any) {
      toast.error(`Błąd połączenia Google Calendar: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setConnectingGoogleCalendar(false);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    if (!workspace?.id || !activeUserId) return;

    if (!window.confirm('Rozlaczyć Google Calendar dla tego workspace? Nowe wydarzenia nie będą synchronizowane.')) return;

    setDisconnectingGoogleCalendar(true);
    try {
      const response = await fetch('/api/google-calendar?route=disconnect', {
        method: 'POST',
        headers: await buildGoogleCalendarRequestHeaders(),
        body: JSON.stringify({}),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(String(data?.error || 'GOOGLE_CALENDAR_DISCONNECT_FAILED'));

      toast.success('Google Calendar został rozłączony.');
      await loadGoogleCalendarStatus();
    } catch (error: any) {
      toast.error(`Błąd rozłączania Google Calendar: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setDisconnectingGoogleCalendar(false);
    }
  };

  const handleSyncGoogleCalendarOutbound = async () => {
    if (!workspace?.id || !activeUserId) {
      toast.error('Workspace albo użytkownik nie jest jeszcze gotowy. Odśwież stronę po zalogowaniu.');
      return;
    }

    if (!canUseGoogleCalendarByPlan) {
      toast.error('Google Calendar Sync jest dostępny dla płatnych planów.');
      return;
    }

    setSyncingGoogleCalendarOutbound(true);
    setGoogleCalendarOutboundResult(null);
    try {
      const response = await fetch('/api/google-calendar?route=sync-outbound', {
        method: 'POST',
        headers: await buildGoogleCalendarRequestHeaders(),
        body: JSON.stringify({ mode: 'all', limit: 200, daysBack: 30, daysForward: 365 }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409 && Array.isArray(data?.missing)) {
          setGoogleCalendarStatus({ configured: false, connected: false, missing: data.missing });
          toast.message(`Google Calendar wymaga konfiguracji w Vercel: ${data.missing.join(', ')}`);
          return;
        }
        throw new Error(String(data?.error || 'GOOGLE_CALENDAR_SYNC_OUTBOUND_FAILED'));
      }
      setGoogleCalendarOutboundResult(data as GoogleCalendarOutboundResultState);

      if (!data?.connected) {
        toast.error('Google Calendar nie jest połączony. Najpierw połącz konto Google.');
        return;
      }

      const changed = Number(data.created || 0) + Number(data.updated || 0);
      if (Number(data.failed || 0) > 0) {
        toast.error('Google Calendar: ' + (data.failed || 0) + ' pozycji z błędem, ' + changed + ' zsynchronizowano.');
      } else {
        toast.success('Google Calendar zsynchronizowany: ' + changed + ' pozycji.');
      }
      await loadGoogleCalendarStatus();
    } catch (error: any) {
      toast.error('Błąd synchronizacji Google Calendar: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setSyncingGoogleCalendarOutbound(false);
    }
  };

  const handleSaveGoogleCalendarReminderPreference = () => {
    setGoogleCalendarReminderPreference({
      method: googleCalendarReminderMethod as any,
      minutesBefore: Number(googleCalendarReminderMinutes || '30'),
    });
    toast.success('Ustawienia przypomnień Google Calendar zapisane.');
  };

  const handleSaveOwnerRiskSettings = async () => {
    if (!workspace?.id) {
      toast.error('Brak aktywnego workspace. Odśwież aplikację i spróbuj ponownie.');
      return;
    }

    const warningDays = Number(ownerRiskWarningDays);
    const criticalDays = Number(ownerRiskCriticalDays);
    const highValueThresholdPln = ownerRiskHighValueThreshold.trim() ? Number(ownerRiskHighValueThreshold) : DEFAULT_HIGH_VALUE_THRESHOLD_PLN;
    if (!Number.isInteger(warningDays) || warningDays < 1 || warningDays > 365) {
      toast.error('Próg ostrzegawczy musi być pełną liczbą od 1 do 365 dni.');
      return;
    }
    if (!Number.isInteger(criticalDays) || criticalDays < 1 || criticalDays > 365 || criticalDays <= warningDays) {
      toast.error('Alarm krytyczny musi być później niż ostrzeżenie i mieścić się w zakresie 1-365 dni.');
      return;
    }
    if (!Number.isFinite(highValueThresholdPln) || highValueThresholdPln < 0) {
      toast.error('Próg wysokiej wartości nie może być ujemny.');
      return;
    }

    setSavingOwnerRiskSettings(true);
    try {
      let workspaceSaved = false;
      if (isSupabaseConfigured()) {
        try {
          await updateWorkspaceSettingsInSupabase({
            workspaceId: workspace.id,
            ownerControlWarningDays: warningDays,
            ownerControlCriticalDays: criticalDays,
            ownerControlHighValueThresholdPln: Math.round(highValueThresholdPln),
          });
          workspaceSaved = true;
        } catch {
          workspaceSaved = false;
        }
      }
      const normalized = writeOwnerRiskSettings({ warningDays, criticalDays, highValueThresholdPln });
      setOwnerRiskWarningDays(String(normalized.warningDays));
      setOwnerRiskCriticalDays(String(normalized.criticalDays));
      setOwnerRiskHighValueThreshold(String(normalized.highValueThresholdPln));
      await refresh();
      toast.success(workspaceSaved
        ? 'Progi kontroli sprzedaży zapisane dla całego workspace.'
        : 'API workspace jest niedostępne. Progi zapisano lokalnie jako fallback.');
    } catch (error: any) {
      toast.error(`Błąd zapisu progów: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSavingOwnerRiskSettings(false);
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
      setReminderSettings({
        browserNotificationsEnabled,
        liveNotificationsEnabled,
        dailyDigestEnabled,
        defaultReminderMinutes: Number(defaultReminderMinutes || '30'),
        defaultSnoozeMinutes: Number(defaultSnoozeMinutes || '15'),
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
      toast.success(nextValue ? 'Powiadomienia przeglądarki są aktywne.' : 'Powiadomienia przeglądarki zostały wyłączone.');
      refresh();
    } catch (error: any) {
      setBrowserNotificationsEnabled(!nextValue);
      setBrowserNotificationsEnabledState(!nextValue);
      toast.error(`Błąd zapisu powiadomień przeglądarki: ${error?.message || 'REQUEST_FAILED'}`);
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
      {DAILY_DIGEST_EMAIL_UI_VISIBLE ? (
        null
      ) : null}
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
          </div>
          <div className="settings-header-actions">
            <Button type="button" variant="outline" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
              Odśwież
            </Button>
          </div>
        </header>

        <section hidden className="settings-summary-grid settings-summary-grid-top-stage181ae-hidden" aria-label="Podsumowanie ustawień" data-settings-summary-top-stage181ae="hidden">
          {settingsSummary.map((item) => (
            <article key={item.label} className="settings-summary-card">
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <nav className="settings-tabs-stage181ac" data-settings-tabs-stage181ac="true" aria-label="Kategorie ustawień">
          {SETTINGS_TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeSettingsTab === tab.id ? 'settings-tab-stage181ac settings-tab-stage181ac-active' : 'settings-tab-stage181ac'}
              data-settings-tab-kind={tab.id}
              onClick={() => setActiveSettingsTab(tab.id)}
              aria-pressed={activeSettingsTab === tab.id}
            >
              <span>{tab.eyebrow}</span>
              <strong>{tab.label}</strong>
              <small>{tab.description}</small>
            </button>
          ))}
        </nav>

        <div className="settings-shell">
          <section className="settings-main-column">
                            <section hidden={activeSettingsTab !== 'integrations' || canUseGoogleCalendarByPlan} className="settings-section-card settings-tab-empty-stage181ac" data-settings-tab-panel="integrations" data-settings-integrations-empty-stage181ac="true">
                <div className="settings-section-head">
                  <div>
                    <span><CalendarDays className="h-4 w-4" /> Integracje</span>
                    <h2>Integracje niedostępne w tym planie</h2>
                    <p>Google Calendar i zaawansowane integracje są pokazane po aktywacji odpowiedniego planu albo w trybie admina.</p>
                  </div>
                </div>
              </section>

<section hidden={activeSettingsTab !== 'integrations' || !canUseGoogleCalendarByPlan} data-settings-tab-panel="integrations" className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-stage12="outbound-backfill">
                <div className="settings-section-head">
                  <div>
                    <span><CalendarDays className="h-4 w-4" /> Google Calendar</span>
                    <h2>Synchronizacja z Google</h2>
                    <p>Połącz konto Google i zsynchronizuj zadania oraz wydarzenia z kalendarzem.</p>
                  </div>
                </div>

                <div className="settings-action-row">
                  <Button type="button" onClick={() => void handleSyncGoogleCalendarOutbound()} disabled={syncingGoogleCalendarOutbound || checkingGoogleCalendar || !canUseGoogleCalendarByPlan || !googleCalendarConfigured || !googleCalendarConnected}>
                    <RefreshCw className="h-4 w-4" />
                    {syncingGoogleCalendarOutbound ? 'Synchronizuję...' : 'Synchronizuj teraz'}
                  </Button>
                  <span className="settings-muted-note">

                  </span>
                </div>

                                <div className="settings-action-row" data-google-calendar-user-onboarding-stage232g-r3="true">
                  {!googleCalendarConnected ? (
                    <Button type="button" onClick={() => void handleConnectGoogleCalendar()} disabled={connectingGoogleCalendar || checkingGoogleCalendar || !canUseGoogleCalendarByPlan || !googleCalendarConfigured}>
                      <CalendarDays className="h-4 w-4" />
                      {connectingGoogleCalendar ? 'Lacze...' : 'Polacz Google Calendar'}
                    </Button>
                  ) : (
                    <>
                      <Button type="button" variant="outline" onClick={() => void handleDisconnectGoogleCalendar()} disabled={disconnectingGoogleCalendar || checkingGoogleCalendar}>
                        {disconnectingGoogleCalendar ? 'Rozlaczam...' : 'Rozlacz'}
                      </Button>
                    </>
                  )}
                  <span className="settings-muted-note" data-google-calendar-connection-state-stage232g-r3="true">
                    {!googleCalendarConfigured
                      ? `Google Calendar wymaga konfiguracji w Vercel${googleCalendarMissingText ? ': ' + googleCalendarMissingText : ''}.`
                      : googleCalendarConnected
                        ? `Polaczono: ${googleCalendarStatus?.connection?.googleAccountEmail || googleCalendarStatus?.connection?.googleCalendarId || 'Google Calendar'}`
                        : 'Nie polaczono. Dokoncz polaczenie Google Calendar, zeby wpisy tego uzytkownika synchronizowaly sie z jego kalendarzem.'}
                  </span>
                </div>

{googleCalendarOutboundResult ? (
                  <div className="settings-muted-note" data-google-calendar-stage12-result="true">
                    Sprawdzono: {googleCalendarOutboundResult.scanned ?? 0}. Utworzono: {googleCalendarOutboundResult.created ?? 0}. Zaktualizowano: {googleCalendarOutboundResult.updated ?? 0}. Pominięto: {googleCalendarOutboundResult.skipped ?? 0}. Błędy: {googleCalendarOutboundResult.failed ?? 0}.
                  </div>
                ) : null}
              </section>

                        <section hidden={activeSettingsTab !== 'integrations' || !canUseGoogleCalendarByPlan} data-settings-tab-panel="integrations" className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-reminder-ui="stage06">
              <div className="settings-section-head">
                <div>
                  <span><CalendarDays className="h-4 w-4" /> Google Calendar</span>
                  <h2>Przypomnienia Google Calendar</h2>
                  <p>Ustaw domyślne przypomnienie dla nowych i edytowanych wydarzeń.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <Label>Typ przypomnienia Google</Label>
                  <select
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={googleCalendarReminderMethod}
                    onChange={(event) => setGoogleCalendarReminderMethod(event.target.value as any)}
                  >
                    {GOOGLE_CALENDAR_REMINDER_METHOD_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="settings-field">
                  <Label>Ile minut wcześniej</Label>
                  <Input
                    type="number"
                    min={0}
                    max={40320}
                    value={googleCalendarReminderMinutes}
                    disabled={googleCalendarReminderMethod === 'default'}
                    onChange={(event) => setGoogleCalendarReminderMinutes(event.target.value)}
                  />
                </div>
              </div>

              <div className="settings-action-row">
                <Button type="button" onClick={handleSaveGoogleCalendarReminderPreference}>
                  <Save className="h-4 w-4" />
                  Zapisz przypomnienia Google
                </Button>
                <span className="settings-muted-note">

                </span>
              </div>
            </section>

<section data-settings-profile-readability-stage181af="true" hidden={activeSettingsTab !== 'account'} data-settings-tab-panel="account" className="settings-section-card">
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



            <section hidden={activeSettingsTab !== 'notifications'} data-settings-tab-panel="notifications" className="settings-section-card">
              <div className="settings-section-head">
                <div>
                  <span><EntityIcon entity="notification" className="h-4 w-4" /> Powiadomienia</span>
                  <h2>Powiadomienia</h2>
                  <p></p>
                </div>
              </div>

              <div className="settings-toggle-list" data-settings-notifications-source-truth-stage181ao2="true">
                <label className="settings-toggle-row" data-settings-app-notifications-checkbox-stage181ao2="true">
                  <div>
                    <strong>Powiadomienia w aplikacji</strong>
                    <span>Włącz przypomnienia i alerty widoczne wewnątrz CloseFlow.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={liveNotificationsEnabled}
                    onChange={(event) => {
                      const next = event.target.checked;
                      setLiveNotificationsEnabled(next);
                      setReminderSettings({ liveNotificationsEnabled: next });
                    }}
                  />
                </label>

                <label className="settings-toggle-row" data-settings-browser-checkbox-stage181ao2="true">
                  <div>
                    <strong>Powiadomienia przeglądarki</strong>
                    <span>{permissionCopy(browserPermission)}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={browserNotificationsEnabled}
                    disabled={browserPermission === 'unsupported'}
                    onChange={async (event) => {
                      const wantsEnabled = event.target.checked;

                      if (wantsEnabled && browserPermission !== 'granted') {
                        if (!supportsBrowserNotifications()) {
                          setBrowserPermission('unsupported');
                          toast.error('Ta przeglądarka nie wspiera powiadomień systemowych.');
                          return;
                        }

                        if (browserPermission === 'default') {
                          const permission = await Notification.requestPermission();
                          setBrowserPermission(permission);

                          if (permission !== 'granted') {
                            toast.error('Preferencja włączona w CloseFlow, ale przeglądarka może blokować wyświetlanie powiadomień.');
                          }
                        }

                        if (browserPermission === 'denied') {
                          toast.error('Preferencja włączona w CloseFlow, ale przeglądarka blokuje powiadomienia dla tej strony.');
                        }
                      }

                      if (wantsEnabled !== browserNotificationsEnabled) {
                        await toggleBrowserNotifications();
                      }
                    }}
                  />
                </label>

                <label className="settings-toggle-row" data-settings-conflict-warnings-checkbox-stage181ao2="true">
                  <div>
                    <strong>Ostrzeżenia o konfliktach terminów</strong>
                    <span>Pokazuj alert, gdy zadania lub wydarzenia nachodzą na siebie.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={conflictWarningsEnabled}
                    onChange={(event) => void handleConflictWarningsToggle(event.target.checked)}
                  />
                </label>

                <label className="settings-toggle-row" data-settings-digest-checkbox-stage181ao2="true">
                  <div>
                    <strong>Digest e-mail</strong>
                    <span>
                      {canUseDigestByPlan
                        ? 'Wysyłaj codzienne podsumowanie e-mail, jeśli plan i konfiguracja na to pozwalają.'
                        : 'Dostępne od planu Basic.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigestEnabled}
                    disabled={!canUseDigestByPlan}
                    onChange={(event) => setDailyDigestEnabled(event.target.checked)}
                  />
                </label>
              </div>

              {digestUiVisibleByPlan ? (
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
                      disabled={sendingDigestTest || !workspace?.id || !dailyDigestRecipientEmail.trim() || digestActionsDisabled}
                      title="Wyślij test teraz"
                      aria-label="Wyślij test teraz"
                    >
                      {sendingDigestTest ? 'Wysyłanie...' : 'Wyślij test teraz'}
                    </Button>
                  </div>
                  {!canUseDigestByPlan ? (
                    <div className="settings-diagnostics-box">
                      <div>Plan Free: digest jest zablokowany. Przejdź na Basic/Pro/AI, żeby uruchomić wysyłkę.</div>
                    </div>
                  ) : null}
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


            <section hidden={activeSettingsTab !== 'integrations' || !canUseGoogleCalendarByPlan} data-settings-tab-panel="integrations" className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-sync-v1-stage03="true">
              <div className="settings-section-head">
                <div>
                  <span><CalendarDays className="h-4 w-4" /> Google Calendar</span>
                  <h2>Google Calendar Sync V1</h2>
                  <p></p>
                </div>
              </div>

              <div className="settings-browser-box">
                <div>
                  <strong>Status integracji</strong>
                  <span>
                    {checkingGoogleCalendar
                      ? 'Sprawdzanie statusu...'
                      : googleCalendarStatus?.connected
                        ? 'Połączenie aktywne. Nowe wydarzenia z CloseFlow będą kopiowane do Google Calendar.'
                        : googleCalendarStatus?.configured
                          ? 'Konfiguracja serwera wygląda poprawnie. Możesz połączyć konto Google.'
                          : 'Integracja wymaga konfiguracji ENV i OAuth przed użyciem.'}
                  </span>
                  {googleCalendarMissingText ? (
                    <span>Brakujące ENV: {googleCalendarMissingText}</span>
                  ) : null}
                  {!canUseGoogleCalendarByPlan ? (
                    <span>Funkcja jest przewidziana dla płatnych planów. Admin może użyć jej do testów.</span>
                  ) : null}
                </div>
                <span className="settings-soft-pill">
                  {googleCalendarStatus?.connected
                    ? 'Połączone'
                    : googleCalendarStatus?.configured
                      ? 'Gotowe do połączenia'
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
                  {checkingGoogleCalendar ? 'Sprawdzanie...' : 'Odśwież status'}
                </Button>
                {googleCalendarConnected ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleDisconnectGoogleCalendar()}
                    disabled={disconnectingGoogleCalendar || !workspace?.id}
                  >
                    {disconnectingGoogleCalendar ? 'Rozlaczanie...' : 'Rozlacz Google'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => void handleConnectGoogleCalendar()}
                    disabled={connectingGoogleCalendar || checkingGoogleCalendar || !workspace?.id || !canUseGoogleCalendarByPlan || googleCalendarStatus?.configured === false}
                  >
                    {connectingGoogleCalendar ? 'Przekierowanie...' : googleCalendarStatus?.configured === false ? 'Wymaga konfiguracji' : 'Polacz Google'}
                  </Button>
                )}
              </div>

              <div className="settings-diagnostics-box">
                <div></div>
                <div></div>
              </div>
            </section>

<section hidden={activeSettingsTab !== 'app'} data-settings-tab-panel="app" className="settings-section-card" data-stage222-owner-risk-settings="true" data-stage231f-r3-owner-control-settings="true">
              <div className="settings-section-head">
                <div>
                  <span><SlidersHorizontal className="h-4 w-4" /> Kontrola sprzedaży</span>
                  <h2>Progi kontroli sprzedaży</h2>
                  <p>Po ilu dniach bez kontaktu temat wymaga uwagi.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <Label>Ostrzegaj po</Label>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    step={1}
                    inputMode="numeric"
                    value={ownerRiskWarningDays}
                    onChange={(event) => setOwnerRiskWarningDays(event.target.value)}
                    placeholder={String(DEFAULT_OWNER_CONTROL_WARNING_DAYS)}
                    disabled={!isAdmin && !isAppOwner}
                  />
                  <span className="settings-muted-note">dni bez kontaktu lub świeżego ruchu</span>
                </div>
                <div className="settings-field">
                  <Label>Alarm krytyczny po</Label>
                  <Input
                    type="number"
                    min={2}
                    max={365}
                    step={1}
                    inputMode="numeric"
                    value={ownerRiskCriticalDays}
                    onChange={(event) => setOwnerRiskCriticalDays(event.target.value)}
                    placeholder={String(DEFAULT_OWNER_CONTROL_CRITICAL_DAYS)}
                    disabled={!isAdmin && !isAppOwner}
                  />
                  <span className="settings-muted-note">musi być później niż ostrzeżenie</span>
                </div>
                <div className="settings-field">
                  <Label>Wysoka wartość od</Label>
                  <Input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={ownerRiskHighValueThreshold}
                    onChange={(event) => setOwnerRiskHighValueThreshold(event.target.value)}
                    placeholder="5000"
                    disabled={!isAdmin && !isAppOwner}
                  />
                  <span className="settings-muted-note">PLN</span>
                </div>
              </div>

              <div className="settings-diagnostics-box" data-stage231f-r3-owner-control-preview="true">
                <div>
                  <strong>{ownerRiskWarningDays || DEFAULT_OWNER_CONTROL_WARNING_DAYS} dni = ostrzeżenie</strong>
                  <span className="settings-muted-note">Temat trafia na listę rzeczy do sprawdzenia.</span>
                </div>
                <div>
                  <strong>{ownerRiskCriticalDays || DEFAULT_OWNER_CONTROL_CRITICAL_DAYS} dni = czerwony alert</strong>
                  <span className="settings-muted-note">Temat wymaga pilnej decyzji lub kontaktu.</span>
                </div>
              </div>

              <div className="settings-action-row">
                <Button type="button" onClick={() => void handleSaveOwnerRiskSettings()} disabled={savingOwnerRiskSettings || (!isAdmin && !isAppOwner)}>
                  <Save className="h-4 w-4" />
                  {savingOwnerRiskSettings ? 'Zapisywanie...' : 'Zapisz progi'}
                </Button>
                <span className="settings-muted-note">
                  {isAdmin || isAppOwner ? getOwnerRiskSettingsStorageNote() : 'Tylko owner lub admin może zmieniać progi.'}
                </span>
              </div>
            </section>

<section hidden={activeSettingsTab !== 'app'} data-settings-tab-panel="app" className="settings-section-card" data-settings-pwa-help="true">
              <div className="settings-section-head">
                <div>
                  <span><Smartphone className="h-4 w-4" /> PWA / telefon</span>
                  <h2>Dodaj CloseFlow do ekranu głównego telefonu</h2>
                  <p></p>
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


            <section hidden={activeSettingsTab !== 'security'} data-settings-tab-panel="security" className="settings-section-card">
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

            <section hidden={!SETTINGS_DATA_SECTION_VISIBLE || activeSettingsTab !== 'data'} data-settings-data-section-hidden-stage180="true" data-settings-tab-panel="data" className="settings-section-card">
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

          <aside className="settings-right-rail settings-summary-right-rail-stage181ae" aria-label="Podsumowanie ustawień" data-settings-summary-right-rail-stage181ae="true">
            <section className="right-card settings-summary-rail-card-stage181ae">
              <div className="settings-summary-rail-head-stage181ae">
                <span className="settings-summary-rail-icon-stage181ae" aria-hidden="true">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <h2>Podsumowanie</h2>
                  <p>Konto, workspace, plan i dostęp w jednym miejscu.</p>
                </div>
              </div>

              <div className="settings-summary-rail-grid-stage181ae">
                {settingsSummary.map((item) => (
                  <article key={item.label} className="settings-summary-rail-item-stage181ae" data-settings-summary-item-stage181ae={String(item.label).toLowerCase()}>
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}

{/* STAGE16M_SETTINGS_PLAN_VISIBILITY_COMPAT
const loadGoogleCalendarStatus = async () => { if (!canUseGoogleCalendarByPlan) { DISABLED_BY_PLAN return; } setCheckingGoogleCalendar(true) }
useEffect(() => { if (!canUseGoogleCalendarByPlan) return; loadGoogleCalendarStatus() }, [workspace?.id, activeUserId, activeUserEmail, canUseGoogleCalendarByPlan])
<section hidden={!canUseGoogleCalendarByPlan} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-stage12="outbound-backfill"
<section hidden={!canUseGoogleCalendarByPlan} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-reminder-ui="stage06"
<section hidden={!canUseGoogleCalendarByPlan} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-sync-v1-stage03="true"
*/}
