import { PLAN_IDS } from '../plans';

export type BillingPeriod = 'monthly' | 'yearly';
export type CheckoutPlanKey = 'basic' | 'pro' | 'ai';
export type BillingPlanKey = 'free' | 'basic' | 'pro' | 'ai';
export type BillingPlanAvailability = 'current' | 'available' | 'disabled' | 'soon';

export type BillingPlanCard = {
  id: string;
  key: BillingPlanKey;
  checkoutKey?: CheckoutPlanKey;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  badge?: string;
  features: string[];
  availabilityHint?: string;
};

export type BillingAccessTone = 'green' | 'amber' | 'red' | 'slate';

export type BillingAccessCopy = {
  label: string;
  headline: string;
  description: string;
  tone: BillingAccessTone;
  cta: string;
};

export type BillingLimitItem = {
  name: string;
  basic: string;
  pro: string;
  ai: string;
};

export const BILLING_PLAN_OPTIONS: BillingPlanCard[] = [
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

export const BILLING_ACCESS_COPY_BY_STATUS: Record<string, BillingAccessCopy> = {
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

export const BILLING_LIMIT_ITEMS: BillingLimitItem[] = [
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

export const BILLING_SETTLEMENT_STATUS_LABELS: Record<string, string> = {
  awaiting_payment: 'Czeka na płatność',
  partially_paid: 'Częściowo opłacone',
  fully_paid: 'Opłacone',
  commission_pending: 'Prowizja do rozliczenia',
  paid: 'Zapłacone',
  not_started: 'Nierozpoczęte',
  refunded: 'Zwrot',
  written_off: 'Spisane',
};

export function getBillingPlanPrice(plan: BillingPlanCard, period: BillingPeriod) {
  return period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

export function getBillingPlanPeriodLabel(period: BillingPeriod) {
  return period === 'yearly' ? '/rok' : '/30 dni';
}

export function getBillingAccessCopy(status?: string | null) {
  return BILLING_ACCESS_COPY_BY_STATUS[String(status || 'inactive')] || BILLING_ACCESS_COPY_BY_STATUS.inactive;
}

export function getDisplayBillingPlanId(planId?: string | null, subscriptionStatus?: string | null) {
  const normalized = String(planId || '');
  if (['closeflow_basic', 'closeflow_basic_yearly', 'closeflow_pro', 'closeflow_pro_yearly', 'closeflow_business', 'closeflow_business_yearly'].includes(normalized)) {
    return normalized;
  }
  if (['solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(normalized)) {
    return 'closeflow_pro';
  }
  if (subscriptionStatus === 'paid_active') return 'closeflow_pro';
  return PLAN_IDS.trial;
}

export function getCurrentBillingPlanName(displayPlanId: string, isPaidActive: boolean, isTrialActive: boolean) {
  if (isPaidActive) {
    const plan = BILLING_PLAN_OPTIONS.find((entry) => displayPlanId === entry.id || displayPlanId === `${entry.id}_yearly`);
    return plan?.name || 'Pro';
  }
  if (isTrialActive) return 'Free / trial';
  return 'Nie ustawiono';
}

export function isBillingPlanCurrent(displayPlanId: string, plan: BillingPlanCard, isPaidActive: boolean, isTrialActive: boolean) {
  if (plan.key === 'free') return !isPaidActive && (isTrialActive || displayPlanId === 'free');
  if (!isPaidActive) return false;
  return displayPlanId === plan.id || displayPlanId === `${plan.id}_yearly`;
}

export function getBillingPlanAvailability(displayPlanId: string, plan: BillingPlanCard, isPaidActive: boolean, isTrialActive: boolean): BillingPlanAvailability {
  if (isBillingPlanCurrent(displayPlanId, plan, isPaidActive, isTrialActive)) return 'current';
  if (!plan.checkoutKey) return plan.key === 'free' ? 'disabled' : 'soon';
  return 'available';
}

export function getBillingPlanStatusLabel(status: BillingPlanAvailability) {
  if (status === 'current') return 'Obecny';
  if (status === 'available') return 'Dostępny';
  if (status === 'soon') return 'Wkrótce';
  return 'Niedostępny';
}

export function getBillingSettlementStatusLabel(status?: string | null) {
  return BILLING_SETTLEMENT_STATUS_LABELS[String(status || 'not_started')] || 'Inny status';
}

export function getBillingLimitValue(item: BillingLimitItem, planKey: BillingPlanKey) {
  if (planKey === 'ai') return item.ai;
  if (planKey === 'pro') return item.pro;
  if (planKey === 'basic') return item.basic;
  return item.name === 'Leady' || item.name === 'Zadania' || item.name === 'Wydarzenia' ? 'Gotowe' : 'W przygotowaniu';
}

export function getBillingLimitTone(value: string) {
  if (value === 'Gotowe') return 'billing-limit-ok';
  if (value === 'Wymaga konfiguracji') return 'billing-limit-warn';
  if (value === 'Niedostępne w Twoim planie') return 'billing-limit-locked';
  return 'billing-limit-soon';
}
