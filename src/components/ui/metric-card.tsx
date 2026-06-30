import type { KeyboardEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppIcon } from './icon';
import { Card } from './card';
import type { IconName } from '../../lib/source-of-truth/icon-registry';
import { cn } from '../../lib/utils';

export type MetricCardTone = 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple';

export type MetricCardProps = {
  label: string;
  value: string | number;
  iconName: IconName;
  tone?: MetricCardTone | string;
  meta?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  title?: string;
  ariaLabel?: string;
  className?: string;
  dataAttrs?: Record<`data-${string}`, string | number | boolean | undefined>;
};

function cleanDataAttrs(dataAttrs?: MetricCardProps['dataAttrs']) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

function handleMetricCardKeyDown(event: KeyboardEvent<HTMLDivElement>, onClick?: () => void) {
  if (!onClick) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  onClick();
}

export function MetricCard({
  label,
  value,
  iconName,
  tone = 'neutral',
  meta,
  active = false,
  onClick,
  href,
  title,
  ariaLabel,
  className,
  dataAttrs,
}: MetricCardProps) {
  const metricId = String(label || iconName);
  const semanticKey = metricId.toLowerCase();
  const attrs = cleanDataAttrs(dataAttrs);
  const card = (
    <Card
      role={onClick && !href ? 'button' : undefined}
      tabIndex={onClick && !href ? 0 : undefined}
      onClick={href ? undefined : onClick}
      onKeyDown={href ? undefined : (event) => handleMetricCardKeyDown(event, onClick)}
      title={title}
      aria-label={ariaLabel || title || label}
      aria-pressed={href ? undefined : active}
      className={cn('cf-operator-metric-tile', active ? 'is-active' : '', className)}
      data-cf-card-variant="metric"
      data-cf-card-source-truth="lf-ui-sot-cz2-012"
      data-cf-operator-metric-tile="true"
      data-cf-operator-metric-tone={tone}
      data-cf-operator-metric-id={metricId}
      data-cf-metric-source-truth="cz2-012-card-variant"
      data-cf-operator-metric-active={active ? 'true' : 'false'}
      data-cf-semantic-tone={tone}
      data-cf-semantic-key={semanticKey}
      {...attrs}
    >
      <div
        className="cf-operator-metric-tile-content"
        data-cf-operator-metric-tile-content="true"
        data-cf-operator-metric-tone={tone}
        data-cf-operator-metric-id={metricId}
        data-cf-semantic-tone={tone}
        data-cf-semantic-key={semanticKey}
      >
        <div className="cf-operator-metric-text">
          <span className="cf-operator-metric-label">{label}</span>
          {meta ? <span className="cf-operator-metric-helper">{meta}</span> : null}
        </div>
        <div className="cf-operator-metric-value-row">
          <strong className="cf-operator-metric-value" data-cf-operator-metric-value="true" data-cf-operator-metric-value-tone={tone}>{value}</strong>
          <span className="cf-operator-metric-icon" aria-hidden="true" data-cf-operator-metric-icon-tone={tone}>
            <AppIcon name={iconName} className="h-4 w-4" decorative />
          </span>
        </div>
      </div>
    </Card>
  );

  if (href) {
    return <Link to={href}>{card}</Link>;
  }

  return card;
}
