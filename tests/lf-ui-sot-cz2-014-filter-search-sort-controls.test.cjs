const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const MOJIBAKE_PATTERN = new RegExp(['\\u00c5', '\\u00c4', '\\u0102', '\\u00e2\\u20ac', '\\uFFFD'].join('|'));

const variantFiles = [
  'src/components/ui/search-field.tsx',
  'src/components/ui/filter-select.tsx',
  'src/components/ui/sort-select.tsx',
  'src/components/ui/filter-chip-group.tsx',
  'src/components/ui/filter-toolbar.tsx',
];

test('CZ2-014 filter/search/sort variant files exist', () => {
  for (const file of variantFiles) assert.equal(exists(file), true, `${file} must exist`);
});

test('CZ2-014 SearchField exports stable API and uses Input primitive', () => {
  const source = read('src/components/ui/search-field.tsx');
  for (const token of ['export type SearchFieldProps', 'value: string', 'onChange: (value: string) => void', 'placeholder?: string', 'label?: ReactNode', 'description?: ReactNode', 'disabled?: boolean', 'inputClassName?: string', "from './input'", 'data-cf-filter-control-variant="search"']) {
    assert.equal(source.includes(token), true, `SearchField missing ${token}`);
  }
});

test('CZ2-014 FilterSelect exports stable API and uses SelectField', () => {
  const source = read('src/components/ui/filter-select.tsx');
  for (const token of ['export type FilterSelectProps', 'label: ReactNode', 'value: string', 'onChange: (value: string) => void', 'options: FilterSelectOption[]', 'placeholder?: string', 'selectClassName?: string', "from './select-field'", 'data-cf-filter-control-variant="filter-select"']) {
    assert.equal(source.includes(token), true, `FilterSelect missing ${token}`);
  }
});

test('CZ2-014 SortSelect exports stable API and uses SelectField', () => {
  const source = read('src/components/ui/sort-select.tsx');
  for (const token of ['export type SortSelectProps', 'label: ReactNode', 'value: string', 'onChange: (value: string) => void', 'options: SortSelectOption[]', 'selectClassName?: string', "from './select-field'", 'data-cf-filter-control-variant="sort-select"']) {
    assert.equal(source.includes(token), true, `SortSelect missing ${token}`);
  }
});

test('CZ2-014 FilterChipGroup exports stable API', () => {
  const source = read('src/components/ui/filter-chip-group.tsx');
  for (const token of ['export type FilterChipGroupProps', 'label?: ReactNode', 'value: string', 'onChange: (value: string) => void', 'options: FilterChipOption[]', 'count?: number', 'data-cf-filter-control-variant="chip-group"']) {
    assert.equal(source.includes(token), true, `FilterChipGroup missing ${token}`);
  }
});

test('CZ2-014 FilterToolbar exports stable API', () => {
  const source = read('src/components/ui/filter-toolbar.tsx');
  for (const token of ['export type FilterToolbarProps', 'children: ReactNode', 'title?: ReactNode', 'description?: ReactNode', 'actions?: ReactNode', 'data-cf-filter-control-variant="toolbar"']) {
    assert.equal(source.includes(token), true, `FilterToolbar missing ${token}`);
  }
});

test('CZ2-014 scoped migration uses FilterChipGroup', () => {
  const source = read('src/components/operator-rail/SimpleFiltersCard.tsx');
  for (const token of ["import { FilterChipGroup } from '../ui/filter-chip-group'", '<FilterChipGroup', 'CLOSEFLOW_CZ2_014_SIMPLE_FILTERS_CHIP_GROUP']) {
    assert.equal(source.includes(token), true, `SimpleFiltersCard missing ${token}`);
  }
});

test('CZ2-014 new components do not import lucide or data providers', () => {
  for (const file of variantFiles) {
    const source = read(file);
    assert.equal(source.includes('lucide-react'), false, `${file} must not import lucide-react`);
    assert.equal(/supabase|data-provider|routes|layout|sidebar/i.test(source), false, `${file} must not import forbidden runtime layers`);
  }
});

test('CZ2-014 source has no mojibake markers', () => {
  for (const file of [...variantFiles, 'src/components/operator-rail/SimpleFiltersCard.tsx', 'scripts/guards/verify-lf-ui-sot-cz2-014-filter-search-sort-controls.cjs']) {
    assert.equal(MOJIBAKE_PATTERN.test(read(file)), false, `${file} contains mojibake marker`);
  }
});
