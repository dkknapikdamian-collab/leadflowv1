import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import type { FinanceRelationRef, PaymentStatus, PaymentType } from '../../lib/finance/finance-types';
import { normalizePaymentStatus, normalizePaymentType } from '../../lib/finance/finance-normalize';

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
};

const PAYMENT_TYPES: PaymentType[] = ['deposit', 'partial', 'final', 'commission', 'refund', 'other'];
const PAYMENT_STATUSES: PaymentStatus[] = ['planned', 'due', 'paid', 'cancelled'];

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
          <label className="cf-finance-field">
            <span>Typ</span>
            <select
              className="cf-finance-input"
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: normalizePaymentType(event.target.value) }))}
            >
              {PAYMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Status</span>
            <select
              className="cf-finance-input"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: normalizePaymentStatus(event.target.value) }))}
            >
              {PAYMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
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

          <DialogFooter className="cf-finance-dialog__footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
            <Button type="submit" disabled={isSaving || Number(String(form.amount || '0').replace(',', '.')) <= 0}>
              Zapisz wpłatę
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentFormDialog;
