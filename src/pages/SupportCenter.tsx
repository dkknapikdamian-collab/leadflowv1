import { FormEvent, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import { AlertTriangle, LifeBuoy, Lightbulb, Loader2, MessageSquare, Send, ShieldCheck, Wrench } from 'lucide-react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth, db } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import { toast } from 'sonner';

type TicketKind = 'suggestion' | 'problem' | 'support';

type TicketRow = {
  id: string;
  kind: TicketKind;
  subject: string;
  message: string;
  status?: string;
  createdAt?: any;
  adminReply?: string | null;
  replies?: Array<{ authorType?: string; message?: string; createdAt?: any }>;
};

const KIND_OPTIONS: Array<{
  id: TicketKind;
  label: string;
  helper: string;
  Icon: any;
}> = [
  {
    id: 'suggestion',
    label: 'Sugestie',
    helper: 'Pomysły na ulepszenie, skrócenie ścieżki albo czytelniejszy interfejs.',
    Icon: Lightbulb,
  },
  {
    id: 'problem',
    label: 'Problemy',
    helper: 'Błędy działania, dublowanie rekordów, brak synchronizacji lub coś, co nie działa.',
    Icon: AlertTriangle,
  },
  {
    id: 'support',
    label: 'Support',
    helper: 'Pytania jak czegoś użyć albo prośby o pomoc w obsłudze.',
    Icon: LifeBuoy,
  },
];

function formatCreatedAt(value: any) {
  if (!value) return 'Przed chwilą';
  try {
    if (value?.toDate) {
      return value.toDate().toLocaleString('pl-PL');
    }
    if (typeof value?.seconds === 'number') {
      return new Date(value.seconds * 1000).toLocaleString('pl-PL');
    }
    return new Date(value).toLocaleString('pl-PL');
  } catch {
    return 'Przed chwilą';
  }
}

function statusLabel(status?: string) {
  switch ((status || 'new').toLowerCase()) {
    case 'answered':
      return 'Odpowiedziano';
    case 'closed':
      return 'Zamknięte';
    case 'in_progress':
      return 'W trakcie';
    default:
      return 'Nowe';
  }
}

function statusClasses(status?: string) {
  switch ((status || 'new').toLowerCase()) {
    case 'answered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'closed':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'in_progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
}

export default function SupportCenter() {
  const { workspace } = useWorkspace();
  const [kind, setKind] = useState<TicketKind>('suggestion');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [historyAvailable, setHistoryAvailable] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      setTickets([]);
      setHistoryAvailable(false);
      return;
    }

    const ticketsQuery = query(
      collection(db, 'support_requests'),
      where('ownerId', '==', auth.currentUser.uid),
    );

    const unsubscribe = onSnapshot(
      ticketsQuery,
      (snapshot) => {
        const rows = snapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, any>) }) as TicketRow)
          .sort((a, b) => {
            const aSeconds = a.createdAt?.seconds || 0;
            const bSeconds = b.createdAt?.seconds || 0;
            return bSeconds - aSeconds;
          });

        setTickets(rows);
        setHistoryAvailable(true);
        setLoading(false);
      },
      (error) => {
        const code = typeof error?.code === 'string' ? error.code : '';
        if (code === 'permission-denied' || code === 'firestore/permission-denied') {
          console.warn('SUPPORT_REQUESTS_LOAD_PERMISSION_DENIED');
          setTickets([]);
          setHistoryAvailable(false);
          setLoading(false);
          return;
        }
        console.error('SUPPORT_REQUESTS_LOAD_FAILED', error);
        toast.error('Nie udało się odczytać zgłoszeń pomocy.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredTickets = useMemo(
    () => tickets.filter((ticket) => ticket.kind === kind),
    [tickets, kind],
  );

  const currentKind = KIND_OPTIONS.find((item) => item.id === kind) || KIND_OPTIONS[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!auth.currentUser) return;
    if (!subject.trim() || !message.trim()) {
      toast.error('Uzupełnij temat i treść zgłoszenia.');
      return;
    }

    setSending(true);

    try {
      await addDoc(collection(db, 'support_requests'), {
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email || null,
        workspaceId: workspace?.id || null,
        kind,
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
        source: 'app',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        adminReply: null,
        replies: [],
      });

      try {
        await fetch('/api/support-forward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind,
            subject: subject.trim(),
            message: message.trim(),
            workspaceId: workspace?.id || null,
            ownerId: auth.currentUser.uid,
            ownerEmail: auth.currentUser.email || null,
          }),
        });
      } catch (forwardError) {
        console.warn('SUPPORT_FORWARD_FAILED', forwardError);
      }

      toast.success('Zgłoszenie zapisane. Odpowiedź pojawi się tutaj, gdy zostanie dodana.');
      setSubject('');
      setMessage('');
    } catch (error: any) {
      console.error('SUPPORT_REQUEST_CREATE_FAILED', error);
      toast.error(`Nie udało się zapisać zgłoszenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-3">
          <Badge variant="outline" className="w-fit rounded-full border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-600">
            Centrum pomocy
          </Badge>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sugestie, problemy i support</h1>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="space-y-3">
                <CardTitle>Nowe zgłoszenie</CardTitle>
                <CardDescription>
                  Wybierz kategorię, wpisz temat i treść. Jednym formularzem obsługujesz sugestie, problemy i zwykłe pytania.
                </CardDescription>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {KIND_OPTIONS.map((option) => {
                    const isActive = option.id === kind;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setKind(option.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          isActive
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <option.Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                          <p className="font-semibold text-slate-900">{option.label}</p>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-500">{option.helper}</p>
                      </button>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Temat</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={
                        kind === 'suggestion'
                          ? 'Np. Przydałby się szybszy skrót do zamykania leada'
                          : kind === 'problem'
                            ? 'Np. Na telefonie dodanie zadania zrobiło duplikat'
                            : 'Np. Nie wiem jak najlepiej używać sekcji Sprawy'
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Treść</Label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Opisz konkretnie co chcesz ulepszyć, co nie działa albo w czym potrzebujesz pomocy."
                      className="min-h-[160px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>


                  <Button type="submit" className="w-full sm:w-auto" disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wysyłanie...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Wyślij zgłoszenie
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Twoje zgłoszenia</CardTitle>
                <CardDescription>
                  W tym miejscu wracają odpowiedzi i status dalszej obsługi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {KIND_OPTIONS.map((option) => (
                    <Button
                      key={option.id}
                      type="button"
                      variant={kind === option.id ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setKind(option.id)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                {loading ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> Ładowanie zgłoszeń...
                  </div>
                ) : !historyAvailable ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
                    Historia zgłoszeń jest chwilowo niedostępna. Nadal możesz wysłać nowe zgłoszenie z tego formularza.
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
                    Brak zgłoszeń w tej sekcji.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTickets.map((ticket) => (
                      <Card key={ticket.id} className="border-slate-100">
                        <CardContent className="space-y-3 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 break-words">{ticket.subject}</p>
                              <p className="mt-1 text-sm text-slate-500 break-words">{ticket.message}</p>
                            </div>
                            <div className="shrink-0 space-y-2">
                              <Badge variant="outline" className={`rounded-full ${statusClasses(ticket.status)}`}>
                                {statusLabel(ticket.status)}
                              </Badge>
                              <p className="text-[11px] text-slate-400">{formatCreatedAt(ticket.createdAt)}</p>
                            </div>
                          </div>

                          {ticket.adminReply ? (
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                              <div className="mb-1 flex items-center gap-2 text-emerald-700">
                                <ShieldCheck className="h-4 w-4" />
                                <p className="text-sm font-semibold">Odpowiedź supportu</p>
                              </div>
                              <p className="text-sm text-emerald-900 break-words">{ticket.adminReply}</p>
                            </div>
                          ) : null}

                          {Array.isArray(ticket.replies) && ticket.replies.length > 0 ? (
                            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                              {ticket.replies.map((reply, index) => (
                                <div key={`${ticket.id}:reply:${index}`} className="rounded-xl bg-white p-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    {reply.authorType === 'admin' ? 'Support' : 'Wiadomość'}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-700 break-words">{reply.message || 'Brak treści'}</p>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <p className="font-semibold">Sugestie</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Używaj do pomysłów typu: krótsza ścieżka, lepszy układ, nowy filtr, bardziej czytelny widok na telefonie.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Wrench className="h-4 w-4 text-rose-500" />
                    <p className="font-semibold">Problemy</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Używaj do błędów działania: duplikaty, brak synchronizacji, znikające rekordy, złe liczenie albo uszkodzony UI.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <p className="font-semibold">Support</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Używaj do pytań jak najlepiej obsłużyć proces w closeflow albo jak działa konkretna sekcja.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Co wpisać, żeby zgłoszenie było konkretne</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-500">
                <p>• gdzie dokładnie wszedłeś w aplikacji</p>
                <p>• co kliknąłeś krok po kroku</p>
                <p>• co miało się stać, a co stało się faktycznie</p>
                <p>• czy problem był na telefonie czy na komputerze</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
