import type { ComponentType, ReactNode } from 'react';

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  actions?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, actions, className = '' }: EmptyStateProps) {
  const resolvedAction = action ?? actions;

  return (
    <section
      className={['cf-empty-state rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-8 text-center shadow-sm', className].filter(Boolean).join(' ')}
      data-cf-ui-component="EmptyState"
      data-standard-empty-state="true"
      data-cf-empty-state-contract="component-registry-vs2"
    >
      {Icon ? (
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="text-base font-black text-slate-950">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-600">{description}</p> : null}
      {resolvedAction ? <div className="mt-4 flex flex-wrap justify-center gap-2">{resolvedAction}</div> : null}
    </section>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API EmptyState: title, description?, action? */
