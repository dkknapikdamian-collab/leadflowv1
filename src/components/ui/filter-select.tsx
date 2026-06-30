import type { ReactNode } from 'react';
import { SelectField } from './select-field';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type FilterSelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type FilterSelectProps = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  dataAttrs?: DataAttrs;
};

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className,
  selectClassName,
  dataAttrs,
}: FilterSelectProps) {
  return (
    <div data-cf-filter-control-variant="filter-select" data-cf-filter-search-sort-source-truth="lf-ui-sot-cz2-014">
      <SelectField
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        selectClassName={selectClassName}
        dataAttrs={dataAttrs}
      />
    </div>
  );
}
