import * as React from 'react';

import { cn } from '../lib/utils';
import { Button, type ButtonProps } from './ui/button';

export type EntityActionTone = 'neutral' | 'danger';

const ENTITY_ACTION_TONE_CLASS: Record<EntityActionTone, string> = {
  neutral: 'cf-entity-action-neutral',
  danger: 'cf-entity-action-danger',
};

export function actionIconClass(tone: EntityActionTone = 'neutral', className?: string) {
  return cn('cf-entity-action cf-entity-icon-action', ENTITY_ACTION_TONE_CLASS[tone], className);
}

export function actionButtonClass(tone: EntityActionTone = 'neutral', className?: string) {
  return cn('cf-entity-action', ENTITY_ACTION_TONE_CLASS[tone], className);
}

export type EntityActionButtonProps = ButtonProps & {
  tone?: EntityActionTone;
  iconOnly?: boolean;
};

export const EntityActionButton = React.forwardRef<HTMLButtonElement, EntityActionButtonProps>(
  ({ tone = 'neutral', iconOnly = false, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(actionButtonClass(tone), iconOnly ? 'cf-entity-icon-action' : null, className)}
      {...props}
    />
  )
);

EntityActionButton.displayName = 'EntityActionButton';

export function EntityActionIcon({
  tone = 'neutral',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: EntityActionTone }) {
  return <span className={actionIconClass(tone, className)} {...props} />;
}
