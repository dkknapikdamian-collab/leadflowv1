import { type FormEvent, useEffect, useMemo, useState } from 'react';
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
import { TopicContactPicker } from './topic-contact-picker';
import { modalFooterClass } from './entity-actions';
import { useWorkspace } from '../hooks/useWorkspace';
import { REMINDER_MODE_OPTIONS, REMINDER_OFFSET_OPTIONS, TASK_TYPES, PRIORITY_OPTIONS } from '../lib/options';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchLeadsFromSupabase,
  insertTaskToSupabase,
} from '../lib/supabase-fallback';
import { toDateTimeLocalValue } from '../lib/scheduling';
import { localDateTimeInputToReminderUtcIso } from '../lib/calendar-timezone-contract';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  buildTopicContactOptions,
  findTopicContactOption,
  resolveTopicContactLink,
  type TopicContactOption,
} from '../lib/topic-contact';
import '../styles/visual-stage22-event-form-vnext.css';

type TaskCreateFormState = {
  title: string;
  type: string;
  dueAt: string;
  priority: string;
  status: string;
  reminderMode: string;
  reminderOffsetMinutes: number;
  relationQuery: string;
  leadId: string;
  caseId: string;
  clientId: string;
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
    title: '',
    type: 'follow_up',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: 'medium',
    status: 'todo',
    reminderMode: 'none',
    reminderOffsetMinutes: 15,
    relationQuery: context?.recordLabel || '',
    leadId: context?.leadId || '',
    caseId: context?.caseId || '',
    clientId: context?.clientId || '',
  };
}

function calculateReminderAt(dueAt: string, reminderMode: string, reminderOffsetMinutes: number) {
  if (reminderMode === 'none') return null;
  return localDateTimeInputToReminderUtcIso(dueAt, reminderOffsetMinutes);
}

export default function TaskCreateDialog({ open, onOpenChange, onSaved, context }: TaskCreateDialogProps) {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [form, setForm] = useState<TaskCreateFormState>(() => defaultTaskCreateForm(context));
  const [saving, setSaving] = useState(false);
  const [topicContactOptions, setTopicContactOptions] = useState<TopicContactOption[]>([]);

  useEffect(() => {
    if (open) setForm(defaultTaskCreateForm(context));
  }, [open, context?.recordType, context?.recordId, context?.recordLabel, context?.leadId, context?.caseId, context?.clientId]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    Promise.all([
      fetchLeadsFromSupabase(),
      fetchCasesFromSupabase(),
      fetchClientsFromSupabase(),
    ])
      .then(([leads, cases, clients]) => {
        if (cancelled) return;
        setTopicContactOptions(buildTopicContactOptions({
          leads: Array.isArray(leads) ? leads as any[] : [],
          cases: Array.isArray(cases) ? cases as any[] : [],
          clients: Array.isArray(clients) ? clients as any[] : [],
        }));
      })
      .catch((error) => {
        console.warn('TASK_CREATE_DIALOG_STAGE170_RELATION_OPTIONS_FAILED', error);
        if (!cancelled) setTopicContactOptions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const selectedTaskRelationOption = useMemo(
    () => findTopicContactOption(topicContactOptions, {
      leadId: form.leadId || context?.leadId || null,
      caseId: form.caseId || context?.caseId || null,
      clientId: form.clientId || context?.clientId || null,
    }),
    [topicContactOptions, form.leadId, form.caseId, form.clientId, context?.leadId, context?.caseId, context?.clientId],
  );

  const handleSelectTaskRelation = (option: TopicContactOption | null) => {
    const relation = resolveTopicContactLink(option);
    setForm((prev) => ({
      ...prev,
      relationQuery: option?.label || '',
      leadId: relation.leadId || '',
      caseId: relation.caseId || '',
      clientId: relation.clientId || '',
    }));
  };

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
      const relation = resolveTopicContactLink(selectedTaskRelationOption);

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
        leadId: relation.leadId || form.leadId || context?.leadId || undefined,
        caseId: relation.caseId || form.caseId || context?.caseId || undefined,
        clientId: relation.clientId || form.clientId || context?.clientId || undefined,
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
        data-task-create-dialog-stage170="true"
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
          data-task-create-dialog-stage170="true"
        >
          <div className="event-form-field">
            <Label>Tytuł</Label>
            <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Co trzeba zrobić?" />
          </div>
          <div data-task-create-dialog-relation-picker="true">
            <TopicContactPicker
              options={topicContactOptions}
              selectedOption={selectedTaskRelationOption}
              query={form.relationQuery}
              onQueryChange={(value) => setForm((prev) => ({ ...prev, relationQuery: value, leadId: '', caseId: '', clientId: '' }))}
              onSelect={handleSelectTaskRelation}
              label="Powiąż z leadem, klientem albo sprawą"
              placeholder="Wpisz lead, klienta, sprawę, e-mail lub telefon"
            />
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
