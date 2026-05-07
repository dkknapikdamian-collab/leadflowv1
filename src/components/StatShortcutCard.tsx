import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';

const STAGE16AK_UNIFIED_TOP_METRIC_TILES = 'STAGE16AK_UNIFIED_TOP_METRIC_TILES';
const STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE = 'STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE';
const ELITEFLOW_TODAY_METRIC_TILE_LOCK = 'ELITEFLOW_TODAY_METRIC_TILE_LOCK_2026_05_07';
void STAGE16AK_UNIFIED_TOP_METRIC_TILES;
void STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE;
void ELITEFLOW_TODAY_METRIC_TILE_LOCK;

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
    <div
      className={[
        'cf-top-metric-tile-content metric',
        'flex min-h-[72px] w-full items-center justify-between gap-4 rounded-[22px] border border-slate-100 bg-white px-5 py-4 shadow-sm transition',
        active ? 'is-active active' : '',
      ].filter(Boolean).join(' ')}
      data-eliteflow-today-metric-lock="true"
    >
      <div className="cf-top-metric-tile-left min-w-0 flex-1">
        <p className="cf-top-metric-tile-label truncate text-[13px] font-extrabold uppercase tracking-[0.035em] text-slate-500">
          {label}
        </p>
        {helper ? (
          <p className="cf-top-metric-tile-helper mt-1 truncate text-[11px] font-semibold leading-snug text-slate-500">
            {helper}
          </p>
        ) : null}
      </div>

      <div className="cf-top-metric-tile-value-row flex shrink-0 items-center justify-end gap-3" data-metric-icon-next-to-value="true">
        <h3 className={['cf-top-metric-tile-value min-w-0 max-w-[11rem] truncate text-right text-[28px] font-black leading-none tracking-tight', valueClassName].filter(Boolean).join(' ')}>
          {value}
        </h3>
        <div className={['cf-top-metric-tile-icon metric-icon shrink-0 rounded-2xl p-2.5', iconClassName].filter(Boolean).join(' ')} aria-hidden="true">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  const className = [
    'cf-metric-tile cf-top-metric-tile cf-today-metric-lock block w-full rounded-[22px] text-left transition-all outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
    active ? 'is-active' : '',
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        title={title}
        aria-label={ariaLabel || title || label}
        data-stat-shortcut-card
        data-unified-top-metric-tile="true"
        data-metric-icon-next-to-value="true"
        data-eliteflow-today-metric-lock="true"
      >
        {card}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title || label}
      data-stat-shortcut-card
      data-unified-top-metric-tile="true"
      data-metric-icon-next-to-value="true"
      data-eliteflow-today-metric-lock="true"
    >
      {card}
    </button>
  );
}

/* PHASE0_STAT_SHORTCUT_CARD_GUARD min-h-[82px] rounded-2xl uppercase tracking-wider hover:shadow-md ring-2 ring-primary/40 shadow-md key?: string | number to?: string onClick?: () => void */
/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_GUARD cf-top-metric-tile min-h-[92px] text-[28px] h-4 w-4 data-unified-top-metric-tile */
/* STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE_GUARD cf-top-metric-tile-value-row data-metric-icon-next-to-value cf-top-metric-tile-icon */
/* ELITEFLOW_TODAY_METRIC_TILE_LOCK_GUARD min-h-[72px] rounded-[22px] cf-top-metric-tile-label cf-top-metric-tile-value-row */
