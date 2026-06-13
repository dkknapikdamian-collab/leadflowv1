import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { createStarterCaseForClient } from '../lib/cases/create-client-case';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { modalFooterClass } from './entity-actions';

type CreateClientCaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Record<string, any>;
  workspaceId: string;
  hasAccess: boolean;
  hasExistingCase: boolean;
};

export function CreateClientCaseDialog({
  open,
  onOpenChange,
  client,
  workspaceId,
  hasAccess,
  hasExistingCase,
}: CreateClientCaseDialogProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) setTitle('');
  }, [open]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const preparedTitle = title.trim();
    if (!preparedTitle) {
      toast.error('Podaj nazwę sprawy.');
      return;
    }
    if (!hasAccess) {
      toast.error('Brak dostępu do tworzenia spraw.');
      return;
    }

    const clientId = String(client?.id || '').trim();
    if (!workspaceId || !clientId) {
      toast.error('Nie udało się ustalić klienta lub workspace.');
      return;
    }

    try {
      setSaving(true);
      const { createdCaseId } = await createStarterCaseForClient({
        title: preparedTitle,
        clientId,
        clientName: String(client?.name || client?.company || 'Klient').trim(),
        clientEmail: String(client?.email || '').trim(),
        clientPhone: String(client?.phone || '').trim(),
        workspaceId,
        primaryForClient: !hasExistingCase,
      });

      if (!createdCaseId) {
        toast.error('Sprawa została zapisana, ale nie udało się otworzyć jej finansów.');
        return;
      }

      toast.success('Sprawa dodana. Uzupełnij jej finanse.');
      onOpenChange(false);
      navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-detail');
    } catch (error: any) {
      toast.error(`Nie udało się dodać sprawy: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !saving && onOpenChange(nextOpen)}>
      <DialogContent aria-describedby="create-client-case-description">
        <DialogHeader>
          <DialogTitle>Dodaj sprawę</DialogTitle>
          <DialogDescription id="create-client-case-description">
            Wpisz nazwę sprawy. Po zapisaniu od razu przejdziesz do jej finansów.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="create-client-case-title">Nazwa sprawy</Label>
            <Input
              id="create-client-case-title"
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Np. Podział działki"
              disabled={saving}
            />
          </div>
          <DialogFooter className={modalFooterClass()}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Anuluj
            </Button>
            <Button type="submit" disabled={saving || !title.trim()}>
              {saving ? 'Dodawanie…' : 'Dodaj sprawę'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
