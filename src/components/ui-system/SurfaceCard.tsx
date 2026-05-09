import type { ReactNode } from 'react';

export type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'muted' | 'danger' | 'warning' | 'success';
};

const TONE_CLASS: Record<NonNullable<SurfaceCardProps['tone']>, string> = {
  default: 'border-slate-200 bg-white text-slate-950',
  muted: 'border-slate-200 bg-slate-50 text-slate-950',
  danger: 'border-rose-200 bg-rose-50 text-rose-950',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
};

export function SurfaceCard({ children, className = '', tone = 'default' }: SurfaceCardProps) {
  return (
    <section
      className={['cf-surface-card rounded-[24px] border p-4 shadow-sm', TONE_CLASS[tone], className].filter(Boolean).join(' ')}
      data-cf-ui-component="SurfaceCard"
      data-standard-surface-card="true"
    >
      {children}
    </section>
  );
}
