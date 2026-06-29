export type ActivityEntityValue = 'lead' | 'case' | 'task' | 'event' | 'client' | 'system';
export type ActivitySourceFilterValue = 'all' | 'today' | 'calendar' | 'lead' | 'case' | 'other';
export type ActivityTypeFilterValue = 'all' | 'completed' | 'restored' | 'deleted' | 'created' | 'updated';
export type ActivityRelationFilterValue = 'all' | 'lead' | 'case' | 'none';
export type ActivityFilterValue = 'all' | 'today' | 'lead' | 'case' | 'task' | 'event' | 'system' | 'attention';
export type ActivityIconToneValue = 'success' | 'warning' | 'blue' | 'green' | 'amber' | 'sky' | 'neutral';
export type ActivitySeverityValue = 'warning' | undefined;

export type ActivityOption<TValue extends string> = {
  value: TValue;
  label: string;
};

export type ActivityRelationMeta = {
  type: string;
  label: string;
  href: string;
};

export const ACTIVITY_SOURCE_OPTIONS: readonly ActivityOption<ActivitySourceFilterValue>[] = [
  { value: 'all', label: 'Wszystko' },
  { value: 'today', label: 'Dziś' },
  { value: 'calendar', label: 'Kalendarz' },
  { value: 'lead', label: 'Lead' },
  { value: 'case', label: 'Sprawa' },
  { value: 'other', label: 'Inne' },
];

export const ACTIVITY_TYPE_OPTIONS: readonly ActivityOption<ActivityTypeFilterValue>[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'completed', label: 'Wykonane' },
  { value: 'restored', label: 'Przywrócone' },
  { value: 'deleted', label: 'Usunięte' },
  { value: 'created', label: 'Utworzone' },
  { value: 'updated', label: 'Aktualizacje' },
];

export const ACTIVITY_RELATION_OPTIONS: readonly ActivityOption<ActivityRelationFilterValue>[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'lead', label: 'Z leadem' },
  { value: 'case', label: 'Ze sprawą' },
  { value: 'none', label: 'Bez relacji' },
];

export const ACTIVITY_FILTER_OPTIONS: readonly ActivityOption<Exclude<ActivityFilterValue, 'attention'>>[] = [
  { value: 'all', label: 'Wszystko' },
  { value: 'today', label: 'Dzisiaj' },
  { value: 'lead', label: 'Leady' },
  { value: 'case', label: 'Sprawy' },
  { value: 'task', label: 'Zadania' },
  { value: 'event', label: 'Wydarzenia' },
  { value: 'system', label: 'Systemowe' },
];

export function normalizeActivityText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeActivityLower(value: unknown) {
  return normalizeActivityText(value).toLowerCase();
}

export function parseActivityDate(value: any) {
  if (!value) return null;

  if (typeof value?.toDate === 'function') {
    const firebaseDate = value.toDate();
    return Number.isNaN(firebaseDate?.getTime?.()) ? null : firebaseDate;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isSameActivityCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isActivityYesterday(value: Date, now: Date) {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameActivityCalendarDay(value, yesterday);
}

export function formatActivityTime(value: any) {
  const parsed = parseActivityDate(value);
  if (!parsed) return 'Brak daty';

  const now = new Date();
  const time = parsed.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

  if (isSameActivityCalendarDay(parsed, now)) return 'dzisiaj ' + time;
  if (isActivityYesterday(parsed, now)) return 'wczoraj ' + time;

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(parsed)
    .replace(/\./g, '');
}

export function getLeadDisplayName(record: any) {
  return (
    normalizeActivityText(record?.clientName) ||
    normalizeActivityText(record?.name) ||
    normalizeActivityText(record?.title) ||
    normalizeActivityText(record?.email) ||
    ''
  );
}

export function getCaseDisplayName(record: any) {
  return (
    normalizeActivityText(record?.title) ||
    normalizeActivityText(record?.clientName) ||
    normalizeActivityText(record?.type) ||
    ''
  );
}

export function buildLeadLookup(items: any[]) {
  const lookup = new Map<string, string>();
  for (const item of items || []) {
    const id = normalizeActivityText(item?.id);
    const label = getLeadDisplayName(item);
    if (id && label) lookup.set(id, label);
  }
  return lookup;
}

export function buildCaseLookup(items: any[]) {
  const lookup = new Map<string, string>();
  for (const item of items || []) {
    const id = normalizeActivityText(item?.id);
    const label = getCaseDisplayName(item);
    if (id && label) lookup.set(id, label);
  }
  return lookup;
}

export function getActivityActorLabel(activity: any) {
  return activity?.actorType === 'client' ? 'Klient' : 'Operator';
}

export function getActivityEntity(activity: any): ActivityEntityValue {
  const eventType = normalizeActivityLower(activity?.eventType);
  const payloadSource = normalizeActivityLower(activity?.payload?.source);
  const payloadType = normalizeActivityLower(activity?.payload?.type);

  if (eventType.includes('task') || payloadSource === 'task' || payloadType === 'task' || activity?.taskId) {
    return 'task';
  }

  if (
    eventType.includes('calendar') ||
    eventType.includes('event') ||
    payloadSource === 'calendar' ||
    payloadSource === 'event' ||
    payloadType === 'event' ||
    activity?.eventId
  ) {
    return 'event';
  }

  if (eventType.includes('lead') || payloadSource === 'lead' || activity?.leadId) {
    return 'lead';
  }

  if (eventType.includes('case') || payloadSource === 'case' || activity?.caseId) {
    return 'case';
  }

  if (
    eventType.includes('client') ||
    eventType.includes('customer') ||
    payloadSource === 'client' ||
    payloadSource === 'customer' ||
    activity?.clientId
  ) {
    return 'client';
  }

  return 'system';
}

export function getActivityPillLabel(activity: any) {
  switch (getActivityEntity(activity)) {
    case 'lead':
      return 'Lead';
    case 'case':
      return 'Sprawa';
    case 'task':
      return 'Zadanie';
    case 'event':
      return 'Wydarzenie';
    case 'client':
      return 'Klient';
    default:
      return 'System';
  }
}

export function getActivityIconTone(activity: any): ActivityIconToneValue {
  const eventType = normalizeActivityLower(activity?.eventType);
  const entity = getActivityEntity(activity);

  if (eventType.includes('complete') || eventType.includes('done')) return 'success';
  if (requiresActivityAttention(activity)) return 'warning';
  if (entity === 'lead') return 'blue';
  if (entity === 'case') return 'green';
  if (entity === 'task') return 'amber';
  if (entity === 'event') return 'sky';
  return 'neutral';
}

export function getActivityTitle(activity: any) {
  const eventType = normalizeActivityLower(activity?.eventType);
  const entity = getActivityEntity(activity);

  if (eventType === 'calendar_entry_completed') return 'Kalendarz: oznaczono wpis jako zrobiony';
  if (eventType === 'calendar_entry_restored') return 'Kalendarz: przywrócono wpis do pracy';
  if (eventType === 'calendar_entry_deleted') return 'Kalendarz: usunięto wpis';
  if (eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';
  if (eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';
  if (eventType === 'case_lifecycle_reopened') return 'Przywrócono sprawę do pracy';
  if (eventType === 'today_task_completed') return 'Dziś: oznaczono zadanie jako zrobione';
  if (eventType === 'today_task_restored') return 'Dziś: przywrócono zadanie do pracy';
  if (eventType === 'today_task_deleted') return 'Dziś: usunięto zadanie';
  if (eventType === 'today_task_snoozed') return 'odłożył zadanie z Dziś';
  if (eventType === 'today_event_completed') return 'Dziś: oznaczono wydarzenie jako zrobione';
  if (eventType === 'today_event_restored') return 'Dziś: przywrócono wydarzenie do pracy';
  if (eventType === 'today_event_deleted') return 'Dziś: usunięto wydarzenie';
  if (eventType === 'today_event_snoozed') return 'odłożył wydarzenie z Dziś';

  if (eventType.includes('note') && (eventType.includes('add') || eventType.includes('create'))) return 'Dodano notatkę';
  if (eventType.includes('status') && entity === 'lead') return 'Zmieniono status leada';
  if (eventType.includes('status') && entity === 'case') return 'Zmieniono status sprawy';
  if (eventType.includes('status')) return 'Zmieniono status';
  if (eventType.includes('complete') || eventType.includes('done')) return 'Oznaczono jako zrobione';
  if (eventType.includes('restore') || eventType.includes('reopen')) return 'Przywrócono do pracy';
  if (eventType.includes('snooz') || eventType.includes('reschedul') || eventType.includes('postpone')) return 'Przełożono termin';
  if (eventType.includes('reminder')) return 'Zaplanowano przypomnienie';
  if (eventType.includes('file') && eventType.includes('upload')) return 'Dodano plik';
  if (eventType.includes('decision')) return 'Zapisano decyzję';
  if (eventType.includes('delete') || eventType.includes('remove')) {
    if (entity === 'event') return 'Usunięto wydarzenie';
    if (entity === 'task') return 'Usunięto zadanie';
    if (entity === 'case') return 'Usunięto sprawę';
    if (entity === 'lead') return 'Usunięto leada';
    return 'Usunięto wpis';
  }
  if (eventType.includes('create') || eventType.includes('add') || eventType.includes('start')) {
    if (entity === 'event') return 'Dodano wydarzenie';
    if (entity === 'task') return 'Dodano zadanie';
    if (entity === 'case') return 'Utworzono sprawę';
    if (entity === 'lead') return 'Utworzono leada';
    if (entity === 'client') return 'Utworzono klienta';
    return 'Dodano wpis';
  }
  if (eventType.includes('update') || eventType.includes('change') || eventType.includes('edit')) {
    if (entity === 'event') return 'Zmieniono wydarzenie';
    if (entity === 'task') return 'Zmieniono zadanie';
    if (entity === 'case') return 'Zmieniono sprawę';
    if (entity === 'lead') return 'Zmieniono leada';
    if (entity === 'client') return 'Zmieniono klienta';
    return 'Zmieniono wpis';
  }

  if (entity === 'lead') return 'Aktywność leada';
  if (entity === 'case') return 'Aktywność sprawy';
  if (entity === 'task') return 'Aktywność zadania';
  if (entity === 'event') return 'Aktywność wydarzenia';
  if (entity === 'client') return 'Aktywność klienta';

  return 'Zapisano aktywność';
}

export function getActivityMetaText(activity: any) {
  const actor = getActivityActorLabel(activity);
  const payloadTitle = normalizeActivityText(activity?.payload?.title);
  const status = normalizeActivityText(activity?.payload?.status || activity?.payload?.nextStatus);
  const reason = normalizeActivityText(activity?.payload?.reason || activity?.payload?.note);
  const pieces = [actor];

  if (payloadTitle) pieces.push(payloadTitle);
  if (status) pieces.push('status: ' + status);
  if (reason) pieces.push(reason);

  return pieces.join(' • ');
}

export function getLeadContextLabel(activity: any, leadLookup: Map<string, string>) {
  const leadId = normalizeActivityText(activity?.leadId || activity?.payload?.leadId || activity?.payload?.lead_id);
  if (!leadId) return '';
  return (
    leadLookup.get(leadId) ||
    normalizeActivityText(activity?.payload?.leadName) ||
    normalizeActivityText(activity?.payload?.leadTitle) ||
    'Powiązany lead'
  );
}

export function getCaseContextLabel(activity: any, caseLookup: Map<string, string>) {
  const caseId = normalizeActivityText(activity?.caseId || activity?.payload?.caseId || activity?.payload?.case_id);
  if (!caseId) return '';
  return (
    caseLookup.get(caseId) ||
    normalizeActivityText(activity?.payload?.caseTitle) ||
    normalizeActivityText(activity?.payload?.caseName) ||
    'Powiązana sprawa'
  );
}

export function getActivityRelation(activity: any, leadLookup: Map<string, string>, caseLookup: Map<string, string>): ActivityRelationMeta {
  const leadId = normalizeActivityText(activity?.leadId || activity?.payload?.leadId || activity?.payload?.lead_id);
  const caseId = normalizeActivityText(activity?.caseId || activity?.payload?.caseId || activity?.payload?.case_id);
  const clientName = normalizeActivityText(activity?.payload?.clientName || activity?.payload?.customerName);
  const payloadTitle = normalizeActivityText(activity?.payload?.title);
  const entity = getActivityEntity(activity);

  if (leadId) {
    return {
      type: 'Lead',
      label: getLeadContextLabel(activity, leadLookup),
      href: '/leads/' + leadId,
    };
  }

  if (caseId) {
    return {
      type: 'Sprawa',
      label: getCaseContextLabel(activity, caseLookup),
      href: '/cases/' + caseId,
    };
  }

  if (clientName) {
    return {
      type: 'Klient',
      label: clientName,
      href: '',
    };
  }

  if (entity === 'task' && payloadTitle) {
    return {
      type: 'Zadanie',
      label: payloadTitle,
      href: '',
    };
  }

  if (entity === 'event' && payloadTitle) {
    return {
      type: 'Wydarzenie',
      label: payloadTitle,
      href: '',
    };
  }

  return {
    type: '',
    label: 'Bez powiązania',
    href: '',
  };
}

export function getActivitySearchText(activity: any, leadLookup: Map<string, string>, caseLookup: Map<string, string>) {
  const relation = getActivityRelation(activity, leadLookup, caseLookup);
  return [
    getActivityActorLabel(activity),
    getActivityTitle(activity),
    getActivityMetaText(activity),
    getActivityPillLabel(activity),
    relation.type,
    relation.label,
    normalizeActivityText(activity?.eventType),
    normalizeActivityText(activity?.payload?.title),
    normalizeActivityText(activity?.payload?.clientName),
    normalizeActivityText(activity?.payload?.leadName),
    normalizeActivityText(activity?.payload?.caseTitle),
    normalizeActivityText(activity?.payload?.note),
  ]
    .join(' ')
    .toLowerCase();
}

export function isActivityToday(activity: any) {
  const parsed = parseActivityDate(activity?.createdAt || activity?.happenedAt || activity?.updatedAt);
  return parsed ? isSameActivityCalendarDay(parsed, new Date()) : false;
}

export function getActivitySource(activity: any): ActivitySourceFilterValue {
  const eventType = normalizeActivityLower(activity?.eventType);
  const payloadSource = normalizeActivityLower(activity?.payload?.source);

  if (eventType.startsWith('today_') || payloadSource === 'today') return 'today';
  if (eventType.startsWith('calendar_') || payloadSource === 'calendar') return 'calendar';

  const entity = getActivityEntity(activity);
  if (entity === 'lead') return 'lead';
  if (entity === 'case') return 'case';

  return 'other';
}

export function getActivityType(activity: any): ActivityTypeFilterValue {
  const eventType = normalizeActivityLower(activity?.eventType);

  if (eventType.includes('completed') || eventType.includes('done')) return 'completed';
  if (eventType.includes('restored') || eventType.includes('reopen')) return 'restored';
  if (eventType.includes('deleted') || eventType.includes('removed')) return 'deleted';
  if (eventType.includes('created') || eventType.includes('create') || eventType.includes('added') || eventType.includes('add')) return 'created';
  if (eventType.includes('updated') || eventType.includes('update') || eventType.includes('change') || eventType.includes('edit')) return 'updated';

  return 'all';
}

export function getActivityRelationKind(activity: any): ActivityRelationFilterValue {
  const leadId = normalizeActivityText(activity?.leadId || activity?.payload?.leadId || activity?.payload?.lead_id);
  const caseId = normalizeActivityText(activity?.caseId || activity?.payload?.caseId || activity?.payload?.case_id);
  if (leadId) return 'lead';
  if (caseId) return 'case';
  return 'none';
}

export function requiresActivityAttention(activity: any) {
  const eventType = normalizeActivityLower(activity?.eventType);
  const payloadStatus = normalizeActivityLower(activity?.payload?.status || activity?.payload?.nextStatus);
  const payloadFlag = activity?.payload?.requiresAttention || activity?.payload?.attentionRequired;

  return Boolean(
    payloadFlag ||
      eventType.includes('failed') ||
      eventType.includes('error') ||
      eventType.includes('blocked') ||
      eventType.includes('overdue') ||
      eventType.includes('stale') ||
      eventType.includes('missing') ||
      payloadStatus.includes('blocked') ||
      payloadStatus.includes('zaleg'),
  );
}

export function getActivitySeverity(activity: any): ActivitySeverityValue {
  return requiresActivityAttention(activity) ? 'warning' : undefined;
}

export function shouldShowActivityByFilter(activity: any, filter: string) {
  if (filter === 'all') return true;
  if (filter === 'today') return isActivityToday(activity);
  if (filter === 'attention') return requiresActivityAttention(activity);
  if (filter === 'system') return getActivityEntity(activity) === 'system' || getActivityEntity(activity) === 'client';
  return getActivityEntity(activity) === filter;
}
