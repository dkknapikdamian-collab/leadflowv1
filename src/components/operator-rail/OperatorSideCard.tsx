import type { ReactNode } from 'react';

export type OperatorRailDataAttrs = Record<`data-${string}`, string | number | boolean | undefined>;

export type OperatorSideCardProps = {
  title: string;
  description?: string;
  className?: string;
  bodyClassName?: string;
  headerAside?: ReactNode;
  children?: ReactNode;
  emptyState?: ReactNode;
  dataTestId?: string;
  dataAttrs?: OperatorRailDataAttrs;
};

function cleanDataAttrs(dataAttrs?: OperatorRailDataAttrs) {
  if (!dataAttrs) return {};
  return Object.fromEntries(
    Object.entries(dataAttrs).filter(([, value]) => value !== undefined),
  );
}

export function OperatorSideCard({
  title,
  description,
  className = '',
  bodyClassName = '',
  headerAside,
  children,
  emptyState,
  dataTestId,
  dataAttrs,
}: OperatorSideCardProps) {
  const rootClassName = ['right-card', className].filter(Boolean).join(' ');
  const attrs = cleanDataAttrs(dataAttrs);

  return (
    <aside className={rootClassName} data-testid={dataTestId} {...attrs}>
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {headerAside ? <>{headerAside}</> : null}
      </div>
      {children ? (
        bodyClassName ? <div className={bodyClassName}>{children}</div> : <>{children}</>
      ) : emptyState ? (
        <>{emptyState}</>
      ) : null}
    </aside>
  );
}
