import type { ReactNode } from 'react';
import { AppIcon } from './icon';
import { Card, CardContent } from './card';
import type { IconName } from '../../lib/source-of-truth/icon-registry';
import { cn } from '../../lib/utils';

export type EmptyStateCardProps = {
  iconName: IconName;
  title: ReactNode;
  description?: ReactNode;
  cta?: ReactNode;
  className?: string;
  dataAttrs?: Record<`data-${string}`, string | number | boolean | undefined>;
};

function cleanDataAttrs(dataAttrs?: EmptyStateCardProps['dataAttrs']) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function EmptyStateCard({ iconName, title, description, cta, className, dataAttrs }: EmptyStateCardProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <Card className={cn('cf-empty-state-card-variant', className)} data-cf-card-variant="empty-state" data-cf-card-source-truth="lf-ui-sot-cz2-012" {...attrs}>
      <CardContent className="cf-empty-state-card-variant-content">
        <AppIcon name={iconName} className="h-4 w-4" decorative />
        <div className="cf-empty-state-card-variant-copy">
          <strong>{title}</strong>
          {description ? <span>{description}</span> : null}
        </div>
        {cta ? <div className="cf-empty-state-card-variant-cta">{cta}</div> : null}
      </CardContent>
    </Card>
  );
}
