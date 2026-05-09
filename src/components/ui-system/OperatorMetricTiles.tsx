import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V = 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V: isolated metric renderer';
/* CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_COMPAT data-cf-metric-source-truth="vs5v" */
const CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W = 'CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W: OperatorMetricTiles owns value/icon tone and metric identity';
const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3: OperatorMetricTile is the shared final renderer for StatShortcutCard and OperatorMetricTiles';
void CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V;
void CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W;
void CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3;

export type OperatorMetricTone = 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple';

export type OperatorMetricTileItem<TId extends string = string> = {
  id: TId;
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  tone?: OperatorMetricTone | string;
  active?: boolean;
  onClick?: () => void;
  to?: string;
  title?: string;
  ariaLabel?: string;
  helper?: ReactNode;
};

export type OperatorMetricTilesProps<TId extends string = string> = Omit<HTMLAttributes<HTMLElement>, 'onSelect'> & {
  items: OperatorMetricTileItem<TId>[];
  activeId?: TId | string | null;
  onSelect?: (item: OperatorMetricTileItem<TId>) => void;
  columns?: 2 | 3 | 4;
};

function normalizeTone(tone?: OperatorMetricTone | string): OperatorMetricTone {
  if (tone === 'blue' || tone === 'amber' || tone === 'red' || tone === 'green' || tone === 'purple') return tone;
  return 'neutral';
}

export function OperatorMetricTiles<TId extends string = string>({
  items,
  activeId,
  onSelect,
  columns = 4,
  className = '',
  ...rest
}: OperatorMetricTilesProps<TId>) {
  return (
    <section
      {...rest}
      className={['cf-operator-metric-grid', 'cf-operator-metric-grid-' + columns, className].filter(Boolean).join(' ')}
      data-cf-operator-metric-grid="true"
      data-cf-metric-renderer="OperatorMetricTiles"
      data-cf-metric-source-truth="vs5x-repair3"
    >
      {items.map((item) => {
        const isActive = item.active ?? (activeId != null && String(activeId) === String(item.id));
        return (
          <OperatorMetricTile
            key={String(item.id)}
            item={item}
            active={Boolean(isActive)}
            onSelect={onSelect}
          />
        );
      })}
    </section>
  );
}

export function OperatorMetricTile<TId extends string = string>({
  item,
  active = false,
  onSelect,
}: {
  item: OperatorMetricTileItem<TId>;
  active?: boolean;
  onSelect?: (item: OperatorMetricTileItem<TId>) => void;
}) {
  const Icon = item.icon;
  const tone = normalizeTone(item.tone);
  const metricId = String(item.id || item.label);
  const content = (
    <div
      className="cf-operator-metric-tile-content"
      data-cf-operator-metric-tile-content="true"
      data-cf-operator-metric-tone={tone}
      data-cf-operator-metric-id={metricId}
    >
      <div className="cf-operator-metric-text">
        <span className="cf-operator-metric-label">{item.label}</span>
        {item.helper ? <span className="cf-operator-metric-helper">{item.helper}</span> : null}
      </div>
      <div className="cf-operator-metric-value-row">
        <strong className="cf-operator-metric-value" data-cf-operator-metric-value="true" data-cf-operator-metric-value-tone={tone}>{item.value}</strong>
        <span className="cf-operator-metric-icon" aria-hidden="true">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );

  const className = ['cf-operator-metric-tile', active ? 'is-active' : ''].filter(Boolean).join(' ');
  const sharedProps = {
    className,
    title: item.title,
    'aria-label': item.ariaLabel || item.title || item.label,
    'aria-pressed': item.to ? undefined : active,
    'data-cf-operator-metric-tile': 'true',
    'data-cf-operator-metric-tone': tone,
    'data-cf-operator-metric-id': metricId,
    'data-cf-metric-source-truth': 'vs5x-repair3',
    'data-cf-operator-metric-active': active ? 'true' : 'false',
  } as const;

  if (item.to) {
    return (
      <Link to={item.to} {...sharedProps}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      {...sharedProps}
      onClick={() => {
        item.onClick?.();
        onSelect?.(item);
      }}
    >
      {content}
    </button>
  );
}

export default OperatorMetricTiles;
