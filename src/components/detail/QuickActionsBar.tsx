import { type ReactNode } from 'react';

export type QuickActionItem = {
  key: string;
  label: string;
  tone?: string;
  icon?: unknown;
  disabled?: boolean;
  onClick?: () => void;
  data?: Record<string, string | number | boolean | undefined>;
};
export type QuickActionsBarActionTone = 'note' | 'task' | 'event' | 'missing' | 'lost' | 'service' | 'payment' | 'neutral';

export type QuickActionsBarAction = {
  key: string;
  label: string;
  tone?: QuickActionsBarActionTone;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  data?: Record<string, string | undefined>;
};

export type QuickActionsBarProps = {
  title?: string;
  ariaLabel: string;
  recordType: 'lead' | 'case';
  variant?: 'rail' | 'inline';
  dataStage?: string;
  actions: QuickActionsBarAction[];
};

const STAGE227E3_SHARED_QUICK_ACTIONS_BAR = 'LeadDetail and CaseDetail share one QuickActionsBar visual source of truth';
void STAGE227E3_SHARED_QUICK_ACTIONS_BAR;
const STAGE227E4_QUICK_ACTIONS_SOURCE_OF_TRUTH = 'QuickActionsBar is the shared visual source of truth for LeadDetail and CaseDetail action bars';
void STAGE227E4_QUICK_ACTIONS_SOURCE_OF_TRUTH;

export default function QuickActionsBar({
  title = 'Szybkie akcje',
  ariaLabel,
  recordType,
  variant = 'rail',
  dataStage,
  actions,
}: QuickActionsBarProps) {
  return (
    <section
      className={`cf-shared-quick-actions-bar cf-shared-quick-actions-bar--${variant} cf-shared-quick-actions-bar--${recordType}`}
      data-stage227e3-shared-quick-actions-bar="true"
      data-stage227e4-quick-actions-source-of-truth="true"
      data-stage={dataStage}
      data-record-type={recordType}
      aria-label={ariaLabel}
    >
      <header className="cf-shared-quick-actions-bar__header">
        <strong>{title}</strong>
      </header>
      <div className="cf-shared-quick-actions-bar__grid">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            className={`cf-shared-quick-actions-bar__button cf-shared-quick-actions-bar__button--${action.tone || 'neutral'}`}
            onClick={action.onClick}
            disabled={action.disabled}
            data-stage227e3-action-key={action.key}
            {...(action.data || {})}
          >
            {action.icon ? <span className="cf-shared-quick-actions-bar__icon">{action.icon}</span> : null}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
