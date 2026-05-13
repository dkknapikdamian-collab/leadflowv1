import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  buildCaseFinancePatch,
  getCaseFinanceSummary,
  type CaseFinancePatchInput,
} from '../../lib/finance/case-finance-source';
import { normalizeCommissionMode, normalizeCommissionStatus, normalizeCurrency } from '../../lib/finance/finance-normalize';
import type { CommissionMode, CommissionStatus } from '../../lib/finance/finance-types';
import '../../styles/finance/closeflow-finance.css';

export const CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG = 'CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG_V1' as const;
export const CLOSEFLOW_FIN13_CLIENT_USES_CASE_FINANCE_EDITOR_DIALOG = 'CLOSEFLOW_FIN13_CLIENT_USES_CASE_FINANCE_EDITOR_DIALOG_V1' as const;

export type CaseFinancePatch = CaseFinancePatchInput & Record<string, unknown>;

type FinanceFormState = {
  contractValue: string;
  currency: string;
  commissionMode: CommissionMode;
  commissionRate: string;
  commissionAmount: string;
  commissionStatus: CommissionStatus;
};

export type CaseFinanceEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseRecord: Record<string, unknown> | null;
  payments: Record<string, unknown>[];
  onSave: (patch: CaseFinancePatch) => Promise<void>;
  isSaving?: boolean;
};

const moneyFormatter = new Intl.NumberFormat('pl-PL', {
  maximumFractionDigits: 2,
});

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

export function parseCaseFinanceNumber(value: unknown): number {
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
    const dotParts = compact.split('.');
    const everyGroupNumeric = dotParts.every((part) => /^\d+$/.test(part));
    const lastGroupLooksThousands = dotParts.length > 1 && dotParts[dotParts.length - 1].length === 3;
    normalized = everyGroupNumeric && lastGroupLooksThousands ? dotParts.join('') : compact;
  }

  normalized = normalized.replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function formatCaseFinanceNumber(value: unknown): string {
  return moneyFormatter.format(parseCaseFinanceNumber(value));
}

export function formatCaseFinanceMoney(value: unknown, currency = 'PLN'): string {
  return `${formatCaseFinanceNumber(value)} ${normalizeCurrency(currency, 'PLN')}`;
}

function toInputValue(value: unknown): string {
  const amount = parseCaseFinanceNumber(value);
  return amount > 0 ? String(amount) : '';
}

function makeInitialState(caseRecord: Record<string, unknown> | null, payments: Record<string, unknown>[]): FinanceFormState {
  const summary = getCaseFinanceSummary(caseRecord, payments);
  return {
    contractValue: toInputValue(summary.contractValue),
    currency: normalizeCurrency(summary.currency, 'PLN'),
    commissionMode: summary.commissionMode === 'percent' || summary.commissionMode === 'fixed' ? summary.commissionMode : 'none',
    commissionRate: toInputValue(summary.commissionRate),
    commissionAmount: toInputValue(summary.commissionAmount),
    commissionStatus: normalizeCommissionStatus(summary.commissionStatus || 'not_set'),
  };
}

function getCaseName(caseRecord: Record<string, unknown> | null): string {
  const row = asRecord(caseRecord);
  return String(row.title || row.name || row.clientName || row.client_name || 'sprawa').trim();
}

export function CaseFinanceEditorDialog({
  open,
  onOpenChange,
  caseRecord,
  payments,
  onSave,
  isSaving = false,
}: CaseFinanceEditorDialogProps) {
  const [form, setForm] = useState<FinanceFormState>(() => makeInitialState(caseRecord, payments));
  const [localSaving, setLocalSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(makeInitialState(caseRecord, payments));
  }, [caseRecord, open, payments]);

  const preview = useMemo(() => {
    const contractValue = parseCaseFinanceNumber(form.contractValue);
    const commissionRate = Math.min(100, parseCaseFinanceNumber(form.commissionRate));
    const commissionAmount = form.commissionMode === 'fixed'
      ? parseCaseFinanceNumber(form.commissionAmount)
      : form.commissionMode === 'percent'
        ? Math.round(((contractValue * commissionRate) / 100) * 100) / 100
        : 0;
    const summary = getCaseFinanceSummary({
      ...(caseRecord || {}),
      contractValue,
      expectedRevenue: contractValue,
      currency: form.currency,
      commissionMode: form.commissionMode,
      commissionBase: 'contract_value',
      commissionRate,
      commissionAmount,
      commissionStatus: form.commissionStatus,
    }, payments);
    return summary;
  }, [caseRecord, form, payments]);

  const canSave = Boolean(caseRecord && String(asRecord(caseRecord).id || '').trim()) && !isSaving && !localSaving;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    const contractValue = parseCaseFinanceNumber(form.contractValue);
    const commissionMode = normalizeCommissionMode(form.commissionMode);
    const commissionRate = commissionMode === 'percent' ? Math.min(100, parseCaseFinanceNumber(form.commissionRate)) : 0;
    const commissionAmount = commissionMode === 'fixed'
      ? parseCaseFinanceNumber(form.commissionAmount)
      : commissionMode === 'percent'
        ? Math.round(((contractValue * commissionRate) / 100) * 100) / 100
        : 0;
    const patch = buildCaseFinancePatch({
      contractValue,
      expectedRevenue: contractValue,
      currency: normalizeCurrency(form.currency, 'PLN'),
      commissionMode,
      commissionBase: 'contract_value',
      commissionRate,
      commissionAmount,
      commissionStatus: normalizeCommissionStatus(form.commissionStatus),
    }) as CaseFinancePatch;
    setLocalSaving(true);
    try {
      await onSave(patch);
      onOpenChange(false);
    } finally {
      setLocalSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cf-finance-dialog cf-finance-editor-dialog" data-fin12-shared-case-finance-editor="true" data-fin13-client-case-finance-editor="true">
        <DialogHeader>
          <DialogTitle>Wartość sprawy i prowizja</DialogTitle>
          <p className="cf-finance-editor-dialog__subtitle">Edytujesz finanse konkretnej sprawy: {getCaseName(caseRecord)}.</p>
        </DialogHeader>
        <form className="cf-finance-editor-form" onSubmit={handleSubmit}>
          <div className="cf-finance-editor-grid">
            <label className="cf-finance-field">
              <span>Wartość sprawy / transakcji</span>
              <Input
                value={form.contractValue}
                inputMode="decimal"
                placeholder="Nie ustawiono"
                onChange={(event) => setForm((current) => ({ ...current, contractValue: event.target.value }))}
              />
              <small>Wartość sprawy jest kwotą. Puste pole zapisuje 0, a w UI pokazujemy „Nie ustawiono”.</small>
            </label>
            <label className="cf-finance-field">
              <span>Waluta</span>
              <Input
                value={form.currency}
                maxLength={3}
                placeholder="PLN"
                onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))}
              />
            </label>
            <label className="cf-finance-field">
              <span>Model prowizji</span>
              <select
                className="cf-finance-input"
                value={form.commissionMode}
                onChange={(event) => setForm((current) => ({ ...current, commissionMode: normalizeCommissionMode(event.target.value) }))}
              >
                <option value="none">Brak</option>
                <option value="percent">Procent od wartości</option>
                <option value="fixed">Kwota stała</option>
              </select>
            </label>
            <label className="cf-finance-field">
              <span>Procent prowizji</span>
              <Input
                value={form.commissionRate}
                inputMode="decimal"
                disabled={form.commissionMode !== 'percent'}
                placeholder="np. 3"
                onChange={(event) => setForm((current) => ({ ...current, commissionRate: event.target.value }))}
              />
            </label>
            <label className="cf-finance-field">
              <span>Kwota prowizji</span>
              <Input
                value={form.commissionAmount}
                inputMode="decimal"
                disabled={form.commissionMode !== 'fixed'}
                placeholder="np. 3000"
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
                <option value="not_set">Nieustawiona</option>
                <option value="expected">Oczekiwana</option>
                <option value="due">Należna</option>
                <option value="partially_paid">Częściowo zapłacona</option>
                <option value="paid">Zapłacona</option>
                <option value="overdue">Zaległa</option>
              </select>
            </label>
          </div>
          <div className="cf-finance-editor-preview" aria-label="Podgląd finansów sprawy">
            <div><span>Wartość:</span><strong>{preview.contractValue > 0 ? formatCaseFinanceMoney(preview.contractValue, preview.currency) : 'Nie ustawiono'}</strong></div>
            <div><span>Prowizja należna:</span><strong>{formatCaseFinanceMoney(preview.commissionAmount, preview.currency)}</strong></div>
            <div><span>Po wpłatach klienta pozostaje:</span><strong>{formatCaseFinanceMoney(preview.remainingAmount, preview.currency)}</strong></div>
            <div><span>Do zapłaty prowizji:</span><strong>{formatCaseFinanceMoney(preview.commissionRemainingAmount, preview.currency)}</strong></div>
          </div>
          <DialogFooter className="cf-finance-dialog__footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving || localSaving}>Anuluj</Button>
            <Button type="submit" disabled={!canSave}>{isSaving || localSaving ? 'Zapisywanie...' : 'Zapisz'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CaseFinanceEditorDialog;
