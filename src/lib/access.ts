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
  | 'free_active'
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

const TRIAL_LENGTH_DAYS = 21;

function parseAccessDate(value?: string | null) {
  if (!value) return null;

  try {
    const date = parseISO(value);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

function isBillingDateExpired(value?: string | null) {
  const date = parseAccessDate(value);
  if (!date) return false;
  return date.getTime() < Date.now();
}

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
    headline: 'Trial wygasl',
    description: 'Podglad danych nadal dziala, ale tworzenie nowych rekordow jest zablokowane do czasu aktywacji CloseFlow Pro.',
    badgeLabel: 'Trial wygasl',
    sidebarLabel: 'Trial wygasl',
    toneClassName: 'text-rose-500 bg-rose-500/10',
    chipClassName: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
    ctaLabel: 'Aktywuj plan',
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
    headline: 'Trial zaraz sie konczy',
    description: `Do konca testu zostalo ${trialDaysLeft} ${trialDaysLeft === 1 ? 'dzien' : 'dni'}. To dobry moment, zeby aktywowac CloseFlow Pro i nie przerwac sobie pracy w polowie.`,
    badgeLabel: `Trial ${trialDaysLeft} dni`,
    sidebarLabel: `${trialDaysLeft} dni trialu`,
    toneClassName: 'text-amber-500 bg-amber-500/10',
    chipClassName: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
    ctaLabel: 'Aktywuj plan',
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
    if (isBillingDateExpired(workspace?.nextBillingAt)) {
      return {
        status: 'payment_failed',
        hasAccess: false,
        trialDaysLeft,
        trialProgressPercent,
        headline: 'Platnosc wymaga reakcji',
        description: 'Oplacony okres dostepu minal. Mozesz dalej przegladac dane, ale tworzenie i edycja rekordow sa zablokowane do czasu odnowienia platnosci.',
        badgeLabel: 'Platnosc wymagana',
        sidebarLabel: 'Platnosc wymagana',
        toneClassName: 'text-rose-500 bg-rose-500/10',
        chipClassName: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
        ctaLabel: 'Odnów plan',
        isTrialActive: false,
        isPaidActive: false,
      };
    }

    return {
      status: 'paid_active',
      hasAccess: true,
      trialDaysLeft,
      trialProgressPercent,
      headline: 'Plan jest aktywny',
      description: 'Masz aktywny plan CloseFlow Pro.',
      badgeLabel: 'Plan aktywny',
      sidebarLabel: 'Plan aktywny',
      toneClassName: 'text-emerald-500 bg-emerald-500/10',
      chipClassName: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
      ctaLabel: 'Zobacz plan',
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
      headline: 'Platnosc wymaga reakcji',
      description: 'Dostep jest wstrzymany. Mozesz dalej przegladac dane, ale tworzenie i edycja rekordow sa zablokowane do czasu wznowienia planu.',
      badgeLabel: 'Platnosc nieudana',
      sidebarLabel: 'Platnosc nieudana',
      toneClassName: 'text-rose-500 bg-rose-500/10',
      chipClassName: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
      ctaLabel: 'Wznow plan',
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
      headline: 'Plan jest wylaczony',
      description: 'Workspace zostal przelaczony na stan bez aktywnej subskrypcji. Dane zostaja, ale tworzenie nowych rzeczy jest zablokowane.',
      badgeLabel: 'Plan wylaczony',
      sidebarLabel: 'Plan wylaczony',
      toneClassName: 'text-slate-500 bg-slate-500/10',
      chipClassName: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
      ctaLabel: 'Aktywuj ponownie',
      isTrialActive: false,
      isPaidActive: false,
    };
  }

  if (rawStatus === 'free_active') {
    return {
      status: 'free_active',
      hasAccess: true,
      trialDaysLeft,
      trialProgressPercent,
      headline: 'Tryb Free aktywny',
      description: 'Masz tryb demo z limitami. Podglad i podstawowe akcje dzialaja, ale AI i czesc funkcji premium sa zablokowane.',
      badgeLabel: 'Free',
      sidebarLabel: 'Free',
      toneClassName: 'text-sky-500 bg-sky-500/10',
      chipClassName: 'bg-sky-500/12 text-sky-600 dark:text-sky-400',
      ctaLabel: 'Przejdz na plan',
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
      headline: 'Jestes w okresie probnym',
      description: `Masz jeszcze ${trialDaysLeft} dni testu. Wszystkie glowne moduly sa odblokowane, wiec mozesz spokojnie sprawdzic caly workflow przed przejsciem na CloseFlow Pro.`,
      badgeLabel: `Trial ${trialDaysLeft} dni`,
      sidebarLabel: `${trialDaysLeft} dni trialu`,
      toneClassName: 'text-amber-500 bg-amber-500/10',
      chipClassName: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
      ctaLabel: 'Zobacz plan',
      isTrialActive: true,
      isPaidActive: false,
    };
  }

  return {
    status: 'inactive',
    hasAccess: false,
    trialDaysLeft,
    trialProgressPercent,
    headline: 'Dostep nie jest aktywny',
    description: 'Workspace nie ma jeszcze aktywnego trialu ani planu. Mozesz wejsc do billing i uruchomic dostep do CloseFlow Pro.',
    badgeLabel: 'Brak dostepu',
    sidebarLabel: 'Brak dostepu',
    toneClassName: 'text-slate-500 bg-slate-500/10',
    chipClassName: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
    ctaLabel: 'Uruchom trial',
    isTrialActive: false,
    isPaidActive: false,
  };
}
