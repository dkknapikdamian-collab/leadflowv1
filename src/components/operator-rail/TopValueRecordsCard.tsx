import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
  const rootClassName = className?.includes('operator-top-value-card')
    ? className
    : ['operator-top-value-card', className].filter(Boolean).join(' ');

  return (
    <OperatorSideCard
      title={title}
      description={description}
      headerAside={headerAside}
      className={rootClassName}
      dataTestId={dataTestId}
      dataAttrs={{ ...(dataAttrs || {}), 'data-cf-top-value-records-card': true }}
    >
      {items.length ? (
        <div className="quick-list">
          {items.map((item) => {
            const fullTitle = item.title || (item.description ? item.label + ' - ' + item.description + ' - ' + item.valueLabel : item.label + ' - ' + item.valueLabel);
            const hasDescription = Boolean(item.description);

            return (
              <Link
                key={item.key}
                to={item.href || '#'}
                title={fullTitle}
                {...(item.dataAttrs || {})}
                data-cf-operator-rail-item="true"
                data-cf-operator-rail-tone="blue"
              className="cf-rail-top-row"
              >
                <span
                  className="lead-relation-label-wrap cf-top-value-label-wrap cf-rail-top-name"
                  title={item.description ? item.label + ' - ' + item.description : item.label}
                >
                  <span className={hasDescription ? 'cf-top-value-line cf-top-value-line-with-description' : 'cf-top-value-line cf-top-value-line-single'}>
                    <strong className="lead-relation-label cf-top-value-label" title={item.label}>{item.label}</strong>
                    {item.description ? (
                      <>
                        <span className="cf-top-value-separator" aria-hidden="true">·</span>
                        <small className="lead-relation-description cf-top-value-description" title={item.description}>{item.description}</small>
                      </>
                    ) : null}
                  </span>
                </span>
                <strong className="lead-relation-money cf-top-value-money cf-rail-top-value">{item.valueLabel}</strong>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="note">{emptyLabel}</div>
      )}
    </OperatorSideCard>
  );
}
