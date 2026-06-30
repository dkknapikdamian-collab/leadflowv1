import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type FormSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  dataAttrs?: DataAttrs;
};

function cleanDataAttrs(dataAttrs?: DataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function FormSection({ title, description, actions, children, className, dataAttrs }: FormSectionProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <section className={cn('lead-form-section', className)} data-cf-form-control-variant="section" data-cf-form-source-truth="lf-ui-sot-cz2-013" {...attrs}>
      <div className="lead-form-section-head">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div data-cf-form-section-actions="true">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
