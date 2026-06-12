import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Clock3, Filter, Loader2, RefreshCw, ShieldAlert, Target } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-metric-tiles.css';
import '../styles/sales-funnel-stage231d0f-visual-alignment.css';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
} from '../lib/supabase-fallback';
import {
  buildSalesFunnelMovementView,
  type SalesFunnelMovementCard,
  type SalesFunnelMovementView,
} from '../lib/owner-control/sales-funnel-movement';

const STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW = 'read-only owner sales funnel movement view: next-step silence risk value';
const STAGE227B_SALES_FUNNEL_DECISION_LIST = 'sales funnel is a readable owner decision list, not a crowded CRM kanban';
const STAGE228A_FUNNEL_TRUTH_CLICKABILITY = 'funnel money tile is traceable to visible cards and owner/stage filters do not hide source records';
const STAGE227F6_SALES_FUNNEL_FULL_WIDTH_CANVAS = 'Sales funnel uses shared full width canvas and stable gutters, not centered narrow max-width';
const STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT = 'funnel owner dashboard visual alignment: owner decision tiles, stage strip, decision cards and priority rail';
const STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY = 'funnel owner tiles use explicit semantic color/icon map and stage filters share client filter visual language';
const STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER = 'funnel icon color source truth uses closeflow metric tiles and records header is one row';
const STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR = 'records header line-level repair removes stale visibleLabel/title fragments';
// Stage227A static guard compatibility markers only, not rendered kanban columns:
// data-stage227a-sales-funnel-movement-view="true" data-stage227a-funnel-summary="true" data-stage227a-funnel-column="true" data-stage227a-funnel-card="true" data-stage227a-funnel-next-step="true" data-stage227a-funnel-silence-age="true" data-stage227a-funnel-risk-flag="true" data-stage227a-funnel-value="true"
void STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW;
void STAGE227B_SALES_FUNNEL_DECISION_LIST;
void STAGE228A_FUNNEL_TRUTH_CLICKABILITY;
void STAGE227F6_SALES_FUNNEL_FULL_WIDTH_CANVAS;
void STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT;
void STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY;
void STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER;
void STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR;

type LoadState = {
  leads: any[];
  cases: any[];
  clients: any[];
  tasks: any[];
  events: any[];
  payments: any[];
};

export type OwnerFilter = 'all' | 'move_now' | 'no_next_move' | 'silent_7' | 'high_risk' | 'money';
export type StageFilter = 'all' | string;

type FunnelMetricTone = 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple';
type FunnelStageTone = 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple';
type FunnelTileFilter = Exclude<OwnerFilter, 'all'>;
type FunnelTileDefinition = {
  label: string;
  helper: string;
  tone: FunnelMetricTone;
  Icon: ComponentType<{ className?: string }>;
};

type FunnelFilterState = {
  ownerFilter: OwnerFilter;
  stageFilter: StageFilter;
};

const FUNNEL_OWNER_TILE_TONE_MAP: Record<FunnelTileFilter, FunnelTileDefinition> = {
  move_now: {
    label: 'Do ruchu teraz',
    helper: 'Ryzyko, cisza albo brak kroku.',
    tone: 'blue',
    Icon: Target,
  },
  no_next_move: {
    label: 'Bez kroku',
    helper: 'Rekordy bez akcji.',
    tone: 'amber',
    Icon: Filter,
  },
  silent_7: {
    label: 'Cisza 7+',
    helper: 'Brak kontaktu 7+ dni.',
    tone: 'purple',
    Icon: Clock3,
  },
  high_risk: {
    label: 'Wysokie ryzyko',
    helper: 'High i critical.',
    tone: 'red',
    Icon: ShieldAlert,
  },
  money: {
    label: 'Pieniądze',
    helper: 'Źródła kwoty.',
    tone: 'green',
    Icon: ArrowRight,
  },
};

function resolveFunnelStageFilterTone(key: string, label: string): FunnelStageTone {
  const source = `${key} ${label}`.toLowerCase();
  if (key === 'all' || source.includes('wszystkie')) return 'blue';
  if (source.includes('utrac') || source.includes('lost')) return 'red';
  if (source.includes('obsług') || source.includes('obslug') || source.includes('won') || source.includes('wygran')) return 'green';
  if (source.includes('negocj')) return 'purple';
  if (source.includes('kontakt')) return 'purple';
  if (source.includes('kwalifik') || source.includes('oferta') || source.includes('czeka') || source.includes('odp')) return 'amber';
  if (source.includes('now')) return 'blue';
  return 'neutral';
}

function buildDateRange(now = new Date()) {
  const from = new Date(now.getTime() - 120 * 86_400_000).toISOString();
  const to = new Date(now.getTime() + 180 * 86_400_000).toISOString();
  return { from, to, limit: 200 };
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency || 'PLN',
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch {
    return `${Math.round(value || 0).toLocaleString('pl-PL')} ${currency || 'PLN'}`;
  }
}

function formatDateTime(value: string | null) {
  if (!value) return 'Brak daty';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Brak daty';
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function silenceLabel(days: number | null) {
  if (days === null || days === undefined) return 'Brak daty kontaktu';
  if (days <= 0) return 'Kontakt dzisiaj';
  if (days === 1) return '1 dzień ciszy';
  return `${days} dni ciszy`;
}

function riskLabel(level: SalesFunnelMovementCard['riskLevel']) {
  if (level === 'critical') return 'krytyczne';
  if (level === 'high') return 'wysokie';
  if (level === 'medium') return 'średnie';
  return 'niskie';
}

function riskRank(level: SalesFunnelMovementCard['riskLevel']) {
  if (level === 'critical') return 4;
  if (level === 'high') return 3;
  if (level === 'medium') return 2;
  return 1;
}

function isHighRisk(card: SalesFunnelMovementCard) {
  return card.riskLevel === 'critical' || card.riskLevel === 'high';
}

function needsMovement(card: SalesFunnelMovementCard) {
  return !card.hasNextMove || (typeof card.silenceDays === 'number' && card.silenceDays >= 7) || isHighRisk(card);
}

function cardSort(left: SalesFunnelMovementCard, right: SalesFunnelMovementCard) {
  const riskDiff = riskRank(right.riskLevel) - riskRank(left.riskLevel);
  if (riskDiff) return riskDiff;

  const leftNoMove = left.hasNextMove ? 0 : 1;
  const rightNoMove = right.hasNextMove ? 0 : 1;
  if (rightNoMove !== leftNoMove) return rightNoMove - leftNoMove;

  const leftSilence = typeof left.silenceDays === 'number' ? left.silenceDays : -1;
  const rightSilence = typeof right.silenceDays === 'number' ? right.silenceDays : -1;
  if (rightSilence !== leftSilence) return rightSilence - leftSilence;

  return (right.valueAmount || 0) - (left.valueAmount || 0);
}

function riskBadgeClass(level: SalesFunnelMovementCard['riskLevel']) {
  if (level === 'critical') return 'border-red-200 bg-red-50 text-red-700';
  if (level === 'high') return 'border-amber-200 bg-amber-50 text-amber-800';
  if (level === 'medium') return 'border-sky-200 bg-sky-50 text-sky-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function getMoneyTotalForCards(cards: SalesFunnelMovementCard[]) {
  return Math.round(cards.reduce((sum, card) => sum + Math.max(0, card.valueAmount || 0), 0) * 100) / 100;
}

export function getCardsForOwnerFilter(cards: SalesFunnelMovementCard[], filter: OwnerFilter) {
  if (filter === 'move_now') return cards.filter(needsMovement);
  if (filter === 'no_next_move') return cards.filter((card) => !card.hasNextMove);
  if (filter === 'silent_7') return cards.filter((card) => typeof card.silenceDays === 'number' && card.silenceDays >= 7);
  if (filter === 'high_risk') return cards.filter(isHighRisk);
  if (filter === 'money') return cards.filter((card) => (card.valueAmount || 0) > 0);
  return cards;
}

export function countByFilter(cards: SalesFunnelMovementCard[], filter: OwnerFilter) {
  return getCardsForOwnerFilter(cards, filter).length;
}

export function getCardsForStageFilter(cards: SalesFunnelMovementCard[], stageFilter: StageFilter) {
  if (stageFilter === 'all') return cards;
  return cards.filter((card) => card.stageKey === stageFilter);
}

export function getCardsForActiveFunnelFilter(cards: SalesFunnelMovementCard[], ownerFilter: OwnerFilter, stageFilter: StageFilter) {
  return getCardsForOwnerFilter(getCardsForStageFilter(cards, stageFilter), ownerFilter).slice().sort(cardSort);
}

export function resolveFunnelFilterAfterOwnerClick(ownerFilter: OwnerFilter): FunnelFilterState {
  return { ownerFilter, stageFilter: 'all' };
}

export function resolveFunnelFilterAfterStageClick(stageFilter: StageFilter): FunnelFilterState {
  return { ownerFilter: 'all', stageFilter };
}

function ownerFilterLabel(filter: OwnerFilter) {
  if (filter === 'move_now') return 'Do ruchu teraz';
  if (filter === 'no_next_move') return 'Bez następnego kroku';
  if (filter === 'silent_7') return 'Cisza 7+';
  if (filter === 'high_risk') return 'Wysokie ryzyko';
  if (filter === 'money') return 'Pieniądze';
  return 'Wszystkie rekordy';
}

function activeFilterLabel(ownerFilter: OwnerFilter, stageFilter: StageFilter, stageLabel: string) {
  if (ownerFilter !== 'all') return ownerFilterLabel(ownerFilter);
  if (stageFilter !== 'all') return stageLabel;
  return 'Wszystkie rekordy';
}


function FunnelOwnerDecisionTile({
  filter,
  active,
  value,
  onClick,
}: {
  filter: FunnelTileFilter;
  active: boolean;
  value: string | number;
  onClick: () => void;
}) {
  const definition = FUNNEL_OWNER_TILE_TONE_MAP[filter];
  const Icon = definition.Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cf-funnel-owner-decision-tile cf-top-metric-tile ${active ? 'is-active' : ''}`}
      data-stage227b-owner-filter="true"
      data-stage228a-clickable-filter="true"
      data-stage231d0f-owner-decision-tile="true"
      data-stage231d0f-r2-owner-tile-tone={filter}
      data-eliteflow-metric-tone={definition.tone}
    >
      <span className={`cf-top-metric-tile-content ${active ? 'is-active' : ''}`}>
        <span className="cf-top-metric-tile-left">
          <span className="cf-top-metric-tile-label">{definition.label}</span>
          <span className="cf-top-metric-tile-helper">{definition.helper}</span>
        </span>
        <span className="cf-top-metric-tile-value-row">
          <span className="cf-top-metric-tile-value">{value}</span>
          <span className="cf-top-metric-tile-icon" aria-hidden="true"><Icon className="h-4 w-4" /></span>
        </span>
      </span>
    </button>
  );
}

function FunnelStageFilterChip({
  active,
  label,
  count,
  value,
  tone = 'neutral',
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  value: number;
  tone?: FunnelStageTone;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cf-funnel-stage-filter-chip cf-filter-pill ${active ? 'cf-status-pill' : 'pill'}`}
      data-cf-status-tone={active ? tone : undefined}
      data-stage227b-stage-filter="true"
      data-stage228a-clickable-filter="true"
      data-stage231d0f-stage-filter-chip="true"
      data-stage231d0f-r2-filter-tone={tone}
    >
      <span className="cf-funnel-stage-filter-chip-main">
        <strong className="cf-funnel-stage-filter-chip-label">{label}</strong>
        <span className="cf-funnel-stage-filter-chip-count">{count}</span>
      </span>
      <span className="cf-funnel-stage-filter-chip-value">{formatMoney(value, 'PLN')}</span>
    </button>
  );
}

function FunnelDecisionSignal({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="cf-funnel-decision-signal" data-stage227b-signal="true" data-stage231d0f-decision-signal="true">
      <div className="cf-funnel-decision-signal-label">{label}</div>
      <div className={`cf-funnel-decision-signal-value ${strong ? 'is-strong' : ''}`}>{value}</div>
    </div>
  );
}



function FunnelDecisionListCard({ card }: { card: SalesFunnelMovementCard }) {
  const primaryReason = card.riskReasons[0] || (card.hasNextMove ? 'Ruch zaplanowany' : 'Brak następnego kroku');
  const movementTone = needsMovement(card) ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <article
      className="cf-funnel-decision-list-card"
      data-stage227b-funnel-list-card="true"
      data-stage227a-funnel-card="true"
      data-stage228a-money-source-card={card.valueAmount > 0 ? 'true' : 'false'}
      data-stage231d0f-decision-list-card="true"
    >
      <div className="cf-funnel-decision-card-head">
        <div className="cf-funnel-decision-card-badges">
          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
            {card.entityType === 'lead' ? 'Lead' : 'Sprawa'}
          </Badge>
          <Badge variant="outline" className={riskBadgeClass(card.riskLevel)} data-stage227a-funnel-risk-flag="true">
            <ShieldAlert className="mr-1 h-3 w-3" />
            {riskLabel(card.riskLevel)} ryzyko
          </Badge>
          <Badge variant="outline" className={movementTone}>
            {needsMovement(card) ? 'Do decyzji' : 'Ruch zaplanowany'}
          </Badge>
        </div>
        <h3 className="cf-funnel-decision-card-title">{card.title}</h3>
        {card.subtitle ? <p className="cf-funnel-decision-card-subtitle">{card.subtitle}</p> : null}
        <p className="cf-funnel-decision-card-reason">{primaryReason}</p>
      </div>

      <div className="cf-funnel-decision-signal-grid">
        <FunnelDecisionSignal label="Etap" value={card.stageLabel} strong />
        <div data-stage227a-funnel-silence-age="true"><FunnelDecisionSignal label="Kontakt" value={silenceLabel(card.silenceDays)} strong /></div>
        <div data-stage227a-funnel-next-step="true"><FunnelDecisionSignal label="Następny krok" value={card.hasNextMove ? `${card.nextMoveTitle || 'Zaplanowany'} · ${formatDateTime(card.nextMoveAt)}` : 'Brak'} strong={!card.hasNextMove} /></div>
        <div data-stage227a-funnel-value="true"><FunnelDecisionSignal label={card.valueSourceLabel || 'Wartość/prowizja'} value={formatMoney(card.valueAmount, card.valueCurrency)} strong /></div>
      </div>

      <Link
        to={card.href}
        className="cf-funnel-decision-open-link"
        data-stage227b-open-detail="true"
        data-stage228a-clickable-detail="true"
      >
        {card.entityType === 'case' ? 'Otwórz sprawę' : 'Otwórz lead'}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}


export function SalesFunnel() {
  const [data, setData] = useState<LoadState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('all');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');

  const load = async () => {
    const now = new Date();
    const range = buildDateRange(now);
    setLoading(true);
    setError(null);
    try {
      const [leads, cases, clients, tasks, events, payments] = await Promise.all([
        fetchLeadsFromSupabase({ visibility: 'active' }),
        fetchCasesFromSupabase({ includeArchived: false }),
        fetchClientsFromSupabase({ includeArchived: false }),
        fetchTasksFromSupabase(range),
        fetchEventsFromSupabase(range),
        fetchPaymentsFromSupabase(),
      ]);
      setData({ leads, cases, clients, tasks, events, payments });
      setLoadedAt(now.toISOString());
    } catch (caught) {
      console.error('STAGE228A_SALES_FUNNEL_LOAD_FAILED', caught);
      setError(caught instanceof Error ? caught.message : 'Nie udało się pobrać danych lejka.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const view: SalesFunnelMovementView = useMemo(
    () => buildSalesFunnelMovementView({
      leads: data?.leads || [],
      cases: data?.cases || [],
      clients: data?.clients || [],
      tasks: data?.tasks || [],
      events: data?.events || [],
      payments: data?.payments || [],
      now: loadedAt ? new Date(loadedAt) : new Date(),
    }),
    [data, loadedAt],
  );

  const allCards = useMemo(() => view.columns.flatMap((column) => column.cards).sort(cardSort), [view]);
  const filteredCards = useMemo(() => getCardsForActiveFunnelFilter(allCards, ownerFilter, stageFilter), [allCards, ownerFilter, stageFilter]);
  const topPriority = filteredCards[0] || null;
  const moneyCards = useMemo(() => getCardsForOwnerFilter(allCards, 'money'), [allCards]);
  const totalValue = getMoneyTotalForCards(moneyCards);

  const stageOptions = useMemo(
    () => view.columns.map((column) => ({
      key: column.key,
      label: column.label,
      count: column.cards.length,
      value: getMoneyTotalForCards(column.cards),
    })),
    [view],
  );

  const activeStageLabel = stageFilter === 'all'
    ? 'Wszystkie etapy'
    : stageOptions.find((stage) => stage.key === stageFilter)?.label || 'Wybrany etap';
  const visibleLabel = activeFilterLabel(ownerFilter, stageFilter, activeStageLabel);

  const applyOwnerFilter = (nextOwnerFilter: OwnerFilter) => {
    const next = resolveFunnelFilterAfterOwnerClick(nextOwnerFilter);
    setOwnerFilter(next.ownerFilter);
    setStageFilter(next.stageFilter);
  };

  const applyStageFilter = (nextStageFilter: StageFilter) => {
    const next = resolveFunnelFilterAfterStageClick(nextStageFilter);
    setOwnerFilter(next.ownerFilter);
    setStageFilter(next.stageFilter);
  };

  return (
    <Layout>
      <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 sales-funnel-stage227f6-page cf-html-view main-funnel-html" data-stage231d0f-funnel-owner-dashboard="true" data-stage227a-sales-funnel-movement-view="true" data-stage227b-decision-list-view="true" data-stage228a-funnel-truth-clickability="true" data-stage227f6-sales-funnel-wide-shell="true">
        <div className="sales-funnel-stage227f6-canvas space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Panel właściciela</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Lejek ruchu</h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  Czytelna lista decyzji. Liczby w kaflach prowadzą do widocznych rekordów — kliknij kafel, żeby zobaczyć źródło. Bez przeładowanego kanbana.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => void load()} disabled={loading} className="gap-2 rounded-2xl">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Odśwież
              </Button>
            </div>
          </div>

          {error ? (
            <Card className="border-red-200 bg-red-50 text-red-800">
              <CardContent className="flex items-center gap-3 p-4 text-sm font-semibold">
                <AlertTriangle className="h-5 w-5" />
                {error}
              </CardContent>
            </Card>
          ) : null}

          <section className="cf-funnel-owner-decision-grid grid gap-3 md:grid-cols-2 xl:grid-cols-5" data-stage231d0f-r2-owner-color-map="true" data-stage231d0f-owner-decision-row="true" data-stage227b-owner-filter-row="true" data-stage227a-funnel-summary="true">
            <FunnelOwnerDecisionTile filter="move_now" active={ownerFilter === 'move_now'} value={countByFilter(allCards, 'move_now')} onClick={() => applyOwnerFilter('move_now')} />
            <FunnelOwnerDecisionTile filter="no_next_move" active={ownerFilter === 'no_next_move'} value={countByFilter(allCards, 'no_next_move')} onClick={() => applyOwnerFilter('no_next_move')} />
            <FunnelOwnerDecisionTile filter="silent_7" active={ownerFilter === 'silent_7'} value={countByFilter(allCards, 'silent_7')} onClick={() => applyOwnerFilter('silent_7')} />
            <FunnelOwnerDecisionTile filter="high_risk" active={ownerFilter === 'high_risk'} value={countByFilter(allCards, 'high_risk')} onClick={() => applyOwnerFilter('high_risk')} />
            <FunnelOwnerDecisionTile filter="money" active={ownerFilter === 'money'} value={formatMoney(totalValue, view.summary.currency || 'PLN')} onClick={() => applyOwnerFilter('money')} />
          </section>

          <section className="cf-funnel-stage-filter-strip cf-contact-cadence-strip cf-filter-strip" data-stage231d0f-r2-filter-parity-strip="true" data-stage231d0f-stage-filter-strip="true" data-stage227b-stage-filter-strip="true">
            <div className="cf-funnel-stage-filter-header">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Filter className="h-4 w-4 text-blue-600" />
                Etapy jako filtr, nie ściśnięte kolumny
              </div>
              <button type="button" onClick={() => applyStageFilter('all')} className="cf-funnel-stage-show-all" data-stage228a-show-all="true">
                Pokaż wszystkie
              </button>
            </div>
            <div className="cf-funnel-stage-filter-scroll cf-contact-cadence-pills cf-filter-pills">
              <FunnelStageFilterChip active={stageFilter === 'all' && ownerFilter === 'all'} label="Wszystkie" count={allCards.length} value={totalValue} tone="blue" onClick={() => applyStageFilter('all')} />
              {stageOptions.map((stage) => (
                <FunnelStageFilterChip
                  key={stage.key}
                  active={ownerFilter === 'all' && stageFilter === stage.key}
                  label={stage.label}
                  count={stage.count}
                  value={stage.value}
                  tone={resolveFunnelStageFilterTone(stage.key, stage.label)}
                  onClick={() => applyStageFilter(stage.key)}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-3" data-stage227b-decision-list="true">
              <div className="cf-funnel-records-header-row" data-stage231d0f-r3-records-header-row="true" data-stage231d0f-r5-records-header-line-repair="true">
                <h2 className="cf-funnel-records-title">{visibleLabel} · rekordy w aktywnym widoku</h2>
                <div className="cf-funnel-records-count">Pokazuję {filteredCards.length} z {allCards.length} rekordów</div>
              </div>

              {loading ? (
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="flex items-center gap-3 p-6 text-sm font-semibold text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Ładowanie lejka ruchu...
                  </CardContent>
                </Card>
              ) : filteredCards.length ? (
                filteredCards.map((card) => <FunnelDecisionListCard key={card.id} card={card} />)
              ) : (
                <Card className="border-dashed border-slate-300 bg-white shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Target className="mx-auto h-8 w-8 text-slate-400" />
                    <h3 className="mt-3 text-base font-black text-slate-900">Brak rekordów w tym filtrze</h3>
                    <p className="mt-1 text-sm text-slate-500">Zmień etap albo filtr właścicielski.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <aside className="cf-funnel-owner-priority-rail space-y-3 xl:sticky xl:top-5 xl:self-start" data-stage231d0f-owner-priority-rail="true" data-stage227b-owner-priority-panel="true">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Target className="h-4 w-4 text-blue-600" />
                    Priorytet teraz
                  </div>
                  {topPriority ? (
                    <div className="mt-4 space-y-3">
                      <div>
                        <Badge variant="outline" className={riskBadgeClass(topPriority.riskLevel)}>{riskLabel(topPriority.riskLevel)} ryzyko</Badge>
                        <h3 className="mt-2 text-base font-black text-slate-950">{topPriority.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{topPriority.entityType === 'case' ? 'Sprawa' : 'Lead'} · {topPriority.stageLabel}</p>
                      </div>
                      <div className="cf-funnel-priority-reason">
                        {topPriority.riskReasons[0] || (topPriority.hasNextMove ? 'Ruch jest zaplanowany.' : 'Brak następnego kroku.')}
                      </div>
                      <Link to={topPriority.href} className="cf-funnel-priority-link inline-flex w-full items-center justify-center gap-2 bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800" data-stage228a-priority-link="true">
                        Otwórz priorytet
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">Brak rekordu w aktywnym filtrze.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4 text-sm text-slate-600">
                  <div className="mb-2 flex items-center gap-2 font-black text-slate-900">
                    <Clock3 className="h-4 w-4 text-blue-600" />
                    Reguła widoku
                  </div>
                  Lejek to lista decyzji, nie kanban. Ma szybko pokazać: ruch, ciszę, ryzyko i pieniądze.
                </CardContent>
              </Card>
            </aside>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default SalesFunnel;
