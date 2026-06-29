import { Button } from './ui/button';
import { AppIcon } from './ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmTone?: 'default' | 'destructive';
  pending?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Potwierdź',
  cancelLabel = 'Anuluj',
  confirmTone = 'destructive',
  pending = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`cf-vst-dialog cf-confirm-dialog ${confirmTone === 'destructive' ? 'cf-vst-dialog--delete cf-confirm-dialog--destructive' : 'cf-confirm-dialog--default'} sm:max-w-md`} data-closeflow-confirm-dialog="true" data-cf-vst-dialog="true">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            variant={confirmTone === 'destructive' ? 'destructive' : 'default'}
            onClick={() => void onConfirm()}
            disabled={pending}
          >
            {pending ? <AppIcon name="loading" className="h-4 w-4 animate-spin" decorative /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
