import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Bell, CheckCircle2, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { auth, db } from '../firebase';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  buildReminderItems,
  clearReminderLog,
  dismissReminder,
  getReminderLog,
  getVisibleReminderItems,
  listReminderLogs,
  loadReminderSettings,
  snoozeReminder,
  type ReminderItem,
  type ReminderLogEntry,
} from '../lib/notifications';

function priorityLabel(priority: string) {
  if (priority === 'high') return 'Pilne';
  if (priority === 'medium') return 'Ważne';
  return 'Niskie';
}

function sourceLabel(kind: string) {
  if (kind === 'task') return 'Zadanie';
  if (kind === 'event') return 'Wydarzenie';
  return 'Lead';
}

function ReminderCard({ item, onRefresh }: { key?: string; item: ReminderItem; onRefresh: () => void }) {
  const log = getReminderLog(item.key);
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className={item.priority === 'high' ? 'bg-rose-100 text-rose-700 hover:bg-rose-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                {priorityLabel(item.priority)}
              </Badge>
              <Badge variant="outline">{sourceLabel(item.sourceKind)}</Badge>
              {log?.snoozedUntil && <Badge variant="outline">Odłożone do {new Date(log.snoozedUntil).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</Badge>}
            </div>
            <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.description}</p>
            {item.dueAt && <p className="mt-2 text-xs font-medium text-slate-400">Termin: {new Date(item.dueAt).toLocaleString('pl-PL')}</p>}
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => {
                snoozeReminder(item.key, 15);
                onRefresh();
              }}
            >
              15 min
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => {
                snoozeReminder(item.key, 60);
                onRefresh();
              }}
            >
              1h
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => {
                snoozeReminder(item.key, 24 * 60);
                onRefresh();
              }}
            >
              Jutro
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => {
                dismissReminder(item.key);
                onRefresh();
              }}
            >
              Zamknij
            </Button>
            <Button size="sm" className="rounded-lg" asChild>
              <Link to={item.href}>Otwórz <ExternalLink className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryRow({ entry }: { key?: string; entry: ReminderLogEntry }) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 py-3 last:border-0 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
        <p className="text-xs text-slate-500">Ostatnio: {new Date(entry.lastShownAt).toLocaleString('pl-PL')} · pokazano {entry.shownCount}x</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {entry.snoozedUntil && <Badge variant="outline">Odłożone</Badge>}
        {entry.dismissedAt && <Badge variant="secondary">Zamknięte</Badge>}
      </div>
    </div>
  );
}

export default function NotificationsCenter() {
  const { workspace } = useWorkspace();
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!auth.currentUser || !workspace?.id) return;
    const uid = auth.currentUser.uid;
    const unsubTasks = onSnapshot(query(collection(db, 'tasks'), where('ownerId', '==', uid)), (snapshot) => {
      setTasks(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    const unsubEvents = onSnapshot(query(collection(db, 'events'), where('ownerId', '==', uid)), (snapshot) => {
      setEvents(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    const unsubLeads = onSnapshot(query(collection(db, 'leads'), where('ownerId', '==', uid)), (snapshot) => {
      setLeads(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    return () => {
      unsubTasks();
      unsubEvents();
      unsubLeads();
    };
  }, [workspace?.id]);

  const settings = loadReminderSettings(auth.currentUser?.uid ?? 'local');
  const activeItems = useMemo(() => {
    const items = buildReminderItems({ tasks, events, leads, settings, now: new Date() });
    return getVisibleReminderItems(items);
  }, [tasks, events, leads, refreshKey]);
  const history = useMemo(() => listReminderLogs(), [refreshKey]);

  const refresh = () => setRefreshKey((value) => value + 1);

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl space-y-8 p-4 md:p-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Powiadomienia</h1>
            <p className="text-slate-500">Jedno miejsce na zaległe terminy, rzeczy na dziś i leady bez zaplanowanej akcji.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => { clearReminderLog(); refresh(); }}>
              <Trash2 className="mr-2 h-4 w-4" /> Wyczyść historię
            </Button>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/settings">Ustawienia</Link>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Aktywne</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{activeItems.length}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Historia</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{history.length}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Snooze</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{history.filter((item) => item.snoozedUntil && !item.dismissedAt).length}</p>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">Wymaga uwagi</h2>
          </div>
          {activeItems.length > 0 ? (
            <div className="space-y-3">
              {activeItems.map((item) => <ReminderCard key={item.key} item={item} onRefresh={refresh} />)}
            </div>
          ) : (
            <Card className="border-dashed bg-white/60">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
                <p className="font-bold text-slate-900">Brak aktywnych powiadomień</p>
                <p className="mt-1 text-sm text-slate-500">System nie widzi teraz zaległych terminów ani leadów bez akcji.</p>
              </CardContent>
            </Card>
          )}
        </section>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5 text-slate-400" /> Historia</CardTitle>
            <CardDescription>To jest lokalna historia wyświetlonych przypomnień i odłożeń.</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? history.slice(0, 20).map((entry) => <HistoryRow key={entry.key} entry={entry} />) : <p className="text-sm text-slate-500">Historia jest pusta.</p>}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
