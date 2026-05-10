import type { HTMLAttributes, ReactNode } from 'react';

export type MetricGridProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
};

const COLUMN_CLASS: Record<NonNullable<MetricGridProps['columns']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
};

export function MetricGrid({ children, className = '', columns = 4, ...props }: MetricGridProps) {
  return (
    <section
      {...props}
      className={['cf-metric-grid grid grid-cols-1 gap-3', COLUMN_CLASS[columns], className].filter(Boolean).join(' ')}
      data-cf-ui-component="MetricGrid"
      data-cf-metric-grid-contract="component-registry-vs2"
      data-standard-metric-grid="true"
      data-cf-metric-grid-mobile-columns="1"
    >
      {children}
    </section>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API MetricGrid: columns?: 2 | 3 | 4, mobile always 1 column */
