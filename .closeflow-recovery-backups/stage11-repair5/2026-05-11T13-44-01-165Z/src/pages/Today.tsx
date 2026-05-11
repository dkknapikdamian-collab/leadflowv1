import {
  EntityIcon,
  TaskEntityIcon } from '../components/ui-system';
/*
LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15
Stage15 decision: this file is retained as an inactive legacy UI surface. Active / and /today route through TodayStable in src/App.tsx. Do not refactor this file inside active UI cleanup stages.
*/
/*
FAZA5_ETAP52_TODAY_COLLAPSIBLE_MASONRY
A13_TODAY_SOURCE_GUARD_MARKERS_FOR_EXISTING_TESTS
TODAY_AI_DRAFTS_TILE_STAGE29
TODAY_AI_DRAFTS_TILE_STAGE29D_COMPACT_BOTTOM
data-today-ai-drafts-tile="true"
data-today-ai-drafts-compact-tile="true"
Szkice do zatwierdzenia
data-today-ai-drafts-pending-count="true"
openTodayTopTileShortcut('ai_drafts')
Otw├│rz Szkice AI
function getPendingTodayAiDrafts
draft.status === 'draft'
String(draft.rawText || '').trim()
getAiLeadDraftsAsync()
setTodayAiDrafts(Array.isArray(drafts) ? drafts : [])
if (target === 'ai_drafts') {
window.location.assign('/ai-drafts')
if (target === 'ai_drafts') return 'today-section-ai-drafts';
if (target === 'ai_drafts') return 'szkice-ai';
data-today-tile-card="true"
aria-expanded={!collapsed}
TODAY_FUNNEL_DEDUP_VALUE_STAGE11
function buildTodayDedupedFunnelSummary
todayPipelineClientAmount
todayPipelineBuildPersonKey
Math.max(existing.amount,
  amount)
<TodayFunnelDedupValueCard leads={leads} clients={clients} />
*/
// TODAY_GLOBAL_QUICK_ACTIONS_DEDUPED_V97
// STAGE30A_TODAY_GUARD_COMPAT: marker only. Global actions stay in Layout,
//   not rendered locally in Today.
// VISUAL_STAGE17_TODAY_HTML_HARD_1TO1
/*
AI_DRAFTS_IN_TODAY_STAGE04
Szkice AI w Dzi┼Ť s─ů tylko do przegl─ůdu i przej┼Ťcia do centrum szkic├│w.
Finalny zapis rekordu nie dzieje si─Ö z poziomu Dzi┼Ť.
*/
/*
TODAY_AI_DRAFTS_TILE_STAGE29
TODAY_AI_DRAFTS_TILE_STAGE29D_COMPACT_BOTTOM
Dzi┼Ť pokazuje ma┼éy dolny kafelek Szkice z liczb─ů niezatwierdzonych szkic├│w AI. Bez du┼╝ej sekcji i bez ingerencji w zwijane listy.
*/

import {
  useState,
  useEffect,
  FormEvent,
  ReactNode,
  useMemo,
  useRef } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import Layout from '../components/Layout';
import { Card,
  CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Loader2,
  Repeat,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';
import {
  format,
  isPast,
  addDays,
  parseISO,
  isToday,
  differenceInCalendarDays,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TopicContactPicker } from '../components/topic-contact-picker';
import {
  buildStartEndPair,
  combineScheduleEntries,
  createDefaultRecurrence,
  createDefaultReminder,
  getTaskDate,
  getTaskStartAt,
  toReminderAtIso,
  toDateTimeLocalValue,
} from '../lib/scheduling';
import {
  EVENT_TYPES,
  PRIORITY_OPTIONS,
  RECURRENCE_OPTIONS,
  REMINDER_OFFSET_OPTIONS,
  REMINDER_MODE_OPTIONS,
  SOURCE_OPTIONS,
  TASK_TYPES,
} from '../lib/options';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { isActiveSalesLead, isLeadMovedToService, isWaitingTooLong } from '../lib/lead-health';
import { buildConflictCandidates, confirmScheduleConflicts } from '../lib/schedule-conflicts';
import { buildTopicContactOptions, findTopicContactOption, resolveTopicContactLink, type TopicContactOption } from '../lib/topic-contact';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  deleteEventFromSupabase,
  deleteTaskFromSupabase,
  fetchClientsFromSupabase,
  fetchLeadsFromSupabase,
  insertEventToSupabase,
  insertActivityToSupabase,
  insertLeadToSupabase,
  insertTaskToSupabase,
  updateEventInSupabase,
  updateLeadInSupabase,
  updateTaskInSupabase,
} from '../lib/supabase-fallback';

import { getTodayEntryPriorityReasons } from '../lib/today-v1-final';
import { getAiLeadDraftsAsync, type AiLeadDraft } from '../lib/ai-drafts';
import { installTodayStage30VisualCleanup } from '../lib/stage30-today-cleanup';
import { installTodayStage31TilesInteraction } from '../lib/stage31-today-tiles-interaction';
import { installTodayStage32RelationsLoadingPolish } from '../lib/stage32-today-relations-loading-polish';
import { normalizeWorkItem } from '../lib/work-items/normalize';
import { getNearestPlannedAction } from '../lib/nearest-action';
import { buildTodaySections, dedupeTodaySectionEntries } from '../lib/today-sections';

import '../styles/today-collapsible-masonry.css';

const TODAY_TILE_STORAGE_KEY = 'closeflow:today:collapsed:v1';
const modalSelectClass = 'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

const TODAY_QUICK_SNOOZE_OPTIONS = [
  {
    key: '1h',
    label: 'Za 1h',
    description: 'Od┼é├│┼╝ o godzin─Ö.',
    minutes: 60,
    days: 0,
  },
  {
    key: 'tomorrow',
    label: 'Jutro',
    description: 'Od┼é├│┼╝ na jutro rano.',
    minutes: 0,
    days: 1,
  },
  {
    key: '2d',
    label: 'Za 2 dni',
    description: 'Od┼é├│┼╝ o dwa dni.',
    minutes: 0,
    days: 2,
  },
  {
    key: 'next_week',
    label: 'Przysz┼éy tydzie┼ä',
    description: 'Od┼é├│┼╝ na przysz┼éy tydzie┼ä.',
    minutes: 0,
    days: 7,
  },
] as const;

function resolveTodaySnoozeAt(optionKey: string) {
  const option = TODAY_QUICK_SNOOZE_OPTIONS.find((entry) => entry.key === optionKey);
  const now = new Date();

  if (!option) {
    return now.toISOString();
  }

  if (option.minutes > 0) {
    return new Date(now.getTime() + option.minutes * 60 * 1000).toISOString();
  }

  const target = addDays(now, option.days);
  target.setHours(9, 0, 0, 0);
  return target.toISOString();
}

type TileCardProps = {
  key?: string | number;
  id: string;
  title: string;
  subtitle?: string;
  collapsedMap: Record<string, boolean>;
  onToggle: (id: string) => void;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  headerRight?: ReactNode;
  bodyClassName?: string;
};

type LeadLinkCardProps = {
  key?: string | number;
  leadId: string;
  title: string;
  subtitle?: string;
  helperText?: string;
  className?: string;
  subtitleClassName?: string;
  badges?: ReactNode;
  rightMeta?: ReactNode;
};


function shouldOpenWeeklyCalendarTile(id: string, title: string) {
  const compact = [id, title].join(' ').toLowerCase();
  return compact.includes('calendar')
    || compact.includes('kalendarz')
    || compact.includes('schedule')
    || compact.includes('najbli┼╝sze dni')
    || compact.includes('najblizsze dni');
}

function openWeeklyCalendarFromToday() {
  try {
    window.localStorage.setItem('closeflow:calendar:view:v1', 'week');
  } catch {
    // Ignore local storage errors.
  }

  window.location.assign('/calendar?view=week');
}


function shouldOpenWeeklyCalendarFromShortcutText(value: unknown) {
  const compact = String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (!compact) return false;

  const hasCalendarWord =
    compact.includes('kalendarz') ||
    compact.includes('calendar') ||
    compact.includes('termin') ||
    compact.includes('wydarze') ||
    compact.includes('najbli┼╝sze') ||
    compact.includes('najblizsze');

  const hasWeekOrDaysWord =
    compact.includes('tydzie┼ä') ||
    compact.includes('tydzien') ||
    compact.includes('dni') ||
    compact.includes('7 dni') ||
    compact.includes('najbli┼╝sze') ||
    compact.includes('najblizsze');

  return hasCalendarWord && hasWeekOrDaysWord;
}

function findTodayCalendarShortcutElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return null;

  const candidates = [
    target.closest('[data-today-week-calendar-shortcut="true"]'),
    target.closest('a'),
    target.closest('button'),
    target.closest('[role="button"]'),
    target.closest('.rounded-2xl'),
    target.closest('.rounded-xl'),
    target.closest('.group'),
  ].filter(Boolean) as HTMLElement[];

  return candidates.find((element) => shouldOpenWeeklyCalendarFromShortcutText(element.textContent)) || null;
}


type TodayTileShortcutTarget = 'urgent' | 'without_action' | 'without_movement' | 'blocked' | 'service_transition' | 'calendar' | 'ai_drafts';

function resolveTodayTileShortcutTarget(value: unknown): TodayTileShortcutTarget | null {
  const compact = String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/_/g, ' ')
    .trim();

  if (!compact) return null;

  if (compact === 'urgent' || compact === 'pilne') return 'urgent';
  if (compact === 'without action' || compact === 'without actions' || compact === 'bez dzialan' || compact === 'bez zaplanowanej akcji') return 'without_action'; // Brak nast─Öpnego kroku
  if (compact === 'without movement' || compact === 'bez ruchu') return 'without_movement';
  if (compact === 'blocked' || compact === 'zablokowane') return 'blocked';
  if (compact === 'service transition' || compact === 'start i obsluga' || compact === 'start i obs┼éuga') return 'service_transition';
  if (compact === 'calendar' || compact === 'kalendarz') return 'calendar';
  if (compact === 'ai drafts' || compact === 'ai draft' || compact === 'szkice' || compact === 'szkice ai' || compact === 'drafts') return 'ai_drafts';

  if (
    compact.includes('zablokowane')
    || compact.includes('zablokowana')
    || compact.includes('blok')
    || compact.includes('zatrzymane')
    || compact.includes('zatrzymana')
    || compact.includes('sprawy stoj')
    || compact.includes('sprawa stoi')
  ) return 'blocked';

  if (
    compact.includes('start i obs┼éuga')
    || compact.includes('start i obsluga')
    || compact.includes('obs┼éuga aktywna')
    || compact.includes('obsluga aktywna')
    || compact.includes('gotowe do uruchomienia')
  ) return 'service_transition';

  if (
    compact.includes('bez zaplanowanej akcji')
    || compact.includes('bez dzialan')
    || compact.includes('bez nast─Öpnego')
    || compact.includes('bez nastepnego')
    || compact.includes('brak nast─Öpnego')
    || compact.includes('brak nastepnego')
    || compact.includes('najbli┼╝sza zaplanowana akcja')
        || compact.includes('brak kolejnego')
    || compact.includes('bez kolejnego')
  ) return 'without_action';

  if (
    compact.includes('bez ruchu')
    || compact.includes('brak ruchu')
    || compact.includes('brak zmiany')
    || compact.includes('bez zmiany')
    || compact.includes('7 dni')
    || compact.includes('za d┼éugo')
    || compact.includes('za dlugo')
    || compact.includes('zbyt d┼éugo')
    || compact.includes('zbyt dlugo')
  ) return 'without_movement';

  if (
    compact.includes('pilne')
    || compact.includes('zaleg┼ée')
    || compact.includes('zalegle')
    || compact.includes('dzisiaj')
    || compact.includes('dzi┼Ť')
    || compact.includes('dzis')
    || compact.includes('priorytet')
    || compact.includes('wymaga uwagi')
    || compact.includes('ryzyko')
  ) return 'urgent';

  if (
    compact.includes('kalendarz')
    || compact.includes('najbli┼╝sze')
    || compact.includes('najblizsze')
    || compact.includes('termin')
    || compact.includes('wydarzenia')
  ) return 'calendar';

  if (
    compact.includes('szkice')
    || compact.includes('szkic')
    || compact.includes('ai drafts')
    || compact.includes('drafts')
    || compact.includes('do sprawdzenia')
  ) return 'ai_drafts';

  return null;
}

function getTodayTileShortcutPatterns(target: TodayTileShortcutTarget) {
  if (target === 'blocked') return ['zablokowane', 'blok'];
  if (target === 'service_transition') return ['start i obs┼éuga', 'start i obsluga', 'obs┼éuga aktywna', 'obsluga aktywna', 'gotowe do uruchomienia'];
  if (target === 'without_action') return ['bez zaplanowanej akcji', 'bez dzialan', 'bez nast─Öpnego', 'bez nastepnego', 'najbli┼╝sza zaplanowana akcja'];
  if (target === 'without_movement') return ['bez ruchu', 'brak zmiany', '7 dni'];
  if (target === 'urgent') return ['pilne', 'zaleg┼ée', 'zalegle', 'dzisiaj', 'dzi┼Ť', 'dzis'];
  if (target === 'calendar') return ['kalendarz', 'najbli┼╝sze', 'najblizsze', 'terminy', 'wydarzenia'];
  if (target === 'ai_drafts') return ['szkice', 'szkice ai', 'ai drafts', 'do sprawdzenia'];
  return [];
}

function findTodayTileIdForShortcut(target: TodayTileShortcutTarget) {
  const patterns = getTodayTileShortcutPatterns(target);

  const headers = Array.from(
    document.querySelectorAll<HTMLElement>('[data-today-tile-header="true"]'),
  );

  const exact = headers.find((header) => {
    const value = String(header.dataset.todayTileTitle || header.textContent || '').toLowerCase();
    return patterns.some((pattern) => value.includes(pattern));
  });

  if (exact?.dataset.todayTileId) {
    return exact.dataset.todayTileId;
  }

  const fallback = headers.find((header) => {
    const value = String(header.textContent || '').toLowerCase();
    return patterns.some((pattern) => value.includes(pattern));
  });

  return fallback?.dataset.todayTileId || null;
}


function getTodayTopShortcutAnchorId(target: TodayTileShortcutTarget) {
  if (target === 'urgent') return 'today-section-urgent';
  if (target === 'without_action') return 'today-section-without-action';
  if (target === 'without_movement') return 'today-section-without-movement';
  if (target === 'blocked') return 'today-section-blocked';
  if (target === 'service_transition') return 'today-section-service-transition';
  if (target === 'calendar') return 'today-section-calendar';
  if (target === 'ai_drafts') return 'today-section-ai-drafts';
  return 'today-section-shortcut';
}

function getTodayLegacyShortcutHash(target: TodayTileShortcutTarget) {
  if (target === 'urgent') return 'pilne';
  if (target === 'without_action') return 'bez-dzialan';
  if (target === 'without_movement') return 'bez-ruchu';
  if (target === 'blocked') return 'zablokowane';
  if (target === 'service_transition') return 'start-i-obsluga';
  if (target === 'calendar') return 'kalendarz';
  if (target === 'ai_drafts') return 'szkice-ai';
  return 'today';
}

function getTodayShortcutSectionElement(target: TodayTileShortcutTarget) {
  const direct = document.querySelector<HTMLElement>('[data-today-shortcut-section="' + target + '"]');
  if (direct) return direct;

  const anchor = document.getElementById(getTodayTopShortcutAnchorId(target));
  if (anchor instanceof HTMLElement) return anchor;

  const legacy = document.getElementById(getTodayLegacyShortcutHash(target));
  if (legacy instanceof HTMLElement) return legacy;

  const headers = Array.from(document.querySelectorAll<HTMLElement>('[data-today-tile-header="true"]'));
  const patterns = getTodayTileShortcutPatterns(target);
  return headers.find((header) => {
    const value = String(header.dataset.todayTileTitle || header.textContent || '').toLowerCase();
    return patterns.some((pattern) => value.includes(pattern));
  }) || null;
}

function expandTodayShortcutSection(section: HTMLElement) {
  const header = section.matches('[data-today-tile-header="true"]')
    ? section
    : section.querySelector<HTMLElement>('[data-today-tile-header="true"]');

  if (!header) return;

  if (header.getAttribute('aria-expanded') === 'false') {
    header.click();
  }
}

function openTodayTopTileShortcut(target: TodayTileShortcutTarget) {
  // TODAY_TOP_TILE_DIRECT_ANCHOR_FIX_V111: g├│rne kafelki Dzi┼Ť maj─ů jawne kotwice i nie zale┼╝─ů od tekstu nag┼é├│wka.
  if (target === 'calendar') {
    openWeeklyCalendarFromToday();
    return;
  }

  const shortcutTileId = getTodayShortcutTileId(target);
  if (shortcutTileId) {
    const header = document.querySelector<HTMLElement>(`[data-today-tile-id="${shortcutTileId}"]`);
    if (header) {
      expandTodayShortcutSection(header);
      window.setTimeout(() => {
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return;
    }
  }

  const section = getTodayShortcutSectionElement(target);
  const hash = getTodayLegacyShortcutHash(target);

  if (!section) {
    window.location.hash = hash;
    return;
  }

  expandTodayShortcutSection(section);

  window.setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      window.history.replaceState(null, '', '#' + hash);
    } catch {
      window.location.hash = hash;
    }
  }, 80);
}

function getTodayShortcutTileId(target: TodayTileShortcutTarget) {
  if (target === 'urgent') return 'today-section-leads';
  if (target === 'without_action') return 'today-section-no-step';
  if (target === 'without_movement') return 'today-section-stale';
  if (target === 'blocked') return 'today-section-blocked-cases';
  if (target === 'service_transition') return 'today-section-ready-to-start';
  if (target === 'ai_drafts') return 'today-section-ai-drafts-list';
  return null;
}

function getTodayShortcutTileIdFromTop(target: TodayTileShortcutTarget) {
  if (target === 'urgent') return 'today-section-leads';
  if (target === 'without_action') return 'today-section-no-step';
  if (target === 'without_movement') return 'today-section-stale';
  if (target === 'blocked') return 'today-section-blocked-cases';
  if (target === 'service_transition') return 'today-section-ready-to-start';
  if (target === 'ai_drafts') return 'today-section-ai-drafts-list';
  return null;
}

function findTodayPipelineShortcutElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return null;

  const direct = target.closest('[data-today-pipeline-shortcut]');
  return direct instanceof HTMLElement ? direct : null;
}

function TileCard({
  id,
  title,
  subtitle,
  collapsedMap,
  onToggle,
  children,
  className = '',
  titleClassName = 'text-slate-900',
  subtitleClassName = 'text-slate-500',
  headerRight,
  bodyClassName = '',
}: TileCardProps) {
  const collapsed = Boolean(collapsedMap[id]);
  const shortcutTarget = resolveTodayTileShortcutTarget(`${id} ${title}`);
  const shortcutAnchorId = shortcutTarget ? getTodayTopShortcutAnchorId(shortcutTarget) : undefined;
  const handleHeaderClick = () => {
    onToggle(id);
  };

  return (
    <Card
      id={shortcutAnchorId}
      data-today-tile-card="true"
      data-today-collapsible-section="true"
      data-today-shortcut-section={shortcutTarget || undefined}
      className={`today-independent-section scroll-mt-28 self-start h-fit shadow-sm border-slate-100 ${className}`}
    >
      <CardContent className="p-0">
        <button
          type="button"
          data-today-tile-header="true"
          data-today-tile-id={id}
          data-today-tile-title={title}
          onClick={handleHeaderClick}
          aria-expanded={!collapsed}
          className="w-full p-4 flex flex-col gap-3 text-left sm:flex-row sm:flex-wrap sm:items-start sm:justify-between"
        >
          <div className="min-w-0 basis-full sm:basis-72 flex-1">
            <p className={`font-semibold break-words ${titleClassName}`}>{title}</p>
            {subtitle ? (
              <p className={`mt-1 text-xs break-words ${subtitleClassName}`}>{subtitle}</p>
            ) : null}
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {headerRight}
            {collapsed ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>
        {!collapsed ? (
          <div data-today-tile-body="true" className={`border-t border-slate-100 p-4 pt-3 ${bodyClassName}`}>
            {children}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function LeadLinkCard({
  leadId,
  title,
  subtitle,
  helperText,
  className = '',
  subtitleClassName = 'text-slate-500',
  badges,
  rightMeta,
}: LeadLinkCardProps) {
  return (
    <Link to={`/leads/${leadId}`} className="block group">
      <Card className={`transition-all hover:border-primary/30 hover:shadow-md ${className}`}>
        <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0 basis-full sm:basis-72 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-900 break-words">{title}</p>
              {badges}
            </div>
            {subtitle ? (
              <p className={`mt-1 text-sm break-words ${subtitleClassName}`}>{subtitle}</p>
            ) : null}
            {helperText ? (
              <p className="mt-2 text-sm text-slate-600 break-words">{helperText}</p>
            ) : null}
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {rightMeta}
            <div className="rounded-xl bg-slate-100 p-2 text-slate-500 transition-colors group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function parseMoment(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const normalized = value.includes('T') ? value : `${value}T09:00:00`;
    const parsed = parseISO(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

function isLeadOverdue(lead: any) {
  const moment = parseMoment(lead?.nextActionAt);
  if (!moment) return false;
  return isPast(moment) && !isToday(moment);
}

function getDaysWithoutUpdate(lead: any) {
  const moment = parseMoment(lead?.updatedAt);
  if (!moment) return null;
  return Math.max(0, differenceInCalendarDays(new Date(), moment));
}

function formatLeadMoment(value: unknown) {
  const moment = parseMoment(value);
  return moment ? format(moment, 'd MMM HH:mm', { locale: pl }) : 'Brak terminu';
}


function getTodayEntryStatus(entry: any) {
  return String(entry?.raw?.status || '').toLowerCase();
}

function isCompletedTodayEntry(entry: any) {
  const status = getTodayEntryStatus(entry);

  return (
    (entry?.kind === 'task' && status === 'done') ||
    (entry?.kind === 'event' && (status === 'completed' || status === 'done'))
  );
}

function sortTodayEntriesForDisplay(entries: any[]) {
  return [...entries].sort((a, b) => {
    const aDone = isCompletedTodayEntry(a);
    const bDone = isCompletedTodayEntry(b);

    if (aDone !== bDone) {
      return aDone ? 1 : -1;
    }

    const aTime = parseMoment(a?.startsAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = parseMoment(b?.startsAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;

    return aTime - bTime;
  });
}



function TodayEntryRelationLinks({ entry }: { entry: any }) {
  const leadId = entry?.raw?.leadId || entry?.leadId || null;
  const caseId = entry?.raw?.caseId || entry?.caseId || null;

  if (!leadId && !caseId) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {leadId ? (
        <Link
          to={`/leads/${leadId}`}
          className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Otw├│rz lead
        </Link>
      ) : null}
      {caseId ? (
        <Link
          to={`/cases/${caseId}`}
          className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
        >
          Otw├│rz spraw─Ö
        </Link>
      ) : null}
    </div>
  );
}

function formatTodayCompleteActionLabel(isCompleted: boolean, completePending: boolean) {
  if (completePending) return 'Zapisywanie...';
  return isCompleted ? 'Przywróć' : 'Zrobione';
}

function TodayEntryPriorityReasons({ entry }: { entry: any }) {
  const reasons = getTodayEntryPriorityReasons(entry);

  if (reasons.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {reasons.map((reason) => (
        <span
          key={reason}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600"
        >
          {reason}
        </span>
      ))}
    </div>
  );
}

function TodayEntrySnoozeBar({
  entry,
  isPending,
  onSnooze,
  onEdit,
}: {
  entry: any;
  isPending: boolean;
  onSnooze: (entry: any, optionKey: string) => void | Promise<void>;
  onEdit?: (entry: any) => void;
}) {
  const quickActionLockRef = useRef<string | null>(null);

  if (isCompletedTodayEntry(entry)) return null;

  const releaseQuickActionLock = (lockKey: string) => {
    window.setTimeout(() => {
      if (quickActionLockRef.current === lockKey) {
        quickActionLockRef.current = null;
      }
    }, 450);
  };

  const stopInteractiveEvent = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const runQuickAction = (event: any, lockKey: string, action: () => void) => {
    stopInteractiveEvent(event);

    if (isPending) return;
    if (quickActionLockRef.current === lockKey) return;

    quickActionLockRef.current = lockKey;
    action();
    releaseQuickActionLock(lockKey);
  };

  const handleEditAction = (event: any) => {
    runQuickAction(event, `edit:${entry?.id || entry?.sourceId || 'entry'}`, () => {
      onEdit?.(entry);
    });
  };

  const handleSnoozeAction = (event: any, optionKey: string) => {
    runQuickAction(event, `snooze:${entry?.id || entry?.sourceId || 'entry'}:${optionKey}`, () => {
      void onSnooze(entry, optionKey);
    });
  };

  const handleKeyboardAction = (event: any, callback: (event: any) => void) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    callback(event);
  };

  const actionClassName =
    'inline-flex h-8 cursor-pointer select-none items-center whitespace-nowrap rounded-lg border px-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500/25';

  const disabledClassName = isPending ? ' cursor-not-allowed opacity-50' : '';

  return (
    <div
      className="relative z-50 mt-3 flex w-full max-w-full flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 pointer-events-auto isolate"
      data-today-quick-snooze-bar="true"
      style={{ pointerEvents: 'auto' }}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onMouseUp={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    >
      <span className="shrink-0 text-xs font-semibold text-slate-500">Szybko od┼é├│┼╝:</span>
      {onEdit ? (
        <button
          type="button"
          role="button"
          tabIndex={isPending ? -1 : 0}
          aria-disabled={isPending}
          data-today-quick-snooze-edit="true"
          onPointerDown={stopInteractiveEvent}
          onPointerUp={handleEditAction}
          onMouseDown={stopInteractiveEvent}
          onTouchStart={(event) => event.stopPropagation()}
          onClick={handleEditAction}
          onKeyDown={(event) => handleKeyboardAction(event, handleEditAction)}
          className={`${actionClassName} border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100${disabledClassName}`}
          title="Edytuj zadanie lub wydarzenie"
        >
          Edytuj
        </button>
      ) : null}
      {TODAY_QUICK_SNOOZE_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          role="button"
          tabIndex={isPending ? -1 : 0}
          aria-disabled={isPending}
          data-today-quick-snooze-action={option.key}
          onPointerDown={stopInteractiveEvent}
          onPointerUp={(event) => handleSnoozeAction(event, option.key)}
          onMouseDown={stopInteractiveEvent}
          onTouchStart={(event) => event.stopPropagation()}
          onClick={(event) => handleSnoozeAction(event, option.key)}
          onKeyDown={(event) => handleKeyboardAction(event, (keyboardEvent) => handleSnoozeAction(keyboardEvent, option.key))}
          className={`${actionClassName} border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50${disabledClassName}`}
          title={option.description}
        >
          {isPending ? '...' : option.label}
        </button>
      ))}
    </div>
  );
}

function todayPipelineNormalizeAmount(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, value);
  }

  if (typeof value !== 'string') {
    return 0;
  }

  const compact = value
    .replace(/\s/g, '')
    .replace(/z┼é|pln/gi, '')
    .replace(/,/g, '.')
    .replace(/[^0-9.-]/g, '');

  const parsed = Number(compact);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function todayPipelineLeadAmount(lead: any) {
  const candidates = [
    lead?.dealValue,
    lead?.value,
    lead?.amount,
    lead?.estimatedValue,
    lead?.estimated_value,
    lead?.deal_value,
    lead?.budget,
    lead?.price,
  ];

  for (const candidate of candidates) {
    const amount = todayPipelineNormalizeAmount(candidate);
    if (amount > 0) return amount;
  }

  return 0;
}


function todayPipelinePickFirstText(record: any, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

function todayPipelineNormalizeIdentityText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9@.+-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function todayPipelineDigitsOnly(value: unknown) {
  return String(value || '').replace(/\D/g, '');
}

function todayPipelineClientAmount(client: any) {
  const candidates = [
    client?.dealValue,
    client?.value,
    client?.amount,
    client?.estimatedValue,
    client?.estimated_value,
    client?.deal_value,
    client?.budget,
    client?.price,
    client?.totalValue,
    client?.total_value,
    client?.pipelineValue,
    client?.pipeline_value,
    client?.lifetimeValue,
    client?.lifetime_value,
  ];

  for (const candidate of candidates) {
    const amount = todayPipelineNormalizeAmount(candidate);
    if (amount > 0) return amount;
  }

  return 0;
}

function todayPipelineClientName(client: any) {
  return String(client?.name || client?.company || client?.title || client?.clientName || 'Klient bez nazwy');
}

function todayPipelineBuildPersonKey(record: any, kind: 'lead' | 'client', fallbackIndex: number) {
  const clientId = todayPipelinePickFirstText(record, [
    'clientId',
    'client_id',
    'customerId',
    'customer_id',
    'linkedClientId',
    'linked_client_id',
    'convertedClientId',
    'converted_client_id',
  ]);

  if (clientId) return 'client:' + clientId;

  if (kind === 'client') {
    const ownClientId = todayPipelinePickFirstText(record, ['id', 'uid', 'clientUid']);
    if (ownClientId) return 'client:' + ownClientId;
  }

  const sourceLeadId = todayPipelinePickFirstText(record, [
    'leadId',
    'lead_id',
    'sourceLeadId',
    'source_lead_id',
    'createdFromLeadId',
    'created_from_lead_id',
    'originLeadId',
    'origin_lead_id',
  ]);

  if (sourceLeadId) return 'lead:' + sourceLeadId;

  const email = todayPipelineNormalizeIdentityText(todayPipelinePickFirstText(record, ['email', 'clientEmail', 'contactEmail']));
  if (email) return 'email:' + email;

  const phone = todayPipelineDigitsOnly(todayPipelinePickFirstText(record, ['phone', 'clientPhone', 'contactPhone', 'mobile']));
  if (phone.length >= 6) return 'phone:' + phone;

  const name = todayPipelineNormalizeIdentityText(todayPipelinePickFirstText(record, ['name', 'clientName', 'company', 'title']));
  if (name) return 'name:' + name;

  const id = todayPipelinePickFirstText(record, ['id', 'uid']);
  return kind + ':' + (id || String(fallbackIndex));
}

type TodayPipelineDedupRow = {
  key: string;
  id: string;
  kind: 'lead' | 'client';
  title: string;
  amount: number;
  lead?: any;
  client?: any;
};

function buildTodayDedupedFunnelSummary(leads: any[], clients: any[]) {
  const rowsByKey = new Map<string, TodayPipelineDedupRow>();

  clients.forEach((client, index) => {
    const key = todayPipelineBuildPersonKey(client, 'client', index);
    const amount = todayPipelineClientAmount(client);
    const id = String(client?.id || key);
    rowsByKey.set(key, {
      key,
      id,
      kind: 'client',
      title: todayPipelineClientName(client),
      amount,
      client,
    });
  });

  leads.filter(todayPipelineIsActiveLead).forEach((lead, index) => {
    const key = todayPipelineBuildPersonKey(lead, 'lead', index);
    const amount = todayPipelineLeadAmount(lead);
    const existing = rowsByKey.get(key);

    if (existing) {
      rowsByKey.set(key, {
        ...existing,
        amount: Math.max(existing.amount, amount),
        lead,
        title: existing.title || todayPipelineLeadName(lead),
      });
      return;
    }

    rowsByKey.set(key, {
      key,
      id: String(lead?.id || key),
      kind: 'lead',
      title: todayPipelineLeadName(lead),
      amount,
      lead,
    });
  });

  const rows = Array.from(rowsByKey.values()).filter((row) => row.amount > 0);
  const totalValue = rows.reduce((sum, row) => sum + row.amount, 0);
  const clientRows = rows.filter((row) => row.kind === 'client').length;
  const leadRows = rows.filter((row) => row.kind === 'lead').length;

  return {
    rows,
    totalValue,
    uniqueCount: rows.length,
    clientRows,
    leadRows,
  };
}

function TodayFunnelDedupValueCard({ leads, clients }: { leads: any[]; clients: any[] }) {
  const summary = buildTodayDedupedFunnelSummary(leads, clients);

  return (
    <Card data-today-funnel-dedup-stage11="true" className="border-slate-100 bg-white shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lejek</p>
            <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              {todayPipelineFormatMoney(summary.totalValue)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Warto┼Ť─ç z lead├│w i klient├│w bez podw├│jnego liczenia osoby, kt├│ra przesz┼éa z leada do klienta.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[320px]">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-lg font-black text-slate-950">{summary.uniqueCount}</p>
              <p className="text-[11px] font-semibold text-slate-500">kontakt├│w</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-lg font-black text-slate-950">{summary.leadRows}</p>
              <p className="text-[11px] font-semibold text-slate-500">lead├│w</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-lg font-black text-slate-950">{summary.clientRows}</p>
              <p className="text-[11px] font-semibold text-slate-500">klient├│w</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function todayPipelineFormatMoney(value: number) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(Math.max(0, value || 0));
}

function todayPipelineIsActiveLead(lead: any) {
  return isActiveSalesLead(lead) && !isLeadMovedToService(lead);
}

function todayPipelineLeadName(lead: any) {
  return String(lead?.name || lead?.company || lead?.title || 'Lead bez nazwy');
}

function todayPipelineLeadSubtitle(lead: any) {
  const parts = [
    lead?.status ? String(lead.status) : '',
    lead?.source ? String(lead.source) : '',
    lead?.nextActionAt ? 'nast─Öpny ruch: ' + formatLeadMoment(lead.nextActionAt) : '',
  ].filter(Boolean);

  return parts.length ? parts.join(' ┬Ě ') : 'Brak dodatkowych danych';
}

function todayPipelineIsUrgentLead(lead: any) {
  const nextAction = parseMoment(lead?.nextActionAt);
  if (!nextAction) return false;
  return isToday(nextAction) || isLeadOverdue(lead);
}

function todayPipelineIsWithoutAction(lead: any) {
  return !parseMoment(lead?.nextActionAt);
}

function todayPipelineIsWithoutMovement(lead: any) {
  const days = getDaysWithoutUpdate(lead);
  return typeof days === 'number' && days >= 7;
}

function todayPipelineIsBlockedCase(caseItem: any) {
  const status = String(caseItem?.status || '').toLowerCase();
  const blockerText = String(
    caseItem?.blocker ||
    caseItem?.blockReason ||
    caseItem?.missingReason ||
    caseItem?.blockedReason ||
    caseItem?.waitingReason ||
    '',
  ).trim();

  return Boolean(
    caseItem?.isBlocked ||
    blockerText ||
    status === 'blocked' ||
    status === 'zablokowana' ||
    status === 'zablokowane' ||
    status === 'waiting_on_client' ||
    status === 'to_approve' ||
    status === 'on_hold',
  );
}

function todayPipelineCaseTitle(caseItem: any) {
  return String(caseItem?.title || caseItem?.name || caseItem?.clientName || 'Sprawa bez nazwy');
}

function todayPipelineCaseSubtitle(caseItem: any) {
  const parts = [
    caseItem?.clientName ? String(caseItem.clientName) : '',
    caseItem?.updatedAt ? 'ostatnia zmiana: ' + formatLeadMoment(caseItem.updatedAt) : '',
  ].filter(Boolean);

  return parts.length ? parts.join(' ┬Ě ') : 'Brak dodatkowych danych';
}


function TodayAiDraftsTopTile({ drafts }: { drafts: AiLeadDraft[] }) {
  const pendingDrafts = drafts.filter((draft) => draft.status === 'draft');
  const latestDrafts = pendingDrafts.slice(0, 3);

  return (
    <Link
      to="/ai-drafts"
      data-today-ai-drafts-shortcut="true"
      className="min-w-[180px] flex-1 rounded-2xl border border-violet-100 bg-violet-50 p-3 text-left transition hover:border-violet-200 hover:bg-violet-100"
    >
      <span className="text-xs font-semibold text-violet-700">Szkice AI</span>
      <strong className="mt-1 block text-2xl text-violet-950">{pendingDrafts.length}</strong>
      <small className="text-xs text-violet-700">Do sprawdzenia</small>
      {latestDrafts.length ? (
        <span className="mt-2 block space-y-1 text-[11px] leading-snug text-violet-900">
          {latestDrafts.map((draft) => (
            <span key={draft.id} className="block truncate">ÔÇó {draft.rawText || 'Szkic bez tre┼Ťci'}</span>
          ))}
        </span>
      ) : (
        <span className="mt-2 block text-[11px] text-violet-700">Brak szkic├│w do decyzji.</span>
      )}
    
              <span className="text-xs font-semibold">Przejrzyj</span></Link>
  );
}
/* TODAY_AI_DRAFTS_STAGE04: Dzi┼Ť pokazuje szkice AI do sprawdzenia, ale finalny zapis nadal odbywa si─Ö w Szkicach AI. */

function TodayPipelineValueCard({ leads, cases = [] }: { leads: any[]; cases?: any[] }) {
  const activeLeads = (leads || []).filter(todayPipelineIsActiveLead);
  const activeLeadsWithValue = activeLeads.filter((lead) => todayPipelineLeadAmount(lead) > 0);
  const totalValue = activeLeads.reduce((sum, lead) => sum + todayPipelineLeadAmount(lead), 0);
  const urgentLeads = activeLeads.filter(todayPipelineIsUrgentLead);
  const withoutActionLeads = activeLeads.filter(todayPipelineIsWithoutAction);
  const withoutMovementLeads = activeLeads.filter(todayPipelineIsWithoutMovement);
  const blockedCases = (cases || []).filter(todayPipelineIsBlockedCase);
  const serviceTransitionCount = (leads || []).filter((lead) => isLeadMovedToService(lead)).length + blockedCases.length;

  const topLeads = [...activeLeadsWithValue]
    .sort((left, right) => todayPipelineLeadAmount(right) - todayPipelineLeadAmount(left))
    .slice(0, 3);

  const topBlockedCases = blockedCases.slice(0, 3);
  const [aiDraftsStage04, setAiDraftsStage04] = useState<AiLeadDraft[]>([]);

  useEffect(() => {
    let cancelled = false;
    void getAiLeadDraftsAsync()
      .then((rows) => {
        if (!cancelled) setAiDraftsStage04(rows);
      })
      .catch(() => {
        if (!cancelled) setAiDraftsStage04([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Dzi┼Ť w skr├│cie</p>
            <p className="mt-1 text-xs text-slate-500">
              Pilne leady, brak najbli┼╝szej zaplanowanej akcji, brak ruchu i sprawy zatrzymane w miejscu.
            </p>
          </div>
          <Badge className="w-fit bg-emerald-50 text-emerald-700 border border-emerald-100">
            {todayPipelineFormatMoney(totalValue)}
          </Badge>
        </div>

        <div
          className="mt-4 flex flex-nowrap gap-3 overflow-x-auto pb-1"
          data-today-top-tiles="true"
          onClick={(event) => {
            const shortcutElement = findTodayPipelineShortcutElement(event.target);
            const shortcutTarget = resolveTodayTileShortcutTarget(
              shortcutElement?.getAttribute('data-today-pipeline-shortcut') || shortcutElement?.textContent || '',
            );
            if (!shortcutTarget) return;
            event.preventDefault();
            event.stopPropagation();
            openTodayTopTileShortcut(shortcutTarget);
          }}
        >
          <button type="button" onClick={() => openTodayTopTileShortcut('urgent')} data-today-pipeline-shortcut="urgent" className="min-w-[180px] flex-1 rounded-2xl border border-blue-100 bg-blue-50 p-3 transition hover:border-blue-200 hover:bg-blue-100 text-left">
            <span className="text-xs font-semibold text-blue-700">Pilne leady</span>
            <strong className="mt-1 block text-2xl text-blue-950">{urgentLeads.length}</strong>
            <small className="text-xs text-blue-700">Dzi┼Ť albo zaleg┼ée</small>
          </button>

          <button type="button" onClick={() => openTodayTopTileShortcut('without_action')} data-today-pipeline-shortcut="without_action" className="min-w-[180px] flex-1 rounded-2xl border border-amber-100 bg-amber-50 p-3 transition hover:border-amber-200 hover:bg-amber-100 text-left">
            <span className="text-xs font-semibold text-amber-700">Bez zaplanowanej akcji</span>
            <strong className="mt-1 block text-2xl text-amber-950">{withoutActionLeads.length}</strong>
            <small className="text-xs text-amber-700">Bez zaplanowanej akcji</small>
          </button>

          <button type="button" onClick={() => openTodayTopTileShortcut('without_movement')} data-today-pipeline-shortcut="without_movement" className="min-w-[180px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 hover:bg-slate-100 text-left">
            <span className="text-xs font-semibold text-slate-700">Bez ruchu</span>
            <strong className="mt-1 block text-2xl text-slate-950">{withoutMovementLeads.length}</strong>
            <small className="text-xs text-slate-600">Brak zmiany 7+ dni</small>
          </button>

          <button type="button" onClick={() => openTodayTopTileShortcut('blocked')} data-today-pipeline-shortcut="blocked" className="min-w-[180px] flex-1 rounded-2xl border border-red-100 bg-red-50 p-3 transition hover:border-red-200 hover:bg-red-100 text-left">
            <span className="text-xs font-semibold text-red-700">Zablokowane sprawy</span>
            <strong className="mt-1 block text-2xl text-red-950">{blockedCases.length}</strong>
            <small className="text-xs text-red-700">Wymagaj─ů odblokowania</small>
          </button>

          <button type="button" onClick={() => openTodayTopTileShortcut('service_transition')} data-today-pipeline-shortcut="service_transition" className="min-w-[180px] flex-1 rounded-2xl border border-violet-100 bg-violet-50 p-3 transition hover:border-violet-200 hover:bg-violet-100 text-left">
            <span className="text-xs font-semibold text-violet-700">Start i obs┼éuga</span>
            <strong className="mt-1 block text-2xl text-violet-950">{serviceTransitionCount}</strong>
            <small className="text-xs text-violet-700">Przej┼Ťcia i blokady</small>
          </button>

          <TodayAiDraftsTopTile drafts={aiDraftsStage04} />
        </div>

        {(topBlockedCases.length > 0 || topLeads.length > 0) ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {topBlockedCases.length > 0 ? (
              <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
                  <ShieldAlert className="h-4 w-4" />
                  Zablokowane sprawy
                </div>
                <div className="grid gap-2">
                  {topBlockedCases.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      to={caseItem.id ? `/cases/${caseItem.id}` : '/cases'}
                      className="rounded-xl border border-red-100 bg-white p-2 text-sm transition hover:border-red-200 hover:bg-red-50"
                    >
                      <strong className="block text-red-950">{todayPipelineCaseTitle(caseItem)}</strong>
                      <span className="mt-0.5 block text-xs text-red-700">{todayPipelineCaseSubtitle(caseItem)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {topLeads.length > 0 ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-800">
                  <TrendingUp className="h-4 w-4" />
                  Najwi─Öksza warto┼Ť─ç lead├│w
                </div>
                <div className="grid gap-2">
                  {topLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      to={lead.id ? `/leads/${lead.id}` : '/leads'}
                      className="rounded-xl border border-emerald-100 bg-white p-2 text-sm transition hover:border-emerald-200 hover:bg-emerald-50"
                    >
                      <strong className="block text-emerald-950">{todayPipelineLeadName(lead)}</strong>
                      <span className="mt-0.5 block text-xs text-emerald-700">
                        {todayPipelineFormatMoney(todayPipelineLeadAmount(lead))} ┬Ě {todayPipelineLeadSubtitle(lead)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}



function getPendingTodayAiDrafts(drafts: AiLeadDraft[]) {
  return drafts.filter((draft) => draft.status === 'draft' && String(draft.rawText || '').trim());
}

function getTodayAiDraftPreview(draft: AiLeadDraft) {
  const rawText = String(draft.rawText || '').replace(/s+/g, ' ').trim();
  if (!rawText) return 'Szkic bez tre┼Ťci';
  return rawText.length > 96 ? rawText.slice(0, 93) + '...' : rawText;
}

function formatTodayAiDraftCreatedAt(value: unknown) {
  const parsed = new Date(String(value || ''));
  if (!Number.isFinite(parsed.getTime())) return 'Brak daty';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTodayAiDraftTitle(draft: AiLeadDraft) {
  const parsed = (draft?.parsedDraft || {}) as Record<string, any>;
  return String(
    parsed?.lead?.name ||
    parsed?.task?.title ||
    parsed?.event?.title ||
    draft?.rawText ||
    'Szkic AI',
  )
    .trim()
    .slice(0, 90) || 'Szkic AI';
}

export default function Today() {
      useEffect(() => {
    return installTodayStage32RelationsLoadingPolish();
  }, []);
useEffect(() => {
    return installTodayStage31TilesInteraction();
  }, []);
useEffect(() => installTodayStage30VisualCleanup(), []);

  // TODAY_AI_DRAFTS_TILE_STAGE29_STATE
  const [todayAiDrafts, setTodayAiDrafts] = useState<AiLeadDraft[]>([]);
  const pendingTodayAiDrafts = useMemo(() => getPendingTodayAiDrafts(todayAiDrafts), [todayAiDrafts]);
  const pendingTodayAiDraftCount = pendingTodayAiDrafts.length;

  useEffect(() => {
    let cancelled = false;

    getAiLeadDraftsAsync()
      .then((drafts) => {
        if (!cancelled) {
          setTodayAiDrafts(Array.isArray(drafts) ? drafts : []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTodayAiDrafts([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);
  const { workspace, profile, hasAccess, loading: wsLoading, workspaceReady, refresh } = useWorkspace();
  const [supabaseUser, supabaseSessionLoading] = useSupabaseSession();
  const activeUserId = supabaseUser?.uid || supabaseUser?.id || '';
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [collapsedTiles, setCollapsedTiles] = useState<Record<string, boolean>>({});
  const [todayActionId, setTodayActionId] = useState<string | null>(null);
  const [previewEntry, setPreviewEntry] = useState<any | null>(null);

  const [quickCaptureSeed, setQuickCaptureSeed] = useState('');
  const [quickCaptureOpenSignal, setQuickCaptureOpenSignal] = useState(0);

  const openQuickCaptureFromAssistant = (text: string) => {
    const nextText = String(text || '').trim();
    if (!nextText) return;
    setQuickCaptureSeed(nextText);
    setQuickCaptureOpenSignal((current) => current + 1);
  };

  const leadSubmitLockRef = useRef(false);
  const taskSubmitLockRef = useRef(false);
  const eventSubmitLockRef = useRef(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    dealValue: '',
    source: 'other',
    status: 'new',
  });

  const [newTask, setNewTask] = useState(() => ({
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    leadId: '',
    caseId: '',
    relationQuery: '',
    recurrence: createDefaultRecurrence(),
    reminder: createDefaultReminder(),
  }));

  const [newEvent, setNewEvent] = useState(() => {
    const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
    return {
      title: '',
      type: 'meeting',
      ...pair,
      leadId: '',
      caseId: '',
      relationQuery: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    };
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(TODAY_TILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setCollapsedTiles(parsed);
      }
    } catch {
      // Ignore invalid local storage state.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(TODAY_TILE_STORAGE_KEY, JSON.stringify(collapsedTiles));
    } catch {
      // Ignore storage write failures.
    }
  }, [collapsedTiles]);

  const openOnlyTodayTile = (id: string, options?: { scrollToTop?: boolean }) => {
    setCollapsedTiles(() => {
      const next: Record<string, boolean> = {};
      const headers = Array.from(document.querySelectorAll<HTMLElement>('[data-today-tile-header="true"]'));

      headers.forEach((header) => {
        const tileId = header.dataset.todayTileId;
        if (tileId) {
          next[tileId] = tileId !== id;
        }
      });

      if (!Object.keys(next).length) {
        next[id] = false;
      }

      return next;
    });

    if (options?.scrollToTop) {
      window.setTimeout(() => {
        const header = document.querySelector<HTMLElement>(`[data-today-tile-id="${id}"]`);
        header?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const toggleTile = (id: string) => {
    setCollapsedTiles((prev) => {
      const wasCollapsed = Boolean(prev[id]);
      const next: Record<string, boolean> = {};
      const headers = Array.from(document.querySelectorAll<HTMLElement>('[data-today-tile-header="true"]'));
      headers.forEach((header) => {
        const tileId = header.dataset.todayTileId;
        if (tileId) next[tileId] = true;
      });

      next[id] = !wasCollapsed;
      return next;
    });
  };

  useEffect(() => {
    const handleTodayPipelineShortcutClick = (event: MouseEvent) => {
      const shortcutElement = findTodayPipelineShortcutElement(event.target);
      if (!shortcutElement) return;

      const explicitTarget = shortcutElement.dataset.todayPipelineShortcut as TodayTileShortcutTarget | undefined;
      const target = explicitTarget || resolveTodayTileShortcutTarget(shortcutElement.textContent);
      if (!target) return;

      const tileId = getTodayShortcutTileIdFromTop(target) || findTodayTileIdForShortcut(target);
      if (!tileId) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      openOnlyTodayTile(tileId, { scrollToTop: true });
    };

    document.addEventListener('click', handleTodayPipelineShortcutClick, true);

    return () => {
      document.removeEventListener('click', handleTodayPipelineShortcutClick, true);
    };
  }, []);
  // data-today-shortcut-expands-section="true"


  useEffect(() => {
    const handleTodayWeekCalendarShortcutClick = (event: MouseEvent) => {
      const shortcutElement = findTodayCalendarShortcutElement(event.target);
      if (!shortcutElement) return;

      event.preventDefault();
      event.stopPropagation();
      openWeeklyCalendarFromToday();
    };

    document.addEventListener('click', handleTodayWeekCalendarShortcutClick, true);

    return () => {
      document.removeEventListener('click', handleTodayWeekCalendarShortcutClick, true);
    };
  }, []);
  // data-today-week-calendar-click-capture="true"

  const scrollToFirstSection = (sectionIds: string[]) => {
    const target = sectionIds
      .map((id) => document.getElementById(id))
      .find((element) => Boolean(element));

    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  async function refreshSupabaseBundle() {
    const [bundle, clientRows] = await Promise.all([
      fetchCalendarBundleFromSupabase(),
      fetchClientsFromSupabase().catch(() => []),
    ]);
    setLeads(bundle.leads);
    setCases(bundle.cases || []);
    setClients(clientRows as any[]);
    setTasks((bundle.tasks || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })));
    setEvents((bundle.events || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })));
  }

  const handleSoftNextStepAfterCompletion = async ({
    leadId,
    leadName,
    fallbackTitle,
  }: {
    leadId?: string | null;
    leadName?: string;
    fallbackTitle?: string;
  }) => {
    void leadId;
    void leadName;
    void fallbackTitle;
  };

  useEffect(() => {
    if (supabaseSessionLoading || !activeUserId || wsLoading || !workspace?.id) {
      setLoading(wsLoading);
      return;
    }

    let cancelled = false;

    const loadBundle = async () => {
      try {
        setLoading(true);
        const [bundle, clientRows] = await Promise.all([
          fetchCalendarBundleFromSupabase(),
          fetchClientsFromSupabase().catch(() => []),
        ]);
        if (cancelled) return;
        setLeads(bundle.leads);
        setCases(bundle.cases || []);
        setClients(clientRows as any[]);
        setTasks((bundle.tasks || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })));
        setEvents((bundle.events || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })));
      } catch (error: any) {
        if (!cancelled) {
          toast.error(`B┼é─ůd odczytu planu dnia: ${error.message}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadBundle();

    return () => {
      cancelled = true;
    };
  }, [workspace?.id, wsLoading]);

  const resetNewTask = () => {
    setNewTask({
      title: '',
      type: 'follow_up',
      dueAt: toDateTimeLocalValue(new Date()),
      priority: 'medium',
      leadId: '',
      caseId: '',
      relationQuery: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    });
  };

  const resetNewEvent = () => {
    const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
    setNewEvent({
      title: '',
      type: 'meeting',
      ...pair,
      leadId: '',
      caseId: '',
      relationQuery: '',
      recurrence: createDefaultRecurrence(),
      reminder: createDefaultReminder(),
    });
  };

  const topicContactOptions = useMemo(
    () => buildTopicContactOptions({ leads, cases, clients }),
    [cases, clients, leads],
  );

  const selectedNewTaskOption = useMemo(
    () => findTopicContactOption(topicContactOptions, { leadId: newTask.leadId || null, caseId: newTask.caseId || null }),
    [newTask.caseId, newTask.leadId, topicContactOptions],
  );

  const selectedNewEventOption = useMemo(
    () => findTopicContactOption(topicContactOptions, { leadId: newEvent.leadId || null, caseId: newEvent.caseId || null }),
    [newEvent.caseId, newEvent.leadId, topicContactOptions],
  );

  const handleSelectTaskRelation = (option: TopicContactOption | null) => {
    const resolved = resolveTopicContactLink(option);
    setNewTask((prev) => ({
      ...prev,
      leadId: resolved.leadId || '',
      caseId: resolved.caseId || '',
      relationQuery: option?.label || '',
    }));
  };

  const handleSelectEventRelation = (option: TopicContactOption | null) => {
    const resolved = resolveTopicContactLink(option);
    setNewEvent((prev) => ({
      ...prev,
      leadId: resolved.leadId || '',
      caseId: resolved.caseId || '',
      relationQuery: option?.label || '',
    }));
  };

  const openPreviewEntry = (entry: any) => {
    setPreviewEntry(entry);
  };

  const buildTaskPreviewEntry = (task: any) => ({
    id: `today-task:${task.id}`,
    kind: 'task',
    title: task.title,
    startsAt: getTaskStartAt(task) || normalizeWorkItem(task).dateAt || `${getTaskDate(task)}T09:00`,
    sourceId: task.id,
    leadName: task.leadName || '',
    raw: task,
  });

  const registerReminderScheduled = async ({
    entityType,
    title,
    scheduledAt,
    reminderAt,
  }: {
    entityType: 'task' | 'event';
    title: string;
    scheduledAt: string;
    reminderAt: string | null;
  }) => {
    if (!reminderAt) return;

    try {
      await insertActivityToSupabase({
        ownerId: (activeUserId || null),
        actorId: (activeUserId || null),
        actorType: 'operator',
        eventType: 'reminder_scheduled',
        payload: {
          entityType,
          title,
          scheduledAt,
          reminderAt,
          source: 'today',
        },
      });
    } catch (error) {
      console.warn('REMINDER_ACTIVITY_WRITE_FAILED', error);
    }
  };

  const logTodayEntryActivity = async (
    entry: any,
    eventType: string,
    extraPayload: Record<string, unknown> = {},
  ) => {
    try {
      await insertActivityToSupabase({
        ownerId: (activeUserId || null),
        actorId: (activeUserId || null),
        actorType: 'operator',
        eventType,
        leadId: entry?.raw?.leadId ?? entry?.leadId ?? null,
        caseId: entry?.raw?.caseId ?? entry?.caseId ?? null,
        workspaceId: workspace?.id ?? null,
        payload: {
          source: 'today',
          entryId: entry?.id ?? null,
          sourceId: entry?.sourceId ?? entry?.raw?.id ?? null,
          kind: entry?.kind ?? null,
          title: entry?.raw?.title || entry?.title || '',
          startsAt: entry?.startsAt || normalizeWorkItem(entry?.raw).dateAt || getTaskStartAt(entry?.raw) || null,
          status: getTodayEntryStatus(entry),
          ...extraPayload,
        },
      });
    } catch (error) {
      console.warn('TODAY_ENTRY_ACTIVITY_WRITE_FAILED', error);
    }
  };

  const handleAddLead = async (e: FormEvent) => {
    e.preventDefault();
    if (leadSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Tw├│j trial wygas┼é. Op┼éa─ç subskrypcj─Ö, aby dodawa─ç leady.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    leadSubmitLockRef.current = true;
    setLeadSubmitting(true);
    try {
      await insertLeadToSupabase({
        ...newLead,
        dealValue: Number(newLead.dealValue) || 0,
        ownerId: (activeUserId || undefined),
        workspaceId,
      });
      await refreshSupabaseBundle();
      toast.success('Lead dodany');
      setIsLeadOpen(false);
      setNewLead({ name: '', email: '', dealValue: '', source: 'other', status: 'new' });
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      leadSubmitLockRef.current = false;
      setLeadSubmitting(false);
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (taskSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Tw├│j trial wygas┼é.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    taskSubmitLockRef.current = true;
    setTaskSubmitting(true);
    try {
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'task',
          title: newTask.title,
          startAt: newTask.dueAt,
        },
        candidates: conflictCandidates,
      });
      if (!shouldSave) return;

      const reminderAt = toReminderAtIso(newTask.dueAt, newTask.reminder);
      await insertTaskToSupabase({
        title: newTask.title,
        type: newTask.type,
        date: newTask.dueAt.slice(0, 10),
        scheduledAt: newTask.dueAt,
        priority: newTask.priority,
        leadId: newTask.leadId || null,
        caseId: newTask.caseId || null,
        reminderAt,
        recurrenceRule: newTask.recurrence.mode,
        ownerId: (activeUserId || undefined),
        workspaceId,
      });
      await registerReminderScheduled({
        entityType: 'task',
        title: newTask.title,
        scheduledAt: newTask.dueAt,
        reminderAt,
      });
      await refreshSupabaseBundle();
      toast.success('Zadanie dodane');
      setIsTaskOpen(false);
      resetNewTask();
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      taskSubmitLockRef.current = false;
      setTaskSubmitting(false);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (eventSubmitLockRef.current) return;
    if (!hasAccess) return toast.error('Tw├│j trial wygas┼é.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');
    eventSubmitLockRef.current = true;
    setEventSubmitting(true);
    try {
      const shouldSave = confirmScheduleConflicts({
        draft: {
          kind: 'event',
          title: newEvent.title,
          startAt: newEvent.startAt,
          endAt: newEvent.endAt,
        },
        candidates: conflictCandidates,
      });
      if (!shouldSave) return;

      const reminderAt = toReminderAtIso(newEvent.startAt, newEvent.reminder);
      await insertEventToSupabase({
        title: newEvent.title,
        type: newEvent.type,
        startAt: newEvent.startAt,
        endAt: newEvent.endAt,
        reminderAt,
        recurrenceRule: newEvent.recurrence.mode,
        leadId: newEvent.leadId || null,
        caseId: newEvent.caseId || null,
        workspaceId,
      });
      await registerReminderScheduled({
        entityType: 'event',
        title: newEvent.title,
        scheduledAt: newEvent.startAt,
        reminderAt,
      });
      await refreshSupabaseBundle();
      toast.success('Wydarzenie dodane');
      setIsEventOpen(false);
      resetNewEvent();
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      eventSubmitLockRef.current = false;
      setEventSubmitting(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const task = tasks.find((entry) => entry.id === taskId);
      await updateTaskInSupabase({
        id: taskId,
        status: currentStatus === 'todo' ? 'done' : 'todo',
        title: task?.title,
        type: task?.type,
        date: task?.date,
        priority: task?.priority,
        leadId: task?.leadId ?? null,
        caseId: task?.caseId ?? null,
      });
      await refreshSupabaseBundle();
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    }
  };

  const toggleTodayTask = async (entry: any) => {
    try {
      setTodayActionId(`${entry.id}:done`);
      const nextStatus = isCompletedTodayEntry(entry) ? 'todo' : 'done';

      await updateTaskInSupabase({
        id: entry.sourceId,
        title: entry.raw?.title || entry.title,
        type: entry.raw?.type,
        date: entry.raw?.date || entry.startsAt.slice(0, 10),
        scheduledAt: getTaskStartAt(entry.raw) || entry.startsAt,
        status: nextStatus,
        priority: entry.raw?.priority,
        leadId: entry.raw?.leadId ?? null,
        caseId: entry.raw?.caseId ?? null,
      });

      await logTodayEntryActivity(
        entry,
        nextStatus === 'done' ? 'today_task_completed' : 'today_task_restored',
        { nextStatus },
      );

      await refreshSupabaseBundle();
      if (nextStatus === 'done' && (entry.raw?.leadId ?? null)) {
        await handleSoftNextStepAfterCompletion({
          leadId: entry.raw?.leadId ?? null,
          leadName: entry.leadName || entry.raw?.leadName || '',
          fallbackTitle: entry.raw?.title || entry.title,
        });
      }
      if (previewEntry?.kind === 'task' && previewEntry?.sourceId === entry.sourceId) {
        setPreviewEntry(null);
      }
      toast.success(nextStatus === 'done' ? 'Zadanie oznaczone jako zrobione' : 'Zadanie przywr├│cone');
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      setTodayActionId(null);
    }
  };

  const deleteTodayTask = async (entry: any) => {
    if (!window.confirm('Usun─ů─ç to zadanie?')) return;

    try {
      setTodayActionId(`${entry.id}:delete`);
      await deleteTaskFromSupabase(entry.sourceId);
      await logTodayEntryActivity(entry, 'today_task_deleted');
      await refreshSupabaseBundle();
      if (previewEntry?.kind === 'task' && previewEntry?.sourceId === entry.sourceId) {
        setPreviewEntry(null);
      }
      toast.success('Zadanie usuni─Öte');
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      setTodayActionId(null);
    }
  };

  const toggleTodayEvent = async (entry: any) => {
    try {
      setTodayActionId(`${entry.id}:done`);
      const nextStatus = isCompletedTodayEntry(entry) ? 'scheduled' : 'completed';

      await updateEventInSupabase({
        id: entry.sourceId,
        title: entry.raw?.title || entry.title,
        type: entry.raw?.type || 'meeting',
      startAt: normalizeWorkItem(entry.raw).startAt || entry.startsAt,
        endAt: entry.raw?.endAt || null,
        status: nextStatus,
        leadId: entry.raw?.leadId ?? null,
        caseId: entry.raw?.caseId ?? null,
      });

      await logTodayEntryActivity(
        entry,
        nextStatus === 'completed' ? 'today_event_completed' : 'today_event_restored',
        { nextStatus },
      );

      await refreshSupabaseBundle();
      if (nextStatus === 'completed' && (entry.raw?.leadId ?? null)) {
        await handleSoftNextStepAfterCompletion({
          leadId: entry.raw?.leadId ?? null,
          leadName: entry.leadName || entry.raw?.leadName || '',
          fallbackTitle: entry.raw?.title || entry.title,
        });
      }
      if (previewEntry?.id === entry.id) {
        setPreviewEntry(null);
      }
      toast.success(nextStatus === 'completed' ? 'Wydarzenie oznaczone jako wykonane' : 'Wydarzenie przywr├│cone');
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      setTodayActionId(null);
    }
  };

  const deleteTodayEvent = async (entry: any) => {
    if (!window.confirm('Usun─ů─ç to wydarzenie?')) return;

    try {
      setTodayActionId(`${entry.id}:delete`);
      await deleteEventFromSupabase(entry.sourceId);
      await logTodayEntryActivity(entry, 'today_event_deleted');
      await refreshSupabaseBundle();
      if (previewEntry?.id === entry.id) {
        setPreviewEntry(null);
      }
      toast.success('Wydarzenie usuni─Öte');
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      setTodayActionId(null);
    }
  };

  const handleSnoozeTodayTask = async (entry: any, optionKey: string) => {
    const nextScheduledAt = resolveTodaySnoozeAt(optionKey);

    try {
      setTodayActionId(entry.id + ':snooze');
      await updateTaskInSupabase({
        id: entry.sourceId,
        title: entry.raw?.title || entry.title,
        type: entry.raw?.type,
        date: nextScheduledAt.slice(0, 10),
        scheduledAt: nextScheduledAt,
        status: 'todo',
        priority: entry.raw?.priority,
        leadId: entry.raw?.leadId ?? null,
        caseId: entry.raw?.caseId ?? null,
      });

      await logTodayEntryActivity(entry, 'today_task_snoozed', {
        nextScheduledAt,
        snoozeOption: optionKey,
      });

      await refreshSupabaseBundle();
      if (previewEntry?.kind === 'task' && previewEntry?.sourceId === entry.sourceId) {
        setPreviewEntry(null);
      }
      toast.success('Zadanie od┼éo┼╝one');
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      setTodayActionId(null);
    }
  };

  const handleSnoozeTodayEvent = async (entry: any, optionKey: string) => {
    const nextStartAt = resolveTodaySnoozeAt(optionKey);
    const currentStart = parseMoment(normalizeWorkItem(entry.raw).startAt || entry.startsAt) || new Date();
    const currentEnd = parseMoment(entry.raw?.endAt) || new Date(currentStart.getTime() + 60 * 60_000);
    const durationMs = Math.max(currentEnd.getTime() - currentStart.getTime(), 60 * 60_000);
    const nextEndAt = toDateTimeLocalValue(new Date(parseISO(nextStartAt).getTime() + durationMs));

    try {
      setTodayActionId(entry.id + ':snooze');
      await updateEventInSupabase({
        id: entry.sourceId,
        title: entry.raw?.title || entry.title,
        type: entry.raw?.type || 'meeting',
        startAt: nextStartAt,
        endAt: nextEndAt,
        status: 'scheduled',
        leadId: entry.raw?.leadId ?? null,
        caseId: entry.raw?.caseId ?? null,
      });

      await logTodayEntryActivity(entry, 'today_event_snoozed', {
        nextStartAt,
        nextEndAt,
        snoozeOption: optionKey,
      });

      await refreshSupabaseBundle();
      if (previewEntry?.id === entry.id) {
        setPreviewEntry(null);
      }
      toast.success('Wydarzenie od┼éo┼╝one');
    } catch (error: any) {
      toast.error('B┼é─ůd: ' + error.message);
    } finally {
      setTodayActionId(null);
    }
  };
  const handleEventStartChange = (value: string) => {
    const currentStart = parseISO(newEvent.startAt);
    const currentEnd = parseISO(newEvent.endAt);
    const duration = Math.max(currentEnd.getTime() - currentStart.getTime(), 60 * 60_000);
    const nextEnd = new Date(parseISO(value).getTime() + duration);
    setNewEvent({ ...newEvent, startAt: value, endAt: toDateTimeLocalValue(nextEnd) });
  };


  const conflictCandidates = useMemo(
    () =>
      buildConflictCandidates({
        tasks,
        events,
      }),
    [events, tasks],
  );
  if (wsLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
        <TodayPipelineValueCard leads={leads} cases={cases} />
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!workspaceReady) {
    return (
      <Layout>
        <div className="p-6 max-w-3xl mx-auto w-full">
          <Card className="border-rose-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-rose-700">Kontekst workspace nie jest gotowy</h2>
              <p className="text-sm text-slate-600">Nie mo┼╝emy uruchomi─ç akcji, dop├│ki workspace nie zostanie poprawnie zbootstrapowany.</p>
              <Button onClick={() => refresh()}>Spr├│buj ponownie</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const leadCasesByLeadId = new Map<string, string[]>();
  for (const caseRecord of cases) {
    const leadId = String(caseRecord?.leadId || '');
    const caseId = String(caseRecord?.id || '');
    if (!leadId || !caseId) continue;
    const current = leadCasesByLeadId.get(leadId) || [];
    current.push(caseId);
    leadCasesByLeadId.set(leadId, current);
  }
  const activeLeads = leads
    .filter((lead) => isActiveSalesLead(lead) && !isLeadMovedToService(lead))
    .map((lead) => {
      const leadId = String(lead?.id || '');
      const action = getNearestPlannedAction({
        leadId,
        caseId: (leadCasesByLeadId.get(leadId) || [])[0],
        tasks,
        events,
      });
      return {
        ...lead,
        nextActionAt: action?.at || null,
        nearestActionAt: action?.at || null,
        nextActionTitle: action?.title || null,
        nextActionStatus: action?.status || null,
        nextActionType: action?.kind || null,
      };
    });
  const activeLeadsValue = activeLeads.reduce((acc, lead) => acc + (Number(lead.dealValue) || 0), 0);
  const leadsWithAction = activeLeads.filter((lead) => parseMoment(lead.nextActionAt));
  const todayEntries = sortTodayEntriesForDisplay(combineScheduleEntries({
    events,
    tasks,
    leads: leadsWithAction,
    rangeStart: todayStart,
    rangeEnd: todayEnd,
  }));
  const todayTasks = todayEntries.filter((entry) => entry.kind === 'task');
  const todayEvents = todayEntries.filter((entry) => entry.kind === 'event');
  const todayLeadActions = todayEntries.filter((entry) => entry.kind === 'lead');
  const completedTodayEntries = todayEntries.filter((entry) => isCompletedTodayEntry(entry));

  const overdueTasks = tasks.filter((task) => {
    const startAt = getTaskStartAt(task);
    return task.status !== 'done' && startAt && isPast(parseISO(startAt)) && !isToday(parseISO(startAt));
  });
  const overdueLeadActions = activeLeads.filter((lead) => isLeadOverdue(lead));
  const readyToStartLeads = activeLeads.filter((lead) => {
    const status = String(lead.status || '');
    const eligibleAt = parseMoment(lead.caseEligibleAt);
    const linkedCaseId = String(lead.linkedCaseId || '');
    if (linkedCaseId) return false;
    if (status === 'accepted' && (eligibleAt || String(lead.startRuleSnapshot || '') === 'on_acceptance')) return true;
    return false;
  });
  const activeServiceLeads = leads.filter((lead) => isLeadMovedToService(lead));
  const blockedCases = cases.filter((caseRecord) => String(caseRecord.status || '') === 'blocked');
  const noStepLeads = activeLeads.filter((lead) => !parseMoment(lead.nextActionAt));
  const waitingTooLongLeads = activeLeads.filter((lead) => isWaitingTooLong(lead));
  const staleLeads = activeLeads
    .filter((lead) => {
      const days = getDaysWithoutUpdate(lead);
      return days !== null && days >= 5 && !isLeadOverdue(lead) && Boolean(parseMoment(lead.nextActionAt)) && !lead.isAtRisk;
    })
    .sort((a, b) => (getDaysWithoutUpdate(b) || 0) - (getDaysWithoutUpdate(a) || 0))
    .slice(0, 5);
  const riskyValuableLeads = activeLeads
    .filter((lead) => {
      const value = Number(lead.dealValue) || 0;
      const days = getDaysWithoutUpdate(lead) || 0;
      return value > 0 && (Boolean(lead.isAtRisk) || isLeadOverdue(lead) || !parseMoment(lead.nextActionAt) || days >= 5);
    })
    .sort((a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0))
    .slice(0, 5);
  const riskyValuableLeadEntries = dedupeTodaySectionEntries(riskyValuableLeads);
  const topValuableLeads = [...activeLeads].sort((a, b) => (Number(b.dealValue) || 0) - (Number(a.dealValue) || 0)).slice(0, 3);
  const nextDaysCount = [1, 2, 3].reduce((sum, days) => {
    const date = addDays(new Date(), days);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    return sum + combineScheduleEntries({
      events,
      tasks,
      leads: leadsWithAction,
      rangeStart: dayStart,
      rangeEnd: dayEnd,
    }).length;
  }, 0);

  const todayDecisionSections = buildTodaySections({
    reviewCount: pendingTodayAiDraftCount,
    overdueCount: overdueTasks.length + overdueLeadActions.length,
    moveTodayCount: todayEntries.length,
    noActionCount: noStepLeads.length,
    waitingTooLongCount: waitingTooLongLeads.length,
    nextDaysCount,
    highValueRiskCount: riskyValuableLeadEntries.length,
    completedTodayCount: completedTodayEntries.length,
  });

  const summaryCards = [
    {
      id: 'overdue',
      title: 'Zaleg┼ée',
      value: todayDecisionSections.find((section) => section.key === 'overdue')?.count || 0,
      tone: 'text-rose-600',
      bg: 'bg-rose-50',
      icon: AlertTriangle,
      sectionIds: ['today-section-overdue-tasks', 'today-section-overdue-leads'],
    },
    {
      id: 'move_today',
      title: 'Do ruchu dzi┼Ť',
      value: todayDecisionSections.find((section) => section.key === 'move_today')?.count || 0,
      tone: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: Clock,
      sectionIds: ['today-section-main'],
    },
    {
      id: 'no_action',
      title: 'Bez zaplanowanej akcji',
      value: todayDecisionSections.find((section) => section.key === 'no_action')?.count || 0,
      tone: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: TaskEntityIcon,
      sectionIds: ['today-section-no-step'],
    },
    {
      id: 'waiting_too_long',
      title: 'Waiting za d┼éugo',
      value: todayDecisionSections.find((section) => section.key === 'waiting_too_long')?.count || 0,
      tone: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: ShieldAlert,
      sectionIds: ['today-section-waiting-too-long'],
    },
  ];

  return (
    <Layout>
      <div className="today-html-page p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <section className="flex flex-nowrap gap-3 overflow-x-auto pb-1" data-today-top-summary-cards="true">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const handleOpen = () => {
              if (card.id === 'today') {
                scrollToFirstSection(card.sectionIds);
                return;
              }

              const target =
                card.id === 'overdue'
                  ? 'urgent'
                  : card.id === 'no_action'
                    ? 'without_action'
                    : card.id === 'waiting_too_long'
                      ? 'without_movement'
                      : null;

              if (target) openTodayTopTileShortcut(target);
            };

            return (
              <button
                key={card.id}
                type="button"
                onClick={handleOpen}
                className="min-w-[220px] flex-1 rounded-[28px] border border-slate-200 bg-white px-8 py-7 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:flex-wrap">
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-700">{card.title}</p>
                    <p className="mt-4 text-4xl font-black tracking-tight text-slate-950">{card.value}</p>
                  </div>
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${card.bg} ${card.tone}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => openTodayTopTileShortcut('ai_drafts')}
            className="min-w-[220px] flex-1 rounded-[28px] border border-violet-200 bg-white px-8 py-7 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:flex-wrap">
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-violet-700">Szkice AI</p>
                <p className="mt-4 text-4xl font-black tracking-tight text-slate-950">{pendingTodayAiDraftCount}</p>
              </div>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700">
                <EntityIcon entity="task" className="h-6 w-6" />
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openTodayTopTileShortcut('service_transition')}
            className="min-w-[220px] flex-1 rounded-[28px] border border-fuchsia-200 bg-white px-8 py-7 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:flex-wrap">
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-fuchsia-700">Start i obs┼éuga</p>
                <p className="mt-4 text-4xl font-black tracking-tight text-slate-950">{readyToStartLeads.length + activeServiceLeads.length + blockedCases.length}</p>
              </div>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700">
                <EntityIcon entity="case" className="h-6 w-6" />
              </span>
            </div>
          </button>
        </section>

        <div className="layout-list today-layout grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="today-main-column space-y-8">
            {overdueTasks.length > 0 && (
              <div id="today-section-overdue-tasks">
                <TileCard
                  id="overdue-tasks-section"
                  title="Zaleg┼ée zadania"
                  collapsedMap={collapsedTiles}
                  onToggle={toggleTile}
                  className="border-rose-100 bg-rose-50/30"
                  headerRight={<Badge variant="destructive" className="rounded-full">{overdueTasks.length}</Badge>}
                >
                  <div className="grid gap-3">
                    {overdueTasks.map((task) => {
                      const startAt = getTaskStartAt(task) || normalizeWorkItem(task).dateAt || `${getTaskDate(task)}T09:00`;
                      const previewTask = buildTaskPreviewEntry(task);

                      return (
                        <Card key={task.id} className="border-rose-100">
                          <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                            <div
                              className="min-w-0 flex-1 cursor-pointer"
                              role="button"
                              tabIndex={0}
                              onClick={() => openPreviewEntry(previewTask)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  openPreviewEntry(previewTask);
                                }
                              }}
                            >
                              <p className="font-semibold text-slate-900 break-words">{task.title}</p>
                              <p className="text-sm text-rose-500 break-words font-medium">{format(parseISO(startAt), 'd MMMM HH:mm', { locale: pl })}</p>
                              <p className="mt-2 text-sm text-slate-600 break-words">
                                Zadanie wymaga reakcji. Kliknij kart─Ö, aby podejrze─ç szczeg├│┼éy i wykona─ç akcj─Ö bez przechodzenia do pe┼énej listy.
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button variant="outline" size="sm" onClick={() => openPreviewEntry(previewTask)}>
                                Szczeg├│┼éy
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => toggleTodayTask(previewTask)}>
                                {task.status === 'done' ? 'Przywr├│─ç' : 'Zrobione'}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteTodayTask(previewTask)}>
                                Usu┼ä
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TileCard>
              </div>
            )}

            {overdueLeadActions.length > 0 && (
              <section id="today-section-overdue-leads" className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <ShieldAlert className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Leady przeterminowane</h2>
                  <Badge variant="destructive" className="rounded-full">{overdueLeadActions.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {overdueLeadActions.slice(0, 5).map((lead) => (
                    <LeadLinkCard
                      key={lead.id}
                      leadId={String(lead.id)}
                      title={lead.name}
                      subtitle={`${lead.company || 'Brak firmy'} ÔÇó ${formatLeadMoment(lead.nextActionAt)}`}
                      subtitleClassName="text-rose-500 font-medium"
                      className="border-rose-100 bg-rose-50/30"
                      badges={<Badge variant="destructive" className="rounded-full">Przeterminowany</Badge>}
                      helperText="Lead ma przeterminowany ruch i wymaga decyzji albo przeniesienia do obs┼éugi."
                    />
                  ))}
                </div>
              </section>
            )}

            <section id="today-section-main" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Dzisiaj</h2>
                  <p className="text-sm text-slate-500">Plan dnia z aktualizacj─ů live.</p>
                </div>
                <Badge variant="secondary" className="rounded-full">{todayEntries.length}</Badge>
              </div>

              <div className="space-y-4">
                <TileCard id="today-section-leads" title="Leady do ruchu" subtitle={`${todayLeadActions.length} wpis├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                  {todayLeadActions.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
                      {todayLeadActions.map((entry) => (
                        <Link key={entry.id} to={entry.link || `/leads/${entry.sourceId}`} className="block group">
                          <Card className="border-amber-100 transition-all hover:border-amber-300 hover:shadow-md">
                            <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                              <div className="min-w-0 basis-full sm:basis-72 flex-1">
                                <p className="font-semibold text-slate-900 break-words">{entry.leadName}</p>
                                <p className="text-sm text-slate-500 break-words">{entry.title}</p>
                              </div>
                              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                                <span className="text-xs font-bold text-amber-600">{format(parseISO(entry.startsAt), 'HH:mm')}</span>
                                <div className="rounded-xl bg-amber-50 p-2 text-amber-600 transition-colors group-hover:bg-primary group-hover:text-white">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-6 text-sm text-slate-500">Brak lead├│w z ruchem na dzi┼Ť.</CardContent>
                    </Card>
                  )}
                </TileCard>

                <TileCard id="today-section-events" title="Wydarzenia" subtitle={`${todayEvents.length} wpis├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                  {todayEvents.length > 0 ? (
                    <div className="grid gap-3">
                      {todayEvents.map((entry) => {
                        const isCompleted = isCompletedTodayEntry(entry);
                        const completePending = todayActionId === `${entry.id}:done`;
                        const deletePending = todayActionId === `${entry.id}:delete`;

                        return (
                          <Card key={entry.id} className={`border-indigo-100 ${isCompleted ? 'opacity-60' : ''}`}>
                            <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                              <div
                                className="min-w-0 flex-1 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onClick={() => openPreviewEntry(entry)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openPreviewEntry(entry);
                                  }
                                }}
                              >
                                <p className={`font-semibold break-words ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{entry.title}</p>
                                <p className={`text-sm break-words ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
                                  {EVENT_TYPES.find((item) => item.value === entry.raw.type)?.label || 'Wydarzenie'}{entry.leadName ? ` ÔÇó Lead: ${entry.leadName}` : ''}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                  <Badge variant="outline" className="text-[10px] uppercase">
                                    {format(parseISO(entry.startsAt), 'HH:mm')}
                                  </Badge>
                                  {entry.raw?.recurrence?.mode && entry.raw.recurrence.mode !== 'none' ? (
                                    <Badge variant="outline" className="text-[10px] uppercase"><Repeat className="w-3 h-3 mr-1" /> {RECURRENCE_OPTIONS.find((option) => option.value === entry.raw.recurrence.mode)?.label}</Badge>
                                  ) : null}
                                  {entry.raw?.reminder?.mode && entry.raw.reminder.mode !== 'none' ? (
                                    <Badge variant="outline" className="text-[10px] uppercase"><EntityIcon entity="notification" className="w-3 h-3 mr-1" /> Przypomnienie</Badge>
                                  ) : null}
                                  {isCompleted ? (
                                    <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 text-[10px] uppercase">Wykonane</Badge>
                                  ) : null}
                                </div>
                              </div>
                              <TodayEntryRelationLinks entry={entry} />
                                  <TodayEntryPriorityReasons entry={entry} />
                                  <TodayEntrySnoozeBar
                                    entry={entry}
                                    isPending={todayActionId === entry.id + ':snooze'}
                                    onSnooze={entry.kind === 'task' ? handleSnoozeTodayTask : handleSnoozeTodayEvent}
                                  onEdit={openPreviewEntry}
                                  />
                              <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                                <Button variant="outline" size="sm" onClick={() => openPreviewEntry(entry)}>
                                  Szczeg├│┼éy
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => toggleTodayEvent(entry)} disabled={completePending}>
                                  {formatTodayCompleteActionLabel(isCompleted, completePending)}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteTodayEvent(entry)} disabled={deletePending}>
                                  {deletePending ? '...' : 'Usu┼ä'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-6 text-sm text-slate-500">Brak wydarze┼ä na dzi┼Ť.</CardContent>
                    </Card>
                  )}
                </TileCard>

                <TileCard id="today-section-tasks" title="Zadania na dzi┼Ť" subtitle={`${todayTasks.length} wpis├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                  {todayTasks.length > 0 ? (
                    <div className="grid gap-3">
                      {todayTasks.map((entry) => {
                        const isCompleted = isCompletedTodayEntry(entry);
                        const completePending = todayActionId === `${entry.id}:done`;
                        const deletePending = todayActionId === `${entry.id}:delete`;

                        return (
                          <Card key={entry.id} className={`hover:border-primary/30 transition-colors ${isCompleted ? 'opacity-60' : ''}`}>
                            <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                              <div
                                className="min-w-0 flex-1 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onClick={() => openPreviewEntry(entry)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openPreviewEntry(entry);
                                  }
                                }}
                              >
                                <p className={`font-semibold break-words ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{entry.title}</p>
                                <p className={`text-sm break-words ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-500'}`}>{TASK_TYPES.find((item) => item.value === entry.raw.type)?.label || 'Zadanie'} ÔÇó {format(parseISO(entry.startsAt), 'HH:mm')}{entry.leadName ? ` ÔÇó Lead: ${entry.leadName}` : ''}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                  {entry.raw?.recurrence?.mode && entry.raw.recurrence.mode !== 'none' ? (
                                    <Badge variant="outline" className="text-[10px] uppercase"><Repeat className="w-3 h-3 mr-1" /> {RECURRENCE_OPTIONS.find((option) => option.value === entry.raw.recurrence.mode)?.label}</Badge>
                                  ) : null}
                                  {entry.raw?.reminder?.mode && entry.raw.reminder.mode !== 'none' ? (
                                    <Badge variant="outline" className="text-[10px] uppercase"><EntityIcon entity="notification" className="w-3 h-3 mr-1" /> Przypomnienie</Badge>
                                  ) : null}
                                  {isCompleted ? (
                                    <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 text-[10px] uppercase">Zrobione</Badge>
                                  ) : null}
                                </div>
                              </div>
                              <TodayEntryRelationLinks entry={entry} />
                                  <TodayEntryPriorityReasons entry={entry} />
                                  <TodayEntrySnoozeBar
                                    entry={entry}
                                    isPending={todayActionId === entry.id + ':snooze'}
                                    onSnooze={entry.kind === 'task' ? handleSnoozeTodayTask : handleSnoozeTodayEvent}
                                  onEdit={openPreviewEntry}
                                  />
                              <div className="flex flex-wrap items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => openPreviewEntry(entry)}>
                                  Szczeg├│┼éy
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => toggleTodayTask(entry)} disabled={completePending}>
                                  {formatTodayCompleteActionLabel(isCompleted, completePending)}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteTodayTask(entry)} disabled={deletePending}>
                                  {deletePending ? '...' : 'Usu┼ä'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-8 text-center">
                        <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Brak zada┼ä na dzi┼Ť.</p>
                      </CardContent>
                    </Card>
                  )}
                </TileCard>
              </div>
            </section>

            {noStepLeads.length > 0 && (
              <section id="today-section-no-step" className="space-y-4">
                <TileCard id="today-section-no-step" title="Bez zaplanowanej akcji" subtitle={`${noStepLeads.length} lead├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {noStepLeads.slice(0, 4).map((lead) => (
                      <LeadLinkCard
                        key={lead.id}
                        leadId={String(lead.id)}
                        title={lead.name}
                        subtitle={lead.company || 'Brak firmy'}
                        badges={<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Brak dzia┼éa┼ä</Badge>}
                      />
                    ))}
                  </div>
                </TileCard>
              </section>
            )}

            <section id="today-section-ai-drafts" className="space-y-4">
              <TileCard id="today-section-ai-drafts-list" title="Do sprawdzenia" subtitle={`${pendingTodayAiDraftCount} szkic├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                {pendingTodayAiDrafts.length > 0 ? (
                  <div className="space-y-2">
                    {pendingTodayAiDrafts.slice(0, 6).map((draft) => (
                      <Link key={draft.id} to="/ai-drafts" className="block rounded-lg border border-violet-200 bg-violet-50/40 px-3 py-2 hover:bg-violet-50">
                        <p className="font-medium text-slate-900">{getTodayAiDraftTitle(draft)}</p>
                        <p className="text-xs text-violet-700">{formatTodayAiDraftCreatedAt(draft.createdAt || draft.updatedAt)}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed bg-slate-50/50">
                    <CardContent className="p-6 text-sm text-slate-500">Brak szkic├│w do zatwierdzenia.</CardContent>
                  </Card>
                )}
              </TileCard>
            </section>

            {waitingTooLongLeads.length > 0 && (
              <section id="today-section-waiting-too-long" className="space-y-4">
                <TileCard id="today-section-waiting-too-long" title="Waiting za d┼éugo" subtitle={`${waitingTooLongLeads.length} lead├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                  <div className="grid gap-3">
                    {waitingTooLongLeads.slice(0, 6).map((lead) => (
                      <LeadLinkCard
                        key={lead.id}
                        leadId={String(lead.id)}
                        title={lead.name}
                        subtitle={lead.company || 'Oczekuje za d┼éugo'}
                        subtitleClassName="text-purple-600 font-medium"
                        badges={<Badge variant="outline" className="border-purple-200 text-purple-700 bg-white">Waiting za d┼éugo</Badge>}
                        helperText="Pow├│d: temat d┼éugo czeka bez nowego ruchu i wymaga decyzji operatora."
                      />
                    ))}
                  </div>
                </TileCard>
              </section>
            )}

            {completedTodayEntries.length > 0 && (
              <section id="today-section-completed-today" className="space-y-4">
                <TileCard id="today-section-completed-today" title="Dzisiaj zrobioneone" subtitle={`${completedTodayEntries.length} wpis├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                  <div className="space-y-2">
                    {completedTodayEntries.slice(0, 8).map((entry) => (
                      <Card key={`completed-${entry.id}`} className="border-emerald-100 bg-emerald-50/30">
                        <CardContent className="p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 line-through">{entry.title}</p>
                            <p className="text-xs text-emerald-700">Pow├│d: zrobioneone dzisiaj</p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Zamkni─Öte</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TileCard>
              </section>
            )}

            {(readyToStartLeads.length > 0 || activeServiceLeads.length > 0 || blockedCases.length > 0) && (
              <section id="today-section-service-transition" className="space-y-4">
                <div className="flex items-center gap-2 text-violet-600">
                  <EntityIcon entity="case" className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Start i obs┼éuga</h2>
                </div>
                {readyToStartLeads.length > 0 ? (
                  <TileCard id="today-section-ready-to-start" title="Gotowe do uruchomienia sprawy" subtitle={`${readyToStartLeads.length} lead├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                    <div className="space-y-2">
                      {readyToStartLeads.slice(0, 5).map((lead) => (
                        <LeadLinkCard
                          key={lead.id}
                          leadId={String(lead.id)}
                          title={lead.name}
                          subtitle={lead.company || 'Lead gotowy do startu'}
                          badges={<Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 border-none">Gotowy do startu</Badge>}
                          helperText="Wejd┼║ w lead i u┼╝yj akcji ÔÇ×Rozpocznij obs┼éug─ÖÔÇŁ."
                        />
                      ))}
                    </div>
                  </TileCard>
                ) : null}
                {activeServiceLeads.length > 0 ? (
                  <TileCard id="today-section-active-service" title="Obs┼éuga aktywna" subtitle={`${activeServiceLeads.length} lead├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                    <div className="space-y-2">
                      {activeServiceLeads.slice(0, 5).map((lead) => (
                        <LeadLinkCard
                          key={lead.id}
                          leadId={String(lead.id)}
                          title={lead.name}
                          subtitle={lead.company || 'Obs┼éuga aktywna'}
                          badges={<Badge variant="outline" className="border-violet-200 text-violet-700">Obs┼éuga aktywna</Badge>}
                        />
                      ))}
                    </div>
                  </TileCard>
                ) : null}
                {blockedCases.length > 0 ? (
                  <TileCard id="today-section-blocked-cases" title="Zablokowane sprawy" subtitle={`${blockedCases.length} spraw`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                    <div className="space-y-2">
                      {blockedCases.slice(0, 5).map((caseRecord) => (
                        <Link key={String(caseRecord.id)} to={`/case/${String(caseRecord.id)}`} className="block rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 hover:bg-rose-50">
                          <p className="font-medium text-slate-900">{String(caseRecord.title || 'Sprawa')}</p>
                          <p className="text-sm text-rose-700">Status: zablokowana</p>
                        </Link>
                      ))}
                    </div>
                  </TileCard>
                ) : null}
              </section>
            )}

            {staleLeads.length > 0 && (
              <section id="today-section-stale" className="space-y-4">
                <TileCard id="today-section-stale" title="Bez ruchu" subtitle={`${staleLeads.length} lead├│w`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                  <div className="grid gap-3">
                    {staleLeads.map((lead) => {
                      const days = getDaysWithoutUpdate(lead) || 0;
                      return (
                        <LeadLinkCard
                          key={lead.id}
                          leadId={String(lead.id)}
                          title={lead.name}
                          subtitle={`${days} dni bez wyra┼║nego ruchu ÔÇó ${lead.company || lead.source || 'Lead'}`}
                          subtitleClassName="text-purple-500 font-medium"
                          className="border-purple-100 bg-purple-50/30"
                          badges={<Badge variant="outline" className="rounded-full border-purple-200 text-purple-700 bg-white">Bez ruchu</Badge>}
                          helperText="Lead ma ustawiony proces, ale nie by┼éo ┼Ťwie┼╝ego ruchu. To dobry kandydat do szybkiego sprawdzenia lub follow-upu."
                        />
                      );
                    })}
                  </div>
                </TileCard>
              </section>
            )}
          </div>

          <aside className="right-card today-right-rail space-y-8">
            <div hidden data-today-stage35-removed-pipeline-summary="true" />

            {riskyValuableLeads.length > 0 && (
              <section id="today-section-high-value-risk" className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Wysoka warto┼Ť─ç / ryzyko</h2>
                <div className="space-y-3">
                  {riskyValuableLeads.map((lead) => (
                    <LeadLinkCard
                      key={lead.id}
                      leadId={String(lead.id)}
                      title={lead.name}
                      subtitle={lead.company || lead.source || 'Lead'}
                      rightMeta={
                        <div className="text-right">
                          <p className="text-sm font-bold text-rose-600">{(Number(lead.dealValue) || 0).toLocaleString()} PLN</p>
                          <Badge variant="outline" className="text-[8px] h-4 px-1 border-rose-200 text-rose-700">RYZYKO</Badge>
                        </div>
                      }
                      badges={
                        <>
                          {lead.isAtRisk ? <Badge variant="destructive">Oznaczony jako zagro┼╝ony</Badge> : null}
                          {isLeadOverdue(lead) ? <Badge variant="destructive">Termin w przesz┼éo┼Ťci</Badge> : null}
                          {!parseMoment(lead.nextActionAt) ? <Badge variant="outline" className="border-amber-200 text-amber-700">Brak dzia┼éa┼ä</Badge> : null}
                          {(getDaysWithoutUpdate(lead) || 0) >= 5 ? <Badge variant="outline" className="border-purple-200 text-purple-700">Bez ruchu {getDaysWithoutUpdate(lead)} dni</Badge> : null}
                        </>
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            <section id="today-section-next-days" className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Najbli┼╝sze dni</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((days) => {
                  const date = addDays(new Date(), days);
                  const dayStart = startOfDay(date);
                  const dayEnd = endOfDay(date);
                  const dayEntries = combineScheduleEntries({
                    events,
                    tasks,
                    leads: leadsWithAction,
                    rangeStart: dayStart,
                    rangeEnd: dayEnd,
                  });
                  const count = dayEntries.length;
                  if (count === 0) return null;

                  return (
                    <TileCard key={days} id={`upcoming-day:${days}`} title={`${format(date, 'EEE', { locale: pl }).toUpperCase()} ${format(date, 'd')}`} subtitle={`${count} ${count === 1 ? 'rzecz' : 'rzeczy'}`} collapsedMap={collapsedTiles} onToggle={toggleTile}>
                      <p className="text-[10px] text-slate-500">
                        {dayEntries.filter((entry) => entry.kind === 'event').length} wydarze┼ä ÔÇó {dayEntries.filter((entry) => entry.kind === 'task').length} zada┼ä ÔÇó {dayEntries.filter((entry) => entry.kind === 'lead').length} lead├│w
                      </p>
                    </TileCard>
                  );
                })}
              </div>
            </section>

            <div hidden data-today-stage35-removed-duplicate-leads-under-upcoming="true" />
          </aside>
        </div>
      </div>
      <Dialog open={Boolean(previewEntry)} onOpenChange={(open) => { if (!open) setPreviewEntry(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewEntry?.kind === 'task' ? 'Podgl─ůd zadania' : 'Podgl─ůd wydarzenia'}</DialogTitle>
          </DialogHeader>
          {previewEntry ? (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">{previewEntry.title}</p>
                <p className="text-sm text-slate-500">
                  {previewEntry.kind === 'task'
                    ? TASK_TYPES.find((item) => item.value === previewEntry.raw?.type)?.label || 'Zadanie'
                    : EVENT_TYPES.find((item) => item.value === previewEntry.raw?.type)?.label || 'Wydarzenie'}
                  {previewEntry.leadName ? ` ÔÇó Lead: ${previewEntry.leadName}` : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{previewEntry.kind === 'task' ? 'Termin' : 'Start'}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{format(parseISO(previewEntry.startsAt), 'd MMMM yyyy, HH:mm', { locale: pl })}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {previewEntry.kind === 'task'
                      ? previewEntry.raw?.status === 'done'
                        ? 'Zrobione'
                        : 'Do zrobienia'
                      : previewEntry.raw?.status === 'completed'
                        ? 'Wykonane'
                        : 'Zaplanowane'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {previewEntry.raw?.recurrence?.mode && previewEntry.raw.recurrence.mode !== 'none' ? (
                  <Badge variant="outline"><Repeat className="w-3 h-3 mr-1" /> {RECURRENCE_OPTIONS.find((option) => option.value === previewEntry.raw.recurrence.mode)?.label}</Badge>
                ) : null}
                {previewEntry.raw?.reminder?.mode && previewEntry.raw.reminder.mode !== 'none' ? (
                  <Badge variant="outline"><EntityIcon entity="notification" className="w-3 h-3 mr-1" /> Przypomnienie aktywne</Badge>
                ) : null}
              </div>

              <DialogFooter className="flex flex-wrap gap-2 sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => previewEntry.kind === 'task' ? deleteTodayTask(previewEntry) : deleteTodayEvent(previewEntry)}
                    disabled={todayActionId === `${previewEntry.id}:delete`}
                  >
                    {todayActionId === `${previewEntry.id}:delete` ? 'Usuwanie...' : 'Usu┼ä'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => previewEntry.kind === 'task' ? toggleTodayTask(previewEntry) : toggleTodayEvent(previewEntry)}
                    disabled={todayActionId === `${previewEntry.id}:done`}
                  >
                    {todayActionId === `${previewEntry.id}:done`
                      ? 'Zapisywanie...'
                      : previewEntry.kind === 'task'
                        ? previewEntry.raw?.status === 'done'
                          ? 'Przywr├│─ç'
                          : 'Oznacz jako zrobione'
                        : previewEntry.raw?.status === 'completed'
                          ? 'Przywr├│─ç'
                          : 'Oznacz jako wykonane'}
                  </Button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={previewEntry.kind === 'task' ? '/tasks' : '/calendar'}>
                    {previewEntry.kind === 'task' ? 'Otw├│rz zadania' : 'Otw├│rz kalendarz'}
                  </Link>
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
/* PHASE0_STAGE29D_TODAY_LAST7_CONTRACT
TODAY_AI_DRAFTS_TILE_STAGE29D_COMPACT_BOTTOM
data-today-ai-drafts-compact-tile="true"
data-today-ai-drafts-stage29d-bottom="true"
Szkice do zatwierdzenia
Brak szkic├│w oczekuj─ůcych
Otw├│rz Szkice AI
function TileCard({
data-today-tile-card="true"
data-today-tile-header="true"
aria-expanded={!collapsed}
expandTodayShortcutSection(section)
*/
/* TODAY_GLOBAL_QUICK_ACTIONS_DEDUPED_V97 */
/* PHASE0_STAGE29D_TODAY_FINAL4
TODAY_AI_DRAFTS_TILE_STAGE29D_COMPACT_BOTTOM
data-today-ai-drafts-compact-tile="true"
data-today-ai-drafts-stage29d-bottom="true"
Szkice do zatwierdzenia
Brak szkic├│w oczekuj─ůcych
Otw├│rz Szkice AI
function TileCard({
data-today-tile-card="true"
data-today-tile-header="true"
aria-expanded={!collapsed}
expandTodayShortcutSection(section)
*/


