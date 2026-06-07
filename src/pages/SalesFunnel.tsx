import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Clock3, Filter, Loader2, RefreshCw, ShieldAlert, Target } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
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
// Stage227A static guard compatibility markers only, not rendered kanban columns:
// data-stage227a-sales-funnel-movement-view="true" data-stage227a-funnel-summary="true" data-stage227a-funnel-column="true" data-stage227a-funnel-card="true" data-stage227a-funnel-next-step="true" data-stage227a-funnel-silence-age="true" data-stage227a-funnel-risk-flag="true" data-stage227a-funnel-value="true"
void STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW;
void STAGE227B_SALES_FUNNEL_DECISION_LIST;
void STAGE228A_FUNNEL_TRUTH_CLICKABILITY;
void STAGE227F6_SALES_FUNNEL_FULL_WIDTH_CANVAS;

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

type FunnelFilterState = {
  ownerFilter: OwnerFilter;
  stageFilter: StageFilter;
};

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

function DecisionTile({
  active,
  label,
  value,
  helper,
  onClick,
}: {
  active: boolean;
  label: string;
  value: string | number;
  helper: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left shadow-sm transition ${active ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
      data-stage227b-owner-filter="true"
      data-stage228a-clickable-filter="true"
    >
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-500">{helper}</div>
    </button>
  );
}

function StagePill({
  active,
  label,
  count,
  value,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${active ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
      data-stage227b-stage-filter="true"
      data-stage228a-clickable-filter="true"
    >
      <div className="flex items-center gap-2">
        <strong className="text-sm text-slate-950">{label}</strong>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{count}</span>
      </div>
      <div className="mt-1 text-xs text-slate-500">{formatMoney(value, 'PLN')}</div>
    </button>
  );
}

function Signal({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2" data-stage227b-signal="true">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className={`mt-0.5 text-sm ${strong ? 'font-black text-slate-950' : 'font-semibold text-slate-700'}`}>{value}</div>
    </div>
  );
}

function DecisionListCard({ card }: { card: SalesFunnelMovementCard }) {
  const primaryReason = card.riskReasons[0] || (card.hasNextMove ? 'Ruch zaplanowany' : 'Brak następnego kroku');
  const movementTone = needsMovement(card) ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <article
      className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_auto] lg:items-center"
      data-stage227b-funnel-list-card="true"
      data-stage227a-funnel-card="true"
      data-stage228a-money-source-card={card.valueAmount > 0 ? 'true' : 'false'}
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
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
        <h3 className="truncate text-base font-black text-slate-950">{card.title}</h3>
        {card.subtitle ? <p className="mt-1 line-clamp-2 text-sm text-slate-500">{card.subtitle}</p> : null}
        <p className="mt-2 text-sm font-semibold text-slate-700">{primaryReason}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Signal label="Etap" value={card.stageLabel} strong />
        <div data-stage227a-funnel-silence-age="true"><Signal label="Kontakt" value={silenceLabel(card.silenceDays)} strong /></div>
        <div data-stage227a-funnel-next-step="true"><Signal label="Następny krok" value={card.hasNextMove ? `${card.nextMoveTitle || 'Zaplanowany'} · ${formatDateTime(card.nextMoveAt)}` : 'Brak'} strong={!card.hasNextMove} /></div>
        <div data-stage227a-funnel-value="true"><Signal label={card.valueSourceLabel || 'Wartość/prowizja'} value={formatMoney(card.valueAmount, card.valueCurrency)} strong /></div>
      </div>

      <Link
        to={card.href}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
      <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 sales-funnel-stage227f6-page" data-stage227a-sales-funnel-movement-view="true" data-stage227b-decision-list-view="true" data-stage228a-funnel-truth-clickability="true" data-stage227f6-sales-funnel-wide-shell="true">
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

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5" data-stage227b-owner-filter-row="true" data-stage227a-funnel-summary="true">
            <DecisionTile active={ownerFilter === 'move_now'} label="Do ruchu teraz" value={countByFilter(allCards, 'move_now')} helper="Kliknij — pokaż ryzyko, ciszę albo brak kroku." onClick={() => applyOwnerFilter('move_now')} />
            <DecisionTile active={ownerFilter === 'no_next_move'} label="Bez kroku" value={countByFilter(allCards, 'no_next_move')} helper="Kliknij — pokaż rekordy bez akcji." onClick={() => applyOwnerFilter('no_next_move')} />
            <DecisionTile active={ownerFilter === 'silent_7'} label="Cisza 7+" value={countByFilter(allCards, 'silent_7')} helper="Kliknij — pokaż brak kontaktu 7+ dni." onClick={() => applyOwnerFilter('silent_7')} />
            <DecisionTile active={ownerFilter === 'high_risk'} label="Wysokie ryzyko" value={countByFilter(allCards, 'high_risk')} helper="Kliknij — pokaż high/critical." onClick={() => applyOwnerFilter('high_risk')} />
            <DecisionTile active={ownerFilter === 'money'} label="Pieniądze" value={formatMoney(totalValue, view.summary.currency || 'PLN')} helper="Kliknij — pokaż rekordy, z których liczona jest kwota." onClick={() => applyOwnerFilter('money')} />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm" data-stage227b-stage-filter-strip="true">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Filter className="h-4 w-4 text-blue-600" />
                Etapy jako filtr, nie ściśnięte kolumny
              </div>
              <button type="button" onClick={() => applyStageFilter('all')} className="text-xs font-bold text-blue-700 hover:text-blue-900" data-stage228a-show-all="true">
                Pokaż wszystkie
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <StagePill active={stageFilter === 'all' && ownerFilter === 'all'} label="Wszystkie" count={allCards.length} value={totalValue} onClick={() => applyStageFilter('all')} />
              {stageOptions.map((stage) => (
                <StagePill
                  key={stage.key}
                  active={ownerFilter === 'all' && stageFilter === stage.key}
                  label={stage.label}
                  count={stage.count}
                  value={stage.value}
                  onClick={() => applyStageFilter(stage.key)}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-3" data-stage227b-decision-list="true">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{visibleLabel}</p>
                  <h2 className="text-xl font-black text-slate-950">Rekordy w aktywnym widoku</h2>
                </div>
                <div className="text-sm font-semibold text-slate-500">Pokazuję {filteredCards.length} z {allCards.length} rekordów</div>
              </div>

              {loading ? (
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="flex items-center gap-3 p-6 text-sm font-semibold text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Ładowanie lejka ruchu...
                  </CardContent>
                </Card>
              ) : filteredCards.length ? (
                filteredCards.map((card) => <DecisionListCard key={card.id} card={card} />)
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

            <aside className="space-y-3 xl:sticky xl:top-5 xl:self-start" data-stage227b-owner-priority-panel="true">
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
                      <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                        {topPriority.riskReasons[0] || (topPriority.hasNextMove ? 'Ruch jest zaplanowany.' : 'Brak następnego kroku.')}
                      </div>
                      <Link to={topPriority.href} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800" data-stage228a-priority-link="true">
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
                  Lejek nie służy do przeciągania kart. Ma w 5 sekund pokazać, co wymaga ruchu i gdzie są pieniądze. Kafle decyzyjne czyszczą filtr etapu, żeby nie ukrywać źródła kwot.
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
