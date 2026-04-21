import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { AlertTriangle, Palette, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { useAppearance } from '../components/appearance-provider';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth, db } from '../firebase';
import { getConflictWarningsEnabled, setConflictWarningsEnabled as storeConflictWarningsEnabled } from '../lib/app-preferences';

export default function Settings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingOutEverywhere, setSigningOutEverywhere] = useState(false);
  const [conflictWarningsEnabled, setConflictWarningsEnabledState] = useState(true);
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
      setConflictWarningsEnabledState(getConflictWarningsEnabled());
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
                <Label>Email (nieedytowalny)</Label>
                <Input value={profile?.email || ''} disabled />
              </div>
              <Button onClick={handleUpdateProfile} className="w-full md:w-auto">Zapisz zmiany</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-slate-400" />
                Motyw aplikacji
              </CardTitle>
              <CardDescription>Wybrany motyw zapisuje się lokalnie i w profilu, więc wraca po odświeżeniu.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-slate-400" />
                Ustawienia aplikacji
              </CardTitle>
              <CardDescription>Domyślnie ostrzeżenia o konfliktach terminów są włączone.</CardDescription>
            </CardHeader>
            <CardContent>
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
              <Button
                variant="outline"
                className="w-full md:w-auto text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                onClick={() => void handleSignOutEverywhere()}
                disabled={signingOutEverywhere}
              >
                {signingOutEverywhere ? 'Wylogowywanie...' : 'Wyloguj ze wszystkich urządzeń'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
