import type { ReactNode } from 'react';

export type PageHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, description, actions, meta, className = '' }: PageHeroProps) {
  return (
    <header
      className={['cf-page-hero page-head flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm md:flex-row md:items-start md:justify-between', className].filter(Boolean).join(' ')}
      data-cf-ui-component="PageHero"
      data-page-hero="true"
    >
      <div className="min-w-0">
        {eyebrow ? <p className="kicker mb-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{eyebrow}</p> : null}
        <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{description}</p> : null}
        {meta ? <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">{meta}</div> : null}
      </div>
      {actions ? <div className="head-actions flex flex-wrap items-center gap-2 md:justify-end">{actions}</div> : null}
    </header>
  );
}
