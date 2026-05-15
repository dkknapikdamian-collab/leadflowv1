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

export const CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6 = {
  owner: 'src/components/entity-actions.tsx',
  reason: 'one source of truth for action cluster spacing, wrap and region semantics',
  scope: ['entity-header-action-cluster', 'panel-header-actions', 'panel-action-row', 'danger-action-zone'],
  remove_after_stage: 'never - this is the permanent action cluster contract',
} as const;

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


export const CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT = {
  formActions: 'cf-form-actions',
  primary: 'cf-form-actions-primary',
  secondary: 'cf-form-actions-secondary',
  danger: 'cf-form-actions-danger',
  modalFooter: 'cf-modal-footer',
  modalFooterLeft: 'cf-modal-footer-left',
  modalFooterRight: 'cf-modal-footer-right',
  mobileActionStack: 'cf-mobile-action-stack',
} as const;

export function formActionsClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.formActions, className);
}

export function formActionsPrimaryClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.primary, className);
}

export function formActionsSecondaryClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.secondary, className);
}

export function formActionsDangerClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.danger, className);
}

export function modalFooterClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.modalFooter, CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.formActions, className);
}

export function modalFooterLeftClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.modalFooterLeft, className);
}

export function modalFooterRightClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.modalFooterRight, className);
}

export function mobileActionStackClass(className?: string) {
  return cn(CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT.mobileActionStack, className);
}

export type EntityActionButtonProps = Omit<ButtonProps, 'tone'> & {
  tone?: EntityActionTone;
  iconOnly?: boolean;
};

export const EntityActionButton = React.forwardRef<HTMLButtonElement, EntityActionButtonProps>(
  ({ tone = 'neutral', iconOnly = false, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(actionButtonClass(tone as EntityActionTone), iconOnly ? 'cf-entity-icon-action' : null, className)}
      {...props}
    />
  )
);

EntityActionButton.displayName = 'EntityActionButton';

export const CLOSEFLOW_TRASH_ACTION_SOURCE_OF_TRUTH = {
  owner: 'src/components/entity-actions.tsx',
  buttonClass: 'cf-trash-action-button',
  iconClass: 'cf-trash-action-icon',
  tokenColor: '--cf-trash-icon-color',
  reason: 'one source of truth for trash icon action color and shape',
} as const;

export function trashActionButtonClass(className?: string) {
  return cn('cf-trash-action-button', className);
}

export function trashActionIconClass(className?: string) {
  return cn('cf-trash-action-icon', className);
}

export const EntityTrashButton = React.forwardRef<HTMLButtonElement, Omit<EntityActionButtonProps, 'tone' | 'iconOnly'>>(
  ({ className, ...props }, ref) => (
    <EntityActionButton
      ref={ref}
      tone="danger"
      iconOnly
      className={trashActionButtonClass(className)}
      data-cf-trash-action="true"
      {...props}
    />
  )
);

EntityTrashButton.displayName = 'EntityTrashButton';


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
  return <div className={entityActionClusterClass(className)} data-cf-action-region="entity-header-action-cluster" data-standard-action-cluster="true" data-cf-action-cluster-contract="VS6" {...props} />;
}

export function PanelHeaderActions({
  className,
  region = 'activity-panel-header',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { region?: Extract<EntityActionRegion, 'activity-panel-header' | 'note-panel-header' | 'tasks-panel-header' | 'work-items-panel-header' | 'events-panel-header' | 'calendar-panel-header'> }) {
  return <div className={panelHeaderActionsClass(className)} data-cf-action-region={region} data-standard-action-cluster="true" data-cf-action-cluster-contract="VS6" {...props} />;
}

export function PanelActionRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={panelActionRowClass(className)} data-cf-action-region="info-row-inline-action" data-standard-action-cluster="true" data-cf-action-cluster-contract="VS6" {...props} />;
}

export function DangerActionZone({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={dangerActionZoneClass(className)} data-cf-action-region="danger-action-zone" data-standard-action-cluster="true" data-cf-action-cluster-contract="VS6" {...props} />;
}

export type ContextQuickActionPayload = {
  kind?: string;
  recordType?: string;
  recordId?: string | null;
  clientId?: string | null;
  leadId?: string | null;
  caseId?: string | null;
  recordLabel?: string | null;
};

export function openContextQuickAction(payload: ContextQuickActionPayload) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("closeflow:context-quick-action", { detail: payload }));
  }
  return payload;
}
