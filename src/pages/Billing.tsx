import { useState } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { updateWorkspaceSubscriptionInSupabase } from '../lib/supabase-fallback';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Shield,
  Clock,
  AlertTriangle,
  Check,
  Loader2,
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

function getStatusTone(status: string) {
  if (status === 'paid_active') {
    return {
      cardClassName: 'bg-emerald-50 border-emerald-100',
      iconWrapClassName: 'bg-emerald-100 text-emerald-600',
      badgeClassName: 'bg-white border-emerald-200 text-emerald-700',
      Icon: Shield,
    };
  }

  if (status === 'trial_active' || status === 'trial_ending') {
    return {
      cardClassName: 'bg-indigo-50 border-indigo-100',
      iconWrapClassName: 'bg-indigo-100 text-indigo-600',
      badgeClassName: 'bg-white border-indigo-200 text-indigo-700',
      Icon: Clock,
    };
  }

  return {
    cardClassName: 'bg-rose-50 border-rose-100',
    iconWrapClassName: 'bg-rose-100 text-rose-600',
    badgeClassName: 'bg-white border-rose-200 text-rose-700',
    Icon: AlertTriangle,
  };
}

export default function Billing() {
  const { workspace, loading, refresh, access } = useWorkspace();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (!workspace) return;
    if (access.isPaidActive && workspace.planId === planId) return;

    setUpgrading(true);
    try {
      await updateWorkspaceSubscriptionInSupabase({
        workspaceId: workspace.id,
        planId,
        subscriptionStatus: 'paid_active',
      });
      toast.success('Subskrypcja aktywowana.');
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

  const tone = getStatusTone(access.status);
  const StatusIcon = tone.Icon;
  const trialEndsAtLabel = workspace.trialEndsAt
    ? format(parseISO(workspace.trialEndsAt), 'd MMMM yyyy', { locale: pl })
    : null;

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Subskrypcja i rozliczenia</h1>
          <p className="text-slate-500">Zarządzaj swoim planem i dostępem do Fortecy.</p>
        </header>

        <Card className={`border-none shadow-sm ${tone.cardClassName}`}>
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${tone.iconWrapClassName}`}>
                <StatusIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{access.headline}</h2>
                <p className="text-slate-600">{access.description}</p>
                {trialEndsAtLabel && (access.isTrialActive || access.status === 'trial_expired') ? (
                  <p className="mt-1 text-sm text-slate-500">Data końca trialu: {trialEndsAtLabel}</p>
                ) : null}
              </div>
            </div>

            <Badge variant="outline" className={`px-4 py-1 rounded-full font-bold ${tone.badgeClassName}`}>
              {access.badgeLabel}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map((plan) => {
            const isCurrentPaidPlan = access.isPaidActive && workspace.planId === plan.id;
            const buttonLabel = isCurrentPaidPlan
              ? 'Twój obecny plan'
              : access.isPaidActive
                ? 'Przełącz na ten plan'
                : 'Aktywuj plan';

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
                    disabled={isCurrentPaidPlan || upgrading}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {buttonLabel}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
