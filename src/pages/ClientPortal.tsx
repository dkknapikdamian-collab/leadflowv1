import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Lock,
  MessageSquare,
  Paperclip,
  ShieldAlert,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { db, storage } from '../firebase';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  status?: string;
  ownerId?: string;
  updatedAt?: Timestamp | null;
};

type CaseItemRecord = {
  id: string;
  title?: string;
  description?: string;
  type?: 'file' | 'text' | 'access' | 'decision' | string;
  isRequired?: boolean;
  status?: 'missing' | 'uploaded' | 'accepted' | 'rejected';
  response?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  dueDate?: string;
  updatedAt?: Timestamp | null;
  order?: number;
};

type PortalTokenRecord = {
  token?: string;
  expiresAt?: Timestamp | null;
  revokedAt?: Timestamp | null;
};

type PortalView = 'all' | 'open' | 'review' | 'done' | 'rejected';

const PORTAL_VIEWS: { value: PortalView; label: string }[] = [
  { value: 'all', label: 'Wszystko' },
  { value: 'open', label: 'Do zrobienia' },
  { value: 'review', label: 'Wysłane' },
  { value: 'done', label: 'Gotowe' },
  { value: 'rejected', label: 'Do poprawy' },
];

function timestampToDate(value?: Timestamp | null) {
  if (!value) return null;
  if (typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate();
  }
  return null;
}

function formatDate(value?: Timestamp | null, fallback = 'Brak') {
  const date = timestampToDate(value);
  if (!date) return fallback;
  return format(date, 'd MMMM yyyy, HH:mm', { locale: pl });
}

function itemStatusLabel(status?: CaseItemRecord['status']) {
  switch (status) {
    case 'uploaded':
      return 'Wysłane / czeka';
    case 'accepted':
      return 'Gotowe';
    case 'rejected':
      return 'Wymaga poprawki';
    default:
      return 'Do uzupełnienia';
  }
}

function itemStatusVariant(status?: CaseItemRecord['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'accepted') return 'secondary';
  if (status === 'rejected') return 'destructive';
  if (status === 'uploaded') return 'default';
  return 'outline';
}

function itemTypeLabel(type?: CaseItemRecord['type']) {
  switch (type) {
    case 'access':
      return 'Dostęp / login';
    case 'text':
      return 'Odpowiedź tekstowa';
    case 'decision':
      return 'Decyzja';
    default:
      return 'Plik / materiał';
  }
}

function itemActionLabel(item: CaseItemRecord) {
  switch (item.type) {
    case 'text':
      return item.status === 'uploaded' ? 'Zmień odpowiedź' : 'Dodaj odpowiedź';
    case 'access':
      return item.status === 'uploaded' ? 'Zmień dane' : 'Podaj dane';
    default:
      return item.status === 'uploaded' ? 'Zmień plik' : 'Wgraj plik';
  }
}

export default function ClientPortal() {
  const { caseId, token } = useParams();
  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [items, setItems] = useState<CaseItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [view, setView] = useState<PortalView>('open');

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CaseItemRecord | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!caseId || !token) {
      setLoading(false);
      setIsValid(false);
      return;
    }

    let unsubscribeCase: (() => void) | undefined;
    let unsubscribeItems: (() => void) | undefined;
    let isMounted = true;

    async function validateToken() {
      try {
        const tokenRef = doc(db, 'client_portal_tokens', caseId);
        const tokenSnap = await getDoc(tokenRef);

        if (!tokenSnap.exists()) {
          if (isMounted) {
            setIsValid(false);
            setLoading(false);
          }
          return;
        }

        const tokenData = tokenSnap.data() as PortalTokenRecord;
        const revokedAt = timestampToDate(tokenData.revokedAt);
        const expiresAt = timestampToDate(tokenData.expiresAt);
        const expired = expiresAt ? expiresAt.getTime() < Date.now() : false;

        if (tokenData.token !== token || revokedAt || expired) {
          if (isMounted) {
            setIsValid(false);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setIsValid(true);
        }

        const caseRef = doc(db, 'cases', caseId);
        unsubscribeCase = onSnapshot(caseRef, (snapshot) => {
          if (!snapshot.exists()) {
            setCaseData(null);
            return;
          }
          setCaseData({ id: snapshot.id, ...(snapshot.data() as Omit<CaseRecord, 'id'>) });
        });

        const itemsRef = collection(db, 'cases', caseId, 'items');
        const itemsQuery = query(itemsRef, orderBy('order', 'asc'));
        unsubscribeItems = onSnapshot(itemsQuery, (snapshot) => {
          setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<CaseItemRecord, 'id'>) })));
          setLoading(false);
        });
      } catch (error: any) {
        if (isMounted) {
          setIsValid(false);
          setLoading(false);
        }
        toast.error(`Błąd portalu: ${error.message}`);
      }
    }

    validateToken();

    return () => {
      isMounted = false;
      unsubscribeCase?.();
      unsubscribeItems?.();
    };
  }, [caseId, token]);

  function openItemDialog(item: CaseItemRecord) {
    setSelectedItem(item);
    setResponse(item.response || '');
    setFile(null);
    setIsUploadOpen(true);
  }

  function closeDialog() {
    setIsUploadOpen(false);
    setSelectedItem(null);
    setResponse('');
    setFile(null);
  }

  async function handleSubmitResponse() {
    if (!selectedItem || !caseId || !caseData) return;
    setUploading(true);

    try {
      let fileUrl = selectedItem.fileUrl || null;
      let fileName = selectedItem.fileName || null;

      if (file) {
        const storageRef = ref(storage, `cases/${caseId}/${selectedItem.id}/${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(uploadResult.ref);
        fileName = file.name;
      }

      await updateDoc(doc(db, 'cases', caseId, 'items', selectedItem.id), {
        status: 'uploaded',
        response: response || selectedItem.response || null,
        fileUrl,
        fileName,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'activities'), {
        caseId,
        ownerId: caseData.ownerId,
        actorType: 'client',
        eventType: file ? 'file_uploaded' : 'response_sent',
        payload: { title: selectedItem.title },
        createdAt: serverTimestamp(),
      });

      toast.success('Materiał został zapisany. Opiekun zobaczy go od razu.');
      closeDialog();
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleDecision(itemId: string, decision: 'accepted' | 'rejected', title?: string) {
    if (!caseId || !caseData) return;

    try {
      await updateDoc(doc(db, 'cases', caseId, 'items', itemId), {
        status: decision,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'activities'), {
        caseId,
        ownerId: caseData.ownerId,
        actorType: 'client',
        eventType: 'decision_made',
        payload: { title: title || 'Decyzja', decision },
        createdAt: serverTimestamp(),
      });

      toast.success(decision === 'accepted' ? 'Decyzja zapisana jako akceptacja.' : 'Decyzja zapisana jako odrzucenie.');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  const acceptedCount = items.filter((item) => item.status === 'accepted').length;
  const uploadedCount = items.filter((item) => item.status === 'uploaded').length;
  const rejectedCount = items.filter((item) => item.status === 'rejected').length;
  const openCount = items.filter((item) => item.status !== 'accepted').length;
  const requiredPending = items.filter((item) => item.isRequired !== false && item.status !== 'accepted').length;
  const progressPercent = items.length > 0 ? Math.round((acceptedCount / items.length) * 100) : 0;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      switch (view) {
        case 'open':
          return item.status !== 'accepted' && item.status !== 'uploaded';
        case 'review':
          return item.status === 'uploaded';
        case 'done':
          return item.status === 'accepted';
        case 'rejected':
          return item.status === 'rejected';
        default:
          return true;
      }
    });
  }, [items, view]);

  const heroMessage = useMemo(() => {
    if (requiredPending > 0) {
      return `Do domknięcia zostało jeszcze ${requiredPending} ${requiredPending === 1 ? 'wymagane pole' : requiredPending < 5 ? 'wymagane pola' : 'wymaganych pól'}.`; 
    }
    if (uploadedCount > 0) {
      return 'Materiały zostały wysłane. Teraz opiekun musi je sprawdzić lub zaakceptować.';
    }
    if (items.length > 0 && acceptedCount === items.length) {
      return 'Wszystko wygląda gotowo. Z tej strony nie masz już nic do dosłania.';
    }
    return 'Poniżej masz prostą checklistę rzeczy potrzebnych do uruchomienia sprawy.';
  }, [acceptedCount, items.length, requiredPending, uploadedCount]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center app-shell-bg px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[color:var(--app-primary)]" />
          <p className="text-sm font-medium app-muted">Ładowanie portalu klienta...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center app-shell-bg px-4 py-10">
        <Card className="w-full max-w-lg border-none app-surface-strong text-center">
          <CardHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/12 text-rose-500">
              <Lock className="h-7 w-7" />
            </div>
            <CardTitle className="mt-4 text-2xl">Link wygasł albo jest nieprawidłowy</CardTitle>
            <CardDescription>
              Ten portal nie jest już aktywny. Skontaktuj się z opiekunem sprawy, żeby dostać świeży link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border p-4 app-border app-surface text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Co zrobić teraz</p>
              <p className="mt-2 text-sm app-text">
                Napisz do osoby, która prowadzi sprawę. Najczęściej wystarczy poprosić o ponowne wysłanie linku do portalu klienta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell-bg pb-10">
      <section className="border-b app-border app-sidebar">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Portal klienta</Badge>
                {requiredPending > 0 ? <Badge variant="destructive">Są braki wymagane</Badge> : null}
                {uploadedCount > 0 ? <Badge>Materiały wysłane</Badge> : null}
              </div>
              <h1 className="text-3xl font-bold app-text md:text-4xl">{caseData?.title || 'Twoja sprawa'}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 app-muted md:text-base">
                {heroMessage}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm app-muted">
                <span>Klient: {caseData?.clientName || 'Twoja firma / Twoje dane'}</span>
                <span>Ostatnia aktualizacja: {formatDate(caseData?.updatedAt)}</span>
              </div>
            </div>

            <Card className="w-full max-w-md border-none app-surface-strong">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] app-muted">
                  <span>Postęp</span>
                  <span>{acceptedCount} / {items.length}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border p-3 app-border app-surface">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] app-muted">Otwarte</p>
                    <p className="mt-1 text-xl font-bold app-text">{openCount}</p>
                  </div>
                  <div className="rounded-2xl border p-3 app-border app-surface">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] app-muted">Czeka</p>
                    <p className="mt-1 text-xl font-bold text-[color:var(--app-primary)]">{uploadedCount}</p>
                  </div>
                  <div className="rounded-2xl border p-3 app-border app-surface">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] app-muted">Gotowe</p>
                    <p className="mt-1 text-xl font-bold text-emerald-500">{acceptedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:px-8 xl:grid-cols-[minmax(0,1.5fr)_340px]">
        <div className="space-y-6">
          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle className="text-xl">Checklista klienta</CardTitle>
              <CardDescription>
                Wysyłasz materiały, odpowiedzi i decyzje dokładnie tutaj. Opiekun sprawy widzi to od razu po Twojej stronie.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={view} onValueChange={(value) => setView(value as PortalView)}>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-2 sm:grid-cols-5">
                  {PORTAL_VIEWS.map((portalView) => (
                    <TabsTrigger key={portalView.value} value={portalView.value} className="py-2 text-xs sm:text-sm">
                      {portalView.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="space-y-3">
                {filteredItems.length > 0 ? filteredItems.map((item) => {
                  const isCompleted = item.status === 'accepted';
                  const isWaiting = item.status === 'uploaded';
                  const isRejected = item.status === 'rejected';

                  return (
                    <Card key={item.id} className={`border-none ${isCompleted ? 'opacity-80' : ''} app-surface`}>
                      <CardContent className="flex flex-col gap-4 p-4 md:p-5">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                              isCompleted
                                ? 'bg-emerald-500/12 text-emerald-500'
                                : isWaiting
                                  ? 'app-primary-chip'
                                  : isRejected
                                    ? 'bg-rose-500/12 text-rose-500'
                                    : 'bg-black/5 text-[color:var(--app-text-muted)] dark:bg-white/10'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isWaiting ? <Clock className="h-5 w-5" /> : isRejected ? <AlertCircle className="h-5 w-5" /> : item.type === 'decision' ? <ShieldAlert className="h-5 w-5" /> : item.type === 'text' || item.type === 'access' ? <MessageSquare className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                          </div>

                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold app-text">{item.title || 'Element bez nazwy'}</h3>
                              <Badge variant={itemStatusVariant(item.status)}>{itemStatusLabel(item.status)}</Badge>
                              {item.isRequired !== false ? <Badge variant="outline">Wymagane</Badge> : null}
                            </div>
                            {item.description ? <p className="text-sm leading-6 app-muted">{item.description}</p> : null}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs app-muted">
                              <span>Typ: {itemTypeLabel(item.type)}</span>
                              <span>Termin: {item.dueDate || 'Brak terminu'}</span>
                              <span>Ostatnia zmiana: {formatDate(item.updatedAt, 'Jeszcze bez zmian')}</span>
                            </div>
                          </div>
                        </div>

                        {(item.fileUrl || item.response) ? (
                          <div className="rounded-2xl border p-3 app-border app-surface-strong">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Twoja ostatnia odpowiedź</p>
                            <div className="mt-3 space-y-2 text-sm">
                              {item.fileUrl ? (
                                <a href={item.fileUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-2 font-medium text-[color:var(--app-primary)] hover:underline">
                                  <Paperclip className="h-4 w-4" />
                                  <span className="truncate">{item.fileName || 'Przesłany plik'}</span>
                                </a>
                              ) : null}
                              {item.response ? (
                                <div className="flex items-start gap-2 app-text">
                                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 app-muted" />
                                  <span className="whitespace-pre-wrap break-words">{item.response}</span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        <div className="flex flex-wrap gap-2">
                          {item.type === 'decision' ? (
                            <>
                              <Button size="sm" variant="secondary" className="rounded-xl" onClick={() => handleDecision(item.id, 'accepted', item.title)}>
                                <Check className="h-4 w-4" /> Tak, akceptuję
                              </Button>
                              <Button size="sm" variant="destructive" className="rounded-xl" onClick={() => handleDecision(item.id, 'rejected', item.title)}>
                                <X className="h-4 w-4" /> Nie, odrzucam
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => openItemDialog(item)}>
                              {item.type === 'file' ? <Upload className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                              {itemActionLabel(item)}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }) : (
                  <Card className="border-dashed app-surface">
                    <CardContent className="p-10 text-center">
                      <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                      <p className="font-medium app-text">W tym widoku nie ma już nic do zrobienia.</p>
                      <p className="mt-1 text-sm app-muted">Możesz przełączyć filtr albo po prostu wrócić później, gdy opiekun doda nowy ruch.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle className="text-xl">Co jest ważne teraz</CardTitle>
              <CardDescription>
                Ten panel pokazuje, co jeszcze blokuje przejście sprawy dalej po Twojej stronie.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border p-4 app-border app-surface">
                <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Wymagane rzeczy</p>
                <p className="mt-2 text-2xl font-bold app-text">{requiredPending}</p>
                <p className="mt-1 text-sm app-muted">Tyle pól lub materiałów nadal blokuje czyste domknięcie sprawy.</p>
              </div>
              <div className="rounded-2xl border p-4 app-border app-surface">
                <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Materiały do sprawdzenia</p>
                <p className="mt-2 text-2xl font-bold text-[color:var(--app-primary)]">{uploadedCount}</p>
                <p className="mt-1 text-sm app-muted">To już wysłałeś, ale operator musi jeszcze to przejrzeć albo zaakceptować.</p>
              </div>
              <div className="rounded-2xl border p-4 app-border app-surface">
                <p className="text-xs font-bold uppercase tracking-[0.16em] app-muted">Do poprawy</p>
                <p className="mt-2 text-2xl font-bold text-rose-500">{rejectedCount}</p>
                <p className="mt-1 text-sm app-muted">Tu wróciła decyzja negatywna albo potrzeba dosłania poprawionej wersji.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle className="text-xl">Jak korzystać z portalu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm app-muted">
              <div className="rounded-2xl border p-4 app-border app-surface">
                1. Otwórz pozycję z checklisty i dodaj plik, odpowiedź albo decyzję.
              </div>
              <div className="rounded-2xl border p-4 app-border app-surface">
                2. Gdy coś wyślesz, rekord przejdzie do stanu „Wysłane / czeka”.
              </div>
              <div className="rounded-2xl border p-4 app-border app-surface">
                3. Gdy operator zaakceptuje materiał, pozycja pokaże się jako „Gotowe”.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog open={isUploadOpen} onOpenChange={(open) => (!open ? closeDialog() : setIsUploadOpen(true))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.type === 'access'
                ? 'Podaj dane dostępu'
                : selectedItem?.type === 'text'
                  ? 'Dodaj odpowiedź'
                  : 'Wgraj materiał'}
              {selectedItem?.title ? `: ${selectedItem.title}` : ''}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {selectedItem?.type === 'file' ? (
              <div className="space-y-2">
                <Label>Plik</Label>
                <Input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
                {selectedItem.fileName ? <p className="text-xs app-muted">Obecnie zapisany: {selectedItem.fileName}</p> : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label>
                {selectedItem?.type === 'access'
                  ? 'Login, hasło, link lub instrukcja'
                  : selectedItem?.type === 'text'
                    ? 'Treść odpowiedzi'
                    : 'Komentarz dla opiekuna'}
              </Label>
              <Textarea
                rows={selectedItem?.type === 'access' ? 6 : 5}
                placeholder={
                  selectedItem?.type === 'access'
                    ? 'Wpisz dane dostępowe albo instrukcję krok po kroku...'
                    : selectedItem?.type === 'text'
                      ? 'Wpisz odpowiedź, której potrzebuje opiekun...'
                      : 'Możesz dodać krótki komentarz do materiału...'
                }
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Anuluj</Button>
            <Button
              onClick={handleSubmitResponse}
              disabled={uploading || (selectedItem?.type === 'file' ? !file && !response && !selectedItem?.fileUrl : !response)}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Zapisz i wyślij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
