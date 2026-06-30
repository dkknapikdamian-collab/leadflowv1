import type { ChangeEvent, ReactNode } from 'react';
import { FormField } from './form-field';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type SelectFieldOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectFieldProps = {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectFieldOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  selectClassName?: string;
  dataAttrs?: DataAttrs;
};

export function SelectField({
  label,
  description,
  error,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
  className,
  selectClassName,
  dataAttrs,
}: SelectFieldProps) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className} dataAttrs={dataAttrs}>
      <select
        className={cn('lead-form-select', selectClassName)}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        data-cf-form-control-variant="select"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
        ))}
      </select>
    </FormField>
  );
}
