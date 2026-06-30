import type { ReactNode } from 'react';
import { Input } from './input';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  dataAttrs?: DataAttrs;
  ariaLabel?: string;
};

function cleanDataAttrs(dataAttrs?: DataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  description,
  disabled = false,
  className,
  inputClassName,
  dataAttrs,
  ariaLabel,
}: SearchFieldProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <div className={cn('cf-search-field-control', className)} data-cf-filter-control-variant="search" data-cf-filter-search-sort-source-truth="lf-ui-sot-cz2-014" {...attrs}>
      {label ? <span className="sr-only">{label}</span> : null}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
        aria-label={ariaLabel || (typeof label === 'string' ? label : 'Szukaj')}
      />
      {description ? <small className="sub">{description}</small> : null}
    </div>
  );
}
