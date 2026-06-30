import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { createClientInSupabase, fetchClientsFromSupabase } from '../lib/supabase-fallback';
import { createStarterCaseForClient } from '../lib/cases/create-client-case';
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
import { Label } from './ui/label';
import { TextareaField } from './ui/textarea-field';
import { modalFooterClass } from './entity-actions';
import '../styles/visual-stage20-lead-form-vnext.css';
import '../styles/closeflow-global-client-create-dialog-stage172.css';

const STAGE228R5R6_ACTIVE_CLIENT_CREATE_DIALOG_FINANCE_REDIRECT = 'active ClientCreateDialog creates empty starter case and opens CaseDetail finance modal';
const CLOSEFLOW_CZ2_013_CLIENT_CREATE_FORM_VARIANTS = 'ClientCreateDialog scoped migration uses FormField/TextareaField source of truth';
void STAGE228R5R6_ACTIVE_CLIENT_CREATE_DIALOG_FINANCE_REDIRECT;
void CLOSEFLOW_CZ2_013_CLIENT_CREATE_FORM_VARIANTS;

type ClientCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ClientCreateFormState = {
  name: string;
  phone: string;
  email: string;
  company: string;
  notes: string;
  createCase: boolean;
  caseTitle: string;
};

const defaultClientCreateForm: ClientCreateFormState = {
  name: '',
  phone: '',
  email: '',
  company: '',
  notes: '',
  createCase: false,
  caseTitle: '',
};

function trimForm(form: ClientCreateFormState) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    company: form.company.trim(),
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

async function resolveCreatedClientIdFromList(input: {
  idFromCreate?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}) {
  if (input.idFromCreate) return input.idFromCreate;

  const rows = await fetchClientsFromSupabase({ includeArchived: true }).catch(() => []);
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedPhone = input.phone.trim().replace(/\s+/g, '');
  const normalizedName = input.name.trim().toLowerCase();
  const normalizedCompany = input.company.trim().toLowerCase();

  const match = (rows as Record<string, unknown>[]).find((client) => {
    const email = String(client.email || '').trim().toLowerCase();
    const phone = String(client.phone || '').trim().replace(/\s+/g, '');
    const name = String(client.name || '').trim().toLowerCase();
    const company = String(client.company || '').trim().toLowerCase();

    if (normalizedEmail && email === normalizedEmail) return true;
    if (normalizedPhone && phone === normalizedPhone) return true;
    if (normalizedName && name === normalizedName && (!normalizedCompany || company === normalizedCompany)) return true;
    return false;
  });

  return String(match?.id || '').trim();
}

export default function ClientCreateDialog({ open, onOpenChange }: ClientCreateDialogProps) {
  const navigate = useNavigate();
  const { workspace, hasAccess } = useWorkspace();
  const [form, setForm] = useState<ClientCreateFormState>(defaultClientCreateForm);
  const [saving, setSaving] = useState(false);

  const updateForm = (patch: Partial<ClientCreateFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const closeAndReset = () => {
    onOpenChange(false);
    setForm(defaultClientCreateForm);
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

    try {
      setSaving(true);

      const createdClient = await createClientInSupabase({
        name: prepared.name,
        phone: prepared.phone,
        email: prepared.email,
        company: prepared.company,
        notes: prepared.notes,
        workspaceId,
      });

      let clientId = await resolveCreatedClientIdFromList({
        idFromCreate: readCreatedClientId(createdClient),
        name: prepared.name,
        email: prepared.email,
        phone: prepared.phone,
        company: prepared.company,
      });

      if (prepared.createCase) {
        if (!clientId) {
          toast.error('Klient zapisany, ale nie udało się ustalić ID klienta do utworzenia sprawy.');
          closeAndReset();
          return;
        }

        const caseTitle = prepared.caseTitle || `Sprawa: ${prepared.name}`;
        let createdCaseId = '';

        const createdCaseResult = await createStarterCaseForClient({
          title: caseTitle,
          clientId,
          clientName: prepared.name,
          clientEmail: prepared.email,
          clientPhone: prepared.phone,
          primaryForClient: true,
          workspaceId,
        });

        createdCaseId = createdCaseResult.createdCaseId;

        if (!createdCaseId) {
          toast.error('Klient i sprawa zapisane, ale nie udało się otworzyć edycji finansów.');
          closeAndReset();
          return;
        }

        toast.success('Klient i sprawa dodane. Uzupełnij prowizję sprawy.');
        closeAndReset();
        navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create');
        return;
      }

      toast.success('Klient dodany');
      closeAndReset();
    } catch (error: any) {
      toast.error('Nie udało się zapisać klienta. Spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      onOpenChange(nextOpen);
      if (!nextOpen) setForm(defaultClientCreateForm);
    }}>
      <DialogContent
        className="lead-form-vnext-content cf-stage172-client-create-dialog"
        data-client-create-dialog-stage172="true"
        data-stage228r5r6-active-client-create-dialog-finance-redirect="true"
        aria-describedby="client-create-stage172-description"
      >
        <DialogHeader className="lead-form-vnext-header">
          <div>
            <DialogTitle>Nowy klient</DialogTitle>
            <DialogDescription id="client-create-stage172-description" data-stage171-hidden-copy="true">
              Formularz dodania klienta.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="lead-form-vnext cf-stage172-client-create-form" data-client-create-form-stage172="true">
          <section className="lead-form-section lead-form-primary-section">
            <div className="lead-form-grid">
              <FormField label="Nazwa / klient" required className="lead-form-field-wide" dataAttrs={{ 'data-cf-form-scoped-migration': 'client-name' }}>
                <Input
                  value={form.name}
                  onChange={(event) => updateForm({ name: event.target.value })}
                  placeholder="Np. Jan Kowalski albo Firma ABC"
                  required
                />
              </FormField>

              <FormField label="Telefon" dataAttrs={{ 'data-cf-form-scoped-migration': 'client-phone' }}>
                <Input
                  value={form.phone}
                  onChange={(event) => updateForm({ phone: event.target.value })}
                  placeholder="np. 516 000 000"
                />
              </FormField>

              <FormField label="E-mail" dataAttrs={{ 'data-cf-form-scoped-migration': 'client-email' }}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm({ email: event.target.value })}
                  placeholder="kontakt@email.pl"
                />
              </FormField>

              <div className="lead-form-field lead-form-field-wide">
                <Label>Firma</Label>
                <Input
                  value={form.company}
                  onChange={(event) => updateForm({ company: event.target.value })}
                  placeholder="Opcjonalnie"
                />
              </div>

              <TextareaField
                label="Notatka"
                className="lead-form-field-wide"
                value={form.notes}
                onChange={(event) => updateForm({ notes: event.target.value })}
                placeholder="Krótki kontekst relacji, źródło albo ważna informacja."
                dataAttrs={{ 'data-cf-form-scoped-migration': 'client-notes' }}
              />
            </div>
          </section>

          <section className="lead-form-section cf-stage172-case-option" data-client-create-case-option-stage172="true">
            <label className="lead-form-checkbox cf-stage172-create-case-checkbox">
              <input
                type="checkbox"
                checked={form.createCase}
                onChange={(event) => updateForm({ createCase: event.target.checked })}
              />
              <span>
                <strong>Utwórz sprawę od razu</strong>
                <small>Po zapisie otworzymy sprawę i okno „Prowizja sprawy”.</small>
              </span>
            </label>

            {form.createCase ? (
              <div className="lead-form-grid cf-stage172-case-fields">
                <div className="lead-form-field lead-form-field-wide">
                  <Label>Nazwa sprawy</Label>
                  <Input
                    value={form.caseTitle}
                    onChange={(event) => updateForm({ caseTitle: event.target.value })}
                    placeholder="Np. Obsługa klienta / projekt / temat"
                  />
                </div>
              </div>
            ) : null}
          </section>

          <DialogFooter className={modalFooterClass('lead-form-footer cf-stage172-client-create-footer')}>
            <Button type="button" variant="outline" onClick={closeAndReset}>
              Anuluj
            </Button>
            <Button type="submit" disabled={saving || !workspace?.id}>
              {saving ? 'Zapisywanie...' : 'Zapisz klienta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
