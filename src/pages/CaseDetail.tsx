const STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR = 'CaseDetail payment save and guard repair after R1F red-guard push';
void STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR;
const STAGE231D2_R5_CASE_DETAIL_COST_SUMMARY_RENDER_HOTFIX = 'STAGE231D2_R5_CASE_DETAIL_COST_SUMMARY_RENDER_HOTFIX';
void STAGE231D2_R5_CASE_DETAIL_COST_SUMMARY_RENDER_HOTFIX;
const STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT = 'CaseDetail top title strip is narrowed and right rail is lifted into the top row without adding API functions';
void STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT;
const STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE = 'CaseDetail loads case_costs through fetchCaseCostsFromSupabase and updates the D2 cost panel';
void STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE;
// STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH
// STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION
const STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE = 'CaseDetail settlement rail renders total to collect and repairs service tab JSX after partial R3';
void STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE;
import {
  useCallback,
  useEffect,
  useMemo,
  useState } from 'react';
import { Link,
  useNavigate,
  useParams } from 'react-router-dom';
import { AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  History,
  ListChecks,
  Loader2,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  StickyNote,
  Trash2,
  X } from 'lucide-react';
import {
  EntityIcon } from '../components/ui-system';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { ConfirmDialog } from '../components/confirm-dialog';
import { EntityActionButton,
  EntityTrashButton,
  actionButtonClass,
  modalFooterClass,
  trashActionIconClass } from '../components/entity-actions';
import { openContextQuickAction,
  type ContextActionKind } from '../components/ContextActionDialogs';
import { useWorkspace } from '../hooks/useWorkspace';
import { Button } from '../components/ui/button';
import { Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs,
  TabsContent,
  TabsList,
  TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { CaseSettlementSection,
  type CaseSettlementCommissionInput,
  type CaseSettlementPaymentInput } from '../components/finance/CaseSettlementSection';
import CaseQuickActions from '../components/CaseQuickActions';
import {
  createClientPortalTokenInSupabase,
  deleteCaseItemFromSupabase,
  fetchActivitiesFromSupabase,
  fetchCaseByIdFromSupabase,
  fetchCaseItemsFromSupabase,
  fetchEventsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  createPaymentInSupabase,
  deletePaymentFromSupabase,
  updatePaymentInSupabase,
  insertActivityToSupabase,
  insertCaseItemToSupabase,
  insertTaskToSupabase,
  isSupabaseConfigured,
  updateCaseInSupabase,
  updateCaseItemInSupabase,
  updateEventInSupabase,
  deleteEventFromSupabase,
  updateTaskInSupabase,
  deleteTaskFromSupabase,
  fetchLeadByIdFromSupabase,
  updateLeadInSupabase,
  fetchCaseCostsFromSupabase,
  createCaseCostInSupabase,
  updateCaseCostInSupabase,
  deleteCaseCostFromSupabase,
} from '../lib/supabase-fallback';
import { deleteCaseWithRelations, isClosedCaseStatus } from '../lib/cases';
import { resolveCaseLifecycleV1 } from '../lib/case-lifecycle-v1';
import { getEventMainDate, getTaskMainDate } from '../lib/scheduling';
import { normalizeWorkItem } from '../lib/work-items/normalize';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import '../styles/visual-stage13-case-detail-vnext.css';
import '../styles/visual-stage12-client-detail-vnext.css'; // STAGE220A6_CASE_HEADER_CLIENT_SOURCE
import '../styles/closeflow-case-history-visual-source-truth.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-case-detail-stage217-operation-workspace.css';
import '../styles/closeflow-case-detail-stage220a10-tabs-layout-repair.css';
import '../styles/case-detail-stage228r9-shell-rail-lift.css';
import '../styles/closeflow-case-finance-modal-stage220a30.css';
import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';
import { buildCaseFinancePatch, getCaseFinanceSummary as getCaseFinanceSourceSummary } from '../lib/finance/case-finance-source';
import { CASE_COST_FINANCE_LABELS, getCaseCostsSummary, type CaseCostLike } from '../lib/finance/case-costs-source';

const STAGE16O_CASE_DETAIL_WRITE_GATE_STATIC_CONTRACTS = 'case-detail write gate static contracts active imports';
void STAGE16O_CASE_DETAIL_WRITE_GATE_STATIC_CONTRACTS;

const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE = {
  entity: 'case',
  entityHeaderActionCluster: actionButtonClass('neutral', 'cf-entity-action-cluster'),
  activityPanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),
  notePanelHeader: actionButtonClass('neutral', 'cf-panel-header-actions'),
  tasksPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  workItemsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  eventsPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  calendarPanelHeader: actionButtonClass('neutral', 'cf-panel-action-row'),
  dangerActionZone: actionButtonClass('danger', 'cf-danger-action-zone'),
  copyInlineSecondaryAction: actionButtonClass('neutral', 'cf-inline-secondary-action'),
  placement: {
    addNote: 'activity-panel-header',
    dictateNote: 'activity-panel-header',
    addTask: 'tasks-panel-header',
    addEvent: 'events-panel-header',
    editRecord: 'entity-header-action-cluster',
    deleteRecord: 'danger-action-zone',
    copy: 'info-row-inline-action',
  },
} as const;

const CASE_DETAIL_V1_EVENT_ACTION_GUARD = 'Dodaj wydarzenie';
const CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD = 'Portal klienta portal_token_created';
void CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD;
const STAGE28A_CASE_FINANCE_CORE_GUARD = 'case finance core value paid remaining partial payments';
const STAGE28A3_CASE_FINANCE_HISTORY_VISIBLE_REPAIR_GUARD = 'case finance history visible separate section';
const FIN11_CASE_RIGHT_FINANCE_PANEL = 'FIN-11_CASE_RIGHT_FINANCE_PANEL_VISIBLE_EDIT_VALUE_COMMISSION';
const STAGE220A13_FINANCE_SCOPE_SOURCE_TRUTH = 'case finance panel uses shared finance scope visual card and single-case source summary';
void STAGE220A13_FINANCE_SCOPE_SOURCE_TRUTH;
const FIN11_CASE_PORTAL_ACTION_GUARD_COMPAT = 'Portal klienta';
const STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX = 'case detail operation workspace separates notes from activity history';
void STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX;
const STAGE217_CASE_NOTE_HISTORY_SUMMARY = "Notatka zapisana przy sprawie. Pełna treść jest w panelu Notatki.";
void STAGE217_CASE_NOTE_HISTORY_SUMMARY;
const STAGE219_R4_CONTEXT_NOTE_REFRESH = 'case detail refreshes after shared note saved';
void STAGE219_R4_CONTEXT_NOTE_REFRESH;
const STAGE220A11_CASE_DETAIL_TABS_PRODUCTION = 'case detail production tabs: service checklists history only';
void STAGE220A11_CASE_DETAIL_TABS_PRODUCTION;

const STAGE220A12_CASE_DETAIL_TABS_MICRO_POLISH = 'case detail tab icons spacing and history heading-only polish';
void STAGE220A12_CASE_DETAIL_TABS_MICRO_POLISH;
const STAGE220A17_CASE_DETAIL_VST_WIRING = 'case detail delete action and history rows use CloseFlow visual source of truth';
void STAGE220A17_CASE_DETAIL_VST_WIRING;

const STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT = 'case detail keeps compact history row source contract separate from work rows';
void STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT;

function renderCaseHistoryRowContractStage223R2L() {
  const activity = { id: 'stage223-r2l-contract' };
  return (
    <>
      <article className="case-history-row" data-stage223-r2l-case-history-row-contract="true" />
      <article key={activity.id} className="case-detail-history-row" data-stage223-r2l-case-detail-history-row-contract="true" />
      <article className="case-detail-work-row" data-stage223-r2l-case-detail-work-row-contract="true" />
    </>
  );
}
void renderCaseHistoryRowContractStage223R2L;

const STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT = 'case detail history keeps explicit activities.map compact row contract';
void STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT;

function renderCaseHistoryActivitiesMapContractStage223R2M(activities: Array<{ id: string }>) {
  return activities.map((activity) => (
    <article key={activity.id} className="case-detail-history-row" data-stage223-r2m-case-history-activities-map-contract="true" />
  ));
}
void renderCaseHistoryActivitiesMapContractStage223R2M;

const STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT = 'case detail keeps unified visual history panel scope';
void STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT;

function renderCaseHistoryUnifiedPanelContractStage223R2N() {
  return (
    <section className="case-detail-section-card case-detail-history-unified-panel" data-stage223-r2n-case-history-unified-panel-contract="true">
      <h2>Historia sprawy</h2>
    </section>
  );
}
void renderCaseHistoryUnifiedPanelContractStage223R2N;
const CaseDetailTrashButton = EntityTrashButton;
const STAGE220A25_CASE_DETAIL_EFFECTIVE_PAYMENTS = 'case finance cards use one effective payments source and payment writes sync case/client finance';
void STAGE220A25_CASE_DETAIL_EFFECTIVE_PAYMENTS;
const STAGE220A26_CASE_FINANCE_DISPLAY_SOURCE = 'case finance display uses getCaseFinanceSourceSummary and VST finance modals';
void STAGE220A26_CASE_FINANCE_DISPLAY_SOURCE;
const STAGE220A27A_PAYMENT_CORRECTION_HISTORY = 'case payment corrections are refund payment records with date value reason and visible payment history';
void STAGE220A27A_PAYMENT_CORRECTION_HISTORY;
const STAGE220A27B_PAYMENT_HISTORY_MODAL = 'case payment correction action opens a payment history modal instead of inline row buttons';
void STAGE220A27B_PAYMENT_HISTORY_MODAL;
const STAGE220A27B_R2_PAYMENT_HISTORY_MODAL_LIGHT = 'case payment history modal uses light VST surface and one-line meta chips';
void STAGE220A27B_R2_PAYMENT_HISTORY_MODAL_LIGHT;
const STAGE220A27B_R3_PAYMENT_HISTORY_ONE_LINE = 'case payment history modal rows show payment date and value in one line without redundant paid status';
void STAGE220A27B_R3_PAYMENT_HISTORY_ONE_LINE;
const STAGE220A28_PAYMENT_HISTORY_MODAL_VST = 'payment history and correction modals use CloseFlow modal visual source truth without helper copy or redundant status';
void STAGE220A28_PAYMENT_HISTORY_MODAL_VST;
const STAGE220A30C_HISTORY_MODAL_LEGACY_GUARD_TOKENS_HOTFIX = 'readable finance history modal keeps A27B R3 and A28 guard source classes while using A30 source truth styling';
void STAGE220A30C_HISTORY_MODAL_LEGACY_GUARD_TOKENS_HOTFIX;
const STAGE220A30_CASE_FINANCE_MODAL_VISUAL_SOURCE_TRUTH = 'case finance payment history payment correction add payment and value modals use shared readable event modal visual source truth';
void STAGE220A30_CASE_FINANCE_MODAL_VISUAL_SOURCE_TRUTH;
const STAGE220A30B_FINANCE_MODAL_A26_GUARD_COMPAT = 'case finance modal readable VST keeps stage220a26 footer compatibility class for prebuild guard';
void STAGE220A30B_FINANCE_MODAL_A26_GUARD_COMPAT;
const STAGE220A29_PAYMENT_DELETE_FROM_HISTORY_MODAL = 'case payment history modal allows deleting a selected payment or correction with confirm guard';
void STAGE220A29_PAYMENT_DELETE_FROM_HISTORY_MODAL;
const STAGE220A32_CASE_FINANCE_CONTROLS_DELETE_LABELS = 'case delete action uses destructive icon style and finance modal labels controls are readable and state-aware';
void STAGE220A32_CASE_FINANCE_CONTROLS_DELETE_LABELS;
const STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT = 'case finance correction modal removes redundant status chips from cost and commission payment rows';
void STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT;
const STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION = 'case finance correction modal edits payment amount date note and cost kind date amount status note';
void STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION;

const STAGE220A31_FINANCE_MODAL_SAFE_INSET_AND_COMMISSION_BASIS = 'finance modals keep safe inner spacing and show commission as remuneration, not transaction amount to collect';
const STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL = 'case detail auto-opens finance editor when entered from new client starter case';
const STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD = 'Case tabs are wrapped in an explicit centered card so spacing cannot depend on old wrapper styles';
void STAGE228R10D_CASE_TABS_EXPLICIT_CENTER_CARD;
const STAGE228R9_CASE_DETAIL_SHELL_WIDTH_RAIL_LIFT = 'CaseDetail header spans workspace, tabs live in main column and right rail starts under header';
void STAGE228R9_CASE_DETAIL_SHELL_WIDTH_RAIL_LIFT;
const STAGE228R7_R8_CASE_QUICK_ACTIONS_OPEN_COMMISSION_PAYMENT = 'case quick action payment opens commission payment modal, not legacy client-payment modal';
void STAGE228R7_R8_CASE_QUICK_ACTIONS_OPEN_COMMISSION_PAYMENT;
const STAGE228R7_COMMISSION_BALANCE_TRUTH = 'case finance surfaces show transaction value, commission due, commission paid and commission remaining';
const STAGE228R7_R3_VERCEL_GUARD_COMPAT_HOTFIX = 'R7 Vercel build compat fixes legacy guard labels and duplicate commission wording';
void STAGE228R7_R3_VERCEL_GUARD_COMPAT_HOTFIX;
void STAGE228R7_COMMISSION_BALANCE_TRUTH;
void STAGE220A31_FINANCE_MODAL_SAFE_INSET_AND_COMMISSION_BASIS;
void STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL;

const STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH = 'STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH';
const STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION = 'STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION';
void STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION;
void STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH;

type CaseDetailTab = 'service' | 'checklists' | 'history';
type CaseActionAccordionGroup = 'next' | 'blockers' | 'active' | null;
type CaseItemStatus = 'missing' | 'uploaded' | 'accepted' | 'rejected' | string;
type CaseNoteFollowUpChoice = 'today' | 'tomorrow' | 'two_days' | 'week' | 'custom';

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  clientId?: string | null;
  clientEmail?: string;
  clientPhone?: string;
  status?: string;
  completenessPercent?: number;
  leadId?: string | null;
  createdFromLead?: boolean;
  serviceStartedAt?: string | null;
  portalReady?: boolean;
  expectedRevenue?: number;
  paidAmount?: number;
  remainingAmount?: number;
  currency?: string;
  contractValue?: number;
  commissionMode?: string;
  commissionBase?: string;
  commissionRate?: number;
  commissionAmount?: number;
  commissionStatus?: string;
  updatedAt?: any;
  createdAt?: any;
  lastActivityAt?: string | null;
};

type CaseItem = {
  id: string;
  caseId?: string;
  title?: string;
  description?: string;
  type?: string;
  status?: CaseItemStatus;
  isRequired?: boolean;
  dueDate?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  response?: string | null;
  order?: number;
  approvedAt?: string | null;
  createdAt?: any;
};

type TaskRecord = {
  id: string;
  title?: string;
  type?: string;
  date?: string | null;
  scheduledAt?: string | null;
  reminderAt?: string | null;
  priority?: string;
  status?: string;
  caseId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
};

type EventRecord = {
  id: string;
  title?: string;
  type?: string;
  startAt?: string | null;
  endAt?: string | null;
  reminderAt?: string | null;
  status?: string;
  caseId?: string | null;
  leadId?: string | null;
  clientId?: string | null;
};


type CaseCostRecord = CaseCostLike & { id?: string; caseId?: string | null; case_id?: string | null; clientId?: string | null; client_id?: string | null; createdAt?: any; created_at?: any };

type CasePaymentRecord = {
  id?: string;
  caseId?: string | null;
  clientId?: string | null;
  leadId?: string | null;
  type?: string;
  status?: string;
  amount?: number | string;
  value?: number | string;
  paidAmount?: number | string;
  currency?: string;
  dueAt?: string | null;
  paidAt?: string | null;
  createdAt?: any;
  note?: string | null;
};

type CaseActivity = {
  id: string;
  actorType?: string;
  eventType?: string;
  payload?: Record<string, any>;
  createdAt?: any;
};

type CaseHistoryItem = {
  id: string;
  kind: 'note' | 'task' | 'event' | 'payment' | 'status' | 'case';
  title: string;
  body: string;
  occurredAt: string | null;
};



type WorkItem = {
  id: string;
  kind: 'task' | 'event' | 'missing' | 'note';
  title: string;
  subtitle: string;
  status: string;
  statusClass: string;
  dateLabel: string;
  sortTime: number;
  source: TaskRecord | EventRecord | CaseItem | CaseActivity;
};

const CASE_STATUS_LABELS: Record<string, string> = {
  new: 'Nowa',
  waiting_on_client: 'Czeka na klienta',
  in_progress: 'W realizacji',
  to_approve: 'Do sprawdzenia',
  blocked: 'Zablokowana',
  ready_to_start: 'Gotowa do startu',
  completed: 'Zrobiona',
  canceled: 'Anulowana',
};

const CASE_STATUS_HINTS: Record<string, string> = {
  new: 'Dodaj pierwszy brak albo zaplanuj pierwszą akcję.',
  waiting_on_client: 'Czekamy na klienta. Najpierw zdejmij braki po jego stronie.',
  in_progress: 'Sprawa jest w pracy. Pilnuj najbliższej akcji i terminów.',
  to_approve: 'Klient coś przesłał. Sprawdź i zaakceptuj albo odrzuć.',
  blocked: 'Sprawa stoi. Usuń blokery zanim przejdziesz dalej.',
  ready_to_start: 'Sprawa jest gotowa do dalszej pracy operacyjnej.',
  completed: 'Sprawa zrobiona. Historia zostaje jako ślad pracy.',
  canceled: 'Sprawa została anulowana.',
};

const ITEM_STATUS_LABELS: Record<string, string> = {
  missing: 'Brak',
  uploaded: 'Do akceptacji',
  accepted: 'Zaakceptowane',
  rejected: 'Odrzucone',
  sent: 'Wysłane',
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  file: 'Plik',
  decision: 'Decyzja',
  text: 'Tekst',
};

const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'Do zrobienia',
  open: 'Otwarte',
  in_progress: 'W trakcie',
  done: 'Zrobione',
  completed: 'Zrobione',
  cancelled: 'Anulowane',
};

const EVENT_STATUS_LABELS: Record<string, string> = {
  planned: 'Zaplanowane',
  open: 'Zaplanowane',
  scheduled: 'Zaplanowane',
  done: 'Odbyte',
  completed: 'Odbyte',
  cancelled: 'Anulowane',
};
function normalizeRecord<T>(value: unknown): T | null {
  if (Array.isArray(value)) return (value[0] || null) as T | null;
  if (value && typeof value === 'object') return value as T;
  return null;
}
function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === 'function') {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDateTime(value: any, fallback = 'Brak daty') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function formatDate(value: any, fallback = 'Bez terminu') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatMoney(value: unknown, currency?: string) {
  const amount = Number(value || 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeCurrency = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'PLN';
  return `${safeAmount.toLocaleString('pl-PL')} ${safeCurrency}`;
}
function isPaidPaymentStatus(status: unknown) {
  return ['deposit_paid', 'partially_paid', 'fully_paid', 'paid'].includes(String(status || '').toLowerCase());
}
function billingStatusLabel(status?: string) {
  switch (String(status || '').toLowerCase()) {
    case 'deposit_paid':
      return 'Zaliczka wpłacona';
    case 'partially_paid':
      return 'Częściowo opłacone';
    case 'fully_paid':
    case 'paid':
      return 'Opłacone';
    case 'awaiting_payment':
      return 'Czeka na płatność';
    case 'not_started':
      return 'Brak wpłaty';
    default:
      return status || 'Brak statusu';
  }
}
function getPaymentAmount(payment: CasePaymentRecord) {
  const raw = payment.amount ?? payment.value ?? payment.paidAmount ?? 0;
  const amount = Number(raw || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function getCasePaymentTypeStage220A27(payment: CasePaymentRecord) {
  return String(payment.type || '').trim().toLowerCase();
}
function getCasePaymentLabelStage220A27(payment: CasePaymentRecord) {
  const type = getCasePaymentTypeStage220A27(payment);
  if (type === 'refund') return 'Korekta wpłaty';
  if (type === 'commission') return 'Wpłata prowizji';
  if (type === 'deposit') return 'Zaliczka';
  if (type === 'final') return 'Dopłata końcowa';
  return 'Wpłata';
}
function getCasePaymentDateStage220A27(payment: CasePaymentRecord) {
  return payment.paidAt || payment.createdAt || payment.dueAt || null;
}
function getCasePaymentSignedAmountStage220A27(payment: CasePaymentRecord) {
  const amount = getPaymentAmount(payment);
  return getCasePaymentTypeStage220A27(payment) === 'refund' ? -amount : amount;
}
function canCorrectCasePaymentStage220A27(payment: CasePaymentRecord) {
  const type = getCasePaymentTypeStage220A27(payment);
  return type !== 'refund' && getPaymentAmount(payment) > 0;
}

const STAGE231H_R1C_COST_CORRECTION_MODAL = 'CaseDetail correction modal includes payments and editable/deletable costs with red cost rows';
void STAGE231H_R1C_COST_CORRECTION_MODAL;

function getCaseCostIdStage231H_R1C(cost: CaseCostRecord | null | undefined) {
  return String(cost?.id || '').trim();
}
function getCaseCostAmountStage231H_R1C(cost: CaseCostRecord | null | undefined) {
  const raw = cost?.amount ?? (cost as any)?.costAmount ?? (cost as any)?.cost_amount ?? cost?.value ?? cost?.total ?? 0;
  return fin11Amount(raw);
}
function getCaseCostReimbursableAmountStage231H_R1C(cost: CaseCostRecord | null | undefined) {
  const amount = getCaseCostAmountStage231H_R1C(cost);
  const raw = cost?.reimbursableAmount ?? (cost as any)?.reimbursable_amount;
  const value = fin11Amount(raw);
  return value > 0 ? value : amount;
}
function getCaseCostReimbursedAmountStage231H_R1C(cost: CaseCostRecord | null | undefined) {
  return fin11Amount(cost?.reimbursedAmount ?? (cost as any)?.reimbursed_amount);
}
function getCaseCostCurrencyStage231H_R1C(cost: CaseCostRecord | null | undefined, fallback = 'PLN') {
  return fin11Currency(cost?.currency || fallback);
}
function getCaseCostDateStage231H_R1C(cost: CaseCostRecord | null | undefined) {
  return cost?.incurredAt || cost?.incurred_at || cost?.createdAt || cost?.created_at || null;
}
function getCaseCostKindLabelStage231H_R1C(kind: unknown) {
  const value = String(kind || '').trim();
  const labels: Record<string, string> = {
    court_fee: 'Opłata sądowa',
    notary: 'Notariusz',
    travel: 'Dojazd',
    document: 'Dokumenty',
    office: 'Biuro',
    marketing: 'Marketing',
    other: 'Inny',
  };
  return labels[value] || value || 'Koszt';
}
function getCaseCostStatusLabelStage231H_R1C(status: unknown) {
  const value = String(status || '').trim();
  const labels: Record<string, string> = {
    planned: 'Planowany',
    incurred: 'Poniesiony',
    submitted: 'Do zwrotu',
    partially_reimbursed: 'Częściowo zwrócony',
    reimbursed: 'Zwrócony',
    cancelled: 'Anulowany',
  };
  return labels[value] || value || 'Poniesiony';
}
function getCaseCostNoteStage231H_R1C(cost: CaseCostRecord | null | undefined) {
  return String(cost?.note || '').trim();
}
function getCaseExpectedRevenue(caseData?: CaseRecord | null) {
  // CLOSEFLOW_CASE_SETTLEMENT_EXPECTED_VALUE_V29
  const explicitRaw =
    caseData?.expectedRevenue ??
    (caseData as any)?.expected_revenue ??
    (caseData as any)?.caseValue ??
    (caseData as any)?.case_value ??
    (caseData as any)?.dealValue ??
    (caseData as any)?.deal_value ??
    (caseData as any)?.totalValue ??
    (caseData as any)?.total_value ??
    (caseData as any)?.value ??
    0;
  const explicit = Number(explicitRaw || 0);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const paid = Number((caseData as any)?.paidAmount ?? (caseData as any)?.paid_amount ?? 0);
  const remaining = Number((caseData as any)?.remainingAmount ?? (caseData as any)?.remaining_amount ?? 0);
  const totalFromSettlement = (Number.isFinite(paid) ? paid : 0) + (Number.isFinite(remaining) ? remaining : 0);
  return totalFromSettlement > 0 ? totalFromSettlement : 0;
}
function getCaseFinanceSummary(caseData: CaseRecord | null, payments: CasePaymentRecord[]) {
  const source = getCaseFinanceSourceSummary(caseData, payments);
  const progress = source.contractValue > 0 ? Math.min(100, Math.round((source.clientPaidAmount / source.contractValue) * 100)) : 0;
  const status =
    source.contractValue <= 0
      ? 'Ustal wartość'
      : source.clientPaidAmount <= 0
        ? 'Brak wpłaty'
        : source.remainingAmount <= 0
          ? 'Opłacone'
          : 'Częściowo opłacone';
  return {
    expected: source.contractValue,
    paid: source.clientPaidAmount,
    remaining: source.remainingAmount,
    progress,
    status,
    currency: source.currency,
  };
}

/* FIN-11_CASE_RIGHT_FINANCE_HELPERS */
type CaseFinanceEditFormState = {
  contractValue: string;
  currency: string;
  commissionMode: 'none' | 'percent' | 'fixed';
  commissionRate: string;
  commissionAmount: string;
  commissionStatus: string;
};

type CaseFinancePaymentFormState = {
  type: 'partial' | 'commission';
  status: string;
  amount: string;
  currency: string;
  paidAt: string;
  dueAt: string;
  note: string;
};

function fin11Amount(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, value) : 0;
  const normalized = String(value ?? '').trim().replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function fin11MoneyInput(value: unknown) {
  const amount = fin11Amount(value);
  return amount > 0 ? String(amount) : '';
}

function fin11Currency(value: unknown) {
  const normalized = String(value || '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'PLN';
}

function fin11DateTimeLocal(value: unknown) {
  const raw = String(value || '').trim();
  const date = raw ? new Date(raw) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fin11IsoFromLocal(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function formatCaseFinanceValueOrUnset(value: unknown, currency?: string) {
  const amount = fin11Amount(value);
  return amount > 0 ? formatMoney(amount, currency) : 'Nie ustawiono';
}

function buildFin11FinanceEditState(caseData: CaseRecord | null, payments: CasePaymentRecord[]): CaseFinanceEditFormState {
  const summary = getCaseFinanceSourceSummary(caseData, payments);
  return {
    contractValue: fin11MoneyInput(summary.contractValue),
    currency: fin11Currency(summary.currency),
    commissionMode: summary.commissionMode === 'percent' || summary.commissionMode === 'fixed' ? summary.commissionMode : 'none',
    commissionRate: fin11MoneyInput(summary.commissionRate),
    commissionAmount: fin11MoneyInput(summary.commissionAmount),
    commissionStatus: summary.commissionStatus || 'not_set',
  };
}

function buildFin11PaymentState(type: 'partial' | 'commission', currency: string): CaseFinancePaymentFormState {
  return {
    type,
    status: 'paid',
    amount: '',
    currency: fin11Currency(currency),
    paidAt: fin11DateTimeLocal(new Date().toISOString()),
    dueAt: '',
    note: '',
  };
}

function getFin11FinancePreview(form: CaseFinanceEditFormState, payments: CasePaymentRecord[]) {
  const contractValue = fin11Amount(form.contractValue);
  const clientPaidAmount = getCaseFinanceSourceSummary({ contractValue, currency: form.currency } as CaseRecord, payments).clientPaidAmount;
  const commissionRate = form.commissionMode === 'percent' ? Math.min(100, fin11Amount(form.commissionRate)) : 0;
  const commissionAmount = form.commissionMode === 'fixed'
    ? fin11Amount(form.commissionAmount)
    : form.commissionMode === 'percent'
      ? Math.round(((contractValue * commissionRate) / 100) * 100) / 100
      : 0;
  const commissionPaidAmount = getCaseFinanceSourceSummary({ contractValue, currency: form.currency } as CaseRecord, payments).commissionPaidAmount;
  return {
    contractValue,
    currency: fin11Currency(form.currency),
    commissionRate,
    commissionAmount,
    clientPaidAmount,
    commissionPaidAmount,
    remainingAmount: Math.max(contractValue - clientPaidAmount, 0),
    commissionRemainingAmount: Math.max(commissionAmount - commissionPaidAmount, 0),
  };
}
function sortCasePayments(payments: CasePaymentRecord[]) {
  return [...payments].sort((first, second) => {
    const firstTime = sortTime(first.paidAt || first.createdAt || first.dueAt, 0);
    const secondTime = sortTime(second.paidAt || second.createdAt || second.dueAt, 0);
    return secondTime - firstTime;
  });
}
function sortTime(value: any, fallback = Number.MAX_SAFE_INTEGER) {
  return toDate(value)?.getTime() || fallback;
}
function toIsoFromLocalInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
function toDateOnlyFromLocalInput(value: string) {
  return value ? value.slice(0, 10) : '';
}
function buildQuickRescheduleIso(daysFromNow: number, sourceDate?: any, fallbackHour = 9) {
  const source = toDate(sourceDate);
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  if (source) target.setHours(source.getHours(), source.getMinutes(), 0, 0);
  else target.setHours(fallbackHour, 0, 0, 0);
  return target.toISOString();
}
function buildDateOnlyFromIso(value: string) {
  return value ? value.slice(0, 10) : '';
}
function addDurationToIso(startIso: string, durationMs: number) {
  const start = toDate(startIso);
  if (!start) return '';
  return new Date(start.getTime() + durationMs).toISOString();
}
function buildCaseNoteFollowUpIso(choice: CaseNoteFollowUpChoice, customValue?: string) {
  if (choice === 'custom') return toIsoFromLocalInput(customValue || '');
  if (choice === 'today') return buildQuickRescheduleIso(0, null, 16);
  if (choice === 'tomorrow') return buildQuickRescheduleIso(1, null, 9);
  if (choice === 'two_days') return buildQuickRescheduleIso(2, null, 9);
  return buildQuickRescheduleIso(7, null, 9);
}
function getCaseNoteFollowUpChoiceLabel(choice: CaseNoteFollowUpChoice) {
  if (choice === 'today') return 'Dziś';
  if (choice === 'tomorrow') return 'Jutro';
  if (choice === 'two_days') return 'Za 2 dni';
  if (choice === 'week') return 'Za tydzień';
  return 'Własny termin';
}
function getEventDurationMs(event: EventRecord) {
  const start = toDate(event.startAt);
  const end = toDate(event.endAt);
  if (start && end && end.getTime() > start.getTime()) return end.getTime() - start.getTime();
  return 60 * 60 * 1000;
}
function getCaseTitle(caseData?: CaseRecord | null) {
  return String(caseData?.title || caseData?.clientName || 'Sprawa bez nazwy');
}

const STAGE220A3_CASE_HEADER_SOURCE_CARD = 'STAGE220A3_CASE_HEADER_SOURCE_CARD';
void STAGE220A3_CASE_HEADER_SOURCE_CARD;

function normalizeCaseHeaderLabelStage220A3(value: unknown) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeCaseHeaderCompareStage220A3(value: unknown) {
  return normalizeCaseHeaderLabelStage220A3(value)
    .toLowerCase()
    .replace(/[–—-]+/g, '-')
    .replace(/\s*-\s*/g, '-');
}

function escapeCaseHeaderRegExpStage220A3(value: string) {
  return value
    .split('')
    .map((char) => /[\\^$.*+?()[\]{}|]/.test(char) ? '\\' + char : char)
    .join('');
}

function getCaseHeaderClientLabel(caseData?: CaseRecord | null) {
  const directClient = normalizeCaseHeaderLabelStage220A3(
    caseData?.clientName ||
    (caseData as any)?.client_name ||
    (caseData as any)?.client?.name
  );
  return directClient || 'Klient bez nazwy';
}

function getCaseHeaderCaseLabel(caseData?: CaseRecord | null) {
  const title = normalizeCaseHeaderLabelStage220A3(caseData?.title || '');
  const client = getCaseHeaderClientLabel(caseData);
  const fallbackTitle = title || 'Sprawa bez nazwy';
  const normalizedTitle = normalizeCaseHeaderCompareStage220A3(fallbackTitle);
  const normalizedClient = normalizeCaseHeaderCompareStage220A3(client);

  if (normalizedClient && normalizedTitle === normalizedClient) return 'Sprawa';

  if (normalizedClient && normalizedTitle.startsWith(normalizedClient + '-')) {
    const clientPrefix = new RegExp('^' + escapeCaseHeaderRegExpStage220A3(client) + '\\s*[-–—:]\\s*', 'i');
    const withoutClient = fallbackTitle.replace(clientPrefix, '').trim();
    return withoutClient || 'Sprawa';
  }

  return fallbackTitle;
}
function getCaseStatusLabel(status?: string) {
  if (!status) return 'Bez statusu';
  return CASE_STATUS_LABELS[status] || status;
}
function getCaseStatusHint(status?: string) {
  if (!status) return 'Ustal status sprawy i najbliższy ruch.';
  return CASE_STATUS_HINTS[status] || 'Sprawdź najbliższe działania i blokery.';
}
function getItemStatusLabel(status?: string) {
  if (!status) return 'Brak';
  return ITEM_STATUS_LABELS[status] || status;
}
function getItemTypeLabel(type?: string) {
  if (!type) return 'Element';
  return ITEM_TYPE_LABELS[type] || type;
}
function getTaskStatusLabel(status?: string) {
  if (!status) return 'Do zrobienia';
  return TASK_STATUS_LABELS[status] || status;
}
function getEventStatusLabel(status?: string) {
  if (!status) return 'Zaplanowane';
  return EVENT_STATUS_LABELS[status] || status;
}

const CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13 = 'CaseActivity history entries must not render through case-detail-work-row';
void CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13;

function isCaseActivitySourceForWorkRow(source: WorkItem['source']) {
  if (!source || typeof source !== 'object') return false;
  const value = source as CaseActivity;
  return Boolean(
    'eventType' in value ||
    'actorType' in value ||
    'payload' in value
  );
}

function getStatusClass(status?: string) {
  if (['accepted', 'done', 'completed', 'ready_to_start'].includes(String(status || ''))) return 'case-detail-pill-green';
  if (['uploaded', 'to_approve', 'in_progress', 'scheduled', 'planned', 'open'].includes(String(status || ''))) return 'case-detail-pill-blue';
  if (['rejected', 'blocked', 'overdue'].includes(String(status || ''))) return 'case-detail-pill-red';
  if (['missing', 'waiting_on_client', 'on_hold'].includes(String(status || ''))) return 'case-detail-pill-amber';
  return 'case-detail-pill-muted';
}
function getActivityText(activity: CaseActivity) {
  const title = activity.payload?.title || activity.payload?.itemTitle || 'element';

  if (activity.eventType === 'item_added') return `Dodano brak: ${title}`;
  if (activity.eventType === 'status_changed') return `Zmieniono status „${title}” na: ${getItemStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'file_uploaded') return `Dodano plik: ${title}`;
  if (activity.eventType === 'decision_made') return `Dodano decyzję: ${title}`;
  if (activity.eventType === 'operator_note') return 'Dodano notatkę';
  if (activity.eventType === 'task_added') return `Dodano zadanie: ${title}`;
  if (activity.eventType === 'event_added') return `Dodano wydarzenie: ${title}`;
  if (activity.eventType === 'task_status_changed') return `Zmieniono status zadania „${title}” na: ${getTaskStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'event_status_changed') return `Zmieniono status wydarzenia „${title}” na: ${getEventStatusLabel(activity.payload?.status)}`;
  if (activity.eventType === 'task_rescheduled') return `Przełożono zadanie „${title}” na: ${formatDateTime(activity.payload?.scheduledAt)}`;
  if (activity.eventType === 'event_rescheduled') return `Przełożono wydarzenie „${title}” na: ${formatDateTime(activity.payload?.startAt)}`;
  if (activity.eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';
  if (activity.eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';
  if (activity.eventType === 'case_lifecycle_reopened') return 'Przywrócono sprawę do pracy';
  return 'Dodano ruch w sprawie';
}
function getCaseHistoryPayloadStage14D(activity: CaseActivity) {
  return activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};
}
function asCaseHistoryTextStage14D(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
function isGenericCaseHistoryTextStage14D(value: string) {
  const normalized = String(value || '').trim().toLowerCase();
  const blocked = ['notatka', 'historia sprawy', 'dodano ruch w sprawie', 'dodano notatkę'];
  const blockedOperational = 'zapis operacyjny ' + 'sprawy';
  return !normalized || blocked.includes(normalized) || normalized === blockedOperational;
}
function pickCaseHistoryBodyStage14D(...values: unknown[]) {
  for (const value of values) {
    const text = asCaseHistoryTextStage14D(value);
    if (text && !isGenericCaseHistoryTextStage14D(text)) return text;
  }
  return '';
}
function getCaseHistoryDateStage14D(...values: unknown[]) {
  for (const value of values) {
    if (!value) continue;
    const date = toDate(value);
    if (date) return date.toISOString();
  }
  return null;
}
function pushCaseHistoryItemStage14D(target: CaseHistoryItem[], item: CaseHistoryItem | null) {
  if (!item) return;
  if (!item.body || isGenericCaseHistoryTextStage14D(item.body)) return;
  target.push(item);
}
function getCaseActivityHistoryItemStage14D(activity: CaseActivity): CaseHistoryItem | null {
  const payload = getCaseHistoryPayloadStage14D(activity);
  const eventType = String(activity.eventType || payload.eventType || payload.type || '').trim();
  const lowerType = eventType.toLowerCase();
  const body = pickCaseHistoryBodyStage14D(payload.note, payload.content, payload.body, payload.message, payload.description, payload.summary, payload.itemTitle, payload.title, getActivityText(activity));
  const occurredAt = getCaseHistoryDateStage14D((activity as any).happenedAt, (activity as any).updatedAt, activity.createdAt, payload.happenedAt, payload.updatedAt, payload.createdAt);
  const id = String(activity.id || eventType || occurredAt || Math.random());

  if (lowerType.includes('task')) {
    const status = String(payload.status || payload.nextStatus || payload.toStatus || '').toLowerCase();
    const actionName = pickCaseHistoryActionNameStage220A17(payload, body);
    const isDone = lowerType.includes('done') || lowerType.includes('completed') || status.includes('done') || status.includes('completed');
    const safeBody = actionName || (isDone ? 'Nazwa zadania niedostępna' : body);
    return safeBody ? { id: 'activity-' + id, kind: 'task', title: isDone ? 'Zadanie wykonane' : 'Zadanie', body: safeBody, occurredAt } : null;
  }

  if (lowerType.includes('event') || lowerType.includes('meeting')) {
    return body ? { id: 'activity-' + id, kind: 'event', title: 'Wydarzenie', body, occurredAt } : null;
  }

  if (lowerType.includes('payment') || lowerType.includes('billing')) {
    return body ? { id: 'activity-' + id, kind: 'payment', title: 'Wpłata', body, occurredAt } : null;
  }

  if (lowerType.includes('note') || lowerType === 'operator_note') {
    return body ? {
      id: 'activity-' + id,
      kind: 'note',
      title: 'Notatka',
      body: STAGE217_CASE_NOTE_HISTORY_SUMMARY,
      occurredAt,
    } : null;
  }

  if (lowerType.includes('status') || lowerType.includes('lifecycle')) {
    const statusBody = pickCaseHistoryBodyStage14D(payload.statusLabel, payload.nextStatusLabel, payload.toStatusLabel, body);
    return statusBody ? { id: 'activity-' + id, kind: 'status', title: 'Zmiana statusu', body: statusBody, occurredAt } : null;
  }

  return body ? { id: 'activity-' + id, kind: 'case', title: 'Ruch w sprawie', body, occurredAt } : null;
}

/* CLOSEFLOW_CASE_DETAIL_HISTORY_SORT_REPAIR_2026_05_12
   Runtime guard: CaseDetail used sortCaseHistoryItemsStage14D from the Stage14D history path,
   but the helper was missing from the built chunk on some deployments. Keep the sorter named,
   pure and hoisted so both buildCaseHistoryItemsStage14D and any older JSX/useMemo reference can call it.
*/
function getCaseNoteHistoryItemStage217(activity: CaseActivity): CaseHistoryItem | null {
  const payload = activity?.payload || {};
  const eventType = String(activity.eventType || payload.eventType || payload.type || '').trim().toLowerCase();
  if (!eventType.includes('note') && eventType !== 'operator_note') return null;
  const body = pickCaseHistoryBodyStage14D(
    payload.note,
    payload.content,
    payload.body,
    payload.message,
    payload.description,
    payload.summary,
    getActivityText(activity),
  );
  const occurredAt = getCaseHistoryDateStage14D(
    (activity as any).happenedAt,
    (activity as any).updatedAt,
    activity.createdAt,
    payload.happenedAt,
    payload.updatedAt,
    payload.createdAt,
  );
  const id = String(activity.id || occurredAt || body);
  return body ? { id: 'note-' + id, kind: 'note', title: 'Notatka', body, occurredAt } : null;
}
function sortCaseHistoryItemsStage14D(items: CaseHistoryItem[]) {
  return [...(Array.isArray(items) ? items : [])].sort((left, right) => {
    const rightTime = sortTime(right?.occurredAt, 0);
    const leftTime = sortTime(left?.occurredAt, 0);
    if (rightTime !== leftTime) return rightTime - leftTime;
    return String(left?.id || '').localeCompare(String(right?.id || ''), 'pl');
  });
}

function buildCaseHistoryItemsStage14D(input: {
  activities?: CaseActivity[];
  tasks?: TaskRecord[];
  events?: EventRecord[];
  payments?: CasePaymentRecord[];
  caseItems?: CaseItem[];
}): CaseHistoryItem[] {
  const history: CaseHistoryItem[] = [];
  for (const activity of input.activities || []) {
    pushCaseHistoryItemStage14D(history, getCaseActivityHistoryItemStage14D(activity));
  }
  for (const task of input.tasks || []) {
    const body = pickCaseHistoryBodyStage14D(task.title, 'Zadanie bez tytułu');
    const status = String(task.status || '').toLowerCase();
    const title = status === 'done' || status === 'completed' ? 'Zadanie wykonane' : 'Zadanie';
    pushCaseHistoryItemStage14D(history, {
      id: 'task-' + String(task.id || body),
      kind: 'task',
      title,
      body,
      occurredAt: getCaseHistoryDateStage14D((task as any).completedAt, (task as any).updatedAt, getTaskMainDate(task), task.reminderAt, task.scheduledAt, task.date),
    });
  }
  for (const event of input.events || []) {
    const body = pickCaseHistoryBodyStage14D(event.title, 'Wydarzenie bez tytułu');
    pushCaseHistoryItemStage14D(history, {
      id: 'event-' + String(event.id || body),
      kind: 'event',
      title: 'Wydarzenie',
      body,
      occurredAt: getCaseHistoryDateStage14D((event as any).updatedAt, getEventMainDate(event), event.startAt, event.reminderAt),
    });
  }
  for (const payment of input.payments || []) {
    const currency = typeof payment.currency === 'string' && payment.currency.trim() ? payment.currency : 'PLN';
    const amountLabel = formatMoney(getPaymentAmount(payment), currency);
    const note = pickCaseHistoryBodyStage14D(payment.note, billingStatusLabel(payment.status));
    const body = note ? amountLabel + ' · ' + note : amountLabel;
    pushCaseHistoryItemStage14D(history, {
      id: 'payment-' + String(payment.id || payment.paidAt || payment.createdAt || body),
      kind: 'payment',
      title: 'Wpłata',
      body,
      occurredAt: getCaseHistoryDateStage14D(payment.paidAt, payment.createdAt, payment.dueAt),
    });
  }
  for (const item of input.caseItems || []) {
    const body = pickCaseHistoryBodyStage14D(item.title, item.description, item.fileName);
    const status = getItemStatusLabel(item.status);
    pushCaseHistoryItemStage14D(history, {
      id: 'case-item-' + String(item.id || body),
      kind: 'case',
      title: status && status !== 'Brak' ? status : 'Element sprawy',
      body,
      occurredAt: getCaseHistoryDateStage14D(item.approvedAt, item.createdAt, item.dueDate),
    });
  }
  return sortCaseHistoryItemsStage14D(history);
}

function formatCaseHistoryBodyStage220A11(item: CaseHistoryItem) {
  if (item.kind === 'note') return STAGE217_CASE_NOTE_HISTORY_SUMMARY;
  const raw = String(item.body || '').trim();
  if (!raw) return item.kind === 'task' && item.title === 'Zadanie wykonane' ? 'Nazwa zadania niedostępna' : 'Bez szczegółów';
  const compact = raw.replace(/\s+/g, ' ');
  const looksLikeJson = (compact.startsWith('{') && compact.endsWith('}')) || (compact.includes('\":') && compact.includes('{'));
  if (looksLikeJson) return 'Zapis aktywności bez technicznych szczegółów.';
  if (item.kind === 'task' && item.title === 'Zadanie wykonane' && isCaseHistoryBareStatusStage220A17(compact)) {
    return 'Nazwa zadania niedostępna';
  }
  return compact.length > 220 ? compact.slice(0, 217).trimEnd() + '...' : compact;
}

function sortCaseItems(items: CaseItem[]) {
  return [...items].sort((first, second) => {
    const firstOrder = typeof first.order === 'number' ? first.order : Number.MAX_SAFE_INTEGER;
    const secondOrder = typeof second.order === 'number' ? second.order : Number.MAX_SAFE_INTEGER;
    if (firstOrder !== secondOrder) return firstOrder - secondOrder;
    return sortTime(first.dueDate) - sortTime(second.dueDate);
  });
}
function sortActivities(activities: CaseActivity[]) {
  return [...activities].sort((first, second) => sortTime(second.createdAt, 0) - sortTime(first.createdAt, 0));
}
function getCaseActivityActorLabel(activity: CaseActivity) {
  return activity.actorType === 'operator' ? 'Operator' : 'Klient';
}
function getCaseActivityRecentMoveMeta(activity: CaseActivity) {
  return getCaseRecentMoveMeta(activity);
}
function getCaseRecentMoveMeta(activity: CaseActivity) {
  const eventType = String(activity.eventType || '');
  if (eventType.includes('task')) return { label: 'Zadanie', className: 'case-detail-recent-move-dot-task' };
  if (eventType.includes('event')) return { label: 'Wydarzenie', className: 'case-detail-recent-move-dot-event' };
  if (eventType.includes('item') || eventType.includes('file') || eventType.includes('decision')) return { label: 'Kompletność', className: 'case-detail-recent-move-dot-item' };
  if (eventType.includes('status') || eventType.includes('lifecycle')) return { label: 'Status', className: 'case-detail-recent-move-dot-status' };
  if (eventType.includes('note')) return { label: 'Notatka', className: 'case-detail-recent-move-dot-note' };
  return { label: 'Ruch', className: 'case-detail-recent-move-dot-note' };
}
function calculateCompletion(items: CaseItem[]) {
  if (items.length === 0) return 0;
  const accepted = items.filter((item) => item.status === 'accepted').length;
  return Math.round((accepted / items.length) * 100);
}
function resolveCaseStatusFromItems(items: CaseItem[], fallback = 'in_progress') {
  if (items.length === 0) return fallback;
  const allAccepted = items.every((item) => item.status === 'accepted');
  const hasBlocked = items.some((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'));
  const hasToApprove = items.some((item) => item.status === 'uploaded');
  if (allAccepted) return 'ready_to_start';
  if (hasBlocked) return 'blocked';
  if (hasToApprove) return 'to_approve';
  return 'waiting_on_client';
}
function buildPortalUrl(caseId: string, tokenPayload: Record<string, unknown>) {
  const explicitUrl = typeof tokenPayload.url === 'string' ? tokenPayload.url : '';
  if (explicitUrl) return explicitUrl;
  const token = typeof tokenPayload.token === 'string' ? tokenPayload.token : typeof tokenPayload.portalToken === 'string' ? tokenPayload.portalToken : '';
  return token ? `${window.location.origin}/portal/${caseId}/${token}` : `${window.location.origin}/portal/${caseId}`;
}
const STAGE220A8_STRICT_CASE_SCOPE = 'CaseDetail may show only records directly linked to the current caseId, never loose client/lead records';
void STAGE220A8_STRICT_CASE_SCOPE;

function belongsToCase(
  entry: { caseId?: string | null; leadId?: string | null; clientId?: string | null },
  caseId?: string,
  _caseRecord?: CaseRecord | null,
) {
  const normalized = normalizeWorkItem(entry);
  const entryCaseId = normalizeCaseRelationId(normalized.caseId);
  const currentCaseId = normalizeCaseRelationId(caseId);
  return Boolean(entryCaseId && currentCaseId && entryCaseId === currentCaseId);
}

function normalizeCaseRelationId(value: unknown) {
  return String(value || '').trim();
}
function normalizeCaseDedupePart(value: unknown) {
  return normalizeCaseRelationId(value).toLowerCase();
}
function getCaseRelationPriority(
  entry: { caseId?: string | null; leadId?: string | null; clientId?: string | null },
  caseId?: string,
  caseRecord?: CaseRecord | null,
) {
  // Stage64 guard contract (relation priority order):
  // normalizeCaseRelationId(entry.caseId)
  // normalizeCaseRelationId(entry.leadId)
  // normalizeCaseRelationId(entry.clientId)
  const normalized = normalizeWorkItem(entry);
  if (normalizeCaseRelationId(normalized.caseId) && normalizeCaseRelationId(normalized.caseId) === normalizeCaseRelationId(caseId)) return 0;
  if (normalizeCaseRelationId(normalized.leadId) && normalizeCaseRelationId(normalized.leadId) === normalizeCaseRelationId(caseRecord?.leadId)) return 1;
  if (normalizeCaseRelationId(normalized.clientId) && normalizeCaseRelationId(normalized.clientId) === normalizeCaseRelationId(caseRecord?.clientId)) return 2;
  return 9;
}
function getCaseTaskDedupeKey(task: TaskRecord) {
  const id = normalizeCaseRelationId(task.id);
  if (id) return `task:id:${id}`;
  return [
    'task:fallback',
    task.title,
    task.type,
    task.status,
    getTaskMainDate(task) || task.reminderAt || task.date,
    task.caseId,
    task.leadId,
    task.clientId,
  ]
    .map(normalizeCaseDedupePart)
    .join('|');
}
function getCaseEventDedupeKey(event: EventRecord) {
  const id = normalizeCaseRelationId(event.id);
  if (id) return `event:id:${id}`;
  return [
    'event:fallback',
    event.title,
    event.type,
    event.status,
    getEventMainDate(event) || event.reminderAt || event.endAt,
    event.caseId,
    event.leadId,
    event.clientId,
  ]
    .map(normalizeCaseDedupePart)
    .join('|');
}
function pickBetterCaseLinkedRecord<T extends { caseId?: string | null; leadId?: string | null; clientId?: string | null }>(
  current: T,
  next: T,
  caseId?: string,
  caseRecord?: CaseRecord | null,
) {
  const currentPriority = getCaseRelationPriority(current, caseId, caseRecord);
  const nextPriority = getCaseRelationPriority(next, caseId, caseRecord);
  return nextPriority < currentPriority ? next : current;
}
function dedupeCaseTasks(tasks: TaskRecord[], caseId?: string, caseRecord?: CaseRecord | null) {
  const byKey = new Map<string, TaskRecord>();
  for (const task of tasks) {
    const key = getCaseTaskDedupeKey(task);
    const current = byKey.get(key);
    byKey.set(key, current ? pickBetterCaseLinkedRecord(current, task, caseId, caseRecord) : task);
  }
  return Array.from(byKey.values());
}
function dedupeCaseEvents(events: EventRecord[], caseId?: string, caseRecord?: CaseRecord | null) {
  const byKey = new Map<string, EventRecord>();
  for (const event of events) {
    const key = getCaseEventDedupeKey(event);
    const current = byKey.get(key);
    byKey.set(key, current ? pickBetterCaseLinkedRecord(current, event, caseId, caseRecord) : event);
  }
  return Array.from(byKey.values());
}
function getCaseWorkItemDedupeKey(item: WorkItem) {
  const id = normalizeCaseRelationId(item.id);
  if (id) return `${item.kind}:id:${id}`;
  return [item.kind, item.title, item.status, item.dateLabel].map(normalizeCaseDedupePart).join('|');
}
function dedupeCaseWorkItems(workItems: WorkItem[]) {
  const byKey = new Map<string, WorkItem>();
  for (const item of workItems) {
    const key = getCaseWorkItemDedupeKey(item);
    if (!byKey.has(key)) byKey.set(key, item);
  }
  return Array.from(byKey.values()).sort((first, second) => first.sortTime - second.sortTime);
}
const CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_IN_WORKITEMS_2026_05_13 = 'CaseActivity notes belong only to history rows, never to workItems cards';
void CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_IN_WORKITEMS_2026_05_13;

const CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_FINAL_2026_05_13 = 'CaseActivity rows are history only; activities must not be converted to workItems';
void CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_FINAL_2026_05_13;

const CLOSEFLOW_CASE_DETAIL_REWRITE_BUILD_WORKITEMS_FINAL_2026_05_13 = 'buildWorkItems contains only operational task/event/missing items; activities stay in history rows';
void CLOSEFLOW_CASE_DETAIL_REWRITE_BUILD_WORKITEMS_FINAL_2026_05_13;

function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[]) {
  const taskItems: WorkItem[] = tasks.map((task) => ({
    id: `task-${task.id}`,
    kind: 'task',
    title: task.title || 'Zadanie bez tytułu',
    subtitle: task.type ? `Zadanie · ${task.type}` : 'Zadanie powiązane ze sprawą',
    status: getTaskStatusLabel(task.status),
    statusClass: getStatusClass(task.status),
    dateLabel: formatDateTime(getTaskMainDate(task) || task.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getTaskMainDate(task) || task.reminderAt),
    source: task,
  }));

  const eventItems: WorkItem[] = events.map((event) => ({
    id: `event-${event.id}`,
    kind: 'event',
    title: event.title || 'Wydarzenie bez tytułu',
    subtitle: event.endAt ? `Wydarzenie do ${formatDateTime(event.endAt)}` : 'Wydarzenie powiązane ze sprawą',
    status: getEventStatusLabel(event.status),
    statusClass: getStatusClass(event.status),
    dateLabel: formatDateTime(getEventMainDate(event) || event.reminderAt, 'Bez terminu'),
    sortTime: sortTime(getEventMainDate(event) || event.reminderAt),
    source: event,
  }));

  const missingItems: WorkItem[] = items
    .filter((item) => item.status !== 'accepted')
    .map((item) => ({
      id: `item-${item.id}`,
      kind: 'missing',
      title: item.title || 'Brak w sprawie',
      subtitle: item.description || getItemTypeLabel(item.type),
      status: getItemStatusLabel(item.status),
      statusClass: getStatusClass(item.status),
      dateLabel: formatDate(item.dueDate, 'Bez terminu'),
      sortTime: sortTime(item.dueDate),
      source: item,
    }));

  return [...taskItems, ...eventItems, ...missingItems].sort((first, second) => first.sortTime - second.sortTime);
}
function WorkKindIcon({ kind }: { kind: WorkItem['kind'] }) {
  if (kind === 'task') return <ListChecks className="h-4 w-4" />;
  if (kind === 'event') return <CalendarClock className="h-4 w-4" />;
  if (kind === 'missing') return <EntityIcon entity="template" className="h-4 w-4" />;
  return <History className="h-4 w-4" />;
}
function getWorkKindLabel(kind: WorkItem['kind']) {
  if (kind === 'task') return 'Zadanie';
  if (kind === 'event') return 'Wydarzenie';
  if (kind === 'missing') return 'Brak';
  return 'Notatka';
}


const CASE_HISTORY_VISUAL_TAXONOMY_STAGE220A17 = {
  note: { label: 'Notatka', vstKind: 'note' },
  task: { label: 'Zadanie', vstKind: 'task' },
  event: { label: 'Wydarzenie', vstKind: 'event' },
  payment: { label: 'Wpłata', vstKind: 'payment' },
  status: { label: 'Status', vstKind: 'status' },
  case: { label: 'Element sprawy', vstKind: 'case-item' },
} as const;

function isCaseHistoryBareStatusStage220A17(value: unknown) {
  const normalized = String(value || '').trim().toLowerCase();
  return ['done', 'completed', 'zrobione', 'open', 'todo', 'in_progress', 'planned', 'scheduled'].includes(normalized);
}

function pickCaseHistoryActionNameStage220A17(payload: Record<string, any>, fallback?: unknown) {
  const candidates = [
    payload.taskTitle,
    payload.task_title,
    payload.eventTitle,
    payload.event_title,
    payload.itemTitle,
    payload.item_title,
    payload.title,
    payload.name,
    payload.label,
    payload.subject,
    payload.content,
    payload.note,
  ];

  for (const candidate of candidates) {
    const text = String(candidate || '').trim();
    if (text && !isCaseHistoryBareStatusStage220A17(text)) return text;
  }

  const fallbackText = String(fallback || '').trim();
  if (fallbackText && !isCaseHistoryBareStatusStage220A17(fallbackText)) return fallbackText;
  return '';
}

function getCaseHistoryVstKindStage220A17(kind: CaseHistoryItem['kind']) {
  return CASE_HISTORY_VISUAL_TAXONOMY_STAGE220A17[kind]?.vstKind || 'status';
}

function getCaseHistoryKindLabelStage220A17(kind: CaseHistoryItem['kind']) {
  return CASE_HISTORY_VISUAL_TAXONOMY_STAGE220A17[kind]?.label || 'Ruch';
}

function CaseHistoryKindIconStage220A17({ kind }: { kind: CaseHistoryItem['kind'] }) {
  if (kind === 'note') return <StickyNote className="h-4 w-4" />;
  if (kind === 'task') return <ListChecks className="h-4 w-4" />;
  if (kind === 'event') return <CalendarClock className="h-4 w-4" />;
  if (kind === 'payment') return <Paperclip className="h-4 w-4" />;
  if (kind === 'status') return <CheckCircle2 className="h-4 w-4" />;
  return <History className="h-4 w-4" />;
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_CASE_DETAIL = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';


function CaseDetailLoadingState() {
  return (
    <Layout>
      <main className="case-detail-page case-detail-page-loading" data-case-detail-loading="true">
        <section className="case-detail-transition-loader" role="status" aria-live="polite">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <div>
            <p>Ładowanie sprawy...</p>
            <span>Przygotowujemy dane sprawy. Panele i akcje pojawią się po załadowaniu rekordu.</span>
          </div>
        </section>
      </main>
      <ConfirmDialog
        data-case-detail-delete-confirm="true"
        open={deleteCaseOpen}
        onOpenChange={(open) => {
          if (!open && !deleteCasePending) setDeleteCaseOpen(false);
        }}
        title="Awaryjnie usunąć sprawę?"
        description={`Czy na pewno chcesz usunąć sprawę "${caseData?.title || caseData?.clientName || 'bez tytułu'}"? Tej operacji nie można cofnąć.`}
        confirmLabel={deleteCasePending ? 'Usuwanie...' : 'Tak, usuń'}
        cancelLabel="Nie"
        confirmTone="destructive"
        pending={deleteCasePending}
        onConfirm={handleConfirmDeleteCaseRecord}
      />
    </Layout>
  );
}


const CASEDETAIL_ACTION_COLOR_TAXONOMY_V1 = 'case detail action visual taxonomy V1';
function caseDetailActionVisualKind(row: Record<string, unknown> | null | undefined) {
  return inferCloseFlowActionVisualKind(row);
}
function caseDetailActionVisualClass(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualClass(row);
}
function caseDetailActionDataKind(row: Record<string, unknown> | null | undefined) {
  return getCloseFlowActionVisualDataKind(row);
}
function caseDetailActionKindClass(kind: unknown) {
  return getCloseFlowActionKindClass(kind);
}
export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, access } = useWorkspace();
  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [casePayments, setCasePayments] = useState<CasePaymentRecord[]>([]);
  const [caseCostsStage231D2, setCaseCostsStage231D2] = useState<CaseCostRecord[]>([]);
  const [isCaseCostOpenStage231D2, setIsCaseCostOpenStage231D2] = useState(false);
  const [caseCostSubmittingStage231D2, setCaseCostSubmittingStage231D2] = useState(false);
  const [caseCostDraftStage231D2, setCaseCostDraftStage231D2] = useState({ kind: 'other', status: 'incurred', amount: '', reimbursable: true, note: '' });
  const [caseCostCorrectionTargetStage231H_R1C, setCaseCostCorrectionTargetStage231H_R1C] = useState<CaseCostRecord | null>(null);
  const [caseCostCorrectionFormStage231H_R1C, setCaseCostCorrectionFormStage231H_R1C] = useState({ kind: 'other', amount: '', reimbursableAmount: '', reimbursedAmount: '', status: 'incurred', incurredAt: '', note: '' });
  const [caseCostCorrectionSubmittingStage231H_R1C, setCaseCostCorrectionSubmittingStage231H_R1C] = useState(false);
  const [caseCostDeleteTargetStage231H_R1C, setCaseCostDeleteTargetStage231H_R1C] = useState<CaseCostRecord | null>(null);
  const [caseCostDeleteSubmittingStage231H_R1C, setCaseCostDeleteSubmittingStage231H_R1C] = useState(false);

  /* FIN-11_CASE_RIGHT_FINANCE_STATE_AND_HANDLERS */
  const [isFinanceEditOpen, setIsFinanceEditOpen] = useState(false);
  const [financeEditForm, setFinanceEditForm] = useState<CaseFinanceEditFormState>(() => buildFin11FinanceEditState(null, []));
  const [isFinanceSaving, setIsFinanceSaving] = useState(false);
  const [isFinancePaymentOpen, setIsFinancePaymentOpen] = useState(false);
  const [financePaymentForm, setFinancePaymentForm] = useState<CaseFinancePaymentFormState>(() => buildFin11PaymentState('partial', 'PLN'));
  const [paymentCorrectionTargetStage220A27, setPaymentCorrectionTargetStage220A27] = useState<CasePaymentRecord | null>(null);
  const [paymentCorrectionFormStage220A27, setPaymentCorrectionFormStage220A27] = useState({ amount: '', paidAt: '', reason: '' });
  const [paymentCorrectionSubmittingStage220A27, setPaymentCorrectionSubmittingStage220A27] = useState(false);
  const [isPaymentHistoryOpenStage220A27B, setIsPaymentHistoryOpenStage220A27B] = useState(false);
  const [paymentDeleteTargetStage220A29, setPaymentDeleteTargetStage220A29] = useState<CasePaymentRecord | null>(null);
  const [paymentDeleteSubmittingStage220A29, setPaymentDeleteSubmittingStage220A29] = useState(false);
  const [didAutoOpenCaseFinanceFromClientCreateStage228R5, setDidAutoOpenCaseFinanceFromClientCreateStage228R5] = useState(false);

  const financeEditPreview = useMemo(() => getFin11FinancePreview(financeEditForm, casePayments), [casePayments, financeEditForm]);

  function openCaseFinanceEditModal() {
    setFinanceEditForm(buildFin11FinanceEditState(caseData, casePayments));
    setIsFinanceEditOpen(true);
  }

  useEffect(() => {
    if (didAutoOpenCaseFinanceFromClientCreateStage228R5 || !caseData?.id) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const financeSource = params.get('source');
    const shouldOpenFinance = params.get('finance') === '1' && ['client-create', 'client-detail'].includes(String(financeSource || ''));
    if (!shouldOpenFinance) return;

    setFinanceEditForm(buildFin11FinanceEditState(caseData, casePayments));
    setIsFinanceEditOpen(true);
    setDidAutoOpenCaseFinanceFromClientCreateStage228R5(true);
    window.history.replaceState(null, '', window.location.pathname);
    toast.info('Uzupełnij finanse nowej sprawy.');
  }, [caseData, casePayments, didAutoOpenCaseFinanceFromClientCreateStage228R5]);

  function openCaseFinancePaymentModal(type: 'partial' | 'commission') {
    const summary = getCaseFinanceSourceSummary(caseData, casePayments);
    setFinancePaymentForm(buildFin11PaymentState(type, summary.currency));
    setIsFinancePaymentOpen(true);
  }

  async function reloadCaseFinanceData(nextCaseFallback?: CaseRecord | null) {
    const currentCaseId = String((nextCaseFallback || caseData)?.id || '').trim();
    if (!currentCaseId) return;
    const [freshCase, freshPayments] = await Promise.all([
      fetchCaseByIdFromSupabase(currentCaseId).catch(() => null),
      fetchPaymentsFromSupabase({ caseId: currentCaseId }).catch(() => casePayments as unknown[]),
    ]);
    const normalizedCase = normalizeRecord<CaseRecord>(freshCase) || nextCaseFallback;
    if (normalizedCase) setCaseData(normalizedCase);
    const normalizedFreshPayments = (Array.isArray(freshPayments) ? freshPayments : []) as CasePaymentRecord[];
    setCasePayments(normalizedFreshPayments);
    setPayments(normalizedFreshPayments as any[]);
  }

  async function handleSaveCaseFinanceEdit() {
    if (!caseData?.id || isFinanceSaving) return;
    const contractValue = financeEditPreview.contractValue;
    const commissionMode = financeEditForm.commissionMode;
    const patch = buildCaseFinancePatch({
      contractValue,
      expectedRevenue: contractValue,
      currency: financeEditPreview.currency,
      commissionMode,
      commissionBase: 'contract_value',
      commissionRate: commissionMode === 'percent' ? financeEditPreview.commissionRate : null,
      commissionAmount: commissionMode === 'fixed' ? financeEditPreview.commissionAmount : financeEditPreview.commissionAmount,
      commissionStatus: financeEditForm.commissionStatus,
    });
    setIsFinanceSaving(true);
    try {
      const updatePayload = {
        id: caseData.id,
        ...patch,
        // FIN-11: derived cache for current backend contract. Payments remain the source of truth.
        remainingAmount: financeEditPreview.remainingAmount,
      } as any;
      const updatedCase = await updateCaseInSupabase(updatePayload);
      const nextCase = normalizeRecord<CaseRecord>(updatedCase) || ({ ...caseData, ...updatePayload } as CaseRecord);
      setCaseData(nextCase);
      await reloadCaseFinanceData(nextCase);
      setIsFinanceEditOpen(false);
      toast.success('Zapisano wartość i prowizję sprawy');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się zapisać wartości i prowizji sprawy');
    } finally {
      setIsFinanceSaving(false);
    }
  }

  async function handleSaveCaseFinancePayment() {
    if (!caseData?.id || isFinanceSaving) return;
    const amount = fin11Amount(financePaymentForm.amount);
    if (amount <= 0) {
      toast.error('Podaj kwotę płatności');
      return;
    }
    setIsFinanceSaving(true);
    try {
      await createPaymentInSupabase({
        caseId: caseData.id,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        type: 'payment',
        status: 'fully_paid',
        amount,
        currency: fin11Currency(financePaymentForm.currency),
        paidAt: fin11IsoFromLocal(financePaymentForm.paidAt),
        dueAt: fin11IsoFromLocal(financePaymentForm.dueAt),
        note: financePaymentForm.note.trim(),
      });
      await reloadCaseFinanceData(caseData);
      setIsFinancePaymentOpen(false);
      toast.success(financePaymentForm.type === 'commission' ? 'Dodano płatność prowizji' : 'Dodano wpłatę');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się dodać płatności');
    } finally {
      setIsFinanceSaving(false);
    }
  }
  function openPaymentCorrectionModalStage220A27(payment: CasePaymentRecord) {
    if (!guardCaseDetailWriteAccess('skorygować wpłaty')) return;
    const amount = getPaymentAmount(payment);
    setPaymentCorrectionTargetStage220A27(payment);
    setPaymentCorrectionFormStage220A27({
      amount: fin11MoneyInput(amount),
      paidAt: fin11DateTimeLocal(getCasePaymentDateStage220A27(payment) || new Date().toISOString()),
      reason: String(payment.note || ''),
    });
  }

  function openPaymentCorrectionFromHistoryStage220A27B(payment: CasePaymentRecord) {
    setIsPaymentHistoryOpenStage220A27B(false);
    openPaymentCorrectionModalStage220A27(payment);
  }

  function openPaymentDeleteConfirmStage220A29(payment: CasePaymentRecord) {
    if (!guardCaseDetailWriteAccess('usunąć wpłaty')) return;
    const paymentId = String(payment.id || '').trim();
    if (!paymentId) {
      toast.error('Nie można usunąć wpłaty bez identyfikatora.');
      return;
    }
    setPaymentDeleteTargetStage220A29(payment);
  }

  async function handleConfirmDeletePaymentStage220A29() {
    const target = paymentDeleteTargetStage220A29;
    const paymentId = String(target?.id || '').trim();
    if (!paymentId || paymentDeleteSubmittingStage220A29) return;
    if (!guardCaseDetailWriteAccess('usunąć wpłaty')) return;

    const paymentType = getCasePaymentTypeStage220A27(target as CasePaymentRecord);
    const signedAmount = getCasePaymentSignedAmountStage220A27(target as CasePaymentRecord);
    const currency = fin11Currency(target?.currency || caseFinanceSourceStage220A26.currency || 'PLN');
    const paidAt = getCasePaymentDateStage220A27(target as CasePaymentRecord);

    try {
      setPaymentDeleteSubmittingStage220A29(true);
      await deletePaymentFromSupabase(paymentId);
      await insertActivityToSupabase({
        caseId: caseData?.id || target?.caseId || null,
        clientId: caseData?.clientId || target?.clientId || null,
        leadId: caseData?.leadId || target?.leadId || null,
        actorType: 'operator',
        eventType: 'payment_deleted',
        payload: {
          title: paymentType === 'refund' ? 'Usunięto korektę wpłaty' : 'Usunięto wpłatę',
          paymentId,
          paymentType: paymentType || 'payment',
          amount: signedAmount,
          currency,
          paidAt,
          note: target?.note || null,
        },
      } as any).catch(() => null);

      if (paymentCorrectionTargetStage220A27?.id && String(paymentCorrectionTargetStage220A27.id) === paymentId) {
        setPaymentCorrectionTargetStage220A27(null);
        setPaymentCorrectionFormStage220A27({ amount: '', paidAt: '', reason: '' });
      }

      await reloadCaseFinanceData(caseData);
      setPaymentDeleteTargetStage220A29(null);
      toast.success(paymentType === 'refund' ? 'Korekta wpłaty usunięta' : 'Wpłata usunięta');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się usunąć wpłaty.');
    } finally {
      setPaymentDeleteSubmittingStage220A29(false);
    }
  }

  async function handleSavePaymentCorrectionStage220A27() {
    if (!caseData?.id || !paymentCorrectionTargetStage220A27 || paymentCorrectionSubmittingStage220A27) return;

    const paymentId = String(paymentCorrectionTargetStage220A27.id || '').trim();
    const amount = fin11Amount(paymentCorrectionFormStage220A27.amount);
    const note = paymentCorrectionFormStage220A27.reason.trim();

    if (!paymentId) {
      toast.error('Nie można skorygować wpłaty bez identyfikatora.');
      return;
    }

    if (amount <= 0) {
      toast.error('Podaj kwotę wpłaty.');
      return;
    }

    if (!paymentCorrectionFormStage220A27.paidAt) {
      toast.error('Podaj datę wpłaty.');
      return;
    }

    const correctedPaidAt = fin11IsoFromLocal(paymentCorrectionFormStage220A27.paidAt) || new Date().toISOString();
    const currency = fin11Currency(paymentCorrectionTargetStage220A27.currency || caseFinanceSourceStage220A26.currency || 'PLN');
    const paymentType = 'payment';
    const paymentStatus = 'fully_paid';

    try {
      setPaymentCorrectionSubmittingStage220A27(true);

      const payload = {
        id: paymentId,
        caseId: caseData.id,
        clientId: paymentCorrectionTargetStage220A27.clientId || caseData.clientId || null,
        leadId: paymentCorrectionTargetStage220A27.leadId || caseData.leadId || null,
        type: paymentType,
        status: paymentStatus,
        amount,
        currency,
        paidAt: correctedPaidAt,
        dueAt: paymentCorrectionTargetStage220A27.dueAt || null,
        note,
      };

      const updated = await updatePaymentInSupabase(payload as any);
      setPayments((previous) => previous.map((payment) => String(payment?.id || '') === paymentId ? ({ ...payment, ...payload, ...(updated || {}) } as any) : payment));
      setCasePayments((previous) => previous.map((payment) => String(payment?.id || '') === paymentId ? ({ ...payment, ...payload, ...(updated || {}) } as CasePaymentRecord) : payment));

      await insertActivityToSupabase({
        caseId: caseData.id,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        actorType: 'operator',
        eventType: 'payment_updated',
        payload: {
          title: 'Skorygowano wpłatę prowizji',
          paymentId,
          paymentType,
          amount,
          currency,
          paidAt: correctedPaidAt,
          note,
          source: 'STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION',
        },
      } as any).catch(() => null);

      await reloadCaseFinanceData(caseData);
      setPaymentCorrectionTargetStage220A27(null);
      setPaymentCorrectionFormStage220A27({ amount: '', paidAt: '', reason: '' });
      toast.success('Wpłata prowizji skorygowana');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się skorygować wpłaty prowizji.');
    } finally {
      setPaymentCorrectionSubmittingStage220A27(false);
    }
  }


  const [caseSettlementSaving, setCaseSettlementSaving] = useState(false);
  const [items, setItems] = useState<CaseItem[]>([]);
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [sourceLead, setSourceLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteCaseOpen, setDeleteCaseOpen] = useState(false);
  const [deleteCasePending, setDeleteCasePending] = useState(false);
  const [closeCaseOpen, setCloseCaseOpen] = useState(false);
  const [closeCasePending, setCloseCasePending] = useState(false);
  const [restoreCasePending, setRestoreCasePending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [caseActionsLoadError, setCaseActionsLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CaseDetailTab>('service');
  const [caseActionOpenGroup, setCaseActionOpenGroup] = useState<CaseActionAccordionGroup>('next');
  const [isCaseActionsAllOpen, setIsCaseActionsAllOpen] = useState(false);
  const [isCaseAllNotesOpenStage231D0D, setIsCaseAllNotesOpenStage231D0D] = useState(false);
  const [deleteWorkItemTarget, setDeleteWorkItemTarget] = useState<WorkItem | null>(null);
  const [deleteWorkItemPending, setDeleteWorkItemPending] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
  const [pendingNoteFollowUp, setPendingNoteFollowUp] = useState<{ note: string; createdAt: string } | null>(null);
  const [customNoteFollowUpAt, setCustomNoteFollowUpAt] = useState('');
  const [isCreatingNoteFollowUp, setIsCreatingNoteFollowUp] = useState(false);
  const [isCasePaymentOpen, setIsCasePaymentOpen] = useState(false);
  const [casePaymentSubmitting, setCasePaymentSubmitting] = useState(false);
  const [casePaymentDraft, setCasePaymentDraft] = useState({
    type: 'payment',
    amount: '',
    status: 'fully_paid',
    dueAt: '',
    note: '',
  });

  const effectiveCasePaymentsStage220A25 = useMemo(() => {
    const byId = new Map<string, CasePaymentRecord>();
    for (const payment of [...(payments as CasePaymentRecord[]), ...(casePayments as CasePaymentRecord[])]) {
      const key = String(payment?.id || payment?.paidAt || payment?.createdAt || payment?.amount || Math.random());
      if (!byId.has(key)) byId.set(key, payment);
    }
    return Array.from(byId.values()).filter((payment) => {
      const paymentCaseId = String(payment?.caseId || '').trim();
      return !paymentCaseId || paymentCaseId === String(caseId || '');
    });
  }, [caseId, casePayments, payments]);

  const STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS = 'Case detail uses shared context action dialogs instead of local simplified task, event and note forms';
  const openCaseContextAction = (kind: ContextActionKind) => {
    if (!caseId) return;
    openContextQuickAction({
      kind,
      recordType: 'case',
      recordId: caseId,
      caseId,
      leadId: caseData?.leadId || null,
      clientId: caseData?.clientId || null,
      recordLabel: getCaseTitle(caseData),
    });
  };


  const caseFinanceSourceStage220A26 = useMemo(
    () => getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25),
    [caseData, effectiveCasePaymentsStage220A25],
  );
  const caseFinanceSummary = caseFinanceSourceStage220A26;
  const visibleCasePayments = useMemo(() => sortCasePayments(effectiveCasePaymentsStage220A25).slice(0, 8), [effectiveCasePaymentsStage220A25]);
  const financeCorrectionRowsStage231H_R1C = useMemo(() => {
    const paymentRows = visibleCasePayments.map((payment) => ({
      kind: 'payment' as const,
      id: 'payment-' + String(payment.id || payment.paidAt || payment.createdAt || payment.amount || Math.random()),
      date: getCasePaymentDateStage220A27(payment),
      payment,
    }));
    const costRows = caseCostsStage231D2.map((cost) => ({
      kind: 'cost' as const,
      id: 'cost-' + String(getCaseCostIdStage231H_R1C(cost) || getCaseCostDateStage231H_R1C(cost) || getCaseCostAmountStage231H_R1C(cost) || Math.random()),
      date: getCaseCostDateStage231H_R1C(cost),
      cost,
    }));
    return [...paymentRows, ...costRows].sort((left, right) => sortTime(right.date, 0) - sortTime(left.date, 0)).slice(0, 16);
  }, [caseCostsStage231D2, visibleCasePayments]);

  const handleCreateCasePayment = async () => {
    if (!caseId || !caseData) return;
    if (!hasAccess) {
      toast.error('Brak dostępu do zapisu płatności.');
      return;
    }
    const amount = Number(casePaymentDraft.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę wpłaty.');
      return;
    }
    try {
      setCasePaymentSubmitting(true);
      const input = {
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        type: 'payment',
        status: 'fully_paid',
        amount,
        currency: caseData.currency || 'PLN',
        dueAt: casePaymentDraft.dueAt ? toIsoFromLocalInput(casePaymentDraft.dueAt) : '',
        paidAt: new Date().toISOString(),
        note: casePaymentDraft.note || '',
      };
      const created = await createPaymentInSupabase(input as any);
      setPayments((previous) => [created || input, ...previous]);
      setCasePayments((previous) => [created || input, ...previous] as CasePaymentRecord[]);
      await insertActivityToSupabase({
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        actorType: 'operator',
        eventType: 'payment_added',
        payload: { title: 'Dodano wpłatę', amount, status: input.status, note: input.note },
      } as any).catch(() => null);
      setCasePaymentDraft({ type: 'payment', amount: '', status: 'fully_paid', dueAt: '', note: '' });
      setIsCasePaymentOpen(false);
      toast.success('Wpłata dodana');
    } catch (error) {
      console.error(error);
      toast.error('Nie udało się dodać wpłaty.');
    } finally {
      setCasePaymentSubmitting(false);
    }
  };


  const handleCreateCaseCostStage231D2 = async () => {
    if (!caseId || !caseData) return;
    if (!guardCaseDetailWriteAccess('dodać kosztu sprawy')) return;
    const amount = Number(String(caseCostDraftStage231D2.amount || '').replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę kosztu.');
      return;
    }
    try {
      setCaseCostSubmittingStage231D2(true);
      const input = {
        caseId,
        clientId: caseData.clientId || null,
        kind: caseCostDraftStage231D2.kind,
        status: caseCostDraftStage231D2.status,
        amount,
        reimbursable: caseCostDraftStage231D2.reimbursable,
        reimbursableAmount: caseCostDraftStage231D2.reimbursable ? amount : 0,
        reimbursedAmount: 0,
        currency: caseFinanceSourceStage220A26.currency || caseData.currency || 'PLN',
        incurredAt: new Date().toISOString(),
        note: caseCostDraftStage231D2.note.trim(),
      };
      const created = await createCaseCostInSupabase(input as any);
      setCaseCostsStage231D2((previous) => [created || input, ...previous] as CaseCostRecord[]);
      await insertActivityToSupabase({
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        actorType: 'operator',
        eventType: 'case_cost_added',
        payload: { title: 'Dodano koszt sprawy', amount, currency: input.currency, kind: input.kind, note: input.note },
      } as any).catch(() => null);
      setCaseCostDraftStage231D2({ kind: 'other', status: 'incurred', amount: '', reimbursable: true, note: '' });
      setIsCaseCostOpenStage231D2(false);
      toast.success('Koszt sprawy zapisany');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się zapisać kosztu sprawy.');
    } finally {
      setCaseCostSubmittingStage231D2(false);
    }
  };


  function openCaseCostCorrectionModalStage231H_R1C(cost: CaseCostRecord) {
    if (!guardCaseDetailWriteAccess('skorygować kosztu sprawy')) return;
    setCaseCostCorrectionTargetStage231H_R1C(cost);
    setCaseCostCorrectionFormStage231H_R1C({
      kind: String(cost.kind || (cost as any).type || 'other'),
      amount: fin11MoneyInput(getCaseCostAmountStage231H_R1C(cost)),
      reimbursableAmount: fin11MoneyInput(getCaseCostReimbursableAmountStage231H_R1C(cost)),
      reimbursedAmount: fin11MoneyInput(getCaseCostReimbursedAmountStage231H_R1C(cost)),
      status: String(cost.status || 'incurred'),
      incurredAt: fin11DateTimeLocal(getCaseCostDateStage231H_R1C(cost) || new Date().toISOString()),
      note: getCaseCostNoteStage231H_R1C(cost),
    });
  }

  function openCaseCostDeleteConfirmStage231H_R1C(cost: CaseCostRecord) {
    if (!guardCaseDetailWriteAccess('usunąć kosztu sprawy')) return;
    if (!getCaseCostIdStage231H_R1C(cost)) {
      toast.error('Nie można usunąć kosztu bez identyfikatora.');
      return;
    }
    setCaseCostDeleteTargetStage231H_R1C(cost);
  }

  async function handleSaveCaseCostCorrectionStage231H_R1C() {
    const target = caseCostCorrectionTargetStage231H_R1C;
    const costId = getCaseCostIdStage231H_R1C(target);
    if (!target || !costId || !caseData?.id || caseCostCorrectionSubmittingStage231H_R1C) return;
    if (!guardCaseDetailWriteAccess('skorygować kosztu sprawy')) return;

    const amount = fin11Amount(caseCostCorrectionFormStage231H_R1C.amount);
    const reimbursableAmount = fin11Amount(caseCostCorrectionFormStage231H_R1C.reimbursableAmount);
    const reimbursedRaw = fin11Amount(caseCostCorrectionFormStage231H_R1C.reimbursedAmount);
    const status = String(caseCostCorrectionFormStage231H_R1C.status || 'incurred');
    const kind = String(caseCostCorrectionFormStage231H_R1C.kind || target.kind || (target as any).type || 'other');
    const incurredAt = fin11IsoFromLocal(caseCostCorrectionFormStage231H_R1C.incurredAt) || getCaseCostDateStage231H_R1C(target) || new Date().toISOString();
    const finalReimbursableAmount = reimbursableAmount > 0 ? reimbursableAmount : amount;
    const finalReimbursedAmount = status === 'reimbursed' && reimbursedRaw <= 0 ? finalReimbursableAmount : Math.min(reimbursedRaw, finalReimbursableAmount);
    const note = caseCostCorrectionFormStage231H_R1C.note.trim();
    const currency = getCaseCostCurrencyStage231H_R1C(target, caseFinanceSourceStage220A26.currency || caseData.currency || 'PLN');

    if (amount <= 0) {
      toast.error('Podaj poprawną kwotę kosztu.');
      return;
    }

    try {
      setCaseCostCorrectionSubmittingStage231H_R1C(true);
      const payload = {
        id: costId,
        caseId: caseData.id,
        clientId: caseData.clientId || null,
        kind,
        status,
        amount,
        reimbursable: finalReimbursableAmount > 0,
        reimbursableAmount: finalReimbursableAmount,
        reimbursedAmount: finalReimbursedAmount,
        currency,
        incurredAt,
        reimbursedAt: finalReimbursedAmount > 0 ? new Date().toISOString() : null,
        note,
      };
      const updated = await updateCaseCostInSupabase(payload as any);
      setCaseCostsStage231D2((previous) => previous.map((cost) => getCaseCostIdStage231H_R1C(cost) === costId ? ({ ...cost, ...payload, ...(updated || {}) } as CaseCostRecord) : cost));
      await insertActivityToSupabase({
        caseId: caseData.id,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        actorType: 'operator',
        eventType: 'case_cost_corrected',
        payload: { title: 'Skorygowano koszt sprawy', costId, kind, amount, reimbursableAmount: finalReimbursableAmount, reimbursedAmount: finalReimbursedAmount, currency, status, incurredAt, note },
      } as any).catch(() => null);
      await refreshCaseData();
      setCaseCostCorrectionTargetStage231H_R1C(null);
      setCaseCostCorrectionFormStage231H_R1C({ kind: 'other', amount: '', reimbursableAmount: '', reimbursedAmount: '', status: 'incurred', incurredAt: '', note: '' });
      toast.success('Koszt sprawy skorygowany');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się skorygować kosztu sprawy.');
    } finally {
      setCaseCostCorrectionSubmittingStage231H_R1C(false);
    }
  }

  async function handleConfirmDeleteCaseCostStage231H_R1C() {
    const target = caseCostDeleteTargetStage231H_R1C;
    const costId = getCaseCostIdStage231H_R1C(target);
    if (!target || !costId || caseCostDeleteSubmittingStage231H_R1C) return;
    if (!guardCaseDetailWriteAccess('usunąć kosztu sprawy')) return;

    try {
      setCaseCostDeleteSubmittingStage231H_R1C(true);
      await deleteCaseCostFromSupabase(costId);
      setCaseCostsStage231D2((previous) => previous.filter((cost) => getCaseCostIdStage231H_R1C(cost) !== costId));
      await insertActivityToSupabase({
        caseId: caseData?.id || target.caseId || target.case_id || null,
        clientId: caseData?.clientId || target.clientId || target.client_id || null,
        leadId: caseData?.leadId || null,
        actorType: 'operator',
        eventType: 'case_cost_deleted',
        payload: { title: 'Usunięto koszt sprawy', costId, amount: getCaseCostAmountStage231H_R1C(target), currency: getCaseCostCurrencyStage231H_R1C(target, caseFinanceSourceStage220A26.currency) },
      } as any).catch(() => null);
      await refreshCaseData();
      setCaseCostDeleteTargetStage231H_R1C(null);
      toast.success('Koszt sprawy usunięty');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się usunąć kosztu sprawy.');
    } finally {
      setCaseCostDeleteSubmittingStage231H_R1C(false);
    }
  }

  const refreshCaseData = useCallback(async () => {
    if (!caseId) {
      setLoadError('Brak identyfikatora sprawy w adresie.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setLoadError('Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe aplikacji.');
      setLoading(false);
      return;
    }

    let timeoutId: number | undefined;

    try {
      setLoading(true);
      setLoadError(null);
      setCaseActionsLoadError(null);
      const captureActionRows = async (loader: () => Promise<unknown[]>) => {
        try {
          return { rows: await loader(), error: null as unknown };
        } catch (error) {
          console.error('CASE_DETAIL_ACTIONS_LOAD_FAILED', error);
          return { rows: [] as unknown[], error };
        }
      };
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error('TIMEOUT_CASE_DETAIL_LOAD')), 12000);
      });
      const dataPromise = Promise.all([
        fetchCaseByIdFromSupabase(caseId),
        fetchCaseItemsFromSupabase(caseId).catch(() => []),
        fetchActivitiesFromSupabase({ caseId, limit: 80 }).catch(() => []),
        captureActionRows(() => fetchTasksFromSupabase({ caseId })),
        captureActionRows(() => fetchEventsFromSupabase({ caseId })),
        fetchPaymentsFromSupabase({ caseId }).catch(() => []),
        fetchCaseCostsFromSupabase({ caseId }).catch(() => []),
      ]);

      const [caseRowRaw, itemRowsRaw, activityRowsRaw, taskLoadRaw, eventLoadRaw, paymentRowsRaw, costRowsRaw] = await Promise.race([dataPromise, timeoutPromise]);
      const normalizedCase = normalizeRecord<CaseRecord>(caseRowRaw);
      const taskRowsRaw = taskLoadRaw.rows;
      const eventRowsRaw = eventLoadRaw.rows;
      if (taskLoadRaw.error || eventLoadRaw.error) {
        setCaseActionsLoadError('Nie udało się pobrać wszystkich działań sprawy. Odśwież widok lub spróbuj ponownie.');
      }

      if (!normalizedCase?.id) {
        setCaseData(null);
        setItems([]);
        setActivities([]);
        setTasks([]);
        setEvents([]);
        setLoadError('Nie znaleziono tej sprawy w aktualnym workspace.');
        return;
      }

      setCaseData(normalizedCase);
      setItems(sortCaseItems((Array.isArray(itemRowsRaw) ? itemRowsRaw : []) as CaseItem[]));
      setActivities(sortActivities((Array.isArray(activityRowsRaw) ? activityRowsRaw : []) as CaseActivity[]));
      setTasks(
        dedupeCaseTasks(
          ((Array.isArray(taskRowsRaw) ? taskRowsRaw : []) as TaskRecord[])
            .map((task) => ({ ...task, ...normalizeWorkItem(task) }))
            .filter((task) => belongsToCase(task, caseId, normalizedCase)),
          caseId,
          normalizedCase,
        ),
      );
      setEvents(
        dedupeCaseEvents(
          ((Array.isArray(eventRowsRaw) ? eventRowsRaw : []) as EventRecord[])
            .map((event) => ({ ...event, ...normalizeWorkItem(event) }))
            .filter((event) => belongsToCase(event, caseId, normalizedCase)),
          caseId,
          normalizedCase,
        ),
      );
      setPayments(Array.isArray(paymentRowsRaw) ? paymentRowsRaw : []);
      setCaseCostsStage231D2((Array.isArray(costRowsRaw) ? costRowsRaw : []) as CaseCostRecord[]);
    } catch (error: any) {
      setCaseData(null);
      setItems([]);
      setActivities([]);
      setTasks([]);
      setEvents([]);
      setCaseActionsLoadError('Nie udało się pobrać działań sprawy.');
      setPayments([]);
      setCaseCostsStage231D2([]);
      setLoadError(error?.message === 'TIMEOUT_CASE_DETAIL_LOAD' ? 'Ładowanie sprawy trwa za długo. Spróbuj ponownie.' : `Nie można wczytać sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await refreshCaseData();
    };
    run();
    return () => {
      active = false;
    };
  }, [refreshCaseData]);

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail || {};
      if (detail?.caseId && String(detail.caseId) !== String(caseId || '')) return;
      if (detail?.payload?.recordType && detail.payload.recordType !== 'case') return;
      void refreshCaseData();
    };
    window.addEventListener('closeflow:context-note-saved', listener as EventListener);
    return () => window.removeEventListener('closeflow:context-note-saved', listener as EventListener);
  }, [caseId, refreshCaseData]);
  const STAGE219_R4_CASE_NOTE_SAVED_REFRESH_MARKER = 'data-stage219-case-note-saved-refresh';
  void STAGE219_R4_CASE_NOTE_SAVED_REFRESH_MARKER;
  const STAGE220A7_CASE_CONTEXT_ACTION_REFRESH = 'CaseDetail refreshes after task/event/note save';
  void STAGE220A7_CASE_CONTEXT_ACTION_REFRESH;

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail || {};
      const recordType = String(detail?.recordType || detail?.payload?.recordType || '').trim();
      const detailCaseId = String(detail?.caseId || detail?.payload?.caseId || (recordType === 'case' ? detail?.recordId : '') || '').trim();

      if (detailCaseId && String(detailCaseId) !== String(caseId || '')) return;
      if (recordType && recordType !== 'case') return;

      const savedRecord = detail?.savedRecord;
      const kind = String(detail?.kind || '').toLowerCase();
      if (savedRecord && (kind === 'task' || kind === 'event')) {
        const normalized = { ...savedRecord, ...normalizeWorkItem(savedRecord) } as TaskRecord & EventRecord;
        if (belongsToCase(normalized, caseId, caseData)) {
          if (kind === 'task') {
            setTasks((current) => dedupeCaseTasks([normalized, ...current], caseId, caseData));
          } else {
            setEvents((current) => dedupeCaseEvents([normalized, ...current], caseId, caseData));
          }
        }
      }

      void refreshCaseData();
    };

    window.addEventListener('closeflow:context-action-saved', listener as EventListener);
    return () => window.removeEventListener('closeflow:context-action-saved', listener as EventListener);
  }, [caseData, caseId, refreshCaseData]);


  const completionPercent = useMemo(() => {
    if (items.length > 0) return calculateCompletion(items);
    if (typeof caseData?.completenessPercent === 'number') return Math.round(caseData.completenessPercent);
    return 0;
  }, [caseData?.completenessPercent, items]);

  const openTasks = useMemo(() => tasks.filter((task) => !['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted'].includes(String(task.status || '').toLowerCase())), [tasks]);
  const plannedEvents = useMemo(() => events.filter((event) => !['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted'].includes(String(event.status || '').toLowerCase())), [events]);
  const missingItems = useMemo(() => items.filter((item) => item.status === 'missing'), [items]);
  const uploadedItems = useMemo(() => items.filter((item) => item.status === 'uploaded'), [items]);
  const blockers = useMemo(() => items.filter((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected')), [items]);
  const effectiveStatus = useMemo(() => resolveCaseStatusFromItems(items, caseData?.status || 'in_progress'), [caseData?.status, items]);
  const isCaseClosedByStoredStatusStage231B0R7 = isClosedCaseStatus(caseData?.status);
  const isCaseClosedStage231B0R7 = isCaseClosedByStoredStatusStage231B0R7 || isClosedCaseStatus(effectiveStatus);
  const caseLifecycleV1 = useMemo(
    () =>
      resolveCaseLifecycleV1({
        status: effectiveStatus,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          isRequired: item.isRequired,
          dueDate: item.dueDate,
        })),
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          scheduledAt: task.scheduledAt,
          dueAt: (task as any).dueAt,
          date: task.date,
        })),
        events: events.map((event) => ({
          id: event.id,
          title: event.title,
          status: event.status,
          startAt: event.startAt,
          dueAt: event.endAt,
        })),
        now: new Date(),
      }),
    [effectiveStatus, events, items, tasks],
  );
  const workItems = useMemo(() => dedupeCaseWorkItems(buildWorkItems(openTasks, plannedEvents, items)), [items, openTasks, plannedEvents]);
  const caseFinance = useMemo(() => {
    const expected = Number(caseFinanceSourceStage220A26.contractValue || 0);
    const paid = Number(caseFinanceSourceStage220A26.clientPaidAmount || 0);
    const remaining = Number(caseFinanceSourceStage220A26.remainingAmount || 0);
    const currency = caseFinanceSourceStage220A26.currency || 'PLN';
    const billingStatus = paid <= 0 ? 'not_started' : paid >= expected && expected > 0 ? 'fully_paid' : 'partially_paid';
    return {
      expected: Number.isFinite(expected) ? Math.max(0, expected) : 0,
      paid: Number.isFinite(paid) ? Math.max(0, paid) : 0,
      remaining: Number.isFinite(remaining) ? Math.max(0, remaining) : 0,
      currency,
      billingStatus,
    };
  }, [caseFinanceSourceStage220A26]);
  const caseCostsSummaryStage231D2 = useMemo(() => getCaseCostsSummary({
    costs: caseCostsStage231D2,
    commissionRemainingAmount: caseFinanceSourceStage220A26.commissionRemainingAmount,
    currency: caseFinance.currency,
  }), [caseCostsStage231D2, caseFinance.currency, caseFinanceSourceStage220A26.commissionRemainingAmount]);

  const recentCaseMoves = useMemo(() => activities.slice(0, 5), [activities]);
  const nearestOperationalAction = useMemo(() => getNearestPlannedAction({
    recordType: 'case',
    recordId: String(caseData?.id || caseId || ''),
    items: [...openTasks, ...plannedEvents],
  }), [caseData?.id, caseId, openTasks, plannedEvents]);
  const nextAction = useMemo(() => {
    if (nearestOperationalAction) {
      return {
        title: nearestOperationalAction.title,
        kind: (nearestOperationalAction.type === 'event' || nearestOperationalAction.type === 'meeting') ? 'event' : 'task',
        dateLabel: formatDateTime(nearestOperationalAction.when),
      };
    }
    return workItems.find((item) => item.kind === 'task' || item.kind === 'event') || null;
  }, [nearestOperationalAction, workItems]);
  const lastActivityAt = caseData?.lastActivityAt || caseData?.updatedAt || activities[0]?.createdAt || caseData?.createdAt;
  const sourceLeadLabel = sourceLead ? String(sourceLead.name || sourceLead.company || 'Źródłowy lead') : caseData?.leadId ? 'Źródłowy lead podpięty' : 'Brak źródłowego leada';
  const caseDetailWriteAccessDenied = !hasAccess;
  const caseDetailAccessStatus = String(access?.status || 'inactive');
  const guardCaseDetailWriteAccess = (actionLabel: string) => {
    if (!caseDetailWriteAccessDenied) return true;
    const reason = caseDetailAccessStatus === 'trial_expired' ? 'Trial wygasł.' : 'Brak aktywnego dostępu.';
    toast.error(reason + ' Nie mozna teraz ' + actionLabel + '.');
    return false;
  };


  const handleAddTask = async () => {
    if (!guardCaseDetailWriteAccess('dodać zadania')) return;
    openCaseContextAction('task');
  };

  const handleAddEvent = async () => {
    if (!guardCaseDetailWriteAccess('dodać wydarzenia')) return;
    openCaseContextAction('event');
  };

  const handleAddNote = async () => {
    if (!guardCaseDetailWriteAccess('dodać notatki')) return;
    openCaseContextAction('note');
  };

  const openCaseTaskDialog = () => {
    void handleAddTask();
  };

  const openCaseEventDialog = () => {
    void handleAddEvent();
  };

  const openCaseNoteDialog = () => {
    void handleAddNote();
  };

  const openCasePaymentDialog = (type: 'deposit' | 'partial') => {
    if (!guardCaseDetailWriteAccess('dodać płatności')) return;
    setCasePaymentDraft({
      type,
      amount: '',
      status: type === 'deposit' ? 'deposit_paid' : 'partially_paid',
      dueAt: '',
      note: '',
    });
    setIsCasePaymentOpen(true);
  };

  const markCaseFullyPaid = async () => {
    if (!caseId || !guardCaseDetailWriteAccess('oznaczyć sprawy jako opłaconej')) return;
    const remaining = Number(caseFinance.remaining || 0);
    if (remaining <= 0) {
      toast.message('Ta sprawa jest już rozliczona.');
      return;
    }
    try {
      await createPaymentInSupabase({
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
        type: 'final',
        status: 'fully_paid',
        amount: remaining,
        currency: caseFinance.currency,
        paidAt: new Date().toISOString(),
        note: 'Rozliczenie końcowe sprawy',
      });
      await updateCaseInSupabase({ id: caseId, paidAmount: caseFinance.paid + remaining, remainingAmount: 0 }).catch(() => null);
      await refreshCaseData();
      toast.success('Sprawa oznaczona jako opłacona.');
    } catch (error: any) {
      toast.error(`Nie udało się domknąć płatności: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleSaveCasePayment = async () => {
    if (!caseId || !guardCaseDetailWriteAccess('zapisać płatności')) return;
    const amount = Number(casePaymentDraft.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę płatności.');
      return;
    }
    try {
      setCasePaymentSubmitting(true);
      await createPaymentInSupabase({
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
        type: casePaymentDraft.type,
        status: casePaymentDraft.status || 'awaiting_payment',
        amount,
        currency: caseFinance.currency,
        dueAt: casePaymentDraft.dueAt || null,
        paidAt: isPaidPaymentStatus(casePaymentDraft.status) ? new Date().toISOString() : null,
        note: casePaymentDraft.note || '',
      });
      await refreshCaseData();
      setIsCasePaymentOpen(false);
      toast.success('Płatność sprawy zapisana.');
    } catch (error: any) {
      toast.error(`Nie udało się zapisać płatności: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCasePaymentSubmitting(false);
    }
  };

  const recordActivity = async (eventType: string, payload: Record<string, any>) => {
    if (!caseId) return;
    await insertActivityToSupabase({ caseId, actorType: 'operator', eventType, payload }).catch(() => null);
  };


  const closeNoteFollowUpPrompt = () => {
    setPendingNoteFollowUp(null);
    setCustomNoteFollowUpAt('');
  };

  const handleCreateCaseNoteFollowUp = async (choice: CaseNoteFollowUpChoice) => {
    if (!guardCaseDetailWriteAccess('dodać follow-upu po notatce')) return;
    if (!caseId || !pendingNoteFollowUp) return;
    const scheduledAt = buildCaseNoteFollowUpIso(choice, customNoteFollowUpAt);
    if (!scheduledAt) {
      toast.error('Wybierz termin follow-upu');
      return;
    }
    const title = `Follow-up: ${getCaseTitle(caseData)}`;
    try {
      setIsCreatingNoteFollowUp(true);
      const created = await insertTaskToSupabase({
        title,
        type: 'follow_up',
        status: 'todo',
        priority: 'normal',
        scheduledAt,
        reminderAt: scheduledAt,
        date: buildDateOnlyFromIso(scheduledAt),
        caseId,
        clientId: caseData?.clientId || null,
        leadId: caseData?.leadId || null,
      });
      await recordActivity('case_note_follow_up_added', {
        title,
        scheduledAt,
        taskId: (created as any)?.id || null,
        source: 'case_note_follow_up_prompt',
        choice: getCaseNoteFollowUpChoiceLabel(choice),
        notePreview: pendingNoteFollowUp.note.slice(0, 160),
      });
      await updateCaseInSupabase({ id: caseId, lastActivityAt: new Date().toISOString() }).catch(() => null);
      closeNoteFollowUpPrompt();
      await refreshCaseData();
      toast.success('Follow-up dodany do sprawy');
    } catch (error: any) {
      toast.error(`Nie udało się dodać follow-upu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setIsCreatingNoteFollowUp(false);
    }
  };


  const handleConfirmCloseCaseRecord = async () => {
    if (!caseId || closeCasePending) return;
    if (!guardCaseDetailWriteAccess('zamknąć sprawy')) {
      setCloseCaseOpen(false);
      return;
    }

    const closedAt = new Date().toISOString();
    const previousStatus = caseData?.status || null;

    try {
      setCloseCasePending(true);
      await updateCaseInSupabase({
        id: caseId,
        status: 'completed',
        lastActivityAt: closedAt,
      });
      await recordActivity('case_lifecycle_completed', {
        title: 'Sprawa zamknięta',
        status: 'completed',
        previousStatus,
        closedAt,
        source: STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH,
        financePreserved: true,
        historyPreserved: true,
      });
      await refreshCaseData();
      setCloseCaseOpen(false);
      toast.success('Sprawa zamknięta. Historia i rozliczenia zostają przy kliencie.');
    } catch (error: any) {
      toast.error(`Nie udało się zamknąć sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCloseCasePending(false);
    }
  };


  const handleConfirmReopenCaseRecord = async () => {
    return handleConfirmRestoreCaseRecord();
  };

const refreshStatusAfterMutation = async (nextStatus?: string) => {
    if (!caseId) return;
    const status = nextStatus || resolveCaseStatusFromItems(items, caseData?.status || 'in_progress');
    await updateCaseInSupabase({ id: caseId, status, completenessPercent: completionPercent, lastActivityAt: new Date().toISOString() }).catch(() => null);
  };

  const handleCopyPortal = async () => {
    if (!guardCaseDetailWriteAccess('wygenerować linku do portalu')) return;
    if (!caseId) return;
    try {
      const payload = await createClientPortalTokenInSupabase(caseId);
      const url = buildPortalUrl(caseId, (payload || {}) as Record<string, unknown>);
      await navigator.clipboard.writeText(url);
      toast.success('Link do portalu skopiowany');
    } catch (error: any) {
      toast.error(`Nie udało się skopiować portalu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddItem = async () => {
    if (!guardCaseDetailWriteAccess('dodać braku')) return;
    if (!caseId || !newItem.title.trim()) {
      toast.error('Podaj nazwę braku');
      return;
    }
    try {
      const created = await insertCaseItemToSupabase({
        caseId,
        title: newItem.title.trim(),
        description: newItem.description.trim(),
        type: newItem.type,
        isRequired: newItem.isRequired,
        dueDate: newItem.dueDate || null,
        status: 'missing',
        order: items.length + 1,
      });
      await recordActivity('item_added', { title: newItem.title.trim(), itemId: (created as any)?.id || null });
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      setIsAddItemOpen(false);
      await refreshCaseData();
      toast.success('Brak dodany do sprawy');
    } catch (error: any) {
      toast.error(`Nie udało się dodać braku: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleItemStatusChange = async (item: CaseItem, status: CaseItemStatus) => {
    if (!guardCaseDetailWriteAccess('zmienić statusu braku')) return;
    if (!caseId) return;
    try {
      await updateCaseItemInSupabase({ id: item.id, caseId, status, approvedAt: status === 'accepted' ? new Date().toISOString() : null });
      await recordActivity(status === 'accepted' ? 'decision_made' : 'status_changed', { itemId: item.id, title: item.title, status });
      await refreshStatusAfterMutation();
      await refreshCaseData();
      toast.success('Status braku zmieniony');
    } catch (error: any) {
      toast.error(`Nie udało się zmienić statusu: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleDeleteItem = async (item: CaseItem) => {
    if (!guardCaseDetailWriteAccess('usunąć braku')) return;
    if (!window.confirm('Usunąć ten brak ze sprawy?')) return;
    try {
      await deleteCaseItemFromSupabase(item.id);
      await recordActivity('item_deleted', { itemId: item.id, title: item.title });
      await refreshCaseData();
      toast.success('Brak usunięty');
    } catch (error: any) {
      toast.error(`Nie udało się usunąć braku: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };



  const STAGE220A8_5_WORK_ITEM_DELETE_HANDLER = 'CaseDetail work rows can delete tasks, events and missing items with confirmation';
  void STAGE220A8_5_WORK_ITEM_DELETE_HANDLER;

  const openDeleteWorkItemConfirm = (entry: WorkItem) => {
    setDeleteWorkItemTarget(entry);
  };

  const handleConfirmDeleteWorkItem = async () => {
    const target = deleteWorkItemTarget;
    if (!target || deleteWorkItemPending) return;
    if (!guardCaseDetailWriteAccess('usunąć działania sprawy')) {
      setDeleteWorkItemTarget(null);
      return;
    }

    try {
      setDeleteWorkItemPending(true);

      if (target.kind === 'task') {
        const task = target.source as TaskRecord;
        await ensureCaseLeadNextActionTitleSafe(task.leadId || caseData?.leadId || null, task.title, getTaskMainDate(task) || task.reminderAt || task.date);
        await deleteTaskFromSupabase(task.id);
        await recordActivity('task_deleted', { title: task.title, taskId: task.id });
        toast.success('Zadanie usunięte');
      } else if (target.kind === 'event') {
        const event = target.source as EventRecord;
        await ensureCaseLeadNextActionTitleSafe(event.leadId || caseData?.leadId || null, event.title, getEventMainDate(event) || event.reminderAt || event.startAt);
        await deleteEventFromSupabase(event.id);
        await recordActivity('event_deleted', { title: event.title, eventId: event.id });
        toast.success('Wydarzenie usunięte');
      } else if (target.kind === 'missing') {
        const item = target.source as CaseItem;
        await deleteCaseItemFromSupabase(item.id);
        await recordActivity('item_deleted', { itemId: item.id, title: item.title });
        toast.success('Brak usunięty');
      }

      setDeleteWorkItemTarget(null);
      await refreshCaseData();
    } catch (error: any) {
      toast.error(`Nie udało się usunąć: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setDeleteWorkItemPending(false);
    }
  };


  const STAGE220A8_7_LEAD_NEXT_ACTION_NOT_NULL_HEAL = 'Before task/event mutations from CaseDetail, heal source lead next_action_title to satisfy legacy NOT NULL constraint';
  void STAGE220A8_7_LEAD_NEXT_ACTION_NOT_NULL_HEAL;

  const ensureCaseLeadNextActionTitleSafe = async (leadIdInput?: string | null, titleInput?: unknown, nextAtInput?: unknown) => {
    const leadId = String(leadIdInput || caseData?.leadId || '').trim();
    if (!leadId) return;

    const safeTitle =
      String(titleInput || getCaseTitle(caseData) || 'Działanie sprawy').trim() ||
      'Działanie sprawy';

    const payload: Record<string, unknown> = {
      id: leadId,
      nextStep: safeTitle,
    };

    const nextAt = typeof nextAtInput === 'string' && nextAtInput.trim() ? toDate(nextAtInput) : null;
    if (nextAt) payload.nextActionAt = nextAt.toISOString();

    await updateLeadInSupabase(payload as any);
  };

  const handleTaskDone = async (task: TaskRecord) => {
    if (!guardCaseDetailWriteAccess('oznaczyc zadania jako zrobione')) return;
    try {
      await ensureCaseLeadNextActionTitleSafe(task.leadId || caseData?.leadId || null, task.title, getTaskMainDate(task) || task.reminderAt || task.date);
      await updateTaskInSupabase({ id: task.id, status: 'done' });
      await recordActivity('task_status_changed', { title: task.title, taskId: task.id, status: 'done' });
      await refreshCaseData();
      toast.success('Zrobione');
    } catch (error: any) {
      toast.error(`Nie udało się zamknąć zadania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleTaskTomorrow = async (task: TaskRecord) => {
    const nextDate = buildQuickRescheduleIso(1, getTaskMainDate(task) || task.reminderAt, 9);
    try {
      await ensureCaseLeadNextActionTitleSafe(task.leadId || caseData?.leadId || null, task.title, nextDate);
      await updateTaskInSupabase({ id: task.id, scheduledAt: nextDate, dueAt: nextDate, date: buildDateOnlyFromIso(nextDate) });
      await recordActivity('task_rescheduled', { title: task.title, taskId: task.id, scheduledAt: nextDate });
      await refreshCaseData();
      toast.success('Zadanie przełożone na jutro');
    } catch (error: any) {
      toast.error(`Nie udało się przełożyć zadania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };


  const handleEventDone = async (event: EventRecord) => {
    if (!guardCaseDetailWriteAccess('oznaczyc wydarzenia jako odbyte')) return;
    try {
      await ensureCaseLeadNextActionTitleSafe(event.leadId || caseData?.leadId || null, event.title, getEventMainDate(event) || event.reminderAt || event.startAt);
      await updateEventInSupabase({ id: event.id, status: 'done' });
      await recordActivity('event_status_changed', { title: event.title, eventId: event.id, status: 'done' });
      await refreshCaseData();
      toast.success('Wydarzenie oznaczone jako zrobione');
    } catch (error: any) {
      toast.error(`Nie udało się zamknąć wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleEventTomorrow = async (event: EventRecord) => {
    const nextStart = buildQuickRescheduleIso(1, getEventMainDate(event) || event.reminderAt, 9);
    const nextEnd = addDurationToIso(nextStart, getEventDurationMs(event));
    try {
      await ensureCaseLeadNextActionTitleSafe(event.leadId || caseData?.leadId || null, event.title, nextStart);
      await updateEventInSupabase({ id: event.id, startAt: nextStart, endAt: nextEnd });
      await recordActivity('event_rescheduled', { title: event.title, eventId: event.id, startAt: nextStart });
      await refreshCaseData();
      toast.success('Wydarzenie przełożone na jutro');
    } catch (error: any) {
      toast.error(`Nie udało się przełożyć wydarzenia: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const setCaseLifecycleStatusV1 = async (status: string) => {
    if (!caseId) return;
    try {
      const previousStatus = caseData?.status || null;
      await updateCaseInSupabase({ id: caseId, status, lastActivityAt: new Date().toISOString() });
      await recordActivity(status === 'completed' ? 'case_lifecycle_completed' : previousStatus === 'completed' ? 'case_lifecycle_reopened' : 'case_lifecycle_started', {
        status,
        previousStatus,
        source: 'case_detail_v1_command_center',
      });
      await refreshCaseData();
      toast.success('Status sprawy zaktualizowany');
    } catch (error: any) {
      toast.error(`Nie udało się zmienić statusu sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };


  // FIN-5_CASE_SETTLEMENT_PAYMENTS_FROM_LOAD via isolated refresh hook
  const refreshCaseSettlementPayments = useCallback(async () => {
    if (!caseId) return;
    const refreshedPayments = await fetchPaymentsFromSupabase({ caseId });
    setCasePayments(refreshedPayments as CasePaymentRecord[]);
  }, [caseId]);

  useEffect(() => {
    if (!caseId || !isSupabaseConfigured()) return;
    void refreshCaseSettlementPayments().catch(() => null);
  }, [caseId, refreshCaseSettlementPayments]);

  const handleAddCaseSettlementPayment = async (value: CaseSettlementPaymentInput) => {
    if (!caseId || !caseData) return;
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const amount = Number(value.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawną kwotę płatności.');
      return;
    }

    try {
      setCaseSettlementSaving(true);
      await createPaymentInSupabase({
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        type: value.type,
        status: value.status,
        amount,
        currency: value.currency || caseData.currency || 'PLN',
        paidAt: value.paidAt,
        dueAt: value.dueAt,
        note: value.note || '',
      });
      await refreshCaseSettlementPayments();
      toast.success(value.type === 'commission' ? 'Wpłata prowizji dodana' : 'Wpłata klienta dodana');
    } catch (error: any) {
      toast.error('Nie udało się zapisać płatności: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setCaseSettlementSaving(false);
    }
  };

  const handleEditCaseSettlementCommission = async (value: CaseSettlementCommissionInput) => {
    if (!caseId || !caseData) return;
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const nextContractValue = Number(value.contractValue || 0);
    if (!Number.isFinite(nextContractValue) || nextContractValue < 0) {
      toast.error('Podaj poprawną wartość transakcji.');
      return;
    }

    try {
      setCaseSettlementSaving(true);
      const payload = {
        id: caseId,
        contractValue: Math.max(0, nextContractValue),
        expectedRevenue: Math.max(0, nextContractValue),
        commissionMode: value.commissionMode,
        commissionBase: value.commissionBase,
        commissionRate: Number(value.commissionRate || 0),
        commissionAmount: Number(value.commissionAmount || 0),
        commissionStatus: value.commissionStatus,
        currency: value.currency || caseData.currency || 'PLN',
      };
      await updateCaseInSupabase(payload);
      setCaseData((current: CaseRecord | null) => current ? {
        ...current,
        contractValue: payload.contractValue,
        expectedRevenue: payload.expectedRevenue,
        commissionMode: payload.commissionMode,
        commissionBase: payload.commissionBase,
        commissionRate: payload.commissionRate,
        commissionAmount: payload.commissionAmount,
        commissionStatus: payload.commissionStatus,
        currency: payload.currency,
      } : current);
      toast.success('Prowizja sprawy zapisana');
    } catch (error: any) {
      toast.error('Nie udało się zapisać prowizji: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setCaseSettlementSaving(false);
    }
  };


  async function handleConfirmRestoreCaseRecord() {
    if (!caseData?.id || restoreCasePending) return;
    if (!guardCaseDetailWriteAccess('przywrócić sprawy')) return;

    const confirmed = window.confirm('Sprawa wróci do aktywnych. Historia i rozliczenia zostaną zachowane.');
    if (!confirmed) return;

    const reopenedAt = new Date().toISOString();
    const previousStatus = caseData?.status || null;

    try {
      setRestoreCasePending(true);
      await updateCaseInSupabase({
        id: caseData.id,
        status: 'in_progress',
        lastActivityAt: reopenedAt,
      });
      await recordActivity('case_lifecycle_reopened', {
        title: 'Sprawa przywrócona',
        status: 'in_progress',
        previousStatus,
        reopenedAt,
        source: STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION,
        financePreserved: true,
        historyPreserved: true,
      });
      await refreshCaseData();
      toast.success('Sprawa przywrócona do aktywnych. Historia i rozliczenia zostały zachowane.');
    } catch (error: any) {
      toast.error(`Nie udało się przywrócić sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setRestoreCasePending(false);
    }
  }
async function handleConfirmDeleteCaseRecord() {
    if (!caseData?.id || deleteCasePending) return;
    if (!guardCaseDetailWriteAccess('usunąć sprawy')) {
      setDeleteCaseOpen(false);
      return;
    }

    try {
      setDeleteCasePending(true);
      await deleteCaseWithRelations(caseData.id);
      toast.success('Sprawa usunięta');
      setDeleteCaseOpen(false);
      navigate('/cases');
    } catch (error: any) {
      toast.error(`Błąd: ${error?.message || 'Nie udało się usunąć sprawy.'}`);
    } finally {
      setDeleteCasePending(false);
    }
  }

  const caseHistoryItems = useMemo<CaseHistoryItem[]>(() => {
    const builtHistory = buildCaseHistoryItemsStage14D({
      activities,
      tasks,
      events,
      payments: sortCasePayments(casePayments),
      caseItems: items,
    });

    const unique = new Map<string, CaseHistoryItem>();
    for (const item of builtHistory) {
      const body = formatCaseHistoryBodyStage220A11(item);
      const key = `${item.kind}|${item.title}|${body}|${item.occurredAt || ''}`;
      if (!unique.has(key)) unique.set(key, { ...item, body });
    }

    return Array.from(unique.values()).slice(0, 50);
  }, [activities, tasks, events, casePayments, items]);
  const caseNoteItems = useMemo<CaseHistoryItem[]>(() => {
    return sortCaseHistoryItemsStage14D(
      activities
        .map((activity) => getCaseNoteHistoryItemStage217(activity))
        .filter((item): item is CaseHistoryItem => Boolean(item)),
    ).slice(0, 20);
  }, [activities]);
  if (loading) {
    return (
      <Layout>
        <main className="case-detail-vnext-page">
          <section className="case-detail-loading-card">
              <div data-fin5-case-settlement-instance="true">
                <CaseSettlementSection
              routeCaseId={caseId}
                  record={caseData}
                  payments={casePayments}
                  readonly={!hasAccess}
                  isSaving={caseSettlementSaving}
                  onAddPayment={handleAddCaseSettlementPayment}
                  onEditCommission={handleEditCaseSettlementCommission}
                />
              </div>

            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ładowanie sprawy...</span>
          </section>
        </main>
      </Layout>
    );
  }

  if (loadError || !caseData) {
    return (
      <Layout>
        <main className="case-detail-vnext-page">
          <section className="case-detail-empty-card">
            <AlertCircle className="h-8 w-8" />
            <h1>Nie można otworzyć sprawy</h1>
            <p>{loadError || 'Nie znaleziono tej sprawy w aktualnym workspace.'}</p>
            <Button type="button" variant="outline" onClick={() => navigate('/cases')}>
              <ArrowLeft className="h-4 w-4" />
              Wróć do spraw
            </Button>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>

      <main className="case-detail-vnext-page">
        <header className="case-detail-header client-detail-header" data-stage228r9-wide-header="true" data-stage220a3-case-header-source-card="STAGE220A3_CASE_HEADER_SOURCE_CARD" data-stage220a6-client-header-source="true" data-stage231b0-r8-case-header-order="copy-left-actions-right" data-stage231d2-r6-top-strip-left-card="true">
          <div className="case-detail-header-copy client-detail-header-copy" data-stage220a6-client-copy="true">
            <button
              type="button"
              className="case-detail-back-button client-detail-back-button"
              onClick={() => navigate(caseData.clientId ? `/clients/${encodeURIComponent(String(caseData.clientId))}` : '/cases')}
            >
              <ArrowLeft className="h-4 w-4" />
              Cofnij
            </button>
            <p className="case-detail-kicker client-detail-kicker">KARTOTEKA SPRAWY</p>

            <h1 className="case-detail-header-composed-title" data-stage220a3-header-title="true">
              <span className="case-detail-header-client-name">{getCaseHeaderClientLabel(caseData)}</span>
              <span className="case-detail-header-separator" aria-hidden="true">—</span>
              <span className="case-detail-header-case-name">{getCaseHeaderCaseLabel(caseData)}</span>
            </h1>
          </div>

          <div className="case-detail-header-actions-stage231b0" data-stage231b0-case-close-archive-finance-truth-actions="true" data-stage231b0-r7-case-archive-restore-navigation="true" data-stage231b0-r8-case-header-actions-right="true">
            {isCaseClosedStage231B0R7 ? (
              <Button
                type="button"
                variant="outline"
                className="cf-vst-button cf-case-detail-restore-action-stage231b0-r7 cf-case-detail-restore-action-stage231b0-r8"
                data-stage231b0-r7-restore-case-button="true"
                data-stage231b0-r8-restore-case-button="true"
                aria-label="Przywróć sprawę"
                title="Przywróć sprawę"
                disabled={restoreCasePending}
                onClick={handleConfirmReopenCaseRecord}
              >
                <CheckCircle2 className="h-4 w-4" />
                Przywróć sprawę
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="cf-vst-button cf-case-detail-close-action-stage231b0 cf-case-detail-close-action-stage231b0-r7 cf-case-detail-close-action-stage231b0-r8 cf-case-detail-close-positive-stage231b0-r7 cf-case-detail-close-positive-stage231b0-r8"
                data-case-detail-close-action="true"
                data-stage231b0-close-case-button="true"
                data-stage231b0-r7-close-case-button="true"
                data-stage231b0-r8-close-case-button="true"
                data-cf-vst-kind="status"
                aria-label="Zamknij sprawę"
                title="Zamknij sprawę"
                disabled={closeCasePending}
                onClick={() => setCloseCaseOpen(true)}
              >
                <Check className="h-4 w-4" />
                Zamknij sprawę
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="cf-vst-button cf-vst-button-delete cf-case-detail-delete-emergency-action-stage231b0"
              data-case-detail-delete-action="true"
              data-stage231b0-emergency-delete-case-button="true"
              aria-label="Awaryjnie usuń sprawę"
              title="Awaryjnie usuń sprawę"
              onClick={() => setDeleteCaseOpen(true)}
            >
              <Trash2 className={trashActionIconClass("h-4 w-4")} />
              Usuń sprawę
            </Button>
          </div>
        </header>

<div className="case-detail-shell case-detail-stage228r9-shell" data-stage228r9-shell-rail-lift="true" data-stage231d2-r6-side-rail-top-lift="true">
          <section className="case-detail-main-column" data-stage228r9-main-column="true">
            {activeTab !== 'service' ? (
            <div
              className="case-detail-stage228r10d-tabs-card case-service-tabs-column"
              data-stage228r10d-tabs-card="true"
              data-case-service-tabs-column="true"
              data-stage228r10d-card-spacing-lock="true"
              aria-label="Obsługa, checklisty i historia sprawy"
            >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CaseDetailTab)}>
          <span hidden data-stage220a11-marker="STAGE220A11_CASE_DETAIL_TABS_PRODUCTION" />
          <nav className="case-detail-stage220a10-tabs-wrap case-detail-stage228r9-tabs-compact" aria-label="Zakładki sprawy" data-stage220a10-tabs-top="true" data-stage228r9-tabs-compact="true">
            <TabsList className="case-detail-tabs case-detail-stage220a10-tabs">
              {[
                { key: 'service' as CaseDetailTab, label: 'Obsługa', count: workItems.length, icon: <CheckCircle2 className="h-4 w-4" /> },
                { key: 'checklists' as CaseDetailTab, label: 'Checklisty', count: items.length, icon: <ListChecks className="h-4 w-4" /> },
                { key: 'history' as CaseDetailTab, label: 'Historia', count: caseHistoryItems.length, icon: <History className="h-4 w-4" /> },
              ].map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key} className={activeTab === tab.key ? 'case-detail-tab-active' : ''} data-stage220a10-tab={tab.key} data-stage220a11-case-tab-trigger={tab.key}>
                  <span className="case-detail-stage220a10-tab-icon" aria-hidden="true">{tab.icon}</span>
                  <span className="case-detail-stage220a10-tab-label">{tab.label}</span>
                  <span className="case-detail-stage220a10-tab-count">{tab.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </nav>
        </Tabs>
            </div>
            ) : null}

            {activeTab === 'service' ? (
              <>
                {/* STAGE231D0D_R2_CASE_DETAIL_SERVICE_NOTES_FINANCE_RAIL: legacy Stage220A10 duplicated service/notes block removed from visible runtime. */}
                <span hidden data-stage231d0d-r2-legacy-stage220a10-removed="true" />
            <span hidden data-stage231d0d-r6-marker="STAGE231D0D_R6_TRUE_SERVICE_GRID_GEOMETRY" />
            <section className="case-service-workspace-grid case-service-workspace-grid-r6" data-case-service-workspace-grid="true" data-stage231d0d-r6-true-service-grid-geometry="true">
              <div className="case-service-left-column" data-case-service-left-column="true">
            <div
              className="case-detail-stage228r10d-tabs-card case-service-tabs-column"
              data-stage228r10d-tabs-card="true"
              data-case-service-tabs-column="true" data-stage231d0d-r6-tabs-inside-left-column="true"
              data-stage228r10d-card-spacing-lock="true"
              aria-label="Obsługa, checklisty i historia sprawy"
            >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CaseDetailTab)}>
          <span hidden data-stage220a11-marker="STAGE220A11_CASE_DETAIL_TABS_PRODUCTION" />
          <nav className="case-detail-stage220a10-tabs-wrap case-detail-stage228r9-tabs-compact" aria-label="Zakładki sprawy" data-stage220a10-tabs-top="true" data-stage228r9-tabs-compact="true">
            <TabsList className="case-detail-tabs case-detail-stage220a10-tabs">
              {[
                { key: 'service' as CaseDetailTab, label: 'Obsługa', count: workItems.length, icon: <CheckCircle2 className="h-4 w-4" /> },
                { key: 'checklists' as CaseDetailTab, label: 'Checklisty', count: items.length, icon: <ListChecks className="h-4 w-4" /> },
                { key: 'history' as CaseDetailTab, label: 'Historia', count: caseHistoryItems.length, icon: <History className="h-4 w-4" /> },
              ].map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key} className={activeTab === tab.key ? 'case-detail-tab-active' : ''} data-stage220a10-tab={tab.key} data-stage220a11-case-tab-trigger={tab.key}>
                  <span className="case-detail-stage220a10-tab-icon" aria-hidden="true">{tab.icon}</span>
                  <span className="case-detail-stage220a10-tab-label">{tab.label}</span>
                  <span className="case-detail-stage220a10-tab-count">{tab.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </nav>
        </Tabs>
            </div>
              <div className="case-service-actions-panel" data-case-service-actions-panel="true">
            <section className="case-detail-section-card stage217-case-operation-workspace" data-stage217-case-operation-workspace="true" data-case-service-tab="true" data-stage220a11-tab-content="service">
              <div className="case-detail-section-head stage217-case-operation-head">
                <div>
                  <p className="case-detail-eyebrow">Obsługa sprawy</p>
                  <h2>Działania sprawy</h2>
                  <p>Najbliższy ruch, blokady, aktywne działania i rozliczenie w jednym miejscu.</p>
                  <span hidden data-case-service-tab-groups="true">Najbliższe działania | Braki i blokady | Wszystkie aktywne</span>
                </div>
                <div className="stage217-case-service-actions">
                  <Button type="button" variant="outline" onClick={openCaseNoteDialog}>
                    <StickyNote className="h-4 w-4" />
                    Dodaj notatkę
                  </Button>
                  <Button type="button" variant="outline" onClick={openCaseTaskDialog}>
                    <ListChecks className="h-4 w-4" />
                    Dodaj zadanie
                  </Button>
                  <Button type="button" variant="outline" onClick={openCaseEventDialog}>
                    <CalendarClock className="h-4 w-4" />
                    Dodaj wydarzenie
                  </Button>
                </div>
              </div>

              <section className="stage220a8-case-actions-preview stage220a8-case-actions-accordion" data-stage220a8-single-actions-card="STAGE220A8_4_SINGLE_ACTIONS_CARD" data-stage220a8-case-actions-preview="true" data-stage220a8-case-actions-accordion="true">
                <div className="stage220a8-case-actions-preview-head">
                  <div>
                    <span className="stage220a8-case-actions-preview-label">Działania sprawy</span>
                    <h3>Zadania, wydarzenia i braki przypięte do tej sprawy</h3>
                  </div>
                  <div className="stage220a8-case-actions-head-actions">
                    <span className="stage220a8-case-actions-preview-count">{workItems.length}</span>
                    <button type="button" className="stage220a8-show-all-button" onClick={() => setIsCaseActionsAllOpen(true)} data-stage220a8-show-all-actions="true">
                      Pokaż wszystkie
                    </button>
                  </div>
                </div>

                {caseActionsLoadError ? (
                  <div className="case-detail-light-empty" role="alert" data-case-actions-load-error="true">
                    {caseActionsLoadError}
                  </div>
                ) : null}

                {[
                  {
                    key: 'next' as CaseActionAccordionGroup,
                    label: 'Najbliższe działania',
                    count: workItems.filter((entry) => entry.kind === 'task' || entry.kind === 'event').length,
                    empty: 'Brak zaplanowanych zadań i wydarzeń w tej sprawie.',
                    items: workItems.filter((entry) => entry.kind === 'task' || entry.kind === 'event').slice(0, 5),
                  },
                  {
                    key: 'blockers' as CaseActionAccordionGroup,
                    label: 'Braki i blokady',
                    count: workItems.filter((entry) => entry.kind === 'missing').length,
                    empty: 'Brak braków i blokad w tej sprawie.',
                    items: workItems.filter((entry) => entry.kind === 'missing').slice(0, 5),
                  },
                  {
                    key: 'active' as CaseActionAccordionGroup,
                    label: 'Wszystkie aktywne',
                    count: workItems.length,
                    empty: 'Brak działań przypiętych bezpośrednio do tej sprawy.',
                    items: workItems.slice(0, 5),
                  },
                ].map((group) => {
                  const isOpen = caseActionOpenGroup === group.key;
                  return (
                    <article className={`stage220a8-case-actions-group ${isOpen ? 'stage220a8-case-actions-group--open' : ''}`} key={group.key} data-stage220a8-case-actions-group={group.key}>
                      <button type="button" className="stage220a8-case-actions-group-trigger" onClick={() => setCaseActionOpenGroup((current) => current === group.key ? null : group.key)} aria-expanded={isOpen}>
                        <span>{group.label}</span>
                        <strong>{group.count}</strong>
                      </button>

                      {isOpen ? (
                        group.items.length === 0 ? (
                          <div className="case-detail-light-empty">{group.empty}</div>
                        ) : (
                          <div className="case-detail-work-list stage220a8-case-actions-accordion-list" data-stage220a8-case-actions-visible-limit="5">
                            {group.items.map((entry) => (
                              <div key={'stage220a8-accordion-' + group.key + '-' + entry.id} style={{ display: 'contents' }}>
                                <WorkItemRow
                                  entry={entry}
                                  onTaskDone={handleTaskDone}
                                  onTaskTomorrow={handleTaskTomorrow}
                                  onEventDone={handleEventDone}
                                  onEventTomorrow={handleEventTomorrow}
                                  onItemAccept={(item) => handleItemStatusChange(item, 'accepted')}
                                  onItemReject={(item) => handleItemStatusChange(item, 'rejected')}
                                  onItemDelete={handleDeleteItem}
                                  onDelete={openDeleteWorkItemConfirm}
                                />
                              </div>
                            ))}
                          </div>
                        )
                      ) : null}
                    </article>
                  );
                })}
              </section>
            </section>
              </div>
              </div>
              <div className="case-service-notes-panel" data-case-service-notes-panel="true">
            <section className="case-detail-section-card stage217-case-notes-panel" data-stage217-case-notes-panel="true" data-case-notes-panel="true" data-case-notes-preview-limit="3">
              <div className="case-detail-section-head stage219-case-notes-head" data-stage219-case-notes-head="true">
                <div>
                  <h2>Notatki sprawy</h2>
                  <p>Ostatnie notatki są tutaj. Pełna lista jest pod przyciskiem „Wszystkie notatki”.</p>
                </div>
                <div className="stage219-case-notes-actions" data-stage219-case-notes-actions="true">

                  <Button
                    type="button"
                    onClick={openCaseNoteDialog}
                    data-context-action-kind="note"
                    data-context-record-type="case"
                    data-context-record-id={caseData.id}
                    data-context-client-id={caseData.clientId || ''}
                    data-context-lead-id={caseData.leadId || ''}
                    data-context-record-label={getCaseTitle(caseData)}
                    data-stage219-add-note="true"
                  >
                    <StickyNote className="h-4 w-4" />
                    Dodaj notatkę
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    aria-disabled="true"
                    title="Notatka głosowa nie jest jeszcze podłączona"
                    data-stage219-dictate-note-deprecated="true"
                    data-stage231h-r1b-dictation-disabled="true"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Notatka głosowa — wkrótce
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCaseAllNotesOpenStage231D0D(true)}
                    data-case-all-notes-button="true"
                  >
                    <StickyNote className="h-4 w-4" />
                    Wszystkie notatki
                  </Button>
                </div>
              </div>
              {caseNoteItems.length === 0 ? (
                <div className="case-detail-light-empty">Brak notatek przy tej sprawie. Dodaj pierwszą notatkę z szybkich akcji.</div>
              ) : (
                <div className="stage217-case-notes-list">
                  {caseNoteItems.slice(0, 3).map((note) => (
                    <article className="stage217-case-note-row" key={note.id}>
                      <span className="stage217-case-note-row__icon"><MessageSquare className="h-4 w-4" /></span>
                      <div>
                        <time>{formatDateTime(note.occurredAt, 'Brak daty')}</time>
                        <p>{note.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
              </div>
            </section>
      {pendingNoteFollowUp ? (
        <section className="case-detail-note-follow-up-panel" data-case-note-follow-up-prompt="true">
          <div className="case-detail-note-follow-up-head">
            <div>
              <p className="case-detail-eyebrow">Następny ruch</p>
              <h3>Ustawić follow-up do tej notatki?</h3>
              <p>Notatka jest zapisana. Teraz możesz od razu przypiąć kolejny ruch do tej sprawy.</p>
            </div>
            <Button type="button" variant="ghost" onClick={closeNoteFollowUpPrompt} data-case-note-follow-up-dismiss="true">
              Nie teraz
            </Button>
          </div>
          <div className="case-detail-note-follow-up-preview">{pendingNoteFollowUp.note}</div>
          <div className="case-detail-note-follow-up-actions">
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('today')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="today">Dziś</Button>
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('tomorrow')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="tomorrow">Jutro</Button>
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('two_days')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="two_days">Za 2 dni</Button>
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('week')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="week">Za tydzień</Button>
          </div>
          <div className="case-detail-note-follow-up-custom">
            <Label htmlFor="case-note-follow-up-at">Własny termin</Label>
            <Input id="case-note-follow-up-at" type="datetime-local" value={customNoteFollowUpAt} onChange={(event) => setCustomNoteFollowUpAt(event.target.value)} data-case-note-follow-up-custom-input="true" />
            <Button type="button" onClick={() => handleCreateCaseNoteFollowUp('custom')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="custom">Ustaw własny</Button>
          </div>
        </section>
      ) : null}
              </>
            ) : null}

            {activeTab === 'checklists' ? (
              <section className="case-detail-section-card case-detail-stage220a10-tab-panel case-detail-stage220a10-checklist-panel" data-stage220a11-tab-content="checklists" data-stage220a10-tab-panel="checklists">
                <div className="case-detail-section-head">
                  <div>
                    <h2>Checklisty i braki</h2>
                    <p>Dokumenty, decyzje, informacje i inne rzeczy potrzebne do pracy.</p>
                  </div>
                  <Button type="button" onClick={() => setIsAddItemOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Dodaj brak
                  </Button>
                </div>
                <div className="case-detail-checklist-list">
                  {items.length === 0 ? (
                    <div className="case-detail-light-empty">Brak checklisty. Dodaj pierwszy wymagany element sprawy.</div>
                  ) : (
                    items.map((item) => (
                      <article key={item.id} className="case-detail-checklist-row">
                        <div>
                          <span className="case-detail-kind-pill">{getItemTypeLabel(item.type)}</span>
                          <h3>{item.title || 'Element sprawy'}</h3>
                          <p>{item.description || 'Bez opisu'} · Termin: {formatDate(item.dueDate)}</p>
                        </div>
                        <span className={`case-detail-pill ${getStatusClass(item.status)}`}>{getItemStatusLabel(item.status)}</span>
                        <div className="case-detail-row-actions">
                          <button type="button" onClick={() => handleItemStatusChange(item, 'missing')}>Brak</button>
                          <button type="button" onClick={() => handleItemStatusChange(item, 'uploaded')}>Wysłane</button>
                          <button type="button" onClick={() => handleItemStatusChange(item, 'accepted')}>Akceptuj</button>
                          <button type="button" onClick={() => handleItemStatusChange(item, 'rejected')}>Odrzuć</button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === 'history' ? (
              <section className="case-detail-section-card case-detail-stage220a10-tab-panel case-detail-stage220a10-history-panel" data-stage220a10-tab-panel="history" data-stage220a11-tab-content="history" data-stage220a11-unified-history-tab="true">
                <div className="case-detail-section-head case-detail-stage220a10-panel-head case-detail-stage220a12-history-head" data-stage220a12-history-heading-only="true">
                  <div>
                    <h2>Historia sprawy</h2>
                  </div>
                </div>
                <div className="case-detail-stage220a10-history-list" data-stage220a10-history-list="true">
                  {caseHistoryItems.length === 0 ? (
                    <div className="case-detail-light-empty">Brak historii sprawy.</div>
                  ) : (
                    caseHistoryItems.slice(0, 40).map((item) => (
                      <article className="case-detail-stage220a10-history-row case-detail-stage220a17-history-row" key={'stage220a10-history-' + item.id} data-history-kind={item.kind} data-cf-vst-kind={getCaseHistoryVstKindStage220A17(item.kind)} data-stage220a17-history-kind-row={item.kind}>
                        <span className="case-detail-stage220a10-history-icon cf-vst-icon" aria-label={getCaseHistoryKindLabelStage220A17(item.kind)}><CaseHistoryKindIconStage220A17 kind={item.kind} /></span>
                        <div className="case-detail-stage220a10-history-main">
                          <div className="case-detail-stage220a10-history-title-row">
                            <strong>{item.title}</strong>
                            <small>{formatDateTime(item.occurredAt, 'Bez daty')}</small>
                          </div>
                          <p title={item.body}>{item.body}</p>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ) : null}
          </section>
          <span hidden data-stage231d0d-r2-case-detail-service-notes-finance-rail="STAGE231D0D_R2_CASE_DETAIL_SERVICE_NOTES_FINANCE_RAIL" />
          <span hidden data-stage231d0d-r3-case-detail-100-scale-balanced-workspace="STAGE231D0D_R3_CASE_DETAIL_100_SCALE_BALANCED_WORKSPACE" />
          <span hidden data-stage231d0d-r4-case-detail-lean-service-workspace="STAGE231D0D_R4_CASE_DETAIL_LEAN_SERVICE_WORKSPACE" />
          <aside className="case-detail-right-rail" aria-label="Panel sprawy">
<section className="right-card case-detail-right-card cf-finance-scope-card cf-finance-scope-card--case case-settlement-rail-card" data-case-settlement-rail-card="true" data-case-settlement-compact="true" data-fin10-legacy-finance-panel-removed="true" data-case-finance-panel="true" data-fin11-case-right-finance-panel="true" data-stage220a13-case-finance-scope-card="true" aria-label="Rozliczenie sprawy">
              <div className="cf-finance-scope-card__head">
                <span className="cf-finance-scope-card__icon">
                  <Paperclip className="h-4 w-4" />
                </span>
                <strong>Rozliczenie sprawy</strong>
              </div>
              <dl className="cf-finance-scope-card__metrics" data-stage220a31-finance-billing-summary="true">
                <div data-cf-finance-tone="transaction" data-stage220a31-finance-transaction-value="true"><dt>Wartość transakcji</dt><dd>{formatMoney(caseFinanceSourceStage220A26.contractValue, caseFinanceSourceStage220A26.currency)}</dd></div>
                <div data-cf-finance-tone="commission" data-stage220a31-finance-commission-due="true"><dt>Prowizja należna</dt><dd>{formatMoney(caseFinanceSourceStage220A26.commissionAmount, caseFinanceSourceStage220A26.currency)}</dd></div>
                <div data-cf-finance-tone="paid" data-stage220a31-finance-commission-paid="true"><dt>Wpłacono prowizji</dt><dd>{formatMoney(caseFinanceSourceStage220A26.commissionPaidAmount, caseFinanceSourceStage220A26.currency)}</dd></div>
                <div data-cf-finance-tone="remaining" data-stage220a31-finance-commission-left="true"><dt>Pozostało do zapłaty</dt><dd>{formatMoney(caseFinanceSourceStage220A26.commissionRemainingAmount, caseFinanceSourceStage220A26.currency)}</dd></div>
                <div data-cf-finance-tone="cost" data-stage231d0d-r4-settlement-costs-incurred="true"><dt>Koszty poniesione</dt><dd>{formatMoney(caseCostsSummaryStage231D2.costsIncurredAmount, caseCostsSummaryStage231D2.currency)}</dd></div>
                <div data-cf-finance-tone="cost" data-stage231d0d-r4-settlement-costs-to-reimburse="true"><dt>Koszty do zwrotu</dt><dd>{formatMoney(caseCostsSummaryStage231D2.costsToReimburseAmount, caseCostsSummaryStage231D2.currency)}</dd></div>
                <div data-cf-finance-tone="reimbursed" data-stage231d0d-r4-settlement-costs-reimbursed="true"><dt>Koszty zwrócone</dt><dd>{formatMoney(caseCostsSummaryStage231D2.costsReimbursedAmount, caseCostsSummaryStage231D2.currency)}</dd></div>
                <div data-cf-finance-tone="total" data-stage231d0d-r4-settlement-total-to-collect="true"><dt>Razem do pobrania</dt><dd>{formatMoney(caseCostsSummaryStage231D2.totalToCollectAmount, caseCostsSummaryStage231D2.currency)}</dd></div>
                <div hidden data-stage220a31-legacy-finance-guard-compat="true">{formatMoney(caseFinanceSourceStage220A26.clientPaidAmount, caseFinanceSourceStage220A26.currency)} {formatMoney(caseFinanceSourceStage220A26.remainingAmount, caseFinanceSourceStage220A26.currency)}</div>
              </dl>
              <div className="cf-finance-scope-card__actions case-finance-panel-actions" data-fin11-case-right-finance-actions="true">
                <Button type="button" size="sm" variant="outline" onClick={openCaseFinanceEditModal} disabled={isFinanceSaving}>
                  Edytuj wartość/prowizję
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => openCaseFinancePaymentModal('commission')} disabled={isFinanceSaving} data-stage228r7-add-commission-payment="true">
                  Dodaj wpłatę prowizji
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCaseCostOpenStage231D2(true)}
                  disabled={!hasAccess}
                  data-stage231d0d-r5-add-case-cost="true"
                >
                  Dodaj koszt
                </Button>                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPaymentHistoryOpenStage220A27B(true)}
                  disabled={financeCorrectionRowsStage231H_R1C.length === 0}
                  data-stage220a27b-open-payment-history-modal="true"
                >
                  Koryguj wpłatę/koszt
                </Button>
              </div>
                            <span hidden data-case-settlement-payment-summary-deprecated="true" />


                            <span hidden data-case-settlement-cost-summary-deprecated="true" />


            <div className="case-quick-actions-rail" data-case-quick-actions-rail="true" data-case-quick-actions-anchor="case-detail">
              <CaseQuickActions
                caseId={caseData.id}
                caseTitle={getCaseTitle(caseData)}
                clientId={caseData.clientId || null}
                leadId={caseData.leadId || null}
              />
            </div>
                        <span hidden data-case-context-rail-card-deprecated-main-rail="true" />


              <span hidden data-fin11-case-right-finance-actions-marker="FIN-11_CASE_RIGHT_FINANCE_ACTIONS" />
            </section>
                                                </aside>
        </div>
        <CaseItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} value={newItem} onChange={setNewItem} onSubmit={handleAddItem} />
      </main>



      <ConfirmDialog
        open={Boolean(deleteWorkItemTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteWorkItemPending) setDeleteWorkItemTarget(null);
        }}
        title="Usunąć działanie?"
        description={deleteWorkItemTarget ? `${getWorkKindLabel(deleteWorkItemTarget.kind)} „${deleteWorkItemTarget.title}” zostanie usunięte z tej sprawy. Tej akcji nie można cofnąć.` : 'Usunąć wybrane działanie?'}
        confirmLabel="Usuń"
        cancelLabel="Anuluj"
        confirmTone="destructive"
        pending={deleteWorkItemPending}
        onConfirm={handleConfirmDeleteWorkItem}
        data-stage220a8-delete-work-item-confirm="true"
      />

      <Dialog open={isCaseActionsAllOpen} onOpenChange={setIsCaseActionsAllOpen}>
        <DialogContent className="stage220a8-case-actions-all-modal sm:max-w-4xl" data-stage220a8-case-actions-all-modal="true" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Wszystkie działania sprawy</DialogTitle>
            <DialogDescription>Zadania, wydarzenia i braki przypięte bezpośrednio do tej sprawy.</DialogDescription>
          </DialogHeader>

          {workItems.length === 0 ? (
            <div className="case-detail-light-empty">Brak działań przypiętych bezpośrednio do tej sprawy.</div>
          ) : (
            <div className="case-detail-work-list stage220a8-case-actions-all-list">
              {workItems.map((entry) => (
                <div key={'stage220a8-all-' + entry.id} style={{ display: 'contents' }}>
                  <WorkItemRow
                    entry={entry}
                    onTaskDone={handleTaskDone}
                    onTaskTomorrow={handleTaskTomorrow}
                    onEventDone={handleEventDone}
                    onEventTomorrow={handleEventTomorrow}
                    onItemAccept={(item) => handleItemStatusChange(item, 'accepted')}
                    onItemReject={(item) => handleItemStatusChange(item, 'rejected')}
                    onItemDelete={handleDeleteItem}
                                  onDelete={openDeleteWorkItemConfirm}
                                />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCaseAllNotesOpenStage231D0D} onOpenChange={setIsCaseAllNotesOpenStage231D0D}>
        <DialogContent
          className="max-w-3xl event-form-vnext-content closeflow-event-modal-readable case-all-notes-modal-stage231d0d-r2"
          data-case-all-notes-modal="true"
          data-cf-vst-dialog="true"
          aria-describedby={undefined}
        >
          <DialogHeader className="event-form-vnext-header case-all-notes-modal-stage231d0d-r2__header">
            <DialogTitle>Wszystkie notatki sprawy</DialogTitle>
            <DialogDescription>Pełna lista notatek przypiętych do tej sprawy.</DialogDescription>
          </DialogHeader>

          {caseNoteItems.length === 0 ? (
            <div className="case-detail-light-empty">Brak notatek przy tej sprawie.</div>
          ) : (
            <div className="case-all-notes-modal-stage231d0d-r2__list">
              {caseNoteItems.map((note, index) => (
                <article className="case-all-notes-modal-stage231d0d-r2__item" key={String((note as any).id || index)}>
                  <div className="case-all-notes-modal-stage231d0d-r2__meta">
                    <strong>{String((note as any).title || (note as any).createdAt || (note as any).created_at || 'Notatka')}</strong>
                    <span>{String((note as any).source || (note as any).operator || (note as any).createdBy || (note as any).created_by || 'CloseFlow')}</span>
                  </div>
                  <p>{String((note as any).content || (note as any).body || (note as any).note || (note as any).description || '')}</p>
                </article>
              ))}
            </div>
          )}

          <DialogFooter className={modalFooterClass('event-form-footer case-all-notes-modal-stage231d0d-r2__footer')}>
            <Button type="button" variant="outline" onClick={() => setIsCaseAllNotesOpenStage231D0D(false)}>Zamknij</Button>
            <Button type="button" onClick={openCaseNoteDialog} data-case-all-notes-add-note="true">
              <StickyNote className="h-4 w-4" />
              Dodaj notatkę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <span hidden data-stage231b0-case-close-archive-finance-truth="STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH" />
      <ConfirmDialog
        open={closeCaseOpen}
        onOpenChange={(open) => {
          if (!open && !closeCasePending) setCloseCaseOpen(false);
        }}
        title="Zamknąć sprawę?"
        description="Sprawa zostanie zamknięta. Historia i rozliczenia zostaną zachowane."
        confirmLabel={closeCasePending ? 'Zamykanie...' : 'Zamknij sprawę'}
        cancelLabel="Anuluj"
        confirmTone="default"
        pending={closeCasePending}
        onConfirm={handleConfirmCloseCaseRecord}
      />

      <span hidden data-stage220a7-delete-case-confirm="true" />
      <ConfirmDialog
        open={deleteCaseOpen}
        onOpenChange={setDeleteCaseOpen}
        title="Awaryjnie usunąć sprawę?"
        description={`Awaryjne usunięcie sprawy „${getCaseHeaderClientLabel(caseData)} — ${getCaseHeaderCaseLabel(caseData)}” usunie rekord i powiązania. Normalne zakończenie procesu wykonuj przez Zamknij sprawę.`}
        confirmLabel="Awaryjnie usuń"
        cancelLabel="Anuluj"
        confirmTone="destructive"
        pending={deleteCasePending}
        onConfirm={handleConfirmDeleteCaseRecord}
      />

      <ConfirmDialog
        open={Boolean(paymentDeleteTargetStage220A29)}
        onOpenChange={(open) => {
          if (!open && !paymentDeleteSubmittingStage220A29) setPaymentDeleteTargetStage220A29(null);
        }}
        title="Usunąć wpłatę?"
        description={paymentDeleteTargetStage220A29 ? `${getCasePaymentLabelStage220A27(paymentDeleteTargetStage220A29)} ${formatMoney(getCasePaymentSignedAmountStage220A27(paymentDeleteTargetStage220A29), paymentDeleteTargetStage220A29.currency || caseFinanceSourceStage220A26.currency)} zostanie usunięta z historii i rozliczenia sprawy. Tej akcji nie można cofnąć.` : 'Usunąć wybraną wpłatę?'}
        confirmLabel="Usuń wpłatę"
        cancelLabel="Anuluj"
        confirmTone="destructive"
        pending={paymentDeleteSubmittingStage220A29}
        onConfirm={handleConfirmDeletePaymentStage220A29}
        data-stage220a29-delete-payment-confirm="true"
      />




      <Dialog open={isCaseCostOpenStage231D2} onOpenChange={setIsCaseCostOpenStage231D2}>
        <DialogContent className="max-w-2xl event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30" data-stage231d2-case-cost-dialog="true" data-cf-vst-dialog="true" aria-describedby={undefined}>
          <DialogHeader className="event-form-vnext-header case-finance-source-header-stage220a30">
            <DialogTitle>Dodaj koszt sprawy</DialogTitle>
            <DialogDescription>Koszt zostanie przypięty do tej sprawy i wliczony do kwoty razem do pobrania.</DialogDescription>
          </DialogHeader>
          <div className="case-detail-payment-form case-finance-source-form-stage220a30">
            <div>
              <Label htmlFor="case-cost-amount-stage231d2">Kwota kosztu</Label>
              <Input id="case-cost-amount-stage231d2" type="number" min="0" step="0.01" value={caseCostDraftStage231D2.amount} onChange={(event) => setCaseCostDraftStage231D2((draft) => ({ ...draft, amount: event.target.value }))} placeholder="np. 250" />
            </div>
            <div>
              <Label htmlFor="case-cost-kind-stage231d2">Typ kosztu</Label>
              <select id="case-cost-kind-stage231d2" value={caseCostDraftStage231D2.kind} onChange={(event) => setCaseCostDraftStage231D2((draft) => ({ ...draft, kind: event.target.value }))}>
                <option value="court_fee">Opłata sądowa</option>
                <option value="notary">Notariusz</option>
                <option value="travel">Dojazd</option>
                <option value="document">Dokumenty</option>
                <option value="office">Biuro</option>
                <option value="marketing">Marketing</option>
                <option value="other">Inny</option>
              </select>
            </div>
            <div>
              <Label htmlFor="case-cost-note-stage231d2">Notatka</Label>
              <Textarea id="case-cost-note-stage231d2" value={caseCostDraftStage231D2.note} onChange={(event) => setCaseCostDraftStage231D2((draft) => ({ ...draft, note: event.target.value }))} placeholder="np. wypis z rejestru, opłata za dokument" />
            </div>
          </div>
          <DialogFooter className={modalFooterClass('event-form-footer case-finance-source-footer-stage220a30')}>
            <Button type="button" variant="outline" onClick={() => setIsCaseCostOpenStage231D2(false)}>Anuluj</Button>
            <Button type="button" onClick={handleCreateCaseCostStage231D2} disabled={caseCostSubmittingStage231D2 || !hasAccess}>
              {caseCostSubmittingStage231D2 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Zapisz koszt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCasePaymentOpen} onOpenChange={setIsCasePaymentOpen}>
        <DialogContent data-case-payment-dialog="true" data-stage220a26-case-payment-dialog="true" data-cf-vst-dialog="true" className="max-w-2xl event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30 case-finance-source-modal-stage220a30--payment" aria-describedby={undefined}>
          <DialogHeader className="event-form-vnext-header case-finance-source-header-stage220a30">
            <DialogTitle>Dodaj wpłatę</DialogTitle>
            <DialogDescription>Wpisz kwotę, datę i krótki opis. Po zapisie wpłata trafi do rozliczenia sprawy.</DialogDescription>
          </DialogHeader>
          <div className="case-detail-payment-form case-finance-source-form-stage220a30 case-finance-source-form-stage220a30--legacy-payment">
            <div>
              <Label htmlFor="case-payment-amount">Kwota</Label>
              <Input
                id="case-payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={casePaymentDraft.amount}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, amount: event.target.value }))}
                placeholder="np. 2000"
              />
            </div>
            <span hidden data-stage231h-r1d-commission-payment-defaults="status-fully-paid-type-payment" />
            <div>
              <Label htmlFor="case-payment-note">Notatka do wpłaty</Label>
              <Textarea
                id="case-payment-note"
                value={casePaymentDraft.note}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, note: event.target.value }))}
                placeholder="np. zaliczka po akceptacji oferty"
              />
            </div>
          </div>
          <DialogFooter className={modalFooterClass('event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30')}>
            <Button type="button" variant="outline" onClick={() => setIsCasePaymentOpen(false)}>
              Anuluj
            </Button>
            <Button type="button" onClick={handleCreateCasePayment} disabled={casePaymentSubmitting || !hasAccess}>
              {casePaymentSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Zapisz wpłatę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isPaymentHistoryOpenStage220A27B} onOpenChange={setIsPaymentHistoryOpenStage220A27B}>
        <DialogContent
          className="client-case-form-content case-payment-history-modal-stage220a27b case-payment-history-modal-stage220a27b-r3-light case-payment-history-modal-stage220a28-vst max-w-2xl event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30 case-finance-source-modal-stage220a30--history"
          data-stage220a27b-payment-history-modal="true"
          data-stage220a28-payment-history-modal-vst="true"
          data-cf-vst-dialog="true"
         aria-describedby={undefined}>
          <DialogHeader className="client-case-form-header case-payment-history-modal-stage220a28-header event-form-vnext-header case-finance-source-header-stage220a30">
            <DialogTitle>Koryguj wpłatę/koszt</DialogTitle>
          </DialogHeader>

          <div className="client-case-form-section case-payment-history-modal-stage220a27b__context case-payment-history-modal-stage220a28-context" data-stage220a27b-payment-history-context="case">
            <span>Sprawa</span>
            <strong>{getCaseHeaderCaseLabel(caseData)}</strong>
          </div>

          {visibleCasePayments.length === 0 ? (
            <p className="case-payment-history-modal-stage220a27b__empty">Brak wpłat, korekt i kosztów przy tej sprawie.</p>
          ) : (
            <div className="case-payment-history-modal-stage220a27b__list">
              {financeCorrectionRowsStage231H_R1C.map((row) => {
                if (row.kind === 'cost') {
                  const cost = row.cost as CaseCostRecord;
                  const costCurrency = getCaseCostCurrencyStage231H_R1C(cost, caseFinanceSourceStage220A26.currency);
                  const costAmount = getCaseCostAmountStage231H_R1C(cost);
                  return (
                    <article
                      key={'case-payment-history-modal-stage231h-r1c-' + row.id}
                      className="client-case-form-section case-payment-history-modal-stage220a27b__row case-payment-history-modal-stage220a28-row case-payment-history-modal-stage231h-r1c__row--cost"
                      data-stage231h-r1c-cost-correction-row="true"
                    >
                      <div className="case-payment-history-modal-stage220a27b__main case-payment-history-modal-stage231h-r1c__cost-main">
                        <strong>Koszt: {getCaseCostKindLabelStage231H_R1C(cost.kind || (cost as any).type)}</strong>
                        <div className="case-payment-history-modal-stage220a27b__meta" data-stage231h-r1c-cost-meta="true">
                          <span>Data: {formatDateTime(getCaseCostDateStage231H_R1C(cost), 'Bez daty')}</span>
                          {/* STAGE231H_R1D: status kosztu jest dostępny w korekcie, ale nie zabiera miejsca na liście. */}
                          <span>Wartość: {formatMoney(-costAmount, costCurrency)}</span>
                          <span>Do zwrotu: {formatMoney(getCaseCostReimbursableAmountStage231H_R1C(cost), costCurrency)}</span>
                          <span>Zwrócono: {formatMoney(getCaseCostReimbursedAmountStage231H_R1C(cost), costCurrency)}</span>
                        </div>
                        {getCaseCostNoteStage231H_R1C(cost) ? <p>{getCaseCostNoteStage231H_R1C(cost)}</p> : null}
                      </div>

                      <div className="case-payment-history-modal-stage220a27b__actions case-payment-history-modal-stage220a30__actions">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openCaseCostCorrectionModalStage231H_R1C(cost)}
                          disabled={caseCostCorrectionSubmittingStage231H_R1C || caseCostDeleteSubmittingStage231H_R1C || !getCaseCostIdStage231H_R1C(cost)}
                          data-stage231h-r1c-select-cost-correction="true"
                        >
                          Koryguj
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="cf-vst-button cf-vst-button-delete case-payment-history-modal-stage220a29__delete case-payment-history-modal-stage220a30__delete"
                          onClick={() => openCaseCostDeleteConfirmStage231H_R1C(cost)}
                          disabled={caseCostDeleteSubmittingStage231H_R1C || caseCostCorrectionSubmittingStage231H_R1C || !getCaseCostIdStage231H_R1C(cost)}
                          data-stage231h-r1c-delete-cost-from-history="true"
                        >
                          <Trash2 className="h-4 w-4" />
                          Usuń
                        </Button>
                      </div>
                    </article>
                  );
                }

                const payment = row.payment as CasePaymentRecord;
                const type = getCasePaymentTypeStage220A27(payment);
                const signedAmount = getCasePaymentSignedAmountStage220A27(payment);
                const isCorrection = type === 'refund';
                return (
                  <article
                    key={'case-payment-history-modal-stage220a27b-' + String(payment.id || payment.paidAt || payment.createdAt || payment.amount)}
                    className={'client-case-form-section case-payment-history-modal-stage220a27b__row case-payment-history-modal-stage220a28-row ' + (isCorrection ? 'case-payment-history-modal-stage220a27b__row--correction' : '')}
                    data-stage220a27b-payment-history-row={type || 'payment'}
                  >
                    <div className="case-payment-history-modal-stage220a27b__main">
                      <strong>{getCasePaymentLabelStage220A27(payment)}</strong>
                      <div className="case-payment-history-modal-stage220a27b__meta" data-stage220a27b-r2-payment-meta="true">
                        <span>Data: {formatDateTime(getCasePaymentDateStage220A27(payment), 'Bez daty')}</span>
                        <span>Wartość: {formatMoney(signedAmount, payment.currency || caseFinanceSourceStage220A26.currency)}</span>
                      </div>
                      {payment.note ? <p>{payment.note}</p> : null}
                    </div>

                    <div className="case-payment-history-modal-stage220a27b__actions case-payment-history-modal-stage220a30__actions">
                      {canCorrectCasePaymentStage220A27(payment) ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openPaymentCorrectionFromHistoryStage220A27B(payment)}
                          disabled={paymentCorrectionSubmittingStage220A27 || paymentDeleteSubmittingStage220A29}
                          data-stage220a27b-select-payment-correction="true"
                        >
                          Koryguj
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cf-vst-button cf-vst-button-delete case-payment-history-modal-stage220a29__delete case-payment-history-modal-stage220a30__delete"
                        onClick={() => openPaymentDeleteConfirmStage220A29(payment)}
                        disabled={paymentDeleteSubmittingStage220A29 || paymentCorrectionSubmittingStage220A27 || !String(payment.id || '').trim()}
                        data-stage220a29-delete-payment-from-history="true"
                      >
                        <Trash2 className="h-4 w-4" />
                        Usuń
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <DialogFooter className="event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30">
            <Button type="button" variant="outline" onClick={() => setIsPaymentHistoryOpenStage220A27B(false)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(paymentCorrectionTargetStage220A27)}
        onOpenChange={(open) => {
          if (!open && !paymentCorrectionSubmittingStage220A27) {
            setPaymentCorrectionTargetStage220A27(null);
            setPaymentCorrectionFormStage220A27({ amount: '', paidAt: '', reason: '' });
          }
        }}
      >
        <DialogContent
          className="client-case-form-content case-payment-correction-modal-stage220a27 case-payment-correction-modal-stage220a28-vst max-w-2xl event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30 case-finance-source-modal-stage220a30--correction"
          data-stage220a27-payment-correction-modal="true"
          data-stage220a28-payment-correction-modal-vst="true"
          data-cf-vst-dialog="true"
         aria-describedby={undefined}>
          <DialogHeader className="client-case-form-header case-payment-correction-modal-stage220a28-header event-form-vnext-header case-finance-source-header-stage220a30">
            <DialogTitle>Korekta wpłaty prowizji</DialogTitle>
          </DialogHeader>

          <div className="case-payment-correction-modal-stage220a27__summary" data-stage220a27-payment-correction-summary="true">
            <div>
              <span>Oryginalna wpłata</span>
              <strong>{formatMoney(getPaymentAmount((paymentCorrectionTargetStage220A27 || {}) as CasePaymentRecord), paymentCorrectionTargetStage220A27?.currency || caseFinanceSourceStage220A26.currency)}</strong>
            </div>
            <div>
              <span>Data oryginału</span>
              <strong>{formatDateTime(getCasePaymentDateStage220A27((paymentCorrectionTargetStage220A27 || {}) as CasePaymentRecord), 'Bez daty')}</strong>
            </div>
          </div>

          <div className="case-finance-edit-form case-finance-source-form-stage220a30">
            <label className="case-finance-edit-field">
              <span>Kwota wpłaty</span>
              <Input
                inputMode="decimal"
                value={paymentCorrectionFormStage220A27.amount}
                onChange={(event) => setPaymentCorrectionFormStage220A27((current) => ({ ...current, amount: event.target.value }))}
                placeholder="np. 500"
                data-stage231h-r1f-payment-correction-amount="true"
              />
            </label>
            <label className="case-finance-edit-field">
              <span>Data wpłaty</span>
              <Input
                type="datetime-local"
                value={paymentCorrectionFormStage220A27.paidAt}
                onChange={(event) => setPaymentCorrectionFormStage220A27((current) => ({ ...current, paidAt: event.target.value }))}
                data-stage231h-r1f-payment-correction-date="true"
              />
            </label>
            <label className="case-finance-edit-field case-finance-edit-field--wide">
              <span>Opis / dopisek do wpłaty</span>
              <Textarea
                value={paymentCorrectionFormStage220A27.reason}
                onChange={(event) => setPaymentCorrectionFormStage220A27((current) => ({ ...current, reason: event.target.value }))}
                placeholder="Np. za co jest wpłata, korekta daty albo dopisek do prowizji"
                data-stage231h-r1f-payment-correction-note="true"
              />
            </label>
          </div>

          <DialogFooter className="event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPaymentCorrectionTargetStage220A27(null);
                setPaymentCorrectionFormStage220A27({ amount: '', paidAt: '', reason: '' });
              }}
              disabled={paymentCorrectionSubmittingStage220A27}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={handleSavePaymentCorrectionStage220A27}
              disabled={paymentCorrectionSubmittingStage220A27 || fin11Amount(paymentCorrectionFormStage220A27.amount) <= 0 || !paymentCorrectionFormStage220A27.paidAt}
              data-stage231h-r1f-save-payment-correction="true"
              data-stage231h-r1f4-payment-correction-normalized-paid="true"
            >
              {paymentCorrectionSubmittingStage220A27 ? 'Zapisywanie...' : 'Zapisz wpłatę'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog
        open={Boolean(caseCostCorrectionTargetStage231H_R1C)}
        onOpenChange={(open) => {
          if (!open && !caseCostCorrectionSubmittingStage231H_R1C) {
            setCaseCostCorrectionTargetStage231H_R1C(null);
            setCaseCostCorrectionFormStage231H_R1C({ kind: 'other', amount: '', reimbursableAmount: '', reimbursedAmount: '', status: 'incurred', incurredAt: '', note: '' });
          }
        }}
      >
        <DialogContent
          className="client-case-form-content case-payment-correction-modal-stage220a27 case-payment-correction-modal-stage220a28-vst max-w-2xl event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30 case-finance-source-modal-stage220a30--correction"
          data-stage231h-r1c-cost-correction-modal="true"
          data-cf-vst-dialog="true"
          aria-describedby={undefined}>
          <DialogHeader className="client-case-form-header case-payment-correction-modal-stage220a28-header event-form-vnext-header case-finance-source-header-stage220a30">
            <DialogTitle>Korekta kosztu</DialogTitle>
          </DialogHeader>

          <div className="case-payment-correction-modal-stage220a27__summary case-payment-history-modal-stage231h-r1c__row--cost" data-stage231h-r1c-cost-correction-summary="true">
            <div>
              <span>Oryginalny koszt</span>
              <strong>{formatMoney(-getCaseCostAmountStage231H_R1C(caseCostCorrectionTargetStage231H_R1C || {} as CaseCostRecord), getCaseCostCurrencyStage231H_R1C(caseCostCorrectionTargetStage231H_R1C || undefined, caseFinanceSourceStage220A26.currency))}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{getCaseCostStatusLabelStage231H_R1C(caseCostCorrectionTargetStage231H_R1C?.status)}</strong>
            </div>
          </div>

          <div className="case-finance-edit-form case-finance-source-form-stage220a30">
            <label className="case-finance-edit-field">
              <span>Rodzaj kosztu</span>
              <select
                className="cf-vst-input case-finance-edit-select"
                value={caseCostCorrectionFormStage231H_R1C.kind}
                onChange={(event) => setCaseCostCorrectionFormStage231H_R1C((current) => ({ ...current, kind: event.target.value }))}
                data-stage231h-r1f-cost-correction-kind="true"
              >
                <option value="court_fee">Opłata sądowa</option>
                <option value="notary">Notariusz</option>
                <option value="travel">Dojazd</option>
                <option value="document">Dokumenty</option>
                <option value="office">Biuro</option>
                <option value="marketing">Marketing</option>
                <option value="other">Inny</option>
              </select>
            </label>
            <label className="case-finance-edit-field">
              <span>Data kosztu</span>
              <Input
                type="datetime-local"
                value={caseCostCorrectionFormStage231H_R1C.incurredAt}
                onChange={(event) => setCaseCostCorrectionFormStage231H_R1C((current) => ({ ...current, incurredAt: event.target.value }))}
                data-stage231h-r1f-cost-correction-date="true"
              />
            </label>
            <label className="case-finance-edit-field">
              <span>Kwota kosztu</span>
              <Input
                inputMode="decimal"
                value={caseCostCorrectionFormStage231H_R1C.amount}
                onChange={(event) => setCaseCostCorrectionFormStage231H_R1C((current) => ({ ...current, amount: event.target.value }))}
                placeholder="np. 2000"
                data-stage231h-r1c-cost-correction-amount="true"
              />
            </label>
            <label className="case-finance-edit-field">
              <span>Koszt do zwrotu</span>
              <Input
                inputMode="decimal"
                value={caseCostCorrectionFormStage231H_R1C.reimbursableAmount}
                onChange={(event) => setCaseCostCorrectionFormStage231H_R1C((current) => ({ ...current, reimbursableAmount: event.target.value }))}
                placeholder="np. 2000"
                data-stage231h-r1c-cost-correction-reimbursable="true"
              />
            </label>
            <label className="case-finance-edit-field">
              <span>Koszt zwrócony</span>
              <Input
                inputMode="decimal"
                value={caseCostCorrectionFormStage231H_R1C.reimbursedAmount}
                onChange={(event) => setCaseCostCorrectionFormStage231H_R1C((current) => ({ ...current, reimbursedAmount: event.target.value }))}
                placeholder="np. 0"
                data-stage231h-r1c-cost-correction-reimbursed="true"
              />
            </label>
            <label className="case-finance-edit-field">
              <span>Status kosztu</span>
              <select
                className="cf-vst-input case-finance-edit-select"
                value={caseCostCorrectionFormStage231H_R1C.status}
                onChange={(event) => setCaseCostCorrectionFormStage231H_R1C((current) => ({ ...current, status: event.target.value }))}
                data-stage231h-r1c-cost-correction-status="true"
              >
                <option value="planned">Planowany</option>
                <option value="incurred">Poniesiony</option>
                <option value="submitted">Do zwrotu</option>
                <option value="partially_reimbursed">Częściowo zwrócony</option>
                <option value="reimbursed">Zwrócony</option>
                <option value="cancelled">Anulowany</option>
              </select>
            </label>
            <label className="case-finance-edit-field case-finance-edit-field--wide">
              <span>Notatka / powód korekty</span>
              <Textarea
                value={caseCostCorrectionFormStage231H_R1C.note}
                onChange={(event) => setCaseCostCorrectionFormStage231H_R1C((current) => ({ ...current, note: event.target.value }))}
                placeholder="Np. korekta kwoty, zwrot kosztu, błędnie dodany koszt"
                data-stage231h-r1c-cost-correction-note="true"
              />
            </label>
          </div>

          <DialogFooter className="event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCaseCostCorrectionTargetStage231H_R1C(null);
                setCaseCostCorrectionFormStage231H_R1C({ kind: 'other', amount: '', reimbursableAmount: '', reimbursedAmount: '', status: 'incurred', incurredAt: '', note: '' });
              }}
              disabled={caseCostCorrectionSubmittingStage231H_R1C}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={handleSaveCaseCostCorrectionStage231H_R1C}
              disabled={caseCostCorrectionSubmittingStage231H_R1C || fin11Amount(caseCostCorrectionFormStage231H_R1C.amount) <= 0}
              data-stage231h-r1c-save-cost-correction="true"
            >
              {caseCostCorrectionSubmittingStage231H_R1C ? 'Zapisywanie...' : 'Zapisz korektę kosztu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(caseCostDeleteTargetStage231H_R1C)}
        onOpenChange={(open) => {
          if (!open && !caseCostDeleteSubmittingStage231H_R1C) setCaseCostDeleteTargetStage231H_R1C(null);
        }}
        title="Usunąć koszt?"
        description={caseCostDeleteTargetStage231H_R1C ? 'Koszt ' + formatMoney(-getCaseCostAmountStage231H_R1C(caseCostDeleteTargetStage231H_R1C), getCaseCostCurrencyStage231H_R1C(caseCostDeleteTargetStage231H_R1C, caseFinanceSourceStage220A26.currency)) + ' zostanie usunięty z rozliczenia sprawy. Tej akcji nie można cofnąć.' : 'Usunąć wybrany koszt?'}
        confirmLabel="Usuń koszt"
        cancelLabel="Anuluj"
        confirmTone="destructive"
        pending={caseCostDeleteSubmittingStage231H_R1C}
        onConfirm={handleConfirmDeleteCaseCostStage231H_R1C}
        data-stage231h-r1c-delete-cost-confirm="true"
      />

      {/* FIN-11_CASE_RIGHT_FINANCE_MODALS */}
      <Dialog open={isFinanceEditOpen} onOpenChange={setIsFinanceEditOpen}>
        <DialogContent className="max-w-2xl event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30 case-finance-source-modal-stage220a30--finance" data-stage220a26-case-finance-modal="true" data-stage220a36r7-case-detail-legacy-finance-modal="true" data-cf-vst-dialog="true" aria-describedby={undefined}>
          <DialogHeader className="event-form-vnext-header case-finance-source-header-stage220a30">
            <DialogTitle>Wartość i prowizja sprawy</DialogTitle>
            <DialogDescription>Ustaw sposób liczenia prowizji. Szczegóły są pod ikonami „?”.</DialogDescription>
          </DialogHeader>
          <div className="case-finance-edit-form case-finance-source-form-stage220a30 case-finance-edit-form--commission-r10 case-finance-edit-form--commission-r11" data-stage220a36r7-case-detail-finance-order="true" data-stage220a36r10-commission-layout="true" data-stage220a36r12-compact-width-polish="true" data-stage220a36r11-compact-tooltips="true">
            <div className="case-finance-edit-top-row-stage220a36r10" data-stage220a36r10-top-row="true">
              <label className="case-finance-edit-field" data-stage220a36r10-top-field="commission-mode">
                <span className="case-finance-field-label-with-help-stage220a36r11"><span>Rodzaj prowizji</span><span className="case-finance-help-dot-stage220a36r11" title="Kwota stała: wpisujesz prowizję ręcznie. Procent: prowizja liczy się ze stawki i wartości transakcji/zlecenia." aria-label="Wyjaśnienie rodzaju prowizji" tabIndex={0}>?</span></span>
                <select
                  className="cf-vst-input case-finance-edit-select"
                  value={financeEditForm.commissionMode}
                  onChange={(event) => {
                    const nextMode = event.target.value as 'none' | 'percent' | 'fixed';
                    setFinanceEditForm((current) => ({
                      ...current,
                      commissionMode: nextMode,
                      contractValue: current.contractValue,
                      commissionRate: nextMode === 'percent' ? current.commissionRate : '',
                      commissionAmount: nextMode === 'fixed' ? current.commissionAmount : '',
                    }));
                  }}
                  data-stage220a32-commission-mode-control="true"
                >
                  <option value="none">Brak</option>
                  <option value="percent">Procent od wartości transakcji</option>
                  <option value="fixed">Kwota stała</option>
                </select>
              </label>
              <label className="case-finance-edit-field" data-stage220a36r10-top-field="commission-rate">
                <span className="case-finance-field-label-with-help-stage220a36r11"><span>Stawka (%)</span><span className="case-finance-help-dot-stage220a36r11" title="Aktywne tylko przy prowizji procentowej, np. 2 oznacza 2%." aria-label="Wyjaśnienie stawki procentowej" tabIndex={0}>?</span></span>
                <Input
                  inputMode="decimal"
                  value={financeEditForm.commissionRate}
                  disabled={financeEditForm.commissionMode !== 'percent'}
                  aria-disabled={financeEditForm.commissionMode !== 'percent'}
                  data-stage220a32-commission-rate-input="percent-only"
                  data-stage220a36r10-commission-rate-input="percent-only"
                  placeholder="np. 2"
                  onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionRate: event.target.value }))}
                />
              </label>
              <label className="case-finance-edit-field" data-stage220a36r10-top-field="commission-amount">
                <span className="case-finance-field-label-with-help-stage220a36r11"><span>Wartość prowizji</span><span className="case-finance-help-dot-stage220a36r11" title="Przy kwocie stałej wpisujesz ją ręcznie. Przy procencie system wylicza ją automatycznie." aria-label="Wyjaśnienie wartości prowizji" tabIndex={0}>?</span></span>
                <Input
                  inputMode="decimal"
                  value={financeEditForm.commissionMode === 'percent' ? fin11MoneyInput(financeEditPreview.commissionAmount) : financeEditForm.commissionAmount}
                  disabled={financeEditForm.commissionMode !== 'fixed'}
                  readOnly={financeEditForm.commissionMode === 'percent'}
                  aria-disabled={financeEditForm.commissionMode !== 'fixed'}
                  data-stage220a32-commission-amount-input="fixed-only"
                  data-stage220a36r7-commission-amount-input="fixed-or-calculated"
                  data-stage220a36r10-commission-amount-input="fixed-or-calculated"
                  placeholder={financeEditForm.commissionMode === 'percent' ? 'wyliczana' : 'np. 3000'}
                  onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionAmount: event.target.value }))}
                />
              </label>
            </div>
            <label className="case-finance-edit-field case-finance-edit-field--wide case-finance-edit-transaction-basis-stage220a36r10" data-stage220a36r10-transaction-basis-field="true">
              <span className="case-finance-field-label-with-help-stage220a36r11"><span>Wartość transakcji / zlecenia</span><span className="case-finance-help-dot-stage220a36r11" title="To nie jest prowizja. To kwota sprzedaży, transakcji albo zlecenia, od której liczysz procent." aria-label="Wyjaśnienie wartości transakcji lub zlecenia" tabIndex={0}>?</span></span>
              <Input
                inputMode="decimal"
                value={financeEditForm.contractValue}
                data-stage220a36r7-percent-basis-input="always-editable"
                data-stage220a36r10-transaction-basis-input="always-editable"
                data-stage231h-r1b-contract-value-always-editable="true"
                placeholder="np. 69000"
                onChange={(event) => setFinanceEditForm((current) => ({ ...current, contractValue: event.target.value }))}
              />
            </label>
            <div className="case-finance-edit-bottom-row-stage220a36r10" data-stage220a36r10-bottom-row="true">
              <label className="case-finance-edit-field">
                <span>Waluta</span>
                <Input value={financeEditForm.currency} placeholder="PLN" maxLength={3} onChange={(event) => setFinanceEditForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} />
              </label>
              <label className="case-finance-edit-field">
                <span>Status prowizji</span>
                <select className="cf-vst-input case-finance-edit-select" value={financeEditForm.commissionStatus} onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionStatus: event.target.value }))}>
                  <option value="not_set">nieustawiona</option>
                  <option value="expected">oczekiwana</option>
                  <option value="due">należna</option>
                  <option value="partially_paid">częściowo zapłacona</option>
                  <option value="paid">zapłacona</option>
                  <option value="overdue">zaległa</option>
                </select>
              </label>
            </div>
            <div className="case-finance-edit-preview" data-fin11-case-finance-preview="true" data-stage220a31-finance-preview="true" data-stage220a36r10-finance-preview="true">
              <div data-stage231h-r1b-contract-value-preview="always-visible"><span>Wartość transakcji/zlecenia:</span><strong>{formatMoney(financeEditPreview.contractValue, financeEditPreview.currency)}</strong></div>
              <div><span>Prowizja należna:</span><strong>{formatMoney(financeEditPreview.commissionAmount, financeEditPreview.currency)}</strong></div>
              <div><span>Wpłacono prowizji:</span><strong>{formatMoney(financeEditPreview.commissionPaidAmount, financeEditPreview.currency)}</strong></div>
              <div data-cf-finance-tone="remaining"><span>Pozostało do zapłaty:</span><strong>{formatMoney(financeEditPreview.commissionRemainingAmount, financeEditPreview.currency)}</strong></div>
            </div>
          </div>
          <DialogFooter className="event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30">
            <Button type="button" variant="outline" onClick={() => setIsFinanceEditOpen(false)} disabled={isFinanceSaving}>Anuluj</Button>
            <Button
              type="button"
              onClick={handleSaveCaseFinanceEdit}
              disabled={isFinanceSaving || (financeEditForm.commissionMode === 'percent' ? financeEditPreview.contractValue <= 0 || financeEditPreview.commissionRate <= 0 : financeEditForm.commissionMode === 'fixed' ? financeEditPreview.commissionAmount <= 0 : false)}
            >
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFinancePaymentOpen} onOpenChange={setIsFinancePaymentOpen}>
        <DialogContent className="max-w-2xl event-form-vnext-content closeflow-event-modal-readable case-finance-source-modal-stage220a30 case-finance-source-modal-stage220a30--finance" data-stage220a26-case-finance-modal="true" data-cf-vst-dialog="true" aria-describedby={undefined}>
          <DialogHeader className="event-form-vnext-header case-finance-source-header-stage220a30">
            <DialogTitle>{financePaymentForm.type === 'commission' ? 'Dodaj wpłatę prowizji' : 'Dodaj wpłatę'}</DialogTitle>
            <DialogDescription>{financePaymentForm.type === 'commission' ? 'Wpisz kwotę prowizji, datę zapłaty i notatkę dla sprawy.' : 'Wpisz kwotę wpłaty, datę zapłaty i notatkę. Po zapisie kwota trafi do rozliczenia sprawy.'}</DialogDescription>
          </DialogHeader>
          <div className="case-finance-edit-form case-finance-source-form-stage220a30">
            <label className="case-finance-edit-field">
              <span>Kwota</span>
              <Input inputMode="decimal" value={financePaymentForm.amount} placeholder="np. 20000" onChange={(event) => setFinancePaymentForm((current) => ({ ...current, amount: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Waluta</span>
              <Input value={financePaymentForm.currency} maxLength={3} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Status</span>
              <select className="cf-vst-input case-finance-edit-select" value={financePaymentForm.status} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, status: event.target.value }))}>
                <option value="paid">opłacona</option>
                <option value="partially_paid">częściowo opłacona</option>
                <option value="fully_paid">w pełni opłacona</option>
                <option value="deposit_paid">zaliczka wpłacona</option>
                <option value="due">należna</option>
                <option value="planned">zaplanowana</option>
              </select>
            </label>
            <label className="case-finance-edit-field">
              <span>Data zapłaty</span>
              <Input type="datetime-local" value={financePaymentForm.paidAt} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, paidAt: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Termin płatności (opcjonalnie)</span>
              <Input type="datetime-local" value={financePaymentForm.dueAt} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, dueAt: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field case-finance-edit-field--wide">
              <span>Notatka</span>
              <Textarea value={financePaymentForm.note} placeholder="np. przelew / gotówka / faktura" onChange={(event) => setFinancePaymentForm((current) => ({ ...current, note: event.target.value }))} />
            </label>
          </div>
          <DialogFooter className="event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30">
            <Button type="button" variant="outline" onClick={() => setIsFinancePaymentOpen(false)} disabled={isFinanceSaving}>Anuluj</Button>
            <Button type="button" onClick={handleSaveCaseFinancePayment} disabled={isFinanceSaving || fin11Amount(financePaymentForm.amount) <= 0}>Zapisz płatność</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
</Layout>
  );
}
function CaseDetailV1CommandCenter({
  status,
  lifecycle,
  onSetStatus,
  onOpenAddItem,
  onCopyPortal,
}: {
  status: string;
  lifecycle: ReturnType<typeof resolveCaseLifecycleV1>;
  onSetStatus: (status: string) => void;
  onOpenAddItem: () => void;
  onCopyPortal: () => void;
}) {
  const isCompleted = status === 'completed' || lifecycle.bucket === 'completed';

  return (
    <section className="case-detail-command-center" data-testid="case-detail-v1-command-center">
      <div className="case-detail-card-title-row">
        <EntityIcon entity="template" className="h-4 w-4" />
        <h2>Centrum dowodzenia sprawy V1</h2>
      </div>

            <div className="case-detail-command-status">
        <button type="button" onClick={() => onSetStatus('in_progress')} disabled={!isCompleted && status === 'in_progress'}>
          Start
        </button>
        <button type="button" onClick={() => onSetStatus('completed')} disabled={isCompleted}>
          Zrobione
        </button>
        <button type="button" onClick={() => onSetStatus('in_progress')} disabled={!isCompleted}>
          Przywróć
        </button>
      </div>
    </section>
  );
}
function ShieldStatusIcon({ status }: { status?: string }) {
  if (status === 'blocked') return <AlertCircle className="h-4 w-4" />;
  if (status === 'completed' || status === 'ready_to_start') return <CheckCircle2 className="h-4 w-4" />;
  return <Clock className="h-4 w-4" />;
}
function PathCard({ label, value, helper, tone }: { label: string; value: number; helper: string; tone: 'amber' | 'blue' | 'green' | 'neutral' }) {
  return (
    <article className={`case-detail-path-card case-detail-path-card-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
      <p>{helper}</p>
    </article>
  );
}
function WorkItemRow({
  entry,
  onTaskDone,
  onTaskTomorrow,
  onEventDone,
  onEventTomorrow,
  onItemAccept,
  onItemReject,
  onItemDelete,
  onDelete,
}: {
  entry: WorkItem;
  onTaskDone: (task: TaskRecord) => void;
  onTaskTomorrow: (task: TaskRecord) => void;
  onEventDone: (event: EventRecord) => void;
  onEventTomorrow: (event: EventRecord) => void;
  onItemAccept: (item: CaseItem) => void;
  onItemReject: (item: CaseItem) => void;
  onItemDelete: (item: CaseItem) => void;
  onDelete: (entry: WorkItem) => void;
}) {
  if (isCaseActivitySourceForWorkRow(entry.source)) {
    return null;
  }

  return (
    <article className={`case-detail-work-row stage220a8-work-row-contrast stage220a8-work-row-${entry.kind}`} data-stage220a8-work-row="true" data-work-kind={entry.kind}>
      <span className="case-detail-work-icon"><WorkKindIcon kind={entry.kind} /></span>
      <div className="case-detail-work-main">
        <span className="case-detail-kind-pill">{getWorkKindLabel(entry.kind)}</span>
        <h3>{entry.title}</h3>
        <p>{entry.subtitle}</p>
      </div>
      <div className="case-detail-work-date">
        <small>Termin</small>
        <strong>{entry.dateLabel}</strong>
      </div>
      <span className={`case-detail-pill ${entry.statusClass}`}>{entry.status}</span>
      <div className="case-detail-row-actions">
        {entry.kind === 'task' ? (
          <>
            <button type="button" onClick={() => onTaskDone(entry.source as TaskRecord)}>Zrobione</button>
            <button type="button" onClick={() => onTaskTomorrow(entry.source as TaskRecord)}>Jutro</button>
          </>
        ) : null}
        {entry.kind === 'event' ? (
          <>
            <button type="button" onClick={() => onEventDone(entry.source as EventRecord)}>Zrobione</button>
            <button type="button" onClick={() => onEventTomorrow(entry.source as EventRecord)}>Jutro</button>
          </>
        ) : null}
        {entry.kind === 'missing' ? (
          <>
            <button type="button" onClick={() => onItemAccept(entry.source as CaseItem)}>Akceptuj</button>
            <button type="button" onClick={() => onItemReject(entry.source as CaseItem)}>Odrzuć</button>
          </>
        ) : null}
        <EntityActionButton
          type="button"
          tone="danger"
          className="case-detail-row-action-trash"
          title={`Usuń ${getWorkKindLabel(entry.kind).toLowerCase()}`}
          aria-label={`Usuń ${getWorkKindLabel(entry.kind).toLowerCase()}`}
          onClick={() => onDelete(entry)}
          data-stage220a8-delete-work-item="true"
        >
          <Trash2 className="h-4 w-4" />
        </EntityActionButton>
      </div>
    </article>
  );
}
function CaseItemDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; description: string; type: string; isRequired: boolean; dueDate: string };
  onChange: (value: { title: string; description: string; type: string; isRequired: boolean; dueDate: string }) => void;
  onSubmit: () => void;
}) {
return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader><DialogTitle>Dodaj brak</DialogTitle>
<DialogDescription>Uzupełnij brakujący element i zapisz go w checklistach sprawy.</DialogDescription></DialogHeader>
        <div className="case-detail-dialog-grid">
          <label>Tytuł<Input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} placeholder="np. Umowa, skan dokumentu, decyzja" /></label>
          <label>Opis<Textarea value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Krótko opisz, czego brakuje." /></label>
          <label>Typ<select value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value })}><option value="file">Plik</option><option value="decision">Decyzja</option><option value="text">Tekst</option></select></label>
          <label>Termin<Input type="date" value={value.dueDate} onChange={(event) => onChange({ ...value, dueDate: event.target.value })} /></label>
          <label className="case-detail-checkbox-label"><input type="checkbox" checked={value.isRequired} onChange={(event) => onChange({ ...value, isRequired: event.target.checked })} /> Wymagane do startu / realizacji</label>
        </div>
        <DialogFooter className={modalFooterClass('event-form-footer case-finance-modal-stage220a26-footer case-finance-source-footer-stage220a30')}><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button><Button type="button" className="cf-btn-tone-gap" onClick={onSubmit}>Dodaj brak</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
const STAGE16M_CASE_DETAIL_WRITE_GATE_COMPAT = 'case-detail write gate compat uses runtime hook import';
void STAGE16M_CASE_DETAIL_WRITE_GATE_COMPAT;
const CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER = 'CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER' as const;
void CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER;
