import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import type { CommissionBase, CommissionMode, CommissionStatus } from '../../lib/finance/finance-types';
import { normalizeCommissionBase, normalizeCommissionMode, normalizeCommissionStatus } from '../../lib/finance/finance-normalize';

export type CommissionFormValue = {
  commissionMode: CommissionMode;
  commissionBase: CommissionBase;
  commissionRate: number | null;
  commissionAmount: number | null;
  commissionStatus: CommissionStatus;
  currency: string;
};

type CommissionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCurrency?: string;
  defaultValue?: Partial<CommissionFormValue>;
  onSubmit?: (value: CommissionFormValue) => void | Promise<void>;
  isSaving?: boolean;
};

const COMMISSION_MODES: CommissionMode[] = ['none', 'percent', 'fixed'];
const COMMISSION_BASES: CommissionBase[] = ['contract_value', 'paid_amount', 'custom'];
const COMMISSION_STATUSES: CommissionStatus[] = ['not_set', 'expected', 'due', 'partially_paid', 'paid', 'overdue'];

function parseNullableNumber(value: string) {
  const parsed = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function CommissionFormDialog({
  open,
  onOpenChange,
  defaultCurrency = 'PLN',
  defaultValue,
  onSubmit,
  isSaving = false,
}: CommissionFormDialogProps) {
  const initialState = useMemo(() => ({
    commissionMode: normalizeCommissionMode(defaultValue?.commissionMode || 'percent'),
    commissionBase: normalizeCommissionBase(defaultValue?.commissionBase || 'contract_value'),
    commissionRate: defaultValue?.commissionRate == null ? '' : String(defaultValue.commissionRate),
    commissionAmount: defaultValue?.commissionAmount == null ? '' : String(defaultValue.commissionAmount),
    commissionStatus: normalizeCommissionStatus(defaultValue?.commissionStatus || 'expected'),
    currency: String(defaultValue?.currency || defaultCurrency || 'PLN').toUpperCase(),
  }), [defaultCurrency, defaultValue]);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (open) setForm(initialState);
  }, [initialState, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mode = normalizeCommissionMode(form.commissionMode);
    const value: CommissionFormValue = {
      commissionMode: mode,
      commissionBase: normalizeCommissionBase(form.commissionBase),
      commissionRate: mode === 'percent' ? parseNullableNumber(form.commissionRate) : null,
      commissionAmount: mode === 'fixed' ? parseNullableNumber(form.commissionAmount) : null,
      commissionStatus: normalizeCommissionStatus(form.commissionStatus),
      currency: String(form.currency || defaultCurrency || 'PLN').toUpperCase(),
    };
    await onSubmit?.(value);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog">
        <DialogHeader>
          <DialogTitle>Edytuj prowizję</DialogTitle>
        </DialogHeader>

        <form className="cf-finance-form" onSubmit={handleSubmit}>
          <label className="cf-finance-field">
            <span>Tryb prowizji</span>
            <select
              className="cf-finance-input"
              value={form.commissionMode}
              onChange={(event) => setForm((current) => ({ ...current, commissionMode: normalizeCommissionMode(event.target.value) }))}
            >
              {COMMISSION_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Podstawa</span>
            <select
              className="cf-finance-input"
              value={form.commissionBase}
              onChange={(event) => setForm((current) => ({ ...current, commissionBase: normalizeCommissionBase(event.target.value) }))}
            >
              {COMMISSION_BASES.map((base) => <option key={base} value={base}>{base}</option>)}
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Stawka %</span>
            <Input
              value={form.commissionRate}
              inputMode="decimal"
              disabled={form.commissionMode !== 'percent'}
              placeholder="2,5"
              onChange={(event) => setForm((current) => ({ ...current, commissionRate: event.target.value }))}
            />
          </label>

          <label className="cf-finance-field">
            <span>Kwota stała</span>
            <Input
              value={form.commissionAmount}
              inputMode="decimal"
              disabled={form.commissionMode !== 'fixed'}
              placeholder="2625"
              onChange={(event) => setForm((current) => ({ ...current, commissionAmount: event.target.value }))}
            />
          </label>

          <label className="cf-finance-field">
            <span>Status prowizji</span>
            <select
              className="cf-finance-input"
              value={form.commissionStatus}
              onChange={(event) => setForm((current) => ({ ...current, commissionStatus: normalizeCommissionStatus(event.target.value) }))}
            >
              {COMMISSION_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Waluta</span>
            <Input
              value={form.currency}
              maxLength={3}
              onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))}
            />
          </label>

          <DialogFooter className="cf-finance-dialog__footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
            <Button type="submit" disabled={isSaving}>Zapisz prowizję</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CommissionFormDialog;
