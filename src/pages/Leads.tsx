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
import { StatShortcutCard } from '../components/StatShortcutCard';
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
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'other',
    dealValue: '',
    company: '',
  });

  const createLeadSubmitLockRef = useRef(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);

  useEffect(() => {
    if (consumeGlobalQuickAction() === 'lead') {
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
    if (!newLead.name.trim()) return toast.error('Wpisz nazwę leada');
    createLeadSubmitLockRef.current = true;
    setLeadSubmitting(true);

    try {
      await insertLeadToSupabase({
        ...newLead,
        dealValue: Number(newLead.dealValue) || 0,
        ownerId: workspace?.ownerId,
        workspaceId,
      });
      await loadLeads();
      toast.success('Lead dodany');
      setIsNewLeadOpen(false);
      setNewLead({ name: '', email: '', phone: '', source: 'other', dealValue: '', company: '' });
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

  const activeLeads = useMemo(() => leads.filter((lead) => !isLeadInTrash(lead)), [leads]);
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
    linkedToCase: activeLeads.filter((lead) => isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || resolveLinkedCaseForLead(lead)?.id })).length,
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

            <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
              <DialogTrigger asChild>
                <button type="button" className="btn primary" disabled={!workspaceReady}>
                  <Plus className="h-4 w-4" />
                  Dodaj leada
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nowy lead</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateLead} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Imię i nazwisko / Nazwa</Label>
                    <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Firma</Label>
                    <Input value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Wartość (PLN)</Label>
                      <Input type="number" value={newLead.dealValue} onChange={(e) => setNewLead({ ...newLead, dealValue: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Źródło</Label>
                      <select
                        className={nativeSelectClassName()}
                        value={newLead.source}
                        onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      >
                        {SOURCE_OPTIONS.map((source) => (
                          <option key={source.value} value={source.value}>{source.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={leadSubmitting || !workspaceReady}>
                      {leadSubmitting ? 'Dodawanie...' : 'Stwórz leada'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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

        <div className="layout-list" data-stage25-leads-layout-list="true">
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

            {searchQuery.trim() && leadSearchSuggestions.length ? (
              <div className="suggestions" data-stage25-lead-search-suggestions="true">
                {leadSearchSuggestions.map((suggestion, index) => (
                  <Link key={suggestion.id} to={`/leads/${suggestion.id}`}>
                    <span>{index + 1}. {suggestion.name}</span>
                    <small>{suggestion.meta}</small>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
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
                filteredLeads.map((lead, index) => {
                  const leadId = String(lead.id || '');
                  const linkedCase = resolveLinkedCaseForLead(lead);
                  const sourceLabel = formatLeadSourceLabel(lead.source);
                  const statusOption = STATUS_OPTIONS.find((option) => option.value === String(lead.status || 'new'));
                  const statusLabel = statusOption?.label || 'Nowy';
                  const valueLabel = (Number(lead.dealValue) || 0).toLocaleString() + ' PLN';
                  const meta = buildLeadCompactMeta(lead, linkedCase, sourceLabel, valueLabel);
                  const nextActionMeta = buildNextActionMeta(nextActionByLeadId.get(leadId));
                  const pending = archivePendingId === leadId;

                  return (
                    <div key={leadId || index} className="row lead-row" data-stage25-lead-row="true">
                      <span className="index">{index + 1}</span>

                      <span className="lead-main-cell">
                        <Link to={`/leads/${leadId}`} className="title">{lead.name || 'Lead bez nazwy'}</Link>
                        <span className="sub">{meta || 'Brak danych kontaktowych'}</span>
                        <span className="statusline">
                          <span className="pill blue">{statusLabel}</span>
                          <span className="pill">{sourceLabel}</span>
                          {linkedCase ? <span className="pill violet">Sprawa</span> : null}
                        </span>
                      </span>

                      <span className="lead-value-cell">
                        <span className="mini">Wartość</span>
                        <strong>{valueLabel}</strong>
                      </span>

                      <span className="lead-action-cell">
                        <span className="mini">Najbliższa akcja</span>
                        <strong className={nextActionMeta.overdue ? 'danger' : ''}>{nextActionMeta.title}</strong>
                        <span className="sub">{nextActionMeta.subtitle}</span>
                      </span>

                      <span className="lead-actions">
                        <Link to={`/leads/${leadId}`} className="btn ghost" aria-label={`Otwórz leada ${lead.name || ''}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
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
                  );
                })
              ) : (
                <div className="row row-empty">
                  <span className="index">0</span>
                  <span>
                    <span className="title">{showTrash ? 'Kosz jest pusty' : 'Brak leadów w tym widoku'}</span>
                    <span className="sub">{showTrash ? 'Nie ma rekordów do przywrócenia.' : 'Zmień filtr albo dodaj pierwszego leada.'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <aside className="stack lead-right-rail" data-stage25-leads-right-rail="true">
            <div className="right-card" data-relation-value-board="true">
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
                    <Link key={entry.key} to={entry.href || '/leads'} data-stage25-valuable-relation-row="true">
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
            </div>

            <div className="right-card">
              <div className="panel-head">
                <div>
                  <h3>AI jako przycisk</h3>
                  <p>Bez stałego panelu. Klikasz tylko wtedy, kiedy potrzebujesz.</p>
                </div>
              </div>
              <Link to="/ai-drafts" className="btn soft-blue">
                ✦ Przejdź do szkiców AI
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
