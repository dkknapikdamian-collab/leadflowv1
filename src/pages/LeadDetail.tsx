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
  AlertTriangle,
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
  TrendingUp,
  User,
  CheckCheck,
  MessageSquare,
  Edit2,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
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

type LeadRecord = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  dealValue?: number;
  nextStep?: string;
  nextActionAt?: string;
  isAtRisk?: boolean;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
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
    default:
      return 'Aktywność';
  }
}

function activityDescription(activity: ActivityRecord) {
  if (activity.payload?.content) return activity.payload.content;
  if (activity.payload?.note) return activity.payload.note;
  if (activity.payload?.nextStep || activity.payload?.nextActionAt) {
    const pieces = [];
    if (activity.payload?.nextStep) pieces.push(activity.payload.nextStep);
    if (activity.payload?.nextActionAt) pieces.push(formatDateTime(activity.payload.nextActionAt));
    return pieces.join(' • ');
  }
  return '';
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

  const [isEditing, setIsEditing] = useState(false);
  const [editLead, setEditLead] = useState<Partial<LeadRecord> | null>(null);
  const [note, setNote] = useState('');
  const [nextStepDraft, setNextStepDraft] = useState('');
  const [nextActionDraft, setNextActionDraft] = useState(startOfTomorrowAtNine());
  const [selectedTemplateId, setSelectedTemplateId] = useState('none');
  const [quickActionBusy, setQuickActionBusy] = useState<QuickActionKey | null>(null);
  const [caseBusy, setCaseBusy] = useState(false);

  useEffect(() => {
    if (!leadId || !workspace) return;

    if (isSupabaseConfigured()) {
      setLoading(true);
      void fetchLeadByIdFromSupabase(leadId)
        .then((item) => {
          const data = item as LeadRecord;
          setLead(data);
          setEditLead(data);
          setNextStepDraft(data.nextStep || '');
          setNextActionDraft(data.nextActionAt || startOfTomorrowAtNine());
          setActivities([]);
          setTemplates([]);
          setAssociatedCase(null);
        })
        .catch(() => {
          toast.error('Lead nie istnieje');
          navigate('/leads');
        })
        .finally(() => {
          setLoading(false);
        });
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
      setLead(data);
      setEditLead(data);
      setNextStepDraft(data.nextStep || '');
      setNextActionDraft(data.nextActionAt || startOfTomorrowAtNine());
    });

    const activitiesQuery = query(
      collection(db, 'activities'),
      where('leadId', '==', leadId),
      orderBy('createdAt', 'desc')
    );
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

  const currentStatus = useMemo(
    () => STATUS_OPTIONS.find((option) => option.value === lead?.status) || STATUS_OPTIONS[0],
    [lead?.status]
  );

  const nextActionDate = toDate(lead?.nextActionAt);
  const lastTouchDate = toDate(lead?.updatedAt);
  const daysSinceTouch = lastTouchDate
    ? differenceInCalendarDays(startOfDay(new Date()), startOfDay(lastTouchDate))
    : null;
  const isOverdue = !!nextActionDate && isPast(nextActionDate) && !isToday(nextActionDate);

  async function logActivity(eventType: string, payload: Record<string, any>) {
    if (isSupabaseConfigured()) {
      return;
    }
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

  async function handleUpdateStatus(status: LeadRecord['status']) {
    if (!leadId || !lead) return;
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const updated = await updateLeadInSupabase({ id: leadId, status });
        setLead(updated as LeadRecord);
        setEditLead(updated as LeadRecord);
        toast.success('Status zaktualizowany');
        return;
      }

      await updateDoc(doc(db, 'leads', leadId), {
        status,
        updatedAt: serverTimestamp(),
      });
      await logActivity('status_changed', { status });
      toast.success('Status zaktualizowany');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleSaveNextStep(e?: FormEvent) {
    e?.preventDefault();
    if (!leadId || !lead) return;
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const updated = await updateLeadInSupabase({
          id: leadId,
          nextStep: nextStepDraft,
          nextActionAt: nextActionDraft,
        });
        setLead(updated as LeadRecord);
        setEditLead(updated as LeadRecord);
        toast.success('Kolejny krok zapisany');
        return;
      }

      await updateDoc(doc(db, 'leads', leadId), {
        nextStep: nextStepDraft,
        nextActionAt: nextActionDraft,
        updatedAt: serverTimestamp(),
      });
      await logActivity('next_step_updated', {
        nextStep: nextStepDraft,
        nextActionAt: nextActionDraft,
      });
      toast.success('Kolejny krok zapisany');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

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

  async function handleUpdateLead() {
    if (!leadId || !editLead) return;
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    try {
      const payload = {
        name: editLead.name || '',
        company: editLead.company || '',
        email: editLead.email || '',
        phone: editLead.phone || '',
        dealValue: Number(editLead.dealValue) || 0,
        source: editLead.source || 'other',
        nextStep: editLead.nextStep || '',
        nextActionAt: editLead.nextActionAt || '',
        updatedAt: serverTimestamp(),
      };

      if (isSupabaseConfigured()) {
        const updated = await updateLeadInSupabase({
          id: leadId,
          name: payload.name,
          company: payload.company,
          email: payload.email,
          phone: payload.phone,
          dealValue: payload.dealValue,
          source: payload.source,
          nextStep: payload.nextStep,
          nextActionAt: payload.nextActionAt,
        });
        setLead(updated as LeadRecord);
        setEditLead(updated as LeadRecord);
        setIsEditing(false);
        toast.success('Lead zaktualizowany');
        return;
      }

      await updateDoc(doc(db, 'leads', leadId), payload);
      setIsEditing(false);
      toast.success('Lead zaktualizowany');
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
        toast.success('Lead usunięty');
        navigate('/leads');
        return;
      }

      await deleteDoc(doc(db, 'leads', leadId));
      toast.success('Lead usunięty');
      navigate('/leads');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleQuickAction(action: QuickActionKey) {
    if (!leadId || !lead) return;
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

    setQuickActionBusy(action);

    try {
      const updates: Record<string, any> = { updatedAt: serverTimestamp() };
      const activityPayload: Record<string, any> = { title: QUICK_ACTIONS[action].label };

      if (action === 'call') {
        activityPayload.note = 'Zapisano kontakt z leadem.';
      }

      if (action === 'followup') {
        updates.status = 'follow_up';
        updates.nextStep = 'Follow-up po kontakcie';
        updates.nextActionAt = startOfTomorrowAtNine();
        activityPayload.nextStep = updates.nextStep;
        activityPayload.nextActionAt = updates.nextActionAt;
      }

      if (action === 'waiting') {
        updates.status = 'contacted';
        updates.nextStep = 'Sprawdzić odpowiedź klienta';
        updates.nextActionAt = startInDaysAtNine(3);
        activityPayload.nextStep = updates.nextStep;
        activityPayload.nextActionAt = updates.nextActionAt;
      }

      if (action === 'meeting') {
        updates.status = 'qualification';
        updates.nextStep = 'Spotkanie z leadem';
        updates.nextActionAt = startInDaysAtNine(2);
        activityPayload.nextStep = updates.nextStep;
        activityPayload.nextActionAt = updates.nextActionAt;
      }

      if (action === 'won') {
        updates.status = 'won';
      }

      if (action === 'lost') {
        updates.status = 'lost';
      }

      if (isSupabaseConfigured()) {
        const updated = await updateLeadInSupabase({
          id: leadId,
          status: updates.status,
          nextStep: updates.nextStep,
          nextActionAt: updates.nextActionAt,
        });
        setLead(updated as LeadRecord);
        setEditLead(updated as LeadRecord);
      } else {
        await updateDoc(doc(db, 'leads', leadId), updates);
        await logActivity(action === 'call' ? 'call_logged' : 'quick_action', activityPayload);
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
    if (!hasAccess) {
      toast.error('Trial wygasł.');
      return;
    }

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

      toast.success(
        leadTasksSnapshot.size > 0
          ? `Sprawa została uruchomiona. Przeniesiono też ${leadTasksSnapshot.size} otwartych zadań.`
          : 'Sprawa została uruchomiona.'
      );
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
              <p className="mt-1 text-sm app-muted">
                Tu prowadzisz rekord do przodu. Widzisz stan, kolejny krok i od razu możesz wykonać następny ruch.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-2xl" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" /> Edytuj
            </Button>
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wartość</p>
                <p className="mt-2 text-2xl font-bold app-text">{(lead.dealValue || 0).toLocaleString()} PLN</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><TrendingUp className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Źródło</p>
                <p className="mt-2 text-2xl font-bold app-text capitalize">{lead.source || 'Brak'}</p>
              </div>
              <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-500"><Target className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Kolejny ruch</p>
                <p className={`mt-2 text-xl font-bold ${dueTone(lead.nextActionAt)}`}>{formatDateTime(lead.nextActionAt)}</p>
              </div>
              <div className={`rounded-2xl p-3 ${isOverdue ? 'bg-rose-500/12 text-rose-500' : 'app-primary-chip'}`}>
                <Calendar className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Bez ruchu</p>
                <p className="mt-2 text-2xl font-bold app-text">{daysSinceTouch ?? 0} dni</p>
              </div>
              <div className={`rounded-2xl p-3 ${lead.isAtRisk || (daysSinceTouch ?? 0) >= 5 ? 'bg-amber-500/12 text-amber-500' : 'app-primary-chip'}`}>
                <Clock className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Centrum ruchu</CardTitle>
                <CardDescription>
                  Najszybsze akcje, żeby popchnąć leada bez skakania po innych ekranach.
                </CardDescription>
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
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold app-text">{QUICK_ACTIONS[key].label}</p>
                        <p className="mt-1 text-sm app-muted">{QUICK_ACTIONS[key].description}</p>
                      </div>
                      {quickActionBusy === key ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4 app-muted" />}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Plan kolejnego ruchu</CardTitle>
                <CardDescription>
                  Tu ustawiasz, co dokładnie ma się wydarzyć dalej i kiedy system ma o tym przypomnieć.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNextStep} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Kolejny krok</Label>
                    <Input value={nextStepDraft} onChange={(event) => setNextStepDraft(event.target.value)} placeholder="Np. oddzwonić po ofercie i domknąć termin" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="datetime-local" value={nextActionDraft} onChange={(event) => setNextActionDraft(event.target.value)} />
                    </div>
                    <Button type="submit" className="rounded-2xl">Zapisz kolejny krok</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setNextActionDraft(startOfTomorrowAtNine())}>Jutro 09:00</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setNextActionDraft(startInDaysAtNine(2))}>Za 2 dni</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setNextActionDraft(startInDaysAtNine(7))}>Za tydzień</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Notatki i historia</CardTitle>
                <CardDescription>
                  Najpierw szybka notatka, niżej pełna oś działań na leadzie.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <Textarea
                    rows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Zapisz najważniejszy kontekst po rozmowie, ofercie albo negocjacji..."
                  />
                  <Button type="submit" className="rounded-2xl" disabled={!note.trim()}>
                    <Plus className="h-4 w-4" /> Dodaj notatkę
                  </Button>
                </form>

                <ScrollArea className="h-[420px] pr-4">
                  <div className="relative space-y-4 before:absolute before:left-[0.65rem] before:top-2 before:bottom-2 before:w-px before:bg-[var(--app-border)]">
                    {activities.length > 0 ? activities.map((activity) => (
                      <div key={activity.id} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-4 border-[var(--app-surface-elevated)] bg-[color:var(--app-primary)]" />
                        <div className="rounded-2xl border p-4 app-border app-surface">
                          <p className="font-semibold app-text">{activityLabel(activity)}</p>
                          {activityDescription(activity) ? (
                            <p className="mt-1 whitespace-pre-wrap text-sm app-muted">{activityDescription(activity)}</p>
                          ) : null}
                          <p className="mt-3 text-[11px] font-medium app-muted">
                            {activity.createdAt ? format(activity.createdAt.toDate(), 'd MMMM yyyy, HH:mm', { locale: pl }) : 'Teraz'}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <Card className="border-dashed app-surface-strong">
                        <CardContent className="p-8 text-center">
                          <MessageSquare className="mx-auto mb-3 h-8 w-8 app-muted" />
                          <p className="font-medium app-text">Jeszcze nie ma historii działań na tym leadzie.</p>
                          <p className="mt-1 text-sm app-muted">Dodaj notatkę albo wykonaj szybką akcję, a rekord zacznie żyć.</p>
                        </CardContent>
                      </Card>
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
              <CardContent className="space-y-4">
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl p-3 app-primary-chip"><User className="h-5 w-5" /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Kontakt</p>
                      <p className="font-semibold app-text">{lead.name}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-2xl border p-4 app-border app-surface">
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] app-muted">E-mail</p>
                    <p className="break-all font-medium app-text">{lead.email || 'Brak adresu'}</p>
                    {lead.email ? (
                      <Button variant="ghost" size="sm" className="mt-2 px-0" asChild>
                        <a href={`mailto:${lead.email}`}><Mail className="h-4 w-4" /> Napisz</a>
                      </Button>
                    ) : null}
                  </div>
                  <div className="rounded-2xl border p-4 app-border app-surface">
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] app-muted">Telefon</p>
                    <p className="font-medium app-text">{lead.phone || 'Brak numeru'}</p>
                    {lead.phone ? (
                      <Button variant="ghost" size="sm" className="mt-2 px-0" asChild>
                        <a href={`tel:${lead.phone}`}><Phone className="h-4 w-4" /> Zadzwoń</a>
                      </Button>
                    ) : null}
                  </div>
                  <div className="rounded-2xl border p-4 app-border app-surface">
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] app-muted">Firma</p>
                    <p className="font-medium app-text">{lead.company || 'Brak firmy'}</p>
                  </div>
                </div>
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
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Ostatni kontakt</p>
                  <p className="mt-1 font-medium app-text">{formatDateTime(lead.updatedAt)}</p>
                  <p className="mt-1 text-sm app-muted">{daysSinceTouch ?? 0} dni od ostatniego ruchu</p>
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
                <CardTitle className="text-xl">Klient w procesie</CardTitle>
                <CardDescription>
                  Jeden rekord klienta spina sprzedaż i realizację, żeby nie gubić kontaktu między etapami.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Rekord klienta</p>
                  <p className="mt-1 font-semibold app-text">{lead.name}</p>
                  <p className="mt-1 text-sm app-muted">
                    {lead.linkedClientId
                      ? 'Lead jest już spięty z rekordem klienta i może płynnie przejść do sprawy.'
                      : 'Rekord klienta zostanie utworzony automatycznie przy uruchomieniu sprawy albo możesz go zobaczyć w module Klienci.'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.linkedClientId ? <Badge variant="secondary">Klient spięty</Badge> : <Badge variant="outline">Klient utworzy się przy handoffie</Badge>}
                    {lead.linkedCaseId ? <Badge variant="outline">Sprawa podpięta</Badge> : null}
                  </div>
                  <Button variant="outline" className="mt-4 rounded-2xl" asChild>
                    <Link to="/clients">Otwórz moduł klientów <ChevronRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Uruchomienie sprawy</CardTitle>
                <CardDescription>
                  Wygrany lead może od razu przejść do realizacji bez ręcznego przepisywania.
                </CardDescription>
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
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj leada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nazwa</Label>
              <Input value={editLead?.name || ''} onChange={(event) => setEditLead((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Firma</Label>
              <Input value={editLead?.company || ''} onChange={(event) => setEditLead((prev) => ({ ...prev, company: event.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" value={editLead?.email || ''} onChange={(event) => setEditLead((prev) => ({ ...prev, email: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={editLead?.phone || ''} onChange={(event) => setEditLead((prev) => ({ ...prev, phone: event.target.value }))} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Wartość</Label>
                <Input type="number" value={editLead?.dealValue || ''} onChange={(event) => setEditLead((prev) => ({ ...prev, dealValue: Number(event.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Źródło</Label>
                <Select value={editLead?.source || 'other'} onValueChange={(value) => setEditLead((prev) => ({ ...prev, source: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map((source) => (
                      <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kolejny krok</Label>
              <Input value={editLead?.nextStep || ''} onChange={(event) => setEditLead((prev) => ({ ...prev, nextStep: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Termin ruchu</Label>
              <Input type="datetime-local" value={editLead?.nextActionAt || ''} onChange={(event) => setEditLead((prev) => ({ ...prev, nextActionAt: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Anuluj</Button>
            <Button onClick={handleUpdateLead}><CheckCheck className="h-4 w-4" /> Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
