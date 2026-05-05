import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { EVENT_TYPES, RECURRENCE_OPTIONS, REMINDER_MODE_OPTIONS, REMINDER_OFFSET_OPTIONS } from '../lib/options';
import { buildStartEndPair, toDateTimeLocalValue } from '../lib/scheduling';
import { insertEventToSupabase } from '../lib/supabase-fallback';
import { requireWorkspaceId } from '../lib/workspace-context';
import type { TaskCreateDialogContext } from './TaskCreateDialog';

const STAGE85_EVENT_CREATE_DIALOG_SHARED = 'Shared event create dialog for global and detail context actions';

type EventCreateFormState = {
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  status: string;
  recurrenceMode: string;
  reminderMode: string;
  reminderOffsetMinutes: number;
};

type EventCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void | Promise<void>;
  context?: TaskCreateDialogContext;
};

function defaultEventCreateForm(context?: TaskCreateDialogContext): EventCreateFormState {
  const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
  return {
    title: context?.recordLabel ? 'Spotkanie: ' + context.recordLabel : '',
    type: 'meeting',
    startAt: pair.startAt,
    endAt: pair.endAt,
    status: 'scheduled',
    recurrenceMode: 'none',
    reminderMode: 'none',
    reminderOffsetMinutes: 60,
  };
}

function buildRecurrenceRule(mode: string) {
  if (mode === 'daily') return 'FREQ=DAILY';
  if (mode === 'weekly') return 'FREQ=WEEKLY';
  if (mode === 'monthly') return 'FREQ=MONTHLY';
  return undefined;
}

function calculateReminderAt(startAt: string, reminderMode: string, reminderOffsetMinutes: number) {
  if (reminderMode === 'none') return undefined;
  const startTime = new Date(startAt).getTime();
  if (!Number.isFinite(startTime)) return undefined;
  return new Date(startTime - Number(reminderOffsetMinutes || 0) * 60_000).toISOString();
}

export default function EventCreateDialog({ open, onOpenChange, onSaved, context }: EventCreateDialogProps) {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [form, setForm] = useState<EventCreateFormState>(() => defaultEventCreateForm(context));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(defaultEventCreateForm(context));
  }, [open, context?.recordType, context?.recordId, context?.recordLabel]);

  const closeDialog = () => {
    if (saving) return;
    onOpenChange(false);
    setForm(defaultEventCreateForm(context));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!form.title.trim()) return toast.error('Podaj tytuł wydarzenia.');
    const startDate = new Date(form.startAt);
    const endDate = new Date(form.endAt);
    if (Number.isNaN(startDate.getTime())) return toast.error('Wybierz poprawną datę startu.');
    if (Number.isNaN(endDate.getTime()) || endDate.getTime() < startDate.getTime()) return toast.error('Godzina końca nie może być przed startem.');

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    setSaving(true);
    try {
      await insertEventToSupabase({
        title: form.title.trim(),
        type: form.type || 'meeting',
        startAt: form.startAt,
        scheduledAt: form.startAt,
        endAt: form.endAt,
        status: form.status || 'scheduled',
        reminderAt: calculateReminderAt(form.startAt, form.reminderMode, form.reminderOffsetMinutes),
        recurrenceRule: buildRecurrenceRule(form.recurrenceMode),
        leadId: context?.leadId || undefined,
        caseId: context?.caseId || undefined,
        clientId: context?.clientId || undefined,
        workspaceId,
      });
      toast.success('Wydarzenie dodane');
      onOpenChange(false);
      setForm(defaultEventCreateForm(context));
      await onSaved?.();
    } catch {
      toast.error('Nie udało się zapisać wydarzenia.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
      <DialogContent className="max-w-2xl" data-event-create-dialog-stage85="true">
        <DialogHeader>
          <DialogTitle>Nowe wydarzenie</DialogTitle>
        </DialogHeader>
        {context?.recordLabel ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900" data-stage85-context-relation="true">
            Powiązanie: {context.recordLabel}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tytuł</Label>
            <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Co ma się wydarzyć?" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input type="datetime-local" value={form.startAt} onChange={(event) => setForm((prev) => ({ ...prev, startAt: event.target.value, endAt: buildStartEndPair(event.target.value).endAt }))} />
            </div>
            <div className="space-y-2">
              <Label>Koniec</Label>
              <Input type="datetime-local" value={form.endAt} onChange={(event) => setForm((prev) => ({ ...prev, endAt: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Typ</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
                {EVENT_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>
                <option value="scheduled">Zaplanowane</option>
                <option value="done">Odbyte</option>
                <option value="cancelled">Anulowane</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Powtarzanie</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.recurrenceMode} onChange={(event) => setForm((prev) => ({ ...prev, recurrenceMode: event.target.value }))}>
                {RECURRENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Przypomnienie</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.reminderMode} onChange={(event) => setForm((prev) => ({ ...prev, reminderMode: event.target.value }))}>
                {REMINDER_MODE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Kiedy przypomnieć</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={String(form.reminderOffsetMinutes)} disabled={form.reminderMode === 'none'} onChange={(event) => setForm((prev) => ({ ...prev, reminderOffsetMinutes: Number(event.target.value) }))}>
                {REMINDER_OFFSET_OPTIONS.map((option) => <option key={option.value} value={String(option.value)}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
            <Button type="submit" disabled={saving || workspaceLoading}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Zapisz wydarzenie</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
