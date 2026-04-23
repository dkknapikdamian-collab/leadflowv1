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
import { fetchCasesFromSupabase, fetchClientsFromSupabase, fetchLeadsFromSupabase, fetchPaymentsFromSupabase, updateWorkspaceSubscriptionInSupabase } from '../lib/supabase-fallback';

type PlanCard = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
};

const PLANS: PlanCard[] = [
  { id: 'solo_mini', name: 'Solo Mini', price: '15', description: 'Dla 1 osoby, lekki workflow.', features: ['Leady, sprawy, today', 'Podstawowe rozliczenia'] },
  { id: 'solo_full', name: 'Solo Full', price: '30', description: 'Pełny workflow dla freelancera.', features: ['Wszystkie moduły V1', 'Priorytetowe wsparcie'] },
  { id: 'team_mini', name: 'Firma Mini', price: '70', description: 'Pakiet dla małego zespołu.', features: ['Model firmowy', 'Wspólna baza klientów'] },
  { id: 'team_full', name: 'Firma Full', price: '140', description: 'Pakiet firmowy rozszerzony.', features: ['Model firmowy+', 'Rozbudowane wsparcie'] },
];

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
        toast.error(`Błąd odczytu rozliczeń: ${error?.message || 'REQUEST_FAILED'}`);
      })
      .finally(() => {
        if (cancelled) return;
        setSettlementLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const handleUpgrade = async (planId: string) => {
    if (!workspace) return;
    setUpgrading(true);
    try {
      await updateWorkspaceSubscriptionInSupabase({
        workspaceId: workspace.id,
        planId,
        subscriptionStatus: 'paid_active',
      });
      toast.success('Plan zapisany.');
      refresh();
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading || !workspace) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </Layout>
    );
  }

  const trialEndsAtLabel = workspace.trialEndsAt ? format(parseISO(workspace.trialEndsAt), 'd MMMM yyyy', { locale: pl }) : null;
  const isDark = skin === 'forteca-dark' || skin === 'midnight';

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            <Sparkles className="h-3.5 w-3.5" /> Cennik i rozliczenia
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
        </header>

        <Tabs value={tab} onValueChange={(value) => setTab(value as 'plan' | 'settlements')}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="settlements">Rozliczenia</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === 'plan' ? (
          <>
            <Card className={`border-none shadow-sm ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-emerald-50'}`}>
              <CardContent className="p-6 flex flex-col gap-2">
                <h2 className="text-xl font-bold">{access.headline}</h2>
                <p>{access.description}</p>
                {trialEndsAtLabel && (access.isTrialActive || access.status === 'trial_expired') ? (
                  <p className="text-sm opacity-80">Data końca trialu: {trialEndsAtLabel}</p>
                ) : null}
                <Badge variant="outline" className="w-fit">{access.badgeLabel}</Badge>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLANS.map((plan) => {
                const isCurrent = workspace.planId === plan.id && access.isPaidActive;
                return (
                  <Card key={plan.id} className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-3xl font-bold">{plan.price} PLN<span className="text-base font-medium text-slate-500">/mies.</span></p>
                      {plan.features.map((feature) => (
                        <p key={feature} className="text-sm text-slate-600 flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> {feature}</p>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button disabled={upgrading || isCurrent} onClick={() => void handleUpgrade(plan.id)} className="w-full">
                        {isCurrent ? 'Twój plan' : upgrading ? 'Zapisywanie...' : 'Aktywuj plan'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Rozliczenia lead/case</CardTitle>
              <CardDescription>Filtruj status płatności niezależnie od statusów sprzedażowych i operacyjnych.</CardDescription>
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
                <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
              ) : (
                <div className="space-y-2">
                  {payments
                    .filter((payment) => statusFilter === 'all' || String(payment.status || '') === statusFilter)
                    .map((payment) => (
                      <div key={payment.id} className="rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{Number(payment.amount || 0).toLocaleString()} {payment.currency || 'PLN'}</p>
                          <p className="text-sm text-slate-500 truncate">
                            {clientById.get(String(payment.clientId || '')) || 'Klient nieznany'} · {leadById.get(String(payment.leadId || '')) || 'Bez leada'} · {caseById.get(String(payment.caseId || '')) || 'Bez sprawy'}
                          </p>
                        </div>
                        <Badge variant="outline">{payment.status || 'not_started'}</Badge>
                      </div>
                    ))}
                  {payments.length === 0 ? (
                    <div className="py-4 text-sm text-slate-500 flex items-center gap-2"><Shield className="w-4 h-4" /> Brak rozliczeń do wyświetlenia.</div>
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
