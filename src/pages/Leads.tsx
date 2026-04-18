import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { auth, db } from '../firebase';
import {
  addDoc,
  collection,
  deleteDoc,
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
import { addDays, differenceInCalendarDays, format, isAfter, isPast, isToday, parseISO, startOfDay, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  KanbanSquare,
  LayoutList,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Wallet,
  X,
} from 'lucide-react';

import Layout from '../components/Layout';
import { useWorkspace } from '../hooks/useWorkspace';
import { getLeadSourceLabel, LEAD_SOURCE_OPTIONS } from '../lib/leadSources';
import { ensureCurrentUserWorkspace } from '../lib/workspace';
import { deleteLeadFromSupabase, fetchLeadsFromSupabase, insertLeadToSupabase, isSupabaseConfigured, updateLeadInSupabase } from '../lib/supabase-fallback';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ACTIVE_LEAD_STATUSES, type LeadPartialPayment, getLeadFinance, isActiveLeadStatus } from '../lib/lead-finance';

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualification'
  | 'proposal_sent'
  | 'follow_up'
  | 'negotiation'
  | 'won'
  | 'lost';

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
  partialPayments?: LeadPartialPayment[];
  isAtRisk?: boolean;
  updatedAt?: Timestamp | string | null;
};

type QuickActionKey = 'followup' | 'waiting' | 'meeting' | 'won' | 'lost' | 'risk';

type StatusOption = {
  value: LeadStatus;
  label: string;
  toneClass: string;
  pipelineTitle: string;
};

type PaymentDraft = {
  id: string;
  amount: string;
  paidAt: string;
  createdAt?: string;
};

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  source: string;
  dealValue: string;
  company: string;
  nextStep: string;
  nextActionAt: string;
  partialPayments: PaymentDraft[];
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

const PIPELINE_ORDER: LeadStatus[] = ['new', 'contacted', 'qualification', 'proposal_sent', 'follow_up', 'negotiation', 'won', 'lost'];

const EMPTY_LEAD_FORM: LeadFormState = {
  name: '',
  email: '',
  phone: '',
  source: 'other',
  dealValue: '',
  company: '',
  nextStep: '',
  nextActionAt: format(new Date(), "yyyy-MM-dd'T'09:00"),
  partialPayments: [],
};

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

function formatMoney(value: number) {
  return `${value.toLocaleString()} PLN`;
}

function normalizePaymentDrafts(drafts: PaymentDraft[]): LeadPartialPayment[] {
  return drafts
    .map((payment, index) => {
      const amount = Number(payment.amount);
      if (!Number.isFinite(amount) || amount <= 0) return null;

      return {
        id: payment.id || `payment-${index}-${Date.now()}`,
        amount,
        paidAt: payment.paidAt || undefined,
        createdAt: payment.createdAt || new Date().toISOString(),
      };
    })
    .filter((entry): entry is LeadPartialPayment => Boolean(entry));
}

function createLeadFormState(lead?: Partial<LeadRecord> | null): LeadFormState {
  if (!lead) return { ...EMPTY_LEAD_FORM, partialPayments: [] };

  return {
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    source: lead.source || 'other',
    dealValue: lead.dealValue ? String(lead.dealValue) : '',
    company: lead.company || '',
    nextStep: lead.nextStep || '',
    nextActionAt: lead.nextActionAt || format(new Date(), "yyyy-MM-dd'T'09:00"),
    partialPayments: (lead.partialPayments || []).map((payment) => ({
      id: payment.id || crypto.randomUUID(),
      amount: String(payment.amount || ''),
      paidAt: payment.paidAt || '',
      createdAt: payment.createdAt,
    })),
  };
}

function PaymentEditor({
  payments,
  onChange,
}: {
  payments: PaymentDraft[];
  onChange: (payments: PaymentDraft[]) => void;
}) {
  const totalDraftPaid = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>Historia wpłat</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => onChange([...payments, { id: crypto.randomUUID(), amount: '', paidAt: '' }])}
        >
          <Plus className="h-4 w-4" /> Dodaj wpłatę
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-4 text-sm app-muted app-border">
          Brak wpłat częściowych. Jeśli klient już coś wpłacił, dodaj pozycję poniżej.
        </div>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => (
            <div key={payment.id} className="grid gap-2 rounded-2xl border p-3 app-border md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
              <div className="space-y-1.5">
                <Label className="text-xs">Kwota</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={payment.amount}
                  onChange={(event) => onChange(payments.map((item) => (item.id === payment.id ? { ...item, amount: event.target.value } : item)))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Data wpłaty</Label>
                <Input
                  type="date"
                  value={payment.paidAt}
                  onChange={(event) => onChange(payments.map((item) => (item.id === payment.id ? { ...item, paidAt: event.target.value } : item)))}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-rose-500"
                onClick={() => onChange(payments.filter((item) => item.id !== payment.id))}
              >
                Usuń
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs app-muted">Suma wpisanych wpłat: {formatMoney(totalDraftPaid)}</p>
    </div>
  );
}

function LeadListRow({
  lead,
  busy,
  onQuickAction,
  onDelete,
  onEdit,
}: {
  lead: LeadRecord;
  busy: string | null;
  onQuickAction: (lead: LeadRecord, action: QuickActionKey) => void;
  onDelete: (lead: LeadRecord) => void;
  onEdit: (lead: LeadRecord) => void;
}) {
  const status = getStatusOption(lead.status);
  const due = dueState(lead);
  const finance = getLeadFinance(lead);
  const busyForLead = busy?.startsWith(lead.id) ?? false;

  return (
    <div className="rounded-2xl border p-3 app-border app-surface-strong">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="min-w-0 flex-[1.4]">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/leads/${lead.id}`} className="truncate font-semibold app-text hover:underline">
              {lead.name}
            </Link>
            <Badge className={cn('border', status.toneClass)}>{status.label}</Badge>
            {lead.isAtRisk ? <Badge variant="destructive">Zagrożony</Badge> : null}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs app-muted">
            {lead.phone ? <span>{lead.phone}</span> : null}
            {lead.email ? <span>{lead.email}</span> : null}
            {lead.company ? <span>{lead.company}</span> : null}
            {lead.source ? <span>{getLeadSourceLabel(lead.source)}</span> : null}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2 text-xs md:grid-cols-4 xl:grid-cols-5">
          <div className="rounded-xl border px-3 py-2 app-border">
            <p className="app-muted">Wartość</p>
            <p className="font-semibold app-text">{formatMoney(lead.dealValue || 0)}</p>
          </div>
          <div className="rounded-xl border px-3 py-2 app-border">
            <p className="app-muted">Wpłacono</p>
            <p className="font-semibold text-emerald-600">{formatMoney(finance.paidAmount)}</p>
          </div>
          <div className="rounded-xl border px-3 py-2 app-border">
            <p className="app-muted">Pozostało</p>
            <p className="font-semibold app-text">{formatMoney(finance.remainingAmount)}</p>
          </div>
          <div className="rounded-xl border px-3 py-2 app-border">
            <p className="app-muted">Termin</p>
            <p className={cn('font-semibold', due.tone)}>{due.label}</p>
          </div>
          <div className="rounded-xl border px-3 py-2 app-border">
            <p className="app-muted">Lejek</p>
            <p className="font-semibold text-[color:var(--app-primary)]">{formatMoney(finance.funnelAmount)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <Button variant="outline" size="sm" className="rounded-xl" disabled={busyForLead} onClick={() => onQuickAction(lead, 'followup')}>
            Jutro
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" disabled={busyForLead} onClick={() => onQuickAction(lead, 'waiting')}>
            +3 dni
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl" disabled={busyForLead}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(lead)}>Edytuj leada</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onQuickAction(lead, 'meeting')}>Ustaw spotkanie</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQuickAction(lead, 'risk')}>
                {lead.isAtRisk ? 'Zdejmij ryzyko' : 'Oznacz jako zagrożony'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onQuickAction(lead, 'won')}>Wygrany</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQuickAction(lead, 'lost')}>Stracony</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-500" onClick={() => onDelete(lead)}>Usuń</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="rounded-xl" asChild>
            <Link to={`/leads/${lead.id}`}>Otwórz <ChevronRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PipelineColumn({
  status,
  leads,
  onMove,
}: {
  status: StatusOption;
  leads: LeadRecord[];
  onMove: (lead: LeadRecord, status: LeadStatus) => void;
}) {
  const totalFunnelValue = leads.reduce((sum, lead) => sum + getLeadFinance(lead).funnelAmount, 0);

  return (
    <Card className="min-w-[310px] border-none app-surface-strong">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{status.pipelineTitle}</CardTitle>
            <CardDescription>{leads.length} leadów · {formatMoney(totalFunnelValue)}</CardDescription>
          </div>
          <Badge className={cn('border', status.toneClass)}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-4 text-sm app-muted app-border">Pusto.</div>
        ) : (
          leads.map((lead) => {
            const due = dueState(lead);
            const finance = getLeadFinance(lead);
            return (
              <div key={lead.id} className="rounded-2xl border p-3 app-border app-surface">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/leads/${lead.id}`} className="truncate text-sm font-bold app-text hover:underline">
                      {lead.name}
                    </Link>
                    <p className="mt-1 text-xs app-muted">{lead.company || getLeadSourceLabel(lead.source) || 'Bez opisu'}</p>
                  </div>
                  {lead.isAtRisk ? <Badge variant="destructive">Ryzyko</Badge> : null}
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="app-muted">Wpłacono</span>
                    <span className="font-semibold text-emerald-600">{formatMoney(finance.paidAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="app-muted">W lejku</span>
                    <span className="font-semibold app-text">{formatMoney(finance.funnelAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="app-muted">Termin</span>
                    <span className={cn('font-semibold', due.tone)}>{lead.nextActionAt ? due.label : 'Brak'}</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Select value={lead.status || 'new'} onValueChange={(value) => onMove(lead, value as LeadStatus)}>
                    <SelectTrigger className="h-8 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="rounded-xl" asChild>
                    <Link to={`/leads/${lead.id}`}>Szczegóły</Link>
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
  const [newLead, setNewLead] = useState<LeadFormState>(EMPTY_LEAD_FORM);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editLead, setEditLead] = useState<LeadFormState>(EMPTY_LEAD_FORM);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser || !workspace) {
      setLeads([]);
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      setLoading(true);
      void fetchLeadsFromSupabase()
        .then((items) => setLeads(items as LeadRecord[]))
        .catch(() => setLeads([]))
        .finally(() => setLoading(false));
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

    const partialPayments = normalizePaymentDrafts(newLead.partialPayments);

    try {
      const ensuredWorkspace = workspace ?? await ensureCurrentUserWorkspace();
      const usingSupabase = isSupabaseConfigured();
      if (usingSupabase) {
        await insertLeadToSupabase({
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          company: newLead.company,
          source: newLead.source,
          dealValue: Number(newLead.dealValue) || 0,
          partialPayments,
          nextStep: newLead.nextStep,
          nextActionAt: newLead.nextActionAt,
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
        });
      } else {
        await addDoc(collection(db, 'leads'), {
          ...newLead,
          partialPayments,
          dealValue: Number(newLead.dealValue) || 0,
          status: 'new',
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isAtRisk: false,
        });
      }
      toast.success('Lead dodany');
      setIsNewLeadOpen(false);
      setNewLead(EMPTY_LEAD_FORM);
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  function openEditLead(lead: LeadRecord) {
    setEditingLeadId(lead.id);
    setEditLead(createLeadFormState(lead));
  }

  function closeEditLead() {
    setEditingLeadId(null);
    setEditLead(EMPTY_LEAD_FORM);
  }

  async function handleSaveLeadEdits(e: FormEvent) {
    e.preventDefault();
    if (!editingLeadId) return;
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    if (!editLead.name.trim()) return toast.error('Wpisz nazwę leada.');

    const partialPayments = normalizePaymentDrafts(editLead.partialPayments);
    const updates = {
      name: editLead.name,
      email: editLead.email,
      phone: editLead.phone,
      company: editLead.company,
      source: editLead.source,
      dealValue: Number(editLead.dealValue) || 0,
      partialPayments,
      nextStep: editLead.nextStep,
      nextActionAt: editLead.nextActionAt,
    };

    try {
      if (isSupabaseConfigured()) {
        await updateLeadInSupabase({ id: editingLeadId, ...updates });
        setLeads((prev) => prev.map((lead) => (lead.id === editingLeadId ? { ...lead, ...updates } : lead)));
      } else {
        await updateDoc(doc(db, 'leads', editingLeadId), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      }
      toast.success('Lead zapisany');
      closeEditLead();
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
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
            partialPayments: [],
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
          toast.error(`Błąd importu: ${error.message}`);
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
      const updates: Record<string, unknown> = {};

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
      if (action === 'won') updates.status = 'won';
      if (action === 'lost') updates.status = 'lost';
      if (action === 'risk') updates.isAtRisk = !lead.isAtRisk;

      if (isSupabaseConfigured()) {
        await updateLeadInSupabase({ id: lead.id, ...updates });
        setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, ...updates } : item)));
      } else {
        await updateDoc(doc(db, 'leads', lead.id), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      }
      toast.success('Lead zaktualizowany');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setQuickActionBusy(null);
    }
  }

  async function handleMoveStage(lead: LeadRecord, status: LeadStatus) {
    try {
      if (isSupabaseConfigured()) {
        await updateLeadInSupabase({ id: lead.id, status });
        setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, status } : item)));
      } else {
        await updateDoc(doc(db, 'leads', lead.id), {
          status,
          updatedAt: serverTimestamp(),
        });
      }
      toast.success(`Etap zmieniony na: ${getStatusOption(status).label}`);
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleDeleteLead(lead: LeadRecord) {
    if (!window.confirm(`Usunąć lead "${lead.name}"?`)) return;

    try {
      if (isSupabaseConfigured()) {
        await deleteLeadFromSupabase(lead.id);
        setLeads((prev) => prev.filter((item) => item.id !== lead.id));
      } else {
        await deleteDoc(doc(db, 'leads', lead.id));
      }
      toast.success('Lead usunięty');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const haystack = [lead.name, lead.email, lead.company, lead.phone].filter(Boolean).join(' ').toLowerCase();
        const matchesSearch = haystack.includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
        const matchesAtRisk =
          atRiskFilter === 'all' ||
          (atRiskFilter === 'at-risk' && lead.isAtRisk) ||
          (atRiskFilter === 'safe' && !lead.isAtRisk);
        const matchesActivity = activityMatches(lead, activityFilter);

        return matchesSearch && matchesStatus && matchesSource && matchesAtRisk && matchesActivity;
      })
      .sort((a, b) => {
        const stateDiff = dueState(b).sortWeight - dueState(a).sortWeight;
        if (stateDiff !== 0) return stateDiff;
        return (getLeadFinance(b).funnelAmount || 0) - (getLeadFinance(a).funnelAmount || 0);
      });
  }, [activityFilter, atRiskFilter, leads, searchQuery, sourceFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = leads.filter((lead) => isActiveLeadStatus(lead.status));
    return {
      total: leads.length,
      active: active.length,
      funnel: active.reduce((acc, lead) => acc + getLeadFinance(lead).funnelAmount, 0),
      earned: leads.reduce((acc, lead) => acc + getLeadFinance(lead).earnedAmount, 0),
      atRisk: active.filter((lead) => lead.isAtRisk || !lead.nextActionAt || !lead.nextStep).length,
      overdue: active.filter((lead) => lead.nextActionAt && isPast(parseISO(lead.nextActionAt)) && !isToday(parseISO(lead.nextActionAt))).length,
    };
  }, [leads]);

  const draftFinance = useMemo(() => getLeadFinance({
    status: 'new',
    dealValue: Number(newLead.dealValue) || 0,
    partialPayments: normalizePaymentDrafts(newLead.partialPayments),
  }), [newLead.dealValue, newLead.partialPayments]);

  const editDraftFinance = useMemo(() => getLeadFinance({
    status: 'new',
    dealValue: Number(editLead.dealValue) || 0,
    partialPayments: normalizePaymentDrafts(editLead.partialPayments),
  }), [editLead.dealValue, editLead.partialPayments]);

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
            <p className="mt-1 max-w-2xl app-muted">
              Tutaj widzisz cały proces, ile już wpłynęło, ile jeszcze zostało do domknięcia i które rekordy wymagają ruchu.
            </p>
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
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nowy lead</DialogTitle>
                  <DialogDescription>
                    Dodaj dane kontaktu, ustaw wartość i wpisz już otrzymane wpłaty częściowe, jeśli klient coś przelał.
                  </DialogDescription>
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
                      <Label>Wartość całości (PLN)</Label>
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
                        {LEAD_SOURCE_OPTIONS.map((source) => (
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
                    <Input value={newLead.nextStep} onChange={(e) => setNewLead({ ...newLead, nextStep: e.target.value })} />
                  </div>

                  <PaymentEditor payments={newLead.partialPayments} onChange={(partialPayments) => setNewLead((prev) => ({ ...prev, partialPayments }))} />

                  <div className="grid gap-3 rounded-2xl border p-4 app-border md:grid-cols-4">
                    <div>
                      <p className="text-xs app-muted">Wartość</p>
                      <p className="font-semibold app-text">{formatMoney(Number(newLead.dealValue) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs app-muted">Wpłacono</p>
                      <p className="font-semibold text-emerald-600">{formatMoney(draftFinance.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs app-muted">Pozostało</p>
                      <p className="font-semibold app-text">{formatMoney(draftFinance.remainingAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs app-muted">Trafi do lejka</p>
                      <p className="font-semibold text-[color:var(--app-primary)]">{formatMoney(draftFinance.funnelAmount)}</p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full rounded-xl">Dodaj leada</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={Boolean(editingLeadId)} onOpenChange={(open) => { if (!open) closeEditLead(); }}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edytuj leada</DialogTitle>
                  <DialogDescription>
                    Tutaj poprawisz dane kontaktowe, wartość i wpłaty częściowe już przypisane do tego leada.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveLeadEdits} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Imię i nazwisko / nazwa</Label>
                    <Input value={editLead.name} onChange={(e) => setEditLead({ ...editLead, name: e.target.value })} required />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Firma</Label>
                      <Input value={editLead.company} onChange={(e) => setEditLead({ ...editLead, company: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Wartość całości (PLN)</Label>
                      <Input type="number" value={editLead.dealValue} onChange={(e) => setEditLead({ ...editLead, dealValue: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input type="email" value={editLead.email} onChange={(e) => setEditLead({ ...editLead, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input value={editLead.phone} onChange={(e) => setEditLead({ ...editLead, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Źródło</Label>
                      <select
                        value={editLead.source}
                        onChange={(e) => setEditLead({ ...editLead, source: e.target.value })}
                        className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                      >
                        {LEAD_SOURCE_OPTIONS.map((source) => (
                          <option key={source.value} value={source.value}>{source.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="datetime-local" value={editLead.nextActionAt} onChange={(e) => setEditLead({ ...editLead, nextActionAt: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Następny krok</Label>
                    <Input value={editLead.nextStep} onChange={(e) => setEditLead({ ...editLead, nextStep: e.target.value })} />
                  </div>

                  <PaymentEditor payments={editLead.partialPayments} onChange={(partialPayments) => setEditLead((prev) => ({ ...prev, partialPayments }))} />

                  <div className="grid gap-3 rounded-2xl border p-4 app-border md:grid-cols-4">
                    <div>
                      <p className="text-xs app-muted">Wartość</p>
                      <p className="font-semibold app-text">{formatMoney(Number(editLead.dealValue) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs app-muted">Wpłacono</p>
                      <p className="font-semibold text-emerald-600">{formatMoney(editDraftFinance.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs app-muted">Pozostało</p>
                      <p className="font-semibold app-text">{formatMoney(editDraftFinance.remainingAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs app-muted">Trafi do lejka</p>
                      <p className="font-semibold text-[color:var(--app-primary)]">{formatMoney(editDraftFinance.funnelAmount)}</p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full rounded-xl">Zapisz zmiany</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Wszystkie', value: String(stats.total), icon: Target, tone: 'app-primary-chip' },
            { label: 'Aktywne', value: String(stats.active), icon: CheckCircle2, tone: 'bg-sky-500/12 text-sky-500' },
            { label: 'W lejku', value: formatMoney(stats.funnel), icon: TrendingUp, tone: 'bg-emerald-500/12 text-emerald-500' },
            { label: 'Zarobione', value: formatMoney(stats.earned), icon: Wallet, tone: 'bg-emerald-500/12 text-emerald-600' },
            { label: 'Po terminie', value: String(stats.overdue), icon: AlertTriangle, tone: 'bg-rose-500/12 text-rose-500' },
          ].map((stat) => (
            <Card key={stat.label} className="border-none app-surface-strong">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold app-text">{stat.value}</p>
                </div>
                <div className={cn('rounded-2xl p-3', stat.tone)}><stat.icon className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          ))}
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
                  {LEAD_SOURCE_OPTIONS.map((source) => <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>)}
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
                <p className="mt-1 max-w-md app-muted">Spróbuj zmienić filtry albo dodaj nowego leada.</p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <LeadListRow
                key={lead.id}
                lead={lead}
                busy={quickActionBusy}
                onQuickAction={handleQuickAction}
                onDelete={handleDeleteLead}
                onEdit={openEditLead}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
              {pipeline.map((column) => (
                <PipelineColumn key={column.status.value} status={column.status} leads={column.leads} onMove={handleMoveStage} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
