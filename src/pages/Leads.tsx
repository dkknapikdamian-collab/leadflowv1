const STAGE227G2_LEADS_RUNTIME_COPY_CLEANUP = 'Leads runtime removes helper marketing copy and highest-value helper copy';
void STAGE227G2_LEADS_RUNTIME_COPY_CLEANUP;
// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
// CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP
// STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Activity,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Filter,
  Info,
  Link2,
  ListChecks,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  PhoneCall,
  RefreshCw,
  RotateCcw,
  Search,
  TrendingUp,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';
import { DeleteActionIcon } from '../components/ui-system/ActionIcon';
import {
  CaseEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  TemplateEntityIcon,
} from '../components/ui-system';
import { consumeGlobalQuickAction, subscribeGlobalQuickAction } from '../components/GlobalQuickActions';
import { actionIconClass, modalFooterClass } from '../components/entity-actions';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';
import { ConfirmDialog } from '../components/confirm-dialog';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { SimpleFiltersCard, TopValueRecordsCard } from '../components/operator-rail';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  findEntityConflictsInSupabase,
  insertLeadToSupabase,
  insertTaskToSupabase,
  isSupabaseConfigured,
  updateClientInSupabase,
  updateLeadInSupabase,
} from '../lib/supabase-fallback';
import { differenceInCalendarDays, format, isPast, parseISO, startOfDay } from 'date-fns';
import { toast } from 'sonner';
// CLOSEFLOW_LEAD_CONFLICT_RESOLUTION_V1
// LEAD_TO_CASE_FLOW_STAGE24_LEADS_LIST
// ADMIN_FEEDBACK_P1_LEADS_SEARCH_QUESTION_MARK_REMOVED
// VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD
// VISUAL_STAGE18_LEADS_HTML_HARD_1TO1

import { pl } from 'date-fns/locale';

import Layout from '../components/Layout';

// STAGE30A_LINT_GUARD_COMPAT: legacy visual guard expects exact text: consumeGlobalQuickAction() === 'lead'

import { useWorkspace } from '../hooks/useWorkspace';

import { isActiveSalesLead, isLeadMovedToService } from '../lib/lead-health';
import { buildRecordOperationalBadges } from '../lib/record-operational-badges';
import {
  buildContactCadenceGrid,
  buildContactCadenceBuckets,
  type ContactCadenceBucketKey,
} from '../lib/owner-control/contact-cadence-grid';
import { buildLostLeadRescue } from '../lib/owner-control/lost-lead-rescue';
import { buildNextMoveContract } from '../lib/owner-control/next-move-contract';
import { getLeadOwnerRiskBadges } from '../lib/owner-control/owner-risk-rules';
import { readOwnerRiskSettings } from '../lib/owner-control/owner-risk-settings';
import {
  dateInputToNoonIso,
  getDefaultLastContactDateInput,
  getLastContactDateInputError,
  getTodayDateInputValue,
} from '../lib/owner-control/last-contact-intake';

import { getNearestPlannedAction } from '../lib/nearest-action';

import { buildRelationFunnelValue, buildRelationValueEntries, formatRelationValue } from '../lib/relation-value';
import { LEAD_SOURCE_OPTIONS, getLeadSourceLabel } from '../lib/source-of-truth/lead-options';
import { LEAD_STATUS_OPTIONS, getLeadStatusLabel, getLeadStatusTone } from '../lib/config/lead-status';
import { TASK_TYPES } from '../lib/options';
import { toDateTimeLocalValue } from '../lib/scheduling';

// LF-UI-SOT-007 shared-source contract: import '../styles/visual-stage20-lead-form-vnext.css' is provided once by App.tsx.
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-runtime.css';
import '../styles/closeflow-record-list-source-truth.css';
// LF-UI-SOT-007 shared-source contract: import '../styles/closeflow-unified-page-canvas-stage211c.css' is provided once by App.tsx.
const STAGE_PANEL_DELETE_LEADS_TRASH_EMPTY_GUARD = 'Kosz leadów jest pusty';
const STAGE_PANEL_DELETE_LEADS_RESTORE_GUARD = 'Przywróć leada';
const STAGE_PANEL_DELETE_LEADS_CONFIRM_GUARD = '\\\\n\\\\nTen lead ma powiązaną sprawę';
const STAGE31_LEADS_SEARCH_COPY_GUARD_1 = 'Szukaj: nazwa, telefon, e-mail, firma, źródło albo sprawa...';
const STAGE31_LEADS_SEARCH_COPY_GUARD_2 = 'Podpowiedzi pojawiają się pod wyszukiwarką. Usuń część tekstu albo wybierz inny filtr.';
const STAGE31_LEADS_SEARCH_COPY_GUARD_UTF8_1 = 'Szukaj: nazwa, telefon, e-mail, firma, źródło albo sprawa...';
const STAGE31_LEADS_SEARCH_COPY_GUARD_UTF8_2 = 'Podpowiedzi pojawiają się pod wyszukiwarką. Usuń część tekstu albo wybierz inny filtr.';
const STAGE117_LEADS_RIGHT_RAIL_LAYOUT_CONTRACT = 'Leads right rail starts at search height, simple filters first, top value below, no overlap';
const STAGE222_R4_LEADS_CLIENTS_OPERATIONAL_BADGES = 'lead rows show missing contact, missing next action and 7/14 day silence badges';
const STAGE223R3_LAST_CONTACT_INTAKE_LEADS = 'lead creation captures explicit lastContactAt for activity truth';
const STAGE225_CONTACT_CADENCE_GRID_LEADS = 'leads list uses Contact Cadence Grid filter from activity-truth';
const STAGE226_LOST_LEAD_RESCUE_LEADS = 'lead list exposes Do odzyskania rescue view from buildLostLeadRescue';
const STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME = 'lead create stays lead-only and never creates or displays a client row';
const STAGE227F6_LEADS_CONTACT_CADENCE_COMPACT = 'Leads Contact Cadence Grid is a compact filter strip without explanatory runtime copy';
const STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE = 'LeadListCard reuses frozen ClientListCard visual shell: size, axes, ellipsis and action column; lead data semantics stay unchanged';
const STAGE231G_LEAD_CREATE_POTENTIAL_INPUT = 'Lead create form exposes Potencjał / wartość and persists dealValue';
const CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER = 'Szukaj po imieniu, firmie, e-mailu, telefonie...';
const CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER = 'Szukaj po nazwie, e-mailu, firmie...';
void STAGE117_LEADS_RIGHT_RAIL_LAYOUT_CONTRACT;
void STAGE222_R4_LEADS_CLIENTS_OPERATIONAL_BADGES;
void STAGE223R3_LAST_CONTACT_INTAKE_LEADS;
void STAGE225_CONTACT_CADENCE_GRID_LEADS;
void STAGE226_LOST_LEAD_RESCUE_LEADS;
void STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME;
void STAGE227F6_LEADS_CONTACT_CADENCE_COMPACT;
void STAGE231D0C_LEAD_LIST_CARD_CLIENT_VIEW_FREEZE;
void STAGE231G_LEAD_CREATE_POTENTIAL_INPUT;
const STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG = 'lead creation duplicate conflict dialog renders once and client matches cannot be restored from lead create';
void STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG;
const STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE = 'lead duplicate conflict preflight fails closed and requires explicit add anyway';
void STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE;
const STAGE229_FRT009_LEADS_TRASH_RUNTIME = 'FRT-009 trash renders real archived records with safe restore and no irreversible dead controls';
void STAGE229_FRT009_LEADS_TRASH_RUNTIME;
// Guard marker: \n\nTen lead ma powiązaną sprawę

type CaseRecord = {
  id: string;
  title?: string;
  status?: string;
  leadId?: string | null;
  clientId?: string | null;
};

type LeadsQuickFilter = 'all' | 'active' | 'at-risk' | 'history' | 'rescue';
type LeadsTrashDeletedPeriod = 'all' | '30' | '90' | 'older';
type LeadsTrashRetentionFilter = 'all' | 'known' | 'unknown';
type LeadCreateQuickAction = 'today' | 'tomorrow' | 'in_two_days' | 'friday' | 'next_week';


function normalizeLeadSearchValue(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLeadPrimaryContact(lead: any) {
  const phone = String(lead?.phone || '').trim();
  const email = String(lead?.email || '').trim();
  const company = String(lead?.company || '').trim();

  if (phone) return `Telefon: ${phone}`;
  if (email) return `E-mail: ${email}`;
  if (company) return `Firma: ${company}`;
  return 'Kontakt: -';
}

function getLeadOwnerLabel(lead: any) {
  return String(lead?.ownerName || lead?.owner?.name || lead?.owner?.fullName || lead?.ownerId || '').trim() || 'Nieprzypisany';
}

function getLeadInitials(lead: any, fallbackLabel: string) {
  const label = String(lead?.company || lead?.name || fallbackLabel || 'Lead').trim();
  const words = label.split(/\s+/).filter(Boolean);
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return label.slice(0, 2).toUpperCase() || 'LD';
}

function buildLeadSearchText(lead: any, linkedCase?: CaseRecord) {
  return [
    lead?.name,
    lead?.email,
    lead?.phone,
    lead?.company,
    lead?.status,
    lead?.source,
    linkedCase?.title,
    linkedCase?.status,
  ].map(normalizeLeadSearchValue).filter(Boolean).join(' ');
}

function buildLeadValueLabel(lead: any) {
  const value = Number(lead?.dealValue || lead?.value || lead?.budget || 0);
  if (!Number.isFinite(value) || value <= 0) return '';
  return value.toLocaleString('pl-PL') + ' PLN';
}

function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, _leadValueLabel: string = '') {
  // STAGE14E_LEADS_VALUE_META_DEDUP: value belongs only to the dedicated value block/pill, never to compact meta.
  void _leadValueLabel;
  const company = String(lead?.company || '').trim();
  const caseLabel = linkedCase ? 'sprawa: ' + (linkedCase.title || 'otwarta') : '';

  return [
    sourceLabel,
    company,
    caseLabel,
  ].filter(Boolean).join(' · ');
}

function sanitizeNewLeadCreatePayloadA1(input: any) {
  const payload = { ...(input || {}) };
  delete payload.clientId;
  delete payload.linkedCaseId;
  delete payload.caseId;
  delete payload.client_id;
  delete payload.linked_case_id;
  delete payload.case_id;
  delete payload.leadVisibility;
  return payload;
}

function nativeSelectClassName() {
  return 'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
}

function formatCaseStatusLabel(value?: string) {
  if (!value) return '';
  return value.replaceAll('_', ' ');
}

function getNextActionKindLabel(action: { kind?: string } | null | undefined) {
  if (!action) return '';
  return action.kind === 'event' ? 'Wydarzenie' : 'Zadanie';
}

function buildNextActionMeta(action: { title: string | null; at: string | null; kind?: string | null; status?: string } | null | undefined) {
  if (!action?.at || !action?.title) {
    return {
      title: 'Brak zaplanowanych działań',
      subtitle: '',
      overdue: false,
    };
  }

  const actionDate = parseISO(action.at);
  const overdue = isPast(actionDate);
  const dateLabel = format(actionDate, 'd MMM yyyy, HH:mm', { locale: pl });

  return {
    title: action.title,
    subtitle: `${getNextActionKindLabel(action)} · ${dateLabel} · ${String(action.status || 'todo')}`,
    overdue,
  };
}

function formatLeadTableDate(value: unknown, emptyLabel = 'Brak danych') {
  const raw = String(value || '').trim();
  if (!raw) return emptyLabel;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return emptyLabel;
  return format(date, 'd MMM yyyy', { locale: pl });
}

function formatPolishDays(days: number) {
  const absoluteDays = Math.abs(days);
  if (absoluteDays === 1) return 'dzień';
  if (absoluteDays >= 2 && absoluteDays <= 4) return 'dni';
  return 'dni';
}

function getLeadRelativeContact(value: unknown, now = new Date()) {
  const raw = String(value || '').trim();
  const date = raw ? new Date(raw) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return { label: 'Brak danych', detail: 'Brak daty kontaktu', tone: 'neutral' as const };
  }

  const days = Math.max(0, differenceInCalendarDays(startOfDay(now), startOfDay(date)));
  const label = days === 0 ? 'Dzisiaj' : `${days} ${formatPolishDays(days)} temu`;
  return {
    label,
    detail: format(date, 'dd.MM.yyyy, HH:mm'),
    tone: days >= 14 ? 'red' as const : days >= 7 ? 'amber' as const : 'blue' as const,
  };
}

function getLeadRelativeDue(value: unknown, now = new Date()) {
  const raw = String(value || '').trim();
  const date = raw ? new Date(raw) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return { label: 'Brak terminu', detail: 'Ustaw następny ruch', tone: 'amber' as const };
  }

  const days = differenceInCalendarDays(startOfDay(date), startOfDay(now));
  const label = days < 0
    ? `${Math.abs(days)} ${formatPolishDays(days)} temu`
    : days === 0
      ? 'Dzisiaj'
      : days === 1
        ? 'Jutro'
        : `${days} dni`;

  return {
    label,
    detail: format(date, 'dd.MM.yyyy'),
    tone: days < 0 ? 'red' as const : days <= 1 ? 'amber' as const : 'blue' as const,
  };
}

function buildLeadRiskReason(lead: any, nextAction: ReturnType<typeof getNearestPlannedAction>, workspace: unknown, relatedRecords: unknown[] = []) {
  const nextMove = buildNextMoveContract({
    entityType: 'lead',
    entityId: String(lead?.id || ''),
    status: lead?.status,
    nearestAction: nextAction?.at && nextAction?.title
      ? {
          when: nextAction.at,
          title: nextAction.title,
          type: nextAction.kind,
          status: nextAction.status,
        }
      : null,
  });
  const badges = getLeadOwnerRiskBadges(lead, {
    settings: readOwnerRiskSettings(workspace),
    relatedRecords,
    nextMove,
  });
  const highValue = badges.some((badge) => badge.key === 'lead-high-value');
  const silenceRisk = badges.find((badge) => badge.key.includes('contact-silence') || badge.key.includes('activity-silence'));
  const status = String(lead?.status || '').trim().toLowerCase();

  if (highValue && (nextMove.isMissing || nextMove.isOverdue)) {
    return {
      label: 'Wysoka wartość bez ruchu',
      detail: silenceRisk?.reason || nextMove.reason,
    };
  }

  if (['proposal_sent', 'waiting_response'].includes(status) && (nextMove.isMissing || nextMove.isOverdue)) {
    return {
      label: 'Po ofercie bez follow-up',
      detail: nextMove.reason,
    };
  }

  if (nextMove.isMissing) {
    return {
      label: 'Brak następnego kroku',
      detail: nextMove.reason,
    };
  }

  if (nextMove.isOverdue) {
    return {
      label: 'Następny krok po terminie',
      detail: nextMove.reason,
    };
  }

  if (silenceRisk) {
    return {
      label: silenceRisk.label,
      detail: silenceRisk.reason,
    };
  }

  if (Boolean(lead?.isAtRisk)) {
    return {
      label: 'Temat oznaczony jako zagrożony',
      detail: 'Oznaczenie ryzyka pochodzi z rekordu leada.',
    };
  }

  return {
    label: 'Wymaga uwagi',
    detail: 'Lead wymaga weryfikacji kolejnego ruchu.',
  };
}

function isLeadInTrash(lead: any) {
  // STAGE30_LEADS_TRASH_STRICT_VISIBILITY: kosz leadow nie moze lapac aktywnych rekordow po samym wyniku sprzedazy.
  const status = String(lead?.status || '').trim();
  const visibility = String(lead?.leadVisibility || '').trim();

  return visibility === 'trash' || status === 'archived';
}

type LeadHistoryOutcome = {
  label: string;
  reason: string;
  detail: string;
  tone: 'green' | 'red' | 'blue' | 'amber' | 'neutral';
};

function isLeadHistoryEntry(lead: any, linkedCase?: CaseRecord) {
  if (isLeadInTrash(lead)) return false;

  const status = String(lead?.status || '').trim().toLowerCase();
  const salesOutcome = String(lead?.salesOutcome || lead?.sales_outcome || '').trim().toLowerCase();
  const movedLead = {
    ...lead,
    linkedCaseId: lead?.linkedCaseId || linkedCase?.id,
  };

  return ['won', 'lost'].includes(status)
    || ['won', 'lost'].includes(salesOutcome)
    || isLeadMovedToService(movedLead);
}

function getLeadHistoryOutcome(lead: any, linkedCase?: CaseRecord): LeadHistoryOutcome {
  const status = String(lead?.status || '').trim().toLowerCase();
  const salesOutcome = String(lead?.salesOutcome || lead?.sales_outcome || '').trim().toLowerCase();

  if (status === 'won' || salesOutcome === 'won') {
    return {
      label: 'Wygrany',
      reason: 'Wygrana oferta',
      detail: 'Wynik pochodzi z kanonicznego statusu leada.',
      tone: 'green',
    };
  }

  if (status === 'lost' || salesOutcome === 'lost') {
    const lossReason = [
      lead?.lossReason,
      lead?.lostReason,
      lead?.loss_reason,
      lead?.lost_reason,
    ].map((value) => String(value || '').trim()).find(Boolean);

    return {
      label: 'Przegrany',
      reason: lossReason || 'Brak powodu utraty',
      detail: lossReason ? 'Powód pochodzi z rekordu leada.' : 'Rekord nie zawiera powodu utraty.',
      tone: 'red',
    };
  }

  if (isLeadMovedToService({
    ...lead,
    linkedCaseId: lead?.linkedCaseId || linkedCase?.id,
  })) {
    return {
      label: 'W obsłudze',
      reason: 'Przeniesiony do obsługi',
      detail: linkedCase ? 'Lead ma powiązaną sprawę w obsłudze.' : 'Ruch do obsługi pochodzi z rekordu leada.',
      tone: 'blue',
    };
  }

  return {
    label: getLeadStatusLabel(status),
    reason: 'Wynik zapisany na leadzie',
    detail: 'Historia korzysta z aktualnego źródła statusu.',
    tone: getLeadStatusTone(status) as LeadHistoryOutcome['tone'],
  };
}

function getLeadHistoryCloseAt(lead: any) {
  const candidates = [
    lead?.closedAt,
    lead?.closed_at,
    lead?.wonAt,
    lead?.won_at,
    lead?.lostAt,
    lead?.lost_at,
    lead?.movedToServiceAt,
    lead?.moved_to_service_at,
    lead?.caseStartedAt,
    lead?.case_started_at,
    lead?.serviceStartedAt,
    lead?.service_started_at,
  ];

  return candidates
    .map((value) => String(value || '').trim())
    .find((value) => value && !Number.isNaN(new Date(value).getTime())) || null;
}

function getLeadTrashTimestamp(lead: any) {
  const candidates = [
    lead?.closedAt,
    lead?.closed_at,
    lead?.archivedAt,
    lead?.archived_at,
    lead?.deletedAt,
    lead?.deleted_at,
    lead?.updatedAt,
    lead?.updated_at,
  ];

  return candidates
    .map((value) => String(value || '').trim())
    .find((value) => value && !Number.isNaN(new Date(value).getTime())) || null;
}

function getLeadTrashReason(lead: any) {
  const candidates = [
    lead?.deletionReason,
    lead?.deletion_reason,
    lead?.deleteReason,
    lead?.delete_reason,
    lead?.archiveReason,
    lead?.archive_reason,
    lead?.trashReason,
    lead?.trash_reason,
  ];

  return candidates.map((value) => String(value || '').trim()).find(Boolean) || 'Brak danych';
}

function getLeadTrashRetentionAt(lead: any) {
  const candidates = [
    lead?.permanentDeletionAt,
    lead?.permanent_deletion_at,
    lead?.retentionDueAt,
    lead?.retention_due_at,
    lead?.hardDeleteAt,
    lead?.hard_delete_at,
    lead?.deletionDueAt,
    lead?.deletion_due_at,
  ];

  return candidates
    .map((value) => String(value || '').trim())
    .find((value) => value && !Number.isNaN(new Date(value).getTime())) || null;
}

function getLeadTrashDeletedBy(lead: any) {
  const scalarCandidates = [
    lead?.deletedByName,
    lead?.deleted_by_name,
    lead?.archivedByName,
    lead?.archived_by_name,
    lead?.deletedById,
    lead?.deleted_by,
    lead?.archivedById,
    lead?.archived_by,
  ];
  const scalarValue = scalarCandidates
    .filter((value) => typeof value === 'string' || typeof value === 'number')
    .map((value) => String(value).trim())
    .find(Boolean);
  if (scalarValue) return scalarValue;

  const nestedCandidates = [
    lead?.deletedBy?.name,
    lead?.deleted_by?.name,
    lead?.archivedBy?.name,
    lead?.archived_by?.name,
  ];

  return nestedCandidates.map((value) => String(value || '').trim()).find(Boolean) || 'Brak danych';
}

function getLeadTrashLabel(lead: any) {
  return String(lead?.company || lead?.name || lead?.email || '').trim() || 'Lead bez nazwy';
}

function getLeadTrashAgeDays(value: string | null, now = new Date()) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.max(0, differenceInCalendarDays(startOfDay(now), startOfDay(date)));
}

function formatLeadTrashDate(value: string | null, emptyLabel = 'Brak danych') {
  if (!value) return emptyLabel;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return emptyLabel;
  return format(date, 'd MMM yyyy, HH:mm', { locale: pl });
}

function formatLeadTrashAgeLabel(days: number | null) {
  if (days === null) return 'Brak danych';
  if (days === 0) return 'Dzisiaj';
  if (days === 1) return '1 dzień';
  return `${days} dni`;
}

function getRestoreStatusForLead(lead: any, linkedCase?: CaseRecord) {
  if (linkedCase || lead?.linkedCaseId || lead?.caseId || lead?.movedToServiceAt || lead?.caseStartedAt) {
    return 'moved_to_service';
  }
  return 'new';
}

function getLeadCreateQuickActionDateTime(action: LeadCreateQuickAction, now = new Date()) {
  const target = new Date(now);
  let dayOffset = 0;
  let hour = 9;
  let minute = 0;

  if (action === 'today') {
    hour = 17;
  } else if (action === 'tomorrow') {
    dayOffset = 1;
  } else if (action === 'in_two_days') {
    dayOffset = 2;
  } else if (action === 'friday') {
    dayOffset = (5 - target.getDay() + 7) % 7;
  } else {
    dayOffset = 7;
  }

  target.setDate(target.getDate() + dayOffset);
  target.setHours(hour, minute, 0, 0);
  return toDateTimeLocalValue(target);
}

function getCreatedRecordId(record: any) {
  const nested = Array.isArray(record?.data) ? record.data[0] : record?.data;
  return String(record?.id || nested?.id || '').trim();
}

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_LEADS = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';
const STAGE220A29_LEAD_TRASH_VST_CONFIRM = 'lead trash confirmations use CloseFlow ConfirmDialog instead of native browser confirm';
void STAGE220A29_LEAD_TRASH_VST_CONFIRM;

export default function Leads() {
  const { workspace, profile, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<LeadsQuickFilter>('all');
  const [showTrash, setShowTrash] = useState(false);
  const [valueSortEnabled, setValueSortEnabled] = useState(false);
  const [cadenceFilter, setCadenceFilter] = useState<ContactCadenceBucketKey | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'at-risk'>('all');
  const [historyOutcomeFilter, setHistoryOutcomeFilter] = useState('');
  const [historyReasonFilter, setHistoryReasonFilter] = useState('');
  const [historyValueFilter, setHistoryValueFilter] = useState<'all' | 'under_5000' | '5000_20000' | 'over_20000'>('all');
  const [historyClosedPeriodFilter, setHistoryClosedPeriodFilter] = useState<'all' | '30' | '90' | '365'>('365');
  const [rescueValueFilter, setRescueValueFilter] = useState<'all' | 'under_5000' | '5000_20000' | 'over_20000'>('all');
  const [rescueOwnerFilter, setRescueOwnerFilter] = useState('');
  const [trashReasonFilter, setTrashReasonFilter] = useState('');
  const [trashDeletedPeriodFilter, setTrashDeletedPeriodFilter] = useState<LeadsTrashDeletedPeriod>('all');
  const [trashRetentionFilter, setTrashRetentionFilter] = useState<LeadsTrashRetentionFilter>('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [leadPage, setLeadPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'other',
    dealValue: '',
    company: '',
    summary: '',
    notes: '',
    status: 'new',
    isAtRisk: false,
    lastContactAt: getDefaultLastContactDateInput(),
    nextActionTitle: '',
    nextActionAt: '',
    createNextTask: false,
  });
  const leadCreateOwnerLabel = String(
    profile?.fullName
      || profile?.full_name
      || profile?.email
      || workspace?.ownerEmail
      || 'Nieprzypisany',
  ).trim();

  const CLOSEFLOW_A2_LEAD_DUPLICATE_WARNING_BEFORE_WRITE = 'lead duplicate warning before write';
  const createLeadSubmitLockRef = useRef(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);
  const [leadArchiveConfirmStage220A29, setLeadArchiveConfirmStage220A29] = useState<{ lead: any; linkedCase?: CaseRecord | null } | null>(null);
  const [leadRestoreConfirmStage220A29, setLeadRestoreConfirmStage220A29] = useState<{ lead: any; linkedCase?: CaseRecord | null } | null>(null);
  const [conflictArchiveConfirmStage220A29, setConflictArchiveConfirmStage220A29] = useState<EntityConflictCandidate | null>(null);
  const [leadConflictOpen, setLeadConflictOpen] = useState(false);
  const [leadConflictCandidates, setLeadConflictCandidates] = useState<EntityConflictCandidate[]>([]);
  const [leadConflictPendingInput, setLeadConflictPendingInput] = useState<any | null>(null);

  useEffect(() => subscribeGlobalQuickAction((target) => {
    if (target === 'lead') setIsNewLeadOpen(true);
  }), []);

  useEffect(() => {
    const quickActionTarget = consumeGlobalQuickAction();
    if (quickActionTarget === 'lead') {
      setIsNewLeadOpen(true);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('quick') !== 'lead') return;
    setIsNewLeadOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('quick') !== 'active') return;
    setShowTrash(false);
    setValueSortEnabled(false);
    setCadenceFilter('all');
    setStatusFilter('');
    setSourceFilter('');
    setRiskFilter('all');
    setShowMoreFilters(false);
    setQuickFilter('active');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('quick') !== 'at-risk') return;
    setShowTrash(false);
    setValueSortEnabled(false);
    setCadenceFilter('all');
    setStatusFilter('');
    setSourceFilter('');
    setRiskFilter('at-risk');
    setShowMoreFilters(false);
    setQuickFilter('at-risk');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('quick') !== 'history') return;
    setShowTrash(false);
    setValueSortEnabled(false);
    setCadenceFilter('all');
    setStatusFilter('');
    setSourceFilter('');
    setRiskFilter('all');
    setShowMoreFilters(false);
    setQuickFilter('history');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('quick') !== 'rescue') return;
    setShowTrash(false);
    setValueSortEnabled(false);
    setCadenceFilter('all');
    setStatusFilter('');
    setSourceFilter('');
    setRiskFilter('all');
    setRescueValueFilter('all');
    setRescueOwnerFilter('');
    setShowMoreFilters(false);
    setQuickFilter('rescue');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('quick') !== 'trash') return;
    setShowTrash(true);
    setValueSortEnabled(false);
    setQuickFilter('all');
    setRiskFilter('all');
    setTrashReasonFilter('');
    setTrashDeletedPeriodFilter('all');
    setTrashRetentionFilter('all');
    setShowMoreFilters(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quick');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const loadLeads = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const [leadRows, caseRows, taskRows, eventRows, clientRows] = await Promise.all([
        fetchLeadsFromSupabase({ includeArchived: true }),
        fetchCasesFromSupabase().catch(() => []),
        fetchTasksFromSupabase().catch(() => []),
        fetchEventsFromSupabase().catch(() => []),
        fetchClientsFromSupabase().catch(() => []),
      ]);
      setLeads(leadRows as any[]);
      setCases(caseRows as CaseRecord[]);
      setTasks(taskRows as any[]);
      setEvents(eventRows as any[]);
      setClients(clientRows as any[]);
    } catch (error: any) {
      const message = error?.message || 'Nie udało się pobrać leadów';
      setLoadError(message);
      toast.error(`Błąd odczytu leadów: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => {
    const allowDevPreview = import.meta.env.DEV && !isSupabaseConfigured();
    if ((!isSupabaseConfigured() && !allowDevPreview) || workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void loadLeads();
  }, [loadLeads, workspace?.id, workspaceLoading]);

  const casesByLeadId = useMemo(() => {
    const map = new Map<string, CaseRecord>();
    for (const caseRecord of cases) {
      const leadId = String(caseRecord.leadId || '').trim();
      if (leadId && !map.has(leadId)) {
        map.set(leadId, caseRecord);
      }
    }
    return map;
  }, [cases]);

  const casesByClientId = useMemo(() => {
    const map = new Map<string, CaseRecord>();
    for (const caseRecord of cases) {
      const clientId = String(caseRecord.clientId || '').trim();
      if (clientId && !map.has(clientId)) {
        map.set(clientId, caseRecord);
      }
    }
    return map;
  }, [cases]);

  const resolveLinkedCaseForLead = useCallback((lead: any) => {
    const leadId = String(lead?.id || '').trim();
    const clientId = String(lead?.clientId || '').trim();

    return casesByLeadId.get(leadId) || (clientId ? casesByClientId.get(clientId) : undefined);
  }, [casesByClientId, casesByLeadId]);

  const nextActionByLeadId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getNearestPlannedAction>>();

    for (const lead of leads) {
      const leadId = String(lead.id || '');
      if (!leadId) continue;
      const linkedCase = resolveLinkedCaseForLead(lead);
      map.set(leadId, getNearestPlannedAction({
        leadId,
        caseId: linkedCase?.id ? String(linkedCase.id) : undefined,
        tasks,
        events,
      }));
    }

    return map;
  }, [events, leads, resolveLinkedCaseForLead, tasks]);

  const resetNewLeadForm = () => {
    setNewLead({
      name: '',
      email: '',
      phone: '',
      source: 'other',
      dealValue: '',
      company: '',
      summary: '',
      notes: '',
      status: 'new',
      isAtRisk: false,
      lastContactAt: getDefaultLastContactDateInput(),
      nextActionTitle: '',
      nextActionAt: '',
      createNextTask: false,
    });
  };

  const handleNewLeadOpenChange = (open: boolean) => {
    setIsNewLeadOpen(open);
    if (!open) resetNewLeadForm();
  };

  const createLeadFromPreparedInput = async (preparedLead: any, options?: { forceDuplicate?: boolean }) => {
    // A1_LEAD_CREATE_VISIBILITY_FINALIZER: a newly created lead must not inherit stale client/case relations and must stay visible after save.
    const sanitizedPreparedLead = { ...preparedLead };
    delete sanitizedPreparedLead.clientId;
    delete sanitizedPreparedLead.client_id;
    delete sanitizedPreparedLead.linkedCaseId;
    delete sanitizedPreparedLead.linked_case_id;
    delete sanitizedPreparedLead.caseId;
    delete sanitizedPreparedLead.case_id;
    const shouldCreateNextTask = Boolean(sanitizedPreparedLead.createNextTask);
    delete sanitizedPreparedLead.createNextTask;
    // CLOSEFLOW_A2_LEAD_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP
    const workspaceId = requireWorkspaceId(workspace);
    const createdLead = await insertLeadToSupabase({ ...sanitizedPreparedLead, allowDuplicate: Boolean(options?.forceDuplicate), ownerId: workspace?.ownerId, workspaceId });
    let nextTaskCreated = false;
    let nextTaskCreationFailed = false;
    if (shouldCreateNextTask) {
      const createdLeadId = getCreatedRecordId(createdLead);
      const nextActionTitle = String(sanitizedPreparedLead.nextActionTitle || '').trim();
      const nextActionAt = String(sanitizedPreparedLead.nextActionAt || '').trim();
      if (createdLeadId && nextActionTitle && nextActionAt) {
        try {
          const taskType = TASK_TYPES.find((option) => option.label === nextActionTitle)?.value || 'follow_up';
          await insertTaskToSupabase({
            title: nextActionTitle,
            type: taskType,
            date: nextActionAt.slice(0, 10),
            scheduledAt: nextActionAt,
            dueAt: nextActionAt,
            priority: sanitizedPreparedLead.isAtRisk ? 'high' : 'medium',
            status: 'todo',
            leadId: createdLeadId,
            ownerId: workspace?.ownerId,
            workspaceId,
          });
          nextTaskCreated = true;
        } catch {
          nextTaskCreationFailed = true;
        }
      } else {
        nextTaskCreationFailed = true;
      }
    }
    setSearchQuery('');
    setQuickFilter('all');
    setShowTrash(false);
    setValueSortEnabled(false);
    setCadenceFilter('all');
    await loadLeads();
    if (nextTaskCreated) {
      toast.success('Lead i zadanie dodane');
    } else if (nextTaskCreationFailed) {
      toast.warning('Lead dodany, ale zadanie nie zostało utworzone.');
    } else {
      toast.success('Lead dodany');
    }
    setIsNewLeadOpen(false);
    resetNewLeadForm();
  };

  const restoreConflictCandidate = async (candidate: EntityConflictCandidate) => {
    if (candidate.entityType === 'client') {
      toast.info('Znaleziono podobnego klienta. To nie jest ten sam rekord. Otwórz klienta albo utwórz osobnego leada.');
      return;
    }
    if (!candidate.canRestore) { toast.info('Ten rekord ma historię. Najpierw go otwórz i zdecyduj, co zrobić.'); return; }
    try {
      setLeadSubmitting(true);
      await updateLeadInSupabase({ id: candidate.id, status: 'new', leadVisibility: 'active', salesOutcome: 'open', closedAt: null });
      toast.success('Lead przywrócony');
      setLeadConflictOpen(false);
      await loadLeads();
    } catch (error: any) { toast.error('Nie udało się przywrócić rekordu: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setLeadSubmitting(false); }
  };


  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (createLeadSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    const hasLeadIdentity = Boolean(newLead.name.trim() || newLead.phone.trim() || newLead.email.trim() || newLead.company.trim());
    const hasContactOrNeed = Boolean(newLead.phone.trim() || newLead.email.trim() || newLead.summary.trim() || newLead.notes.trim());
    if (!hasLeadIdentity) return toast.error('Podaj nazwę albo kontakt.');
    if (!hasContactOrNeed) return toast.error('Podaj telefon, e-mail albo opis potrzeby.');
    const hasNextActionTitle = Boolean(newLead.nextActionTitle.trim());
    const hasNextActionAt = Boolean(newLead.nextActionAt.trim());
    if (hasNextActionTitle !== hasNextActionAt) return toast.error('Wybierz następny krok i termin.');
    if (newLead.createNextTask && (!hasNextActionTitle || !hasNextActionAt)) return toast.error('Wybierz następny krok i termin zadania.');
    const lastContactError = getLastContactDateInputError(newLead.lastContactAt);
    if (lastContactError) return toast.error(lastContactError);
    createLeadSubmitLockRef.current = true;
    setLeadSubmitting(true);
    const preparedLead = { ...newLead, name: newLead.name.trim() || newLead.phone.trim() || newLead.email.trim() || 'Lead bez nazwy', email: newLead.email.trim(), phone: newLead.phone.trim(), company: newLead.company.trim(), dealValue: Number(newLead.dealValue) || 0, lastContactAt: dateInputToNoonIso(newLead.lastContactAt) };
    try {
      let conflicts: any;
      try {
        conflicts = await findEntityConflictsInSupabase({ targetType: 'lead', name: preparedLead.name, email: preparedLead.email, phone: preparedLead.phone, company: preparedLead.company, workspaceId });
      } catch (error: any) {
        toast.error('Nie udało się sprawdzić duplikatów. Zapis leada zatrzymany, żeby nie dodać konfliktu po cichu.');
        return;
      }
      const candidates = Array.isArray(conflicts.candidates)
        ? (conflicts.candidates as EntityConflictCandidate[]).map((candidate) => candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate)
        : [];
      if (candidates.length) {
        toast.info('Znaleziono podobny rekord. Zapis leada wymaga potwierdzenia albo kliknięcia „Dodaj mimo to”.');
        setLeadConflictCandidates(candidates);
        setLeadConflictPendingInput(preparedLead);
        setIsNewLeadOpen(false);
        setLeadConflictOpen(true);
        return;
      }
      await createLeadFromPreparedInput(preparedLead);
    } catch (error: any) { toast.error(`Błąd zapisu leada: ${error.message}`); }
    finally { createLeadSubmitLockRef.current = false; setLeadSubmitting(false); }
  };

  const handleCreateLeadAnyway = async () => {
    if (!leadConflictPendingInput || leadSubmitting) return;
    try { setLeadSubmitting(true); await createLeadFromPreparedInput(leadConflictPendingInput, { forceDuplicate: true }); setLeadConflictOpen(false); setLeadConflictPendingInput(null); setLeadConflictCandidates([]); }
    catch (error: any) { toast.error('Błąd zapisu leada: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setLeadSubmitting(false); }
  };

  const handleShowConflictCandidate = (candidate: EntityConflictCandidate) => {
    const safeId = encodeURIComponent(String(candidate.id || ''));
    if (!safeId) return;
    window.location.href = candidate.entityType === 'client' ? '/clients/' + safeId : '/leads/' + safeId;
  };

  const executeArchiveConflictCandidateStage220A29 = async (candidate: EntityConflictCandidate) => {
    try {
      setLeadSubmitting(true);
      if (candidate.entityType === 'client') {
        await updateClientInSupabase({ id: candidate.id, archivedAt: new Date().toISOString() });
      } else {
        await updateLeadInSupabase({
          id: candidate.id,
          status: 'archived',
          leadVisibility: 'trash',
          salesOutcome: 'archived',
          closedAt: new Date().toISOString(),
        });
      }
      setLeadConflictCandidates((current) => current.filter((item) => !(item.id === candidate.id && item.entityType === candidate.entityType)));
      setConflictArchiveConfirmStage220A29(null);
      toast.success('Rekord przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('Nie udało się przenieść rekordu do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleArchiveConflictCandidate = (candidate: EntityConflictCandidate) => {
    setConflictArchiveConfirmStage220A29(candidate);
  };

  const executeArchiveLeadStage220A29 = async (leadToArchive: any) => {
    const leadId = String(leadToArchive?.id || '');
    if (!leadId) return;

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: 'archived',
        leadVisibility: 'trash',
        salesOutcome: 'archived',
        closedAt: new Date().toISOString(),
      });
      setLeadArchiveConfirmStage220A29(null);
      toast.success('Lead przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('Błąd przenoszenia leada do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleArchiveLead = (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    setLeadArchiveConfirmStage220A29({
      lead,
      linkedCase: resolveLinkedCaseForLead(lead) || null,
    });
  };

  const executeRestoreLeadStage220A29 = async (leadToRestore: any) => {
    const leadId = String(leadToRestore?.id || '');
    if (!leadId) return;

    const linkedCase = resolveLinkedCaseForLead(leadToRestore);
    const nextStatus = getRestoreStatusForLead(leadToRestore, linkedCase);
    const nextVisibility = nextStatus === 'moved_to_service' ? 'archived' : 'active';
    const nextOutcome = nextStatus === 'moved_to_service' ? 'moved_to_service' : 'open';

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: nextStatus,
        leadVisibility: nextVisibility,
        salesOutcome: nextOutcome,
        closedAt: null,
      });
      setLeadRestoreConfirmStage220A29(null);
      toast.success('Lead przywrócony');
      await loadLeads();
    } catch (error: any) {
      toast.error('Błąd przywracania leada: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleRestoreLead = (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    const linkedCase = resolveLinkedCaseForLead(lead);
    setLeadRestoreConfirmStage220A29({ lead, linkedCase: linkedCase || null });
  };

  const activeLeads = useMemo(
    () => leads.filter((lead) => !isLeadInTrash(lead) && !isLeadMovedToService(lead)),
    [leads],
  );

  const historyLeads = useMemo(
    () => leads.filter((lead) => isLeadHistoryEntry(lead, resolveLinkedCaseForLead(lead))),
    [leads, resolveLinkedCaseForLead],
  );

  const historyReasonOptions = useMemo(
    () => Array.from(new Set(historyLeads.map((lead) => getLeadHistoryOutcome(lead, resolveLinkedCaseForLead(lead)).reason))).sort((a, b) => a.localeCompare(b, 'pl')),
    [historyLeads, resolveLinkedCaseForLead],
  );

  const serviceHistoryLeads = useMemo(
    () =>
      historyLeads.filter((lead) => {
        const linkedCase = resolveLinkedCaseForLead(lead);
        return isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      }),
    [historyLeads, resolveLinkedCaseForLead],
  );

  const trashLeads = useMemo(() => leads.filter((lead) => isLeadInTrash(lead)), [leads]);

  const trashReasonOptions = useMemo(
    () => Array.from(new Set(trashLeads.map((lead) => getLeadTrashReason(lead)))).sort((a, b) => a.localeCompare(b, 'pl')),
    [trashLeads],
  );

  const filteredTrashLeads = useMemo(() => {
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);

    return [...trashLeads]
      .filter((lead) => {
        const deletedAt = getLeadTrashTimestamp(lead);
        const retentionAt = getLeadTrashRetentionAt(lead);
        const deletedBy = getLeadTrashDeletedBy(lead);
        const reason = getLeadTrashReason(lead);
        const ageDays = getLeadTrashAgeDays(deletedAt);
        const searchableText = normalizeLeadSearchValue([
          buildLeadSearchText(lead, resolveLinkedCaseForLead(lead)),
          getLeadTrashLabel(lead),
          reason,
          deletedBy,
        ].join(' '));
        const matchesDeletedPeriod = trashDeletedPeriodFilter === 'all'
          || (ageDays !== null && trashDeletedPeriodFilter === '30' && ageDays <= 30)
          || (ageDays !== null && trashDeletedPeriodFilter === '90' && ageDays > 30 && ageDays <= 90)
          || (ageDays !== null && trashDeletedPeriodFilter === 'older' && ageDays > 90);
        const matchesRetention = trashRetentionFilter === 'all'
          || (trashRetentionFilter === 'known' && Boolean(retentionAt))
          || (trashRetentionFilter === 'unknown' && !retentionAt);

        return (!normalizedQuery || searchableText.includes(normalizedQuery))
          && (!trashReasonFilter || reason === trashReasonFilter)
          && matchesDeletedPeriod
          && matchesRetention;
      })
      .sort((a, b) => {
        const aTimestamp = getLeadTrashTimestamp(a);
        const bTimestamp = getLeadTrashTimestamp(b);
        return (bTimestamp ? new Date(bTimestamp).getTime() : 0) - (aTimestamp ? new Date(aTimestamp).getTime() : 0);
      });
  }, [resolveLinkedCaseForLead, searchQuery, trashDeletedPeriodFilter, trashLeads, trashReasonFilter, trashRetentionFilter]);

  // RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS
  const relationValueEntries = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients, cases }),
    [activeLeads, clients, cases],
  );

  // CLOSEFLOW_FB2_RIGHT_RAIL_LEADS_ONLY: right rail pokazuje tylko aktywne leady, bez klientów i spraw.
  const mostValuableRelations = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients: [], cases: [] }).slice(0, 5),
    [activeLeads],
  );

  const relationFunnelValue = useMemo(
    () => buildRelationFunnelValue({ leads: activeLeads, clients }),
    [activeLeads, clients],
  );

  const relatedRecordsByLeadId = useMemo(() => {
    const map = new Map<string, unknown[]>();
    const touch = (leadId: string) => {
      if (!map.has(leadId)) map.set(leadId, []);
      return map.get(leadId)!;
    };
    const addRelated = (row: Record<string, unknown>) => {
      const leadId = String(row.leadId || row.lead_id || '').trim();
      if (leadId) touch(leadId).push(row);
    };
    for (const row of tasks as Record<string, unknown>[]) addRelated(row);
    for (const row of events as Record<string, unknown>[]) addRelated(row);
    return map;
  }, [events, tasks]);

  const contactCadenceGrid = useMemo(
    () => buildContactCadenceGrid({
      entityType: 'lead',
      records: activeLeads,
      relatedRecordsById: relatedRecordsByLeadId,
      settings: workspace,
    }),
    [activeLeads, relatedRecordsByLeadId, workspace],
  );

  const contactCadenceBuckets = useMemo(() => buildContactCadenceBuckets(workspace), [workspace]);

  const lostLeadRescueSummary = useMemo(
    () => buildLostLeadRescue({
      leads: activeLeads,
      relatedRecordsById: relatedRecordsByLeadId,
    }),
    [activeLeads, relatedRecordsByLeadId],
  );

  const rescueView = !showTrash && quickFilter === 'rescue';
  const activeLeadById = useMemo(
    () => new Map(activeLeads.map((lead) => [String(lead.id || ''), lead])),
    [activeLeads],
  );

  const rescueOwnerOptions = useMemo(
    () => Array.from(new Set(lostLeadRescueSummary.rows.map((row) => getLeadOwnerLabel(activeLeadById.get(row.leadId))))).sort((left, right) => left.localeCompare(right, 'pl')),
    [activeLeadById, lostLeadRescueSummary.rows],
  );

  const rescuePotential = useMemo(
    () => lostLeadRescueSummary.rows.reduce((total, row) => total + (row.valueAmount || 0), 0),
    [lostLeadRescueSummary.rows],
  );

  const rescueReadyCount = useMemo(
    () => lostLeadRescueSummary.rows.filter((row) => row.hasNextMove).length,
    [lostLeadRescueSummary.rows],
  );

  const rescueAttentionCount = useMemo(
    () => lostLeadRescueSummary.rows.filter((row) => row.contactSilentDays === null || row.contactSilentDays >= 7).length,
    [lostLeadRescueSummary.rows],
  );

  const filteredRescueRows = useMemo(() => {
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    const activeCadenceIds = cadenceFilter === 'all'
      ? null
      : new Set((contactCadenceGrid.buckets[cadenceFilter] || []).map((row) => row.entityId));

    return lostLeadRescueSummary.rows.filter((row) => {
      const lead = activeLeadById.get(row.leadId);
      const linkedCase = lead ? resolveLinkedCaseForLead(lead) : undefined;
      const ownerLabel = getLeadOwnerLabel(lead);
      const searchableText = normalizeLeadSearchValue([
        buildLeadSearchText(lead, linkedCase),
        row.title,
        row.subtitle,
        row.reasonLabel,
        row.reasonDetail,
        row.nextMoveTitle,
      ].filter(Boolean).join(' '));
      const value = row.valueAmount || 0;
      const matchesValue = rescueValueFilter === 'all'
        || (rescueValueFilter === 'under_5000' && value < 5000)
        || (rescueValueFilter === '5000_20000' && value >= 5000 && value <= 20000)
        || (rescueValueFilter === 'over_20000' && value > 20000);
      const matchesRisk = riskFilter === 'all' || row.severity !== 'medium' || Boolean(lead?.isAtRisk);

      return (!normalizedQuery || searchableText.includes(normalizedQuery))
        && (!sourceFilter || String(lead?.source || '') === sourceFilter)
        && matchesRisk
        && matchesValue
        && (!rescueOwnerFilter || ownerLabel === rescueOwnerFilter)
        && (!activeCadenceIds || activeCadenceIds.has(row.leadId));
    });
  }, [activeLeadById, cadenceFilter, contactCadenceGrid, lostLeadRescueSummary.rows, resolveLinkedCaseForLead, rescueOwnerFilter, rescueValueFilter, riskFilter, searchQuery, sourceFilter]);

  const filteredLeads = useMemo(() => {
    // STAGE31_LEADS_THIN_NUMBERED_LIST: wyszukiwarka dziala po nazwie, telefonie, mailu, firmie, zrodle i sprawie.
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    const historyView = !showTrash && quickFilter === 'history';
    const sourceLeads = showTrash ? trashLeads : historyView ? historyLeads : activeLeads;
    if (showTrash) return filteredTrashLeads;
    const activeCadenceIds = cadenceFilter === 'all'
      ? null
      : new Set((contactCadenceGrid.buckets[cadenceFilter] || []).map((row) => row.entityId));
    const rescueLeadIds = quickFilter === 'rescue'
      ? new Set(lostLeadRescueSummary.rows.map((row) => row.leadId))
      : null;

    const results = sourceLeads.filter((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const movedToService = isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const activeLead = isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const historyEntry = isLeadHistoryEntry(lead, linkedCase);
      const historyOutcome = getLeadHistoryOutcome(lead, linkedCase);
      const historyCloseAt = getLeadHistoryCloseAt(lead);
      const historyValue = Number(lead.dealValue || lead.value || lead.budget || 0);
      const matchesSearch = !normalizedQuery || buildLeadSearchText(lead, linkedCase).includes(normalizedQuery);
      const matchesStatus = !statusFilter || String(lead.status || '') === statusFilter;
      const matchesSource = !sourceFilter || String(lead.source || '') === sourceFilter;
      const matchesRisk = riskFilter === 'all' || Boolean(lead.isAtRisk);
      const matchesHistoryOutcome = !historyOutcomeFilter
        || (historyOutcomeFilter === 'moved_to_service' ? movedToService : String(lead.status || '').toLowerCase() === historyOutcomeFilter || String(lead.salesOutcome || lead.sales_outcome || '').toLowerCase() === historyOutcomeFilter);
      const matchesHistoryReason = !historyReasonFilter || historyOutcome.reason === historyReasonFilter;
      const matchesHistoryValue = historyValueFilter === 'all'
        || (historyValueFilter === 'under_5000' && historyValue < 5000)
        || (historyValueFilter === '5000_20000' && historyValue >= 5000 && historyValue <= 20000)
        || (historyValueFilter === 'over_20000' && historyValue > 20000);
      const matchesHistoryClosedPeriod = historyClosedPeriodFilter === 'all'
        || !historyCloseAt
        || differenceInCalendarDays(startOfDay(new Date()), startOfDay(new Date(historyCloseAt))) <= Number(historyClosedPeriodFilter);

      const matchesQuickFilter =
        showTrash
        || quickFilter === 'all'
        || (quickFilter === 'active' && activeLead)
        || (quickFilter === 'at-risk' && Boolean(lead.isAtRisk))
        || (quickFilter === 'rescue' && Boolean(rescueLeadIds?.has(String(lead.id || ''))))
        || (quickFilter === 'history' && historyEntry);

      const matchesCadence = showTrash || historyView || quickFilter === 'rescue' || !activeCadenceIds || activeCadenceIds.has(String(lead.id || ''));

      return matchesSearch
        && matchesQuickFilter
        && matchesCadence
        && matchesStatus
        && matchesSource
        && matchesRisk
        && (!historyView || (matchesHistoryOutcome && matchesHistoryReason && matchesHistoryValue && matchesHistoryClosedPeriod));
    });

    if (valueSortEnabled) {
      return [...results].sort((a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0));
    }

    return results;
  }, [activeLeads, cadenceFilter, contactCadenceGrid, filteredTrashLeads, historyClosedPeriodFilter, historyLeads, historyOutcomeFilter, historyReasonFilter, historyValueFilter, lostLeadRescueSummary, quickFilter, resolveLinkedCaseForLead, riskFilter, searchQuery, showTrash, sourceFilter, statusFilter, trashLeads, valueSortEnabled]);

  const leadPageSize = 20;
  const leadPageCount = Math.max(1, Math.ceil((showTrash ? filteredTrashLeads.length : rescueView ? filteredRescueRows.length : filteredLeads.length) / leadPageSize));
  const pagedLeads = useMemo(
    () => filteredLeads.slice((leadPage - 1) * leadPageSize, leadPage * leadPageSize),
    [filteredLeads, leadPage],
  );
  const pagedRescueRows = useMemo(
    () => filteredRescueRows.slice((leadPage - 1) * leadPageSize, leadPage * leadPageSize),
    [filteredRescueRows, leadPage],
  );
  const pagedTrashLeads = useMemo(
    () => filteredTrashLeads.slice((leadPage - 1) * leadPageSize, leadPage * leadPageSize),
    [filteredTrashLeads, leadPage],
  );

  useEffect(() => {
    setLeadPage((currentPage) => Math.min(currentPage, leadPageCount));
  }, [leadPageCount]);

  useEffect(() => {
    setLeadPage(1);
  }, [cadenceFilter, historyClosedPeriodFilter, historyOutcomeFilter, historyReasonFilter, historyValueFilter, quickFilter, rescueOwnerFilter, rescueValueFilter, riskFilter, searchQuery, showTrash, sourceFilter, statusFilter, trashDeletedPeriodFilter, trashReasonFilter, trashRetentionFilter, valueSortEnabled]);

  const leadSearchSuggestions = useMemo(() => {
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    if (!normalizedQuery) return [];

    return filteredLeads.slice(0, 6).map((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const sourceLabel = getLeadSourceLabel(lead.source);
      const leadValueLabel = buildLeadValueLabel(lead);
      return {
        id: String(lead.id || ''),
        name: String(lead.name || 'Lead bez nazwy'),
        meta: buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel),
      };
    }).filter((lead) => lead.id);
  }, [filteredLeads, resolveLinkedCaseForLead, searchQuery]);

  const stats = {
    total: activeLeads.length,
    active: activeLeads.filter((lead) => isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || resolveLinkedCaseForLead(lead)?.id })).length,
    value: relationFunnelValue,
    atRisk: activeLeads.filter((lead) => Boolean(lead.isAtRisk)).length,
    rescue: lostLeadRescueSummary.total,
    linkedToCase: serviceHistoryLeads.length,
    history: historyLeads.length,
    trash: trashLeads.length,
  };

  const trashSummary = useMemo(() => {
    const datedLeads = trashLeads
      .map((lead) => ({ lead, timestamp: getLeadTrashTimestamp(lead) }))
      .filter((entry): entry is { lead: any; timestamp: string } => Boolean(entry.timestamp))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const oldest = datedLeads[0] || null;
    const latest = datedLeads[datedLeads.length - 1] || null;

    return {
      count: trashLeads.length,
      oldestAge: getLeadTrashAgeDays(oldest?.timestamp || null),
      oldestDate: oldest?.timestamp || null,
      latestDate: latest?.timestamp || null,
      latestLabel: latest ? getLeadTrashLabel(latest.lead) : null,
      restoredThisMonth: null as number | null,
    };
  }, [trashLeads]);

  const activeView = !showTrash && quickFilter === 'active';
  const riskView = !showTrash && quickFilter === 'at-risk';
  const historyView = !showTrash && quickFilter === 'history';

  const selectQuickFilter = (filter: LeadsQuickFilter) => {
    setShowTrash(false);
    setValueSortEnabled(false);
    setCadenceFilter('all');
    setRescueValueFilter('all');
    setRescueOwnerFilter('');
    setQuickFilter(filter);
    setRiskFilter(filter === 'at-risk' ? 'at-risk' : 'all');
    if (filter === 'history') {
      setStatusFilter('');
      setSourceFilter('');
    }
    if (filter !== 'history') {
      setHistoryOutcomeFilter('');
      setHistoryReasonFilter('');
      setHistoryValueFilter('all');
      setHistoryClosedPeriodFilter('365');
    }
  };

  const toggleQuickFilter = (filter: LeadsQuickFilter) => {
    const nextFilter = quickFilter === filter ? 'all' : filter;
    selectQuickFilter(nextFilter);
  };

  const toggleValueSorting = () => {
    setShowTrash(false);
    setQuickFilter('all');
    setRiskFilter('all');
    setValueSortEnabled((prev) => !prev);
  };

  const toggleTrashView = () => {
    setValueSortEnabled(false);
    setQuickFilter('all');
    setRiskFilter('all');
    setTrashReasonFilter('');
    setTrashDeletedPeriodFilter('all');
    setTrashRetentionFilter('all');
    setShowMoreFilters(false);
    setShowTrash((current) => !current);
  };

  const resetLeadFilters = () => {
    const wasTrash = showTrash;
    setSearchQuery('');
    if (wasTrash) {
      setQuickFilter('all');
    } else {
      setQuickFilter(rescueView ? 'rescue' : 'all');
    }
    setShowTrash(wasTrash);
    setValueSortEnabled(false);
    setCadenceFilter('all');
    setStatusFilter('');
    setSourceFilter('');
    setRiskFilter('all');
    setHistoryOutcomeFilter('');
    setHistoryReasonFilter('');
    setHistoryValueFilter('all');
    setHistoryClosedPeriodFilter('365');
    setRescueValueFilter('all');
    setRescueOwnerFilter('');
    setTrashReasonFilter('');
    setTrashDeletedPeriodFilter('all');
    setTrashRetentionFilter('all');
    setShowMoreFilters(false);
  };

  const handleExportTrashCsv = () => {
    const escapeCsvValue = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = [
      ['Nazwa leada', 'E-mail', 'Usunięto', 'Powód', 'Termin trwałego usunięcia', 'Usunięte przez'],
      ...filteredTrashLeads.map((lead) => [
        getLeadTrashLabel(lead),
        String(lead?.email || '').trim() || 'Brak danych',
        formatLeadTrashDate(getLeadTrashTimestamp(lead)),
        getLeadTrashReason(lead),
        formatLeadTrashDate(getLeadTrashRetentionAt(lead)),
        getLeadTrashDeletedBy(lead),
      ]),
    ];
    const csv = `\ufeff${rows.map((row) => row.map(escapeCsvValue).join(';')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'closeflow-leady-kosz.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success(`Eksport gotowy: ${filteredTrashLeads.length} ${filteredTrashLeads.length === 1 ? 'lead' : 'leadów'}.`);
  };

  return (
    <Layout>
      <div className="cf-html-view main-leads-html" data-visual-stage25-leads-full-jsx="true" data-leads-real-view="true">
        <CloseFlowPageHeaderV2
          pageKey="leads"
          title={showTrash ? (
            <span className="leads-trash-header-title">
              <span>Kosz</span>
            </span>
          ) : historyView ? (
            <span className="leads-history-header-title">
              <span>Leady – Historia</span>
              <span className="cf-status-pill leads-history-header-count" data-cf-status-tone="blue">{stats.history}</span>
            </span>
          ) : riskView ? (
            <span className="leads-risk-header-title">
              <span>Leady – Zagrożone</span>
              <span className="cf-status-pill leads-risk-header-count" data-cf-status-tone="red">{stats.atRisk}</span>
            </span>
          ) : undefined}
          description={showTrash ? 'Zarządzaj usuniętymi leadami. Możesz je przywrócić przed trwałym usunięciem.' : historyView ? 'Zamknięte, wygrane i przeniesione leady z zachowanym kontekstem.' : riskView ? 'Leady wymagające natychmiastowej uwagi i reakcji.' : rescueView ? 'Zarządzaj procesem sprzedaży i domykaj kolejne kroki.' : undefined}
          actions={
            <>
              <div className="head-actions">
                          <button
                            type="button"
                            className={`btn primary leads-create-action${showTrash ? ' leads-trash-hidden-action' : ''}`}
                            onClick={() => setIsNewLeadOpen(true)}
                            data-frt004-leads-create="true"
                            aria-label="Dodaj leada"
                          >
                            <Plus className="h-4 w-4" />
                            Dodaj leada
                          </button>
                          <Link to="/ai-drafts" className={`btn soft-blue leads-secondary-header-action${showTrash ? ' leads-trash-hidden-action' : ''}`} data-stage26-leads-head-ai="true" data-cf-header-action="ai" data-frt004-secondary-header-action="ai">
                            <EntityIcon entity="ai" className="h-4 w-4" />
                            Zapytaj AI
                          </Link>
                          {showTrash ? (
                            <button
                              type="button"
                              className="btn soft-blue leads-secondary-header-action"
                              onClick={handleExportTrashCsv}
                              data-frt009-trash-export="true"
                            >
                              Eksportuj CSV
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="btn leads-secondary-header-action"
                            onClick={toggleTrashView}
                            data-frt004-secondary-header-action="trash"
                          >
                            {showTrash ? <RotateCcw className="h-4 w-4" /> : <DeleteActionIcon className="h-4 w-4" />}
                            {showTrash ? 'Pokaż aktywne' : 'Kosz'}
                            <span className="pill">{showTrash ? stats.total : stats.trash}</span>
                          </button>

                          <Dialog open={isNewLeadOpen} onOpenChange={handleNewLeadOpenChange}>
                            <DialogContent
                              className="lead-form-vnext-content forteca-frt-011-lead-add-content"
                              data-lead-form-stage20="true"
                              data-forteca-frt-011-lead-add="true"
                              aria-describedby="lead-form-stage20-description"
                            >
                              <DialogHeader className="lead-form-vnext-header forteca-frt-011-header">
                                <div>

                                  <DialogTitle>Dodaj leada</DialogTitle>
                                  <p id="lead-form-stage20-description">Uzupełnij dane kontaktu i zaplanuj kolejny krok.</p>
                                </div>
                              </DialogHeader>

                              <form onSubmit={handleCreateLead} className="lead-form-vnext forteca-frt-011-form" data-lead-form-visual-rebuild="LEAD_FORM_VISUAL_REBUILD_STAGE20" data-forteca-frt-011-form="true">
                                <section className="lead-form-section lead-form-primary-section forteca-frt-011-section" data-forteca-frt-011-basic-data="true">
                                  <div className="lead-form-section-head forteca-frt-011-section-head">
                                    <h3>Dane podstawowe</h3>
                                  </div>

                                  <div className="lead-form-grid forteca-frt-011-primary-grid">
                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-summary">Nazwa leada <span aria-hidden="true">*</span></Label>
                                      <Input
                                        id="forteca-frt-011-lead-summary"
                                        value={newLead.summary}
                                        onChange={(event) => setNewLead((current) => ({ ...current, summary: event.target.value }))}
                                        placeholder="np. Wdrożenie systemu"
                                      />
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-company">Firma <span aria-hidden="true">*</span></Label>
                                      <div className="forteca-frt-011-input-with-icon">
                                        <Building2 aria-hidden="true" />
                                        <Input
                                          id="forteca-frt-011-lead-company"
                                          value={newLead.company}
                                          onChange={(event) => setNewLead((current) => ({ ...current, company: event.target.value }))}
                                          placeholder="np. Firma klienta"
                                        />
                                      </div>
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-name">Imię i nazwisko <span aria-hidden="true">*</span></Label>
                                      <div className="forteca-frt-011-input-with-icon">
                                        <UserRound aria-hidden="true" />
                                        <Input
                                          id="forteca-frt-011-lead-name"
                                          value={newLead.name}
                                          onChange={(event) => setNewLead((current) => ({ ...current, name: event.target.value }))}
                                          placeholder="Wpisz imię i nazwisko"
                                        />
                                      </div>
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-email">E-mail <span aria-hidden="true">*</span></Label>
                                      <div className="forteca-frt-011-input-with-icon">
                                        <Mail aria-hidden="true" />
                                        <Input
                                          id="forteca-frt-011-lead-email"
                                          type="email"
                                          value={newLead.email}
                                          onChange={(event) => setNewLead((current) => ({ ...current, email: event.target.value }))}
                                          placeholder="kontakt@email.pl"
                                        />
                                      </div>
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-phone">Telefon</Label>
                                      <div className="forteca-frt-011-phone-field">
                                        <span className="forteca-frt-011-phone-prefix">+48</span>
                                        <Input
                                          id="forteca-frt-011-lead-phone"
                                          value={newLead.phone}
                                          onChange={(event) => setNewLead((current) => ({ ...current, phone: event.target.value }))}
                                          placeholder="516 000 000"
                                          inputMode="tel"
                                        />
                                      </div>
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-source">Źródło <span aria-hidden="true">*</span></Label>
                                      <select
                                        id="forteca-frt-011-lead-source"
                                        className="lead-form-select forteca-frt-011-select"
                                        value={newLead.source}
                                        onChange={(event) => setNewLead((current) => ({ ...current, source: event.target.value }))}
                                      >
                                        {LEAD_SOURCE_OPTIONS.map((source) => (
                                          <option key={source.value} value={source.value}>{source.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="forteca-frt-011-meta-grid">
                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-value">Wartość</Label>
                                      <div className="forteca-frt-011-value-field">
                                        <span aria-hidden="true">zł</span>
                                        <Input
                                          id="forteca-frt-011-lead-value"
                                          data-stage231g-lead-create-potential-input="true"
                                          type="number"
                                          min="0"
                                          step="1"
                                          value={newLead.dealValue}
                                          onChange={(event) => setNewLead((current) => ({ ...current, dealValue: event.target.value }))}
                                          placeholder="0"
                                        />
                                      </div>
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-status">Status <span aria-hidden="true">*</span></Label>
                                      <select
                                        id="forteca-frt-011-lead-status"
                                        className="lead-form-select forteca-frt-011-select"
                                        value={newLead.status}
                                        onChange={(event) => setNewLead((current) => ({ ...current, status: event.target.value }))}
                                      >
                                        {LEAD_STATUS_OPTIONS.filter((status) => status.value !== 'archived').map((status) => (
                                          <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-lead-priority">Priorytet</Label>
                                      <div className="forteca-frt-011-priority-field">
                                        <Flag aria-hidden="true" />
                                        <select
                                          id="forteca-frt-011-lead-priority"
                                          className="lead-form-select forteca-frt-011-select"
                                          value={newLead.isAtRisk ? 'high' : 'medium'}
                                          onChange={(event) => setNewLead((current) => ({ ...current, isAtRisk: event.target.value === 'high' }))}
                                        >
                                          <option value="medium">Średni</option>
                                          <option value="high">Wysoki</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </section>

                                <section className="lead-form-section forteca-frt-011-section forteca-frt-011-next-step" data-forteca-frt-011-next-step="true">
                                  <div className="lead-form-section-head forteca-frt-011-section-head">
                                    <div>
                                      <h3>Następny krok</h3>
                                      <p>Zaplanuj działanie, które ma wydarzyć się po dodaniu leada.</p>
                                    </div>
                                    <ListChecks aria-hidden="true" />
                                  </div>

                                  <div className="forteca-frt-011-next-step-grid">
                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-next-action-title">Działanie</Label>
                                      <select
                                        id="forteca-frt-011-next-action-title"
                                        className="lead-form-select forteca-frt-011-select"
                                        value={newLead.nextActionTitle}
                                        onChange={(event) => setNewLead((current) => ({ ...current, nextActionTitle: event.target.value }))}
                                      >
                                        <option value="">Wybierz kolejny krok</option>
                                        {TASK_TYPES.map((taskType) => (
                                          <option key={taskType.value} value={taskType.label}>{taskType.label}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="lead-form-field forteca-frt-011-field">
                                      <Label htmlFor="forteca-frt-011-next-action-at">Termin</Label>
                                      <Input
                                        id="forteca-frt-011-next-action-at"
                                        type="datetime-local"
                                        value={newLead.nextActionAt}
                                        onChange={(event) => setNewLead((current) => ({ ...current, nextActionAt: event.target.value }))}
                                      />
                                    </div>
                                  </div>

                                  <div className="forteca-frt-011-quick-actions" role="group" aria-label="Szybki termin następnego kroku">
                                    {([
                                      ['today', 'Dziś 17:00'],
                                      ['tomorrow', 'Jutro 09:00'],
                                      ['in_two_days', 'Za 2 dni'],
                                      ['friday', 'Piątek'],
                                      ['next_week', 'Za tydzień'],
                                    ] as Array<[LeadCreateQuickAction, string]>).map(([action, label]) => (
                                      <button
                                        key={action}
                                        type="button"
                                        className="forteca-frt-011-quick-action"
                                        onClick={() => setNewLead((current) => ({ ...current, nextActionAt: getLeadCreateQuickActionDateTime(action) }))}
                                      >
                                        {label}
                                      </button>
                                    ))}
                                  </div>

                                  <button
                                    type="button"
                                    className={`forteca-frt-011-task-toggle${newLead.createNextTask ? ' is-active' : ''}`}
                                    data-forteca-frt-011-task-toggle="true"
                                    aria-pressed={newLead.createNextTask}
                                    onClick={() => setNewLead((current) => ({ ...current, createNextTask: !current.createNextTask }))}
                                  >
                                    <Link2 aria-hidden="true" />
                                    <span>
                                      <strong>Dodaj zadanie od razu</strong>
                                      <small>Zadanie zostanie zapisane razem z leadem.</small>
                                    </span>
                                    <span className="forteca-frt-011-toggle-indicator" aria-hidden="true" />
                                  </button>
                                </section>

                                <section className="lead-form-section forteca-frt-011-section forteca-frt-011-context-section" data-forteca-frt-011-context="true">
                                  <div className="forteca-frt-011-owner-row">
                                    <div className="forteca-frt-011-owner-label">
                                      <UserRound aria-hidden="true" />
                                      <div>
                                        <Label htmlFor="forteca-frt-011-owner">Opiekun <span aria-hidden="true">*</span></Label>
                                        <small>Właściciel workspace</small>
                                      </div>
                                    </div>
                                    <div id="forteca-frt-011-owner" className="forteca-frt-011-owner-value" aria-readonly="true" data-forteca-frt-011-owner="true">
                                      {leadCreateOwnerLabel}
                                    </div>
                                  </div>

                                  <div className="lead-form-field forteca-frt-011-field">
                                    <Label htmlFor="forteca-frt-011-notes">Krótka notatka</Label>
                                    <textarea
                                      id="forteca-frt-011-notes"
                                      className="lead-form-textarea forteca-frt-011-notes"
                                      value={newLead.notes}
                                      maxLength={500}
                                      onChange={(event) => setNewLead((current) => ({ ...current, notes: event.target.value }))}
                                      placeholder="Dodaj najważniejszy kontekst rozmowy..."
                                    />
                                    <div className="forteca-frt-011-character-count" aria-live="polite">{newLead.notes.length} / 500</div>
                                  </div>
                                </section>

                                <details className="lead-form-section lead-form-details forteca-frt-011-operational-details" data-forteca-frt-011-operational-details="true">
                                  <summary>Dane operacyjne</summary>
                                  <div className="lead-form-grid lead-form-details-grid">
                                    <div className="lead-form-field" data-stage223r3-lead-last-contact-input="true">
                                      <Label htmlFor="forteca-frt-011-last-contact">Ostatni kontakt</Label>
                                      <Input
                                        id="forteca-frt-011-last-contact"
                                        type="date"
                                        value={newLead.lastContactAt}
                                        max={getTodayDateInputValue()}
                                        onChange={(event) => setNewLead((current) => ({ ...current, lastContactAt: event.target.value }))}
                                      />
                                      <small className="sub">Wpływa na oznaczenia ciszy 7/14 dni.</small>
                                    </div>
                                  </div>
                                </details>

                                <DialogFooter className={modalFooterClass('lead-form-footer forteca-frt-011-footer')}>
                                  <Button type="button" variant="outline" onClick={() => handleNewLeadOpenChange(false)}>
                                    Anuluj
                                  </Button>
                                  <Button type="submit" disabled={leadSubmitting || !workspaceReady} data-forteca-frt-011-submit="true">
                                    <Plus aria-hidden="true" />
                                    {leadSubmitting ? 'Dodawanie...' : 'Dodaj leada'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>          </div>
            </>
          }
        />

        {!showTrash ? (
        <div className="leads-state-tabs" role="tablist" aria-label="Widoki leadów" data-frt007-history-tabs="true">
          {([
            ['all', 'Wszystkie'],
            ['active', 'Aktywne'],
            ['at-risk', 'Zagrożone'],
            ['history', 'Historia'],
            ['rescue', 'Do odzyskania'],
          ] as Array<[LeadsQuickFilter, string]>).map(([filter, label]) => {
            const selected = !showTrash && quickFilter === filter && !valueSortEnabled;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={selected}
                className={selected ? 'leads-state-tab is-active' : 'leads-state-tab'}
                data-frt007-state-tab={filter}
                data-frt007-state-active={selected ? 'true' : 'false'}
                onClick={() => selectQuickFilter(filter)}
              >
                {label}
                {filter === 'history' ? <span className="leads-state-tab-count">{stats.history}</span> : null}
              </button>
            );
          })}
        </div>
        ) : null}

        {activeView ? (
          <div className="leads-active-process-banner" data-frt005-active-process-banner="true" role="status">
            <span className="leads-active-process-icon" aria-hidden="true"><Info className="h-4 w-4" /></span>
            <strong>Aktywne leady wymagające pilnowania procesu</strong>
            <button
              type="button"
              className="leads-active-process-dismiss"
              onClick={() => toggleQuickFilter('active')}
              aria-label="Usuń filtr aktywnych leadów"
              title="Pokaż wszystkie leady"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {!rescueView && !showTrash ? (
          <div className="grid-5">
            <StatShortcutCard
              label="Wszystkie"
              value={stats.total}
              icon={LeadEntityIcon}
              active={quickFilter === 'all' && !valueSortEnabled && !showTrash}
              onClick={() => { setShowTrash(false); setQuickFilter('all'); setRiskFilter('all'); setValueSortEnabled(false); }}
              title="Pokaż wszystkie leady"
              ariaLabel="Pokaż wszystkie leady"
              helper="Wszystkie leady"
            />

            <StatShortcutCard
              label="Aktywne"
              value={stats.active}
              icon={Activity}
              active={quickFilter === 'active' && !showTrash}
              onClick={() => toggleQuickFilter('active')}
              title="Pokaż aktywne leady"
              ariaLabel="Pokaż aktywne leady"
              valueClassName="text-slate-900"
              iconClassName="bg-blue-50 text-blue-500"
              helper={activeView ? 'W trakcie sprzedaży' : 'Obecnie w procesie'}
            />

            <StatShortcutCard
              label="Wartość"
              value={`${stats.value.toLocaleString('pl-PL')} PLN`}
              icon={Wallet}
              active={valueSortEnabled && !showTrash}
              onClick={toggleValueSorting}
              title="Sortuj leady po wartości"
              ariaLabel="Sortuj leady po wartości"
              helper={valueSortEnabled ? 'Sortowanie aktywne' : 'Suma wartości aktywnych leadów'}
            />

            <StatShortcutCard
              label="Zagrożone"
              value={stats.atRisk}
              icon={AlertTriangle}
              active={quickFilter === 'at-risk' && !showTrash}
              onClick={() => toggleQuickFilter('at-risk')}
              title="Pokaż zagrożone leady"
              ariaLabel="Pokaż zagrożone leady"
              tone="risk"
              helper={riskView ? `${stats.atRisk} ${stats.atRisk === 1 ? 'lead wymaga' : stats.atRisk >= 2 && stats.atRisk <= 4 ? 'leady wymagają' : 'leadów wymaga'} natychmiastowego ruchu` : 'Leady wymagające uwagi'}
            />

            {/* Do odzyskania remains a real filter in the expanded filter panel, keeping the reference KPI row at four cards. */}
          </div>
        ) : null}

        {rescueView ? (
          <div className="leads-rescue-summary" data-frt008-rescue-summary="true">
            <div className="leads-rescue-summary-primary">
              <span className="leads-rescue-summary-icon" aria-hidden="true"><RefreshCw className="h-5 w-5" /></span>
              <div>
                <strong>{lostLeadRescueSummary.total} {lostLeadRescueSummary.total === 1 ? 'lead do odzyskania' : lostLeadRescueSummary.total >= 2 && lostLeadRescueSummary.total <= 4 ? 'leady do odzyskania' : 'leadów do odzyskania'}</strong>
                <span>Potencjał <b>{rescuePotential.toLocaleString('pl-PL')} PLN</b></span>
              </div>
            </div>
            <div className="leads-rescue-summary-metric">
              <span className="leads-rescue-summary-metric-icon is-blue" aria-hidden="true"><PhoneCall className="h-4 w-4" /></span>
              <span className="mini">Działaj teraz</span>
              <strong>{rescueReadyCount}</strong>
              <span className="sub">Leady z zaplanowanym ruchem</span>
            </div>
            <div className="leads-rescue-summary-metric">
              <span className="leads-rescue-summary-metric-icon is-amber" aria-hidden="true"><Clock3 className="h-4 w-4" /></span>
              <span className="mini">Wymagają uwagi</span>
              <strong>{rescueAttentionCount}</strong>
              <span className="sub">Brak pewnej daty lub 7+ dni ciszy</span>
            </div>
            <div className="leads-rescue-summary-metric">
              <span className="leads-rescue-summary-metric-icon is-green" aria-hidden="true"><TrendingUp className="h-4 w-4" /></span>
              <span className="mini">Szansa na zamknięcie</span>
              <strong>Brak danych</strong>
              <span className="sub">Brak źródła prognostycznego</span>
            </div>
            <div className="leads-rescue-summary-copy">
              <strong>Nie pozwól, by dobre leady uciekły.</strong>
              <span>Szybka reakcja zwiększa szansę na domknięcie sprzedaży.</span>
            </div>
          </div>
        ) : null}

        {/*
// STAGE32_STAGE96_COMPAT_WIDTH_MARKER: xl:grid-cols-[minmax(0,1fr)_300px] is a legacy guard marker only; real rail width is delegated to Stage96 source truth CSS.
STAGE32_VALUABLE_RELATIONS_RIGHT_RAIL
 STAGE223_R2V_STAGE32E_RELATION_RAIL_COPY_COMPAT: Lejek razem: {formatRelationValue(relationFunnelValue)} */}
        <div
          className="layout-list"
          data-stage117-leads-right-rail-layout="true"
          data-stage177-leads-clients-layout-source="true"
          data-cf-right-rail-layout-source="shared"
          data-stage25-leads-layout-list="true"
          data-semantic32-leads-value-layout="true"
          data-stage96-leads-right-rail-source-truth="true"
        >
          <div className="stack">
            <div className={`leads-filter-card${activeView ? ' leads-filter-card-active' : ''}${riskView ? ' leads-filter-card-risk' : ''}${historyView ? ' leads-filter-card-history' : ''}${rescueView ? ' leads-filter-card-rescue' : ''}${showTrash ? ' leads-filter-card-trash' : ''}`} data-frt004-leads-filter-card="true" data-frt005-leads-active-filter-card={activeView ? 'true' : 'false'} data-frt006-risk-filter-card={riskView ? 'true' : 'false'} data-frt007-history-filter-card={historyView ? 'true' : 'false'} data-frt008-rescue-filter-card={rescueView ? 'true' : 'false'} data-frt009-trash-filter-card={showTrash ? 'true' : 'false'}>
              <div className="leads-filter-search">
                <div className="search cf-main-search cf-main-search-stage177" data-cf-main-search="true" data-leads-search="true" data-stage117-leads-search-anchor="true" data-cf-main-search-source="semantic173">
              <span aria-hidden="true"><Search className="w-4 h-4" /></span>
              <Input
                placeholder={showTrash ? CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER : CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                list="lead-search-suggestions-stage25"
                aria-label="Szukaj w leadach"
              />
              <datalist id="lead-search-suggestions-stage25">
                {leadSearchSuggestions.map((suggestion) => (
                  <option key={suggestion.id} value={suggestion.name} />
                ))}
              </datalist>
                </div>

                {searchQuery.trim() ? (
                  leadSearchSuggestions.length ? (
                    <div className="suggestions lead-search-suggestions-stage31 cf-main-search" data-stage31-lead-search-suggestions="true" data-stage117-leads-search-suggestions="true" data-cf-main-search-source="semantic173">
                      {leadSearchSuggestions.map((suggestion, index) => (
                        <Link key={suggestion.id} to={`/leads/${suggestion.id}`}>
                          <span>{index + 1}. {suggestion.name}</span>
                          <small>{suggestion.meta}</small>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="suggestions lead-search-suggestions-stage31 cf-main-search" data-stage31-lead-search-suggestions="true" data-stage117-leads-search-suggestions="true" data-cf-main-search-source="semantic173">
                      <span className="sub">Podpowiedzi pojawiają się pod wyszukiwarką. Usuń część tekstu albo wybierz inny filtr.</span>
                    </div>
                  )
                ) : null}
              </div>



            <div className="leads-filter-toolbar" data-frt004-leads-filter-toolbar="true" data-frt005-leads-active-toolbar={activeView ? 'true' : 'false'} data-frt006-risk-toolbar={riskView ? 'true' : 'false'} data-frt007-history-toolbar={historyView ? 'true' : 'false'} data-frt008-rescue-toolbar={rescueView ? 'true' : 'false'} data-frt009-trash-toolbar={showTrash ? 'true' : 'false'}>
              {activeView ? (
                <button
                  type="button"
                  className="leads-filter-chip leads-filter-active-chip"
                  onClick={() => toggleQuickFilter('active')}
                  aria-label="Usuń filtr Status: aktywne"
                  data-frt005-active-filter-chip="true"
                >
                  <span>Status: aktywne</span>
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : historyView ? (
                <label className="leads-filter-control">
                  <span>Status</span>
                  <select
                    className={nativeSelectClassName()}
                    value={historyOutcomeFilter}
                    onChange={(event) => setHistoryOutcomeFilter(event.target.value)}
                    aria-label="Filtr statusu historii"
                    data-frt007-history-status-filter="true"
                  >
                    <option value="">Wszystkie statusy</option>
                    <option value="won">Wygrane</option>
                    <option value="lost">Przegrane</option>
                    <option value="moved_to_service">Przeniesione do obsługi</option>
                  </select>
                </label>
              ) : rescueView ? (
                <label className="leads-filter-control">
                  <span>Źródło</span>
                  <select
                    className={nativeSelectClassName()}
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value)}
                    aria-label="Filtr źródła leadów do odzyskania"
                    data-frt008-rescue-source-filter="true"
                  >
                    <option value="">Wszystkie źródła</option>
                    {LEAD_SOURCE_OPTIONS.map((source) => (
                      <option key={source.value} value={source.value}>{source.label}</option>
                    ))}
                  </select>
                </label>
              ) : showTrash ? (
                <label className="leads-filter-control">
                  <span>Powód usunięcia</span>
                  <select
                    className={nativeSelectClassName()}
                    value={trashReasonFilter}
                    onChange={(event) => setTrashReasonFilter(event.target.value)}
                    aria-label="Filtr powodu usunięcia"
                    data-frt009-trash-reason-filter="true"
                  >
                    <option value="">Wszystkie powody</option>
                    {trashReasonOptions.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                  </select>
                </label>
              ) : (
                <label className="leads-filter-control">
                  <span>Status</span>
                  <select
                    className={nativeSelectClassName()}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filtr statusu"
                  >
                    <option value="">Wszystkie statusy</option>
                    {LEAD_STATUS_OPTIONS.filter((status) => status.value !== 'archived').map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </label>
              )}

              {activeView ? (
                <label className="leads-filter-control leads-active-cadence-control">
                  <span>Ostatni kontakt</span>
                  <select
                    className={nativeSelectClassName()}
                    value={cadenceFilter}
                    onChange={(event) => setCadenceFilter(event.target.value as ContactCadenceBucketKey | 'all')}
                    aria-label="Filtr ostatniego kontaktu"
                  >
                    <option value="all">Dowolny</option>
                    {contactCadenceBuckets.map((bucket) => (
                      <option key={bucket.key} value={bucket.key}>{bucket.label}</option>
                    ))}
                  </select>
                </label>
              ) : rescueView ? (
                <label className="leads-filter-control">
                  <span>Ryzyko</span>
                  <select
                    className={nativeSelectClassName()}
                    value={riskFilter}
                    onChange={(event) => setRiskFilter(event.target.value as 'all' | 'at-risk')}
                    aria-label="Filtr ryzyka leadów do odzyskania"
                    data-frt008-rescue-risk-filter="true"
                  >
                    <option value="all">Wszystkie poziomy</option>
                    <option value="at-risk">Wysokie</option>
                  </select>
                </label>
              ) : historyView ? (
                <label className="leads-filter-control">
                  <span>Powód utraty / Wynik</span>
                  <select
                    className={nativeSelectClassName()}
                    value={historyReasonFilter}
                    onChange={(event) => setHistoryReasonFilter(event.target.value)}
                    aria-label="Filtr powodu utraty lub wyniku"
                    data-frt007-history-reason-filter="true"
                  >
                    <option value="">Wszystkie wyniki</option>
                    {historyReasonOptions.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                  </select>
                </label>
              ) : showTrash ? (
                <label className="leads-filter-control">
                  <span>Usunięto</span>
                  <select
                    className={nativeSelectClassName()}
                    value={trashDeletedPeriodFilter}
                    onChange={(event) => setTrashDeletedPeriodFilter(event.target.value as LeadsTrashDeletedPeriod)}
                    aria-label="Filtr daty usunięcia"
                    data-frt009-trash-deleted-period-filter="true"
                  >
                    <option value="all">Wszystkie daty</option>
                    <option value="30">Ostatnie 30 dni</option>
                    <option value="90">Ostatnie 90 dni</option>
                    <option value="older">Ponad 90 dni</option>
                  </select>
                </label>
              ) : null}

              {rescueView ? (
                <label className="leads-filter-control">
                  <span>Wartość</span>
                  <select
                    className={nativeSelectClassName()}
                    value={rescueValueFilter}
                    onChange={(event) => setRescueValueFilter(event.target.value as typeof rescueValueFilter)}
                    aria-label="Filtr wartości leadów do odzyskania"
                    data-frt008-rescue-value-filter="true"
                  >
                    <option value="all">Wszystkie wartości</option>
                    <option value="under_5000">Poniżej 5 000 PLN</option>
                    <option value="5000_20000">5 000–20 000 PLN</option>
                    <option value="over_20000">Powyżej 20 000 PLN</option>
                  </select>
                </label>
              ) : historyView ? (
                <label className="leads-filter-control">
                  <span>Wartość</span>
                  <select
                    className={nativeSelectClassName()}
                    value={historyValueFilter}
                    onChange={(event) => setHistoryValueFilter(event.target.value as typeof historyValueFilter)}
                    aria-label="Filtr wartości historii"
                    data-frt007-history-value-filter="true"
                  >
                    <option value="all">Wszystkie wartości</option>
                    <option value="under_5000">Poniżej 5 000 PLN</option>
                    <option value="5000_20000">5 000–20 000 PLN</option>
                    <option value="over_20000">Powyżej 20 000 PLN</option>
                  </select>
                </label>
              ) : showTrash ? (
                <label className="leads-filter-control">
                  <span>Termin trwałego usunięcia</span>
                  <select
                    className={nativeSelectClassName()}
                    value={trashRetentionFilter}
                    onChange={(event) => setTrashRetentionFilter(event.target.value as LeadsTrashRetentionFilter)}
                    aria-label="Filtr terminu trwałego usunięcia"
                    data-frt009-trash-retention-filter="true"
                  >
                    <option value="all">Wszystkie rekordy</option>
                    <option value="known">Termin zapisany</option>
                    <option value="unknown">Brak terminu</option>
                  </select>
                </label>
              ) : (
                <label className="leads-filter-control">
                  <span>Źródło</span>
                  <select
                    className={nativeSelectClassName()}
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value)}
                    aria-label="Filtr źródła"
                  >
                    <option value="">{activeView ? 'Dowolne' : 'Wszystkie źródła'}</option>
                    {LEAD_SOURCE_OPTIONS.map((source) => (
                      <option key={source.value} value={source.value}>{source.label}</option>
                    ))}
                  </select>
                </label>
              )}

              {historyView ? (
                <label className="leads-filter-control">
                  <span>Data zamknięcia</span>
                  <select
                    className={nativeSelectClassName()}
                    value={historyClosedPeriodFilter}
                    onChange={(event) => setHistoryClosedPeriodFilter(event.target.value as typeof historyClosedPeriodFilter)}
                    aria-label="Filtr daty zamknięcia historii"
                    data-frt007-history-closed-period-filter="true"
                  >
                    <option value="365">Ostatnie 12 mies.</option>
                    <option value="30">Ostatnie 30 dni</option>
                    <option value="90">Ostatnie 90 dni</option>
                    <option value="all">Wszystkie daty</option>
                  </select>
                </label>
              ) : rescueView ? (
                <label className="leads-filter-control">
                  <span>Ostatni kontakt</span>
                  <select
                    className={nativeSelectClassName()}
                    value={cadenceFilter}
                    onChange={(event) => setCadenceFilter(event.target.value as ContactCadenceBucketKey | 'all')}
                    aria-label="Filtr ostatniego kontaktu leadów do odzyskania"
                    data-frt008-rescue-contact-filter="true"
                  >
                    <option value="all">Wszystkie daty</option>
                    {contactCadenceBuckets.map((bucket) => (
                      <option key={bucket.key} value={bucket.key}>{bucket.label}</option>
                    ))}
                  </select>
                </label>
              ) : showTrash ? null : riskView ? (
                <button
                  type="button"
                  className="leads-filter-chip leads-filter-risk-chip cf-status-pill"
                  data-cf-status-tone="red"
                  onClick={() => toggleQuickFilter('at-risk')}
                  aria-label="Usuń filtr Ryzyko: wysokie"
                  data-frt006-risk-filter-chip="true"
                >
                  <span>Wysokie</span>
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : (
                <label className="leads-filter-control">
                  <span>Ryzyko</span>
                  <select
                    className={nativeSelectClassName()}
                    value={riskFilter}
                    onChange={(event) => setRiskFilter(event.target.value as 'all' | 'at-risk')}
                    aria-label="Filtr ryzyka"
                  >
                    <option value="all">{activeView ? 'Dowolne' : 'Wszystkie poziomy'}</option>
                    <option value="at-risk">Tylko zagrożone</option>
                  </select>
                </label>
              )}

              {rescueView ? (
                <label className="leads-filter-control">
                  <span>Odpowiedzialny</span>
                  <select
                    className={nativeSelectClassName()}
                    value={rescueOwnerFilter}
                    onChange={(event) => setRescueOwnerFilter(event.target.value)}
                    aria-label="Filtr odpowiedzialnego leadów do odzyskania"
                    data-frt008-rescue-owner-filter="true"
                  >
                    <option value="">Wszyscy odpowiedzialni</option>
                    {rescueOwnerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
                  </select>
                </label>
              ) : riskView ? (
                <label className="leads-filter-control leads-risk-cadence-control">
                  <span>Kontakt / cisza</span>
                  <select
                    className={nativeSelectClassName()}
                    value={cadenceFilter}
                    onChange={(event) => setCadenceFilter(event.target.value as ContactCadenceBucketKey | 'all')}
                    aria-label="Filtr kontaktu i ciszy"
                  >
                    <option value="all">Wszystkie</option>
                    {contactCadenceBuckets.map((bucket) => (
                      <option key={bucket.key} value={bucket.key}>{bucket.label}</option>
                    ))}
                  </select>
                </label>
              ) : null}

              <button
                type="button"
                className="leads-filter-more"
                onClick={() => setShowMoreFilters((current) => !current)}
                aria-expanded={showMoreFilters}
                data-frt004-more-filters="true"
              >
                <Filter className="h-4 w-4" />
                {showTrash ? 'Filtruj' : 'Więcej filtrów'}
              </button>
              {!riskView ? (
                <button
                  type="button"
                  className="leads-filter-reset"
                  onClick={resetLeadFilters}
                  data-frt004-reset-filters="true"
                >
                  {showTrash || activeView ? 'Wyczyść filtry' : 'Reset'}
                </button>
              ) : null}
            </div>
            </div>

            {showMoreFilters ? (
              <div className="leads-more-filters-panel" data-frt004-more-filters-panel="true">
                {showTrash ? (
                  <div className="leads-trash-filter-panel" data-frt009-trash-filter-panel="true">
                    <div>
                      <span className="mini">Aktywne filtry</span>
                      <div className="leads-trash-filter-pills">
                        {trashReasonFilter ? (
                          <button type="button" className="pill" onClick={() => setTrashReasonFilter('')}>Powód: {trashReasonFilter} <X className="h-3 w-3" aria-hidden="true" /></button>
                        ) : null}
                        {trashDeletedPeriodFilter !== 'all' ? (
                          <button type="button" className="pill" onClick={() => setTrashDeletedPeriodFilter('all')}>Usunięto: {trashDeletedPeriodFilter === '30' ? '30 dni' : trashDeletedPeriodFilter === '90' ? '31–90 dni' : 'ponad 90 dni'} <X className="h-3 w-3" aria-hidden="true" /></button>
                        ) : null}
                        {trashRetentionFilter !== 'all' ? (
                          <button type="button" className="pill" onClick={() => setTrashRetentionFilter('all')}>{trashRetentionFilter === 'known' ? 'Termin zapisany' : 'Brak terminu'} <X className="h-3 w-3" aria-hidden="true" /></button>
                        ) : null}
                        {!trashReasonFilter && trashDeletedPeriodFilter === 'all' && trashRetentionFilter === 'all' ? <span className="sub">Brak dodatkowych filtrów.</span> : null}
                      </div>
                    </div>
                    <span className="sub">Wyniki: {filteredTrashLeads.length} z {trashLeads.length}</span>
                    <button type="button" className="leads-filter-reset" onClick={resetLeadFilters}>Wyczyść filtry</button>
                  </div>
                ) : null}
                {!showTrash ? (
                  <div className="cf-contact-cadence-strip w-full max-w-none" data-stage225-contact-cadence-grid="leads" data-stage227f6-contact-cadence-compact="leads">
                    <span hidden data-stage225-cadence-14-label="14+ dni ciszy" />
                    <div className="cf-contact-cadence-pills">
                      <button
                        type="button"
                        className={cadenceFilter === 'all' ? 'cf-status-pill' : 'pill'}
                        data-cf-status-tone={cadenceFilter === 'all' ? 'blue' : undefined}
                        onClick={() => setCadenceFilter('all')}
                      >
                        Wszystkie ({activeLeads.length})
                      </button>
                      {contactCadenceBuckets.map((bucket) => (
                        <button
                          key={bucket.key}
                          type="button"
                          className={cadenceFilter === bucket.key ? 'cf-status-pill' : 'pill'}
                          data-cf-status-tone={cadenceFilter === bucket.key ? (bucket.severity === 'high' ? 'red' : bucket.severity === 'medium' ? 'amber' : 'blue') : undefined}
                          onClick={() => setCadenceFilter(bucket.key)}
                          title={bucket.description}
                        >
                          {bucket.label} ({contactCadenceGrid.counts[bucket.key] || 0})
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {!showTrash ? (<div className="leads-more-filter-content">
                  {/* STAGE32_OPERATOR_RAIL_GUARD_COMPAT: this is the shared rail source, moved into the reference filter disclosure. */}
                  <SimpleFiltersCard
                    className="right-card lead-right-card operator-simple-filters-card"
                    title="Filtry proste"
                    description=""
                    dataTestId="leads-simple-filters-card"
                    items={[
                      {
                        key: 'active',
                        label: 'Aktywne',
                        value: stats.active,
                        onClick: () => {
                          setShowTrash(false);
                          setQuickFilter('active');
                          setValueSortEnabled(false);
                        },
                      },
                      {
                        key: 'at-risk',
                        label: 'Zagrożone',
                        value: stats.atRisk,
                        onClick: () => {
                          setShowTrash(false);
                          setQuickFilter('at-risk');
                          setValueSortEnabled(false);
                        },
                      },
                      {
                        key: 'rescue',
                        label: 'Do odzyskania',
                        value: stats.rescue,
                        onClick: () => {
                          setShowTrash(false);
                          setQuickFilter('rescue');
                          setValueSortEnabled(false);
                        },
                      },
                      {
                        key: 'history',
                        label: 'Historia',
                        value: stats.history,
                        onClick: () => selectQuickFilter('history'),
                      },
                      {
                        key: 'trash',
                        label: 'Kosz',
                        value: stats.trash,
                        onClick: () => {
                          setShowTrash(true);
                          setQuickFilter('all');
                          setValueSortEnabled(false);
                        },
                      },
                    ]}
                  />

                  <TopValueRecordsCard
                    title="Najcenniejsze leady"
                    description=""
                    className="operator-top-value-card"
                    dataTestId="leads-top-value-records-card"
                    dataAttrs={{ 'data-relation-value-board': true }}
                    items={mostValuableRelations.map((entry) => ({
                      key: entry.key,
                      href: entry.href || '/leads',
                      label: entry.label,
                      valueLabel: formatRelationValue(entry.value),
                      title: entry.label + ' - ' + formatRelationValue(entry.value),
                      dataAttrs: {
                        'data-stage25-valuable-relation-row': true,
                        'data-semantic32-valuable-relation-row': true,
                      },
                    }))}
                    emptyLabel="Brak relacji z wyliczoną wartością."
                  />
                </div>) : null}
              </div>
            ) : null}


            {showTrash ? (
              <section className="leads-trash-view" data-frt009-trash-view="true">
                <div className="leads-trash-view-actions" data-frt009-trash-actions="true">
                  <button
                    type="button"
                    className="btn soft-blue"
                    onClick={handleExportTrashCsv}
                    data-frt009-trash-export-visible="true"
                  >
                    Eksportuj CSV
                  </button>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={toggleTrashView}
                    data-frt009-trash-show-active="true"
                  >
                    Pokaż aktywne
                  </button>
                </div>
                <div className="leads-trash-retention-banner" role="status" data-frt009-retention-policy="unavailable">
                  <span className="leads-trash-retention-icon" aria-hidden="true"><Info className="h-4 w-4" /></span>
                  <div>
                    <strong>Leady w koszu można przywrócić przed trwałym usunięciem.</strong>
                    <span>Termin trwałego usunięcia jest pokazywany tylko wtedy, gdy został zapisany przy rekordzie.</span>
                  </div>
                </div>

                <div className="leads-trash-summary-grid" data-frt009-trash-summary="true">
                  <div className="leads-trash-summary-card">
                    <div className="leads-trash-summary-card-head">
                      <span className="leads-trash-summary-icon is-purple" aria-hidden="true"><DeleteActionIcon className="h-4 w-4" /></span>
                      <span className="leads-trash-summary-label">Leady w koszu</span>
                    </div>
                    <strong>{trashSummary.count}</strong>
                    <button type="button" className="leads-trash-summary-link" onClick={resetLeadFilters}>Zobacz wszystkie</button>
                  </div>
                  <div className="leads-trash-summary-card">
                    <div className="leads-trash-summary-card-head">
                      <span className="leads-trash-summary-icon is-blue" aria-hidden="true"><CalendarDays className="h-4 w-4" /></span>
                      <span className="leads-trash-summary-label">Najstarszy rekord</span>
                    </div>
                    <strong>{formatLeadTrashAgeLabel(trashSummary.oldestAge)}</strong>
                    <span>Usunięto: {formatLeadTrashDate(trashSummary.oldestDate, 'Brak daty')}</span>
                  </div>
                  <div className="leads-trash-summary-card">
                    <div className="leads-trash-summary-card-head">
                      <span className="leads-trash-summary-icon is-amber" aria-hidden="true"><Clock3 className="h-4 w-4" /></span>
                      <span className="leads-trash-summary-label">Ostatnie usunięcie</span>
                    </div>
                    <strong>{formatLeadTrashDate(trashSummary.latestDate, 'Brak danych')}</strong>
                    <span>Lead: {trashSummary.latestLabel || 'Brak danych'}</span>
                  </div>
                  <div className="leads-trash-summary-card">
                    <div className="leads-trash-summary-card-head">
                      <span className="leads-trash-summary-icon is-green" aria-hidden="true"><RefreshCw className="h-4 w-4" /></span>
                      <span className="leads-trash-summary-label">Przywrócone w tym miesiącu</span>
                    </div>
                    <strong>{trashSummary.restoredThisMonth === null ? 'Brak danych' : trashSummary.restoredThisMonth}</strong>
                    <span>{trashSummary.restoredThisMonth === null ? 'Brak źródła przywróceń' : 'Z ostatnich 30 dni'}</span>
                  </div>
                </div>

                <div className="table-card lead-table-card leads-trash-table-card w-full max-w-none" data-frt009-trash-table="true">
                  <div className="leads-table-head leads-trash-table-head" aria-hidden="true">
                    <span>Nazwa leada</span>
                    <span>Usunięto</span>
                    <span>Powód</span>
                    <span>Termin trwałego usunięcia</span>
                    <span>Usunięte przez</span>
                    <span>Akcje</span>
                  </div>
                  {loading || workspaceLoading ? (
                    <div className="row row-empty">
                      <span className="index"><Loader2 className="h-4 w-4 animate-spin" /></span>
                      <span>
                        <span className="title">Ładowanie kosza</span>
                        <span className="sub">Pobieram archiwalne leady z aplikacji.</span>
                      </span>
                    </div>
                  ) : loadError ? (
                    <div className="row row-empty">
                      <span className="index">!</span>
                      <span>
                        <span className="title">Nie udało się pobrać kosza</span>
                        <span className="sub">{loadError}</span>
                      </span>
                    </div>
                  ) : pagedTrashLeads.length ? (
                    <div className="leads-trash-table-body">
                      {pagedTrashLeads.map((lead) => {
                        const leadId = String(lead?.id || '');
                        const trashTimestamp = getLeadTrashTimestamp(lead);
                        const retentionTimestamp = getLeadTrashRetentionAt(lead);
                        const label = getLeadTrashLabel(lead);
                        return (
                          <div className="row lead-row leads-trash-table-row" key={leadId} data-frt009-trash-row="true">
                            <div className="lead-trash-main-cell">
                              <span className="client-avatar lead-trash-avatar" aria-hidden="true">{getLeadInitials(lead, label)}</span>
                              <Link to={`/leads/${leadId}`} className="lead-trash-name" title={`Otwórz leada: ${label}`}>{label}</Link>
                              <span className="sub">{getLeadPrimaryContact(lead)}</span>
                            </div>
                            <div className="lead-trash-data-cell">
                              <span className="mini">Usunięto</span>
                              <strong>{formatLeadTrashDate(trashTimestamp)}</strong>
                            </div>
                            <div className="lead-trash-data-cell">
                              <span className="mini">Powód</span>
                              <strong>{getLeadTrashReason(lead)}</strong>
                            </div>
                            <div className="lead-trash-data-cell">
                              <span className="mini">Termin</span>
                              <strong>{formatLeadTrashDate(retentionTimestamp)}</strong>
                            </div>
                            <div className="lead-trash-data-cell">
                              <span className="mini">Usunięte przez</span>
                              <strong>{getLeadTrashDeletedBy(lead)}</strong>
                            </div>
                            <div className="lead-actions lead-trash-actions">
                              <button
                                type="button"
                                className="leads-trash-restore-button"
                                onClick={(event) => handleRestoreLead(event, lead)}
                                disabled={archivePendingId === leadId}
                                aria-label={`Przywróć leada ${label}`}
                                data-frt009-trash-restore="true"
                              >
                                {archivePendingId === leadId ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                                Przywróć
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="row row-empty leads-trash-empty" data-frt009-trash-empty="true">
                      <span className="index">0</span>
                      <span>
                        <span className="title">{trashLeads.length ? 'Brak wyników w koszu' : 'Kosz leadów jest pusty.'}</span>
                        <span className="sub">{trashLeads.length ? 'Zmień wyszukiwanie albo wyczyść filtry.' : 'Nie ma rekordów do przywrócenia.'}</span>
                      </span>
                    </div>
                  )}
                  {!loading && !workspaceLoading && !loadError ? (
                    <div className="leads-table-footer" data-frt009-trash-pagination="true">
                      <span>
                        {filteredTrashLeads.length ? `${(leadPage - 1) * leadPageSize + 1}–${Math.min(leadPage * leadPageSize, filteredTrashLeads.length)}` : '0'} z {filteredTrashLeads.length} leadów
                      </span>
                      <div className="leads-pagination-controls">
                        <button
                          type="button"
                          className="leads-pagination-button"
                          onClick={() => setLeadPage((currentPage) => Math.max(1, currentPage - 1))}
                          disabled={leadPage <= 1}
                          aria-label="Poprzednia strona kosza"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="leads-pagination-current">{leadPage}</span>
                        <button
                          type="button"
                          className="leads-pagination-button"
                          onClick={() => setLeadPage((currentPage) => Math.min(leadPageCount, currentPage + 1))}
                          disabled={leadPage >= leadPageCount}
                          aria-label="Następna strona kosza"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <span className="leads-page-size">20 / strona</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}


            {rescueView ? (
              <section className="leads-rescue-view" data-frt008-rescue-view="true" data-stage226-lost-lead-rescue-list="true">
                <span hidden data-stage226-lost-lead-rescue-filter="true" />
                <div className="table-card lead-table-card leads-rescue-table-card w-full max-w-none" data-frt008-rescue-table="true">
                  <div className="leads-table-head leads-rescue-table-head" aria-hidden="true">
                    <span>Lead / firma</span>
                    <span>Powód do odzyskania</span>
                    <span>Ostatni kontakt</span>
                    <span>Potencjał</span>
                    <span>Sugerowany następny krok</span>
                    <span>Odpowiedzialny</span>
                    <span>Akcje</span>
                  </div>
                  {loading || workspaceLoading ? (
                    <div className="row row-empty">
                      <span className="index"><Loader2 className="h-4 w-4 animate-spin" /></span>
                      <span>
                        <span className="title">Ładowanie leadów</span>
                        <span className="sub">Pobieram dane z aplikacji.</span>
                      </span>
                    </div>
                  ) : loadError ? (
                    <div className="row row-empty">
                      <span className="index">!</span>
                      <span>
                        <span className="title">Nie udało się pobrać leadów</span>
                        <span className="sub">{loadError}</span>
                      </span>
                    </div>
                  ) : pagedRescueRows.length ? (
                    pagedRescueRows.map((row, rowIndex) => {
                      const lead = activeLeadById.get(row.leadId);
                      const companyLabel = String(lead?.company || '').trim();
                      const leadDisplayLabel = companyLabel || row.title;
                      const leadContactLabel = companyLabel && row.title !== companyLabel ? row.title : row.subtitle || getLeadPrimaryContact(lead);
                      const ownerLabel = getLeadOwnerLabel(lead);
                      const pending = archivePendingId === row.leadId;
                      const severityLabel = row.severity === 'critical' ? 'Krytyczne' : row.severity === 'high' ? 'Wysokie' : 'Średnie';
                      const severityTone = row.severity === 'critical' ? 'red' : row.severity === 'high' ? 'amber' : 'blue';
                      const lastContactLabel = formatLeadTableDate(row.lastContactAt, 'Brak daty kontaktu');
                      const contactMeta = row.contactSilentDays !== null ? `${row.contactSilentDays} ${formatPolishDays(row.contactSilentDays)} ciszy` : 'Brak pewnej daty kontaktu';
                      const valueLabel = row.valueAmount ? `${row.valueAmount.toLocaleString('pl-PL')} ${row.valueCurrency || 'PLN'}` : 'Brak wartości';

                      return (
                        <div key={row.id} className="row lead-row leads-rescue-table-row" data-stage226-lost-lead-rescue-row="true" data-frt008-rescue-row="true">
                          <span className="lead-main-cell">
                            <span className="lead-active-avatar" aria-hidden="true">{getLeadInitials(lead, leadDisplayLabel)}</span>
                            <span className="lead-active-identity-copy">
                              <Link to={row.href} className="title cf-lead-list-card-name leads-rescue-record-link" aria-label={`Otwórz leada ${leadDisplayLabel}`}>{leadDisplayLabel}</Link>
                              <span className="sub lead-table-contact" title={leadContactLabel}>{leadContactLabel}</span>
                            </span>
                          </span>
                          <span className="lead-company-cell leads-rescue-reason-cell">
                            <span className="title" title={row.reasonLabel}>{row.reasonLabel}</span>
                            <span className="cf-status-pill" data-cf-status-tone={severityTone}>{severityLabel}</span>
                            <span className="sub" title={row.reasonDetail}>{row.reasonDetail}</span>
                          </span>
                          <span className="lead-last-contact-cell">
                            <span className="mini">Ostatni kontakt</span>
                            <strong>{lastContactLabel}</strong>
                            <span className="sub">{contactMeta}</span>
                          </span>
                          <span className="lead-value-cell">
                            <span className="mini">Potencjał</span>
                            <strong className="cf-list-row-value">{valueLabel}</strong>
                          </span>
                          <span className="lead-action-cell leads-rescue-next-cell">
                            <span className="mini">Następny krok</span>
                            <strong title={row.nextMoveTitle || 'Ustaw kolejny krok'}>{row.nextMoveTitle || 'Ustaw kolejny krok'}</strong>
                            <span className="sub">{row.nextMoveAt ? formatLeadTableDate(row.nextMoveAt) : 'Brak zaplanowanego terminu'}</span>
                            <button
                              type="button"
                              className="leads-rescue-next-action"
                              data-context-action-kind="task"
                              data-context-record-type="lead"
                              data-context-record-id={row.leadId}
                              data-context-lead-id={row.leadId}
                              data-context-record-label={leadDisplayLabel}
                              aria-label={`Ustaw kolejny krok dla ${leadDisplayLabel}`}
                            >
                              Ustaw kolejny krok
                            </button>
                          </span>
                          <span className="lead-owner-cell leads-rescue-owner-cell">
                            <span className="leads-rescue-owner-avatar" aria-hidden="true">{getLeadInitials(lead, ownerLabel)}</span>
                            <span className="mini">Odpowiedzialny</span>
                            <strong title={ownerLabel}>{ownerLabel}</strong>
                          </span>
                          <span className="lead-actions">
                            <button
                              type="button"
                              className={actionIconClass('danger', 'btn ghost lead-icon-btn')}
                              disabled={pending}
                              onClick={(event) => lead ? handleArchiveLead(event, lead) : undefined}
                              aria-label={`Przenieś leada ${leadDisplayLabel} do kosza`}
                              title="Przenieś leada do kosza"
                            >
                              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            </button>
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="row row-empty">
                      <span className="index">0</span>
                      <span>
                        <span className="title">Brak leadów do odzyskania</span>
                        <span className="sub">Brak leadów wymagających odzyskania według aktualnych reguł i filtrów.</span>
                      </span>
                    </div>
                  )}
                  {!loading && !workspaceLoading && !loadError ? (
                    <div className="leads-table-footer" data-frt008-rescue-pagination="true">
                      <span>{filteredRescueRows.length ? `${(leadPage - 1) * leadPageSize + 1}–${Math.min(leadPage * leadPageSize, filteredRescueRows.length)}` : '0'} z {filteredRescueRows.length} leadów</span>
                      <div className="leads-pagination-controls">
                        <button type="button" className="leads-pagination-button" onClick={() => setLeadPage((currentPage) => Math.max(1, currentPage - 1))} disabled={leadPage <= 1} aria-label="Poprzednia strona">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="leads-pagination-current">{leadPage}</span>
                        <button type="button" className="leads-pagination-button" onClick={() => setLeadPage((currentPage) => Math.min(leadPageCount, currentPage + 1))} disabled={leadPage >= leadPageCount} aria-label="Następna strona">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <span className="leads-page-size">20 / strona</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {!rescueView && !showTrash ? (<div className={`table-card lead-table-card w-full max-w-none${riskView ? ' leads-risk-table-card' : ''}${historyView ? ' leads-history-table-card' : ''}`} data-stage25-lead-table-card="true" data-stage117-leads-list="true" data-frt006-risk-table-card={riskView ? 'true' : 'false'} data-frt007-history-table-card={historyView ? 'true' : 'false'}>
              <div className={`leads-table-head${activeView ? ' leads-table-head-active' : ''}${riskView ? ' leads-table-head-risk' : ''}${historyView ? ' leads-table-head-history' : ''}`} data-frt004-leads-table-head="true" data-frt005-active-table-head={activeView ? 'true' : 'false'} data-frt006-risk-table-head={riskView ? 'true' : 'false'} data-frt007-history-table-head={historyView ? 'true' : 'false'} aria-hidden="true">
                {riskView ? (
                  <>
                    <span>Lead / firma</span>
                    <span>Powód ryzyka</span>
                    <span>Następny ruch</span>
                    <span>Termin</span>
                    <span>Wartość</span>
                    <span>Ostatni kontakt</span>
                    <span>Akcje</span>
                  </>
                ) : activeView ? (
                  <>
                    <span>Lead / firma</span>
                    <span>Status</span>
                    <span>Wartość</span>
                    <span>Ostatni kontakt</span>
                    <span>Następny krok</span>
                    <span>Termin</span>
                    <span>Priorytet</span>
                    <span>Akcje</span>
                  </>
                ) : historyView ? (
                  <>
                    <span>Lead / firma</span>
                    <span>Status</span>
                    <span>Wartość</span>
                    <span>Wynik / powód</span>
                    <span>Data zamknięcia</span>
                    <span>Ostatni kontakt</span>
                    <span>Powiązana sprawa</span>
                    <span>Akcje</span>
                  </>
                ) : (
                  <>
                    <span>Lead</span>
                    <span>Firma / kanał</span>
                    <span>Status</span>
                    <span>Wartość</span>
                    <span>Ostatni kontakt</span>
                    <span>Następny krok</span>
                    <span>Termin</span>
                    <span>Ryzyko</span>
                    <span>Właściciel</span>
                    <span>Akcje</span>
                  </>
                )}
              </div>
              {loading || workspaceLoading ? (
                <div className="row row-empty">
                  <span className="index"><Loader2 className="h-4 w-4 animate-spin" /></span>
                  <span>
                    <span className="title">Ładowanie leadów</span>
                    <span className="sub">Pobieram dane z aplikacji.</span>
                  </span>
                </div>
              ) : loadError ? (
                <div className="row row-empty">
                  <span className="index">!</span>
                  <span>
                    <span className="title">Nie udało się pobrać leadów</span>
                    <span className="sub">{loadError}</span>
                  </span>
                </div>
              ) : filteredLeads.length ? (
                pagedLeads.map((lead, leadIndex) => {
                  const leadId = String(lead.id || '');
                  const linkedCase = resolveLinkedCaseForLead(lead);
                  const sourceLabel = getLeadSourceLabel(lead.source);
                  const leadStatusLabel = getLeadStatusLabel(lead.status);
                  const leadStatusTone = getLeadStatusTone(lead.status);
                  const leadValueLabel = (Number(lead.dealValue) || 0).toLocaleString() + ' PLN';
                  const historyOutcome = historyView ? getLeadHistoryOutcome(lead, linkedCase) : null;
                  const historyCloseAt = historyView ? getLeadHistoryCloseAt(lead) : null;
                  const historyCaseLabel = linkedCase
                    ? [linkedCase.title, formatCaseStatusLabel(linkedCase.status)].filter(Boolean).join(' · ')
                    : 'Brak powiązanej sprawy';
                  const contactLabel = getLeadPrimaryContact(lead);
                  const companyLabel = String(lead.company || '').trim() || 'Brak firmy';
                  const ownerLabel = String(lead.ownerName || lead.owner?.name || lead.owner?.fullName || lead.ownerId || '').trim() || 'Nieprzypisany';
                  const nextAction = nextActionByLeadId.get(leadId);
                  const nextActionMeta = buildNextActionMeta(nextAction);
                  const pending = archivePendingId === leadId;
                  const activeIdentityLabel = companyLabel !== 'Brak firmy' ? companyLabel : (lead.name || 'Lead bez nazwy');
                  const activeIdentityMeta = companyLabel !== 'Brak firmy' && lead.name ? lead.name : contactLabel;
                  const riskIdentityMeta = companyLabel !== 'Brak firmy' && lead.name
                    ? [lead.name, lead.email || lead.phone].filter(Boolean).join(' · ')
                    : contactLabel;
                  const riskReason = riskView
                    ? buildLeadRiskReason(lead, nextAction, workspace, relatedRecordsByLeadId.get(leadId) || [])
                    : null;
                  const riskContact = getLeadRelativeContact(lead.lastContactAt);
                  const riskDue = getLeadRelativeDue(nextAction?.at);
                  const operationalBadges = buildRecordOperationalBadges({
                    entityType: 'lead',
                    record: lead,
                    relatedRecords: linkedCase ? [linkedCase] : [],
                    hasNextStep: Boolean(nextAction),
                    settings: workspace,
                  });

                  return (
                    <div key={leadId || leadIndex} className="relative group/lead-row w-full" data-lead-card-wide-layout="true">
                      <Link to={`/leads/${leadId}`} className="block">
                        <div className={`row lead-row leads-table-row lead-card-value-block cf-lead-row-inline cf-lead-row-client-aligned${activeView ? ' leads-active-table-row' : ''}${riskView ? ' leads-risk-table-row' : ''}${historyView ? ' leads-history-table-row' : ''}`} data-stage231d0c-lead-card-client-aligned="true" data-ui-dictionary="LeadListCard" data-stage25-lead-row="true" data-stage31-lead-thin-row="true" data-stage14e-leads-value-layout="true" data-frt004-leads-table-row="true" data-frt005-active-table-row={activeView ? 'true' : 'false'} data-frt006-risk-table-row={riskView ? 'true' : 'false'} data-frt007-history-table-row={historyView ? 'true' : 'false'}>
                        <span className="index">{leadIndex + 1}</span>

                        <span className={`lead-main-cell${riskView ? ' lead-risk-main-cell' : ''}${historyView ? ' lead-history-main-cell' : ''}`}>
                          {activeView || riskView || historyView ? (
                            <>
                              <span className={`lead-active-avatar${riskView ? ' lead-risk-avatar' : ''}`} aria-hidden="true">{getLeadInitials(lead, activeIdentityLabel)}</span>
                              <span className="lead-active-identity-copy">
                                <span className="title cf-lead-list-card-name" title={activeIdentityLabel}>{activeIdentityLabel}</span>
                                <span className="sub lead-table-contact" title={riskView ? riskIdentityMeta : `${activeIdentityMeta}${activeIdentityMeta !== contactLabel ? ` · ${contactLabel}` : ''}`}>{riskView ? riskIdentityMeta : activeIdentityMeta}</span>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="title cf-lead-list-card-name" title={lead.name || 'Lead bez nazwy'}>{lead.name || 'Lead bez nazwy'}</span>
                              <span className="sub lead-table-contact" title={contactLabel}>{contactLabel}</span>
                            </>
                          )}
                        </span>

                        <span className="lead-company-cell">
                          {historyView ? (
                            <span className="lead-history-outcome-copy">
                              <span className="cf-status-pill" data-cf-status-tone={historyOutcome?.tone} data-frt007-history-outcome="true">{historyOutcome?.label}</span>
                            </span>
                          ) : riskView ? (
                            <span className="lead-risk-reason-copy">
                              <span className="lead-risk-reason-icon" data-cf-status-tone="red" aria-hidden="true"><AlertTriangle className="h-4 w-4" /></span>
                              <span className="lead-risk-reason-text">
                                <strong title={riskReason?.label}>{riskReason?.label}</strong>
                                <span className="sub" title={riskReason?.detail}>{riskReason?.detail}</span>
                              </span>
                            </span>
                          ) : (
                            <>
                              <span className="title" title={companyLabel}>{companyLabel}</span>
                              <span className="sub" title={sourceLabel}>{sourceLabel}</span>
                            </>
                          )}
                        </span>

                        <span className="lead-status-cell">
                          {historyView ? (
                            <span className="lead-history-reason-copy">
                              <strong title={historyOutcome?.reason}>{historyOutcome?.reason}</strong>
                              <span className="sub" title={historyOutcome?.detail}>{historyOutcome?.detail}</span>
                            </span>
                          ) : riskView ? (
                            <span className="lead-risk-next-move">
                              <span className="lead-risk-next-move-icon" data-cf-status-tone={nextActionMeta.overdue ? 'red' : nextAction ? 'blue' : 'amber'} aria-hidden="true">
                                <Clock3 className="h-4 w-4" />
                              </span>
                              <span className="lead-risk-next-move-copy">
                                <strong className={nextActionMeta.overdue ? 'danger cf-lead-next-action-title' : 'cf-lead-next-action-title'} title={nextAction ? nextActionMeta.title : 'Ustaw następny ruch'}>
                                  {nextAction ? nextActionMeta.title : 'Ustawić następny ruch'}
                                </strong>
                                <span className="sub" title={nextAction ? nextActionMeta.subtitle : 'Brak zaplanowanego działania'}>
                                  {nextAction ? nextActionMeta.subtitle : 'Brak zaplanowanego działania'}
                                </span>
                              </span>
                            </span>
                          ) : (
                            <span className="statusline">
                              <span className="cf-status-pill" data-cf-status-tone={leadStatusTone}>{leadStatusLabel}</span>
                              {linkedCase ? <span className="cf-status-pill" data-cf-status-tone="green">Sprawa</span> : null}
                              {operationalBadges.map((badge) => (
                                <span
                                  key={badge.id}
                                  className="cf-status-pill"
                                  data-cf-status-tone={badge.tone}
                                  data-stage222-r4-lead-operational-badge="true"
                                  title={badge.title}
                                >
                                  {badge.label}
                                </span>
                              ))}
                            </span>
                          )}
                        </span>

                        <span className="lead-value-cell" title={'Wartość: ' + leadValueLabel}>
                          <strong className="cf-list-row-value lead-card-value-pill" data-lead-value-pill="true">{leadValueLabel}</strong>
                        </span>

                        <span className="lead-last-contact-cell">
                          {historyView ? (
                            <>
                              <span className="mini">Data zamknięcia</span>
                              <strong>{formatLeadTableDate(historyCloseAt, 'Brak daty zamknięcia')}</strong>
                            </>
                          ) : riskView ? (
                            <>
                              <strong className={`lead-risk-relative-value lead-risk-relative-value-${riskContact.tone}`}>{riskContact.label}</strong>
                              <span className="mini">{riskContact.detail}</span>
                            </>
                          ) : (
                            <>
                              <span className="mini">Ostatni kontakt</span>
                              <strong>{formatLeadTableDate(lead.lastContactAt)}</strong>
                            </>
                          )}
                        </span>

                        <span className="lead-action-cell">
                          {historyView ? (
                            <>
                              <span className="mini">Ostatni kontakt</span>
                              <strong>{formatLeadTableDate(lead.lastContactAt)}</strong>
                            </>
                          ) : riskView ? null : (
                            <>
                              <span className="mini">Następny krok</span>
                              <strong className={nextActionMeta.overdue ? 'danger cf-lead-next-action-title' : 'cf-lead-next-action-title'} title={nextActionMeta.title}>{nextActionMeta.title}</strong>
                            </>
                          )}
                        </span>

                        <span className="lead-due-cell">
                          {historyView ? (
                            <>
                              <span className="mini">Powiązana sprawa</span>
                              <strong title={historyCaseLabel}>{historyCaseLabel}</strong>
                            </>
                          ) : riskView ? (
                            <>
                              <strong className={`lead-risk-relative-value lead-risk-relative-value-${riskDue.tone}`}>{riskDue.label}</strong>
                              <span className="mini">{riskDue.detail}</span>
                            </>
                          ) : (
                            <>
                              <span className="mini">Termin</span>
                              <strong>{nextAction?.at ? formatLeadTableDate(nextAction.at, '—') : '—'}</strong>
                            </>
                          )}
                        </span>

                        <span className="lead-risk-cell">
                          <span className="mini">Ryzyko</span>
                          <span className="cf-status-pill" data-cf-status-tone={lead.isAtRisk ? 'red' : 'green'}>
                            {lead.isAtRisk ? 'Wysokie' : 'Niskie'}
                          </span>
                        </span>

                        <span className="lead-owner-cell">
                          <span className="mini">Właściciel</span>
                          <strong title={ownerLabel}>{ownerLabel}</strong>
                        </span>

                        <span className="lead-actions">
                          <span className="btn ghost" aria-hidden="true">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                          <button
                            type="button"
                            className={actionIconClass('danger', 'btn ghost lead-icon-btn')}
                            disabled={pending}
                            onClick={(event) => (showTrash ? handleRestoreLead(event, lead) : handleArchiveLead(event, lead))}
                            aria-label={showTrash ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                            title={showTrash ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                          >
                            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : showTrash ? <RotateCcw className="h-4 w-4" /> : <DeleteActionIcon className="h-4 w-4" />}
                          </button>
                        </span>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="row row-empty">
                  <span className="index">0</span>
                  <span>
                    <span className="title">{showTrash ? 'Kosz leadów jest pusty.' : historyView ? 'Brak leadów w historii' : 'Brak leadów w tym widoku'}</span>
                    <span className="sub">{showTrash ? 'Nie ma rekordów do przywrócenia.' : historyView ? 'Brak zamkniętych, wygranych lub przeniesionych leadów w bieżącym źródle danych.' : 'Zmień filtr albo dodaj pierwszego leada.'}</span>
                  </span>
                </div>
              )}
              {!loading && !workspaceLoading && !loadError ? (
                <div className="leads-table-footer" data-frt004-leads-pagination="true">
                  <span>
                    {filteredLeads.length ? `${(leadPage - 1) * leadPageSize + 1}–${Math.min(leadPage * leadPageSize, filteredLeads.length)}` : '0'} z {filteredLeads.length} leadów
                  </span>
                  <div className="leads-pagination-controls">
                    <button
                      type="button"
                      className="leads-pagination-button"
                      onClick={() => setLeadPage((currentPage) => Math.max(1, currentPage - 1))}
                      disabled={leadPage <= 1}
                      aria-label="Poprzednia strona"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="leads-pagination-current">{leadPage}</span>
                    <button
                      type="button"
                      className="leads-pagination-button"
                      onClick={() => setLeadPage((currentPage) => Math.min(leadPageCount, currentPage + 1))}
                      disabled={leadPage >= leadPageCount}
                      aria-label="Następna strona"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <span className="leads-page-size">20 / strona</span>
                  </div>
                </div>
              ) : null}
            </div>) : null}
          </div>

        </div>
      </div>


        <ConfirmDialog
          open={Boolean(leadArchiveConfirmStage220A29)}
          onOpenChange={(open) => {
            if (!open && !archivePendingId) setLeadArchiveConfirmStage220A29(null);
          }}
          title="Przenieść leada do kosza?"
          description={
            leadArchiveConfirmStage220A29?.linkedCase
              ? 'Lead ' + (leadArchiveConfirmStage220A29?.lead?.name || 'Lead') + ' ma powiązaną sprawę: ' + (leadArchiveConfirmStage220A29.linkedCase.title || leadArchiveConfirmStage220A29.linkedCase.id) + '. Rekord zniknie z aktywnej listy, ale nie zostanie trwale skasowany.'
              : 'Lead ' + (leadArchiveConfirmStage220A29?.lead?.name || 'Lead') + ' zniknie z aktywnej listy, ale będzie można go przywrócić z kosza.'
          }
          confirmLabel="Przenieś do kosza"
          cancelLabel="Anuluj"
          confirmTone="destructive"
          pending={Boolean(archivePendingId)}
          onConfirm={() => leadArchiveConfirmStage220A29 ? executeArchiveLeadStage220A29(leadArchiveConfirmStage220A29.lead) : undefined}
        />

        <ConfirmDialog
          open={Boolean(leadRestoreConfirmStage220A29)}
          onOpenChange={(open) => {
            if (!open && !archivePendingId) setLeadRestoreConfirmStage220A29(null);
          }}
          title="Przywrócić leada?"
          description={
            leadRestoreConfirmStage220A29?.linkedCase
              ? 'Lead ' + (leadRestoreConfirmStage220A29?.lead?.name || 'Lead') + ' ma powiązaną sprawę: ' + (leadRestoreConfirmStage220A29.linkedCase.title || leadRestoreConfirmStage220A29.linkedCase.id) + '. Zostanie przywrócony z zachowaniem powiązania.'
              : 'Lead ' + (leadRestoreConfirmStage220A29?.lead?.name || 'Lead') + ' wróci do aktywnej listy leadów.'
          }
          confirmLabel="Przywróć leada"
          cancelLabel="Anuluj"
          confirmTone="default"
          pending={Boolean(archivePendingId)}
          onConfirm={() => leadRestoreConfirmStage220A29 ? executeRestoreLeadStage220A29(leadRestoreConfirmStage220A29.lead) : undefined}
        />

        <span hidden data-frt009-trash-restore-confirm="true" />

        <span hidden data-stage220a29-lead-trash-confirm="true" />

        <ConfirmDialog
          open={Boolean(conflictArchiveConfirmStage220A29)}
          onOpenChange={(open) => {
            if (!open && !leadSubmitting) setConflictArchiveConfirmStage220A29(null);
          }}
          title="Przenieść rekord do kosza?"
          description={'Rekord ' + (conflictArchiveConfirmStage220A29?.label || 'bez nazwy') + ' zniknie z aktywnej listy, ale będzie można go przywrócić z kosza.'}
          confirmLabel="Przenieś do kosza"
          cancelLabel="Anuluj"
          confirmTone="destructive"
          pending={leadSubmitting}
          onConfirm={() => conflictArchiveConfirmStage220A29 ? executeArchiveConflictCandidateStage220A29(conflictArchiveConfirmStage220A29) : undefined}
        />

        <span hidden data-stage220a29-conflict-trash-confirm="true" />

        <div data-closeflow-lead-conflict-dialog-v25="true">
          <EntityConflictDialog
            open={leadConflictOpen}
            variant="forteca-lead-duplicate"
            draft={leadConflictPendingInput}
            candidates={leadConflictCandidates.map((candidate) => candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate)}
            onOpenChange={(open) => {
              setLeadConflictOpen(open);
              if (!open) {
                setLeadConflictPendingInput(null);
                setLeadConflictCandidates([]);
              }
            }}
            onShow={handleShowConflictCandidate}
            onRestore={restoreConflictCandidate}
            onDeleteCandidate={handleArchiveConflictCandidate}
            onCreateAnyway={handleCreateLeadAnyway}
            onCancel={() => {
              setLeadConflictOpen(false);
              setLeadConflictPendingInput(null);
              setLeadConflictCandidates([]);
            }}
            busy={leadSubmitting}
            createAnywayLabel="Dodaj mimo to"
          />
        </div>
</Layout>
  );
}

/* PHASE0_STAT_CARD_PAGE_GUARD StatShortcutCard onClick= toggleQuickFilter('active') toggleValueSorting */

/* GLOBAL_QUICK_ACTIONS_STAGE08D_LEAD_MODAL_EVENT_BUS */

/*
CLOSEFLOW_REPAIR12_STAGE32_VALUE_MARKERS
relationValueEntries.slice(0, 5)
Najcenniejsze relacje
data-relation-value-board="true"
*/
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-structure-lock.css
// LF-UI-SOT-007 canonical header owner marker: closeflow-page-header-copy-left-only.css
