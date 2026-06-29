import type { ComponentPropsWithoutRef } from 'react';
import { getIcon, getIconLabel, type IconName } from '../../lib/source-of-truth/icon-registry';
import { cn } from '../../lib/utils';

export type AppIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children' | 'name'> & {
  name: IconName;
  label?: string;
  decorative?: boolean;
};

export function AppIcon({
  name,
  label,
  decorative = true,
  className,
  focusable = false,
  ...props
}: AppIconProps) {
  const Icon = getIcon(name);
  const accessibleLabel = label || getIconLabel(name);

  return (
    <Icon
      className={cn('cf-app-icon', className)}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      focusable={focusable}
      data-cf-app-icon={name}
      {...props}
    />
  );
}
