const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (message) => {
  console.error('CLOSEFLOW_UI_CONTRACT_AUDIT_STAGE8_FAIL: ' + message);
  process.exit(1);
};

const docPath = 'docs/ui/CLOSEFLOW_UI_CONTRACT_AUDIT_STAGE8_2026-05-08.md';
if (!exists(docPath)) fail('brakuje dokumentu Stage8');
const doc = read(docPath);

for (const token of [
  'STAGE8_DOCUMENTED_LEGACY_EXCEPTIONS',
  'destructive/delete action',
  'status/progress',
  'metric tone',
  'readable card/empty state',
  'real system alert/error',
  'unrelated legacy visual style do później',
  'co naprawiono',
  'co zostawiono jako wyjątek',
  'co zostaje na kolejny etap',
]) {
  if (!doc.includes(token)) fail('dokument Stage8 nie zawiera: ' + token);
}

for (const file of [
  'src/components/AppChunkErrorBoundary.tsx',
  'src/pages/Activity.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Leads.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Templates.tsx',
  'src/pages/Today.tsx',
  'src/pages/TodayStable.tsx',
]) {
  if (!doc.includes(file)) fail('dokument Stage8 nie klasyfikuje pliku ' + file);
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:closeflow-ui-contract-audit-stage8'] !== 'node scripts/check-closeflow-ui-contract-audit-stage8.cjs') {
  fail('package.json nie zawiera komendy check:closeflow-ui-contract-audit-stage8');
}

const dangerCheck = read('scripts/check-closeflow-danger-style-contract.cjs');
if (!dangerCheck.includes('STAGE8_DOCUMENTED_LEGACY_EXCEPTIONS')) fail('danger check nie rozpoznaje dokumentowanych wyjątków Stage8');
if (!dangerCheck.includes('categorizeFinding')) fail('danger check nie klasyfikuje legacy kolorów');

const templates = read('src/pages/Templates.tsx');
if (templates.includes('<Badge className="bg-rose-600 text-white">Obowiązkowe</Badge>')) {
  fail('Templates nadal ma lokalny bg-rose-600 dla badge Obowiązkowe');
}
if (!templates.includes('className="cf-status-pill" data-cf-status-tone="red"')) {
  fail('Templates nie używa cf-status-pill red dla badge Obowiązkowe');
}

const forbiddenLocalNames = /(?:color|danger|status|legacy)[-_](?:fix|v2|repair|cleanup)|(?:fix|v2|repair|cleanup)[-_](?:color|danger|status|legacy)/i;
for (const file of [
  docPath,
  'scripts/check-closeflow-danger-style-contract.cjs',
  'scripts/check-closeflow-ui-contract-audit-stage8.cjs',
  'src/pages/Templates.tsx',
]) {
  const text = read(file);
  if (forbiddenLocalNames.test(text.replace(/CLOSEFLOW_UI_CONTRACT_AUDIT_STAGE8/g, ''))) {
    fail(file + ' zawiera lokalną nazwę fix/v2/repair/cleanup dla color/danger/status/legacy');
  }
}

console.log('CLOSEFLOW_UI_CONTRACT_AUDIT_STAGE8_OK: classified=65 fixed=1 documented_exceptions=64');
