import * as React from 'react';

import { cn } from '../lib/utils';
import { Button, type ButtonProps } from './ui/button';

export type EntityActionTone = 'neutral' | 'danger';
export type EntityActionRegion =
  | 'entity-header-action-cluster'
  | 'activity-panel-header'
  | 'note-panel-header'
  | 'tasks-panel-header'
  | 'work-items-panel-header'
  | 'events-panel-header'
  | 'calendar-panel-header'
  | 'danger-action-zone'
  | 'info-row-inline-action';

export const ENTITY_DETAIL_ACTION_PLACEMENT_CONTRACT: Record<string, EntityActionRegion> = {
  editRecord: 'entity-header-action-cluster',
  addNote: 'activity-panel-header',
  dictateNote: 'activity-panel-header',
  addTask: 'tasks-panel-header',
  addEvent: 'events-panel-header',
  deleteRecord: 'danger-action-zone',
  copyInline: 'info-row-inline-action',
};

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

export function entityActionClusterClass(className?: string) {
  return cn('cf-entity-action-cluster', className);
}

export function panelHeaderActionsClass(className?: string) {
  return cn('cf-panel-header-actions', className);
}

export function panelActionRowClass(className?: string) {
  return cn('cf-panel-action-row', className);
}

export function dangerActionZoneClass(className?: string) {
  return cn('cf-danger-action-zone', className);
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

export function EntityActionCluster({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={entityActionClusterClass(className)} data-cf-action-region="entity-header-action-cluster" {...props} />;
}

export function PanelHeaderActions({
  className,
  region = 'activity-panel-header',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { region?: Extract<EntityActionRegion, 'activity-panel-header' | 'note-panel-header' | 'tasks-panel-header' | 'work-items-panel-header' | 'events-panel-header' | 'calendar-panel-header'> }) {
  return <div className={panelHeaderActionsClass(className)} data-cf-action-region={region} {...props} />;
}

export function PanelActionRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={panelActionRowClass(className)} {...props} />;
}

export function DangerActionZone({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={dangerActionZoneClass(className)} data-cf-action-region="danger-action-zone" {...props} />;
}
