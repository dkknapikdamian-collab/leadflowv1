import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import {
  formatRoadmapActivityTitle,
  getRoadmapItemNoteText,
  type ActivityRoadmapItem,
} from '../lib/activity-roadmap';

type ActivityItemPreviewDialogProps = {
  open: boolean;
  item: ActivityRoadmapItem | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: ActivityRoadmapItem) => void;
  onDelete: (item: ActivityRoadmapItem) => void;
};

function formatDate(value?: string) {
  if (!value) return 'Brak daty';
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

function relationLabel(item: ActivityRoadmapItem) {
  if (item.entityType === 'case') return 'sprawa';
  if (item.entityType === 'client') return 'klient';
  return 'lead';
}

export function ActivityItemPreviewDialog({ open, item, onOpenChange, onEdit, onDelete }: ActivityItemPreviewDialogProps) {
  const noteText = item ? getRoadmapItemNoteText(item) : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-case-note-preview-dialog="true">
        <DialogHeader>
          <DialogTitle>Notatka</DialogTitle>
        </DialogHeader>

        {item ? (
          <div className="cf-activity-note-preview">
            <p className="cf-activity-note-preview__title">{formatRoadmapActivityTitle(item)}</p>
            <div className="cf-activity-note-preview__body">{noteText || 'Brak treści notatki.'}</div>
            <dl className="cf-activity-note-preview__meta">
              <div>
                <dt>Dodano</dt>
                <dd>{formatDate(item.happenedAt)}</dd>
              </div>
              <div>
                <dt>Powiązanie</dt>
                <dd>{relationLabel(item)} · {item.entityId}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Zamknij</Button>
          {item ? <Button type="button" variant="outline" onClick={() => onEdit(item)}>Edytuj</Button> : null}
          {item ? <Button type="button" variant="destructive" onClick={() => onDelete(item)}>Usuń</Button> : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActivityItemPreviewDialog;
