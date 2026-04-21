import { useEffect, useState, FormEvent } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CheckCircle2, LogIn, Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addDays } from 'date-fns';

const GOOGLE_REDIRECT_SESSION_KEY = 'closeflow:google-redirect-pending';

function shouldUseRedirectForGoogleAuth() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  const coarsePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || coarsePointer;
}

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

  useEffect(() => {
    let active = true;
    const redirectPending = typeof window !== 'undefined' && window.sessionStorage.getItem(GOOGLE_REDIRECT_SESSION_KEY) === '1';

    if (!redirectPending) return;

    const finalizeGoogleRedirect = async () => {
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await initializeUser(result.user);
          toast.success('Zalogowano pomyślnie');
        }
      } catch (error: any) {
        console.error(error);
        toast.error('Błąd logowania Google: ' + (error?.message || 'UNKNOWN_ERROR'));
      } finally {
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(GOOGLE_REDIRECT_SESSION_KEY);
        }
        if (active) {
          setLoading(false);
        }
      }
    };

    void finalizeGoogleRedirect();

    return () => {
      active = false;
    };
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    const startRedirectFlow = async () => {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(GOOGLE_REDIRECT_SESSION_KEY, '1');
      }
      await signInWithRedirect(auth, googleProvider);
    };

    try {
      if (shouldUseRedirectForGoogleAuth()) {
        await startRedirectFlow();
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      await initializeUser(result.user);
      toast.success('Zalogowano pomyślnie');
    } catch (error: any) {
      const code = String(error?.code || '');
      console.error(error);

      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await startRedirectFlow();
          return;
        } catch (redirectError: any) {
          console.error(redirectError);
          toast.error('Błąd logowania Google: ' + (redirectError?.message || 'UNKNOWN_ERROR'));
        }
      } else {
        toast.error('Błąd logowania Google: ' + (error?.message || 'UNKNOWN_ERROR'));
      }
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
      toast.success('Konto utworzone! Sprawdź e-mail, aby potwierdzić konto.');
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
      toast.success('Link do resetu hasła został wysłany na Twój e-mail.');
      setIsResetting(false);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isResetting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Resetuj hasło</h2>
          <p className="text-slate-500 mb-6">Wpisz swój e-mail, aby otrzymać link do resetu hasła.</p>
          <form onSubmit={handleResetPassword} className="space-y-4">
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
            <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Wyślij link'}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsResetting(false)}
              disabled={loading}
            >
              Wróć do logowania
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Close Flow</h1>
          <p className="text-slate-500">Zintegrowany system domykania i uruchamiania klienta.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg">Logowanie</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg">Rejestracja</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      className="pl-10 h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Hasło</Label>
                    <button
                      type="button"
                      onClick={() => setIsResetting(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      Zapomniałeś hasła?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Zaloguj się'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">Lub kontynuuj przez</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-11 rounded-xl flex items-center justify-center gap-3 text-base font-semibold transition-all hover:bg-slate-50"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                Google
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Imię i nazwisko</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      id="reg-name"
                      placeholder="Jan Kowalski"
                      className="pl-10 h-11"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="twoj@email.pl"
                      className="pl-10 h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Min. 8 znaków"
                      className="pl-10 h-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Utwórz konto'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-[10px] text-slate-400 mt-6">
            Logując się, akceptujesz regulamin i politykę prywatności.
          </p>
        </div>
      </div>
    </div>
  );
}
