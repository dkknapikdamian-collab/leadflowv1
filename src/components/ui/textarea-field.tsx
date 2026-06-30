import type { ChangeEvent, ReactNode } from 'react';
import { FormField } from './form-field';
import { cn } from '../../lib/utils';

type DataAttrs = Record<string, string | number | boolean | undefined>;

export type TextareaFieldProps = {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
  textareaClassName?: string;
  dataAttrs?: DataAttrs;
};

export function TextareaField({
  label,
  description,
  error,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  rows,
  className,
  textareaClassName,
  dataAttrs,
}: TextareaFieldProps) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className} dataAttrs={dataAttrs}>
      <textarea
        className={cn('lead-form-textarea', textareaClassName)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        data-cf-form-control-variant="textarea"
      />
    </FormField>
  );
}
