import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type DetailPanelProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  dataAttrs?: DataAttrs;
};

function cleanDataAttrs(dataAttrs?: DataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function DetailPanel({ title, description, actions, children, className, contentClassName, dataAttrs }: DetailPanelProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <Card className={cn('cf-detail-panel-variant', className)} data-cf-card-variant="detail-panel" data-cf-card-source-truth="lf-ui-sot-cz2-012" {...attrs}>
      <CardHeader className="cf-detail-panel-variant-header">
        <div className="cf-detail-panel-variant-heading">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {actions ? <div className="cf-detail-panel-variant-actions">{actions}</div> : null}
      </CardHeader>
      {children ? <CardContent className={cn('cf-detail-panel-variant-content', contentClassName)}>{children}</CardContent> : null}
    </Card>
  );
}
