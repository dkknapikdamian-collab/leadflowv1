import type { ReactNode } from 'react';

export type PageShellVariant = 'default' | 'detail' | 'compact';

export type PageShellProps = {
  children: ReactNode;
  className?: string;
  variant?: PageShellVariant;
};

const WIDTH_CLASS: Record<PageShellVariant, string> = {
  default: 'max-w-7xl',
  detail: 'max-w-[1480px]',
  compact: 'max-w-5xl',
};

export function PageShell({ children, className = '', variant = 'default' }: PageShellProps) {
  return (
    <main
      className={['cf-page-shell mx-auto w-full px-4 py-6 sm:px-6 lg:px-8', WIDTH_CLASS[variant], className].filter(Boolean).join(' ')}
      data-cf-ui-component="PageShell"
      data-closeflow-page-wrapper="true"
      data-cf-page-shell-variant={variant}
    >
      {children}
    </main>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API PageShell: children, className?, variant?: 'default' | 'detail' | 'compact' */
