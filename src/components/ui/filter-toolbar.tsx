import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type FilterToolbarProps = {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  dataAttrs?: DataAttrs;
};

function cleanDataAttrs(dataAttrs?: DataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function FilterToolbar({ children, title, description, actions, className, dataAttrs }: FilterToolbarProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <div className={cn('cf-filter-toolbar-control', className)} data-cf-filter-control-variant="toolbar" data-cf-filter-search-sort-source-truth="lf-ui-sot-cz2-014" {...attrs}>
      {title || description || actions ? (
        <div data-cf-filter-toolbar-header="true">
          <div>
            {title ? <strong>{title}</strong> : null}
            {description ? <p>{description}</p> : null}
          </div>
          {actions ? <div data-cf-filter-toolbar-actions="true">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
