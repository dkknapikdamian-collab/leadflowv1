import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock3,
  HelpCircle,
  LifeBuoy,
  Lightbulb,
  Loader2,
  Mail,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
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
import '../styles/visual-stage17-support-vnext.css';

type TicketKind = 'suggestion' | 'problem' | 'support';
type TicketStatus = 'new' | 'in_progress' | 'answered' | 'closed';
type TicketReply = { id?: string; authorType?: string; authorLabel?: string; message?: string; createdAt?: any };
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

const SUPPORT_VISUAL_REBUILD_STAGE17 = 'SUPPORT_VISUAL_REBUILD_STAGE17';

const KIND_OPTIONS: Array<{ id: TicketKind; label: string; helper: string; Icon: any }> = [
  {
    id: 'suggestion',
    label: 'Sugestia',
    helper: 'Pomysł na ulepszenie, skrócenie ścieżki albo czytelniejszy widok.',
    Icon: Lightbulb,
  },
  {
    id: 'problem',
    label: 'Problem',
    helper: 'Błąd działania, duplikaty, brak synchronizacji albo coś uszkodzonego.',
    Icon: AlertTriangle,
  },
  {
    id: 'support',
    label: 'Pytanie',
    helper: 'Pytanie jak czegoś użyć albo prośba o pomoc w obsłudze.',
    Icon: LifeBuoy,
  },
];

const STATUS_OPTIONS: Array<{ id: 'all' | TicketStatus; label: string; Icon: any }> = [
  { id: 'all', label: 'Wszystkie', Icon: MessageSquare },
  { id: 'new', label: 'Nowe', Icon: ShieldCheck },
  { id: 'in_progress', label: 'W trakcie', Icon: Clock3 },
  { id: 'answered', label: 'Odpowiedziano', Icon: CheckCircle2 },
  { id: 'closed', label: 'Zamknięte', Icon: Archive },
];

const FAQ_ITEMS = [
  {
    question: 'Jak dodać leada?',
    answer: 'Wejdź w Leady i użyj dodawania nowego kontaktu. Potem ustaw zadanie albo wydarzenie, żeby lead nie zniknął z radarów.',
  },
  {
    question: 'Jak działają zadania?',
    answer: 'Zadania są konkretnymi ruchami do wykonania. Powiąż je z leadem, klientem albo sprawą i pilnuj ich z widoku Dziś.',
  },
  {
    question: 'Jak działa kalendarz?',
    answer: 'Kalendarz pokazuje wydarzenia i terminy. W tym etapie nie obiecujemy synchronizacji Google Calendar, jeśli nie jest jeszcze podpięta.',
  },
  {
    question: 'Jak działa trial?',
    answer: 'Trial pozwala sprawdzić aplikację. Po wygaśnięciu dane zostają, ale dodawanie nowych rekordów może wymagać aktywnego planu.',
  },
  {
    question: 'Co zrobić, gdy coś nie działa?',
    answer: 'Wyślij zgłoszenie z opisem miejsca, kroków i oczekiwanego efektu. Najlepiej dopisz, czy problem był na telefonie czy komputerze.',
  },
];

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function formatCreatedAt(value: any) {
  if (!value) return 'Przed chwilą';
  try {
    if (value?.toDate) return value.toDate().toLocaleString('pl-PL');
    if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000).toLocaleString('pl-PL');
    return new Date(value).toLocaleString('pl-PL');
  } catch {
    return 'Przed chwilą';
  }
}

function getTicketTimestamp(ticket: TicketRow) {
  const updated = ticket.updatedAt ? new Date(ticket.updatedAt).getTime() : 0;
  const created = ticket.createdAt ? new Date(ticket.createdAt).getTime() : 0;
  return Number.isFinite(updated) && updated > 0 ? updated : created;
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

function statusToneClass(status?: string) {
  switch ((status || 'new').toLowerCase()) {
    case 'answered':
      return 'support-status-green';
    case 'closed':
      return 'support-status-muted';
    case 'in_progress':
      return 'support-status-blue';
    default:
      return 'support-status-amber';
  }
}

function kindLabel(kind?: string) {
  return KIND_OPTIONS.find((entry) => entry.id === kind)?.label || 'Zgłoszenie';
}

function renderReplyLabel(reply: TicketReply) {
  if (reply.authorType === 'admin') return 'Support';
  if (reply.authorType === 'user') return 'Ty';
  return reply.authorLabel || 'Wiadomość';
}

function getLastReplyLabel(ticket: TicketRow) {
  const replies = Array.isArray(ticket.replies) ? ticket.replies : [];
  const lastReply = replies[replies.length - 1];
  if (lastReply?.message) return `${renderReplyLabel(lastReply)}: ${lastReply.message}`;
  if (ticket.adminReply) return `Support: ${ticket.adminReply}`;
  return 'Brak odpowiedzi';
}

export default function SupportCenter() {
  const { workspace, isAdmin, loading: workspaceLoading } = useWorkspace();
  const userId = auth.currentUser?.uid || '';
  const userEmail = auth.currentUser?.email || '';

  const [kind, setKind] = useState<TicketKind>('support');
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
    if (!userId || !workspace?.id) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const rows = await fetchSupportRequestsFromSupabase({
        workspaceId: workspace.id,
        includeAll: isAdmin,
        ownerEmail: isAdmin ? undefined : userEmail || undefined,
      });
      const normalized = Array.isArray(rows) ? (rows as TicketRow[]) : [];
      setTickets(normalized.slice().sort((a, b) => getTicketTimestamp(b) - getTicketTimestamp(a)));
    } catch (error: any) {
      console.error('SUPPORT_REQUESTS_LOAD_FAILED', error);
      toast.error('Nie udało się wczytać zgłoszeń pomocy.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, userEmail, userId, workspace?.id]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const ticketCounts = useMemo(() => {
    const byStatus = new Map<string, number>();
    const byKind = new Map<string, number>();

    for (const ticket of tickets) {
      const normalizedStatus = String(ticket.status || 'new');
      byStatus.set(normalizedStatus, (byStatus.get(normalizedStatus) || 0) + 1);
      byKind.set(ticket.kind, (byKind.get(ticket.kind) || 0) + 1);
    }

    return { byStatus, byKind, all: tickets.length };
  }, [tickets]);

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
        getLastReplyLabel(ticket),
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (sending || !userId || !workspace?.id) return;

    if (!subject.trim() || !message.trim()) {
      toast.error('Uzupełnij temat i opis zgłoszenia.');
      return;
    }

    setSending(true);
    try {
      await createSupportRequestInSupabase({
        ownerId: userId,
        ownerEmail: userEmail || null,
        workspaceId: workspace.id,
        kind,
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success('Zgłoszenie wysłane.');
      setSubject('');
      setMessage('');
      await loadTickets();
    } catch (error: any) {
      console.error('SUPPORT_REQUEST_CREATE_FAILED', error);
      toast.error(`Nie udało się wysłać zgłoszenia: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (ticket: TicketRow, actorType: 'admin' | 'user') => {
    const draft = normalizeText(replyDrafts[ticket.id]);

    if (!draft || !workspace?.id) {
      toast.error('Wpisz treść odpowiedzi.');
      return;
    }

    try {
      setReplyPendingId(ticket.id);
      await replyToSupportRequestInSupabase({
        id: ticket.id,
        message: draft,
        actorType,
        workspaceId: workspace.id,
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
    if (!workspace?.id) return;

    try {
      setStatusPendingId(ticket.id);
      await updateSupportRequestStatusInSupabase({
        id: ticket.id,
        status: 'closed',
        workspaceId: workspace.id,
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

  const renderThread = (ticket: TicketRow) => {
    const replies = Array.isArray(ticket.replies) ? ticket.replies : [];

    return (
      <div className="support-thread">
        <article className="support-thread-message">
          <p>{isAdmin ? 'Zgłoszenie klienta' : 'Twoje zgłoszenie'}</p>
          <strong>{ticket.message}</strong>
          <small>{formatCreatedAt(ticket.createdAt)}</small>
        </article>

        {replies.map((reply, index) => (
          <article key={`${ticket.id}:reply:${reply.id || index}`} className="support-thread-message support-thread-reply">
            <p>{renderReplyLabel(reply)}</p>
            <strong>{reply.message || 'Brak treści'}</strong>
            <small>{formatCreatedAt(reply.createdAt)}</small>
          </article>
        ))}

        {!replies.length && !ticket.adminReply ? (
          <article className="support-thread-message support-thread-empty">
            <p>Ostatnia odpowiedź</p>
            <strong>Brak odpowiedzi</strong>
            <small>Support odpowie w tym wątku.</small>
          </article>
        ) : null}
      </div>
    );
  };

  if (workspaceLoading) {
    return (
      <Layout>
        <main className="support-vnext-page">
          <div className="support-loading-card">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ładowanie centrum pomocy...</span>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="support-vnext-page" data-support-stage={SUPPORT_VISUAL_REBUILD_STAGE17}>
        <header className="support-header">
          <div>
            <p className="support-kicker">POMOC</p>
            <h1>Pomoc</h1>
            <p>Zgłoszenia, odpowiedzi i kontakt w jednym miejscu.</p>
          </div>
          <div className="support-header-actions">
            <Button type="button" variant="outline" onClick={() => void loadTickets()}>
              <Search className="h-4 w-4" />
              Odśwież zgłoszenia
            </Button>
          </div>
        </header>

        <section className="support-hero-grid">
          <article className="support-hero-card support-hero-card-blue">
            <MessageSquare className="h-5 w-5" />
            <span>Szybki kontakt</span>
            <strong>Opisz problem albo pytanie</strong>
            <p>Wysyłka zapisuje zgłoszenie w systemie supportu. Nie tworzymy tutaj osobnego mail composera.</p>
          </article>
          <article className="support-hero-card">
            <ShieldCheck className="h-5 w-5" />
            <span>Status zgłoszeń</span>
            <strong>{ticketCounts.all}</strong>
            <p>Wszystkie Twoje zgłoszenia widoczne w tym workspace.</p>
          </article>
          <article className="support-hero-card">
            <Clock3 className="h-5 w-5" />
            <span>W trakcie</span>
            <strong>{ticketCounts.byStatus.get('in_progress') || 0}</strong>
            <p>Tematy, które wymagają dalszej obsługi.</p>
          </article>
        </section>

        <div className="support-shell">
          <section className="support-main-column">
            {!isAdmin ? (
              <section className="support-form-card">
                <div className="support-section-head">
                  <div>
                    <h2>Wyślij zgłoszenie</h2>
                    <p>Wypełnij temat i opis. Im konkretniej opiszesz kroki, tym szybciej da się sprawdzić temat.</p>
                  </div>
                </div>

                <div className="support-kind-grid">
                  {KIND_OPTIONS.map((option) => {
                    const active = option.id === kind;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setKind(option.id)}
                        className={active ? 'support-kind-card support-kind-active' : 'support-kind-card'}
                      >
                        <option.Icon className="h-4 w-4" />
                        <strong>{option.label}</strong>
                        <span>{option.helper}</span>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit} className="support-form">
                  <div className="support-form-field">
                    <Label>Temat</Label>
                    <Input
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      placeholder={
                        kind === 'suggestion'
                          ? 'Np. Przydałby się szybszy skrót do spraw'
                          : kind === 'problem'
                            ? 'Np. Na telefonie nie działa przycisk w zadaniu'
                            : 'Np. Jak najlepiej prowadzić sprawę po leadzie?'
                      }
                    />
                  </div>

                  <div className="support-form-field">
                    <Label>Opis</Label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Opisz, co się dzieje, gdzie kliknąłeś i jaki efekt był oczekiwany."
                      className="support-textarea"
                    />
                  </div>

                  <div className="support-form-note">
                    <Mail className="h-4 w-4" />
                    <span>Kontakt zwrotny: {userEmail || 'konto bez e-maila'}</span>
                  </div>

                  <Button type="submit" disabled={sending || !workspace?.id}>
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Wyślij zgłoszenie
                      </>
                    )}
                  </Button>
                </form>
              </section>
            ) : null}

            <section className="support-tickets-card">
              <div className="support-section-head">
                <div>
                  <h2>{isAdmin ? 'Status zgłoszeń' : 'Twoje zgłoszenia'}</h2>
                  <p>
                    {isAdmin
                      ? 'Lista zgłoszeń z aktualnym statusem i możliwością odpowiedzi.'
                      : 'Tu zobaczysz swoje zgłoszenia, odpowiedzi supportu i ostatnią aktywność.'}
                  </p>
                </div>
              </div>

              <div className="support-filter-row">
                {KIND_OPTIONS.map((option) => (
                  <button key={option.id} type="button" className={kind === option.id ? 'support-filter-active' : ''} onClick={() => setKind(option.id)}>
                    {option.label}
                    <span>{ticketCounts.byKind.get(option.id) || 0}</span>
                  </button>
                ))}
              </div>

              <div className="support-ticket-tools">
                <div className="support-search-field">
                  <Search className="h-4 w-4" />
                  <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Szukaj po temacie, treści albo odpowiedzi..." />
                </div>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | TicketStatus)} className="support-select">
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="support-light-empty">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Ładowanie zgłoszeń...
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="support-light-empty">Brak zgłoszeń w tej sekcji.</div>
              ) : (
                <div className="support-ticket-grid">
                  <div className="support-ticket-list">
                    {filteredTickets.map((ticket) => {
                      const selected = selectedTicket?.id === ticket.id;
                      return (
                        <button
                          key={ticket.id}
                          type="button"
                          className={selected ? 'support-ticket-row support-ticket-selected' : 'support-ticket-row'}
                          onClick={() => setSelectedTicketId(ticket.id)}
                        >
                          <div>
                            <span className="support-ticket-kind">{kindLabel(ticket.kind)}</span>
                            <h3>{ticket.subject}</h3>
                            <p>{getLastReplyLabel(ticket)}</p>
                            <small>{formatCreatedAt(ticket.updatedAt || ticket.createdAt)}</small>
                          </div>
                          <strong className={`support-status-pill ${statusToneClass(ticket.status)}`}>{statusLabel(ticket.status)}</strong>
                        </button>
                      );
                    })}
                  </div>

                  {selectedTicket ? (
                    <article className="support-ticket-detail">
                      <div className="support-ticket-detail-head">
                        <div>
                          <span>{kindLabel(selectedTicket.kind)}</span>
                          <h3>{selectedTicket.subject}</h3>
                          <p>{selectedTicket.ownerEmail || userEmail || 'Brak e-maila'}</p>
                        </div>
                        <strong className={`support-status-pill ${statusToneClass(selectedTicket.status)}`}>{statusLabel(selectedTicket.status)}</strong>
                      </div>

                      {renderThread(selectedTicket)}

                      <div className="support-form-field">
                        <Label>{isAdmin ? 'Odpowiedź supportu' : 'Dopisz odpowiedź'}</Label>
                        <textarea
                          value={replyDrafts[selectedTicket.id] || ''}
                          onChange={(event) => updateReplyDraft(selectedTicket.id, event.target.value)}
                          placeholder={isAdmin ? 'Wpisz odpowiedź dla użytkownika.' : 'Dopisz wiadomość do zgłoszenia.'}
                          className="support-textarea support-reply-textarea"
                        />
                      </div>

                      <div className="support-ticket-actions">
                        <Button type="button" disabled={replyPendingId === selectedTicket.id} onClick={() => handleReply(selectedTicket, isAdmin ? 'admin' : 'user')}>
                          {replyPendingId === selectedTicket.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Zapisywanie...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              {isAdmin ? 'Wyślij odpowiedź' : 'Dopisz odpowiedź'}
                            </>
                          )}
                        </Button>

                        {isAdmin ? (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={statusPendingId === selectedTicket.id || (selectedTicket.status || 'new') === 'closed'}
                            onClick={() => handleCloseTicket(selectedTicket)}
                          >
                            Zamknij zgłoszenie
                          </Button>
                        ) : null}
                      </div>
                    </article>
                  ) : null}
                </div>
              )}
            </section>

            <section className="support-faq-card">
              <div className="support-section-head">
                <div>
                  <h2>Najczęstsze pytania</h2>
                  <p>Krótkie odpowiedzi bez ściany tekstu.</p>
                </div>
              </div>
              <div className="support-faq-grid">
                {FAQ_ITEMS.map((item) => (
                  <article key={item.question} className="support-faq-item">
                    <HelpCircle className="h-4 w-4" />
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="support-right-rail" aria-label="Panel pomocy">
            <section className="right-card support-right-card">
              <div className="support-right-title">
                <MessageSquare className="h-4 w-4" />
                <h2>Szybkie linki</h2>
              </div>
              <div className="support-right-list">
                <button type="button" onClick={() => setKind('support')}>Zadaj pytanie</button>
                <button type="button" onClick={() => setKind('problem')}>Zgłoś problem</button>
                <button type="button" onClick={() => setKind('suggestion')}>Dodaj sugestię</button>
              </div>
            </section>

            <section className="right-card support-right-card">
              <div className="support-right-title">
                <Mail className="h-4 w-4" />
                <h2>Kontakt</h2>
              </div>
              <p>{userEmail || 'Brak e-maila konta'}</p>
              <small>Odpowiedzi wracają do listy zgłoszeń w aplikacji. Jeżeli backend tylko forwarduje wiadomość, formularz nadal zapisuje jasny kontekst zgłoszenia.</small>
            </section>

            <section className="right-card support-right-card">
              <div className="support-right-title">
                <ShieldCheck className="h-4 w-4" />
                <h2>Status aplikacji</h2>
              </div>
              <p>Aplikacja działa lokalnie w Twoim workspace.</p>
              <small>Jeśli coś nie działa, sprawdź najpierw trasę, przeglądarkę i czy problem powtarza się po odświeżeniu.</small>
            </section>

            <section className="right-card support-right-card">
              <div className="support-right-title">
                <Wrench className="h-4 w-4" />
                <h2>Co sprawdzić najpierw</h2>
              </div>
              <ul>
                <li>Czy jesteś w dobrym workspace.</li>
                <li>Czy rekord nie jest już w sprawie.</li>
                <li>Czy problem jest tylko na mobile.</li>
                <li>Czy build/deploy nie jest w trakcie.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
