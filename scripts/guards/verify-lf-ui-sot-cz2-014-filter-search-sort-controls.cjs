const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-014';
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
  'src/components/ui/search-field.tsx',
  'src/components/ui/filter-select.tsx',
  'src/components/ui/sort-select.tsx',
  'src/components/ui/filter-chip-group.tsx',
  'src/components/ui/filter-toolbar.tsx',
  'src/components/operator-rail/SimpleFiltersCard.tsx',
  'package.json',
  'scripts/guards/verify-lf-ui-sot-cz2-014-filter-search-sort-controls.cjs',
  'tests/lf-ui-sot-cz2-014-filter-search-sort-controls.test.cjs',
];

for (const file of files) read(file);

const componentFiles = [
  'src/components/ui/search-field.tsx',
  'src/components/ui/filter-select.tsx',
  'src/components/ui/sort-select.tsx',
  'src/components/ui/filter-chip-group.tsx',
  'src/components/ui/filter-toolbar.tsx',
];

for (const file of componentFiles) {
  const source = read(file);
  if (source.includes('lucide-react')) errors.push(`${file} must not import lucide-react directly`);
  if (/supabase|data-provider|routes|layout|sidebar/i.test(source)) errors.push(`${file} must not import Supabase/data-provider/routes/layout/sidebar`);
}

requireIncludes('src/components/ui/search-field.tsx', 'export type SearchFieldProps', 'SearchField must export stable props type');
requireIncludes('src/components/ui/search-field.tsx', 'value: string', 'SearchField API must include value');
requireIncludes('src/components/ui/search-field.tsx', 'onChange: (value: string) => void', 'SearchField API must include value-based onChange');
requireIncludes('src/components/ui/search-field.tsx', 'placeholder?: string', 'SearchField API must include placeholder');
requireIncludes('src/components/ui/search-field.tsx', 'label?: ReactNode', 'SearchField API must include label');
requireIncludes('src/components/ui/search-field.tsx', 'description?: ReactNode', 'SearchField API must include description');
requireIncludes('src/components/ui/search-field.tsx', 'disabled?: boolean', 'SearchField API must include disabled');
requireIncludes('src/components/ui/search-field.tsx', 'inputClassName?: string', 'SearchField API must include inputClassName');
requireIncludes('src/components/ui/search-field.tsx', "from './input'", 'SearchField must use Input primitive');
requireIncludes('src/components/ui/search-field.tsx', 'data-cf-filter-control-variant="search"', 'SearchField must expose stable search marker');

requireIncludes('src/components/ui/filter-select.tsx', 'export type FilterSelectProps', 'FilterSelect must export stable props type');
requireIncludes('src/components/ui/filter-select.tsx', 'label: ReactNode', 'FilterSelect API must include label');
requireIncludes('src/components/ui/filter-select.tsx', 'value: string', 'FilterSelect API must include value');
requireIncludes('src/components/ui/filter-select.tsx', 'onChange: (value: string) => void', 'FilterSelect API must include value-based onChange');
requireIncludes('src/components/ui/filter-select.tsx', 'options: FilterSelectOption[]', 'FilterSelect API must include options');
requireIncludes('src/components/ui/filter-select.tsx', 'placeholder?: string', 'FilterSelect API must include placeholder');
requireIncludes('src/components/ui/filter-select.tsx', 'selectClassName?: string', 'FilterSelect API must include selectClassName');
requireIncludes('src/components/ui/filter-select.tsx', "from './select-field'", 'FilterSelect must use SelectField');
requireIncludes('src/components/ui/filter-select.tsx', 'data-cf-filter-control-variant="filter-select"', 'FilterSelect must expose stable marker');

requireIncludes('src/components/ui/sort-select.tsx', 'export type SortSelectProps', 'SortSelect must export stable props type');
requireIncludes('src/components/ui/sort-select.tsx', 'label: ReactNode', 'SortSelect API must include label');
requireIncludes('src/components/ui/sort-select.tsx', 'value: string', 'SortSelect API must include value');
requireIncludes('src/components/ui/sort-select.tsx', 'onChange: (value: string) => void', 'SortSelect API must include value-based onChange');
requireIncludes('src/components/ui/sort-select.tsx', 'options: SortSelectOption[]', 'SortSelect API must include options');
requireIncludes('src/components/ui/sort-select.tsx', 'selectClassName?: string', 'SortSelect API must include selectClassName');
requireIncludes('src/components/ui/sort-select.tsx', "from './select-field'", 'SortSelect must use SelectField');
requireIncludes('src/components/ui/sort-select.tsx', 'data-cf-filter-control-variant="sort-select"', 'SortSelect must expose stable marker');

requireIncludes('src/components/ui/filter-chip-group.tsx', 'export type FilterChipGroupProps', 'FilterChipGroup must export stable props type');
requireIncludes('src/components/ui/filter-chip-group.tsx', 'label?: ReactNode', 'FilterChipGroup API must include label');
requireIncludes('src/components/ui/filter-chip-group.tsx', 'value: string', 'FilterChipGroup API must include value');
requireIncludes('src/components/ui/filter-chip-group.tsx', 'onChange: (value: string) => void', 'FilterChipGroup API must include value-based onChange');
requireIncludes('src/components/ui/filter-chip-group.tsx', 'options: FilterChipOption[]', 'FilterChipGroup API must include options');
requireIncludes('src/components/ui/filter-chip-group.tsx', 'count?: number', 'FilterChipGroup options must include count');
requireIncludes('src/components/ui/filter-chip-group.tsx', 'data-cf-filter-control-variant="chip-group"', 'FilterChipGroup must expose stable marker');

requireIncludes('src/components/ui/filter-toolbar.tsx', 'export type FilterToolbarProps', 'FilterToolbar must export stable props type');
requireIncludes('src/components/ui/filter-toolbar.tsx', 'children: ReactNode', 'FilterToolbar API must include children');
requireIncludes('src/components/ui/filter-toolbar.tsx', 'title?: ReactNode', 'FilterToolbar API must include title');
requireIncludes('src/components/ui/filter-toolbar.tsx', 'description?: ReactNode', 'FilterToolbar API must include description');
requireIncludes('src/components/ui/filter-toolbar.tsx', 'actions?: ReactNode', 'FilterToolbar API must include actions');
requireIncludes('src/components/ui/filter-toolbar.tsx', 'data-cf-filter-control-variant="toolbar"', 'FilterToolbar must expose stable marker');

requireIncludes('src/components/operator-rail/SimpleFiltersCard.tsx', "import { FilterChipGroup } from '../ui/filter-chip-group'", 'Scoped migrated file must import FilterChipGroup');
requireIncludes('src/components/operator-rail/SimpleFiltersCard.tsx', '<FilterChipGroup', 'Scoped migrated file must render FilterChipGroup');
requireIncludes('src/components/operator-rail/SimpleFiltersCard.tsx', 'CLOSEFLOW_CZ2_014_SIMPLE_FILTERS_CHIP_GROUP', 'Scoped migration marker missing');

const packageJson = read('package.json');
if (!packageJson.includes('verify:lf-ui-sot-cz2-014-filter-search-sort-controls')) {
  errors.push('package.json must register verify:lf-ui-sot-cz2-014-filter-search-sort-controls before closing CZ2-014');
}

let changedFiles = [];
try {
  changedFiles = execSync('git diff --name-only HEAD~9..HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
} catch (error) {
  warnings.push('Could not inspect recent changed files with git diff HEAD~9..HEAD.');
}

for (const file of changedFiles) {
  if (/\.(css|sql)$/i.test(file)) errors.push(`CZ2-014 must not touch CSS/SQL: ${file}`);
  if (/migrations|data-provider|layout|sidebar|cz2-015/i.test(file) && !files.includes(file)) {
    errors.push(`CZ2-014 must not touch data-provider/layout/sidebar/CZ2-015 scope: ${file}`);
  }
}

for (const file of files) assertNoMojibake(file);

const result = {
  ok: errors.length === 0,
  stage: STAGE,
  decision: 'FILTER_SEARCH_SORT_CONTROLS_SOURCE_OF_TRUTH / SCOPED_NO_MASS_MIGRATION',
  canonical: [
    'src/components/ui/search-field.tsx',
    'src/components/ui/filter-select.tsx',
    'src/components/ui/sort-select.tsx',
    'src/components/ui/filter-chip-group.tsx',
    'src/components/ui/filter-toolbar.tsx',
  ],
  scopedMigration: 'src/components/operator-rail/SimpleFiltersCard.tsx',
  changedFiles,
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exit(1);
