import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { REMINDER_MODE_OPTIONS, REMINDER_OFFSET_OPTIONS, TASK_TYPES, PRIORITY_OPTIONS } from '../lib/options';
import { insertTaskToSupabase } from '../lib/supabase-fallback';
import { toDateTimeLocalValue } from '../lib/scheduling';
import { requireWorkspaceId } from '../lib/workspace-context';

type TaskCreateFormState = {
  title: string;
  type: string;
  dueAt: string;
  priority: string;
  status: string;
  reminderMode: string;
  reminderOffsetMinutes: number;
};

type TaskCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void | Promise<void>;
};

function defaultTaskCreateForm(): TaskCreateFormState {
  return {
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    status: 'todo',
    reminderMode: 'none',
    reminderOffsetMinutes: 15,
  };
}

function calculateReminderAt(dueAt: string, reminderMode: string, reminderOffsetMinutes: number) {
  if (reminderMode === 'none') return null;
  const dueTime = new Date(dueAt).getTime();
  if (!Number.isFinite(dueTime)) return null;
  return new Date(dueTime - Number(reminderOffsetMinutes || 0) * 60_000).toISOString();
}

export default function TaskCreateDialog({ open, onOpenChange, onSaved }: TaskCreateDialogProps) {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [form, setForm] = useState<TaskCreateFormState>(() => defaultTaskCreateForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(defaultTaskCreateForm());
  }, [open]);

  const closeDialog = () => {
    if (saving) return;
    onOpenChange(false);
    setForm(defaultTaskCreateForm());
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    if (!form.title.trim()) return toast.error('Podaj tytuł zadania.');

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    setSaving(true);
    try {
      await insertTaskToSupabase({
        title: form.title.trim(),
        type: form.type || 'follow_up',
        date: form.dueAt.slice(0, 10),
        scheduledAt: form.dueAt,
        dueAt: form.dueAt,
        priority: form.priority || 'medium',
        status: form.status || 'todo',
        reminderAt: calculateReminderAt(form.dueAt, form.reminderMode, form.reminderOffsetMinutes),
        recurrenceRule: form.reminderMode === 'recurring' ? 'FREQ=DAILY' : undefined,
        workspaceId,
      });
      toast.success('Zadanie dodane');
      onOpenChange(false);
      setForm(defaultTaskCreateForm());
      await onSaved?.();
    } catch {
      toast.error('Nie udało się zapisać zadania.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
      <DialogContent className="max-w-xl" data-task-create-dialog-stage45m="true">
        <DialogHeader>
          <DialogTitle>Nowe zadanie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tytuł</Label>
            <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Co trzeba zrobić?" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Termin</Label>
              <Input type="datetime-local" value={form.dueAt} onChange={(event) => setForm((prev) => ({ ...prev, dueAt: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Priorytet</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}>
                {PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Typ</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
                {TASK_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>
                <option value="todo">Do zrobienia</option>
                <option value="done">Zrobione</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <Button type="submit" disabled={saving || workspaceLoading}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Zapisz zadanie</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
