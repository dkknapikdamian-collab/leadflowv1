import type { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type FilterChipOption = {
  value: string;
  label: ReactNode;
  count?: number;
  countNode?: ReactNode;
  disabled?: boolean;
  dataAttrs?: DataAttrs;
};

export type FilterChipGroupProps = {
  label?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: FilterChipOption[];
  className?: string;
  chipClassName?: string;
  labelClassName?: string;
  countClassName?: string;
  dataAttrs?: DataAttrs;
};

function cleanDataAttrs(dataAttrs?: DataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(Object.entries(dataAttrs).filter(([, value]) => value !== undefined));
}

export function FilterChipGroup({
  label,
  value,
  onChange,
  options,
  className,
  chipClassName,
  labelClassName,
  countClassName,
  dataAttrs,
}: FilterChipGroupProps) {
  const attrs = cleanDataAttrs(dataAttrs);
  return (
    <div className={className} data-cf-filter-control-variant="chip-group" data-cf-filter-search-sort-source-truth="lf-ui-sot-cz2-014" {...attrs}>
      {label ? <span className="sr-only">{label}</span> : null}
      {options.map((option) => {
        const optionAttrs = cleanDataAttrs(option.dataAttrs);
        const active = option.value === value;
        const countContent = option.countNode ?? (typeof option.count === 'number' ? option.count : null);
        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(chipClassName)}
            aria-pressed={active}
            data-cf-filter-chip-active={active ? 'true' : undefined}
            {...optionAttrs}
          >
            <span className={labelClassName}>{option.label}</span>
            {countContent !== null ? <strong className={countClassName}>{countContent}</strong> : null}
          </Button>
        );
      })}
    </div>
  );
}
