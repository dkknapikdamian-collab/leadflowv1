import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type LayoutDataAttrs = Record<`data-${string}`, string | number | boolean | undefined>;

export type AppShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
  mobileNav?: ReactNode;
  className?: string;
  dataAttrs?: LayoutDataAttrs;
};

function cleanDataAttrs(dataAttrs?: LayoutDataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function AppShell({ children, sidebar, mobileNav, className, dataAttrs }: AppShellProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <div className={cn(className)} data-cf-layout-source-truth="lf-ui-sot-cz2-015" data-cf-layout-variant="app-shell" {...attrs}>
      {sidebar}
      {children}
      {mobileNav}
    </div>
  );
}
