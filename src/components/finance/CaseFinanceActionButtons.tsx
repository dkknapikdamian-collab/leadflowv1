import { Button } from '../ui/button';
import '../../styles/finance/closeflow-finance.css';

export const CLOSEFLOW_FIN12_CASE_FINANCE_ACTION_BUTTONS = 'CLOSEFLOW_FIN12_CASE_FINANCE_ACTION_BUTTONS_V1' as const;
export const CLOSEFLOW_FIN13_CLIENT_CASE_FINANCE_ACTION_BUTTONS = 'CLOSEFLOW_FIN13_CLIENT_CASE_FINANCE_ACTION_BUTTONS_V1' as const;

type CaseFinanceActionButtonsProps = {
  onEdit: () => void;
  onAddPayment?: () => void;
  onAddCommissionPayment?: () => void;
  onOpenCase?: () => void;
  disabled?: boolean;
  compact?: boolean;
  showCommissionPayment?: boolean;
  showOpenCase?: boolean;
  className?: string;
};

export function CaseFinanceActionButtons({
  onEdit,
  onAddPayment,
  onAddCommissionPayment,
  onOpenCase,
  disabled = false,
  compact = false,
  showCommissionPayment = false,
  showOpenCase = false,
  className = '',
}: CaseFinanceActionButtonsProps) {
  return (
    <div className={`cf-case-finance-action-buttons ${compact ? 'cf-case-finance-action-buttons--compact' : ''} ${className}`.trim()} data-fin12-case-finance-action-buttons="true" data-fin13-client-case-finance-action-buttons="true">
      <Button type="button" variant="outline" onClick={onEdit} disabled={disabled}>Edytuj wartość/prowizję</Button>
      {onAddPayment ? <Button type="button" variant="outline" onClick={onAddPayment} disabled={disabled}>Dodaj wpłatę</Button> : null}
      {showCommissionPayment && onAddCommissionPayment ? <Button type="button" variant="outline" onClick={onAddCommissionPayment} disabled={disabled}>Dodaj płatność prowizji</Button> : null}
      {showOpenCase && onOpenCase ? <Button type="button" onClick={onOpenCase} disabled={disabled}>Otwórz sprawę</Button> : null}
    </div>
  );
}

export default CaseFinanceActionButtons;
