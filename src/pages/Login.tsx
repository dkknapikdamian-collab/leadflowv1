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
import {
  CheckCircle2,
  LogIn,
  Mail,
  Lock,
  User,
  Loader2,
  Target,
  CalendarDays,
  BellRing,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { addDays } from 'date-fns';
import { fetchMeFromSupabase, isSupabaseConfigured } from '../lib/supabase-fallback';

const GOOGLE_REDIRECT_SESSION_KEY = 'closeflow:google-redirect-pending';

const HERO_POINTS = [
  'Leady, zadania, wydarzenia i sprawy w jednym miejscu.',
  'Widok „Dziś” pokazuje, co realnie trzeba ruszyć teraz.',
  'Po wygraniu leada płynnie przechodzisz do obsługi sprawy.',
];

const FEATURE_CARDS = [
  {
    icon: Target,
    title: 'Sprzedaż bez chaosu',
    text: 'Każdy lead ma kolejny krok, termin i historię działań.',
  },
  {
    icon: CalendarDays,
    title: 'Kalendarz operacyjny',
    text: 'Spotkania, follow-upy i zadania siedzą na jednej osi czasu.',
  },
  {
    icon: Briefcase,
    title: 'Sprawa po sprzedaży',
    text: 'Po domknięciu leada wchodzisz od razu w etap realizacji.',
  },
  {
    icon: BellRing,
    title: 'Mniej przeoczeń',
    text: 'Przypomnienia i konflikty pomagają nie gubić ruchów.',
  },
];

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
    if (isSupabaseConfigured()) {
      await fetchMeFromSupabase({
        uid: user.uid,
        email: user.email || undefined,
        fullName: name || user.displayName || undefined,
      });
      return;
    }

    const profileRef = doc(db, 'profiles', user.uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      const workspaceRef = await addDoc(collection(db, 'workspaces'), {
        ownerId: user.uid,
        name: `${name || user.displayName || 'Mój'} Workspace`,
        plan: 'trial_14d',
        planId: 'trial_14d',
        subscriptionStatus: 'trial_active',
        trialEndsAt: addDays(new Date(), 14).toISOString(),
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

  const renderAuthCard = () => (
    <div className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
          <CheckCircle2 className="h-7 w-7 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Close Flow</p>
          <h1 className="text-2xl font-bold text-slate-900">Wejdź do aplikacji</h1>
        </div>
      </div>

      <Tabs defaultValue="login" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1">
          <TabsTrigger value="login" className="rounded-xl">Logowanie</TabsTrigger>
          <TabsTrigger value="register" className="rounded-xl">Rejestracja</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input id="email" type="email" placeholder="twoj@email.pl" className="h-11 pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Hasło</Label>
                <button type="button" onClick={() => setIsResetting(true)} className="text-xs font-medium text-primary hover:underline">
                  Zapomniałeś hasła?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input id="password" type="password" placeholder="••••••••" className="h-11 pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl font-semibold" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Zaloguj się'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400">Lub kontynuuj przez</span></div>
          </div>

          <Button variant="outline" onClick={handleGoogleLogin} className="flex h-11 w-full items-center justify-center gap-3 rounded-xl text-base font-semibold hover:bg-slate-50" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            Google
          </Button>
        </TabsContent>

        <TabsContent value="register" className="space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Imię i nazwisko</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input id="reg-name" placeholder="Jan Kowalski" className="h-11 pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input id="reg-email" type="email" placeholder="twoj@email.pl" className="h-11 pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Hasło</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input id="reg-password" type="password" placeholder="Min. 8 znaków" className="h-11 pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl font-semibold" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Utwórz konto'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
        <p className="text-sm font-semibold text-emerald-900">Startujesz od 14 dni testu.</p>
        <p className="mt-1 text-sm text-emerald-700">Możesz od razu wejść, dodać leady i sprawdzić cały przepływ pracy.</p>
      </div>

      <p className="mt-6 text-center text-[10px] text-slate-400">Logując się, akceptujesz regulamin i politykę prywatności.</p>
    </div>
  );

  if (isResetting) {
    return <div className="min-h-screen bg-slate-950"><div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8"><div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr]"><section className="hidden rounded-[32px] border border-slate-800 bg-slate-900/80 p-10 text-white shadow-2xl shadow-slate-950/40 lg:block"><div className="max-w-xl"><div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Lead → follow-up → sprawa</div><h2 className="mt-6 text-4xl font-bold leading-tight">System do domykania klientów i pilnowania kolejnych ruchów.</h2><p className="mt-4 text-lg text-slate-300">Close Flow porządkuje sprzedaż i obsługę po sprzedaży, żeby nic nie ginęło między wiadomością, zadaniem, spotkaniem i sprawą.</p><div className="mt-8 space-y-4">{HERO_POINTS.map((point) => (<div key={point} className="flex items-start gap-3"><div className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"><CheckCircle2 className="h-4 w-4" /></div><p className="text-sm text-slate-200">{point}</p></div>))}</div></div></section><div className="mx-auto w-full max-w-md lg:max-w-none"><div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70"><h2 className="text-2xl font-bold text-slate-900 mb-2">Resetuj hasło</h2><p className="text-slate-500 mb-6">Wpisz swój e-mail, aby otrzymać link do resetu hasła.</p><form onSubmit={handleResetPassword} className="space-y-4"><div className="space-y-2"><Label htmlFor="reset-email">E-mail</Label><Input id="reset-email" type="email" placeholder="twoj@email.pl" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Wyślij link'}</Button><Button variant="ghost" className="w-full" onClick={() => setIsResetting(false)} disabled={loading}>Wróć do logowania</Button></form></div></div></div></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="grid min-h-[calc(100vh-2rem)] gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)] p-5 text-white shadow-2xl shadow-slate-950/40 sm:p-6 lg:p-7"><div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.03)_100%)]" /><div className="relative z-10 flex h-full flex-col"><div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Close Flow dla solo usług i sprzedaży</div><div className="mt-6 max-w-xl"><h1 className="text-3xl font-bold leading-tight sm:text-4xl">Domykaj leady i prowadź sprawy bez chaosu.</h1><p className="mt-4 max-w-lg text-base leading-7 text-slate-300">Jedno miejsce do pilnowania kontaktu z klientem, follow-upów, spotkań, zadań i etapu realizacji po wygranej sprzedaży.</p></div><div className="mt-5 flex flex-wrap gap-3"><div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Cel</p><p className="mt-1 text-sm font-semibold text-white">Mniej przeoczeń, więcej domkniętych klientów</p></div><div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Model</p><p className="mt-1 text-sm font-semibold text-white">14 dni testu na start</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{HERO_POINTS.map((point) => (<div key={point} className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"><CheckCircle2 className="h-5 w-5" /></div><p className="text-sm leading-6 text-slate-200">{point}</p></div>))}</div><div className="mt-5 grid gap-3 sm:grid-cols-2">{FEATURE_CARDS.map((card) => { const Icon = card.icon; return (<div key={card.title} className="rounded-3xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-sm"><div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary-foreground"><Icon className="h-5 w-5" /></div><h2 className="mt-3 text-base font-semibold text-white">{card.title}</h2><p className="mt-1.5 text-sm leading-6 text-slate-300">{card.text}</p></div>);})}</div><div className="mt-6 pt-4"><div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4"><div className="flex items-start gap-3"><div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300"><ArrowRight className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-emerald-200">Dla kogo to jest</p><p className="mt-1 text-sm leading-6 text-slate-200">Dla osób, które same obsługują leady i klientów, a potem ręcznie próbują pamiętać o wszystkim w wiadomościach, notatkach i kalendarzu.</p></div></div></div></div></div></section>
          <div className="flex items-center"><div className="mx-auto w-full max-w-xl">{renderAuthCard()}</div></div>
        </div>
      </div>
    </div>
  );
}
