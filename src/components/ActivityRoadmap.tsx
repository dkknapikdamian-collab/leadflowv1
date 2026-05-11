import { useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  FileText,
  ListChecks,
  Pencil,
  StickyNote,
} from 'lucide-react';
import type { ActivityRoadmapItem, ActivityRoadmapItemKind } from '../lib/activity-roadmap';

type ActivityRoadmapProps = {
  items: ActivityRoadmapItem[];
  title?: string;
  subtitle?: string;
  limit?: number;
  emptyText?: string;
  showHeader?: boolean;
};

function formatRoadmapDate(value: string) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return 'Brak daty';
  return parsed.toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRoadmapIcon(kind: ActivityRoadmapItemKind) {
  if (kind === 'note') return StickyNote;
  if (kind === 'task_created' || kind === 'task_done') return ListChecks;
  if (kind === 'event_created' || kind === 'event_done') return CalendarClock;
  if (kind === 'payment_added' || kind === 'payment_removed' || kind === 'payment_updated') return CircleDollarSign;
  if (kind === 'missing_item_added' || kind === 'missing_item_done') return FileCheck2;
  if (kind === 'status_changed') return CheckCircle2;
  if (kind === 'case_created' || kind === 'case_updated' || kind === 'case_deleted') return FileText;
  return Pencil;
}

function getRoadmapTone(kind: ActivityRoadmapItemKind) {
  if (kind === 'payment_added') return 'payment';
  if (kind === 'payment_removed' || kind === 'case_deleted') return 'danger';
  if (kind === 'task_done' || kind === 'event_done' || kind === 'missing_item_done') return 'done';
  if (kind === 'task_created') return 'task';
  if (kind === 'event_created') return 'event';
  if (kind === 'note') return 'note';
  if (kind === 'missing_item_added') return 'missing';
  return 'neutral';
}

function RoadmapItemRow({ item }: { item: ActivityRoadmapItem }) {
  const Icon = getRoadmapIcon(item.kind);
  const tone = getRoadmapTone(item.kind);

  return (
    <article className="cf-activity-roadmap__row" data-roadmap-kind={item.kind} data-roadmap-tone={tone}>
      <span className="cf-activity-roadmap__icon" aria-hidden="true">
        <Icon className="h-4 w-4" />
      </span>
      <span className="cf-activity-roadmap__body">
        <strong>{item.title}</strong>
        {item.description ? <small>{item.description}</small> : null}
        <time>{formatRoadmapDate(item.happenedAt)}</time>
      </span>
      <span className="cf-activity-roadmap__meta">
        {item.editable ? <small>edycja</small> : null}
        {item.deletable ? <small>usuń</small> : null}
      </span>
    </article>
  );
}

export function ActivityRoadmap({
  items,
  title = 'Roadmapa',
  subtitle = 'Chronologiczna kartoteka działań z jednego modelu UI.',
  limit,
  emptyText = 'Brak aktywności do pokazania.',
  showHeader = true,
}: ActivityRoadmapProps) {
  const [expanded, setExpanded] = useState(false);
  const sortedItems = useMemo(() => {
    return [...(Array.isArray(items) ? items : [])].sort((first, second) => {
      const firstTime = new Date(first.happenedAt).getTime() || 0;
      const secondTime = new Date(second.happenedAt).getTime() || 0;
      return secondTime - firstTime;
    });
  }, [items]);
  const hasLimit = typeof limit === 'number' && limit > 0;
  const visibleItems = hasLimit && !expanded ? sortedItems.slice(0, limit) : sortedItems;
  const canExpand = hasLimit && sortedItems.length > visibleItems.length;

  return (
    <section className="cf-activity-roadmap" data-closeflow-activity-roadmap="true" aria-label={title}>
      {showHeader ? (
        <header className="cf-activity-roadmap__header">
          <span>
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </span>
          <em>{sortedItems.length}</em>
        </header>
      ) : null}

      {visibleItems.length ? (
        <div className="cf-activity-roadmap__list">
          {visibleItems.map((item) => (
            <RoadmapItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="cf-activity-roadmap__empty">{emptyText}</p>
      )}

      {canExpand || expanded ? (
        <button type="button" className="cf-activity-roadmap__toggle" onClick={() => setExpanded((current) => !current)}>
          {expanded ? 'Pokaż mniej' : 'Pokaż całą roadmapę'}
        </button>
      ) : null}
    </section>
  );
}

export default ActivityRoadmap;
