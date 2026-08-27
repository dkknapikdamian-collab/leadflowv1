import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TopicContactPicker } from './topic-contact-picker';
import { modalFooterClass } from './entity-actions';
import { useWorkspace } from '../hooks/useWorkspace';
import { RECURRENCE_OPTIONS, REMINDER_MODE_OPTIONS, TASK_TYPES, PRIORITY_OPTIONS } from '../lib/options';
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
import '../styles/closeflow-event-form.css';

type TaskCreateFormState = {
  title: string;
  type: string;
  dueAt: string;
  priority: string;
  status: string;
  recurrence: string;
  recurrenceCustomRule: string;
  reminderChoice: string;
  reminderCustomAt: string;
  description: string;
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
const taskCreateDialogFooterClass = `${modalFooterClass('event-form-footer')} forteca-frt-014-footer`;

const FRT014_RECURRENCE_OPTIONS = [
  ...RECURRENCE_OPTIONS.filter((option) => option.value !== 'monthly'),
  { value: 'custom', label: 'Niestandardowa' },
];

const FRT014_REMINDER_OPTIONS = [
  { value: '10', label: '10 min' },
  { value: '30', label: '30 min' },
  { value: '60', label: '1 godz.' },
  { value: '1440', label: '1 dzień wcześniej' },
  { value: 'all_day', label: 'Cały dzień' },
  { value: 'custom', label: 'Niestandardowe' },
  { value: 'none', label: REMINDER_MODE_OPTIONS.find((option) => option.value === 'none')?.label || 'Brak' },
] as const;

type TaskCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (
    createdTask: Awaited<ReturnType<typeof insertTaskToSupabase>>,
  ) => void | Promise<void>;
  context?: TaskCreateDialogContext;
};

function defaultTaskCreateForm(context?: TaskCreateDialogContext): TaskCreateFormState {
  return {
    title: '',
    type: '',
    dueAt: toDateTimeLocalValue(new Date()),
    priority: '',
    status: 'todo',
    recurrence: 'none',
    recurrenceCustomRule: '',
    reminderChoice: '10',
    reminderCustomAt: '',
    description: '',
    relationQuery: context?.recordLabel || '',
    leadId: context?.leadId || '',
    caseId: context?.caseId || '',
    clientId: context?.clientId || '',
  };
}

function calculateReminderAt(dueAt: string, reminderChoice: string, reminderCustomAt: string) {
  if (reminderChoice === 'none') return null;
  if (reminderChoice === 'custom') {
    return reminderCustomAt ? localDateTimeInputToReminderUtcIso(reminderCustomAt, 0) : null;
  }
  if (reminderChoice === 'all_day') {
    return localDateTimeInputToReminderUtcIso(`${dueAt.slice(0, 10)}T09:00`, 0);
  }
  return localDateTimeInputToReminderUtcIso(dueAt, Number(reminderChoice));
}

function resolveRecurrenceRule(recurrence: string, customRule: string) {
  if (recurrence === 'daily') return 'FREQ=DAILY';
  if (recurrence === 'weekly') return 'FREQ=WEEKLY';
  if (recurrence === 'custom') return customRule.trim();
  return 'none';
}

function replaceTaskDateTimePart(value: string, part: 'date' | 'time', nextValue: string) {
  const [date = '', time = ''] = value.split('T');
  return part === 'date'
    ? `${nextValue}T${time}`
    : `${date}T${nextValue}`;
}

function formatTaskDateForDisplay(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return value.slice(0, 10);

  const weekday = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' }).format(new Date(year, month - 1, day));
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year} (${weekday})`;
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
    if (!form.type) return toast.error('Wybierz typ zadania.');
    if (!form.dueAt.slice(0, 10) || !form.dueAt.slice(11, 16)) return toast.error('Uzupełnij termin i godzinę.');
    if (!form.priority) return toast.error('Wybierz priorytet.');
    if (form.recurrence === 'custom' && !form.recurrenceCustomRule.trim()) return toast.error('Podaj własną regułę cykliczności.');
    if (form.reminderChoice === 'custom' && !form.reminderCustomAt) return toast.error('Uzupełnij własny termin przypomnienia.');

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) return toast.error('Kontekst workspace nie jest jeszcze gotowy.');

    setSaving(true);
    try {
      const relation = resolveTopicContactLink(selectedTaskRelationOption);

      const createdTask = await insertTaskToSupabase({
        title: form.title.trim(),
        type: form.type,
        date: form.dueAt.slice(0, 10),
        scheduledAt: form.dueAt,
        dueAt: form.dueAt,
        priority: form.priority,
        status: form.status,
        description: form.description.trim(),
        reminderAt: calculateReminderAt(form.dueAt, form.reminderChoice, form.reminderCustomAt),
        recurrenceRule: resolveRecurrenceRule(form.recurrence, form.recurrenceCustomRule),
        leadId: relation.leadId || form.leadId || undefined,
        caseId: relation.caseId || form.caseId || undefined,
        clientId: relation.clientId || form.clientId || undefined,
        workspaceId,
      });
      toast.success('Zadanie dodane');
      onOpenChange(false);
      setForm(defaultTaskCreateForm(context));
      await onSaved?.(createdTask);
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
        data-task-create-dialog-layout="true"
        data-task-create-dialog-stage105="event-form-vnext"
        data-task-create-dialog-form="true"
        data-event-form-stage22="true"
        data-forteca-frt-014-lead-task="true"
      >
        <DialogHeader className="forteca-frt-014-header">
          <DialogTitle>Dodaj zadanie</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Formularz dodawania zadania powiązanego z leadem.
        </DialogDescription>
        <form
          onSubmit={handleSubmit}
          className="event-form-vnext"
          data-calendar-entry-form-source={TASK_CREATE_DIALOG_STAGE105_FORM_SOURCE}
          data-calendar-entry-form-mode="quick-task"
          data-task-create-dialog-stage105="event-form-vnext"
          data-task-create-dialog-form="true"
          data-forteca-frt-014-form="true"
        >
          <div className="forteca-frt-014-scroll">
            <div className="forteca-frt-014-fields">
              <div className="event-form-field forteca-frt-014-field">
                <Label htmlFor="forteca-frt-014-title">Tytuł zadania <span aria-hidden="true">*</span></Label>
                <Input id="forteca-frt-014-title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Wpisz tytuł zadania" required />
              </div>
              <div className="event-form-field forteca-frt-014-field" data-task-create-dialog-relation-picker="true">
                <TopicContactPicker
                  options={topicContactOptions}
                  selectedOption={selectedTaskRelationOption}
                  query={form.relationQuery}
                  onQueryChange={(value) => setForm((prev) => ({ ...prev, relationQuery: value, leadId: '', caseId: '', clientId: '' }))}
                  onSelect={handleSelectTaskRelation}
                  label="Powiązane z leadem"
                  placeholder="Wybierz leada"
                  appearance="forteca-select"
                />
              </div>
              <div className="event-form-field forteca-frt-014-field">
                <Label htmlFor="forteca-frt-014-type">Typ <span aria-hidden="true">*</span></Label>
                <div className="forteca-frt-014-select-control">
                  <select id="forteca-frt-014-type" className="event-form-select" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} required>
                    <option value="" disabled>Wybierz typ zadania</option>
                    {TASK_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="forteca-frt-014-select-icon" />
                </div>
              </div>
              <div className="forteca-frt-014-date-time-grid">
                <div className="event-form-field forteca-frt-014-field">
                  <Label htmlFor="forteca-frt-014-date">Termin <span aria-hidden="true">*</span></Label>
                  <div className="forteca-frt-014-date-control">
                    <Input id="forteca-frt-014-date" className="forteca-frt-014-date-input" type="date" value={form.dueAt.slice(0, 10)} onChange={(event) => setForm((prev) => ({ ...prev, dueAt: replaceTaskDateTimePart(prev.dueAt, 'date', event.target.value) }))} required />
                    <span className="forteca-frt-014-date-display" aria-hidden="true">{formatTaskDateForDisplay(form.dueAt)}</span>
                    <CalendarDays aria-hidden="true" className="forteca-frt-014-date-icon" />
                  </div>
                </div>
                <div className="event-form-field forteca-frt-014-field">
                  <Label htmlFor="forteca-frt-014-time">Godzina <span aria-hidden="true">*</span></Label>
                  <div className="forteca-frt-014-time-control">
                    <Input id="forteca-frt-014-time" className="forteca-frt-014-time-input" type="time" value={form.dueAt.slice(11, 16)} onChange={(event) => setForm((prev) => ({ ...prev, dueAt: replaceTaskDateTimePart(prev.dueAt, 'time', event.target.value) }))} required />
                    <span className="forteca-frt-014-time-display" aria-hidden="true">{form.dueAt.slice(11, 16)}</span>
                    <ChevronDown aria-hidden="true" className="forteca-frt-014-time-icon" />
                  </div>
                </div>
              </div>
              <div className="event-form-field forteca-frt-014-field">
                <Label htmlFor="forteca-frt-014-priority">Priorytet <span aria-hidden="true">*</span></Label>
                <div className="forteca-frt-014-select-control">
                  <select id="forteca-frt-014-priority" className="event-form-select" value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))} required>
                    <option value="" disabled>Wybierz priorytet</option>
                    {PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="forteca-frt-014-select-icon" />
                </div>
              </div>
              <div className="event-form-field forteca-frt-014-field">
                <Label htmlFor="forteca-frt-014-recurrence">Cykliczność</Label>
                <div className="forteca-frt-014-select-control">
                  <select id="forteca-frt-014-recurrence" className="event-form-select" value={form.recurrence} onChange={(event) => setForm((prev) => ({ ...prev, recurrence: event.target.value }))}>
                    {FRT014_RECURRENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="forteca-frt-014-select-icon" />
                </div>
                {form.recurrence === 'custom' ? (
                  <Input value={form.recurrenceCustomRule} onChange={(event) => setForm((prev) => ({ ...prev, recurrenceCustomRule: event.target.value }))} placeholder="np. FREQ=MONTHLY;BYDAY=MO" aria-label="Własna reguła cykliczności" required />
                ) : null}
              </div>
              <div className="event-form-field forteca-frt-014-field">
                <Label htmlFor="forteca-frt-014-reminder">Przypomnienie</Label>
                <div className="forteca-frt-014-select-control">
                  <select id="forteca-frt-014-reminder" className="event-form-select" value={form.reminderChoice} onChange={(event) => setForm((prev) => ({ ...prev, reminderChoice: event.target.value }))}>
                    {FRT014_REMINDER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="forteca-frt-014-select-icon" />
                </div>
                {form.reminderChoice === 'custom' ? (
                  <Input type="datetime-local" value={form.reminderCustomAt} onChange={(event) => setForm((prev) => ({ ...prev, reminderCustomAt: event.target.value }))} aria-label="Własny termin przypomnienia" required />
                ) : null}
              </div>
              <div className="event-form-field forteca-frt-014-field">
                <Label htmlFor="forteca-frt-014-description">Notatka</Label>
                <textarea id="forteca-frt-014-description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Dodaj notatkę do zadania..." maxLength={4000} />
              </div>
              <input type="hidden" name="status" value={form.status} data-forteca-frt-014-status="todo" />
            </div>
          </div>
          <DialogFooter className={taskCreateDialogFooterClass}>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
            <Button type="submit" disabled={saving || workspaceLoading}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Dodaj zadanie</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
