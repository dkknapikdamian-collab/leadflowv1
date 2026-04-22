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
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { AlertTriangle, Bell, KeyRound, Mail, Palette, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { useAppearance } from '../components/appearance-provider';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { auth, db } from '../firebase';
import { getConflictWarningsEnabled, setConflictWarningsEnabled as storeConflictWarningsEnabled } from '../lib/app-preferences';
import {
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  setBrowserNotificationsEnabled,
  supportsBrowserNotifications,
} from '../lib/notifications';

export default function Settings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  const { skin, setSkin, skinOptions } = useAppearance();

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser!.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data());
      } else {
        setProfile({
          fullName: auth.currentUser?.displayName || '',
          companyName: '',
          email: auth.currentUser?.email || '',
        });
      }

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
      setConflictWarningsEnabledState(getConflictWarningsEnabled());
      setBrowserNotificationsEnabledState(getBrowserNotificationsEnabled());
      setBrowserPermission(getBrowserNotificationPermission());
      setLoading(false);
    };

    void fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'profiles', auth.currentUser.uid), {
        fullName: profile.fullName,
        companyName: profile.companyName,
      });
      toast.success('Profil zaktualizowany');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
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
      toast.success('Wysłaliśmy link potwierdzający na nowy e-mail. Zmiana zadziała po kliknięciu w link z wiadomości.');
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
      await updateDoc(doc(db, 'profiles', auth.currentUser.uid), {
        email: auth.currentUser.email,
        updatedAt: serverTimestamp(),
      });
      setPasswordAuthAvailable(true);
      setSetupPassword('');
      setSetupPasswordConfirm('');
      setSetupPasswordOpen(false);
      toast.success('Hasło do logowania e-mail zostało ustawione. Teraz możesz zmieniać e-mail i hasło z poziomu ustawień.');
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
    if (result === 'granted') {
      toast.success('Powiadomienia przeglądarki zostały włączone.');
    } else if (result === 'denied') {
      toast.error('Powiadomienia są zablokowane w przeglądarce.');
    } else {
      toast.error('Powiadomienia nie zostały jeszcze zatwierdzone.');
    }
  };

  const toggleBrowserNotifications = () => {
    const nextValue = !browserNotificationsEnabled;
    setBrowserNotificationsEnabled(nextValue);
    setBrowserNotificationsEnabledState(nextValue);
    toast.success(nextValue ? 'Live powiadomienia są aktywne.' : 'Live powiadomienia zostały wyłączone.');
  };

  const handleSignOutEverywhere = async () => {
    if (!auth.currentUser) return;
    if (!window.confirm('Wylogować wszystkie urządzenia, łącznie z tym?')) return;

    setSigningOutEverywhere(true);
    try {
      await setDoc(
        doc(db, 'profiles', auth.currentUser.uid),
        {
          forceLogoutAfter: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      toast.success('Wylogowano wszystkie urządzenia. Zaloguj się ponownie.');
      await signOut(auth);
    } catch (error: any) {
      toast.error(`Błąd: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSigningOutEverywhere(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">Ładowanie ustawień...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Ustawienia</h1>
          <p className="text-slate-500">Zarządzaj swoim kontem i konfiguracją systemu.</p>
        </header>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                Profil operatora
              </CardTitle>
              <CardDescription>Twoje dane wyświetlane w systemie i dla klientów.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Imię i nazwisko</Label>
                  <Input value={profile?.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Nazwa firmy</Label>
                  <Input value={profile?.companyName || ''} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Aktualny e-mail</Label>
                <Input value={auth.currentUser?.email || profile?.email || ''} disabled />
              </div>
              <Button onClick={handleUpdateProfile} className="w-full md:w-auto">Zapisz zmiany</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-slate-400" />
                Ustawienia aplikacji
              </CardTitle>
              <CardDescription>Tu trzymamy wygląd aplikacji, powiadomienia i planowanie.</CardDescription>
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
                            .then(() => toast.success(`Aktywowano motyw: ${option.label}`))
                            .catch((error: any) => toast.error(`Błąd zapisu motywu: ${error?.message || 'REQUEST_FAILED'}`));
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
                      Powiadomienia przeglądarki
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {browserPermission === 'unsupported'
                        ? 'Ta przeglądarka nie wspiera powiadomień systemowych.'
                        : browserPermission === 'granted'
                          ? 'Powiadomienia systemowe są już włączone.'
                          : browserPermission === 'denied'
                            ? 'Powiadomienia są zablokowane w przeglądarce. Odblokuj je w ustawieniach przeglądarki.'
                            : 'Powiadomienia nie są jeszcze zatwierdzone.'}
                    </p>
                    <div className="mt-3 flex flex-col gap-3 md:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void requestBrowserPermission()}
                        disabled={browserPermission === 'granted' || browserPermission === 'unsupported' || browserPermission === 'denied'}
                      >
                        {browserPermission === 'granted'
                          ? 'Powiadomienia przeglądarki są włączone'
                          : browserPermission === 'denied'
                            ? 'Powiadomienia są zablokowane'
                            : browserPermission === 'unsupported'
                              ? 'Przeglądarka nie wspiera powiadomień'
                              : 'Włącz powiadomienia przeglądarki'}
                      </Button>

                      <Button type="button" variant={browserNotificationsEnabled ? 'outline' : 'default'} onClick={toggleBrowserNotifications}>
                        {browserNotificationsEnabled ? 'Wyłącz live powiadomienia' : 'Włącz live powiadomienia'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="planning" className="space-y-4">
                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={conflictWarningsEnabled}
                      onChange={(event) => {
                        const nextValue = event.target.checked;
                        setConflictWarningsEnabledState(nextValue);
                        storeConflictWarningsEnabled(nextValue);
                        toast.success(nextValue ? 'Włączono ostrzeżenia o konfliktach terminów' : 'Wyłączono ostrzeżenia o konfliktach terminów');
                      }}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Pokazuj ostrzeżenia o konfliktach terminów</p>
                      <p className="mt-1 text-sm text-slate-500">Przy dodawaniu lub edycji zadania albo wydarzenia aplikacja pokaże konflikt z istniejącym wpisem i zapyta, czy mimo to zapisać.</p>
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
                Bezpieczeństwo
              </CardTitle>
              <CardDescription>Zarządzaj dostępem do swojego konta, e-maila i hasła.</CardDescription>
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
                    {emailChangeOpen ? 'Anuluj' : 'Zmień e-mail'}
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
                      <Label>Aktualne hasło</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Potwierdź aktualnym hasłem"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <Button type="button" onClick={() => void handleChangeEmail()} disabled={emailChangeSubmitting}>
                        {emailChangeSubmitting ? 'Wysyłanie...' : 'Wyślij potwierdzenie na nowy e-mail'}
                      </Button>
                      <p className="text-xs text-slate-500">
                        Po potwierdzeniu hasłem wyślemy link na nowy adres. Zmiana aktywuje się po kliknięciu w link z wiadomości.
                      </p>
                      {!passwordAuthAvailable ? (
                        <p className="text-xs text-amber-600">
                          To konto nie ma aktywnego logowania e-mail + hasło, więc ta zmiana nie jest teraz dostępna.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  Zmiana hasła
                </div>
                <p className="text-sm text-slate-500">
                  Wyślemy bezpieczny link do zmiany hasła na Twój obecny adres e-mail.
                </p>
                <Button type="button" variant="outline" onClick={() => void handleSendPasswordChangeLink()} disabled={passwordResetSubmitting}>
                  {passwordResetSubmitting ? 'Wysyłanie...' : 'Wyślij link do zmiany hasła'}
                </Button>
                {!passwordAuthAvailable ? (
                  <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs text-amber-700">
                      To konto nie ma jeszcze aktywnego logowania e-mail + hasło. Najpierw ustaw hasło do tego konta.
                    </p>
                    <Button type="button" variant="outline" onClick={() => setSetupPasswordOpen((value) => !value)}>
                      {setupPasswordOpen ? 'Anuluj ustawianie hasła' : 'Ustaw hasło do tego konta'}
                    </Button>
                    {setupPasswordOpen ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Nowe hasło</Label>
                          <Input
                            type="password"
                            value={setupPassword}
                            onChange={(e) => setSetupPassword(e.target.value)}
                            placeholder="Minimum 8 znaków"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Powtórz nowe hasło</Label>
                          <Input
                            type="password"
                            value={setupPasswordConfirm}
                            onChange={(e) => setSetupPasswordConfirm(e.target.value)}
                            placeholder="Powtórz nowe hasło"
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-2">
                          <Button type="button" onClick={() => void handleSetupPassword()} disabled={setupPasswordSubmitting}>
                            {setupPasswordSubmitting ? 'Ustawianie hasła...' : 'Aktywuj logowanie e-mail + hasło'}
                          </Button>
                          <p className="text-xs text-slate-500">
                            To doda lokalne logowanie e-mail + hasło do obecnego konta. Potem odblokuje zmianę e-maila i zmianę hasła z poziomu ustawień.
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
                  Kończy sesję na wszystkich urządzeniach, także na tym, z którego teraz korzystasz.
                </p>
                <Button
                  variant="outline"
                  className="w-full md:w-auto text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                  onClick={() => void handleSignOutEverywhere()}
                  disabled={signingOutEverywhere}
                >
                  {signingOutEverywhere ? 'Wylogowywanie...' : 'Wyloguj ze wszystkich urządzeń'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
