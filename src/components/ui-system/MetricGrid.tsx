import type { ReactNode } from 'react';

export type MetricGridProps = {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
};

const COLUMN_CLASS: Record<NonNullable<MetricGridProps['columns']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
};

export function MetricGrid({ children, className = '', columns = 4 }: MetricGridProps) {
  return (
    <section
      className={['cf-metric-grid grid grid-cols-1 gap-3', COLUMN_CLASS[columns], className].filter(Boolean).join(' ')}
      data-cf-ui-component="MetricGrid"
      data-standard-metric-grid="true"
    >
      {children}
    </section>
  );
}
