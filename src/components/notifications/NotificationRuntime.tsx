import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Bell, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { Button } from '../ui/button';
import {
  buildReminderItems,
  getVisibleReminderItems,
  loadReminderSettings,
  markReminderShown,
  showBrowserNotification,
  snoozeReminder,
} from '../../lib/notifications';
import { useWorkspace } from '../../hooks/useWorkspace';

const RUNTIME_INTERVAL_MS = 60_000;

export default function NotificationRuntime() {
  const { workspace } = useWorkspace();
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!auth.currentUser || !workspace?.id) return;
    const uid = auth.currentUser.uid;

    const unsubTasks = onSnapshot(
      query(collection(db, 'tasks'), where('ownerId', '==', uid)),
      (snapshot) => setTasks(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    );
    const unsubEvents = onSnapshot(
      query(collection(db, 'events'), where('ownerId', '==', uid)),
      (snapshot) => setEvents(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    );
    const unsubLeads = onSnapshot(
      query(collection(db, 'leads'), where('ownerId', '==', uid)),
      (snapshot) => setLeads(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    );

    return () => {
      unsubTasks();
      unsubEvents();
      unsubLeads();
    };
  }, [workspace?.id]);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), RUNTIME_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  const visibleItems = useMemo(() => {
    const userId = auth.currentUser?.uid ?? 'local';
    const settings = loadReminderSettings(userId);
    if (!settings.liveNotificationsEnabled) return [];
    const items = buildReminderItems({ tasks, events, leads, settings, now: new Date() });
    return getVisibleReminderItems(items).slice(0, 3);
  }, [tasks, events, leads, tick]);

  useEffect(() => {
    if (!auth.currentUser || visibleItems.length === 0) return;
    const userId = auth.currentUser.uid;
    const settings = loadReminderSettings(userId);

    visibleItems.forEach((item) => {
      markReminderShown(item);
      if (settings.browserNotificationsEnabled) showBrowserNotification(item);

      toast.custom(
        () => (
          <div className="w-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg text-xs"
                    onClick={() => snoozeReminder(item.key, settings.defaultSnoozeMinutes)}
                  >
                    <Clock className="mr-1 h-3 w-3" /> Odłóż
                  </Button>
                  <Button size="sm" className="h-8 rounded-lg text-xs" asChild>
                    <Link to={item.href}>
                      Otwórz <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ),
        { id: item.key, duration: 8000 }
      );
    });
  }, [visibleItems]);

  return null;
}
