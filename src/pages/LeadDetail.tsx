import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { addDays, differenceInCalendarDays, format, isPast, isToday, parseISO, startOfDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  ShieldAlert,
  Target,
  Trash2,
  Wallet,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { auth, db } from '../firebase';
import { buildClientIdFromLead } from '../lib/clients';
import { useWorkspace } from '../hooks/useWorkspace';
import { deleteLeadFromSupabase, fetchLeadByIdFromSupabase, isSupabaseConfigured, updateLeadInSupabase } from '../lib/supabase-fallback';
import { getLeadFinance, normalizePartialPayments, type LeadPartialPayment } from '../lib/lead-finance';

type LeadRecord = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  dealValue?: number;
  partialPayments?: LeadPartialPayment[];
  nextStep?: string;
  nextActionAt?: string;
  isAtRisk?: boolean;
  updatedAt?: Timestamp | string | null;
  createdAt?: Timestamp | string | null;
  linkedClientId?: string;
  linkedCaseId?: string;
  linkedCaseTitle?: string;
};

type ActivityRecord = {
  id: string;
  eventType?: string;
  payload?: Record<string, any>;
  createdAt?: Timestamp;
};

type TemplateRecord = {
  id: string;
  name?: string;
  items?: Record<string, any>[];
};

type CaseRecord = {
  id: string;
  title?: string;
  status?: string;
  completenessPercent?: number;
};

type QuickActionKey = 'call' | 'followup' | 'waiting' | 'meeting' | 'won' | 'lost';

type PaymentDraft = {
  id: string;
  amount: string;
  paidAt: string;
};

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nowy', badge: 'bg-sky-500/12 text-sky-500 border-sky-500/20' },
  { value: 'contacted', label: 'Skontaktowany', badge: 'bg-indigo-500/12 text-indigo-500 border-indigo-500/20' },
  { value: 'qualification', label: 'Kwalifikacja', badge: 'bg-violet-500/12 text-violet-500 border-violet-500/20' },
  { value: 'proposal_sent', label: 'Oferta wysłana', badge: 'bg-amber-500/12 text-amber-600 border-amber-500/20' },
  { value: 'follow_up', label: 'Follow-up', badge: 'bg-orange-500/12 text-orange-500 border-orange-500/20' },
  { value: 'negotiation', label: 'Negocjacje', badge: 'bg-pink-500/12 text-pink-500 border-pink-500/20' },
  { value: 'won', label: 'Wygrany', badge: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/20' },
  { value: 'lost', label: 'Przegrany', badge: 'bg-slate-500/12 text-slate-500 border-slate-500/20' },
] as const;

const SOURCE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold outreach' },
  { value: 'other', label: 'Inne' },
] as const;

const QUICK_ACTIONS: Record<QuickActionKey, { label: string; description: string }> = {
  call: { label: 'Rozmowa wykonana', description: 'Zapisz kontakt i odśwież rekord.' },
  followup: { label: 'Follow-up jutro', description: 'Ustaw ruch na jutro rano.' },
  waiting: { label: 'Czekamy 3 dni', description: 'Zostaw lead w oczekiwaniu z kontrolą.' },
  meeting: { label: 'Spotkanie w 2 dni', description: 'Ustaw najbliższy termin rozmowy.' },
  won: { label: 'Oznacz wygrany', description: 'Lead gotowy do przejścia dalej.' },
  lost: { label: 'Oznacz stracony', description: 'Zamknij lead bez dalszych alarmów.' },
};

function toDate(value?: string | Timestamp | null) {
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

function formatDateTime(value?: string | Timestamp | null, fallback = 'Brak') {
  const date = toDate(value);
  if (!date) return fallback;
  return format(date, 'd MMMM yyyy, HH:mm', { locale: pl });
}

function dueTone(value?: string | Timestamp | null) {
  const date = toDate(value);
  if (!date) return 'text-amber-500';
  if (isPast(date) && !isToday(date)) return 'text-rose-500';
  if (isToday(date)) return 'text-[color:var(--app-primary)]';
  return 'app-text';
}

function startOfTomorrowAtNine() {
  const date = addDays(new Date(), 1);
  date.setHours(9, 0, 0, 0);
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

function startInDaysAtNine(days: number) {
  const date = addDays(new Date(), days);
  date.setHours(9, 0, 0, 0);
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

function normalizePaymentDrafts(drafts: PaymentDraft[]): LeadPartialPayment[] {
  return drafts
    .map((payment, index) => {
      const amount = Number(payment.amount);
      if (!Number.isFinite(amount) || amount <= 0) return null;
      return {
        id: payment.id || `payment-${index}`,
        amount,
        paidAt: payment.paidAt || undefined,
        createdAt: new Date().toISOString(),
      };
    })
    .filter((entry): entry is LeadPartialPayment => Boolean(entry));
}

function activityLabel(activity: ActivityRecord) {
  switch (activity.eventType) {
    case 'status_changed':
      return `Status: ${STATUS_OPTIONS.find((option) => option.value === activity.payload?.status)?.label || 'zmieniony'}`;
    case 'note_added':
      return 'Dodano notatkę';
    case 'call_logged':
      return 'Zapisano rozmowę';
    case 'next_step_updated':
      return 'Zmieniono kolejny krok';
    case 'quick_action':
      return activity.payload?.title || 'Wykonano szybką akcję';
    case 'case_created':
      return 'Uruchomiono sprawę';
    case 'payment_added':
      return 'Dodano wpłatę';
    default:
      return 'Aktywność';
  }
}

function activityDescription(activity: ActivityRecord) {
  if (activity.payload?.content) return activity.payload.content;
  if (activity.payload?.note) return activity.payload.note;
  if (activity.payload?.amount) {
    return `${Number(activity.payload.amount).toLocaleString()} PLN${activity.payload.paidAt ? ` • ${activity.payload.paidAt}` : ''}`;
  }
  if (activity.payload?.nextStep || activity.payload?.nextActionAt) {
    const pieces = [];
    if (activity.payload?.nextStep) pieces.push(activity.payload.nextStep);
    if (activity.payload?.nextActionAt) pieces.push(formatDateTime(activity.payload.nextActionAt));
    return pieces.join(' • ');
  }
  return '';
}

function InlineField({
  label,
  value,
  editing,
  input,
  onEdit,
  onSave,
  canQuickOpen,
  quickOpenHref,
}: {
  label: string;
  value: string;
  editing: boolean;
  input: React.ReactNode;
  onEdit: () => void;
  onSave: () => void;
  canQuickOpen?: boolean;
  quickOpenHref?: string;
}) {
  return (
    <div className="rounded-2xl border p-4 app-border app-surface">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">{label}</p>
        {!editing ? (
          <Button variant="ghost" size="sm" className="h-7 rounded-xl px-2" onClick={onEdit}>Edytuj</Button>
        ) : (
          <Button size="sm" className="h-7 rounded-xl px-3" onClick={onSave}>Zapisz</Button>
        )}
      </div>
      <div className="mt-2">
        {editing ? input : <p className="font-medium app-text">{value || 'Brak danych'}</p>}
      </div>
      {canQuickOpen && quickOpenHref ? (
        <Button variant="ghost" size="sm" className="mt-2 px-0" asChild>
          <a href={quickOpenHref}>{label}</a>
        </Button>
      ) : null}
    </div>
  );
}

export default function LeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { workspace, hasAccess } = useWorkspace();

  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [associatedCase, setAssociatedCase] = useState<CaseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactDraft, setContactDraft] = useState<Partial<LeadRecord>>({});
  const [editingField, setEditingField] = useState<'name' | 'company' | 'email' | 'phone' | null>(null);
  const [nextStepDraft, setNextStepDraft] = useState('');
  const [nextActionDraft, setNextActionDraft] = useState(startOfTomorrowAtNine());
  const [note, setNote] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('none');
  const [quickActionBusy, setQuickActionBusy] = useState<QuickActionKey | null>(null);
  const [caseBusy, setCaseBusy] = useState(false);
  const [paymentDrafts, setPaymentDrafts] = useState<PaymentDraft[]>([]);

  useEffect(() => {
    if (!leadId || !workspace) return;

    if (isSupabaseConfigured()) {
      setLoading(true);
      void fetchLeadByIdFromSupabase(leadId)
        .then((item) => {
          const data = item as LeadRecord;
          setLead({ ...data, partialPayments: normalizePartialPayments(data.partialPayments) });
          setContactDraft(data);
          setNextStepDraft(data.nextStep || '');
          setNextActionDraft(data.nextActionAt || startOfTomorrowAtNine());
          setPaymentDrafts(normalizePartialPayments(data.partialPayments).map((payment) => ({
            id: payment.id,
            amount: String(payment.amount),
            paidAt: payment.paidAt || '',
          })));
          setActivities([]);
          setTemplates([]);
          setAssociatedCase(null);
        })
        .catch(() => {
          toast.error('Lead nie istnieje');
          navigate('/leads');
        })
        .finally(() => setLoading(false));
      return;
    }

    const leadRef = doc(db, 'leads', leadId);
    const unsubscribeLead = onSnapshot(leadRef, (snapshot) => {
      if (!snapshot.exists()) {
        toast.error('Lead nie istnieje');
        navigate('/leads');
        return;
      }

      const data = { id: snapshot.id, ...(snapshot.data() as Omit<LeadRecord, 'id'>) };
      const normalized = { ...data, partialPayments: normalizePartialPayments(data.partialPayments) };
      setLead(normalized);
      setContactDraft(normalized);
      setNextStepDraft(normalized.nextStep || '');
      setNextActionDraft(normalized.nextActionAt || startOfTomorrowAtNine());
      setPaymentDrafts(normalized.partialPayments.map((payment) => ({
        id: payment.id,
        amount: String(payment.amount),
        paidAt: payment.paidAt || '',
      })));
    });

    const activitiesQuery = query(collection(db, 'activities'), where('leadId', '==', leadId), orderBy('createdAt', 'desc'));
    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      setActivities(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ActivityRecord, 'id'>) })));
    });

    const templatesQuery = query(collection(db, 'templates'), where('ownerId', '==', auth.currentUser?.uid));
    const unsubscribeTemplates = onSnapshot(templatesQuery, (snapshot) => {
      setTemplates(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<TemplateRecord, 'id'>) })));
    });

    const casesQuery = query(collection(db, 'cases'), where('leadId', '==', leadId));
    const unsubscribeCases = onSnapshot(casesQuery, (snapshot) => {
      if (!snapshot.empty) {
        setAssociatedCase({ id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as Omit<CaseRecord, 'id'>) });
      } else {
        setAssociatedCase(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeLead();
      unsubscribeActivities();
      unsubscribeTemplates();
      unsubscribeCases();
    };
  }, [leadId, navigate, workspace]);

  const currentStatus = useMemo(() => STATUS_OPTIONS.find((option) => option.value === lead?.status) || STATUS_OPTIONS[0], [lead?.status]);
  const nextActionDate = toDate(lead?.nextActionAt);
  const lastTouchDate = toDate(lead?.updatedAt);
  const daysSinceTouch = lastTouchDate ? differenceInCalendarDays(startOfDay(new Date()), startOfDay(lastTouchDate)) : null;
  const isOverdue = !!nextActionDate && isPast(nextActionDate) && !isToday(nextActionDate);
  const finance = useMemo(() => getLeadFinance(lead || {}), [lead]);
  const draftFinance = useMemo(() => getLeadFinance({
    status: lead?.status,
    dealValue: lead?.dealValue,
    partialPayments: normalizePaymentDrafts(paymentDrafts),
  }), [lead?.dealValue, lead?.status, paymentDrafts]);

  async function logActivity(eventType: string, payload: Record<string, any>) {
    if (isSupabaseConfigured()) return;

    await addDoc(collection(db, 'activities'), {
      leadId,
      ownerId: auth.currentUser?.uid,
      actorId: auth.currentUser?.uid,
      actorType: 'operator',
      eventType,
      payload,
      createdAt: serverTimestamp(),
    });
  }

  async function patchLead(updates: Record<string, unknown>) {
    if (!leadId || !lead) return;

    if (isSupabaseConfigured()) {
      const updated = await updateLeadInSupabase({ id: leadId, ...updates });
      setLead({ ...(updated as LeadRecord), partialPayments: normalizePartialPayments((updated as LeadRecord).partialPayments) });
      return;
    }

    await updateDoc(doc(db, 'leads', leadId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async function handleInlineSave(field: 'name' | 'company' | 'email' | 'phone') {
    if (!hasAccess) return toast.error('Trial wygasł.');
    try {
      const value = contactDraft[field] || '';
      await patchLead({ [field]: value });
      setEditingField(null);
      toast.success('Dane zapisane');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleSaveNextStep(e?: FormEvent) {
    e?.preventDefault();
    if (!leadId || !lead) return;
    if (!hasAccess) return toast.error('Trial wygasł.');

    try {
      await patchLead({
        nextStep: nextStepDraft,
        nextActionAt: nextActionDraft,
      });
      if (!isSupabaseConfigured()) {
        await logActivity('next_step_updated', { nextStep: nextStepDraft, nextActionAt: nextActionDraft });
      }
      toast.success('Kolejny krok zapisany');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleSavePayments(e?: FormEvent) {
    e?.preventDefault();
    if (!leadId || !lead) return;
    if (!hasAccess) return toast.error('Trial wygasł.');

    try {
      const partialPayments = normalizePaymentDrafts(paymentDrafts);
      await patchLead({ partialPayments });
      if (!isSupabaseConfigured()) {
        await logActivity('payment_added', { amount: draftFinance.paidAmount, paidAt: partialPayments[partialPayments.length - 1]?.paidAt || null });
      }
      toast.success('Wpłaty zapisane');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    if (!hasAccess) return toast.error('Trial wygasł.');

    try {
      if (isSupabaseConfigured()) {
        toast.error('Notatki aktywności nie są jeszcze podpięte pod Supabase.');
        return;
      }

      await logActivity('note_added', { content: note.trim() });
      await updateDoc(doc(db, 'leads', leadId!), { updatedAt: serverTimestamp() });
      setNote('');
      toast.success('Notatka dodana');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleDeleteLead() {
    if (!leadId) return;
    if (!window.confirm('Na pewno usunąć tego leada?')) return;

    try {
      if (isSupabaseConfigured()) {
        await deleteLeadFromSupabase(leadId);
      } else {
        await deleteDoc(doc(db, 'leads', leadId));
      }
      toast.success('Lead usunięty');
      navigate('/leads');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleQuickAction(action: QuickActionKey) {
    if (!leadId || !lead) return;
    if (!hasAccess) return toast.error('Trial wygasł.');

    setQuickActionBusy(action);

    try {
      const updates: Record<string, any> = {};
      const activityPayload: Record<string, any> = { title: QUICK_ACTIONS[action].label };

      if (action === 'call') {
        activityPayload.note = 'Zapisano kontakt z leadem.';
      }
      if (action === 'followup') {
        updates.status = 'follow_up';
        updates.nextStep = 'Follow-up po kontakcie';
        updates.nextActionAt = startOfTomorrowAtNine();
      }
      if (action === 'waiting') {
        updates.status = 'contacted';
        updates.nextStep = 'Sprawdzić odpowiedź klienta';
        updates.nextActionAt = startInDaysAtNine(3);
      }
      if (action === 'meeting') {
        updates.status = 'qualification';
        updates.nextStep = 'Spotkanie z leadem';
        updates.nextActionAt = startInDaysAtNine(2);
      }
      if (action === 'won') updates.status = 'won';
      if (action === 'lost') updates.status = 'lost';

      await patchLead(updates);
      if (!isSupabaseConfigured()) {
        await logActivity(action === 'call' ? 'call_logged' : 'quick_action', { ...activityPayload, ...updates });
      }
      toast.success(QUICK_ACTIONS[action].label);
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setQuickActionBusy(null);
    }
  }

  async function handleCreateCase() {
    if (!leadId || !lead || !workspace) return;
    if (!hasAccess) return toast.error('Trial wygasł.');

    setCaseBusy(true);

    try {
      const clientId = buildClientIdFromLead({
        leadId,
        email: lead.email,
        phone: lead.phone,
        name: lead.name,
      });

      await setDoc(doc(db, 'clients', clientId), {
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        name: lead.name,
        company: lead.company || null,
        email: lead.email || null,
        phone: lead.phone || null,
        sourceLeadId: leadId,
        linkedLeadIds: arrayUnion(leadId),
        primaryLeadId: leadId,
        portalReady: false,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });

      const caseRef = await addDoc(collection(db, 'cases'), {
        leadId,
        clientId,
        title: `Realizacja: ${lead.name}`,
        clientName: lead.name,
        clientEmail: lead.email || null,
        clientPhone: lead.phone || null,
        company: lead.company || null,
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        status: 'collecting_materials',
        completenessPercent: 0,
        isBlocked: false,
        portalReady: false,
        sourceLeadName: lead.name,
        sourceLeadStatus: lead.status || 'won',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (selectedTemplateId !== 'none') {
        const template = templates.find((entry) => entry.id === selectedTemplateId);
        if (template?.items?.length) {
          for (let index = 0; index < template.items.length; index += 1) {
            await addDoc(collection(db, 'cases', caseRef.id, 'items'), {
              ...template.items[index],
              caseId: caseRef.id,
              status: 'missing',
              order: index,
              createdAt: serverTimestamp(),
            });
          }
        }
      }

      const leadTasksQuery = query(
        collection(db, 'tasks'),
        where('ownerId', '==', auth.currentUser?.uid),
        where('leadId', '==', leadId),
        where('status', '==', 'todo')
      );
      const leadTasksSnapshot = await getDocs(leadTasksQuery);
      if (!leadTasksSnapshot.empty) {
        const batch = writeBatch(db);
        leadTasksSnapshot.docs.forEach((taskDoc) => {
          batch.update(taskDoc.ref, {
            caseId: caseRef.id,
            caseTitle: `Realizacja: ${lead.name}`,
            updatedAt: serverTimestamp(),
          });
        });
        await batch.commit();
      }

      await setDoc(doc(db, 'clients', clientId), {
        linkedCaseIds: arrayUnion(caseRef.id),
        primaryCaseId: caseRef.id,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await updateDoc(doc(db, 'leads', leadId), {
        status: 'won',
        linkedClientId: clientId,
        linkedCaseId: caseRef.id,
        linkedCaseTitle: `Realizacja: ${lead.name}`,
        convertedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await logActivity('case_created', {
        caseId: caseRef.id,
        title: lead.name,
        carriedTasks: leadTasksSnapshot.size,
      });

      toast.success('Sprawa została uruchomiona.');
      navigate(`/case/${caseRef.id}`);
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setCaseBusy(false);
    }
  }

  if (loading || !lead) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[color:var(--app-primary)]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link to="/leads">
              <Button variant="outline" size="icon" className="rounded-2xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold app-text md:text-3xl">{lead.name}</h1>
                <Badge className={currentStatus.badge}>{currentStatus.label}</Badge>
                {lead.isAtRisk ? <Badge variant="destructive">Zagrożony</Badge> : null}
                {isOverdue ? <Badge variant="destructive">Po terminie</Badge> : null}
              </div>
              <p className="mt-1 text-sm app-muted">Prosty panel leada: wartość, kontakt, wpłaty, kolejny ruch i historia działań.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button className="rounded-2xl" onClick={() => handleQuickAction('won')} disabled={lead.status === 'won' || quickActionBusy !== null}>
              <CheckCircle2 className="h-4 w-4" /> Wygrany
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-2xl">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => handleQuickAction('lost')}>Oznacz jako stracony</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteLead} className="text-rose-500">
                  <Trash2 className="mr-2 h-4 w-4" /> Usuń leada
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wartość</p>
                <p className="mt-2 text-2xl font-bold app-text">{(lead.dealValue || 0).toLocaleString()} PLN</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><Wallet className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wpłacono</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">{finance.paidAmount.toLocaleString()} PLN</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Pozostało</p>
                <p className="mt-2 text-2xl font-bold app-text">{finance.remainingAmount.toLocaleString()} PLN</p>
              </div>
              <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-500"><Target className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Kolejny ruch</p>
                <p className={`mt-2 text-lg font-bold ${dueTone(lead.nextActionAt)}`}>{formatDateTime(lead.nextActionAt)}</p>
              </div>
              <div className={`rounded-2xl p-3 ${isOverdue ? 'bg-rose-500/12 text-rose-500' : 'app-primary-chip'}`}><Calendar className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Bez ruchu</p>
                <p className="mt-2 text-2xl font-bold app-text">{daysSinceTouch ?? 0} dni</p>
              </div>
              <div className={`rounded-2xl p-3 ${lead.isAtRisk || (daysSinceTouch ?? 0) >= 5 ? 'bg-amber-500/12 text-amber-500' : 'app-primary-chip'}`}><Clock className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Centrum ruchu</CardTitle>
                <CardDescription>Najważniejsze akcje bez przeładowanego panelu.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {(Object.keys(QUICK_ACTIONS) as QuickActionKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleQuickAction(key)}
                    disabled={quickActionBusy !== null}
                    className="rounded-2xl border p-4 text-left transition hover:bg-black/5 disabled:opacity-60 dark:hover:bg-white/5 app-border app-surface"
                  >
                    <p className="font-semibold app-text">{QUICK_ACTIONS[key].label}</p>
                    <p className="mt-1 text-sm app-muted">{QUICK_ACTIONS[key].description}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Plan kolejnego ruchu</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNextStep} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Kolejny krok</Label>
                    <Input value={nextStepDraft} onChange={(event) => setNextStepDraft(event.target.value)} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="datetime-local" value={nextActionDraft} onChange={(event) => setNextActionDraft(event.target.value)} />
                    </div>
                    <Button type="submit" className="rounded-2xl">Zapisz kolejny krok</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Wpłaty częściowe</CardTitle>
                <CardDescription>Możesz dodawać wiele wpłat z opcjonalną datą. Status wygrany automatycznie domyka resztę tylko w agregatach.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border p-3 app-border app-surface">
                    <p className="text-xs app-muted">Wartość</p>
                    <p className="font-semibold app-text">{(lead.dealValue || 0).toLocaleString()} PLN</p>
                  </div>
                  <div className="rounded-2xl border p-3 app-border app-surface">
                    <p className="text-xs app-muted">Wpłacono</p>
                    <p className="font-semibold text-emerald-600">{draftFinance.paidAmount.toLocaleString()} PLN</p>
                  </div>
                  <div className="rounded-2xl border p-3 app-border app-surface">
                    <p className="text-xs app-muted">Pozostało</p>
                    <p className="font-semibold app-text">{draftFinance.remainingAmount.toLocaleString()} PLN</p>
                  </div>
                  <div className="rounded-2xl border p-3 app-border app-surface">
                    <p className="text-xs app-muted">W lejku</p>
                    <p className="font-semibold text-[color:var(--app-primary)]">{draftFinance.funnelAmount.toLocaleString()} PLN</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {paymentDrafts.map((payment) => (
                    <div key={payment.id} className="grid gap-2 rounded-2xl border p-3 app-border md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
                      <div className="space-y-1">
                        <Label className="text-xs">Kwota</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={payment.amount}
                          onChange={(event) => setPaymentDrafts((prev) => prev.map((item) => item.id === payment.id ? { ...item, amount: event.target.value } : item))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Data</Label>
                        <Input
                          type="date"
                          value={payment.paidAt}
                          onChange={(event) => setPaymentDrafts((prev) => prev.map((item) => item.id === payment.id ? { ...item, paidAt: event.target.value } : item))}
                        />
                      </div>
                      <Button type="button" variant="ghost" className="rounded-xl text-rose-500" onClick={() => setPaymentDrafts((prev) => prev.filter((item) => item.id !== payment.id))}>
                        Usuń
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setPaymentDrafts((prev) => [...prev, { id: crypto.randomUUID(), amount: '', paidAt: '' }])}>
                    <Plus className="h-4 w-4" /> Dodaj wpłatę
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button className="rounded-2xl" onClick={() => void handleSavePayments()}>Zapisz wpłaty</Button>
                </div>

                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="mb-2 text-sm font-semibold app-text">Historia zapisanych wpłat</p>
                  {finance.partialPayments.length > 0 ? (
                    <div className="space-y-2">
                      {finance.partialPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between gap-3 text-sm">
                          <span className="app-text">{payment.amount.toLocaleString()} PLN</span>
                          <span className="app-muted">{payment.paidAt || payment.createdAt.slice(0, 10)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm app-muted">Brak zapisanych wpłat.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Notatki i historia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <Textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Dodaj notatkę po rozmowie albo ustaleniach..." />
                  <Button type="submit" className="rounded-2xl" disabled={!note.trim()}>
                    <Plus className="h-4 w-4" /> Dodaj notatkę
                  </Button>
                </form>

                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-4">
                    {activities.length > 0 ? activities.map((activity) => (
                      <div key={activity.id} className="rounded-2xl border p-4 app-border app-surface">
                        <p className="font-semibold app-text">{activityLabel(activity)}</p>
                        {activityDescription(activity) ? <p className="mt-1 whitespace-pre-wrap text-sm app-muted">{activityDescription(activity)}</p> : null}
                        <p className="mt-3 text-[11px] font-medium app-muted">
                          {activity.createdAt ? format(activity.createdAt.toDate(), 'd MMMM yyyy, HH:mm', { locale: pl }) : 'Teraz'}
                        </p>
                      </div>
                    )) : (
                      <p className="text-sm app-muted">Brak historii działań.</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Dane kontaktowe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InlineField
                  label="Kontakt"
                  value={contactDraft.name || ''}
                  editing={editingField === 'name'}
                  input={<Input value={contactDraft.name || ''} onChange={(event) => setContactDraft((prev) => ({ ...prev, name: event.target.value }))} />}
                  onEdit={() => setEditingField('name')}
                  onSave={() => void handleInlineSave('name')}
                />
                <InlineField
                  label="E-mail"
                  value={contactDraft.email || ''}
                  editing={editingField === 'email'}
                  input={<Input type="email" value={contactDraft.email || ''} onChange={(event) => setContactDraft((prev) => ({ ...prev, email: event.target.value }))} />}
                  onEdit={() => setEditingField('email')}
                  onSave={() => void handleInlineSave('email')}
                  canQuickOpen={Boolean(contactDraft.email)}
                  quickOpenHref={contactDraft.email ? `mailto:${contactDraft.email}` : undefined}
                />
                <InlineField
                  label="Telefon"
                  value={contactDraft.phone || ''}
                  editing={editingField === 'phone'}
                  input={<Input value={contactDraft.phone || ''} onChange={(event) => setContactDraft((prev) => ({ ...prev, phone: event.target.value }))} />}
                  onEdit={() => setEditingField('phone')}
                  onSave={() => void handleInlineSave('phone')}
                  canQuickOpen={Boolean(contactDraft.phone)}
                  quickOpenHref={contactDraft.phone ? `tel:${contactDraft.phone}` : undefined}
                />
                <InlineField
                  label="Firma"
                  value={contactDraft.company || ''}
                  editing={editingField === 'company'}
                  input={<Input value={contactDraft.company || ''} onChange={(event) => setContactDraft((prev) => ({ ...prev, company: event.target.value }))} />}
                  onEdit={() => setEditingField('company')}
                  onSave={() => void handleInlineSave('company')}
                />
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Stan procesu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Status</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className={currentStatus.badge}>{currentStatus.label}</Badge>
                    {lead.isAtRisk ? <Badge variant="destructive">Zagrożony</Badge> : <Badge variant="secondary">Stabilny</Badge>}
                  </div>
                </div>
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Źródło</p>
                  <p className="mt-1 font-medium app-text">
                    {SOURCE_OPTIONS.find((option) => option.value === lead.source)?.label || lead.source || 'Brak'}
                  </p>
                </div>
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Kolejny krok</p>
                  <p className="mt-1 font-medium app-text">{lead.nextStep || 'Brak ustawionego kroku'}</p>
                  <p className={`mt-1 text-sm font-medium ${dueTone(lead.nextActionAt)}`}>{formatDateTime(lead.nextActionAt)}</p>
                </div>
                {(lead.isAtRisk || isOverdue || (daysSinceTouch ?? 0) >= 5 || !lead.nextActionAt) ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-semibold text-amber-600">Powód alarmu</p>
                        <p className="mt-1 text-sm text-amber-600/90">
                          {!lead.nextActionAt
                            ? 'Lead nie ma ustawionego kolejnego ruchu.'
                            : isOverdue
                              ? 'Termin ruchu minął i rekord wymaga natychmiastowego pchnięcia.'
                              : (daysSinceTouch ?? 0) >= 5
                                ? 'Lead leży bez świeżego kontaktu od kilku dni.'
                                : 'Lead jest oznaczony jako zagrożony.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Uruchomienie sprawy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {associatedCase ? (
                  <div className="rounded-2xl border p-4 app-border app-surface">
                    <p className="font-semibold app-text">{associatedCase.title || 'Powiązana sprawa'}</p>
                    <p className="mt-1 text-sm app-muted">Status: {associatedCase.status || 'collecting_materials'}</p>
                    <p className="text-sm app-muted">Kompletność: {associatedCase.completenessPercent || 0}%</p>
                    <Button variant="outline" className="mt-3 rounded-2xl" asChild>
                      <Link to={`/case/${associatedCase.id}`}>
                        Otwórz sprawę <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label>Szablon startowy</Label>
                        <Button variant="ghost" size="sm" className="h-8 rounded-xl px-3" asChild>
                          <Link to="/templates">Zarządzaj szablonami</Link>
                        </Button>
                      </div>
                      <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Bez szablonu lub wybierz gotowiec" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Bez szablonu</SelectItem>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>{template.name || 'Szablon bez nazwy'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full rounded-2xl" onClick={handleCreateCase} disabled={caseBusy}>
                      {caseBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
                      Utwórz sprawę z leada
                    </Button>
                  </>
                )}
                <Button variant="outline" className="w-full rounded-2xl" asChild>
                  <Link to="/clients">Moduł klientów <ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
