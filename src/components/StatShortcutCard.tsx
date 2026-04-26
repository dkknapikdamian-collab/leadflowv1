import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';

export type StatShortcutCardProps = {
  key?: string | number;
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
  to?: string;
  valueClassName?: string;
  iconClassName?: string;
  helper?: string;
  title?: string;
  ariaLabel?: string;
};

export function StatShortcutCard({
  label,
  value,
  icon: Icon,
  active = false,
  onClick,
  to,
  valueClassName = 'text-slate-900',
  iconClassName = 'bg-slate-100 text-slate-500',
  helper,
  title,
  ariaLabel,
}: StatShortcutCardProps) {
  const card = (
    <Card className="h-full border-none shadow-sm">
      <CardContent className={`flex min-h-[82px] items-center justify-between gap-4 p-5 ${active ? 'bg-primary/5' : ''}`}>
        <div className="min-w-0">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <h3 className={`break-words text-2xl font-bold leading-tight ${valueClassName}`}>{value}</h3>
          {helper ? <p className="mt-1 text-[11px] font-semibold text-slate-500">{helper}</p> : null}
        </div>
        <div className={`shrink-0 rounded-2xl p-3 ${iconClassName}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );

  const className = `block w-full rounded-2xl text-left transition-all ${active ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md'}`;

  if (to) {
    return (
      <Link to={to} className={className} title={title} aria-label={ariaLabel || title || label}>
        {card}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} title={title} aria-label={ariaLabel || title || label}>
      {card}
    </button>
  );
}
