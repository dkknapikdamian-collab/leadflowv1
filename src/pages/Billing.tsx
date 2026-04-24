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
  updateWorkspaceSubscriptionInSupabase,
} from '../lib/supabase-fallback';

type PlanCard = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
};

const PAID_PLAN: PlanCard = {
  id: 'closeflow_pro',
  name: 'CloseFlow Pro',
  price: '49',
  description: 'Jeden prosty plan V1 dla solo uslug i sprzedazy.',
  features: [
    'Pelny workflow lead -> case -> rozliczenie',
    'Klienci, sprawy, taski i Today w jednym miejscu',
    'Portal klienta i modul rozliczen V1',
  ],
};

function getDisplayPlanId(planId?: string | null, subscriptionStatus?: string | null) {
  if (planId === 'trial_14d' || planId === 'closeflow_pro') return planId;
  if (['solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(String(planId || ''))) {
    return 'closeflow_pro';
  }
  if (subscriptionStatus === 'paid_active') return 'closeflow_pro';
  return 'trial_14d';
}

export default function Billing() {
  const { workspace, loading, refresh, access } = useWorkspace();
  const { skin } = useAppearance();
  const [tab, setTab] = useState<'plan' | 'settlements'>('plan');
  const [upgrading, setUpgrading] = useState(false);
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

  const handleUpgrade = async () => {
    if (!workspace) return;
    setUpgrading(true);
    try {
      await updateWorkspaceSubscriptionInSupabase({
        workspaceId: workspace.id,
        planId: PAID_PLAN.id,
        subscriptionStatus: 'paid_active',
      });
      toast.success('Plan zapisany.');
      refresh();
    } catch (error: any) {
      toast.error(`Blad: ${error.message}`);
    } finally {
      setUpgrading(false);
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
  const isCurrentPaidPlan = currentPlanId === PAID_PLAN.id && access.isPaidActive;

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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>{PAID_PLAN.name}</CardTitle>
                      <CardDescription>{PAID_PLAN.description}</CardDescription>
                    </div>
                    <Badge variant={isCurrentPaidPlan ? 'default' : 'outline'}>
                      {isCurrentPaidPlan ? 'Aktywny plan' : 'Plan V1'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-3xl font-bold">
                    {PAID_PLAN.price} PLN
                    <span className="text-base font-medium text-slate-500">/mies.</span>
                  </p>
                  {PAID_PLAN.features.map((feature) => (
                    <p key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500" /> {feature}
                    </p>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button disabled={upgrading || isCurrentPaidPlan} onClick={() => void handleUpgrade()} className="w-full">
                    {isCurrentPaidPlan ? 'Twoj plan' : upgrading ? 'Zapisywanie...' : 'Aktywuj plan'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Jak dziala V1</CardTitle>
                  <CardDescription>Prosty model bez mylacych wariantow i porownywarki planow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <p><strong>Trial:</strong> startujesz od 14 dni testu z odblokowanym pelnym workflow.</p>
                  <p><strong>Po trialu:</strong> aktywujesz jeden plan CloseFlow Pro.</p>
                  <p><strong>Statusy:</strong> trial, plan aktywny, problem z platnoscia albo plan anulowany.</p>
                </CardContent>
              </Card>
            </div>
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
