import {
  type FormEvent,
  useState
} from 'react';
import {
  Link
} from 'react-router-dom';
import {
  CaseEntityIcon,
  LeadEntityIcon,
  NotificationEntityIcon
} from '../components/ui-system';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  User
} from 'lucide-react';




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
  Tabs,
  LogIn
} from '../components/ui-system';


import {
  TabsContent,
  TabsList,
  TabsTrigger
} from '../components/ui/tabs';

import {
  toast
} from 'sonner';
import {
  getSupabaseAuthConfig,
  sendPasswordReset,
  signInWithGoogle,
  signInWithPassword,
  signUpWithPassword
} from '../lib/supabase-auth';

const HERO_POINTS = [
  'Leady, zadania, wydarzenia i sprawy w jednym miejscu.',
  'Widok „Dziś” pokazuje, co realnie trzeba ruszyć teraz.',
  'Po wygraniu leada płynnie przechodzisz do obsługi sprawy.',
];

const FEATURE_CARDS = [
  { icon: LeadEntityIcon, title: 'Sprzedaż bez chaosu', text: 'Każdy lead ma kolejny krok, termin i historię działań.' },
  { icon: CalendarDays, title: 'Kalendarz operacyjny', text: 'Spotkania, follow-upy i zadania siedzą na jednej osi czasu.' },
  { icon: CaseEntityIcon, title: 'Sprawa po sprzedaży', text: 'Po domknięciu leada wchodzisz od razu w etap realizacji.' },
  { icon: NotificationEntityIcon, title: 'Mniej przeoczeń', text: 'Przypomnienia i konflikty pomagają nie gubić ruchów.' },
];

function getSafeLoginUrl() {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}

function isEmbeddedGoogleAuthBlockedUserAgent() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  const standalone = (window.navigator as any).standalone === true;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  if (!isMobile || standalone) return false;
  const normalizedUa = ua.toLowerCase();
  return ['fban', 'fbav', 'fb_iab', 'fbios', 'fb4a', 'instagram', 'messenger', ' line/', 'whatsapp', 'tiktok', 'twitter', 'snapchat', 'pinterest', 'linkedinapp', 'chatgpt', 'openai', '; wv)', ' wv'].some((marker) => normalizedUa.includes(marker));
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [googleWebViewBlocked, setGoogleWebViewBlocked] = useState(false);
  const authConfig = getSupabaseAuthConfig();

  const handleGoogleLogin = async () => {
    if (!authConfig.configured) {
      toast.error('Supabase Auth nie jest skonfigurowany. Uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.');
      return;
    }
    if (isEmbeddedGoogleAuthBlockedUserAgent()) {
      setGoogleWebViewBlocked(true);
      toast.error('Google blokuje logowanie w tej przeglądarce. Otwórz stronę w Chrome albo Safari.');
      return;
    }
    setGoogleWebViewBlocked(false);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Błąd logowania Google: ' + (error?.message || 'UNKNOWN_ERROR'));
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithPassword(email, password);
      toast.success('Zalogowano pomyślnie');
    } catch (error: any) {
      toast.error('Błąd logowania: ' + (error?.message || 'UNKNOWN_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpWithPassword(email, password, fullName);
      toast.success('Konto utworzone. Jeśli Supabase wymaga potwierdzenia, sprawdź e-mail.');
    } catch (error: any) {
      toast.error('Błąd rejestracji: ' + (error?.message || 'UNKNOWN_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordReset(email);
      toast.success('Link do resetu hasła został wysłany na Twój e-mail.');
      setIsResetting(false);
    } catch (error: any) {
      toast.error('Błąd: ' + (error?.message || 'UNKNOWN_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLoginUrl = async () => {
    const url = getSafeLoginUrl();
    if (!url) return;
    try {
      if (!navigator?.clipboard) throw new Error('NO_CLIPBOARD');
      await navigator.clipboard.writeText(url);
      toast.success('Link skopiowany. Otwórz go w Chrome albo Safari.');
    } catch {
      toast.error('Nie udało się skopiować linku. Skopiuj adres strony ręcznie.');
    }
  };

  const handleOpenExternalBrowserHint = () => {
    setGoogleWebViewBlocked(true);
    const url = getSafeLoginUrl();
    if (!url || typeof window === 'undefined') return;
    try { window.open(url, '_blank', 'noopener,noreferrer'); } catch { /* fallback is copy button */ }
  };

  if (isResetting) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70">
              <h2 className="mb-2 text-2xl font-bold text-slate-900">Resetuj hasło</h2>
              <p className="mb-6 text-slate-500">Wpisz swój e-mail, aby otrzymać link do resetu hasła.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">E-mail</Label>
                  <Input id="reset-email" type="email" placeholder="twoj@email.pl" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="h-12 w-full rounded-xl" disabled={loading || !authConfig.configured}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Wyślij link'}</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setIsResetting(false)} disabled={loading}>Wróć do logowania</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {!authConfig.configured ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Supabase Auth nie jest jeszcze skonfigurowany. Uzupełnij zmienne środowiskowe i redirect URL w panelu Supabase.
        </div>
      ) : null}

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
                <button type="button" onClick={() => setIsResetting(true)} className="text-xs font-medium text-primary hover:underline">Zapomniałeś hasła?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input id="password" type="password" placeholder="••••••••" className="h-11 pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl font-semibold" disabled={loading || !authConfig.configured}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Zaloguj się'}</Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400">Lub kontynuuj przez</span></div>
          </div>

          {googleWebViewBlocked ? (
            <div data-google-webview-guard="true" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Google blokuje logowanie w tej przeglądarce.</p>
              <p className="mt-1 text-amber-800">Otwórz tę stronę w Chrome albo Safari i spróbuj ponownie. Logowanie e-mail i hasłem nadal działa tutaj.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="rounded-xl bg-white" onClick={handleOpenExternalBrowserHint}>Otwórz w Chrome albo Safari</Button>
                <Button type="button" variant="outline" className="rounded-xl bg-white" onClick={() => void handleCopyLoginUrl()}>Kopiuj link</Button>
              </div>
            </div>
          ) : null}

          <Button variant="outline" onClick={handleGoogleLogin} className="flex h-11 w-full items-center justify-center gap-3 rounded-xl text-base font-semibold hover:bg-slate-50" disabled={loading || !authConfig.configured}>
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
            <Button type="submit" className="h-11 w-full rounded-xl font-semibold" disabled={loading || !authConfig.configured}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Utwórz konto'}</Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
        <p className="text-sm font-semibold text-emerald-900">Startujesz od 21 dni testu.</p>
        <p className="mt-1 text-sm text-emerald-700">Możesz od razu wejść, dodać leady i sprawdzić cały przepływ pracy.</p>
      </div>
      <p className="mt-6 text-center text-[10px] text-slate-400">Logując się, akceptujesz regulamin i politykę prywatności.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="grid min-h-[calc(100vh-2rem)] gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)] p-5 text-white shadow-2xl shadow-slate-950/40 sm:p-6 lg:p-7">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.03)_100%)]" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Close Flow dla solo usług i sprzedaży</div>
              <div className="mt-6 max-w-xl">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Domykaj leady i prowadź sprawy bez chaosu.</h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">Jedno miejsce do pilnowania kontaktu z klientem, follow-upów, spotkań, zadań i etapu realizacji po wygranej sprzedaży.</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Cel</p><p className="mt-1 text-sm font-semibold text-white">Mniej przeoczeń, więcej domkniętych klientów</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Model</p><p className="mt-1 text-sm font-semibold text-white">21 dni testu na start</p></div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">{HERO_POINTS.map((point) => (<div key={point} className="rounded-2xl border border-white/10 bg-white/5 p-3"><div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"><CheckCircle2 className="h-5 w-5" /></div><p className="text-sm leading-6 text-slate-200">{point}</p></div>))}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">{FEATURE_CARDS.map((card) => { const Icon = card.icon; return (<div key={card.title} className="rounded-3xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-sm"><div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary-foreground"><Icon className="h-5 w-5" /></div><h2 className="mt-3 text-base font-semibold text-white">{card.title}</h2><p className="mt-1.5 text-sm leading-6 text-slate-300">{card.text}</p></div>);})}</div>
              <div className="mt-6 pt-4"><div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4"><div className="flex items-start gap-3"><div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300"><ArrowRight className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-emerald-200">Dla kogo to jest</p><p className="mt-1 text-sm leading-6 text-slate-200">Dla osób, które same obsługują leady i klientów, a potem ręcznie próbują pamiętać o wszystkim w wiadomościach, notatkach i kalendarzu.</p></div></div></div></div>
            </div>
          </section>
          <div className="flex items-center"><div className="mx-auto w-full max-w-xl">{renderAuthCard()}</div></div>
        </div>
      </div>
    </div>
  );
}
