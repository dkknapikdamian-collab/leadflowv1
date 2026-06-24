import { isClosedWorkItemStatus } from '../work-items/planned-actions';

const STAGE_A35B_MANDATORY_NEXT_STEP_CONTRACT = 'STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT: next step may come from task, event, follow_up or existing nextActionAt fallback';
void STAGE_A35B_MANDATORY_NEXT_STEP_CONTRACT;

export type NextMoveStatus = 'missing' | 'overdue' | 'today' | 'planned' | 'closed';

export type NextMoveSeverity = 'none' | 'low' | 'medium' | 'high';

export type NextMoveContract = {
  status: NextMoveStatus;
  severity: NextMoveSeverity;
  label: string;
  reason: string;
  nextMoveAt: string | null;
  nextMoveTitle: string | null;
  nextMoveType: 'task' | 'event' | 'follow_up' | 'manual' | null;
  isMissing: boolean;
  isOverdue: boolean;
  isToday: boolean;
  isPlanned: boolean;
  isClosed: boolean;
};

export type BuildNextMoveContractInput = {
  entityType: 'lead' | 'case' | 'client';
  entityId: string;
  status?: string | null;
  nearestAction?: {
    when?: string | null;
    title?: string | null;
    type?: string | null;
    status?: string | null;
  } | null;
  now?: Date;
};

const STAGE223_NEXT_MOVE_CONTRACT = 'one contract for missing, overdue, today, planned and closed next move';
void STAGE223_NEXT_MOVE_CONTRACT;

function normalizeActionType(value: unknown): 'task' | 'event' | 'follow_up' | 'manual' | null {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'task' || normalized === 'event') return normalized;
  if (normalized === 'follow_up' || normalized === 'follow-up' || normalized === 'followup') return 'follow_up';
  if (normalized === 'meeting') return 'event';
  if (normalized === 'manual') return 'manual';
  return normalized ? 'manual' : null;
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isClosedRecordStatus(status: unknown) {
  const normalized = String(status || '').trim().toLowerCase();
  return ['won', 'lost', 'closed', 'archived', 'done', 'completed', 'cancelled', 'canceled', 'moved_to_service'].includes(normalized);
}

function missingLabel(entityType: BuildNextMoveContractInput['entityType']) {
  if (entityType === 'case') return 'Brak następnego ruchu';
  if (entityType === 'client') return 'Brak następnej akcji';
  return 'Brak następnej akcji';
}

function buildContract(status: NextMoveStatus, input: {
  entityType: BuildNextMoveContractInput['entityType'];
  label: string;
  reason: string;
  severity: NextMoveSeverity;
  nextMoveAt?: string | null;
  nextMoveTitle?: string | null;
  nextMoveType?: 'task' | 'event' | 'follow_up' | 'manual' | null;
}): NextMoveContract {
  return {
    status,
    severity: input.severity,
    label: input.label,
    reason: input.reason,
    nextMoveAt: input.nextMoveAt || null,
    nextMoveTitle: input.nextMoveTitle || null,
    nextMoveType: input.nextMoveType || null,
    isMissing: status === 'missing',
    isOverdue: status === 'overdue',
    isToday: status === 'today',
    isPlanned: status === 'planned',
    isClosed: status === 'closed',
  };
}

export function buildNextMoveContract(input: BuildNextMoveContractInput): NextMoveContract {
  const now = input.now || new Date();
  const action = input.nearestAction || null;

  if (isClosedRecordStatus(input.status)) {
    return buildContract('closed', {
      entityType: input.entityType,
      label: 'Temat zamknięty',
      reason: 'Rekord ma status zamknięty, więc nie wymaga następnego ruchu.',
      severity: 'none',
    });
  }

  if (!action || isClosedWorkItemStatus(action.status)) {
    return buildContract('missing', {
      entityType: input.entityType,
      label: missingLabel(input.entityType),
      reason: input.entityType === 'case'
        ? 'Sprawa nie ma najbliższego zaplanowanego ruchu.'
        : 'Rekord nie ma najbliższej zaplanowanej akcji.',
      severity: 'medium',
    });
  }

  const when = action.when || null;
  const parsed = parseDate(when);
  const nextMoveTitle = action.title || 'Następny ruch';
  const nextMoveType = normalizeActionType(action.type);

  if (!parsed) {
    return buildContract('missing', {
      entityType: input.entityType,
      label: missingLabel(input.entityType),
      reason: 'Najbliższy ruch istnieje, ale nie ma poprawnej daty.',
      severity: 'medium',
      nextMoveTitle,
      nextMoveType,
    });
  }

  const today = startOfDay(now).getTime();
  const actionDay = startOfDay(parsed).getTime();

  if (parsed.getTime() < now.getTime() && actionDay < today) {
    return buildContract('overdue', {
      entityType: input.entityType,
      label: 'Następny ruch zaległy',
      reason: 'Najbliższy ruch ma termin w przeszłości.',
      severity: 'high',
      nextMoveAt: parsed.toISOString(),
      nextMoveTitle,
      nextMoveType,
    });
  }

  if (actionDay === today) {
    return buildContract('today', {
      entityType: input.entityType,
      label: 'Następny ruch dziś',
      reason: 'Najbliższy ruch jest zaplanowany na dziś.',
      severity: 'low',
      nextMoveAt: parsed.toISOString(),
      nextMoveTitle,
      nextMoveType,
    });
  }

  return buildContract('planned', {
    entityType: input.entityType,
    label: 'Następny ruch zaplanowany',
    reason: 'Rekord ma zaplanowany kolejny ruch.',
    severity: 'none',
    nextMoveAt: parsed.toISOString(),
    nextMoveTitle,
    nextMoveType,
  });
}
