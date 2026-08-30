import { useEffect, useRef, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { IconButton } from './ui/icon-button';
import {
  AddActionIcon,
  CalendarActionIcon,
  EntityIcon,
  SemanticIcon,
} from './ui-system';

export type LeadStartServiceDraft = {
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: string;
  serviceType: string;
  checklistTemplate: string;
  checklistTaskCount?: number | string;
  value: string;
  currency: string;
  owner: string;
  ownerId?: string;
  startDate: string;
  clientPortal: boolean;
  sendClientLink: boolean;
  createFirstTask: boolean;
};

export type LeadStartServiceDraftField = keyof LeadStartServiceDraft;

export type LeadStartServiceExistingCase = {
  id: string;
  title: string;
};

export type LeadStartServiceDialogMode = 'interactive' | 'preview';

export type LeadStartServiceDialogProps = {
  open: boolean;
  draft: LeadStartServiceDraft;
  mode?: LeadStartServiceDialogMode;
  title?: string;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  onDraftChange: (field: LeadStartServiceDraftField, value: string | boolean) => void;
  existingCaseOptions?: LeadStartServiceExistingCase[];
  selectedExistingCaseId?: string;
  linkingExistingCase?: boolean;
  onExistingCaseChange?: (caseId: string) => void;
  onLinkExistingCase?: () => void | Promise<void>;
  checklistTaskCount?: number | string;
  className?: string;
};

const DEFAULT_DIALOG_ID = 'forteca-frt-020-lead-start-case';

function formatMoney(value: string) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '0';
  return Number(digits).toLocaleString('pl-PL');
}

function formatDate(value: string) {
  const text = String(value || '').trim();
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(text)) return text;
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (isoMatch) return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}`;
  return text || '—';
}

function initialsFor(value: string) {
  const initials = String(value || '')
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
  return initials || 'DK';
}

function addDaysToDate(value: string, days: number) {
  const text = formatDate(value);
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text);
  if (!match) return '—';
  const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]) + days);
  if (Number.isNaN(date.getTime())) return '—';
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear(),
  ].join('.');
}

function normalizeChecklistTaskCount(value: number | string | undefined) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const count = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isInteger(count) && count >= 0 ? count : null;
}

function DraftField({
  label,
  required = false,
  icon,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  icon: ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('forteca-frt-020-start-case__field', className)}>
      <span className="forteca-frt-020-start-case__field-icon" aria-hidden="true">{icon}</span>
      <span className="forteca-frt-020-start-case__field-body">
        <span className="forteca-frt-020-start-case__field-label">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </span>
        {children}
      </span>
    </label>
  );
}

function ToggleField({
  checked,
  label,
  description,
  icon,
  onChange,
  disabled,
}: {
  checked: boolean;
  label: string;
  description: string;
  icon: ReactNode;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}) {
  return (
    <label className="forteca-frt-020-start-case__toggle">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="forteca-frt-020-start-case__toggle-icon" aria-hidden="true">{icon}</span>
      <span className="forteca-frt-020-start-case__toggle-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <span className="forteca-frt-020-start-case__switch" aria-hidden="true">
        <span className="forteca-frt-020-start-case__switch-thumb" />
      </span>
    </label>
  );
}

function PreviewBlock({
  icon,
  tone,
  title,
  description,
  children,
}: {
  icon: 'case' | 'template' | 'client' | 'task' | 'event' | 'link';
  tone: 'case' | 'primary' | 'template' | 'client' | 'task' | 'event';
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const iconNode = icon === 'link'
    ? <SemanticIcon role="link" tone="task" size="sm" />
    : <EntityIcon entity={icon} size="sm" />;

  return (
    <article className="forteca-frt-020-start-case__preview-card">
      <div className="forteca-frt-020-start-case__preview-card-heading">
        <span className={cn('forteca-frt-020-start-case__preview-icon', `forteca-frt-020-start-case__preview-icon--${tone}`)}>
          {iconNode}
        </span>
        <h3>{title}</h3>
      </div>
      <p className="forteca-frt-020-start-case__preview-card-description">{description}</p>
      <div className="forteca-frt-020-start-case__preview-card-body">{children}</div>
    </article>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="forteca-frt-020-start-case__preview-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function LeadStartServiceDialog({
  open,
  draft,
  mode = 'interactive',
  title = 'Rozpocznij obsługę',
  submitting = false,
  onOpenChange,
  onConfirm,
  onDraftChange,
  existingCaseOptions = [],
  selectedExistingCaseId = '',
  linkingExistingCase = false,
  onExistingCaseChange,
  onLinkExistingCase,
  checklistTaskCount: checklistTaskCountProp,
  className,
}: LeadStartServiceDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const isPreview = mode === 'preview';
  const isBusy = submitting || linkingExistingCase;
  const confirmDisabled = isBusy || (!isPreview && (!draft.title.trim() || !draft.clientName.trim()));
  const titleId = `${DEFAULT_DIALOG_ID}-title`;
  const descriptionId = `${DEFAULT_DIALOG_ID}-description`;
  const checklistTemplate = String(draft.checklistTemplate || '').trim();
  const hasNoChecklist = checklistTemplate.toLocaleLowerCase() === 'bez checklisty';
  const hasChecklistTemplate = Boolean(checklistTemplate) && !hasNoChecklist;
  const resolvedChecklistTaskCount = hasChecklistTemplate
    ? normalizeChecklistTaskCount(checklistTaskCountProp ?? draft.checklistTaskCount)
    : hasNoChecklist
      ? 0
      : null;
  const checklistDescription = hasNoChecklist
    ? 'Nie zostanie dodana checklista, ponieważ wybrano opcję „Bez checklisty”.'
    : hasChecklistTemplate
      ? 'Zostanie dodana checklista na podstawie wybranego szablonu.'
      : 'Nie zostanie dodana checklista, dopóki nie wybierzesz szablonu.';
  const checklistTaskCountLabel = hasChecklistTemplate
    ? resolvedChecklistTaskCount === null
      ? 'Nie określono'
      : String(resolvedChecklistTaskCount)
    : '0';
  const clientLinkDescription = !draft.clientPortal
    ? 'Włącz Portal klienta, aby móc udostępnić i wysłać link.'
    : draft.sendClientLink
      ? 'Klient otrzyma dostęp do portalu z wglądem w sprawę i postępy.'
      : 'Portal klienta zostanie przygotowany, ale link nie zostanie wysłany automatycznie.';
  const taskDescription = draft.createFirstTask
    ? 'Pierwsze zadanie dla operatora zostanie utworzone automatycznie.'
    : 'Nie zostanie utworzone, ponieważ opcja tworzenia pierwszego zadania jest wyłączona.';

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape' || isBusy) return;
    event.preventDefault();
    event.stopPropagation();
    onOpenChange(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPreview || confirmDisabled) return;
    void onConfirm();
  }

  function handleClientPortalChange(enabled: boolean) {
    onDraftChange('clientPortal', enabled);
    if (!enabled && draft.sendClientLink) onDraftChange('sendClientLink', false);
  }

  return (
    <div
      className={cn('forteca-frt-020-start-case', className)}
      role="presentation"
      data-forteca-frt-020-start-case="true"
      data-forteca-frt-020-start-case-mode={mode}
    >
      <div
        className="forteca-frt-020-start-case__backdrop"
        aria-hidden="true"
        onMouseDown={() => {
          if (!isBusy) onOpenChange(false);
        }}
      />
      <section
        ref={dialogRef}
        className="forteca-frt-020-start-case__surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="forteca-frt-020-start-case__header">
          <div className="forteca-frt-020-start-case__heading">
            <h1 id={titleId}>{title}</h1>
            <p id={descriptionId}>Utwórz sprawę i rozpocznij proces realizacji dla tego klienta.</p>
          </div>
          <IconButton
            icon="close"
            label="Zamknij"
            title="Zamknij"
            variant="ghost"
            className="forteca-frt-020-start-case__close"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
            data-forteca-frt-020-start-case-close="true"
          />
        </header>

        <form className="forteca-frt-020-start-case__form" onSubmit={handleSubmit}>
          <main className="forteca-frt-020-start-case__content">
            <section className="forteca-frt-020-start-case__form-column" aria-label="Dane sprawy">
              <DraftField label="Nazwa sprawy" required className="forteca-frt-020-start-case__field--case" icon={<EntityIcon entity="case" size="sm" />}>
                <input
                  className="forteca-frt-020-start-case__input"
                  value={draft.title}
                  onChange={(event) => onDraftChange('title', event.target.value)}
                  disabled={isBusy}
                  aria-required="true"
                  data-forteca-frt-020-field="title"
                />
              </DraftField>

              <DraftField label="Typ usługi" required className="forteca-frt-020-start-case__field--service" icon={<EntityIcon entity="task" size="sm" />}>
                <span className="forteca-frt-020-start-case__select-wrap">
                  <select
                    className="forteca-frt-020-start-case__input forteca-frt-020-start-case__select"
                    value={draft.serviceType}
                    onChange={(event) => onDraftChange('serviceType', event.target.value)}
                    disabled={isBusy}
                    aria-required="true"
                    data-forteca-frt-020-field="serviceType"
                  >
                    <option>Wdrożenie systemu</option>
                    <option>Konsultacja</option>
                    <option>Automatyzacja procesu</option>
                  </select>
                  <SemanticIcon role="navigation" size="xs" className="forteca-frt-020-start-case__select-icon" />
                </span>
              </DraftField>

              <DraftField label="Szablon checklisty" required className="forteca-frt-020-start-case__field--template" icon={<EntityIcon entity="template" size="sm" />}>
                <span className="forteca-frt-020-start-case__select-wrap">
                  <select
                    className="forteca-frt-020-start-case__input forteca-frt-020-start-case__select"
                    value={draft.checklistTemplate}
                    onChange={(event) => onDraftChange('checklistTemplate', event.target.value)}
                    disabled={isBusy}
                    aria-required="true"
                    data-forteca-frt-020-field="checklistTemplate"
                  >
                    <option>Wdrożenie CRM – standard</option>
                    <option>Wdrożenie CRM – rozszerzony</option>
                    <option>Bez checklisty</option>
                  </select>
                  <SemanticIcon role="navigation" size="xs" className="forteca-frt-020-start-case__select-icon" />
                </span>
              </DraftField>

              <DraftField label="Wartość" required className="forteca-frt-020-start-case__field--value" icon={<EntityIcon entity="payment" size="sm" />}>
                <span className="forteca-frt-020-start-case__currency-input">
                  <input
                    className="forteca-frt-020-start-case__input"
                    value={draft.value}
                    onChange={(event) => onDraftChange('value', event.target.value)}
                    disabled={isBusy}
                    inputMode="decimal"
                    aria-required="true"
                    data-forteca-frt-020-field="value"
                  />
                  <span className="forteca-frt-020-start-case__currency-select-wrap">
                    <select
                      className="forteca-frt-020-start-case__input forteca-frt-020-start-case__currency-select"
                      value={draft.currency || 'PLN'}
                      onChange={(event) => onDraftChange('currency', event.target.value)}
                      disabled={isBusy}
                      aria-label="Waluta"
                      data-forteca-frt-020-field="currency"
                    >
                      <option value="PLN">PLN</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                    <SemanticIcon role="navigation" size="xs" className="forteca-frt-020-start-case__currency-select-icon" />
                  </span>
                </span>
              </DraftField>

              <DraftField label="Właściciel sprawy" required className="forteca-frt-020-start-case__field--owner" icon={<EntityIcon entity="client" size="sm" />}>
                <span className="forteca-frt-020-start-case__owner-control">
                  <span className="forteca-frt-020-start-case__avatar forteca-frt-020-start-case__avatar--initials" data-forteca-frt-020-avatar="initials" aria-hidden="true">{initialsFor(draft.owner || 'Operator')}</span>
                  <select
                    className="forteca-frt-020-start-case__input forteca-frt-020-start-case__select forteca-frt-020-start-case__owner-select"
                    value={draft.owner}
                    onChange={(event) => {
                      onDraftChange('owner', event.target.value);
                      // A display-name change must not reuse an ID resolved for
                      // a different operator; the server re-resolves by label
                      // against the canonical workspace membership.
                      onDraftChange('ownerId', '');
                    }}
                    disabled={isBusy}
                    aria-required="true"
                    data-forteca-frt-020-field="owner"
                  >
                    <option>Operator</option>
                    <option>Dev Local</option>
                  </select>
                  <SemanticIcon role="navigation" size="xs" className="forteca-frt-020-start-case__select-icon" />
                </span>
              </DraftField>

              <DraftField label="Termin startu" required className="forteca-frt-020-start-case__field--date" icon={<EntityIcon entity="event" size="sm" />}>
                <span className="forteca-frt-020-start-case__date-control">
                  <input
                    className="forteca-frt-020-start-case__input forteca-frt-020-start-case__date-input"
                    value={draft.startDate}
                    onChange={(event) => onDraftChange('startDate', event.target.value)}
                    disabled={isBusy}
                    placeholder="12.05.2025"
                    aria-required="true"
                    data-forteca-frt-020-field="startDate"
                  />
                  <CalendarActionIcon size="sm" className="forteca-frt-020-start-case__date-icon" />
                </span>
              </DraftField>

              <div className="forteca-frt-020-start-case__toggles" aria-label="Ustawienia startu sprawy">
                <ToggleField
                  checked={draft.clientPortal}
                  label="Portal klienta"
                  description="Udostępnij klientowi portal do podglądu sprawy i postępów."
                  icon={<SemanticIcon role="view" tone="primary" size="sm" />}
                  onChange={handleClientPortalChange}
                  disabled={isBusy}
                />
                <ToggleField
                  checked={draft.clientPortal && draft.sendClientLink}
                  label="Wyślij link klientowi"
                  description={draft.clientPortal ? 'Wyślij link do portalu klienta po utworzeniu sprawy.' : 'Włącz Portal klienta, aby móc wysłać link klientowi.'}
                  icon={<SemanticIcon role="send" tone="primary" size="sm" />}
                  onChange={(value) => onDraftChange('sendClientLink', draft.clientPortal && value)}
                  disabled={isBusy || !draft.clientPortal}
                />
                <ToggleField
                  checked={draft.createFirstTask}
                  label="Utwórz pierwszy następny krok dla operatora"
                  description="Automatycznie utwórz pierwsze zadanie na podstawie szablonu."
                  icon={<SemanticIcon role="task_status" tone="primary" size="sm" />}
                  onChange={(value) => onDraftChange('createFirstTask', value)}
                  disabled={isBusy}
                />
              </div>

              {existingCaseOptions.length > 0 && onExistingCaseChange && onLinkExistingCase ? (
                <details className="forteca-frt-020-start-case__existing-link">
                  <summary>Masz już utworzoną sprawę? Podepnij ją</summary>
                  <div className="forteca-frt-020-start-case__existing-link-row">
                    <select
                      className="forteca-frt-020-start-case__input forteca-frt-020-start-case__select"
                      value={selectedExistingCaseId}
                      onChange={(event) => onExistingCaseChange(event.target.value)}
                      disabled={isBusy}
                    >
                      <option value="">Wybierz sprawę</option>
                      {existingCaseOptions.map((entry) => (
                        <option key={entry.id} value={entry.id}>{entry.title}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void onLinkExistingCase()}
                      disabled={isBusy || !selectedExistingCaseId}
                    >
                      {linkingExistingCase ? 'Podpinam…' : 'Podepnij'}
                    </Button>
                  </div>
                </details>
              ) : null}
            </section>

            <aside className="forteca-frt-020-start-case__preview" aria-label="Podgląd planu utworzenia">
              <div className="forteca-frt-020-start-case__preview-heading">
                <h2>Podgląd tego, co zostanie utworzone</h2>
                <p>Po kliknięciu „Utwórz sprawę” zostaną utworzone następujące elementy.</p>
              </div>

              <div className="forteca-frt-020-start-case__preview-list">
                <PreviewBlock
                  icon="case"
                  tone="primary"
                  title="Sprawa"
                  description={`Nowa sprawa zostanie utworzona dla klienta ${draft.clientName || 'tego klienta'}.`}
                >
                  <PreviewRow label="Nazwa sprawy" value={draft.title || 'Nowa sprawa'} />
                  <PreviewRow label="Typ usługi" value={draft.serviceType || 'Wdrożenie systemu'} />
                  <PreviewRow label="Wartość" value={`${formatMoney(draft.value)} ${draft.currency || 'PLN'}`} />
                  <PreviewRow label="Właściciel" value={draft.owner || 'Operator'} />
                  <PreviewRow label="Termin startu" value={formatDate(draft.startDate)} />
                </PreviewBlock>

                <PreviewBlock
                  icon="template"
                  tone="template"
                  title="Checklisty startowe"
                  description={checklistDescription}
                >
                  <PreviewRow label="Szablon" value={checklistTemplate || 'Nie wybrano'} />
                  <PreviewRow label="Liczba zadań" value={checklistTaskCountLabel} />
                </PreviewBlock>

                <PreviewBlock
                  icon="link"
                  tone="client"
                  title="Link dla klienta"
                  description={clientLinkDescription}
                >
                  <PreviewRow label="Portal klienta" value={draft.clientPortal ? 'Włączony' : 'Wyłączony'} />
                  <PreviewRow label="Wyślij link" value={draft.clientPortal && draft.sendClientLink ? 'Zaplanowane' : 'Nie'} />
                </PreviewBlock>

                <PreviewBlock
                  icon="event"
                  tone="event"
                  title={draft.createFirstTask ? 'Zadanie kontrolne za 2 dni' : 'Zadanie kontrolne'}
                  description={taskDescription}
                >
                  <PreviewRow label="Nazwa zadania" value={draft.createFirstTask ? 'Kick-off i zebranie wymagań' : 'Nie utworzono'} />
                  <PreviewRow label="Termin" value={draft.createFirstTask ? addDaysToDate(draft.startDate, 2) : '—'} />
                  <PreviewRow label="Przypisane do" value={draft.createFirstTask ? (draft.owner || 'Nie określono') : '—'} />
                </PreviewBlock>
              </div>
            </aside>
          </main>

          <footer className="forteca-frt-020-start-case__footer">
            <Button
              type="button"
              variant="outline"
              className="forteca-frt-020-start-case__cancel"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
              data-forteca-frt-020-start-case-cancel="true"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              className="forteca-frt-020-start-case__submit"
              disabled={confirmDisabled}
              aria-disabled={isPreview || undefined}
              aria-busy={submitting}
              data-forteca-frt-020-start-case-submit="true"
            >
              <span className="forteca-frt-020-start-case__submit-icon" aria-hidden="true">
                {submitting ? <SemanticIcon role="loading" size="sm" /> : <AddActionIcon size="sm" />}
              </span>
              {submitting ? 'Tworzę…' : 'Utwórz sprawę'}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
