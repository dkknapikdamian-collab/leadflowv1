import { type ReactNode } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

type LeadStartServiceDialogProps = {
  open: boolean;
  title?: string;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  children?: ReactNode;
};

export default function LeadStartServiceDialog({
  open,
  title = 'Rozpocznij obsługę',
  submitting = false,
  onOpenChange,
  onConfirm,
  children,
}: LeadStartServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        {children}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button type="button" onClick={onConfirm} disabled={submitting}>{submitting ? 'Tworzę...' : 'Rozpocznij obsługę'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
