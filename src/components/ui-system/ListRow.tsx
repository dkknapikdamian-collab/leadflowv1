import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ListRowProps = {
  leading?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  to?: string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
  htmlTitle?: string;
};

function ListRowContent({ leading, title, description, meta, actions, children }: ListRowProps) {
  if (children) return <>{children}</>;

  return (
    <>
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        {title ? <div className="truncate text-sm font-black text-slate-950">{title}</div> : null}
        {description ? <div className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-600">{description}</div> : null}
      </div>
      {meta ? <div className="shrink-0 text-xs font-black uppercase tracking-[0.04em] text-slate-500">{meta}</div> : null}
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </>
  );
}

export function ListRow(props: ListRowProps) {
  const { to, onClick, className = '', ariaLabel, htmlTitle, title } = props;
  const label = ariaLabel || htmlTitle || (typeof title === 'string' ? title : undefined);
  const classNames = ['cf-list-row row flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-200 hover:bg-slate-50', className].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={classNames} title={htmlTitle} aria-label={label} data-cf-ui-component="ListRow" data-standard-list-row="true" data-cf-list-row-contract="component-registry-vs2">
        <ListRowContent {...props} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={classNames} onClick={onClick} title={htmlTitle} aria-label={label} data-cf-ui-component="ListRow" data-standard-list-row="true" data-cf-list-row-contract="component-registry-vs2">
        <ListRowContent {...props} />
      </button>
    );
  }

  return (
    <div className={classNames} title={htmlTitle} aria-label={label} data-cf-ui-component="ListRow" data-standard-list-row="true" data-cf-list-row-contract="component-registry-vs2">
      <ListRowContent {...props} />
    </div>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API ListRow: leading?, title, description?, meta?, actions?, to?, onClick? */
