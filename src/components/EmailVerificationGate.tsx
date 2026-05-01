import { useState } from 'react';
import { Loader2, LogOut, MailCheck, RefreshCcw, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  reloadSupabaseUser,
  resendEmailConfirmation,
  signOutFromSupabase,
  type SupabaseSessionUser,
} from '../lib/supabase-auth';

type EmailVerificationGateProps = {
  user: SupabaseSessionUser;
};

export default function EmailVerificationGate({ user }: EmailVerificationGateProps) {
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const email = user.email || '';

  const handleResend = async () => {
    if (!email) {
      toast.error('Brakuje adresu e-mail na sesji. Wyloguj siÄ™ i zaloguj ponownie.');
      return;
    }

    setResending(true);
    try {
      await resendEmailConfirmation(email);
      toast.success('WysĹ‚aliĹ›my ponownie link potwierdzajÄ…cy e-mail.');
    } catch (error: any) {
      toast.error('Nie udaĹ‚o siÄ™ wysĹ‚aÄ‡ linku: ' + (error?.message || 'UNKNOWN_ERROR'));
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = async () => {
    setChecking(true);
    try {
      const refreshedUser = await reloadSupabaseUser();
      if (refreshedUser?.emailVerified) {
        toast.success('E-mail jest potwierdzony. OdĹ›wieĹĽam aplikacjÄ™.');
        window.location.reload();
        return;
      }
      toast.error('Ten e-mail nadal nie jest potwierdzony. SprawdĹş skrzynkÄ™ i kliknij link.');
    } catch (error: any) {
      toast.error('Nie udaĹ‚o siÄ™ sprawdziÄ‡ statusu: ' + (error?.message || 'UNKNOWN_ERROR'));
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutFromSupabase();
      window.location.href = '/login';
    } catch (error: any) {
      toast.error('Nie udaĹ‚o siÄ™ wylogowaÄ‡: ' + (error?.message || 'UNKNOWN_ERROR'));
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <MailCheck className="h-9 w-9" />
          </div>

          <div className="mx-auto mt-6 max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">A15 Â· bezpieczeĹ„stwo konta</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">PotwierdĹş e-mail</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Konto jest zalogowane, ale adres e-mail nie zostaĹ‚ jeszcze potwierdzony. Zanim zapiszesz peĹ‚ne dane w aplikacji, kliknij link potwierdzajÄ…cy w wiadomoĹ›ci od Supabase.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Adres do potwierdzenia</p>
            <p className="mt-1 break-all text-base font-semibold text-slate-900">{email || 'Brak e-maila na sesji'}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Google OAuth nie jest blokowany, jeĹ›li Supabase zwrĂłciĹ‚ zweryfikowany e-mail. Ten ekran dotyczy sesji e-mail/hasĹ‚o bez potwierdzenia.
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
            <Button type="button" className="h-12 rounded-xl" onClick={handleResend} disabled={resending || checking || signingOut || !email}>
              {resending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
              WyĹ›lij ponownie
            </Button>
            <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={handleRefresh} disabled={checking || resending || signingOut}>
              {checking ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCcw className="mr-2 h-5 w-5" />}
              SprawdziĹ‚em, odĹ›wieĹĽ
            </Button>
          </div>

          <div className="mx-auto mt-5 max-w-xl text-center">
            <Button type="button" variant="ghost" className="rounded-xl text-slate-500" onClick={handleSignOut} disabled={signingOut || checking || resending}>
              {signingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              Wyloguj i uĹĽyj innego konta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}