import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { MapPin, Mail, Phone, UserRound, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { EntityConflictDialog, type EntityConflictCandidate } from './EntityConflictDialog';
import { createStarterCaseForClient } from '../lib/cases/create-client-case';
import {
  createClientInSupabase,
  findEntityConflictsInSupabase,
  updateClientInSupabase,
  updateLeadInSupabase,
  type ClientCreateInput,
} from '../lib/supabase-fallback';
import { CLIENT_SOURCE_OPTIONS } from '../lib/source-of-truth/client-options';
import { requireWorkspaceId } from '../lib/workspace-context';
import { useWorkspace } from '../hooks/useWorkspace';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { FormField } from './ui/form-field';
import { Input } from './ui/input';
import { TextareaField } from './ui/textarea-field';
import { modalFooterClass } from './entity-actions';
import '../styles/forteca-client-add.css';
import '../styles/forteca-client-edit.css';

const STAGE228R5R6_ACTIVE_CLIENT_CREATE_DIALOG_FINANCE_REDIRECT = 'active ClientCreateDialog creates empty starter case and opens CaseDetail finance modal';
const CLOSEFLOW_CZ2_013_CLIENT_CREATE_FORM_VARIANTS = 'ClientCreateDialog scoped migration uses FormField/TextareaField source of truth';
const FRT029_CLIENT_CREATE_DIALOG_SOURCE_TRUTH = 'FRT-029 uses one controlled client-add owner for /clients and global quick-add';
void STAGE228R5R6_ACTIVE_CLIENT_CREATE_DIALOG_FINANCE_REDIRECT;
void CLOSEFLOW_CZ2_013_CLIENT_CREATE_FORM_VARIANTS;
void FRT029_CLIENT_CREATE_DIALOG_SOURCE_TRUTH;

export type ClientCreateFormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  company: string;
  sourcePrimary: string;
  ownerId: string;
  notes: string;
  createCase: boolean;
  caseTitle: string;
};

type ClientCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void | Promise<void>;
};

export type ClientEditRecord = {
  id?: string;
  [key: string]: unknown;
};

export type ClientEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientEditRecord | null;
  onUpdated?: () => void | Promise<void>;
  onDeleted?: () => void | Promise<void>;
};

function buildDefaultClientCreateForm(): ClientCreateFormState {
  return {
    name: '',
    phone: '',
    email: '',
    address: '',
    company: '',
    sourcePrimary: '',
    ownerId: '',
    notes: '',
    createCase: false,
    caseTitle: '',
  };
}

function trimForm(form: ClientCreateFormState) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    address: form.address.trim(),
    company: form.company.trim(),
    sourcePrimary: form.sourcePrimary.trim(),
    ownerId: form.ownerId.trim(),
    notes: form.notes.trim(),
    createCase: form.createCase,
    caseTitle: form.caseTitle.trim(),
  };
}

function readCreatedClientId(result: unknown) {
  const row = (result || {}) as Record<string, any>;
  return String(
    row.id
    || row.clientId
    || row.client_id
    || row.client?.id
    || row.data?.id
    || row.data?.client?.id
    || row.row?.id
    || ''
  ).trim();
}

function fieldInputClassName() {
  return 'forteca-frt-029-input';
}

function iconForField(Icon: LucideIcon) {
  return <Icon aria-hidden="true" className="forteca-frt-029-input-icon" data-forteca-frt-029-icon="true" />;
}

export default function ClientCreateDialog({ open, onOpenChange, onCreated }: ClientCreateDialogProps) {
  const navigate = useNavigate();
  const { workspace, profile, hasAccess } = useWorkspace();
  const [form, setForm] = useState<ClientCreateFormState>(buildDefaultClientCreateForm);
  const [saving, setSaving] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictCandidates, setConflictCandidates] = useState<EntityConflictCandidate[]>([]);
  const [conflictDraft, setConflictDraft] = useState<ReturnType<typeof trimForm> | null>(null);

  const ownerOptions = useMemo(() => {
    const options = [
      {
        value: String(workspace?.ownerId || '').trim(),
        label: 'Właściciel workspace',
      },
      {
        value: String(profile?.id || '').trim(),
        label: String(profile?.fullName || profile?.email || 'Mój profil').trim(),
      },
    ].filter((option) => option.value);

    return Array.from(new Map(options.map((option) => [option.value, option])).values());
  }, [profile?.email, profile?.fullName, profile?.id, workspace?.ownerId]);

  const updateForm = (patch: Partial<ClientCreateFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const closeAndReset = () => {
    setConflictOpen(false);
    setConflictCandidates([]);
    setConflictDraft(null);
    onOpenChange(false);
    setForm(buildDefaultClientCreateForm());
  };

  const createPreparedClient = async (
    prepared: ReturnType<typeof trimForm>,
    options?: { forceDuplicate?: boolean },
  ) => {
    const clientPayload: ClientCreateInput = {
      name: prepared.name,
      phone: prepared.phone,
      email: prepared.email,
      address: prepared.address,
      company: prepared.company,
      sourcePrimary: prepared.sourcePrimary || undefined,
      ownerId: prepared.ownerId,
      notes: prepared.notes,
      allowDuplicate: Boolean(options?.forceDuplicate),
      workspaceId: requireWorkspaceId(workspace),
    };

    const createdClient = await createClientInSupabase(clientPayload);
    const createdClientId = readCreatedClientId(createdClient);

    if (prepared.createCase) {
      if (!createdClientId) {
        toast.error('Klient zapisany, ale serwer nie zwrócił ID klienta do utworzenia sprawy.');
        closeAndReset();
        return;
      }

      const createdCaseResult = await createStarterCaseForClient({
        title: prepared.caseTitle || `Sprawa: ${prepared.name}`,
        clientId: createdClientId,
        clientName: prepared.name,
        clientEmail: prepared.email,
        clientPhone: prepared.phone,
        primaryForClient: true,
        workspaceId: requireWorkspaceId(workspace),
      });

      if (!createdCaseResult.createdCaseId) {
        toast.error('Klient i sprawa zapisane, ale nie udało się otworzyć edycji finansów.');
        await onCreated?.();
        closeAndReset();
        return;
      }

      await onCreated?.();
      toast.success('Klient i sprawa dodane. Uzupełnij prowizję sprawy.');
      closeAndReset();
      navigate('/cases/' + encodeURIComponent(createdCaseResult.createdCaseId) + '?finance=1&source=client-create');
      return;
    }

    await onCreated?.();
    toast.success('Klient dodany');
    closeAndReset();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) {
      toast.error('Kontekst workspace nie jest jeszcze gotowy.');
      return;
    }

    const prepared = trimForm(form);
    if (!prepared.name) {
      toast.error('Podaj nazwę klienta.');
      return;
    }
    if (!prepared.phone) {
      toast.error('Podaj telefon klienta.');
      return;
    }
    if (!prepared.ownerId) {
      toast.error('Wybierz opiekuna klienta.');
      return;
    }

    try {
      setSaving(true);
      let conflicts: { candidates?: EntityConflictCandidate[] };
      try {
        conflicts = await findEntityConflictsInSupabase({
          targetType: 'client',
          name: prepared.name,
          email: prepared.email,
          phone: prepared.phone,
          company: prepared.company,
          workspaceId,
        });
      } catch {
        toast.error('Nie udało się sprawdzić duplikatów. Zapis klienta zatrzymany, żeby nie dodać konfliktu po cichu.');
        return;
      }

      const candidates = Array.isArray(conflicts?.candidates) ? conflicts.candidates : [];
      if (candidates.length) {
        toast.info('Znaleziono podobny rekord. Zapis klienta wymaga potwierdzenia albo kliknięcia „Dodaj mimo to”.');
        setConflictCandidates(candidates);
        setConflictDraft(prepared);
        onOpenChange(false);
        setForm(buildDefaultClientCreateForm());
        setConflictOpen(true);
        return;
      }

      await createPreparedClient(prepared);
    } catch {
      toast.error('Nie udało się zapisać klienta. Spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAnyway = async () => {
    if (!conflictDraft || saving) return;
    try {
      setSaving(true);
      await createPreparedClient(conflictDraft, { forceDuplicate: true });
      setConflictOpen(false);
      setConflictDraft(null);
      setConflictCandidates([]);
    } catch {
      toast.error('Nie udało się zapisać klienta. Spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreConflict = async (candidate: EntityConflictCandidate) => {
    if (!candidate.canRestore) {
      toast.info('Ten rekord ma historię. Najpierw go otwórz i zdecyduj, co zrobić.');
      return;
    }

    try {
      setSaving(true);
      if (candidate.entityType === 'client') {
        await updateClientInSupabase({ id: candidate.id, archivedAt: null });
        toast.success('Klient przywrócony');
      } else {
        await updateLeadInSupabase({ id: candidate.id, status: 'new', leadVisibility: 'active', salesOutcome: 'open', closedAt: null });
        toast.success('Lead przywrócony');
      }
      setConflictOpen(false);
      setConflictDraft(null);
      setConflictCandidates([]);
      await onCreated?.();
    } catch {
      toast.error('Nie udało się przywrócić rekordu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) setForm(buildDefaultClientCreateForm());
      }}>
        <DialogContent
          className="forteca-frt-029-client-add-dialog"
          data-forteca-frt-029-root="true"
          data-forteca-frt-029-runtime="true"
          data-client-create-dialog-semantic172="true"
          aria-describedby="client-create-frt-029-description"
        >
          <DialogHeader className="forteca-frt-029-dialog-header">
            <DialogTitle>Dodaj klienta</DialogTitle>
            <DialogDescription id="client-create-frt-029-description" className="forteca-frt-029-dialog-description">
              Uzupełnij dane kontaktowe klienta.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="forteca-frt-029-client-add-form" data-client-create-form-semantic172="true" data-forteca-frt-029-form="true">
            <div className="forteca-frt-029-form-fields" data-forteca-frt-029-fields="true">
              <FormField label="Imię i nazwisko / nazwa firmy" required htmlFor="forteca-frt-029-client-name" dataAttrs={{ 'data-forteca-frt-029-field': 'name' }}>
                <Input
                  id="forteca-frt-029-client-name"
                  className={fieldInputClassName()}
                  value={form.name}
                  onChange={(event) => updateForm({ name: event.target.value })}
                  placeholder="Wpisz imię i nazwisko lub nazwę firmy"
                  autoComplete="name"
                  required
                />
              </FormField>

              <FormField label="Telefon" required htmlFor="forteca-frt-029-client-phone" dataAttrs={{ 'data-forteca-frt-029-field': 'phone' }}>
                <div className="forteca-frt-029-input-shell">
                  {iconForField(Phone)}
                  <Input
                    id="forteca-frt-029-client-phone"
                    className={fieldInputClassName()}
                    value={form.phone}
                    onChange={(event) => updateForm({ phone: event.target.value })}
                    placeholder="+48 000 000 000"
                    autoComplete="tel"
                    required
                  />
                </div>
              </FormField>

              <FormField label="E-mail" htmlFor="forteca-frt-029-client-email" dataAttrs={{ 'data-forteca-frt-029-field': 'email' }}>
                <div className="forteca-frt-029-input-shell">
                  {iconForField(Mail)}
                  <Input
                    id="forteca-frt-029-client-email"
                    type="email"
                    className={fieldInputClassName()}
                    value={form.email}
                    onChange={(event) => updateForm({ email: event.target.value })}
                    placeholder="adres@email.pl"
                    autoComplete="email"
                  />
                </div>
              </FormField>

              <FormField label="Adres" htmlFor="forteca-frt-029-client-address" dataAttrs={{ 'data-forteca-frt-029-field': 'address' }}>
                <div className="forteca-frt-029-input-shell">
                  {iconForField(MapPin)}
                  <Input
                    id="forteca-frt-029-client-address"
                    className={fieldInputClassName()}
                    value={form.address}
                    onChange={(event) => updateForm({ address: event.target.value })}
                    placeholder="Ulica, nr domu / lokalu, kod pocztowy, miasto"
                    autoComplete="street-address"
                  />
                </div>
              </FormField>

              <div className="forteca-frt-029-form-row">
                <FormField label="Źródło klienta" htmlFor="forteca-frt-029-client-source" dataAttrs={{ 'data-forteca-frt-029-field': 'source' }}>
                  <div className="forteca-frt-029-select-shell">
                    <select
                      id="forteca-frt-029-client-source"
                      className="forteca-frt-029-select"
                      value={form.sourcePrimary}
                      onChange={(event) => updateForm({ sourcePrimary: event.target.value })}
                    >
                      <option value="">Wybierz źródło</option>
                      {CLIENT_SOURCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                </FormField>

                <FormField label="Przypisany opiekun" required htmlFor="forteca-frt-029-client-owner" dataAttrs={{ 'data-forteca-frt-029-field': 'owner' }}>
                  <div className="forteca-frt-029-select-shell forteca-frt-029-select-shell--owner">
                    <UserRound aria-hidden="true" className="forteca-frt-029-input-icon" data-forteca-frt-029-icon="true" />
                    <select
                      id="forteca-frt-029-client-owner"
                      className="forteca-frt-029-select forteca-frt-029-select--with-icon"
                      value={form.ownerId}
                      onChange={(event) => updateForm({ ownerId: event.target.value })}
                      required
                    >
                      <option value="">Wybierz opiekuna</option>
                      {ownerOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                </FormField>
              </div>

              <TextareaField
                label="Notatka"
                className="forteca-frt-029-field-wide"
                value={form.notes}
                onChange={(event) => updateForm({ notes: event.target.value })}
                placeholder="Dodatkowe informacje o kliencie..."
                rows={4}
                dataAttrs={{ 'data-forteca-frt-029-field': 'notes' }}
              />

              <label className="forteca-frt-029-case-toggle" data-forteca-frt-029-field="create-case">
                <input
                  type="checkbox"
                  checked={form.createCase}
                  onChange={(event) => updateForm({ createCase: event.target.checked })}
                />
                <span className="forteca-frt-029-switch" aria-hidden="true" />
                <span className="forteca-frt-029-case-copy">
                  <strong>Utwórz sprawę od razu</strong>
                  <small>Po zapisaniu klienta zostanie utworzona nowa sprawa.</small>
                </span>
              </label>

              {form.createCase ? (
                <FormField label="Nazwa sprawy" htmlFor="forteca-frt-029-case-title" className="forteca-frt-029-case-title-field">
                  <Input
                    id="forteca-frt-029-case-title"
                    className={fieldInputClassName()}
                    value={form.caseTitle}
                    onChange={(event) => updateForm({ caseTitle: event.target.value })}
                    placeholder="Sprawa: nazwa klienta"
                  />
                </FormField>
              ) : null}
            </div>

            <DialogFooter className={modalFooterClass('forteca-frt-029-dialog-footer')}>
              <Button type="button" variant="outline" onClick={closeAndReset} data-forteca-frt-029-action="cancel">
                Anuluj
              </Button>
              <Button type="submit" disabled={saving || !workspace?.id} data-forteca-frt-029-action="submit">
                {saving ? 'Zapisywanie...' : 'Zapisz klienta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <EntityConflictDialog
        open={conflictOpen}
        onOpenChange={setConflictOpen}
        candidates={conflictCandidates}
        title="Możliwy duplikat"
        description="Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to."
        createAnywayLabel="Dodaj mimo to"
        busy={saving}
        onShow={(candidate) => window.location.assign(candidate.url || (candidate.entityType === 'lead' ? '/leads/' + candidate.id : '/clients/' + candidate.id))}
        onRestore={handleRestoreConflict}
        onCreateAnyway={handleCreateAnyway}
        onCancel={() => {
          if (conflictDraft) setForm({ ...buildDefaultClientCreateForm(), ...conflictDraft });
          setConflictOpen(false);
          onOpenChange(true);
        }}
      />
    </>
  );
}

function buildClientEditForm(client: ClientEditRecord | null): ClientCreateFormState {
  return {
    ...buildDefaultClientCreateForm(),
    name: String(client?.name || ''),
    phone: String(client?.phone || ''),
    email: String(client?.email || ''),
    address: String(client?.address || ''),
    company: String(client?.company || ''),
    sourcePrimary: String(client?.sourcePrimary || client?.source_primary || client?.source || ''),
    ownerId: String(client?.ownerId || client?.owner_id || ''),
    notes: String(client?.notes || client?.note || ''),
  };
}

function trimClientEditForm(form: ClientCreateFormState) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    address: form.address.trim(),
    company: form.company.trim(),
    sourcePrimary: form.sourcePrimary.trim(),
    ownerId: form.ownerId.trim(),
    notes: form.notes.trim(),
  };
}

function getClientEditSaveErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');

  if (message === 'CLIENT_ADDRESS_FIELD_UNAVAILABLE') {
    return 'Błąd zapisu klienta: produkcyjna baza nie ma jeszcze pola „Adres”. Zastosuj migrację FRT-029.';
  }

  if (message === 'CLIENT_OWNER_FIELD_UNAVAILABLE') {
    return 'Błąd zapisu klienta: produkcyjna baza nie ma jeszcze pola „Przypisany opiekun”. Zastosuj migrację FRT-029.';
  }

  return `Błąd zapisu klienta: ${message || 'REQUEST_FAILED'}`;
}

export function ClientEditDialog({ open, onOpenChange, client, onUpdated, onDeleted }: ClientEditDialogProps) {
  const { workspace, profile, hasAccess } = useWorkspace();
  const [form, setForm] = useState<ClientCreateFormState>(() => buildClientEditForm(client));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(buildClientEditForm(client));
  }, [client, open]);

  const ownerOptions = useMemo(() => {
    const options = [
      {
        value: String(workspace?.ownerId || '').trim(),
        label: 'Właściciel workspace',
      },
      {
        value: String(profile?.id || '').trim(),
        label: String(profile?.fullName || profile?.email || 'Mój profil').trim(),
      },
    ].filter((option) => option.value);

    const selectedOwnerId = String(form.ownerId || '').trim();
    if (selectedOwnerId && !options.some((option) => option.value === selectedOwnerId)) {
      options.push({
        value: selectedOwnerId,
        label: String(client?.ownerName || client?.owner || selectedOwnerId).trim(),
      });
    }

    return Array.from(new Map(options.map((option) => [option.value, option])).values());
  }, [client, form.ownerId, profile?.email, profile?.fullName, profile?.id, workspace?.ownerId]);

  const sourceOptions = useMemo(() => {
    const options: Array<{ value: string; label: string; description: string }> = [...CLIENT_SOURCE_OPTIONS];
    const selectedSource = String(form.sourcePrimary || '').trim();
    if (selectedSource && !options.some((option) => option.value === selectedSource)) {
      options.push({
        value: selectedSource,
        label: String(client?.sourceLabel || client?.source || selectedSource).trim(),
        description: 'Źródło zachowane z bieżącego rekordu klienta.',
      });
    }
    return options;
  }, [client, form.sourcePrimary]);

  const updateForm = (patch: Partial<ClientCreateFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const clientId = String(client?.id || '').trim();

    if (!clientId) {
      toast.error('Nie znaleziono ID klienta.');
      return;
    }
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const prepared = trimClientEditForm(form);
    if (!prepared.name) {
      toast.error('Podaj nazwę klienta.');
      return;
    }

    let didUpdate = false;
    try {
      setSaving(true);
      await updateClientInSupabase({
        id: clientId,
        name: prepared.name,
        company: prepared.company,
        email: prepared.email,
        phone: prepared.phone,
        address: prepared.address,
        sourcePrimary: prepared.sourcePrimary || undefined,
        ownerId: prepared.ownerId || null,
        notes: prepared.notes,
        workspaceId: String(workspace?.id || '').trim() || undefined,
      });
      didUpdate = true;
      onOpenChange(false);
      toast.success('Klient zaktualizowany');
    } catch (error: any) {
      toast.error(getClientEditSaveErrorMessage(error));
    } finally {
      setSaving(false);
    }

    if (didUpdate) await onUpdated?.();
  };

  const handleDelete = async () => {
    const clientId = String(client?.id || '').trim();
    if (!clientId) {
      toast.error('Nie znaleziono ID klienta.');
      return;
    }
    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }
    if (!onDeleted) {
      toast.error('Usuwanie klienta nie jest dostępne w tym widoku.');
      return;
    }
    if (typeof window !== 'undefined' && !window.confirm('Zarchiwizować tego klienta?')) return;

    try {
      setSaving(true);
      await onDeleted();
      onOpenChange(false);
      toast.success('Klient zarchiwizowany');
    } catch (error: any) {
      toast.error(`Nie udało się zarchiwizować klienta: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="forteca-frt-030-client-edit-dialog"
        data-forteca-frt-030-root="true"
        data-forteca-frt-030-runtime="true"
        aria-describedby="client-edit-frt-030-description"
      >
        <DialogHeader className="forteca-frt-030-dialog-header">
          <DialogTitle>Edytuj klienta</DialogTitle>
          <DialogDescription id="client-edit-frt-030-description" className="forteca-frt-030-dialog-description">
            Zmień dane klienta i zapisz aktualizację w bieżącym workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="forteca-frt-030-client-edit-form" data-forteca-frt-030-form="true">
          <div className="forteca-frt-030-form-fields" data-forteca-frt-030-fields="true">
            <FormField label="Imię i nazwisko / nazwa firmy" required htmlFor="forteca-frt-030-client-name" dataAttrs={{ 'data-forteca-frt-030-field': 'name' }}>
              <Input
                id="forteca-frt-030-client-name"
                className="forteca-frt-030-input"
                value={form.name}
                onChange={(event) => updateForm({ name: event.target.value })}
                autoComplete="name"
                required
              />
            </FormField>

            <div className="forteca-frt-030-form-row">
              <FormField label="Telefon" htmlFor="forteca-frt-030-client-phone" dataAttrs={{ 'data-forteca-frt-030-field': 'phone' }}>
                <div className="forteca-frt-030-input-shell">
                  <Phone aria-hidden="true" className="forteca-frt-030-input-icon" />
                  <Input
                    id="forteca-frt-030-client-phone"
                    className="forteca-frt-030-input"
                    value={form.phone}
                    onChange={(event) => updateForm({ phone: event.target.value })}
                    autoComplete="tel"
                  />
                </div>
              </FormField>
              <FormField label="E-mail" htmlFor="forteca-frt-030-client-email" dataAttrs={{ 'data-forteca-frt-030-field': 'email' }}>
                <div className="forteca-frt-030-input-shell">
                  <Mail aria-hidden="true" className="forteca-frt-030-input-icon" />
                  <Input
                    id="forteca-frt-030-client-email"
                    type="email"
                    className="forteca-frt-030-input"
                    value={form.email}
                    onChange={(event) => updateForm({ email: event.target.value })}
                    autoComplete="email"
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Adres" htmlFor="forteca-frt-030-client-address" dataAttrs={{ 'data-forteca-frt-030-field': 'address' }}>
              <div className="forteca-frt-030-input-shell">
                <MapPin aria-hidden="true" className="forteca-frt-030-input-icon" />
                <Input
                  id="forteca-frt-030-client-address"
                  className="forteca-frt-030-input"
                  value={form.address}
                  onChange={(event) => updateForm({ address: event.target.value })}
                  autoComplete="street-address"
                />
              </div>
            </FormField>

            <FormField className="forteca-frt-030-field-half" label="Źródło klienta" htmlFor="forteca-frt-030-client-source" dataAttrs={{ 'data-forteca-frt-030-field': 'source' }}>
              <div className="forteca-frt-030-select-shell">
                <select
                  id="forteca-frt-030-client-source"
                  className="forteca-frt-030-select"
                  value={form.sourcePrimary}
                  onChange={(event) => updateForm({ sourcePrimary: event.target.value })}
                >
                  <option value="">Wybierz źródło</option>
                  {sourceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
            </FormField>

            <TextareaField
              label="Notatka"
              value={form.notes}
              onChange={(event) => updateForm({ notes: event.target.value })}
              placeholder="Dodatkowe informacje o kliencie..."
              rows={3}
              className="forteca-frt-030-field-wide"
              textareaClassName="forteca-frt-030-textarea"
              dataAttrs={{ 'data-forteca-frt-030-field': 'notes' }}
            />

            <FormField className="forteca-frt-030-field-half" label="Przypisany opiekun" htmlFor="forteca-frt-030-client-owner" dataAttrs={{ 'data-forteca-frt-030-field': 'owner' }}>
              <div className="forteca-frt-030-select-shell">
                <UserRound aria-hidden="true" className="forteca-frt-030-input-icon" />
                <select
                  id="forteca-frt-030-client-owner"
                  className="forteca-frt-030-select forteca-frt-030-select--with-icon"
                  value={form.ownerId}
                  onChange={(event) => updateForm({ ownerId: event.target.value })}
                >
                  <option value="">Wybierz opiekuna</option>
                  {ownerOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
            </FormField>
          </div>

          <DialogFooter className="forteca-frt-030-dialog-footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving} data-forteca-frt-030-action="cancel">
              Anuluj
            </Button>
            <Button type="button" variant="destructive" className="forteca-frt-030-delete-button" onClick={() => void handleDelete()} disabled={saving} data-forteca-frt-030-action="delete">
              Usuń klienta
            </Button>
            <Button type="submit" disabled={saving || !client?.id} data-forteca-frt-030-action="submit">
              {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
