import { type ComponentType, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { resolveOperatorMetricTone, type OperatorMetricTone } from './operator-metric-tone-contract';
export type { OperatorMetricTone } from './operator-metric-tone-contract';

const CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V = 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V: isolated metric renderer';
/* CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_COMPAT data-cf-metric-source-truth="vs5v" */
const CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W = 'CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W: OperatorMetricTiles owns value/icon tone and metric identity';
const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3: OperatorMetricTile is the shared final renderer for StatShortcutCard and OperatorMetricTiles';
const CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT = 'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH: OperatorMetricTiles resolves tones from semantic id/label before local screen colors';
void CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V;
void CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W;
void CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3;
void CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT;


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


export function OperatorMetricTiles<TId extends string = string>({
  items,
  activeId,
  onSelect,
  columns = 4,
  className = '',
  ...rest
}: OperatorMetricTilesProps<TId>) {
  return (
    <section data-cf-mobile-start-tile-trim="true"
      {...rest}
      className={['cf-operator-metric-grid', 'cf-operator-metric-grid-' + columns, className].filter(Boolean).join(' ')}
      data-cf-operator-metric-grid="true"
      data-cf-metric-renderer="OperatorMetricTiles"
      data-cf-metric-source-truth="vs5x-repair3"
    >
      {items.map((item) => {
        const isActive = item.active ?? (activeId != null && String(activeId) === String(item.id));
        return (
          <Fragment key={String(item.id)}>
            <OperatorMetricTile
              item={item}
              active={Boolean(isActive)}
              onSelect={onSelect}
            />
          </Fragment>
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
  const metricId = String(item.id || item.label);
  const tone = resolveOperatorMetricTone({ id: metricId, label: item.label, tone: item.tone });
  const semanticKey = String(metricId || item.label).toLowerCase();
  const content = (
    <div
      className="cf-operator-metric-tile-content"
      data-cf-operator-metric-tile-content="true"
      data-cf-operator-metric-tone={tone}
      data-cf-operator-metric-id={metricId}
      data-cf-semantic-tone={tone}
      data-cf-semantic-key={semanticKey}
    >
      <div className="cf-operator-metric-text">
        <span className="cf-operator-metric-label">{item.label}</span>
        {item.helper ? <span className="cf-operator-metric-helper">{item.helper}</span> : null}
      </div>
      <div className="cf-operator-metric-value-row">
        <strong className="cf-operator-metric-value" data-cf-operator-metric-value="true" data-cf-operator-metric-value-tone={tone}>{item.value}</strong>
        <span className="cf-operator-metric-icon" aria-hidden="true" data-cf-operator-metric-icon-tone={tone}>
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
    'data-cf-semantic-tone': tone,
    'data-cf-semantic-key': semanticKey,
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
