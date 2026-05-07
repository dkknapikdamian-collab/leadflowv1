/*
P0_TODAY_STABLE_REBUILD
Stable Today screen reads the same Supabase API collections that Network diagnostics proved are working.
This page intentionally bypasses the legacy Today.tsx scheduler stack for operator sections.
*/

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckSquare,
  FileText,
  Loader2,
  RefreshCcw,
  SlidersHorizontal,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import {
  deleteEventFromSupabase,
  deleteTaskFromSupabase,
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  updateLeadInSupabase,
} from '../lib/supabase-fallback';
import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';
import { getAiLeadDraftsAsync, type AiLeadDraft } from '../lib/ai-drafts';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import { normalizeWorkItem } from '../lib/work-items/normalize';

const P0_TODAY_STABLE_REBUILD = 'P0_TODAY_STABLE_REBUILD';
const STAGE70_TODAY_DECISION_ENGINE_STARTER = 'STAGE70_TODAY_DECISION_ENGINE_STARTER';
const STAGE81_TODAY_RISK_REASON_NEXT_ACTION = 'STAGE81_TODAY_RISK_REASON_NEXT_ACTION';
const STAGE82_TODAY_NEXT_7_DAYS = 'STAGE82_TODAY_NEXT_7_DAYS';
const STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE = 'STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE';
const STAGE16AI_TODAY_TILES_MATCH_LISTS = 'STAGE16AI_TODAY_TILES_MATCH_LISTS';
const STAGE16AN_TODAY_VIEW_CUSTOMIZER = 'STAGE16AN_TODAY_VIEW_CUSTOMIZER';
const TODAY_VIEW_STORAGE_KEY = 'closeflow:today:view-sections:v1';
void P0_TODAY_STABLE_REBUILD;
void STAGE70_TODAY_DECISION_ENGINE_STARTER;
void STAGE81_TODAY_RISK_REASON_NEXT_ACTION;
void STAGE82_TODAY_NEXT_7_DAYS;
void STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE;
void STAGE16AI_TODAY_TILES_MATCH_LISTS;
void STAGE16AN_TODAY_VIEW_CUSTOMIZER;

type DashboardStatus = 'idle' | 'loading' | 'ready' | 'error';

type DashboardData = {
  tasks: any[];
  leads: any[];
  events: any[];
  cases: any[];
  drafts: AiLeadDraft[];
};

type TodayLeadRisk = {
  reason: string;
  suggestedAction: string;
  score: number;
  tone: 'red' | 'amber' | 'blue' | 'slate';
};

type UpcomingRow = {
  id: string;
  kind: 'task' | 'event' | 'lead';
  title: string;
  helper: string;
  meta: string;
  momentRaw: string;
  to: string;
  badge: string;
};

type TodaySectionKey = 'no_action' | 'risk' | 'waiting' | 'leads' | 'tasks' | 'events' | 'drafts' | 'upcoming';

const TODAY_SECTION_KEYS: TodaySectionKey[] = [
  'no_action',
  'risk',
  'waiting',
  'leads',
  'tasks',
  'events',
  'upcoming',
  'drafts',
];

function sanitizeTodayVisibleSections(value: unknown): TodaySectionKey[] {
  if (!Array.isArray(value)) return [...TODAY_SECTION_KEYS];
  const unique = new Set<TodaySectionKey>();
  for (const item of value) {
    if (TODAY_SECTION_KEYS.includes(item as TodaySectionKey)) unique.add(item as TodaySectionKey);
  }
  return [...unique];
}

function readTodayVisibleSections(): TodaySectionKey[] {
  if (typeof window === 'undefined') return [...TODAY_SECTION_KEYS];
  try {
    const raw = window.localStorage.getItem(TODAY_VIEW_STORAGE_KEY);
    if (!raw) return [...TODAY_SECTION_KEYS];
    return sanitizeTodayVisibleSections(JSON.parse(raw));
  } catch {
    return [...TODAY_SECTION_KEYS];
  }
}

function writeTodayVisibleSections(keys: TodaySectionKey[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TODAY_VIEW_STORAGE_KEY, JSON.stringify(sanitizeTodayVisibleSections(keys)));
  } catch {
    // Local storage is a convenience only. The dashboard must still work without it.
  }
}

const emptyData: DashboardData = {
  tasks: [],
  leads: [],
  events: [],
  cases: [],
  drafts: [],
};

function isClosedStatus(value: unknown) {
  const status = String(value || '').trim().toLowerCase();
  return status === 'done' || status === 'completed' || status === 'closed' || status === 'cancelled' || status === 'canceled';
}

function isClosedLead(value: any) {
  const status = String(value?.status || '').trim().toLowerCase();
  const visibility = String(value?.leadVisibility || value?.lead_visibility || 'active').trim().toLowerCase();
  const outcome = String(value?.salesOutcome || value?.sales_outcome || 'open').trim().toLowerCase();
  const movedToService = value?.movedToService === true || Boolean(value?.movedToServiceAt || value?.moved_to_service_at);

  return movedToService
    || visibility === 'archived'
    || visibility === 'hidden'
    || outcome === 'won'
    || outcome === 'lost'
    || outcome === 'closed'
    || outcome === 'moved_to_service'
    || status === 'won'
    || status === 'lost'
    || status === 'archived'
    || status === 'moved_to_service';
}

function localDateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function addDaysKey(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

function readText(record: any, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readMomentRaw(record: any, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value instanceof Date) return value.toISOString();
  }
  return '';
}

function getTaskMomentRaw(task: any) {
  const normalized = normalizeWorkItem(task);
  if (normalized.dateAt) return normalized.dateAt;

  const date = readText(task, ['date'], '');
  if (!date) return '';
  const time = readText(task, ['time'], '09:00');
  return date.includes('T') ? date : date + 'T' + time;
}

function getLeadMomentRaw(lead: any) {
  const direct = readMomentRaw(lead, ['nextActionAt', 'next_action_at', 'followUpAt', 'follow_up_at', 'scheduledAt', 'scheduled_at', 'reminderAt', 'reminder_at']);
  if (direct) return direct;

  const date = readText(lead, ['nextActionDate', 'next_action_date', 'followUpDate', 'follow_up_date'], '');
  if (!date) return '';
  const time = readText(lead, ['nextActionTime', 'next_action_time', 'FollowUpTime', 'follow_up_time'], '09:00');
  return date.includes('T') ? date : date + 'T' + time;
}

function getEventMomentRaw(event: any) {
  return normalizeWorkItem(event).dateAt || readMomentRaw(event, ['startAt', 'start_at', 'startsAt', 'starts_at', 'scheduledAt', 'scheduled_at', 'dateTime', 'date_time']);
}

function getDateKey(raw: string) {
  if (!raw) return '';
  return String(raw).slice(0, 10);
}

function parseTime(raw: string) {
  if (!raw) return Number.POSITIVE_INFINITY;
  const date = new Date(raw.includes('T') ? raw : raw + 'T09:00');
  const time = date.getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}

function formatDateTime(raw: string) {
  if (!raw) return 'Brak terminu';
  const dateKey = getDateKey(raw);
  const time = raw.includes('T') ? raw.slice(11, 16) : '09:00';
  if (!dateKey) return 'Brak terminu';
  return time ? dateKey + ', ' + time : dateKey;
}

function getTaskTitle(task: any) {
  return readText(task, ['title', 'name'], 'Zadanie bez tytułu');
}

function getLeadTitle(lead: any) {
  return readText(lead, ['name', 'company', 'title'], 'Lead bez nazwy');
}

function getCaseTitle(caseRecord: any) {
  return readText(caseRecord, ['title', 'clientName', 'client_name', 'name'], 'Sprawa');
}

function getDraftText(draft: any) {
  return readText(draft, ['rawText', 'raw_text', 'summary', 'text'], 'Szkic bez treści');
}

function sortByMoment(a: { momentRaw: string }, b: { momentRaw: string }) {
  return parseTime(a.momentRaw) - parseTime(b.momentRaw);
}

function getLeadValue(lead: any) {
  const candidates = [lead?.dealValue, lead?.deal_value, lead?.value, lead?.estimatedValue, lead?.estimated_value, lead?.budget, lead?.amount];
  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) return candidate;
    if (typeof candidate === 'string' && candidate.trim()) {
      const parsed = Number(candidate.replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function getLeadFreshnessDays(lead: any) {
  const raw = readMomentRaw(lead, ['lastActivityAt', 'last_activity_at', 'updatedAt', 'updated_at', 'createdAt', 'created_at']);
  if (!raw) return null;
  const parsed = new Date(raw);
  if (!Number.isFinite(parsed.getTime())) return null;
  const diffMs = Date.now() - parsed.getTime();
  return Math.max(0, Math.floor(diffMs / 86_400_000));
}

function getLeadStatus(lead: any) {
  return String(lead?.status || '').trim().toLowerCase();
}

function getLeadRisk(lead: any, momentRaw: string, todayKey: string): TodayLeadRisk {
  const value = getLeadValue(lead);
  const freshnessDays = getLeadFreshnessDays(lead);
  const dateKey = getDateKey(momentRaw);
  const status = getLeadStatus(lead);
  const hasNoAction = !dateKey;
  const isOverdue = Boolean(dateKey) && dateKey < todayKey;
  const isToday = Boolean(dateKey) && dateKey === todayKey;
  const isWaiting = status.includes('waiting') || status.includes('czeka') || status.includes('proposal') || status.includes('negotiation');
  const highValue = value >= 5000;
  const stale = typeof freshnessDays === 'number' && freshnessDays >= 7;

  if (isOverdue && highValue) {
    return {
      reason: 'zaległy follow-up przy wartościowym leadzie',
      suggestedAction: 'skontaktuj się dziś albo ustaw konkretny nowy termin',
      score: 120 + value / 1000,
      tone: 'red',
    };
  }

  if (isOverdue) {
    return {
      reason: 'zaległy termin kontaktu',
      suggestedAction: 'wykonaj kontakt albo przesuń termin na realną datę',
      score: 95,
      tone: 'red',
    };
  }

  if (hasNoAction && highValue) {
    return {
      reason: 'wysoka wartość i brak najbliższej zaplanowanej akcji',
      suggestedAction: 'ustaw follow-up albo zdecyduj, czy temat zamknąć',
      score: 90 + value / 1000,
      tone: 'amber',
    };
  }

  if (hasNoAction) {
    return {
      reason: 'brak najbliższej zaplanowanej akcji',
      suggestedAction: 'ustaw follow-up albo zamknij temat jako utracony',
      score: 78,
      tone: 'amber',
    };
  }

  if (isWaiting && stale) {
    return {
      reason: 'waiting za długo bez świeżego ruchu',
      suggestedAction: 'wyślij krótkie przypomnienie albo ustaw ostatni follow-up',
      score: 72,
      tone: 'amber',
    };
  }

  if (isToday && highValue) {
    return {
      reason: 'dzisiejszy kontakt przy wartościowym leadzie',
      suggestedAction: 'obsłuż ten kontakt przed zwykłymi zadaniami',
      score: 70 + value / 1000,
      tone: 'blue',
    };
  }

  if (isToday) {
    return {
      reason: 'kontakt zaplanowany na dziś',
      suggestedAction: 'wykonaj kontakt i ustaw kolejny konkretny ruch',
      score: 55,
      tone: 'blue',
    };
  }

  if (stale) {
    return {
      reason: 'brak świeżej aktywności od ' + freshnessDays + ' dni',
      suggestedAction: 'sprawdź, czy lead nadal ma sens albo zamknij temat',
      score: 45,
      tone: 'slate',
    };
  }

  return {
    reason: 'lead wymaga kontroli procesu',
    suggestedAction: 'sprawdź szczegóły i potwierdź kolejny krok',
    score: 20,
    tone: 'slate',
  };
}

function SectionHeader({
  title,
  count,
  icon,
  tone,
}: {
  title: string;
  count: number;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className={'rounded-2xl p-2 ' + tone}>{icon}</div>
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="text-xs font-medium text-slate-500">{count} wpisów</p>
        </div>
      </div>
      <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">{count}</Badge>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="p-4 text-sm text-slate-500">{text}</div>;
}

function StableCard({ children }: { children: ReactNode }) {
  return <Card className="border-slate-100 shadow-sm"><CardContent className="p-0">{children}</CardContent></Card>;
}

function RowLink({
  to,
  title,
  meta,
  helper,
  badge,
  onEdit,
  onDelete,
  deleting,
}: {
  key?: string;
  to: string;
  title: string;
  meta?: string;
  helper?: string;
  badge?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  return (
    <div className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50">
      <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={to} className="font-semibold text-slate-900 break-words hover:underline">
              {title}
            </Link>
            {badge ? <Badge variant="outline" className="rounded-full">{badge}</Badge> : null}
          </div>
          {helper ? <p className="mt-1 text-sm text-slate-600 break-words">{helper}</p> : null}
          {meta ? <p className="mt-1 text-xs font-medium text-slate-500">{meta}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {onEdit ? <Button type="button" size="sm" variant="outline" onClick={onEdit}>Edytuj</Button> : null}
          {onDelete ? (
            <Button type="button" size="sm" variant="ghost" onClick={onDelete} disabled={deleting}>
              {deleting ? 'Usuwanie...' : 'Kosz'}
            </Button>
          ) : null}
          <Link to={to} className="inline-flex items-center rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}

async function loadStableTodayData(): Promise<DashboardData> {
  const [tasks, leads, events, cases, drafts] = await Promise.all([
    fetchTasksFromSupabase().catch(() => []),
    fetchLeadsFromSupabase().catch(() => []),
    fetchEventsFromSupabase().catch(() => []),
    fetchCasesFromSupabase().catch(() => []),
    getAiLeadDraftsAsync().catch(() => []),
  ]);

  return {
    tasks: Array.isArray(tasks) ? tasks : [],
    leads: Array.isArray(leads) ? leads : [],
    events: Array.isArray(events) ? events : [],
    cases: Array.isArray(cases) ? cases : [],
    drafts: Array.isArray(drafts) ? drafts : [],
  };
}

export default function TodayStable() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<DashboardStatus>('idle');
  const [data, setData] = useState<DashboardData>(emptyData);
  const [lastLoadedAt, setLastLoadedAt] = useState<string>('');
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<'all' | TodaySectionKey>('all');
  const [todayViewOpen, setTodayViewOpen] = useState(false);
  const [visibleTodaySections, setVisibleTodaySections] = useState<TodaySectionKey[]>(() => readTodayVisibleSections());
  const [actionPendingId, setActionPendingId] = useState<string>('');

  const refreshData = useCallback(async (options?: { manual?: boolean }) => {
    const manual = Boolean(options?.manual);
    if (manual) setManualRefreshing(true);
    setStatus((current) => (current === 'ready' ? 'ready' : 'loading'));
    setErrorMessage('');

    try {
      const nextData = await loadStableTodayData();
      setData(nextData);
      setLastLoadedAt(new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }));
      setStatus('ready');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Nie udało się pobrać danych.');
      setStatus('error');
    } finally {
      if (manual) setManualRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    const handleFocus = () => void refreshData();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void refreshData();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshData]);

  useEffect(() => {
    // FAZA4_ETAP44B_TODAY_LIVE_REFRESH: Today must refetch after mutations from Tasks, Calendar, Leads, Cases and AI drafts.
    let refreshTimer: number | null = null;

    const unsubscribe = subscribeCloseflowDataMutations((detail) => {
      if (!['task', 'event', 'lead', 'case', 'client', 'aiDraft', 'activity', 'payment'].includes(detail.entity)) return;

      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        void refreshData().catch((error: any) => {
          console.warn('TODAY_LIVE_REFRESH_FAILED', error);
        });
      }, 120);
    });

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      unsubscribe();
    };
  }, [refreshData]);

  const todayKey = localDateKey();
  const next7EndKey = addDaysKey(7);

  const casesById = useMemo(() => new Map(data.cases.map((caseRecord: any) => [String(caseRecord.id || ''), caseRecord])), [data.cases]);
  const leadCasesByLeadId = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const caseRecord of data.cases) {
      const leadId = String(caseRecord?.leadId || '');
      const caseId = String(caseRecord?.id || '');
      if (!leadId || !caseId) continue;
      const current = map.get(leadId) || [];
      current.push(caseId);
      map.set(leadId, current);
    }
    return map;
  }, [data.cases]);
  const allWorkItems = useMemo(() => [...data.tasks, ...data.events], [data.events, data.tasks]);
  const activeLeadsWithPlannedAction = useMemo(() => {
    return data.leads
      .filter((lead) => !isClosedLead(lead))
      .map((lead) => {
        const leadId = String(lead?.id || '');
        const action = getNearestPlannedAction({
          recordType: 'lead',
          recordId: leadId,
          relatedCaseIds: leadCasesByLeadId.get(leadId) || [],
          items: allWorkItems,
        });
        return {
          ...lead,
          nextActionAt: action?.when || null,
          nextActionTitle: action?.title || null,
          nextActionStatus: action?.status || null,
          nextActionType: action?.type || null,
        };
      });
  }, [allWorkItems, data.leads, leadCasesByLeadId]);

  const operatorTasks = useMemo(() => {
    return data.tasks
      .filter((task) => !isClosedStatus(task?.status))
      .map((task) => ({ task, momentRaw: getTaskMomentRaw(task) }))
      .filter((entry) => {
        const dateKey = getDateKey(entry.momentRaw);
        return Boolean(dateKey) && dateKey <= todayKey;
      })
      .sort(sortByMoment);
  }, [data.tasks, todayKey]);

  const operatorLeads = useMemo(() => {
    return activeLeadsWithPlannedAction
      .map((lead) => {
        const momentRaw = getLeadMomentRaw(lead);
        return { lead, momentRaw, risk: getLeadRisk(lead, momentRaw, todayKey) };
      })
      .filter((entry) => {
        const dateKey = getDateKey(entry.momentRaw);
        return !dateKey || dateKey <= todayKey;
      })
      .sort((a, b) => {
        if (b.risk.score !== a.risk.score) return b.risk.score - a.risk.score;
        if (!a.momentRaw && b.momentRaw) return -1;
        if (a.momentRaw && !b.momentRaw) return 1;
        return parseTime(a.momentRaw) - parseTime(b.momentRaw);
      });
  }, [activeLeadsWithPlannedAction, todayKey]);

  const noActionLeads = useMemo(() => operatorLeads.filter((entry) => !getDateKey(entry.momentRaw)).slice(0, 5), [operatorLeads]);
  const highValueAtRiskRows = useMemo(() => operatorLeads.filter((entry) => getLeadValue(entry.lead) >= 5000 || entry.risk.reason.includes('wartości')).slice(0, 5), [operatorLeads]);
  const waitingLeadRows = useMemo(() => operatorLeads.filter((entry) => entry.risk.reason.includes('waiting') || getLeadStatus(entry.lead).includes('waiting') || getLeadStatus(entry.lead).includes('czeka')).slice(0, 5), [operatorLeads]);

  const todayEvents = useMemo(() => {
    return data.events
      .filter((event) => !isClosedStatus(event?.status))
      .map((event) => ({ event, momentRaw: getEventMomentRaw(event) }))
      .filter((entry) => getDateKey(entry.momentRaw) === todayKey)
      .sort(sortByMoment);
  }, [data.events, todayKey]);

  const upcomingRows = useMemo<UpcomingRow[]>(() => {
    const taskRows = data.tasks
      .filter((task) => !isClosedStatus(task?.status))
      .map((task) => ({ task, momentRaw: getTaskMomentRaw(task) }))
      .filter((entry) => {
        const dateKey = getDateKey(entry.momentRaw);
        return Boolean(dateKey) && dateKey > todayKey && dateKey <= next7EndKey;
      })
      .map((entry) => ({
        id: 'task:' + String(entry.task.id || getTaskTitle(entry.task)),
        kind: 'task' as const,
        title: getTaskTitle(entry.task),
        helper: 'Powód: zaplanowane zadanie w najbliższych dniach',
        meta: 'Ruch: przygotuj materiały albo obsłuż w terminie · ' + formatDateTime(entry.momentRaw),
        momentRaw: entry.momentRaw,
        to: '/tasks',
        badge: 'Zadanie',
      }));

    const eventRows = data.events
      .filter((event) => !isClosedStatus(event?.status))
      .map((event) => ({ event, momentRaw: getEventMomentRaw(event) }))
      .filter((entry) => {
        const dateKey = getDateKey(entry.momentRaw);
        return Boolean(dateKey) && dateKey > todayKey && dateKey <= next7EndKey;
      })
      .map((entry) => ({
        id: 'event:' + String(entry.event.id || entry.event.title),
        kind: 'event' as const,
        title: readText(entry.event, ['title'], 'Wydarzenie'),
        helper: 'Powód: wydarzenie w najbliższych 7 dniach',
        meta: 'Ruch: sprawdź przygotowanie i kontekst · ' + formatDateTime(entry.momentRaw),
        momentRaw: entry.momentRaw,
        to: '/calendar',
        badge: 'Wydarzenie',
      }));

    const leadRows = activeLeadsWithPlannedAction
      .map((lead) => {
        const momentRaw = getLeadMomentRaw(lead);
        const risk = getLeadRisk(lead, momentRaw, todayKey);
        return { lead, momentRaw, risk };
      })
      .filter((entry) => {
        const dateKey = getDateKey(entry.momentRaw);
        return Boolean(dateKey) && dateKey > todayKey && dateKey <= next7EndKey;
      })
      .map((entry) => ({
        id: 'lead:' + String(entry.lead.id || getLeadTitle(entry.lead)),
        kind: 'lead' as const,
        title: getLeadTitle(entry.lead),
        helper: 'Powód: ' + entry.risk.reason,
        meta: 'Ruch: ' + entry.risk.suggestedAction + ' · ' + formatDateTime(entry.momentRaw),
        momentRaw: entry.momentRaw,
        to: entry.lead.id ? '/leads/' + String(entry.lead.id) : '/leads',
        badge: 'Lead',
      }));

    return [...taskRows, ...eventRows, ...leadRows].sort(sortByMoment).slice(0, 10);
  }, [activeLeadsWithPlannedAction, data.events, data.tasks, next7EndKey, todayKey]);

  const pendingDrafts = useMemo(() => {
    return data.drafts.filter((draft: any) => String(draft?.status || '').toLowerCase() === 'draft');
  }, [data.drafts]);

  const visibleTodaySectionSet = useMemo(() => new Set(visibleTodaySections), [visibleTodaySections]);

  const loading = status === 'loading' || status === 'idle';
  const sectionVisible = (key: TodaySectionKey) =>
    visibleTodaySectionSet.has(key) && (expandedSection === 'all' || expandedSection === key);

  const todaySectionLabels = {
    no_action: 'Leady bez najbliższej akcji',
    risk: 'Wysoka wartość / ryzyko',
    waiting: 'Leady czekające',
    leads: 'Leady do obsługi dziś',
    tasks: 'Zadania do wykonania dziś',
    events: 'Wydarzenia dziś',
    upcoming: 'Najbliższe 7 dni',
    drafts: 'Szkice AI do sprawdzenia',
  } as const;

  const todayTiles: Array<{
    key: TodaySectionKey;
    title: string;
    count: number;
    tone: string;
    activeTone: string;
    icon: ReactNode;
  }> = [
    { key: 'no_action', title: todaySectionLabels.no_action, count: noActionLeads.length, tone: 'text-amber-700', activeTone: 'hover:border-amber-200', icon: <AlertTriangle className="h-4 w-4" /> },
    { key: 'risk', title: todaySectionLabels.risk, count: highValueAtRiskRows.length, tone: 'text-rose-700', activeTone: 'hover:border-rose-200', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'waiting', title: todaySectionLabels.waiting, count: waitingLeadRows.length, tone: 'text-orange-700', activeTone: 'hover:border-orange-200', icon: <UserRound className="h-4 w-4" /> },
    { key: 'leads', title: todaySectionLabels.leads, count: operatorLeads.length, tone: 'text-blue-700', activeTone: 'hover:border-blue-200', icon: <UserRound className="h-4 w-4" /> },
    { key: 'tasks', title: todaySectionLabels.tasks, count: operatorTasks.length, tone: 'text-emerald-700', activeTone: 'hover:border-emerald-200', icon: <CheckSquare className="h-4 w-4" /> },
    { key: 'events', title: todaySectionLabels.events, count: todayEvents.length, tone: 'text-violet-700', activeTone: 'hover:border-violet-200', icon: <CalendarDays className="h-4 w-4" /> },
    { key: 'upcoming', title: todaySectionLabels.upcoming, count: upcomingRows.length, tone: 'text-slate-700', activeTone: 'hover:border-slate-300', icon: <CalendarDays className="h-4 w-4" /> },
    { key: 'drafts', title: todaySectionLabels.drafts, count: pendingDrafts.length, tone: 'text-indigo-700', activeTone: 'hover:border-indigo-200', icon: <FileText className="h-4 w-4" /> },
  ];

  const visibleTodayTiles = todayTiles.filter((tile) => visibleTodaySectionSet.has(tile.key));
  const hiddenTodaySectionsCount = todayTiles.length - visibleTodayTiles.length;

  const toggleTodaySectionVisibility = useCallback((key: TodaySectionKey) => {
    setVisibleTodaySections((current) => {
      const currentSet = new Set(current);
      if (currentSet.has(key)) {
        currentSet.delete(key);
      } else {
        currentSet.add(key);
      }
      const next = TODAY_SECTION_KEYS.filter((entry) => currentSet.has(entry));
      writeTodayVisibleSections(next);
      if (!next.includes(key) && expandedSection === key) setExpandedSection('all');
      return next;
    });
  }, [expandedSection]);

  const showAllTodaySections = useCallback(() => {
    const next = [...TODAY_SECTION_KEYS];
    writeTodayVisibleSections(next);
    setVisibleTodaySections(next);
  }, []);

  const handleArchiveLead = useCallback(async (lead: any) => {
    const leadId = String(lead?.id || '');
    if (!leadId) return;
    setActionPendingId(`lead:${leadId}`);
    try {
      await updateLeadInSupabase({
        id: leadId,
        status: 'archived',
        leadVisibility: 'trash',
        salesOutcome: 'archived',
      });
      await refreshData();
    } finally {
      setActionPendingId('');
    }
  }, [refreshData]);

  const handleDeleteTask = useCallback(async (task: any) => {
    const taskId = String(task?.id || '');
    if (!taskId) return;
    setActionPendingId(`task:${taskId}`);
    try {
      await deleteTaskFromSupabase(taskId);
      await refreshData();
    } finally {
      setActionPendingId('');
    }
  }, [refreshData]);

  const handleDeleteEvent = useCallback(async (event: any) => {
    const eventId = String(event?.id || '');
    if (!eventId) return;
    setActionPendingId(`event:${eventId}`);
    try {
      await deleteEventFromSupabase(eventId);
      await refreshData();
    } finally {
      setActionPendingId('');
    }
  }, [refreshData]);

  return (
    <Layout>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6" data-p0-today-stable-rebuild="true" data-stage70-today-decision-engine-starter="true" data-stage81-today-risk-reason-next-action="true" data-stage82-today-next-7-days="true">
        <section className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge className="mb-3 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50">Dziś</Badge>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Centrum pracy na dziś</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {lastLoadedAt ? <span className="text-xs font-semibold text-slate-500">Ostatni odczyt: {lastLoadedAt}</span> : null}
              <Button type="button" variant="outline" onClick={() => void refreshData({ manual: true })} disabled={loading || manualRefreshing}>
                {manualRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                {manualRefreshing ? 'Odświeżanie...' : 'Odśwież dane'}
              </Button>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-stage16ai-today-tiles-match-lists="true">
        <div className="col-span-full rounded-2xl border border-slate-100 bg-white p-3 shadow-sm" data-today-view-customizer="true">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Widok</p>
              <p className="text-xs font-medium text-slate-500">Wybierz, ktore kafelki i listy w sekcji Dzis sa widoczne.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">
                {visibleTodayTiles.length}/{todayTiles.length} widoczne
              </Badge>
              <Button type="button" size="sm" variant="outline" onClick={() => setTodayViewOpen((value) => !value)} data-today-view-toggle="true">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Widok
              </Button>
              {hiddenTodaySectionsCount > 0 ? (
                <Button type="button" size="sm" variant="ghost" onClick={showAllTodaySections} data-today-view-show-all="true">
                  Pokaz wszystko
                </Button>
              ) : null}
            </div>
          </div>
          {todayViewOpen ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" data-today-view-options="true">
              {visibleTodayTiles.map((tile) => {
                const checked = visibleTodaySectionSet.has(tile.key);
                return (
                  <label key={tile.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" data-today-view-option={tile.key}>
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={'rounded-lg bg-white p-1.5 ' + tile.tone}>{tile.icon}</span>
                      <span className="truncate">{tile.title}</span>
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                      checked={checked}
                      onChange={() => toggleTodaySectionVisibility(tile.key)}
                    />
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
          {visibleTodayTiles.map((tile) => {
            const active = expandedSection === tile.key;
            return (
              <button key={tile.key} type="button" onClick={() => setExpandedSection(active ? 'all' : tile.key)} className="text-left">
                <Card className={
                  'border-slate-100 transition hover:shadow-md ' +
                  tile.activeTone +
                  (active ? ' ring-2 ring-slate-200' : '')
                }>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{tile.title}</p>
                      <span className={'rounded-full bg-slate-50 p-2 ' + tile.tone}>{tile.icon}</span>
                    </div>
                    <p className={'mt-2 text-3xl font-black ' + tile.tone}>{tile.count}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">Tyle samo co w sekcji poniżej</p>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-3" hidden={!sectionVisible('risk') && !sectionVisible('no_action') && !sectionVisible('waiting')}>
          <StableCard>
            <SectionHeader title={todaySectionLabels.no_action} count={noActionLeads.length} icon={<AlertTriangle className="h-5 w-5" />} tone="bg-amber-50 text-amber-700" />
            {noActionLeads.length ? noActionLeads.map(({ lead, risk }) => (
              <RowLink
                key={String(lead.id || getLeadTitle(lead))}
                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}
                title={getLeadTitle(lead)}
                helper={'Powód: ' + risk.reason}
                meta={'Ruch: ' + risk.suggestedAction}
                badge={readText(lead, ['status'], 'open')}
                onEdit={() => navigate(lead.id ? `/leads/${String(lead.id)}` : '/leads')}
                onDelete={() => void handleArchiveLead(lead)}
                deleting={actionPendingId === `lead:${String(lead.id || '')}`}
              />
            )) : <EmptyState text="Brak leadów bez najbliższej zaplanowanej akcji." />}
          </StableCard>

          <StableCard>
            <SectionHeader title={todaySectionLabels.risk} count={highValueAtRiskRows.length} icon={<TrendingUp className="h-5 w-5" />} tone="bg-rose-50 text-rose-700" />
            {highValueAtRiskRows.length ? highValueAtRiskRows.map(({ lead, risk, momentRaw }) => (
              <RowLink
                key={String(lead.id || getLeadTitle(lead))}
                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}
                title={getLeadTitle(lead)}
                helper={'Powód: ' + risk.reason}
                meta={'Ruch: ' + risk.suggestedAction + (momentRaw ? ' · ' + formatDateTime(momentRaw) : '')}
                badge={String(getLeadValue(lead)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' PLN'}
                onEdit={() => navigate(lead.id ? `/leads/${String(lead.id)}` : '/leads')}
                onDelete={() => void handleArchiveLead(lead)}
                deleting={actionPendingId === `lead:${String(lead.id || '')}`}
              />
            )) : <EmptyState text="Brak wartościowych leadów w ryzyku." />}
          </StableCard>

          <StableCard>
            <SectionHeader title={todaySectionLabels.waiting} count={waitingLeadRows.length} icon={<UserRound className="h-5 w-5" />} tone="bg-blue-50 text-blue-700" />
            {waitingLeadRows.length ? waitingLeadRows.map(({ lead, risk, momentRaw }) => (
              <RowLink
                key={String(lead.id || getLeadTitle(lead))}
                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}
                title={getLeadTitle(lead)}
                helper={'Powód: ' + risk.reason}
                meta={'Ruch: ' + risk.suggestedAction + (momentRaw ? ' · ' + formatDateTime(momentRaw) : '')}
                badge={readText(lead, ['status'], 'waiting')}
                onEdit={() => navigate(lead.id ? `/leads/${String(lead.id)}` : '/leads')}
                onDelete={() => void handleArchiveLead(lead)}
                deleting={actionPendingId === `lead:${String(lead.id || '')}`}
              />
            )) : <EmptyState text="Brak leadów w trybie waiting wymagających pilnej kontroli." />}
          </StableCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-2" hidden={!sectionVisible('leads') && !sectionVisible('tasks') && !sectionVisible('events') && !sectionVisible('drafts')}>
          <StableCard>
            <SectionHeader title={todaySectionLabels.leads} count={operatorLeads.length} icon={<UserRound className="h-5 w-5" />} tone="bg-blue-50 text-blue-700" />
            {operatorLeads.length ? operatorLeads.map(({ lead, momentRaw, risk }) => (
              <RowLink
                key={String(lead.id || getLeadTitle(lead))}
                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}
                title={getLeadTitle(lead)}
                helper={'Powód: ' + risk.reason}
                meta={'Ruch: ' + risk.suggestedAction + (momentRaw ? ' · ' + formatDateTime(momentRaw) : '')}
                badge={readText(lead, ['status'], 'open')}
                onEdit={() => navigate(lead.id ? `/leads/${String(lead.id)}` : '/leads')}
                onDelete={() => void handleArchiveLead(lead)}
                deleting={actionPendingId === `lead:${String(lead.id || '')}`}
              />
            )) : <EmptyState text="Brak leadów wymagających ruchu." />}
          </StableCard>

          <StableCard>
            <SectionHeader title={todaySectionLabels.tasks} count={operatorTasks.length} icon={<CheckSquare className="h-5 w-5" />} tone="bg-emerald-50 text-emerald-700" />
            {operatorTasks.length ? operatorTasks.map(({ task, momentRaw }) => {
              const caseRecord = task.caseId ? casesById.get(String(task.caseId)) : null;
              return (
                <RowLink
                  key={String(task.id || getTaskTitle(task))}
                  to="/tasks"
                  title={getTaskTitle(task)}
                  helper={caseRecord ? getCaseTitle(caseRecord) : readText(task, ['leadName', 'lead_name'], '')}
                  meta={formatDateTime(momentRaw)}
                  badge={getDateKey(momentRaw) < todayKey ? 'Zaległe' : 'Dziś'}
                onEdit={() => navigate('/tasks')}
                  onDelete={() => void handleDeleteTask(task)}
                  deleting={actionPendingId === `task:${String(task.id || '')}`}
                />
              );
            }) : <EmptyState text="Brak zadań zaległych lub na dziś." />}
          </StableCard>

          <StableCard>
            <SectionHeader title={todaySectionLabels.events} count={todayEvents.length} icon={<CalendarDays className="h-5 w-5" />} tone="bg-indigo-50 text-indigo-700" />
            {todayEvents.length ? todayEvents.map(({ event, momentRaw }) => (
              <RowLink
                key={String(event.id || event.title)}
                to="/calendar"
                title={readText(event, ['title'], 'Wydarzenie')}
                helper={readText(event, ['type'], 'event')}
                meta={formatDateTime(momentRaw)}
                badge="Dziś"
              onEdit={() => navigate('/calendar')}
                onDelete={() => void handleDeleteEvent(event)}
                deleting={actionPendingId === `event:${String(event.id || '')}`}
              />
            )) : <EmptyState text="Brak wydarzeń na dziś." />}
          </StableCard>

          <StableCard>
            <SectionHeader title={todaySectionLabels.drafts} count={pendingDrafts.length} icon={<FileText className="h-5 w-5" />} tone="bg-amber-50 text-amber-700" />
            {pendingDrafts.length ? pendingDrafts.map((draft: any) => (
              <RowLink
                key={String(draft.id || getDraftText(draft))}
                to="/ai-drafts"
                title={getDraftText(draft)}
                meta={formatDateTime(readText(draft, ['createdAt', 'created_at'], ''))}
                badge="Szkic"
              />
            )) : <EmptyState text="Brak szkiców do zatwierdzenia." />}
          </StableCard>
        </section>

        <div hidden={!sectionVisible('upcoming')}>
        <StableCard>
          <SectionHeader title={todaySectionLabels.upcoming} count={upcomingRows.length} icon={<CalendarDays className="h-5 w-5" />} tone="bg-indigo-50 text-indigo-700" />
          {upcomingRows.length ? upcomingRows.map((row) => (
            <RowLink
              key={row.id}
              to={row.to}
              title={row.title}
              helper={row.helper}
              meta={row.meta}
              badge={row.badge}
            />
          )) : <EmptyState text="Brak zaplanowanych akcji w kolejnych 7 dniach." />}
        </StableCard>
        </div>

        {loading ? (
          <div className="fixed bottom-4 right-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-lg">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Ładowanie danych
          </div>
        ) : null}
      </main>
    </Layout>
  );
}

