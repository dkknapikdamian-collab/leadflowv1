import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
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
  Upload,
  Mail,
  Clock,
  X,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Papa from 'papaparse';
import { format, isAfter, isPast, parseISO, startOfDay, subDays, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  fetchCasesFromSupabase,
  fetchLeadsFromSupabase,
  insertLeadToSupabase,
  isSupabaseConfigured,
} from '../lib/supabase-fallback';
import { hasNextStep, isNextStepOverdue } from '../lib/lead-health';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Skontaktowany', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'qualification', label: 'Kwalifikacja', color: 'bg-purple-100 text-purple-700' },
  { value: 'proposal_sent', label: 'Oferta wysłana', color: 'bg-amber-100 text-amber-700' },
  { value: 'follow_up', label: 'Follow-up', color: 'bg-orange-100 text-orange-700' },
  { value: 'negotiation', label: 'Negocjacje', color: 'bg-pink-100 text-pink-700' },
  { value: 'won', label: 'Wygrany', color: 'bg-emerald-100 text-emerald-700' },
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

export default function Leads() {
  const { workspace, hasAccess } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [atRiskFilter, setAtRiskFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [caseFilter, setCaseFilter] = useState('all');
  const [processFilter, setProcessFilter] = useState('all');

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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    if (!newLead.name.trim()) return toast.error('Wpisz nazwę leada');

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
    }
  };

  const applyLeadDatePreset = (days: number) => {
    const next = addDays(new Date(), days);
    setNewLead((prev) => ({ ...prev, nextActionAt: format(next, 'yyyy-MM-dd') }));
  };

  const handleImportCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !workspace || !hasAccess) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = (results.data as any[]).filter((row) => row?.name).slice(0, 300);
        if (!rows.length) {
          toast.error('Plik CSV nie zawiera poprawnych rekordów');
          return;
        }

        let imported = 0;
        for (const row of rows) {
          try {
            await insertLeadToSupabase({
              name: String(row.name),
              email: String(row.email || ''),
              phone: String(row.phone || ''),
              company: String(row.company || ''),
              source: String(row.source || 'other'),
              dealValue: Number(row.dealValue) || 0,
              nextStep: String(row.nextStep || ''),
              nextActionAt: String(row.nextActionAt || ''),
              workspaceId: workspace.id,
              ownerId: workspace.ownerId,
            });
            imported += 1;
          } catch {
            // Continue import even if one row fails.
          }
        }

        await loadLeads();
        toast.success(`Zaimportowano ${imported} leadów`);
      },
      error: (error) => {
        toast.error(`Błąd importu CSV: ${error.message}`);
      },
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const name = String(lead.name || '').toLowerCase();
    const email = String(lead.email || '').toLowerCase();
    const company = String(lead.company || '').toLowerCase();
    const queryText = searchQuery.toLowerCase();
    const matchesSearch = name.includes(queryText) || email.includes(queryText) || company.includes(queryText);

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesAtRisk =
      atRiskFilter === 'all' ||
      (atRiskFilter === 'at-risk' && Boolean(lead.isAtRisk)) ||
      (atRiskFilter === 'safe' && !lead.isAtRisk);

    let matchesActivity = true;
    const updatedAt = toDateSafe(lead.updatedAt);
    if (activityFilter !== 'all') {
      if (!updatedAt) {
        matchesActivity = false;
      } else {
        const now = new Date();
        if (activityFilter === 'today') {
          matchesActivity = isAfter(updatedAt, startOfDay(now));
        } else if (activityFilter === 'week') {
          matchesActivity = isAfter(updatedAt, subDays(now, 7));
        } else if (activityFilter === 'month') {
          matchesActivity = isAfter(updatedAt, subDays(now, 30));
        }
      }
    }

    const linkedCase = casesByLeadId.get(String(lead.id));
    const matchesCase =
      caseFilter === 'all' ||
      (caseFilter === 'with-case' && Boolean(linkedCase)) ||
      (caseFilter === 'without-case' && !linkedCase);

    const matchesProcess =
      processFilter === 'all' ||
      (processFilter === 'no-next-step' && !['won', 'lost'].includes(String(lead.status || 'new')) && !hasNextStep(lead)) ||
      (processFilter === 'overdue-move' && !['won', 'lost'].includes(String(lead.status || 'new')) && isNextStepOverdue(lead)) ||
      (processFilter === 'organized' && !['won', 'lost'].includes(String(lead.status || 'new')) && hasNextStep(lead) && !isNextStepOverdue(lead));

    return matchesSearch && matchesStatus && matchesSource && matchesAtRisk && matchesActivity && matchesCase && matchesProcess;
  });

  const stats = {
    total: leads.length,
    active: leads.filter((lead) => !['won', 'lost'].includes(String(lead.status || 'new'))).length,
    value: leads.reduce((acc, lead) => acc + (Number(lead.dealValue) || 0), 0),
    atRisk: leads.filter((lead) => Boolean(lead.isAtRisk)).length,
    linkedToCase: leads.filter((lead) => casesByLeadId.has(String(lead.id))).length,
    noNextStep: leads.filter((lead) => !hasNextStep(lead) && !['won', 'lost'].includes(String(lead.status || 'new'))).length,
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
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleImportCSV} />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-xl">
              <Upload className="w-4 h-4 mr-2" /> Import CSV
            </Button>

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
                    <Button type="submit" className="w-full">
                      Stwórz leada
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wszystkie</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <Target className="w-6 h-6 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aktywne</p>
                <h3 className="text-2xl font-bold text-blue-600">{stats.active}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wartość</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.value.toLocaleString()} PLN</h3>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Zagrożone</p>
                <h3 className="text-2xl font-bold text-rose-600">{stats.atRisk}</h3>
              </div>
              <div className="bg-rose-50 p-3 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ze sprawą</p>
                <h3 className="text-2xl font-bold text-emerald-600">{stats.linkedToCase}</h3>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <Briefcase className="w-6 h-6 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bez kroku</p>
                <h3 className="text-2xl font-bold text-amber-600">{stats.noNextStep}</h3>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl">
                <CalendarDays className="w-6 h-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col xl:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Szukaj po nazwie, emailu, firmie..."
                className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Źródło" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie źródła</SelectItem>
                  {SOURCE_OPTIONS.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={atRiskFilter} onValueChange={setAtRiskFilter}>
                <SelectTrigger className="w-[140px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Ryzyko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="at-risk">Zagrożone</SelectItem>
                  <SelectItem value="safe">Bezpieczne</SelectItem>
                </SelectContent>
              </Select>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[160px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Aktywność" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Kiedykolwiek</SelectItem>
                  <SelectItem value="today">Dzisiaj</SelectItem>
                  <SelectItem value="week">Ostatnie 7 dni</SelectItem>
                  <SelectItem value="month">Ostatnie 30 dni</SelectItem>
                </SelectContent>
              </Select>
              <Select value={caseFilter} onValueChange={setCaseFilter}>
                <SelectTrigger className="w-[160px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Sprawa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie leady</SelectItem>
                  <SelectItem value="with-case">Tylko ze sprawą</SelectItem>
                  <SelectItem value="without-case">Tylko bez sprawy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={processFilter} onValueChange={setProcessFilter}>
                <SelectTrigger className="w-[170px] rounded-xl h-11 bg-slate-50 border-none">
                  <SelectValue placeholder="Proces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cały proces</SelectItem>
                  <SelectItem value="no-next-step">Bez następnego kroku</SelectItem>
                  <SelectItem value="overdue-move">Zaległy ruch</SelectItem>
                  <SelectItem value="organized">Poukładane</SelectItem>
                </SelectContent>
              </Select>
              {(statusFilter !== 'all' || sourceFilter !== 'all' || atRiskFilter !== 'all' || activityFilter !== 'all' || caseFilter !== 'all' || processFilter !== 'all' || searchQuery) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter('all');
                    setSourceFilter('all');
                    setAtRiskFilter('all');
                    setActivityFilter('all');
                    setCaseFilter('all');
                    setProcessFilter('all');
                    setSearchQuery('');
                  }}
                  className="h-11 rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" /> Wyczyść
                </Button>
              )}
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
              <p className="text-slate-500 max-w-xs mx-auto mt-1">Spróbuj zmienić filtry lub dodaj nowego leada.</p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const status = STATUS_OPTIONS.find((option) => option.value === lead.status) || STATUS_OPTIONS[0];
              const nextActionDate = lead.nextActionAt ? parseISO(String(lead.nextActionAt).includes('T') ? String(lead.nextActionAt) : `${String(lead.nextActionAt)}T09:00:00`) : null;
              const isOverdue = nextActionDate ? isPast(nextActionDate) : false;
              const linkedCase = casesByLeadId.get(String(lead.id));

              return (
                <Link key={lead.id} to={`/leads/${lead.id}`}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h4 className="text-lg font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{lead.name}</h4>
                            <Badge className={`${status.color} border-none font-medium text-[10px] uppercase`}>{status.label}</Badge>
                            {lead.isAtRisk && (
                              <Badge variant="destructive" className="animate-pulse text-[10px] uppercase">
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
                                Ma sprawę
                              </Badge>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            {lead.company && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5" /> {lead.company}
                              </span>
                            )}
                            <span className="flex items-center gap-1 capitalize">
                              <Target className="w-3.5 h-3.5" /> {lead.source}
                            </span>
                            {lead.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" /> {lead.email}
                              </span>
                            )}
                            {linkedCase?.title ? (
                              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <Briefcase className="w-3.5 h-3.5" /> {linkedCase.title}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right hidden lg:block w-32">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wartość</p>
                            <p className="text-base font-bold text-slate-900">{(Number(lead.dealValue) || 0).toLocaleString()} PLN</p>
                          </div>

                          <div className="text-right w-32">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Następny krok</p>
                            {nextActionDate ? (
                              <p className={`text-sm font-bold flex items-center justify-end gap-1 ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                                {format(nextActionDate, 'd MMM', { locale: pl })}
                              </p>
                            ) : (
                              <p className="text-sm font-bold text-amber-600 flex items-center justify-end gap-1">
                                <Clock className="w-3 h-3" /> Brak
                              </p>
                            )}
                          </div>

                          <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
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
