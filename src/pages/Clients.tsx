import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Phone, Plus, Search, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { createClientInSupabase, fetchCasesFromSupabase, fetchClientsFromSupabase, fetchLeadsFromSupabase, fetchPaymentsFromSupabase } from '../lib/supabase-fallback';

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPending, setCreatePending] = useState(false);
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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients
      .filter((client) => !client.archivedAt)
      .filter((client) => {
        if (!query) return true;
        return [client.name, client.company, client.email, client.phone].some((entry) => String(entry || '').toLowerCase().includes(query));
      })
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pl'));
  }, [clients, search]);

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
    try {
      setCreatePending(true);
      await createClientInSupabase({
        ...newClient,
        workspaceId: workspace.id,
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

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Klienci</h1>
            <p className="text-slate-500">Wspólny rekord klienta w tle: leady, sprawy i rozliczenia w jednym miejscu.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> Dodaj klienta</Button>
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
        </header>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Szukaj klienta..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        {loading ? (
          <Card><CardContent className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-slate-500">Brak klientów do wyświetlenia.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((client) => {
              const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
              return (
                <Link key={client.id} to={`/clients/${client.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{client.name || 'Klient'}</p>
                          <p className="text-sm text-slate-500 truncate">{client.company || 'Bez firmy'}</p>
                        </div>
                        <UserRound className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p className="flex items-center gap-2 truncate"><Mail className="w-3.5 h-3.5" /> {client.email || 'Brak e-maila'}</p>
                        <p className="flex items-center gap-2 truncate"><Phone className="w-3.5 h-3.5" /> {client.phone || 'Brak telefonu'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Leady: {counters.leads}</Badge>
                        <Badge variant="outline">Sprawy: {counters.cases}</Badge>
                        <Badge variant="outline">Rozliczenia: {counters.payments}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
