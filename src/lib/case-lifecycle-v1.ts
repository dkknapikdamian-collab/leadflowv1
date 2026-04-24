export type CaseLifecycleItemV1 = {
  id?: string;
  title?: string;
  status?: string;
  isRequired?: boolean;
  dueDate?: string | null;
};

export type CaseLifecycleActionV1 = {
  id?: string;
  title?: string;
  status?: string;
  scheduledAt?: string | null;
  startAt?: string | null;
  dueAt?: string | null;
  date?: string | null;
};

export type CaseLifecycleInputV1 = {
  status?: string;
  items?: CaseLifecycleItemV1[];
  tasks?: CaseLifecycleActionV1[];
  events?: CaseLifecycleActionV1[];
  now?: string | Date;
};

export type CaseLifecycleBucketV1 =
  | 'blocked'
  | 'waiting_approval'
  | 'ready_to_start'
  | 'in_progress'
  | 'completed'
  | 'needs_next_step';

export type CaseLifecycleResultV1 = {
  bucket: CaseLifecycleBucketV1;
  label: string;
  headline: string;
  nextOperatorAction: string;
  riskLevel: 'low' | 'medium' | 'high';
  completenessPercent: number;
  missingRequiredCount: number;
  waitingApprovalCount: number;
  openActionCount: number;
  hasNextStep: boolean;
};

function normalizeStatus(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isOpenAction(action: CaseLifecycleActionV1) {
  const status = normalizeStatus(action.status);
  return !['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(status);
}

function hasActionDate(action: CaseLifecycleActionV1) {
  return Boolean(action.scheduledAt || action.startAt || action.dueAt || action.date);
}

function countAccepted(items: CaseLifecycleItemV1[]) {
  return items.filter((item) => normalizeStatus(item.status) === 'accepted').length;
}

function countMissingRequired(items: CaseLifecycleItemV1[]) {
  return items.filter((item) => {
    const status = normalizeStatus(item.status);
    return item.isRequired !== false && ['missing', 'rejected', ''].includes(status);
  }).length;
}

function countWaitingApproval(items: CaseLifecycleItemV1[]) {
  return items.filter((item) => normalizeStatus(item.status) === 'uploaded').length;
}

function computeCompleteness(items: CaseLifecycleItemV1[]) {
  if (!items.length) return 0;
  return Math.round((countAccepted(items) / items.length) * 100);
}

export function resolveCaseLifecycleV1(input: CaseLifecycleInputV1): CaseLifecycleResultV1 {
  const items = input.items || [];
  const actions = [...(input.tasks || []), ...(input.events || [])];
  const openActionCount = actions.filter(isOpenAction).length;
  const hasNextStep = actions.some((action) => isOpenAction(action) && hasActionDate(action));
  const status = normalizeStatus(input.status || '');
  const completenessPercent = computeCompleteness(items);
  const missingRequiredCount = countMissingRequired(items);
  const waitingApprovalCount = countWaitingApproval(items);

  if (status === 'completed') {
    return {
      bucket: 'completed',
      label: 'Zakończona',
      headline: 'Sprawa jest zakończona.',
      nextOperatorAction: 'Nie wymaga akcji, chyba że trzeba ją przywrócić do pracy.',
      riskLevel: 'low',
      completenessPercent,
      missingRequiredCount,
      waitingApprovalCount,
      openActionCount,
      hasNextStep,
    };
  }

  if (status === 'in_progress') {
    return {
      bucket: hasNextStep ? 'in_progress' : 'needs_next_step',
      label: hasNextStep ? 'W realizacji' : 'Brak kolejnego kroku',
      headline: hasNextStep ? 'Sprawa jest w realizacji i ma kolejny krok.' : 'Sprawa jest w realizacji, ale nie ma kolejnego kroku.',
      nextOperatorAction: hasNextStep ? 'Kontynuuj według najbliższego zadania albo wydarzenia.' : 'Dodaj zadanie albo wydarzenie, żeby sprawa nie wisiała w próżni.',
      riskLevel: hasNextStep ? 'low' : 'medium',
      completenessPercent,
      missingRequiredCount,
      waitingApprovalCount,
      openActionCount,
      hasNextStep,
    };
  }

  if (missingRequiredCount > 0 || status === 'blocked' || status === 'waiting_on_client') {
    return {
      bucket: 'blocked',
      label: 'Zablokowana',
      headline: 'Brakuje wymaganych rzeczy od klienta albo sprawa czeka na klienta.',
      nextOperatorAction: 'Poproś klienta o brakujące elementy i ustaw przypomnienie.',
      riskLevel: 'high',
      completenessPercent,
      missingRequiredCount,
      waitingApprovalCount,
      openActionCount,
      hasNextStep,
    };
  }

  if (waitingApprovalCount > 0 || status === 'to_approve') {
    return {
      bucket: 'waiting_approval',
      label: 'Do akceptacji',
      headline: 'Coś przyszło od klienta i czeka na sprawdzenie.',
      nextOperatorAction: 'Sprawdź elementy do akceptacji i zaakceptuj albo odrzuć.',
      riskLevel: 'medium',
      completenessPercent,
      missingRequiredCount,
      waitingApprovalCount,
      openActionCount,
      hasNextStep,
    };
  }

  if (status === 'ready_to_start' || completenessPercent === 100) {
    return {
      bucket: 'ready_to_start',
      label: 'Gotowa do startu',
      headline: 'Wymagane rzeczy są domknięte. Można rozpocząć realizację.',
      nextOperatorAction: 'Kliknij start realizacji albo dodaj pierwszy krok operacyjny.',
      riskLevel: hasNextStep ? 'low' : 'medium',
      completenessPercent,
      missingRequiredCount,
      waitingApprovalCount,
      openActionCount,
      hasNextStep,
    };
  }

  return {
    bucket: hasNextStep ? 'in_progress' : 'needs_next_step',
    label: hasNextStep ? 'W toku' : 'Brak kolejnego kroku',
    headline: hasNextStep ? 'Sprawa ma aktywny krok operacyjny.' : 'Sprawa nie ma jasnego następnego kroku.',
    nextOperatorAction: hasNextStep ? 'Realizuj najbliższą akcję.' : 'Dodaj zadanie, wydarzenie albo świadomie zamknij temat.',
    riskLevel: hasNextStep ? 'low' : 'medium',
    completenessPercent,
    missingRequiredCount,
    waitingApprovalCount,
    openActionCount,
    hasNextStep,
  };
}
