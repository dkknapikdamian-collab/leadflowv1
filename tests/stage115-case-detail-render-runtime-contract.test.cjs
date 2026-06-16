const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const caseDetailPath = path.join(repoRoot, 'src/pages/CaseDetail.tsx');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

test('Stage115 CaseDetail runtime contract keeps route renderable', () => {
  const source = read(caseDetailPath);

  assert.match(source, /export\s+default\s+function\s+CaseDetail\s*\(/, 'CaseDetail must export a default route component');
  assert.match(source, /const\s+\{[^}]*\bhasAccess\b[^}]*\baccess\b[^}]*\}\s*=\s*useWorkspace\s*\(\s*\)/, 'CaseDetail should call the project useWorkspace hook at runtime');
  assert.doesNotMatch(source, /APP_ROUTE_RENDER_FAILED/, 'CaseDetail must not contain APP_ROUTE_RENDER_FAILED fallback masking');
  assert.doesNotMatch(source, /p\.useWorkspace|React\.useWorkspace/, 'CaseDetail must not compile toward React namespace useWorkspace calls');

  const srcFiles = walk(path.join(repoRoot, 'src'));
  const routingText = srcFiles.map((file) => read(file)).join('\n');
  assert.match(routingText, /CaseDetail/, 'App source should reference CaseDetail');
  assert.ok(
    /\/case\/:|\/cases\/:/.test(routingText),
    'App source should keep a /case/:... or /cases/:... route contract for CaseDetail',
  );
});

test('Stage115 quiet gate includes CaseDetail crash regression tests', () => {
  const quietGate = read(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'));
  assert.match(quietGate, /tests\/stage115-case-detail-useworkspace-import-contract\.test\.cjs/);
  assert.match(quietGate, /tests\/stage115-case-detail-render-runtime-contract\.test\.cjs/);
});
