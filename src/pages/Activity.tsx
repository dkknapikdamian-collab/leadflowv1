import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Link2,
  ListChecks,
  Loader2,
  RotateCcw,
  Search,
  Target,
  Trash2,
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
  { value: 'today', label: 'DziĹ›' },
  { value: 'calendar', label: 'Kalendarz' },
  { value: 'lead', label: 'Leady' },
  { value: 'case', label: 'Sprawy' },
  { value: 'other', label: 'Inne' },
];

const activityTypeOptions = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'completed', label: 'Wykonane' },
  { value: 'restored', label: 'PrzywrĂłcone' },
  { value: 'deleted', label: 'UsuniÄ™te' },
  { value: 'created', label: 'Utworzone' },
  { value: 'updated', label: 'Aktualizacje' },
];

const relationOptions = [
  { value: 'all', label: 'Wszystkie relacje' },
  { value: 'lead', label: 'Z leadem' },
  { value: 'case', label: 'Ze sprawÄ…' },
  { value: 'standalone', label: 'Bez relacji' },
];

function formatActivityTime(value: any) {
  if (!value) return 'Brak daty';
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'Brak daty' : parsed.toLocaleString();
  }
  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  return 'Brak daty';
}

function normalizeText(value: any) {
  return typeof value === 'string' ? value.trim() : '';
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
  return activity.actorType === 'client' ? 'Klient' : 'Operator';
}

function getActivitySource(activity: any) {
  const eventType = normalizeText(activity?.eventType);
  const payloadSource = normalizeText(activity?.payload?.source).toLowerCase();

  if (payloadSource === 'today' || eventType.startsWith('today_')) return 'today';
  if (payloadSource === 'calendar' || eventType.startsWith('calendar_')) return 'calendar';
  if (eventType.startsWith('lead_') || activity?.leadId) return 'lead';
  if (eventType.startsWith('case_') || activity?.caseId) return 'case';

  return 'other';
}

function getActivityTypeBucket(activity: any) {
  const eventType = normalizeText(activity?.eventType);

  if (eventType.includes('completed')) return 'completed';
  if (eventType.includes('restored')) return 'restored';
  if (eventType.includes('deleted')) return 'deleted';
  if (eventType.includes('snoozed')) return 'updated';
  if (eventType.includes('created') || eventType.includes('added')) return 'created';
  if (eventType.includes('updated') || eventType.includes('changed')) return 'updated';

  return 'other';
}

function getSourceLabel(activity: any) {
  switch (getActivitySource(activity)) {
    case 'today':
      return 'DziĹ›';
    case 'calendar':
      return 'Kalendarz';
    case 'lead':
      return 'Lead';
    case 'case':
      return 'Sprawa';
    default:
      return 'System';
  }
}

function getActivityTypeIcon(activity: any) {
  const bucket = getActivityTypeBucket(activity);
  const source = getActivitySource(activity);

  if (bucket === 'completed') return CheckCircle2;
  if (bucket === 'restored') return RotateCcw;
  if (bucket === 'deleted') return Trash2;
  if (source === 'today') return ListChecks;
  if (source === 'calendar') return CalendarClock;
  if (source === 'lead') return Target;
  if (source === 'case') return Briefcase;

  return Clock;
}

function getActivityIconClass(activity: any) {
  const bucket = getActivityTypeBucket(activity);
  const source = getActivitySource(activity);

  if (bucket === 'completed') return 'bg-emerald-50 text-emerald-600';
  if (bucket === 'restored') return 'bg-amber-50 text-amber-600';
  if (bucket === 'deleted') return 'bg-rose-50 text-rose-600';
  if (source === 'today') return 'bg-indigo-50 text-indigo-600';
  if (source === 'calendar') return 'bg-sky-50 text-sky-600';
  if (source === 'lead') return 'bg-blue-50 text-blue-600';
  if (source === 'case') return 'bg-green-50 text-green-600';

  return 'bg-slate-100 text-slate-600';
}

function withTitle(base: string, title: string) {
  return title ? base + ': ' + title : base;
}

function getActivityActionLabel(activity: any) {
  const title = normalizeText(activity?.payload?.title);
  const status = normalizeText(activity?.payload?.status);
  const nextStatus = normalizeText(activity?.payload?.nextStatus);

  switch (activity?.eventType) {
    case 'calendar_entry_completed':
      return withTitle('oznaczyĹ‚ wpis kalendarza jako zrobiony', title);
    case 'calendar_entry_restored':
      return withTitle('przywrĂłciĹ‚ wpis kalendarza', title);
    case 'calendar_entry_deleted':
      return withTitle('usunÄ…Ĺ‚ wpis kalendarza', title);
    case 'today_task_completed':
      return withTitle('oznaczyĹ‚ zadanie z DziĹ› jako zrobione', title);
    case 'today_task_restored':
      return withTitle('przywrĂłciĹ‚ zadanie z DziĹ›', title);
    case 'today_task_deleted':
      return withTitle('usunÄ…Ĺ‚ zadanie z DziĹ›', title);
    case 'today_event_completed':
      return withTitle('oznaczyĹ‚ wydarzenie z DziĹ› jako zrobione', title);
    case 'today_event_restored':
      return withTitle('przywrĂłciĹ‚ wydarzenie z DziĹ›', title);
    case 'today_event_deleted':
      return withTitle('usunÄ…Ĺ‚ wydarzenie z DziĹ›', title);
    case 'today_task_snoozed':
      return withTitle('odĹ‚oĹĽyĹ‚ zadanie z DziĹ›', title);
    case 'today_event_snoozed':
      return withTitle('odĹ‚oĹĽyĹ‚ wydarzenie z DziĹ›', title);    case 'status_changed':
      return status ? 'zmieniĹ‚ status na ' + status : 'zmieniĹ‚ status';
    case 'case_lifecycle_started':
      return withTitle('rozpoczął realizację sprawy', title);
    case 'case_lifecycle_completed':
      return withTitle('zakończył sprawę', title);
    case 'case_lifecycle_reopened':
      return withTitle('wznowił sprawę do pracy', title);
    case 'case_created':
      return withTitle('uruchomiĹ‚ realizacjÄ™', title);
    case 'item_added':
      return withTitle('dodaĹ‚ element', title);
    case 'file_uploaded':
      return withTitle('wgraĹ‚ plik do', title);
    case 'decision_made':
      return withTitle('podjÄ…Ĺ‚ decyzjÄ™ w', title);
    case 'portal_token_created':
      return withTitle('wygenerowaĹ‚ link portalu dla', title);
    case 'case_reminder_requested':
      return 'wysĹ‚aĹ‚ przypomnienie i utworzyĹ‚ follow-up';
    case 'reminder_scheduled':
      return withTitle('zaplanowaĹ‚ przypomnienie', title);
    case 'task_created':
      return withTitle('dodaĹ‚ zadanie', title);
    case 'task_updated':
      return withTitle('zaktualizowaĹ‚ zadanie', title);
    case 'task_completed':
      return withTitle('oznaczyĹ‚ jako zrobione', title);
    case 'event_created':
      return withTitle('dodaĹ‚ wydarzenie', title);
    case 'event_updated':
      return withTitle('zaktualizowaĹ‚ wydarzenie', title);
    case 'event_deleted':
      return withTitle('usunÄ…Ĺ‚ wydarzenie', title);
    case 'note_added':
      return withTitle('dodaĹ‚ notatkÄ™', title);
    default:
      if (title) return withTitle('wykonaĹ‚ akcjÄ™', title);
      if (nextStatus) return 'wykonaĹ‚ akcjÄ™, nowy status: ' + nextStatus;
      return 'wykonaĹ‚ akcjÄ™';
  }
}

function getLeadContextLabel(activity: any, leadLookup: Map<string, string>) {
  const leadId = normalizeText(activity?.leadId);
  if (!leadId) return '';
  return leadLookup.get(leadId) || normalizeText(activity?.payload?.leadName) || normalizeText(activity?.payload?.title) || 'PowiÄ…zany lead';
}

function getCaseContextLabel(activity: any, caseLookup: Map<string, string>) {
  const caseId = normalizeText(activity?.caseId);
  if (!caseId) return '';
  return caseLookup.get(caseId) || normalizeText(activity?.payload?.caseTitle) || normalizeText(activity?.payload?.title) || 'PowiÄ…zana sprawa';
}

function getActivitySearchText(activity: any, leadLookup: Map<string, string>, caseLookup: Map<string, string>) {
  return [
    getActorLabel(activity),
    getActivityActionLabel(activity),
    getSourceLabel(activity),
    normalizeText(activity?.eventType),
    getLeadContextLabel(activity, leadLookup),
    getCaseContextLabel(activity, caseLookup),
    JSON.stringify(activity?.payload || {}),
  ]
    .join(' ')
    .toLowerCase();
}

function safePayloadPreview(payload: any) {
  try {
    return JSON.stringify(payload || {}, null, 2);
  } catch {
    return '{}';
  }
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function Activity() {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadLookup, setLeadLookup] = useState<Map<string, string>>(new Map());
  const [caseLookup, setCaseLookup] = useState<Map<string, string>>(new Map());
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [relationFilter, setRelationFilter] = useState('all');
  const [expandedPayloadIds, setExpandedPayloadIds] = useState<string[]>([]);

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
      fetchActivitiesFromSupabase({ limit: 100 }),
      fetchLeadsFromSupabase(),
      fetchCasesFromSupabase(),
    ])
      .then(([activityRows, leadRows, caseRows]) => {
        if (cancelled) return;
        setActivities(activityRows);
        setLeadLookup(buildLeadLookup(leadRows));
        setCaseLookup(buildCaseLookup(caseRows));
        setLoading(false);
      })
      .catch((error: any) => {
        if (cancelled) return;
        toast.error('BĹ‚Ä…d aktywnoĹ›ci API: ' + error.message);
        setActivities([]);
        setLeadLookup(new Map());
        setCaseLookup(new Map());
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [workspace?.id, workspaceLoading]);

  const filteredActivities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activities.filter((activity) => {
      const source = getActivitySource(activity);
      const bucket = getActivityTypeBucket(activity);
      const leadId = normalizeText(activity?.leadId);
      const caseId = normalizeText(activity?.caseId);

      if (sourceFilter !== 'all' && source !== sourceFilter) return false;
      if (typeFilter !== 'all' && bucket !== typeFilter) return false;
      if (relationFilter === 'lead' && !leadId) return false;
      if (relationFilter === 'case' && !caseId) return false;
      if (relationFilter === 'standalone' && (leadId || caseId)) return false;

      if (normalizedQuery) {
        return getActivitySearchText(activity, leadLookup, caseLookup).includes(normalizedQuery);
      }

      return true;
    });
  }, [activities, query, sourceFilter, typeFilter, relationFilter, leadLookup, caseLookup]);

  const metrics = useMemo(() => {
    return {
      all: activities.length,
      completed: activities.filter((activity) => getActivityTypeBucket(activity) === 'completed').length,
      restored: activities.filter((activity) => getActivityTypeBucket(activity) === 'restored').length,
      deleted: activities.filter((activity) => getActivityTypeBucket(activity) === 'deleted').length,
    };
  }, [activities]);

  const togglePayload = (id: string) => {
    setExpandedPayloadIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AktywnoĹ›Ä‡</h1>
            <p className="mt-1 text-slate-500">
              Operacyjna historia zmian z leadĂłw, spraw, ekranu DziĹ› i kalendarza.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            Widocznych: <span className="font-bold text-slate-900">{filteredActivities.length}</span> z{' '}
            <span className="font-bold text-slate-900">{activities.length}</span>
          </div>
        </header>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <MetricCard label="Wszystkie" value={metrics.all} icon={FileText} />
          <MetricCard label="Wykonane" value={metrics.completed} icon={CheckCircle2} />
          <MetricCard label="PrzywrĂłcone" value={metrics.restored} icon={RotateCcw} />
          <MetricCard label="UsuniÄ™te" value={metrics.deleted} icon={Trash2} />
        </div>

        <Card className="mb-6 border-none shadow-sm">
          <CardContent className="p-4">
            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Szukaj po tytule, leadzie, sprawie, typie zdarzenia..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                />
              </label>

              <label className="relative block">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                >
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              >
                {activityTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={relationFilter}
                onChange={(event) => setRelationFilter(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              >
                {relationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  Brak aktywnoĹ›ci pasujÄ…cej do filtrĂłw.
                </div>
              ) : (
                filteredActivities.map((activity) => {
                  const activityId = normalizeText(activity?.id) || String(activity?.createdAt || Math.random());
                  const leadLabel = getLeadContextLabel(activity, leadLookup);
                  const caseLabel = getCaseContextLabel(activity, caseLookup);
                  const leadId = normalizeText(activity?.leadId);
                  const caseId = normalizeText(activity?.caseId);
                  const actorLabel = getActorLabel(activity);
                  const actionLabel = getActivityActionLabel(activity);
                  const Icon = getActivityTypeIcon(activity);
                  const sourceLabel = getSourceLabel(activity);
                  const isPayloadExpanded = expandedPayloadIds.includes(activityId);

                  return (
                    <div key={activityId} className="p-5 transition-colors hover:bg-slate-50">
                      <div className="flex gap-4 items-start">
                        <div className={['shrink-0 rounded-xl p-2', getActivityIconClass(activity)].join(' ')}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                                  {sourceLabel}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                  {normalizeText(activity?.eventType) || 'event'}
                                </span>
                              </div>

                              <p className="text-sm font-semibold text-slate-900">
                                {actorLabel} {actionLabel}
                              </p>
                            </div>

                            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                              {formatActivityTime(activity.createdAt)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {leadLabel ? (
                              leadId ? (
                                <Link
                                  to={'/leads/' + leadId}
                                  className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                                >
                                  <Link2 className="h-3 w-3" />
                                  Lead: {leadLabel}
                                </Link>
                              ) : (
                                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                  Lead: {leadLabel}
                                </span>
                              )
                            ) : null}

                            {caseLabel ? (
                              caseId ? (
                                <Link
                                  to={'/cases/' + caseId}
                                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  <Link2 className="h-3 w-3" />
                                  Sprawa: {caseLabel}
                                </Link>
                              ) : (
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                  Sprawa: {caseLabel}
                                </span>
                              )
                            ) : null}
                          </div>

                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={() => togglePayload(activityId)}
                              className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                            >
                              {isPayloadExpanded ? 'Ukryj szczegĂłĹ‚y techniczne' : 'PokaĹĽ szczegĂłĹ‚y techniczne'}
                            </button>

                            {isPayloadExpanded ? (
                              <pre className="mt-3 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                                {safePayloadPreview(activity.payload)}
                              </pre>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
