import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { CommissionMode } from '../../lib/finance/finance-types';
import { normalizeCommissionMode } from '../../lib/finance/finance-normalize';
import { calculateCommissionAmount } from '../../lib/finance/finance-calculations';

export const CLOSEFLOW_FIN4_LEAD_VALUE_UX = 'FIN-4_CLOSEFLOW_LEAD_VALUE_UX_V1' as const;

export type LeadValuePanelValue = {
  potentialValue: number | string | null;
  commissionMode: CommissionMode;
  commissionRate?: number | string | null;
  commissionAmount?: number | string | null;
  financeNote?: string | null;
  currency?: string | null;
};

type LeadValuePanelProps = {
  value?: Partial<LeadValuePanelValue> | null;
  onChange?: (value: LeadValuePanelValue) => void;
  onSubmit?: (value: LeadValuePanelValue) => void | Promise<void>;
  defaultOpen?: boolean;
  readonly?: boolean;
  isSaving?: boolean;
  title?: string;
  description?: string;
};

function toNumber(value: unknown) {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function toFieldValue(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function normalizeValue(value?: Partial<LeadValuePanelValue> | null): LeadValuePanelValue {
  return {
    potentialValue: value?.potentialValue ?? '',
    commissionMode: normalizeCommissionMode(value?.commissionMode || 'none'),
    commissionRate: value?.commissionRate ?? '',
    commissionAmount: value?.commissionAmount ?? '',
    financeNote: value?.financeNote ?? '',
    currency: String(value?.currency || 'PLN').toUpperCase(),
  };
}

function formatMoney(value: unknown, currency = 'PLN') {
  const amount = toNumber(value);
  return `${Math.round(amount).toLocaleString('pl-PL')} ${String(currency || 'PLN').toUpperCase()}`;
}

function getCommissionPreview(value: LeadValuePanelValue) {
  const potentialValue = toNumber(value.potentialValue);
  const mode = normalizeCommissionMode(value.commissionMode);
  if (mode === 'none') return 'Brak prowizji';
  if (mode === 'fixed') return formatMoney(value.commissionAmount, value.currency || 'PLN');
  const percent = toNumber(value.commissionRate);
  const amount = calculateCommissionAmount({
    mode: 'percent',
    base: 'contract_value',
    percent,
    fixedAmount: null,
    customBaseAmount: null,
    currency: String(value.currency || 'PLN').toUpperCase(),
  }, potentialValue, 0);
  return `${percent.toLocaleString('pl-PL', { maximumFractionDigits: 2 })}% = ${formatMoney(amount, value.currency || 'PLN')}`;
}

export function LeadValuePanel({
  value,
  onChange,
  onSubmit,
  defaultOpen = false,
  readonly = false,
  isSaving = false,
  title = 'Wartość i prowizja opcjonalnie',
  description = 'Uzupełnij tylko wtedy, gdy lead ma potencjalną wartość albo prowizję.',
}: LeadValuePanelProps) {
  const normalizedInput = useMemo(() => normalizeValue(value), [value]);
  const [open, setOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState<LeadValuePanelValue>(normalizedInput);

  useEffect(() => {
    setDraft(normalizedInput);
  }, [normalizedInput]);

  function update(next: Partial<LeadValuePanelValue>) {
    const merged = { ...draft, ...next };
    setDraft(merged);
    onChange?.(merged);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const finalValue = normalizeValue({
      ...draft,
      potentialValue: toNumber(draft.potentialValue),
      commissionRate: draft.commissionMode === 'percent' ? toNumber(draft.commissionRate) : null,
      commissionAmount: draft.commissionMode === 'fixed' ? toNumber(draft.commissionAmount) : null,
      financeNote: String(draft.financeNote || '').trim(),
      currency: String(draft.currency || 'PLN').toUpperCase(),
    });
    onChange?.(finalValue);
    await onSubmit?.(finalValue);
  }

  return (
    <section className="cf-finance-lead-value-panel" data-fin4-lead-value-ux="true">
      <button
        type="button"
        className="cf-finance-lead-value-panel__toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span>
          <strong>{title}</strong>
          <small>{description}</small>
        </span>
        <span className="cf-finance-lead-value-panel__preview">
          {formatMoney(draft.potentialValue, draft.currency || 'PLN')} · {getCommissionPreview(draft)}
        </span>
      </button>

      {open ? (
        <form className="cf-finance-lead-value-panel__body" onSubmit={handleSubmit}>
          <label className="cf-finance-field">
            <span>Wartość potencjalna</span>
            <Input
              value={toFieldValue(draft.potentialValue)}
              inputMode="decimal"
              disabled={readonly || isSaving}
              placeholder="105000"
              onChange={(event) => update({ potentialValue: event.target.value })}
            />
          </label>

          <label className="cf-finance-field">
            <span>Model prowizji</span>
            <select
              className="cf-finance-input"
              value={draft.commissionMode}
              disabled={readonly || isSaving}
              onChange={(event) => update({ commissionMode: normalizeCommissionMode(event.target.value) })}
            >
              <option value="none">brak</option>
              <option value="percent">procent</option>
              <option value="fixed">kwota stała</option>
            </select>
          </label>

          <label className="cf-finance-field">
            <span>Procent prowizji</span>
            <Input
              value={toFieldValue(draft.commissionRate)}
              inputMode="decimal"
              disabled={readonly || isSaving || draft.commissionMode !== 'percent'}
              placeholder="2,5"
              onChange={(event) => update({ commissionRate: event.target.value })}
            />
          </label>

          <label className="cf-finance-field">
            <span>Kwota stała prowizji</span>
            <Input
              value={toFieldValue(draft.commissionAmount)}
              inputMode="decimal"
              disabled={readonly || isSaving || draft.commissionMode !== 'fixed'}
              placeholder="2625"
              onChange={(event) => update({ commissionAmount: event.target.value })}
            />
          </label>

          <label className="cf-finance-field cf-finance-field--wide">
            <span>Notatka finansowa</span>
            <textarea
              className="cf-finance-textarea"
              value={String(draft.financeNote || '')}
              disabled={readonly || isSaving}
              placeholder="Np. prowizja płatna po podpisaniu umowy albo po wpłacie klienta."
              onChange={(event) => update({ financeNote: event.target.value })}
            />
          </label>

          {!readonly ? (
            <div className="cf-finance-lead-value-panel__actions">
              <Button type="submit" size="sm" disabled={isSaving}>Zapisz wartość</Button>
            </div>
          ) : null}
        </form>
      ) : null}
    </section>
  );
}

export default LeadValuePanel;
