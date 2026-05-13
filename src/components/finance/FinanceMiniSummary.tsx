import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { CommissionMode, CommissionStatus, FinanceSummary } from '../../lib/finance/finance-types';
import type { CaseFinanceSummary } from '../../lib/finance/case-finance-source';
import { getCaseFinanceSummary } from '../../lib/finance/case-finance-source';
import { calculateClientFinanceSummary } from '../../lib/client-finance';
import { createPaymentInSupabase, fetchCasesFromSupabase, fetchPaymentsFromSupabase, updateCaseInSupabase } from '../../lib/supabase-fallback';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { StatusPill, SurfaceCard } from '../ui-system';
import { CaseFinanceActionButtons } from './CaseFinanceActionButtons';
import { CaseFinanceEditorDialog, formatCaseFinanceMoney, parseCaseFinanceNumber, type CaseFinancePatch } from './CaseFinanceEditorDialog';
import { CaseFinancePaymentDialog, type CaseFinancePaymentInput } from './CaseFinancePaymentDialog';
import '../../styles/finance/closeflow-finance.css';

export const CLOSEFLOW_FIN13_CLIENT_CASE_FINANCES = 'CLOSEFLOW_FIN13_CLIENT_CASE_FINANCES_V1' as const;

type FinanceMiniSummaryProps = {
  summary: FinanceSummary | CaseFinanceSummary;
  commissionMode?: CommissionMode;
  commissionRate?: number | null;
  commissionStatus?: CommissionStatus;
  title?: string;
};

type ClientFinanceRelationSummaryProps = {
  client?: Record<string, unknown> | null;
  clientId?: string | null;
  cases?: Array<Record<string, unknown>>;
  payments?: Array<Record<string, unknown>>;
  title?: string;
};

type ClientFinanceCaseRow = {
  caseRecord: Record<string, unknown>;
  caseId: string;
  title: string;
  payments: Record<string, unknown>[];
  summary: CaseFinanceSummary;
};

const COMMISSION_STATUS_LABELS: Record<string, string> = {
  not_set: 'nieustawiona',
  expected: 'oczekiwana',
  due: 'należna',
  partially_paid: 'częściowo zapłacona',
  paid: 'zapłacona',
  overdue: 'zaległa',
};

export function getCommissionStatusTone(status: CommissionStatus | string) {
  if (status === 'paid') return 'green' as const;
  if (status === 'due' || status === 'partially_paid' || status === 'expected') return 'amber' as const;
  if (status === 'overdue') return 'red' as const;
  return 'neutral' as const;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function readId(row: unknown, keys: string[]): string {
  const record = asRecord(row);
  for (const key of keys) {
    const value = String(record[key] ?? '').trim();
    if (value) return value;
  }
  return '';
}

function getClientId(client: unknown, explicit?: string | null): string {
  return String(explicit || asRecord(client).id || asRecord(client).clientId || asRecord(client).client_id || '').trim();
}

function getCaseId(caseRecord: unknown): string {
  return readId(caseRecord, ['id', 'caseId', 'case_id']);
}

function getCaseLeadId(caseRecord: unknown): string {
  return readId(caseRecord, ['leadId', 'lead_id']);
}

function getPaymentCaseId(payment: unknown): string {
  return readId(payment, ['caseId', 'case_id', 'relatedCaseId', 'related_case_id']);
}

function getCaseTitle(caseRecord: unknown): string {
  const row = asRecord(caseRecord);
  return String(row.title || row.name || row.clientName || row.client_name || 'Sprawa bez nazwy').trim();
}

function getCasePayments(caseRecord: unknown, payments: Record<string, unknown>[], allCasesCount: number) {
  const caseId = getCaseId(caseRecord);
  return payments.filter((payment) => {
    const paymentCaseId = getPaymentCaseId(payment);
    if (paymentCaseId) return paymentCaseId === caseId;
    if (allCasesCount === 1) {
      const paymentClientId = readId(payment, ['clientId', 'client_id', 'relatedClientId', 'related_client_id']);
      const caseClientId = readId(caseRecord, ['clientId', 'client_id']);
      return Boolean(paymentClientId && caseClientId && paymentClientId === caseClientId);
    }
    return false;
  });
}

function buildClientCaseRows(cases: Record<string, unknown>[], payments: Record<string, unknown>[]): ClientFinanceCaseRow[] {
  return cases.filter(Boolean).map((caseRecord) => {
    const casePayments = getCasePayments(caseRecord, payments, cases.length);
    const summary = getCaseFinanceSummary(caseRecord, casePayments);
    return {
      caseRecord,
      caseId: getCaseId(caseRecord),
      title: getCaseTitle(caseRecord),
      payments: casePayments,
      summary,
    };
  });
}

function sumRows(rows: ClientFinanceCaseRow[]) {
  const total = {
    totalValue: 0,
    paidValue: 0,
    remainingValue: 0,
    commissionAmount: 0,
    commissionPaidAmount: 0,
  };
  for (const row of rows) {
    total.totalValue += row.summary.contractValue;
    total.paidValue += row.summary.clientPaidAmount;
    total.remainingValue += row.summary.remainingAmount;
    total.commissionAmount += row.summary.commissionAmount;
    total.commissionPaidAmount += row.summary.commissionPaidAmount;
  }
  return total;
}

function formatMoney(value: unknown, currency = 'PLN') {
  return formatCaseFinanceMoney(value, currency);
}

function formatPercent(value: unknown) {
  const amount = parseCaseFinanceNumber(value);
  if (amount <= 0) return '';
  return `${amount.toLocaleString('pl-PL', { maximumFractionDigits: 2 })}%`;
}

function buildCommissionLabel(summary: FinanceSummary | CaseFinanceSummary, mode?: CommissionMode, rate?: number | null) {
  if (!summary.commissionAmount) return 'Brak prowizji';
  if (mode === 'percent' && Number(rate || 0) > 0) return `${formatPercent(rate)} = ${formatMoney(summary.commissionAmount, summary.currency)}`;
  if (mode === 'fixed') return `stała = ${formatMoney(summary.commissionAmount, summary.currency)}`;
  return formatMoney(summary.commissionAmount, summary.currency);
}

export function FinanceMiniSummary({
  summary,
  commissionMode = 'none',
  commissionRate = null,
  commissionStatus,
  title = 'Rozliczenie',
}: FinanceMiniSummaryProps) {
  const resolvedCommissionStatus = commissionStatus || summary.commissionStatus;

  return (
    <SurfaceCard className="cf-finance-mini-summary" aria-label={title} data-fin10-finance-mini-summary="case-source">
      <div className="cf-finance-mini-summary__header">
        <p className="cf-finance-kicker">{title}</p>
        <strong className="cf-finance-mini-summary__value">{formatMoney(summary.contractValue, summary.currency)}</strong>
      </div>
      <dl className="cf-finance-mini-summary__grid">
        <div className="cf-finance-metric"><dt>Wartość</dt><dd>{formatMoney(summary.contractValue, summary.currency)}</dd></div>
        <div className="cf-finance-metric"><dt>Prowizja</dt><dd>{buildCommissionLabel(summary, commissionMode, commissionRate)}</dd></div>
        <div className="cf-finance-metric"><dt>Wpłacono</dt><dd>{formatMoney(summary.paidAmount, summary.currency)}</dd></div>
        <div className="cf-finance-metric"><dt>Pozostało</dt><dd>{formatMoney(summary.remainingAmount, summary.currency)}</dd></div>
        <div className="cf-finance-metric cf-finance-metric--wide">
          <dt>Status prowizji</dt>
          <dd>
            <StatusPill tone={getCommissionStatusTone(resolvedCommissionStatus)} className={`cf-finance-status cf-finance-status--${resolvedCommissionStatus}`}>
              {COMMISSION_STATUS_LABELS[resolvedCommissionStatus] || resolvedCommissionStatus}
            </StatusPill>
          </dd>
        </div>
      </dl>
    </SurfaceCard>
  );
}

function ClientPaymentDialog({
  open,
  onOpenChange,
  row,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: ClientFinanceCaseRow | null;
  onSaved: () => Promise<void> | void;
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAmount('');
    setNote('');
  }, [open, row?.caseId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!row?.caseId) {
      toast.error('Nie można dodać płatności bez wskazania sprawy');
      return;
    }
    const parsedAmount = parseCaseFinanceNumber(amount);
    if (parsedAmount <= 0) return;
    setSaving(true);
    try {
      await createPaymentInSupabase({
        caseId: row.caseId,
        clientId: readId(row.caseRecord, ['clientId', 'client_id']) || null,
        leadId: getCaseLeadId(row.caseRecord) || null,
        type: 'partial',
        status: 'paid',
        amount: parsedAmount,
        currency: row.summary.currency || 'PLN',
        paidAt: new Date().toISOString(),
        dueAt: null,
        note: note.trim(),
      });
      toast.success('Dodano wpłatę do sprawy');
      await onSaved();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog cf-finance-client-payment-dialog" data-fin13-client-case-payment-dialog="true">
        <DialogHeader>
          <DialogTitle>Dodaj wpłatę do sprawy</DialogTitle>
          <p className="cf-finance-editor-dialog__subtitle">Płatność będzie przypisana do sprawy: {row?.title || 'sprawa'}.</p>
        </DialogHeader>
        <form className="cf-finance-form" onSubmit={handleSubmit}>
          <label className="cf-finance-field">
            <span>Kwota wpłaty</span>
            <Input value={amount} inputMode="decimal" placeholder="np. 10000" onChange={(event) => setAmount(event.target.value)} />
          </label>
          <label className="cf-finance-field cf-finance-field--wide">
            <span>Notatka</span>
            <Textarea value={note} placeholder="np. zaliczka / przelew / gotówka" onChange={(event) => setNote(event.target.value)} />
          </label>
          <DialogFooter className="cf-finance-dialog__footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Anuluj</Button>
            <Button type="submit" disabled={saving || parseCaseFinanceNumber(amount) <= 0}>{saving ? 'Zapisywanie...' : 'Zapisz wpłatę'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const FIN7_CLIENT_FINANCE_RELATION_SUMMARY_COMPONENT = 'FIN-7_CLIENT_FINANCE_RELATION_SUMMARY_COMPONENT_V1' as const;
export const FIN13_CLIENT_FINANCES_ARE_CASE_FINANCES = 'FIN-13_CLIENT_FINANCES_ARE_CASE_FINANCES_V1' as const;

export function ClientFinanceRelationSummary({
  client,
  clientId,
  cases,
  payments,
  title = 'Finanse klienta',
}: ClientFinanceRelationSummaryProps) {
  const navigate = useNavigate();
  const [loadedCases, setLoadedCases] = useState<Array<Record<string, unknown>>>([]);
  const [loadedPayments, setLoadedPayments] = useState<Array<Record<string, unknown>>>([]);
  const [editingRow, setEditingRow] = useState<ClientFinanceCaseRow | null>(null);
  const [paymentRow, setPaymentRow] = useState<ClientFinanceCaseRow | null>(null);
  const [paymentType, setPaymentType] = useState<'deposit' | 'partial' | 'commission'>('partial');
  const [savingCaseFinance, setSavingCaseFinance] = useState(false);
  const resolvedClientId = getClientId(client, clientId);

  async function reloadClientFinanceData() {
    if (!resolvedClientId) return;
    const [caseRows, paymentRows] = await Promise.all([
      Array.isArray(cases) ? Promise.resolve(cases) : fetchCasesFromSupabase({ clientId: resolvedClientId }),
      Array.isArray(payments) ? Promise.resolve(payments) : fetchPaymentsFromSupabase({ clientId: resolvedClientId }),
    ]);
    if (!Array.isArray(cases)) setLoadedCases(Array.isArray(caseRows) ? caseRows as Array<Record<string, unknown>> : []);
    if (!Array.isArray(payments)) setLoadedPayments(Array.isArray(paymentRows) ? paymentRows as Array<Record<string, unknown>> : []);
  }

  useEffect(() => {
    let cancelled = false;
    if (!resolvedClientId) return;
    Promise.all([
      Array.isArray(cases) ? Promise.resolve(cases) : fetchCasesFromSupabase({ clientId: resolvedClientId }),
      Array.isArray(payments) ? Promise.resolve(payments) : fetchPaymentsFromSupabase({ clientId: resolvedClientId }),
    ]).then(([caseRows, paymentRows]) => {
      if (cancelled) return;
      if (!Array.isArray(cases)) setLoadedCases(Array.isArray(caseRows) ? caseRows as Array<Record<string, unknown>> : []);
      if (!Array.isArray(payments)) setLoadedPayments(Array.isArray(paymentRows) ? paymentRows as Array<Record<string, unknown>> : []);
    }).catch(() => {
      if (cancelled) return;
      if (!Array.isArray(cases)) setLoadedCases([]);
      if (!Array.isArray(payments)) setLoadedPayments([]);
    });
    return () => { cancelled = true; };
  }, [cases, payments, resolvedClientId]);

  const resolvedCases = Array.isArray(cases) ? cases : loadedCases;
  const resolvedPayments = Array.isArray(payments) ? payments : loadedPayments;
  const rows = useMemo(() => buildClientCaseRows(resolvedCases, resolvedPayments), [resolvedCases, resolvedPayments]);
  const totals = useMemo(() => sumRows(rows), [rows]);
  const legacySummary = useMemo(() => calculateClientFinanceSummary({
    client: client || { id: resolvedClientId },
    cases: resolvedCases,
    payments: resolvedPayments,
    mode: 'all_active_cases',
  }), [client, resolvedCases, resolvedClientId, resolvedPayments]);

  async function handleSaveCaseFinance(patch: CaseFinancePatch) {
    const caseId = editingRow?.caseId;
    if (!caseId) return;
    setSavingCaseFinance(true);
    try {
      const updatePayload = { id: caseId, ...patch } as Record<string, unknown> & { id: string };
      const updatedCase = await updateCaseInSupabase(updatePayload);
      if (!Array.isArray(cases)) {
        setLoadedCases((current) => current.map((caseRecord) => getCaseId(caseRecord) === caseId ? { ...caseRecord, ...(updatedCase || updatePayload) } : caseRecord));
      }
      await reloadClientFinanceData();
      toast.success('Zapisano wartość i prowizję sprawy');
    } finally {
      setSavingCaseFinance(false);
    }
  }

  return (
    <SurfaceCard className="cf-finance-mini-summary cf-finance-client-summary cf-fin13-client-case-finances" data-fin13-client-case-finances="true" aria-label={title}>
      <div className="cf-finance-mini-summary__header cf-fin13-client-finance-header">
        <div>
          <p className="cf-finance-kicker">FIN-13</p>
          <strong className="cf-finance-mini-summary__value">{title}</strong>
          <span>Finanse klienta są sumą finansów jego spraw. Klient nie ma osobnego salda.</span>
        </div>
      </div>

      <dl className="cf-finance-mini-summary__grid cf-fin13-client-finance-totals">
        <div className="cf-finance-metric"><dt>Suma wartości spraw</dt><dd>{formatMoney(totals.totalValue || legacySummary.totalValue)}</dd></div>
        <div className="cf-finance-metric"><dt>Suma wpłat klienta</dt><dd>{formatMoney(totals.paidValue || legacySummary.paidValue)}</dd></div>
        <div className="cf-finance-metric"><dt>Suma pozostała</dt><dd>{formatMoney(totals.remainingValue || legacySummary.remainingValue)}</dd></div>
        <div className="cf-finance-metric"><dt>Suma prowizji należnej</dt><dd>{formatMoney(totals.commissionAmount)}</dd></div>
        <div className="cf-finance-metric"><dt>Suma prowizji zapłaconej</dt><dd>{formatMoney(totals.commissionPaidAmount)}</dd></div>
      </dl>

      <div className="cf-fin13-client-case-finance-list" aria-label="Lista spraw z finansami">
        <div className="cf-fin13-client-case-finance-list__title">Lista spraw z finansami</div>
        {rows.length === 0 ? (
          <p className="cf-fin13-client-case-finance-empty">Brak spraw powiązanych z klientem.</p>
        ) : rows.map((row) => (
          <article key={row.caseId || row.title} className="cf-fin13-client-case-finance-row" data-fin13-client-case-finance-row="true">
            <div className="cf-fin13-client-case-finance-row__head">
              <div>
                <p>Sprawa: {row.title}</p>
                <span>ID: {row.caseId || 'brak'}</span>
              </div>
              <StatusPill tone={getCommissionStatusTone(row.summary.commissionStatus)} className={`cf-finance-status cf-finance-status--${row.summary.commissionStatus}`}>
                {COMMISSION_STATUS_LABELS[row.summary.commissionStatus] || row.summary.commissionStatus}
              </StatusPill>
            </div>
            <dl className="cf-fin13-client-case-finance-row__metrics">
              <div><dt>Wartość</dt><dd>{row.summary.contractValue > 0 ? formatMoney(row.summary.contractValue, row.summary.currency) : 'Nie ustawiono'}</dd></div>
              <div><dt>Wpłacono</dt><dd>{formatMoney(row.summary.clientPaidAmount, row.summary.currency)}</dd></div>
              <div><dt>Pozostało</dt><dd>{formatMoney(row.summary.remainingAmount, row.summary.currency)}</dd></div>
              <div><dt>Prowizja</dt><dd>{formatMoney(row.summary.commissionAmount, row.summary.currency)}</dd></div>
              <div><dt>Status prowizji</dt><dd>{COMMISSION_STATUS_LABELS[row.summary.commissionStatus] || row.summary.commissionStatus}</dd></div>
            </dl>
            <CaseFinanceActionButtons
              compact
              onEdit={() => setEditingRow(row)}
              onAddDepositPayment={() => { setPaymentType('deposit'); setPaymentRow(row); }}
              onAddPayment={() => { setPaymentType('partial'); setPaymentRow(row); }}
              onAddCommissionPayment={() => { setPaymentType('commission'); setPaymentRow(row); }}
              onOpenCase={() => navigate(`/cases/${row.caseId}`)}
              showDepositPayment
              showCommissionPayment
              showOpenCase
              disabled={!row.caseId}
            />
          </article>
        ))}
      </div>

      <CaseFinanceEditorDialog
        open={Boolean(editingRow)}
        onOpenChange={(open) => { if (!open) setEditingRow(null); }}
        caseRecord={editingRow?.caseRecord || null}
        payments={editingRow?.payments || []}
        onSave={handleSaveCaseFinance}
        isSaving={savingCaseFinance}
      />
      <CaseFinancePaymentDialog
        open={Boolean(paymentRow)}
        onOpenChange={(open) => { if (!open) setPaymentRow(null); }}
        caseRecord={paymentRow?.caseRecord || null}
        defaultType={paymentType}
        defaultCurrency={paymentRow?.summary.currency || 'PLN'}
        onSubmit={async (payment: CaseFinancePaymentInput) => {
          if (!payment.caseId) {
            toast.error('Nie można dodać płatności bez wskazania sprawy');
            return;
          }
          await createPaymentInSupabase({
            caseId: payment.caseId,
            clientId: payment.clientId,
            leadId: payment.leadId,
            type: payment.type,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            paidAt: payment.paidAt,
            dueAt: payment.dueAt,
            note: payment.note,
          });
          toast.success(payment.type === 'commission' ? 'Dodano płatność prowizji' : payment.type === 'deposit' ? 'Dodano zaliczkę' : 'Dodano wpłatę do sprawy');
          await reloadClientFinanceData();
          setPaymentRow(null);
        }}
      />
    </SurfaceCard>
  );
}

export default FinanceMiniSummary;
