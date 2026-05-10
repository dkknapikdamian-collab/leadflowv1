import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../../lib/utils';
import { ENTITY_ICON_MAP, resolveEntityIcon, type CloseflowEntityIconName } from './icon-registry';

export type EntityIconSize = 'sm' | 'md' | 'lg';
export type EntityIconTone = 'default' | 'soft' | 'strong';

export type EntityIconProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  entity: keyof typeof ENTITY_ICON_MAP;
  size?: EntityIconSize;
  tone?: EntityIconTone;
  label?: string;
  decorative?: boolean;
};

export function EntityIcon({
  entity,
  size = 'md',
  tone = 'default',
  label,
  decorative = true,
  className,
  ...props
}: EntityIconProps) {
  const Icon = resolveEntityIcon(entity as CloseflowEntityIconName);
  return (
    <span
      className={cn(
        'cf-entity-icon',
        'cf-entity-icon-' + entity,
        'cf-entity-icon-size-' + size,
        'cf-entity-icon-tone-' + tone,
        className,
      )}
      data-cf-entity-icon={entity}
      data-cf-entity-icon-size={size}
      data-cf-entity-icon-tone={tone}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative ? (label || entity) : undefined}
      {...props}
    >
      <Icon className="cf-entity-icon-svg" focusable="false" aria-hidden="true" />
    </span>
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
export function SettingsEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="settings" {...props} />; }
export function BillingEntityIcon(props: Omit<EntityIconProps, 'entity'>) { return <EntityIcon entity="billing" {...props} />; }

/* CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B_API EntityIcon: entity, size?: 'sm' | 'md' | 'lg', tone?: 'default' | 'soft' | 'strong' */
