import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  RotateCcw,
  Shield,
  Sparkles,
  WalletCards,
  XCircle,
  Zap,
} from 'lucide-react';
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

const ACCESS_RULES = [
  'Podgląd danych działa także po wygaśnięciu trialu lub wyłączeniu planu.',
  'Tworzenie leadów, spraw, tasków i wydarzeń blokuje się, gdy dostęp nie jest aktywny.',
  'Ta wersja nadal używa bezpiecznej symulacji płatności, ale stany dostępu są już gotowe pod prawdziwy billing.',
];

export default function Billing() {
  const { workspace, loading, access } = useWorkspace();

  const handleWorkspaceStatus = async (updates: Record<string, unknown>, successMessage: string) => {
    if (!workspace) return;

    try {
      await updateDoc(doc(db, 'workspaces', workspace.id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      toast.success(successMessage);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleUpgrade = async (planId: string) => {
    await handleWorkspaceStatus(
      {
        subscriptionStatus: 'paid_active',
        planId,
      },
      'Plan został aktywowany. To nadal bezpieczna symulacja płatności.'
    );
  };

  const activePlan = PLANS.find((plan) => plan.id === workspace?.planId) ?? PLANS[0];

  const statusActions = {
    paid_active: [
      {
        label: 'Oznacz jako payment failed',
        variant: 'outline' as const,
        onClick: () => handleWorkspaceStatus({ subscriptionStatus: 'payment_failed' }, 'Stan płatności został ustawiony na nieudaną.'),
      },
      {
        label: 'Wyłącz plan',
        variant: 'outline' as const,
        onClick: () => handleWorkspaceStatus({ subscriptionStatus: 'canceled' }, 'Plan został wyłączony.'),
      },
    ],
    payment_failed: [
      {
        label: 'Wznów plan',
        variant: 'default' as const,
        onClick: () => handleUpgrade(workspace?.planId || activePlan.id),
      },
      {
        label: 'Przełącz na wyłączony',
        variant: 'outline' as const,
        onClick: () => handleWorkspaceStatus({ subscriptionStatus: 'canceled' }, 'Plan został oznaczony jako wyłączony.'),
      },
    ],
    canceled: [
      {
        label: 'Aktywuj ponownie',
        variant: 'default' as const,
        onClick: () => handleUpgrade(workspace?.planId || activePlan.id),
      },
    ],
    trial_active: [
      {
        label: 'Włącz plan teraz',
        variant: 'default' as const,
        onClick: () => handleUpgrade(activePlan.id),
      },
      {
        label: 'Symuluj wygaśnięcie trialu',
        variant: 'outline' as const,
        onClick: () => handleWorkspaceStatus({ trialEndsAt: new Date().toISOString() }, 'Trial został ustawiony jako wygasły.'),
      },
    ],
    trial_ending: [
      {
        label: 'Włącz plan teraz',
        variant: 'default' as const,
        onClick: () => handleUpgrade(activePlan.id),
      },
      {
        label: 'Symuluj wygaśnięcie trialu',
        variant: 'outline' as const,
        onClick: () => handleWorkspaceStatus({ trialEndsAt: new Date().toISOString() }, 'Trial został ustawiony jako wygasły.'),
      },
    ],
    trial_expired: [
      {
        label: 'Aktywuj plan',
        variant: 'default' as const,
        onClick: () => handleUpgrade(activePlan.id),
      },
      {
        label: 'Wznów trial na 7 dni',
        variant: 'outline' as const,
        onClick: () => handleWorkspaceStatus({ subscriptionStatus: 'trial_active', trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }, 'Trial został wznowiony na 7 dni.'),
      },
    ],
    inactive: [
      {
        label: 'Aktywuj trial',
        variant: 'default' as const,
        onClick: () => handleWorkspaceStatus({ subscriptionStatus: 'trial_active', trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }, 'Trial został aktywowany.'),
      },
    ],
  } as const;

  const currentActions = statusActions[access.status] ?? statusActions.inactive;

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--app-primary)' }} />
        </div>
      </Layout>
    );
  }

  if (!workspace) {
    return (
      <Layout>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 md:px-8">
          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle>Brak aktywnego workspace</CardTitle>
              <CardDescription>
                Nie udało się wczytać danych workspace, więc ekran rozliczeń jest chwilowo niedostępny.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="rounded-2xl" onClick={() => window.location.reload()}>
                Odśwież stronę
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const statusCards = [
    {
      label: 'Status',
      value: access.badgeLabel,
      tone: access.chipClassName,
      icon: access.status === 'paid_active' ? Shield : access.status === 'payment_failed' || access.status === 'trial_expired' ? AlertTriangle : Clock,
    },
    {
      label: 'Plan',
      value: activePlan.name,
      tone: 'app-primary-chip',
      icon: CreditCard,
    },
    {
      label: 'Tworzenie rekordów',
      value: access.hasAccess ? 'Odblokowane' : 'Zablokowane',
      tone: access.hasAccess ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
      icon: access.hasAccess ? CheckCircle2 : XCircle,
    },
    {
      label: 'Workspace',
      value: workspace.name,
      tone: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
      icon: WalletCards,
    },
  ];

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
              Tu pilnujesz stanu dostępu do aplikacji. Płatność jest jeszcze symulowana, ale sama logika trialu, blokad i wznowień działa już jak normalna warstwa produktu.
            </p>
          </div>
        </header>

        <Card className="border-none">
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl p-3 ${access.toneClassName}`}>
                {access.status === 'paid_active' ? <Shield className="h-7 w-7" /> : access.hasAccess ? <Clock className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold app-text">{access.headline}</h2>
                  <Badge variant={access.hasAccess ? 'secondary' : 'destructive'}>{access.badgeLabel}</Badge>
                </div>
                <p className="max-w-2xl text-sm app-muted">{access.description}</p>
                <div className="mt-3 h-2 w-full max-w-md overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${access.status === 'paid_active' ? 100 : access.trialProgressPercent}%`,
                      backgroundColor: access.status === 'paid_active' ? 'rgb(16 185 129)' : 'var(--app-primary)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:max-w-sm lg:justify-end">
              {currentActions.map((action) => (
                <Button key={action.label} variant={action.variant} className="rounded-2xl" onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
              <Button variant="ghost" className="rounded-2xl" onClick={() => auth.signOut()}>
                Wyloguj się
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((item) => (
            <Card key={item.label} className="border-none app-surface-strong">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] app-muted">{item.label}</p>
                  <p className="mt-2 text-base font-bold app-text">{item.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {PLANS.map((plan) => {
              const isCurrent = workspace.planId === plan.id && access.status === 'paid_active';

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

          <div className="space-y-6">
            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Co dokładnie blokujemy po utracie dostępu</CardTitle>
                <CardDescription>To jest już logika produktu, nie tylko tekst marketingowy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ACCESS_RULES.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border app-border p-4 app-surface">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl app-primary-chip">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm app-text">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Tryb testowy billingu</CardTitle>
                <CardDescription>Żebyś mógł sprawdzić cały przepływ bez Stripe i bez wrzucania kodu na produkcję.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    icon: Shield,
                    title: 'Paid active',
                    text: 'Pełny dostęp. Tworzenie i edycja rekordów są odblokowane.',
                  },
                  {
                    icon: AlertTriangle,
                    title: 'Payment failed',
                    text: 'Podgląd działa, ale zapis jest wstrzymany do wznowienia planu.',
                  },
                  {
                    icon: RotateCcw,
                    title: 'Canceled / trial expired',
                    text: 'Dane zostają, ale workspace działa już tylko w trybie podglądu.',
                  },
                  {
                    icon: Zap,
                    title: 'Szybki restart',
                    text: 'Z tego ekranu możesz znowu włączyć trial albo aktywować plan.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border app-border p-4 app-surface">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl app-primary-chip">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold app-text">{item.title}</p>
                        <p className="mt-1 text-sm app-muted">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
