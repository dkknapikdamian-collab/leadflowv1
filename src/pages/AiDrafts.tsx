import { useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, Clock, Clipboard, Pencil, Search, Sparkles, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
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

type DraftTab = AiLeadDraftStatus | 'all';

const approvalInputClass = 'h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
const approvalSelectClass = approvalInputClass;
const approvalTypeOptions: { value: AiDraftApprovalType; label: string; helper: string }[] = [
  { value: 'lead', label: 'Lead', helper: 'Nowy kontakt sprzedażowy w lejku.' },
  { value: 'task', label: 'Zadanie', helper: 'Prawdziwe zadanie widoczne w Dziś i kalendarzu.' },
  { value: 'event', label: 'Wydarzenie', helper: 'Prawdziwe wydarzenie widoczne w kalendarzu.' },
  { value: 'note', label: 'Notatka', helper: 'Notatka dopisana do historii powiązania.' },
];

/* AI_DRAFT_APPROVAL_TO_FINAL_RECORD_STAGE03 */
/* AI_DRAFT_REAL_TRANSFER_STAGE12 */
/* AI_DRAFT_RELATION_PICKER_STAGE24 */

const DRAFT_TABS: { key: DraftTab; label: string; helper: string }[] = [
  { key: 'draft', label: 'Do sprawdzenia', helper: 'Notatki, z których jeszcze nie powstał lead.' },
  { key: 'converted', label: 'Zatwierdzone', helper: 'Szkice już przerobione na leady.' },
  { key: 'archived', label: 'Archiwum', helper: 'Odłożone notatki bez kasowania historii.' },
  { key: 'all', label: 'Wszystkie', helper: 'Pełna historia szkiców AI.' },
];

function formatDraftDate(value: string) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return 'Brak daty';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sourceLabel(source: string) {
  if (source === 'today_assistant') return 'Asystent AI';
  if (source === 'quick_capture') return 'Szybki szkic';
  return 'Ręcznie';
}

function statusLabel(status: AiLeadDraftStatus) {
  if (status === 'converted') return 'Zatwierdzony';
  if (status === 'archived') return 'Archiwum';
  return 'Do sprawdzenia';
}

function statusBadgeClassName(status: AiLeadDraftStatus) {
  if (status === 'converted') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'archived') return 'border-slate-200 bg-slate-50 text-slate-600';
  return 'border-blue-200 bg-blue-50 text-blue-700';
}

function matchesDraftSearch(draft: AiLeadDraft, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [draft.rawText, sourceLabel(draft.source), statusLabel(draft.status)]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

type AiDraftRelationKind = 'lead' | 'case' | 'client';

type AiDraftRelationOption = {
  id: string;
  label: string;
  helper: string;
  search: string;
};

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

  const label = kind === 'case'
    ? firstAiDraftRelationText(entry, ['title', 'name', 'caseName']) || 'Sprawa bez nazwy'
    : firstAiDraftRelationText(entry, ['name', 'company', 'title', 'email', 'phone']) || (kind === 'lead' ? 'Lead bez nazwy' : 'Klient bez nazwy');

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
  const filtered = normalized
    ? options.filter((option) => option.search.includes(normalized))
    : options;

  const selected = selectedId ? options.find((option) => option.id === selectedId) : null;
  const withoutSelected = selected ? filtered.filter((option) => option.id !== selected.id) : filtered;
  return (selected ? [selected, ...withoutSelected] : withoutSelected).slice(0, 8);
}

function getAiDraftRelationSelectedLabel(options: AiDraftRelationOption[], selectedId: string) {
  if (!selectedId) return 'Brak powiązania';
  const selected = options.find((option) => option.id === selectedId);
  return selected ? selected.label : 'Wybrany rekord z bazy';
}

export default function AiDrafts() {
  const [drafts, setDrafts] = useState<AiLeadDraft[]>([]);
  const [quickCaptureSeed, setQuickCaptureSeed] = useState('');
  const [quickCaptureOpenSignal, setQuickCaptureOpenSignal] = useState(0);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DraftTab>('draft');
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
    const draft = drafts.filter((entry) => entry.status === 'draft').length;
    const converted = drafts.filter((entry) => entry.status === 'converted').length;
    const archived = drafts.filter((entry) => entry.status === 'archived').length;
    return { draft, converted, archived, total: drafts.length };
  }, [drafts]);

  const filteredDrafts = useMemo(() => {
    return drafts.filter((draft) => {
      const tabMatch = activeTab === 'all' || draft.status === activeTab;
      return tabMatch && matchesDraftSearch(draft, searchQuery);
    });
  }, [activeTab, drafts, searchQuery]);


  const approvalClientOptions = useMemo(() => buildAiDraftRelationOptions(approvalClients, 'client'), [approvalClients]);
  const approvalLeadOptions = useMemo(() => buildAiDraftRelationOptions(approvalLeads, 'lead'), [approvalLeads]);
  const approvalCaseOptions = useMemo(() => buildAiDraftRelationOptions(approvalCases, 'case'), [approvalCases]);

  const openDraftInCapture = (draft: AiLeadDraft) => {
    setActiveDraftId(draft.id);
    setQuickCaptureSeed(draft.rawText);
    setQuickCaptureOpenSignal((current) => current + 1);
  };

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
    setApprovalForm((current) => current ? { ...current, ...patch } : current);
  };

  const buildApprovalFormForRecordType = (draft: AiLeadDraft, nextType: AiDraftApprovalType) => {
    const rebuilt = buildAiDraftApprovalForm({ ...draft, type: nextType });
    setApprovalForm((current) => ({
      ...rebuilt,
      recordType: nextType,
      leadId: current?.leadId || rebuilt.leadId,
      caseId: current?.caseId || rebuilt.caseId,
      clientId: current?.clientId || rebuilt.clientId,
    }));
  };

  const handleApprovalRecordTypeChange = (draft: AiLeadDraft, nextType: AiDraftApprovalType) => {
    buildApprovalFormForRecordType(draft, nextType);
  };

  const buildConvertedActivityPayload = (draft: AiLeadDraft, form: AiDraftApprovalForm, createdRecord: Record<string, unknown>) => ({
    source: 'ai_draft_approval',
    draftId: draft.id,
    recordType: form.recordType,
    title: form.title || form.name,
    rawText: draft.rawText,
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
      toast.success(getAiDraftApprovalTypeLabel(form.recordType) + " przeniesiony ze szkicu AI");
    } catch (error: any) {
      toast.error('Nie udało się zatwierdzić szkicu: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setApprovalSaving(false);
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
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3" data-ai-draft-relation-picker={kind}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="text-sm font-semibold text-slate-900">{getAiDraftRelationSelectedLabel(options, selectedId)}</p>
          </div>
          {selectedId ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => updateApprovalForm({ [field]: '' } as Partial<AiDraftApprovalForm>)}
            >
              Wyczyść
            </Button>
          ) : null}
        </div>

        <Input
          className={approvalInputClass}
          value={searchValue}
          onChange={(event) => setApprovalRelationSearch((current) => ({ ...current, [kind]: event.target.value }))}
          placeholder={kind === 'lead' ? 'Szukaj leada po nazwie, telefonie lub emailu' : kind === 'case' ? 'Szukaj sprawy po nazwie lub statusie' : 'Szukaj klienta po nazwie, telefonie lub emailu'}
          data-ai-draft-relation-search={kind}
        />

        <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
          {approvalRelationsLoading ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-500">Ładuję dane z bazy...</p>
          ) : null}
          {!approvalRelationsLoading && visibleOptions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-500">Brak wyniku. Zmień wyszukiwanie albo zostaw bez powiązania.</p>
          ) : null}
          {visibleOptions.map((option) => {
            const active = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={'w-full rounded-xl border px-3 py-2 text-left transition ' + (active ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50')}
                onClick={() => {
                  updateApprovalForm({ [field]: option.id } as Partial<AiDraftApprovalForm>);
                  setApprovalRelationSearch((current) => ({ ...current, [kind]: option.label }));
                }}
                data-ai-draft-relation-option={kind}
              >
                <span className="block text-sm font-semibold">{option.label}</span>
                <span className="block text-xs text-slate-500">{option.helper}</span>
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
      <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4" data-ai-draft-approval-panel="true" data-ai-draft-real-transfer-form="true">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Zatwierdź szkic jako finalny rekord</p>
            <p className="text-xs text-slate-600">Wybierz, gdzie przenieść szkic. Formularz działa jak normalne dodawanie w aplikacji: po zatwierdzeniu rekord trafia do właściwego miejsca, a szkic przechodzi do zatwierdzonych.</p>
          </div>
                    <div className="grid gap-2 sm:grid-cols-4" data-ai-draft-transfer-target-selector="true">
            {approvalTypeOptions.map((option) => {
              const active = recordType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-2xl border px-3 py-2 text-left transition ${active ? 'border-blue-500 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'}`}
                  onClick={() => handleApprovalRecordTypeChange(draft, option.value)}
                >
                  <span className="block text-sm font-bold">{option.label}</span>
                  <span className={`mt-0.5 block text-[11px] ${active ? 'text-blue-50' : 'text-slate-500'}`}>{option.helper}</span>
                </button>
              );
            })}
          </div>
        </div>

        {recordType === 'lead' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-slate-600">Nazwa leada / kontaktu<Input className={approvalInputClass} value={approvalForm.name} onChange={(event) => updateApprovalForm({ name: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Firma<Input className={approvalInputClass} value={approvalForm.company} onChange={(event) => updateApprovalForm({ company: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">E-mail<Input className={approvalInputClass} value={approvalForm.email} onChange={(event) => updateApprovalForm({ email: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Telefon<Input className={approvalInputClass} value={approvalForm.phone} onChange={(event) => updateApprovalForm({ phone: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Źródło<select className={approvalSelectClass} value={approvalForm.source} onChange={(event) => updateApprovalForm({ source: event.target.value })}>{SOURCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Wartość<Input className={approvalInputClass} value={approvalForm.dealValue} onChange={(event) => updateApprovalForm({ dealValue: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600 md:col-span-2">Następny ruch<Input type="datetime-local" className={approvalInputClass} value={approvalForm.scheduledAt} onChange={(event) => updateApprovalForm({ scheduledAt: event.target.value })} /></label>
          </div>
        ) : null}

        {recordType === 'task' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-slate-600 md:col-span-2">Tytuł zadania<Input className={approvalInputClass} value={approvalForm.title} onChange={(event) => updateApprovalForm({ title: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Typ zadania<select className={approvalSelectClass} value={approvalForm.taskType} onChange={(event) => updateApprovalForm({ taskType: event.target.value })}>{TASK_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Termin<Input type="datetime-local" className={approvalInputClass} value={approvalForm.scheduledAt} onChange={(event) => updateApprovalForm({ scheduledAt: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Priorytet<select className={approvalSelectClass} value={approvalForm.priority} onChange={(event) => updateApprovalForm({ priority: event.target.value })}>{PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>
        ) : null}

        {recordType === 'event' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-slate-600 md:col-span-2">Tytuł wydarzenia<Input className={approvalInputClass} value={approvalForm.title} onChange={(event) => updateApprovalForm({ title: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Typ wydarzenia<select className={approvalSelectClass} value={approvalForm.eventType} onChange={(event) => updateApprovalForm({ eventType: event.target.value })}>{EVENT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Start<Input type="datetime-local" className={approvalInputClass} value={approvalForm.scheduledAt} onChange={(event) => updateApprovalForm({ scheduledAt: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Koniec<Input type="datetime-local" className={approvalInputClass} value={approvalForm.endAt} onChange={(event) => updateApprovalForm({ endAt: event.target.value })} /></label>
          </div>
        ) : null}

        {recordType === 'note' ? (
          <div className="space-y-3">
            <label className="space-y-1 text-xs font-semibold text-slate-600">Tytuł notatki<Input className={approvalInputClass} value={approvalForm.title} onChange={(event) => updateApprovalForm({ title: event.target.value })} /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-600">Treść notatki<Textarea className="min-h-28" value={approvalForm.body} onChange={(event) => updateApprovalForm({ body: event.target.value })} /></label>
          </div>
        ) : null}

                {recordType !== 'lead' ? (
          <div className="mt-3 space-y-3" data-ai-draft-relation-picker-panel="true">
            <div>
              <p className="text-sm font-bold text-slate-900">Powiąż z istniejącym rekordem</p>
              <p className="text-xs text-slate-600">Nie wpisuj ID ręcznie. Wyszukaj klienta, leada albo sprawę z bazy i wybierz właściwy rekord.</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {renderApprovalRelationPicker('lead', 'Lead', approvalLeadOptions, approvalForm.leadId, 'leadId')}
              {renderApprovalRelationPicker('case', 'Sprawa', approvalCaseOptions, approvalForm.caseId, 'caseId')}
              {renderApprovalRelationPicker('client', 'Klient', approvalClientOptions, approvalForm.clientId, 'clientId')}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => void handleApproveDraftToRecord(draft)} disabled={approvalSaving} data-ai-draft-approve-final-record="true" data-ai-draft-real-record-create="true">
            <CheckCircle2 className="mr-2 h-4 w-4" />{approvalSaving ? 'Przenoszę...' : 'Przenieś do aplikacji'}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={closeDraftApproval} disabled={approvalSaving}>Anuluj zatwierdzanie</Button>
        </div>
      </div>
    );
  };


  const handleCaptureSaved = async () => {
    if (activeDraftId) {
      await markAiLeadDraftConvertedAsync(activeDraftId);
      setActiveDraftId(null);
      reloadDrafts();
      toast.success('Szkic oznaczony jako zatwierdzony');
      return;
    }
    reloadDrafts();
  };

  const handleArchive = async (draft: AiLeadDraft) => {
    await archiveAiLeadDraftAsync(draft.id);
    reloadDrafts();
    toast.success('Szkic przeniesiony do archiwum');
  };

  const handleDelete = async (draft: AiLeadDraft) => {
    const confirmed = window.confirm('Usunąć szkic AI? Tej operacji nie będzie można cofnąć.');
    if (!confirmed) return;
    await deleteAiLeadDraftAsync(draft.id);
    reloadDrafts();
    toast.success('Szkic usunięty');
  };

  const handleStartEdit = (draft: AiLeadDraft) => {
    setEditingDraftId(draft.id);
    setEditingText(draft.rawText);
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
    reloadDrafts();
    toast.success('Szkic zaktualizowany');
  };

  const handleCopyDraftText = async (draft: AiLeadDraft) => {
    try {
      if (!navigator?.clipboard) throw new Error('NO_CLIPBOARD');
      await navigator.clipboard.writeText(draft.rawText);
      toast.success('Treść szkicu skopiowana');
    } catch {
      toast.error('Nie udało się skopiować treści. Zaznacz ją ręcznie.');
    }
  };

  const renderDraftCard = (draft: AiLeadDraft) => {
    const editing = editingDraftId === draft.id;

    return (
      <Card key={draft.id} className="border-slate-200 shadow-sm" data-ai-draft-card="true">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClassName(draft.status)}`}>
                  {statusLabel(draft.status)}
                </span>
                <Badge variant="outline">{sourceLabel(draft.source)}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDraftDate(draft.createdAt)}
                </span>
              </div>

              {editing ? (
                <div className="space-y-2" data-ai-draft-edit-box="true">
                  <Textarea
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                    className="min-h-32"
                    placeholder="Popraw treść podyktowanej notatki przed zatwierdzeniem."
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={() => handleSaveEdit(draft)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Zapisz zmiany
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={handleCancelEdit}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Anuluj
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm text-slate-800">{draft.rawText || 'Tekst źródłowy został usunięty po zatwierdzeniu albo anulowaniu szkicu.'}</p>
              )}
            </div>
          </div>

          {!editing ? (
            <>
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              {draft.status === 'draft' ? (
                <Button type="button" size="sm" onClick={() => openDraftApproval(draft)} data-ai-draft-open-approval="true">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Przejrzyj i zatwierdź
                </Button>
              ) : null}
              {draft.status === 'draft' ? (
                <Button type="button" size="sm" variant="outline" onClick={() => handleStartEdit(draft)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edytuj notatkę
                </Button>
              ) : null}
              <Button type="button" size="sm" variant="outline" onClick={() => handleCopyDraftText(draft)}>
                <Clipboard className="mr-2 h-4 w-4" />
                Kopiuj treść
              </Button>
              {draft.status === 'draft' ? (
                <Button type="button" size="sm" variant="outline" onClick={() => handleArchive(draft)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archiwizuj
                </Button>
              ) : null}
              <Button type="button" size="sm" variant="outline" onClick={() => handleDelete(draft)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Usuń
              </Button>
            </div>
            {renderApprovalPanel(draft)}
            </>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              AI inbox
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Szkice AI</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Notatka głosowa najpierw trafia tutaj. Szkice są zapisywane w Supabase z lokalnym fallbackiem. Lead powstaje dopiero po kliknięciu „Przejrzyj i zatwierdź”, sprawdzeniu pól i ręcznym zapisie.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            {draftsLoading ? 'Ładowanie...' : stats.draft + ' do sprawdzenia'}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4" data-ai-draft-stats="true">
          <Card className="border-blue-100 bg-blue-50/70">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Do sprawdzenia</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.draft}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Zatwierdzone</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.converted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Archiwum</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.archived}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Łącznie</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
            </CardContent>
          </Card>
        </div>
        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm" data-ai-draft-command-center="true">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Centrum szkiców</h2>
              <p className="text-sm text-slate-500">Najpierw szkic, potem decyzja. Nic z tej listy nie staje się leadem bez ręcznego zatwierdzenia.</p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
                placeholder="Szukaj w podyktowanych notatkach..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2" data-ai-drafts-tab="true">
            {DRAFT_TABS.map((tab) => {
              const active = activeTab === tab.key;
              const count = tab.key === 'all' ? stats.total : stats[tab.key];
              return (
                <Button
                  key={tab.key}
                  type="button"
                  variant={active ? 'default' : 'outline'}
                  className="rounded-xl"
                  onClick={() => setActiveTab(tab.key)}
                  title={tab.helper}
                >
                  {tab.label} ({count})
                </Button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filteredDrafts.length ? filteredDrafts.map(renderDraftCard) : (
              <Card className="border-dashed border-slate-200 bg-white/70">
                <CardContent className="p-6 text-sm text-slate-500">
                  Brak szkiców w tym widoku. Gdy zapiszesz notatkę z Szybkiego szkicu albo Asystenta AI, pojawi się tutaj.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
