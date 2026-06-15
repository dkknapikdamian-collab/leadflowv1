import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Archive, CheckCircle2, Clock3, HelpCircle, LifeBuoy, Lightbulb, Loader2, Mail, MessageSquare, Search, Send, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
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
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-unified-page-canvas-stage211c.css';
import '../styles/closeflow-canvas-source-truth-stage211e.css';
import '../styles/closeflow-canvas-runtime-source-truth-stage211j.css';

type TicketKind = 'suggestion' | 'problem' | 'support';
type TicketKindFilter = 'all' | TicketKind;
type TicketStatus = 'new' | 'in_progress' | 'answered' | 'closed';
type TicketReply = { id?: string; authorType?: string; authorLabel?: string; message?: string; createdAt?: any };
type TicketRow = {
  id: string;
  kind: TicketKind | string;
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

type SupportKindOption = {
  id: TicketKind;
  label: string;
  shortLabel: string;
  helper: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  Icon: any;
};

type SuggestedTicket = {
  kind: TicketKind;
  title: string;
  message: string;
  Icon: any;
};

const SUPPORT_VISUAL_REBUILD_STAGE17 = 'SUPPORT_VISUAL_REBUILD_STAGE17';
const CLOSEFLOW_FB1_SUPPORT_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';
const SUPPORT_RIGHT_RAIL_REMOVED_STAGE180H = 'support right rail removed from visible support page';
void SUPPORT_RIGHT_RAIL_REMOVED_STAGE180H;
const SUPPORT_REQUESTS_OPERATIONAL_PAGE_STAGE180 = 'SUPPORT_REQUESTS_OPERATIONAL_PAGE_STAGE180';
const SUPPORT_REQUESTS_VISIBLE_COPY_FIX_STAGE180E = 'SUPPORT_REQUESTS_VISIBLE_COPY_FIX_STAGE180E';
const SUPPORT_REQUESTS_SIDEBAR_HEADER_COPY_FIX_STAGE180F = 'SUPPORT_REQUESTS_SIDEBAR_HEADER_COPY_FIX_STAGE180F';
const SUPPORT_REQUESTS_POLISH_COPY_GUARD_STAGE180B = 'SUPPORT_REQUESTS_POLISH_COPY_GUARD_STAGE180B';
void CLOSEFLOW_FB1_SUPPORT_COPY_NOISE_CLEANUP;

const KIND_OPTIONS: SupportKindOption[] = [
  {
    id: 'problem',
    label: 'Problem z aplikacją',
    shortLabel: 'Problem',
    helper: 'Coś nie działa, nie zapisuje się, znika, blokuje pracę albo wygląda na błąd.',
    subjectPlaceholder: 'Np. Nie mogę wejść w szczegóły sprawy klienta',
    messagePlaceholder: 'Napisz, gdzie byłeś, co kliknąłeś, co powinno się stać i co stało się naprawdę.',
    Icon: AlertTriangle,
  },
  {
    id: 'suggestion',
    label: 'Sugestia poprawki',
    shortLabel: 'Sugestia',
    helper: 'Pomysł na zmianę widoku, skrót, automatyzację albo uproszczenie pracy.',
    subjectPlaceholder: 'Np. Przydałby się szybszy skrót do spraw',
    messagePlaceholder: 'Opisz zmianę, po co jest potrzebna i w którym miejscu aplikacji ma pomóc.',
    Icon: Lightbulb,
  },
  {
    id: 'support',
    label: 'Pytanie / pomoc',
    shortLabel: 'Pytanie',
    helper: 'Pytanie jak czegoś użyć albo prośba o wyjaśnienie działania aplikacji.',
    subjectPlaceholder: 'Np. Jak najlepiej prowadzić sprawę po leadzie?',
    messagePlaceholder: 'Opisz, czego nie jesteś pewien i jaki efekt chcesz uzyskać.',
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

const SUGGESTED_TICKETS: SuggestedTicket[] = [
  {
    kind: 'problem',
    title: '',
    message: 'Opisz nazwę widoku, przycisk, kroki przed błędem i komunikat z ekranu albo konsoli.',
    Icon: Wrench,
  },
  {
    kind: 'problem',
    title: '',
    message: 'Napisz, który widok był pusty, czy pomaga przejście do innej zakładki i czy problem wraca po F5.',
    Icon: AlertTriangle,
  },
  {
    kind: 'suggestion',
    title: '',
    message: 'Opisz, co spowalnia pracę, jak powinien wyglądać docelowy ruch i jaki problem ma zniknąć.',
    Icon: Sparkles,
  },
  {
    kind: 'support',
    title: '',
    message: 'Napisz, jaki efekt chcesz uzyskać. Support odpowie instrukcją albo dopisze brak w aplikacji.',
    Icon: HelpCircle,
  },
];

const FAQ_ITEMS: Array<{ question: string; answer: string }> = [];

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function safeDateFromUnknown(value: any) {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatCreatedAt(value: any) {
  const date = safeDateFromUnknown(value);
  return date ? date.toLocaleString('pl-PL') : 'Przed chwilą';
}

function formatSupportStatus(status: unknown) {
  const value = String(status || '').toLowerCase();
  if (value === 'open' || value === 'new') return 'Nowe';
  if (value === 'in_progress' || value === 'pending') return 'W trakcie';
  if (value === 'answered' || value === 'resolved') return 'Odpowiedziane';
  if (value === 'closed') return 'Zamknięte';
  return 'Status nieznany';
}

function getTicketTimestamp(ticket: TicketRow) {
  const updated = safeDateFromUnknown(ticket.updatedAt)?.getTime() || 0;
  const created = safeDateFromUnknown(ticket.createdAt)?.getTime() || 0;
  return updated > 0 ? updated : created;
}

function statusLabel(status?: string) {
  switch ((status || 'new').toLowerCase()) {
    case 'answered':
    case 'resolved':
      return 'Odpowiedziano';
    case 'closed':
      return 'Zamknięte';
    case 'in_progress':
    case 'pending':
      return 'W trakcie';
    default:
      return 'Nowe';
  }
}

function statusToneClass(status?: string) {
  switch ((status || 'new').toLowerCase()) {
    case 'answered':
    case 'resolved':
      return 'support-status-green';
    case 'closed':
      return 'support-status-muted';
    case 'in_progress':
    case 'pending':
      return 'support-status-blue';
    default:
      return 'support-status-amber';
  }
}

function kindOption(kind?: string) {
  return KIND_OPTIONS.find((entry) => entry.id === kind) || KIND_OPTIONS[2];
}

function kindLabel(kind?: string) {
  return kindOption(kind).shortLabel;
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

  const [composeKind, setComposeKind] = useState<TicketKind>('problem');
  const [kindFilter, setKindFilter] = useState<TicketKindFilter>('all');
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
      toast.error('Nie udało się wczytać zgłoszeń.');
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
      const normalizedStatus = String(ticket.status || 'new').toLowerCase();
      const normalizedKind = String(ticket.kind || 'support').toLowerCase();
      byStatus.set(normalizedStatus, (byStatus.get(normalizedStatus) || 0) + 1);
      byKind.set(normalizedKind, (byKind.get(normalizedKind) || 0) + 1);
    }

    return { byStatus, byKind, all: tickets.length };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (kindFilter !== 'all' && ticket.kind !== kindFilter) return false;
      if (statusFilter !== 'all' && (ticket.status || 'new') !== statusFilter) return false;
      if (!q) return true;

      const haystack = [
        ticket.subject,
        ticket.message,
        ticket.ownerEmail || '',
        kindLabel(ticket.kind),
        getLastReplyLabel(ticket),
        ...(Array.isArray(ticket.replies) ? ticket.replies.map((entry) => entry.message || '') : []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [kindFilter, searchQuery, statusFilter, tickets]);

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

  const currentKind = kindOption(composeKind);
  const inProgressCount = (ticketCounts.byStatus.get('in_progress') || 0) + (ticketCounts.byStatus.get('pending') || 0);

  const updateReplyDraft = (ticketId: string, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [ticketId]: value }));
  };

  const applySuggestion = (suggestion: SuggestedTicket) => {
    setComposeKind(suggestion.kind);
    setSubject((prev) => prev || suggestion.title);
    setMessage((prev) => prev || suggestion.message);
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
        kind: composeKind,
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success('Zgłoszenie wysłane.');
      setSubject('');
      setMessage('');
      setKindFilter('all');
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
          <p>{isAdmin ? 'Zgłoszenie użytkownika' : 'Twoje zgłoszenie'}</p>
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
            <span>Ładowanie zgłoszeń...</span>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="support-vnext-page" data-support-stage={SUPPORT_VISUAL_REBUILD_STAGE17} data-support-requests-stage={SUPPORT_REQUESTS_OPERATIONAL_PAGE_STAGE180} data-support-visible-copy-stage={SUPPORT_REQUESTS_VISIBLE_COPY_FIX_STAGE180E} data-support-sidebar-header-copy-stage={SUPPORT_REQUESTS_SIDEBAR_HEADER_COPY_FIX_STAGE180F} data-support-copy-stage={SUPPORT_REQUESTS_POLISH_COPY_GUARD_STAGE180B}>
        <CloseFlowPageHeaderV2
          pageKey="support"
          actions={
            <div className="support-header-actions">
              <Button type="button" variant="outline" onClick={() => void loadTickets()}>
                <Search className="h-4 w-4" />
                Odśwież zgłoszenia
              </Button>
            </div>
          }
        />


        <div className={isAdmin ? 'support-shell support-shell-admin' : 'support-shell'}>
          <section className="support-main-column">
            <section className="support-form-card" data-support-compose-card="true">
              <div className="support-section-head">
                <div>
                  <h2>Zgłoszenie / sugestia</h2>
                </div>
              </div>

              <div className="support-kind-grid" aria-label="Typ zgłoszenia">
                {KIND_OPTIONS.map((option) => {
                  const active = option.id === composeKind;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setComposeKind(option.id)}
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
                    placeholder={currentKind.subjectPlaceholder}
                  />
                </div>

                <div className="support-form-field">
                  <Label>Opis</Label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={currentKind.messagePlaceholder}
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

            <section className="support-tickets-card" data-support-ticket-list="true">
              <div className="support-section-head">
                <div>
                  <h2>{isAdmin ? 'Wszystkie zgłoszenia' : 'Twoje zgłoszenia'}</h2>
                </div>
              </div>

              <div className="support-filter-row" aria-label="Filtr typu zgłoszenia">
                <button type="button" className={kindFilter === 'all' ? 'support-filter-active' : ''} onClick={() => setKindFilter('all')}>
                  Wszystkie
                  <span>{ticketCounts.all}</span>
                </button>
                {KIND_OPTIONS.map((option) => (
                  <button key={option.id} type="button" className={kindFilter === option.id ? 'support-filter-active' : ''} onClick={() => setKindFilter(option.id)}>
                    {option.shortLabel}
                    <span>{ticketCounts.byKind.get(option.id) || 0}</span>
                  </button>
                ))}
              </div>

              <div className="support-ticket-tools">
                <div className="support-search-field">
                  <Search className="h-4 w-4" />
                  <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Szukaj po temacie, treści, typie albo odpowiedzi..." />
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
                <div className="support-light-empty">Brak zgłoszeń dla wybranych filtrów.</div>
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
                          <span>{kindOption(selectedTicket.kind).label}</span>
                          <h3>{selectedTicket.subject}</h3>
                          <p>{selectedTicket.ownerEmail || userEmail || 'Brak e-maila'} · {formatSupportStatus(selectedTicket.status)}</p>
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


          {isAdmin ? (
            <aside className="support-admin-rail" aria-label="Panel obsługi zgłoszeń" data-support-admin-rail="true">
              <section className="support-admin-card">
                <div className="support-admin-title">
                  <ShieldCheck className="h-4 w-4" />
                  <h2>Panel obsługi</h2>
                </div>
                <div className="support-admin-stats">
                  <button type="button" onClick={() => setStatusFilter('new')}>
                    <span>Nowe</span>
                    <strong>{ticketCounts.byStatus.get('new') || 0}</strong>
                  </button>
                  <button type="button" onClick={() => setStatusFilter('in_progress')}>
                    <span>W trakcie</span>
                    <strong>{ticketCounts.byStatus.get('in_progress') || 0}</strong>
                  </button>
                  <button type="button" onClick={() => setStatusFilter('answered')}>
                    <span>Odpowiedziane</span>
                    <strong>{ticketCounts.byStatus.get('answered') || 0}</strong>
                  </button>
                </div>
              </section>

              <section className="support-admin-card">
                <div className="support-admin-title">
                  <Clock3 className="h-4 w-4" />
                  <h2>Ostatnia aktywność</h2>
                </div>
                {tickets[0] ? (
                  <article className="support-admin-latest">
                    <strong>{tickets[0].subject || 'Zgłoszenie'}</strong>
                    <span>{kindLabel(tickets[0].kind)}</span>
                    <small>{formatCreatedAt(tickets[0].updatedAt || tickets[0].createdAt)}</small>
                  </article>
                ) : (
                  <p className="support-admin-empty">Brak zgłoszeń w tym workspace.</p>
                )}
              </section>

              <section className="support-admin-card">
                <div className="support-admin-title">
                  <Archive className="h-4 w-4" />
                  <h2>Szybkie filtry</h2>
                </div>
                <div className="support-admin-filter-list">
                  <button type="button" onClick={() => setStatusFilter('all')}>Wszystkie</button>
                  <button type="button" onClick={() => setStatusFilter('new')}>Nowe</button>
                  <button type="button" onClick={() => setStatusFilter('in_progress')}>W trakcie</button>
                  <button type="button" onClick={() => setStatusFilter('answered')}>Odpowiedziane</button>
                  <button type="button" onClick={() => setStatusFilter('closed')}>Zamknięte</button>
                </div>
              </section>
            </aside>
          ) : null}
        </div>
      </main>
    </Layout>
  );
}
