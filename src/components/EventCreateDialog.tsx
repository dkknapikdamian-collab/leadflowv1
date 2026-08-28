import { type FormEvent, useEffect, useState } from 'react';
import { CalendarDays, ChevronDown, Clock3, Loader2, MapPin, MonitorUp, Phone } from 'lucide-react';
import {
  toast
} from 'sonner';
import {
  Button
} from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import {
  Input
} from './ui/input';
import {
  Label
} from './ui/label';
import {
  Textarea
} from './ui/textarea';
import {
  AppIcon
} from './ui/icon';
import {
  useWorkspace
} from '../hooks/useWorkspace';
import {
  EVENT_TYPES,
  RECURRENCE_OPTIONS,
  REMINDER_MODE_OPTIONS,
  REMINDER_OFFSET_OPTIONS
} from '../lib/options';
import {
  buildStartEndPair,
  toDateTimeLocalValue
} from '../lib/scheduling';
import {
  normalizeCloseFlowDateTimeToUtcIso,
  localDateTimeInputToReminderUtcIso,
} from '../lib/calendar-timezone-contract';
import {
  fetchLeadByIdFromSupabase,
  insertEventToSupabase
} from '../lib/supabase-fallback';
import {
  requireWorkspaceId
} from '../lib/workspace-context';
import type {
  TaskCreateDialogContext
} from './TaskCreateDialog';

const STAGE85_EVENT_CREATE_DIALOG_SHARED = 'Shared event create dialog for global and detail context actions';
const CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR = 'event create dialog readable save footer repair';
void CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR;

type FortecaMeetingMode = 'online' | 'phone' | 'in_person';

type EventCreateFormState = {
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  status: string;
  recurrenceMode: string;
  reminderMode: string;
  reminderOffsetMinutes: number;
  meetingMode: FortecaMeetingMode;
  note: string;
};

type LeadParticipant = {
  label: string;
  detail: string;
  initials: string;
};

type EventCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (
    createdEvent: Awaited<ReturnType<typeof insertEventToSupabase>>,
  ) => void | Promise<void>;
  context?: TaskCreateDialogContext;
};

const FRT016_REMINDER_OPTIONS = [
  { value: 'none', label: 'Brak', mode: 'none', offsetMinutes: 0 },
  { value: '15', label: '15 minut wcześniej', mode: 'once', offsetMinutes: 15 },
  { value: '30', label: '30 minut wcześniej', mode: 'once', offsetMinutes: 30 },
  { value: '60', label: '1 godzinę wcześniej', mode: 'once', offsetMinutes: 60 },
  { value: '1440', label: '1 dzień wcześniej', mode: 'once', offsetMinutes: 1440 },
] as const;

const FRT016_RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Jednorazowe' },
  { value: 'daily', label: 'Codziennie' },
  { value: 'weekly', label: 'Co tydzień' },
  { value: 'monthly', label: 'Co miesiąc' },
] as const;

const FRT016_MEETING_MODES: Array<{
  value: FortecaMeetingMode;
  label: string;
  type: string;
  icon: typeof MonitorUp;
}> = [
  { value: 'online', label: 'Online', type: 'meeting', icon: MonitorUp },
  { value: 'phone', label: 'Telefon', type: 'phone_call', icon: Phone },
  { value: 'in_person', label: 'Na miejscu', type: 'meeting', icon: MapPin },
];

function isFortecaLeadEventContext(context?: TaskCreateDialogContext) {
  return context?.recordType === 'lead';
}

function defaultEventCreateForm(context?: TaskCreateDialogContext): EventCreateFormState {
  const pair = buildStartEndPair(toDateTimeLocalValue(new Date()));
  const leadScoped = isFortecaLeadEventContext(context);
  return {
    title: '',
    type: 'meeting',
    startAt: pair.startAt,
    endAt: pair.endAt,
    status: 'scheduled',
    recurrenceMode: 'none',
    reminderMode: leadScoped ? 'once' : 'none',
    reminderOffsetMinutes: leadScoped ? 15 : 60,
    meetingMode: 'online',
    note: '',
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
  return localDateTimeInputToReminderUtcIso(startAt, reminderOffsetMinutes) || undefined;
}

function initialsFor(value: string) {
  const initials = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  return initials || 'L';
}

function fallbackLeadParticipant(label?: string): LeadParticipant {
  const safeLabel = label?.trim() || 'Lead';
  return {
    label: safeLabel,
    detail: 'Powiązany lead',
    initials: initialsFor(safeLabel),
  };
}

function formatWeekday(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const weekday = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' }).format(date);
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function datePart(value: string) {
  return value.split('T')[0] || '';
}

function timePart(value: string) {
  return value.split('T')[1]?.slice(0, 5) || '';
}

function replaceDate(value: string, nextDate: string) {
  return `${nextDate}T${timePart(value) || '09:00'}`;
}

function replaceTime(value: string, nextTime: string) {
  return `${datePart(value)}T${nextTime}`;
}

function buildEventDescription(note: string) {
  const cleanNote = note.trim();
  return cleanNote || undefined;
}

function normalizeEventDateTime(value: string) {
  return normalizeCloseFlowDateTimeToUtcIso(value) || value;
}

export default function EventCreateDialog({ open, onOpenChange, onSaved, context }: EventCreateDialogProps) {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const isFortecaLeadEvent = isFortecaLeadEventContext(context);
  const [form, setForm] = useState<EventCreateFormState>(() => defaultEventCreateForm(context));
  const [saving, setSaving] = useState(false);
  const [leadParticipant, setLeadParticipant] = useState<LeadParticipant | null>(null);

  useEffect(() => {
    if (open) setForm(defaultEventCreateForm(context));
  }, [open, context?.recordType, context?.recordId, context?.recordLabel]);

  useEffect(() => {
    if (!open || !isFortecaLeadEvent || !context?.leadId) {
      setLeadParticipant(null);
      return;
    }

    let cancelled = false;
    setLeadParticipant(fallbackLeadParticipant(context.recordLabel));

    void fetchLeadByIdFromSupabase(context.leadId)
      .then((lead) => {
        if (cancelled) return;
        const label = lead.name?.trim() || lead.company?.trim() || context.recordLabel?.trim() || 'Lead';
        const detail = [lead.company?.trim(), lead.email?.trim() || lead.phone?.trim()]
          .filter(Boolean)
          .join(' · ');
        setLeadParticipant({
          label,
          detail: detail || 'Powiązany lead',
          initials: initialsFor(label),
        });
      })
      .catch(() => {
        // The relation chip remains grounded in the supplied Lead Detail context.
      });

    return () => {
      cancelled = true;
    };
  }, [open, isFortecaLeadEvent, context?.leadId, context?.recordLabel]);

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
      const eventPayload = {
        title: form.title.trim(),
        type: form.type || 'meeting',
        startAt: normalizeEventDateTime(form.startAt),
        scheduledAt: normalizeEventDateTime(form.startAt),
        endAt: normalizeEventDateTime(form.endAt),
        status: form.status || 'scheduled',
        reminderAt: calculateReminderAt(form.startAt, form.reminderMode, form.reminderOffsetMinutes),
        recurrenceRule: buildRecurrenceRule(form.recurrenceMode),
        leadId: context?.leadId || undefined,
        caseId: context?.caseId || undefined,
        clientId: context?.clientId || undefined,
        workspaceId,
        ...(isFortecaLeadEvent ? { description: buildEventDescription(form.note) } : {}),
      };
      const createdEvent = await insertEventToSupabase(eventPayload);
      toast.success('Wydarzenie dodane');
      onOpenChange(false);
      setForm(defaultEventCreateForm(context));
      await onSaved?.(createdEvent);
    } catch {
      toast.error('Nie udało się zapisać wydarzenia.');
    } finally {
      setSaving(false);
    }
  };

  const participant = leadParticipant || fallbackLeadParticipant(context?.recordLabel);
  const selectedReminder = form.reminderMode === 'none' ? 'none' : String(form.reminderOffsetMinutes);

  if (isFortecaLeadEvent) {
    return (
      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
        <DialogContent
          className="forteca-frt-016-dialog"
          data-forteca-frt-016-lead-event="true"
          aria-describedby="forteca-frt-016-description"
        >
          <DialogHeader className="forteca-frt-016-header">
            <DialogTitle>Zaplanuj spotkanie</DialogTitle>
          </DialogHeader>
          <DialogDescription id="forteca-frt-016-description" className="sr-only">
            Formularz planowania spotkania powiązanego z wybranym leadem.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="forteca-frt-016-form" data-forteca-frt-016-form="true">
            <div className="forteca-frt-016-scroll-area">
              <div className="forteca-frt-016-field">
                <Label htmlFor="forteca-frt-016-title">Tytuł</Label>
                <Input
                  id="forteca-frt-016-title"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Wpisz tytuł spotkania"
                  required
                />
              </div>

              <div className="forteca-frt-016-field">
                <Label>Typ spotkania</Label>
                <div className="forteca-frt-016-meeting-modes" role="group" aria-label="Typ spotkania">
                  {FRT016_MEETING_MODES.map(({ value, label, type, icon: ModeIcon }) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      className="forteca-frt-016-meeting-mode"
                      data-forteca-frt-016-meeting-mode={value}
                      data-selected={form.meetingMode === value ? 'true' : 'false'}
                      aria-pressed={form.meetingMode === value}
                      onClick={() => setForm((prev) => ({ ...prev, meetingMode: value, type }))}
                    >
                      <ModeIcon aria-hidden="true" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="forteca-frt-016-grid-row">
                <div className="forteca-frt-016-field">
                  <Label htmlFor="forteca-frt-016-date">Data</Label>
                  <div className="forteca-frt-016-date-control">
                    <CalendarDays aria-hidden="true" />
                    <Input
                      id="forteca-frt-016-date"
                      type="date"
                      value={datePart(form.startAt)}
                      onChange={(event) => setForm((prev) => ({
                        ...prev,
                        startAt: replaceDate(prev.startAt, event.target.value),
                        endAt: replaceDate(prev.endAt, event.target.value),
                      }))}
                      aria-label="Data spotkania"
                    />
                    <span aria-hidden="true">{formatDate(form.startAt)}</span>
                  </div>
                </div>
                <div className="forteca-frt-016-field">
                  <Label htmlFor="forteca-frt-016-weekday">Dzień tygodnia</Label>
                  <Input id="forteca-frt-016-weekday" value={formatWeekday(form.startAt)} readOnly aria-readonly="true" />
                </div>
              </div>

              <div className="forteca-frt-016-grid-row">
                <div className="forteca-frt-016-field">
                  <Label htmlFor="forteca-frt-016-start-time">Godzina rozpoczęcia</Label>
                  <div className="forteca-frt-016-time-control">
                    <Clock3 aria-hidden="true" />
                    <Input
                      id="forteca-frt-016-start-time"
                      type="time"
                      value={timePart(form.startAt)}
                      onChange={(event) => setForm((prev) => {
                        const nextStartAt = replaceTime(prev.startAt, event.target.value);
                        return { ...prev, startAt: nextStartAt, endAt: buildStartEndPair(nextStartAt).endAt };
                      })}
                      aria-label="Godzina rozpoczęcia"
                    />
                    <span aria-hidden="true">{timePart(form.startAt)}</span>
                  </div>
                </div>
                <div className="forteca-frt-016-field">
                  <Label htmlFor="forteca-frt-016-end-time">Godzina zakończenia</Label>
                  <div className="forteca-frt-016-time-control">
                    <Clock3 aria-hidden="true" />
                    <Input
                      id="forteca-frt-016-end-time"
                      type="time"
                      value={timePart(form.endAt)}
                      onChange={(event) => setForm((prev) => ({ ...prev, endAt: replaceTime(prev.endAt, event.target.value) }))}
                      aria-label="Godzina zakończenia"
                    />
                    <span aria-hidden="true">{timePart(form.endAt)}</span>
                  </div>
                </div>
              </div>

              <div className="forteca-frt-016-readonly-field" data-forteca-frt-016-capability="location-not-persisted">
                <Label>Lokalizacja / link online</Label>
                <p>Brak zapisu lokalizacji i linku w bieżącym kontrakcie wydarzenia.</p>
              </div>

              <div className="forteca-frt-016-field">
                <Label>Uczestnicy</Label>
                <div className="forteca-frt-016-participants" data-forteca-frt-016-relation="true" data-forteca-frt-016-relation-kind="lead">
                  <div className="forteca-frt-016-participant" aria-label={`Powiązany lead: ${participant.label}`}>
                    <span className="forteca-frt-016-participant-avatar" aria-hidden="true">{participant.initials}</span>
                    <span className="forteca-frt-016-participant-copy">
                      <strong>{participant.label}</strong>
                      <small>{participant.detail}</small>
                    </span>
                  </div>
                </div>
              </div>

              <div className="forteca-frt-016-field">
                <Label htmlFor="forteca-frt-016-note">Notatka</Label>
                <Textarea
                  id="forteca-frt-016-note"
                  value={form.note}
                  onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                  placeholder="Dodaj notatkę do spotkania"
                  rows={3}
                />
              </div>

              <div className="forteca-frt-016-grid-row">
                <div className="forteca-frt-016-field">
                  <Label htmlFor="forteca-frt-016-reminder">Przypomnienie</Label>
                  <div className="forteca-frt-016-select-field">
                    <select
                      id="forteca-frt-016-reminder"
                      value={selectedReminder}
                      onChange={(event) => {
                        const option = FRT016_REMINDER_OPTIONS.find((candidate) => candidate.value === event.target.value);
                        setForm((prev) => ({
                          ...prev,
                          reminderMode: option?.mode || 'none',
                          reminderOffsetMinutes: option?.offsetMinutes || 15,
                        }));
                      }}
                    >
                      {FRT016_REMINDER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </div>
                </div>
                <div className="forteca-frt-016-field">
                  <Label htmlFor="forteca-frt-016-recurrence">Cykliczność</Label>
                  <div className="forteca-frt-016-select-field">
                    <select
                      id="forteca-frt-016-recurrence"
                      value={form.recurrenceMode}
                      onChange={(event) => setForm((prev) => ({ ...prev, recurrenceMode: event.target.value }))}
                    >
                      {FRT016_RECURRENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="forteca-frt-016-footer">
              <Button type="button" variant="outline" data-forteca-frt-016-cancel="true" onClick={closeDialog} disabled={saving}>Anuluj</Button>
              <Button type="submit" data-forteca-frt-016-save="true" disabled={saving || workspaceLoading}>
                {saving ? <Loader2 className="forteca-frt-016-button-loader" aria-hidden="true" /> : <AppIcon name="calendar" aria-hidden="true" />}
                Dodaj do kalendarza
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
      <DialogContent className="max-w-2xl event-form-vnext-content closeflow-event-modal-readable" data-event-create-dialog-stage85="true" data-event-create-dialog-stage22b="true" data-a1-event-modal-readable-finalizer="true">
        <DialogHeader className="event-form-vnext-header">
          <DialogTitle>Nowe wydarzenie</DialogTitle>
        </DialogHeader>
        {context?.recordLabel ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900" data-stage85-context-relation="true">
            Powiązanie: {context.recordLabel}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="event-form-vnext space-y-4">
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
          <DialogFooter className="event-form-footer" data-event-modal-save-footer="true">
            <Button type="button" variant="outline" onClick={closeDialog} disabled={saving}>Anuluj</Button>
            <Button type="submit" disabled={saving || workspaceLoading}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Zapisz wydarzenie</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
