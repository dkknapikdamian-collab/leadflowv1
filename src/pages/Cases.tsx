import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Link2,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';

import { auth, db } from '../firebase';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  status?: string;
  completenessPercent?: number;
  leadId?: string;
  updatedAt?: { toDate?: () => Date } | null;
};

type CaseView = 'all' | 'active' | 'waiting' | 'blocked' | 'ready' | 'completed';

const CASE_VIEWS: { value: CaseView; label: string }[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'active', label: 'Aktywne' },
  { value: 'waiting', label: 'Czekają' },
  { value: 'blocked', label: 'Zablokowane' },
  { value: 'ready', label: 'Gotowe' },
  { value: 'completed', label: 'Domknięte' },
];

function caseStatusLabel(status?: string) {
  switch (status) {
    case 'waiting_on_client':
      return 'Czeka na klienta';
    case 'blocked':
      return 'Zablokowana';
    case 'ready_to_start':
      return 'Gotowa do startu';
    case 'to_approve':
      return 'Do akceptacji';
    case 'in_progress':
      return 'W toku';
    case 'completed':
      return 'Zakończona';
    default:
      return 'W realizacji';
  }
}

function caseBadgeVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'blocked') return 'destructive';
  if (status === 'ready_to_start' || status === 'completed') return 'secondary';
  return 'outline';
}

function caseNeedsAttention(caseRecord: CaseRecord) {
  return caseRecord.status === 'blocked' || caseRecord.status === 'waiting_on_client' || (caseRecord.completenessPercent || 0) < 35;
}

export default function Cases() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<CaseView>('all');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'cases'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCases(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<CaseRecord, 'id'>) })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => ({
    total: cases.length,
    waiting: cases.filter((record) => record.status === 'waiting_on_client' || record.status === 'to_approve').length,
    blocked: cases.filter((record) => record.status === 'blocked').length,
    ready: cases.filter((record) => record.status === 'ready_to_start').length,
    linked: cases.filter((record) => !!record.leadId).length,
  }), [cases]);

  const filteredCases = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return cases.filter((record) => {
      const matchesSearch = !normalizedQuery
        || record.title?.toLowerCase().includes(normalizedQuery)
        || record.clientName?.toLowerCase().includes(normalizedQuery)
        || record.status?.toLowerCase().includes(normalizedQuery);

      const matchesView = viewMode === 'all'
        ? true
        : viewMode === 'active'
          ? record.status !== 'completed'
          : viewMode === 'waiting'
            ? record.status === 'waiting_on_client' || record.status === 'to_approve'
            : viewMode === 'blocked'
              ? record.status === 'blocked'
              : viewMode === 'ready'
                ? record.status === 'ready_to_start'
                : record.status === 'completed';

      return matchesSearch && matchesView;
    });
  }, [cases, searchQuery, viewMode]);

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <Sparkles className="h-3.5 w-3.5" /> Start realizacji
            </div>
            <div>
              <h1 className="text-3xl font-bold app-text">Sprawy</h1>
              <p className="max-w-2xl text-sm md:text-base app-muted">
                Tu widzisz, które realizacje stoją, które czekają na klienta i które są już gotowe do startu.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border px-3 py-2 app-border app-surface-strong">
            <Filter className="h-4 w-4 app-muted" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] app-muted">Jedna ścieżka: lead → sprawa → portal</p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wszystkie</p>
                <p className="mt-2 text-2xl font-bold app-text">{stats.total}</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><Briefcase className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Czekają</p>
                <p className="mt-2 text-2xl font-bold text-amber-500">{stats.waiting}</p>
              </div>
              <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-500"><Clock className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Zablokowane</p>
                <p className="mt-2 text-2xl font-bold text-rose-500">{stats.blocked}</p>
              </div>
              <div className="rounded-2xl bg-rose-500/12 p-3 text-rose-500"><ShieldAlert className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Gotowe</p>
                <p className="mt-2 text-2xl font-bold text-emerald-500">{stats.ready}</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-500"><CheckCircle2 className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card className="border-none app-surface-strong">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Z leada</p>
                <p className="mt-2 text-2xl font-bold app-text">{stats.linked}</p>
              </div>
              <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-500"><Link2 className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        </section>

        <Card className="border-none app-surface-strong">
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
              <Input
                placeholder="Szukaj po sprawie, kliencie albo statusie..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as CaseView)} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {CASE_VIEWS.map((view) => (
                  <TabsTrigger key={view.value} value={view.value}>{view.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <section className="space-y-4">
          {loading ? (
            <Card className="border-none app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[color:var(--app-primary)]" />
                <p className="text-sm font-medium app-muted">Ładowanie spraw...</p>
              </CardContent>
            </Card>
          ) : filteredCases.length === 0 ? (
            <Card className="border-dashed app-surface-strong">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="rounded-full p-4 app-primary-chip"><Target className="h-7 w-7" /></div>
                <div>
                  <p className="text-lg font-semibold app-text">Brak spraw w tym widoku</p>
                  <p className="mt-1 max-w-md text-sm app-muted">
                    Sprawy pojawią się tutaj po wygraniu leada albo po ręcznym uruchomieniu realizacji.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredCases.map((record) => {
              const attention = caseNeedsAttention(record);
              const percent = Math.round(record.completenessPercent || 0);
              const updatedAt = record.updatedAt?.toDate ? record.updatedAt.toDate() : null;

              return (
                <Card key={record.id} className="border-none app-surface-strong app-shadow transition-transform hover:-translate-y-0.5">
                  <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-xl font-bold app-text">{record.title || 'Sprawa bez tytułu'}</h3>
                        <Badge variant={caseBadgeVariant(record.status)}>{caseStatusLabel(record.status)}</Badge>
                        {attention ? <Badge variant="destructive">Wymaga uwagi</Badge> : null}
                        {record.leadId ? <Badge variant="outline">Z leada</Badge> : null}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm app-muted">
                        <span>Klient: {record.clientName || 'Brak nazwy klienta'}</span>
                        <span>Kompletność: {percent}%</span>
                        <span>Ostatni ruch: {updatedAt ? format(updatedAt, 'd MMM yyyy', { locale: pl }) : 'Brak'}</span>
                      </div>
                      <div className="space-y-2 rounded-2xl border p-4 app-border app-surface">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] app-muted">
                          <span>Postęp uruchomienia</span>
                          <span>{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                        <p className="text-sm app-muted">
                          {record.status === 'blocked'
                            ? 'Sprawa ma realny blok na starcie i wymaga odblokowania.'
                            : record.status === 'waiting_on_client'
                              ? 'Czekasz na materiał, decyzję albo odpowiedź klienta.'
                              : record.status === 'ready_to_start'
                                ? 'Sprawa jest gotowa do wejścia w realizację.'
                                : 'Realizacja jest w ruchu i wymaga regularnej kontroli.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-[220px] lg:items-end">
                      {record.leadId ? (
                        <Button variant="outline" className="rounded-2xl lg:w-full" asChild>
                          <Link to={`/leads/${record.leadId}`}>
                            Otwórz źródłowego leada <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : null}
                      <Button className="rounded-2xl lg:w-full" asChild>
                        <Link to={`/case/${record.id}`}>
                          Otwórz sprawę <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </Layout>
  );
}
