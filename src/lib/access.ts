import { differenceInCalendarDays, isValid, parseISO } from 'date-fns';

export type WorkspaceLike = {
  subscriptionStatus?: string | null;
  trialEndsAt?: string | null;
  planId?: string | null;
  billingProvider?: string | null;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  nextBillingAt?: string | null;
  cancelAtPeriodEnd?: boolean | null;
  dailyDigestEnabled?: boolean | null;
  dailyDigestHour?: number | null;
  dailyDigestTimezone?: string | null;
  dailyDigestRecipientEmail?: string | null;
  timezone?: string | null;
};

export type AccessState =
  | 'trial_active'
  | 'trial_ending'
  | 'trial_expired'
  | 'paid_active'
  | 'payment_failed'
  | 'canceled'
  | 'inactive';

export type AccessSummary = {
  status: AccessState;
  hasAccess: boolean;
  trialDaysLeft: number;
  trialProgressPercent: number;
  headline: string;
  description: string;
  badgeLabel: string;
  sidebarLabel: string;
  toneClassName: string;
  chipClassName: string;
  ctaLabel: string;
  isTrialActive: boolean;
  isPaidActive: boolean;
};

const TRIAL_LENGTH_DAYS = 14;

function parseTrialEnd(value?: string | null) {
  if (!value) return null;

  try {
    const date = parseISO(value);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

function buildTrialExpiredSummary(): AccessSummary {
  return {
    status: 'trial_expired',
    hasAccess: false,
    trialDaysLeft: 0,
    trialProgressPercent: 6,
    headline: 'Trial wygasł',
    description: 'Podgląd danych nadal działa, ale tworzenie nowych leadów, spraw, tasków i wydarzeń jest zablokowane do czasu aktywacji planu.',
    badgeLabel: 'Trial wygasł',
    sidebarLabel: 'Trial wygasł',
    toneClassName: 'text-rose-500 bg-rose-500/10',
    chipClassName: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
    ctaLabel: 'Wybierz plan',
    isTrialActive: false,
    isPaidActive: false,
  };
}

function buildTrialEndingSummary(trialDaysLeft: number, trialProgressPercent: number): AccessSummary {
  return {
    status: 'trial_ending',
    hasAccess: true,
    trialDaysLeft,
    trialProgressPercent,
    headline: 'Trial zaraz się kończy',
    description: `Do końca testu zostało ${trialDaysLeft} ${trialDaysLeft === 1 ? 'dzień' : 'dni'}. To dobry moment, żeby włączyć plan i nie urwać sobie pracy w połowie.`,
    badgeLabel: `Trial ${trialDaysLeft} dni`,
    sidebarLabel: `${trialDaysLeft} dni trialu`,
    toneClassName: 'text-amber-500 bg-amber-500/10',
    chipClassName: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
    ctaLabel: 'Włącz plan',
    isTrialActive: true,
    isPaidActive: false,
  };
}

export function getAccessSummary(workspace?: WorkspaceLike | null): AccessSummary {
  const trialEnd = parseTrialEnd(workspace?.trialEndsAt);
  const rawStatus = workspace?.subscriptionStatus ?? 'inactive';
  const trialDaysLeft = trialEnd ? Math.max(0, differenceInCalendarDays(trialEnd, new Date())) : 0;
  const trialProgressPercent = trialEnd
    ? Math.max(6, Math.min(100, Math.round((trialDaysLeft / TRIAL_LENGTH_DAYS) * 100)))
    : 0;

  if (rawStatus === 'paid_active') {
    return {
      status: 'paid_active',
      hasAccess: true,
      trialDaysLeft,
      trialProgressPercent,
      headline: 'Dostęp jest aktywny',
      description: 'Plan płatny działa normalnie i nie blokuje tworzenia nowych rekordów ani operacji na leadach i sprawach.',
      badgeLabel: 'Plan aktywny',
      sidebarLabel: 'Plan aktywny',
      toneClassName: 'text-emerald-500 bg-emerald-500/10',
      chipClassName: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
      ctaLabel: 'Zarządzaj planem',
      isTrialActive: false,
      isPaidActive: true,
    };
  }

  if (rawStatus === 'payment_failed') {
    return {
      status: 'payment_failed',
      hasAccess: false,
      trialDaysLeft,
      trialProgressPercent,
      headline: 'Płatność wymaga reakcji',
      description: 'Dostęp jest wstrzymany. Możesz dalej przeglądać dane, ale tworzenie i edycja rekordów są zablokowane do czasu wznowienia planu.',
      badgeLabel: 'Płatność nieudana',
      sidebarLabel: 'Płatność nieudana',
      toneClassName: 'text-rose-500 bg-rose-500/10',
      chipClassName: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
      ctaLabel: 'Wznów plan',
      isTrialActive: false,
      isPaidActive: false,
    };
  }

  if (rawStatus === 'canceled') {
    return {
      status: 'canceled',
      hasAccess: false,
      trialDaysLeft,
      trialProgressPercent,
      headline: 'Plan jest wyłączony',
      description: 'Workspace został przełączony na stan bez aktywnej subskrypcji. Dane zostają, ale tworzenie nowych rzeczy jest zablokowane.',
      badgeLabel: 'Plan wyłączony',
      sidebarLabel: 'Plan wyłączony',
      toneClassName: 'text-slate-500 bg-slate-500/10',
      chipClassName: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
      ctaLabel: 'Aktywuj ponownie',
      isTrialActive: false,
      isPaidActive: false,
    };
  }

  if (rawStatus === 'trial_ending') {
    if (!trialEnd || trialDaysLeft <= 0) {
      return buildTrialExpiredSummary();
    }

    return buildTrialEndingSummary(trialDaysLeft, trialProgressPercent);
  }

  if (rawStatus === 'trial_active') {
    if (!trialEnd || trialDaysLeft <= 0) {
      return buildTrialExpiredSummary();
    }

    if (trialDaysLeft <= 2) {
      return buildTrialEndingSummary(trialDaysLeft, trialProgressPercent);
    }

    return {
      status: 'trial_active',
      hasAccess: true,
      trialDaysLeft,
      trialProgressPercent,
      headline: 'Jesteś w okresie próbnym',
      description: `Masz jeszcze ${trialDaysLeft} dni testu. Wszystkie główne moduły są odblokowane, więc możesz normalnie przetestować cały przepływ lead -> case -> portal.`,
      badgeLabel: `Trial ${trialDaysLeft} dni`,
      sidebarLabel: `${trialDaysLeft} dni trialu`,
      toneClassName: 'text-amber-500 bg-amber-500/10',
      chipClassName: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
      ctaLabel: 'Porównaj plany',
      isTrialActive: true,
      isPaidActive: false,
    };
  }

  return {
    status: 'inactive',
    hasAccess: false,
    trialDaysLeft,
    trialProgressPercent,
    headline: 'Dostęp nie jest aktywny',
    description: 'Workspace nie ma jeszcze aktywnego trialu ani planu. Możesz wejść do rozliczeń i uruchomić dostęp.',
    badgeLabel: 'Brak dostępu',
    sidebarLabel: 'Brak dostępu',
    toneClassName: 'text-slate-500 bg-slate-500/10',
    chipClassName: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
    ctaLabel: 'Aktywuj dostęp',
    isTrialActive: false,
    isPaidActive: false,
  };
}
