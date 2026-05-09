import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';

export type MetricTileTone =
  | 'neutral'
  | 'blue'
  | 'amber'
  | 'red'
  | 'green'
  | 'purple'
  | 'active'
  | 'waiting'
  | 'overdue'
  | 'risk'
  | 'done'
  | 'value'
  | 'ai'
  | 'drafts';

export type MetricTileProps = {
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
  tone?: MetricTileTone | string;
  dataTab?: string;
};

const METRIC_TONE_ALIAS: Record<MetricTileTone, 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple'> = {
  neutral: 'neutral',
  blue: 'blue',
  amber: 'amber',
  red: 'red',
  green: 'green',
  purple: 'purple',
  active: 'blue',
  waiting: 'amber',
  overdue: 'red',
  risk: 'red',
  done: 'green',
  value: 'green',
  ai: 'purple',
  drafts: 'purple',
};

function normalizeMetricToneText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveMetricTileTone(label: string, valueClassName: string, iconClassName: string, explicitTone?: MetricTileTone | string) {
  if (explicitTone && Object.prototype.hasOwnProperty.call(METRIC_TONE_ALIAS, explicitTone)) {
    return METRIC_TONE_ALIAS[explicitTone as MetricTileTone];
  }

  const classText = normalizeMetricToneText(`${valueClassName} ${iconClassName}`);
  const labelText = normalizeMetricToneText(label);

  if (classText.includes('rose') || classText.includes('red')) return 'red';
  if (classText.includes('emerald') || classText.includes('green') || classText.includes('teal')) return 'green';
  if (classText.includes('purple') || classText.includes('violet')) return 'purple';
  if (classText.includes('amber') || classText.includes('orange') || classText.includes('yellow')) return 'amber';
  if (classText.includes('blue') || classText.includes('sky') || classText.includes('indigo')) return 'blue';

  if (labelText.includes('zagro') || labelText.includes('ryzy') || labelText.includes('zaleg') || labelText.includes('blok') || labelText.includes('brak')) return 'red';
  if (labelText.includes('wartosc') || labelText.includes('platn') || labelText.includes('przychod')) return 'green';
  if (labelText.includes('aktywn') || labelText.includes('dzis') || labelText.includes('obslugi')) return 'blue';
  if (labelText.includes('czek') || labelText.includes('historia') || labelText.includes('kosz')) return 'amber';
  if (labelText.includes('wydar') || labelText.includes('szkic') || labelText.includes('akcept')) return 'purple';
  if (labelText.includes('zadania') || labelText.includes('zrobione') || labelText.includes('obowiazk')) return 'green';

  return 'neutral';
}

export function MetricTile({
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
  tone,
  dataTab,
}: MetricTileProps) {
  const resolvedTone = resolveMetricTileTone(label, valueClassName, iconClassName, tone);
  const card = (
    <div
      className={[
        'cf-top-metric-tile-content',
        'flex min-h-[72px] w-full items-center justify-between gap-4 rounded-[22px] border border-slate-100 bg-white px-5 py-4 shadow-sm transition',
        active ? 'is-active' : '',
      ].filter(Boolean).join(' ')}
      data-cf-ui-component="MetricTile"
      data-eliteflow-today-metric-lock="true"
      data-eliteflow-metric-tone={resolvedTone}
    >
      <div className="cf-top-metric-tile-left min-w-0 flex-1">
        <p className="cf-top-metric-tile-label text-[13px] font-extrabold uppercase tracking-[0.035em] text-slate-500">
          {label}
        </p>
        {helper ? (
          <p className="cf-top-metric-tile-helper mt-1 text-[11px] font-semibold leading-snug text-slate-500">
            {helper}
          </p>
        ) : null}
      </div>

      <div className="cf-top-metric-tile-value-row flex shrink-0 items-center justify-end gap-3" data-metric-icon-next-to-value="true">
        <h3 className={['cf-top-metric-tile-value min-w-0 text-right text-[28px] font-black leading-none tracking-tight', valueClassName].filter(Boolean).join(' ')}>
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
        data-tab={dataTab}
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
      data-tab={dataTab}
    >
      {card}
    </button>
  );
}
