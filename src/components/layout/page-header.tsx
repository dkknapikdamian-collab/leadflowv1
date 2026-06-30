import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type LayoutDataAttrs = Record<`data-${string}`, string | number | boolean | undefined>;

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
  dataAttrs?: LayoutDataAttrs;
};

function cleanDataAttrs(dataAttrs?: LayoutDataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function PageHeader({ title, description, eyebrow, actions, meta, className, dataAttrs }: PageHeaderProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <header className={cn(className)} data-cf-layout-source-truth="lf-ui-sot-cz2-015" data-cf-layout-variant="page-header" {...attrs}>
      <div>
        {eyebrow ? <p data-cf-page-header-eyebrow="true">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p data-cf-page-header-description="true">{description}</p> : null}
        {meta ? <div data-cf-page-header-meta="true">{meta}</div> : null}
      </div>
      {actions ? <div data-cf-page-header-actions="true">{actions}</div> : null}
    </header>
  );
}
