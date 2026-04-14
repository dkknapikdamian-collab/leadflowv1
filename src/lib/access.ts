import { differenceInCalendarDays, isAfter, parseISO } from 'date-fns';

export type WorkspaceAccessState =
  | 'inactive'
  | 'trial_active'
  | 'trial_ending'
  | 'trial_expired'
  | 'paid_active'
  | 'payment_failed'
  | 'canceled';

export type WorkspaceLike = {
  subscriptionStatus?: string | null;
  trialEndsAt?: string | null;
  planId?: string | null;
};

export type WorkspaceAccessMeta = {
  state: WorkspaceAccessState;
  hasWriteAccess: boolean;
  badgeLabel: string;
  summary: string;
  blockedReason: string;
  tone: 'default' | 'warning' | 'danger' | 'success';
  daysLeft: number | null;
};

function parseDate(value?: string | null) {
  if (!value) return null;
  try {
    return parseISO(value);
  } catch {
    return null;
  }
}

export function resolveWorkspaceAccessState(workspace?: WorkspaceLike | null): WorkspaceAccessState {
  if (!workspace) return 'inactive';

  const status = workspace.subscriptionStatus;
  if (status === 'paid_active') return 'paid_active';
  if (status === 'payment_failed') return 'payment_failed';
  if (status === 'canceled') return 'canceled';

  if (status === 'trial_active') {
    const trialEndsAt = parseDate(workspace.trialEndsAt);
    if (!trialEndsAt) return 'trial_expired';
    if (!isAfter(trialEndsAt, new Date())) return 'trial_expired';

    const daysLeft = Math.max(0, differenceInCalendarDays(trialEndsAt, new Date()));
    return daysLeft <= 2 ? 'trial_ending' : 'trial_active';
  }

  return 'inactive';
}

export function buildWorkspaceAccessMeta(workspace?: WorkspaceLike | null): WorkspaceAccessMeta {
  const state = resolveWorkspaceAccessState(workspace);
  const trialEndsAt = parseDate(workspace?.trialEndsAt);
  const daysLeft = trialEndsAt ? Math.max(0, differenceInCalendarDays(trialEndsAt, new Date())) : null;

  switch (state) {
    case 'paid_active':
      return {
        state,
        hasWriteAccess: true,
        badgeLabel: workspace?.planId ? `Plan ${workspace.planId}` : 'Plan aktywny',
        summary: 'Dostęp jest aktywny. Możesz normalnie prowadzić leady, sprawy i portal klienta.',
        blockedReason: 'Dostęp jest aktywny.',
        tone: 'success',
        daysLeft: null,
      };
    case 'trial_active':
      return {
        state,
        hasWriteAccess: true,
        badgeLabel: `Trial ${daysLeft ?? 0} dni`,
        summary: `Trial działa normalnie. Zostało jeszcze ${daysLeft ?? 0} dni pełnego dostępu.`,
        blockedReason: 'Trial jest aktywny.',
        tone: 'default',
        daysLeft,
      };
    case 'trial_ending':
      return {
        state,
        hasWriteAccess: true,
        badgeLabel: `Trial ${daysLeft ?? 0} dni`,
        summary: `Trial kończy się zaraz. Zostało ${daysLeft ?? 0} dni, więc warto już teraz dopiąć plan.`,
        blockedReason: 'Trial jest jeszcze aktywny, ale kończy się za moment.',
        tone: 'warning',
        daysLeft,
      };
    case 'trial_expired':
      return {
        state,
        hasWriteAccess: false,
        badgeLabel: 'Trial wygasł',
        summary: 'Możesz oglądać dane, ale zapis nowych rzeczy i zmiany w procesie są zablokowane do wznowienia planu.',
        blockedReason: 'Trial wygasł. Wznów plan, aby znowu zapisywać leady, zadania, wydarzenia i sprawy.',
        tone: 'danger',
        daysLeft: 0,
      };
    case 'payment_failed':
      return {
        state,
        hasWriteAccess: false,
        badgeLabel: 'Problem z płatnością',
        summary: 'Plan nie odnowił się poprawnie. Podgląd działa, ale zapis rekordów i zmiany procesu są zablokowane.',
        blockedReason: 'Płatność nie przeszła. Napraw rozliczenie, aby odblokować zapis i dalszą pracę.',
        tone: 'danger',
        daysLeft: null,
      };
    case 'canceled':
      return {
        state,
        hasWriteAccess: false,
        badgeLabel: 'Plan anulowany',
        summary: 'Plan jest anulowany. Zostawiamy podgląd danych, ale blokujemy ruch operacyjny do czasu wznowienia.',
        blockedReason: 'Plan został anulowany. Wznów subskrypcję, aby odblokować prowadzenie klientów.',
        tone: 'warning',
        daysLeft: null,
      };
    default:
      return {
        state: 'inactive',
        hasWriteAccess: false,
        badgeLabel: 'Brak dostępu',
        summary: 'Workspace nie ma aktywnego planu ani trialu.',
        blockedReason: 'Brak aktywnego dostępu. Włącz trial albo plan, aby korzystać z zapisu.',
        tone: 'danger',
        daysLeft: null,
      };
  }
}

export function getWriteLockMessage(workspace?: WorkspaceLike | null) {
  return buildWorkspaceAccessMeta(workspace).blockedReason;
}

export function hasWorkspaceWriteAccess(workspace?: WorkspaceLike | null) {
  return buildWorkspaceAccessMeta(workspace).hasWriteAccess;
}
