import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  LifeBuoy,
  Lightbulb,
  Loader2,
  MessageSquare,
  Send,
  ShieldCheck,
  Wrench,
  Shield,
  Search,
  CheckCircle2,
  Clock3,
  Archive,
} from 'lucide-react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { auth } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  createSupportRequestInSupabase,
  fetchSupportRequestsFromSupabase,
  replyToSupportRequestInSupabase,
  updateSupportRequestStatusInSupabase,
} from '../lib/supabase-fallback';
import { toast } from 'sonner';

type TicketKind = 'suggestion' | 'problem' | 'support';
type TicketStatus = 'new' | 'in_progress' | 'answered' | 'closed';

type TicketReply = {
  id?: string;
  authorType?: string;
  authorLabel?: string;
  message?: string;
  createdAt?: any;
};

type TicketRow = {
  id: string;
  kind: TicketKind;
  subject: string;
  message: string;
  status?: string;
  ownerId?: string;
  ownerEmail?: string | null;
  createdAt?: any;
  updatedAt?: any;
  adminReply?: string | null;
  replies?: TicketReply[];
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

const STATUS_OPTIONS: Array<{
  id: 'all' | TicketStatus;
  label: string;
  Icon: any;
}> = [
  { id: 'all', label: 'Wszystkie', Icon: MessageSquare },
  { id: 'new', label: 'Nowe', Icon: ShieldCheck },
  { id: 'in_progress', label: 'W trakcie', Icon: Clock3 },
  { id: 'answered', label: 'Odpowiedziano', Icon: CheckCircle2 },
  { id: 'closed', label: 'Zamknięte', Icon: Archive },
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

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getTicketTimestamp(ticket: TicketRow) {
  const updated = ticket.updatedAt ? new Date(ticket.updatedAt).getTime() : 0;
  const created = ticket.createdAt ? new Date(ticket.createdAt).getTime() : 0;
  return Number.isFinite(updated) && updated > 0 ? updated : created;
}

function renderReplyLabel(reply: TicketReply) {
  if (reply.authorType === 'admin') return 'Support';
  if (reply.authorType === 'user') return 'Ty';
  return reply.authorLabel || 'Wiadomość';
}

export default function SupportCenter() {
  const { workspace, isAdmin } = useWorkspace();
  const userId = auth.currentUser?.uid || '';
  const userEmail = auth.currentUser?.email || '';

  const [kind, setKind] = useState<TicketKind>('suggestion');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyPendingId, setReplyPendingId] = useState<string | null>(null);
  const [statusPendingId, setStatusPendingId] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    if (!userId) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const rows = await fetchSupportRequestsFromSupabase({
        ownerId: isAdmin ? undefined : userId,
      });

      const normalized = (rows as TicketRow[]).slice().sort((a, b) => getTicketTimestamp(b) - getTicketTimestamp(a));
      setTickets(normalized);
    } catch (error: any) {
      console.error('SUPPORT_REQUESTS_LOAD_FAILED', error);
      toast.error('Nie udało się wczytać zgłoszeń pomocy.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, userId]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tickets.filter((ticket) => {
      if (ticket.kind !== kind) return false;
      if (statusFilter !== 'all' && (ticket.status || 'new') !== statusFilter) return false;
      if (!q) return true;

      const haystack = [
        ticket.subject,
        ticket.message,
        ticket.ownerEmail || '',
        ...(Array.isArray(ticket.replies) ? ticket.replies.map((entry) => entry.message || '') : []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [kind, searchQuery, statusFilter, tickets]);

  useEffect(() => {
    if (!filteredTickets.length) {
      setSelectedTicketId(null);
      return;
    }

    if (!selectedTicketId || !filteredTickets.some((ticket) => ticket.id === selectedTicketId)) {
      setSelectedTicketId(filteredTickets[0].id);
    }
  }, [filteredTickets, selectedTicketId]);

  const selectedTicket = useMemo(
    () => filteredTickets.find((ticket) => ticket.id === selectedTicketId) || filteredTickets[0] || null,
    [filteredTickets, selectedTicketId],
  );

  const currentKind = KIND_OPTIONS.find((item) => item.id === kind) || KIND_OPTIONS[0];

  const updateReplyDraft = (ticketId: string, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!userId) return;
    if (!subject.trim() || !message.trim()) {
      toast.error('Uzupełnij temat i treść zgłoszenia.');
      return;
    }

    setSending(true);

    try {
      await createSupportRequestInSupabase({
        ownerId: userId,
        ownerEmail: userEmail || null,
        workspaceId: workspace?.id || null,
        kind,
        subject: subject.trim(),
        message: message.trim(),
      });

      toast.success('Zgłoszenie zapisane.');
      setSubject('');
      setMessage('');
      await loadTickets();
    } catch (error: any) {
      console.error('SUPPORT_REQUEST_CREATE_FAILED', error);
      toast.error(`Nie udało się zapisać zgłoszenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (ticket: TicketRow, actorType: 'admin' | 'user') => {
    const draft = normalizeText(replyDrafts[ticket.id]);
    if (!draft) {
      toast.error('Wpisz treść odpowiedzi.');
      return;
    }

    try {
      setReplyPendingId(ticket.id);
      await replyToSupportRequestInSupabase({
        id: ticket.id,
        message: draft,
        actorType,
      });
      setReplyDrafts((prev) => ({ ...prev, [ticket.id]: '' }));
      toast.success(actorType === 'admin' ? 'Odpowiedź supportu zapisana.' : 'Odpowiedź została dopisana.');
      await loadTickets();
    } catch (error: any) {
      console.error('SUPPORT_REPLY_FAILED', error);
      toast.error(`Nie udało się zapisać odpowiedzi: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setReplyPendingId(null);
    }
  };

  const handleCloseTicket = async (ticket: TicketRow) => {
    try {
      setStatusPendingId(ticket.id);
      await updateSupportRequestStatusInSupabase({
        id: ticket.id,
        status: 'closed',
      });
      toast.success('Zgłoszenie zamknięte.');
      await loadTickets();
    } catch (error: any) {
      console.error('SUPPORT_STATUS_FAILED', error);
      toast.error(`Nie udało się zmienić statusu: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setStatusPendingId(null);
    }
  };

  const renderThread = (ticket: TicketRow) => (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {isAdmin ? 'Zgłoszenie klienta' : 'Twoje zgłoszenie'}
        </p>
        <p className="mt-1 text-sm text-slate-900 break-words">{ticket.message}</p>
        <p className="mt-2 text-[11px] text-slate-400">{formatCreatedAt(ticket.createdAt)}</p>
      </div>

      {Array.isArray(ticket.replies) && ticket.replies.length > 0 ? (
        <div className="space-y-2">
          {ticket.replies.map((reply, index) => (
            <div key={`${ticket.id}:reply:${reply.id || index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {renderReplyLabel(reply)}
                </p>
                <p className="text-[11px] text-slate-400">{formatCreatedAt(reply.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-slate-800 break-words">{reply.message || 'Brak treści'}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="w-fit rounded-full border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-600">
              Centrum pomocy
            </Badge>
            {isAdmin ? (
              <Badge className="rounded-full bg-violet-600 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white">
                Tryb admina
              </Badge>
            ) : null}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isAdmin ? 'Panel supportu' : 'Sugestie, problemy i support'}
            </h1>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {!isAdmin ? (
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
            ) : null}

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>{isAdmin ? 'Zgłoszenia' : 'Twoje zgłoszenia'}</CardTitle>
                <CardDescription>
                  {isAdmin
                    ? 'Aplikacja sama pilnuje statusów. Odpowiedź admina ustawia ticket jako Odpowiedziano, a nowa wiadomość klienta wraca do W trakcie.'
                    : 'W tym miejscu wracają odpowiedzi i status dalszej obsługi.'}
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

                {isAdmin ? (
                  <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Szukaj po temacie, treści lub mailu"
                        className="pl-9"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | TicketStatus)}
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {loading ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> Ładowanie zgłoszeń...
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
                    Brak zgłoszeń w tej sekcji.
                  </div>
                ) : isAdmin ? (
                  <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-3">
                      {filteredTickets.map((ticket) => {
                        const active = selectedTicket?.id === ticket.id;
                        return (
                          <button
                            key={ticket.id}
                            type="button"
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className={`w-full rounded-2xl border p-4 text-left transition ${
                              active
                                ? 'border-blue-300 bg-blue-50/70'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 break-words">{ticket.subject}</p>
                                <p className="mt-1 text-xs text-slate-500 break-words">{ticket.ownerEmail || 'Brak maila'}</p>
                              </div>
                              <Badge variant="outline" className={`rounded-full ${statusClasses(ticket.status)}`}>
                                {statusLabel(ticket.status)}
                              </Badge>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{ticket.message}</p>
                            <p className="mt-3 text-[11px] text-slate-400">{formatCreatedAt(ticket.updatedAt || ticket.createdAt)}</p>
                          </button>
                        );
                      })}
                    </div>

                    {selectedTicket ? (
                      <Card className="border-slate-100">
                        <CardContent className="space-y-4 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold text-slate-900 break-words">{selectedTicket.subject}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                {selectedTicket.ownerEmail || 'Brak maila'} • {formatCreatedAt(selectedTicket.createdAt)}
                              </p>
                            </div>
                            <Badge variant="outline" className={`rounded-full ${statusClasses(selectedTicket.status)}`}>
                              {statusLabel(selectedTicket.status)}
                            </Badge>
                          </div>

                          {renderThread(selectedTicket)}

                          <div className="space-y-2">
                            <Label>Odpowiedź supportu</Label>
                            <textarea
                              value={replyDrafts[selectedTicket.id] || ''}
                              onChange={(e) => updateReplyDraft(selectedTicket.id, e.target.value)}
                              placeholder="Wpisz odpowiedź dla użytkownika"
                              className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              disabled={replyPendingId === selectedTicket.id}
                              onClick={() => handleReply(selectedTicket, 'admin')}
                            >
                              {replyPendingId === selectedTicket.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zapisywanie...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" /> Wyślij odpowiedź
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={statusPendingId === selectedTicket.id || (selectedTicket.status || 'new') === 'closed'}
                              onClick={() => handleCloseTicket(selectedTicket)}
                            >
                              {statusPendingId === selectedTicket.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zamykanie...
                                </>
                              ) : (
                                'Zamknij zgłoszenie'
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTickets.map((ticket) => (
                      <Card key={ticket.id} className="border-slate-100">
                        <CardContent className="space-y-4 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 break-words">{ticket.subject}</p>
                            </div>
                            <div className="shrink-0 space-y-2">
                              <Badge variant="outline" className={`rounded-full ${statusClasses(ticket.status)}`}>
                                {statusLabel(ticket.status)}
                              </Badge>
                              <p className="text-[11px] text-slate-400">{formatCreatedAt(ticket.updatedAt || ticket.createdAt)}</p>
                            </div>
                          </div>

                          {renderThread(ticket)}

                          <div className="space-y-2">
                            <Label>Dopisz odpowiedź</Label>
                            <textarea
                              value={replyDrafts[ticket.id] || ''}
                              onChange={(e) => updateReplyDraft(ticket.id, e.target.value)}
                              placeholder="Dopisz wiadomość do tego zgłoszenia"
                              className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>

                          <Button
                            type="button"
                            disabled={replyPendingId === ticket.id}
                            onClick={() => handleReply(ticket, 'user')}
                          >
                            {replyPendingId === ticket.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zapisywanie...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" /> Dopisz odpowiedź
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {!isAdmin ? (
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
          ) : (
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Jak działają statusy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <p><strong>Nowe</strong> pojawia się po wysłaniu zgłoszenia przez użytkownika.</p>
                  <p><strong>Odpowiedziano</strong> ustawia się automatycznie po odpowiedzi supportu.</p>
                  <p><strong>W trakcie</strong> wraca automatycznie, gdy użytkownik odpisze na odpowiedź lub wznowi zamknięte zgłoszenie.</p>
                  <p><strong>Zamknięte</strong> ustawiasz ręcznie, gdy temat jest domknięty.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
