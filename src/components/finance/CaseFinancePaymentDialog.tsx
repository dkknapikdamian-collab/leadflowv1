import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { normalizeCurrency, normalizePaymentStatus, normalizePaymentType } from '../../lib/finance/finance-normalize';
import type { PaymentStatus, PaymentType } from '../../lib/finance/finance-types';
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_LABELS } from '../../lib/finance/finance-payment-labels';
import '../../styles/finance/closeflow-finance.css';

export const CLOSEFLOW_FIN14_CASE_FINANCE_PAYMENT_DIALOG = 'CLOSEFLOW_FIN14_CASE_FINANCE_PAYMENT_DIALOG_V1' as const;
export const CLOSEFLOW_FIN14_PAYMENT_TYPE_MAP = 'Dodaj zaliczkę -> deposit | Dodaj wpłatę -> partial | Dodaj płatność prowizji -> commission' as const;

export type CaseFinancePaymentInput = {
  caseId: string | null;
  clientId: string | null;
  leadId: string | null;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
  dueAt: string | null;
  note: string;
};

type CaseFinancePaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseRecord: Record<string, unknown> | null;
  defaultType: PaymentType;
  defaultCurrency?: string;
  onSubmit?: (payment: CaseFinancePaymentInput) => void | Promise<void>;
  isSaving?: boolean;
};

function readId(record: Record<string, unknown> | null, keys: string[]) {
  if (!record) return '';
  for (const key of keys) {
    const value = String(record[key] ?? '').trim();
    if (value) return value;
  }
  return '';
}

function parsePaymentAmount(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, value) : 0;
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const compact = raw.replace(/\s+/g, '');
  const hasComma = compact.includes(',');
  const hasDot = compact.includes('.');
  let normalized = compact;

  if (hasComma) {
    normalized = compact.replace(/\./g, '').replace(',', '.');
  } else if (hasDot) {
    const parts = compact.split('.');
    const last = parts[parts.length - 1] || '';
    const everyGroupNumeric = parts.every((part) => /^\d+$/.test(part));
    normalized = everyGroupNumeric && parts.length > 1 && last.length === 3 ? parts.join('') : compact;
  }

  normalized = normalized.replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function toDateTimeLocal(value: unknown) {
  const raw = String(value || '').trim();
  const date = raw ? new Date(raw) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getDialogTitle(type: PaymentType) {
  if (type === 'deposit') return 'Dodaj zaliczkę';
  if (type === 'commission') return 'Dodaj płatność prowizji';
  return 'Dodaj wpłatę';
}

function getPaymentHelp(type: PaymentType) {
  if (type === 'commission') return 'Ta płatność zmieni tylko prowizję opłaconą i prowizję do zapłaty. Nie zwiększa wpłat klienta.';
  if (type === 'deposit') return 'Zaliczka jest wpłatą klienta i zmniejsza kwotę pozostałą do zapłaty.';
  return 'Wpłata klienta zmniejsza kwotę pozostałą do zapłaty.';
}

export function CaseFinancePaymentDialog({
  open,
  onOpenChange,
  caseRecord,
  defaultType,
  defaultCurrency = 'PLN',
  onSubmit,
  isSaving = false,
}: CaseFinancePaymentDialogProps) {
  const [type, setType] = useState<PaymentType>(normalizePaymentType(defaultType));
  const [status, setStatus] = useState<PaymentStatus>('paid');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(normalizeCurrency(defaultCurrency, 'PLN'));
  const [paidAt, setPaidAt] = useState(toDateTimeLocal(new Date().toISOString()));
  const [dueAt, setDueAt] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!open) return;
    setType(normalizePaymentType(defaultType));
    setStatus('paid');
    setAmount('');
    setCurrency(normalizeCurrency(defaultCurrency, 'PLN'));
    setPaidAt(toDateTimeLocal(new Date().toISOString()));
    setDueAt('');
    setNote('');
  }, [defaultCurrency, defaultType, open]);

  const caseId = useMemo(() => readId(caseRecord, ['id', 'caseId', 'case_id']), [caseRecord]);
  const clientId = useMemo(() => readId(caseRecord, ['clientId', 'client_id']), [caseRecord]);
  const leadId = useMemo(() => readId(caseRecord, ['leadId', 'lead_id']), [caseRecord]);
  const parsedAmount = parsePaymentAmount(amount);
  const safeType = normalizePaymentType(type);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!caseId || parsedAmount <= 0) return;
    await onSubmit?.({
      caseId,
      clientId: clientId || null,
      leadId: leadId || null,
      type: safeType,
      status: normalizePaymentStatus(status),
      amount: parsedAmount,
      currency: normalizeCurrency(currency, 'PLN'),
      paidAt: fromDateTimeLocal(paidAt),
      dueAt: fromDateTimeLocal(dueAt),
      note: note.trim(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog cf-finance-payment-dialog" data-fin14-case-finance-payment-dialog="true">
        <DialogHeader>
          <DialogTitle>{getDialogTitle(safeType)}</DialogTitle>
          <p className="cf-finance-editor-dialog__subtitle">{getPaymentHelp(safeType)}</p>
        </DialogHeader>
        <form className="cf-finance-form" onSubmit={handleSubmit}>
          <label className="cf-finance-field">
            <span>Typ płatności</span>
            <select className="cf-finance-input" value={safeType} onChange={(event) => setType(normalizePaymentType(event.target.value))}>
              <option value="deposit">{PAYMENT_TYPE_LABELS.deposit}</option>
              <option value="partial">{PAYMENT_TYPE_LABELS.partial}</option>
              <option value="commission">{PAYMENT_TYPE_LABELS.commission}</option>
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Status</span>
            <select className="cf-finance-input" value={status} onChange={(event) => setStatus(normalizePaymentStatus(event.target.value))}>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Kwota</span>
            <Input value={amount} inputMode="decimal" placeholder="np. 10 000" onChange={(event) => setAmount(event.target.value)} />
          </label>
          <label className="cf-finance-field">
            <span>Waluta</span>
            <Input value={currency} maxLength={3} placeholder="PLN" onChange={(event) => setCurrency(event.target.value.toUpperCase())} />
          </label>
          <label className="cf-finance-field">
            <span>Data zapłaty</span>
            <Input type="datetime-local" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} />
          </label>
          <label className="cf-finance-field">
            <span>Termin</span>
            <Input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
          </label>
          <label className="cf-finance-field cf-finance-field--wide">
            <span>Notatka</span>
            <Textarea value={note} placeholder="np. zaliczka, przelew, faktura" onChange={(event) => setNote(event.target.value)} />
          </label>
          {!caseId ? <p className="cf-finance-empty">Nie można dodać płatności bez wskazania sprawy.</p> : null}
          <DialogFooter className="cf-finance-dialog__footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Anuluj</Button>
            <Button type="submit" disabled={isSaving || !caseId || parsedAmount <= 0}>Zapisz płatność</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CaseFinancePaymentDialog;
