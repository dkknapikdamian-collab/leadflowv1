import { useEffect, useRef, type KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import {
  CalendarActionIcon,
  FormFooter,
  SaveActionIcon,
  SemanticIcon,
  type SemanticIconRole,
} from '../ui-system';

export type LeadNextStepChoice = 'set_now' | 'remind_tomorrow' | 'without_step';

export type LeadNextStepAction = 'phone_call' | 'follow_up_email' | 'send_offer' | 'online_meeting';

export type LeadNextStepField = 'date' | 'time';

export type LeadNextStepPromptMode = 'interactive' | 'preview';

export type LeadNextStepSelection =
  | { kind: 'choice'; value: LeadNextStepChoice }
  | { kind: 'action'; value: LeadNextStepAction };

type ChoiceIcon = 'calendar-check' | Extract<SemanticIconRole, 'notification' | 'pause'>;
type SuggestedActionIconRole = Extract<SemanticIconRole, 'phone' | 'email' | 'note' | 'event'>;

type ChoiceOption = {
  value: LeadNextStepChoice;
  title: string;
  description: string;
  icon: ChoiceIcon;
  followUp?: string;
};

const CHOICE_OPTIONS: readonly ChoiceOption[] = [
  {
    value: 'set_now',
    title: 'Ustaw kolejny krok teraz',
    description: 'Wybierz kolejny krok i termin realizacji.',
    icon: 'calendar-check',
  },
  {
    value: 'remind_tomorrow',
    title: 'Przypomnij jutro',
    description: 'Przypomnij sobie o tym leadzie jutro.',
    icon: 'notification',
  },
  {
    value: 'without_step',
    title: 'Zostaw bez kroku',
    description: 'Lead trafi do listy „Bez kolejnego kroku”.',
    followUp: 'Możesz wrócić do niego później.',
    icon: 'pause',
  },
];

type SuggestedActionOption = {
  value: LeadNextStepAction;
  title: string;
  description: string;
  icon: SuggestedActionIconRole;
};

const SUGGESTED_ACTIONS: readonly SuggestedActionOption[] = [
  {
    value: 'phone_call',
    title: 'Rozmowa telefoniczna',
    description: 'Skontaktuj się z klientem',
    icon: 'phone',
  },
  {
    value: 'follow_up_email',
    title: 'Follow-up e-mail',
    description: 'Wyślij e-mail z follow-upem',
    icon: 'email',
  },
  {
    value: 'send_offer',
    title: 'Wyślij ofertę',
    description: 'Prześlij ofertę handlową',
    icon: 'note',
  },
  {
    value: 'online_meeting',
    title: 'Spotkanie online',
    description: 'Zaplanuj spotkanie',
    icon: 'event',
  },
];

export type LeadNextStepPromptProps = {
  open: boolean;
  mode: LeadNextStepPromptMode;
  id?: string;
  selectedChoice: LeadNextStepChoice | null;
  selectedAction: LeadNextStepAction | null;
  date: string;
  time: string;
  onClose: () => void;
  onChange: (field: LeadNextStepField, value: string) => void;
  onSelect: (selection: LeadNextStepSelection) => void;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  saveDisabled?: boolean;
  isSaving?: boolean;
  className?: string;
};

const DEFAULT_PROMPT_ID = 'forteca-frt-019-next-step';

export function LeadNextStepPrompt({
  open,
  mode,
  id,
  selectedChoice,
  selectedAction,
  date,
  time,
  onClose,
  onChange,
  onSelect,
  onSave,
  onCancel,
  saveDisabled = false,
  isSaving = false,
  className,
}: LeadNextStepPromptProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const promptId = id?.trim() || DEFAULT_PROMPT_ID;
  const titleId = `${promptId}-title`;
  const descriptionId = `${promptId}-description`;
  const scheduleHeadingId = `${promptId}-schedule-heading`;
  const suggestionsHeadingId = `${promptId}-suggestions-heading`;
  const isPreview = mode === 'preview';
  const saveIsDisabled = isPreview || saveDisabled || isSaving;

  function handleSave() {
    if (isPreview) return;
    void onSave();
  }

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape' || isSaving) return;
    event.preventDefault();
    event.stopPropagation();
    onClose();
  }

  return (
    <div
      ref={dialogRef}
      id={promptId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      className={cn('forteca-frt-019-next-step-prompt', className)}
      data-forteca-frt-019-next-step="true"
      data-forteca-frt-019-next-step-mode={mode}
      data-forteca-frt-019-next-step-choice={selectedChoice}
      data-forteca-frt-019-next-step-action={selectedAction || undefined}
      onKeyDown={handleKeyDown}
    >
      <div
        className="forteca-frt-019-next-step-prompt__backdrop"
        aria-hidden="true"
        onMouseDown={() => {
          if (!isSaving) onClose();
        }}
      />

      <div
        className="forteca-frt-019-next-step-prompt__surface"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="forteca-frt-019-next-step-prompt__header">
          <div className="forteca-frt-019-next-step-prompt__heading">
            <span className="forteca-frt-019-next-step-prompt__header-icon" aria-hidden="true">
              <CalendarActionIcon size="lg" className="forteca-frt-019-next-step-prompt__header-calendar" />
              <SemanticIcon role="task_status" size="sm" className="forteca-frt-019-next-step-prompt__header-check" />
            </span>
            <h1 id={titleId} className="forteca-frt-019-next-step-prompt__title">
              Ustaw kolejny krok
            </h1>
          </div>
          <IconButton
            icon="close"
            label="Zamknij"
            title="Zamknij"
            variant="ghost"
            className="forteca-frt-019-next-step-prompt__close"
            onClick={onClose}
            disabled={isSaving}
            data-forteca-frt-019-next-step-close="true"
          />
        </header>

        <main className="forteca-frt-019-next-step-prompt__content">
          <p id={descriptionId} className="forteca-frt-019-next-step-prompt__description">
            Ten lead jest nadal aktywny.
            <br />
            Nie zostawiaj go bez kolejnego ruchu – zaplanuj następny krok.
          </p>

          <section className="forteca-frt-019-next-step-prompt__choices" aria-label="Wybór kolejnego kroku">
            <div className="forteca-frt-019-next-step-prompt__choice-list" role="group" aria-label="Sposób obsługi kolejnego kroku">
              {CHOICE_OPTIONS.map((choice) => {
                const isSelected = selectedChoice === choice.value;
                return (
                  <Button
                    key={choice.value}
                    type="button"
                    variant="outline"
                    className={cn(
                      'forteca-frt-019-next-step-prompt__choice',
                      isSelected && 'forteca-frt-019-next-step-prompt__choice--selected',
                    )}
                    aria-pressed={isSelected}
                    data-forteca-frt-019-next-step-choice-option={choice.value}
                    onClick={() => onSelect({ kind: 'choice', value: choice.value })}
                    disabled={isSaving}
                  >
                    <span className="forteca-frt-019-next-step-prompt__choice-icon" aria-hidden="true">
                      {choice.icon === 'calendar-check' ? (
                        <>
                          <CalendarActionIcon size="lg" className="forteca-frt-019-next-step-prompt__choice-calendar" />
                          <SemanticIcon role="task_status" size="sm" className="forteca-frt-019-next-step-prompt__choice-check" />
                        </>
                      ) : (
                        <SemanticIcon role={choice.icon} size="lg" />
                      )}
                    </span>
                    <span className="forteca-frt-019-next-step-prompt__choice-copy">
                      <strong className="forteca-frt-019-next-step-prompt__choice-title">{choice.title}</strong>
                      <span className="forteca-frt-019-next-step-prompt__choice-description">{choice.description}</span>
                      {choice.followUp ? (
                        <span className="forteca-frt-019-next-step-prompt__choice-follow-up">{choice.followUp}</span>
                      ) : null}
                    </span>
                  </Button>
                );
              })}
            </div>
          </section>

          {selectedChoice === 'set_now' ? (
            <section
              className="forteca-frt-019-next-step-prompt__schedule"
              aria-labelledby={scheduleHeadingId}
              data-forteca-frt-019-next-step-schedule="true"
            >
              <h2 id={scheduleHeadingId} className="forteca-frt-019-next-step-prompt__section-title">
                Termin realizacji
              </h2>
              <div className="forteca-frt-019-next-step-prompt__schedule-fields">
                <label className="forteca-frt-019-next-step-prompt__field">
                  <span className="forteca-frt-019-next-step-prompt__field-label">Data</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => onChange('date', event.target.value)}
                    disabled={isSaving}
                    aria-required="true"
                    className="forteca-frt-019-next-step-prompt__input"
                  />
                </label>
                <label className="forteca-frt-019-next-step-prompt__field">
                  <span className="forteca-frt-019-next-step-prompt__field-label">Godzina</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => onChange('time', event.target.value)}
                    disabled={isSaving}
                    aria-required="true"
                    className="forteca-frt-019-next-step-prompt__input"
                  />
                </label>
              </div>
            </section>
          ) : null}

          <section
            className="forteca-frt-019-next-step-prompt__suggestions"
            aria-labelledby={suggestionsHeadingId}
          >
            <h2 id={suggestionsHeadingId} className="forteca-frt-019-next-step-prompt__section-title">
              Sugerowane kolejne kroki
            </h2>
            <div className="forteca-frt-019-next-step-prompt__suggestion-list" role="group" aria-label="Sugerowane kolejne kroki">
              {SUGGESTED_ACTIONS.map((action) => {
                const isSelected = selectedAction === action.value;
                return (
                  <Button
                    key={action.value}
                    type="button"
                    variant="outline"
                    className={cn(
                      'forteca-frt-019-next-step-prompt__suggestion',
                      isSelected && 'forteca-frt-019-next-step-prompt__suggestion--selected',
                    )}
                    aria-pressed={isSelected}
                    data-forteca-frt-019-next-step-suggestion={action.value}
                    onClick={() => onSelect({ kind: 'action', value: action.value })}
                    disabled={isSaving}
                  >
                    <SemanticIcon
                      role={action.icon}
                      tone={action.value === 'phone_call' ? 'task' : 'primary'}
                      size="md"
                    />
                    <span className="forteca-frt-019-next-step-prompt__suggestion-copy">
                      <strong className="forteca-frt-019-next-step-prompt__suggestion-title">{action.title}</strong>
                      <span className="forteca-frt-019-next-step-prompt__suggestion-description">{action.description}</span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </section>

          <p className="forteca-frt-019-next-step-prompt__information" data-forteca-frt-019-next-step-information="true">
            <SemanticIcon role="hint" size="sm" />
            <span>Lead bez ustawionego kolejnego kroku pojawi się w widoku „Bez kolejnego kroku”.</span>
          </p>
        </main>

        <FormFooter
          className="forteca-frt-019-next-step-prompt__footer"
          cancel={(
            <Button
              type="button"
              variant="outline"
              className="forteca-frt-019-next-step-prompt__cancel"
              onClick={onCancel}
              disabled={isSaving}
              data-forteca-frt-019-next-step-cancel="true"
            >
              Anuluj
            </Button>
          )}
          submit={(
            <Button
              type="button"
              className="forteca-frt-019-next-step-prompt__save"
              onClick={handleSave}
              disabled={saveIsDisabled}
              aria-busy={isSaving}
              data-forteca-frt-019-next-step-save="true"
            >
              {isSaving ? <SemanticIcon role="loading" size="sm" /> : <SaveActionIcon size="sm" />}
              {isSaving ? 'Zapisywanie…' : 'Zapisz'}
            </Button>
          )}
        />
      </div>
    </div>
  );
}
