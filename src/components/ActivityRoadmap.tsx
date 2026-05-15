import { useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, CircleDollarSign, FileCheck2, FileText, ListChecks, Pencil, StickyNote } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import ActivityItemPreviewDialog from './ActivityItemPreviewDialog';
import EditActivityNoteDialog from './EditActivityNoteDialog';
import {
  formatRoadmapActivityTitle,
  getRoadmapItemNoteText,
  getRoadmapRawPayload,
  type ActivityRoadmapItem,
  type ActivityRoadmapItemKind,
} from '../lib/activity-roadmap';
import {
  deleteActivityFromSupabase,
  insertActivityToSupabase,
  updateActivityInSupabase,
} from '../lib/supabase-fallback';

type ActivityRoadmapProps = {
  items: ActivityRoadmapItem[];
  title?: string;
  subtitle?: string;
  limit?: number;
  emptyText?: string;
  showHeader?: boolean;
  onChanged?: () => void | Promise<void>;
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

function getActivitySourceId(item: ActivityRoadmapItem) {
  return String(item.sourceId || (item.raw as Record<string, unknown> | undefined)?.id || '').trim();
}

function RoadmapItemRow({
  item,
  onPreview,
  onEdit,
  onDelete,
}: {
  item: ActivityRoadmapItem;
  onPreview: (item: ActivityRoadmapItem) => void;
  onEdit: (item: ActivityRoadmapItem) => void;
  onDelete: (item: ActivityRoadmapItem) => void;
}) {
  const Icon = getRoadmapIcon(item.kind);
  const tone = getRoadmapTone(item.kind);
  const isNote = item.kind === 'note';

  return (
    <article className="cf-activity-roadmap__row" data-roadmap-kind={item.kind} data-roadmap-tone={tone}>
      <span className="cf-activity-roadmap__icon" aria-hidden="true">
        <Icon className="h-4 w-4" />
      </span>
      <span className="cf-activity-roadmap__body">
        <strong>{formatRoadmapActivityTitle(item)}</strong>
        {item.description ? <small>{item.description}</small> : null}
        <time>{formatRoadmapDate(item.happenedAt)}</time>
      </span>
      <span className="cf-activity-roadmap__meta">
        {isNote ? (
          <span className="cf-activity-roadmap__actions" data-case-note-roadmap-actions="true">
            <button type="button" onClick={() => onPreview(item)}>Podgląd</button>
            <button type="button" onClick={() => onEdit(item)}>Edytuj</button>
            <button type="button" onClick={() => onDelete(item)}>Usuń</button>
          </span>
        ) : null}
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
  onChanged,
}: ActivityRoadmapProps) {
  const [expanded, setExpanded] = useState(false);
  const [previewItem, setPreviewItem] = useState<ActivityRoadmapItem | null>(null);
  const [editItem, setEditItem] = useState<ActivityRoadmapItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ActivityRoadmapItem | null>(null);
  const [pending, setPending] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());
  const [overrides, setOverrides] = useState<Record<string, ActivityRoadmapItem>>({});

  const sortedItems = useMemo(() => {
    return [...(Array.isArray(items) ? items : [])]
      .map((item) => overrides[item.id] || item)
      .filter((item) => !hiddenIds.has(item.id))
      .sort((first, second) => {
        const firstTime = new Date(first.happenedAt).getTime() || 0;
        const secondTime = new Date(second.happenedAt).getTime() || 0;
        return secondTime - firstTime;
      });
  }, [hiddenIds, items, overrides]);

  const hasLimit = typeof limit === 'number' && limit > 0;
  const visibleItems = hasLimit && !expanded ? sortedItems.slice(0, limit) : sortedItems;
  const canExpand = hasLimit && sortedItems.length > visibleItems.length;

  async function handleSaveNote(item: ActivityRoadmapItem, noteText: string) {
    const sourceId = getActivitySourceId(item);
    if (!sourceId) {
      toast.error('Nie można zapisać notatki: brak ID aktywności.');
      return;
    }
    const nextText = noteText.trim();
    if (!nextText) {
      toast.error('Notatka nie może być pusta.');
      return;
    }
    setPending(true);
    try {
      const previousPayload = getRoadmapRawPayload(item);
      const payload = {
        ...previousPayload,
        note: nextText,
        title: nextText,
        updatedAt: new Date().toISOString(),
      };
      await updateActivityInSupabase({
        id: sourceId,
        caseId: item.entityType === 'case' ? item.entityId : null,
        clientId: item.entityType === 'client' ? item.entityId : null,
        leadId: item.entityType === 'lead' ? item.entityId : null,
        eventType: 'operator_note',
        payload,
      });
      const nextItem: ActivityRoadmapItem = {
        ...item,
        title: 'Dodano notatkę',
        description: nextText,
        happenedAt: new Date().toISOString(),
        raw: { ...((item.raw as Record<string, unknown>) || {}), payload, updatedAt: new Date().toISOString() },
      };
      setOverrides((current) => ({ ...current, [item.id]: nextItem }));
      setEditItem(null);
      setPreviewItem(nextItem);
      toast.success('Notatka zapisana');
      await onChanged?.();
    } catch (error: any) {
      toast.error('Nie udało się zapisać notatki: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setPending(false);
    }
  }

  async function handleConfirmDeleteNote() {
    const item = deleteItem;
    if (!item) return;
    const sourceId = getActivitySourceId(item);
    if (!sourceId) {
      toast.error('Nie można usunąć notatki: brak ID aktywności.');
      return;
    }
    setPending(true);
    try {
      await deleteActivityFromSupabase(sourceId);
      await insertActivityToSupabase({
        caseId: item.entityType === 'case' ? item.entityId : null,
        clientId: item.entityType === 'client' ? item.entityId : null,
        leadId: item.entityType === 'lead' ? item.entityId : null,
        eventType: 'note_deleted',
        payload: {
          deletedActivityId: sourceId,
          notePreview: getRoadmapItemNoteText(item).slice(0, 300),
        },
      }).catch(() => null);
      setHiddenIds((current) => new Set([...Array.from(current), item.id]));
      setDeleteItem(null);
      if (previewItem?.id === item.id) setPreviewItem(null);
      if (editItem?.id === item.id) setEditItem(null);
      toast.success('Notatka usunięta');
      await onChanged?.();
    } catch (error: any) {
      toast.error('Nie udało się usunąć notatki: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setPending(false);
    }
  }

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
            <RoadmapItemRow
              key={item.id}
              item={item}
              onPreview={setPreviewItem}
              onEdit={setEditItem}
              onDelete={setDeleteItem}
            />
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

      <ActivityItemPreviewDialog
        open={Boolean(previewItem)}
        item={previewItem}
        onOpenChange={(open) => { if (!open) setPreviewItem(null); }}
        onEdit={(item) => { setPreviewItem(null); setEditItem(item); }}
        onDelete={(item) => { setPreviewItem(null); setDeleteItem(item); }}
      />

      <EditActivityNoteDialog
        open={Boolean(editItem)}
        item={editItem}
        pending={pending}
        onOpenChange={(open) => { if (!open && !pending) setEditItem(null); }}
        onSave={handleSaveNote}
      />

      <Dialog open={Boolean(deleteItem)} onOpenChange={(open) => { if (!open && !pending) setDeleteItem(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usunąć notatkę?</DialogTitle>
          </DialogHeader>
          <p>Tej akcji nie da się łatwo cofnąć.</p>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={pending} onClick={() => setDeleteItem(null)}>Anuluj</Button>
            <Button type="button" variant="destructive" disabled={pending} onClick={handleConfirmDeleteNote}>Usuń</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default ActivityRoadmap;
