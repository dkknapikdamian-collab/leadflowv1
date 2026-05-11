import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { getRoadmapItemNoteText, type ActivityRoadmapItem } from '../lib/activity-roadmap';

type EditActivityNoteDialogProps = {
  open: boolean;
  item: ActivityRoadmapItem | null;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: ActivityRoadmapItem, noteText: string) => void | Promise<void>;
};

export function EditActivityNoteDialog({ open, item, pending = false, onOpenChange, onSave }: EditActivityNoteDialogProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(item ? getRoadmapItemNoteText(item) : '');
  }, [item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-case-note-edit-dialog="true">
        <DialogHeader>
          <DialogTitle>Edytuj notatkę</DialogTitle>
        </DialogHeader>
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={8}
          placeholder="Treść notatki"
        />
        <DialogFooter>
          <Button type="button" variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button type="button" disabled={pending || !item || !value.trim()} onClick={() => item && onSave(item, value)}>
            {pending ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditActivityNoteDialog;
