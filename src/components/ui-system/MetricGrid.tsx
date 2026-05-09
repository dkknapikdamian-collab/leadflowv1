import type { HTMLAttributes, ReactNode } from 'react';

const CLOSEFLOW_METRIC_GRID_FINAL_MIGRATION_VS5 = 'CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5: MetricGrid is the final shared metric tile grid contract';
const CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S = 'CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S: route metric grids must use MetricGrid, not local page grids';
void CLOSEFLOW_METRIC_GRID_FINAL_MIGRATION_VS5;
void CLOSEFLOW_METRIC_TILE_SINGLE_SOURCE_TRUTH_VS5S;

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
      data-cf-metric-grid-contract="final-vs5"
      data-standard-metric-grid="true"
      data-cf-metric-single-source="vs5s"
    >
      {children}
    </section>
  );
}
