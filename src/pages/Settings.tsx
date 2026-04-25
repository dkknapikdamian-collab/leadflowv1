import { useEffect, useState } from 'react';
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signOut,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { AlertTriangle, Bell, KeyRound, Mail, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { useAppearance } from '../components/appearance-provider';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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

const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;

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

export default function Settings() {
  const { workspace, profile: workspaceProfile, loading: workspaceLoading, refresh } = useWorkspace();
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
    setDailyDigestEnabled(
      typeof workspace?.dailyDigestEnabled === 'boolean' ? workspace.dailyDigestEnabled : true,
    );
    setDailyDigestHour(String(workspace?.dailyDigestHour ?? 7));
    setDailyDigestTimezone(workspace?.dailyDigestTimezone || workspace?.timezone || 'Europe/Warsaw');
    setDailyDigestRecipientEmail(
      workspace?.dailyDigestRecipientEmail || workspaceProfile?.email || auth.currentUser?.email || '',
    );
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

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;

    setSavingProfile(true);
    try {
      await updateProfileSettingsInSupabase({
        fullName: profile.fullName,
        companyName: profile.companyName,
        email: auth.currentUser.email || workspaceProfile?.email || '',
        workspaceId: workspace?.id || null,
      });
      toast.success('Profil zaktualizowany');
      refresh();
    } catch (error: any) {
      toast.error(`Blad: ${error?.message || 'REQUEST_FAILED'}`);
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
      toast.error(`Blad zapisu digestu: ${error?.message || 'REQUEST_FAILED'}`);
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
      if (!response.ok) {
        throw new Error(String(data?.error || 'DIGEST_DIAGNOSTICS_FAILED'));
      }

      setDigestDiagnostics(data as DigestDiagnosticsState);
      toast.success(data?.canSend ? 'Digest jest gotowy do wysylki.' : 'Diagnostyka digestu wykryla braki.');
    } catch (error: any) {
      toast.error(`Blad diagnostyki digestu: ${error?.message || 'REQUEST_FAILED'}`);
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
      if (!response.ok) {
        throw new Error(String(data?.error || 'DIGEST_TEST_SEND_FAILED'));
      }

      toast.success(`Wyslano testowy digest na ${data?.recipientEmail || recipientEmail}.`);
    } catch (error: any) {
      toast.error(`Blad wysylki testowego digestu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSendingDigestTest(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!auth.currentUser?.email) return;
    if (!passwordAuthAvailable) {
      toast.error('Zmiana e-maila z potwierdzeniem hasla dziala dla kont z logowaniem e-mail + haslo.');
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
      toast.error('Wpisz aktualne haslo, aby potwierdzic zmiane.');
      return;
    }

    setEmailChangeSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await verifyBeforeUpdateEmail(auth.currentUser, normalizedEmail);
      toast.success('Wyslalismy link potwierdzajacy na nowy e-mail. Zmiana zadziala po kliknieciu w link z wiadomosci.');
      setEmailChangeOpen(false);
      setNewEmail('');
      setCurrentPassword('');
    } catch (error: any) {
      toast.error(`Blad zmiany e-maila: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setEmailChangeSubmitting(false);
    }
  };

  const handleSendPasswordChangeLink = async () => {
    if (!auth.currentUser?.email) return;
    if (!passwordAuthAvailable) {
      toast.error('To konto nie ma aktywnego logowania e-mail + haslo.');
      return;
    }

    setPasswordResetSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      toast.success('Wyslalismy link do zmiany hasla na Twoj e-mail.');
    } catch (error: any) {
      toast.error(`Blad wysylki linku: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setPasswordResetSubmitting(false);
    }
  };

  const handleSetupPassword = async () => {
    if (!auth.currentUser?.email) return;

    if (passwordAuthAvailable) {
      toast.success('To konto ma juz aktywne logowanie e-mail + haslo.');
      setSetupPasswordOpen(false);
      return;
    }

    if (!setupPassword.trim() || setupPassword.trim().length < 8) {
      toast.error('Nowe haslo musi miec co najmniej 8 znakow.');
      return;
    }

    if (setupPassword !== setupPasswordConfirm) {
      toast.error('Hasla nie sa takie same.');
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
      toast.success('Haslo do logowania e-mail zostalo ustawione. Teraz mozesz zmieniac e-mail i haslo z poziomu ustawien.');
      refresh();
    } catch (error: any) {
      const code = String(error?.code || '');
      if (code === 'auth/provider-already-linked') {
        setPasswordAuthAvailable(true);
        setSetupPasswordOpen(false);
        toast.success('Logowanie e-mail + haslo bylo juz aktywne dla tego konta.');
      } else {
        toast.error(`Blad ustawiania hasla: ${error?.message || 'REQUEST_FAILED'}`);
      }
    } finally {
      setSetupPasswordSubmitting(false);
    }
  };

  const requestBrowserPermission = async () => {
    if (!supportsBrowserNotifications()) {
      toast.error('Ta przegladarka nie wspiera powiadomien systemowych.');
      return;
    }

    const result = await Notification.requestPermission();
    setBrowserPermission(result);
    if (result === 'granted') {
      toast.success('Powiadomienia przegladarki zostaly wlaczone.');
    } else if (result === 'denied') {
      toast.error('Powiadomienia sa zablokowane w przegladarce.');
    } else {
      toast.error('Powiadomienia nie zostaly jeszcze zatwierdzone.');
    }
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
      toast.success(nextValue ? 'Live powiadomienia sa aktywne.' : 'Live powiadomienia zostaly wylaczone.');
      refresh();
    } catch (error: any) {
      setBrowserNotificationsEnabled(!nextValue);
      setBrowserNotificationsEnabledState(!nextValue);
      toast.error(`Blad zapisu live powiadomien: ${error?.message || 'REQUEST_FAILED'}`);
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
      toast.success(nextValue ? 'Wlaczono ostrzezenia o konfliktach terminow' : 'Wylaczono ostrzezenia o konfliktach terminow');
      refresh();
    } catch (error: any) {
      setConflictWarningsEnabledState(!nextValue);
      storeConflictWarningsEnabled(!nextValue);
      toast.error(`Blad zapisu preferencji planowania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleSignOutEverywhere = async () => {
    if (!auth.currentUser) return;
    if (!window.confirm('Wylogowac wszystkie urzadzenia, lacznie z tym?')) return;

    setSigningOutEverywhere(true);
    try {
      await updateProfileSettingsInSupabase({
        forceLogoutAfter: new Date().toISOString(),
        workspaceId: workspace?.id || null,
      });
      toast.success('Wylogowano wszystkie urzadzenia. Zaloguj sie ponownie.');
      await signOut(auth);
    } catch (error: any) {
      toast.error(`Blad: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSigningOutEverywhere(false);
    }
  };

  if (workspaceLoading) {
    return (
      <Layout>
        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">Ladowanie ustawien...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Ustawienia</h1>
          <p className="text-slate-500">Zarzadzaj swoim kontem i konfiguracja systemu.</p>
        </header>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                Profil operatora
              </CardTitle>
              <CardDescription>Twoje dane wyswietlane w systemie i dla klientow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Imie i nazwisko</Label>
                  <Input value={profile.fullName} onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Nazwa firmy</Label>
                  <Input value={profile.companyName} onChange={(e) => setProfile((prev) => ({ ...prev, companyName: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Aktualny e-mail</Label>
                <Input value={auth.currentUser?.email || workspaceProfile?.email || ''} disabled />
              </div>
              <Button onClick={() => void handleUpdateProfile()} className="w-full md:w-auto" disabled={savingProfile}>
                {savingProfile ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-slate-400" />
                Ustawienia aplikacji
              </CardTitle>
              <CardDescription>Tu trzymamy wyglad aplikacji, powiadomienia, planowanie i digest workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="appearance" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="appearance">Motyw</TabsTrigger>
                  <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
                  <TabsTrigger value="planning">Planowanie</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                            .catch((error: any) => toast.error(`Blad zapisu motywu: ${error?.message || 'REQUEST_FAILED'}`));
                        }}
                        className={`text-left min-h-[104px] p-3 md:p-4 rounded-xl border transition ${
                          skin === option.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{option.label}</p>
                        <p className="text-sm text-slate-500 mt-1">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <Bell className="w-4 h-4 text-slate-400" />
                      Powiadomienia przegladarki
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {browserPermission === 'unsupported'
                        ? 'Ta przegladarka nie wspiera powiadomien systemowych.'
                        : browserPermission === 'granted'
                          ? 'Powiadomienia systemowe sa juz wlaczone.'
                          : browserPermission === 'denied'
                            ? 'Powiadomienia sa zablokowane w przegladarce. Odblokuj je w ustawieniach przegladarki.'
                            : 'Powiadomienia nie sa jeszcze zatwierdzone.'}
                    </p>
                    <div className="mt-3 flex flex-col gap-3 md:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void requestBrowserPermission()}
                        disabled={browserPermission === 'granted' || browserPermission === 'unsupported' || browserPermission === 'denied'}
                      >
                        {browserPermission === 'granted'
                          ? 'Powiadomienia przegladarki sa wlaczone'
                          : browserPermission === 'denied'
                            ? 'Powiadomienia sa zablokowane'
                            : browserPermission === 'unsupported'
                              ? 'Przegladarka nie wspiera powiadomien'
                              : 'Wlacz powiadomienia przegladarki'}
                      </Button>

                      <Button type="button" variant={browserNotificationsEnabled ? 'outline' : 'default'} onClick={() => void toggleBrowserNotifications()}>
                        {browserNotificationsEnabled ? 'Wylacz live powiadomienia' : 'Wlacz live powiadomienia'}
                      </Button>
                    </div>
                  </div>

                  {DAILY_DIGEST_EMAIL_UI_VISIBLE ? (
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <Mail className="w-4 h-4 text-slate-400" />
                        Daily digest workspace
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Te ustawienia sa wspolne dla calego workspace i trafiaja bezposrednio do backendu digestu.</p>
                    </div>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dailyDigestEnabled}
                        onChange={(event) => setDailyDigestEnabled(event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">Wlacz codzienny digest</p>
                        <p className="mt-1 text-sm text-slate-500">Backend wysyla podsumowanie dnia wedlug ustawien workspace.</p>
                      </div>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Godzina wysylki</Label>
                        <Input
                          type="number"
                          min={0}
                          max={23}
                          value={dailyDigestHour}
                          onChange={(e) => setDailyDigestHour(e.target.value)}
                        />
                      <p className="mt-1 text-xs text-slate-500">
                        Na darmowym Vercel cron dziala raz dziennie. Godzina jest zachowana jako ustawienie workspace, ale automatyczna wysylka idzie przy dziennym wywolaniu crona.
                      </p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Strefa czasowa</Label>
                        <Input
                          value={dailyDigestTimezone}
                          onChange={(e) => setDailyDigestTimezone(e.target.value)}
                          placeholder="Europe/Warsaw"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Adres odbiorcy</Label>
                      <Input
                        type="email"
                        value={dailyDigestRecipientEmail}
                        onChange={(e) => setDailyDigestRecipientEmail(e.target.value)}
                        placeholder="operator@email.pl"
                      />
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row">
                      <Button type="button" onClick={() => void handleSaveDigestSettings()} disabled={savingWorkspaceSettings || !workspace?.id}>
                        {savingWorkspaceSettings ? 'Zapisywanie...' : 'Zapisz ustawienia digestu'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void handleCheckDigestDiagnostics()}
                        disabled={checkingDigestDiagnostics || !workspace?.id}
                      >
                        {checkingDigestDiagnostics ? 'Sprawdzanie...' : 'Sprawdz konfiguracje'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void handleSendDigestTest()}
                        disabled={sendingDigestTest || !workspace?.id || !dailyDigestRecipientEmail.trim()}
                      >
                        {sendingDigestTest ? 'Wysylanie testu...' : 'Wyslij test teraz'}
                      </Button>
                    </div>

                    {digestDiagnostics ? (
                      <div className={`rounded-2xl border p-4 text-sm ${digestDiagnostics.canSend ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
                        <p className="font-semibold">
                          {digestDiagnostics.canSend ? 'Digest gotowy do wysylki' : 'Digest wymaga konfiguracji'}
                        </p>
                        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                          <p>RESEND_API_KEY: {digestDiagnostics.env?.hasResendApiKey ? 'OK' : 'Brak'}</p>
                          <p>DIGEST_FROM_EMAIL: {digestDiagnostics.env?.fromEmail || 'Brak'}</p>
                          <p>APP_URL: {digestDiagnostics.env?.appUrl || 'Brak'}</p>
                          <p>Odbiorca: {digestDiagnostics.workspace?.dailyDigestRecipientEmail || 'Brak'}</p>
                          <p>Godzina: {digestDiagnostics.workspace?.dailyDigestHour ?? dailyDigestHour}</p>
                          <p>Strefa: {digestDiagnostics.workspace?.dailyDigestTimezone || dailyDigestTimezone}</p>
                        </div>
                        {digestDiagnostics.hints && digestDiagnostics.hints.length > 0 ? (
                          <p className="mt-3 text-xs">Braki: {digestDiagnostics.hints.join(', ')}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="planning" className="space-y-4">
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={conflictWarningsEnabled}
                      onChange={(event) => {
                        void handleConflictWarningsToggle(event.target.checked);
                      }}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Pokazuj ostrzezenia o konfliktach terminow</p>
                      <p className="mt-1 text-sm text-slate-500">Przy dodawaniu lub edycji zadania albo wydarzenia aplikacja pokaze konflikt z istniejacym wpisem i zapyta, czy mimo to zapisac.</p>
                    </div>
                  </label>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-400" />
                Bezpieczenstwo
              </CardTitle>
              <CardDescription>Zarzadzaj dostepem do swojego konta, e-maila i hasla.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <Mail className="w-4 h-4 text-slate-400" />
                      Zmiana e-maila
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Aktualny adres: {auth.currentUser?.email || 'Brak adresu e-mail'}
                    </p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setEmailChangeOpen((value) => !value)}>
                    {emailChangeOpen ? 'Anuluj' : 'Zmien e-mail'}
                  </Button>
                </div>

                {emailChangeOpen ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Nowy e-mail</Label>
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="nowy@email.pl"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Aktualne haslo</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Potwierdz aktualnym haslem"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <Button type="button" onClick={() => void handleChangeEmail()} disabled={emailChangeSubmitting}>
                        {emailChangeSubmitting ? 'Wysylanie...' : 'Wyslij potwierdzenie na nowy e-mail'}
                      </Button>
                      <p className="text-xs text-slate-500">
                        Po potwierdzeniu haslem wyslemy link na nowy adres. Zmiana aktywuje sie po kliknieciu w link z wiadomosci.
                      </p>
                      {!passwordAuthAvailable ? (
                        <p className="text-xs text-amber-600">
                          To konto nie ma aktywnego logowania e-mail + haslo, wiec ta zmiana nie jest teraz dostepna.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  Zmiana hasla
                </div>
                <p className="text-sm text-slate-500">
                  Wyslemy bezpieczny link do zmiany hasla na Twoj obecny adres e-mail.
                </p>
                <Button type="button" variant="outline" onClick={() => void handleSendPasswordChangeLink()} disabled={passwordResetSubmitting}>
                  {passwordResetSubmitting ? 'Wysylanie...' : 'Wyslij link do zmiany hasla'}
                </Button>
                {!passwordAuthAvailable ? (
                  <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs text-amber-700">
                      To konto nie ma jeszcze aktywnego logowania e-mail + haslo. Najpierw ustaw haslo do tego konta.
                    </p>
                    <Button type="button" variant="outline" onClick={() => setSetupPasswordOpen((value) => !value)}>
                      {setupPasswordOpen ? 'Anuluj ustawianie hasla' : 'Ustaw haslo do tego konta'}
                    </Button>
                    {setupPasswordOpen ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Nowe haslo</Label>
                          <Input
                            type="password"
                            value={setupPassword}
                            onChange={(e) => setSetupPassword(e.target.value)}
                            placeholder="Minimum 8 znakow"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Powtorz nowe haslo</Label>
                          <Input
                            type="password"
                            value={setupPasswordConfirm}
                            onChange={(e) => setSetupPasswordConfirm(e.target.value)}
                            placeholder="Powtorz nowe haslo"
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-2">
                          <Button type="button" onClick={() => void handleSetupPassword()} disabled={setupPasswordSubmitting}>
                            {setupPasswordSubmitting ? 'Ustawianie hasla...' : 'Aktywuj logowanie e-mail + haslo'}
                          </Button>
                          <p className="text-xs text-slate-500">
                            To doda lokalne logowanie e-mail + haslo do obecnego konta. Potem odblokuje zmiane e-maila i zmiane hasla z poziomu ustawien.
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Shield className="w-4 h-4 text-slate-400" />
                  Wylogowanie globalne
                </div>
                <p className="text-sm text-slate-500">
                  Konczy sesje na wszystkich urzadzeniach, takze na tym, z ktorego teraz korzystasz.
                </p>
                <Button
                  variant="outline"
                  className="w-full md:w-auto text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                  onClick={() => void handleSignOutEverywhere()}
                  disabled={signingOutEverywhere}
                >
                  {signingOutEverywhere ? 'Wylogowywanie...' : 'Wyloguj ze wszystkich urzadzen'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
