const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-013';
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
  'src/components/ui/form-field.tsx',
  'src/components/ui/form-section.tsx',
  'src/components/ui/select-field.tsx',
  'src/components/ui/textarea-field.tsx',
  'src/components/ClientCreateDialog.tsx',
  'package.json',
  'scripts/guards/verify-lf-ui-sot-cz2-013-form-control-variants.cjs',
  'tests/lf-ui-sot-cz2-013-form-control-variants.test.cjs',
];

for (const file of files) read(file);

for (const file of [
  'src/components/ui/form-field.tsx',
  'src/components/ui/form-section.tsx',
  'src/components/ui/select-field.tsx',
  'src/components/ui/textarea-field.tsx',
]) {
  const source = read(file);
  if (source.includes('lucide-react')) errors.push(`${file} must not import lucide-react directly`);
  if (/supabase|data-provider/i.test(source)) errors.push(`${file} must not import Supabase/data provider`);
}

requireIncludes('src/components/ui/form-field.tsx', 'export type FormFieldProps', 'FormField must export stable props type');
requireIncludes('src/components/ui/form-field.tsx', 'label: ReactNode', 'FormField API must include label');
requireIncludes('src/components/ui/form-field.tsx', 'description?: ReactNode', 'FormField API must include description');
requireIncludes('src/components/ui/form-field.tsx', 'error?: ReactNode', 'FormField API must include error');
requireIncludes('src/components/ui/form-field.tsx', 'children: ReactNode', 'FormField API must include children');
requireIncludes('src/components/ui/form-field.tsx', 'required?: boolean', 'FormField API must include required');
requireIncludes('src/components/ui/form-field.tsx', 'htmlFor?: string', 'FormField API must include htmlFor');
requireIncludes('src/components/ui/form-field.tsx', "from './label'", 'FormField must use Label primitive');

requireIncludes('src/components/ui/form-section.tsx', 'export type FormSectionProps', 'FormSection must export stable props type');
requireIncludes('src/components/ui/form-section.tsx', 'title: ReactNode', 'FormSection API must include title');
requireIncludes('src/components/ui/form-section.tsx', 'description?: ReactNode', 'FormSection API must include description');
requireIncludes('src/components/ui/form-section.tsx', 'actions?: ReactNode', 'FormSection API must include actions');
requireIncludes('src/components/ui/form-section.tsx', 'children: ReactNode', 'FormSection API must include children');

requireIncludes('src/components/ui/select-field.tsx', 'export type SelectFieldProps', 'SelectField must export stable props type');
requireIncludes('src/components/ui/select-field.tsx', 'label: ReactNode', 'SelectField API must include label');
requireIncludes('src/components/ui/select-field.tsx', 'value: string', 'SelectField API must include value');
requireIncludes('src/components/ui/select-field.tsx', 'onChange:', 'SelectField API must include onChange');
requireIncludes('src/components/ui/select-field.tsx', 'options: SelectFieldOption[]', 'SelectField API must include options');
requireIncludes('src/components/ui/select-field.tsx', 'placeholder?: string', 'SelectField API must include placeholder');
requireIncludes('src/components/ui/select-field.tsx', 'disabled?: boolean', 'SelectField API must include disabled');
requireIncludes('src/components/ui/select-field.tsx', 'required?: boolean', 'SelectField API must include required');
requireIncludes('src/components/ui/select-field.tsx', "from './form-field'", 'SelectField must use FormField wrapper');

requireIncludes('src/components/ui/textarea-field.tsx', 'export type TextareaFieldProps', 'TextareaField must export stable props type');
requireIncludes('src/components/ui/textarea-field.tsx', 'label: ReactNode', 'TextareaField API must include label');
requireIncludes('src/components/ui/textarea-field.tsx', 'value: string', 'TextareaField API must include value');
requireIncludes('src/components/ui/textarea-field.tsx', 'onChange:', 'TextareaField API must include onChange');
requireIncludes('src/components/ui/textarea-field.tsx', 'placeholder?: string', 'TextareaField API must include placeholder');
requireIncludes('src/components/ui/textarea-field.tsx', 'disabled?: boolean', 'TextareaField API must include disabled');
requireIncludes('src/components/ui/textarea-field.tsx', 'required?: boolean', 'TextareaField API must include required');
requireIncludes('src/components/ui/textarea-field.tsx', 'rows?: number', 'TextareaField API must include rows');
requireIncludes('src/components/ui/textarea-field.tsx', "from './form-field'", 'TextareaField must use FormField wrapper');

const clientCreate = read('src/components/ClientCreateDialog.tsx');
requireIncludes('src/components/ClientCreateDialog.tsx', "import { FormField } from './ui/form-field'", 'Scoped migrated file must import FormField');
requireIncludes('src/components/ClientCreateDialog.tsx', "import { TextareaField } from './ui/textarea-field'", 'Scoped migrated file must import TextareaField');
requireIncludes('src/components/ClientCreateDialog.tsx', '<FormField label="Nazwa / klient"', 'ClientCreateDialog name field must use FormField');
requireIncludes('src/components/ClientCreateDialog.tsx', '<FormField label="Telefon"', 'ClientCreateDialog phone field must use FormField');
requireIncludes('src/components/ClientCreateDialog.tsx', '<FormField label="E-mail"', 'ClientCreateDialog email field must use FormField');
requireIncludes('src/components/ClientCreateDialog.tsx', '<TextareaField', 'ClientCreateDialog notes field must use TextareaField');
requireIncludes('src/components/ClientCreateDialog.tsx', 'const handleSubmit = async (event: FormEvent)', 'Submit handler must remain present');
requireIncludes('src/components/ClientCreateDialog.tsx', '<form onSubmit={handleSubmit}', 'Form must still submit through handleSubmit');
requireIncludes('src/components/ClientCreateDialog.tsx', 'createClientInSupabase', 'Client create persistence path must remain present');

const packageJson = read('package.json');
if (!packageJson.includes('verify:lf-ui-sot-cz2-013-form-control-variants')) {
  errors.push('package.json must register verify:lf-ui-sot-cz2-013-form-control-variants before closing CZ2-013');
}

let changedFiles = [];
try {
  changedFiles = execSync('git diff --name-only HEAD~7..HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
} catch (error) {
  warnings.push('Could not inspect recent changed files with git diff HEAD~7..HEAD.');
}

for (const file of changedFiles) {
  if (/\.(css|sql)$/i.test(file)) errors.push(`CZ2-013 must not touch CSS/SQL: ${file}`);
  if (/migrations|data-provider|layout|sidebar|cz2-014/i.test(file) && !files.includes(file)) {
    errors.push(`CZ2-013 must not touch data-provider/layout/sidebar/CZ2-014 scope: ${file}`);
  }
}

for (const file of files) assertNoMojibake(file);

const result = {
  ok: errors.length === 0,
  stage: STAGE,
  decision: 'FORM_CONTROL_VARIANTS_SOURCE_OF_TRUTH / SCOPED_NO_MASS_MIGRATION',
  canonical: [
    'src/components/ui/form-field.tsx',
    'src/components/ui/form-section.tsx',
    'src/components/ui/select-field.tsx',
    'src/components/ui/textarea-field.tsx',
  ],
  scopedMigration: 'src/components/ClientCreateDialog.tsx',
  changedFiles,
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exit(1);
