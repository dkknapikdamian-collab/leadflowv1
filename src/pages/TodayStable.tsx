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
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; import { Card,
  CardContent } from '../components/ui/card'; import { Button } from '../components/ui/button'; import { Badge } from '../components/ui/badge'; import { ArrowRight,
  CalendarDays,
  CheckSquare,
  FileText,
  Loader2,
  RefreshCcw,
  UserRound } from 'lucide-react'; import {
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase
} from '../lib/supabase-fallback';
import { getAiLeadDraftsAsync, type AiLeadDraft } from '../lib/ai-drafts';
import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';

const P0_TODAY_STABLE_REBUILD = 'P0_TODAY_STABLE_REBUILD';
void P0_TODAY_STABLE_REBUILD;

type DashboardStatus = 'idle' | 'loading' | 'ready' | 'error';

type DashboardData = {
  tasks: any[];
  leads: any[];
  events: any[];
  cases: any[];
  drafts: AiLeadDraft[];
};

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
  const direct = readMomentRaw(task, ['scheduledAt', 'scheduled_at', 'dueAt', 'due_at', 'startAt', 'start_at', 'startsAt', 'starts_at', 'dateTime', 'date_time']);
  if (direct) return direct;

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
  const time = readText(lead, ['nextActionTime', 'next_action_time', 'followUpTime', 'follow_up_time'], '09:00');
  return date.includes('T') ? date : date + 'T' + time;
}

function getEventMomentRaw(event: any) {
  return readMomentRaw(event, ['startAt', 'start_at', 'startsAt', 'starts_at', 'scheduledAt', 'scheduled_at', 'dateTime', 'date_time']);
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

function RowLink({ to, title, meta, helper, badge }: { key?: string; to: string; title: string; meta?: string; helper?: string; badge?: string }) {
  return (
    <Link to={to} className="block border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50">
      <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900 break-words">{title}</p>
            {badge ? <Badge variant="outline" className="rounded-full">{badge}</Badge> : null}
          </div>
          {helper ? <p className="mt-1 text-sm text-slate-600 break-words">{helper}</p> : null}
          {meta ? <p className="mt-1 text-xs font-medium text-slate-500">{meta}</p> : null}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </Link>
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
  const [status, setStatus] = useState<DashboardStatus>('idle');
  const [data, setData] = useState<DashboardData>(emptyData);
  const [lastLoadedAt, setLastLoadedAt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const refreshData = useCallback(async () => {
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

  const casesById = useMemo(() => new Map(data.cases.map((caseRecord: any) => [String(caseRecord.id || ''), caseRecord])), [data.cases]);

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
    return data.leads
      .filter((lead) => !isClosedLead(lead))
      .map((lead) => ({ lead, momentRaw: getLeadMomentRaw(lead) }))
      .filter((entry) => {
        const dateKey = getDateKey(entry.momentRaw);
        return !dateKey || dateKey <= todayKey;
      })
      .sort((a, b) => {
        if (!a.momentRaw && b.momentRaw) return -1;
        if (a.momentRaw && !b.momentRaw) return 1;
        return parseTime(a.momentRaw) - parseTime(b.momentRaw);
      });
  }, [data.leads, todayKey]);

  const todayEvents = useMemo(() => {
    return data.events
      .filter((event) => !isClosedStatus(event?.status))
      .map((event) => ({ event, momentRaw: getEventMomentRaw(event) }))
      .filter((entry) => getDateKey(entry.momentRaw) === todayKey)
      .sort(sortByMoment);
  }, [data.events, todayKey]);

  const pendingDrafts = useMemo(() => {
    return data.drafts.filter((draft: any) => String(draft?.status || '').toLowerCase() === 'draft');
  }, [data.drafts]);

  const loading = status === 'loading' || status === 'idle';

  return (
    <Layout>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6" data-p0-today-stable-rebuild="true">
        <section className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge className="mb-3 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50">Dziś</Badge>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Centrum pracy na dziś</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {lastLoadedAt ? <span className="text-xs font-semibold text-slate-500">Ostatni odczyt: {lastLoadedAt}</span> : null}
              <Button type="button" variant="outline" onClick={() => void refreshData()} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Odśwież dane
              </Button>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Leady do ruchu</p><p className="mt-2 text-3xl font-black text-blue-700">{operatorLeads.length}</p></CardContent></Card>
          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Zadania zaległe i dziś</p><p className="mt-2 text-3xl font-black text-emerald-700">{operatorTasks.length}</p></CardContent></Card>
          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Wydarzenia dziś</p><p className="mt-2 text-3xl font-black text-indigo-700">{todayEvents.length}</p></CardContent></Card>
          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Szkice AI</p><p className="mt-2 text-3xl font-black text-amber-700">{pendingDrafts.length}</p></CardContent></Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <StableCard>
            <SectionHeader title="Leady do ruchu" count={operatorLeads.length} icon={<UserRound className="h-5 w-5" />} tone="bg-blue-50 text-blue-700" />
            {operatorLeads.length ? operatorLeads.map(({ lead, momentRaw }) => (
              <RowLink
                key={String(lead.id || getLeadTitle(lead))}
                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}
                title={getLeadTitle(lead)}
                helper={momentRaw ? 'Zaległy lub dzisiejszy kontakt' : 'Brak następnego kroku'}
                meta={momentRaw ? formatDateTime(momentRaw) : 'Ustal następny krok'}
                badge={readText(lead, ['status'], 'open')}
              />
            )) : <EmptyState text="Brak leadów wymagających ruchu." />}
          </StableCard>

          <StableCard>
            <SectionHeader title="Zadania na dziś" count={operatorTasks.length} icon={<CheckSquare className="h-5 w-5" />} tone="bg-emerald-50 text-emerald-700" />
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
                />
              );
            }) : <EmptyState text="Brak zadań zaległych lub na dziś." />}
          </StableCard>

          <StableCard>
            <SectionHeader title="Wydarzenia" count={todayEvents.length} icon={<CalendarDays className="h-5 w-5" />} tone="bg-indigo-50 text-indigo-700" />
            {todayEvents.length ? todayEvents.map(({ event, momentRaw }) => (
              <RowLink
                key={String(event.id || event.title)}
                to="/calendar"
                title={readText(event, ['title'], 'Wydarzenie')}
                helper={readText(event, ['type'], 'event')}
                meta={formatDateTime(momentRaw)}
                badge="Dziś"
              />
            )) : <EmptyState text="Brak wydarzeń na dziś." />}
          </StableCard>

          <StableCard>
            <SectionHeader title="Szkice do zatwierdzenia" count={pendingDrafts.length} icon={<FileText className="h-5 w-5" />} tone="bg-amber-50 text-amber-700" />
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

        {loading ? (
          <div className="fixed bottom-4 right-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-lg">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Ładowanie danych
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
