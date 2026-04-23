import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  Search,
  ChevronRight,
  Target,
  TrendingUp,
  AlertTriangle,
  Mail,
  Clock,
  FileText,
  Loader2,
  Briefcase,
  CalendarDays,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { format, isAfter, isPast, parseISO, startOfDay, subDays, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  fetchCasesFromSupabase,
  fetchLeadsFromSupabase,
  insertLeadToSupabase,
  isSupabaseConfigured,
} from '../lib/supabase-fallback';
import { hasNextStep, isActiveSalesLead, isLeadMovedToService, isNextStepOverdue } from '../lib/lead-health';

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
};

type LeadsQuickFilter = 'all' | 'active' | 'at-risk' | 'history' | 'no-next-step';

function formatLeadSourceLabel(value: unknown) {
  const normalized = String(value || 'other');
  return SOURCE_OPTIONS.find((option) => option.value === normalized)?.label || 'Inne';
}

function nativeSelectClassName() {
  return 'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
}

function toDateSafe(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    const normalized = value.includes('T') ? value : `${value}T09:00:00`;
    const parsed = parseISO(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object' && value && 'toDate' in (value as Record<string, unknown>)) {
    try {
      const converted = (value as { toDate: () => Date }).toDate();
      return Number.isNaN(converted.getTime()) ? null : converted;
    } catch {
      return null;
    }
  }
  return null;
}

function createSummaryCardClass(active: boolean) {
  return `w-full text-left rounded-2xl transition-all ${active ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`;
}

function createSummaryCardContentClass(active: boolean) {
  return `p-6 flex items-center justify-between ${active ? 'bg-primary/5' : ''}`;
}

export default function Leads() {
  const { workspace, hasAccess } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<LeadsQuickFilter>('active');
  const [valueSortEnabled, setValueSortEnabled] = useState(false);

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'other',
    dealValue: '',
    company: '',
    nextStep: '',
    nextActionAt: '',
  });


  const createLeadSubmitLockRef = useRef(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const loadLeads = useCallback(async () => {
    if (!workspace) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [leadRows, caseRows] = await Promise.all([
        fetchLeadsFromSupabase(),
        fetchCasesFromSupabase().catch(() => []),
      ]);
      setLeads(leadRows as any[]);
      setCases(caseRows as CaseRecord[]);
    } catch (error: any) {
      const message = error?.message || 'Nie udało się pobrać leadów';
      setLoadError(message);
      toast.error(`Błąd odczytu leadów: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [workspace]);

  useEffect(() => {
    if (!workspace) return;
    if (!isSupabaseConfigured()) return;
    void loadLeads();
  }, [loadLeads, workspace]);

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

  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (createLeadSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    if (!newLead.name.trim()) return toast.error('Wpisz nazwę leada');
    createLeadSubmitLockRef.current = true;
    setLeadSubmitting(true);

    try {
      await insertLeadToSupabase({
        ...newLead,
        dealValue: Number(newLead.dealValue) || 0,
        ownerId: workspace?.ownerId,
        workspaceId: workspace?.id,
      });
      await loadLeads();
      toast.success('Lead dodany');
      setIsNewLeadOpen(false);
      setNewLead({ name: '', email: '', phone: '', source: 'other', dealValue: '', company: '', nextStep: '', nextActionAt: '' });
    } catch (error: any) {
      toast.error(`Błąd zapisu leada: ${error.message}`);
    } finally {
      createLeadSubmitLockRef.current = false;
      setLeadSubmitting(false);
    }
  };

  const applyLeadDatePreset = (days: number) => {
    const next = addDays(new Date(), days);
    setNewLead((prev) => ({ ...prev, nextActionAt: format(next, 'yyyy-MM-dd') }));
  };

  const filteredLeads = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const results = leads.filter((lead) => {
      const name = String(lead.name || '').toLowerCase();
      const email = String(lead.email || '').toLowerCase();
      const company = String(lead.company || '').toLowerCase();
      const linkedCase = casesByLeadId.get(String(lead.id));
      const movedToService = isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const activeLead = isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || linkedCase?.id });
      const missingNextStep = activeLead && !hasNextStep(lead);
      const caseTitle = String(linkedCase?.title || '').toLowerCase();
      const caseStatus = String(linkedCase?.status || '').toLowerCase();

      const matchesSearch = !normalizedQuery
        || name.includes(normalizedQuery)
        || email.includes(normalizedQuery)
        || company.includes(normalizedQuery)
        || String(lead.status || 'new').includes(normalizedQuery)
        || String(lead.source || '').toLowerCase().includes(normalizedQuery)
        || String(lead.nextStep || '').toLowerCase().includes(normalizedQuery)
        || caseTitle.includes(normalizedQuery)
        || caseStatus.includes(normalizedQuery);

      const matchesQuickFilter =
        quickFilter === 'all'
        || (quickFilter === 'active' && activeLead)
        || (quickFilter === 'at-risk' && Boolean(lead.isAtRisk))
        || (quickFilter === 'history' && movedToService)
        || (quickFilter === 'no-next-step' && missingNextStep);

      return matchesSearch && matchesQuickFilter;
    });

    if (valueSortEnabled) {
      return [...results].sort((a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0));
    }

    return results;
  }, [casesByLeadId, leads, quickFilter, searchQuery, valueSortEnabled]);

  const stats = {
    total: leads.length,
    active: leads.filter((lead) => isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || casesByLeadId.get(String(lead.id))?.id })).length,
    value: leads.reduce((acc, lead) => acc + (Number(lead.dealValue) || 0), 0),
    atRisk: leads.filter((lead) => Boolean(lead.isAtRisk)).length,
    linkedToCase: leads.filter((lead) => isLeadMovedToService({ ...lead, linkedCaseId: lead.linkedCaseId || casesByLeadId.get(String(lead.id))?.id })).length,
    noNextStep: leads.filter((lead) => !hasNextStep(lead) && isActiveSalesLead({ ...lead, linkedCaseId: lead.linkedCaseId || casesByLeadId.get(String(lead.id))?.id })).length,
  };

  const toggleQuickFilter = (filter: LeadsQuickFilter) => {
    setValueSortEnabled(false);
    setQuickFilter((prev) => (prev === filter ? 'all' : filter));
  };

  const toggleValueSorting = () => {
    setQuickFilter('all');
    setValueSortEnabled((prev) => !prev);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Leady</h1>
            <p className="text-slate-500">Zarządzaj procesem sprzedaży i domykaj deale.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-lg shadow-primary/20">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Kolejny krok</Label>
                      <Input
                        value={newLead.nextStep}
                        onChange={(e) => setNewLead({ ...newLead, nextStep: e.target.value })}
                        placeholder="np. Telefon z ofertą"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="date" value={newLead.nextActionAt} onChange={(e) => setNewLead({ ...newLead, nextActionAt: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => applyLeadDatePreset(0)}>Dziś</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyLeadDatePreset(1)}>Jutro</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyLeadDatePreset(3)}>Za 3 dni</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyLeadDatePreset(7)}>Za tydzień</Button>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={leadSubmitting}>
                      {leadSubmitting ? 'Dodawanie...' : 'Stwórz leada'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
          <button type="button" className={createSummaryCardClass(quickFilter === 'all' && !valueSortEnabled)} onClick={() => { setQuickFilter('all'); setValueSortEnabled(false); }}>
            <Card className="border-none shadow-sm">
              <CardContent className={createSummaryCardContentClass(quickFilter === 'all' && !valueSortEnabled)}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wszystkie</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <Target className="w-6 h-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </button>

          <button type="button" className={createSummaryCardClass(quickFilter === 'active')} onClick={() => toggleQuickFilter('active')}>
            <Card className="border-none shadow-sm">
              <CardContent className={createSummaryCardContentClass(quickFilter === 'active')}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aktywne</p>
                  <h3 className="text-2xl font-bold text-blue-600">{stats.active}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </button>

          <button type="button" className={createSummaryCardClass(valueSortEnabled)} onClick={toggleValueSorting}>
            <Card className="border-none shadow-sm">
              <CardContent className={createSummaryCardContentClass(valueSortEnabled)}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wartość</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stats.value.toLocaleString()} PLN</h3>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">{valueSortEnabled ? 'Sortowanie aktywne' : 'Kliknij, aby sortować po wartości'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </button>

          <button type="button" className={createSummaryCardClass(quickFilter === 'at-risk')} onClick={() => toggleQuickFilter('at-risk')}>
            <Card className="border-none shadow-sm">
              <CardContent className={createSummaryCardContentClass(quickFilter === 'at-risk')}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Zagrożone</p>
                  <h3 className="text-2xl font-bold text-rose-600">{stats.atRisk}</h3>
                </div>
                <div className="bg-rose-50 p-3 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>
              </CardContent>
            </Card>
          </button>

          <button type="button" className={createSummaryCardClass(quickFilter === 'history')} onClick={() => toggleQuickFilter('history')}>
            <Card className="border-none shadow-sm">
              <CardContent className={createSummaryCardContentClass(quickFilter === 'history')}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">W historii</p>
                  <h3 className="text-2xl font-bold text-emerald-600">{stats.linkedToCase}</h3>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl">
                  <Briefcase className="w-6 h-6 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </button>

          <button type="button" className={createSummaryCardClass(quickFilter === 'no-next-step')} onClick={() => toggleQuickFilter('no-next-step')}>
            <Card className="border-none shadow-sm">
              <CardContent className={createSummaryCardContentClass(quickFilter === 'no-next-step')}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bez kroku</p>
                  <h3 className="text-2xl font-bold text-amber-600">{stats.noNextStep}</h3>
                </div>
                <div className="bg-amber-50 p-3 rounded-2xl">
                  <CalendarDays className="w-6 h-6 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </button>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Szukaj po nazwie, emailu, firmie, statusie albo sprawie..."
                className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-slate-500">Ładowanie Twoich leadów...</p>
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
              <h3 className="text-lg font-bold text-slate-900">Nie znaleziono leadów</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">Spróbuj zmienić wyszukiwanie, kliknąć inny kafelek u góry albo dodaj nowego leada.</p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const status = STATUS_OPTIONS.find((option) => option.value === lead.status) || STATUS_OPTIONS[0];
              const nextActionDate = lead.nextActionAt ? parseISO(String(lead.nextActionAt).includes('T') ? String(lead.nextActionAt) : `${String(lead.nextActionAt)}T09:00:00`) : null;
              const isOverdue = nextActionDate ? isPast(nextActionDate) : false;
              const linkedCase = casesByLeadId.get(String(lead.id));
              const sourceLabel = formatLeadSourceLabel(lead.source);
              const leadValueLabel = `${(Number(lead.dealValue) || 0).toLocaleString()} PLN`;

              return (
                <Link key={lead.id} to={`/leads/${lead.id}`}>
                  <Card className="overflow-hidden border-none shadow-sm transition-all group hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4 md:p-4 lg:p-5">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h4 className="min-w-0 truncate text-base font-bold text-slate-900 transition-colors group-hover:text-primary md:text-lg">{lead.name}</h4>
                            <Badge className={`${status.color} border-none font-medium text-[10px] uppercase`}>{status.label}</Badge>
                            <Badge variant="outline" className="text-[10px] uppercase border-slate-200 text-slate-600">
                              <Target className="mr-1 h-3 w-3" /> {sourceLabel}
                            </Badge>
                            {lead.isAtRisk && (
                              <Badge variant="destructive" className="text-[10px] uppercase">
                                Zagrożony
                              </Badge>
                            )}
                            {!hasNextStep(lead) ? (
                              <Badge variant="outline" className="text-[10px] uppercase border-amber-200 text-amber-700">
                                Brak kroku
                              </Badge>
                            ) : null}
                            {linkedCase ? (
                              <Badge variant="outline" className="text-[10px] uppercase border-emerald-200 text-emerald-700">
                                Ma aktywną sprawę
                              </Badge>
                            ) : null}
                            {linkedCase ? (
                              <Badge variant="outline" className="text-[10px] uppercase border-violet-200 text-violet-700">
                                Przeniesiony do obsługi
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
                                Status sprawy: {String(linkedCase.status).replaceAll('_', ' ')}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:flex md:items-center md:gap-4 lg:gap-5">
                          <div className="grid min-w-0 grid-cols-2 gap-2 sm:w-auto sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 px-3 py-2 text-left sm:min-w-[118px] sm:text-right">
                              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Wartość</p>
                              <p className="truncate text-sm font-bold text-slate-900 md:text-base">{leadValueLabel}</p>
                            </div>

                            <div className="rounded-xl bg-slate-50 px-3 py-2 text-left sm:min-w-[118px] sm:text-right">
                              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Następny krok</p>
                              {nextActionDate ? (
                                <p className={`flex items-center gap-1 text-sm font-bold sm:justify-end ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                                  {isOverdue && <AlertTriangle className="h-3 w-3" />}
                                  {format(nextActionDate, 'd MMM', { locale: pl })}
                                </p>
                              ) : (
                                <p className="flex items-center gap-1 text-sm font-bold text-amber-600 sm:justify-end">
                                  <Clock className="h-3 w-3" /> Brak
                                </p>
                              )}
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
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
