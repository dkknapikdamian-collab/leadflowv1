import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../../lib/utils';
import { resolveEntityIcon, type CloseflowEntityIconName } from './icon-registry';

export type EntityIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'ref'> & {
  entity: CloseflowEntityIconName;
  label?: string;
  decorative?: boolean;
};

export function EntityIcon({ entity, label, decorative = true, className, ...props }: EntityIconProps) {
  const Icon = resolveEntityIcon(entity);
  return (
    <Icon
      className={cn('cf-entity-icon', 'cf-entity-icon-' + entity, className)}
      data-cf-entity-icon={entity}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative ? (label || entity) : undefined}
      focusable="false"
      {...props}
    />
  );
}

export function ClientEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="client" {...props} />; }
export function LeadEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="lead" {...props} />; }
export function CaseEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="case" {...props} />; }
export function TaskEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="task" {...props} />; }
export function EventEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="event" {...props} />; }
export function ActivityEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="activity" {...props} />; }
export function PaymentEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="payment" {...props} />; }
export function CommissionEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="commission" {...props} />; }
export function AiEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="ai" {...props} />; }
export function TemplateEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="template" {...props} />; }
export function NotificationEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="notification" {...props} />; }
