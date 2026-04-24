import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Link2,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '../components/confirm-dialog';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
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

function leadSourceLabel(source?: string) {
  switch (source) {
    case 'instagram':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'messenger':
      return 'Messenger';
    case 'whatsapp':
      return 'WhatsApp';
    case 'email':
      return 'E-mail';
    case 'form':
      return 'Formularz';
    case 'phone':
      return 'Telefon';
    case 'referral':
      return 'Polecenie';
    case 'cold_outreach':
      return 'Cold Outreach';
    default:
      return 'Inne';
  }
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
      return 'W toku';
    case 'completed':
      return 'Zakończona';
    default:
      return 'W realizacji';
  }
}

function caseBadgeVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'blocked') return 'destructive';
  if (status === 'ready_to_start' || status === 'completed') return 'secondary';
  return 'outline';
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

function createStatCardClass() {
  return 'border-none app-surface-strong shadow-sm';
}

function buildCaseSourceSummary(sourceLead: any) {
  if (!sourceLead) {
    return 'Źródło: sprawa uruchomiona ręcznie';
  }

  const leadName = sourceLead.name || sourceLead.company || 'Lead';
  return `Źródło: temat pozyskany z leada ${leadName} • ${leadSourceLabel(sourceLead.source)}`;
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <Sparkles className="h-3.5 w-3.5" /> Start realizacji
            </div>
            <div>
              <h1 className="text-3xl font-bold app-text">Sprawy</h1>
              <p className="max-w-2xl text-sm md:text-base app-muted">
                To jest główne miejsce pracy po rozpoczęciu obsługi. Tutaj widzisz, które realizacje stoją, które czekają na klienta i które są już gotowe do startu.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Dialog open={isCreateCaseOpen} onOpenChange={(open) => {
              setIsCreateCaseOpen(open);
              if (!open) {
                setShowCreateClientFields(false);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl" disabled={!workspaceReady}>
                  <Plus className="mr-2 h-4 w-4" /> Dodaj sprawę
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
                      <option value="in_progress">W toku</option>
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
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
          <button type="button" onClick={() => setCaseView('all')} className={`w-full text-left rounded-2xl transition-all ${caseView === 'all' ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`}>
            <Card className={createStatCardClass()}>
              <CardContent className={`flex items-center justify-between p-5 ${caseView === 'all' ? 'bg-primary/5' : ''}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wszystkie</p>
                  <p className="mt-2 text-2xl font-bold app-text">{stats.total}</p>
                </div>
                <div className="rounded-2xl p-3 app-primary-chip"><Briefcase className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </button>
          <button type="button" onClick={() => toggleCaseView('waiting')} className={`w-full text-left rounded-2xl transition-all ${caseView === 'waiting' ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`}>
            <Card className={createStatCardClass()}>
              <CardContent className={`flex items-center justify-between p-5 ${caseView === 'waiting' ? 'bg-primary/5' : ''}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Czekają</p>
                  <p className="mt-2 text-2xl font-bold text-amber-500">{stats.waiting}</p>
                </div>
                <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-500"><Clock className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </button>
          <button type="button" onClick={() => toggleCaseView('blocked')} className={`w-full text-left rounded-2xl transition-all ${caseView === 'blocked' ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`}>
            <Card className={createStatCardClass()}>
              <CardContent className={`flex items-center justify-between p-5 ${caseView === 'blocked' ? 'bg-primary/5' : ''}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Zablokowane</p>
                  <p className="mt-2 text-2xl font-bold text-rose-500">{stats.blocked}</p>
                </div>
                <div className="rounded-2xl bg-rose-500/12 p-3 text-rose-500"><ShieldAlert className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </button>
          <button type="button" onClick={() => toggleCaseView('approval')} className={`w-full text-left rounded-2xl transition-all ${caseView === 'approval' ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`}>
            <Card className={createStatCardClass()}>
              <CardContent className={`flex items-center justify-between p-5 ${caseView === 'approval' ? 'bg-primary/5' : ''}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Akceptacje</p>
                  <p className="mt-2 text-2xl font-bold text-sky-500">{stats.approval}</p>
                </div>
                <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-500"><FileText className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </button>
          <button type="button" onClick={() => toggleCaseView('ready')} className={`w-full text-left rounded-2xl transition-all ${caseView === 'ready' ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`}>
            <Card className={createStatCardClass()}>
              <CardContent className={`flex items-center justify-between p-5 ${caseView === 'ready' ? 'bg-primary/5' : ''}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Gotowe</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-500">{stats.ready}</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </button>
          <button type="button" onClick={() => toggleCaseView('needs_next_step')} className={`w-full text-left rounded-2xl transition-all ${caseView === 'needs_next_step' ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`}>
            <Card className={createStatCardClass()}>
              <CardContent className={`flex items-center justify-between p-5 ${caseView === 'needs_next_step' ? 'bg-primary/5' : ''}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Bez kroku</p>
                  <p className="mt-2 text-2xl font-bold text-orange-500">{stats.needsNextStep}</p>
                </div>
                <div className="rounded-2xl bg-orange-500/12 p-3 text-orange-500"><Target className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </button>
          <button type="button" onClick={() => toggleCaseView('linked')} className={`w-full text-left rounded-2xl transition-all ${caseView === 'linked' ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`}>
            <Card className={createStatCardClass()}>
              <CardContent className={`flex items-center justify-between p-5 ${caseView === 'linked' ? 'bg-primary/5' : ''}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Pozyskane</p>
                  <p className="mt-2 text-2xl font-bold app-text">{stats.linked}</p>
                </div>
                <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-500"><Link2 className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </button>
        </section>

        <Card className="border-none app-surface-strong">
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
              <Input
                placeholder="Szukaj po sprawie, kliencie albo statusie..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <p className="text-sm app-muted">
          Sprawa to główne miejsce dalszej pracy po kliknięciu „Rozpocznij obsługę”. Zadanie jest pojedynczą czynnością, wydarzenie blokiem czasu w kalendarzu, a sprawa spina pełną realizację.
        </p>

        <section className="space-y-4">
          {loading ? (
            <Card className="border-none app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[color:var(--app-primary)]" />
                <p className="text-sm font-medium app-muted">Ładowanie spraw...</p>
              </CardContent>
            </Card>
          ) : filteredCases.length === 0 ? (
            <Card className="border-dashed app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="rounded-full p-4 app-primary-chip"><Target className="h-7 w-7" /></div>
                <div>
                  <p className="text-lg font-semibold app-text">Brak spraw w tym widoku</p>
                  <p className="mt-1 max-w-md text-sm app-muted">Sprawy pojawią się tutaj po kliknięciu „Rozpocznij obsługę” na leadzie albo po ręcznym uruchomieniu realizacji. Zmień wyszukiwanie albo kliknij inny kafelek u góry, jeśli szukasz innego wycinka listy.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredCases.map((record) => {
              const attention = caseNeedsAttention(record);
              const percent = Math.round(record.completenessPercent || 0);
              const updatedAt = toUpdatedDate(record.updatedAt);
              const sourceLead = record.leadId ? leadsById.get(String(record.leadId)) : null;
              const sourceSummary = buildCaseSourceSummary(sourceLead);
              const lifecycle = resolveCaseListLifecycle(record, caseTasksByCaseId, caseEventsByCaseId);

              return (
                <Card key={record.id} className="border-none app-surface-strong app-shadow transition-transform hover:-translate-y-0.5">
                  <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-xl font-bold app-text">{record.title || 'Sprawa bez tytułu'}</h3>
                        <Badge variant={caseBadgeVariant(record.status)}>{caseStatusLabel(record.status)}</Badge>
                        <Badge variant={lifecycleBadgeVariant(lifecycle.bucket)}>{lifecycle.label}</Badge>
                        {attention ? <Badge variant="destructive">Wymaga uwagi</Badge> : null}
                        <Badge variant="outline">{record.leadId || record.createdFromLead ? 'Temat pozyskany' : 'Uruchomiona ręcznie'}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm app-muted">
                        <span>Klient: {record.clientName || 'Brak nazwy klienta'}</span>
                        {record.portalReady ? <span>Portal gotowy</span> : null}
                        <span>Kompletność: {percent}%</span>
                        <span>Ostatni ruch: {updatedAt ? format(updatedAt, 'd MMM yyyy', { locale: pl }) : 'Brak'}</span>
                        <span>{sourceSummary}</span>
                        {record.serviceStartedAt ? (
                          <span>Obsługa od: {format(new Date(record.serviceStartedAt), 'd MMM yyyy', { locale: pl })}</span>
                        ) : null}
                      </div>
                      <div className="space-y-2 rounded-2xl border p-4 app-border app-surface">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] app-muted">
                          <span>Postęp uruchomienia</span>
                          <span>{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
                          <p className="text-sm font-semibold app-text">{lifecycle.headline}</p>
                          <p className="mt-1 text-sm app-muted">Następny ruch: {lifecycle.nextOperatorAction}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs app-muted">
                            <span>{lifecycleRiskLabel(lifecycle.riskLevel)}</span>
                            <span>Otwarte akcje: {lifecycle.openActionCount}</span>
                            <span>Braki wymagane: {lifecycle.missingRequiredCount}</span>
                            <span>Do akceptacji: {lifecycle.waitingApprovalCount}</span>
                          </div>
                        </div>
                        <p className="text-sm app-muted">
                          {record.status === 'blocked'
                            ? 'Sprawa ma realny blok na starcie i wymaga odblokowania.'
                            : record.status === 'waiting_on_client'
                              ? 'Czekasz na materiał, decyzję albo odpowiedź klienta.'
                              : record.status === 'to_approve'
                                ? 'Klient już coś dosłał, ale operator musi to zatwierdzić.'
                                : record.status === 'ready_to_start'
                                  ? 'Sprawa jest gotowa do wejścia w realizację i czeka na operacyjny start.'
                                  : record.status === 'completed'
                                    ? 'Sprawa jest domknięta. Możesz wejść do środka, żeby sprawdzić historię i komplet.'
                                    : 'Realizacja jest w ruchu i wymaga regularnej kontroli.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-[220px] lg:items-end">
                      {record.leadId ? (
                        <Button variant="outline" className="rounded-2xl lg:w-full" asChild>
                          <Link to={`/leads/${record.leadId}`}>Otwórz historię pozyskania <ExternalLink className="h-4 w-4" /></Link>
                        </Button>
                      ) : (
                        <Badge variant="outline" className="justify-center rounded-2xl px-3 py-2 lg:w-full">Uruchomiona ręcznie</Badge>
                      )}
                      <Button className="rounded-2xl lg:w-full" asChild>
                        <Link to={`/case/${record.id}`}>Otwórz sprawę <ChevronRight className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="outline" className="rounded-2xl text-rose-500 hover:text-rose-500 lg:w-full" onClick={() => setCaseToDelete(record)}>
                        <Trash2 className="h-4 w-4" /> Usuń sprawę
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>

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
