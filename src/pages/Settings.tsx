import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth, db } from '../firebase';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { User, Shield, Bell, Palette } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto w-full">
        <header className="mb-8">
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
              <div className="grid grid-cols-2 gap-4">
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
