import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, limit, onSnapshot, orderBy, query, where, type Timestamp } from 'firebase/firestore';
import { format, isAfter, startOfDay, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronsRight,
  Clock3,
  FileCheck2,
  Filter,
  History,
  Link2,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  Target,
  Upload,
} from 'lucide-react';

import Layout from '../components/Layout';
import { auth, db } from '../firebase';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { cn } from '../lib/utils';

type ActivityRecord = {
  id: string;
  ownerId?: string;
  actorType?: string;
  actorId?: string;
  eventType?: string;
  leadId?: string;
  caseId?: string;
  payload?: Record<string, any>;
  createdAt?: Timestamp | null;
};

type EntityFilter = 'all' | 'lead' | 'case' | 'portal' | 'system';
type TimeFilter = 'all' | '24h' | '7d' | '30d';

function activityMeta(activity: ActivityRecord) {
  switch (activity.eventType) {
    case 'lead_created':
      return {
        title: 'Nowy lead wpadł do systemu',
        description: activity.payload?.name || activity.payload?.title || 'Dodano nowy rekord leadowy.',
        icon: <Target className="h-4 w-4" />,
        tone: 'text-[color:var(--app-primary)] app-primary-chip',
        group: 'lead' as const,
      };
    case 'lead_note_added':
      return {
        title: 'Dodano notatkę do leada',
        description: activity.payload?.content || activity.payload?.note || 'Nowa notatka sprzedażowa.',
        icon: <MessageSquareText className="h-4 w-4" />,
        tone: 'text-[color:var(--app-primary)] app-primary-chip',
        group: 'lead' as const,
      };
    case 'lead_quick_action':
      return {
        title: 'Wykonano szybką akcję',
        description: activity.payload?.title || activity.payload?.nextStep || 'Lead został popchnięty kolejnym ruchem.',
        icon: <Sparkles className="h-4 w-4" />,
        tone: 'text-[color:var(--app-primary)] app-primary-chip',
        group: 'lead' as const,
      };
    case 'lead_case_created':
    case 'case_created':
      return {
        title: 'Lead przeszedł do realizacji',
        description: activity.payload?.title || 'Utworzono nową sprawę i przekazano proces dalej.',
        icon: <Link2 className="h-4 w-4" />,
        tone: 'text-emerald-500 bg-emerald-500/10',
        group: 'case' as const,
      };
    case 'item_added':
      return {
        title: 'Dodano element checklisty',
        description: activity.payload?.title || 'Checklista sprawy została rozbudowana.',
        icon: <FileCheck2 className="h-4 w-4" />,
        tone: 'text-emerald-500 bg-emerald-500/10',
        group: 'case' as const,
      };
    case 'status_changed':
      return {
        title: 'Zmieniono status',
        description: activity.payload?.title
          ? `${activity.payload.title} → ${activity.payload.status || 'nowy status'}`
          : `Nowy status: ${activity.payload?.status || 'zmieniony'}`,
        icon: <ChevronsRight className="h-4 w-4" />,
        tone: 'text-amber-500 bg-amber-500/10',
        group: activity.leadId ? ('lead' as const) : ('case' as const),
      };
    case 'file_uploaded':
      return {
        title: 'Klient wgrał plik',
        description: activity.payload?.title || 'Nowy plik pojawił się w portalu klienta.',
        icon: <Upload className="h-4 w-4" />,
        tone: 'text-sky-500 bg-sky-500/10',
        group: 'portal' as const,
      };
    case 'portal_reminder_sent':
      return {
        title: 'Wysłano przypomnienie portalowe',
        description: activity.payload?.title || 'System przypomniał klientowi o brakach.',
        icon: <CalendarClock className="h-4 w-4" />,
        tone: 'text-fuchsia-500 bg-fuchsia-500/10',
        group: 'portal' as const,
      };
    default:
      return {
        title: 'Aktywność systemowa',
        description: activity.payload?.title || activity.payload?.status || 'Zdarzenie zostało zapisane w systemie.',
        icon: <History className="h-4 w-4" />,
        tone: 'app-muted bg-black/5 dark:bg-white/5',
        group: 'system' as const,
      };
  }
}

function activityTimeLabel(createdAt?: Timestamp | null) {
  if (!createdAt) return 'Teraz';
  return format(createdAt.toDate(), 'd MMM yyyy, HH:mm', { locale: pl });
}

function matchesTimeFilter(activity: ActivityRecord, timeFilter: TimeFilter) {
  if (timeFilter === 'all') return true;
  if (!activity.createdAt) return false;
  const created = activity.createdAt.toDate();

  if (timeFilter === '24h') return isAfter(created, subDays(new Date(), 1));
  if (timeFilter === '7d') return isAfter(created, subDays(startOfDay(new Date()), 7));
  return isAfter(created, subDays(startOfDay(new Date()), 30));
}

export default function Activity() {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7d');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'activities'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(120)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<ActivityRecord, 'id'>) })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const meta = activityMeta(activity);
      const haystack = [
        meta.title,
        meta.description,
        activity.payload?.title,
        activity.payload?.status,
        activity.payload?.note,
        activity.caseId,
        activity.leadId,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = search.trim().length === 0 || haystack.includes(search.trim().toLowerCase());
      const matchesEntity = entityFilter === 'all' || meta.group === entityFilter;
      return matchesSearch && matchesEntity && matchesTimeFilter(activity, timeFilter);
    });
  }, [activities, entityFilter, search, timeFilter]);

  const stats = useMemo(() => {
    const recent = activities.filter((activity) => matchesTimeFilter(activity, '24h'));
    return {
      recent: recent.length,
      lead: filteredActivities.filter((activity) => activityMeta(activity).group === 'lead').length,
      case: filteredActivities.filter((activity) => activityMeta(activity).group === 'case').length,
      portal: filteredActivities.filter((activity) => activityMeta(activity).group === 'portal').length,
    };
  }, [activities, filteredActivities]);

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 md:px-6 md:py-6">
        <section className="grid gap-4 xl:grid-cols-[1.35fr,0.95fr]">
          <Card className="border-none app-surface-strong app-shadow">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]">
                    Taśma operacyjna
                  </Badge>
                  <CardTitle className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    Wszystko, co naprawdę ruszyło proces, w jednym miejscu.
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-3xl text-base">
                    Tu nie ma martwego logu. To ekran do szybkiego sprawdzania, czy leady, sprawy i portal klienta żyją tak, jak powinny.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">Panel</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/today">Dziś</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/cases">Sprawy <ChevronsRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl border app-border p-4 app-surface">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Ostatnie 24h</p>
                    <p className="mt-3 text-3xl font-black app-text">{stats.recent}</p>
                    <p className="mt-2 text-sm app-muted">Ile realnych zdarzeń system zapisał od wczoraj.</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <Clock3 className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border app-border p-4 app-surface">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Leady</p>
                    <p className="mt-3 text-3xl font-black app-text">{stats.lead}</p>
                    <p className="mt-2 text-sm app-muted">Ruch sprzedażowy w aktualnym filtrze.</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl app-primary-chip text-[color:var(--app-primary)]">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border app-border p-4 app-surface">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Sprawy</p>
                    <p className="mt-3 text-3xl font-black app-text">{stats.case}</p>
                    <p className="mt-2 text-sm app-muted">Zmiany w realizacji i checklistach.</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border app-border p-4 app-surface">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Portal</p>
                    <p className="mt-3 text-3xl font-black app-text">{stats.portal}</p>
                    <p className="mt-2 text-sm app-muted">Pliki, decyzje i przypomnienia po stronie klienta.</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-500">
                    <Upload className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none app-surface-strong app-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Szybkie filtry</CardTitle>
              <CardDescription>Odetnij szum i patrz tylko na ten rodzaj ruchu, który teraz ma znaczenie.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Szukaj w aktywności</label>
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="np. status, plik, spotkanie, nazwa..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Zakres czasu</label>
                <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Całość</SelectItem>
                    <SelectItem value="24h">Ostatnie 24h</SelectItem>
                    <SelectItem value="7d">Ostatnie 7 dni</SelectItem>
                    <SelectItem value="30d">Ostatnie 30 dni</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Typ ruchu</label>
                <Tabs value={entityFilter} onValueChange={(value) => setEntityFilter(value as EntityFilter)}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">Wszystko</TabsTrigger>
                    <TabsTrigger value="lead">Leady</TabsTrigger>
                    <TabsTrigger value="case">Sprawy</TabsTrigger>
                    <TabsTrigger value="portal">Portal</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                <Link to="/today">
                  <div className="rounded-2xl border app-border p-4 app-surface transition-all hover:-translate-y-0.5 hover:app-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl app-primary-chip text-[color:var(--app-primary)]">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold app-text">Przejdź do alarmów dnia</p>
                        <p className="mt-1 text-sm app-muted">Gdy aktywność pokaże problem, jednym skokiem wskakujesz do ekranu Dziś.</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="/dashboard">
                  <div className="rounded-2xl border app-border p-4 app-surface transition-all hover:-translate-y-0.5 hover:app-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold app-text">Panel operatora</p>
                        <p className="mt-1 text-sm app-muted">Widok przekrojowy, gdy chcesz szybko zobaczyć temperaturę całej fortecy.</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-none app-surface-strong app-shadow">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl font-bold">Taśma zdarzeń</CardTitle>
                  <CardDescription>
                    {loading ? 'Ładowanie aktywności...' : `${filteredActivities.length} zdarzeń po obecnym filtrowaniu.`}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
                  {timeFilter === 'all' ? 'Cały zakres' : timeFilter}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="rounded-2xl border app-border p-10 text-center app-surface">
                  <p className="text-sm app-muted">Wczytywanie taśmy operacyjnej...</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="rounded-2xl border border-dashed app-border p-10 text-center app-surface">
                  <p className="font-semibold app-text">Brak aktywności dla tego filtra</p>
                  <p className="mt-1 text-sm app-muted">Zmień zakres czasu albo typ ruchu, żeby zobaczyć więcej zdarzeń.</p>
                </div>
              ) : (
                filteredActivities.map((activity) => {
                  const meta = activityMeta(activity);
                  const targetHref = activity.leadId ? `/leads/${activity.leadId}` : activity.caseId ? `/case/${activity.caseId}` : undefined;
                  return (
                    <div key={activity.id} className="rounded-2xl border app-border p-4 app-surface transition-all hover:-translate-y-0.5 hover:app-shadow">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex min-w-0 gap-3">
                          <div className={cn('mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', meta.tone)}>
                            {meta.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-base font-bold app-text">{meta.title}</p>
                              <Badge variant="outline">{meta.group === 'lead' ? 'Lead' : meta.group === 'case' ? 'Sprawa' : meta.group === 'portal' ? 'Portal' : 'System'}</Badge>
                              {activity.actorType === 'client' ? <Badge variant="secondary">Klient</Badge> : <Badge variant="outline">Operator</Badge>}
                            </div>
                            <p className="mt-2 text-sm app-muted">{meta.description}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs app-muted">
                              <span>{activityTimeLabel(activity.createdAt)}</span>
                              {activity.caseId ? <span>Sprawa: {activity.caseId}</span> : null}
                              {activity.leadId ? <span>Lead: {activity.leadId}</span> : null}
                            </div>
                          </div>
                        </div>
                        {targetHref ? (
                          <Button variant="outline" asChild>
                            <Link to={targetHref}>Otwórz rekord <ChevronsRight className="h-4 w-4" /></Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
