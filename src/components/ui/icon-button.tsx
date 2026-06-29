import { Button, type ButtonProps } from './button';
import { AppIcon } from './icon';
import type { IconName } from '../../lib/source-of-truth/icon-registry';

export type IconButtonProps = Omit<ButtonProps, 'children' | 'aria-label' | 'title'> & {
  icon: IconName;
  label: string;
  title?: string;
  iconClassName?: string;
  loading?: boolean;
  loadingIcon?: IconName;
};

function AppIconControl({
  icon,
  label,
  title,
  iconClassName = 'h-4 w-4',
  loading = false,
  loadingIcon = 'loading',
  size = 'icon',
  type = 'button',
  ...props
}: IconButtonProps) {
  const renderedIcon = loading ? loadingIcon : icon;

  return (
    <Button
      type={type}
      size={size}
      aria-label={label}
      title={title || label}
      data-cf-icon-button={icon}
      data-cf-icon-button-loading={loading ? 'true' : undefined}
      {...props}
    >
      <AppIcon name={renderedIcon} className={iconClassName} decorative />
    </Button>
  );
}

export { AppIconControl as IconButton };
