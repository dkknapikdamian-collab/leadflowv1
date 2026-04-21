import { useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, Clock3, Mail, RefreshCw, ShieldAlert, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { fetchCalendarBundleFromSupabase, type CalendarBundle } from '../lib/calendar-items';
import {
  buildTodayNotificationItems,
  clearNotificationLog,
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  getNotificationLog,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  setBrowserNotificationsEnabled,
  supportsBrowserNotifications,
} from '../lib/notifications';
import { toast } from 'sonner';

export default function NotificationsCenter() {
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<CalendarBundle>({ tasks: [], events: [], leads: [] });
  const [browserEnabled, setBrowserEnabledState] = useState(getBrowserNotificationsEnabled());
  const [permission, setPermission] = useState(getBrowserNotificationPermission());
  const [logTick, setLogTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const nextBundle = await fetchCalendarBundleFromSupabase();
        if (!cancelled) {
          setBundle(nextBundle);
          setPermission(getBrowserNotificationPermission());
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(`Błąd odczytu powiadomień: ${error.message}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    const interval = window.setInterval(() => {
      void load();
      setLogTick((value) => value + 1);
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const todayItems = useMemo(() => buildTodayNotificationItems(bundle, new Date()), [bundle]);
  const notificationLog = useMemo(() => getNotificationLog(), [logTick]);
  const unreadCount = useMemo(() => getUnreadNotificationCount(), [logTick]);

  const requestPermission = async () => {
    if (!supportsBrowserNotifications()) {
      toast.error('Ta przeglądarka nie wspiera powiadomień systemowych.');
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      toast.success('Powiadomienia w przeglądarce zostały włączone.');
    } else {
      toast.error('Powiadomienia nie zostały włączone.');
    }
  };

  const toggleBrowserNotifications = () => {
    const next = !browserEnabled;
    setBrowserNotificationsEnabled(next);
    setBrowserEnabledState(next);
    toast.success(next ? 'Powiadomienia w aplikacji są aktywne.' : 'Powiadomienia w aplikacji zostały wyłączone.');
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setLogTick((value) => value + 1);
    toast.success('Historia powiadomień została oznaczona jako przeczytana.');
  };

  const handleClearLog = () => {
    clearNotificationLog();
    setLogTick((value) => value + 1);
    toast.success('Historia powiadomień została wyczyszczona.');
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            <Bell className="h-3.5 w-3.5" /> Powiadomienia
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Centrum powiadomień</h1>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Clock3 className="w-5 h-5 text-slate-400" /> Na dziś i do pilnego ruchu</CardTitle>
              <CardDescription>To są rzeczy, które dziś wpadają do planu lub już są po czasie.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Ładowanie powiadomień...</div>
              ) : todayItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Brak aktywnych powiadomień na dziś.</div>
              ) : (
                todayItems.map((item) => (
                  <Link key={item.key} to={item.link} className="block">
                    <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-primary/30 hover:shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <Badge variant={item.severity === 'overdue' ? 'destructive' : 'outline'}>
                          {item.severity === 'overdue' ? 'Po czasie' : 'Wkrótce'}
                        </Badge>
                        <Badge variant="secondary">{item.kind === 'task' ? 'Zadanie' : item.kind === 'event' ? 'Wydarzenie' : 'Lead'}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{item.body}</p>
                      <p className="mt-2 text-xs text-slate-400">{format(parseISO(item.startsAt), 'd MMMM yyyy, HH:mm', { locale: pl })}</p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Bell className="w-5 h-5 text-slate-400" /> Ustawienia live</CardTitle>
                <CardDescription>Powiadomienia lecą, gdy aplikacja jest otwarta i użytkownik nie jest wylogowany.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">Status przeglądarki</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {permission === 'unsupported'
                      ? 'Ta przeglądarka nie wspiera powiadomień systemowych.'
                      : permission === 'granted'
                        ? 'Powiadomienia systemowe są włączone.'
                        : permission === 'denied'
                          ? 'Powiadomienia są zablokowane w przeglądarce.'
                          : 'Powiadomienia nie są jeszcze zatwierdzone.'}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={requestPermission} disabled={permission === 'granted' || permission === 'unsupported'} className="w-full">
                    Włącz powiadomienia przeglądarki
                  </Button>
                  <Button variant={browserEnabled ? 'outline' : 'default'} onClick={toggleBrowserNotifications} className="w-full">
                    {browserEnabled ? 'Wyłącz live powiadomienia' : 'Włącz live powiadomienia'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Mail className="w-5 h-5 text-slate-400" /> Email poranny</CardTitle>
                <CardDescription>To jest następny krok, ale nie w tej paczce.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Docelowo dojdzie zbiorczy email rano z listą zadań na dziś. Teraz domykamy warstwę live w aplikacji i przeglądarce.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg"><ShieldAlert className="w-5 h-5 text-slate-400" /> Historia wysłanych powiadomień</CardTitle>
              <CardDescription>Tu użytkownik widzi, co już zostało wypchnięte jako toast albo systemowe powiadomienie.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Nieprzeczytane: {unreadCount}</Badge>
              <Button size="sm" variant="outline" onClick={handleMarkAllRead}>Oznacz wszystko jako przeczytane</Button>
              <Button size="sm" variant="ghost" onClick={handleClearLog}><Trash2 className="w-4 h-4 mr-2" />Wyczyść</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationLog.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Historia jest jeszcze pusta.</div>
            ) : (
              notificationLog.map((item) => (
                <Link key={item.key} to={item.link} className="block">
                  <div className={`rounded-2xl border p-4 transition hover:border-primary/30 ${item.read ? 'border-slate-200 bg-white' : 'border-primary/20 bg-primary/5'}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <Badge variant={item.read ? 'outline' : 'default'}>{item.read ? 'Przeczytane' : 'Nowe'}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-400">Wysłano: {format(parseISO(item.deliveredAt), 'd MMMM yyyy, HH:mm', { locale: pl })}</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
