import { type FormEvent, useEffect, useState } from 'react';
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
import { modalFooterClass } from './entity-actions';
import { useWorkspace } from '../hooks/useWorkspace';
import { REMINDER_MODE_OPTIONS, REMINDER_OFFSET_OPTIONS, TASK_TYPES, PRIORITY_OPTIONS } from '../lib/options';
import { insertTaskToSupabase } from '../lib/supabase-fallback';
import { toDateTimeLocalValue } from '../lib/scheduling';
import { requireWorkspaceId } from '../lib/workspace-context';
import '../styles/visual-stage22-event-form-vnext.css';

type TaskCreateFormState = {
  title: string;
  type: string;
  dueAt: string;
  priority: string;
  status: string;
  reminderMode: string;
  reminderOffsetMinutes: number;
};

export type TaskCreateDialogContext = {
  recordType?: 'lead' | 'client' | 'case';
  recordId?: string;
  recordLabel?: string;
  leadId?: string | null;
  caseId?: string | null;
  clientId?: string | null;
};

const STAGE85_TASK_CREATE_DIALOG_CONTEXT = 'TaskCreateDialog supports relation context from lead, client and case detail screens';
const TASK_CREATE_DIALOG_STAGE105_FORM_SOURCE = 'event-form-vnext';
const taskCreateDialogFooterClass = modalFooterClass('event-form-footer');

type TaskCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void | Promise<void>;
  context?: TaskCreateDialogContext;
};

function defaultTaskCreateForm(context?: TaskCreateDialogContext): TaskCreateFormState {
  return {
    title: context?.recordLabel ? 'Follow-up: ' + context.recordLabel : '',
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

export default function TaskCreateDialog({ open, onOpenChange, onSaved, context }: TaskCreateDialogProps) {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [form, setForm] = useState<TaskCreateFormState>(() => defaultTaskCreateForm(context));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(defaultTaskCreateForm(context));
  }, [open, context?.recordType, context?.recordId, context?.recordLabel]);

  const closeDialog = () => {
    if (saving) return;
    onOpenChange(false);
    setForm(defaultTaskCreateForm(context));
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
        leadId: context?.leadId || undefined,
        caseId: context?.caseId || undefined,
        clientId: context?.clientId || undefined,
        workspaceId,
      });
      toast.success('Zadanie dodane');
      onOpenChange(false);
      setForm(defaultTaskCreateForm(context));
      await onSaved?.();
    } catch {
      toast.error('Nie udało się zapisać zadania.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
      <DialogContent
        className="event-form-vnext-content sm:max-w-2xl"
        data-calendar-entry-form-source={TASK_CREATE_DIALOG_STAGE105_FORM_SOURCE}
        data-calendar-entry-form-mode="quick-task"
        data-task-create-dialog-stage45m="true"
        data-task-create-dialog-stage105="event-form-vnext"
        data-event-form-stage22="true"
      >
        <DialogHeader>
          <DialogTitle>Nowe zadanie</DialogTitle>
        </DialogHeader>
        {context?.recordLabel ? (
          <div className="event-form-card rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900" data-stage85-context-relation="true">
            Powiązanie: {context.recordLabel}
          </div>
        ) : null}
        <form
          onSubmit={handleSubmit}
          className="event-form-vnext"
          data-calendar-entry-form-source={TASK_CREATE_DIALOG_STAGE105_FORM_SOURCE}
          data-calendar-entry-form-mode="quick-task"
          data-task-create-dialog-stage105="event-form-vnext"
        >
          <div className="event-form-field">
            <Label>Tytuł</Label>
            <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Co trzeba zrobić?" />
          </div>
          <div className="event-form-grid event-form-grid-2">
            <div className="event-form-field">
              <Label>Termin</Label>
              <Input type="datetime-local" value={form.dueAt} onChange={(event) => setForm((prev) => ({ ...prev, dueAt: event.target.value }))} />
            </div>
            <div className="event-form-field">
              <Label>Priorytet</Label>
              <select className="event-form-select" value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}>
                {PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <div className="event-form-grid event-form-grid-2">
            <div className="event-form-field">
              <Label>Typ</Label>
              <select className="event-form-select" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
                {TASK_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="event-form-field">
              <Label>Status</Label>
              <select className="event-form-select" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>
                <option value="todo">Do zrobienia</option>
                <option value="done">Zrobione</option>
              </select>
            </div>
          </div>
          <div className="event-form-grid event-form-grid-2">
            <div className="event-form-field">
              <Label>Przypomnienie</Label>
              <select className="event-form-select" value={form.reminderMode} onChange={(event) => setForm((prev) => ({ ...prev, reminderMode: event.target.value }))}>
                {REMINDER_MODE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="event-form-field">
              <Label>Kiedy przypomnieć</Label>
              <select className="event-form-select" value={String(form.reminderOffsetMinutes)} disabled={form.reminderMode === 'none'} onChange={(event) => setForm((prev) => ({ ...prev, reminderOffsetMinutes: Number(event.target.value) }))}>
                {REMINDER_OFFSET_OPTIONS.map((option) => <option key={option.value} value={String(option.value)}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter className={taskCreateDialogFooterClass}>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
            <Button type="submit" disabled={saving || workspaceLoading}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Zapisz zadanie</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
