const fs = require('fs');
const path = require('path');

const root = process.cwd();
const docRel = 'docs/ui/CLOSEFLOW_FINAL_ACTIVE_UI_CONTRACT_AUDIT_STAGE18_2026-05-08.md';
const scriptRel = 'scripts/check-closeflow-final-active-ui-contract-audit.cjs';
const pkgRel = 'package.json';
const marker = 'CLOSEFLOW_FINAL_ACTIVE_UI_CONTRACT_AUDIT_STAGE18_2026_05_08';
const commandName = 'check:closeflow-final-active-ui-contract-audit';
const commandValue = 'node scripts/check-closeflow-final-active-ui-contract-audit.cjs';

const sourceTruth = [
  { key: 'metrics', files: ['src/components/StatShortcutCard.tsx', 'src/styles/closeflow-metric-tiles.css'], tokens: ['cf-top-metric-tile'] },
  { key: 'page hero', files: ['src/styles/closeflow-page-header.css'], tokens: ['cf-page-hero'] },
  { key: 'surface/right-card', files: ['src/styles/closeflow-surface-tokens.css'], tokens: ['--cf-surface-card'] },
  { key: 'list row', files: ['src/styles/closeflow-list-row-tokens.css'], tokens: ['CLOSEFLOW_LIST_ROW_CONTRACT'] },
  { key: 'status/progress', files: ['src/styles/closeflow-list-row-tokens.css'], tokens: ['cf-status-pill', 'cf-progress-bar'] },
  { key: 'alert/severity', files: ['src/styles/closeflow-alert-severity.css'], tokens: ['cf-alert-error', 'cf-severity-panel'] },
  { key: 'action/danger', files: ['src/styles/closeflow-action-tokens.css', 'src/components/entity-actions.tsx'], tokens: ['cf-entity-action-danger'] },
  { key: 'session action', files: ['src/styles/closeflow-action-tokens.css', 'src/pages/Dashboard.tsx'], tokens: ['cf-session-action-danger', 'data-cf-session-action="logout"'] },
  { key: 'action placement', files: ['src/styles/closeflow-action-clusters.css'], tokens: ['CLOSEFLOW_ENTITY_ACTION_CLUSTER_CONTRACT'] },
  { key: 'form/footer', files: ['src/styles/closeflow-form-actions.css'], tokens: ['CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT'] },
  { key: 'card readability', files: ['src/styles/closeflow-card-readability.css'], tokens: ['CLOSEFLOW_CARD_READABILITY_CONTRACT'] },
  { key: 'entity type', files: ['src/styles/closeflow-entity-type-tokens.css', 'src/pages/Calendar.tsx'], tokens: ['cf-entity-type-pill', 'data-cf-entity-type'] },
];

function fail(message) {
  console.error('[closeflow-final-active-ui-contract-audit] FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function abs(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(abs(rel));
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readBytes(rel) {
  return fs.readFileSync(abs(rel));
}

function assertNoBom(rel) {
  const bytes = readBytes(rel);
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  assert(!hasBom, rel + ' must be UTF-8 without BOM');
}

function assertNoControl(rel, text) {
  assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars');
}

function assertNoMojibake(rel, text) {
  const markers = [String.fromCharCode(0x00c4), String.fromCharCode(0x00c5), String.fromCharCode(0x0139), String.fromCharCode(0xfffd)];
  for (const item of markers) {
    assert(!text.includes(item), rel + ' contains mojibake-like marker U+' + item.charCodeAt(0).toString(16).toUpperCase());
  }
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

for (const rel of [docRel, scriptRel, pkgRel]) {
  assert(exists(rel), 'Missing required file: ' + rel);
  assertNoBom(rel);
  const text = read(rel);
  assertNoControl(rel, text);
  assertNoMojibake(rel, text);
}

const doc = read(docRel);
const script = read(scriptRel);
const pkg = JSON.parse(read(pkgRel));

assert(doc.includes(marker), 'Stage18 document missing marker');
assert(script.includes(marker), 'Stage18 check missing marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);

for (const item of sourceTruth) {
  assert(doc.toLowerCase().includes('| ' + item.key.toLowerCase() + ' |'), 'Stage18 document missing source truth row: ' + item.key);
  for (const file of item.files) {
    assert(exists(file), 'Missing source truth file for ' + item.key + ': ' + file);
    const text = read(file);
    for (const token of item.tokens) {
      const haystack = text + '\n' + doc;
      assert(haystack.includes(token), 'Missing token for ' + item.key + ': ' + token);
    }
  }
}

for (const mapFile of [
  'docs/ui/CLOSEFLOW_UI_MAP.generated.md',
  'docs/ui/closeflow-ui-map.generated.json',
  'docs/ui/CLOSEFLOW_STYLE_MAP.generated.md',
  'docs/ui/closeflow-style-map.generated.json',
]) {
  assert(exists(mapFile), 'Missing generated UI/style map: ' + mapFile);
  assertNoBom(mapFile);
}

const app = read('src/App.tsx');
assert(app.includes("const Today = lazy(() => import('./pages/TodayStable'))"), 'App.tsx must route Today to TodayStable');
assert(!app.includes("import('./pages/Today')"), 'App.tsx must not lazy import legacy Today.tsx');
assert(doc.includes('Today.tsx') && doc.toLowerCase().includes('legacy inactive'), 'Stage18 document must explain Today.tsx legacy inactive');

const forbidden = ['metric-fix', 'tile-v2', 'action-repair', 'severity-fix', 'page-head-v2'];
const srcFiles = walk(abs('src')).filter((full) => /\.(tsx?|css)$/.test(full));
for (const full of srcFiles) {
  const rel = path.relative(root, full).replace(/\\/g, '/');
  if (rel === 'src/pages/Today.tsx') continue;
  const text = fs.readFileSync(full, 'utf8').toLowerCase();
  for (const token of forbidden) {
    assert(!text.includes(token), rel + ' contains forbidden local system token: ' + token);
  }
}

for (const token of ['DOMKNIETE', 'PRZYSZLY_DEBT', 'POZA_AKTYWNYM_UI_DEBT', 'Stage16C', '/tasks', '/cases']) {
  assert(doc.includes(token), 'Stage18 document missing final audit decision token: ' + token);
}

console.log('CLOSEFLOW_FINAL_ACTIVE_UI_CONTRACT_AUDIT_STAGE18_OK: active UI contracts audited');
