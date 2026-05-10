const fs = require('fs');
const path = require('path');

const root = process.cwd();
const rel = (...parts) => path.join(root, ...parts);
const read = (file) => fs.readFileSync(rel(file), 'utf8');
const exists = (file) => fs.existsSync(rel(file));

function fail(message) {
  console.error('CLOSEFLOW_NO_LOCAL_VISUAL_DRIFT_VS9_FAIL');
  console.error(message);
  process.exit(1);
}

function mustExist(file) {
  if (!exists(file)) fail(`Missing required visual source of truth file: ${file}`);
}

function mustInclude(file, needle) {
  const text = read(file);
  if (!text.includes(needle)) fail(`${file} missing required marker: ${needle}`);
}

const sourceTruthFiles = [
  'src/components/ui-system/semantic-visual-registry.ts',
  'src/components/ui-system/operator-metric-tone-contract.ts',
  'src/components/ui-system/OperatorMetricTiles.tsx',
  'src/components/ui-system/EntityIcon.tsx',
  'src/components/ui-system/ActionIcon.tsx',
  'src/components/ui-system/icon-registry.ts',
  'src/components/ui-system/action-icon-registry.ts',
  'src/components/ui-system/screen-slots.ts',
  'docs/ui/CLOSEFLOW_VISUAL_SYSTEM_RELEASE_EVIDENCE_2026-05-09.md',
];

for (const file of sourceTruthFiles) mustExist(file);

mustInclude('src/components/ui-system/index.ts', "export * from './screen-slots';");
mustInclude('src/components/ui-system/index.ts', "export * from './EntityIcon';");
mustInclude('src/components/ui-system/index.ts', "export * from './ActionIcon';");
mustInclude('src/components/ui-system/index.ts', "export * from './semantic-visual-registry';");
mustInclude('src/components/ui-system/index.ts', "export * from './operator-metric-tone-contract';");
mustInclude('docs/ui/CLOSEFLOW_VISUAL_SYSTEM_RELEASE_EVIDENCE_2026-05-09.md', 'VS-9');
mustInclude('docs/ui/CLOSEFLOW_VISUAL_SYSTEM_RELEASE_EVIDENCE_2026-05-09.md', 'verify:closeflow-visual-system');

const packageJson = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
const requiredScripts = [
  'check:closeflow-no-local-visual-drift',
  'check:closeflow-no-direct-entity-icons',
  'check:closeflow-no-unclassified-css-imports',
  'check:closeflow-no-local-finance-panels',
  'verify:closeflow-visual-system',
];
for (const script of requiredScripts) {
  if (!packageJson.scripts || !packageJson.scripts[script]) fail(`package.json missing script: ${script}`);
}

const verify = packageJson.scripts['verify:closeflow-visual-system'];
for (const script of requiredScripts.filter((script) => script !== 'verify:closeflow-visual-system')) {
  if (!verify.includes(script)) fail(`verify:closeflow-visual-system does not run ${script}`);
}

console.log('CLOSEFLOW_NO_LOCAL_VISUAL_DRIFT_VS9_OK');
console.log('source_truth_files=' + sourceTruthFiles.length);
console.log('verify=closeflow-visual-system');
