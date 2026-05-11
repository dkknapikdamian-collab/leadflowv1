import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { insertActivityToSupabase, insertCaseItemToSupabase } from '../lib/supabase-fallback';

export type AddCaseMissingItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  caseTitle?: string;
  clientId?: string | null;
  leadId?: string | null;
  onSaved?: () => void;
};

function toIsoOrNull(value: string) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

export default function AddCaseMissingItemDialog({
  open,
  onOpenChange,
  caseId,
  caseTitle,
  clientId,
  leadId,
  onSaved,
}: AddCaseMissingItemDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => Boolean(caseId && title.trim() && !saving), [caseId, title, saving]);

  function reset() {
    setTitle('');
    setDescription('');
    setDueDate('');
  }

  async function handleSubmit() {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      toast.error('Wpisz, czego brakuje.');
      return;
    }
    if (!caseId) {
      toast.error('Brak ID sprawy. Nie można dodać braku.');
      return;
    }

    setSaving(true);
    try {
      const dueDateIso = toIsoOrNull(dueDate);
      await insertCaseItemToSupabase({
        caseId,
        title: normalizedTitle,
        description: description.trim() || '',
        type: 'text',
        status: 'missing',
        isRequired: true,
        dueDate: dueDateIso,
      });

      await insertActivityToSupabase({
        caseId,
        clientId: clientId || null,
        leadId: leadId || null,
        actorType: 'operator',
        eventType: 'item_added',
        payload: {
          source: 'case_quick_actions',
          title: normalizedTitle,
          itemTitle: normalizedTitle,
          description: description.trim() || null,
          dueDate: dueDateIso,
          caseTitle: caseTitle || null,
        },
      });

      toast.success('Dodano brak do sprawy.');
      reset();
      onOpenChange(false);
      onSaved?.();
    } catch (error: any) {
      toast.error('Nie udało się dodać braku: ' + (error?.message || 'błąd zapisu'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      onOpenChange(nextOpen);
      if (!nextOpen) reset();
    }}>
      <DialogContent data-add-case-missing-item-dialog="true" className="case-detail-missing-item-dialog">
        <DialogHeader>
          <DialogTitle>Dodaj brak w sprawie</DialogTitle>
        </DialogHeader>

        <div className="case-detail-dialog-stack">
          <Label>
            <span>Czego brakuje?</span>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Np. skan umowy, decyzja klienta, dokument sprzedaży" />
          </Label>

          <Label>
            <span>Opis</span>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Opcjonalny kontekst dla operatora lub klienta" rows={4} />
          </Label>

          <Label>
            <span>Termin opcjonalnie</span>
            <Input type="datetime-local" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Anuluj</Button>
          <Button type="button" onClick={handleSubmit} disabled={!canSave}>{saving ? 'Dodaję…' : 'Dodaj brak'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
