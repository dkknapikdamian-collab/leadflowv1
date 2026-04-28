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
  const status = String(lead?.status || '').trim();
  const visibility = String(lead?.leadVisibility || '').trim();
  const outcome = String(lead?.salesOutcome || '').trim();

  return status === 'archived' || visibility === 'trash' || outcome === 'archived' || outcome === 'trash';
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
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const sourceLeads = showTrash ? trashLeads : activeLeads;

    const results = sourceLeads.filter((lead) => {
      const linkedCase = resolveLinkedCaseForLead(lead);
      const movedToService = isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const activeLead = isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const caseTitle = String(linkedCase?.title || '').toLowerCase();
      const caseStatus = String(linkedCase?.status || '').toLowerCase();

      const matchesSearch = !normalizedQuery
        || String(lead.name || '').toLowerCase().includes(normalizedQuery)
        || String(lead.email || '').toLowerCase().includes(normalizedQuery)
        || String(lead.company || '').toLowerCase().includes(normalizedQuery)
        || String(lead.status || 'new').toLowerCase().includes(normalizedQuery)
        || String(lead.source || '').toLowerCase().includes(normalizedQuery)
        || caseTitle.includes(normalizedQuery)
        || caseStatus.includes(normalizedQuery);

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
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Leady</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={toggleTrashView}
            >
              {showTrash ? <RotateCcw className="w-4 h-4 mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {showTrash ? 'Pokaż aktywne' : 'Kosz'}
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {showTrash ? stats.total : stats.trash}
              </span>
            </Button>
            <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/20" disabled={!workspaceReady}>
                  <Plus className="w-4 h-4 mr-2" /> Dodaj leada
                </Button>
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
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <StatShortcutCard
            label="Wszystkie"
            value={stats.total}
            icon={Target}
            active={quickFilter === 'all' && !valueSortEnabled && !showTrash}
            onClick={() => { setShowTrash(false); setQuickFilter('all'); setValueSortEnabled(false); }}
            valueClassName="text-slate-900"
            iconClassName="bg-slate-100 text-slate-500"
            title="Pokaż wszystkie leady"
          />

          <StatShortcutCard
            label="Aktywne"
            value={stats.active}
            icon={TrendingUp}
            active={quickFilter === 'active' && !showTrash}
            onClick={() => toggleQuickFilter('active')}
            valueClassName="text-blue-600"
            iconClassName="bg-blue-50 text-blue-500"
            title="Pokaż aktywne leady"
          />

          <StatShortcutCard
            label="Wartość"
            value={stats.value.toLocaleString() + ' PLN'}
            icon={TrendingUp}
            active={valueSortEnabled && !showTrash}
            onClick={toggleValueSorting}
            valueClassName="text-slate-900"
            iconClassName="bg-slate-100 text-slate-500"
            helper={valueSortEnabled ? 'Sortowanie aktywne' : 'Kliknij, aby sortować po wartości'}
            title="Sortuj leady po wartości"
          />

          <StatShortcutCard
            label="Zagrożone"
            value={stats.atRisk}
            icon={AlertTriangle}
            active={quickFilter === 'at-risk' && !showTrash}
            onClick={() => toggleQuickFilter('at-risk')}
            valueClassName="text-rose-600"
            iconClassName="bg-rose-50 text-rose-500"
            title="Pokaż zagrożone leady"
          />

          <StatShortcutCard
            label="Historia"
            value={stats.linkedToCase}
            icon={Briefcase}
            active={quickFilter === 'history' && !showTrash}
            onClick={() => toggleQuickFilter('history')}
            valueClassName="text-emerald-600"
            iconClassName="bg-emerald-50 text-emerald-500"
            title="Pokaż leady przeniesione do obsługi"
          />
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={showTrash ? 'Szukaj w koszu leadów...' : 'Szukaj po nazwie, emailu, firmie, statusie albo sprawie...'}
                className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        {/* LEADS_TRASH_COPY_REMOVED_STAGE14: kosz leadów bez martwego opisu V1 */}
        {mostValuableRelations.length ? (
          <Card className="border-none shadow-sm" data-relation-value-board="true">
            <CardContent className="p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">Najcenniejsze relacje</p>
                  <p className="text-xs text-slate-500">Suma lejka liczona z aktywnych leadów i klientów. Sprawy zostają jako kontekst relacji, ale nie podbijają głównej sumy.</p>
                </div>
                <Badge variant="outline">Lejek razem: {formatRelationValue(relationFunnelValue)}</Badge>
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {mostValuableRelations.map((entry) => (
                  <Link
                    key={entry.key}
                    to={entry.href || '/leads'}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{entry.label}</p>
                        <p className="text-xs text-slate-500">{entry.kindLabel}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-slate-900">{formatRelationValue(entry.value)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-slate-500">Ładowanie leadów...</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-rose-200">
              <h3 className="text-lg font-bold text-rose-700">Nie udało się pobrać leadów</h3>
              <p className="text-slate-500 max-w-lg mx-auto mt-1 break-words">{loadError}</p>
              <Button className="mt-4 rounded-xl" onClick={() => void loadLeads()}>
                Spróbuj ponownie
              </Button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{showTrash ? 'Kosz leadów jest pusty' : 'Nie znaleziono leadów'}</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">{showTrash ? 'Przeniesione do kosza leady pojawią się tutaj.' : 'Spróbuj zmienić wyszukiwanie, kliknąć inny kafelek u góry albo dodać nowego leada.'}</p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const linkedCase = resolveLinkedCaseForLead(lead);
              const nextAction = nextActionByLeadId.get(String(lead.id));
              const nextActionMeta = buildNextActionMeta(nextAction);
              const status = STATUS_OPTIONS.find((option) => option.value === lead.status) || STATUS_OPTIONS[0];
              const sourceLabel = formatLeadSourceLabel(lead.source);
              const leadValueLabel = `${(Number(lead.dealValue) || 0).toLocaleString()} PLN`;
              const movedToService = isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
              const isArchivedLead = isLeadInTrash(lead);

              return (
                <div key={lead.id} className="relative group/lead-row">
                  <Link to={`/leads/${lead.id}`} className="block">
                    <Card className="overflow-hidden border-none shadow-sm transition-all group hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex flex-col gap-3 p-4 pr-14 md:flex-row md:items-center md:gap-4 lg:p-5 lg:pr-16">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h4 className="min-w-0 truncate text-base font-bold text-slate-900 transition-colors group-hover:text-primary md:text-lg">{lead.name}</h4>
                            <Badge className={`${status.color} border-none font-medium text-[10px] uppercase`}>{status.label}</Badge>
                            <Badge variant="outline" className="text-[10px] uppercase border-slate-200 text-slate-600">
                              <Target className="mr-1 h-3 w-3" /> {sourceLabel}
                            </Badge>
                            {lead.isAtRisk && !isArchivedLead ? (
                              <Badge variant="destructive" className="text-[10px] uppercase">
                                Zagrożony
                              </Badge>
                            ) : null}
                            {movedToService && !isArchivedLead ? (
                              <Badge variant="outline" className="text-[10px] uppercase border-violet-200 text-violet-700">
                                Temat jest już w obsłudze
                              </Badge>
                            ) : null}
                            {isArchivedLead ? (
                              <Badge variant="outline" className="text-[10px] uppercase border-amber-200 text-amber-700">
                                W koszu
                              </Badge>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500 md:text-sm">
                            {lead.company ? (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" /> {lead.company}
                              </span>
                            ) : null}
                            {lead.email ? (
                              <span className="flex items-center gap-1 break-all">
                                <Mail className="h-3.5 w-3.5" /> {lead.email}
                              </span>
                            ) : null}
                            {linkedCase?.title ? (
                              <span className="flex items-center gap-1 font-medium text-emerald-700">
                                <Briefcase className="h-3.5 w-3.5" /> {linkedCase.title}
                              </span>
                            ) : null}
                            {linkedCase?.status ? (
                              <span className="font-medium text-violet-700">
                                Status sprawy: {formatCaseStatusLabel(linkedCase.status)}
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-2 text-sm text-slate-600">
                            {isArchivedLead
                              ? 'Ten rekord jest w koszu. Możesz go przywrócić bez trwałego kasowania danych.'
                              : movedToService
                                ? ''
                                : 'Aktywny temat sprzedażowy. Wejdź, aby dodać akcję, notatkę albo rozpocząć obsługę.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:flex md:items-center md:gap-4 lg:gap-5">
                          <div className="grid min-w-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 px-3 py-2 text-left sm:min-w-[118px] sm:text-right">
                              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Wartość</p>
                              <p className="truncate text-sm font-bold text-slate-900 md:text-base">{leadValueLabel}</p>
                            </div>

                            <div className="rounded-xl bg-slate-50 px-3 py-2 text-left sm:min-w-[220px] sm:text-right">
                              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Najbliższa akcja</p>
                              <p className={`line-clamp-1 text-sm font-bold ${nextActionMeta.overdue ? 'text-rose-600' : 'text-slate-700'}`}>
                                {isArchivedLead ? 'Rekord w koszu' : nextActionMeta.title}
                              </p>
                              <p className={`mt-1 flex items-center gap-1 text-xs ${nextActionMeta.overdue ? 'text-rose-600' : 'text-slate-500'} sm:justify-end`}>
                                <Clock3 className="h-3 w-3 shrink-0" />
                                <span className="line-clamp-1">{isArchivedLead ? 'Przywróć, aby wrócił do pracy' : nextActionMeta.subtitle}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-primary group-hover:text-white">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    </Card>
                  </Link>
                  <button
                    type="button"
                    aria-label={isArchivedLead ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                    title={isArchivedLead ? 'Przywróć leada' : 'Przenieś leada do kosza'}
                    disabled={archivePendingId === String(lead.id || '')}
                    onClick={(event) => isArchivedLead ? handleRestoreLead(event, lead) : handleArchiveLead(event, lead)}
                    className={[
                      'absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-60',
                      isArchivedLead
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white'
                        : 'border-rose-200 bg-rose-950/20 text-rose-300 hover:bg-rose-500 hover:text-white',
                    ].join(' ')}
                  >
                    {archivePendingId === String(lead.id || '') ? <Loader2 className="h-4 w-4 animate-spin" /> : isArchivedLead ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
