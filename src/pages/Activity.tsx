import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity as ActivityIcon, ArrowUpRight, CalendarClock, CheckCircle2, Clock, Filter, Link2, ListChecks, Loader2, Search } from 'lucide-react';
import {
  CaseEntityIcon,
  ClientEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  NotificationEntityIcon,
  TemplateEntityIcon
} from '../components/ui-system';

import Layout from '../components/Layout';
import '../styles/visual-stage8-activity-vnext.css';
import '../styles/closeflow-activity-visual-source-truth-stage181u.css';
import '../styles/hotfix-right-rail-dark-wrappers.css';
import '../styles/closeflow-activity-rail-force-colors-stage181v.css';
import {
  StatShortcutCard
} from '../components/StatShortcutCard';
import {
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchLeadsFromSupabase,
  isSupabaseConfigured
} from '../lib/supabase-fallback';
import {
  toast
} from 'sonner';
import {
  useWorkspace
} from '../hooks/useWorkspace';
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';
import {
  ACTIVITY_FILTER_OPTIONS as activityFilters,
  ACTIVITY_RELATION_OPTIONS as relationOptions,
  ACTIVITY_SOURCE_OPTIONS as sourceOptions,
  ACTIVITY_TYPE_OPTIONS as activityTypeOptions,
  buildCaseLookup,
  buildLeadLookup,
  formatActivityTime,
  getActivityEntity,
  getActivityIconTone,
  getActivityMetaText as getActivityMeta,
  getActivityPillLabel,
  getActivityRelation,
  getActivityRelationKind,
  getActivitySearchText,
  getActivitySeverity,
  getActivitySource,
  getActivityTitle,
  getActivityType,
  isActivityToday,
  normalizeActivityText as normalizeText,
  requiresActivityAttention as requiresAttention,
  shouldShowActivityByFilter as shouldShowByFilter,
} from '../lib/source-of-truth/activity-options';
import '../styles/closeflow-canvas-runtime-source-truth-stage211j.css';
function getActivityIcon(activity: any) {
  switch (getActivityEntity(activity)) {
    case 'lead':
      return LeadEntityIcon;
    case 'case':
      return CaseEntityIcon;
    case 'task':
      return ListChecks;
    case 'event':
      return CalendarClock;
    case 'client':
      return ClientEntityIcon;
    default:
      return Clock;
  }
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
      <div
        className={getActivitySeverity(activity) ? 'cf-severity-dot' : ['activity-row-icon', 'activity-row-icon-' + tone].join(' ')}
        data-cf-severity={getActivitySeverity(activity)}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="activity-row-main">
        <div className="activity-row-heading">
          <span className="activity-row-type">{pill}</span>
          {requiresAttention(activity) ? (
            <span className="cf-severity-pill" data-cf-severity={getActivitySeverity(activity)}>
              Wymaga uwagi
            </span>
          ) : null}
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


const ACTIVITY_ACTION_COLOR_TAXONOMY_V1 = 'activity action visual taxonomy V1';
function activityActionVisualKind(row: Record<string, unknown> | null | undefined) {
  return inferCloseFlowActionVisualKind(row);
}
function activityActionVisualClass(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualClass(row);
}
function activityActionDataKind(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualDataKind(row);
}
function activityActionKindClass(kind: unknown) {
  return getCloseFlowActionKindClass(kind);
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
        <CloseFlowPageHeaderV2 pageKey="activity" />

        <section className="activity-stats-grid" aria-label="Statystyki aktywności">
          <StatShortcutCard label="Wszystkie" value={metrics.all} icon={TemplateEntityIcon} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-all" />
          <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={Clock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-today" valueClassName="cf-activity-metric-value-today" />
          <StatShortcutCard label="Leady" value={metrics.leads} icon={LeadEntityIcon} active={activeFilter === 'lead'} onClick={() => setActiveFilter('lead')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-lead" valueClassName="cf-activity-metric-value-lead" />
          <StatShortcutCard label="Sprawy" value={metrics.cases} icon={CaseEntityIcon} active={activeFilter === 'case'} onClick={() => setActiveFilter('case')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-case" valueClassName="cf-activity-metric-value-case" />
          <StatShortcutCard label="Zadania" value={metrics.tasks} icon={ListChecks} active={activeFilter === 'task'} onClick={() => setActiveFilter('task')} iconClassName="cf-activity-metric-icon cf-activity-metric-icon-task" valueClassName="cf-activity-metric-value-task" />
          <StatShortcutCard label="Wymaga uwagi" value={metrics.attention} icon={NotificationEntityIcon} active={activeFilter === 'attention'} onClick={() => setActiveFilter('attention')} tone="red" />
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
                    data-activity-filter-kind={filter.value}
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

              <label className="activity-search-box cf-main-search cf-main-search-stage175" data-cf-main-search-source="stage173" data-cf-main-search-stage175="true">
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
                  <EntityIcon entity="template" className="h-8 w-8" />
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
            <section className="right-card activity-right-card" data-activity-rail-card="filters">
              <div className="activity-right-card-head">
                <Filter className="h-4 w-4" />
                <h2>Szybkie filtry</h2>
              </div>
              <button type="button" onClick={() => setActiveFilter('today')} className="activity-rail-button" data-activity-rail-button="today">
                <span>Dzisiaj</span>
                <strong>{metrics.today}</strong>
              </button>
              <button type="button" onClick={() => setActiveFilter('attention')} className="activity-rail-button" data-activity-rail-button="attention">
                <span>Wymaga uwagi</span>
                <strong>{metrics.attention}</strong>
              </button>
            </section>

            <section className="right-card activity-right-card" data-activity-rail-card="cases">
              <div className="activity-right-card-head">
                <EntityIcon entity="case" className="h-4 w-4" />
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

            <section className="right-card activity-right-card" data-activity-rail-card="leads">
              <div className="activity-right-card-head">
                <EntityIcon entity="lead" className="h-4 w-4" />
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
