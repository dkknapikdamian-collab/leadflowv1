import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';

export type TopValueRecordItem = {
  key: string;
  label: string;
  valueLabel: string;
  href?: string;
  description?: string;
  title?: string;
  dataAttrs?: OperatorRailDataAttrs;
};

export type TopValueRecordsCardProps = {
  title: string;
  description?: string;
  headerAside?: ReactNode;
  items: TopValueRecordItem[];
  emptyLabel?: string;
  className?: string;
  dataTestId?: string;
  dataAttrs?: OperatorRailDataAttrs;
};

export function TopValueRecordsCard({
  title,
  description,
  headerAside,
  items,
  emptyLabel = 'Brak rekordów do wyświetlenia.',
  className,
  dataTestId,
  dataAttrs,
}: TopValueRecordsCardProps) {
  return (
    <OperatorSideCard
      title={title}
      description={description}
      headerAside={headerAside}
      className={className}
      dataTestId={dataTestId}
      dataAttrs={dataAttrs}
    >
      {items.length ? (
        <div className="quick-list">
          {items.map((item) => (
            <Link
              key={item.key}
              to={item.href || '#'}
              title={item.title || (item.label + ' - ' + item.valueLabel)}
              {...(item.dataAttrs || {})}
            >
              <span className="lead-relation-label-wrap">
                <strong className="lead-relation-label">{item.label}</strong>
                {item.description ? <small className="lead-relation-description">{item.description}</small> : null}
              </span>
              <strong className="lead-relation-money">{item.valueLabel}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <div className="note">{emptyLabel}</div>
      )}
    </OperatorSideCard>
  );
}
