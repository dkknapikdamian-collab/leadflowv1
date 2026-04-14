import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { format, isPast, isToday, parseISO, startOfDay, subDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  History,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

import { auth, db } from '../firebase';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../lib/utils';
import { useWorkspace } from '../hooks/useWorkspace';

type LeadRecord = {
  id: string;
  name: string;
  company?: string;
  status?: string;
  nextStep?: string;
  nextActionAt?: string;
  dealValue?: number;
  isAtRisk?: boolean;
  updatedAt?: Timestamp | null;
};

type CaseRecord = {
  id: string;
  title?: string;
  clientName?: string;
  status?: string;
  leadId?: string;
  completenessPercent?: number;
  updatedAt?: Timestamp | null;
};

type TaskRecord = {
  id: string;
  title?: string;
  date?: string;
  status?: string;
  leadId?: string;
  leadName?: string;
};

type EventRecord = {
  id: string;
  title?: string;
  type?: string;
  startAt?: string;
  status?: string;
  leadId?: string;
};

type ActivityRecord = {
  id: string;
  eventType?: string;
  leadId?: string;
  caseId?: string;
  payload?: Record<string, any>;
  createdAt?: Timestamp | null;
};

function formatDueLabel(value?: string) {
  if (!value) return 'Brak terminu';

  try {
    const date = parseISO(value);
    if (isPast(date) && !isToday(date)) return `Po terminie · ${format(date, 'd MMM, HH:mm', { locale: pl })}`;
    if (isToday(date)) return `Dziś · ${format(date, 'HH:mm', { locale: pl })}`;
    return format(date, 'd MMM, HH:mm', { locale: pl });
  } catch {
    return value;
  }
}

function formatActivityTime(value?: Timestamp | null) {
  if (!value) return 'Teraz';
  const date = value.toDate();
  return format(date, 'd MMM, HH:mm', { locale: pl });
}

function eventTypeLabel(eventType?: string) {
  switch (eventType) {
    case 'lead_created':
      return 'Nowy lead';
    case 'lead_note_added':
      return 'Nowa notatka';
    case 'lead_quick_action':
      return 'Szybka akcja';
    case 'lead_case_created':
    case 'case_created':
      return 'Uruchomiono sprawę';
    case 'status_changed':
      return 'Zmiana statusu';
    case 'item_added':
      return 'Dodano element';
    case 'file_uploaded':
      return 'Wgrano plik';
    case 'portal_reminder_sent':
      return 'Przypomnienie portalowe';
    default:
      return 'Aktywność';
  }
}

function activityTone(activity: ActivityRecord) {
  if (activity.leadId) {
    return {
      icon: <Target className="h-4 w-4" />,
      className: 'text-[color:var(--app-primary)] app-primary-chip',
      label: 'Lead',
    };
  }

  return {
    icon: <Briefcase className="h-4 w-4" />,
    className: 'text-emerald-500 bg-emerald-500/10',
    label: 'Sprawa',
  };
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed app-border p-6 text-center app-surface">
      <p className="text-sm font-semibold app-text">{title}</p>
      <p className="mt-1 text-sm app-muted">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const { access } = useWorkspace();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    const unsubscribes = [
      onSnapshot(
        query(collection(db, 'leads'), where('ownerId', '==', uid), orderBy('updatedAt', 'desc')),
        (snapshot) => setLeads(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<LeadRecord, 'id'>) })))
      ),
      onSnapshot(
        query(collection(db, 'cases'), where('ownerId', '==', uid), orderBy('updatedAt', 'desc')),
        (snapshot) => setCases(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<CaseRecord, 'id'>) })))
      ),
      onSnapshot(
        query(collection(db, 'tasks'), where('ownerId', '==', uid), orderBy('date', 'asc')),
        (snapshot) => setTasks(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<TaskRecord, 'id'>) })))
      ),
      onSnapshot(
        query(collection(db, 'events'), where('ownerId', '==', uid), orderBy('startAt', 'asc')),
        (snapshot) => setEvents(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<EventRecord, 'id'>) })))
      ),
      onSnapshot(
        query(collection(db, 'activities'), where('ownerId', '==', uid), orderBy('createdAt', 'desc'), limit(12)),
        (snapshot) => {
          setActivities(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ActivityRecord, 'id'>) })));
          setLoading(false);
        }
      ),
    ];

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, []);

  const dashboard = useMemo(() => {
    const activeLeads = leads.filter((lead) => !['won', 'lost'].includes(lead.status || ''));
    const leadsOverdue = activeLeads.filter((lead) => {
      if (!lead.nextActionAt) return false;
      const due = parseISO(lead.nextActionAt);
      return isPast(due) && !isToday(due);
    });
    const leadsWithoutStep = activeLeads.filter((lead) => !lead.nextStep || !lead.nextActionAt);
    const atRiskLeads = activeLeads.filter((lead) => lead.isAtRisk || (!lead.nextActionAt && (lead.dealValue || 0) >= 2000));

    const activeCases = cases.filter((item) => item.status !== 'completed');
    const blockedCases = activeCases.filter((item) => item.status === 'blocked');
    const waitingCases = activeCases.filter((item) => item.status === 'waiting_on_client' || item.status === 'to_approve');

    const openTasks = tasks.filter((task) => task.status !== 'done');
    const tasksToday = openTasks.filter((task) => task.date && isToday(parseISO(task.date)));
    const overdueTasks = openTasks.filter((task) => task.date && isPast(parseISO(task.date)) && !isToday(parseISO(task.date)));

    const upcomingEvents = events.filter((event) => event.status !== 'done').slice(0, 5);

    const hotLeads = [...activeLeads]
      .sort((a, b) => {
        const aScore = (a.isAtRisk ? 4 : 0) + (!a.nextActionAt ? 3 : 0) + (a.dealValue || 0) / 1000;
        const bScore = (b.isAtRisk ? 4 : 0) + (!b.nextActionAt ? 3 : 0) + (b.dealValue || 0) / 1000;
        return bScore - aScore;
      })
      .slice(0, 5);

    const recentWindowStart = subDays(startOfDay(new Date()), 1);
    const recentActivity = activities.filter((activity) => activity.createdAt?.toDate() && activity.createdAt.toDate() >= recentWindowStart);

    return {
      activeLeads,
      leadsOverdue,
      leadsWithoutStep,
      atRiskLeads,
      activeCases,
      blockedCases,
      waitingCases,
      tasksToday,
      overdueTasks,
      upcomingEvents,
      hotLeads,
      recentActivity,
    };
  }, [activities, cases, events, leads, tasks]);

  const topStats = [
    {
      title: 'Leady do pilnego ruchu',
      value: dashboard.leadsOverdue.length,
      note: `${dashboard.leadsWithoutStep.length} bez next stepu`,
      icon: <ShieldAlert className="h-5 w-5" />,
      tone: 'text-rose-500 bg-rose-500/10',
      href: '/today',
    },
    {
      title: 'Aktywne sprawy',
      value: dashboard.activeCases.length,
      note: `${dashboard.blockedCases.length} zablokowanych`,
      icon: <Briefcase className="h-5 w-5" />,
      tone: 'text-emerald-500 bg-emerald-500/10',
      href: '/cases',
    },
    {
      title: 'Taski do ruchu dziś',
      value: dashboard.tasksToday.length + dashboard.overdueTasks.length,
      note: `${dashboard.overdueTasks.length} zaległych`,
      icon: <Clock className="h-5 w-5" />,
      tone: 'text-amber-500 bg-amber-500/10',
      href: '/tasks',
    },
    {
      title: 'Ruch w ostatnich 24h',
      value: dashboard.recentActivity.length,
      note: `${dashboard.waitingCases.length} spraw czeka na klienta`,
      icon: <TrendingUp className="h-5 w-5" />,
      tone: 'text-[color:var(--app-primary)] app-primary-chip',
      href: '/activity',
    },
  ];

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 md:px-6 md:py-6">
        <section className="grid gap-4 xl:grid-cols-[1.5fr,0.9fr]">
          <Card className="border-none app-surface-strong app-shadow">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]">
                    Panel operatora
                  </Badge>
                  <CardTitle className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    Jednym rzutem oka widać, gdzie proces traci tempo.
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-3xl text-base">
                    Ten ekran zbiera ruch sprzedażowy, realizacyjny i aktywność w jedno miejsce, żebyś nie musiał latać po całej apce.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/today">Dziś</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/leads">Leady</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/cases">Sprawy <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {topStats.map((item) => (
                <Link key={item.title} to={item.href}>
                  <div className="rounded-2xl border app-border p-4 app-surface transition-all hover:-translate-y-0.5 hover:app-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">{item.title}</p>
                        <p className="mt-3 text-3xl font-black app-text">{item.value}</p>
                        <p className="mt-2 text-sm app-muted">{item.note}</p>
                      </div>
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', item.tone)}>
                        {item.icon}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none app-surface-strong app-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Najbliższe ruchy</CardTitle>
              <CardDescription>To, co realnie wydarzy się zaraz albo już zaczyna wisieć.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.upcomingEvents.length === 0 ? (
                <EmptyState title="Brak nadchodzących wydarzeń" description="Dodaj spotkanie albo deadline, żeby widzieć najbliższe ruchy także tutaj." />
              ) : (
                dashboard.upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border app-border p-4 app-surface">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold app-text">{event.title || 'Wydarzenie bez tytułu'}</p>
                        <p className="mt-1 text-sm app-muted">{event.type || 'Wydarzenie'} · {formatDueLabel(event.startAt)}</p>
                      </div>
                      <Calendar className="mt-0.5 h-4 w-4 app-muted" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <Card className="border-none app-surface-strong app-shadow">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl font-bold">Sygnały, które trzeba ruszyć</CardTitle>
                  <CardDescription>Najważniejsze rekordy z całego procesu, bez ręcznego przekopywania list.</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/today">Pełny ekran Dziś</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboard.hotLeads.length === 0 ? (
                <EmptyState title="Na razie spokojnie" description="Nie ma jeszcze leadów, które wybijają się jako gorące albo zaniedbane." />
              ) : (
                dashboard.hotLeads.map((lead) => {
                  const overdue = lead.nextActionAt ? isPast(parseISO(lead.nextActionAt)) && !isToday(parseISO(lead.nextActionAt)) : false;
                  return (
                    <div key={lead.id} className="rounded-2xl border app-border p-4 app-surface">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-base font-bold app-text">{lead.name}</p>
                            {lead.isAtRisk ? <Badge variant="destructive">Ryzyko</Badge> : null}
                            {!lead.nextActionAt || !lead.nextStep ? <Badge variant="outline">Brak next stepu</Badge> : null}
                            {overdue ? <Badge variant="destructive">Po terminie</Badge> : null}
                          </div>
                          <p className="text-sm app-muted">
                            {lead.company || 'Bez firmy'} · {(lead.dealValue || 0).toLocaleString()} PLN · {formatDueLabel(lead.nextActionAt)}
                          </p>
                          <p className="text-sm app-text">{lead.nextStep || 'Nie ustawiono kolejnego ruchu'}</p>
                        </div>
                        <Button variant="outline" asChild>
                          <Link to={`/leads/${lead.id}`}>Otwórz <ChevronRight className="h-4 w-4" /></Link>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}

              <div className="grid gap-3 md:grid-cols-3">
                <Link to="/leads">
                  <div className="rounded-2xl border app-border p-4 app-surface">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Leady zagrożone</p>
                    <p className="mt-2 text-2xl font-black app-text">{dashboard.atRiskLeads.length}</p>
                    <p className="mt-1 text-sm app-muted">Te leady wymagają najmocniejszej egzekucji.</p>
                  </div>
                </Link>
                <Link to="/cases">
                  <div className="rounded-2xl border app-border p-4 app-surface">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Sprawy zablokowane</p>
                    <p className="mt-2 text-2xl font-black app-text">{dashboard.blockedCases.length}</p>
                    <p className="mt-1 text-sm app-muted">Tu realizacja stoi i trzeba odblokować klienta albo decyzję.</p>
                  </div>
                </Link>
                <Link to="/tasks">
                  <div className="rounded-2xl border app-border p-4 app-surface">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Taski zaległe</p>
                    <p className="mt-2 text-2xl font-black app-text">{dashboard.overdueTasks.length}</p>
                    <p className="mt-1 text-sm app-muted">Rzeczy, które już powinny być zamknięte albo przełożone.</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none app-surface-strong app-shadow">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl font-bold">Ostatnia aktywność</CardTitle>
                  <CardDescription>Krótka taśma zdarzeń z leadów, spraw i portalu klienta.</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/activity">Pełna aktywność</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center rounded-2xl border app-border p-8 app-surface">
                  <div className="flex items-center gap-2 text-sm app-muted">
                    <LayoutDashboard className="h-4 w-4 animate-pulse" />
                    Ładowanie aktywności...
                  </div>
                </div>
              ) : activities.length === 0 ? (
                <EmptyState title="Brak aktywności" description="Gdy zaczniesz pracować na leadach i sprawach, tutaj pokaże się ruch z ostatnich działań." />
              ) : (
                activities.map((activity) => {
                  const tone = activityTone(activity);
                  return (
                    <div key={activity.id} className="rounded-2xl border app-border p-4 app-surface">
                      <div className="flex gap-3">
                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', tone.className)}>
                          {tone.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold app-text">{eventTypeLabel(activity.eventType)}</p>
                            <Badge variant="outline">{tone.label}</Badge>
                          </div>
                          <p className="mt-1 text-sm app-muted">
                            {activity.payload?.title || activity.payload?.status || activity.payload?.note || 'Zdarzenie systemowe'}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs app-muted">
                            <span>{formatActivityTime(activity.createdAt)}</span>
                            {activity.caseId ? <span>Sprawa: {activity.caseId}</span> : null}
                            {activity.leadId ? <span>Lead: {activity.leadId}</span> : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link to="/billing">
            <Card className="border-none app-surface-strong transition-all hover:-translate-y-0.5 hover:app-shadow">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', access.toneClassName)}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold app-text">Dostęp workspace</p>
                  <p className="mt-1 text-sm app-muted">{access.headline}. {access.hasAccess ? 'Praca operacyjna jest odblokowana.' : 'Zapis jest wstrzymany do wznowienia planu.'}</p>
                </div>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--app-primary)' }}>
                  {access.ctaLabel} <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/today">
            <Card className="border-none app-surface-strong transition-all hover:-translate-y-0.5 hover:app-shadow">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl app-primary-chip">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold app-text">Centrum dowodzenia</p>
                  <p className="mt-1 text-sm app-muted">Wejdź w Dziś, żeby jednym ekranem przelecieć zaległe, waiting i ruch na teraz.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/leads">
            <Card className="border-none app-surface-strong transition-all hover:-translate-y-0.5 hover:app-shadow">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold app-text">Lejek sprzedaży</p>
                  <p className="mt-1 text-sm app-muted">Przejdź do listy i pipeline, żeby ruszyć leady bez przekopywania całej aplikacji.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/activity">
            <Card className="border-none app-surface-strong transition-all hover:-translate-y-0.5 hover:app-shadow">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold app-text">Taśma operacyjna</p>
                  <p className="mt-1 text-sm app-muted">Pełna historia działań, filtrów i skoków do leadów oraz spraw.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
