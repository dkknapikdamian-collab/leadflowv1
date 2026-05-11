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

import '../styles/closeflow-page-header-card-source-truth.css';
import { PAGE_HEADER_CONTENT } from '../lib/page-header-content';
function formatSupportStatus(status: unknown) {
  const value = String(status || '').toLowerCase();
  if (value === 'open' || value === 'new') return 'Nowe';
  if (value === 'in_progress' || value === 'pending') return 'W trakcie';
  if (value === 'answered' || value === 'resolved') return 'Odpowiedziane';
  if (value === 'closed') return 'Zamknięte';
  return 'Status nieznany';
}

function formatSupportTicketDate(value: unknown) {
  if (!value) return 'Brak daty';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function asSupportTicketList(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

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
const CLOSEFLOW_FB1_SUPPORT_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';

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
    answer: 'Zapisz zgłoszenie z opisem miejsca, kroków i oczekiwanego efektu. Najlepiej dopisz, czy problem był na telefonie czy komputerze.',
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
      toast.success(actorType === 'admin' ? 'Odpowiedź supportu zapisana.' : 'Odpowiedź została zapisana.');
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
        <header data-cf-page-header="true" className="cf-page-header support-header">
          <div>
            <p className="support-kicker">POMOC</p>
            <h1 data-cf-page-header-part="title">{PAGE_HEADER_CONTENT.support.title}</h1>
              <p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.support.description}</p>
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
          </article>
          <article className="support-hero-card">
            <ShieldCheck className="h-5 w-5" />
            <span>Status zgłoszeń</span>
            <strong>{ticketCounts.all}</strong>
          </article>
          <article className="support-hero-card">
            <Clock3 className="h-5 w-5" />
            <span>W trakcie</span>
            <strong>{ticketCounts.byStatus.get('in_progress') || 0}</strong>
          </article>
        </section>

        <div className="support-shell">
          <section className="support-main-column">
            {!isAdmin ? (
              <section className="support-form-card">
                <div className="support-section-head">
                  <div>
                    <h2>Zapisz zgłoszenie</h2>
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
                        Zapisywanie...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Zapisz zgłoszenie
                      </>
                    )}
                  </Button>
                </form>

        <section className="support-ticket-list-card" data-support-ticket-list="true">
          <header>
            <h2>Moje zgłoszenia</h2>
            <p>Status, odpowiedź i ostatnia aktualizacja.</p>
          </header>

          {asSupportTicketList(tickets).length > 0 ? (
            <div className="support-ticket-list">
              {asSupportTicketList(tickets).map((ticket: any) => {
                const title = ticket.title || ticket.subject || 'Zgłoszenie';
                const message = ticket.message || ticket.description || ticket.body || '';
                const answer = ticket.answer || ticket.response || ticket.reply || ticket.adminResponse || ticket.lastReply || '';
                const updatedAt = ticket.updatedAt || ticket.updated_at || ticket.createdAt || ticket.created_at;
                return (
                  <article className="support-ticket-row" key={ticket.id || title || updatedAt}>
                    <div className="support-ticket-main">
                      <strong>{title}</strong>
                      {message ? <p>{message}</p> : null}
                    </div>
                    <div className="support-ticket-meta">
                      <span className="support-ticket-status">{formatSupportStatus(ticket.status)}</span>
                      <small>{formatSupportTicketDate(updatedAt)}</small>
                    </div>
                    {answer ? (
                      <div className="support-ticket-answer">
                        <strong>Odpowiedź</strong>
                        <p>{answer}</p>
                      </div>
                    ) : (
                      <p className="support-ticket-no-answer">Brak odpowiedzi.</p>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="support-ticket-empty">
              <strong>Nie masz jeszcze zgłoszeń.</strong>
              <p>Po wysłaniu formularza zgłoszenie pojawi się tutaj ze statusem.</p>
            </div>
          )}
        </section>
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
                              {isAdmin ? 'Zapisz odpowiedź' : 'Dopisz odpowiedź'}
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

            
          </section>
        </div>
      </main>
    </Layout>
  );
}
