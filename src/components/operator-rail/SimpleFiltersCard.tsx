import { type ReactNode } from 'react';
import { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';
import { resolveOperatorRailTone, type OperatorRailTone } from '../../lib/operator-rail-tone';

export type SimpleFilterItem = {
  key: string;
  label: string;
  value: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  dataAttrs?: OperatorRailDataAttrs;
  tone?: OperatorRailTone | string;
};

export const CLOSEFLOW_SIMPLE_FILTERS_CARD_SOURCE_TRUTH_STAGE96 = 'SimpleFiltersCard is the shared operator rail filter card for leads/clients';

export type SimpleFiltersCardProps = {
  title: string;
  description?: string;
  items: SimpleFilterItem[];
  className?: string;
  dataTestId?: string;
  dataAttrs?: OperatorRailDataAttrs;
};

export function SimpleFiltersCard({
  title,
  description,
  items,
  className,
  dataTestId,
  dataAttrs,
}: SimpleFiltersCardProps) {
  return (
    <OperatorSideCard
      title={title}
      description={description}
      className={className}
      dataTestId={dataTestId}
      dataAttrs={{ ...(dataAttrs || {}), 'data-cf-simple-filters-card': true }}
    >
      <div className="quick-list">
        {items.map((item) => {
          const tone = resolveOperatorRailTone({ key: item.key, label: item.label, explicitTone: item.tone });

          return (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              aria-label={item.ariaLabel || item.label}
              {...(item.dataAttrs || {})}
              data-cf-operator-rail-item="true"
              data-cf-operator-rail-tone={tone}
            className="cf-rail-filter-row"
            >
              <span className="cf-rail-filter-label">{item.label}</span>
              <strong className="cf-rail-filter-count">{item.value}</strong>
            </button>
          );
        })}
      </div>
    </OperatorSideCard>
  );
}
