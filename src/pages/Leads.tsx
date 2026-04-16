import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { auth, db } from '../firebase';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { format, isPast, isToday, parseISO, startOfDay, subDays, isAfter, addDays, differenceInCalendarDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  LayoutList,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Target,
  TrendingUp,
  Upload,
  X,
  KanbanSquare,
  Sparkles,
} from 'lucide-react';

import Layout from '../components/Layout';
import { useWorkspace } from '../hooks/useWorkspace';
import { getLeadSourceLabel, LEAD_SOURCE_OPTIONS } from '../lib/leadSources';
import { ensureCurrentUserWorkspace } from '../lib/workspace';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

type LeadRecord = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: LeadStatus;
  nextStep?: string;
  nextActionAt?: string;
  dealValue?: number;
  isAtRisk?: boolean;
  updatedAt?: Timestamp | string | null;
};

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualification'
  | 'proposal_sent'
  | 'follow_up'
  | 'negotiation'
  | 'won'
  | 'lost';

type QuickActionKey = 'followup' | 'waiting' | 'meeting' | 'won' | 'lost' | 'risk';

type StatusOption = {
  value: LeadStatus;
  label: string;
  toneClass: string;
  pipelineTitle: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'new', label: 'Nowy', toneClass: 'bg-sky-500/12 text-sky-500 border-sky-500/20', pipelineTitle: 'Nowe' },
  { value: 'contacted', label: 'Skontaktowany', toneClass: 'bg-indigo-500/12 text-indigo-500 border-indigo-500/20', pipelineTitle: 'Kontakt' },
  { value: 'qualification', label: 'Kwalifikacja', toneClass: 'bg-violet-500/12 text-violet-500 border-violet-500/20', pipelineTitle: 'Kwalifikacja' },
  { value: 'proposal_sent', label: 'Oferta wysłana', toneClass: 'bg-amber-500/12 text-amber-600 border-amber-500/20', pipelineTitle: 'Oferta' },
  { value: 'follow_up', label: 'Dalszy kontakt', toneClass: 'bg-orange-500/12 text-orange-500 border-orange-500/20', pipelineTitle: 'Dalszy kontakt' },
  { value: 'negotiation', label: 'Negocjacje', toneClass: 'bg-pink-500/12 text-pink-500 border-pink-500/20', pipelineTitle: 'Negocjacje' },
  { value: 'won', label: 'Wygrany', toneClass: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/20', pipelineTitle: 'Wygrane' },
  { value: 'lost', label: 'Stracony', toneClass: 'bg-slate-500/12 text-slate-500 border-slate-500/20', pipelineTitle: 'Stracone' },
];

const SOURCE_OPTIONS = LEAD_SOURCE_OPTIONS;

const PIPELINE_ORDER: LeadStatus[] = ['new', 'contacted', 'qualification', 'proposal_sent', 'follow_up', 'negotiation', 'won', 'lost'];
const ACTIVE_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualification', 'proposal_sent', 'follow_up', 'negotiation'];

function toDate(value?: Timestamp | string | null) {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return parseISO(value);
    } catch {
      return null;
    }
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return null;
}

function getStatusOption(status?: string) {
  return STATUS_OPTIONS.find((option) => option.value === status) ?? STATUS_OPTIONS[0];
}

function dueState(lead: LeadRecord) {
  const nextDate = lead.nextActionAt ? parseISO(lead.nextActionAt) : null;
  if (!nextDate) {
    return {
      label: 'Brak kroku',
      tone: 'text-amber-500',
      badge: <Badge className="border-amber-500/20 bg-amber-500/12 text-amber-500">Brak kolejnego kroku</Badge>,
      sortWeight: 5,
    };
  }

  if (isPast(nextDate) && !isToday(nextDate)) {
    return {
      label: format(nextDate, 'd MMM, HH:mm', { locale: pl }),
      tone: 'text-rose-500',
      badge: <Badge variant="destructive">Po terminie</Badge>,
      sortWeight: 6,
    };
  }

  if (isToday(nextDate)) {
    return {
      label: format(nextDate, 'd MMM, HH:mm', { locale: pl }),
      tone: 'text-[color:var(--app-primary)]',
      badge: <Badge variant="secondary">Dziś</Badge>,
      sortWeight: 4,
    };
  }

  return {
    label: format(nextDate, 'd MMM, HH:mm', { locale: pl }),
    tone: 'app-text',
    badge: <Badge variant="outline">Zaplanowane</Badge>,
    sortWeight: 2,
  };
}

function reasonText(lead: LeadRecord) {
  const updatedDate = toDate(lead.updatedAt);
  const nextDate = lead.nextActionAt ? parseISO(lead.nextActionAt) : null;

  if (!lead.nextActionAt || !lead.nextStep) return 'Lead nie ma kompletnego kolejnego ruchu.';
  if (nextDate && isPast(nextDate) && !isToday(nextDate)) return 'Termin minął i lead może wypaść z procesu.';
  if (lead.isAtRisk) return 'Lead oznaczony jako zagrożony i wymaga Twojej uwagi.';
  if (updatedDate && differenceInCalendarDays(new Date(), updatedDate) >= 5) return 'Brak ruchu od kilku dni. To już pachnie zaniedbaniem.';
  if ((lead.dealValue || 0) >= 5000) return 'Lead o wysokiej wartości. Warto dopiąć go wcześniej niż drobnicę.';
  return 'Lead jest aktywny i ma ustawiony kolejny ruch.';
}

function activityMatches(lead: LeadRecord, activityFilter: string) {
  if (activityFilter === 'all') return true;
  const updatedDate = toDate(lead.updatedAt);
  if (!updatedDate) return false;

  if (activityFilter === 'today') return isAfter(updatedDate, startOfDay(new Date()));
  if (activityFilter === 'week') return isAfter(updatedDate, subDays(new Date(), 7));
  if (activityFilter === 'month') return isAfter(updatedDate, subDays(new Date(), 30));
  return true;
}

function startInDaysAtHour(days: number, hour: number) {
  return format(addDays(new Date(), days), `yyyy-MM-dd'T'${String(hour).padStart(2, '0')}:00`);
}

function LeadRow({
  lead,
  onQuickAction,
  busy,
}: {
  key?: string;
  lead: LeadRecord;
  onQuickAction: (lead: LeadRecord, action: QuickActionKey) => void;
  busy: string | null;
}) {
  const status = getStatusOption(lead.status);
  const nextState = dueState(lead);
  const daysSinceTouch = toDate(lead.updatedAt)
    ? differenceInCalendarDays(new Date(), toDate(lead.updatedAt) as Date)
    : 0;
  const busyForThisLead = busy?.startsWith(lead.id) ?? false;

  return (
    <Card className="border-none app-surface-strong transition-all hover:-translate-y-0.5 hover:app-shadow">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold app-text">{lead.name}</h3>
              <Badge className={cn('border', status.toneClass)}>{status.label}</Badge>
              {lead.isAtRisk ? <Badge variant="destructive">Zagrożony</Badge> : null}
              {!lead.nextActionAt || !lead.nextStep ? <Badge variant="outline">Brak opieki</Badge> : null}
            </div>

            <p className="text-sm app-muted">{reasonText(lead)}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm app-muted">
              {lead.company ? <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {lead.company}</span> : null}
              {lead.source ? <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" /> {getLeadSourceLabel(lead.source)}</span> : null}
              {lead.email ? <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {lead.email}</span> : null}
              {lead.phone ? <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {lead.phone}</span> : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[430px]">
            <div className="rounded-2xl border app-border p-3 app-surface">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] app-muted">Wartość</p>
              <p className="mt-2 text-base font-bold app-text">{(lead.dealValue || 0).toLocaleString()} PLN</p>
            </div>
            <div className="rounded-2xl border app-border p-3 app-surface">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] app-muted">Termin</p>
              <p className={cn('mt-2 text-sm font-bold', nextState.tone)}>{nextState.label}</p>
            </div>
            <div className="rounded-2xl border app-border p-3 app-surface">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] app-muted">Next step</p>
              <p className="mt-2 line-clamp-2 text-sm font-semibold app-text">{lead.nextStep || 'Nie ustawiono'}</p>
            </div>
            <div className="rounded-2xl border app-border p-3 app-surface">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] app-muted">Bez ruchu</p>
              <p className="mt-2 text-base font-bold app-text">{daysSinceTouch} dni</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {nextState.badge}
            {(lead.dealValue || 0) >= 5000 ? <Badge variant="secondary">Wysoka wartość</Badge> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" disabled={busyForThisLead} onClick={() => onQuickAction(lead, 'followup')}>
              Dalszy kontakt jutro
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl" disabled={busyForThisLead} onClick={() => onQuickAction(lead, 'waiting')}>
              Czekamy 3 dni
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl" disabled={busyForThisLead}>
                  <MoreHorizontal className="h-4 w-4" /> Więcej
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => onQuickAction(lead, 'meeting')}>Ustaw spotkanie</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickAction(lead, 'risk')}>{lead.isAtRisk ? 'Zdejmij flagę ryzyka' : 'Oznacz jako zagrożony'}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onQuickAction(lead, 'won')}>Oznacz jako wygrany</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickAction(lead, 'lost')} className="text-rose-500">Oznacz jako stracony</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="rounded-xl" asChild>
              <Link to={`/leads/${lead.id}`}>Otwórz <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineColumn({
  status,
  leads,
  onMove,
  onOpen,
}: {
  key?: string;
  status: StatusOption;
  leads: LeadRecord[];
  onMove: (lead: LeadRecord, status: LeadStatus) => void;
  onOpen: (leadId: string) => void;
}) {
  const totalValue = leads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);

  return (
    <Card className="min-w-[280px] border-none app-surface-strong">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{status.pipelineTitle}</CardTitle>
            <CardDescription>{leads.length} leadów · {totalValue.toLocaleString()} PLN</CardDescription>
          </div>
          <Badge className={cn('border', status.toneClass)}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed app-border p-4 text-sm app-muted">Pusto. Tu wpadną leady po zmianie etapu.</div>
        ) : (
          leads.map((lead) => {
            const nextState = dueState(lead);
            return (
              <div key={lead.id} className="rounded-2xl border app-border p-4 app-surface">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <button className="truncate text-left text-sm font-bold app-text hover:underline" onClick={() => onOpen(lead.id)}>
                      {lead.name}
                    </button>
                    <p className="mt-1 text-xs app-muted">{lead.company || getLeadSourceLabel(lead.source) || 'Bez dodatkowego opisu'}</p>
                  </div>
                  {lead.isAtRisk ? <Badge variant="destructive">Ryzyko</Badge> : null}
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="app-muted">Wartość</span>
                    <span className="font-semibold app-text">{(lead.dealValue || 0).toLocaleString()} PLN</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="app-muted">Termin</span>
                    <span className={cn('font-semibold', nextState.tone)}>{lead.nextActionAt ? nextState.label : 'Brak'}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Select value={lead.status || 'new'} onValueChange={(value) => onMove(lead, value as LeadStatus)}>
                    <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => onOpen(lead.id)}>
                    Szczegóły
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default function Leads() {
  const { workspace, hasAccess } = useWorkspace();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [atRiskFilter, setAtRiskFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [quickActionBusy, setQuickActionBusy] = useState<string | null>(null);

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'other',
    dealValue: '',
    company: '',
    nextStep: '',
    nextActionAt: format(new Date(), "yyyy-MM-dd'T'09:00"),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser || !workspace) {
      setLeads([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const leadsQuery = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      leadsQuery,
      (snapshot) => {
        setLeads(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<LeadRecord, 'id'>) })));
        setLoading(false);
      },
      () => {
        setLeads([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspace]);

  async function handleCreateLead(e: FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) return toast.error('Brak aktywnej sesji.');
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    if (!newLead.name.trim()) return toast.error('Wpisz nazwę leada.');

    try {
      const ensuredWorkspace = workspace ?? await ensureCurrentUserWorkspace();
      await addDoc(collection(db, 'leads'), {
        ...newLead,
        dealValue: Number(newLead.dealValue) || 0,
        status: 'new',
        ownerId: auth.currentUser.uid,
        workspaceId: ensuredWorkspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAtRisk: false,
      });

      toast.success('Lead dodany');
      setIsNewLeadOpen(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        source: 'other',
        dealValue: '',
        company: '',
        nextStep: '',
        nextActionAt: format(new Date(), "yyyy-MM-dd'T'09:00"),
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  }

  function handleImportCSV(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !workspace || !hasAccess) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const batch = writeBatch(db);
        let count = 0;

        for (const row of results.data as Record<string, string>[]) {
          if (!row.name) continue;
          const leadRef = doc(collection(db, 'leads'));
          batch.set(leadRef, {
            name: row.name,
            email: row.email || '',
            phone: row.phone || '',
            company: row.company || '',
            source: row.source || 'other',
            dealValue: Number(row.dealValue) || 0,
            status: 'new',
            nextStep: row.nextStep || '',
            nextActionAt: row.nextActionAt || '',
            ownerId: auth.currentUser?.uid,
            workspaceId: workspace.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isAtRisk: false,
          });
          count += 1;
          if (count >= 450) break;
        }

        try {
          await batch.commit();
          toast.success(`Zaimportowano ${count} leadów`);
        } catch (error: any) {
          toast.error('Błąd importu: ' + error.message);
        }
      },
    });
  }

  async function handleQuickAction(lead: LeadRecord, action: QuickActionKey) {
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    setQuickActionBusy(`${lead.id}:${action}`);

    try {
      const updates: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };

      if (action === 'followup') {
        updates.status = 'follow_up';
        updates.nextStep = 'Dalszy kontakt po rozmowie';
        updates.nextActionAt = startInDaysAtHour(1, 9);
      }

      if (action === 'waiting') {
        updates.status = 'contacted';
        updates.nextStep = 'Sprawdzić odpowiedź klienta';
        updates.nextActionAt = startInDaysAtHour(3, 9);
      }

      if (action === 'meeting') {
        updates.status = 'qualification';
        updates.nextStep = 'Spotkanie z leadem';
        updates.nextActionAt = startInDaysAtHour(2, 10);
      }

      if (action === 'won') {
        updates.status = 'won';
      }

      if (action === 'lost') {
        updates.status = 'lost';
      }

      if (action === 'risk') {
        updates.isAtRisk = !lead.isAtRisk;
      }

      await updateDoc(doc(db, 'leads', lead.id), updates);
      toast.success('Lead zaktualizowany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    } finally {
      setQuickActionBusy(null);
    }
  }

  async function handleMoveStage(lead: LeadRecord, status: LeadStatus) {
    try {
      await updateDoc(doc(db, 'leads', lead.id), {
        status,
        updatedAt: serverTimestamp(),
      });
      toast.success(`Etap zmieniony na: ${getStatusOption(status).label}`);
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  }

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const haystack = [lead.name, lead.email, lead.company, lead.phone].filter(Boolean).join(' ').toLowerCase();
        const matchesSearch = haystack.includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
        const matchesAtRisk = atRiskFilter === 'all'
          || (atRiskFilter === 'at-risk' && lead.isAtRisk)
          || (atRiskFilter === 'safe' && !lead.isAtRisk);
        const matchesActivity = activityMatches(lead, activityFilter);

        return matchesSearch && matchesStatus && matchesSource && matchesAtRisk && matchesActivity;
      })
      .sort((a, b) => {
        const stateDiff = dueState(b).sortWeight - dueState(a).sortWeight;
        if (stateDiff !== 0) return stateDiff;
        return (b.dealValue || 0) - (a.dealValue || 0);
      });
  }, [activityFilter, atRiskFilter, leads, searchQuery, sourceFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = leads.filter((lead) => ACTIVE_STATUSES.includes((lead.status || 'new') as LeadStatus));
    return {
      total: leads.length,
      active: active.length,
      value: active.reduce((acc, lead) => acc + (lead.dealValue || 0), 0),
      atRisk: active.filter((lead) => lead.isAtRisk || !lead.nextActionAt || !lead.nextStep).length,
      overdue: active.filter((lead) => lead.nextActionAt && isPast(parseISO(lead.nextActionAt)) && !isToday(parseISO(lead.nextActionAt))).length,
    };
  }, [leads]);

  const pipeline = useMemo(() => {
    return PIPELINE_ORDER.map((status) => ({
      status: getStatusOption(status),
      leads: filteredLeads.filter((lead) => (lead.status || 'new') === status),
    }));
  }, [filteredLeads]);

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold app-primary-chip">
              <Sparkles className="h-3.5 w-3.5" /> Centrum ruchu sprzedażowego
            </div>
            <h1 className="mt-3 text-3xl font-bold app-text">Leady</h1>
            <p className="mt-1 max-w-2xl app-muted">Tutaj nie tylko przeglądasz rekordy. Tu przesuwasz proces do przodu, ustawiasz kolejny ruch i szybko łapiesz leady, które zaczynają gnić.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleImportCSV} />
            <Button variant="outline" className="rounded-xl" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Import CSV
            </Button>
            <Button variant="outline" className="rounded-xl" disabled>
              <Download className="h-4 w-4" /> Eksport wkrótce
            </Button>

            <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-sm">
                  <Plus className="h-4 w-4" /> Dodaj leada
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Nowy lead</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateLead} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Imię i nazwisko / nazwa</Label>
                    <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} required />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Firma</Label>
                      <Input value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Wartość (PLN)</Label>
                      <Input type="number" value={newLead.dealValue} onChange={(e) => setNewLead({ ...newLead, dealValue: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Źródło</Label>
                      <select
                        value={newLead.source}
                        onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                        className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                      >
                        {SOURCE_OPTIONS.map((source) => (
                          <option key={source.value} value={source.value}>{source.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="datetime-local" value={newLead.nextActionAt} onChange={(e) => setNewLead({ ...newLead, nextActionAt: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Następny krok</Label>
                    <Input value={newLead.nextStep} onChange={(e) => setNewLead({ ...newLead, nextStep: e.target.value })} placeholder="Np. zadzwonić i domknąć termin rozmowy" />
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full rounded-xl">Dodaj leada</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wszystkie</p>
                <p className="mt-2 text-3xl font-bold app-text">{stats.total}</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><Target className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Aktywne</p>
                <p className="mt-2 text-3xl font-bold app-text">{stats.active}</p>
              </div>
              <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-500"><CheckCircle2 className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">W lejku</p>
                <p className="mt-2 text-2xl font-bold app-text">{stats.value.toLocaleString()} PLN</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-500"><TrendingUp className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Po terminie</p>
                <p className="mt-2 text-3xl font-bold text-rose-500">{stats.overdue}</p>
              </div>
              <div className="rounded-2xl bg-rose-500/12 p-3 text-rose-500"><AlertTriangle className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wymagają pilnowania</p>
                <p className="mt-2 text-3xl font-bold text-amber-500">{stats.atRisk}</p>
              </div>
              <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-500"><Clock className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none app-surface-strong">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
                <Input
                  placeholder="Szukaj po nazwie, emailu, firmie albo telefonie..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'pipeline')}>
                <TabsList className="grid w-full grid-cols-2 sm:w-[260px]">
                  <TabsTrigger value="list"><LayoutList className="mr-2 h-4 w-4" /> Lista</TabsTrigger>
                  <TabsTrigger value="pipeline"><KanbanSquare className="mr-2 h-4 w-4" /> Pipeline</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  {STATUS_OPTIONS.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Źródło" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie źródła</SelectItem>
                  {SOURCE_OPTIONS.map((source) => <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={atRiskFilter} onValueChange={setAtRiskFilter}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Ryzyko" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="at-risk">Zagrożone</SelectItem>
                  <SelectItem value="safe">Bezpieczne</SelectItem>
                </SelectContent>
              </Select>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Aktywność" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Kiedykolwiek</SelectItem>
                  <SelectItem value="today">Dzisiaj</SelectItem>
                  <SelectItem value="week">Ostatnie 7 dni</SelectItem>
                  <SelectItem value="month">Ostatnie 30 dni</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                className="rounded-xl"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSourceFilter('all');
                  setAtRiskFilter('all');
                  setActivityFilter('all');
                }}
              >
                <X className="h-4 w-4" /> Wyczyść filtry
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[color:var(--app-primary)]" />
            <p className="app-muted">Ładowanie leadów...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card className="border-none app-surface-strong">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="rounded-full p-4 app-primary-chip"><Search className="h-8 w-8" /></div>
              <div>
                <h3 className="text-lg font-bold app-text">Nie znaleziono leadów</h3>
                <p className="mt-1 max-w-md app-muted">Spróbuj zmienić filtry albo dodaj nowego leada. Ten ekran ma pomagać domykać ruch, nie chować rekordy.</p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onQuickAction={handleQuickAction} busy={quickActionBusy} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
              {pipeline.map((column) => (
                <PipelineColumn
                  key={column.status.value}
                  status={column.status}
                  leads={column.leads}
                  onMove={handleMoveStage}
                  onOpen={(leadId) => {
                    window.location.href = `/leads/${leadId}`;
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
