const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-012';
const errors = [];
const warnings = [];
const MOJIBAKE_PATTERN = /\u00c5|\u00c4|\u0102|\u00e2\u20ac|\uFFFD/;

function read(rel) {
  const absolute = path.join(ROOT, rel);
  if (!fs.existsSync(absolute)) {
    errors.push(`Missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(absolute, 'utf8');
}
function requireIncludes(file, text, message = `${file} must include ${text}`) {
  if (!read(file).includes(text)) errors.push(message);
}
function assertNoMojibake(file) {
  if (MOJIBAKE_PATTERN.test(read(file))) errors.push(`Mojibake marker found in ${file}`);
}

const files = [
  'src/components/ui/metric-card.tsx',
  'src/components/ui/list-card.tsx',
  'src/components/ui/empty-state-card.tsx',
  'src/components/ui/detail-panel.tsx',
  'src/components/StatShortcutCard.tsx',
  'src/components/ui/card.tsx',
  'package.json',
  'scripts/guards/verify-lf-ui-sot-cz2-012-card-tile-panel-variants.cjs',
  'tests/lf-ui-sot-cz2-012-card-tile-panel-variants.test.cjs',
];

const laterScopedStageAllowlist = new Set([
  'scripts/guards/verify-lf-ui-sot-cz2-013-form-control-variants.cjs',
  'tests/lf-ui-sot-cz2-013-form-control-variants.test.cjs',
  'src/components/ui/form-field.tsx',
  'src/components/ui/form-section.tsx',
  'src/components/ui/select-field.tsx',
  'src/components/ui/textarea-field.tsx',
  'src/components/ClientCreateDialog.tsx',
  'src/components/ui/search-field.tsx',
  'src/components/ui/filter-select.tsx',
  'src/components/ui/sort-select.tsx',
  'src/components/ui/filter-chip-group.tsx',
  'src/components/ui/filter-toolbar.tsx',
  'src/components/operator-rail/SimpleFiltersCard.tsx',
  'scripts/guards/verify-lf-ui-sot-cz2-014-filter-search-sort-controls.cjs',
  'tests/lf-ui-sot-cz2-014-filter-search-sort-controls.test.cjs',
  'src/components/layout/app-shell.tsx',
  'src/components/layout/page-shell.tsx',
  'src/components/layout/page-header.tsx',
  'src/components/layout/content-rail-layout.tsx',
  'src/components/layout/sidebar-nav.tsx',
  'src/pages/ResponseTemplates.tsx',
  'scripts/guards/verify-lf-ui-sot-cz2-015-layout-sidebar.cjs',
  'tests/lf-ui-sot-cz2-015-layout-sidebar.test.cjs',
]);

for (const file of files) read(file);
for (const file of ['src/components/ui/metric-card.tsx', 'src/components/ui/list-card.tsx', 'src/components/ui/empty-state-card.tsx', 'src/components/ui/detail-panel.tsx']) {
  requireIncludes(file, "from './card'", `${file} must use Card primitive from ui/card.tsx`);
  requireIncludes(file, 'data-cf-card-variant', `${file} must expose data-cf-card-variant`);
  if (read(file).includes('lucide-react')) errors.push(`${file} must not import lucide-react directly`);
}

const required = {
  'src/components/ui/metric-card.tsx': ['export type MetricCardProps', 'label: string', 'value: string | number', 'iconName: IconName', 'tone?:', 'meta?: ReactNode', '<AppIcon'],
  'src/components/ui/list-card.tsx': ['export type ListCardProps', 'title: ReactNode', 'subtitle?: ReactNode', 'badges?:', 'actions?:', 'href?: string'],
  'src/components/ui/empty-state-card.tsx': ['export type EmptyStateCardProps', 'iconName: IconName', 'title: ReactNode', 'description?: ReactNode', 'cta?: ReactNode', '<AppIcon'],
  'src/components/ui/detail-panel.tsx': ['export type DetailPanelProps', 'title: ReactNode', 'description?: ReactNode', 'actions?: ReactNode', 'children?: ReactNode'],
  'src/components/StatShortcutCard.tsx': ["import { MetricCard } from './ui/metric-card'", '<MetricCard', 'resolveMetricIconName'],
};
for (const [file, tokens] of Object.entries(required)) for (const token of tokens) requireIncludes(file, token, `${file} missing ${token}`);

const cardPrimitive = read('src/components/ui/card.tsx');
for (const marker of ['TODAY_VIEW_STORAGE_KEY_STAGE232T_R1A', 'TODAY_SECTION_KEYS_STAGE232T_R1A', 'readTodayViewSetStage232TR1A', 'getTodayCardSectionKeyStage232TR1A', 'applyTodayCardSectionVisibilityStage232TR1A']) {
  if (!cardPrimitive.includes(marker)) errors.push(`Today-specific Card logic marker removed without this-stage guard: ${marker}`);
}
if (!read('package.json').includes('verify:lf-ui-sot-cz2-012-card-tile-panel-variants')) errors.push('package.json must register verify:lf-ui-sot-cz2-012-card-tile-panel-variants before closing CZ2-012');

let changedFiles = [];
try {
  changedFiles = execSync('git diff --name-only HEAD~8..HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
} catch {
  warnings.push('Could not inspect recent changed files with git diff HEAD~8..HEAD.');
}
for (const file of changedFiles) {
  if (laterScopedStageAllowlist.has(file)) continue;
  if (/\.(css|sql)$/i.test(file)) errors.push(`CZ2-012 must not touch CSS/SQL: ${file}`);
  if (/migrations|supabase|data-provider|form|layout|sidebar/i.test(file) && !files.includes(file)) errors.push(`CZ2-012 must not touch data-provider/form/layout/sidebar scope: ${file}`);
}
for (const file of files) assertNoMojibake(file);

console.log(JSON.stringify({ ok: errors.length === 0, stage: STAGE, decision: 'CARD_TILE_PANEL_VARIANTS_SOURCE_OF_TRUTH / SCOPED_NO_MASS_MIGRATION', canonical: ['src/components/ui/metric-card.tsx', 'src/components/ui/list-card.tsx', 'src/components/ui/empty-state-card.tsx', 'src/components/ui/detail-panel.tsx'], scopedMigration: 'src/components/StatShortcutCard.tsx', changedFiles, laterScopedStageAllowlist: Array.from(laterScopedStageAllowlist), warnings, errors }, null, 2));
if (errors.length) process.exit(1);
