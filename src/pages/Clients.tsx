// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  Link
} from 'react-router-dom';
import {
  CaseEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  PaymentEntityIcon
} from '../components/ui-system';
import {
  AlertTriangle,
  Loader2,
  Plus,
  Search,
  Trash2
} from 'lucide-react';

// CLOSEFLOW_CLIENT_CONFLICT_RESOLUTION_V1
import {
  RotateCcw
} from 'lucide-react';
import {
  toast
} from 'sonner';

import Layout from '../components/Layout';
import {
  EntityConflictDialog,
  type EntityConflictCandidate
} from '../components/EntityConflictDialog';
import {
  actionIconClass,
  modalFooterClass
} from '../components/entity-actions';
import {
  StatShortcutCard
} from '../components/StatShortcutCard';
import {
  OperatorSideCard,
  SimpleFiltersCard
} from '../components/operator-rail';
import {
  Button
} from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import {
  Input
} from '../components/ui/input';
import {
  Label
} from '../components/ui/label';
import {
  useWorkspace
} from '../hooks/useWorkspace';
import {
  requireWorkspaceId
} from '../lib/workspace-context';
import {
  createClientInSupabase,
  findEntityConflictsInSupabase,
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  updateClientInSupabase,
  updateLeadInSupabase
} from '../lib/supabase-fallback';
import {
  getNearestPlannedAction
} from '../lib/work-items/planned-actions';
import '../styles/visual-stage23-client-case-forms-vnext.css';
import '../styles/clients-next-action-layout.css';

import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-record-list-source-truth.css';
const CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS = 'CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS';
const STAGE30_CLIENTS_TRASH_COPY_REMOVED = 'STAGE30_CLIENTS_TRASH_COPY_REMOVED';

type ClientRecord = {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  archivedAt?: string | null;
};
const STAGE35_REAL_CLIENT_VALUE = 'STAGE35_REAL_CLIENT_VALUE';

function getStage35NumericValue(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const normalized = String(value || '').replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getStage35FirstMoneyValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = getStage35NumericValue(row[key]);
    if (value > 0) return value;
  }
  return 0;
}

function getStage35RelationClientId(row: Record<string, unknown>) {
  return String(row.clientId || row.client_id || row.customerId || row.customer_id || '').trim();
}

function formatClientMoney(value: number) {
  return `${Math.round(Number(value || 0)).toLocaleString('pl-PL')} PLN`;
}

const CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_ETAP10 = 'nearest action is full-width before client card buttons';

const CLOSEFLOW_CLIENT_VALUE_EXPECTED_NOT_PAID_V29 = 'client list shows expected relation value, not paid amount only';

const STAGE29_EXPECTED_VALUE_KEYS = [
  'expectedRevenue',
  'expected_revenue',
  'caseValue',
  'case_value',
  'dealValue',
  'deal_value',
  'value',
  'estimatedValue',
  'estimated_value',
  'budget',
  'price',
  'total',
  'totalValue',
  'total_value',
  'grossAmount',
  'gross_amount',
  'netAmount',
  'net_amount',
];

const STAGE29_PAID_VALUE_KEYS = ['paidAmount', 'paid_amount', 'amountPaid', 'amount_paid'];
const STAGE29_REMAINING_VALUE_KEYS = ['remainingAmount', 'remaining_amount', 'leftAmount', 'left_amount'];

function getStage29ExpectedCaseValue(row: Record<string, unknown>) {
  const explicit = getStage35FirstMoneyValue(row, STAGE29_EXPECTED_VALUE_KEYS);
  if (explicit > 0) return explicit;
  const paid = getStage35FirstMoneyValue(row, STAGE29_PAID_VALUE_KEYS);
  const remaining = getStage35FirstMoneyValue(row, STAGE29_REMAINING_VALUE_KEYS);
  return paid + remaining > 0 ? paid + remaining : 0;
}

const STAGE35_MONEY_KEYS = [
  'amount',
  'value',
  'dealValue',
  'deal_value',
  'estimatedValue',
  'estimated_value',
  'budget',
  'price',
  'total',
  'grossAmount',
  'gross_amount',
  'netAmount',
  'net_amount',
  'commission',
  'commissionAmount',
  'commission_amount',
];

const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT_STAGE6_CLIENTS = 'form/modal actions use shared cf-form-actions and cf-modal-footer contract';
const CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL = 'lead and client duplicate warning modal before write';
const CLOSEFLOW_A2_CLIENT_DUPLICATE_WARNING_BEFORE_WRITE = 'client duplicate warning before write';
const STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY = 'Brak leadów wymagających spięcia.';

export default function Clients() {
  const { workspace, hasAccess, loading: workspaceLoading } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPending, setCreatePending] = useState(false);
  const [archivePendingId, setArchivePendingId] = useState<string | null>(null);
  const [clientConflictOpen, setClientConflictOpen] = useState(false);
  const [clientConflictCandidates, setClientConflictCandidates] = useState<EntityConflictCandidate[]>([]);
  const [clientConflictPendingInput, setClientConflictPendingInput] = useState<any | null>(null);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '', notes: '' });

  const reload = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [clientRows, leadRows, caseRows, paymentRows, taskRows, eventRows] = await Promise.all([
        fetchClientsFromSupabase(),
        fetchLeadsFromSupabase().catch(() => []),
        fetchCasesFromSupabase().catch(() => []),
        fetchPaymentsFromSupabase().catch(() => []),
        fetchTasksFromSupabase().catch(() => []),
        fetchEventsFromSupabase().catch(() => []),
      ]);
      setClients(clientRows as ClientRecord[]);
      setLeads(leadRows as any[]);
      setCases(caseRows as any[]);
      setPayments(paymentRows as any[]);
      setTasks(taskRows as any[]);
      setEvents(eventRows as any[]);
    } catch (error: any) {
      toast.error(`Błąd odczytu klientów: ${error?.message || 'REQUEST_FAILED'}`);
    } finally {
      setLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => {
    if (workspaceLoading || !workspace?.id) {
      setLoading(workspaceLoading);
      return;
    }
    void reload();
  }, [reload, workspace?.id, workspaceLoading]);

  const activeCount = useMemo(() => clients.filter((client) => !client.archivedAt).length, [clients]);
  const archivedCount = useMemo(() => clients.filter((client) => Boolean(client.archivedAt)).length, [clients]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients
      .filter((client) => (showArchived ? Boolean(client.archivedAt) : !client.archivedAt))
      .filter((client) => {
        if (!query) return true;
        return [client.name, client.company, client.email, client.phone].some((entry) => String(entry || '').toLowerCase().includes(query));
      })
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pl'));
  }, [clients, search, showArchived]);

  const countersByClientId = useMemo(() => {
    const map = new Map<string, { leads: number; cases: number; payments: number }>();
    const touch = (clientId: string) => {
      if (!map.has(clientId)) map.set(clientId, { leads: 0, cases: 0, payments: 0 });
      return map.get(clientId)!;
    };
    for (const lead of leads) {
      const clientId = getStage35RelationClientId(lead);
      if (!clientId) continue;
      touch(clientId).leads += 1;
    }
    for (const caseRecord of cases) {
      const clientId = getStage35RelationClientId(caseRecord);
      if (!clientId) continue;
      touch(clientId).cases += 1;
    }
    for (const payment of payments) {
      const clientId = getStage35RelationClientId(payment);
      if (!clientId) continue;
      touch(clientId).payments += 1;
    }
    return map;
  }, [cases, leads, payments]);

  const paymentValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const payment of payments as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(payment);
      if (!clientId) continue;
      const amount = getStage35FirstMoneyValue(payment, STAGE35_MONEY_KEYS);
      map.set(clientId, (map.get(clientId) || 0) + amount);
    }
    return map;
  }, [payments]);

  const caseValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const caseRow of cases as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(caseRow);
      if (!clientId) continue;
      const value = getStage29ExpectedCaseValue(caseRow);
      map.set(clientId, (map.get(clientId) || 0) + value);
    }
    return map;
  }, [cases]);

  const leadValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const lead of leads as Record<string, unknown>[]) {
      const clientId = getStage35RelationClientId(lead);
      if (!clientId) continue;
      const value = getStage35FirstMoneyValue(lead, STAGE35_MONEY_KEYS);
      map.set(clientId, (map.get(clientId) || 0) + value);
    }
    return map;
  }, [leads]);

  const clientFieldValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const client of clients as Record<string, unknown>[]) {
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      map.set(clientId, getStage35FirstMoneyValue(client, STAGE35_MONEY_KEYS));
    }
    return map;
  }, [clients]);

  const clientValueByClientId = useMemo(() => {
    const map = new Map<string, number>();
    for (const client of clients) {
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      const paymentValue = paymentValueByClientId.get(clientId) || 0;
      const caseValue = caseValueByClientId.get(clientId) || 0;
      const leadValue = leadValueByClientId.get(clientId) || 0;
      const fallbackClientValue = clientFieldValueByClientId.get(clientId) || 0;
      const expectedValue = caseValue > 0
        ? caseValue
        : leadValue > 0
          ? leadValue
          : fallbackClientValue;
      const finalValue = expectedValue > 0 ? expectedValue : paymentValue;
      map.set(clientId, finalValue);
    }
    return map;
  }, [caseValueByClientId, clientFieldValueByClientId, clients, leadValueByClientId, paymentValueByClientId]);

  const nearestActionByClientId = useMemo(() => {
    const map = new Map<string, string>();
    for (const client of clients) {
      const clientId = String(client.id || '').trim();
      if (!clientId) continue;
      const relatedLeadIds = (leads as Record<string, unknown>[])
        .filter((lead) => getStage35RelationClientId(lead) === clientId)
        .map((lead) => String(lead.id || '').trim())
        .filter(Boolean);
      const relatedCaseIds = (cases as Record<string, unknown>[])
        .filter((caseRow) => getStage35RelationClientId(caseRow) === clientId)
        .map((caseRow) => String(caseRow.id || '').trim())
        .filter(Boolean);
      const nearest = getNearestPlannedAction({
        recordType: 'client',
        recordId: clientId,
        relatedLeadIds,
        relatedCaseIds,
        items: [...tasks, ...events],
      });
      if (!nearest) {
        map.set(clientId, 'Brak zaplanowanej akcji');
        continue;
      }
      const parsed = new Date(nearest.when);
      const dateLabel = Number.isNaN(parsed.getTime())
        ? nearest.when
        : parsed.toLocaleString('pl-PL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      map.set(clientId, `${nearest.title} · ${dateLabel}`);
    }
    return map;
  }, [cases, clients, events, leads, tasks]);

  const clientsWithCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) > 0).length,
    [clients, countersByClientId],
  );
  const clientsWithoutCases = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.cases || 0) === 0).length,
    [clients, countersByClientId],
  );
  const relationValue = useMemo(
    () => clients.filter((client) => !client.archivedAt).reduce((sum, client) => sum + (clientValueByClientId.get(client.id) || 0), 0),
    [clientValueByClientId, clients],
  );
  const staleClients = useMemo(
    () => clients.filter((client) => !client.archivedAt && (countersByClientId.get(client.id)?.leads || 0) === 0).length,
    [clients, countersByClientId],
  );

  const leadsNeedingClientOrCaseLink = useMemo(() => {
    // STAGE74_CLIENTS_LEADS_TO_LINK_PANEL: this rail is about lead records that still need relation cleanup.
    // It must not render client records under the lead attention operational card.
    const caseLeadIds = new Set<string>();
    const caseClientIds = new Set<string>();

    for (const caseRow of cases as Record<string, unknown>[]) {
      const caseLeadId = String(caseRow.leadId || caseRow.lead_id || caseRow.linkedLeadId || caseRow.linked_lead_id || '').trim();
      const caseClientId = getStage35RelationClientId(caseRow);
      if (caseLeadId) caseLeadIds.add(caseLeadId);
      if (caseClientId) caseClientIds.add(caseClientId);
    }

    return (leads as Record<string, unknown>[])
      .filter((lead) => {
        const status = String(lead.status || '').trim().toLowerCase();
        const visibility = String(lead.leadVisibility || lead.lead_visibility || '').trim().toLowerCase();
        if (status === 'archived' || visibility === 'trash') return false;

        const leadId = String(lead.id || '').trim();
        const clientId = getStage35RelationClientId(lead);
        const hasCase = Boolean((leadId && caseLeadIds.has(leadId)) || (clientId && caseClientIds.has(clientId)));

        return !clientId || !hasCase;
      })
      .slice(0, 5);
  }, [cases, leads]);

  const resetNewClientForm = () => { setNewClient({ name: '', company: '', email: '', phone: '', notes: '' }); };

  const createClientFromPreparedInput = async (preparedClient: any, options?: { forceDuplicate?: boolean }) => {
    // CLOSEFLOW_A2_CLIENT_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP
    await createClientInSupabase({ ...preparedClient, allowDuplicate: Boolean(options?.forceDuplicate), workspaceId: requireWorkspaceId(workspace) });
    toast.success('Klient dodany');
    setIsCreateOpen(false);
    resetNewClientForm();
    await reload();
  };

  const restoreClientConflictCandidate = async (candidate: EntityConflictCandidate) => {
    if (!candidate.canRestore) { toast.info('Ten rekord ma historię. Najpierw go otwórz i zdecyduj, co zrobić.'); return; }
    try {
      setCreatePending(true);
      if (candidate.entityType === 'client') { await updateClientInSupabase({ id: candidate.id, archivedAt: null }); toast.success('Klient przywrócony'); }
      else { await updateLeadInSupabase({ id: candidate.id, status: 'new', leadVisibility: 'active', salesOutcome: 'open', closedAt: null }); toast.success('Lead przywrócony'); }
      setClientConflictOpen(false);
      await reload();
    } catch (error: any) { toast.error('Nie udało się przywrócić rekordu: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setCreatePending(false); }
  };

  const handleCreateClient = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasAccess) { toast.error('Twój trial wygasł.'); return; }
    if (!newClient.name.trim()) { toast.error('Podaj nazwę klienta.'); return; }
    if (!workspace?.id) { toast.error('Kontekst workspace nie jest jeszcze gotowy.'); return; }
    const workspaceId = requireWorkspaceId(workspace);
    if (!workspaceId) { toast.error('Kontekst workspace nie jest jeszcze gotowy.'); return; }
    const preparedClient = { ...newClient, name: newClient.name.trim(), company: newClient.company.trim(), email: newClient.email.trim(), phone: newClient.phone.trim() };
    try {
      setCreatePending(true);
      const conflicts = await findEntityConflictsInSupabase({ targetType: 'client', name: preparedClient.name, email: preparedClient.email, phone: preparedClient.phone, company: preparedClient.company, workspaceId }).catch(() => ({ candidates: [] }));
      const candidates = Array.isArray(conflicts.candidates) ? conflicts.candidates as EntityConflictCandidate[] : [];
      if (candidates.length) { setClientConflictCandidates(candidates); setClientConflictPendingInput(preparedClient); setIsCreateOpen(false); setClientConflictOpen(true); return; }
      await createClientFromPreparedInput(preparedClient);
    } catch (error: any) { toast.error('Nie udało się zapisać. Spróbuj ponownie.'); }
    finally { setCreatePending(false); }
  };

  const handleCreateClientAnyway = async () => {
    if (!clientConflictPendingInput || createPending) return;
    try { setCreatePending(true); await createClientFromPreparedInput(clientConflictPendingInput, { forceDuplicate: true }); setClientConflictOpen(false); setClientConflictPendingInput(null); setClientConflictCandidates([]); }
    catch (error: any) { toast.error('Nie udało się zapisać. Spróbuj ponownie.'); }
    finally { setCreatePending(false); }
  };

  const handleArchiveClient = async (
    event: MouseEvent<HTMLButtonElement>,
    client: ClientRecord,
    counters: { leads: number; cases: number; payments: number },
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    const relationCount = counters.leads + counters.cases + counters.payments;
    const relationText = relationCount > 0
      ? '\n\nTen klient ma powiązania: leady ' + counters.leads + ', sprawy ' + counters.cases + ', rozliczenia ' + counters.payments + '. Rekord zniknie z aktywnej listy, ale dane nie zostaną trwale skasowane.'
      : '\n\nRekord zniknie z aktywnej listy, ale będzie można go przywrócić z kosza.';

    if (!window.confirm('Przenieść klienta do kosza: ' + (client.name || 'Klient') + '?' + relationText)) return;

    try {
      setArchivePendingId(client.id);
      await updateClientInSupabase({ id: client.id, archivedAt: new Date().toISOString() });
      toast.success('Klient przeniesiony do kosza');
      await reload();
    } catch (error: any) {
      toast.error('Błąd przenoszenia klienta do kosza: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  const handleRestoreClient = async (event: MouseEvent<HTMLButtonElement>, client: ClientRecord) => {
    event.preventDefault();
    event.stopPropagation();

    if (!hasAccess) {
      toast.error('Twój trial wygasł.');
      return;
    }

    if (!window.confirm('Przywrócić klienta do aktywnej listy: ' + (client.name || 'Klient') + '?')) return;

    try {
      setArchivePendingId(client.id);
      await updateClientInSupabase({ id: client.id, archivedAt: null });
      toast.success('Klient przywrócony');
      await reload();
    } catch (error: any) {
      toast.error('Błąd przywracania klienta: ' + (error?.message || 'REQUEST_FAILED'));
    } finally {
      setArchivePendingId(null);
    }
  };

  return (
    <Layout>
      <div className="cf-html-view main-clients-html" data-clients-real-view="true">
        <EntityConflictDialog
          open={clientConflictOpen}
          onOpenChange={setClientConflictOpen}
          candidates={clientConflictCandidates}
          title="Możliwy duplikat"
          description="Znaleziono podobny rekord po e-mailu, telefonie, nazwie albo firmie. Sprawdź go przed zapisem albo świadomie dodaj mimo to."
          createAnywayLabel="Dodaj mimo to"
          busy={createPending}
          onShow={(candidate) => window.location.assign(candidate.url || (candidate.entityType === 'lead' ? '/leads/' + candidate.id : '/clients/' + candidate.id))}
          onRestore={restoreClientConflictCandidate}
          onCreateAnyway={handleCreateClientAnyway}
          onCancel={() => { setClientConflictOpen(false); setIsCreateOpen(true); }}
        />
        <CloseFlowPageHeaderV2
          pageKey="clients"
          actions={
            <>
              <div className="head-actions">
                          <Button type="button" variant="outline" className="btn soft-blue" data-cf-header-action="ai">? Zapytaj AI</Button>
                          <Button type="button" variant="outline" className="btn" onClick={() => setShowArchived((current) => !current)}>
                            {showArchived ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                            {showArchived ? 'Pokaż aktywnych' : 'Kosz'}
                            <span className="pill">{showArchived ? activeCount : archivedCount}</span>
                          </Button>
                          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                              <Button className="btn primary" disabled={!workspace?.id}><Plus className="w-4 h-4" /> Dodaj klienta</Button>
                            </DialogTrigger>
                            <DialogContent className="client-case-form-content client-form-stage23-content" data-client-form-stage23="true" data-client-case-form-visual-rebuild={CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS}>
                              <DialogHeader className="client-case-form-header">
                                <span className="client-case-form-kicker">KLIENT</span>
                                <DialogTitle>Nowy klient</DialogTitle>
                                <p>Dodaj tylko najważniejsze dane kontaktowe. Resztę można uzupełnić później.</p>
                              </DialogHeader>

                              <form onSubmit={handleCreateClient} className="client-case-form" data-client-form-fields="contact">
                                <section className="client-case-form-section">
                                  <div className="client-case-form-section-head">
                                    <h3>Dane podstawowe</h3>
                                    <p>Minimum potrzebne do zapisania klienta i rozpoczęcia sprawy.</p>
                                  </div>

                                  <div className="client-case-form-grid">
                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Imię / nazwa</Label>
                                      <Input
                                        value={newClient.name}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, name: event.target.value }))}
                                        placeholder="Np. Jan Kowalski albo Firma ABC"
                                        required
                                      />
                                    </div>

                                    <div className="client-case-form-field">
                                      <Label>Telefon</Label>
                                      <Input
                                        value={newClient.phone}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, phone: event.target.value }))}
                                        placeholder="np. 516 000 000"
                                      />
                                    </div>

                                    <div className="client-case-form-field">
                                      <Label>E-mail</Label>
                                      <Input
                                        type="email"
                                        value={newClient.email}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, email: event.target.value }))}
                                        placeholder="kontakt@email.pl"
                                      />
                                    </div>

                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Firma</Label>
                                      <Input
                                        value={newClient.company}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, company: event.target.value }))}
                                        placeholder="Opcjonalnie"
                                      />
                                    </div>

                                    <div className="client-case-form-field client-case-form-field-wide">
                                      <Label>Notatka</Label>
                                      <textarea
                                        className="client-case-form-textarea"
                                        value={newClient.notes}
                                        onChange={(event) => setNewClient((prev) => ({ ...prev, notes: event.target.value }))}
                                        placeholder="Krótki kontekst relacji, źródło albo ważna informacja."
                                      />
                                    </div>
                                  </div>
                                </section>

                                <DialogFooter className={modalFooterClass('client-case-form-footer')}>
                                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Anuluj
                                  </Button>
                                  <Button type="submit" disabled={createPending}>
                                    {createPending ? 'Zapisywanie...' : 'Zapisz klienta'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
            </>
          }
        />

        <div className="grid-4">
          <StatShortcutCard
            label="Aktywni"
            value={activeCount}
            icon={LeadEntityIcon}
            active={!showArchived}
            onClick={() => setShowArchived(false)}
            title="Pokaż aktywnych klientów"
            ariaLabel="Pokaż aktywnych klientów"
            tone="blue"
            helper="z otwartą sprawą"
          />
          <StatShortcutCard
            label="Bez sprawy"
            value={clientsWithoutCases}
            icon={CaseEntityIcon}
            onClick={() => setShowArchived(false)}
            title="Pokaż klientów bez sprawy"
            ariaLabel="Pokaż klientów bez sprawy"
            tone="neutral"
            helper="tylko kontakt"
          />
          <StatShortcutCard
            label="Wartość"
            value={formatClientMoney(relationValue)}
            icon={PaymentEntityIcon}
            onClick={() => setShowArchived(false)}
            title="Pokaż wartość relacji"
            ariaLabel="Pokaż wartość relacji"
            tone="green"
            helper="w relacjach"
          />
          <StatShortcutCard
            label="Bez ruchu"
            value={staleClients}
            icon={AlertTriangle}
            onClick={() => setShowArchived(false)}
            title="Pokaż klientów bez ruchu"
            ariaLabel="Pokaż klientów bez ruchu"
            tone="red"
            helper="do sprawdzenia"
          />
        </div>

        <div className="layout-list w-full max-w-none" data-clients-wide-layout="true">
          <div className="stack">
            <div className="search">
              <span aria-hidden="true"><Search className="w-4 h-4" /></span>
              <Input placeholder={showArchived ? 'Szukaj w koszu klientów...' : 'Szukaj klienta, telefonu, maila, firmy albo sprawy...'} value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>

            {loading ? (
              <div className="table-card w-full max-w-none"><div className="row row-empty"><span className="index"><Loader2 className="w-4 h-4 animate-spin" /></span><span><span className="title">Ładowanie klientów</span><span className="sub">Pobieram dane z aplikacji.</span></span></div></div>
            ) : filtered.length === 0 ? (
              <div className="table-card w-full max-w-none"><div className="row row-empty"><span className="index">0</span><span><span className="title">{showArchived ? 'Kosz klientów jest pusty.' : 'Brak klientów do wyświetlenia.'}</span></span></div></div>
            ) : (
              <div className="table-card w-full max-w-none">
                {filtered.map((client, index) => {
                   const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
                   const isArchived = Boolean(client.archivedAt);
                   const clientValue = clientValueByClientId.get(client.id) || 0;
                   return (
                     <div key={client.id} className="relative group/client-card w-full" data-client-card-wide-layout="true">
                       <Link to={`/clients/${client.id}`} className="block">
                         <div className="row client-row cf-client-row-inline">
                         <span className="index">{index + 1}</span>
                         <span className="lead-main-cell min-w-0 cf-client-main-cell">
                           <span className="title">{client.name || 'Klient'}</span>
                           <span className="cf-list-row-meta">
                             <span className="sub">{client.company || 'Bez firmy'}</span>
                             <span className="cf-list-row-contact">{[client.email, client.phone].filter(Boolean).join(' · ') || 'brak kontaktu'}</span>
                             <span className="cf-list-row-value">{formatClientMoney(clientValue)}</span>
                           </span>
                           <span className="statusline">
                             {isArchived ? <span className="cf-status-pill" data-cf-status-tone="amber">W koszu</span> : counters.cases > 0 ? <span className="cf-status-pill cf-chip-case-active" data-cf-status-tone="green">Aktywna sprawa</span> : <span className="cf-status-pill cf-chip-no-case">Bez sprawy</span>}
                             <span className="cf-status-pill cf-chip-leads-count" data-cf-status-tone="blue">Leady: {counters.leads}</span>
                             <span className="cf-list-row-value cf-chip-client-value">Wartość: {formatClientMoney(clientValue)}</span>
                             <span className="pill cf-chip-last-contact">Ostatni kontakt: {counters.payments > 0 ? 'jest' : 'brak'}</span>
                           </span>
                         </span>
                         <span className="lead-value-cell cf-client-cases-cell"><span className="mini">Sprawy</span><strong>{counters.cases}</strong></span>
                         <span className="lead-action-cell client-card-next-action-block cf-client-next-action-panel cf-client-next-action-inline"><span className="mini">Najbliższa akcja</span><strong>{nearestActionByClientId.get(client.id) || 'Brak zaplanowanej akcji'}</strong></span>
                         <span className="lead-actions client-card-action-buttons cf-client-row-actions cf-client-row-inline">
                           <span className="btn ghost cf-icon-action-button" aria-hidden="true"><EntityIcon entity="client" className="h-4 w-4" /></span>
                           <button
                             type="button"
                             aria-label={isArchived ? 'Przywróć klienta' : 'Przenieś klienta do kosza'}
                             title={isArchived ? 'Przywróć klienta' : 'Przenieś klienta do kosza'}
                             disabled={archivePendingId === client.id}
                             onClick={(event) => isArchived ? handleRestoreClient(event, client) : handleArchiveClient(event, client, counters)}
                              className={actionIconClass('danger', 'btn ghost cf-icon-action-button')}
                           >
                             {archivePendingId === client.id ? <Loader2 className="h-4 w-4 animate-spin" /> : isArchived ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                           </button>
                         </span>
                         </div>
                       </Link>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>

          <div className="clients-right-rail">
            <SimpleFiltersCard
              title="Filtry proste"
              description="Bez przesady, tylko najpotrzebniejsze."
              dataTestId="clients-simple-filters-card"
              items={[
                { key: 'active', label: 'Aktywni', value: activeCount, onClick: () => setShowArchived(false) },
                { key: 'without-case', label: 'Bez sprawy', value: clientsWithoutCases, onClick: () => setShowArchived(false) },
                { key: 'stale', label: 'Bez ruchu', value: staleClients, onClick: () => setShowArchived(false) },
                { key: 'trash', label: 'Kosz', value: archivedCount, onClick: () => setShowArchived(true) },
              ]}
            />

            <OperatorSideCard
              title="Leady do spięcia"
              description="Brak klienta albo sprawy przy aktywnym temacie."
              dataTestId="clients-lead-attention-card"
              dataAttrs={{ 'data-clients-lead-attention-rail': true }}
            >
              <div className="right-list" data-right-rail-list="lead-attention">
                {leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map((lead) => {
                  const leadId = String(lead.id || '').trim();
                  const clientId = getStage35RelationClientId(lead);
                  const hasClient = Boolean(clientId);
                  const hasCase = (cases as Record<string, unknown>[]).some((caseRow) => {
                    const caseLeadId = String(caseRow.leadId || caseRow.lead_id || caseRow.linkedLeadId || caseRow.linked_lead_id || '').trim();
                    const caseClientId = getStage35RelationClientId(caseRow);
                    return Boolean((leadId && caseLeadId === leadId) || (clientId && caseClientId === clientId));
                  });
                  const leadLabel = String(lead.name || lead.company || lead.phone || lead.email || 'Lead bez nazwy');
                  const leadSecondaryText = String(lead.company || lead.phone || lead.email || lead.source || 'Lead do spięcia');

                  return (
                    <Link key={leadId || leadLabel} to={leadId ? '/leads/' + leadId : '/leads'} className="right-list-row" data-right-rail-row="lead-attention">
                      <span className="right-list-row-main">
                        <span className="right-list-title">{leadLabel}</span>
                        <span className="right-list-meta">{leadSecondaryText}</span>
                      </span>
                      <span className="right-list-badges" aria-label="Status spięcia leada">
                        <span className={hasClient ? 'right-list-pill right-list-pill-ok' : 'right-list-pill right-list-pill-warn'}>
                          {hasClient ? 'Klient OK' : 'Brak klienta'}
                        </span>
                        <span className={hasCase ? 'right-list-pill right-list-pill-ok' : 'right-list-pill right-list-pill-warn'}>
                          {hasCase ? 'Sprawa OK' : 'Brak sprawy'}
                        </span>
                      </span>
                    </Link>
                  );
                }) : (
                  <p className="right-list-empty">Brak leadów do spięcia.</p>
                )}
              </div>
            </OperatorSideCard>
          </div>
        </div>
      </div>
    </Layout>
  );
}

