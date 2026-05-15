import { type ReactNode } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

type DraftReviewDialogProps = {
  open: boolean;
  title?: string;
  description?: ReactNode;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
};

export default function DraftReviewDialog({
  open,
  title = 'Sprawdź szkic',
  description,
  pending = false,
  onConfirm,
  onCancel,
  onOpenChange,
}: DraftReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-slate-600">
          {description || 'Finalny rekord powstanie dopiero po potwierdzeniu.'}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
            Anuluj szkic
          </Button>
          <Button type="button" onClick={onConfirm} disabled={pending}>
            {pending ? 'Zapisywanie...' : 'Potwierdź i utwórz rekord'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
