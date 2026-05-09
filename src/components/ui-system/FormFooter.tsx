import type { ReactNode } from 'react';
import { modalFooterClass } from '../entity-actions';

export type FormFooterProps = {
  children: ReactNode;
  className?: string;
  align?: 'between' | 'right' | 'left';
};

const ALIGN_CLASS: Record<NonNullable<FormFooterProps['align']>, string> = {
  between: 'justify-between',
  right: 'justify-end',
  left: 'justify-start',
};

export function FormFooter({ children, className = '', align = 'between' }: FormFooterProps) {
  return (
    <footer
      className={modalFooterClass(['cf-form-footer flex flex-col gap-2 sm:flex-row sm:items-center', ALIGN_CLASS[align], className].filter(Boolean).join(' '))}
      data-cf-ui-component="FormFooter"
      data-standard-form-footer="true"
    >
      {children}
    </footer>
  );
}
