import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  CreditCard,
  Zap,
  Shield,
  Clock,
  Check,
  Loader2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { addDays, differenceInDays, parseISO } from 'date-fns';
import { toast } from 'sonner';

type Plan = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Forteca Solo',
    price: '99',
    description: 'Dla freelancerów i małych firm, które chcą domykać leady i ogarniać start realizacji bez chaosu.',
    features: ['Nielimitowane leady', 'Nielimitowane sprawy', 'Portal klienta', 'Checklisty i etapy startu', 'Wsparcie e-mail'],
  },
  {
    id: 'pro',
    name: 'Forteca Pro',
    price: '249',
    description: 'Dla mocniej działających operatorów i agencji, które chcą spiąć sprzedaż i realizację w jednej warstwie.',
    features: ['Wszystko z Solo', 'Współpraca zespołowa', 'Lepszy widok operacyjny', 'Własna domena portalu', 'Priorytetowe wsparcie'],
    popular: true,
  },
];

export default function Billing() {
  const { workspace, loading, accessMeta } = useWorkspace();

  const handleUpgrade = async (planId: string) => {
    if (!workspace) return;

    try {
      await updateDoc(doc(db, 'workspaces', workspace.id), {
        subscriptionStatus: 'paid_active',
        planId,
        updatedAt: serverTimestamp(),
      });
      toast.success('Subskrypcja aktywowana. To nadal symulacja płatności.');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleSetStatus = async (subscriptionStatus: string) => {
    if (!workspace) return;

    try {
      const payload: Record<string, any> = {
        subscriptionStatus,
        updatedAt: serverTimestamp(),
      };

      if (subscriptionStatus === 'trial_active') {
        payload.trialEndsAt = addDays(new Date(), 7).toISOString();
        payload.planId = workspace.planId || 'solo';
      }

      if (subscriptionStatus === 'paid_active') {
        payload.planId = workspace.planId || 'solo';
      }

      await updateDoc(doc(db, 'workspaces', workspace.id), payload);
      toast.success('Stan dostępu zaktualizowany lokalnie.');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  if (loading || !workspace) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--app-primary)' }} />
        </div>
      </Layout>
    );
  }

  const trialDaysLeft = workspace.trialEndsAt ? Math.max(0, differenceInDays(parseISO(workspace.trialEndsAt), new Date())) : 0;
  const isTrial = workspace.subscriptionStatus === 'trial_active';
  const activePlan = PLANS.find((plan) => plan.id === workspace.planId) ?? PLANS[0];

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
            <Sparkles className="h-3.5 w-3.5" /> Dostęp i plan
          </div>
          <div>
            <h1 className="text-3xl font-bold app-text">Subskrypcja i rozliczenia</h1>
            <p className="max-w-2xl text-sm md:text-base app-muted">
              Tu pilnujesz dostępu do aplikacji. Na razie płatność działa jako bezpieczna symulacja pod późniejsze podpięcie Stripe.
            </p>
          </div>
        </header>

        <Card className="border-none">
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl p-3 ${isTrial ? 'bg-amber-500/12 text-amber-500' : 'app-primary-chip'}`}>
                {isTrial ? <Clock className="h-7 w-7" /> : <Shield className="h-7 w-7" />}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold app-text">
                    {isTrial ? 'Jesteś w okresie próbnym' : 'Dostęp jest aktywny'}
                  </h2>
                  <Badge variant={isTrial ? 'destructive' : 'secondary'}>
                    {accessMeta.badgeLabel}
                  </Badge>
                </div>
                <p className="text-sm app-muted">
                  {accessMeta.summary}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[360px]">
              <div className="rounded-2xl border px-4 py-3 app-surface-strong">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] app-muted">Status</p>
                <p className="mt-2 text-sm font-bold app-text">{workspace.subscriptionStatus}</p>
              </div>
              <div className="rounded-2xl border px-4 py-3 app-surface-strong">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] app-muted">Plan</p>
                <p className="mt-2 text-sm font-bold app-text">{activePlan.name}</p>
              </div>
              <div className="rounded-2xl border px-4 py-3 app-surface-strong col-span-2 sm:col-span-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] app-muted">Workspace</p>
                <p className="mt-2 truncate text-sm font-bold app-text">{workspace.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isTrial ? (
          <Card className="border-amber-500/20 bg-amber-500/6">
            <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-semibold app-text">Trial nie jest jeszcze podpięty pod prawdziwą płatność.</p>
                  <p className="text-sm app-muted">Na tę chwilę wybór planu tylko ustawia status dostępu w bazie.</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => auth.signOut()} className="rounded-2xl">
                Wyloguj się
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-xl">Symulator stanów dostępu</CardTitle>
            <CardDescription>
              Ten panel służy tylko do lokalnego testu przepływu. Możesz sprawdzić, co użytkownik zobaczy po wygaśnięciu trialu, problemie z płatnością albo wznowieniu.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { id: 'trial_active', label: 'Uruchom trial' },
              { id: 'paid_active', label: 'Aktywuj plan' },
              { id: 'payment_failed', label: 'Błąd płatności' },
              { id: 'canceled', label: 'Anulowany plan' },
            ].map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={workspace.subscriptionStatus === item.id ? 'default' : 'outline'}
                className="h-auto min-h-11 justify-start rounded-2xl px-4 py-3 text-left"
                onClick={() => handleSetStatus(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {PLANS.map((plan) => {
            const isCurrent = workspace.planId === plan.id && workspace.subscriptionStatus === 'paid_active';

            return (
              <Card key={plan.id} className={`relative overflow-hidden border-none ${plan.popular ? 'ring-2 ring-[color:var(--app-primary)]/30' : ''}`}>
                {plan.popular ? (
                  <div className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] app-primary-chip">
                    Najmocniejszy kierunek
                  </div>
                ) : null}
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="mt-2 max-w-md">{plan.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold app-text">{plan.price} zł</p>
                      <p className="text-sm app-muted">miesięcznie</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 rounded-full p-1 app-primary-chip">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="app-text">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className="h-11 w-full rounded-2xl font-semibold"
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={isCurrent}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isCurrent ? 'To jest Twój aktywny plan' : 'Wybierz ten plan'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Bezpieczny kierunek',
              text: 'Architektura jest gotowa pod późniejsze podpięcie prawdziwej bramki płatniczej bez zmiany całej aplikacji.',
            },
            {
              icon: Zap,
              title: 'Szybka aktywacja',
              text: 'Po wejściu realnych płatności dostęp do planu ma włączać się od razu po poprawnym webhooku.',
            },
            {
              icon: CreditCard,
              title: 'Czytelny model',
              text: 'Na start jeden prosty plan wystarczy. Mniej chaosu, szybszy test rynku i prostsza sprzedaż.',
            },
          ].map((item) => (
            <Card key={item.title} className="border-none">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl app-primary-chip">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold app-text">{item.title}</h3>
                  <p className="mt-2 text-sm app-muted">{item.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
