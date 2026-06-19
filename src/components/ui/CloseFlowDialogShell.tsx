// STAGE232I4_R12_SHARED_MODAL_VISUAL_SOURCE_TRUTH
// Canonical visual source of truth for CloseFlow application dialogs.
import type { HTMLAttributes, ReactNode } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';

type ShellProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

type BlockProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function CloseFlowDialogShell({ title, description, icon, children, footer, className }: ShellProps) {
  return (
    <DialogContent
      className={cx(
        'w-[calc(100vw-24px)] max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-0 text-slate-100 shadow-2xl sm:max-w-3xl',
        className
      )}
      data-closeflow-dialog-shell="true"
      data-stage232i4-r12-shared-modal-visual-source="true"
    >
      <DialogHeader className="border-b border-slate-800 px-5 py-4 text-left" data-closeflow-dialog-header="true">
        <div className="flex items-start gap-3 pr-8">
          {icon ? (
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/15 text-blue-200" aria-hidden="true" data-closeflow-dialog-icon="true">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0 space-y-1">
            <DialogTitle className="text-base font-semibold leading-6 text-slate-50 sm:text-lg" data-closeflow-dialog-title="true">{title}</DialogTitle>
            {description ? <DialogDescription className="text-sm leading-5 text-slate-300" data-closeflow-dialog-description="true">{description}</DialogDescription> : null}
          </div>
        </div>
      </DialogHeader>

      <div data-closeflow-dialog-body="true">
        {children}
      </div>

      {footer ? <CloseFlowDialogFooter>{footer}</CloseFlowDialogFooter> : null}
    </DialogContent>
  );
}

export function CloseFlowDialogBody({ children, className, ...props }: BlockProps) {
  return <div className={cx('px-5 py-4', className)} data-closeflow-dialog-body-section="true" {...props}>{children}</div>;
}

export function CloseFlowDialogSection({ children, className, ...props }: BlockProps) {
  return <section className={cx('border-b border-slate-800 px-5 py-4', className)} data-closeflow-dialog-section="true" {...props}>{children}</section>;
}

export function CloseFlowDialogFooter({ children, className, ...props }: BlockProps) {
  return (
    <DialogFooter className={cx('border-t border-slate-800 bg-slate-950 px-5 py-4', className)} data-closeflow-dialog-footer="true" {...props}>
      {children}
    </DialogFooter>
  );
}
