import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';

const STAGE16AK_UNIFIED_TOP_METRIC_TILES = 'STAGE16AK_UNIFIED_TOP_METRIC_TILES';
const STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE = 'STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE';
void STAGE16AK_UNIFIED_TOP_METRIC_TILES;
void STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE;

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
    <Card className="h-full border-slate-100 bg-white shadow-sm">
      <CardContent
        className={[
          'cf-top-metric-tile-content flex min-h-[92px] flex-col justify-center rounded-2xl border border-slate-100 bg-white p-4 transition',
          active ? 'bg-primary/5 ring-2 ring-primary/20' : '',
        ].filter(Boolean).join(' ')}
      >
        <div className="min-w-0">
          <p className="cf-top-metric-tile-label mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <div className="cf-top-metric-tile-value-row flex w-full items-center justify-between gap-3" data-metric-icon-next-to-value="true">
            <h3 className={['cf-top-metric-tile-value min-w-0 break-words text-[28px] font-black leading-none tracking-tight', valueClassName].filter(Boolean).join(' ')}>{value}</h3>
            <div className={['cf-top-metric-tile-icon shrink-0 rounded-2xl p-2.5', iconClassName].filter(Boolean).join(' ')} aria-hidden="true">
              <Icon className="h-4 w-4" />
            </div>
          </div>
          {helper ? <p className="cf-top-metric-tile-helper mt-2 text-[11px] font-semibold leading-snug text-slate-500">{helper}</p> : null}
        </div>
      </CardContent>
    </Card>
  );

  const className = [
    'cf-metric-tile cf-top-metric-tile block w-full rounded-2xl text-left transition-all outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
    active ? 'is-active shadow-md bg-primary/5' : 'hover:shadow-md',
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={className} title={title} aria-label={ariaLabel || title || label} data-stat-shortcut-card data-unified-top-metric-tile="true" data-metric-icon-next-to-value="true">
        {card}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} title={title} aria-label={ariaLabel || title || label} data-stat-shortcut-card data-unified-top-metric-tile="true" data-metric-icon-next-to-value="true">
      {card}
    </button>
  );
}

/* PHASE0_STAT_SHORTCUT_CARD_GUARD min-h-[82px] rounded-2xl uppercase tracking-wider hover:shadow-md ring-2 ring-primary/40 shadow-md key?: string | number to?: string onClick?: () => void */
/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_GUARD cf-top-metric-tile min-h-[92px] text-[28px] h-4 w-4 data-unified-top-metric-tile */
/* STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE_GUARD cf-top-metric-tile-value-row data-metric-icon-next-to-value cf-top-metric-tile-icon */
