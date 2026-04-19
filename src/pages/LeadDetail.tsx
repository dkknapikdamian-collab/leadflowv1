import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Target,
  Trash2,
  CheckSquare,
  Briefcase,
  Link2,
} from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import { getLeadFinance, normalizePartialPayments } from '../lib/lead-finance';
import { EVENT_TYPES, TASK_TYPES } from '../lib/options';
import {
  deleteLeadFromSupabase,
  fetchActivitiesFromSupabase,
  fetchCasesFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadByIdFromSupabase,
  fetchTasksFromSupabase,
  insertActivityToSupabase,
  isSupabaseConfigured,
  updateCaseInSupabase,
  updateLeadInSupabase,
} from '../lib/supabase-fallback';
import { auth, db } from '../firebase';

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

function asDate(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    try {
      const parsed = value.includes('T') ? parseISO(value) : new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
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

function formatScheduleDate(value: unknown) {
  const parsed = asDate(value);
  return parsed ? format(parsed, 'd MMM yyyy HH:mm', { locale: pl }) : 'Bez terminu';
}

function taskTypeLabel(type?: string) {
  return TASK_TYPES.find((entry) => entry.value === type)?.label || 'Zadanie';
}

function eventTypeLabel(type?: string) {
  return EVENT_TYPES.find((entry) => entry.value === type)?.label || 'Wydarzenie';
}

export default function LeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { hasAccess, workspace } = useWorkspace();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [associatedCase, setAssociatedCase] = useState<any>(null);
  const [allCases, setAllCases] = useState<any[]>([]);
  const [linkedTasks, setLinkedTasks] = useState<any[]>([]);
  const [linkedEvents, setLinkedEvents] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editLead, setEditLead] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [linkCaseId, setLinkCaseId] = useState('');
  const [linkingCase, setLinkingCase] = useState(false);

  const loadActivities = async () => {
    if (!leadId) return;

    if (isSupabaseConfigured()) {
      try {
        const rows = await fetchActivitiesFromSupabase({ leadId, limit: 100 });
        setActivities(rows as any[]);
      } catch (error: any) {
        setActivities([]);
        toast.error(`Błąd odczytu aktywności: ${error?.message || 'REQUEST_FAILED'}`);
      }
      return;
    }

    if (!auth.currentUser) {
      setActivities([]);
    }
  };

  const loadLead = async () => {
    if (!leadId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [leadRow, caseRows, taskRows, eventRows] = await Promise.all([
        fetchLeadByIdFromSupabase(leadId),
        fetchCasesFromSupabase(),
        fetchTasksFromSupabase(),
        fetchEventsFromSupabase(),
      ]);

      const normalizedLead = {
        ...(leadRow as Record<string, unknown>),
        partialPayments: normalizePartialPayments((leadRow as Record<string, unknown>)?.partialPayments),
      };

      const allCaseRows = caseRows as Record<string, unknown>[];
      const currentCase = allCaseRows.find((item) => String(item.leadId || '') === leadId) || null;

      setLead(normalizedLead);
      setEditLead(normalizedLead);
      setAssociatedCase(currentCase);
      setAllCases(allCaseRows);
      setLinkedTasks((taskRows as Record<string, unknown>[]).filter((item) => String(item.leadId || '') === leadId));
      setLinkedEvents((eventRows as Record<string, unknown>[]).filter((item) => String(item.leadId || '') === leadId));
      setLinkCaseId(currentCase?.id ? String(currentCase.id) : '');
    } catch (error: any) {
      const message = error?.message || 'Nie udało się pobrać danych leada';
      setLoadError(message);
      toast.error(`Błąd odczytu leada: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!leadId) return;
    if (!isSupabaseConfigured()) return;
    void Promise.all([loadLead(), loadActivities()]);
  }, [leadId]);

  useEffect(() => {
    if (!leadId || !auth.currentUser || isSupabaseConfigured()) return;

    const activitiesRef = collection(db, 'activities');
    const activityQuery = query(activitiesRef, where('leadId', '==', leadId), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      activityQuery,
      (snapshot) => {
        setActivities(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      },
      () => {
        setActivities([]);
      },
    );

    return () => unsubscribe();
  }, [leadId]);

  const finance = useMemo(() => getLeadFinance(lead || {}), [lead]);

  const sortedLinkedTasks = useMemo(
    () =>
      [...linkedTasks].sort((left, right) => {
        const leftTime = asDate(left.date || left.dueAt || left.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightTime = asDate(right.date || right.dueAt || right.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return leftTime - rightTime;
      }),
    [linkedTasks],
  );

  const sortedLinkedEvents = useMemo(
    () =>
      [...linkedEvents].sort((left, right) => {
        const leftTime = asDate(left.startAt || left.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightTime = asDate(right.startAt || right.updatedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return leftTime - rightTime;
      }),
    [linkedEvents],
  );

  const availableCasesToLink = useMemo(
    () =>
      allCases.filter((item) => {
        const itemLeadId = String(item.leadId || '');
        return !itemLeadId || itemLeadId === leadId;
      }),
    [allCases, leadId],
  );

  const addActivity = async (eventType: string, payload: Record<string, unknown>) => {
    if (!leadId) return;

    if (isSupabaseConfigured()) {
      try {
        await insertActivityToSupabase({
          leadId,
          ownerId: auth.currentUser?.uid ?? null,
          actorId: auth.currentUser?.uid ?? null,
          actorType: 'operator',
          eventType,
          payload,
          workspaceId: workspace?.id,
        });
        await loadActivities();
        return;
      } catch {
        // fallback below only if needed
      }
    }

    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'activities'), {
        leadId,
        ownerId: auth.currentUser.uid,
        actorId: auth.currentUser.uid,
        actorType: 'operator',
        eventType,
        payload,
        createdAt: serverTimestamp(),
      });
    } catch {
      // best effort only
    }
  };

  const patchLead = async (payload: Record<string, unknown>, successMessage?: string) => {
    if (!leadId) return;
    try {
      await updateLeadInSupabase({ id: leadId, ...payload });
      if (successMessage) toast.success(successMessage);
      await loadLead();
    } catch (error: any) {
      toast.error(`Błąd zapisu: ${error?.message || 'REQUEST_FAILED'}`);
      throw error;
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    await patchLead({ status }, 'Status zaktualizowany');
    await addActivity('status_changed', { status });
  };

  const handleUpdateLead = async () => {
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!editLead) return;
    await patchLead(
      {
        name: editLead.name || '',
        company: editLead.company || '',
        email: editLead.email || '',
        phone: editLead.phone || '',
        source: editLead.source || 'other',
        dealValue: Number(editLead.dealValue) || 0,
      },
      'Dane zaktualizowane',
    );
    setIsEditing(false);
  };

  const handleDeleteLead = async () => {
    if (!leadId) return;
    if (!window.confirm('Czy na pewno chcesz usunąć tego leada?')) return;
    try {
      await deleteLeadFromSupabase(leadId);
      toast.success('Lead usunięty');
      navigate('/leads');
    } catch (error: any) {
      toast.error(`Błąd usuwania: ${error?.message || 'REQUEST_FAILED'}`);
    }
  };

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !hasAccess) return;
    const content = note.trim();
    await addActivity('note_added', { content });
    setNote('');
    toast.success('Notatka dodana');
  };

  const handleAddPartialPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!paymentAmount.trim()) return toast.error('Podaj kwotę wpłaty');
    const amount = Number(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) return toast.error('Kwota musi być większa od zera');

    const nextPayments = [
      ...finance.partialPayments,
      {
        id: crypto.randomUUID(),
        amount,
        paidAt: paymentDate || undefined,
        createdAt: new Date().toISOString(),
      },
    ];

    await patchLead({ partialPayments: nextPayments }, 'Wpłata dodana');
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().slice(0, 10));
  };

  const handleLinkExistingCase = async () => {
    if (!leadId) return;
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!linkCaseId) return toast.error('Wybierz sprawę do powiązania');

    try {
      setLinkingCase(true);
      await updateCaseInSupabase({ id: linkCaseId, leadId });
      await patchLead({ linkedCaseId: linkCaseId }, 'Sprawa podpięta do leada');
      await addActivity('case_linked', { caseId: linkCaseId });
      setLinkCaseId('');
    } catch (error: any) {
      toast.error(`Błąd przypięcia sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLinkingCase(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (loadError || !lead) {
    return (
      <Layout>
        <div className="p-6 max-w-3xl mx-auto w-full">
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-700">Nie udało się otworzyć leada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 break-words">{loadError || 'Lead nie istnieje albo nie został jeszcze zsynchronizowany.'}</p>
              <div className="flex gap-2">
                <Button onClick={() => void loadLead()}>Spróbuj ponownie</Button>
                <Button variant="outline" asChild>
                  <Link to="/leads">Wróć do listy</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const currentStatus = STATUS_OPTIONS.find((status) => status.value === lead.status) || STATUS_OPTIONS[0];
  const nextActionDate = asDate(lead.nextActionAt);
  const updatedAt = asDate(lead.updatedAt);

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/leads" className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 max-w-[200px] sm:max-w-md break-words line-clamp-2">{lead.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${currentStatus.color} border-none text-[10px] uppercase font-bold h-5`}>{currentStatus.label}</Badge>
                {lead.isAtRisk && (
                  <Badge variant="destructive" className="text-[10px] uppercase font-bold h-5 animate-pulse">
                    Zagrożony
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edytuj dane
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteLead} className="text-rose-600">
                  <Trash2 className="w-4 h-4 mr-2" /> Usuń leada
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20" onClick={() => void handleUpdateStatus('won')} disabled={lead.status === 'won'}>
              <CheckCircle2 className="w-4 h-4" /> Wygrany
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wartość</p>
                    <p className="text-lg font-bold text-slate-900 break-words">{(Number(lead.dealValue) || 0).toLocaleString()} PLN</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Źródło</p>
                    <p className="text-lg font-bold text-slate-900 break-words">{SOURCE_OPTIONS.find((item) => item.value === lead.source)?.label || 'Inne'}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-amber-50 p-3 rounded-2xl">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Następny krok</p>
                    <p className={`text-lg font-bold ${nextActionDate && isPast(nextActionDate) ? 'text-rose-600' : 'text-slate-900'} break-words`}>
                      {nextActionDate ? format(nextActionDate, 'd MMM', { locale: pl }) : 'Brak'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-12 p-0 gap-8">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">
                  Przegląd
                </TabsTrigger>
                <TabsTrigger value="finance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">
                  Finanse
                </TabsTrigger>
                <TabsTrigger value="realization" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 h-12 font-bold">
                  Realizacja
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6 space-y-8">
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Informacje kontaktowe</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail</p>
                          <p className="text-sm font-medium break-all">{lead.email || 'Brak'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon</p>
                          <p className="text-sm font-medium break-words">{lead.phone || 'Brak'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Firma</p>
                          <p className="text-sm font-medium break-words">{lead.company || 'Brak'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ostatnia aktualizacja</p>
                          <p className="text-sm font-medium">{updatedAt ? format(updatedAt, 'd MMMM HH:mm', { locale: pl }) : '-'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Planowanie ruchu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Następny krok</Label>
                        <Input
                          value={lead.nextStep || ''}
                          onChange={(e) => setLead((prev: any) => ({ ...(prev || {}), nextStep: e.target.value }))}
                          onBlur={(e) => {
                            void patchLead({ nextStep: e.target.value }, 'Zapisano następny krok');
                          }}
                          placeholder="np. Telefon z ofertą"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Termin ruchu</Label>
                        <Input
                          type="date"
                          value={lead.nextActionAt ? String(lead.nextActionAt).slice(0, 10) : ''}
                          onChange={(e) => setLead((prev: any) => ({ ...(prev || {}), nextActionAt: e.target.value }))}
                          onBlur={(e) => {
                            void patchLead({ nextActionAt: e.target.value || '' }, 'Zapisano termin ruchu');
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <input
                        type="checkbox"
                        checked={Boolean(lead.isAtRisk)}
                        onChange={(e) => {
                          void patchLead({ isAtRisk: e.target.checked }, 'Zapisano status ryzyka');
                        }}
                        className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                      />
                      <Label className="text-rose-700 font-bold">Oznacz jako zagrożony (wymaga natychmiastowej uwagi)</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Powiązane elementy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Zadania</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{sortedLinkedTasks.length}</p>
                        <p className="mt-1 text-sm text-slate-500">Każde zadanie powiązane z leadem widać tutaj i na liście zadań.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Wydarzenia</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{sortedLinkedEvents.length}</p>
                        <p className="mt-1 text-sm text-slate-500">Wydarzenia z datą są widoczne także w kalendarzu.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sprawa</p>
                        <p className="mt-2 text-lg font-bold text-slate-900 break-words">{associatedCase?.title || 'Brak podpiętej sprawy'}</p>
                        <p className="mt-1 text-sm text-slate-500">Lead może być źródłem sprawy operacyjnej.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-900">Zadania leada</h3>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/tasks">Otwórz zadania</Link>
                          </Button>
                        </div>
                        {sortedLinkedTasks.length === 0 ? (
                          <p className="text-sm text-slate-500">Brak zadań powiązanych z tym leadem.</p>
                        ) : (
                          <div className="space-y-2">
                            {sortedLinkedTasks.slice(0, 6).map((task: any) => (
                              <div key={task.id} className="rounded-xl border border-slate-200 px-3 py-2">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 break-words">{task.title || 'Zadanie bez tytułu'}</p>
                                    <p className="text-xs text-slate-500 break-words">{taskTypeLabel(task.type)} • {formatScheduleDate(task.date || task.dueAt)}</p>
                                  </div>
                                  <Badge variant={task.status === 'done' ? 'secondary' : 'outline'}>{task.status === 'done' ? 'Zrobione' : 'Aktywne'}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-900">Wydarzenia leada</h3>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/calendar">Otwórz kalendarz</Link>
                          </Button>
                        </div>
                        {sortedLinkedEvents.length === 0 ? (
                          <p className="text-sm text-slate-500">Brak wydarzeń powiązanych z tym leadem.</p>
                        ) : (
                          <div className="space-y-2">
                            {sortedLinkedEvents.slice(0, 6).map((event: any) => (
                              <div key={event.id} className="rounded-xl border border-slate-200 px-3 py-2">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 break-words">{event.title || 'Wydarzenie bez tytułu'}</p>
                                    <p className="text-xs text-slate-500 break-words">{eventTypeLabel(event.type)} • {formatScheduleDate(event.startAt)}</p>
                                  </div>
                                  <Badge variant={event.status === 'completed' ? 'secondary' : 'outline'}>{event.status === 'completed' ? 'Zrobione' : 'Zaplanowane'}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="finance" className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">Suma wpłat</p>
                      <p className="text-2xl font-bold text-emerald-600">{finance.paidAmount.toLocaleString()} PLN</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">Pozostało</p>
                      <p className="text-2xl font-bold text-amber-600">{finance.remainingAmount.toLocaleString()} PLN</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500">Wartość całkowita</p>
                      <p className="text-2xl font-bold text-slate-900">{(Number(lead.dealValue) || 0).toLocaleString()} PLN</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Dodaj wpłatę częściową</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleAddPartialPayment}>
                      <Input type="number" min="0" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Kwota (PLN)" />
                      <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" /> Dodaj wpłatę
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Historia wpłat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {finance.partialPayments.length === 0 ? (
                      <p className="text-sm text-slate-500">Brak wpłat częściowych.</p>
                    ) : (
                      <div className="space-y-2">
                        {finance.partialPayments.map((payment) => {
                          const paymentDateValue = payment.paidAt || payment.createdAt;
                          const parsed = asDate(paymentDateValue);
                          return (
                            <div key={payment.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 gap-3">
                              <span className="text-sm text-slate-600 break-words">{parsed ? format(parsed, 'd MMM yyyy', { locale: pl }) : '-'}</span>
                              <span className="font-semibold text-slate-900 shrink-0">{payment.amount.toLocaleString()} PLN</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realization" className="pt-6 space-y-6">
                {associatedCase ? (
                  <Card className="border-none shadow-sm border-l-4 border-l-emerald-500">
                    <CardContent className="p-6 flex items-center justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900">Sprawa aktywna</h4>
                        <p className="text-sm text-slate-500 break-words">Realizacja projektu jest w toku.</p>
                      </div>
                      <Button className="rounded-xl gap-2" asChild>
                        <Link to={`/case/${associatedCase.id}`}>
                          Przejdź do sprawy <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Brak aktywnej sprawy</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">
                      Podepnij istniejącą sprawę do leada albo utwórz ją w procesie operacyjnym.
                    </p>
                  </div>
                )}

                {availableCasesToLink.length > 0 && !associatedCase ? (
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-slate-400" />
                        Podepnij istniejącą sprawę
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-500">Tu przypniesz sprawę do leada. Po podpięciu będzie widoczna zarówno tutaj, jak i w module Sprawy.</p>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                        <Select value={linkCaseId} onValueChange={setLinkCaseId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz sprawę" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCasesToLink.map((caseRecord: any) => (
                              <SelectItem key={caseRecord.id} value={String(caseRecord.id)}>
                                {caseRecord.title || 'Sprawa bez tytułu'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => void handleLinkExistingCase()} disabled={!linkCaseId || linkingCase}>
                          <Briefcase className="w-4 h-4 mr-2" />
                          {linkingCase ? 'Podpinanie...' : 'Podepnij sprawę'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Historia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <Textarea
                    placeholder="Dodaj notatkę z rozmowy..."
                    className="rounded-xl bg-slate-50 border-none resize-none min-h-[100px]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <Button type="submit" className="w-full rounded-xl" disabled={!note.trim()}>
                    Dodaj notatkę
                  </Button>
                </form>
                <div className="space-y-2 max-h-[500px] overflow-auto pr-2">
                  {activities.length === 0 ? (
                    <p className="text-sm text-slate-500">Brak aktywności.</p>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="rounded-xl border border-slate-200 p-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {activity.eventType === 'status_changed'
                            ? `Status: ${STATUS_OPTIONS.find((status) => status.value === activity.payload?.status)?.label || activity.payload?.status}`
                            : activity.eventType === 'note_added'
                              ? 'Notatka'
                              : activity.eventType === 'case_linked'
                                ? 'Podpięto sprawę'
                                : 'Aktywność'}
                        </p>
                        {activity.payload?.content && <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-words">{activity.payload.content}</p>}
                        {activity.payload?.caseId && !activity.payload?.content ? (
                          <p className="text-xs text-slate-500 mt-1 break-all">Sprawa ID: {String(activity.payload.caseId)}</p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj leada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nazwa</Label>
              <Input value={editLead?.name || ''} onChange={(e) => setEditLead({ ...editLead, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Firma</Label>
              <Input value={editLead?.company || ''} onChange={(e) => setEditLead({ ...editLead, company: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editLead?.email || ''} onChange={(e) => setEditLead({ ...editLead, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={editLead?.phone || ''} onChange={(e) => setEditLead({ ...editLead, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wartość</Label>
                <Input type="number" value={editLead?.dealValue || ''} onChange={(e) => setEditLead({ ...editLead, dealValue: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Źródło</Label>
                <Select value={editLead?.source || 'other'} onValueChange={(value) => setEditLead({ ...editLead, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Anuluj
            </Button>
            <Button onClick={() => void handleUpdateLead()}>Zapisz zmiany</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
