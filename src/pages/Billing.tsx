import { useMemo, useState } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { useAppearance } from '../components/appearance-provider';
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
  User,
  Users,
  Sparkles,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';

type PlanAudience = 'solo' | 'team';

type PlanCard = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  audience: PlanAudience | 'all';
  popular?: boolean;
  isTrial?: boolean;
};

const PLAN_CARDS: PlanCard[] = [
  {
    id: 'trial_14d',
    name: 'Free Trial 14 dni',
    price: '0',
    description: 'Start bez płatności. Testujesz aplikację i sprawdzasz, czy pasuje do Twojego procesu.',
    features: [
      'Pełny start przez 14 dni',
      'Bez utraty danych po trialu',
      'Po trialu wybierasz plan płatny',
    ],
    audience: 'all',
    isTrial: true,
  },
  {
    id: 'solo_mini',
    name: 'Solo Mini',
    price: '15',
    description: 'Lekki plan dla jednej osoby, która chce pilnować leadów i terminów bez chaosu.',
    features: [
      'Dla 1 operatora',
      'Leady, zadania, kalendarz',
    ],
    audience: 'solo',
  },
  {
    id: 'solo_full',
    name: 'Solo Full',
    price: '30',
    description: 'Pełniejszy wariant solo dla osoby, która chce prowadzić cały proces w jednym miejscu.',
    features: [
      'Dla 1 operatora',
      'Pełny workflow closeflow',
    ],
    audience: 'solo',
    popular: true,
  },
  {
    id: 'team_mini',
    name: 'Firma / Grupa Mini',
    price: '70',
    description: 'Pakiet cenowy dla firmy lub grupy. Warstwę funkcji dopinamy osobno.',
    features: [
      'Oferta dla firmy lub grupy',
      'Cennik gotowy pod rozwój produktu',
    ],
    audience: 'team',
  },
  {
    id: 'team_full',
    name: 'Firma / Grupa Full',
    price: '140',
    description: 'Wyższy wariant firmowy pod mocniejsze użycie i dalsze rozszerzenia produktu.',
    features: [
      'Oferta dla firmy lub grupy',
      'Wyższy pakiet komercyjny',
    ],
    audience: 'team',
    popular: true,
  },
];

function getStatusTone(status: string, isDarkSkin: boolean) {
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
    cardClassName: isDarkSkin ? 'bg-red-950/55 border-red-500/35' : 'bg-rose-50 border-rose-100',
    iconWrapClassName: isDarkSkin ? 'bg-red-500/20 text-red-100' : 'bg-rose-100 text-rose-600',
    badgeClassName: isDarkSkin ? 'bg-red-500/15 border-red-400/45 text-red-50' : 'bg-white border-rose-200 text-rose-700',
    Icon: AlertTriangle,
  };
}

function audienceButtonClass(active: boolean) {
  return active
    ? 'bg-slate-900 text-white shadow-sm'
    : 'bg-white text-slate-600 hover:bg-slate-50';
}

export default function Billing() {
  const { workspace, loading, refresh, access } = useWorkspace();
  const { skin } = useAppearance();
  const [upgrading, setUpgrading] = useState(false);
  const [audience, setAudience] = useState<PlanAudience>('solo');

  const visiblePlans = useMemo(
    () => PLAN_CARDS.filter((plan) => plan.audience === 'all' || plan.audience === audience),
    [audience],
  );

  const currentPlan = useMemo(
    () => PLAN_CARDS.find((plan) => plan.id === workspace?.planId) || null,
    [workspace?.planId],
  );

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
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const isBillingDarkSkin = skin === 'forteca-dark' || skin === 'midnight';
  const tone = getStatusTone(access.status, isBillingDarkSkin);
  const StatusIcon = tone.Icon;
  const trialEndsAtLabel = workspace.trialEndsAt
    ? format(parseISO(workspace.trialEndsAt), 'd MMMM yyyy', { locale: pl })
    : null;

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            <Sparkles className="h-3.5 w-3.5" /> Cennik closeflow
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Subskrypcja i rozliczenia</h1>
          </div>
        </header>

        <Card className={`border-none shadow-sm ${tone.cardClassName}`}>
          <CardContent className="p-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${tone.iconWrapClassName}`}>
                <StatusIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{access.headline}</h2>
                <p className="text-slate-600">{access.description}</p>
                {trialEndsAtLabel && (access.isTrialActive || access.status === 'trial_expired') ? (
                  <p className="mt-1 text-sm text-slate-500">Data końca trialu: {trialEndsAtLabel}</p>
                ) : null}
                {currentPlan ? (
                  <p className="mt-1 text-sm text-slate-500">Obecny plan: {currentPlan.name}</p>
                ) : null}
              </div>
            </div>

            <Badge variant="outline" className={`px-4 py-1 rounded-full font-bold ${tone.badgeClassName}`}>
              {access.badgeLabel}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex justify-end">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1 gap-1">
              <button
                type="button"
                onClick={() => setAudience('solo')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${audienceButtonClass(audience === 'solo')}`}
              >
                <User className="h-4 w-4" /> Solo
              </button>
              <button
                type="button"
                onClick={() => setAudience('team')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${audienceButtonClass(audience === 'team')}`}
              >
                <Users className="h-4 w-4" /> Firma / Grupa
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visiblePlans.map((plan) => {
            const isCurrentPaidPlan = !plan.isTrial && access.isPaidActive && workspace.planId === plan.id;
            const buttonLabel = plan.isTrial
              ? access.isTrialActive
                ? 'Masz aktywny trial'
                : 'Trial startuje przy koncie'
              : isCurrentPaidPlan
                ? 'Twój obecny plan'
                : access.isPaidActive
                  ? 'Przełącz na ten plan'
                  : 'Aktywuj plan';

            return (
              <Card key={plan.id} className={`border-none shadow-lg relative overflow-hidden ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular ? (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Najlepszy wybór
                  </div>
                ) : null}

                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {plan.isTrial ? <Badge variant="secondary">Start</Badge> : null}
                    {audience === 'team' && !plan.isTrial ? <Badge variant="outline">Oferta firmowa</Badge> : null}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
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
                    className="w-full rounded-xl h-11 md:h-12 font-bold text-sm md:text-base"
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={plan.isTrial || isCurrentPaidPlan || upgrading}
                    onClick={() => {
                      if (!plan.isTrial) {
                        void handleUpgrade(plan.id);
                      }
                    }}
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
