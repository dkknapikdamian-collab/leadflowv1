import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { normalizeCurrency, normalizePaymentStatus, normalizePaymentType } from '../../lib/finance/finance-normalize';
import type { PaymentStatus, PaymentType } from '../../lib/finance/finance-types';
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../../lib/finance/finance-payment-labels';
import { parseCaseFinanceNumber } from './CaseFinanceEditorDialog';
import '../../styles/finance/closeflow-finance.css';

export const CLOSEFLOW_FIN14_CASE_FINANCE_PAYMENT_DIALOG = 'CLOSEFLOW_FIN14_CASE_FINANCE_PAYMENT_DIALOG_V1' as const;

export type CaseFinancePaymentInput = {
  caseId?: string | null;
  clientId?: string | null;
  leadId?: string | null;
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
  caseRecord?: Record<string, unknown> | null;
  defaultType: 'deposit' | 'partial' | 'commission';
  defaultCurrency?: string;
  onSubmit?: (value: CaseFinancePaymentInput) => void | Promise<void>;
  isSaving?: boolean;
  compact?: boolean;
};

function readText(record: Record<string, unknown> | null | undefined, keys: string[]) {
  const row = record || {};
  for (const key of keys) {
    const value = String(row[key] ?? '').trim();
    if (value) return value;
  }
  return '';
}

function makeDateTimeLocalValue(value: unknown) {
  const raw = String(value || '').trim();
  const date = raw ? new Date(raw) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getDialogTitle(type: string) {
  if (type === 'deposit') return 'Dodaj zaliczkę';
  if (type === 'commission') return 'Dodaj płatność prowizji';
  return 'Dodaj wpłatę';
}

export function CaseFinancePaymentDialog({
  open,
  onOpenChange,
  caseRecord = null,
  defaultType,
  defaultCurrency,
  onSubmit,
  isSaving = false,
}: CaseFinancePaymentDialogProps) {
  const [type, setType] = useState<PaymentType>(normalizePaymentType(defaultType));
  const [status, setStatus] = useState<PaymentStatus>('paid');
  const [amount, setAmount] = useState('');
  const [paidAt, setPaidAt] = useState(makeDateTimeLocalValue(new Date().toISOString()));
  const [dueAt, setDueAt] = useState('');
  const [note, setNote] = useState('');

  const currency = useMemo(() => normalizeCurrency(defaultCurrency || caseRecord?.currency || 'PLN'), [caseRecord, defaultCurrency]);
  const caseId = readText(caseRecord, ['id', 'caseId', 'case_id']);
  const clientId = readText(caseRecord, ['clientId', 'client_id']) || null;
  const leadId = readText(caseRecord, ['leadId', 'lead_id']) || null;
  const parsedAmount = parseCaseFinanceNumber(amount);

  useEffect(() => {
    if (!open) return;
    setType(normalizePaymentType(defaultType));
    setStatus('paid');
    setAmount('');
    setPaidAt(makeDateTimeLocalValue(new Date().toISOString()));
    setDueAt('');
    setNote('');
  }, [defaultType, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (parsedAmount <= 0) return;
    await onSubmit?.({
      caseId: caseId || null,
      clientId,
      leadId,
      type: normalizePaymentType(type),
      status: normalizePaymentStatus(status),
      amount: parsedAmount,
      currency,
      paidAt: fromDateTimeLocalValue(paidAt),
      dueAt: fromDateTimeLocalValue(dueAt),
      note: note.trim(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog cf-finance-payment-dialog" data-fin14-case-finance-payment-dialog="true" data-fin14-default-payment-type={defaultType}>
        <DialogHeader>
          <DialogTitle>{getDialogTitle(defaultType)}</DialogTitle>
          <p className="cf-finance-editor-dialog__subtitle">Płatność zostanie przypisana do tej konkretnej sprawy.</p>
        </DialogHeader>
        <form className="cf-finance-form" onSubmit={handleSubmit}>
          <label className="cf-finance-field">
            <span>Typ płatności</span>
            <select className="cf-finance-input" value={type} onChange={(event) => setType(normalizePaymentType(event.target.value))}>
              {PAYMENT_TYPE_OPTIONS.filter((option) => ['deposit', 'partial', 'commission'].includes(option.value)).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Status</span>
            <select className="cf-finance-input" value={status} onChange={(event) => setStatus(normalizePaymentStatus(event.target.value))}>
              {PAYMENT_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="cf-finance-field">
            <span>Kwota</span>
            <Input value={amount} inputMode="decimal" placeholder="np. 10000" onChange={(event) => setAmount(event.target.value)} />
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
            <Textarea value={note} placeholder="np. zaliczka / przelew / prowizja" onChange={(event) => setNote(event.target.value)} />
          </label>
          <DialogFooter className="cf-finance-dialog__footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Anuluj</Button>
            <Button type="submit" disabled={isSaving || parsedAmount <= 0}>Zapisz płatność</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CaseFinancePaymentDialog;
