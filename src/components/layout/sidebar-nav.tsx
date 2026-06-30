import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppIcon } from '../ui/icon';
import { Button } from '../ui/button';
import type { IconName } from '../../lib/source-of-truth/icon-registry';
import { cn } from '../../lib/utils';

type LayoutDataAttrs = Record<`data-${string}`, string | number | boolean | undefined>;

export type SidebarNavItem = {
  key: string;
  label: ReactNode;
  href?: string;
  active?: boolean;
  iconName?: IconName;
  badge?: ReactNode;
  onClick?: () => void;
};

export type SidebarNavProps = {
  items: SidebarNavItem[];
  footer?: ReactNode;
  className?: string;
  dataAttrs?: LayoutDataAttrs;
};

function cleanDataAttrs(dataAttrs?: LayoutDataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function SidebarNav({ items, footer, className, dataAttrs }: SidebarNavProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <nav className={cn(className)} aria-label="Główne menu CloseFlow" data-cf-layout-source-truth="lf-ui-sot-cz2-015" data-cf-layout-variant="sidebar-nav" {...attrs}>
      {items.map((item) => {
        const content = (
          <>
            {item.iconName ? <AppIcon name={item.iconName} className="h-4 w-4" decorative /> : null}
            <span>{item.label}</span>
            {item.badge ? <span data-cf-sidebar-nav-badge="true">{item.badge}</span> : null}
          </>
        );

        if (item.href) {
          return (
            <Link key={item.key} to={item.href} aria-current={item.active ? 'page' : undefined} data-cf-sidebar-nav-item="true" data-cf-sidebar-nav-active={item.active ? 'true' : undefined} onClick={item.onClick}>
              {content}
            </Link>
          );
        }

        return (
          <Button key={item.key} type="button" variant="ghost" aria-current={item.active ? 'page' : undefined} data-cf-sidebar-nav-item="true" data-cf-sidebar-nav-active={item.active ? 'true' : undefined} onClick={item.onClick}>
            {content}
          </Button>
        );
      })}
      {footer ? <div data-cf-sidebar-nav-footer="true">{footer}</div> : null}
    </nav>
  );
}
