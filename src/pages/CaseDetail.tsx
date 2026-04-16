import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  History,
  Link2,
  Loader2,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Plus,
  Send,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { auth, db } from '../firebase';
import { generatePortalToken, sha256Hex } from '../lib/security';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  clientId?: string;
  clientEmail?: string;
  clientPhone?: string;
  company?: string;
  portalReady?: boolean;
  status?: string;
  completenessPercent?: number;
  leadId?: string;
  updatedAt?: { toDate?: () => Date } | null;
};

type CaseItemRecord = {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  isRequired?: boolean;
  status?: 'missing' | 'uploaded' | 'accepted' | 'rejected';
  dueDate?: string;
};

type ActivityRecord = {
  id: string;
  eventType?: string;
  payload?: Record<string, any>;
  createdAt?: { toDate?: () => Date } | null;
};

type LeadSummary = {
  id: string;
  name?: string;
  status?: string;
  nextStep?: string;
  nextActionAt?: string;
};

const ITEM_FILTERS = [
  { value: 'all', label: 'Wszystko' },
  { value: 'missing', label: 'Braki' },
  { value: 'uploaded', label: 'Do akceptacji' },
  { value: 'accepted', label: 'Zaakceptowane' },
  { value: 'rejected', label: 'Odrzucone' },
] as const;

type ItemFilter = (typeof ITEM_FILTERS)[number]['value'];

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

function caseStatusVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'blocked') return 'destructive';
  if (status === 'ready_to_start' || status === 'completed') return 'secondary';
  return 'outline';
}

function itemStatusLabel(status?: string) {
  switch (status) {
    case 'uploaded':
      return 'Wysłane / do akceptacji';
    case 'accepted':
      return 'Zaakceptowane';
    case 'rejected':
      return 'Odrzucone';
    default:
      return 'Brak';
  }
}

function itemStatusVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'accepted') return 'secondary';
  if (status === 'rejected') return 'destructive';
  if (status === 'uploaded') return 'default';
  return 'outline';
}

function activityLabel(eventType?: string, payload?: Record<string, any>) {
  switch (eventType) {
    case 'item_added':
      return 'Dodano element checklisty';
    case 'status_changed':
      return 'Zmieniono status elementu';
    case 'portal_reminder_sent':
      return 'Wysłano przypomnienie';
    default:
      return payload?.title || 'Aktywność';
  }
}

function activityDescription(payload?: Record<string, any>) {
  if (!payload) return '';
  if (payload.title && payload.status) {
    return `${payload.title} → ${itemStatusLabel(payload.status)}`;
  }
  if (payload.title) return payload.title;
  return '';
}

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [items, setItems] = useState<CaseItemRecord[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [linkedLead, setLinkedLead] = useState<LeadSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [itemFilter, setItemFilter] = useState<ItemFilter>('all');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'file',
    isRequired: true,
    dueDate: '',
  });

  useEffect(() => {
    if (!caseId) return;

    const caseRef = doc(db, 'cases', caseId);
    const unsubscribeCase = onSnapshot(caseRef, async (snapshot) => {
      if (!snapshot.exists()) {
        toast.error('Sprawa nie istnieje');
        navigate('/cases');
        return;
      }

      const data = { id: snapshot.id, ...(snapshot.data() as Omit<CaseRecord, 'id'>) };
      setCaseData(data);

      if (data.leadId) {
        const leadSnapshot = await getDoc(doc(db, 'leads', data.leadId));
        if (leadSnapshot.exists()) {
          setLinkedLead({ id: leadSnapshot.id, ...(leadSnapshot.data() as Omit<LeadSummary, 'id'>) });
        } else {
          setLinkedLead(null);
        }
      } else {
        setLinkedLead(null);
      }
    });

    const itemsRef = collection(db, 'cases', caseId, 'items');
    const qItems = query(itemsRef, orderBy('order', 'asc'));
    const unsubscribeItems = onSnapshot(qItems, async (snapshot) => {
      const itemsData = snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<CaseItemRecord, 'id'>) }));
      setItems(itemsData);
      setLoading(false);

      if (itemsData.length > 0) {
        const accepted = itemsData.filter((item) => item.status === 'accepted').length;
        const percent = (accepted / itemsData.length) * 100;
        const hasBlocked = itemsData.some((item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'));
        const hasToApprove = itemsData.some((item) => item.status === 'uploaded');
        const allAccepted = itemsData.every((item) => item.status === 'accepted');

        let newStatus = 'in_progress';
        if (allAccepted) {
          newStatus = 'completed';
        } else if (hasBlocked) {
          newStatus = 'blocked';
        } else if (hasToApprove) {
          newStatus = 'to_approve';
        } else {
          newStatus = 'waiting_on_client';
        }

        await updateDoc(caseRef, {
          completenessPercent: percent,
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
      }
    });

    const activitiesRef = collection(db, 'activities');
    const qActivities = query(
      activitiesRef,
      where('caseId', '==', caseId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeActivities = onSnapshot(qActivities, (snapshot) => {
      setActivities(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ActivityRecord, 'id'>) })));
    });

    return () => {
      unsubscribeCase();
      unsubscribeItems();
      unsubscribeActivities();
    };
  }, [caseId, navigate]);

  const filteredItems = useMemo(() => {
    if (itemFilter === 'all') return items;
    return items.filter((item) => item.status === itemFilter);
  }, [itemFilter, items]);

  const metrics = useMemo(() => {
    const required = items.filter((item) => item.isRequired !== false);
    return {
      total: items.length,
      requiredMissing: required.filter((item) => item.status === 'missing' || item.status === 'rejected').length,
      toApprove: items.filter((item) => item.status === 'uploaded').length,
      accepted: items.filter((item) => item.status === 'accepted').length,
    };
  }, [items]);

  async function logActivity(eventType: string, payload: Record<string, any>) {
    await addDoc(collection(db, 'activities'), {
      caseId,
      ownerId: auth.currentUser?.uid,
      actorId: auth.currentUser?.uid,
      actorType: 'operator',
      eventType,
      payload,
      createdAt: serverTimestamp(),
    });
  }

  async function handleAddItem() {
    if (!newItem.title.trim()) return;

    try {
      await addDoc(collection(db, 'cases', caseId!, 'items'), {
        ...newItem,
        caseId,
        status: 'missing',
        order: items.length,
        createdAt: serverTimestamp(),
      });
      await logActivity('item_added', { title: newItem.title.trim() });
      setIsAddItemOpen(false);
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      toast.success('Element dodany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  }

  async function handleUpdateItemStatus(itemId: string, status: string, title: string) {
    try {
      await updateDoc(doc(db, 'cases', caseId!, 'items', itemId), {
        status,
        approvedAt: status === 'accepted' ? serverTimestamp() : null,
      });
      await logActivity('status_changed', { title, status });
      toast.success('Status zaktualizowany');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  }

  async function handleDeleteItem(itemId: string) {
    try {
      await deleteDoc(doc(db, 'cases', caseId!, 'items', itemId));
      toast.success('Element usunięty');
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  }

  async function generatePortalLink() {
    const token = generatePortalToken();
    const tokenHash = await sha256Hex(token);
    const tokenRef = doc(db, 'client_portal_tokens', tokenHash);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await setDoc(tokenRef, {
      caseId,
      tokenHash,
      createdBy: auth.currentUser?.uid,
      expiresAt,
      revokedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'cases', caseId!), {
      portalReady: true,
      portalTokenHash: tokenHash,
      portalExpiresAt: expiresAt,
      portalGeneratedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (caseData?.clientId) {
      await setDoc(doc(db, 'clients', caseData.clientId), {
        portalReady: true,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    const url = `${window.location.origin}/portal/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link do panelu skopiowany');
  }

  async function sendReminderPlaceholder() {
    await logActivity('portal_reminder_sent', { title: 'Operator wysłał przypomnienie do klienta.' });
    toast.success('Przypomnienie zapisane w historii sprawy');
  }

  if (loading || !caseData) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[color:var(--app-primary)]" />
        </div>
      </Layout>
    );
  }

  const completeness = Math.round(caseData.completenessPercent || 0);
  const updatedAt = caseData.updatedAt?.toDate ? caseData.updatedAt.toDate() : null;

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link to="/cases">
              <Button variant="outline" size="icon" className="rounded-2xl">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold app-text md:text-3xl">{caseData.title || 'Sprawa bez tytułu'}</h1>
                <Badge variant={caseStatusVariant(caseData.status)}>{caseStatusLabel(caseData.status)}</Badge>
                {metrics.requiredMissing > 0 ? <Badge variant="destructive">Blokery</Badge> : null}
              </div>
              <p className="mt-1 text-sm app-muted">
                Tu pilnujesz wejścia klienta w realizację: braków, akceptacji, blokad i gotowości do startu.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm app-muted">
                <span>Klient: {caseData.clientName || 'Brak nazwy klienta'}</span>
                <span>Ostatni ruch: {updatedAt ? format(updatedAt, 'd MMMM yyyy', { locale: pl }) : 'Brak'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-2xl">
                  <Plus className="h-4 w-4" /> Dodaj element
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dodaj element checklisty</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Tytuł</Label>
                    <Input value={newItem.title} onChange={(event) => setNewItem((prev) => ({ ...prev, title: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Opis</Label>
                    <Textarea value={newItem.description} onChange={(event) => setNewItem((prev) => ({ ...prev, description: event.target.value }))} rows={3} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <Input value={newItem.type} onChange={(event) => setNewItem((prev) => ({ ...prev, type: event.target.value }))} placeholder="file / approval / decision" />
                    </div>
                    <div className="space-y-2">
                      <Label>Termin</Label>
                      <Input type="date" value={newItem.dueDate} onChange={(event) => setNewItem((prev) => ({ ...prev, dueDate: event.target.value }))} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddItem} className="rounded-2xl">Dodaj</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="rounded-2xl" onClick={generatePortalLink}>
              <Copy className="h-4 w-4" /> Link portalu
            </Button>
            <Button className="rounded-2xl" onClick={sendReminderPlaceholder}>
              <Send className="h-4 w-4" /> Zapisz przypomnienie
            </Button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Kompletność</p>
                <p className="mt-2 text-2xl font-bold app-text">{completeness}%</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><CheckCircle2 className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Braki wymagane</p>
                <p className="mt-2 text-2xl font-bold text-rose-500">{metrics.requiredMissing}</p>
              </div>
              <div className="rounded-2xl bg-rose-500/12 p-3 text-rose-500"><ShieldAlert className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Do akceptacji</p>
                <p className="mt-2 text-2xl font-bold text-amber-500">{metrics.toApprove}</p>
              </div>
              <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-500"><AlertCircle className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Źródło</p>
                <p className="mt-2 text-2xl font-bold app-text">{linkedLead ? 'Lead' : 'Ręczne'}</p>
              </div>
              <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-500"><Link2 className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Postęp i logika blokad</CardTitle>
                <CardDescription>
                  To jest główna warstwa operacyjna po wygraniu leada. Widzisz, czego brakuje i co blokuje start.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] app-muted">
                    <span>Kompletność sprawy</span>
                    <span>{completeness}%</span>
                  </div>
                  <Progress value={completeness} className="h-2" />
                  <p className="mt-3 text-sm app-muted">
                    {caseData.status === 'blocked'
                      ? 'Wymagane elementy wciąż blokują start realizacji.'
                      : caseData.status === 'to_approve'
                        ? 'Klient dostarczył materiały, ale część nadal wymaga decyzji lub zatwierdzenia.'
                        : caseData.status === 'completed'
                          ? 'Sprawa jest domknięta i kompletna.'
                          : 'Sprawa jest w ruchu i warto pilnować rytmu dosyłania materiałów.'}
                  </p>
                </div>

                <Tabs value={itemFilter} onValueChange={(value) => setItemFilter(value as ItemFilter)}>
                  <TabsList className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
                    {ITEM_FILTERS.map((item) => (
                      <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value={itemFilter} className="mt-4 space-y-3">
                    {filteredItems.length > 0 ? filteredItems.map((item) => (
                      <Card key={item.id} className="border-none app-surface">
                        <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold app-text">{item.title || 'Element bez nazwy'}</p>
                              <Badge variant={itemStatusVariant(item.status)}>{itemStatusLabel(item.status)}</Badge>
                              {item.isRequired !== false ? <Badge variant="outline">Wymagane</Badge> : null}
                            </div>
                            {item.description ? <p className="text-sm app-muted">{item.description}</p> : null}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs app-muted">
                              <span>Typ: {item.type || 'file'}</span>
                              <span>Termin: {item.dueDate || 'Brak'}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 lg:justify-end">
                            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleUpdateItemStatus(item.id, 'uploaded', item.title || 'Element')}>
                              <Paperclip className="h-4 w-4" /> Otrzymane
                            </Button>
                            <Button variant="secondary" size="sm" className="rounded-xl" onClick={() => handleUpdateItemStatus(item.id, 'accepted', item.title || 'Element')}>
                              <Check className="h-4 w-4" /> Akceptuj
                            </Button>
                            <Button variant="destructive" size="sm" className="rounded-xl" onClick={() => handleUpdateItemStatus(item.id, 'rejected', item.title || 'Element')}>
                              <X className="h-4 w-4" /> Odrzuć
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-rose-500" onClick={() => handleDeleteItem(item.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Usuń
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <Card className="border-dashed app-surface">
                        <CardContent className="p-8 text-center">
                          <FileText className="mx-auto mb-3 h-8 w-8 app-muted" />
                          <p className="font-medium app-text">Brak elementów w tym widoku</p>
                          <p className="mt-1 text-sm app-muted">Dodaj nowy element albo przełącz filtr, żeby zobaczyć inne rekordy.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Historia sprawy</CardTitle>
                <CardDescription>
                  Tu zapisują się najważniejsze ruchy operatora związane z checklistą, statusem i przypomnieniami.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[380px] pr-4">
                  <div className="relative space-y-4 before:absolute before:left-[0.65rem] before:top-2 before:bottom-2 before:w-px before:bg-[var(--app-border)]">
                    {activities.length > 0 ? activities.map((activity) => (
                      <div key={activity.id} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-4 border-[var(--app-surface-elevated)] bg-[color:var(--app-primary)]" />
                        <div className="rounded-2xl border p-4 app-border app-surface">
                          <p className="font-semibold app-text">{activityLabel(activity.eventType, activity.payload)}</p>
                          {activityDescription(activity.payload) ? <p className="mt-1 text-sm app-muted">{activityDescription(activity.payload)}</p> : null}
                          <p className="mt-3 text-[11px] font-medium app-muted">
                            {activity.createdAt?.toDate ? format(activity.createdAt.toDate(), 'd MMMM yyyy, HH:mm', { locale: pl }) : 'Teraz'}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <Card className="border-dashed app-surface">
                        <CardContent className="p-8 text-center">
                          <History className="mx-auto mb-3 h-8 w-8 app-muted" />
                          <p className="font-medium app-text">Historia sprawy jest jeszcze pusta.</p>
                          <p className="mt-1 text-sm app-muted">Dodaj element, zmień status albo zapisz przypomnienie, a oś zacznie się wypełniać.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            {linkedLead ? (
              <Card className="border-none app-surface-strong">
                <CardHeader>
                  <CardTitle className="text-xl">Handoff z leada</CardTitle>
                  <CardDescription>
                    Ta sprawa przyszła z warstwy sprzedażowej. Możesz wrócić do rekordu źródłowego i sprawdzić kontekst.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border p-4 app-border app-surface">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Lead źródłowy</p>
                    <p className="mt-1 font-semibold app-text">{linkedLead.name || 'Lead bez nazwy'}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm app-muted">
                      <span>Status: {linkedLead.status || 'Brak'}</span>
                      <span>Kolejny krok: {linkedLead.nextStep || 'Brak'}</span>
                    </div>
                    <Button variant="outline" className="mt-3 rounded-2xl" asChild>
                      <Link to={`/leads/${linkedLead.id}`}>
                        Otwórz leada <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-none app-surface-strong">
              <CardHeader>
                <CardTitle className="text-xl">Panel operatora</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Co zrobić teraz</p>
                  <p className="mt-1 text-sm app-text">
                    {metrics.requiredMissing > 0
                      ? 'Najpierw odblokuj brakujące lub odrzucone elementy.'
                      : metrics.toApprove > 0
                        ? 'Następnie przejdź przez rzeczy oczekujące na akceptację.'
                        : 'Sprawa wygląda czysto. Możesz przejść do dalszej realizacji albo wysłać portal klientowi.'}
                  </p>
                </div>
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Portal klienta</p>
                  <p className="mt-1 text-sm app-muted">Link generowany jest lokalnie i trafia od razu do schowka, żeby łatwo wysłać go dalej.</p>
                  <Button variant="outline" className="mt-3 rounded-2xl" onClick={generatePortalLink}>
                    <Copy className="h-4 w-4" /> Kopiuj link portalu
                  </Button>
                </div>
                <div className="rounded-2xl border p-4 app-border app-surface">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Notatka operacyjna</p>
                  <p className="mt-1 text-sm app-muted">Najważniejsze: po wygraniu leada nie gubisz kontekstu, bo sprawa ma połączenie z rekordem sprzedażowym.</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
