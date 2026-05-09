import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ListRowProps = {
  children: ReactNode;
  className?: string;
  to?: string;
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
};

export function ListRow({ children, className = '', to, onClick, title, ariaLabel }: ListRowProps) {
  const classNames = ['cf-list-row row flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-200 hover:bg-slate-50', className].filter(Boolean).join(' ');
  if (to) {
    return (
      <Link to={to} className={classNames} title={title} aria-label={ariaLabel || title} data-cf-ui-component="ListRow" data-standard-list-row="true">
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={classNames} onClick={onClick} title={title} aria-label={ariaLabel || title} data-cf-ui-component="ListRow" data-standard-list-row="true">
        {children}
      </button>
    );
  }
  return (
    <div className={classNames} title={title} aria-label={ariaLabel || title} data-cf-ui-component="ListRow" data-standard-list-row="true">
      {children}
    </div>
  );
}
