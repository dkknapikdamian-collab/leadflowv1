import Layout from '../components/Layout';
import '../styles/visual-stage8-activity-vnext.css';
import '../styles/hotfix-right-rail-dark-wrappers.css';
import {
  ArrowUpRight,
  Bell,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Link2,
  ListChecks,
  Loader2,
  Search,
  Target,
  UserRound,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchLeadsFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase-fallback';
import { toast } from 'sonner';
import { useWorkspace } from '../hooks/useWorkspace';

const sourceOptions = [
  { value: 'all', label: 'Wszystko' },
  { value: 'today', label: 'Dziś' },
  { value: 'calendar', label: 'Kalendarz' },
  { value: 'lead', label: 'Lead' },
  { value: 'case', label: 'Sprawa' },
  { value: 'other', label: 'Inne' },
];

const activityTypeOptions = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'completed', label: 'Wykonane' },
  { value: 'restored', label: 'Przywrócone' },
  { value: 'deleted', label: 'Usunięte' },
  { value: 'created', label: 'Utworzone' },
  { value: 'updated', label: 'Aktualizacje' },
];

const relationOptions = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'lead', label: 'Z leadem' },
  { value: 'case', label: 'Ze sprawą' },
  { value: 'none', label: 'Bez relacji' },
];

const activityFilters = [
  { value: 'all', label: 'Wszystko' },
  { value: 'today', label: 'Dzisiaj' },
  { value: 'lead', label: 'Leady' },
  { value: 'case', label: 'Sprawy' },
  { value: 'task', label: 'Zadania' },
  { value: 'event', label: 'Wydarzenia' },
  { value: 'system', label: 'Systemowe' },
];

function normalizeText(value: any) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeLower(value: any) {
  return normalizeText(value).toLowerCase();
}

function parseActivityDate(value: any) {
  if (!value) return null;

  if (typeof value?.toDate === 'function') {
    const firebaseDate = value.toDate();
    return Number.isNaN(firebaseDate?.getTime?.()) ? null : firebaseDate;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(value: Date, now: Date) {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameCalendarDay(value, yesterday);
}

function formatActivityTime(value: any) {
  const parsed = parseActivityDate(value);
  if (!parsed) return 'Brak daty';

  const now = new Date();
  const time = parsed.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

  if (isSameCalendarDay(parsed, now)) return 'dzisiaj ' + time;
  if (isYesterday(parsed, now)) return 'wczoraj ' + time;

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(parsed)
    .replace(/\./g, '');
}

function getLeadDisplayName(record: any) {
  return (
    normalizeText(record?.clientName) ||
    normalizeText(record?.name) ||
    normalizeText(record?.title) ||
    normalizeText(record?.email) ||
    ''
  );
}

function getCaseDisplayName(record: any) {
  return (
    normalizeText(record?.title) ||
    normalizeText(record?.clientName) ||
    normalizeText(record?.type) ||
    ''
  );
}

function buildLeadLookup(items: any[]) {
  const lookup = new Map<string, string>();
  for (const item of items || []) {
    const id = normalizeText(item?.id);
    const label = getLeadDisplayName(item);
    if (id && label) lookup.set(id, label);
  }
  return lookup;
}

function buildCaseLookup(items: any[]) {
  const lookup = new Map<string, string>();
  for (const item of items || []) {
    const id = normalizeText(item?.id);
    const label = getCaseDisplayName(item);
    if (id && label) lookup.set(id, label);
  }
  return lookup;
}

function getActorLabel(activity: any) {
  return activity?.actorType === 'client' ? 'Klient' : 'Operator';
}

function getActivityEntity(activity: any) {
  const eventType = normalizeLower(activity?.eventType);
  const payloadSource = normalizeLower(activity?.payload?.source);
  const payloadType = normalizeLower(activity?.payload?.type);

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

function getActivityPillLabel(activity: any) {
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

function getActivityIcon(activity: any) {
  switch (getActivityEntity(activity)) {
    case 'lead':
      return Target;
    case 'case':
      return Briefcase;
    case 'task':
      return ListChecks;
    case 'event':
      return CalendarClock;
    case 'client':
      return UserRound;
    default:
      return Clock;
  }
}

function getActivityIconTone(activity: any) {
  const eventType = normalizeLower(activity?.eventType);
  const entity = getActivityEntity(activity);

  if (eventType.includes('complete') || eventType.includes('done')) return 'success';
  if (requiresAttention(activity)) return 'warning';
  if (entity === 'lead') return 'blue';
  if (entity === 'case') return 'green';
  if (entity === 'task') return 'amber';
  if (entity === 'event') return 'sky';
  return 'neutral';
}

function getActivityTitle(activity: any) {
  const eventType = normalizeLower(activity?.eventType);
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

function getActivityMeta(activity: any) {
  const actor = getActorLabel(activity);
  const payloadTitle = normalizeText(activity?.payload?.title);
  const status = normalizeText(activity?.payload?.status || activity?.payload?.nextStatus);
  const reason = normalizeText(activity?.payload?.reason || activity?.payload?.note);
  const pieces = [actor];

  if (payloadTitle) pieces.push(payloadTitle);
  if (status) pieces.push('status: ' + status);
  if (reason) pieces.push(reason);

  return pieces.join(' • ');
}

function getLeadContextLabel(activity: any, leadLookup: Map<string, string>) {
  const leadId = normalizeText(activity?.leadId || activity?.payload?.leadId || activity?.payload?.lead_id);
  if (!leadId) return '';
  return (
    leadLookup.get(leadId) ||
    normalizeText(activity?.payload?.leadName) ||
    normalizeText(activity?.payload?.leadTitle) ||
    'Powiązany lead'
  );
}

function getCaseContextLabel(activity: any, caseLookup: Map<string, string>) {
  const caseId = normalizeText(activity?.caseId || activity?.payload?.caseId || activity?.payload?.case_id);
  if (!caseId) return '';
  return (
    caseLookup.get(caseId) ||
    normalizeText(activity?.payload?.caseTitle) ||
    normalizeText(activity?.payload?.caseName) ||
    'Powiązana sprawa'
  );
}

function getActivityRelation(activity: any, leadLookup: Map<string, string>, caseLookup: Map<string, string>) {
  const leadId = normalizeText(activity?.leadId || activity?.payload?.leadId || activity?.payload?.lead_id);
  const caseId = normalizeText(activity?.caseId || activity?.payload?.caseId || activity?.payload?.case_id);
  const clientName = normalizeText(activity?.payload?.clientName || activity?.payload?.customerName);
  const payloadTitle = normalizeText(activity?.payload?.title);
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

function getActivitySearchText(activity: any, leadLookup: Map<string, string>, caseLookup: Map<string, string>) {
  const relation = getActivityRelation(activity, leadLookup, caseLookup);
  return [
    getActorLabel(activity),
    getActivityTitle(activity),
    getActivityMeta(activity),
    getActivityPillLabel(activity),
    relation.type,
    relation.label,
    normalizeText(activity?.eventType),
    normalizeText(activity?.payload?.title),
    normalizeText(activity?.payload?.clientName),
    normalizeText(activity?.payload?.leadName),
    normalizeText(activity?.payload?.caseTitle),
    normalizeText(activity?.payload?.note),
  ]
    .join(' ')
    .toLowerCase();
}

function isActivityToday(activity: any) {
  const parsed = parseActivityDate(activity?.createdAt || activity?.happenedAt || activity?.updatedAt);
  return parsed ? isSameCalendarDay(parsed, new Date()) : false;
}

function getActivitySource(activity: any) {
  const eventType = normalizeLower(activity?.eventType);
  const payloadSource = normalizeLower(activity?.payload?.source);

  if (eventType.startsWith('today_') || payloadSource === 'today') return 'today';
  if (eventType.startsWith('calendar_') || payloadSource === 'calendar') return 'calendar';

  const entity = getActivityEntity(activity);
  if (entity === 'lead') return 'lead';
  if (entity === 'case') return 'case';

  return 'other';
}

function getActivityType(activity: any) {
  const eventType = normalizeLower(activity?.eventType);

  if (eventType.includes('completed') || eventType.includes('done')) return 'completed';
  if (eventType.includes('restored') || eventType.includes('reopen')) return 'restored';
  if (eventType.includes('deleted') || eventType.includes('removed')) return 'deleted';
  if (eventType.includes('created') || eventType.includes('create') || eventType.includes('added') || eventType.includes('add')) return 'created';
  if (eventType.includes('updated') || eventType.includes('update') || eventType.includes('change') || eventType.includes('edit')) return 'updated';

  return 'all';
}

function getActivityRelationKind(activity: any) {
  const leadId = normalizeText(activity?.leadId || activity?.payload?.leadId || activity?.payload?.lead_id);
  const caseId = normalizeText(activity?.caseId || activity?.payload?.caseId || activity?.payload?.case_id);
  if (leadId) return 'lead';
  if (caseId) return 'case';
  return 'none';
}

function safePayloadPreview(payload: any) {
  try {
    if (!payload || typeof payload !== 'object') return '';
    const text = JSON.stringify(payload, null, 2);
    if (text.length <= 1600) return text;
    return text.slice(0, 1600) + '\n…';
  } catch {
    return '';
  }
}

function requiresAttention(activity: any) {
  const eventType = normalizeLower(activity?.eventType);
  const payloadStatus = normalizeLower(activity?.payload?.status || activity?.payload?.nextStatus);
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

function shouldShowByFilter(activity: any, filter: string) {
  if (filter === 'all') return true;
  if (filter === 'today') return isActivityToday(activity);
  if (filter === 'attention') return requiresAttention(activity);
  if (filter === 'system') return getActivityEntity(activity) === 'system' || getActivityEntity(activity) === 'client';
  return getActivityEntity(activity) === filter;
}

function MetricCard({
  label,
  value,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={['activity-stat-card', active ? 'activity-stat-card-active' : ''].join(' ')}
    >
      <span className="activity-stat-content">
        <span className="activity-stat-label">{label}</span>
        <span className="activity-stat-value">{value}</span>
      </span>
      <span className="activity-stat-icon" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </span>
    </button>
  );
}

function ActivityRow({
  activity,
  activityId,
  leadLookup,
  caseLookup,
  index,
  expanded,
  onTogglePayload,
}: {
  activity: any;
  activityId: string;
  leadLookup: Map<string, string>;
  caseLookup: Map<string, string>;
  index: number;
  expanded: boolean;
  onTogglePayload: (id: string) => void;
}) {
  const Icon = getActivityIcon(activity);
  const relation = getActivityRelation(activity, leadLookup, caseLookup);
  const time = formatActivityTime(activity?.createdAt || activity?.happenedAt || activity?.updatedAt);
  const title = getActivityTitle(activity);
  const meta = getActivityMeta(activity);
  const pill = getActivityPillLabel(activity);
  const tone = getActivityIconTone(activity);

  const leadId = normalizeText(activity?.leadId || activity?.payload?.leadId || activity?.payload?.lead_id);
  const caseId = normalizeText(activity?.caseId || activity?.payload?.caseId || activity?.payload?.case_id);

  return (
    <article className="activity-row" data-testid="activity-row">
      <div className={['activity-row-icon', 'activity-row-icon-' + tone].join(' ')}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="activity-row-main">
        <div className="activity-row-heading">
          <span className="activity-row-type">{pill}</span>
          {requiresAttention(activity) ? <span className="activity-attention-pill">Wymaga uwagi</span> : null}
        </div>
        <h2 className="activity-row-title">{title}</h2>
        <p className="activity-row-meta">{meta || 'Zapis operacyjny'}</p>
        <button type="button" className="activity-payload-toggle" onClick={() => onTogglePayload(activityId)}>
          {expanded ? 'Ukryj szczegóły techniczne' : 'Pokaż szczegóły techniczne'}
        </button>
        {expanded ? (
          <pre className="activity-payload-preview">{safePayloadPreview(activity?.payload) || '{}'}</pre>
        ) : null}
      </div>

      <div className="activity-row-relation">
        <span className="activity-relation-label">{relation.type || 'Powiązanie'}</span>
        {leadId ? (
          <Link to={'/leads/' + leadId} className="activity-relation-link">
            <Link2 className="h-3.5 w-3.5" />
            {relation.label}
          </Link>
        ) : caseId ? (
          <Link to={'/cases/' + caseId} className="activity-relation-link">
            <Link2 className="h-3.5 w-3.5" />
            {relation.label}
          </Link>
        ) : (
          <span className="activity-relation-empty">{relation.label}</span>
        )}
      </div>

      <time className="activity-row-time">{time}</time>

      <div className="activity-row-action">
        {relation.href ? (
          <Link to={relation.href} className="activity-open-button" aria-label={'Otwórz ' + relation.label}>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="activity-open-button activity-open-button-disabled" aria-label="Brak szczegółu">
            {index + 1}
          </span>
        )}
      </div>
    </article>
  );
}

export default function Activity() {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadLookup, setLeadLookup] = useState<Map<string, string>>(new Map());
  const [caseLookup, setCaseLookup] = useState<Map<string, string>>(new Map());
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [relationFilter, setRelationFilter] = useState('all');
  const [expandedPayloadIds, setExpandedPayloadIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    if (!isSupabaseConfigured() || workspaceLoading || !workspace?.id) {
      setActivities([]);
      setLeadLookup(new Map());
      setCaseLookup(new Map());
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    Promise.all([
      fetchActivitiesFromSupabase({ limit: 120 }),
      fetchLeadsFromSupabase(),
      fetchCasesFromSupabase(),
    ])
      .then(([activityRows, leadRows, caseRows]) => {
        if (cancelled) return;
        setActivities(Array.isArray(activityRows) ? activityRows : []);
        setLeadLookup(buildLeadLookup(Array.isArray(leadRows) ? leadRows : []));
        setCaseLookup(buildCaseLookup(Array.isArray(caseRows) ? caseRows : []));
        setLoading(false);
      })
      .catch((error: any) => {
        if (cancelled) return;
        toast.error('Błąd aktywności API: ' + (error?.message || 'nie udało się pobrać danych'));
        setActivities([]);
        setLeadLookup(new Map());
        setCaseLookup(new Map());
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [workspace?.id, workspaceLoading]);

  const filterCounts = useMemo(() => {
    return activityFilters.reduce<Record<string, number>>((acc, filter) => {
      acc[filter.value] = activities.filter((activity) => shouldShowByFilter(activity, filter.value)).length;
      return acc;
    }, {});
  }, [activities]);

  const metrics = useMemo(() => {
    return {
      all: activities.length,
      today: activities.filter(isActivityToday).length,
      leads: activities.filter((activity) => getActivityEntity(activity) === 'lead').length,
      cases: activities.filter((activity) => getActivityEntity(activity) === 'case').length,
      tasks: activities.filter((activity) => getActivityEntity(activity) === 'task').length,
      attention: activities.filter(requiresAttention).length,
    };
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activities.filter((activity) => {
      if (!shouldShowByFilter(activity, activeFilter)) return false;
      if (sourceFilter !== 'all' && getActivitySource(activity) !== sourceFilter) return false;
      if (typeFilter !== 'all' && getActivityType(activity) !== typeFilter) return false;
      if (relationFilter !== 'all' && getActivityRelationKind(activity) !== relationFilter) return false;
      if (!normalizedQuery) return true;
      return getActivitySearchText(activity, leadLookup, caseLookup).includes(normalizedQuery);
    });
  }, [activities, query, activeFilter, sourceFilter, typeFilter, relationFilter, leadLookup, caseLookup]);

  const recentLeadChanges = useMemo(
    () => activities.filter((activity) => getActivityEntity(activity) === 'lead').slice(0, 4),
    [activities],
  );

  const recentCaseChanges = useMemo(
    () => activities.filter((activity) => getActivityEntity(activity) === 'case').slice(0, 4),
    [activities],
  );

  function togglePayload(activityId: string) {
    setExpandedPayloadIds((prev) => {
      const current = Boolean(prev[activityId]);
      return { ...prev, [activityId]: !current };
    });
  }

  return (
    <Layout>
      <main className="activity-vnext-page">
        <header className="activity-page-header">
          <div>
            <p className="activity-kicker">AKTYWNOŚĆ</p>
            <h1>Aktywność</h1>
            <p>Ostatnie ruchy, zmiany i zdarzenia w jednym miejscu.</p>
          </div>
        </header>

        <section className="activity-stats-grid" aria-label="Statystyki aktywności">
          <MetricCard label="Wszystkie" value={metrics.all} icon={FileText} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
          <MetricCard label="Dzisiaj" value={metrics.today} icon={Clock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} />
          <MetricCard label="Leady" value={metrics.leads} icon={Target} active={activeFilter === 'lead'} onClick={() => setActiveFilter('lead')} />
          <MetricCard label="Sprawy" value={metrics.cases} icon={Briefcase} active={activeFilter === 'case'} onClick={() => setActiveFilter('case')} />
          <MetricCard label="Zadania" value={metrics.tasks} icon={ListChecks} active={activeFilter === 'task'} onClick={() => setActiveFilter('task')} />
          <MetricCard label="Wymaga uwagi" value={metrics.attention} icon={Bell} active={activeFilter === 'attention'} onClick={() => setActiveFilter('attention')} />
        </section>

        <div className="activity-vnext-shell">
          <section className="activity-main-column">
            <div className="activity-toolbar-card">
              <div className="activity-filter-pills" aria-label="Filtry aktywności">
                {activityFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={['activity-filter-pill', activeFilter === filter.value ? 'activity-filter-pill-active' : ''].join(' ')}
                  >
                    <span>{filter.label}</span>
                    <strong>{filterCounts[filter.value] || 0}</strong>
                  </button>
                ))}
              </div>

              <div className="activity-command-center" aria-label="Centrum dowodzenia">
                <label className="activity-command-filter">
                  <span>Źródło</span>
                  <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
                    {sourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="activity-command-filter">
                  <span>Typ</span>
                  <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                    {activityTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="activity-command-filter">
                  <span>Relacja</span>
                  <select value={relationFilter} onChange={(event) => setRelationFilter(event.target.value)}>
                    {relationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="activity-search-box">
                <Search className="h-4 w-4" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Szukaj po tytule, leadzie, sprawie, typie zdarzenia..."
                />
              </label>
            </div>

            <section className="activity-list-card" aria-label="Lista aktywności">
              <div className="activity-list-head">
                <div>
                  <p className="activity-list-eyebrow">Dziennik ruchu</p>
                  <h2>Ostatnie aktywności</h2>
                </div>
                <span>
                  {filteredActivities.length} / {activities.length}
                </span>
              </div>

              {loading ? (
                <div className="activity-loading-state">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Ładowanie aktywności...</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="activity-empty-state">
                  <FileText className="h-8 w-8" />
                  <h2>Brak aktywności do pokazania.</h2>
                  <p>Gdy dodasz leady, zadania, wydarzenia albo sprawy, zobaczysz tu ostatnie ruchy.</p>
                </div>
              ) : (
                <div className="activity-rows">
                  {filteredActivities.map((activity, index) => {
                    const activityId = normalizeText(activity?.id) || 'activity-' + index;
                    return (
                      <div key={activityId} style={{ display: 'contents' }}>
                        <ActivityRow
                          activity={activity}
                          activityId={activityId}
                          leadLookup={leadLookup}
                          caseLookup={caseLookup}
                          index={index}
                          expanded={Boolean(expandedPayloadIds[activityId])}
                          onTogglePayload={togglePayload}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </section>

          <aside className="activity-right-rail" aria-label="Skrót aktywności">
            <section className="right-card activity-right-card">
              <div className="activity-right-card-head">
                <Filter className="h-4 w-4" />
                <h2>Szybkie filtry</h2>
              </div>
              <button type="button" onClick={() => setActiveFilter('today')} className="activity-rail-button">
                <span>Dzisiaj</span>
                <strong>{metrics.today}</strong>
              </button>
              <button type="button" onClick={() => setActiveFilter('attention')} className="activity-rail-button">
                <span>Wymaga uwagi</span>
                <strong>{metrics.attention}</strong>
              </button>
            </section>

            <section className="right-card activity-right-card">
              <div className="activity-right-card-head">
                <Briefcase className="h-4 w-4" />
                <h2>Ostatnie zmiany w sprawach</h2>
              </div>
              {recentCaseChanges.length ? (
                <div className="activity-rail-list">
                  {recentCaseChanges.map((activity, index) => {
                    const relation = getActivityRelation(activity, leadLookup, caseLookup);
                    return (
                      <div key={normalizeText(activity?.id) || 'case-change-' + index} className="activity-rail-item">
                        <span>{getActivityTitle(activity)}</span>
                        <strong>{relation.label}</strong>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="activity-rail-empty">Brak ostatnich zmian w sprawach.</p>
              )}
            </section>

            <section className="right-card activity-right-card">
              <div className="activity-right-card-head">
                <Target className="h-4 w-4" />
                <h2>Ostatnie zmiany w leadach</h2>
              </div>
              {recentLeadChanges.length ? (
                <div className="activity-rail-list">
                  {recentLeadChanges.map((activity, index) => {
                    const relation = getActivityRelation(activity, leadLookup, caseLookup);
                    return (
                      <div key={normalizeText(activity?.id) || 'lead-change-' + index} className="activity-rail-item">
                        <span>{getActivityTitle(activity)}</span>
                        <strong>{relation.label}</strong>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="activity-rail-empty">Brak ostatnich zmian w leadach.</p>
              )}
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
