const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-012';
const errors = [];
const warnings = [];
const MOJIBAKE_PATTERN = new RegExp(['\\u00c5', '\\u00c4', '\\u0102', '\\u00e2\\u20ac', '\\uFFFD'].join('|'));

function read(rel) {
  const absolute = path.join(ROOT, rel);
  if (!fs.existsSync(absolute)) {
    errors.push(`Missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(absolute, 'utf8');
}

function requireIncludes(file, text, message = `${file} must include ${text}`) {
  const content = read(file);
  if (!content.includes(text)) errors.push(message);
}

function assertNoMojibake(file) {
  const content = read(file);
  if (MOJIBAKE_PATTERN.test(content)) errors.push(`Mojibake marker found in ${file}`);
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
]);

for (const file of files) read(file);

for (const file of ['src/components/ui/metric-card.tsx', 'src/components/ui/list-card.tsx', 'src/components/ui/empty-state-card.tsx', 'src/components/ui/detail-panel.tsx']) {
  requireIncludes(file, "from './card'", `${file} must use Card primitive from ui/card.tsx`);
  requireIncludes(file, 'data-cf-card-variant', `${file} must expose data-cf-card-variant`);
  if (read(file).includes('lucide-react')) errors.push(`${file} must not import lucide-react directly`);
}

requireIncludes('src/components/ui/metric-card.tsx', 'export type MetricCardProps', 'MetricCard must export stable props type');
requireIncludes('src/components/ui/metric-card.tsx', 'label: string', 'MetricCard API must include label');
requireIncludes('src/components/ui/metric-card.tsx', 'value: string | number', 'MetricCard API must include value');
requireIncludes('src/components/ui/metric-card.tsx', 'iconName: IconName', 'MetricCard API must include iconName');
requireIncludes('src/components/ui/metric-card.tsx', 'tone?:', 'MetricCard API must include tone');
requireIncludes('src/components/ui/metric-card.tsx', 'meta?: ReactNode', 'MetricCard API must include meta');
requireIncludes('src/components/ui/metric-card.tsx', '<AppIcon', 'MetricCard must use AppIcon from CZ2-011');

requireIncludes('src/components/ui/list-card.tsx', 'export type ListCardProps', 'ListCard must export stable props type');
requireIncludes('src/components/ui/list-card.tsx', 'title: ReactNode', 'ListCard API must include title');
requireIncludes('src/components/ui/list-card.tsx', 'subtitle?: ReactNode', 'ListCard API must include subtitle');
requireIncludes('src/components/ui/list-card.tsx', 'badges?:', 'ListCard API must include badges');
requireIncludes('src/components/ui/list-card.tsx', 'actions?:', 'ListCard API must include actions');
requireIncludes('src/components/ui/list-card.tsx', 'href?: string', 'ListCard API must include href');

requireIncludes('src/components/ui/empty-state-card.tsx', 'export type EmptyStateCardProps', 'EmptyStateCard must export stable props type');
requireIncludes('src/components/ui/empty-state-card.tsx', 'iconName: IconName', 'EmptyStateCard API must include iconName');
requireIncludes('src/components/ui/empty-state-card.tsx', 'title: ReactNode', 'EmptyStateCard API must include title');
requireIncludes('src/components/ui/empty-state-card.tsx', 'description?: ReactNode', 'EmptyStateCard API must include description');
requireIncludes('src/components/ui/empty-state-card.tsx', 'cta?: ReactNode', 'EmptyStateCard API must include cta');
requireIncludes('src/components/ui/empty-state-card.tsx', '<AppIcon', 'EmptyStateCard must use AppIcon from CZ2-011');

requireIncludes('src/components/ui/detail-panel.tsx', 'export type DetailPanelProps', 'DetailPanel must export stable props type');
requireIncludes('src/components/ui/detail-panel.tsx', 'title: ReactNode', 'DetailPanel API must include title');
requireIncludes('src/components/ui/detail-panel.tsx', 'description?: ReactNode', 'DetailPanel API must include description');
requireIncludes('src/components/ui/detail-panel.tsx', 'actions?: ReactNode', 'DetailPanel API must include actions');
requireIncludes('src/components/ui/detail-panel.tsx', 'children?: ReactNode', 'DetailPanel API must include children');

requireIncludes('src/components/StatShortcutCard.tsx', "import { MetricCard } from './ui/metric-card'", 'Scoped migration must route StatShortcutCard through MetricCard');
requireIncludes('src/components/StatShortcutCard.tsx', '<MetricCard', 'StatShortcutCard must render MetricCard');
requireIncludes('src/components/StatShortcutCard.tsx', 'resolveMetricIconName', 'StatShortcutCard must map legacy icon props to IconName');

const cardPrimitive = read('src/components/ui/card.tsx');
for (const marker of [
  'TODAY_VIEW_STORAGE_KEY_STAGE232T_R1A',
  'TODAY_SECTION_KEYS_STAGE232T_R1A',
  'readTodayViewSetStage232TR1A',
  'getTodayCardSectionKeyStage232TR1A',
  'applyTodayCardSectionVisibilityStage232TR1A',
]) {
  if (!cardPrimitive.includes(marker)) errors.push(`Today-specific Card logic marker removed without this-stage guard: ${marker}`);
}

const packageJson = read('package.json');
if (!packageJson.includes('verify:lf-ui-sot-cz2-012-card-tile-panel-variants')) {
  errors.push('package.json must register verify:lf-ui-sot-cz2-012-card-tile-panel-variants before closing CZ2-012');
}

let changedFiles = [];
try {
  changedFiles = execSync('git diff --name-only HEAD~8..HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
} catch (error) {
  warnings.push('Could not inspect recent changed files with git diff HEAD~8..HEAD.');
}

for (const file of changedFiles) {
  if (laterScopedStageAllowlist.has(file)) continue;
  if (/\.(css|sql)$/i.test(file)) errors.push(`CZ2-012 must not touch CSS/SQL: ${file}`);
  if (/migrations|supabase|data-provider|form|layout|sidebar/i.test(file) && !files.includes(file)) {
    errors.push(`CZ2-012 must not touch data-provider/form/layout/sidebar scope: ${file}`);
  }
}

for (const file of files) assertNoMojibake(file);

const result = {
  ok: errors.length === 0,
  stage: STAGE,
  decision: 'CARD_TILE_PANEL_VARIANTS_SOURCE_OF_TRUTH / SCOPED_NO_MASS_MIGRATION',
  canonical: [
    'src/components/ui/metric-card.tsx',
    'src/components/ui/list-card.tsx',
    'src/components/ui/empty-state-card.tsx',
    'src/components/ui/detail-panel.tsx',
  ],
  scopedMigration: 'src/components/StatShortcutCard.tsx',
  changedFiles,
  laterScopedStageAllowlist: Array.from(laterScopedStageAllowlist),
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exit(1);
