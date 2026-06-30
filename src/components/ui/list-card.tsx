import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './card';
import { cn } from '../../lib/utils';

export type ListCardBadge = {
  key: string;
  label: ReactNode;
  tone?: string;
};

export type ListCardAction = {
  key: string;
  node: ReactNode;
};

export type ListCardProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  badges?: ListCardBadge[];
  actions?: ReactNode | ListCardAction[];
  href?: string;
  children?: ReactNode;
  className?: string;
  dataAttrs?: Record<`data-${string}`, string | number | boolean | undefined>;
};

function cleanDataAttrs(dataAttrs?: ListCardProps['dataAttrs']) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function ListCard({
  title,
  subtitle,
  badges = [],
  actions,
  href,
  children,
  className,
  dataAttrs,
}: ListCardProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  const actionNodes = Array.isArray(actions) ? actions.map((action) => <span key={action.key}>{action.node}</span>) : actions;
  const card = (
    <Card className={cn('cf-list-card-variant', className)} data-cf-card-variant="list" data-cf-card-source-truth="lf-ui-sot-cz2-012" {...attrs}>
      <CardContent className="cf-list-card-variant-content">
        <div className="cf-list-card-variant-main">
          <div className="cf-list-card-variant-title-row">
            <strong className="cf-list-card-variant-title">{title}</strong>
            {badges.length > 0 ? (
              <span className="cf-list-card-variant-badges">
                {badges.map((badge) => (
                  <span key={badge.key} className="cf-status-pill" data-cf-status-tone={badge.tone || 'neutral'}>{badge.label}</span>
                ))}
              </span>
            ) : null}
          </div>
          {subtitle ? <span className="cf-list-card-variant-subtitle">{subtitle}</span> : null}
          {children}
        </div>
        {actionNodes ? <div className="cf-list-card-variant-actions">{actionNodes}</div> : null}
      </CardContent>
    </Card>
  );

  if (href) return <Link to={href}>{card}</Link>;
  return card;
}
