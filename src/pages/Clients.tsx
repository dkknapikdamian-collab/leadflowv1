import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  where,
} from 'firebase/firestore';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ContactRound,
  FileText,
  Link2,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import { auth, db } from '../firebase';
import Layout from '../components/Layout';
import { useWorkspace } from '../hooks/useWorkspace';
import { buildClientDirectory, buildClientIdFromLead, clientHealthLabel, clientHealthTone, getDaysSinceTouch, portalStatusLabel, toJsDate, type ClientCaseLike, type ClientLeadLike, type ClientRecord, type ClientViewModel } from '../lib/clients';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

type ClientFilter = 'all' | 'sales' | 'onboarding' | 'service' | 'needs_link';

const FILTERS: { value: ClientFilter; label: string }[] = [
  { value: 'all', label: 'Wszyscy' },
  { value: 'sales', label: 'W sprzedaży' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'service', label: 'W realizacji' },
  { value: 'needs_link', label: 'Do spięcia' },
];

export default function Clients() {
  const { workspace, hasAccess, access } = useWorkspace();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [leads, setLeads] = useState<ClientLeadLike[]>([]);
  const [cases, setCases] = useState<ClientCaseLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ClientFilter>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '' });

  useEffect(() => {
    if (!auth.currentUser) {
      setClients([]);
      setLeads([]);
      setCases([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribers: Array<() => void> = [];

    const clientsQuery = query(collection(db, 'clients'), where('ownerId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc'));
    unsubscribers.push(onSnapshot(
      clientsQuery,
      (snapshot) => {
        setClients(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ClientRecord, 'id'>) })));
        setLoading(false);
      },
      () => {
        setClients([]);
        setLoading(false);
      }
    ));

    const leadsQuery = query(collection(db, 'leads'), where('ownerId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc'));
    unsubscribers.push(onSnapshot(
      leadsQuery,
      (snapshot) => {
        setLeads(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ClientLeadLike, 'id'>) })));
      },
      () => {
        setLeads([]);
        setLoading(false);
      }
    ));

    const casesQuery = query(collection(db, 'cases'), where('ownerId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc'));
    unsubscribers.push(onSnapshot(
      casesQuery,
      (snapshot) => {
        setCases(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ClientCaseLike, 'id'>) })));
      },
      () => {
        setCases([]);
        setLoading(false);
      }
    ));

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const clientMap = useMemo(() => buildClientDirectory(clients, leads, cases), [cases, clients, leads]);

  const stats = useMemo(() => ({
    total: clientMap.length,
    sales: clientMap.filter((client) => client.linkedLeadIds.length > 0 && client.linkedCaseIds.length === 0).length,
    onboarding: clientMap.filter((client) => client.linkedCaseIds.length > 0 && !client.portalReady).length,
    service: clientMap.filter((client) => client.linkedCaseIds.length > 0 && client.portalReady).length,
    needsLink: clientMap.filter((client) => client.linkedLeadIds.length === 0 || client.linkedCaseIds.length === 0).length,
  }), [clientMap]);

  const filteredClients = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();

    return clientMap
      .filter((client) => {
        const daysSinceTouch = getDaysSinceTouch(client.updatedAt);
        const health = clientHealthLabel({
          daysSinceTouch,
          linkedCaseCount: client.linkedCaseIds.length,
          linkedLeadCount: client.linkedLeadIds.length,
          portalReady: client.portalReady,
        });

        const matchesSearch = !normalized || [client.name, client.company, client.email, client.phone].some((value) => value?.toLowerCase().includes(normalized));
        const matchesFilter = filter === 'all'
          ? true
          : filter === 'sales'
            ? health === 'W sprzedaży'
            : filter === 'onboarding'
              ? health === 'Onboarding'
              : filter === 'service'
                ? health === 'W realizacji'
                : health === 'Do spięcia' || health === 'Wymaga ruchu';

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const dateA = toJsDate(a.updatedAt)?.getTime() || 0;
        const dateB = toJsDate(b.updatedAt)?.getTime() || 0;
        return dateB - dateA;
      });
  }, [clientMap, filter, searchQuery]);

  async function handleCreateClient() {
    if (!auth.currentUser || !workspace) return;
    if (!hasAccess) {
      toast.error('Dostęp jest w trybie podglądu. Najpierw wznów plan.');
      return;
    }
    if (!newClient.name.trim()) {
      toast.error('Podaj nazwę klienta.');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'clients'), {
        ownerId: auth.currentUser.uid,
        workspaceId: workspace.id,
        name: newClient.name.trim(),
        company: newClient.company.trim() || null,
        email: newClient.email.trim().toLowerCase() || null,
        phone: newClient.phone.trim() || null,
        linkedLeadIds: [],
        linkedCaseIds: [],
        portalReady: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Klient został dodany.');
      setIsCreateOpen(false);
      setNewClient({ name: '', company: '', email: '', phone: '' });
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handlePromoteFallback(client: ClientViewModel) {
    if (!auth.currentUser || !workspace) return;
    if (!hasAccess) {
      toast.error('Dostęp jest w trybie podglądu.');
      return;
    }

    try {
      const targetId = client.id.startsWith('client-') ? client.id : buildClientIdFromLead({
        leadId: client.primaryLeadId || client.primaryCaseId || client.id,
        email: client.email,
        phone: client.phone,
        name: client.name,
      });

      await setDoc(doc(db, 'clients', targetId), {
        ownerId: auth.currentUser.uid,
        workspaceId: workspace.id,
        name: client.name,
        company: client.company || null,
        email: client.email || null,
        phone: client.phone || null,
        linkedLeadIds: client.linkedLeadIds,
        linkedCaseIds: client.linkedCaseIds,
        primaryLeadId: client.primaryLeadId || null,
        primaryCaseId: client.primaryCaseId || null,
        portalReady: client.portalReady,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });

      if (client.primaryLeadId) {
        await setDoc(doc(db, 'leads', client.primaryLeadId), {
          linkedClientId: targetId,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      if (client.primaryCaseId) {
        await setDoc(doc(db, 'cases', client.primaryCaseId), {
          clientId: targetId,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      toast.success('Klient został spięty w stały rekord.');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleDeleteClient(client: ClientViewModel) {
    if (client.source !== 'client') {
      toast.error('Usuń najpierw rekord źródłowy albo odepnij klienta od leada/sprawy.');
      return;
    }

    if (!window.confirm(`Usunąć klienta "${client.name}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'clients', client.id));
      toast.success('Klient usunięty.');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <Users className="h-3.5 w-3.5" /> Warstwa pośrednia klienta
            </div>
            <div>
              <h1 className="text-3xl font-bold app-text">Klienci</h1>
              <p className="max-w-2xl text-sm md:text-base app-muted">
                Tu trzymasz jedną bazę kontaktów pomiędzy leadem a sprawą. Dzięki temu nie gubisz człowieka, nawet gdy zmienia etap procesu.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" /> Nowy klient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Dodaj klienta ręcznie</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Nazwa klienta</Label>
                    <Input id="client-name" value={newClient.name} onChange={(event) => setNewClient((state) => ({ ...state, name: event.target.value }))} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="client-company">Firma</Label>
                      <Input id="client-company" value={newClient.company} onChange={(event) => setNewClient((state) => ({ ...state, company: event.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-phone">Telefon</Label>
                      <Input id="client-phone" value={newClient.phone} onChange={(event) => setNewClient((state) => ({ ...state, phone: event.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">E-mail</Label>
                    <Input id="client-email" type="email" value={newClient.email} onChange={(event) => setNewClient((state) => ({ ...state, email: event.target.value }))} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="rounded-2xl" onClick={() => setIsCreateOpen(false)}>Anuluj</Button>
                  <Button className="rounded-2xl" onClick={handleCreateClient} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Zapisz klienta
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link to="/cases">
              <Button variant="outline" className="rounded-2xl">
                <Briefcase className="mr-2 h-4 w-4" /> Zobacz sprawy
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Wszyscy', value: stats.total, icon: Users, tone: 'app-primary-chip' },
            { label: 'W sprzedaży', value: stats.sales, icon: ContactRound, tone: 'bg-indigo-500/12 text-indigo-500' },
            { label: 'Onboarding', value: stats.onboarding, icon: Link2, tone: 'bg-sky-500/12 text-sky-500' },
            { label: 'W realizacji', value: stats.service, icon: CheckCircle2, tone: 'bg-emerald-500/12 text-emerald-500' },
            { label: 'Do spięcia', value: stats.needsLink, icon: Sparkles, tone: 'bg-amber-500/12 text-amber-500' },
          ].map((stat) => (
            <Card key={stat.label} className="border-none app-surface-strong">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold app-text">{stat.value}</p>
                </div>
                <div className={cn('rounded-2xl p-3', stat.tone)}><stat.icon className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-none app-surface-strong">
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
              <Input
                placeholder="Szukaj po nazwie, firmie, e-mailu albo telefonie..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as ClientFilter)} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl p-1 lg:grid-cols-5">
                {FILTERS.map((entry) => (
                  <TabsTrigger key={entry.value} value={entry.value} className="rounded-xl text-xs md:text-sm">{entry.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <section className="space-y-4">
          {loading ? (
            <Card className="border-none app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                <Loader2 className="h-10 w-10 animate-spin text-[color:var(--app-primary)]" />
                <p className="text-sm font-medium app-muted">Ładowanie klientów...</p>
              </CardContent>
            </Card>
          ) : filteredClients.length === 0 ? (
            <Card className="border-dashed app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="rounded-full p-4 app-primary-chip"><Users className="h-7 w-7" /></div>
                <div>
                  <p className="text-lg font-semibold app-text">Brak klientów w tym widoku</p>
                  <p className="mt-1 max-w-md text-sm app-muted">
                    Klienci pojawią się tutaj po spięciu leada, utworzeniu sprawy albo po ręcznym dodaniu kontaktu.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const daysSinceTouch = getDaysSinceTouch(client.updatedAt);
              const health = clientHealthLabel({
                daysSinceTouch,
                linkedCaseCount: client.linkedCaseIds.length,
                linkedLeadCount: client.linkedLeadIds.length,
                portalReady: client.portalReady,
              });
              const updatedAt = toJsDate(client.updatedAt);
              const isFallback = client.source !== 'client';

              return (
                <Card key={client.id} className="border-none app-surface-strong app-shadow transition-transform hover:-translate-y-0.5">
                  <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-xl font-bold app-text">{client.name}</h3>
                        <Badge className={clientHealthTone(health)}>{health}</Badge>
                        <Badge variant="outline">{portalStatusLabel(client.portalReady)}</Badge>
                        {isFallback ? <Badge variant="outline">Jeszcze bez stałego rekordu</Badge> : null}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm app-muted">
                        {client.company ? <span>Firma: {client.company}</span> : null}
                        {client.email ? <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {client.email}</span> : null}
                        {client.phone ? <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {client.phone}</span> : null}
                        <span>Leady: {client.linkedLeadIds.length}</span>
                        <span>Sprawy: {client.linkedCaseIds.length}</span>
                        <span>Ostatni ruch: {updatedAt ? updatedAt.toLocaleDateString('pl-PL') : 'brak danych'}</span>
                      </div>

                      <p className="text-sm app-muted">
                        {health === 'W realizacji'
                          ? 'Klient jest już powiązany ze sprawą i ma gotowy albo uruchomiony portal.'
                          : health === 'Onboarding'
                            ? 'Klient ma sprawę, ale jeszcze nie widać pełnego domknięcia portalu lub materiałów.'
                            : health === 'W sprzedaży'
                              ? 'Klient jest nadal po stronie handlowej. Warto pilnować kolejnego kroku.'
                              : 'To miejsce wymaga spięcia, żeby jedna osoba nie rozjechała się między leadem i sprawą.'}
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 lg:w-[320px]">
                      <Link to={`/clients/${client.id}`}>
                        <Button className="w-full justify-between rounded-2xl">
                          Otwórz centrum klienta <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      {client.primaryLeadId ? (
                        <Link to={`/leads/${client.primaryLeadId}`}>
                          <Button variant="outline" className="w-full justify-between rounded-2xl">
                            Otwórz lead <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      ) : null}
                      {client.primaryCaseId ? (
                        <Link to={`/case/${client.primaryCaseId}`}>
                          <Button variant="outline" className="w-full justify-between rounded-2xl">
                            Otwórz sprawę <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      ) : null}
                      {client.primaryCaseId && client.portalReady ? (
                        <Link to="/cases">
                          <Button variant="outline" className="w-full justify-between rounded-2xl">
                            Portal / checklista <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                      ) : null}
                      {isFallback ? (
                        <Button className="w-full rounded-2xl" onClick={() => handlePromoteFallback(client)}>
                          Zepnij jako stałego klienta
                        </Button>
                      ) : null}
                      {!isFallback ? (
                        <Button variant="outline" className="w-full rounded-2xl text-rose-600" onClick={() => handleDeleteClient(client)}>
                          Usuń klienta
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>

        {!hasAccess ? (
          <Card className="border-none app-surface-strong">
            <CardContent className="flex flex-col gap-2 p-5 text-sm app-muted md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold app-text">Tryb podglądu klientów</p>
                <p>Możesz przeglądać relacje lead → klient → sprawa, ale zapis nowych kontaktów i spinanie rekordów jest wstrzymane.</p>
              </div>
              <Link to="/billing">
                <Button variant="outline" className="rounded-2xl">{access.ctaLabel}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Layout>
  );
}
