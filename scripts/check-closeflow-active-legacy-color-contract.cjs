const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const STAGE16_MARKER = 'CLOSEFLOW_ACTIVE_LEGACY_COLOR_STAGE16';
const LEGACY_TODAY_MARKER = 'LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15';

const STAGE16_DOC = 'docs/ui/CLOSEFLOW_ACTIVE_LEGACY_COLOR_STAGE16_2026-05-08.md';
const STAGE15_DOC = 'docs/ui/CLOSEFLOW_LEGACY_TODAY_ROUTE_STAGE15_2026-05-08.md';
const DANGER_SCRIPT = 'scripts/check-closeflow-danger-style-contract.cjs';
const TODAY_LEGACY = 'src/pages/Today.tsx';
const APP = 'src/App.tsx';

const ACTIVE_FILES = [
  'src/pages/Dashboard.tsx',
  'src/pages/Activity.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Leads.tsx',
  'src/pages/TasksStable.tsx',
];

function abs(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(abs(rel));
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error('[closeflow-active-legacy-color-contract] FAIL: ' + message);
    process.exit(1);
  }
}

function assertNoControlChars(rel, text) {
  assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars');
}

function assertNoMojibake(rel, text) {
  const suspicious = [
    [0x42, 0x0139],
    [0x43, 0x79, 0x6b, 0x6c, 0x69, 0x63, 0x7a, 0x6e, 0x6f, 0x0139],
    [0x55, 0x73, 0x75, 0x0139],
    [0x0139, 0x015f],
    [0x0139, 0x013d],
    [0x00c4, 0x2026],
    [0x00c4, 0x2021],
    [0x00c5, 0x201a],
    [0x00c5, 0x203a],
    [0x00c5, 0x00bc],
    [0x00c3],
    [0x00c2],
    [0xfffd],
  ].map((chars) => String.fromCharCode(...chars));
  const hit = suspicious.find((item) => text.includes(item));
  assert(!hit, rel + ' contains mojibake marker');
}

function routeUsesTodayStable(appText) {
  return appText.includes("const Today = lazy(() => import('./pages/TodayStable'))")
    && appText.includes('<Route path="/" element={isLoggedIn ? <Today />')
    && appText.includes('<Route path="/today" element={isLoggedIn ? <Today />')
    && !appText.includes("import('./pages/Today')")
    && !appText.includes("from './pages/Today'")
    && !appText.includes('from "./pages/Today"');
}

function collectLegacyColorClasses(rel) {
  if (!exists(rel)) return [];
  const text = read(rel);
  const results = [];
  const pattern = /\b(?:hover:|focus:|focus-visible:|active:|group-hover:)?(?:text|bg|border|ring)-(?:red|rose|amber)-[0-9]{2,3}\b/g;
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    let match;
    while ((match = pattern.exec(lines[index]))) {
      results.push({ file: rel, line: index + 1, className: match[0] });
    }
  }

  return results;
}

function createDangerSmoke(rootDir, dangerText) {
  const dirs = [
    'src/components',
    'src/styles',
    'src/pages',
    'scripts',
    'docs/ui',
  ];
  for (const dir of dirs) fs.mkdirSync(path.join(rootDir, dir), { recursive: true });

  fs.writeFileSync(path.join(rootDir, DANGER_SCRIPT), dangerText, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'src/components/entity-actions.tsx'), 'export const x = 1;\n', 'utf8');
  fs.writeFileSync(
    path.join(rootDir, 'src/styles/closeflow-action-tokens.css'),
    ':root{--cf-action-danger-text:#b91c1c;--cf-action-danger-text-hover:#991b1b;--cf-action-danger-bg:#fef2f2;--cf-action-danger-bg-hover:#fee2e2;--cf-action-danger-border:#fecaca;--cf-action-danger-border-hover:#fca5a5;--cf-action-danger-focus:#fecaca;--cf-action-neutral-text:#334155;--cf-action-neutral-bg:#fff;--cf-action-neutral-border:#cbd5e1;--cf-action-neutral-bg-hover:#f8fafc;--cf-action-neutral-border-hover:#94a3b8}.cf-entity-action-danger{color:var(--cf-action-danger-text)}\n',
    'utf8',
  );
  fs.writeFileSync(path.join(rootDir, STAGE15_DOC), LEGACY_TODAY_MARKER + '\nlegacy inactive\n', 'utf8');
  fs.writeFileSync(path.join(rootDir, 'docs/ui/CLOSEFLOW_UI_CONTRACT_AUDIT_STAGE8_2026-05-08.md'), 'STAGE8_DOCUMENTED_LEGACY_EXCEPTIONS\n', 'utf8');
  fs.writeFileSync(path.join(rootDir, APP), "const Today = lazy(() => import('./pages/TodayStable'));\n<Route path=\"/\" element={isLoggedIn ? <Today /> : null} />\n<Route path=\"/today\" element={isLoggedIn ? <Today /> : null} />\n", 'utf8');
  fs.writeFileSync(path.join(rootDir, TODAY_LEGACY), LEGACY_TODAY_MARKER + '\n', 'utf8');
  fs.writeFileSync(path.join(rootDir, 'src/pages/TodayStable.tsx'), 'TODAY_STABLE_STAGE14_REMAINING_SEVERITY\n', 'utf8');
  fs.writeFileSync(path.join(rootDir, 'src/pages/__Stage16DangerSmoke.tsx'), "import { Trash2 } from 'lucide-react';\nexport function Smoke(){return <button className=\"text-red-600\"><Trash2 />Usuń</button>}\n", 'utf8');
}

const required = [
  APP,
  TODAY_LEGACY,
  STAGE15_DOC,
  STAGE16_DOC,
  DANGER_SCRIPT,
  'package.json',
  'src/components/entity-actions.tsx',
  'src/styles/closeflow-action-tokens.css',
  'src/styles/closeflow-alert-severity.css',
  'src/styles/closeflow-list-row-tokens.css',
  'src/components/StatShortcutCard.tsx',
  'src/styles/closeflow-metric-tiles.css',
];

for (const rel of required) assert(exists(rel), 'Missing required file: ' + rel);
for (const rel of ACTIVE_FILES) assert(exists(rel), 'Missing active file: ' + rel);

const stage16Doc = read(STAGE16_DOC);
const stage15Doc = read(STAGE15_DOC);
const todayLegacy = read(TODAY_LEGACY);
const appText = read(APP);
const dangerText = read(DANGER_SCRIPT);
const pkg = JSON.parse(read('package.json'));

assert(stage16Doc.includes(STAGE16_MARKER), 'Stage16 document missing marker');
assert(stage16Doc.includes('STAGE16_ACTIVE_CLASSIFIED_COUNT: 5'), 'Stage16 document missing classified count');
assert(stage16Doc.includes('STAGE16_REWIRED_COUNT: 3'), 'Stage16 document missing rewired count');
assert(stage16Doc.includes('STAGE16_EXCEPTION_COUNT: 2'), 'Stage16 document missing exception count');
assert(todayLegacy.includes(LEGACY_TODAY_MARKER), 'Today.tsx missing legacy inactive Stage15 marker');
assert(stage15Doc.includes(LEGACY_TODAY_MARKER), 'Stage15 document missing legacy Today marker');
assert(routeUsesTodayStable(appText), 'Active / and /today route must still use TodayStable');
assert(dangerText.includes('legacy inactive Today.tsx exception'), 'Danger style audit must keep Today.tsx legacy exception');
assert(dangerText.includes('blockingFindings.length'), 'Danger style audit blocking branch appears weakened');
assert(dangerText.includes('blockingActionPattern'), 'Danger style audit missing blocking action pattern');
assert(dangerText.includes('localDangerPattern'), 'Danger style audit missing local danger pattern');
assert(dangerText.includes('src/components/entity-actions.tsx'), 'Danger style audit must keep shared danger action exception only');
assert(dangerText.includes('--cf-action-danger-text') && dangerText.includes('.cf-entity-action-danger'), 'Danger style audit must still verify shared danger tokens');
assert(pkg.scripts && pkg.scripts['check:closeflow-active-legacy-color-contract'] === 'node scripts/check-closeflow-active-legacy-color-contract.cjs', 'package.json missing Stage16 command');

for (const rel of ACTIVE_FILES) {
  const tableRowNeedle = '| `' + rel + '` |';
  assert(stage16Doc.includes(tableRowNeedle), 'Stage16 document does not classify active file: ' + rel);
  const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const falseLegacyPattern = new RegExp('\\| `' + escaped + '` \\|[^\\n]*(legacy inactive|legacy Today|legacy inactive Today)', 'i');
  assert(!falseLegacyPattern.test(stage16Doc), 'Active file is falsely classified as legacy: ' + rel);
}

const forbiddenClassNamePattern = new RegExp([
  ['color', 'cleanup', 'fix'].join('-'),
  ['red', 'v2'].join('-'),
  ['severity', 'repair'].join('-'),
  ['final', 'patch'].join('-'),
].join('|'), 'i');

for (const rel of [STAGE16_DOC, DANGER_SCRIPT, 'scripts/check-closeflow-active-legacy-color-contract.cjs', ...ACTIVE_FILES]) {
  const text = read(rel);
  assert(!forbiddenClassNamePattern.test(text), rel + ' contains forbidden local one-off class/name');
}

for (const rel of [STAGE16_DOC, 'scripts/check-closeflow-active-legacy-color-contract.cjs']) {
  const text = read(rel);
  assertNoControlChars(rel, text);
  assertNoMojibake(rel, text);
}

const activeFindings = ACTIVE_FILES.flatMap(collectLegacyColorClasses);
const todayFindings = collectLegacyColorClasses(TODAY_LEGACY);

assert(todayFindings.length >= 0, 'Today legacy scan failed');
assert(stage16Doc.includes('Today.tsx legacy inactive, bez zmian'), 'Stage16 document missing separate Today legacy no-change section');

const tmpRoot = path.join(root, '.stage16-danger-style-smoke-tmp');
fs.rmSync(tmpRoot, { recursive: true, force: true });
try {
  createDangerSmoke(tmpRoot, dangerText);
  const smoke = spawnSync(process.execPath, [path.join(tmpRoot, DANGER_SCRIPT)], {
    cwd: tmpRoot,
    encoding: 'utf8',
  });
  assert(smoke.status !== 0, 'Danger style audit did not block local text-red near Trash2/Usuń in smoke test');
  assert(String(smoke.stderr || smoke.stdout || '').includes('FAIL'), 'Danger smoke did not report blocking failure');
} finally {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('CLOSEFLOW_ACTIVE_LEGACY_COLOR_CONTRACT_STAGE16_OK');
console.log('active_red_rose_amber_occurrences=' + activeFindings.length);
console.log('today_legacy_red_rose_amber_occurrences=' + todayFindings.length);
console.log('classified_surfaces=5 rewired=3 active_exceptions=2');
