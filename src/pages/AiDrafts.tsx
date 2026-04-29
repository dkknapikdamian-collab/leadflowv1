import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Clipboard,
  FileText,
  Loader2,
  Pencil,
  Search,
  Sparkles,
  Target,
  Trash2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { EVENT_TYPES, PRIORITY_OPTIONS, SOURCE_OPTIONS, TASK_TYPES } from '../lib/options';
import {
  archiveAiLeadDraftAsync,
  deleteAiLeadDraftAsync,
  getAiLeadDraftsAsync,
  markAiLeadDraftConvertedAsync,
  updateAiLeadDraftAsync,
  type AiLeadDraft,
  type AiLeadDraftStatus,
} from '../lib/ai-drafts';
import {
  buildAiDraftApprovalForm,
  getAiDraftApprovalTypeLabel,
  normalizeAiDraftApprovalAmount,
  type AiDraftApprovalForm,
  type AiDraftApprovalType,
} from '../lib/ai-draft-approval';
import {
  insertActivityToSupabase,
  insertEventToSupabase,
  createLeadFromAiDraftApprovalInSupabase,
  insertTaskToSupabase,
  fetchClientsFromSupabase,
  fetchLeadsFromSupabase,
  fetchCasesFromSupabase,
} from '../lib/supabase-fallback';
import '../styles/visual-stage9-ai-drafts-vnext.css';

type DraftFilter =
  | 'all'
  | 'draft'
  | 'lead'
  | 'task'
  | 'event'
  | 'note'
  | 'errors'
  | 'converted'
  | 'archived';

type AiDraftRelationKind = 'lead' | 'case' | 'client';

type AiDraftRelationOption = {
  id: string;
  label: string;
  helper: string;
  search: string;
};

const approvalInputClass = 'ai-drafts-approval-input';
const approvalSelectClass = approvalInputClass;

const approvalTypeOptions: { value: AiDraftApprovalType; label: string; helper: string }[] = [
  { value: 'lead', label: 'Lead', helper: 'Nowy kontakt sprzedażowy w lejku.' },
  { value: 'task', label: 'Zadanie', helper: 'Prawdziwe zadanie widoczne w Dziś i kalendarzu.' },
  { value: 'event', label: 'Wydarzenie', helper: 'Prawdziwe wydarzenie widoczne w kalendarzu.' },
  { value: 'note', label: 'Notatka', helper: 'Notatka dopisana do historii powiązania.' },
];

const AI_DRAFT_FILTERS: { key: DraftFilter; label: string }[] = [
  { key: 'all', label: 'Wszystkie' },
  { key: 'draft', label: 'Do sprawdzenia' },
  { key: 'lead', label: 'Leady' },
  { key: 'task', label: 'Zadania' },
  { key: 'event', label: 'Wydarzenia' },
  { key: 'note', label: 'Notatki' },
  { key: 'errors', label: 'Błędy' },
  { key: 'converted', label: 'Zatwierdzone' },
  { key: 'archived', label: 'Anulowane' },
];

const AI_DRAFT_STAGE9_MARKER = 'AI_DRAFTS_VISUAL_REBUILD_STAGE9';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function firstText(source: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!source) return '';
  for (const key of keys) {
    const value = asText(source[key]);
    if (value) return value;
  }
  return '';
}

function getDraftParsedData(draft: AiLeadDraft) {
  const parsed = draft.parsedDraft || draft.parsedData || null;
  return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
}

function getDraftType(draft: AiLeadDraft): AiDraftApprovalType {
  if (draft.type === 'task' || draft.type === 'event' || draft.type === 'note' || draft.type === 'lead') {
    return draft.type;
  }
  return buildAiDraftApprovalForm(draft).recordType;
}

function getDraftTypeLabel(draft: AiLeadDraft) {
  const type = getDraftType(draft);
  if (type === 'task') return 'Zadanie';
  if (type === 'event') return 'Wydarzenie';
  if (type === 'note') return 'Notatka';
  return 'Lead';
}

function getDraftIcon(draft: AiLeadDraft) {
  const type = getDraftType(draft);
  if (type === 'task') return Clipboard;
  if (type === 'event') return CalendarClock;
  if (type === 'note') return FileText;
  return Target;
}

function getDraftStatusKey(draft: AiLeadDraft): 'draft' | 'converted' | 'archived' | 'errors' {
  const provider = asText(draft.provider).toLowerCase();
  const rawText = asText(draft.rawText);
  const parsed = getDraftParsedData(draft);

  if (draft.status === 'converted') return 'converted';
  if (draft.status === 'archived') return 'archived';
  if (provider.includes('fail') || provider.includes('error')) return 'errors';
  if (draft.status === 'draft' && !rawText && !parsed) return 'errors';

  return 'draft';
}

function getDraftStatusLabel(draft: AiLeadDraft) {
  const status = getDraftStatusKey(draft);
  if (status === 'converted') return 'Zatwierdzony';
  if (status === 'archived') {
    if (draft.cancelledAt) return 'Anulowany';
    if (draft.expiresAt && new Date(draft.expiresAt).getTime() < Date.now()) return 'Wygasł';
    return 'Anulowany';
  }
  if (status === 'errors') return 'Błąd';
  return 'Do sprawdzenia';
}

function getDraftSourceLabel(draft: AiLeadDraft) {
  if (draft.source === 'today_assistant') return 'Asystent AI';
  if (draft.source === 'quick_capture') return 'Quick Lead Capture';

  const provider = asText(draft.provider).toLowerCase();
  if (provider.includes('rule') || provider.includes('parser')) return 'Parser tekstu';
  if (provider.includes('quick')) return 'Szybki szkic';
  if (provider.includes('gemini') || provider.includes('cloudflare') || provider.includes('ai')) return 'Asystent AI';

  return 'Szybki szkic';
}

function parseDate(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function isSameCalendarDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isYesterday(value: Date, now: Date) {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameCalendarDay(value, yesterday);
}

function formatDraftDate(value: string) {
  const parsed = parseDate(value);
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

function shortPreview(value: unknown) {
  const text = asText(value).replace(/\s+/g, ' ');
  if (!text) return 'Brak krótkiego opisu. Otwórz szkic, żeby sprawdzić szczegóły.';
  return text.length > 170 ? text.slice(0, 167) + '...' : text;
}

function getDraftTitle(draft: AiLeadDraft) {
  const parsed = getDraftParsedData(draft);
  const typeLabel = getDraftTypeLabel(draft);
  const title = firstText(parsed, ['title', 'name', 'contactName', 'clientName', 'summary', 'need']);
  if (title) return typeLabel + ': ' + title;

  const approval = buildAiDraftApprovalForm(draft);
  if (approval.title && approval.title !== 'Nowy rekord ze szkicu AI') return typeLabel + ': ' + approval.title;
  if (approval.name) return typeLabel + ': ' + approval.name;

  return 'Szkic bez tytułu';
}

function getDraftDescription(draft: AiLeadDraft) {
  const parsed = getDraftParsedData(draft);
  const description = firstText(parsed, ['description', 'body', 'note', 'need', 'summary']);
  if (description) return shortPreview(description);
  return shortPreview(draft.rawText);
}

function draftHasMissingData(draft: AiLeadDraft) {
  const parsed = getDraftParsedData(draft);
  const missing = parsed?.missingFields;
  if (Array.isArray(missing) && missing.length > 0) return true;
  if (getDraftStatusKey(draft) === 'errors') return true;
  const form = buildAiDraftApprovalForm(draft);
  if (form.recordType === 'lead' && !form.name) return true;
  if ((form.recordType === 'task' || form.recordType === 'event') && !form.title) return true;
  return false;
}

function matchesDraftSearch(draft: AiLeadDraft, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const form = buildAiDraftApprovalForm(draft);
  return [
    draft.rawText,
    getDraftTitle(draft),
    getDraftDescription(draft),
    getDraftTypeLabel(draft),
    getDraftStatusLabel(draft),
    getDraftSourceLabel(draft),
    form.name,
    form.title,
    form.company,
    form.phone,
    form.email,
    form.source,
    form.scheduledAt,
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

function shouldShowByFilter(draft: AiLeadDraft, filter: DraftFilter) {
  if (filter === 'all') return true;
  if (filter === 'errors') return draftHasMissingData(draft) || getDraftStatusKey(draft) === 'errors';
  if (filter === 'draft' || filter === 'converted' || filter === 'archived') return getDraftStatusKey(draft) === filter;
  return getDraftType(draft) === filter;
}

function firstAiDraftRelationText(entry: any, keys: string[]) {
  for (const key of keys) {
    const value = entry?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return '';
}

function buildAiDraftRelationOption(entry: any, kind: AiDraftRelationKind): AiDraftRelationOption | null {
  const id = firstAiDraftRelationText(entry, ['id']);
  if (!id) return null;

  const label =
    kind === 'case'
      ? firstAiDraftRelationText(entry, ['title', 'name', 'caseName']) || 'Sprawa bez nazwy'
      : firstAiDraftRelationText(entry, ['name', 'company', 'title', 'email', 'phone']) ||
        (kind === 'lead' ? 'Lead bez nazwy' : 'Klient bez nazwy');

  const helperParts = [
    firstAiDraftRelationText(entry, ['company', 'clientName', 'name']),
    firstAiDraftRelationText(entry, ['email']),
    firstAiDraftRelationText(entry, ['phone']),
    firstAiDraftRelationText(entry, ['status']),
    firstAiDraftRelationText(entry, ['source']),
  ].filter((value, index, array) => value && array.indexOf(value) === index && value !== label);

  const helper = helperParts.slice(0, 3).join(' · ') || 'Rekord z bazy aplikacji';
  const search = [id, label, helper, firstAiDraftRelationText(entry, ['clientId', 'leadId', 'caseId'])]
    .join(' ')
    .toLowerCase();

  return { id, label, helper, search };
}

function buildAiDraftRelationOptions(rows: any[], kind: AiDraftRelationKind) {
  const seen = new Set<string>();
  return (Array.isArray(rows) ? rows : [])
    .map((entry) => buildAiDraftRelationOption(entry, kind))
    .filter((entry): entry is AiDraftRelationOption => {
      if (!entry || seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'pl'));
}

function filterAiDraftRelationOptions(options: AiDraftRelationOption[], query: string, selectedId: string) {
  const normalized = String(query || '').trim().toLowerCase();
  const filtered = normalized ? options.filter((option) => option.search.includes(normalized)) : options;
  const selected = selectedId ? options.find((option) => option.id === selectedId) : null;
  const withoutSelected = selected ? filtered.filter((option) => option.id !== selected.id) : filtered;
  return (selected ? [selected, ...withoutSelected] : withoutSelected).slice(0, 8);
}

function getAiDraftRelationSelectedLabel(options: AiDraftRelationOption[], selectedId: string) {
  if (!selectedId) return 'Brak powiązania';
  const selected = options.find((option) => option.id === selectedId);
  return selected ? selected.label : 'Wybrany rekord z bazy';
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
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={['ai-drafts-stat-card', active ? 'ai-drafts-stat-card-active' : ''].join(' ')}>
      <span className="ai-drafts-stat-content">
        <span className="ai-drafts-stat-label">{label}</span>
        <span className="ai-drafts-stat-value">{value}</span>
      </span>
      <span className="ai-drafts-stat-icon" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </span>
    </button>
  );
}

export default function AiDrafts() {
  const [drafts, setDrafts] = useState<AiLeadDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DraftFilter>('draft');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [approvalDraftId, setApprovalDraftId] = useState<string | null>(null);
  const [approvalForm, setApprovalForm] = useState<AiDraftApprovalForm | null>(null);
  const [approvalSaving, setApprovalSaving] = useState(false);
  const [approvalClients, setApprovalClients] = useState<any[]>([]);
  const [approvalLeads, setApprovalLeads] = useState<any[]>([]);
  const [approvalCases, setApprovalCases] = useState<any[]>([]);
  const [approvalRelationsLoading, setApprovalRelationsLoading] = useState(false);
  const [approvalRelationSearch, setApprovalRelationSearch] = useState<Record<AiDraftRelationKind, string>>({
    lead: '',
    case: '',
    client: '',
  });

  const reloadDrafts = async () => {
    setDraftsLoading(true);
    try {
      setDrafts(await getAiLeadDraftsAsync());
    } finally {
      setDraftsLoading(false);
    }
  };

  useEffect(() => {
    void reloadDrafts();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setApprovalRelationsLoading(true);

    Promise.all([
      fetchClientsFromSupabase().catch(() => []),
      fetchLeadsFromSupabase().catch(() => []),
      fetchCasesFromSupabase().catch(() => []),
    ])
      .then(([clientRows, leadRows, caseRows]) => {
        if (cancelled) return;
        setApprovalClients(Array.isArray(clientRows) ? clientRows : []);
        setApprovalLeads(Array.isArray(leadRows) ? leadRows : []);
        setApprovalCases(Array.isArray(caseRows) ? caseRows : []);
      })
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setApprovalRelationsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    return {
      draft: drafts.filter((entry) => getDraftStatusKey(entry) === 'draft').length,
      leads: drafts.filter((entry) => getDraftType(entry) === 'lead').length,
      tasks: drafts.filter((entry) => getDraftType(entry) === 'task').length,
      events: drafts.filter((entry) => getDraftType(entry) === 'event').length,
      errors: drafts.filter((entry) => draftHasMissingData(entry) || getDraftStatusKey(entry) === 'errors').length,
      converted: drafts.filter((entry) => getDraftStatusKey(entry) === 'converted').length,
      archived: drafts.filter((entry) => getDraftStatusKey(entry) === 'archived').length,
      total: drafts.length,
    };
  }, [drafts]);

  const filterCounts = useMemo(() => {
    return AI_DRAFT_FILTERS.reduce<Record<string, number>>((acc, filter) => {
      acc[filter.key] = drafts.filter((draft) => shouldShowByFilter(draft, filter.key)).length;
      return acc;
    }, {});
  }, [drafts]);

  const filteredDrafts = useMemo(() => {
    return drafts.filter((draft) => shouldShowByFilter(draft, activeFilter) && matchesDraftSearch(draft, searchQuery));
  }, [activeFilter, drafts, searchQuery]);

  const approvalClientOptions = useMemo(() => buildAiDraftRelationOptions(approvalClients, 'client'), [approvalClients]);
  const approvalLeadOptions = useMemo(() => buildAiDraftRelationOptions(approvalLeads, 'lead'), [approvalLeads]);
  const approvalCaseOptions = useMemo(() => buildAiDraftRelationOptions(approvalCases, 'case'), [approvalCases]);

  const recentConverted = useMemo(
    () => drafts.filter((draft) => getDraftStatusKey(draft) === 'converted').slice(0, 4),
    [drafts],
  );

  const draftsWithGaps = useMemo(
    () => drafts.filter((draft) => draftHasMissingData(draft) || getDraftStatusKey(draft) === 'errors').slice(0, 4),
    [drafts],
  );

  const openDraftApproval = (draft: AiLeadDraft) => {
    setActiveDraftId(draft.id);
    setApprovalDraftId(draft.id);
    setApprovalForm(buildAiDraftApprovalForm(draft));
  };

  const closeDraftApproval = () => {
    setApprovalDraftId(null);
    setApprovalForm(null);
  };

  const updateApprovalForm = (patch: Partial<AiDraftApprovalForm>) => {
    setApprovalForm((current) => (current ? { ...current, ...patch } : current));
  };

  const handleApprovalRecordTypeChange = (draft: AiLeadDraft, nextType: AiDraftApprovalType) => {
    const rebuilt = buildAiDraftApprovalForm({ ...draft, type: nextType });
    setApprovalForm((current) => ({
      ...rebuilt,
      recordType: nextType,
      leadId: current?.leadId || rebuilt.leadId,
      caseId: current?.caseId || rebuilt.caseId,
      clientId: current?.clientId || rebuilt.clientId,
    }));
  };

  const buildConvertedActivityPayload = (draft: AiLeadDraft, form: AiDraftApprovalForm, createdRecord: Record<string, unknown>) => ({
    source: 'ai_draft_approval',
    draftId: draft.id,
    recordType: form.recordType,
    title: form.title || form.name,
    createdRecordId: createdRecord?.id || null,
  });

  const handleApproveDraftToRecord = async (draft: AiLeadDraft) => {
    if (!approvalForm || approvalDraftId !== draft.id) {
      openDraftApproval(draft);
      return;
    }

    const form = approvalForm;
    const title = String(form.title || '').trim();
    const name = String(form.name || form.title || '').trim();
    const body = String(form.body || draft.rawText || '').trim();

    if (form.recordType === 'lead' && !name) {
      toast.error('Podaj nazwę leada przed zatwierdzeniem');
      return;
    }
    if ((form.recordType === 'task' || form.recordType === 'event') && !title) {
      toast.error('Podaj tytuł przed zatwierdzeniem');
      return;
    }
    if (form.recordType === 'event' && !form.scheduledAt) {
      toast.error('Podaj termin wydarzenia przed zatwierdzeniem');
      return;
    }
    if (form.recordType === 'note' && !body) {
      toast.error('Notatka nie może być pusta');
      return;
    }

    setApprovalSaving(true);
    try {
      let createdRecord: Record<string, unknown> = {};

      if (form.recordType === 'lead') {
        createdRecord = await createLeadFromAiDraftApprovalInSupabase({
          name,
          company: form.company || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          source: form.source || 'ai_draft',
          dealValue: normalizeAiDraftApprovalAmount(form.dealValue),
          nextActionAt: form.scheduledAt || undefined,
        });
      } else if (form.recordType === 'task') {
        createdRecord = await insertTaskToSupabase({
          title,
          type: form.taskType || 'follow_up',
          date: form.scheduledAt ? form.scheduledAt.slice(0, 10) : undefined,
          scheduledAt: form.scheduledAt || undefined,
          dueAt: form.scheduledAt || undefined,
          priority: form.priority || 'medium',
          status: 'todo',
          leadId: form.leadId || null,
          caseId: form.caseId || null,
          clientId: form.clientId || null,
        });
      } else if (form.recordType === 'event') {
        const startAt = form.scheduledAt;
        const endAt = form.endAt || form.scheduledAt;
        createdRecord = await insertEventToSupabase({
          title,
          type: form.eventType || 'meeting',
          startAt,
          endAt,
          status: 'scheduled',
          leadId: form.leadId || null,
          caseId: form.caseId || null,
          clientId: form.clientId || null,
        });
      } else {
        createdRecord = await insertActivityToSupabase({
          leadId: form.leadId || null,
          caseId: form.caseId || null,
          actorType: 'operator',
          eventType: 'ai_note_approved',
          payload: {
            note: body,
            title: title || 'Notatka AI',
            clientId: form.clientId || null,
            source: 'ai_draft_approval',
            draftId: draft.id,
          },
        });
      }

      await insertActivityToSupabase({
        leadId: form.recordType === 'lead' ? String((createdRecord as any)?.id || '') || null : form.leadId || null,
        caseId: form.caseId || null,
        actorType: 'operator',
        eventType: 'ai_draft_converted',
        payload: buildConvertedActivityPayload(draft, form, createdRecord),
      }).catch(() => null);

      await markAiLeadDraftConvertedAsync(draft.id);
      closeDraftApproval();
      setActiveDraftId(null);
      await reloadDrafts();
      toast.success(getAiDraftApprovalTypeLabel(form.recordType) + ' przeniesiony ze szkicu AI');
    } catch (error: any) {
      toast.error('Nie udało się zatwierdzić szkicu: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setApprovalSaving(false);
    }
  };

  const handleArchive = async (draft: AiLeadDraft) => {
    await archiveAiLeadDraftAsync(draft.id);
    await updateAiLeadDraftAsync(draft.id, { rawText: '' }).catch(() => null);
    await reloadDrafts();
    toast.success('Szkic anulowany');
  };

  const handleDelete = async (draft: AiLeadDraft) => {
    const confirmed = window.confirm('Usunąć szkic AI? Tej operacji nie będzie można cofnąć.');
    if (!confirmed) return;
    await deleteAiLeadDraftAsync(draft.id);
    await reloadDrafts();
    toast.success('Szkic usunięty');
  };

  const handleStartEdit = (draft: AiLeadDraft) => {
    setActiveDraftId(draft.id);
    setEditingDraftId(draft.id);
    setEditingText(draft.rawText || '');
  };

  const handleCancelEdit = () => {
    setEditingDraftId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (draft: AiLeadDraft) => {
    const nextText = editingText.trim();
    if (!nextText) {
      toast.error('Szkic nie może być pusty');
      return;
    }
    await updateAiLeadDraftAsync(draft.id, { rawText: nextText });
    handleCancelEdit();
    await reloadDrafts();
    toast.success('Szkic zaktualizowany');
  };

  const handleCopyDraftText = async (draft: AiLeadDraft) => {
    try {
      if (!navigator?.clipboard) throw new Error('NO_CLIPBOARD');
      await navigator.clipboard.writeText(draft.rawText || '');
      toast.success('Treść szkicu skopiowana');
    } catch {
      toast.error('Nie udało się skopiować treści. Zaznacz ją ręcznie.');
    }
  };

  const renderApprovalRelationPicker = (
    kind: AiDraftRelationKind,
    label: string,
    options: AiDraftRelationOption[],
    selectedId: string,
    field: 'leadId' | 'caseId' | 'clientId',
  ) => {
    const searchValue = approvalRelationSearch[kind] || '';
    const visibleOptions = filterAiDraftRelationOptions(options, searchValue, selectedId);

    return (
      <div className="ai-drafts-relation-picker" data-ai-draft-relation-picker={kind}>
        <div className="ai-drafts-relation-picker-head">
          <div>
            <p>{label}</p>
            <strong>{getAiDraftRelationSelectedLabel(options, selectedId)}</strong>
          </div>
          {selectedId ? (
            <button type="button" onClick={() => updateApprovalForm({ [field]: '' } as Partial<AiDraftApprovalForm>)}>
              Wyczyść
            </button>
          ) : null}
        </div>

        <Input
          className={approvalInputClass}
          value={searchValue}
          onChange={(event) => setApprovalRelationSearch((current) => ({ ...current, [kind]: event.target.value }))}
          placeholder={
            kind === 'lead'
              ? 'Szukaj leada po nazwie, telefonie lub emailu'
              : kind === 'case'
                ? 'Szukaj sprawy po nazwie lub statusie'
                : 'Szukaj klienta po nazwie, telefonie lub emailu'
          }
          data-ai-draft-relation-search={kind}
        />

        <div className="ai-drafts-relation-options">
          {approvalRelationsLoading ? <p className="ai-drafts-relation-empty">Ładuję dane z bazy...</p> : null}
          {!approvalRelationsLoading && visibleOptions.length === 0 ? (
            <p className="ai-drafts-relation-empty">Brak wyniku. Zmień wyszukiwanie albo zostaw bez powiązania.</p>
          ) : null}
          {visibleOptions.map((option) => {
            const active = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={['ai-drafts-relation-option', active ? 'ai-drafts-relation-option-active' : ''].join(' ')}
                onClick={() => {
                  updateApprovalForm({ [field]: option.id } as Partial<AiDraftApprovalForm>);
                  setApprovalRelationSearch((current) => ({ ...current, [kind]: option.label }));
                }}
                data-ai-draft-relation-option={kind}
              >
                <span>{option.label}</span>
                <small>{option.helper}</small>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderApprovalPanel = (draft: AiLeadDraft) => {
    if (approvalDraftId !== draft.id || !approvalForm) return null;

    const recordType = approvalForm.recordType;

    return (
      <div className="ai-drafts-approval-panel" data-ai-draft-approval-panel="true" data-ai-draft-real-transfer-form="true">
        <div className="ai-drafts-detail-titlebar">
          <div>
            <h3>Sprawdź szkic przed zapisem</h3>
            <p>Nic nie zostanie zapisane, dopóki tego nie zatwierdzisz.</p>
          </div>
          <span>{getAiDraftApprovalTypeLabel(recordType)}</span>
        </div>

        <div className="ai-drafts-transfer-targets" data-ai-draft-transfer-target-selector="true">
          {approvalTypeOptions.map((option) => {
            const active = recordType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={['ai-drafts-transfer-target', active ? 'ai-drafts-transfer-target-active' : ''].join(' ')}
                onClick={() => handleApprovalRecordTypeChange(draft, option.value)}
              >
                <span>{option.label}</span>
                <small>{option.helper}</small>
              </button>
            );
          })}
        </div>

        {recordType === 'lead' ? (
          <div className="ai-drafts-form-grid">
            <label>Kontakt<Input className={approvalInputClass} value={approvalForm.name} onChange={(event) => updateApprovalForm({ name: event.target.value })} /></label>
            <label>Firma<Input className={approvalInputClass} value={approvalForm.company} onChange={(event) => updateApprovalForm({ company: event.target.value })} /></label>
            <label>Telefon<Input className={approvalInputClass} value={approvalForm.phone} onChange={(event) => updateApprovalForm({ phone: event.target.value })} /></label>
            <label>E-mail<Input className={approvalInputClass} value={approvalForm.email} onChange={(event) => updateApprovalForm({ email: event.target.value })} /></label>
            <label>Źródło<select className={approvalSelectClass} value={approvalForm.source} onChange={(event) => updateApprovalForm({ source: event.target.value })}>{SOURCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>Priorytet<select className={approvalSelectClass} value={approvalForm.priority} onChange={(event) => updateApprovalForm({ priority: event.target.value })}>{PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>Wartość<Input className={approvalInputClass} value={approvalForm.dealValue} onChange={(event) => updateApprovalForm({ dealValue: event.target.value })} /></label>
            <label>Termin / akcja<Input type="datetime-local" className={approvalInputClass} value={approvalForm.scheduledAt} onChange={(event) => updateApprovalForm({ scheduledAt: event.target.value })} /></label>
          </div>
        ) : null}

        {recordType === 'task' ? (
          <div className="ai-drafts-form-grid">
            <label className="ai-drafts-form-wide">Tytuł<Input className={approvalInputClass} value={approvalForm.title} onChange={(event) => updateApprovalForm({ title: event.target.value })} /></label>
            <label>Typ zadania<select className={approvalSelectClass} value={approvalForm.taskType} onChange={(event) => updateApprovalForm({ taskType: event.target.value })}>{TASK_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>Termin<Input type="datetime-local" className={approvalInputClass} value={approvalForm.scheduledAt} onChange={(event) => updateApprovalForm({ scheduledAt: event.target.value })} /></label>
            <label>Priorytet<select className={approvalSelectClass} value={approvalForm.priority} onChange={(event) => updateApprovalForm({ priority: event.target.value })}>{PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>
        ) : null}

        {recordType === 'event' ? (
          <div className="ai-drafts-form-grid">
            <label className="ai-drafts-form-wide">Tytuł<Input className={approvalInputClass} value={approvalForm.title} onChange={(event) => updateApprovalForm({ title: event.target.value })} /></label>
            <label>Typ wydarzenia<select className={approvalSelectClass} value={approvalForm.eventType} onChange={(event) => updateApprovalForm({ eventType: event.target.value })}>{EVENT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label>Start<Input type="datetime-local" className={approvalInputClass} value={approvalForm.scheduledAt} onChange={(event) => updateApprovalForm({ scheduledAt: event.target.value })} /></label>
            <label>Koniec<Input type="datetime-local" className={approvalInputClass} value={approvalForm.endAt} onChange={(event) => updateApprovalForm({ endAt: event.target.value })} /></label>
          </div>
        ) : null}

        {recordType === 'note' ? (
          <div className="ai-drafts-form-stack">
            <label>Tytuł notatki<Input className={approvalInputClass} value={approvalForm.title} onChange={(event) => updateApprovalForm({ title: event.target.value })} /></label>
            <label>Treść notatki<Textarea className="ai-drafts-approval-textarea" value={approvalForm.body} onChange={(event) => updateApprovalForm({ body: event.target.value })} /></label>
          </div>
        ) : null}

        {recordType !== 'lead' ? (
          <div className="ai-drafts-relation-panel" data-ai-draft-relation-picker-panel="true">
            <div>
              <h4>Powiąż z istniejącym rekordem</h4>
              <p>Wybierz klienta, leada albo sprawę z bazy. Możesz też zostawić szkic bez powiązania.</p>
            </div>
            <div className="ai-drafts-relation-grid">
              {renderApprovalRelationPicker('lead', 'Lead', approvalLeadOptions, approvalForm.leadId, 'leadId')}
              {renderApprovalRelationPicker('case', 'Sprawa', approvalCaseOptions, approvalForm.caseId, 'caseId')}
              {renderApprovalRelationPicker('client', 'Klient', approvalClientOptions, approvalForm.clientId, 'clientId')}
            </div>
          </div>
        ) : null}

        <div className="ai-drafts-approval-actions">
          <Button type="button" size="sm" onClick={() => void handleApproveDraftToRecord(draft)} disabled={approvalSaving} data-ai-draft-approve-final-record="true" data-ai-draft-real-record-create="true">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {approvalSaving ? 'Przenoszę...' : 'Zatwierdź i zapisz'}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={closeDraftApproval} disabled={approvalSaving}>
            Anuluj zatwierdzanie
          </Button>
        </div>
      </div>
    );
  };

  const renderDraftDetail = (draft: AiLeadDraft) => {
    if (activeDraftId !== draft.id) return null;
    const form = buildAiDraftApprovalForm(draft);
    const parsed = getDraftParsedData(draft);
    const missing = parsed?.missingFields;
    const hasRawText = draft.status === 'draft' && Boolean(asText(draft.rawText));

    return (
      <div className="ai-drafts-detail-panel">
        <div className="ai-drafts-detail-titlebar">
          <div>
            <h3>Sprawdź szkic przed zapisem</h3>
            <p>Nic nie zostanie zapisane, dopóki tego nie zatwierdzisz.</p>
          </div>
          <span>{getDraftTypeLabel(draft)}</span>
        </div>

        <div className="ai-drafts-detail-grid">
          <div className="ai-drafts-detail-box">
            <p>Typ szkicu</p>
            <strong>{getDraftTypeLabel(draft)}</strong>
          </div>
          <div className="ai-drafts-detail-box">
            <p>Status</p>
            <strong>{getDraftStatusLabel(draft)}</strong>
          </div>
          <div className="ai-drafts-detail-box">
            <p>Źródło</p>
            <strong>{getDraftSourceLabel(draft)}</strong>
          </div>
          <div className="ai-drafts-detail-box">
            <p>Data</p>
            <strong>{formatDraftDate(draft.createdAt)}</strong>
          </div>
        </div>

        <div className="ai-drafts-recognized-card">
          <h4>Dane rozpoznane</h4>
          <dl>
            <div><dt>Kontakt / tytuł</dt><dd>{form.name || form.title || 'Brak danych'}</dd></div>
            <div><dt>Telefon</dt><dd>{form.phone || 'Brak danych'}</dd></div>
            <div><dt>E-mail</dt><dd>{form.email || 'Brak danych'}</dd></div>
            <div><dt>Źródło</dt><dd>{form.source || getDraftSourceLabel(draft)}</dd></div>
            <div><dt>Termin / akcja</dt><dd>{form.scheduledAt || 'Brak terminu'}</dd></div>
            <div><dt>Priorytet</dt><dd>{form.priority || 'Brak danych'}</dd></div>
          </dl>
        </div>

        <div className="ai-drafts-recognized-card">
          <h4>Brakujące pola</h4>
          {Array.isArray(missing) && missing.length > 0 ? (
            <div className="ai-drafts-missing-list">
              {missing.map((item) => <span key={String(item)}>{String(item)}</span>)}
            </div>
          ) : draftHasMissingData(draft) ? (
            <p className="ai-drafts-source-note">Szkic wymaga sprawdzenia, bo brakuje części danych do finalnego zapisu.</p>
          ) : (
            <p className="ai-drafts-source-note">Nie wykryto braków krytycznych.</p>
          )}
        </div>

        <div className="ai-drafts-recognized-card">
          <h4>Treść źródłowa</h4>
          {hasRawText ? (
            <p className="ai-drafts-source-text">{draft.rawText}</p>
          ) : (
            <p className="ai-drafts-source-note">Tekst źródłowy został usunięty po zakończeniu szkicu.</p>
          )}
        </div>

        {renderApprovalPanel(draft)}
      </div>
    );
  };

  const renderDraftRow = (draft: AiLeadDraft, index: number) => {
    const editing = editingDraftId === draft.id;
    const Icon = getDraftIcon(draft);
    const status = getDraftStatusKey(draft);

    return (
      <article key={draft.id} className="ai-drafts-row" data-testid="ai-draft-row">
        <div className="ai-drafts-row-grid">
          <div className={['ai-drafts-row-icon', 'ai-drafts-row-icon-' + getDraftType(draft)].join(' ')}>
            <Icon className="h-4 w-4" />
          </div>

          <div className="ai-drafts-row-main">
            <div className="ai-drafts-row-heading">
              <span className="ai-drafts-type-pill">{getDraftTypeLabel(draft)}</span>
              {draftHasMissingData(draft) ? <span className="ai-drafts-warning-pill">Błędy / niepełne</span> : null}
            </div>
            <h2>{getDraftTitle(draft)}</h2>
            <p>{getDraftDescription(draft)}</p>
          </div>

          <div className="ai-drafts-status-col">
            <span className={['ai-drafts-status-pill', 'ai-drafts-status-' + status].join(' ')}>{getDraftStatusLabel(draft)}</span>
          </div>

          <div className="ai-drafts-source-col">{getDraftSourceLabel(draft)}</div>
          <time className="ai-drafts-date-col">{formatDraftDate(draft.createdAt)}</time>

          <div className="ai-drafts-actions-col">
            {draft.status === 'draft' ? (
              <>
                <button type="button" className="ai-drafts-action ai-drafts-action-blue" onClick={() => setActiveDraftId(activeDraftId === draft.id ? null : draft.id)}>Sprawdź</button>
                <button type="button" className="ai-drafts-action" onClick={() => handleStartEdit(draft)}>Edytuj</button>
                <button type="button" className="ai-drafts-action ai-drafts-action-green" onClick={() => openDraftApproval(draft)}>Zatwierdź</button>
                <button type="button" className="ai-drafts-action ai-drafts-action-red" onClick={() => void handleArchive(draft)}>Anuluj</button>
              </>
            ) : (
              <>
                <button type="button" className="ai-drafts-action ai-drafts-action-blue" onClick={() => setActiveDraftId(activeDraftId === draft.id ? null : draft.id)}>Szczegóły</button>
                <button type="button" className="ai-drafts-action ai-drafts-action-red" onClick={() => void handleDelete(draft)}>Usuń</button>
              </>
            )}
            <span className="ai-drafts-row-index">{index + 1}</span>
          </div>
        </div>

        {editing ? (
          <div className="ai-drafts-inline-edit">
            <Textarea value={editingText} onChange={(event) => setEditingText(event.target.value)} />
            <div>
              <button type="button" className="ai-drafts-action ai-drafts-action-green" onClick={() => void handleSaveEdit(draft)}>Zapisz zmiany</button>
              <button type="button" className="ai-drafts-action" onClick={handleCancelEdit}>Anuluj edycję</button>
              <button type="button" className="ai-drafts-action" onClick={() => void handleCopyDraftText(draft)}>Kopiuj treść</button>
            </div>
          </div>
        ) : null}

        {renderDraftDetail(draft)}
      </article>
    );
  };

  return (
    <Layout>
      <main className="ai-drafts-vnext-page" data-ai-drafts-stage={AI_DRAFT_STAGE9_MARKER}>
        <header className="ai-drafts-page-header">
          <div>
            <p className="ai-drafts-kicker">SZKICE DO SPRAWDZENIA</p>
            <h1>Szkice AI</h1>
            <p>Rzeczy przygotowane przez asystenta. Sprawdź, popraw i dopiero wtedy zapisz.</p>
          </div>
          <div className="ai-drafts-header-actions">
            <button type="button" className="ai-drafts-header-button" onClick={() => void reloadDrafts()}>
              Odśwież
            </button>
          </div>
        </header>

        <section className="ai-drafts-stats-grid" aria-label="Statystyki szkiców AI">
          <MetricCard label="Do sprawdzenia" value={stats.draft} icon={Sparkles} active={activeFilter === 'draft'} onClick={() => setActiveFilter('draft')} />
          <MetricCard label="Leady" value={stats.leads} icon={Target} active={activeFilter === 'lead'} onClick={() => setActiveFilter('lead')} />
          <MetricCard label="Zadania" value={stats.tasks} icon={Clipboard} active={activeFilter === 'task'} onClick={() => setActiveFilter('task')} />
          <MetricCard label="Wydarzenia" value={stats.events} icon={CalendarClock} active={activeFilter === 'event'} onClick={() => setActiveFilter('event')} />
          <MetricCard label="Błędy / niepełne" value={stats.errors} icon={AlertTriangle} active={activeFilter === 'errors'} onClick={() => setActiveFilter('errors')} />
          <MetricCard label="Zatwierdzone" value={stats.converted} icon={CheckCircle2} active={activeFilter === 'converted'} onClick={() => setActiveFilter('converted')} />
        </section>

        <div className="ai-drafts-vnext-shell">
          <section className="ai-drafts-main-column">
            <div className="ai-drafts-toolbar-card">
              <div className="ai-drafts-filter-pills" aria-label="Filtry szkiców AI">
                {AI_DRAFT_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={['ai-drafts-filter-pill', activeFilter === filter.key ? 'ai-drafts-filter-pill-active' : ''].join(' ')}
                  >
                    <span>{filter.label}</span>
                    <strong>{filterCounts[filter.key] || 0}</strong>
                  </button>
                ))}
              </div>

              <label className="ai-drafts-search-box">
                <Search className="h-4 w-4" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Szukaj po treści, typie, kontakcie, leadzie albo terminie..."
                />
              </label>
            </div>

            <section className="ai-drafts-list-card" aria-label="Lista szkiców AI">
              <div className="ai-drafts-list-head">
                <div>
                  <p>Lista szkiców</p>
                  <h2>Do decyzji operatora</h2>
                </div>
                <span>{filteredDrafts.length} / {drafts.length}</span>
              </div>

              {draftsLoading ? (
                <div className="ai-drafts-loading-state">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Ładowanie szkiców...</p>
                </div>
              ) : filteredDrafts.length === 0 ? (
                <div className="ai-drafts-empty-state">
                  <Sparkles className="h-8 w-8" />
                  <h2>Brak szkiców do sprawdzenia</h2>
                  <p>Gdy asystent przygotuje lead, zadanie albo wydarzenie, zobaczysz je tutaj przed zapisem.</p>
                </div>
              ) : (
                <div className="ai-drafts-rows">
                  {filteredDrafts.map((draft, index) => renderDraftRow(draft, index))}
                </div>
              )}
            </section>
          </section>

          <aside className="ai-drafts-right-rail" aria-label="Skrót szkiców AI">
            <section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <Sparkles className="h-4 w-4" />
                <h2>Szybkie filtry</h2>
              </div>
              <button type="button" onClick={() => setActiveFilter('draft')} className="ai-drafts-rail-button">
                <span>Do sprawdzenia</span>
                <strong>{stats.draft}</strong>
              </button>
              <button type="button" onClick={() => setActiveFilter('errors')} className="ai-drafts-rail-button">
                <span>Braki do poprawy</span>
                <strong>{stats.errors}</strong>
              </button>
              <button type="button" onClick={() => setActiveFilter('converted')} className="ai-drafts-rail-button">
                <span>Zatwierdzone</span>
                <strong>{stats.converted}</strong>
              </button>
            </section>

            <section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <AlertTriangle className="h-4 w-4" />
                <h2>Braki do poprawy</h2>
              </div>
              {draftsWithGaps.length ? (
                <div className="ai-drafts-rail-list">
                  {draftsWithGaps.map((draft) => (
                    <button key={draft.id} type="button" className="ai-drafts-rail-item" onClick={() => setActiveDraftId(draft.id)}>
                      <span>{getDraftStatusLabel(draft)}</span>
                      <strong>{getDraftTitle(draft)}</strong>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="ai-drafts-rail-empty">Brak szkiców z widocznymi brakami.</p>
              )}
            </section>

            <section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <CheckCircle2 className="h-4 w-4" />
                <h2>Ostatnie zatwierdzone</h2>
              </div>
              {recentConverted.length ? (
                <div className="ai-drafts-rail-list">
                  {recentConverted.map((draft) => (
                    <button key={draft.id} type="button" className="ai-drafts-rail-item" onClick={() => setActiveDraftId(draft.id)}>
                      <span>{formatDraftDate(draft.convertedAt || draft.updatedAt || draft.createdAt)}</span>
                      <strong>{getDraftTitle(draft)}</strong>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="ai-drafts-rail-empty">Brak zatwierdzonych szkiców.</p>
              )}
            </section>

            <section className="right-card ai-drafts-right-card">
              <div className="ai-drafts-right-card-head">
                <Clock className="h-4 w-4" />
                <h2>Jak działa szkic?</h2>
              </div>
              <p className="ai-drafts-rail-empty">
                AI przygotowuje propozycję. Ty sprawdzasz dane, poprawiasz pola i dopiero wtedy zapisujesz finalny rekord.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
