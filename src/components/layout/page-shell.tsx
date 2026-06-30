import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type LayoutDataAttrs = Record<`data-${string}`, string | number | boolean | undefined>;

export type PageShellProps = {
  children: ReactNode;
  header?: ReactNode;
  rail?: ReactNode;
  className?: string;
  contentClassName?: string;
  dataAttrs?: LayoutDataAttrs;
};

function cleanDataAttrs(dataAttrs?: LayoutDataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function PageShell({ children, header, rail, className, contentClassName, dataAttrs }: PageShellProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <section className={cn(className)} data-cf-layout-source-truth="lf-ui-sot-cz2-015" data-cf-layout-variant="page-shell" {...attrs}>
      {header ? <div data-cf-page-shell-header="true">{header}</div> : null}
      <div className={cn(contentClassName)} data-cf-page-shell-content="true">
        {children}
      </div>
      {rail ? <aside data-cf-page-shell-rail="true">{rail}</aside> : null}
    </section>
  );
}
