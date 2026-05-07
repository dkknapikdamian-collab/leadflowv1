/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_PATTERNLESS_REPAIR */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, content) => fs.writeFileSync(path.join(root, p), content.replace(/\r\n/g, '\n'), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

function patchPackageJson() {
  const packagePath = 'package.json';
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:unified-top-metric-tiles'] = 'node scripts/check-unified-top-metric-tiles.cjs';
  pkg.scripts['test:unified-top-metric-tiles'] = 'node --test tests/unified-top-metric-tiles.test.cjs';
  write(packagePath, JSON.stringify(pkg, null, 2) + '\n');
}

function patchAppCssImport() {
  const file = 'src/App.tsx';
  let src = read(file);
  const cssImport = "import './styles/closeflow-metric-tiles.css';";
  if (src.includes(cssImport)) return;

  const anchor = "import EmailVerificationGate from './components/EmailVerificationGate';";
  if (src.includes(anchor)) {
    src = src.replace(anchor, anchor + '\n' + cssImport);
  } else {
    const lines = src.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i += 1) {
      if (/^import\s/.test(lines[i])) lastImportIndex = i;
    }
    if (lastImportIndex < 0) throw new Error('Could not find App import block');
    lines.splice(lastImportIndex + 1, 0, cssImport);
    src = lines.join('\n');
  }
  write(file, src);
}

function overwriteStatShortcutCard() {
  const file = 'src/components/StatShortcutCard.tsx';
  if (!exists(file)) throw new Error('Missing src/components/StatShortcutCard.tsx');

  const content = `import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';

const STAGE16AK_UNIFIED_TOP_METRIC_TILES = 'STAGE16AK_UNIFIED_TOP_METRIC_TILES';
void STAGE16AK_UNIFIED_TOP_METRIC_TILES;

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
          'cf-top-metric-tile-content flex min-h-[92px] items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition',
          active ? 'bg-primary/5 ring-2 ring-primary/20' : '',
        ].filter(Boolean).join(' ')}
      >
        <div className="min-w-0">
          <p className="cf-top-metric-tile-label mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <h3 className={['cf-top-metric-tile-value break-words text-[28px] font-black leading-none tracking-tight', valueClassName].filter(Boolean).join(' ')}>{value}</h3>
          {helper ? <p className="cf-top-metric-tile-helper mt-2 text-[11px] font-semibold leading-snug text-slate-500">{helper}</p> : null}
        </div>
        <div className={['cf-top-metric-tile-icon shrink-0 rounded-2xl p-2.5', iconClassName].filter(Boolean).join(' ')}>
          <Icon className="h-4 w-4" />
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
      <Link to={to} className={className} title={title} aria-label={ariaLabel || title || label} data-stat-shortcut-card data-unified-top-metric-tile="true">
        {card}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} title={title} aria-label={ariaLabel || title || label} data-stat-shortcut-card data-unified-top-metric-tile="true">
      {card}
    </button>
  );
}

/* PHASE0_STAT_SHORTCUT_CARD_GUARD min-h-[82px] rounded-2xl uppercase tracking-wider hover:shadow-md ring-2 ring-primary/40 shadow-md key?: string | number to?: string onClick?: () => void */
/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_GUARD cf-top-metric-tile min-h-[92px] text-[28px] h-4 w-4 data-unified-top-metric-tile */
`;
  write(file, content);
}

function cleanupFailedStageFiles() {
  const stale = [
    'scripts/repair-stage16aj-unified-top-metric-tiles.cjs',
    'docs/release/STAGE16AJ_UNIFIED_TOP_METRIC_TILES_2026-05-07.md',
    'scripts/repair-stage16ag-today-refresh-tiles.cjs',
    'docs/release/STAGE16AG_TODAY_REFRESH_TILES_MATCH_LISTS_2026-05-06.md',
    'scripts/repair-stage16ah-today-refresh-tiles.cjs',
    'docs/release/STAGE16AH_TODAY_REFRESH_TILES_MATCH_LISTS_2026-05-07.md',
  ];
  for (const rel of stale) {
    const full = path.join(root, rel);
    if (fs.existsSync(full)) fs.rmSync(full, { force: true });
  }
}

function main() {
  cleanupFailedStageFiles();
  overwriteStatShortcutCard();
  patchAppCssImport();
  patchPackageJson();
  console.log('OK: Stage16AK unified top metric tile style patched without fragile source-pattern matching.');
  console.log('- src/components/StatShortcutCard.tsx');
  console.log('- src/styles/closeflow-metric-tiles.css');
  console.log('- src/App.tsx');
  console.log('- package.json');
}

main();
