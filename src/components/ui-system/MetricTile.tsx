import { ComponentType, type ReactNode } from 'react';
import { OperatorMetricTile, type OperatorMetricTone } from './OperatorMetricTiles';

export type MetricTileTone =
  | OperatorMetricTone
  | 'active'
  | 'waiting'
  | 'overdue'
  | 'risk'
  | 'done'
  | 'value'
  | 'ai'
  | 'drafts';

export type MetricTileProps = {
  key?: string | number;
  label: string;
  value: string | number;
  helper?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  tone?: MetricTileTone | string;
  active?: boolean;
  onClick?: () => void;
  to?: string;
  title?: string;
  ariaLabel?: string;
  dataTab?: string;
  className?: string;
  /** Legacy compatibility. Tone is now owned by OperatorMetricTile. */
  valueClassName?: string;
  /** Legacy compatibility. Tone is now owned by OperatorMetricTile. */
  iconClassName?: string;
};

function MetricTileFallbackIcon({ className }: { className?: string }) {
  return <span className={['block h-2 w-2 rounded-full bg-current', className].filter(Boolean).join(' ')} aria-hidden="true" />;
}

export function MetricTile({
  label,
  value,
  helper,
  icon,
  tone,
  active = false,
  onClick,
  to,
  title,
  ariaLabel,
  dataTab,
  className = '',
}: MetricTileProps) {
  const Icon = icon ?? MetricTileFallbackIcon;
  const id = dataTab || (typeof title === 'string' ? title : label);

  return (
    <div
      className={['cf-metric-tile cf-component-registry-metric-tile', className].filter(Boolean).join(' ')}
      data-cf-ui-component="MetricTile"
      data-cf-metric-tile-minimal-api="label,value,helper,icon,tone,active,onClick"
      data-cf-metric-tile-contract="component-registry-vs2"
    >
      <OperatorMetricTile
        item={{
          id,
          label,
          value,
          helper,
          icon: Icon,
          tone,
          active,
          onClick,
          to,
          title,
          ariaLabel,
        }}
        active={active}
      />
    </div>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API MetricTile: label, value, helper?, icon?, tone?, active?, onClick? */
