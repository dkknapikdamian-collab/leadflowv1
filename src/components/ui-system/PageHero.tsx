import type { ReactNode } from 'react';

export type PageHeroProps = {
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
  /** Legacy alias kept so older screens do not break while they migrate to kicker. */
  eyebrow?: ReactNode;
};

export function PageHero({ kicker, eyebrow, title, description, actions, meta, className = '' }: PageHeroProps) {
  const resolvedKicker = kicker ?? eyebrow;

  return (
    <header
      className={['cf-page-hero page-head flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm md:flex-row md:items-start md:justify-between', className].filter(Boolean).join(' ')}
      data-cf-ui-component="PageHero"
      data-page-hero="true"
    >
      <div className="min-w-0">
        {resolvedKicker ? <p className="kicker mb-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{resolvedKicker}</p> : null}
        <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{description}</p> : null}
        {meta ? <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">{meta}</div> : null}
      </div>
      {actions ? <div className="head-actions flex flex-wrap items-center gap-2 md:justify-end">{actions}</div> : null}
    </header>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API PageHero: kicker?, title, description?, actions?, meta? */
