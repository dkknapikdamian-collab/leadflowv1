import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { User, Shield, Palette, CheckCircle2 } from 'lucide-react';
import { useAppearance } from '../components/appearance-provider';
import { cn } from '../lib/utils';

export default function Settings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSkin, setSavingSkin] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { skin, setSkin, skinOptions } = useAppearance();

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser!.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data());
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !profile) return;

    setSavingProfile(true);
    try {
      await updateDoc(doc(db, 'profiles', auth.currentUser.uid), {
        fullName: profile.fullName ?? '',
        companyName: profile.companyName ?? '',
      });
      toast.success('Profil zaktualizowany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSkinChange = async (nextSkin: typeof skin) => {
    setSavingSkin(true);
    try {
      await setSkin(nextSkin);
      toast.success('Skórka została zapisana');
    } catch (error: any) {
      toast.error('Nie udało się zapisać skórki: ' + error.message);
    } finally {
      setSavingSkin(false);
    }
  };


  const handleSignOutCurrentDevice = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      toast.success('Wylogowano z tego urządzenia');
    } catch (error: any) {
      toast.error('Nie udało się wylogować: ' + error.message);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold app-text">Ustawienia</h1>
          <p className="app-muted">Profil, wygląd i podstawowe preferencje operatora.</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="border-none shadow-sm app-surface-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg app-text">
                  <User className="h-5 w-5 app-muted" />
                  Profil operatora
                </CardTitle>
                <CardDescription className="app-muted">
                  Dane wyświetlane w aplikacji i przy przekazywaniu klienta do dalszej obsługi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Imię i nazwisko</Label>
                    <Input
                      value={profile?.fullName || ''}
                      onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nazwa firmy</Label>
                    <Input
                      value={profile?.companyName || ''}
                      onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile?.email || ''} disabled />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm app-muted">Zmiany zapisują się do profilu i będą widoczne na innych urządzeniach.</p>
                  <Button onClick={handleUpdateProfile} disabled={loading || savingProfile} className="rounded-xl">
                    {savingProfile ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm app-surface-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg app-text">
                  <Palette className="h-5 w-5 app-muted" />
                  Skórki aplikacji
                </CardTitle>
                <CardDescription className="app-muted">
                  Ten wybór zapisuje się w profilu, więc ten sam wygląd zobaczysz na komputerze i telefonie.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {skinOptions.map((option) => {
                    const isActive = skin === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSkinChange(option.id)}
                        disabled={savingSkin}
                        className={cn(
                          'rounded-2xl border p-4 text-left transition-all',
                          isActive
                            ? 'app-surface app-shadow ring-2 ring-offset-0'
                            : 'app-surface hover:-translate-y-0.5 hover:shadow-sm'
                        )}
                        style={isActive ? { borderColor: 'var(--app-primary)', boxShadow: '0 0 0 1px var(--app-primary)' } : undefined}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold app-text">{option.label}</p>
                            <p className="mt-1 text-sm app-muted">{option.description}</p>
                          </div>
                          {isActive && (
                            <span className="rounded-full px-2 py-1 text-[10px] font-bold app-primary-chip">
                              Aktywna
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="h-8 rounded-xl border app-border" style={{ background: option.id === 'forteca-dark' ? '#0f172a' : option.id === 'midnight' ? '#111827' : option.id === 'sandstone' ? '#fffaf2' : '#ffffff' }} />
                          <div className="h-8 rounded-xl border app-border" style={{ background: option.id === 'forteca-dark' ? '#1e293b' : option.id === 'midnight' ? '#1f2937' : option.id === 'sandstone' ? '#f5efe5' : '#eff6ff' }} />
                          <div className="h-8 rounded-xl border app-border" style={{ background: option.id === 'forteca-dark' ? '#60a5fa' : option.id === 'midnight' ? '#22c55e' : option.id === 'sandstone' ? '#a16207' : '#2563eb' }} />
                          <div className="h-8 rounded-xl border app-border" style={{ background: option.id === 'forteca-dark' ? '#334155' : option.id === 'midnight' ? '#374151' : option.id === 'sandstone' ? '#d6c4af' : '#e2e8f0' }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm app-surface-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg app-text">
                  <CheckCircle2 className="h-5 w-5 app-muted" />
                  Podgląd bieżących ustawień
                </CardTitle>
                <CardDescription className="app-muted">
                  Szybki skrót tego, co jest teraz aktywne.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border app-border p-4 app-surface">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] app-muted">Skórka</p>
                  <p className="mt-2 text-base font-semibold app-text">
                    {skinOptions.find((option) => option.id === skin)?.label}
                  </p>
                </div>
                <div className="rounded-2xl border app-border p-4 app-surface">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] app-muted">Synchronizacja</p>
                  <p className="mt-2 text-sm app-text">
                    Wygląd i profil zapisują się do chmury, więc po zalogowaniu na innym urządzeniu dostajesz ten sam stan ustawień.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm app-surface-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg app-text">
                  <Shield className="h-5 w-5 app-muted" />
                  Bezpieczeństwo
                </CardTitle>
                <CardDescription className="app-muted">
                  Sesja bieżącego urządzenia i stan dostępu do konta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border app-border p-4 app-surface">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] app-muted">Bieżąca sesja</p>
                  <p className="mt-2 text-sm app-text">
                    Jesteś zalogowany jako <span className="font-semibold">{profile?.email || auth.currentUser?.email || 'użytkownik'}</span>.
                  </p>
                </div>
                <div className="rounded-2xl border app-border p-4 app-surface">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] app-muted">Uwaga</p>
                  <p className="mt-2 text-sm app-text">
                    Globalne wylogowanie wszystkich urządzeń nie jest jeszcze wdrożone w tej wersji, więc nie pokazuję tu fałszywego przycisku.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-rose-200 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                  onClick={handleSignOutCurrentDevice}
                  disabled={signingOut}
                >
                  {signingOut ? 'Wylogowywanie...' : 'Wyloguj to urządzenie'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
