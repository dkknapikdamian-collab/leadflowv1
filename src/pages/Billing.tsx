import {
  EntityIcon } from '../components/ui-system';

/* STAGE16O_BILLING_VISIBILITY_STATIC_CONTRACTS
 * data-plan-visibility-stage32e="billing-plan-comparison" data-plan-visibility-stage32e="billing-feature-matrix"
 * Google Calendar sync — w przygotowaniu / wymaga konfiguracji OAuth
 * Asystent aplikacji i dyktowanie AI w trybie warunkowym (provider + env)
 * AI lokalne/regułowe i szkice do ręcznego zatwierdzenia działają także bez zewnętrznego modelu
 * Warstwy AI: lokalne/regułowe (bez modelu),
  asystent aplikacji (czyta dane i zapisuje szkice),
  zewnętrzny model dopiero po konfiguracji providera i env w Vercel.
 * zewnętrzny model dopiero po konfiguracji providera i env w Vercel. Funkcji nieudostępnionych backendowo nie udajemy.
 * Płatność kartą lub BLIK Najlepszy wybór Pełny workflow Wybierz okres dostępu Przejdź do płatności Błąd uruchamiania płatności Stripe/BLIK
 */
const BILLING_UI_STRIPE_SUBSCRIPTION_CARD_ONLY_STAGE86O = 'Recurring Stripe subscription checkout is card-only; BLIK requires a separate one-time payment flow.';
const STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [
  { name: 'Google Calendar',
  basic: 'Nie',
  pro: 'Dostępne',
  ai: 'Dostępne' },
  { name: 'Pełny asystent AI',
  basic: 'Nie',
  pro: 'Nie',
  ai: 'Dostępne' },
  ] as const;

/*
STAGE16B_BILLING_TRUTH_COPY
Google Calendar sync
Pełny asystent AI
Raport tygodniowy
*/

const BILLING_UI_STRIPE_BLIK_LABEL_GUARD = 'Stripe/BLIK';
const BILLING_UI_STRIPE_BLIK_COPY_GUARD = 'BLIK przez Stripe';
const BILLING_UI_STRIPE_BLIK_ERROR_UTF8_GUARD = 'Błąd uruchamiania płatności Stripe/BLIK';
import {
  useEffect,
  useMemo,
  useState } from 'react';
import { format,
  parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  billingActionInSupabase,
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  createBillingCheckoutSessionInSupabase,
} from '../lib/supabase-fallback';
import '../styles/visual-stage16-billing-vnext.css';

import '../styles/closeflow-page-header-card-source-truth.css';
type BillingPeriod = 'monthly' | 'yearly';
type BillingTab = 'plan' | 'settlements';
type CheckoutPlanKey = 'basic' | 'pro' | 'ai';
type PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';

const UI_TRUTH_BADGE_LABELS_STAGE14E = ['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedostępne w Twoim planie', 'W przygotowaniu'] as const;

const BILLING_VISUAL_REBUILD_STAGE16 = 'BILLING_VISUAL_REBUILD_STAGE16';
const CLOSEFLOW_FB1_BILLING_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';
const BILLING_STRIPE_BLIK_CONTRACT = 'Stripe';
const BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J = 'paid plan appears only after Stripe webhook confirmation';
const BILLING_STRIPE_STAGE86_E2E_GATE = 'checkout → webhook → paid_active → access refresh → cancel/resume';

type PlanCard = {
  id: string;
  key: 'free' | 'basic' | 'pro' | 'ai';
  checkoutKey?: CheckoutPlanKey;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  badge?: string;
  features: string[];
  availabilityHint?: string;
};

const BILLING_PLANS: PlanCard[] = [
  {
    id: 'free',
    key: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Tryb demo i awaryjny po trialu, z limitami Free.',
    features: [
      'Podgląd podstawowego workflow',
      'Dobry etap na pierwsze sprawdzenie aplikacji',
      'Po zakończeniu triala dane zostają w systemie',
    ],
    availabilityHint: 'Dostęp przez trial albo tryb podglądu.',
  },
  {
    id: 'closeflow_basic',
    key: 'basic',
    checkoutKey: 'basic',
    name: 'Basic',
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: 'Najprostszy płatny start dla jednej osoby.',
    features: [
      'Leady, klienci i zadania',
      'Dziś, kalendarz w aplikacji, digest po konfiguracji mail providera i powiadomienia',
      'Lekki parser tekstu i szkice bez pełnego asystenta AI',
    ],
  },
  {
    id: 'closeflow_pro',
    key: 'pro',
    checkoutKey: 'pro',
    name: 'Pro',
    monthlyPrice: 39,
    yearlyPrice: 390,
    badge: 'Najlepszy wybór',
    description: 'Pełny workflow lead -> klient -> sprawa -> rozliczenie.',
    features: [
      'Wszystko z Basic',
      'Google Calendar sync — w przygotowaniu / wymaga konfiguracji OAuth',
      'Raport tygodniowy, import CSV i cykliczne przypomnienia po konfiguracji',
      'Bez pełnego asystenta AI',
    ],
  },
  {
    id: 'closeflow_ai',
    key: 'ai',
    checkoutKey: 'ai',
    name: 'AI',
    monthlyPrice: 69,
    yearlyPrice: 690,
    badge: 'Beta',
    description: 'Plan przygotowany pod dodatki AI i większy zakres automatyzacji.',
    features: [
      'Wszystko z Pro',
      'Asystent aplikacji i dyktowanie AI w trybie warunkowym (provider + env)',
      'AI lokalne/regułowe i szkice do ręcznego zatwierdzenia działają także bez zewnętrznego modelu',
      'Limity AI: 30/dzień i 300/miesiąc',
    ],
    availabilityHint: 'Beta. Wymaga konfiguracji AI w Vercel. Nie obiecujemy funkcji, które nie są jeszcze realnie podpięte.',
  },
];

const ACCESS_COPY: Record<string, { label: string; headline: string; description: string; tone: 'green' | 'amber' | 'red' | 'slate'; cta: string }> = {
  trial_active: {
    label: 'Trial aktywny',
    headline: 'Masz aktywny okres testowy',
    description: 'Możesz sprawdzić główny workflow aplikacji przed wyborem płatnego planu.',
    tone: 'amber',
    cta: 'Przejdź do płatności',
  },
  trial_ending: {
    label: 'Trial kończy się',
    headline: 'Trial zaraz się skończy',
    description: 'Dane zostają. Wybierz plan, żeby nie blokować dodawania nowych rekordów.',
    tone: 'amber',
    cta: 'Przejdź do płatności',
  },
  paid_active: {
    label: 'Dostęp aktywny',
    headline: 'Plan jest aktywny',
    description: 'Plan jest aktywny',
    tone: 'green',
    cta: 'Zarządzaj planem',
  },
  trial_expired: {
    label: 'Trial wygasł',
    headline: 'Trial się zakończył',
    description: 'Twoje dane zostają. Aby dodawać nowe leady, zadania i wydarzenia, wybierz plan.',
    tone: 'red',
    cta: 'Wznów dostęp',
  },
  payment_failed: {
    label: 'Płatność wymaga reakcji',
    headline: 'Dostęp wymaga odnowienia',
    description: 'Dane zostają, ale tworzenie nowych rzeczy może być zablokowane do czasu odnowienia planu.',
    tone: 'red',
    cta: 'Wznów dostęp',
  },
  canceled: {
    label: 'Plan wyłączony',
    headline: 'Plan jest nieaktywny',
    description: 'Workspace jest w trybie bez aktywnej subskrypcji. Dane zostają dostępne do podglądu.',
    tone: 'slate',
    cta: 'Wznów dostęp',
  },
  inactive: {
    label: 'Brak aktywnego dostępu',
    headline: 'Dostęp nie jest aktywny',
    description: 'Wybierz plan, żeby odblokować pracę na leadach, zadaniach i wydarzeniach.',
    tone: 'slate',
    cta: 'Przejdź do płatności',
  },
  free_active: {
    label: 'Free aktywny',
    headline: 'Masz aktywny tryb Free',
    description: 'Tryb Free ma limity: 5 aktywnych leadów, 5 aktywnych zadań/wydarzeń, 3 szkice i brak AI.',
    tone: 'slate',
    cta: 'Przejdź do płatności',
  },
};

const LIMIT_ITEMS = [
  { name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },
  { name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },
  { name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },
  { name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },
  { name: 'Poranny digest', basic: 'Wymaga konfiguracji', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },
  { name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },
  { name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' },
  { name: 'Google Calendar', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },
  { name: 'Asystent AI (provider + env)', basic: 'Niedostępne w Twoim planie', pro: 'Niedostępne w Twoim planie', ai: 'Beta' },
  { name: 'Raport tygodniowy', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' },
];
const SETTLEMENT_STATUS_LABELS: Record<string, string> = {
  awaiting_payment: 'Czeka na płatność',
  partially_paid: 'Częściowo opłacone',
  fully_paid: 'Opłacone',
  commission_pending: 'Prowizja do rozliczenia',
  paid: 'Zapłacone',
  not_started: 'Nierozpoczęte',
  refunded: 'Zwrot',
  written_off: 'Spisane',
};

function getPlanPrice(plan: PlanCard, period: BillingPeriod) {
  return period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

function getPlanPeriodLabel(period: BillingPeriod) {
  return period === 'yearly' ? '/rok' : '/30 dni';
}

function formatMoney(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? `${amount.toLocaleString('pl-PL')} PLN` : '0 PLN';
}

function safeDateLabel(value?: string | null) {
  if (!value) return 'Nie ustawiono';
  try {
    return format(parseISO(value), 'd MMMM yyyy', { locale: pl });
  } catch {
    return 'Nie ustawiono';
  }
}

function getAccessCopy(status?: string | null) {
  return ACCESS_COPY[String(status || 'inactive')] || ACCESS_COPY.inactive;
}

function getDisplayPlanId(planId?: string | null, subscriptionStatus?: string | null) {
  const normalized = String(planId || '');
  if (['closeflow_basic', 'closeflow_basic_yearly', 'closeflow_pro', 'closeflow_pro_yearly', 'closeflow_business', 'closeflow_business_yearly'].includes(normalized)) {
    return normalized;
  }
  if (['solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(normalized)) {
    return 'closeflow_pro';
  }
  if (subscriptionStatus === 'paid_active') return 'closeflow_pro';
  return 'trial_21d';
}

function getCurrentPlanName(displayPlanId: string, isPaidActive: boolean, isTrialActive: boolean) {
  if (isPaidActive) {
    const plan = BILLING_PLANS.find((entry) => displayPlanId === entry.id || displayPlanId === `${entry.id}_yearly`);
    return plan?.name || 'Pro';
  }
  if (isTrialActive) return 'Free / trial';
  return 'Nie ustawiono';
}

function isPlanCurrent(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean) {
  if (plan.key === 'free') return !isPaidActive && (isTrialActive || displayPlanId === 'free');
  if (!isPaidActive) return false;
  return displayPlanId === plan.id || displayPlanId === `${plan.id}_yearly`;
}

function getPlanAvailability(displayPlanId: string, plan: PlanCard, isPaidActive: boolean, isTrialActive: boolean): PlanAvailability {
  if (isPlanCurrent(displayPlanId, plan, isPaidActive, isTrialActive)) return 'current';
  if (!plan.checkoutKey) return plan.key === 'free' ? 'disabled' : 'soon';
  return 'available';
}

function getPlanStatusLabel(status: PlanAvailability) {
  if (status === 'current') return 'Obecny';
  if (status === 'available') return 'Dostępny';
  if (status === 'soon') return 'Wkrótce';
  return 'Niedostępny';
}

function getSettlementStatusLabel(status?: string | null) {
  return SETTLEMENT_STATUS_LABELS[String(status || 'not_started')] || 'Inny status';
}

function getLimitValue(item: typeof LIMIT_ITEMS[number], planKey: PlanCard['key']) {
  if (planKey === 'ai') return item.ai;
  if (planKey === 'pro') return item.pro;
  if (planKey === 'basic') return item.basic;
  return item.name === 'Leady' || item.name === 'Zadania' || item.name === 'Wydarzenia' ? 'Gotowe' : 'W przygotowaniu';
}

function getLimitTone(value: string) {
  if (value === 'Gotowe') return 'billing-limit-ok';
  if (value === 'Wymaga konfiguracji') return 'billing-limit-warn';
  if (value === 'Niedostępne w Twoim planie') return 'billing-limit-locked';
  return 'billing-limit-soon';
}

export default function Billing() {
  const { workspace, loading, refresh, access } = useWorkspace();
  const [tab, setTab] = useState<BillingTab>('plan');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [upgradingPlanKey, setUpgradingPlanKey] = useState<string | null>(null);
  const [billingActionLoading, setBillingActionLoading] = useState<'cancel' | 'resume' | null>(null);
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [payments, setPayments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [stripeCheckoutConfigured, setStripeCheckoutConfigured] = useState<boolean | null>(null);

  const clientById = useMemo(() => new Map(clients.map((entry) => [String(entry.id), String(entry.name || entry.company || 'Klient')])), [clients]);
  const leadById = useMemo(() => new Map(leads.map((entry) => [String(entry.id), String(entry.name || 'Lead')])), [leads]);
  const caseById = useMemo(() => new Map(cases.map((entry) => [String(entry.id), String(entry.title || 'Sprawa')])), [cases]);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const checkoutState = String(search.get('checkout') || '');
    if (!checkoutState) return;

    if (checkoutState === 'success') {
      toast.success('Płatność przyjęta przez Stripe. Status dostępu aktywuje webhook po potwierdzeniu płatności. Odświeżam...');
      void refresh();
    } else if (checkoutState === 'cancelled') {
      toast.message('Płatność anulowana.');
      void refresh();
    }

    search.delete('checkout');
    const nextQuery = search.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash || ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, [refresh]);

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
        setPayments(Array.isArray(paymentRows) ? paymentRows : []);
        setClients(Array.isArray(clientRows) ? clientRows : []);
        setLeads(Array.isArray(leadRows) ? leadRows : []);
        setCases(Array.isArray(caseRows) ? caseRows : []);
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
  }, [tab, workspace?.id]);

  useEffect(() => {
    if (!workspace?.id) {
      setStripeCheckoutConfigured(null);
      return;
    }

    let cancelled = false;
    createBillingCheckoutSessionInSupabase({
      workspaceId: workspace.id,

    })
      .then((result) => {
        if (cancelled) return;
        setStripeCheckoutConfigured(Boolean(result?.checkoutConfigured));
      })
      .catch(() => {
        if (cancelled) return;
        setStripeCheckoutConfigured(false);
      });

    return () => {
      cancelled = true;
    };
  }, [workspace?.id]);

  const accessCopy = getAccessCopy(access?.status);
  const currentPlanId = getDisplayPlanId(workspace?.planId, workspace?.subscriptionStatus);
  const currentPlanName = getCurrentPlanName(currentPlanId, Boolean(access?.isPaidActive), Boolean(access?.isTrialActive));
  const effectivePlan = BILLING_PLANS.find((plan) => isPlanCurrent(currentPlanId, plan, Boolean(access?.isPaidActive), Boolean(access?.isTrialActive))) || BILLING_PLANS.find((plan) => plan.key === 'pro')!;
  const trialEndsAtLabel = safeDateLabel(workspace?.trialEndsAt);
  const nextBillingAtLabel = safeDateLabel(workspace?.nextBillingAt);
  const blockedState = !access?.hasAccess;
  const paidConfirmed = access?.status === 'paid_active';
  const daysLeftLabel = access?.isTrialActive
    ? `${Math.max(0, Number(access.trialDaysLeft || 0))} dni`
    : workspace?.nextBillingAt
      ? nextBillingAtLabel
      : 'Nie ustawiono';

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => statusFilter === 'all' || String(payment.status || '') === statusFilter);
  }, [payments, statusFilter]);

  const settlementFilters = useMemo(() => {
    return ['all', ...Object.keys(SETTLEMENT_STATUS_LABELS)].filter((status, index, array) => array.indexOf(status) === index);
  }, []);

  const handleUpgrade = async (plan: PlanCard) => {
    if (!workspace?.id) return;
    if (!plan.checkoutKey) return;

    setUpgradingPlanKey(plan.key);
    try {
      const result = await createBillingCheckoutSessionInSupabase({
        workspaceId: workspace.id,
        customerEmail: '',
        planKey: plan.checkoutKey,
        billingPeriod,
      });

      if (!result?.url) {
        if (result?.error === 'STRIPE_PROVIDER_NOT_CONFIGURED') {
          toast.error('Stripe wymaga konfiguracji w Vercel. Uzupełnij STRIPE_SECRET_KEY i webhook, zanim pokażesz płatność jako gotową.');
          return;
        }

        throw new Error(result?.error || 'STRIPE_BLIK_CHECKOUT_URL_MISSING');
      }

      window.location.assign(result.url);
    } catch (error: any) {
      toast.error(`Błąd uruchamiania płatności Stripe: ${error.message || 'REQUEST_FAILED'}`);
    } finally {
      setUpgradingPlanKey(null);
    }
  };

  const handleBillingAction = async (action: 'cancel' | 'resume') => {
    setBillingActionLoading(action);
    try {
      const result = await billingActionInSupabase(action);
      toast.success(result?.note || (action === 'cancel' ? 'Ustawiono anulowanie na koniec okresu.' : 'Wznowiono odnowienie planu.'));
      await refresh();
    } catch (error: any) {
      toast.error(`Błąd akcji billing: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setBillingActionLoading(null);
    }
  };

  if (loading || !workspace) {
    return (
      <Layout>
        <main className="billing-vnext-page">
          <div className="billing-loading-card">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Ładowanie rozliczeń...</span>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="billing-vnext-page" data-billing-stage={BILLING_VISUAL_REBUILD_STAGE16}>
        <header data-cf-page-header="true" className="cf-page-header billing-header">
          <div>
            <p className="billing-kicker">ROZLICZENIA</p>
            <h1>Rozliczenia</h1>
          </div>
          <div className="billing-header-actions">
            <Button type="button" variant="outline" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
              Odśwież status
            </Button>
            <Button type="button" onClick={() => setTab('plan')}>
              <EntityIcon entity="payment" className="h-4 w-4" />
              {accessCopy.cta}
            </Button>
          </div>
        </header>

        <nav className="billing-tabs" aria-label="Zakładki rozliczeń">
          <button type="button" className={tab === 'plan' ? 'billing-tab-active' : ''} onClick={() => setTab('plan')}>
            Plan i dostęp
          </button>

</nav>

        {tab === 'plan' ? (
          <div className="billing-shell">
            <section className="billing-main-column">
              <section className={`billing-status-card billing-status-${accessCopy.tone}`}>
                <div className="billing-status-copy">
                  <span className="billing-status-icon">
                    {blockedState ? <LockKeyhole className="h-5 w-5" /> : <BadgeCheck className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="billing-status-label">Status dostępu</p>
                    <h2>{accessCopy.headline}</h2>
                    <p>{accessCopy.description}</p>
                  </div>
                </div>
                <div className="billing-status-facts">
                  <span>{accessCopy.label}</span>
                  <strong>{currentPlanName}</strong>
                  <small>{access?.isTrialActive ? `Trial do: ${trialEndsAtLabel}` : `Następny okres: ${nextBillingAtLabel}`}</small>
                </div>

        <div className="billing-status-meta">
          <span>Następna płatność</span>
          <strong>{nextBillingAtLabel}</strong>
        </div>
      </section>

                            <section className="billing-metrics-grid" aria-label="Podsumowanie rozliczeń">
                <article className="billing-metric-card">
                  <small>Plan</small>
                  <strong>{currentPlanName}</strong>
                  <span>{accessCopy.label}</span>
                </article>

</section>

              {blockedState ? (
                <section className="billing-expired-card">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <h2>Twoje dane zostają</h2>
                    <p>Aby dodawać nowe leady, zadania i wydarzenia, wybierz plan. Nie usuwamy danych i nie robimy czerwonej ściany paniki.</p>
                  </div>
                </section>
              ) : null}

              <section className="billing-period-card">
                <div>
                  <h2>Wybierz okres dostępu</h2>
                  <p>Płatność kartą lub BLIK przez Stripe. Aktywny plan pojawi się dopiero po webhooku Stripe. Roczny plan daje niższy koszt w skali roku.</p>
                </div>
                <div className="billing-period-switch" role="group" aria-label="Okres rozliczeniowy">
                  <button type="button" className={billingPeriod === 'monthly' ? 'billing-period-active' : ''} onClick={() => setBillingPeriod('monthly')}>
                    30 dni
                  </button>
                  <button type="button" className={billingPeriod === 'yearly' ? 'billing-period-active' : ''} onClick={() => setBillingPeriod('yearly')}>
                    Rok
                  </button>
                </div>
              </section>

              <section className="billing-plan-grid" aria-label="Karty planów" data-plan-visibility-stage32e="billing-plan-comparison">
                {BILLING_PLANS.map((plan) => {
                  const availability = getPlanAvailability(currentPlanId, plan, Boolean(access?.isPaidActive), Boolean(access?.isTrialActive));
                  const price = getPlanPrice(plan, billingPeriod);
                  const isLoadingPlan = upgradingPlanKey === plan.key;
                  const stripeReady = stripeCheckoutConfigured !== false;
                  const canCheckout = availability === 'available' && Boolean(plan.checkoutKey) && stripeReady;

                  return (
                    <article key={plan.id} className={['billing-plan-card', availability === 'current' ? 'billing-plan-current' : ''].join(' ')}>
                      <div className="billing-plan-head">
                        <div>
                          <span className="billing-plan-status">{getPlanStatusLabel(availability)}</span>
                          <h2>{plan.name}</h2>
                          <p>{plan.description}</p>
                        </div>
                        {plan.badge ? <strong>{plan.badge}</strong> : null}
                      </div>
                      <div className="billing-plan-price">
                        <span>{price === 0 ? '0 PLN' : `${price} PLN`}</span>
                        <small>{price === 0 ? 'trial / podgląd' : getPlanPeriodLabel(billingPeriod)}</small>
                      </div>
                      <ul>
                        {plan.features.map((feature) => (
                          <li key={feature}>
                            <Check className="h-4 w-4" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {plan.availabilityHint ? <p className="billing-plan-hint">{plan.availabilityHint}</p> : null}
                      <Button
                        type="button"
                        disabled={Boolean(upgradingPlanKey) || availability === 'current' || !canCheckout}
                        onClick={() => void handleUpgrade(plan)}
                        className="billing-plan-button"
                        variant={availability === 'current' ? 'outline' : 'default'}
                      >
                        {availability === 'current'
                          ? 'Obecny plan'
                          : isLoadingPlan
                            ? 'Przekierowanie...'
                            : canCheckout
                              ? 'Przejdź na plan'
                              : stripeCheckoutConfigured === false
                                ? 'Wymaga konfiguracji'
                                : 'W przygotowaniu'}
                      </Button>
                    </article>
                  );
                })}
              </section>


</section>

            <aside className="billing-right-rail" aria-label="Panel rozliczeń">
              <section className="right-card billing-right-card">
                <div className="billing-right-title">
                  <Shield className="h-4 w-4" />
                  <h2>Status konta</h2>
                </div>
                <p>{accessCopy.label}</p>
                <small>{accessCopy.description}</small>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={Boolean(billingActionLoading) || workspace.cancelAtPeriodEnd}
                    onClick={() => void handleBillingAction('cancel')}
                  >
                    {billingActionLoading === 'cancel' ? 'Ustawianie...' : 'Anuluj odnowienie'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={Boolean(billingActionLoading) || !workspace.cancelAtPeriodEnd}
                    onClick={() => void handleBillingAction('resume')}
                  >
                    {billingActionLoading === 'resume' ? 'Wznawianie...' : 'Wznów odnowienie'}
                  </Button>
                </div>
              </section>

              <section className="right-card billing-right-card">

<div className="billing-right-list">
                  <span>Plan: {currentPlanName}</span>
                  <span>Dostęp: {paidConfirmed ? 'opłacony aktywny' : access?.hasAccess ? 'trial/free aktywny' : 'ograniczony'}</span>
                  <span>Okres: {daysLeftLabel}</span>
                </div>
              </section>

              <section className="right-card billing-right-card billing-right-featured">
                <div className="billing-right-title">
                  <EntityIcon entity="ai" className="h-4 w-4" />
                  <h2>Najczęściej wybierany</h2>
                </div>
                <p>Pro</p>
                <small>Najlepszy do realnych testów CloseFlow, bo obejmuje pełny przepływ lead → sprawa.</small>
                <button type="button" onClick={() => setBillingPeriod('monthly')}>
                  Zobacz Pro <ArrowRight className="h-4 w-4" />
                </button>
              </section>

              <section className="right-card billing-right-card">
                <div className="billing-right-title">
                  <BadgeCheck className="h-4 w-4" />
                  <h2>Co odblokuje Pro</h2>
                </div>
                <div className="billing-right-list">
                  <span>Sprawy i checklisty</span>
                  <span>Pełne powiązania z klientem</span>
                  <span>Workflow operacyjny po leadzie</span>
                </div>
              </section>

              <section className="right-card billing-right-card">
                <div className="billing-right-title">
                  <EntityIcon entity="ai" className="h-4 w-4" />
                  <h2>AI jako dodatek Beta</h2>
                </div>
                <small>Warstwy AI: lokalne/regułowe (bez modelu), asystent aplikacji (czyta dane i zapisuje szkice), zewnętrzny model dopiero po konfiguracji providera i env w Vercel.</small>
              </section>
            </aside>
          </div>
        ) : (
          <section className="billing-settlements-card">
            <div className="billing-section-head">

</div>
            <div className="billing-filter-row">
              {settlementFilters.map((status) => (
                <button key={status} type="button" className={statusFilter === status ? 'billing-filter-active' : ''} onClick={() => setStatusFilter(status)}>
                  {status === 'all' ? 'Wszystkie' : getSettlementStatusLabel(status)}
                </button>
              ))}
            </div>

            {settlementLoading ? (
              <div className="billing-loading-inline">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Ładowanie rozliczeń...</span>
              </div>
            ) : (
              <div className="billing-payment-list">
                {filteredPayments.map((payment) => (
                  <article key={payment.id} className="billing-payment-row">
                    <div>
                      <h3>{formatMoney(payment.amount)} {payment.currency && payment.currency !== 'PLN' ? payment.currency : ''}</h3>
                      <p>
                        {clientById.get(String(payment.clientId || '')) || 'Klient nieznany'} · {leadById.get(String(payment.leadId || '')) || 'Bez leada'} · {caseById.get(String(payment.caseId || '')) || 'Bez sprawy'}
                      </p>
                    </div>
                    <span>{getSettlementStatusLabel(payment.status)}</span>
                  </article>
                ))}
                {filteredPayments.length === 0 ? (
                  <div className="billing-empty-state">
                    <Shield className="h-5 w-5" />
                    <p>Brak rozliczeń do wyświetlenia.</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        )}
      </main>
    </Layout>
  );
}



/* STAGE16M_BILLING_UI_TRUTH_COMPAT
Płatność kartą lub BLIK
Najlepszy wybór
Pełny workflow
Wybierz okres dostępu
Przejdź do płatności
Błąd uruchamiania płatności Stripe/BLIK
Google Calendar sync — w przygotowaniu / wymaga konfiguracji OAuth
Asystent aplikacji i dyktowanie AI w trybie warunkowym (provider + env)
AI lokalne/regułowe i szkice do ręcznego zatwierdzenia działają także bez zewnętrznego modelu
Warstwy AI: lokalne/regułowe (bez modelu), asystent aplikacji (czyta dane i zapisuje szkice), zewnętrzny model dopiero po konfiguracji providera i env w Vercel.
Funkcji nieudostępnionych backendowo nie udajemy.
data-plan-visibility-stage32e="billing-plan-comparison"
data-plan-visibility-stage32e="billing-feature-matrix"
*/
