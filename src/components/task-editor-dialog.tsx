import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { LeadPicker, type LeadPickerOption } from './lead-picker';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TASK_TYPES, toDateTimeLocalValue, type EditableTaskRecord } from '../lib/tasks';
import type { RecurrenceEndType, RecurrenceRule } from '../lib/scheduling';
import '../styles/visual-stage21-task-form-vnext.css';

type TaskEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: EditableTaskRecord | null;
  leads: LeadPickerOption[];
  onSave: (payload: {
    id: string;
    title: string;
    type: string;
    date: string;
    priority: string;
    reminderAt: string | null;
    recurrenceRule: RecurrenceRule;
    recurrenceEndType: RecurrenceEndType;
    recurrenceEndAt: string | null;
    recurrenceCount: number | null;
    leadId: string | null;
  }) => void | Promise<void>;
};

type TaskEditorState = {
  title: string;
  type: string;
  date: string;
  priority: string;
  reminderAt: string;
  recurrenceRule: RecurrenceRule;
  recurrenceEndType: RecurrenceEndType;
  recurrenceEndAt: string;
  recurrenceCount: string;
  leadId: string;
  leadSearch: string;
};

function createEditorState(task: EditableTaskRecord | null): TaskEditorState {
  return {
    title: task?.title || '',
    type: task?.type || 'follow_up',
    date: task?.date || '',
    priority: task?.priority || 'medium',
    reminderAt: toDateTimeLocalValue(task?.reminderAt),
    recurrenceRule: (task?.recurrenceRule || 'none') as RecurrenceRule,
    recurrenceEndType: (task?.recurrenceEndType || 'never') as RecurrenceEndType,
    recurrenceEndAt: task?.recurrenceEndAt || '',
    recurrenceCount: task?.recurrenceCount ? String(task.recurrenceCount) : '5',
    leadId: task?.leadId || '',
    leadSearch: task?.leadName || '',
  };
}

export function TaskEditorDialog({ open, onOpenChange, task, leads, onSave }: TaskEditorDialogProps) {
  const [state, setState] = useState<TaskEditorState>(() => createEditorState(task));

  useEffect(() => {
    if (open) {
      setState(createEditorState(task));
    }
  }, [open, task]);

  const dialogDescription = useMemo(
    () => 'Popraw tytuł, termin, priorytet i powiązanie zadania. Zapis od razu odświeży listę i kalendarz.',
    [],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!task) return;

    if (!state.title.trim()) {
      return;
    }

    void onSave({
      id: task.id,
      title: state.title.trim(),
      type: state.type,
      date: state.date,
      priority: state.priority,
      reminderAt: state.reminderAt || null,
      recurrenceRule: state.recurrenceRule,
      recurrenceEndType: state.recurrenceEndType,
      recurrenceEndAt: state.recurrenceEndAt || null,
      recurrenceCount: state.recurrenceEndType === 'count' ? Number(state.recurrenceCount) || null : null,
      leadId: state.leadId || null,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="task-form-vnext-content"
        data-task-form-stage21="true"
        aria-describedby="task-editor-stage21-description"
      >
        <DialogHeader className="task-form-vnext-header">
          <div className="task-form-vnext-title-block">
            <span className="task-form-vnext-kicker">ZADANIE</span>
            <DialogTitle>Edytuj zadanie</DialogTitle>
            <DialogDescription id="task-editor-stage21-description">{dialogDescription}</DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="task-form-vnext" data-task-form-visual-rebuild="TASK_FORM_VISUAL_REBUILD_STAGE21">
          <section className="task-form-section">
            <div className="task-form-section-head">
              <h3>Podstawy</h3>
              <p>Co trzeba zrobić i do kiedy.</p>
            </div>

            <div className="task-form-grid task-form-grid-2">
              <div className="task-form-field task-form-field-wide">
                <Label>Tytuł</Label>
                <Input value={state.title} onChange={(event) => setState((prev) => ({ ...prev, title: event.target.value }))} required />
              </div>

              <div className="task-form-field">
                <Label>Typ</Label>
                <select
                  value={state.type}
                  onChange={(event) => setState((prev) => ({ ...prev, type: event.target.value }))}
                  className="task-form-select"
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="task-form-field">
                <Label>Termin</Label>
                <Input type="date" value={state.date} onChange={(event) => setState((prev) => ({ ...prev, date: event.target.value }))} required />
              </div>

              <div className="task-form-field">
                <Label>Priorytet</Label>
                <select
                  value={state.priority}
                  onChange={(event) => setState((prev) => ({ ...prev, priority: event.target.value }))}
                  className="task-form-select"
                >
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>

              <div className="task-form-field">
                <Label>Przypomnienie</Label>
                <Input type="datetime-local" value={state.reminderAt} onChange={(event) => setState((prev) => ({ ...prev, reminderAt: event.target.value }))} />
              </div>
            </div>
          </section>

          <section className="task-form-section">
            <div className="task-form-section-head">
              <h3>Powiązanie</h3>
              <p>Wybierz leada, jeśli zadanie dotyczy konkretnego tematu sprzedażowego.</p>
            </div>

            <LeadPicker
              leads={leads}
              selectedLeadId={state.leadId || undefined}
              query={state.leadSearch}
              onQueryChange={(value) => setState((prev) => ({ ...prev, leadSearch: value, leadId: '' }))}
              onSelect={(lead) => setState((prev) => ({ ...prev, leadId: lead?.id || '', leadSearch: lead?.name || '' }))}
              label="Powiązanie"
            />
          </section>

          <details className="task-form-section task-form-details">
            <summary>Cykliczność</summary>

            <div className="task-form-grid task-form-grid-2">
              <div className="task-form-field">
                <Label>Cykliczność</Label>
                <select
                  value={state.recurrenceRule}
                  onChange={(event) => setState((prev) => ({ ...prev, recurrenceRule: event.target.value as RecurrenceRule }))}
                  className="task-form-select"
                >
                  <option value="none">Brak</option>
                  <option value="daily">Codziennie</option>
                  <option value="every_2_days">Co 2 dni</option>
                  <option value="weekly">Co tydzień</option>
                  <option value="monthly">Co miesiąc</option>
                  <option value="weekday">Dzień roboczy</option>
                </select>
              </div>

              <div className="task-form-field">
                <Label>Koniec cyklu</Label>
                <select
                  value={state.recurrenceEndType}
                  onChange={(event) => setState((prev) => ({ ...prev, recurrenceEndType: event.target.value as RecurrenceEndType }))}
                  className="task-form-select"
                >
                  <option value="never">Bez końca</option>
                  <option value="until_date">Do daty</option>
                  <option value="count">Liczba razy</option>
                </select>
              </div>

              {state.recurrenceEndType === 'until_date' ? (
                <div className="task-form-field">
                  <Label>Data końcowa</Label>
                  <Input type="date" value={state.recurrenceEndAt} onChange={(event) => setState((prev) => ({ ...prev, recurrenceEndAt: event.target.value }))} />
                </div>
              ) : null}

              {state.recurrenceEndType === 'count' ? (
                <div className="task-form-field">
                  <Label>Liczba powtórzeń</Label>
                  <Input type="number" min="1" value={state.recurrenceCount} onChange={(event) => setState((prev) => ({ ...prev, recurrenceCount: event.target.value }))} />
                </div>
              ) : null}
            </div>
          </details>

          <DialogFooter className="task-form-footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
            <Button type="submit">Zapisz zadanie</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
