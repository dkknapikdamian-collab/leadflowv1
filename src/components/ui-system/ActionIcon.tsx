import type { ComponentPropsWithoutRef } from 'react';

import {
  closeflowActionIconRegistry,
  closeflowFallbackActionIcon,
  type CloseflowActionIconName,
} from './action-icon-registry';

export const CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI_COMPONENT = 'CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI';

export type ActionIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'ref'> & {
  action: CloseflowActionIconName;
  decorative?: boolean;
};

export function ActionIcon({ action, decorative = true, 'aria-label': ariaLabel, ...props }: ActionIconProps) {
  const entry = closeflowActionIconRegistry[action];
  const Icon = entry?.icon || closeflowFallbackActionIcon;
  const label = ariaLabel || entry?.label || action;

  return (
    <Icon
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      focusable="false"
      {...props}
    />
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
