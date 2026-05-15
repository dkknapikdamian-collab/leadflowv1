import { type ReactNode } from 'react';
import { modalFooterClass } from '../entity-actions';

export type FormFooterProps = {
  cancel?: ReactNode;
  submit?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: 'between' | 'right' | 'left';
};

const ALIGN_CLASS: Record<NonNullable<FormFooterProps['align']>, string> = {
  between: 'justify-between',
  right: 'justify-end',
  left: 'justify-start',
};

export function FormFooter({ cancel, submit, children, className = '', align = 'between' }: FormFooterProps) {
  return (
    <footer
      className={modalFooterClass(['cf-form-footer flex flex-col gap-2 sm:flex-row sm:items-center', ALIGN_CLASS[align], className].filter(Boolean).join(' '))}
      data-cf-ui-component="FormFooter"
      data-standard-form-footer="true"
      data-cf-form-footer-contract="component-registry-vs2"
    >
      {children ? (
        children
      ) : (
        <>
          {cancel ? <div className="cf-form-footer-cancel">{cancel}</div> : null}
          {submit ? <div className="cf-form-footer-submit">{submit}</div> : null}
        </>
      )}
    </footer>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API FormFooter: cancel, submit */
