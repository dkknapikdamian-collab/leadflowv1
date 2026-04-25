import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Check, Loader2, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAppearance } from '../components/appearance-provider';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  createBillingCheckoutSessionInSupabase,
} from '../lib/supabase-fallback';

type BillingPeriod = 'monthly' | 'yearly';

type PlanCard = {
  id: string;
  key: 'basic' | 'pro' | 'business';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  badge?: string;
  features: string[];
};

const BILLING_PLANS: PlanCard[] = [
  {
    id: 'closeflow_basic',
    key: 'basic',
    name: 'Basic',
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: 'Najprostszy start dla jednej osoby i malego procesu sprzedazy.',
    features: [
      'Leady, klienci, zadania i Today',
      'Podstawowy pipeline lead -> case',
      'Platnosc karta lub BLIK za 30 dni albo rok',
    ],
  },
  {
    id: 'closeflow_pro',
    key: 'pro',
    name: 'Pro',
    monthlyPrice: 39,
    yearlyPrice: 390,
    badge: 'Najlepszy wybor',
    description: 'Pelny workflow CloseFlow dla solo uslug i sprzedazy.',
    features: [
      'Pelny workflow lead -> case -> rozliczenie',
      'Klienci, sprawy, taski i Today w jednym miejscu',
      'Portal klienta i modul rozliczen V1',
      'Platnosc karta lub BLIK za 30 dni albo rok',
    ],
  },
  {
    id: 'closeflow_business',
    key: 'business',
    name: 'Business',
    monthlyPrice: 69,
    yearlyPrice: 690,
    description: 'Dla osob, ktore chca wiecej miejsca na rozwoj i przyszle funkcje premium.',
    features: [
      'Wszystko z Pro',
      'Priorytet pod przyszle funkcje premium',
      'Gotowe pod wieksza liczbe spraw i klientow',
      'Platnosc karta lub BLIK za 30 dni albo rok',
    ],
  },
];

function getPlanPrice(plan: PlanCard, period: BillingPeriod) {
  return period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

function getPlanPeriodLabel(period: BillingPeriod) {
  return period === 'yearly' ? '/rok' : '/30 dni';
}

function getDisplayPlanId(planId?: string | null, subscriptionStatus?: string | null) {
  if (['closeflow_basic', 'closeflow_basic_yearly', 'closeflow_pro', 'closeflow_pro_yearly', 'closeflow_business', 'closeflow_business_yearly'].includes(String(planId || ''))) {
    return String(planId);
  }
  if (['trial_14d', 'solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(String(planId || ''))) {
    return 'closeflow_pro';
  }
  if (subscriptionStatus === 'paid_active') return 'closeflow_pro';
  return 'trial_14d';
}

function isPlanActive(displayPlanId: string, plan: PlanCard, isPaidActive: boolean) {
  if (!isPaidActive) return false;
  return displayPlanId === plan.id || displayPlanId === `${plan.id}_yearly`;
}

export default function Billing() {
  const { workspace, loading, refresh, access } = useWorkspace();
  const { skin } = useAppearance();
  const [tab, setTab] = useState<'plan' | 'settlements'>('plan');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [upgradingPlanKey, setUpgradingPlanKey] = useState<string | null>(null);
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [payments, setPayments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  const clientById = useMemo(() => new Map(clients.map((entry) => [String(entry.id), String(entry.name || entry.company || 'Klient')])), [clients]);
  const leadById = useMemo(() => new Map(leads.map((entry) => [String(entry.id), String(entry.name || 'Lead')])), [leads]);
  const caseById = useMemo(() => new Map(cases.map((entry) => [String(entry.id), String(entry.title || 'Sprawa')])), [cases]);

  useEffect(() => {
    if (tab !== 'settlements') return;
    if (!workspace?.id) return;
    let cancelled = false;
    setSettlementLoading(true);
    Promise.all([
      fetchPaymentsFromSupabase(),
      fetchClientsFromSupabase().catch(() => []),
      fetchLeadsFromSupabase().catch(() => []),
      fetchCasesFromSupabase().catch(() => []),
    ])
      .then(([paymentRows, clientRows, leadRows, caseRows]) => {
        if (cancelled) return;
        setPayments(paymentRows as any[]);
        setClients(clientRows as any[]);
        setLeads(leadRows as any[]);
        setCases(caseRows as any[]);
      })
      .catch((error: any) => {
        if (cancelled) return;
        toast.error(`Blad odczytu rozliczen: ${error?.message || 'REQUEST_FAILED'}`);
      })
      .finally(() => {
        if (cancelled) return;
        setSettlementLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, workspace?.id]);

  const handleUpgrade = async (plan: PlanCard) => {
    if (!workspace?.id) return;
    setUpgradingPlanKey(plan.key);
    try {
      const result = await createBillingCheckoutSessionInSupabase({
        workspaceId: workspace.id,
        customerEmail: workspace?.dailyDigestRecipientEmail || '',
        planKey: plan.key,
        billingPeriod,
      });

      if (!result?.url) {
        if (result?.error === 'STRIPE_PROVIDER_NOT_CONFIGURED') {
          toast.error('Stripe nie jest jeszcze skonfigurowany w Vercel.');
          return;
        }

        throw new Error(result?.error || 'STRIPE_BLIK_CHECKOUT_URL_MISSING');
      }

      window.location.assign(result.url);
    } catch (error: any) {
      toast.error(`Blad uruchamiania platnosci Stripe/BLIK: ${error.message || 'REQUEST_FAILED'}`);
    } finally {
      setUpgradingPlanKey(null);
    }
  };

  if (loading || !workspace) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const trialEndsAtLabel = workspace.trialEndsAt ? format(parseISO(workspace.trialEndsAt), 'd MMMM yyyy', { locale: pl }) : null;
  const isDark = skin === 'forteca-dark' || skin === 'midnight';
  const currentPlanId = getDisplayPlanId(workspace.planId, workspace.subscriptionStatus);

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            <Sparkles className="h-3.5 w-3.5" /> Cennik i rozliczenia
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
        </header>

        <Tabs value={tab} onValueChange={(value) => setTab(value as 'plan' | 'settlements')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="settlements">Rozliczenia</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === 'plan' ? (
          <>
            <Card className={`border-none shadow-sm ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-emerald-50'}`}>
              <CardContent className="flex flex-col gap-2 p-6">
                <h2 className="text-xl font-bold">{access.headline}</h2>
                <p>{access.description}</p>
                {trialEndsAtLabel && (access.isTrialActive || access.status === 'trial_expired') ? (
                  <p className="text-sm opacity-80">Data konca trialu: {trialEndsAtLabel}</p>
                ) : null}
                <Badge variant="outline" className="w-fit">{access.badgeLabel}</Badge>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">Wybierz okres dostepu</p>
                <p className="text-sm text-slate-500">BLIK/karta przez Stripe. Roczny plan daje 365 dni dostepu.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                  onClick={() => setBillingPeriod('monthly')}
                >
                  30 dni
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                  onClick={() => setBillingPeriod('yearly')}
                >
                  Rok
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {BILLING_PLANS.map((plan) => {
                const isCurrentPlan = isPlanActive(currentPlanId, plan, access.isPaidActive);
                const price = getPlanPrice(plan, billingPeriod);
                const isLoadingPlan = upgradingPlanKey === plan.key;

                return (
                  <Card key={plan.id} className="flex h-full flex-col border-none shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        {plan.badge || isCurrentPlan ? (
                          <Badge variant={isCurrentPlan ? 'default' : 'outline'}>
                            {isCurrentPlan ? 'Aktywny plan' : plan.badge}
                          </Badge>
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                      <p className="text-3xl font-bold">
                        {price} PLN
                        <span className="text-base font-medium text-slate-500">{getPlanPeriodLabel(billingPeriod)}</span>
                      </p>
                      {billingPeriod === 'yearly' ? (
                        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                          Rocznie wychodzi taniej i daje 365 dni dostepu.
                        </p>
                      ) : null}
                      {plan.features.map((feature) => (
                        <p key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="h-4 w-4 text-emerald-500" /> {feature}
                        </p>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button disabled={Boolean(upgradingPlanKey) || isCurrentPlan} onClick={() => void handleUpgrade(plan)} className="w-full">
                        {isCurrentPlan ? 'Twoj plan' : isLoadingPlan ? 'Przekierowanie...' : 'Przejdz do platnosci'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Jak dziala V1</CardTitle>
                <CardDescription>Prosty model bez mylacych limitow i ukrytych oplat.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p><strong>Trial:</strong> startujesz od 14 dni testu z odblokowanym pelnym workflow.</p>
                <p><strong>Po trialu:</strong> placisz karta albo BLIK przez Stripe i aktywujesz wybrany plan na 30 albo 365 dni.</p>
                <p><strong>Statusy:</strong> trial, plan aktywny, problem z platnoscia albo plan anulowany.</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Rozliczenia lead/case</CardTitle>
              <CardDescription>Filtruj status platnosci niezaleznie od statusow sprzedazowych i operacyjnych.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['all', 'awaiting_payment', 'partially_paid', 'fully_paid', 'commission_pending', 'paid'].map((status) => (
                  <Button key={status} size="sm" variant={statusFilter === status ? 'default' : 'outline'} onClick={() => setStatusFilter(status)}>
                    {status === 'all' ? 'Wszystkie' : status}
                  </Button>
                ))}
              </div>
              {settlementLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
              ) : (
                <div className="space-y-2">
                  {payments
                    .filter((payment) => statusFilter === 'all' || String(payment.status || '') === statusFilter)
                    .map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{Number(payment.amount || 0).toLocaleString()} {payment.currency || 'PLN'}</p>
                          <p className="truncate text-sm text-slate-500">
                            {clientById.get(String(payment.clientId || '')) || 'Klient nieznany'} · {leadById.get(String(payment.leadId || '')) || 'Bez leada'} · {caseById.get(String(payment.caseId || '')) || 'Bez sprawy'}
                          </p>
                        </div>
                        <Badge variant="outline">{payment.status || 'not_started'}</Badge>
                      </div>
                    ))}
                  {payments.length === 0 ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-slate-500"><Shield className="h-4 w-4" /> Brak rozliczen do wyswietlenia.</div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
