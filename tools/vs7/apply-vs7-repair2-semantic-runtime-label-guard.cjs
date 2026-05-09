#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'src/components/ui-system/OperatorMetricToneRuntime.tsx';
const filePath = path.join(root, rel);

if (!fs.existsSync(filePath)) {
  throw new Error(`Missing ${rel}`);
}

let source = fs.readFileSync(filePath, 'utf8');

const guardName = 'CLOSEFLOW_VS7_RUNTIME_FEEDBACK_LABEL_GUARD';
const guardBlock = `
const ${guardName} = [
  'Najbliższe 7 dni',
  'Szkice AI do sprawdzenia',
  'Leady czekające',
] as const;
void ${guardName};
`;

if (!source.includes(guardName)) {
  const marker = "void CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_RUNTIME;\n";
  if (!source.includes(marker)) {
    throw new Error(`Cannot find runtime guard insertion marker in ${rel}`);
  }
  source = source.replace(marker, marker + guardBlock);
}

if (!source.includes(`...${guardName},`)) {
  const marker = 'const LEGACY_SECTION_LABELS = [\n  ...CLOSEFLOW_VS7_REPORTED_ADMIN_FEEDBACK_LABELS,\n';
  if (!source.includes(marker)) {
    throw new Error(`Cannot find LEGACY_SECTION_LABELS spread marker in ${rel}`);
  }
  source = source.replace(marker, marker + `  ...${guardName},\n`);
}

for (const label of ['Najbliższe 7 dni', 'Szkice AI do sprawdzenia', 'Leady czekające']) {
  if (!source.includes(label)) {
    throw new Error(`Runtime still missing label: ${label}`);
  }
}

fs.writeFileSync(filePath, source);
console.log('CLOSEFLOW_VS7_REPAIR2_SEMANTIC_RUNTIME_LABEL_GUARD_PATCHED');
