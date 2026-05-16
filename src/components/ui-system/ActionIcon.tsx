import { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/utils';
import {
  ACTION_ICON_MAP,
  getCloseflowActionIconLabel,
  type CloseflowActionIconName,
} from './action-icon-registry';

export const CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_COMPONENT = 'CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_COMPONENT';

export type ActionIconSize = 'sm' | 'md' | 'lg';
export type ActionIconTone = 'default' | 'soft' | 'strong' | 'danger';

export type ActionIconProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  action: keyof typeof ACTION_ICON_MAP;
  size?: ActionIconSize;
  tone?: ActionIconTone;
  label?: string;
  decorative?: boolean;
};

export function ActionIcon({
  action,
  size = 'md',
  tone = 'default',
  label,
  decorative = true,
  className,
  ...props
}: ActionIconProps) {
  const Icon = ACTION_ICON_MAP[action as CloseflowActionIconName];
  const resolvedLabel = label || getCloseflowActionIconLabel(action as CloseflowActionIconName) || action;

  return (
    <span
      className={cn(
        'cf-action-icon',
        'cf-action-icon-' + action,
        'cf-action-icon-size-' + size,
        'cf-action-icon-tone-' + tone,
        className,
      )}
      data-cf-action-icon={action}
      data-cf-action-icon-size={size}
      data-cf-action-icon-tone={tone}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative ? resolvedLabel : undefined}
      {...props}
    >
      <Icon className="cf-action-icon-svg" focusable="false" aria-hidden="true" />
    </span>
  );
}

function createActionIcon(action: CloseflowActionIconName) {
  return function CloseflowBoundActionIcon(props: Omit<ActionIconProps, 'action'>) {
    return <ActionIcon action={action} {...props} />;
  };
}

export const AddActionIcon = createActionIcon('add');
export const EditActionIcon = createActionIcon('edit');
export const DeleteActionIcon = createActionIcon('delete');
export const RestoreActionIcon = createActionIcon('restore');
export const SearchActionIcon = createActionIcon('search');
export const SaveActionIcon = createActionIcon('save');
export const CancelActionIcon = createActionIcon('cancel');
export const BackActionIcon = createActionIcon('back');
export const CopyActionIcon = createActionIcon('copy');
export const OpenActionIcon = createActionIcon('open');
export const ArchiveActionIcon = createActionIcon('archive');
export const FilterActionIcon = createActionIcon('filter');
export const SettingsActionIcon = createActionIcon('settings');
export const RefreshActionIcon = createActionIcon('refresh');
export const CalendarActionIcon = createActionIcon('calendar');
export const NoteActionIcon = createActionIcon('note');
export const TaskActionIcon = createActionIcon('task');

/* CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_API ActionIcon: action, size?: 'sm' | 'md' | 'lg', tone?: 'default' | 'soft' | 'strong' | 'danger' */
