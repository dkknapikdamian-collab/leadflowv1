import type { ReactNode } from 'react';

export type PageShellProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'wide' | 'narrow';
};

const WIDTH_CLASS: Record<NonNullable<PageShellProps['variant']>, string> = {
  default: 'max-w-7xl',
  wide: 'max-w-[1480px]',
  narrow: 'max-w-5xl',
};

export function PageShell({ children, className = '', variant = 'default' }: PageShellProps) {
  return (
    <main
      className={['cf-page-shell mx-auto w-full px-4 py-6 sm:px-6 lg:px-8', WIDTH_CLASS[variant], className].filter(Boolean).join(' ')}
      data-cf-ui-component="PageShell"
      data-closeflow-page-wrapper="true"
    >
      {children}
    </main>
  );
}
