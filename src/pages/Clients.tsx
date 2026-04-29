import { useCallback, useEffect, useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus, RotateCcw, Search, Trash2, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { requireWorkspaceId } from '../lib/workspace-context';
import { createClientInSupabase, fetchCasesFromSupabase, fetchClientsFromSupabase, fetchLeadsFromSupabase, fetchPaymentsFromSupabase, updateClientInSupabase } from '../lib/supabase-fallback';

type ClientRecord = {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  archivedAt?: string | null;
};

export default function Clients() {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPending, setCreatePending] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '' });

  const reload = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [clientRows, leadRows, caseRows, paymentRows] = await Promise.all([
        fetchClientsFromSupabase(),
        fetchLeadsFromSupabase().catch(() => []),
        fetchCasesFromSupabase().catch(() => []),
        fetchPaymentsFromSupabase().catch(() => []),
      ]);
      setClients(clientRows as ClientRecord[]);
      setLeads(leadRows as any[]);
      setCases(caseRows as any[]);
      setPayments(paymentRows as any[]);
    } catch (error: any) {
      toast.error(`Błąd odczytu klientów: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void reload();
  }, [reload, workspace?.id, workspaceLoading]);

  const activeCount = useMemo(() => clients.filter((client) => !client.archivedAt).length, [clients]);
  const archivedCount = useMemo(() => clients.filter((client) => Boolean(client.archivedAt)).length, [clients]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients
      .filter((client) => (showArchived ? Boolean(client.archivedAt) : !client.archivedAt))
      .filter((client) => {
        if (!query) return true;
        return [client.name, client.company, client.email, client.phone].some((entry) => String(entry || '').toLowerCase().includes(query));
      })
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pl'));
  }, [clients, search, showArchived]);

  const countersByClientId = useMemo(() => {
    const map = new Map<string, { leads: number; cases: number; payments: number }>();
    const touch = (clientId: string) => {
      if (!map.has(clientId)) map.set(clientId, { leads: 0, cases: 0, payments: 0 });
      return map.get(clientId)!;
    };
    for (const lead of leads) {
      const clientId = String(lead.clientId || '');
      if (!clientId) continue;
      touch(clientId).leads += 1;
    }
    for (const caseRecord of cases) {
      const clientId = String(caseRecord.clientId || '');
      if (!clientId) continue;
      touch(clientId).cases += 1;
    }
    for (const payment of payments) {
      const clientId = String(payment.clientId || '');
      if (!clientId) continue;
      touch(clientId).payments += 1;
    }
    return map;
  }, [cases, leads, payments]);

  const clientsWithCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) > 0).length,
    [clients, countersByClientId],
  );
  const clientsWithoutCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) === 0).length,
    [clients, countersByClientId],
  );
  const relationValue = useMemo(
    () => clients.filter((client) => !client.archivedAt).reduce((sum, client) => sum + Number(countersByClientId.get(client.id)?.payments || 0), 0),
    [clients, countersByClientId],
  );
  const staleClients = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.leads || 0) === 0).length,
    [clients, countersByClientId],
  );

  const followupCandidates = useMemo(
    () =>
      clients
        .filter((client) => {
          if (client.archivedAt) return false;
          const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
          return counters.cases === 0 || counters.leads === 0;
        })
        .slice(0, 5),
    [clients, countersByClientId],
  );

  const handleCreateClient = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }
    if (!newClient.name.trim()) {
      toast.error('Podaj nazwę klienta.');
      return;
    }
    if (!workspace?.id) {
      toast.error('Kontekst workspace nie jest jeszcze gotowy.');
      return;
    }
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) {
      toast.error('Kontekst workspace nie jest jeszcze gotowy.');
      return;
    }
    try {
      setCreatePending(true);
      await createClientInSupabase({
        ...newClient,
        workspaceId,
      });
      toast.success('Klient dodany');
      setIsCreateOpen(false);
      setNewClient({ name: '', company: '', email: '', phone: '' });
      await reload();
    } catch (error: any) {
      toast.error(`Błąd zapisu klienta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setCreatePending(false);
    }
  };

  const handleArchiveClient = async (
    event: MouseEvent<HTMLButtonElement>,
    client: ClientRecord,
    counters: { leads: number; cases: number; payments: number },
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const relationCount = counters.leads + counters.cases + counters.payments;
    const relationText = relationCount > 0
      ? '\n\nTen klient ma powiązania: leady ' + counters.leads + ', sprawy ' + counters.cases + ', rozliczenia ' + counters.payments + '. Rekord zniknie z aktywnej listy, ale dane nie zostaną trwale skasowane.'
      : '\n\nRekord zniknie z aktywnej listy, ale będzie można go przywrócić z kosza.';

    if (!window.confirm('Przenieść klienta do kosza: ' + (client.name || 'Klient') + '?' + relationText)) return;

    try {
      setArchivePendingId(client.id);
      await updateClientInSupabase({ id: client.id, archivedAt: new Date().toISOString() });
      toast.success('Klient przeniesiony do kosza');
      await reload();
    } catch (error: any) {
      toast.error('Błąd przenoszenia klienta do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleRestoreClient = async (event: MouseEvent<HTMLButtonElement>, client: ClientRecord) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    if (!window.confirm('Przywrócić klienta do aktywnej listy: ' + (client.name || 'Klient') + '?')) return;

    try {
      setArchivePendingId(client.id);
      await updateClientInSupabase({ id: client.id, archivedAt: null });
      toast.success('Klient przywrócony');
      await reload();
    } catch (error: any) {
      toast.error('Błąd przywracania klienta: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  return (
    <Layout>
      <div className="cf-html-view main-clients-html" data-clients-real-view="true">
        <div className="page-head">
          <div>
            <span className="kicker">Baza relacji</span>
            <h1>Klienci</h1>
            <p className="lead-copy">Lista klientów nie powinna dublować pracy ze spraw. To kartoteka osób i szybkie przejście do aktywnej sprawy.</p>
          </div>
          <div className="head-actions">
            <Button type="button" variant="outline" className="btn soft-blue">? Zapytaj AI</Button>
            <Button type="button" variant="outline" className="btn" onClick={() => setShowArchived((current) => !current)}>
              {showArchived ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
              {showArchived ? 'Pokaż aktywnych' : 'Kosz'}
              <span className="pill">{showArchived ? activeCount : archivedCount}</span>
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn primary" disabled={!workspace?.id}><Plus className="w-4 h-4" /> Dodaj klienta</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Nowy klient</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateClient} className="space-y-3 py-2">
                  <div className="space-y-1"><Label>Nazwa</Label><Input value={newClient.name} onChange={(event) => setNewClient((prev) => ({ ...prev, name: event.target.value }))} required /></div>
                  <div className="space-y-1"><Label>Firma</Label><Input value={newClient.company} onChange={(event) => setNewClient((prev) => ({ ...prev, company: event.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>E-mail</Label><Input type="email" value={newClient.email} onChange={(event) => setNewClient((prev) => ({ ...prev, email: event.target.value }))} /></div>
                    <div className="space-y-1"><Label>Telefon</Label><Input value={newClient.phone} onChange={(event) => setNewClient((prev) => ({ ...prev, phone: event.target.value }))} /></div>
                  </div>
                  <DialogFooter><Button type="submit" disabled={createPending}>{createPending ? 'Zapisywanie...' : 'Utwórz klienta'}</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid-4">
          <button type="button" className={`metric ${!showArchived ? 'active' : ''}`} onClick={() => setShowArchived(false)}>
            <div><label>Aktywni</label><strong>{activeCount}</strong><div className="hint">z otwartą sprawą</div></div>
          </button>
          <button type="button" className="metric">
            <div><label>Bez sprawy</label><strong>{clientsWithoutCases}</strong><div className="hint">tylko kontakt</div></div>
          </button>
          <button type="button" className="metric">
            <div><label>Wartość</label><strong>{relationValue.toLocaleString()} PLN</strong><div className="hint">w relacjach</div></div>
          </button>
          <button type="button" className="metric">
            <div><label>Bez ruchu</label><strong>{staleClients}</strong><div className="hint">do sprawdzenia</div></div>
          </button>
        </div>

        <div className="layout-list">
          <div className="stack">
            <div className="search">
              <span aria-hidden="true"><Search className="w-4 h-4" /></span>
              <Input placeholder={showArchived ? 'Szukaj w koszu klientów...' : 'Szukaj klienta, telefonu, maila, firmy albo sprawy...'} value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>

            {loading ? (
              <div className="table-card"><div className="row row-empty"><span className="index"><Loader2 className="w-4 h-4 animate-spin" /></span><span><span className="title">Ładowanie klientów</span><span className="sub">Pobieram dane z aplikacji.</span></span></div></div>
            ) : filtered.length === 0 ? (
              <div className="table-card"><div className="row row-empty"><span className="index">0</span><span><span className="title">{showArchived ? 'Kosz klientów jest pusty.' : 'Brak klientów do wyświetlenia.'}</span></span></div></div>
            ) : (
              <div className="table-card">
                {filtered.map((client, index) => {
                  const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
                  const isArchived = Boolean(client.archivedAt);
                  return (
                    <div key={client.id} className="row client-row">
                      <span className="index">{index + 1}</span>
                      <span className="lead-main-cell min-w-0">
                        <Link to={`/clients/${client.id}`} className="title">{client.name || 'Klient'}</Link>
                        <span className="sub">{client.company || 'Bez firmy'} · {client.email || 'brak e-maila'} · {client.phone || 'brak telefonu'}</span>
                        <span className="statusline">
                          {isArchived ? <span className="pill amber">W koszu</span> : <span className="pill green">Aktywna sprawa</span>}
                          <span className="pill blue">Leady: {counters.leads}</span>
                          <span className="pill">Ostatni kontakt: {counters.payments > 0 ? 'jest' : 'brak'}</span>
                        </span>
                      </span>
                      <span className="lead-value-cell"><span className="mini">Sprawy</span><strong>{counters.cases}</strong></span>
                      <span className="lead-action-cell"><span className="mini">Następny ruch</span><strong>{counters.cases > 0 ? 'W obsłudze' : 'Jutro'}</strong></span>
                      <span className="lead-actions">
                        <Link to={`/clients/${client.id}`} className="btn ghost" aria-label={`Otwórz klienta ${client.name || ''}`}><UserRound className="h-4 w-4" /></Link>
                        <button
                          type="button"
                          aria-label={isArchived ? 'Przywróć klienta' : 'Przenieś klienta do kosza'}
                          title={isArchived ? 'Przywróć klienta' : 'Przenieś klienta do kosza'}
                          disabled={archivePendingId === client.id}
                          onClick={(event) => isArchived ? handleRestoreClient(event, client) : handleArchiveClient(event, client, counters)}
                          className="btn ghost"
                        >
                          {archivePendingId === client.id ? <Loader2 className="h-4 w-4 animate-spin" /> : isArchived ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="clients-right-rail">
            <aside className="right-card">
              <div className="panel-head"><div><h3>Filtry proste</h3><p>Bez przesady, tylko najpotrzebniejsze.</p></div></div>
              <div className="quick-list">
                <button type="button" onClick={() => setShowArchived(false)}><span>Aktywni</span><strong>{activeCount}</strong></button>
                <button type="button" onClick={() => setShowArchived(false)}><span>Bez sprawy</span><strong>{clientsWithoutCases}</strong></button>
                <button type="button" onClick={() => setShowArchived(false)}><span>Bez ruchu</span><strong>{staleClients}</strong></button>
                <button type="button" onClick={() => setShowArchived(true)}><span>Kosz</span><strong>{archivedCount}</strong></button>
              </div>
            </aside>

            <aside className="right-card">
              <div className="panel-head"><div><h3>Klienci do uwagi</h3><p>Relacje bez pełnego spięcia lead/sprawa.</p></div></div>
              <div className="quick-list">
                {followupCandidates.length ? followupCandidates.map((client) => {
                  const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
                  return (
                    <Link key={client.id} to={`/clients/${client.id}`}>
                      <span><strong>{client.name || 'Klient'}</strong><small>Leady {counters.leads} · Sprawy {counters.cases}</small></span>
                      <UserRound className="h-4 w-4" />
                    </Link>
                  );
                }) : <div className="note">Brak klientów wymagających natychmiastowej uwagi.</div>}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
