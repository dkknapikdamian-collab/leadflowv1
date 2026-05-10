import type { ReactNode } from 'react';

export type SurfaceCardTone = 'default' | 'muted' | 'danger' | 'warning' | 'success';

export type SurfaceCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  tone?: SurfaceCardTone;
};

const TONE_CLASS: Record<SurfaceCardTone, string> = {
  default: 'border-slate-200 bg-white text-slate-950',
  muted: 'border-slate-200 bg-slate-50 text-slate-950',
  danger: 'border-rose-200 bg-rose-50 text-rose-950',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
};

export function SurfaceCard({ title, description, actions, children, className = '', tone = 'default' }: SurfaceCardProps) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <section
      className={['cf-surface-card rounded-[24px] border p-4 shadow-sm', TONE_CLASS[tone], className].filter(Boolean).join(' ')}
      data-cf-ui-component="SurfaceCard"
      data-standard-surface-card="true"
      data-cf-surface-card-contract="component-registry-vs2"
    >
      {hasHeader ? (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title ? <h2 className="text-base font-black tracking-tight text-slate-950">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API SurfaceCard: title?, description?, actions?, children */
