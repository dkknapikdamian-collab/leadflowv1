import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { createStarterCaseForClient } from '../lib/cases/create-client-case';
import { fetchCaseTemplatesFromSupabase } from '../lib/supabase-fallback';
import { normalizeTemplateItems } from '../lib/source-of-truth/template-options';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { IconButton } from './ui/icon-button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { CalendarActionIcon, EntityIcon, SemanticIcon } from './ui-system';
import '../styles/forteca-client-case-create.css';

type ClientRecord = Record<string, unknown>;
type CasePriority = 'low' | 'medium' | 'high';

type CaseCreateDraft = {
  title: string;
  caseType: string;
  category: string;
  priority: CasePriority;
  value: string;
  startDate: string;
  plannedDate: string;
  owner: string;
  source: string;
  note: string;
  createChecklist: boolean;
  checklistTemplate: string;
};

type ChecklistTemplateOption = {
  id: string;
  name: string;
  items: Array<{
    title: string;
    description: string;
    type: string;
    isRequired: boolean;
  }>;
};

type CreateClientCaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientRecord;
  workspaceId: string;
  hasAccess: boolean;
  hasExistingCase: boolean;
  ownerId?: string | null;
  ownerName?: string;
};

type CaseFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  labelFor?: string | null;
};

const FRT031_CASE_TYPES = [
  'Windykacja należności',
  'Umowy i opinie prawne',
  'Sprawy cywilne',
] as const;

const FRT031_SERVICE_CATEGORIES = [
  'Prawo cywilne – należności',
  'Prawo gospodarcze',
  'Postępowanie sądowe',
] as const;

const FRT031_PRIORITIES: Array<{ value: CasePriority; label: string }> = [
  { value: 'low', label: 'Niski' },
  { value: 'medium', label: 'Średni' },
  { value: 'high', label: 'Wysoki' },
];

const FRT031_SOURCES = ['Rekomendacja', 'Strona internetowa', 'Polecenie', 'Inne'] as const;

const FRT031_REFERENCE_CHECKLIST_NAME = 'Windykacja należności – standard';

function asRecord(value: unknown): ClientRecord {
  return value && typeof value === 'object' ? (value as ClientRecord) : {};
}

function readClientText(client: ClientRecord, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = client[key];
    if (typeof value === 'string' || typeof value === 'number') {
      const prepared = String(value).trim();
      if (prepared) return prepared;
    }
  }
  return fallback;
}

function readClientName(client: ClientRecord) {
  return readClientText(client, ['name', 'company', 'fullName'], 'Klient');
}

function readClientOwnerName(client: ClientRecord) {
  const owner = asRecord(client.owner);
  return readClientText(
    owner,
    ['name', 'fullName'],
    readClientText(client, ['ownerName', 'owner_name', 'assigneeName', 'assignee_name'], 'Opiekun'),
  );
}

function readClientOwnerId(client: ClientRecord) {
  const owner = asRecord(client.owner);
  return readClientText(
    owner,
    ['id', 'userId', 'user_id', 'authUserId', 'auth_user_id'],
    readClientText(client, ['ownerId', 'owner_id', 'ownerUserId', 'owner_user_id'], ''),
  );
}

function getLocalDateInputValue(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function createDefaultDraft(client: ClientRecord, preferredOwnerName?: string): CaseCreateDraft {
  return {
    title: '',
    caseType: FRT031_CASE_TYPES[0],
    category: FRT031_SERVICE_CATEGORIES[0],
    priority: 'medium',
    value: '',
    startDate: getLocalDateInputValue(),
    plannedDate: '',
    owner: preferredOwnerName?.trim() || readClientOwnerName(client),
    source: FRT031_SOURCES[0],
    note: '',
    createChecklist: true,
    checklistTemplate: '',
  };
}

function readChecklistTemplateOption(value: unknown): ChecklistTemplateOption | null {
  const row = asRecord(value);
  const id = readClientText(row, ['id']);
  const name = readClientText(row, ['name', 'title']);
  const items = normalizeTemplateItems(Array.isArray(row.items) ? row.items as Array<Partial<{ title: string; description: string; type: 'file' | 'text' | 'decision' | 'access' | 'meeting' | 'payment' | 'materials' | 'other'; isRequired: boolean }>> : undefined)
    .filter((item) => item.title);
  if (!id || !name || !items.length) return null;
  return { id, name, items };
}

function toIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date.toISOString();
}

function parseMoneyValue(value: string) {
  const compact = value.trim().replace(/\s/g, '');
  if (!compact) return null;

  const normalized = compact.includes(',')
    ? compact.replace(/\./g, '').replace(',', '.')
    : compact;
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object') {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === 'string' && message.trim()) return message.trim();
  }
  return 'REQUEST_FAILED';
}

function getInitials(value: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
  return initials || 'OP';
}

function CaseField({ id, label, required = false, children, className = '', labelFor }: CaseFieldProps) {
  return (
    <div className={`forteca-frt-031-field ${className}`.trim()}>
      <Label {...(labelFor === null ? {} : { htmlFor: labelFor || id })} className="forteca-frt-031-label">
        {label}
        {required ? <span className="forteca-frt-031-required" aria-hidden="true">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function SelectChevron() {
  return <SemanticIcon role="navigation" size="xs" className="forteca-frt-031-select-chevron" />;
}

export function CreateClientCaseDialog({
  open,
  onOpenChange,
  client,
  workspaceId,
  hasAccess,
  hasExistingCase,
  ownerId,
  ownerName,
}: CreateClientCaseDialogProps) {
  const navigate = useNavigate();
  const preferredOwnerName = ownerName?.trim() || readClientOwnerName(client);
  const [draft, setDraft] = useState<CaseCreateDraft>(() => createDefaultDraft(client, preferredOwnerName));
  const [saving, setSaving] = useState(false);
  const submitInFlightRef = useRef(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [checklistTemplates, setChecklistTemplates] = useState<ChecklistTemplateOption[]>([]);
  const [checklistTemplatesLoading, setChecklistTemplatesLoading] = useState(false);
  const [checklistTemplatesError, setChecklistTemplatesError] = useState('');

  const clientId = readClientText(client, ['id']);
  const clientName = readClientName(client);
  const selectedOwnerId = ownerId?.trim() || readClientOwnerId(client);
  const ownerOptions = Array.from(new Set([draft.owner || preferredOwnerName].filter(Boolean)));
  const selectedChecklistTemplate = checklistTemplates.find((template) => template.id === draft.checklistTemplate) || null;

  useEffect(() => {
    if (!open) {
      setDraft(createDefaultDraft(client, preferredOwnerName));
      setValidationMessage('');
      setChecklistTemplates([]);
      setChecklistTemplatesError('');
      setChecklistTemplatesLoading(false);
      return;
    }

    let cancelled = false;
    setDraft(createDefaultDraft(client, preferredOwnerName));
    setValidationMessage('');
    setChecklistTemplatesLoading(true);
    setChecklistTemplatesError('');
    fetchCaseTemplatesFromSupabase({ includeArchived: false })
      .then((rows) => {
        if (cancelled) return;
        const options = rows
          .map(readChecklistTemplateOption)
          .filter((template): template is ChecklistTemplateOption => Boolean(template));
        const preferred = options.find((template) => template.name === FRT031_REFERENCE_CHECKLIST_NAME) || options[0] || null;
        setChecklistTemplates(options);
        setDraft((current) => ({
          ...current,
          checklistTemplate: preferred?.id || '',
          createChecklist: Boolean(preferred),
        }));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setChecklistTemplates([]);
        setChecklistTemplatesError(`Nie udało się pobrać szablonów checklisty: ${getErrorMessage(error)}`);
        setDraft((current) => ({ ...current, checklistTemplate: '', createChecklist: false }));
      })
      .finally(() => {
        if (!cancelled) setChecklistTemplatesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, open, preferredOwnerName]);

  const updateDraft = <K extends keyof CaseCreateDraft>(key: K, value: CaseCreateDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setValidationMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitInFlightRef.current) return;

    const preparedTitle = draft.title.trim();
    const contractValue = parseMoneyValue(draft.value);
    const startDateIso = toIsoDate(draft.startDate);
    const plannedDateIso = draft.plannedDate ? toIsoDate(draft.plannedDate) : null;

    let nextValidationMessage = '';
    if (!hasAccess) nextValidationMessage = 'Brak dostępu do tworzenia spraw.';
    else if (!workspaceId || !clientId) nextValidationMessage = 'Nie udało się ustalić klienta lub workspace.';
    else if (!preparedTitle) nextValidationMessage = 'Podaj nazwę sprawy.';
    else if (!draft.caseType) nextValidationMessage = 'Wybierz typ sprawy.';
    else if (!draft.category) nextValidationMessage = 'Wybierz kategorię usługi.';
    else if (!draft.priority) nextValidationMessage = 'Wybierz priorytet.';
    else if (contractValue === null || contractValue <= 0) nextValidationMessage = 'Podaj wartość sprawy większą od zera.';
    else if (!startDateIso) nextValidationMessage = 'Podaj prawidłowy termin startu.';
    else if (draft.plannedDate && !plannedDateIso) nextValidationMessage = 'Podaj prawidłowy planowany termin.';
    else if (plannedDateIso && draft.plannedDate < draft.startDate) nextValidationMessage = 'Planowany termin nie może być wcześniejszy niż start sprawy.';
    else if (!draft.owner) nextValidationMessage = 'Wybierz opiekuna.';
    else if (!selectedOwnerId) nextValidationMessage = 'Nie udało się ustalić konta opiekuna.';
    else if (draft.createChecklist && !selectedChecklistTemplate) nextValidationMessage = 'Wybierz dostępny szablon checklisty.';

    if (nextValidationMessage) {
      setValidationMessage(nextValidationMessage);
      toast.error(nextValidationMessage);
      return;
    }

    try {
      submitInFlightRef.current = true;
      setSaving(true);
      const { createdCaseId } = await createStarterCaseForClient({
        title: preparedTitle,
        clientId,
        clientName,
        clientEmail: readClientText(client, ['email']),
        clientPhone: readClientText(client, ['phone', 'telephone']),
        workspaceId,
        primaryForClient: !hasExistingCase,
        contractValue: contractValue as number,
        currency: 'PLN',
        startedAt: startDateIso,
        plannedAt: plannedDateIso,
        ownerId: selectedOwnerId || null,
        caseType: draft.caseType,
        category: draft.category,
        priority: draft.priority,
        source: draft.source,
        note: draft.note,
        createChecklist: draft.createChecklist,
        checklistTemplateId: selectedChecklistTemplate?.id,
        checklistTemplateName: selectedChecklistTemplate?.name,
        checklistItems: selectedChecklistTemplate?.items,
      });

      if (!createdCaseId) {
        toast.error('Sprawa została zapisana, ale nie udało się jej otworzyć.');
        return;
      }

      toast.success('Sprawa utworzona.');
      onOpenChange(false);
      navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-detail');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setValidationMessage(`Nie udało się utworzyć sprawy: ${message}`);
      toast.error(`Nie udało się utworzyć sprawy: ${message}`);
    } finally {
      submitInFlightRef.current = false;
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !saving && onOpenChange(nextOpen)}>
      <DialogContent
        aria-describedby="create-client-case-description"
        className="forteca-frt-031-case-create"
        data-forteca-frt-031-root="true"
      >
        <DialogHeader className="forteca-frt-031-dialog-header">
          <DialogTitle>Nowa sprawa</DialogTitle>
          <DialogDescription id="create-client-case-description" className="forteca-frt-031-dialog-description">
            Utwórz sprawę powiązaną z wybranym klientem.
          </DialogDescription>
        </DialogHeader>

        <form className="forteca-frt-031-form" onSubmit={handleSubmit} noValidate data-forteca-frt-031-runtime="true">
          <div className="forteca-frt-031-form-body">
            {validationMessage ? (
              <p className="forteca-frt-031-validation" role="alert">
                {validationMessage}
              </p>
            ) : null}

            <div className="forteca-frt-031-form-grid">
            <CaseField id="create-client-case-client" label="Klient" labelFor={null}>
                <div
                  className="forteca-frt-031-control forteca-frt-031-client-control"
                  role="status"
                  aria-label={`Klient: ${clientName}`}
                >
                  <EntityIcon entity="client" size="sm" tone="soft" />
                  <span className="forteca-frt-031-client-name">{clientName}</span>
                  <SelectChevron />
                </div>
              </CaseField>

              <CaseField id="create-client-case-title" label="Nazwa sprawy" required>
                <Input
                  id="create-client-case-title"
                  autoFocus
                  required
                  value={draft.title}
                  onChange={(event) => updateDraft('title', event.target.value)}
                  placeholder="Np. Podział działki"
                  disabled={saving}
                  className="forteca-frt-031-control"
                />
              </CaseField>

              <CaseField id="create-client-case-type" label="Typ sprawy" required>
                <div className="forteca-frt-031-select-wrap">
                  <select
                    id="create-client-case-type"
                    required
                    value={draft.caseType}
                    onChange={(event) => updateDraft('caseType', event.target.value)}
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-select"
                  >
                    {FRT031_CASE_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <SelectChevron />
                </div>
              </CaseField>

              <CaseField id="create-client-case-category" label="Kategoria usługi" required>
                <div className="forteca-frt-031-select-wrap">
                  <select
                    id="create-client-case-category"
                    required
                    value={draft.category}
                    onChange={(event) => updateDraft('category', event.target.value)}
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-select"
                  >
                    {FRT031_SERVICE_CATEGORIES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <SelectChevron />
                </div>
              </CaseField>

              <CaseField id="create-client-case-priority" label="Priorytet" required>
                <div className="forteca-frt-031-select-wrap forteca-frt-031-priority-wrap">
                  <span className={`forteca-frt-031-priority-dot forteca-frt-031-priority-dot--${draft.priority}`} aria-hidden="true" />
                  <select
                    id="create-client-case-priority"
                    required
                    value={draft.priority}
                    onChange={(event) => updateDraft('priority', event.target.value as CasePriority)}
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-select forteca-frt-031-select--with-prefix"
                  >
                    {FRT031_PRIORITIES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <SelectChevron />
                </div>
              </CaseField>

              <CaseField id="create-client-case-value" label="Wartość (PLN)" required>
                <div className="forteca-frt-031-money-wrap">
                  <Input
                    id="create-client-case-value"
                    required
                    value={draft.value}
                    onChange={(event) => updateDraft('value', event.target.value)}
                    placeholder="12 500,00"
                    inputMode="decimal"
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-money-input"
                  />
                  <span className="forteca-frt-031-money-suffix">PLN</span>
                </div>
              </CaseField>

              <CaseField id="create-client-case-start-date" label="Termin startu" required>
                <div className="forteca-frt-031-date-wrap">
                  <CalendarActionIcon size="sm" className="forteca-frt-031-date-icon" />
                  <Input
                    id="create-client-case-start-date"
                    required
                    type="date"
                    value={draft.startDate}
                    onChange={(event) => updateDraft('startDate', event.target.value)}
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-date-input"
                  />
                  {draft.startDate ? (
                    <IconButton
                      icon="close"
                      label="Wyczyść termin startu"
                      title="Wyczyść termin startu"
                      variant="ghost"
                      size="icon"
                      className="forteca-frt-031-clear-date"
                      onClick={() => updateDraft('startDate', '')}
                      disabled={saving}
                    />
                  ) : null}
                </div>
              </CaseField>

              <CaseField id="create-client-case-planned-date" label="Planowany termin">
                <div className="forteca-frt-031-date-wrap">
                  <CalendarActionIcon size="sm" className="forteca-frt-031-date-icon" />
                  <Input
                    id="create-client-case-planned-date"
                    type="date"
                    value={draft.plannedDate}
                    onChange={(event) => updateDraft('plannedDate', event.target.value)}
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-date-input"
                  />
                  {draft.plannedDate ? (
                    <IconButton
                      icon="close"
                      label="Wyczyść planowany termin"
                      title="Wyczyść planowany termin"
                      variant="ghost"
                      size="icon"
                      className="forteca-frt-031-clear-date"
                      onClick={() => updateDraft('plannedDate', '')}
                      disabled={saving}
                    />
                  ) : null}
                </div>
              </CaseField>

              <CaseField id="create-client-case-owner" label="Opiekun" required>
                <div className="forteca-frt-031-owner-wrap">
                  <span className="forteca-frt-031-owner-avatar" aria-hidden="true">{getInitials(draft.owner)}</span>
                  <select
                    id="create-client-case-owner"
                    required
                    value={draft.owner}
                    onChange={(event) => updateDraft('owner', event.target.value)}
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-select forteca-frt-031-select--with-prefix"
                  >
                    {ownerOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <SelectChevron />
                </div>
              </CaseField>

              <CaseField id="create-client-case-source" label="Źródło sprawy">
                <div className="forteca-frt-031-select-wrap">
                  <select
                    id="create-client-case-source"
                    value={draft.source}
                    onChange={(event) => updateDraft('source', event.target.value)}
                    disabled={saving}
                    className="forteca-frt-031-control forteca-frt-031-select"
                  >
                    {FRT031_SOURCES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <SelectChevron />
                </div>
              </CaseField>

              <CaseField id="create-client-case-note" label="Notatka startowa" className="forteca-frt-031-field--full">
                <Textarea
                  id="create-client-case-note"
                  value={draft.note}
                  onChange={(event) => updateDraft('note', event.target.value)}
                  placeholder="Dodaj kontekst, który pomoże rozpocząć pracę..."
                  disabled={saving}
                  className="forteca-frt-031-control forteca-frt-031-note"
                />
              </CaseField>
            </div>

            <section className="forteca-frt-031-checklist" aria-labelledby="create-client-case-checklist-title">
              <div className="forteca-frt-031-checklist-header">
                <div>
                  <h3 id="create-client-case-checklist-title" className="forteca-frt-031-checklist-title">Utwórz checklistę od razu</h3>
                  <p className="forteca-frt-031-checklist-description">Zacznij sprawę z gotową listą pierwszych kroków.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft.createChecklist}
                  aria-label="Utwórz checklistę od razu"
                  className={`forteca-frt-031-switch${draft.createChecklist ? ' forteca-frt-031-switch--on' : ''}`}
                  onClick={() => updateDraft('createChecklist', !draft.createChecklist)}
                  disabled={saving}
                >
                  <span className="forteca-frt-031-switch-thumb" />
                </button>
              </div>

              {draft.createChecklist ? (
                <div className="forteca-frt-031-checklist-template">
                  <Label htmlFor="create-client-case-checklist-template" className="forteca-frt-031-label">Szablon checklisty</Label>
                  <div className="forteca-frt-031-select-wrap">
                    <EntityIcon entity="template" size="sm" tone="soft" className="forteca-frt-031-template-icon" />
                    <select
                      id="create-client-case-checklist-template"
                      value={draft.checklistTemplate}
                      onChange={(event) => updateDraft('checklistTemplate', event.target.value)}
                      disabled={saving || checklistTemplatesLoading || !checklistTemplates.length}
                      className="forteca-frt-031-control forteca-frt-031-select forteca-frt-031-select--with-prefix"
                    >
                      {checklistTemplatesLoading ? <option value="">Ładowanie szablonów…</option> : null}
                      {!checklistTemplatesLoading && !checklistTemplates.length ? <option value="">Brak dostępnych szablonów</option> : null}
                      {checklistTemplates.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                    </select>
                    <SelectChevron />
                  </div>
                  {checklistTemplatesError ? <p className="forteca-frt-031-field-help" role="status">{checklistTemplatesError}</p> : null}
                </div>
              ) : null}
            </section>
          </div>

          <DialogFooter className="forteca-frt-031-dialog-footer">
            <Button type="button" variant="outline" data-forteca-frt-031-action="cancel" onClick={() => onOpenChange(false)} disabled={saving}>
              Anuluj
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Tworzenie…' : 'Utwórz sprawę'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
