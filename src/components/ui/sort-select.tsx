import type { ReactNode } from 'react';
import { SelectField } from './select-field';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type SortSelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SortSelectProps = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: SortSelectOption[];
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  dataAttrs?: DataAttrs;
};

export function SortSelect({ label, value, onChange, options, disabled = false, className, selectClassName, dataAttrs }: SortSelectProps) {
  return (
    <div data-cf-filter-control-variant="sort-select" data-cf-filter-search-sort-source-truth="lf-ui-sot-cz2-014">
      <SelectField
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        options={options}
        disabled={disabled}
        className={className}
        selectClassName={selectClassName}
        dataAttrs={dataAttrs}
      />
    </div>
  );
}
