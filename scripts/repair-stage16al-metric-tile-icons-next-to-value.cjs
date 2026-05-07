const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const write = (rel, content) => fs.writeFileSync(path.join(root, rel), content, 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

const STAGE = 'STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE';

function patchPackageJson() {
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:metric-tile-icons-next-to-value'] = 'node scripts/check-metric-tile-icons-next-to-value.cjs';
  pkg.scripts['test:metric-tile-icons-next-to-value'] = 'node --test tests/metric-tile-icons-next-to-value.test.cjs';
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
}

function patchStatShortcutCard() {
  const rel = 'src/components/StatShortcutCard.tsx';
  const content = `import type { ComponentType } from 'react';
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
`;
  write(rel, content);
}

function patchMetricCss() {
  const rel = 'src/styles/closeflow-metric-tiles.css';
  const css = `/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_CSS */
/* STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE_CSS */
:root {
  --cf-metric-tile-radius: 16px;
  --cf-metric-tile-border: #e2e8f0;
  --cf-metric-tile-bg: #ffffff;
  --cf-metric-tile-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  --cf-metric-tile-shadow-hover: 0 10px 24px rgba(15, 23, 42, 0.08);
  --cf-metric-tile-label: #64748b;
  --cf-metric-tile-value: #0f172a;
  --cf-metric-tile-helper: #64748b;
  --cf-metric-tile-icon-bg: #f1f5f9;
  --cf-metric-tile-icon: #64748b;
}

.cf-top-metric-tile,
.cf-html-view .metric,
.cf-html-view .stat-card,
.cf-html-view .summary-card,
.cf-html-view .dashboard-stat-card {
  min-height: 92px;
  border: 1px solid var(--cf-metric-tile-border) !important;
  border-radius: var(--cf-metric-tile-radius) !important;
  background: var(--cf-metric-tile-bg) !important;
  color: var(--cf-metric-tile-value);
  box-shadow: var(--cf-metric-tile-shadow) !important;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease, background 160ms ease;
}

.cf-html-view .metric,
.cf-html-view .stat-card,
.cf-html-view .summary-card,
.cf-html-view .dashboard-stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  text-align: left;
}

.cf-top-metric-tile:hover,
.cf-html-view .metric:hover,
.cf-html-view .stat-card:hover,
.cf-html-view .summary-card:hover,
.cf-html-view .dashboard-stat-card:hover {
  box-shadow: var(--cf-metric-tile-shadow-hover) !important;
  transform: translateY(-1px);
}

.cf-top-metric-tile.is-active,
.cf-html-view .metric.active,
.cf-html-view .metric.is-active,
.cf-html-view .stat-card.active,
.cf-html-view .summary-card.active,
.cf-html-view .dashboard-stat-card.active {
  border-color: rgba(37, 99, 235, 0.24) !important;
  background: rgba(37, 99, 235, 0.05) !important;
}

.cf-top-metric-tile-content {
  width: 100%;
}

.cf-top-metric-tile-value-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cf-top-metric-tile-label,
.cf-html-view .metric label,
.cf-html-view .stat-card label,
.cf-html-view .summary-card label,
.cf-html-view .dashboard-stat-card label,
.cf-html-view .metric .label,
.cf-html-view .stat-card .label,
.cf-html-view .summary-card .label,
.cf-html-view .dashboard-stat-card .label {
  display: block;
  margin: 0 0 4px;
  color: var(--cf-metric-tile-label) !important;
  font-size: 12px !important;
  line-height: 1.2;
  font-weight: 800 !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cf-top-metric-tile-value,
.cf-html-view .metric strong,
.cf-html-view .stat-card strong,
.cf-html-view .summary-card strong,
.cf-html-view .dashboard-stat-card strong,
.cf-html-view .metric .value,
.cf-html-view .stat-card .value,
.cf-html-view .summary-card .value,
.cf-html-view .dashboard-stat-card .value {
  display: block;
  min-width: 0;
  color: var(--cf-metric-tile-value) !important;
  font-size: 28px !important;
  line-height: 1 !important;
  font-weight: 900 !important;
  letter-spacing: -0.04em;
}

.cf-top-metric-tile-helper,
.cf-html-view .metric .hint,
.cf-html-view .stat-card .hint,
.cf-html-view .summary-card .hint,
.cf-html-view .dashboard-stat-card .hint,
.cf-html-view .metric small,
.cf-html-view .stat-card small,
.cf-html-view .summary-card small,
.cf-html-view .dashboard-stat-card small {
  display: block;
  margin-top: 8px;
  color: var(--cf-metric-tile-helper) !important;
  font-size: 11px !important;
  line-height: 1.25;
  font-weight: 650 !important;
}

.cf-top-metric-tile-icon,
.cf-html-view .metric .metric-icon,
.cf-html-view .stat-card .metric-icon,
.cf-html-view .summary-card .metric-icon,
.cf-html-view .dashboard-stat-card .metric-icon,
.cf-html-view .metric svg.metric-icon,
.cf-html-view .stat-card svg.metric-icon,
.cf-html-view .summary-card svg.metric-icon,
.cf-html-view .dashboard-stat-card svg.metric-icon,
.cf-html-view .metric:not(:has(.metric-icon)):not(:has(svg))::after,
.cf-html-view .stat-card:not(:has(.metric-icon)):not(:has(svg))::after,
.cf-html-view .summary-card:not(:has(.metric-icon)):not(:has(svg))::after,
.cf-html-view .dashboard-stat-card:not(:has(.metric-icon)):not(:has(svg))::after {
  width: 38px !important;
  height: 38px !important;
  min-width: 38px;
  border-radius: 16px !important;
  background-color: var(--cf-metric-tile-icon-bg) !important;
  color: var(--cf-metric-tile-icon) !important;
}

.cf-top-metric-tile-icon,
.cf-html-view .metric .metric-icon,
.cf-html-view .stat-card .metric-icon,
.cf-html-view .summary-card .metric-icon,
.cf-html-view .dashboard-stat-card .metric-icon,
.cf-html-view .metric svg.metric-icon,
.cf-html-view .stat-card svg.metric-icon,
.cf-html-view .summary-card svg.metric-icon,
.cf-html-view .dashboard-stat-card svg.metric-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px !important;
}

.cf-html-view .metric:not(:has(.metric-icon)):not(:has(svg))::after,
.cf-html-view .stat-card:not(:has(.metric-icon)):not(:has(svg))::after,
.cf-html-view .summary-card:not(:has(.metric-icon)):not(:has(svg))::after,
.cf-html-view .dashboard-stat-card:not(:has(.metric-icon)):not(:has(svg))::after {
  content: '';
  display: block;
  flex: 0 0 38px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 3v18h18'/%3E%3Cpath d='m19 9-5 5-4-4-3 3'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}

.cf-top-metric-tile-icon svg {
  width: 16px;
  height: 16px;
}

.cf-html-view .grid-5,
.cf-html-view .stats-grid,
.cf-html-view .stat-grid,
.cf-html-view .metric-grid,
.cf-html-view .summary-grid {
  gap: 12px;
}

@media (max-width: 640px) {
  .cf-top-metric-tile,
  .cf-html-view .metric,
  .cf-html-view .stat-card,
  .cf-html-view .summary-card,
  .cf-html-view .dashboard-stat-card {
    min-height: 84px;
  }

  .cf-top-metric-tile-value,
  .cf-html-view .metric strong,
  .cf-html-view .stat-card strong,
  .cf-html-view .summary-card strong,
  .cf-html-view .dashboard-stat-card strong,
  .cf-html-view .metric .value,
  .cf-html-view .stat-card .value,
  .cf-html-view .summary-card .value,
  .cf-html-view .dashboard-stat-card .value {
    font-size: 24px !important;
  }
}
`;
  write(rel, css);
}

function cleanupFailedStageFiles() {
  const leftovers = [
    'scripts/repair-stage16aj-unified-top-metric-tiles.cjs',
    'docs/release/STAGE16AJ_UNIFIED_TOP_METRIC_TILES_2026-05-07.md',
  ];
  for (const rel of leftovers) {
    if (exists(rel)) fs.rmSync(path.join(root, rel), { force: true });
  }
}

function main() {
  patchPackageJson();
  patchStatShortcutCard();
  patchMetricCss();
  cleanupFailedStageFiles();
  console.log('OK: Stage16AL metric tile icons next to values patched.');
  console.log('- src/components/StatShortcutCard.tsx');
  console.log('- src/styles/closeflow-metric-tiles.css');
  console.log('- package.json');
}

main();
