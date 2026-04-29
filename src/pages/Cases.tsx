import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  ChevronRight,
  ExternalLink,
  Search,
  Sparkles,
  Trash2,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '../components/confirm-dialog';
import Layout from '../components/Layout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { deleteCaseWithRelations } from '../lib/cases';
import { resolveCaseLifecycleV1 } from '../lib/case-lifecycle-v1';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  createCaseInSupabase,
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase-fallback';

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  clientId?: string;
  clientEmail?: string;
  clientPhone?: string;
  status?: string;
  completenessPercent?: number;
  leadId?: string;
  createdFromLead?: boolean;
  serviceStartedAt?: string | null;
  portalReady?: boolean;
  updatedAt?: { toDate?: () => Date } | string | null;
};

type ClientOption = {
  key: string;
  name: string;
  email: string;
  phone: string;
  source: 'case' | 'lead';
};

type CaseView = 'all' | 'waiting' | 'blocked' | 'approval' | 'ready' | 'needs_next_step' | 'linked';

function normalizeClientText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildClientOptions(cases: CaseRecord[], leads: any[]) {
  const map = new Map<string, ClientOption>();

  const push = (rawName: unknown, rawEmail: unknown, rawPhone: unknown, source: 'case' | 'lead') => {
    const name = normalizeClientText(rawName);
    const email = normalizeClientText(rawEmail);
    const phone = normalizeClientText(rawPhone);
    if (!name && !email && !phone) return;

    const key = `${name.toLowerCase()}|${email.toLowerCase()}|${phone}`;
    if (map.has(key)) return;

    map.set(key, {
      key,
      name: name || email || phone || 'Klient',
      email,
      phone,
      source,
    });
  };

  for (const record of cases) {
    push(record.clientName, record.clientEmail, record.clientPhone, 'case');
  }

  for (const lead of leads) {
    push(lead?.name || lead?.company, lead?.email, lead?.phone, 'lead');
  }

  return [...map.values()].sort((left, right) => left.name.localeCompare(right.name, 'pl', { sensitivity: 'base' }));
}

function caseStatusLabel(status?: string) {
  switch (status) {
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'blocked':
      return 'Zablokowana';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'to_approve':
      return 'Do akceptacji';
    case 'in_progress':
      return 'W realizacji';
    case 'completed':
      return 'Zrobione';
    default:
      return 'W realizacji';
  }
}

function caseNeedsAttention(caseRecord: CaseRecord) {
  return caseRecord.status === 'blocked' || caseRecord.status === 'waiting_on_client' || (caseRecord.completenessPercent || 0) < 35;
}

function toUpdatedDate(value: CaseRecord['updatedAt']) {
  if (!value) return null;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}


function buildCaseActionMap(actions: any[]) {
  const map = new Map<string, any[]>();

  for (const action of actions || []) {
    const caseId = normalizeClientText(action?.caseId);
    if (!caseId) continue;

    const current = map.get(caseId) || [];
    current.push(action);
    map.set(caseId, current);
  }

  return map;
}

function resolveCaseListLifecycle(
  record: CaseRecord,
  tasksByCaseId: Map<string, any[]>,
  eventsByCaseId: Map<string, any[]>,
) {
  return resolveCaseLifecycleV1({
    status: record.status,
    tasks: tasksByCaseId.get(String(record.id || '')) || [],
    events: eventsByCaseId.get(String(record.id || '')) || [],
  });
}

function lifecycleBadgeVariant(bucket: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (bucket === 'blocked') return 'destructive';
  if (bucket === 'ready_to_start' || bucket === 'completed') return 'secondary';
  if (bucket === 'needs_next_step' || bucket === 'waiting_approval') return 'outline';
  return 'default';
}

function lifecycleRiskLabel(level: string) {
  if (level === 'high') return 'Ryzyko wysokie';
  if (level === 'medium') return 'Ryzyko średnie';
  return 'Ryzyko niskie';
}

function lifecycleCompactLabel(record: CaseRecord, lifecycle: ReturnType<typeof resolveCaseLifecycleV1>) {
  if (record.status === 'waiting_on_client' || lifecycle.bucket === 'waiting_approval') return 'Czeka na klienta';
  if (record.status === 'blocked' || lifecycle.bucket === 'blocked') return 'Wymaga uwagi';
  return 'Brak blokerów';
}

function lifecycleCompactVariant(record: CaseRecord, lifecycle: ReturnType<typeof resolveCaseLifecycleV1>) {
  if (record.status === 'waiting_on_client' || lifecycle.bucket === 'waiting_approval') return 'amber';
  if (record.status === 'blocked' || lifecycle.bucket === 'blocked') return 'red';
  return 'green';
}

function compactNextAction(value: string) {
  const text = String(value || '').trim();
  if (!text) return 'Brak zaplanowanych działań';
  const firstSentence = text.split(/[.!?]/)[0]?.trim() || text;
  return firstSentence.slice(0, 56);
}

export default function Cases() {
  const { workspace, hasAccess, loading: workspaceLoading, workspaceReady } = useWorkspace();
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [leadCandidates, setLeadCandidates] = useState<any[]>([]);
  const [caseTasks, setCaseTasks] = useState<any[]>([]);
  const [caseEvents, setCaseEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [caseView, setCaseView] = useState<CaseView>('all');
  const [caseToDelete, setCaseToDelete] = useState<CaseRecord | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [createCasePending, setCreateCasePending] = useState(false);
  const [showCreateClientFields, setShowCreateClientFields] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'in_progress',
  });

  const refreshCases = async () => {
    const [caseRows, leadRows, taskRows, eventRows] = await Promise.all([
      fetchCasesFromSupabase(),
      fetchLeadsFromSupabase().catch(() => []),
      fetchTasksFromSupabase().catch(() => []),
      fetchEventsFromSupabase().catch(() => []),
    ]);
    setCases(caseRows as CaseRecord[]);
    setLeadCandidates(leadRows as any[]);
    setCaseTasks(taskRows as any[]);
    setCaseEvents(eventRows as any[]);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (!isSupabaseConfigured() || workspaceLoading || !workspace?.id) {
      setCases([]);
      setLeadCandidates([]);
      setCaseTasks([]);
      setCaseEvents([]);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    Promise.all([
      fetchCasesFromSupabase(),
      fetchLeadsFromSupabase().catch(() => []),
      fetchTasksFromSupabase().catch(() => []),
      fetchEventsFromSupabase().catch(() => []),
    ])
      .then(([caseRows, leadRows, taskRows, eventRows]) => {
        if (!isMounted) return;
        setCases(caseRows as CaseRecord[]);
        setLeadCandidates(leadRows as any[]);
        setCaseTasks(taskRows as any[]);
        setCaseEvents(eventRows as any[]);
        setLoading(false);
      })
      .catch((error: any) => {
        if (!isMounted) return;
        toast.error(`Błąd cases API: ${error.message}`);
        setCases([]);
        setLeadCandidates([]);
        setCaseTasks([]);
        setCaseEvents([]);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [workspace?.id, workspaceLoading]);

  const caseTasksByCaseId = useMemo(() => buildCaseActionMap(caseTasks), [caseTasks]);
  const caseEventsByCaseId = useMemo(() => buildCaseActionMap(caseEvents), [caseEvents]);

  const stats = useMemo(() => {
    const lifecycleRows = cases.map((record) => resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId));

    return {
      total: cases.length,
      waiting: lifecycleRows.filter((entry) => entry.bucket === 'blocked' || entry.bucket === 'waiting_approval').length,
      blocked: lifecycleRows.filter((entry) => entry.bucket === 'blocked').length,
      approval: lifecycleRows.filter((entry) => entry.bucket === 'waiting_approval').length,
      ready: lifecycleRows.filter((entry) => entry.bucket === 'ready_to_start').length,
      needsNextStep: lifecycleRows.filter((entry) => entry.bucket === 'needs_next_step').length,
      linked: cases.filter((record) => !!record.leadId).length,
    };
  }, [caseEventsByCaseId, caseTasksByCaseId, cases]);

  const leadsById = useMemo(
    () => new Map((leadCandidates || []).map((entry: any) => [String(entry.id || ''), entry])),
    [leadCandidates]
  );

  const clientOptions = useMemo(() => buildClientOptions(cases, leadCandidates), [cases, leadCandidates]);

  const clientSuggestions = useMemo(() => {
    const normalizedQuery = newCase.clientName.trim().toLowerCase();
    const base = normalizedQuery
      ? clientOptions.filter((option) => {
          return [option.name, option.email, option.phone]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery));
        })
      : clientOptions;

    return base.slice(0, 6);
  }, [clientOptions, newCase.clientName]);

  const filteredCases = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return cases.filter((record) => {
      const matchesSearch = !normalizedQuery || (
        record.title?.toLowerCase().includes(normalizedQuery)
        || record.clientName?.toLowerCase().includes(normalizedQuery)
        || record.clientEmail?.toLowerCase().includes(normalizedQuery)
        || record.clientPhone?.toLowerCase().includes(normalizedQuery)
        || record.status?.toLowerCase().includes(normalizedQuery)
      );

      const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
      const matchesView =
        caseView === 'all'
        || (caseView === 'waiting' && (lifecycle.bucket === 'blocked' || lifecycle.bucket === 'waiting_approval'))
        || (caseView === 'blocked' && lifecycle.bucket === 'blocked')
        || (caseView === 'approval' && lifecycle.bucket === 'waiting_approval')
        || (caseView === 'ready' && lifecycle.bucket === 'ready_to_start')
        || (caseView === 'needs_next_step' && lifecycle.bucket === 'needs_next_step')
        || (caseView === 'linked' && Boolean(record.leadId));

      return matchesSearch && matchesView;
    });
  }, [caseEventsByCaseId, caseTasksByCaseId, caseView, cases, searchQuery]);

  const toggleCaseView = (view: CaseView) => {
    setCaseView((prev) => (prev === view ? 'all' : view));
  };

  async function handleDeleteCase() {
    if (!caseToDelete) return;

    try {
      setDeletePending(true);
      await deleteCaseWithRelations(caseToDelete.id);
      setCases((prev) => prev.filter((entry) => entry.id !== caseToDelete.id));
      toast.success('Sprawa usunięta');
      setCaseToDelete(null);
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setDeletePending(false);
    }
  }

  async function handleCreateCase(e: FormEvent) {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    if (!newCase.title.trim()) return toast.error('Podaj tytuł sprawy');

    try {
      setCreateCasePending(true);
      await createCaseInSupabase({
        title: newCase.title.trim(),
        clientName: newCase.clientName.trim(),
        clientEmail: newCase.clientEmail.trim(),
        clientPhone: newCase.clientPhone.trim(),
        status: newCase.status,
        createdFromLead: false,
        portalReady: false,
        workspaceId,
      });
      await refreshCases();
      toast.success('Sprawa utworzona');
      setIsCreateCaseOpen(false);
      setShowCreateClientFields(false);
      setNewCase({
        title: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        status: 'in_progress',
      });
    } catch (error: any) {
      toast.error(`Błąd tworzenia sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCreateCasePending(false);
    }
  }

  function handleSelectClientSuggestion(option: ClientOption) {
    setNewCase((prev) => ({
      ...prev,
      title: prev.title.trim() ? prev.title : `${option.name} - obsługa`,
      clientName: option.name,
      clientEmail: option.email,
      clientPhone: option.phone,
    }));
    setShowCreateClientFields(false);
  }

  return (
    <Layout>
      <div className="cf-html-view main-cases-html" data-cases-real-view="true">
        <div className="page-head">
          <div>
            <span className="kicker">Centrum obsługi</span>
            <h1>Sprawy</h1>
            <p className="lead-copy">Lista spraw ma pokazać, które tematy są w pracy, które stoją i co wymaga klienta.</p>
          </div>
          <div className="head-actions">
            <Button type="button" variant="outline" className="btn soft-blue">
              <Sparkles className="h-4 w-4" /> Zapytaj AI
            </Button>
            <Dialog open={isCreateCaseOpen} onOpenChange={(open) => {
              setIsCreateCaseOpen(open);
              if (!open) {
                setShowCreateClientFields(false);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="btn primary" disabled={!workspaceReady}>
                  <Plus className="h-4 w-4" /> Nowa sprawa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nowa sprawa</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCase} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Tytuł sprawy</Label>
                    <Input value={newCase.title} onChange={(event) => setNewCase((prev) => ({ ...prev, title: event.target.value }))} placeholder="np. Wdrożenie klienta X" />
                  </div>
                  <div className="space-y-2">
                    <Label>Klient</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newCase.clientName}
                        onChange={(event) => setNewCase((prev) => ({ ...prev, clientName: event.target.value }))}
                        placeholder="Wpisz klienta, a system podpowie z leadów i spraw"
                      />
                      <Button
                        type="button"
                        variant={showCreateClientFields ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setShowCreateClientFields((prev) => !prev)}
                        title="Dodaj nowego klienta"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {clientSuggestions.length > 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 space-y-1">
                        {clientSuggestions.map((option) => (
                          <button
                            key={option.key}
                            type="button"
                            className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-white"
                            onClick={() => handleSelectClientSuggestion(option)}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{option.name}</p>
                                <p className="text-xs text-slate-500 truncate">
                                  {[option.email, option.phone].filter(Boolean).join(' • ') || 'Dane klienta zapisane w systemie'}
                                </p>
                              </div>
                              <Badge variant="outline">{option.source === 'lead' ? 'Z leada' : 'Ze sprawy'}</Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {!showCreateClientFields && (newCase.clientEmail || newCase.clientPhone) ? (
                      <p className="text-xs text-slate-500">
                        Wybrany klient: {[newCase.clientEmail, newCase.clientPhone].filter(Boolean).join(' • ')}
                      </p>
                    ) : null}
                  </div>
                  {showCreateClientFields ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                      <p className="text-sm font-semibold text-slate-900">Nowy klient dla tej sprawy</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>E-mail klienta</Label>
                          <Input value={newCase.clientEmail} onChange={(event) => setNewCase((prev) => ({ ...prev, clientEmail: event.target.value }))} placeholder="np. klient@firma.pl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Telefon klienta</Label>
                          <Input value={newCase.clientPhone} onChange={(event) => setNewCase((prev) => ({ ...prev, clientPhone: event.target.value }))} placeholder="np. 500 000 000" />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <Label>Status startowy</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      value={newCase.status}
                      onChange={(event) => setNewCase((prev) => ({ ...prev, status: event.target.value }))}
                    >
                      <option value="in_progress">W realizacji</option>
                      <option value="waiting_on_client">Czeka na klienta</option>
                      <option value="blocked">Zablokowana</option>
                      <option value="ready_to_start">Gotowa do startu</option>
                    </select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateCaseOpen(false)}>Anuluj</Button>
                    <Button type="submit" disabled={createCasePending || !workspaceReady}>{createCasePending ? 'Tworzenie...' : 'Utwórz sprawę'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid-4">
          <button type="button" className={`metric ${caseView === 'all' ? 'active' : ''}`} onClick={() => setCaseView('all')}>
            <div><label>W realizacji</label><strong>{stats.total}</strong><div className="hint">otwarte</div></div>
          </button>
          <button type="button" className={`metric ${caseView === 'waiting' || caseView === 'approval' ? 'active' : ''}`} onClick={() => toggleCaseView('waiting')}>
            <div><label>Czeka na klienta</label><strong>{stats.waiting}</strong><div className="hint">po stronie klienta</div></div>
          </button>
          <button type="button" className={`metric ${caseView === 'blocked' ? 'active' : ''}`} onClick={() => toggleCaseView('blocked')}>
            <div><label>Zablokowane</label><strong>{stats.blocked}</strong><div className="hint">brak krytycznych</div></div>
          </button>
          <button type="button" className={`metric ${caseView === 'ready' ? 'active' : ''}`} onClick={() => toggleCaseView('ready')}>
            <div><label>Gotowe</label><strong>{stats.ready}</strong><div className="hint">historia</div></div>
          </button>
        </div>

        <div className="layout-list">
          <div className="stack">
            <div className="search">
              <span aria-hidden="true"><Search className="h-4 w-4" /></span>
              <Input
                placeholder="Szukaj sprawy, klienta, telefonu, maila albo statusu..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            {loading ? (
              <div className="table-card">
                <div className="row row-empty">
                  <span className="index"><div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[color:var(--app-primary)]" /></span>
                  <span><span className="title">Ładowanie spraw</span><span className="sub">Pobieram dane z aplikacji.</span></span>
                </div>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="table-card">
                <div className="row row-empty">
                  <span className="index">0</span>
                  <span><span className="title">Brak spraw w tym widoku</span><span className="sub">Zmień wyszukiwanie albo kliknij inny kafel metryk.</span></span>
                </div>
              </div>
            ) : (
              <div className="table-card">
                {filteredCases.map((record, index) => {
                  const attention = caseNeedsAttention(record);
                  const percent = Math.round(record.completenessPercent || 0);
                  const updatedAt = toUpdatedDate(record.updatedAt);
                  const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
                  const statusLabel = caseStatusLabel(record.status);
                  const compactLifecycleLabel = lifecycleCompactLabel(record, lifecycle);
                  const compactLifecyclePill = compactLifecycleLabel === statusLabel ? null : compactLifecycleLabel;
                  const nextActionLabel = compactNextAction(lifecycle.nextOperatorAction);
                  const metaSuffix = lifecycle.missingRequiredCount > 0
                    ? `brakuje ${lifecycle.missingRequiredCount} elementów`
                    : `${percent}% kompletności`;
                  return (
                    <div key={record.id} className="row case-row">
                      <span className="index">{index + 1}</span>
                      <span className="lead-main-cell min-w-0">
                        <Link to={`/case/${record.id}`} className="title">{record.title || 'Sprawa bez tytułu'}</Link>
                        <span className="sub">Klient: {record.clientName || 'Brak nazwy klienta'} · {metaSuffix}</span>
                        <span className="statusline">
                          <span className={`pill ${record.status === 'blocked' ? 'red' : record.status === 'waiting_on_client' ? 'amber' : 'blue'}`}>{statusLabel}</span>
                          {compactLifecyclePill ? <span className={`pill ${lifecycleCompactVariant(record, lifecycle)}`}>{compactLifecyclePill}</span> : null}
                          {attention && !compactLifecyclePill ? <span className="pill amber">Wymaga uwagi</span> : null}
                        </span>
                      </span>
                      <span className="lead-value-cell">
                        <span className="mini">Postęp</span>
                        <strong>{percent}%</strong>
                      </span>
                      <span className="lead-action-cell">
                        <span className="mini">Następny ruch</span>
                        <strong className="next-action-text">{nextActionLabel}</strong>
                        {updatedAt ? <span className="sub next-action-date">{format(updatedAt, 'd MMM yyyy', { locale: pl })}</span> : null}
                      </span>
                      <span className="lead-actions">
                        <Button variant="outline" className="btn ghost" asChild>
                          <Link to={`/case/${record.id}`} aria-label={`Otwórz sprawę ${record.title || ''}`}><ChevronRight className="h-4 w-4" /></Link>
                        </Button>
                        <span className="sr-only">
                          {record.leadId ? <Link to={`/leads/${record.leadId}`}><ExternalLink className="h-4 w-4" /></Link> : null}
                          <button type="button" onClick={() => setCaseToDelete(record)}><Trash2 className="h-4 w-4" /></button>
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="cases-right-rail">
            <aside className="right-card">
              <div className="panel-head"><div><h3>Operacyjne skróty</h3><p>Najczęstsze ruchy dla spraw.</p></div></div>
              <div className="quick-list">
                <button type="button" onClick={() => toggleCaseView('needs_next_step')}><span>Dodaj brak</span><strong>{stats.needsNextStep}</strong></button>
                <button type="button" onClick={() => toggleCaseView('linked')}><span>Portal klienta</span><strong>{stats.linked}</strong></button>
                <button type="button" onClick={() => toggleCaseView('waiting')}><span>Sprawy bez ruchu</span><strong>{stats.waiting}</strong></button>
                <button type="button" onClick={() => toggleCaseView('approval')}><span>Do akceptacji</span><strong>{stats.approval}</strong></button>
              </div>
            </aside>

            <aside className="right-card">
              <div className="panel-head"><div><h3>Blokery i ryzyko</h3><p>Podgląd stanu na podstawie lifecycle.</p></div></div>
              <div className="quick-list">
                {filteredCases.slice(0, 4).map((record) => {
                  const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);
                  return (
                    <Link key={record.id} to={`/case/${record.id}`}>
                      <span><strong>{record.title || 'Sprawa'}</strong><small>{lifecycleRiskLabel(lifecycle.riskLevel)} · Braki {lifecycle.missingRequiredCount}</small></span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
                {filteredCases.length === 0 ? <div className="note">Brak spraw do pokazania.</div> : null}
              </div>
            </aside>
          </div>
        </div>

        <ConfirmDialog
          open={Boolean(caseToDelete)}
          onOpenChange={(open) => {
            if (!open && !deletePending) setCaseToDelete(null);
          }}
          title="Usunąć sprawę?"
          description={caseToDelete ? `Sprawa "${caseToDelete.title || 'bez tytułu'}" zostanie usunięta razem z checklistą i aktywnościami, ale bez kasowania leada, klienta, zadań i wydarzeń.` : ''}
          confirmLabel="Usuń sprawę"
          pending={deletePending}
          onConfirm={handleDeleteCase}
        />
      </div>
    </Layout>
  );
}
