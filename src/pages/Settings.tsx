import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { auth, db } from '../firebase';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { User, Shield, Bell, Palette, Clock } from 'lucide-react';
import {
  getBrowserNotificationPermission,
  loadReminderSettings,
  requestBrowserNotificationPermission,
  saveReminderSettings,
  type ReminderSettings,
} from '../lib/notifications';

export default function Settings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => loadReminderSettings(auth.currentUser?.uid ?? 'local'));
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>(() => getBrowserNotificationPermission());

  useEffect(() => {
    if (!auth.currentUser) return;
    const fetchProfile = async () => {
      const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser!.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data());
      }
      setReminderSettings(loadReminderSettings(auth.currentUser!.uid));
      setBrowserPermission(getBrowserNotificationPermission());
      setLoading(false);
    };
    fetchProfile();
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
      toast.error('Błąd: ' + error.message);
    }
  };

  const updateReminderSetting = <K extends keyof ReminderSettings>(key: K, value: ReminderSettings[K]) => {
    const next = saveReminderSettings({ [key]: value } as Partial<ReminderSettings>, auth.currentUser?.uid ?? 'local');
    setReminderSettings(next);
    toast.success('Ustawienia przypomnień zapisane');
  };

  const askForBrowserNotifications = async () => {
    const permission = await requestBrowserNotificationPermission();
    setBrowserPermission(permission);
    if (permission === 'granted') {
      updateReminderSetting('browserNotificationsEnabled', true);
      toast.success('Powiadomienia przeglądarki włączone');
    } else if (permission === 'denied') {
      updateReminderSetting('browserNotificationsEnabled', false);
      toast.error('Przeglądarka zablokowała powiadomienia. Zmień zgodę w ustawieniach strony.');
    } else {
      toast.error('Ta przeglądarka nie obsługuje powiadomień systemowych. Zostają alerty w aplikacji.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-slate-500">Ładowanie ustawień...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Ustawienia</h1>
          <p className="text-slate-500">Zarządzaj kontem, przypomnieniami i konfiguracją systemu.</p>
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
                  <Input
                    value={profile?.fullName || ''}
                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nazwa firmy</Label>
                  <Input
                    value={profile?.companyName || ''}
                    onChange={e => setProfile({...profile, companyName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email (nieedytowalny)</Label>
                <Input value={profile?.email || ''} disabled />
              </div>
              <Button onClick={handleUpdateProfile}>Zapisz zmiany</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-400" />
                Przypomnienia i alerty
              </CardTitle>
              <CardDescription>Ustaw, jak aplikacja ma pilnować terminów, zaległości i leadów bez akcji.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Checkbox
                    checked={reminderSettings.liveNotificationsEnabled}
                    onCheckedChange={(value) => updateReminderSetting('liveNotificationsEnabled', Boolean(value))}
                  />
                  <span>
                    <span className="block text-sm font-bold text-slate-900">Alerty w aplikacji</span>
                    <span className="block text-xs text-slate-500">Toasty i centrum powiadomień dla terminów i leadów.</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Checkbox
                    checked={reminderSettings.leadWithoutActionAlertsEnabled}
                    onCheckedChange={(value) => updateReminderSetting('leadWithoutActionAlertsEnabled', Boolean(value))}
                  />
                  <span>
                    <span className="block text-sm font-bold text-slate-900">Leady bez akcji</span>
                    <span className="block text-xs text-slate-500">Pokazuj alert, gdy lead nie ma zadania ani wydarzenia.</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Checkbox
                    checked={reminderSettings.dailyDigestEmailEnabled}
                    onCheckedChange={(value) => updateReminderSetting('dailyDigestEmailEnabled', Boolean(value))}
                  />
                  <span>
                    <span className="block text-sm font-bold text-slate-900">Poranny digest e-mail</span>
                    <span className="block text-xs text-slate-500">Flaga gotowa pod następny etap wysyłki mailowej.</span>
                  </span>
                </label>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-bold text-slate-900">Powiadomienia przeglądarki</p>
                  </div>
                  <p className="mb-3 text-xs text-slate-500">Status: {browserPermission === 'unsupported' ? 'brak wsparcia' : browserPermission}</p>
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={askForBrowserNotifications}>
                    Włącz / sprawdź zgodę
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Ile minut przed terminem</Label>
                  <Input
                    type="number"
                    min={5}
                    max={1440}
                    value={reminderSettings.defaultReminderLeadMinutes}
                    onChange={(e) => updateReminderSetting('defaultReminderLeadMinutes', Math.max(5, Number(e.target.value) || 30))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Domyślny snooze (min)</Label>
                  <Input
                    type="number"
                    min={5}
                    max={1440}
                    value={reminderSettings.defaultSnoozeMinutes}
                    onChange={(e) => updateReminderSetting('defaultSnoozeMinutes', Math.max(5, Number(e.target.value) || 60))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Godzina digestu</Label>
                  <Input
                    type="time"
                    value={reminderSettings.dailyDigestHour}
                    onChange={(e) => updateReminderSetting('dailyDigestHour', e.target.value || '08:00')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-slate-400" />
                Branding portalu klienta
              </CardTitle>
              <CardDescription>Dostosuj wygląd panelu, który widzi Twój klient.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-sm text-slate-500">Funkcja personalizacji brandingu dostępna w planie PRO.</p>
                <Button variant="outline" size="sm" className="mt-2">Sprawdź plany</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-400" />
                Bezpieczeństwo
              </CardTitle>
              <CardDescription>Zarządzaj dostępem do swojego konta.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                Wyloguj ze wszystkich urządzeń
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
