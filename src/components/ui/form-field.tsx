import type { ReactNode } from 'react';
import { Label } from './label';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type FormFieldProps = {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  dataAttrs?: DataAttrs;
};

function cleanDataAttrs(dataAttrs?: DataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function FormField({ label, description, error, children, required = false, htmlFor, className, dataAttrs }: FormFieldProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <div className={cn('lead-form-field', className)} data-cf-form-control-variant="field" data-cf-form-source-truth="lf-ui-sot-cz2-013" {...attrs}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </Label>
      {children}
      {description ? <small className="sub">{description}</small> : null}
      {error ? <small className="sub" role="alert" data-cf-form-field-error="true">{error}</small> : null}
    </div>
  );
}
