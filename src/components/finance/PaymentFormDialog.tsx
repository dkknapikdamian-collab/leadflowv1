import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { FormFooter } from '../ui-system';
import type { FinanceRelationRef, PaymentStatus, PaymentType } from '../../lib/finance/finance-types';
import { normalizePaymentStatus, normalizePaymentType } from '../../lib/finance/finance-normalize';
import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../../lib/finance/finance-payment-labels';
import { FINANCE_DUPLICATE_PAYMENT_WARNING_COPY, type FinanceDuplicateCandidate } from '../../lib/finance/finance-duplicate-safety';

export type PaymentFormValue = FinanceRelationRef & {
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
  dueAt: string | null;
  note: string;
};

type PaymentFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relation: FinanceRelationRef;
  defaultCurrency?: string;
  defaultValue?: Partial<PaymentFormValue>;
  onSubmit?: (value: PaymentFormValue) => void | Promise<void>;
  isSaving?: boolean;
  duplicateCandidates?: FinanceDuplicateCandidate[];
  duplicateWarningCopy?: string;
};

function toDateInputValue(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function fromDateInputValue(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

export function PaymentFormDialog({
  open,
  onOpenChange,
  relation,
  defaultCurrency = 'PLN',
  defaultValue,
  onSubmit,
  isSaving = false,
  duplicateCandidates = [],
  duplicateWarningCopy = FINANCE_DUPLICATE_PAYMENT_WARNING_COPY,
}: PaymentFormDialogProps) {
  const initialState = useMemo(() => ({
    type: normalizePaymentType(defaultValue?.type || 'partial'),
    status: normalizePaymentStatus(defaultValue?.status || 'paid'),
    amount: String(defaultValue?.amount ?? ''),
    currency: String(defaultValue?.currency || defaultCurrency || 'PLN').toUpperCase(),
    paidAt: toDateInputValue(defaultValue?.paidAt),
    dueAt: toDateInputValue(defaultValue?.dueAt),
    note: String(defaultValue?.note || ''),
  }), [defaultCurrency, defaultValue]);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (open) setForm(initialState);
  }, [initialState, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(String(form.amount || '0').replace(',', '.'));
    const value: PaymentFormValue = {
      ...relation,
      type: normalizePaymentType(form.type),
      status: normalizePaymentStatus(form.status),
      amount: Number.isFinite(amount) && amount > 0 ? amount : 0,
      currency: String(form.currency || defaultCurrency || 'PLN').toUpperCase(),
      paidAt: fromDateInputValue(form.paidAt),
      dueAt: fromDateInputValue(form.dueAt),
      note: form.note.trim(),
    };
    await onSubmit?.(value);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog">
        <DialogHeader>
          <DialogTitle>Dodaj wpłatę</DialogTitle>
        </DialogHeader>

        <form className="cf-finance-form" onSubmit={handleSubmit}>
          {duplicateCandidates.length > 0 ? (
            <div className="cf-finance-duplicate-warning" role="alert" data-fin9-payment-duplicate-warning="true">
              <strong>Możliwy duplikat klienta</strong>
              <span>{duplicateWarningCopy}</span>
            </div>
          ) : null}
          <span hidden data-fin9-payment-duplicate-safety="CLOSEFLOW_FIN9_PAYMENT_DUPLICATE_WARNING_ONLY" />
          <label className="cf-finance-field">
            <span>Typ</span>
            <select
              className="cf-finance-input"
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: normalizePaymentType(event.target.value) }))}
            >
              {PAYMENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Status</span>
            <select
              className="cf-finance-input"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: normalizePaymentStatus(event.target.value) }))}
            >
              {PAYMENT_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Kwota</span>
            <Input
              value={form.amount}
              inputMode="decimal"
              placeholder="40000"
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            />
          </label>

          <label className="cf-finance-field">
            <span>Waluta</span>
            <Input
              value={form.currency}
              maxLength={3}
              onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))}
            />
          </label>

          <label className="cf-finance-field">
            <span>Data wpłaty</span>
            <Input
              type="date"
              value={form.paidAt}
              onChange={(event) => setForm((current) => ({ ...current, paidAt: event.target.value }))}
            />
          </label>

          <label className="cf-finance-field">
            <span>Termin</span>
            <Input
              type="date"
              value={form.dueAt}
              onChange={(event) => setForm((current) => ({ ...current, dueAt: event.target.value }))}
            />
          </label>

          <label className="cf-finance-field cf-finance-field--wide">
            <span>Notatka</span>
            <Input
              value={form.note}
              placeholder="np. zaliczka po podpisaniu umowy"
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
            />
          </label>

          <FormFooter className="cf-finance-dialog__footer" align="right">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
            <Button type="submit" disabled={isSaving || Number(String(form.amount || '0').replace(',', '.')) <= 0}>
              Zapisz wpłatę
            </Button>
          </FormFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentFormDialog;
