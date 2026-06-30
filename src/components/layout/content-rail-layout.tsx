import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type LayoutDataAttrs = Record<`data-${string}`, string | number | boolean | undefined>;

export type ContentRailLayoutProps = {
  main: ReactNode;
  rail?: ReactNode;
  className?: string;
  mainClassName?: string;
  railClassName?: string;
  dataAttrs?: LayoutDataAttrs;
};

function cleanDataAttrs(dataAttrs?: LayoutDataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function ContentRailLayout({ main, rail, className, mainClassName, railClassName, dataAttrs }: ContentRailLayoutProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <div className={cn(className)} data-cf-layout-source-truth="lf-ui-sot-cz2-015" data-cf-layout-variant="content-rail" {...attrs}>
      <main className={cn(mainClassName)} data-cf-content-rail-main="true">
        {main}
      </main>
      {rail ? <aside className={cn(railClassName)} data-cf-content-rail-rail="true">{rail}</aside> : null}
    </div>
  );
}
