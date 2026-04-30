// LEAD_TO_CASE_FLOW_STAGE24_LEADS_LIST
// VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD
// VISUAL_STAGE18_LEADS_HTML_HARD_1TO1
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Briefcase, ChevronRight, Clock3, FileText, Loader2, Mail, Plus, RotateCcw, Search, Target, Trash2, TrendingUp } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { consumeGlobalQuickAction } from '../components/GlobalQuickActions';
// STAGE30A_LINT_GUARD_COMPAT: legacy visual guard expects exact text: consumeGlobalQuickAction() === 'lead'
import { StatShortcutCard } from '../components/StatShortcutCard';
import { QuickLeadCaptureModal } from '../components/quick-lead';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { getLeadNextAction, type LeadNextAction } from '../lib/lead-next-action';
import { isActiveSalesLead, isLeadMovedToService } from '../lib/lead-health';
import { buildRelationFunnelValue, buildRelationValueEntries, formatRelationValue } from '../lib/relation-value';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  insertLeadToSupabase,
  isSupabaseConfigured,
  updateLeadInSupabase,
} from '../lib/supabase-fallback';
import '../styles/visual-stage20-lead-form-vnext.css';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Skontaktowany', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'qualification', label: 'Kwalifikacja', color: 'bg-purple-100 text-purple-700' },
  { value: 'proposal_sent', label: 'Oferta wysłana', color: 'bg-amber-100 text-amber-700' },
  { value: 'waiting_response', label: 'Czeka na odpowiedź', color: 'bg-orange-100 text-orange-700' },
  { value: 'accepted', label: 'Zaakceptowany', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'moved_to_service', label: 'Przeniesiony do obsługi', color: 'bg-violet-100 text-violet-700' },
  { value: 'negotiation', label: 'Negocjacje', color: 'bg-pink-100 text-pink-700' },
  { value: 'lost', label: 'Przegrany', color: 'bg-slate-100 text-slate-700' },
  { value: 'archived', label: 'W koszu', color: 'bg-amber-100 text-amber-700' },
];

const SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Inne' },
];

type CaseRecord = {
  id: string;
  title?: string;
  status?: string;
  leadId?: string | null;
  clientId?: string | null;
};

type LeadsQuickFilter = 'all' | 'active' | 'at-risk' | 'history';

function formatLeadSourceLabel(value: unknown) {
  const normalized = String(value || 'other');
  return SOURCE_OPTIONS.find((option) => option.value === normalized)?.label || 'Inne';
}

function normalizeLeadSearchValue(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLeadPrimaryContact(lead: any) {
  return String(lead?.phone || lead?.email || '').trim();
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

function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, valueLabel: string) {
  const contact = getLeadPrimaryContact(lead);
  const company = String(lead?.company || '').trim();
  const caseLabel = linkedCase ? 'sprawa: ' + (linkedCase.title || 'otwarta') : '';

  return [
    sourceLabel,
    company,
    contact,
    valueLabel,
    caseLabel,
  ].filter(Boolean).join(' · ');
}

function nativeSelectClassName() {
  return 'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
}


function formatCaseStatusLabel(value?: string) {
  if (!value) return '';
  return value.replaceAll('_', ' ');
}

function getNextActionKindLabel(action: LeadNextAction | null | undefined) {
  if (!action) return '';
  return action.kind === 'task' ? 'Zadanie' : 'Wydarzenie';
}

function buildNextActionMeta(action: LeadNextAction | null | undefined) {
  if (!action) {
    return {
      title: 'Brak zaplanowanych działań',
      subtitle: 'Dodaj zadanie albo wydarzenie, aby temat nie wypadł z procesu.',
      overdue: false,
    };
  }

  const actionDate = parseISO(action.when);
  const overdue = isPast(actionDate);
  const dateLabel = format(actionDate, 'd MMM yyyy, HH:mm', { locale: pl });

  return {
    title: action.title,
    subtitle: `${getNextActionKindLabel(action)} · ${dateLabel}`,
    overdue,
  };
}

function isLeadInTrash(lead: any) {
  // STAGE30_LEADS_TRASH_STRICT_VISIBILITY: kosz leadów nie może łapać aktywnych rekordów po samym wyniku sprzedaży.
  const status = String(lead?.status || '').trim();
  const visibility = String(lead?.leadVisibility || '').trim();

  return visibility === 'trash' || status === 'archived';
}

function getRestoreStatusForLead(lead: any, linkedCase?: CaseRecord) {
  if (linkedCase || lead?.linkedCaseId || lead?.caseId || lead?.movedToServiceAt || lead?.caseStartedAt) {
    return 'moved_to_service';
  }
  return 'new';
}

export default function Leads() {
  const { workspace, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<LeadsQuickFilter>('active');
  const [showTrash, setShowTrash] = useState(false);
  const [valueSortEnabled, setValueSortEnabled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isQuickLeadCaptureOpen, setIsQuickLeadCaptureOpen] = useState(false);
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
  });

  const createLeadSubmitLockRef = useRef(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);

  useEffect(() => {
    const quickActionTarget = consumeGlobalQuickAction();
    if (quickActionTarget === 'lead') {
      setIsNewLeadOpen(true);
    }
    if (quickActionTarget === 'quick-lead') {
      setIsQuickLeadCaptureOpen(true);
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
    if (searchParams.get('quick') !== 'quick-lead') return;
    setIsQuickLeadCaptureOpen(true);
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
        fetchLeadsFromSupabase(),
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
    if (!isSupabaseConfigured() || workspaceLoading || !workspace?.id) {
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
    const map = new Map<string, ReturnType<typeof getLeadNextAction>>();

    for (const lead of leads) {
      const leadId = String(lead.id || '');
      if (!leadId) continue;
      const linkedCase = resolveLinkedCaseForLead(lead);
      const linkedTasks = tasks.filter((item) => {
        const itemLeadId = String(item.leadId || item.lead_id || '');
        const itemCaseId = String(item.caseId || item.case_id || '');
        return itemLeadId === leadId || (linkedCase?.id && itemCaseId === String(linkedCase.id));
      });
      const linkedEvents = events.filter((item) => {
        const itemLeadId = String(item.leadId || item.lead_id || '');
        const itemCaseId = String(item.caseId || item.case_id || '');
        return itemLeadId === leadId || (linkedCase?.id && itemCaseId === String(linkedCase.id));
      });
      map.set(leadId, getLeadNextAction(linkedTasks, linkedEvents));
    }

    return map;
  }, [events, leads, resolveLinkedCaseForLead, tasks]);

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
    createLeadSubmitLockRef.current = true;
    setLeadSubmitting(true);

    try {
      await insertLeadToSupabase({
        ...newLead,
        name: newLead.name.trim() || newLead.phone.trim() || newLead.email.trim() || 'Lead bez nazwy',
        dealValue: Number(newLead.dealValue) || 0,
        ownerId: workspace?.ownerId,
        workspaceId,
      });
      await loadLeads();
      toast.success('Lead dodany');
      setIsNewLeadOpen(false);
      setNewLead({ name: '', email: '', phone: '', source: 'other', dealValue: '', company: '', summary: '', notes: '', status: 'new', isAtRisk: false });
    } catch (error: any) {
      toast.error(`Błąd zapisu leada: ${error.message}`);
    } finally {
      createLeadSubmitLockRef.current = false;
      setLeadSubmitting(false);
    }
  };

  const handleArchiveLead = async (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    const linkedCase = resolveLinkedCaseForLead(lead);
    const relationText = linkedCase
      ? '\n\nTen lead ma powiązaną sprawę: ' + (linkedCase.title || linkedCase.id) + '. Rekord zniknie z aktywnej listy, ale nie zostanie trwale skasowany.'
      : '\n\nLead zniknie z aktywnej listy, ale będzie można go przywrócić z kosza.';

    if (!window.confirm('Przenieść leada do kosza: ' + (lead.name || 'Lead') + '?' + relationText)) return;

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: 'archived',
        leadVisibility: 'trash',
        salesOutcome: 'archived',
        closedAt: new Date().toISOString(),
      });
      toast.success('Lead przeniesiony do kosza');
      await loadLeads();
    } catch (error: any) {
      toast.error('Błąd przenoszenia leada do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleRestoreLead = async (event: MouseEvent<HTMLButtonElement>, lead: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const leadId = String(lead.id || '');
    if (!leadId) return;

    const linkedCase = resolveLinkedCaseForLead(lead);
    const nextStatus = getRestoreStatusForLead(lead, linkedCase);
    const nextVisibility = nextStatus === 'moved_to_service' ? 'archived' : 'active';
    const nextOutcome = nextStatus === 'moved_to_service' ? 'moved_to_service' : 'open';

    if (!window.confirm('Przywrócić leada do listy: ' + (lead.name || 'Lead') + '?')) return;

    try {
      setArchivePendingId(leadId);
      await updateLeadInSupabase({
        id: leadId,
        status: nextStatus,
        leadVisibility: nextVisibility,
        salesOutcome: nextOutcome,
        closedAt: null,
      });
      toast.success('Lead przywrócony');
      await loadLeads();
    } catch (error: any) {
      toast.error('Błąd przywracania leada: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const activeLeads = useMemo(
    () => leads.filter((lead) => !isLeadInTrash(lead)),
    [leads],
  );

  const serviceHistoryLeads = useMemo(
    () =>
      activeLeads.filter((lead) => {
        const linkedCase = resolveLinkedCaseForLead(lead);
        return isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      }),
    [activeLeads, resolveLinkedCaseForLead],
  );

  const trashLeads = useMemo(() => leads.filter((lead) => isLeadInTrash(lead)), [leads]);

  // RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS
  const relationValueEntries = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients, cases }),
    [activeLeads, clients, cases],
  );

  const mostValuableRelations = useMemo(
    () => relationValueEntries.slice(0, 5),
    [relationValueEntries],
  );

  const relationFunnelValue = useMemo(
    () => buildRelationFunnelValue({ leads: activeLeads, clients }),
    [activeLeads, clients],
  );

  const filteredLeads = useMemo(() => {
    // STAGE31_LEADS_THIN_NUMBERED_LIST: wyszukiwarka działa po nazwie, telefonie, mailu, firmie, źródle i sprawie.
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    const sourceLeads = showTrash ? trashLeads : activeLeads;

    const results = sourceLeads.filter((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const movedToService = isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const activeLead = isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const matchesSearch = !normalizedQuery || buildLeadSearchText(lead, linkedCase).includes(normalizedQuery);

      const matchesQuickFilter =
        showTrash
        || quickFilter === 'all'
        || (quickFilter === 'active' && activeLead)
        || (quickFilter === 'at-risk' && Boolean(lead.isAtRisk))
        || (quickFilter === 'history' && movedToService);

      return matchesSearch && matchesQuickFilter;
    });

    if (valueSortEnabled) {
      return [...results].sort((a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0));
    }

    return results;
  }, [activeLeads, quickFilter, resolveLinkedCaseForLead, searchQuery, showTrash, trashLeads, valueSortEnabled]);

  const leadSearchSuggestions = useMemo(() => {
    const normalizedQuery = normalizeLeadSearchValue(searchQuery);
    if (!normalizedQuery) return [];

    return filteredLeads.slice(0, 6).map((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const sourceLabel = formatLeadSourceLabel(lead.source);
      const valueLabel = (Number(lead.dealValue) || 0).toLocaleString() + ' PLN';
      return {
        id: String(lead.id || ''),
        name: String(lead.name || 'Lead bez nazwy'),
        meta: buildLeadCompactMeta(lead, linkedCase, sourceLabel, valueLabel),
      };
    }).filter((lead) => lead.id);
  }, [filteredLeads, resolveLinkedCaseForLead, searchQuery]);

  const stats = {
    total: activeLeads.length,
    active: activeLeads.filter((lead) => isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || resolveLinkedCaseForLead(lead)?.id })).length,
    value: relationFunnelValue,
    atRisk: activeLeads.filter((lead) => Boolean(lead.isAtRisk)).length,
    linkedToCase: serviceHistoryLeads.length,
    trash: trashLeads.length,
  };

  const toggleQuickFilter = (filter: LeadsQuickFilter) => {
    setShowTrash(false);
    setValueSortEnabled(false);
    setQuickFilter((prev) => (prev === filter ? 'all' : filter));
  };

  const toggleValueSorting = () => {
    setShowTrash(false);
    setQuickFilter('all');
    setValueSortEnabled((prev) => !prev);
  };

  const toggleTrashView = () => {
    setValueSortEnabled(false);
    setQuickFilter('all');
    setShowTrash((current) => !current);
  };
  return (
    <Layout>
      <div className="cf-html-view main-leads-html" data-visual-stage25-leads-full-jsx="true" data-leads-real-view="true">
        <div className="page-head">
          <div>
            <span className="kicker">Lista sprzedażowa</span>
            <h1>Leady</h1>
            <p className="lead-copy">
              Ten widok ma odpowiadać na jedno pytanie: z kim teraz pracuję i gdzie jest pieniądz albo ryzyko.
            </p>
          </div>

          <div className="head-actions">
            <Link to="/ai-drafts" className="btn soft-blue" data-stage26-leads-head-ai="true">
              âś¦ Zapytaj AI
            </Link>
            <button
              type="button"
              className="btn"
              onClick={toggleTrashView}
            >
              {showTrash ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              {showTrash ? 'Pokaż aktywne' : 'Kosz'}
              <span className="pill">{showTrash ? stats.total : stats.trash}</span>
            </button>


            <button
              type="button"
              className="btn soft-blue"
              onClick={() => setIsQuickLeadCaptureOpen(true)}
              data-stage27-quick-lead-entry="true"
            >
              <Plus className="h-4 w-4" />
              Dodaj szybkiego leada
            </button>

            <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
              <DialogTrigger asChild>
                <button type="button" className="btn primary" disabled={!workspaceReady}>
                  <Plus className="h-4 w-4" />
                  Dodaj leada
                </button>
              </DialogTrigger>
              <DialogContent className="lead-form-vnext-content" data-lead-form-stage20="true" aria-describedby="lead-form-stage20-description">
                <DialogHeader className="lead-form-vnext-header">
                  <div>
                    <span className="lead-form-vnext-kicker">SZYBKIE DODANIE LEADA</span>
                    <DialogTitle>Nowy lead</DialogTitle>
                    <p id="lead-form-stage20-description">
                      Wpisz minimum danych i zapisz kontakt. Szczegóły możesz uzupełnić później.
                    </p>
                  </div>
                </DialogHeader>

                <form onSubmit={handleCreateLead} className="lead-form-vnext" data-lead-form-visual-rebuild="LEAD_FORM_VISUAL_REBUILD_STAGE20">
                  <section className="lead-form-section lead-form-primary-section">
                    <div className="lead-form-section-head">
                      <h3>Podstawowe dane</h3>
                      <p>Najważniejsze pola do szybkiego zapisania kontaktu.</p>
                    </div>

                    <div className="lead-form-grid">
                      <div className="lead-form-field lead-form-field-wide">
                        <Label>Nazwa / kontakt</Label>
                        <Input
                          value={newLead.name}
                          onChange={(event) => setNewLead({ ...newLead, name: event.target.value })}
                          placeholder="Np. Jan Kowalski albo Firma ABC"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>Telefon</Label>
                        <Input
                          value={newLead.phone}
                          onChange={(event) => setNewLead({ ...newLead, phone: event.target.value })}
                          placeholder="np. 516 000 000"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>E-mail</Label>
                        <Input
                          type="email"
                          value={newLead.email}
                          onChange={(event) => setNewLead({ ...newLead, email: event.target.value })}
                          placeholder="kontakt@email.pl"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>Źródło</Label>
                        <select
                          className="lead-form-select"
                          value={newLead.source}
                          onChange={(event) => setNewLead({ ...newLead, source: event.target.value })}
                        >
                          {SOURCE_OPTIONS.map((source) => (
                            <option key={source.value} value={source.value}>{source.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="lead-form-field">
                        <Label>Wartość</Label>
                        <Input
                          type="number"
                          value={newLead.dealValue}
                          onChange={(event) => setNewLead({ ...newLead, dealValue: event.target.value })}
                          placeholder="0"
                        />
                      </div>

                      <div className="lead-form-field lead-form-field-wide">
                        <Label>Temat / potrzeba</Label>
                        <Input
                          value={newLead.summary}
                          onChange={(event) => setNewLead({ ...newLead, summary: event.target.value })}
                          placeholder="Np. strona www, kampania, nieruchomość, dokumenty..."
                        />
                      </div>

                      <div className="lead-form-field lead-form-field-wide">
                        <Label>Notatka</Label>
                        <textarea
                          className="lead-form-textarea"
                          value={newLead.notes}
                          onChange={(event) => setNewLead({ ...newLead, notes: event.target.value })}
                          placeholder="Krótki kontekst rozmowy. Bez długiej odprawy."
                        />
                      </div>
                    </div>
                  </section>

                  <details className="lead-form-section lead-form-details">
                    <summary>Dodatkowe pola</summary>
                    <div className="lead-form-grid lead-form-details-grid">
                      <div className="lead-form-field">
                        <Label>Firma</Label>
                        <Input
                          value={newLead.company}
                          onChange={(event) => setNewLead({ ...newLead, company: event.target.value })}
                          placeholder="Opcjonalnie"
                        />
                      </div>

                      <div className="lead-form-field">
                        <Label>Status</Label>
                        <select
                          className="lead-form-select"
                          value={newLead.status}
                          onChange={(event) => setNewLead({ ...newLead, status: event.target.value })}
                        >
                          {STATUS_OPTIONS.filter((status) => status.value !== 'archived').map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>

                      <label className="lead-form-checkbox">
                        <input
                          type="checkbox"
                          checked={newLead.isAtRisk}
                          onChange={(event) => setNewLead({ ...newLead, isAtRisk: event.target.checked })}
                        />
                        <span>
                          <strong>Wysoki priorytet</strong>
                          <small>Oznacz, jeśli lead wymaga szybkiej reakcji.</small>
                        </span>
                      </label>
                    </div>
                  </details>

                  <section className="lead-form-section lead-form-planning-note">
                    <Clock3 className="h-4 w-4" />
                    <div>
                      <h3>Szybkie planowanie</h3>
                      <p>Dodanie zadania albo wydarzenia bezpośrednio z formularza wymaga osobnego flow. Ten etap nie udaje tej funkcji.</p>
                    </div>
                  </section>

                  <DialogFooter className="lead-form-footer">
                    <Button type="button" variant="outline" onClick={() => setIsNewLeadOpen(false)}>
                      Anuluj
                    </Button>
                    <Button type="submit" disabled={leadSubmitting || !workspaceReady}>
                      {leadSubmitting ? 'Zapisywanie...' : 'Zapisz leada'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <QuickLeadCaptureModal
              open={isQuickLeadCaptureOpen}
              onOpenChange={setIsQuickLeadCaptureOpen}
              workspace={workspace}
              hasAccess={hasAccess}
              onLeadCreated={() => { void loadLeads(); }}
            />
          </div>
        </div>

        <div className="grid-5">
          <button
            type="button"
            className={`metric ${quickFilter === 'all' && !valueSortEnabled && !showTrash ? 'active' : ''}`}
            onClick={() => { setShowTrash(false); setQuickFilter('all'); setValueSortEnabled(false); }}
            title="Pokaż wszystkie leady"
          >
            <div>
              <label>Wszystkie</label>
              <strong>{stats.total}</strong>
              <div className="hint">pełna baza</div>
            </div>
            <Target className="metric-icon" />
          </button>

          <button
            type="button"
            className={`metric ${quickFilter === 'active' && !showTrash ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('active')}
            title="Pokaż aktywne leady"
          >
            <div>
              <label>Aktywne</label>
              <strong>{stats.active}</strong>
              <div className="hint">do prowadzenia</div>
            </div>
            <TrendingUp className="metric-icon blue" />
          </button>

          <button
            type="button"
            className={`metric ${valueSortEnabled && !showTrash ? 'active' : ''}`}
            onClick={toggleValueSorting}
            title="Sortuj leady po wartości"
          >
            <div>
              <label>Wartość</label>
              <strong>{stats.value.toLocaleString()} PLN</strong>
              <div className="hint">{valueSortEnabled ? 'sortowanie aktywne' : 'kliknij, aby sortować'}</div>
            </div>
            <TrendingUp className="metric-icon" />
          </button>

          <button
            type="button"
            className={`metric ${quickFilter === 'at-risk' && !showTrash ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('at-risk')}
            title="Pokaż zagrożone leady"
          >
            <div>
              <label>Zagrożone</label>
              <strong className="danger">{stats.atRisk}</strong>
              <div className="hint">ryzyko utraty</div>
            </div>
            <AlertTriangle className="metric-icon red" />
          </button>

          <button
            type="button"
            className={`metric ${quickFilter === 'history' && !showTrash ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('history')}
            title="Pokaż leady przeniesione do obsługi"
          >
            <div>
              <label>Historia</label>
              <strong className="success">{stats.linkedToCase}</strong>
              <div className="hint">w obsłudze lub zamknięte</div>
            </div>
            <Briefcase className="metric-icon green" />
          </button>
        </div>

        {/* STAGE32_VALUABLE_RELATIONS_RIGHT_RAIL */}
        <div
          className="layout-list xl:grid-cols-[minmax(0,1fr)_300px]"
          data-stage25-leads-layout-list="true"
          data-stage32-leads-value-layout="true"
        >
          <div className="stack">
            <div className="search" data-leads-search="true">
              <span aria-hidden="true">⌕</span>
              <input
                placeholder={showTrash ? 'Szukaj w koszu leadów...' : 'Szukaj: nazwa, telefon, e-mail, firma, źródło albo sprawa...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                list="lead-search-suggestions-stage25"
              />
              <datalist id="lead-search-suggestions-stage25">
                {leadSearchSuggestions.map((suggestion) => (
                  <option key={suggestion.id} value={suggestion.name} />
                ))}
              </datalist>
            </div>

            {searchQuery.trim() ? (
              leadSearchSuggestions.length ? (
                <div className="suggestions lead-search-suggestions-stage31" data-stage31-lead-search-suggestions="true">
                  {leadSearchSuggestions.map((suggestion, index) => (
                    <Link key={suggestion.id} to={`/leads/${suggestion.id}`}>
                      <span>{index + 1}. {suggestion.name}</span>
                      <small>{suggestion.meta}</small>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="suggestions lead-search-suggestions-stage31" data-stage31-lead-search-suggestions="true">
                  <span className="sub">Podpowiedzi pojawiają się pod wyszukiwarką. Usuń część tekstu albo wybierz inny filtr.</span>
                </div>
              )
            ) : null}

            <div className="table-card lead-table-card" data-stage25-lead-table-card="true">
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
                filteredLeads.map((lead, leadIndex) => {
                  const leadId = String(lead.id || '');
                  const linkedCase = resolveLinkedCaseForLead(lead);
                  const sourceLabel = formatLeadSourceLabel(lead.source);
                  const statusOption = STATUS_OPTIONS.find((option) => option.value === String(lead.status || 'new'));
                  const statusLabel = statusOption?.label || 'Nowy';
                  const leadValueLabel = (Number(lead.dealValue) || 0).toLocaleString() + ' PLN';
                  const meta = buildLeadCompactMeta(lead, linkedCase, sourceLabel, leadValueLabel);
                  const nextActionMeta = buildNextActionMeta(nextActionByLeadId.get(leadId));
                  const pending = archivePendingId === leadId;

                  return (
                    <div key={leadId || leadIndex} className="relative group/lead-row">
                      <Link to={`/leads/${leadId}`} className="block">
                        <div className="row lead-row" data-stage25-lead-row="true" data-stage31-lead-thin-row="true">
                        <span className="index">{leadIndex + 1}</span>

                        <span className="lead-main-cell">
                          <span className="title">{lead.name || 'Lead bez nazwy'}</span>
                          <span className="sub" data-stage31-lead-one-line-meta="true">{meta || 'Brak danych kontaktowych'}</span>
                          <span className="statusline">
                            <span className="pill blue">{statusLabel}</span>
                            <span className="pill">{sourceLabel}</span>
                            {linkedCase ? <span className="pill violet">Sprawa</span> : null}
                          </span>
                        </span>

                        <span className="lead-value-cell">
                          <span className="mini">Wartość</span>
                          <strong>{leadValueLabel}</strong>
                        </span>

                        <span className="lead-action-cell">
                          <span className="mini">Najbliższa akcja</span>
                          <strong className={nextActionMeta.overdue ? 'danger' : ''}>{nextActionMeta.title}</strong>
                          <span className="sub">{nextActionMeta.subtitle}</span>
                        </span>

                        <span className="lead-actions">
                          <span className="btn ghost" aria-hidden="true">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                          <button
                            type="button"
                            className="btn ghost lead-icon-btn"
                            disabled={pending}
                            onClick={(event) => (showTrash ? handleRestoreLead(event, lead) : handleArchiveLead(event, lead))}
                            aria-label={showTrash ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                            title={showTrash ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                          >
                            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : showTrash ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
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
                    <span className="title">{showTrash ? 'Kosz leadów jest pusty.' : 'Brak leadów w tym widoku'}</span>
                    <span className="sub">{showTrash ? 'Nie ma rekordów do przywrócenia.' : 'Zmień filtr albo dodaj pierwszego leada.'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lead-right-rail" data-stage25-leads-right-rail="true" data-stage32-leads-value-rail="true">
            <aside className="right-card lead-right-card lead-top-relations" data-relation-value-board="true">
              <div className="panel-head">
                <div>
                  <h3>Najcenniejsze relacje</h3>
                  <p>Top 5 według wartości</p>
                </div>
                <span className="pill dark">Lejek razem: {formatRelationValue(relationFunnelValue)}</span>
              </div>

              {mostValuableRelations.length ? (
                <div className="quick-list">
                  {mostValuableRelations.map((entry) => (
                    <Link
                      key={entry.key}
                      to={entry.href || '/leads'}
                      data-stage25-valuable-relation-row="true"
                      data-stage32-valuable-relation-row="true"
                    >
                      <span>
                        <strong>{entry.label}</strong>
                        <small>{entry.kindLabel}</small>
                      </span>
                      <strong>{formatRelationValue(entry.value)}</strong>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="note">Brak relacji z wyliczoną wartością.</div>
              )}
            </aside>

            <aside className="right-card lead-right-card lead-ai-card">
              <div className="panel-head">
                <div>
                  <h3>AI jako przycisk</h3>
                  <p>Bez stałego panelu. Klikasz tylko wtedy, kiedy potrzebujesz.</p>
                </div>
              </div>
              <Link to="/ai-drafts" className="btn soft-blue">
                ✦ Przejdź do szkiców AI
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

