import { type ReactNode } from 'react';
import { OperatorSideCard, SimpleFiltersCard } from '../components/operator-rail';
import { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';

export type SimpleFilterItem = {
  key: string;
  label: string;
  value: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  dataAttrs?: OperatorRailDataAttrs;
};

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
      dataAttrs={dataAttrs}
    >
      <div className="quick-list">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            aria-label={item.ariaLabel || item.label}
            {...(item.dataAttrs || {})}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </button>
        ))}
      </div>
    </OperatorSideCard>
  );
}
