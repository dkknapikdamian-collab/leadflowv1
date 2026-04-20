import { useMemo, useState } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { updateWorkspaceSubscriptionInSupabase } from '../lib/supabase-fallback';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  CreditCard,
  Zap,
  Shield,
  Clock,
  Check,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'solo',
    name: 'Forteca Solo',
    price: '99',
    description: 'Dla freelancerów i małych firm.',
    features: [
      'Nielimitowane leady',
      'Nielimitowane sprawy',
      'Portal klienta',
      'Automatyczne checklisty',
      'Wsparcie e-mail',
    ],
  },
  {
    id: 'pro',
    name: 'Forteca Pro',
    price: '249',
    description: 'Dla zespołów i agencji.',
    features: [
      'Wszystko w Solo',
      'Współpraca zespołowa',
      'Zaawansowane raporty',
      'Własna domena portalu',
      'Priorytetowe wsparcie',
    ],
    popular: true,
  },
];

function statusTone(status: string) {
  if (status === 'paid_active') {
    return {
      card: 'bg-emerald-50 border-emerald-100',
      icon: 'bg-emerald-100 text-emerald-600',
      badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    };
  }

  if (status === 'trial_active' || status === 'trial_ending') {
    return {
      card: 'bg-indigo-50 border-indigo-100',
      icon: 'bg-indigo-100 text-indigo-600',
      badge: 'bg-white border-indigo-200 text-indigo-700',
    };
  }

  if (status === 'trial_expired' || status === 'payment_failed') {
    return {
      card: 'bg-rose-50 border-rose-100',
      icon: 'bg-rose-100 text-rose-600',
      badge: 'bg-white border-rose-200 text-rose-700',
    };
  }

  return {
    card: 'bg-slate-50 border-slate-200',
    icon: 'bg-slate-100 text-slate-600',
    badge: 'bg-white border-slate-200 text-slate-700',
  };
}

export default function Billing() {
  const { workspace, loading, refresh, access, isPaidActive } = useWorkspace();
  const [upgrading, setUpgrading] = useState(false);

  const currentPlan = useMemo(
    () => PLANS.find((plan) => plan.id === workspace?.planId) || PLANS[0],
    [workspace?.planId]
  );
  const tone = statusTone(access.status);

  const handleUpgrade = async (planId: string) => {
    if (!workspace) return;
    setUpgrading(true);
    try {
      await updateWorkspaceSubscriptionInSupabase({
        workspaceId: workspace.id,
        planId,
        subscriptionStatus: 'paid_active',
        trialEndsAt: null,
      });
      toast.success('Plan aktywowany.');
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
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const trialEndsAtLabel = workspace.trialEndsAt
    ? format(parseISO(workspace.trialEndsAt), 'd MMMM yyyy', { locale: pl })
    : null;

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Subskrypcja i rozliczenia</h1>
          <p className="text-slate-500">Jeden stan dostępu dla billingu, blokad akcji i całej aplikacji.</p>
        </header>

        <Card className={`border shadow-sm ${tone.card}`}>
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${tone.icon}`}>
                {access.status === 'paid_active' ? (
                  <Shield className="w-8 h-8" />
                ) : access.status === 'trial_expired' || access.status === 'payment_failed' ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <Clock className="w-8 h-8" />
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">{access.headline}</h2>
                <p className="text-slate-600">{access.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="outline" className={`px-4 py-1 rounded-full font-bold ${tone.badge}`}>
                    {access.badgeLabel}
                  </Badge>
                  <Badge variant="outline" className="px-4 py-1 rounded-full font-bold bg-white border-slate-200 text-slate-700">
                    Plan: {currentPlan.name}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="min-w-[220px] space-y-2 rounded-2xl bg-white/80 p-4 border border-white/70">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Stan dostępu</p>
              <p className="text-sm font-semibold text-slate-900">
                {access.hasAccess ? 'Możesz tworzyć i edytować rekordy' : 'Tworzenie nowych rekordów jest zablokowane'}
              </p>
              {trialEndsAtLabel ? (
                <p className="text-xs text-slate-500">Koniec trialu: {trialEndsAtLabel}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {access.status === 'trial_expired' || access.status === 'payment_failed' || access.status === 'inactive' || access.status === 'canceled' ? (
          <Card className="border border-amber-100 bg-amber-50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Co jest teraz zablokowane</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Podgląd danych nadal działa, ale dodawanie nowych leadów, spraw, zadań i wydarzeń wymaga aktywnego planu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map((plan) => {
            const isCurrentPlan = workspace.planId === plan.id && isPaidActive;

            return (
              <Card key={plan.id} className={`border-none shadow-lg relative overflow-hidden ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular ? (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Najpopularniejszy
                  </div>
                ) : null}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price} PLN</span>
                    <span className="text-slate-500">/ mies.</span>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full rounded-xl h-12 font-bold text-base"
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={isCurrentPlan || upgrading}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isCurrentPlan ? 'Twój obecny plan' : 'Wybierz ten plan'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6 space-y-2">
            <Shield className="w-8 h-8 text-slate-400" />
            <h4 className="font-bold text-slate-900">Bezpieczne płatności</h4>
            <p className="text-xs text-slate-500">Warstwa płatności może zostać podpięta później bez zmiany logiki dostępu w aplikacji.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 space-y-2">
            <Zap className="w-8 h-8 text-slate-400" />
            <h4 className="font-bold text-slate-900">Spójny stan dostępu</h4>
            <p className="text-xs text-slate-500">Billing, blokady akcji i komunikaty operatora liczą teraz ten sam stan workspace.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 space-y-2">
            <CreditCard className="w-8 h-8 text-slate-400" />
            <h4 className="font-bold text-slate-900">Gotowe pod realne płatności</h4>
            <p className="text-xs text-slate-500">Po podpięciu operatora płatności wystarczy aktualizować workspace, bez osobnej logiki w widokach.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
