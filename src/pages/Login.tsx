import { useState, FormEvent } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CheckCircle2, LogIn, Mail, Lock, User, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { addDays } from 'date-fns';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const initializeUser = async (user: any, name?: string) => {
    const profileRef = doc(db, 'profiles', user.uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      const workspaceRef = await addDoc(collection(db, 'workspaces'), {
        ownerId: user.uid,
        name: `${name || user.displayName || 'Mój'} Workspace`,
        plan: 'free',
        subscriptionStatus: 'trial_active',
        trialEndsAt: addDays(new Date(), 7).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(profileRef, {
        email: user.email,
        fullName: name || user.displayName,
        workspaceId: workspaceRef.id,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await initializeUser(result.user);
      toast.success('Zalogowano pomyślnie');
    } catch (error: any) {
      toast.error('Błąd logowania: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await initializeUser(result.user);
      toast.success('Zalogowano pomyślnie');
    } catch (error: any) {
      toast.error('Błąd logowania: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: fullName });
      await sendEmailVerification(result.user);
      await initializeUser(result.user, fullName);
      toast.success('Konto utworzone. Sprawdź e-mail, żeby je potwierdzić.');
    } catch (error: any) {
      toast.error('Błąd rejestracji: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Link do resetu hasła został wysłany.');
      setIsResetting(false);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isResetting) {
    return (
      <div className="min-h-screen px-4 py-8 app-shell-bg">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center">
          <div className="w-full rounded-[28px] p-6 app-surface app-shadow md:p-8">
            <button
              type="button"
              onClick={() => setIsResetting(false)}
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium app-muted transition-colors hover:app-text"
            >
              <ArrowLeft className="h-4 w-4" /> Wróć do logowania
            </button>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold app-text">Reset hasła</h2>
              <p className="text-sm app-muted">Wpisz e-mail i wyślij link do ustawienia nowego hasła.</p>
            </div>
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">E-mail</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="h-11 w-full rounded-2xl font-semibold" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Wyślij link resetujący'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 app-shell-bg">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[32px] p-8 app-surface app-shadow lg:block xl:p-10">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
            <Sparkles className="h-3.5 w-3.5" /> System uruchamiania klienta
          </div>
          <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-[24px] app-primary-chip">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight app-text">Forteca porządkuje sprzedaż i start realizacji w jednym miejscu.</h1>
          <p className="mt-4 max-w-xl text-base app-muted">
            Jeden ekran na dziś, jedna baza leadów, zadania, kalendarz, sprawy i portal klienta. Bez latania między notatkami i chaosem.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Dziś', 'Od razu widzisz, co trzeba ruszyć teraz.'],
              ['Leady', 'Każdy rekord ma następny krok i termin.'],
              ['Sprawy', 'Po wygraniu leada przechodzisz płynnie do realizacji.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl p-4 app-surface-strong">
                <p className="text-sm font-bold app-text">{title}</p>
                <p className="mt-2 text-sm app-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] p-6 app-surface app-shadow md:p-8">
          <div className="mb-6 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] app-primary-chip">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="text-3xl font-bold app-text">Forteca</h1>
            <p className="mt-2 text-sm app-muted">Zaloguj się i wróć do pracy z leadami oraz sprawami.</p>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl p-1.5">
              <TabsTrigger value="login" className="min-h-11 rounded-xl">Logowanie</TabsTrigger>
              <TabsTrigger value="register" className="min-h-11 rounded-xl">Rejestracja</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 app-muted" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      className="h-11 pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="password">Hasło</Label>
                    <button
                      type="button"
                      onClick={() => setIsResetting(true)}
                      className="text-xs font-semibold"
                      style={{ color: 'var(--app-primary)' }}
                    >
                      Zapomniałeś hasła?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 app-muted" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="h-11 w-full rounded-2xl font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Zaloguj się'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full app-border border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.16em]">
                  <span className="px-3 app-surface app-muted">albo</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="h-11 w-full rounded-2xl text-base font-semibold"
                disabled={loading}
              >
                <LogIn className="h-5 w-5" /> Google
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Imię i nazwisko</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 app-muted" />
                    <Input
                      id="reg-name"
                      placeholder="Jan Kowalski"
                      className="h-11 pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 app-muted" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="twoj@email.pl"
                      className="h-11 pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 app-muted" />
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Minimum 8 znaków"
                      className="h-11 pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="h-11 w-full rounded-2xl font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Utwórz konto'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
