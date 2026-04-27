import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  History,
  ListChecks,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Plus,
  Send,
  ShieldAlert,
  StickyNote,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import Layout from '../components/Layout';
import '../styles/closeflow-case-detail-focus.css';

type CaseItemStatus = 'missing' | 'uploaded' | 'accepted' | 'rejected' | string;

type CaseItem = {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  status?: CaseItemStatus;
  isRequired?: boolean;
  dueDate?: string;
  fileUrl?: string;
  fileName?: string;
  response?: string;
};

type CaseActivity = {
  id: string;
  actorType?: string;
  eventType?: string;
  payload?: Record<string, any>;
  createdAt?: any;
};

type NewCaseItemState = {
  title: string;
  description: string;
  type: string;
  isRequired: boolean;
  dueDate: string;
};

const CASE_STATUS_LABELS: Record<string, string> = {
  new: 'Nowa',
  waiting_on_client: 'Czeka na klienta',
  in_progress: 'W realizacji',
  to_approve: 'Do sprawdzenia',
  blocked: 'Zablokowana',
  completed: 'ZakoĹ„czona',
};

const CASE_STATUS_HINTS: Record<string, string> = {
  new: 'Sprawa zostaĹ‚a utworzona. Dodaj pierwsze braki albo zaplanuj pierwszÄ… akcjÄ™.',
  waiting_on_client: 'Czekamy na klienta. Najpierw zdejmij braki po jego stronie.',
  in_progress: 'Sprawa jest w pracy. Pilnuj najbliĹĽszej akcji i terminĂłw.',
  to_approve: 'Klient coĹ› przesĹ‚aĹ‚. SprawdĹş i zaakceptuj albo odrzuÄ‡.',
  blocked: 'Sprawa stoi. UsuĹ„ blokery zanim przejdziesz dalej.',
  completed: 'Sprawa zakoĹ„czona. Historia zostaje jako Ĺ›lad pracy.',
};

const ITEM_STATUS_LABELS: Record<string, string> = {
  missing: 'Czeka',
  uploaded: 'Do sprawdzenia',
  accepted: 'Gotowe',
  rejected: 'Bloker',
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  file: 'Plik',
  decision: 'Decyzja',
  text: 'Tekst',
  access: 'DostÄ™py',
};

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === 'function') {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function formatDateTime(value: any, fallback = 'Brak daty') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(value: any, fallback = 'Bez terminu') {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getCaseStatusLabel(status?: string) {
  if (!status) return 'Bez statusu';
  return CASE_STATUS_LABELS[status] || status;
}

function getCaseStatusHint(status?: string) {
  if (!status) return 'Ustal status sprawy i najbliĹĽszy ruch.';
  return CASE_STATUS_HINTS[status] || 'SprawdĹş najbliĹĽsze dziaĹ‚ania i blokery.';
}

function getItemStatusLabel(status?: string) {
  if (!status) return 'Czeka';
  return ITEM_STATUS_LABELS[status] || status;
}

function getItemTypeLabel(type?: string) {
  if (!type) return 'Element';
  return ITEM_TYPE_LABELS[type] || type;
}

function getItemStatusClass(status?: string) {
  if (status === 'accepted') return 'cf-status-ok';
  if (status === 'uploaded') return 'cf-status-info';
  if (status === 'rejected') return 'cf-status-danger';
  return 'cf-status-warning';
}

function getStatusBadgeClass(status?: string) {
  if (status === 'completed') return 'cf-status-ok';
  if (status === 'in_progress') return 'cf-status-info';
  if (status === 'blocked') return 'cf-status-danger';
  if (status === 'to_approve' || status === 'waiting_on_client') return 'cf-status-warning';
  return 'cf-status-neutral';
}

function getActivityText(activity: CaseActivity) {
  const actor = activity.actorType === 'operator' ? 'Ty' : 'Klient';
  const title = activity.payload?.title || activity.payload?.itemTitle || 'element';

  if (activity.eventType === 'item_added') return `${actor} dodaĹ‚ element: ${title}`;
  if (activity.eventType === 'status_changed') {
    return `${actor} zmieniĹ‚ status â€ž${title}â€ť na: ${getItemStatusLabel(activity.payload?.status)}`;
  }
  if (activity.eventType === 'file_uploaded') return `${actor} wgraĹ‚ plik do: ${title}`;
  if (activity.eventType === 'decision_made') return `${actor} podjÄ…Ĺ‚ decyzjÄ™ w: ${title}`;
  if (activity.eventType === 'operator_note') return `${actor} dodaĹ‚ notatkÄ™`;
  return `${actor} wykonaĹ‚ akcjÄ™`;
}

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);
  const [items, setItems] = useState<CaseItem[]>([]);
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newItem, setNewItem] = useState<NewCaseItemState>({
    title: '',
    description: '',
    type: 'file',
    isRequired: true,
    dueDate: '',
  });

  useEffect(() => {
    if (!caseId) {
      setLoadError('Brak identyfikatora sprawy w adresie.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);

    const caseRef = doc(db, 'cases', caseId);
    const unsubscribeCase = onSnapshot(
      caseRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setCaseData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setLoadError('Nie znaleziono tej sprawy w bazie.');
          setLoading(false);
        }
      },
      (error) => {
        console.error('CaseDetail Firestore case listener failed', error);
        setLoadError(
          'Nie mogÄ™ wczytaÄ‡ tej sprawy z bazy danych. Firestore zgĹ‚asza problem z konfiguracjÄ… projektu albo bazÄ… (default).'
        );
        setLoading(false);
      }
    );

    const itemsRef = collection(db, 'cases', caseId, 'items');
    const qItems = query(itemsRef, orderBy('order', 'asc'));
    const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
      const itemsData = snapshot.docs.map((itemDoc) => ({ id: itemDoc.id, ...itemDoc.data() } as CaseItem));
      setItems(itemsData);
      setLoading(false);

      if (itemsData.length > 0) {
        const completed = itemsData.filter((item) => item.status === 'accepted').length;
        const percent = (completed / itemsData.length) * 100;

        let newStatus = 'in_progress';
        const hasBlocked = itemsData.some(
          (item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'),
        );
        const hasToApprove = itemsData.some((item) => item.status === 'uploaded');
        const allAccepted = itemsData.every((item) => item.status === 'accepted');

        if (allAccepted) {
          newStatus = 'completed';
        } else if (hasBlocked) {
          newStatus = 'blocked';
        } else if (hasToApprove) {
          newStatus = 'to_approve';
        } else {
          newStatus = 'waiting_on_client';
        }

        updateDoc(caseRef, {
          completenessPercent: percent,
          status: newStatus,
          updatedAt: serverTimestamp(),
        }).catch((error) => {
          console.error('CaseDetail status sync failed', error);
        });
      }
    }, (error) => {
      console.error('CaseDetail Firestore items listener failed', error);
      setItems([]);
      setLoading(false);
    });

    const activitiesRef = collection(db, 'activities');
    const qActivities = query(activitiesRef, where('caseId', '==', caseId), orderBy('createdAt', 'desc'));
    const unsubscribeActivities = onSnapshot(
      qActivities,
      (snapshot) => {
        setActivities(snapshot.docs.map((activityDoc) => ({ id: activityDoc.id, ...activityDoc.data() })) as CaseActivity[]);
      },
      (error) => {
        console.error('CaseDetail Firestore activities listener failed', error);
        setActivities([]);
      }
    );

    return () => {
      unsubscribeCase();
      unsubscribeItems();
      unsubscribeActivities();
    };
  }, [caseId, navigate]);

  const completionPercent = useMemo(() => {
    if (typeof caseData?.completenessPercent === 'number') {
      return Math.round(caseData.completenessPercent);
    }

    if (items.length === 0) return 0;
    const accepted = items.filter((item) => item.status === 'accepted').length;
    return Math.round((accepted / items.length) * 100);
  }, [caseData?.completenessPercent, items]);

  const caseStats = useMemo(() => {
    const accepted = items.filter((item) => item.status === 'accepted');
    const uploaded = items.filter((item) => item.status === 'uploaded');
    const missing = items.filter((item) => item.status === 'missing');
    const rejected = items.filter((item) => item.status === 'rejected');
    const requiredBlockers = items.filter(
      (item) => item.isRequired && (item.status === 'missing' || item.status === 'rejected'),
    );
    const openItems = items.filter((item) => item.status !== 'accepted');

    const dueItems = openItems
      .filter((item) => item.dueDate)
      .sort((first, second) => {
        const firstDate = toDate(first.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
        const secondDate = toDate(second.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
        return firstDate - secondDate;
      });

    const mainBlocker = rejected[0] || requiredBlockers[0] || uploaded[0] || missing[0] || openItems[0] || null;
    const nextActionItem = dueItems[0] || mainBlocker;

    return {
      accepted,
      uploaded,
      missing,
      rejected,
      requiredBlockers,
      openItems,
      mainBlocker,
      nextActionItem,
    };
  }, [items]);

  const handleAddItem = async () => {
    if (!caseId || !newItem.title.trim()) {
      toast.error('Podaj nazwÄ™ elementu');
      return;
    }

    try {
      await addDoc(collection(db, 'cases', caseId, 'items'), {
        ...newItem,
        title: newItem.title.trim(),
        description: newItem.description.trim(),
        caseId,
        status: 'missing',
        order: items.length,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'activities'), {
        caseId,
        ownerId: auth.currentUser?.uid,
        actorId: auth.currentUser?.uid,
        actorType: 'operator',
        eventType: 'item_added',
        payload: { title: newItem.title.trim() },
        createdAt: serverTimestamp(),
      });

      setIsAddItemOpen(false);
      setNewItem({ title: '', description: '', type: 'file', isRequired: true, dueDate: '' });
      toast.success('Element dodany');
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const handleAddNote = async () => {
    if (!caseId || !newNote.trim()) {
      toast.error('Wpisz treĹ›Ä‡ notatki');
      return;
    }

    try {
      await addDoc(collection(db, 'activities'), {
        caseId,
        ownerId: auth.currentUser?.uid,
        actorId: auth.currentUser?.uid,
        actorType: 'operator',
        eventType: 'operator_note',
        payload: { note: newNote.trim() },
        createdAt: serverTimestamp(),
      });

      setIsAddNoteOpen(false);
      setNewNote('');
      toast.success('Notatka dodana');
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const handleUpdateItemStatus = async (itemId: string, status: string, title: string) => {
    if (!caseId) return;

    try {
      await updateDoc(doc(db, 'cases', caseId, 'items', itemId), {
        status,
        approvedAt: status === 'accepted' ? serverTimestamp() : null,
      });

      await addDoc(collection(db, 'activities'), {
        caseId,
        ownerId: auth.currentUser?.uid,
        actorId: auth.currentUser?.uid,
        actorType: 'operator',
        eventType: 'status_changed',
        payload: { title, status },
        createdAt: serverTimestamp(),
      });

      toast.success('Status zaktualizowany');
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!caseId) return;

    try {
      await deleteDoc(doc(db, 'cases', caseId, 'items', itemId));
      toast.success('Element usuniÄ™ty');
    } catch (error: any) {
      toast.error('BĹ‚Ä…d: ' + error.message);
    }
  };

  const generatePortalLink = async () => {
    if (!caseId) return;

    try {
      const token = Math.random().toString(36).substring(2, 15);
      const tokenRef = doc(db, 'client_portal_tokens', caseId);
      await setDoc(tokenRef, {
        caseId,
        token,
        createdAt: serverTimestamp(),
      });

      const url = `${window.location.origin}/portal/${caseId}/${token}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link do panelu klienta skopiowany');
    } catch (error: any) {
      toast.error('Nie udaĹ‚o siÄ™ skopiowaÄ‡ linku: ' + error.message);
    }
  };

  const handleReminderCopy = () => {
    toast.info('Na teraz bez faĹ‚szywej wysyĹ‚ki maila. UĹĽyj linku do portalu albo dodaj brak na checklistÄ™.');
  };

  const handleNotReadyYet = (label: string) => {
    toast.info(`${label} bÄ™dzie osobnym etapem. Ten patch porzÄ…dkuje widok sprawy i checklistÄ™.`);
  };

  if (loadError) {
    return (
      <Layout>
        <div className="cf-case-page">
          <main className="cf-case-main">
            <Card className="cf-panel-card">
              <CardContent className="cf-empty-box cf-empty-box-large">
                <AlertCircle className="w-12 h-12" />
                <strong>Nie mogÄ™ otworzyÄ‡ tej sprawy</strong>
                <span>{loadError}</span>
                <div className="cf-command-actions">
                  <Button variant="outline" onClick={() => navigate('/cases')}>
                    WrĂłÄ‡ do spraw
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    SprĂłbuj ponownie
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="cf-case-page">
          <main className="cf-case-main">
            <Card className="cf-panel-card">
              <CardContent className="cf-empty-box cf-empty-box-large">
                <Clock className="w-12 h-12" />
                <strong>ĹadujÄ™ sprawÄ™</strong>
                <span>Pobieram dane sprawy, checklisty i historiÄ™.</span>
              </CardContent>
            </Card>
          </main>
        </div>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout>
        <div className="cf-case-page">
          <main className="cf-case-main">
            <Card className="cf-panel-card">
              <CardContent className="cf-empty-box cf-empty-box-large">
                <AlertCircle className="w-12 h-12" />
                <strong>Brak danych sprawy</strong>
                <span>Nie znaleziono danych do pokazania dla tej sprawy.</span>
                <Button variant="outline" onClick={() => navigate('/cases')}>
                  WrĂłÄ‡ do spraw
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </Layout>
    );
  }

  const mainBlocker = caseStats.mainBlocker;
  const nextActionItem = caseStats.nextActionItem;
  const isCompleted = caseData.status === 'completed';
  const hasBlockers = caseStats.requiredBlockers.length > 0 || caseStats.rejected.length > 0;

  return (
    <Layout>
      <div className="cf-case-page">
        <header className="cf-case-topbar">
          <div className="cf-case-topbar-inner">
            <div className="cf-case-title-row">
              <Link to="/cases" className="cf-icon-link" aria-label="WrĂłÄ‡ do spraw">
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div className="cf-case-heading">
                <div className="cf-breadcrumbs">
                  <span>Sprawy</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="cf-breadcrumb-current">ObsĹ‚uga sprawy</span>
                </div>
                <h1>{caseData.title}</h1>
                <div className="cf-case-meta">
                  <Badge className={`cf-status-badge ${getStatusBadgeClass(caseData.status)}`}>
                    {getCaseStatusLabel(caseData.status)}
                  </Badge>
                  <span>Klient: {caseData.clientName || 'Brak danych'}</span>
                  <span>Ostatnia zmiana: {formatDateTime(caseData.updatedAt, 'Brak danych')}</span>
                </div>
              </div>
            </div>

            <div className="cf-case-header-actions">
              <Button variant="outline" size="sm" className="gap-2" onClick={generatePortalLink}>
                <Copy className="w-4 h-4" />
                Kopiuj portal
              </Button>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Dodaj brak
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj wymagany element</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nazwa elementu</Label>
                      <Input
                        placeholder="np. Zgoda na publikacjÄ™"
                        value={newItem.title}
                        onChange={(event) => setNewItem({ ...newItem, title: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Opis / instrukcja</Label>
                      <Textarea
                        placeholder="Napisz krĂłtko, czego brakuje i co klient ma zrobiÄ‡."
                        value={newItem.description}
                        onChange={(event) => setNewItem({ ...newItem, description: event.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Typ</Label>
                        <select
                          className="cf-native-select"
                          value={newItem.type}
                          onChange={(event) => setNewItem({ ...newItem, type: event.target.value })}
                        >
                          <option value="file">Plik</option>
                          <option value="decision">Decyzja</option>
                          <option value="text">Tekst / odpowiedĹş</option>
                          <option value="access">DostÄ™py / hasĹ‚a</option>
                        </select>
                      </div>
                      <div className="cf-checkbox-line">
                        <input
                          type="checkbox"
                          id="required"
                          checked={newItem.isRequired}
                          onChange={(event) => setNewItem({ ...newItem, isRequired: event.target.checked })}
                        />
                        <Label htmlFor="required">ObowiÄ…zkowy</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Termin opcjonalnie</Label>
                      <Input
                        type="date"
                        value={newItem.dueDate}
                        onChange={(event) => setNewItem({ ...newItem, dueDate: event.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                      Anuluj
                    </Button>
                    <Button onClick={handleAddItem}>Dodaj element</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="cf-case-main">
          <section className="cf-command-grid" aria-label="NajwaĹĽniejsze informacje o sprawie">
            <Card className="cf-command-card cf-command-card-primary">
              <CardContent className="cf-command-content">
                <div className="cf-command-eyebrow">
                  <ShieldAlert className="w-4 h-4" />
                  Co teraz blokuje?
                </div>
                <h2>
                  {isCompleted
                    ? 'Sprawa jest zakoĹ„czona'
                    : mainBlocker
                      ? mainBlocker.title || 'Brak wymagany do obsĹ‚ugi'
                      : hasBlockers
                        ? 'SÄ… blokery do zdjÄ™cia'
                        : 'Brak krytycznych blokerĂłw'}
                </h2>
                <p>
                  {isCompleted
                    ? 'Nie ma aktywnej pracy operacyjnej. Historia zostaje do wglÄ…du.'
                    : mainBlocker?.description || getCaseStatusHint(caseData.status)}
                </p>
                <div className="cf-command-actions">
                  {mainBlocker ? (
                    <Button variant="secondary" size="sm" onClick={() => handleReminderCopy()}>
                      <Send className="w-4 h-4" />
                      Przygotuj przypomnienie
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleNotReadyYet('Oznaczenie gotowoĹ›ci')}>
                      <CheckCircle2 className="w-4 h-4" />
                      Oznacz jako gotowe
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="cf-command-card">
              <CardContent className="cf-command-content">
                <div className="cf-command-eyebrow">
                  <CalendarClock className="w-4 h-4" />
                  NajbliĹĽsza akcja
                </div>
                <h2>{nextActionItem ? nextActionItem.title || 'SprawdĹş element sprawy' : 'Brak zaplanowanej akcji'}</h2>
                <p>
                  {nextActionItem?.dueDate
                    ? `Termin: ${formatDate(nextActionItem.dueDate)}`
                    : nextActionItem
                      ? 'Ten element wymaga reakcji, ale nie ma terminu.'
                      : 'Dodaj zadanie, wydarzenie albo brak, ĹĽeby sprawa nie wisiaĹ‚a w powietrzu.'}
                </p>
                <div className="cf-command-actions">
                  {nextActionItem ? (
                    <Badge className={`cf-status-badge ${getItemStatusClass(nextActionItem.status)}`}>
                      {getItemStatusLabel(nextActionItem.status)}
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsAddItemOpen(true)}>
                      <Plus className="w-4 h-4" />
                      Dodaj pierwszy ruch
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="cf-command-card">
              <CardContent className="cf-command-content">
                <div className="cf-command-eyebrow">
                  <ListChecks className="w-4 h-4" />
                  PostÄ™p sprawy
                </div>
                <div className="cf-progress-head">
                  <h2>{completionPercent}% gotowe</h2>
                  <span>{caseStats.accepted.length}/{items.length || 0}</span>
                </div>
                <Progress value={completionPercent} className="cf-progress-bar" />
                <div className="cf-mini-stats">
                  <span>{caseStats.requiredBlockers.length} blokerĂłw</span>
                  <span>{caseStats.uploaded.length} do sprawdzenia</span>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="cf-case-layout">
            <div className="cf-case-left">
              <Card className="cf-panel-card">
                <CardHeader className="cf-panel-header">
                  <div>
                    <CardTitle>ObsĹ‚uga sprawy</CardTitle>
                    <p>Jedno miejsce na braki, decyzje, materiaĹ‚y i historiÄ™. Bez szukania po caĹ‚ym ekranie.</p>
                  </div>
                </CardHeader>
                <CardContent className="cf-panel-body">
                  <Tabs defaultValue="work" className="cf-tabs">
                    <TabsList className="cf-tabs-list">
                      <TabsTrigger value="work">ObsĹ‚uga</TabsTrigger>
                      <TabsTrigger value="items">Checklisty</TabsTrigger>
                      <TabsTrigger value="history">Historia</TabsTrigger>
                    </TabsList>

                    <TabsContent value="work" className="cf-tab-content">
                      <div className="cf-work-grid">
                        <Card className="cf-sub-card">
                          <CardHeader className="cf-sub-card-header">
                            <CardTitle>NajwaĹĽniejsze dziaĹ‚ania</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => setIsAddItemOpen(true)}>
                              <Plus className="w-4 h-4" />
                              Dodaj
                            </Button>
                          </CardHeader>
                          <CardContent className="cf-list-content">
                            {caseStats.openItems.length === 0 ? (
                              <div className="cf-empty-box">
                                <CheckCircle2 className="w-10 h-10" />
                                <strong>Nie ma aktywnych brakĂłw</strong>
                                <span>Dodaj kolejny element tylko wtedy, gdy realnie czegoĹ› brakuje.</span>
                              </div>
                            ) : (
                              <div className="cf-case-items-list">
                                {caseStats.openItems.slice(0, 4).map((item) => (
                                  <div key={item.id} className="cf-action-item">
                                    <div className={`cf-item-icon ${getItemStatusClass(item.status)}`}>
                                      {item.status === 'uploaded' ? (
                                        <Clock className="w-4 h-4" />
                                      ) : item.status === 'rejected' ? (
                                        <AlertCircle className="w-4 h-4" />
                                      ) : (
                                        <FileText className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div className="cf-action-main">
                                      <strong>{item.title || 'Element sprawy'}</strong>
                                      <span>{item.description || 'Brak opisu'}</span>
                                      <div className="cf-action-meta">
                                        <Badge className={`cf-status-badge ${getItemStatusClass(item.status)}`}>
                                          {getItemStatusLabel(item.status)}
                                        </Badge>
                                        <span>{getItemTypeLabel(item.type)}</span>
                                        {item.dueDate && <span>{formatDate(item.dueDate)}</span>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="cf-sub-card cf-status-card">
                          <CardHeader className="cf-sub-card-header">
                            <CardTitle>Status operacyjny</CardTitle>
                          </CardHeader>
                          <CardContent className="cf-status-summary">
                            <div>
                              <span>Stan sprawy</span>
                              <strong>{getCaseStatusLabel(caseData.status)}</strong>
                            </div>
                            <div>
                              <span>GotowoĹ›Ä‡</span>
                              <strong>{hasBlockers ? 'Nie moĹĽna startowaÄ‡' : 'MoĹĽna przejĹ›Ä‡ dalej'}</strong>
                            </div>
                            <div>
                              <span>Do sprawdzenia</span>
                              <strong>{caseStats.uploaded.length}</strong>
                            </div>
                            <div>
                              <span>Ostatni ruch</span>
                              <strong>{activities[0] ? formatDateTime(activities[0].createdAt) : 'Brak aktywnoĹ›ci'}</strong>
                            </div>
                            <div className="cf-operator-note">
                              <strong>Prosty komunikat:</strong>
                              <span>{getCaseStatusHint(caseData.status)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="items" className="cf-tab-content">
                      <div className="cf-checklist-head">
                        <div>
                          <h3>Checklisty i blokery</h3>
                          <p>Lista ma mĂłwiÄ‡ jasno: gotowe, czeka, blokuje. Zero tabelkowego dymu.</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setIsAddItemOpen(true)}>
                          <Plus className="w-4 h-4" />
                          Dodaj element
                        </Button>
                      </div>

                      {items.length === 0 ? (
                        <div className="cf-empty-box cf-empty-box-large">
                          <FileText className="w-12 h-12" />
                          <strong>Brak elementĂłw sprawy</strong>
                          <span>Dodaj pierwszy brak, decyzjÄ™ albo materiaĹ‚, ĹĽeby sprawa miaĹ‚a czytelny start.</span>
                          <Button onClick={() => setIsAddItemOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Dodaj pierwszy element
                          </Button>
                        </div>
                      ) : (
                        <div className="cf-checklist-list">
                          {items.map((item) => (
                            <div key={item.id} className="cf-checklist-row">
                              <div className={`cf-check-dot ${getItemStatusClass(item.status)}`}>
                                {item.status === 'accepted' ? (
                                  <Check className="w-4 h-4" />
                                ) : item.status === 'rejected' ? (
                                  <X className="w-4 h-4" />
                                ) : item.status === 'uploaded' ? (
                                  <Clock className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>

                              <div className="cf-check-main">
                                <div className="cf-check-title-line">
                                  <h4>{item.title || 'Element sprawy'}</h4>
                                  {item.isRequired && <Badge variant="outline">Wymagane</Badge>}
                                </div>
                                <p>{item.description || 'Brak opisu'}</p>

                                <div className="cf-check-meta">
                                  <Badge className={`cf-status-badge ${getItemStatusClass(item.status)}`}>
                                    {getItemStatusLabel(item.status)}
                                  </Badge>
                                  <span>{getItemTypeLabel(item.type)}</span>
                                  {item.dueDate && <span>Termin: {formatDate(item.dueDate)}</span>}
                                </div>

                                {(item.fileUrl || item.response) && (
                                  <div className="cf-client-response">
                                    {item.fileUrl && (
                                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <Paperclip className="w-3.5 h-3.5" />
                                        {item.fileName || 'Pobierz plik'}
                                      </a>
                                    )}
                                    {item.response && (
                                      <p>
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {item.response}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="cf-check-actions">
                                {item.status === 'uploaded' && (
                                  <>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="cf-accept-btn"
                                      onClick={() => handleUpdateItemStatus(item.id, 'accepted', item.title || 'Element')}
                                      aria-label="Zaakceptuj"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="cf-reject-btn"
                                      onClick={() => handleUpdateItemStatus(item.id, 'rejected', item.title || 'Element')}
                                      aria-label="OdrzuÄ‡"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {item.status !== 'accepted' && (
                                      <DropdownMenuItem
                                        onClick={() => handleUpdateItemStatus(item.id, 'accepted', item.title || 'Element')}
                                      >
                                        <Check className="w-4 h-4 mr-2" />
                                        Oznacz jako gotowe
                                      </DropdownMenuItem>
                                    )}
                                    {item.status !== 'missing' && (
                                      <DropdownMenuItem
                                        onClick={() => handleUpdateItemStatus(item.id, 'missing', item.title || 'Element')}
                                      >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Oznacz jako czeka
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item.id)}>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      UsuĹ„
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="history" className="cf-tab-content">
                      <Card className="cf-sub-card">
                        <CardHeader className="cf-sub-card-header">
                          <CardTitle>Historia sprawy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="cf-history-scroll">
                            <div className="cf-timeline">
                              {activities.length === 0 ? (
                                <div className="cf-empty-box">
                                  <History className="w-10 h-10" />
                                  <strong>Brak aktywnoĹ›ci</strong>
                                  <span>Gdy dodasz brak, notatkÄ™ albo klient coĹ› przeĹ›le, pojawi siÄ™ tutaj.</span>
                                </div>
                              ) : (
                                activities.map((activity) => (
                                  <div key={activity.id} className="cf-timeline-item">
                                    <div className="cf-timeline-dot" />
                                    <div>
                                      <strong>{getActivityText(activity)}</strong>
                                      {activity.eventType === 'operator_note' && activity.payload?.note && <p>{activity.payload.note}</p>}
                                      <span>{formatDateTime(activity.createdAt)}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <aside className="cf-case-right">
              <Card className="cf-side-card cf-side-actions">
                <CardHeader>
                  <CardTitle>Szybkie akcje</CardTitle>
                  <p>KrĂłtko i jasno. Bez polowania na przyciski.</p>
                </CardHeader>
                <CardContent className="cf-side-stack">
                  <Button className="cf-wide-action" onClick={() => setIsAddItemOpen(true)}>
                    <Plus className="w-4 h-4" />
                    <span>
                      <strong>Dodaj brak / element</strong>
                      <small>plik, decyzja, tekst, dostÄ™p</small>
                    </span>
                  </Button>

                  <Button className="cf-wide-action" variant="outline" onClick={() => setIsAddNoteOpen(true)}>
                    <StickyNote className="w-4 h-4" />
                    <span>
                      <strong>Dodaj notatkÄ™</strong>
                      <small>krĂłtki Ĺ›lad w historii</small>
                    </span>
                  </Button>

                  <Button className="cf-wide-action" variant="outline" onClick={generatePortalLink}>
                    <ExternalLink className="w-4 h-4" />
                    <span>
                      <strong>Kopiuj portal klienta</strong>
                      <small>link do uzupeĹ‚nienia brakĂłw</small>
                    </span>
                  </Button>

                  <Button className="cf-wide-action" variant="outline" onClick={handleReminderCopy}>
                    <Send className="w-4 h-4" />
                    <span>
                      <strong>Przygotuj przypomnienie</strong>
                      <small>bez udawania wysyĹ‚ki maila</small>
                    </span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="cf-side-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserRound className="w-5 h-5" />
                    Klient w tle
                  </CardTitle>
                  <p>To kontekst. GĹ‚Ăłwna praca zostaje na sprawie.</p>
                </CardHeader>
                <CardContent className="cf-info-list">
                  <div>
                    <span>Nazwa</span>
                    <strong>{caseData.clientName || 'Brak danych'}</strong>
                  </div>
                  <div>
                    <span>Status sprawy</span>
                    <strong>{getCaseStatusLabel(caseData.status)}</strong>
                  </div>
                  <div>
                    <span>Elementy</span>
                    <strong>{items.length}</strong>
                  </div>
                  <div>
                    <span>Do sprawdzenia</span>
                    <strong>{caseStats.uploaded.length}</strong>
                  </div>
                </CardContent>
              </Card>

              <Card className="cf-side-card cf-note-card">
                <CardHeader>
                  <CardTitle>KrĂłtka notatka operatora</CardTitle>
                  <p>Ostatni sens sprawy w jednym miejscu.</p>
                </CardHeader>
                <CardContent>
                  <div className="cf-note-preview">
                    {activities.find((activity) => activity.eventType === 'operator_note')?.payload?.note ||
                      'Brak notatki. Dodaj krĂłtkÄ… informacjÄ™, ĹĽeby po wejĹ›ciu w sprawÄ™ od razu wiedzieÄ‡, o co chodzi.'}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </section>
        </main>
      </div>

      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj notatkÄ™ do sprawy</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Label>Notatka</Label>
            <Textarea
              placeholder="Np. Klient potwierdziĹ‚ cenÄ™, czekamy tylko na zgodÄ™ na publikacjÄ™."
              value={newNote}
              onChange={(event) => setNewNote(event.target.value)}
              className="min-h-[130px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddNote}>Dodaj notatkÄ™</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

