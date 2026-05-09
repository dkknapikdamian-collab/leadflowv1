import {
  EntityIcon,
  NotificationEntityIcon } from '../components/ui-system';
﻿import {
  useEffect,
  useMemo,
  useState } from 'react';
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  Filter,
  Link2,
  Mail,
  RotateCcw,
  Search,
  Settings2,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { fetchCalendarBundleFromSupabase, type CalendarBundle } from '../lib/calendar-items';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  buildTodayNotificationItems,
  clearNotificationLog,
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  getNotificationLog,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  setBrowserNotificationsEnabled,
  setNotificationSnooze,
  setNotificationSnoozeCustom,
  clearNotificationSnooze,
  getNotificationSnoozedUntilByKey,
  type NotificationItem,
  type NotificationLogItem,
  type NotificationSnoozeMode,
} from '../lib/notifications';
import { buildReminderCustomDate } from '../lib/reminders';
import { toast } from 'sonner';
import '../styles/visual-stage10-notifications-vnext.css';
import '../styles/hotfix-right-rail-dark-wrappers.css';

type NotificationFilter =
  | 'all'
  | 'action'
  | 'overdue'
  | 'today'
  | 'upcoming'
  | 'snoozed'
  | 'read'
  | 'system';

type NotificationRowKind = 'task' | 'event' | 'lead' | 'ai_draft' | 'system';

type NotificationRowStatus = 'action' | 'overdue' | 'snoozed' | 'read' | 'sent' | 'error';

type NotificationRow = {
  key: string;
  kind: NotificationRowKind;
  title: string;
  meta: string;
  relationType: string;
  relationLabel: string;
  timeLabel: string;
  status: NotificationRowStatus;
  statusLabel: string;
  link: string;
  startsAt?: string;
  searchText: string;
  source: 'active' | 'log' | 'system';
};

const notificationFilters: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'action', label: 'Do reakcji' },
  { value: 'overdue', label: 'Zaległe' },
  { value: 'today', label: 'Dzisiaj' },
  { value: 'upcoming', label: 'Nadchodzące' },
  { value: 'snoozed', label: 'Odłożone' },
  { value: 'read', label: 'Przeczytane' },
  { value: 'system', label: 'Systemowe' },
];

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isYesterday(value: Date, now: Date) {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameDay(value, yesterday);
}

function formatClock(value: Date) {
  return value.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

function formatShortDate(value?: string | null) {
  const parsed = parseDate(value);
  if (!parsed) return 'Brak daty';

  const now = new Date();
  if (isSameDay(parsed, now)) return 'dzisiaj ' + formatClock(parsed);
  if (isYesterday(parsed, now)) return 'wczoraj';

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(parsed)
    .replace(/\./g, '');
}

function formatDueMeta(value?: string | null) {
  const parsed = parseDate(value);
  if (!parsed) return 'Brak terminu';

  const now = new Date();
  const diffMinutes = Math.round((parsed.getTime() - now.getTime()) / 60_000);
  const abs = Math.abs(diffMinutes);

  if (diffMinutes < 0) {
    if (abs < 60) return 'Termin minął ' + abs + ' min temu';
    if (abs < 1440) return 'Termin minął ' + Math.round(abs / 60) + ' h temu';
    if (isYesterday(parsed, now)) return 'Termin minął wczoraj';
    return 'Termin minął: ' + formatShortDate(value);
  }

  if (diffMinutes <= 60) return 'Termin za ' + Math.max(1, diffMinutes) + ' min';
  if (diffMinutes < 1440) return 'Termin dzisiaj ' + formatClock(parsed);
  return 'Zaplanowane: ' + formatShortDate(value);
}

function kindLabel(kind: NotificationRowKind) {
  if (kind === 'task') return 'Zadanie';
  if (kind === 'event') return 'Wydarzenie';
  if (kind === 'lead') return 'Lead';
  if (kind === 'ai_draft') return 'Szkic AI';
  return 'System';
}

function statusLabel(status: NotificationRowStatus) {
  if (status === 'overdue') return 'Zaległe';
  if (status === 'snoozed') return 'Odłożone';
  if (status === 'read') return 'Przeczytane';
  if (status === 'sent') return 'Wysłane';
  if (status === 'error') return 'Błąd';
  return 'Do reakcji';
}

function rowTitle(item: NotificationItem) {
  if (item.severity === 'overdue') {
    if (item.kind === 'task') return 'Zadanie zaległe';
    if (item.kind === 'event') return 'Wydarzenie zaległe';
    return 'Lead wymaga reakcji';
  }

  if (item.kind === 'task') return 'Zadanie do wykonania';
  if (item.kind === 'event') return 'Termin w kalendarzu';
  return 'Lead do kontaktu';
}

function relationTypeFromKind(kind: NotificationRowKind) {
  if (kind === 'task') return 'Zadanie';
  if (kind === 'event') return 'Wydarzenie';
  if (kind === 'lead') return 'Lead';
  if (kind === 'ai_draft') return 'Szkic AI';
  return 'Powiązanie';
}

function rowKindFromItem(kind: NotificationItem['kind']): NotificationRowKind {
  if (kind === 'task') return 'task';
  if (kind === 'event') return 'event';
  if (kind === 'ai_draft') return 'ai_draft';
  return 'lead';
}

function makeSearchText(parts: unknown[]) {
  return parts.map((part) => normalizeText(part).toLowerCase()).join(' ');
}

function getSnoozeUntilLabel(value?: string) {
  const parsed = parseDate(value);
  if (!parsed) return 'Odłożone';
  return 'Odłożone do ' + formatShortDate(parsed.toISOString());
}

function buildActiveRow(
  item: NotificationItem,
  readKeys: string[],
  snoozedUntilByKey: Record<string, string>,
): NotificationRow {
  const kind = rowKindFromItem(item.kind);
  const snoozedUntil = snoozedUntilByKey[item.key];
  const snoozedDate = parseDate(snoozedUntil);
  const isSnoozed = Boolean(snoozedDate && snoozedDate.getTime() > Date.now());
  const isRead = readKeys.includes(item.key);
  const status: NotificationRowStatus = isSnoozed ? 'snoozed' : isRead ? 'read' : item.severity === 'overdue' ? 'overdue' : 'action';
  const title = status === 'snoozed' ? 'Powiadomienie odłożone' : rowTitle(item);
  const meta = status === 'snoozed' ? getSnoozeUntilLabel(snoozedUntil) : formatDueMeta(item.startsAt);
  const relationLabel = item.leadName || item.title || 'Bez powiązania';

  return {
    key: item.key,
    kind,
    title,
    meta,
    relationType: relationTypeFromKind(kind),
    relationLabel,
    timeLabel: formatShortDate(item.startsAt),
    status,
    statusLabel: statusLabel(status),
    link: item.link || '',
    startsAt: item.startsAt,
    searchText: makeSearchText([title, meta, relationLabel, item.body, kindLabel(kind), statusLabel(status)]),
    source: 'active',
  };
}

function buildLogRow(item: NotificationLogItem): NotificationRow {
  const kind = rowKindFromItem(item.kind);
  const status: NotificationRowStatus = item.read ? 'read' : 'sent';
  const title = item.read ? 'Powiadomienie przeczytane' : 'Powiadomienie wysłane';
  const relationLabel = item.leadName || item.title || 'Bez powiązania';
  const meta = item.body || 'Powiadomienie zostało pokazane użytkownikowi';

  return {
    key: 'log:' + item.key,
    kind,
    title,
    meta,
    relationType: relationTypeFromKind(kind),
    relationLabel,
    timeLabel: formatShortDate(item.deliveredAt),
    status,
    statusLabel: statusLabel(status),
    link: item.link || '',
    startsAt: item.deliveredAt,
    searchText: makeSearchText([title, meta, relationLabel, item.body, kindLabel(kind), statusLabel(status)]),
    source: 'log',
  };
}

function rowMatchesFilter(row: NotificationRow, filter: NotificationFilter) {
  if (filter === 'all') return true;
  if (filter === 'action') return row.status === 'action' || row.status === 'overdue' || row.status === 'sent';
  if (filter === 'overdue') return row.status === 'overdue';
  if (filter === 'today') {
    const parsed = parseDate(row.startsAt);
    return parsed ? isSameDay(parsed, new Date()) : false;
  }
  if (filter === 'upcoming') {
    const parsed = parseDate(row.startsAt);
    return Boolean(parsed && parsed.getTime() > Date.now() && row.status !== 'snoozed');
  }
  if (filter === 'snoozed') return row.status === 'snoozed';
  if (filter === 'read') return row.status === 'read';
  if (filter === 'system') return row.kind === 'system';
  return true;
}

function rowIconClass(status: NotificationRowStatus, kind: NotificationRowKind) {
  if (status === 'overdue' || status === 'error') return 'notifications-row-icon-red';
  if (status === 'snoozed') return 'notifications-row-icon-amber';
  if (status === 'read') return 'notifications-row-icon-neutral';
  if (kind === 'event') return 'notifications-row-icon-sky';
  if (kind === 'lead') return 'notifications-row-icon-blue';
  return 'notifications-row-icon-green';
}

function notificationRowSeverity(status: NotificationRowStatus): 'error' | 'warning' | 'info' | 'success' {
  if (status === 'overdue' || status === 'error') return 'error';
  if (status === 'snoozed') return 'warning';
  if (status === 'read') return 'success';
  return 'info';
}

function NotificationRowIcon({ kind }: { kind: NotificationRowKind }) {
  if (kind === 'task') return <CheckCircle2 className="h-4 w-4" />;
  if (kind === 'event') return <CalendarClock className="h-4 w-4" />;
  if (kind === 'lead') return <EntityIcon entity="lead" className="h-4 w-4" />;
  if (kind === 'ai_draft') return <EntityIcon entity="notification" className="h-4 w-4" />;
  return <ShieldAlert className="h-4 w-4" />;
}

function MetricCard({
  label,
  value,
  active,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: number;
  active?: boolean;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={['notifications-stat-card', active ? 'notifications-stat-card-active' : ''].join(' ')}
      onClick={onClick}
    >
      <span>
        <span className="notifications-stat-label">{label}</span>
        <strong>{value}</strong>
      </span>
      <span className="notifications-stat-icon" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </span>
    </button>
  );
}

function PermissionCopy({ permission, browserEnabled }: { permission: NotificationPermission | 'unsupported'; browserEnabled: boolean }) {
  if (permission === 'unsupported') {
    return (
      <>
        <strong>Powiadomienia w aplikacji działają</strong>
        <span>Ta przeglądarka może nie obsługiwać powiadomień. Przypomnienia w aplikacji nadal działają.</span>
      </>
    );
  }

  if (permission === 'granted') {
    return (
      <>
        <strong>Powiadomienia przeglądarki są włączone</strong>
        <span>Live powiadomienia: {browserEnabled ? 'włączone' : 'wyłączone w ustawieniach aplikacji'}.</span>
      </>
    );
  }

  if (permission === 'denied') {
    return (
      <>
        <strong>Powiadomienia są zablokowane w przeglądarce</strong>
        <span>Odblokuj je w ustawieniach przeglądarki. W aplikacji nadal zobaczysz alerty.</span>
      </>
    );
  }

  return (
    <>
      <strong>Powiadomienia przeglądarki nie są jeszcze włączone</strong>
      <span>Możesz je włączyć, żeby terminy i pilne zadania nie uciekały z ekranu.</span>
    </>
  );
}

function NotificationsRow({
  row,
  onSnooze,
  onSnoozeCustom,
  onRead,
  onRestore,
}: {
  row: NotificationRow;
  onSnooze: (key: string, mode: NotificationSnoozeMode) => void;
  onSnoozeCustom: (key: string) => void;
  onRead: (key: string) => void;
  onRestore: (key: string) => void;
}) {
  return (
    <article className="notifications-row" data-testid="notification-row">
            <div className="notifications-row-icon cf-severity-dot" data-cf-severity={notificationRowSeverity(row.status)}>
        <NotificationRowIcon kind={row.kind} />
      </div>

      <div className="notifications-row-main">
        <div className="notifications-row-pills">
          <span className="notifications-kind-pill">{kindLabel(row.kind)}</span>
        </div>
        <h2>{row.title || 'Powiadomienie'}</h2>
        <p>{row.meta || 'Wymaga sprawdzenia w aplikacji.'}</p>
      </div>

      <div className="notifications-row-relation">
        <span>{row.relationType || 'Powiązanie'}</span>
        {row.link ? (
          <Link to={row.link}>
            <Link2 className="h-3.5 w-3.5" />
            {row.relationLabel || 'Otwórz rekord'}
          </Link>
        ) : (
          <strong>{row.relationLabel || 'Bez powiązania'}</strong>
        )}
      </div>

      <time className="notifications-row-time">{row.timeLabel}</time>
      <span className="notifications-status-pill cf-severity-pill" data-cf-severity={notificationRowSeverity(row.status)}>{row.statusLabel}</span>

      <div className="notifications-row-actions">
        {row.link ? (
          <Link className="notifications-action notifications-action-open" to={row.link}>
            <ArrowUpRight className="h-3.5 w-3.5" />
            Otwórz
          </Link>
        ) : null}

        {row.status === 'snoozed' ? (
          <button type="button" className="notifications-action notifications-action-neutral" onClick={() => onRestore(row.key)}>
            <RotateCcw className="h-3.5 w-3.5" />
            Przywróć
          </button>
        ) : null}

        {row.source === 'active' && row.status !== 'snoozed' && row.status !== 'read' ? (
          <>
            <button type="button" className="notifications-action notifications-action-amber" aria-label="Odłóż 15m" title="Odłóż 15m" onClick={() => onSnooze(row.key, '15m')}>15m</button>
            <button type="button" className="notifications-action notifications-action-amber" aria-label="Odłóż 1h" title="Odłóż 1h" onClick={() => onSnooze(row.key, '1h')}>1h</button>
            <button type="button" className="notifications-action notifications-action-amber" aria-label="Odłóż do jutra" title="Odłóż do jutra" onClick={() => onSnooze(row.key, 'tomorrow')}>Jutro</button>
            <button type="button" className="notifications-action notifications-action-amber" aria-label="Odłóż na datę" title="Odłóż na datę" onClick={() => onSnoozeCustom(row.key)}>Data</button>
          </>
        ) : null}

        {row.status !== 'read' ? (
          <button type="button" className="notifications-action notifications-action-neutral" onClick={() => onRead(row.key)}>
            <Check className="h-3.5 w-3.5" />
            Przeczytane
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default function NotificationsCenter() {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<CalendarBundle>({ tasks: [], events: [], leads: [], cases: [] });
  const [logTick, setLogTick] = useState(0);
  const [browserEnabled, setBrowserEnabledState] = useState(getBrowserNotificationsEnabled());
  const [permission, setPermission] = useState(getBrowserNotificationPermission());
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readKeys, setReadKeys] = useState<string[]>([]);
  const [snoozedUntilByKey, setSnoozedUntilByKey] = useState<Record<string, string>>(() => getNotificationSnoozedUntilByKey());

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setBundle({ tasks: [], events: [], leads: [], cases: [] });
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const nextBundle = await fetchCalendarBundleFromSupabase();
        if (!cancelled) {
          setBundle(nextBundle);
          setBrowserEnabledState(getBrowserNotificationsEnabled());
          setPermission(getBrowserNotificationPermission());
          setSnoozedUntilByKey(getNotificationSnoozedUntilByKey());
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error('Błąd odczytu powiadomień: ' + (error?.message || 'nie udało się pobrać danych'));
        }
      } finally {
        if (!cancelled) setLoading(false);
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
  }, [workspace?.id, workspaceLoading]);

  const todayItems = useMemo(() => buildTodayNotificationItems(bundle, new Date()), [bundle]);
  const notificationLog = useMemo(() => getNotificationLog(), [logTick]);
  const unreadCount = useMemo(() => getUnreadNotificationCount(), [logTick]);

  const rows = useMemo(() => {
    const activeRows = todayItems.map((item) => buildActiveRow(item, readKeys, snoozedUntilByKey));
    const logRows = notificationLog.map(buildLogRow);
    const seen = new Set<string>();

    return [...activeRows, ...logRows]
      .filter((row) => {
        if (seen.has(row.key)) return false;
        seen.add(row.key);
        return true;
      })
      .sort((a, b) => (parseDate(a.startsAt)?.getTime() || 0) - (parseDate(b.startsAt)?.getTime() || 0));
  }, [todayItems, notificationLog, readKeys, snoozedUntilByKey]);

  const metrics = useMemo(() => {
    return {
      all: rows.length,
      action: rows.filter((row) => rowMatchesFilter(row, 'action')).length,
      overdue: rows.filter((row) => rowMatchesFilter(row, 'overdue')).length,
      today: rows.filter((row) => rowMatchesFilter(row, 'today')).length,
      upcoming: rows.filter((row) => rowMatchesFilter(row, 'upcoming')).length,
      snoozed: rows.filter((row) => rowMatchesFilter(row, 'snoozed')).length,
      read: rows.filter((row) => rowMatchesFilter(row, 'read')).length,
      system: rows.filter((row) => rowMatchesFilter(row, 'system')).length,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      if (!rowMatchesFilter(row, activeFilter)) return false;
      if (!normalizedQuery) return true;
      return row.searchText.includes(normalizedQuery);
    });
  }, [rows, activeFilter, searchQuery]);

  const upcomingRows = useMemo(() => rows.filter((row) => rowMatchesFilter(row, 'upcoming')).slice(0, 4), [rows]);

  const handleEnableBrowserNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      toast.info('Ta przeglądarka może nie obsługiwać powiadomień.');
      return;
    }

    if (Notification.permission === 'denied') {
      setPermission('denied');
      toast.info('Odblokuj powiadomienia w ustawieniach przeglądarki.');
      return;
    }

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);
      if (nextPermission === 'granted') {
        setBrowserNotificationsEnabled(true);
        setBrowserEnabledState(true);
        toast.success('Powiadomienia przeglądarki są włączone.');
      }
    } catch {
      toast.error('Nie udało się włączyć powiadomień przeglądarki.');
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setReadKeys((current) => Array.from(new Set([...current, ...todayItems.map((item) => item.key)])));
    setLogTick((value) => value + 1);
    toast.success('Powiadomienia oznaczone jako przeczytane.');
  };

  const handleClearLog = () => {
    clearNotificationLog();
    setLogTick((value) => value + 1);
    toast.success('Historia powiadomień została wyczyszczona.');
  };

  const handleSnooze = (key: string, mode: NotificationSnoozeMode) => {
    const snooze = setNotificationSnooze(key, mode);
    setSnoozedUntilByKey(getNotificationSnoozedUntilByKey());

    if (!snooze) {
      toast.error('Nie udało się odłożyć powiadomienia.');
      return;
    }

    toast.success(mode === 'tomorrow' ? 'Powiadomienie odłożone do jutra.' : 'Powiadomienie odłożone.');
  };

  const handleSnoozeCustom = (key: string) => {
    const input = window.prompt('Podaj datę i godzinę (YYYY-MM-DD HH:mm)');
    if (!input) return;
    const normalizedIso = buildReminderCustomDate(input.replace(' ', 'T'));
    if (!normalizedIso) {
      toast.error('Nieprawidłowy format daty.');
      return;
    }
    const snooze = setNotificationSnoozeCustom(key, normalizedIso);
    setSnoozedUntilByKey(getNotificationSnoozedUntilByKey());
    if (!snooze) {
      toast.error('Nie udało się odłożyć powiadomienia.');
      return;
    }
    toast.success('Powiadomienie odłożone do wybranej daty.');
  };

  const handleRead = (key: string) => {
    setReadKeys((current) => (current.includes(key) ? current : [...current, key]));
    toast.success('Oznaczono jako przeczytane.');
  };

  const handleRestore = (key: string) => {
    clearNotificationSnooze(key);
    setSnoozedUntilByKey(getNotificationSnoozedUntilByKey());
    toast.success('Powiadomienie przywrócone.');
  };

  return (
    <Layout>
      <main className="notifications-vnext-page">
        <header className="notifications-page-header">
          <div>
            <p className="notifications-kicker">POWIADOMIENIA</p>
            <h1>Powiadomienia</h1>
            <p>Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.</p>
          </div>

          <div className="notifications-header-actions">
            {permission === 'default' ? (
              <button type="button" className="notifications-header-button notifications-header-button-primary" onClick={handleEnableBrowserNotifications}>
                <EntityIcon entity="notification" className="h-4 w-4" />
                Włącz powiadomienia
              </button>
            ) : null}
            <Link to="/settings" className="notifications-header-button">
              <Settings2 className="h-4 w-4" />
              Ustawienia przypomnień
            </Link>
            {notificationLog.length ? (
              <button type="button" className="notifications-header-button" onClick={handleClearLog}>
                <Trash2 className="h-4 w-4" />
                Wyczyść przeczytane
              </button>
            ) : null}
          </div>
        </header>

        <section className="notifications-stats-grid" aria-label="Statystyki powiadomień">
          <StatShortcutCard label="Wszystkie" value={metrics.all} icon={NotificationEntityIcon} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} iconClassName="bg-slate-100 text-slate-500" />
          <StatShortcutCard label="Do reakcji" value={metrics.action} icon={ShieldAlert} active={activeFilter === 'action'} onClick={() => setActiveFilter('action')} iconClassName="bg-blue-50 text-blue-500" valueClassName="text-blue-600" />
          <StatShortcutCard label="Zaległe" value={metrics.overdue} icon={Clock3} active={activeFilter === 'overdue'} onClick={() => setActiveFilter('overdue')} tone="red" />
          <StatShortcutCard label="Dzisiaj" value={metrics.today} icon={CalendarClock} active={activeFilter === 'today'} onClick={() => setActiveFilter('today')} iconClassName="bg-indigo-50 text-indigo-500" />
          <StatShortcutCard label="Nadchodzące" value={metrics.upcoming} icon={NotificationEntityIcon} active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')} iconClassName="bg-slate-100 text-slate-500" />
          <StatShortcutCard label="Odłożone" value={metrics.snoozed} icon={RotateCcw} active={activeFilter === 'snoozed'} onClick={() => setActiveFilter('snoozed')} tone="amber" />
          <StatShortcutCard label="Przeczytane" value={metrics.read} icon={Check} active={activeFilter === 'read'} onClick={() => setActiveFilter('read')} iconClassName="bg-emerald-50 text-emerald-500" valueClassName="text-emerald-600" />
        </section>

        <div className="notifications-vnext-shell">
          <section className="notifications-main-column">
            <div className="notifications-toolbar-card">
              <div className="notifications-filter-pills" aria-label="Filtry powiadomień">
                {notificationFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={['notifications-filter-pill', activeFilter === filter.value ? 'notifications-filter-pill-active' : ''].join(' ')}
                    onClick={() => setActiveFilter(filter.value)}
                  >
                    <span>{filter.label}</span>
                    <strong>{metrics[filter.value] || 0}</strong>
                  </button>
                ))}
              </div>

              <label className="notifications-search-box">
                <Search className="h-4 w-4" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Szukaj po leadzie, sprawie, zadaniu, terminie albo treści powiadomienia..."
                />
              </label>
            </div>

            <section className="notifications-list-card" aria-label="Lista powiadomień">
              <div className="notifications-list-head">
                <div>
                  <p>Centrum reakcji</p>
                  <h2>Powiadomienia i przypomnienia</h2>
                </div>
                <span>{filteredRows.length} / {rows.length}</span>
              </div>

              {loading ? (
                <div className="notifications-empty-state">
                  <EntityIcon entity="notification" className="h-8 w-8" />
                  <h2>Ładowanie powiadomień...</h2>
                  <p>Sprawdzam zadania, wydarzenia i historię wysłanych alertów.</p>
                </div>
              ) : filteredRows.length === 0 ? (
                <div className="notifications-empty-state">
                  <EntityIcon entity="notification" className="h-8 w-8" />
                  <h2>Brak powiadomień</h2>
                  <p>Gdy pojawią się zaległe zadania, terminy albo szkice do sprawdzenia, zobaczysz je tutaj.</p>
                  <div className="notifications-empty-actions">
                    <Link to="/tasks">Przejdź do zadań</Link>
                    <Link to="/calendar">Przejdź do kalendarza</Link>
                  </div>
                </div>
              ) : (
                <div className="notifications-rows">
                  {filteredRows.map((row) => (
                    <div key={row.key} style={{ display: 'contents' }}>
                      <NotificationsRow
                        row={row}
                        onSnooze={handleSnooze}
                        onSnoozeCustom={handleSnoozeCustom}
                        onRead={handleRead}
                        onRestore={handleRestore}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>

          <aside className="notifications-right-rail" aria-label="Panel powiadomień">
            <section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <EntityIcon entity="notification" className="h-4 w-4" />
                <h2>Kanały</h2>
              </div>
              <div className="notifications-channel-card">
                <PermissionCopy permission={permission} browserEnabled={browserEnabled} />
                {permission === 'default' ? (
                  <button type="button" onClick={handleEnableBrowserNotifications}>Włącz powiadomienia</button>
                ) : null}
              </div>
              <div className="notifications-channel-card">
                <strong>Poranny digest e-mail</strong>
                <span>Digest działa tylko po konfiguracji (plan + ENV + adres odbiorcy). Status sprawdzisz w Ustawieniach.</span>
                <em>Konfiguracja w Ustawieniach</em>
              </div>
            </section>

            <section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <Filter className="h-4 w-4" />
                <h2>Szybkie akcje</h2>
              </div>
              <button type="button" className="notifications-rail-button" onClick={() => setActiveFilter('action')}>
                <span>Do reakcji</span>
                <strong>{metrics.action}</strong>
              </button>
              <button type="button" className="notifications-rail-button" onClick={() => setActiveFilter('overdue')}>
                <span>Zaległe</span>
                <strong>{metrics.overdue}</strong>
              </button>
              <button type="button" className="notifications-rail-button" onClick={handleMarkAllRead}>
                <span>Oznacz przeczytane</span>
                <strong>{unreadCount}</strong>
              </button>
            </section>

            <section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <Clock3 className="h-4 w-4" />
                <h2>Nadchodzące</h2>
              </div>
              {upcomingRows.length ? (
                <div className="notifications-rail-list">
                  {upcomingRows.map((row) => (
                    <div key={'upcoming:' + row.key} className="notifications-rail-item">
                      <span>{row.timeLabel}</span>
                      <strong>{row.relationLabel}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="notifications-rail-empty">Brak nadchodzących przypomnień w obecnym widoku.</p>
              )}
            </section>

            <section className="right-card notifications-right-card">
              <div className="notifications-right-card-head">
                <Mail className="h-4 w-4" />
                <h2>Jak działają powiadomienia?</h2>
              </div>
              <p className="notifications-rail-empty">
                Ten widok zbiera terminy z zadań, wydarzeń i leadów oraz historię alertów pokazanych w aplikacji. Finalna reakcja zawsze zostaje po stronie użytkownika.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
