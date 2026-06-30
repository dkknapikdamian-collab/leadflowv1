import { type ReactNode } from 'react';
import { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';
import { FilterChipGroup } from '../ui/filter-chip-group';
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
export const CLOSEFLOW_CZ2_014_SIMPLE_FILTERS_CHIP_GROUP = 'SimpleFiltersCard scoped migration uses FilterChipGroup source of truth';

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
      <FilterChipGroup
        value=""
        onChange={(key) => {
          const selected = items.find((item) => item.key === key);
          selected?.onClick?.();
        }}
        className="quick-list"
        chipClassName="cf-rail-filter-row"
        labelClassName="cf-rail-filter-label"
        countClassName="cf-rail-filter-count"
        dataAttrs={{ 'data-cf-simple-filters-chip-group': true }}
        options={items.map((item) => {
          const tone = resolveOperatorRailTone({ key: item.key, label: item.label, explicitTone: item.tone });
          return {
            value: item.key,
            label: item.label,
            count: typeof item.value === 'number' ? item.value : undefined,
            countNode: typeof item.value === 'number' ? undefined : item.value,
            dataAttrs: {
              ...(item.dataAttrs || {}),
              'data-cf-operator-rail-item': true,
              'data-cf-operator-rail-tone': tone,
              'aria-label': item.ariaLabel || item.label,
            },
          };
        })}
      />
    </OperatorSideCard>
  );
}
