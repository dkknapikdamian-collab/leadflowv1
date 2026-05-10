import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { FormFooter } from '../ui-system';
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

const COMMISSION_MODES: Array<{ value: CommissionMode; label: string }> = [
  { value: 'none', label: 'brak' },
  { value: 'percent', label: 'procent' },
  { value: 'fixed', label: 'kwota stała' },
];
const COMMISSION_BASES: Array<{ value: CommissionBase; label: string }> = [
  { value: 'contract_value', label: 'wartość transakcji' },
  { value: 'paid_amount', label: 'wpłacono' },
  { value: 'custom', label: 'własna podstawa' },
];
const COMMISSION_STATUSES: Array<{ value: CommissionStatus; label: string }> = [
  { value: 'not_set', label: 'nieustawiona' },
  { value: 'expected', label: 'oczekiwana' },
  { value: 'due', label: 'należna' },
  { value: 'partially_paid', label: 'częściowo zapłacona' },
  { value: 'paid', label: 'zapłacona' },
  { value: 'overdue', label: 'zaległa' },
];

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
              {COMMISSION_MODES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Podstawa</span>
            <select
              className="cf-finance-input"
              value={form.commissionBase}
              onChange={(event) => setForm((current) => ({ ...current, commissionBase: normalizeCommissionBase(event.target.value) }))}
            >
              {COMMISSION_BASES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
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
              {COMMISSION_STATUSES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
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

          <FormFooter className="cf-finance-dialog__footer" align="right">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
            <Button type="submit" disabled={isSaving}>Zapisz prowizję</Button>
          </FormFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CommissionFormDialog;
