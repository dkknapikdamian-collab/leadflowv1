const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const MOJIBAKE_PATTERN = new RegExp(['\\u00c5', '\\u00c4', '\\u0102', '\\u00e2\\u20ac', '\\uFFFD'].join('|'));

const variantFiles = [
  'src/components/ui/form-field.tsx',
  'src/components/ui/form-section.tsx',
  'src/components/ui/select-field.tsx',
  'src/components/ui/textarea-field.tsx',
];

test('CZ2-013 form control variant files exist', () => {
  for (const file of variantFiles) assert.equal(exists(file), true, `${file} must exist`);
});

test('CZ2-013 FormField exports stable API and uses Label primitive', () => {
  const source = read('src/components/ui/form-field.tsx');
  for (const token of ['export type FormFieldProps', 'label: ReactNode', 'description?: ReactNode', 'error?: ReactNode', 'children: ReactNode', 'required?: boolean', 'htmlFor?: string', "from './label'"]) {
    assert.equal(source.includes(token), true, `FormField missing ${token}`);
  }
});

test('CZ2-013 FormSection exports stable API', () => {
  const source = read('src/components/ui/form-section.tsx');
  for (const token of ['export type FormSectionProps', 'title: ReactNode', 'description?: ReactNode', 'actions?: ReactNode', 'children: ReactNode']) {
    assert.equal(source.includes(token), true, `FormSection missing ${token}`);
  }
});

test('CZ2-013 SelectField exports stable API and uses FormField', () => {
  const source = read('src/components/ui/select-field.tsx');
  for (const token of ['export type SelectFieldProps', 'label: ReactNode', 'value: string', 'onChange:', 'options: SelectFieldOption[]', 'placeholder?: string', 'disabled?: boolean', 'required?: boolean', "from './form-field'"]) {
    assert.equal(source.includes(token), true, `SelectField missing ${token}`);
  }
});

test('CZ2-013 TextareaField exports stable API and uses FormField', () => {
  const source = read('src/components/ui/textarea-field.tsx');
  for (const token of ['export type TextareaFieldProps', 'label: ReactNode', 'value: string', 'onChange:', 'placeholder?: string', 'disabled?: boolean', 'required?: boolean', 'rows?: number', "from './form-field'"]) {
    assert.equal(source.includes(token), true, `TextareaField missing ${token}`);
  }
});

test('CZ2-013 scoped migration imports and uses new form components', () => {
  const source = read('src/components/ClientCreateDialog.tsx');
  for (const token of ["import { FormField } from './ui/form-field'", "import { TextareaField } from './ui/textarea-field'", '<FormField label="Nazwa / klient"', '<FormField label="Telefon"', '<FormField label="E-mail"', '<TextareaField', '<form onSubmit={handleSubmit}']) {
    assert.equal(source.includes(token), true, `ClientCreateDialog missing ${token}`);
  }
});

test('CZ2-013 new components do not import lucide or data providers', () => {
  for (const file of variantFiles) {
    const source = read(file);
    assert.equal(source.includes('lucide-react'), false, `${file} must not import lucide-react`);
    assert.equal(/supabase|data-provider/i.test(source), false, `${file} must not import data provider`);
  }
});

test('CZ2-013 source has no mojibake markers', () => {
  for (const file of [...variantFiles, 'src/components/ClientCreateDialog.tsx', 'scripts/guards/verify-lf-ui-sot-cz2-013-form-control-variants.cjs']) {
    assert.equal(MOJIBAKE_PATTERN.test(read(file)), false, `${file} contains mojibake marker`);
  }
});
