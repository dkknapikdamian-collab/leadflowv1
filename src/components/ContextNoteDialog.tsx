import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import { insertActivityToSupabase } from '../lib/supabase-fallback';
import { requireWorkspaceId } from '../lib/workspace-context';
import type { TaskCreateDialogContext } from './TaskCreateDialog';

const STAGE85_CONTEXT_NOTE_DIALOG_SHARED = 'Shared note dialog for lead, client and case detail context actions';
const STAGE27E_CONTEXT_NOTE_SAVED_EVENT = 'closeflow:context-note-saved';
const STAGE27A_CONTEXT_NOTE_SAVED_EVENT = 'closeflow:context-note-saved';

type ContextNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void | Promise<void>;
  context?: TaskCreateDialogContext;
};

function eventTypeForContext(context?: TaskCreateDialogContext) {
  if (context?.recordType === 'case') return 'operator_note';
  if (context?.recordType === 'client') return 'client_note';
  return 'note_added';
}

export default function ContextNoteDialog({ open, onOpenChange, onSaved, context }: ContextNoteDialogProps) {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setNote('');
  }, [open, context?.recordType, context?.recordId]);

  const closeDialog = () => {
    if (saving) return;
    onOpenChange(false);
    setNote('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const content = note.trim();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!content) return toast.error('Wpisz treść notatki.');
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    const input: any = {
      leadId: context?.leadId || null,
      caseId: context?.caseId || null,
      ownerId: null,
      actorId: null,
      actorType: 'operator',
      eventType: eventTypeForContext(context),
      payload: {
        content,
        note: content,
        source: 'stage85-context-note-dialog',
        recordType: context?.recordType || null,
        recordLabel: context?.recordLabel || null,
      },
      workspaceId,
    };
    if (context?.clientId) input.clientId = context.clientId;

    setSaving(true);
    try {
      await insertActivityToSupabase(input);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STAGE27A_CONTEXT_NOTE_SAVED_EVENT, { detail: input }));
      }
      toast.success('Notatka dodana');
      onOpenChange(false);
      setNote('');
      await onSaved?.();
    } catch {
      toast.error('Nie udało się zapisać notatki.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
      <DialogContent className="max-w-2xl" data-context-note-dialog-stage85="true">
        <DialogHeader>
          <DialogTitle>Dodaj notatkę</DialogTitle>
        </DialogHeader>
        {context?.recordLabel ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900" data-stage85-context-relation="true">
            Powiązanie: {context.recordLabel}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Treść notatki</Label>
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={8} placeholder="Wpisz notatkę po rozmowie, ustalenia albo ważny kontekst." />
            <p className="text-xs font-medium text-slate-500">Notatka zostanie przypięta do aktualnego rekordu. Nie tworzy zadania ani wydarzenia bez osobnego kliknięcia.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
            <Button type="submit" disabled={saving || workspaceLoading}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Zapisz notatkę</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
