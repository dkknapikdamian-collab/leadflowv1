const fs = require('fs');
const path = require('path');

const root = process.cwd();
const LEGACY_MARKER = 'LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15';
const STAGE14_MARKER = 'TODAY_STABLE_STAGE14_REMAINING_SEVERITY';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) {
    console.error('[closeflow-legacy-today-route-contract] FAIL: ' + message);
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

function routeUsesTodayStable(app) {
  return app.includes("const Today = lazy(() => import('./pages/TodayStable'))")
    && app.includes('<Route path="/" element={isLoggedIn ? <Today />')
    && app.includes('<Route path="/today" element={isLoggedIn ? <Today />')
    && !app.includes("import('./pages/Today')")
    && !app.includes('from \'./pages/Today\'')
    && !app.includes('from "./pages/Today"');
}

function sectionHeaderIconIsSafe(stable) {
  const start = stable.indexOf('function SectionHeaderIcon');
  const end = stable.indexOf('function SectionHeader', start + 1);
  assert(start >= 0 && end > start, 'Cannot isolate SectionHeaderIcon in TodayStable');
  const body = stable.slice(start, end);
  return !body.includes('<SectionHeaderIcon') && !body.replace(/function SectionHeaderIcon/, '').includes('SectionHeaderIcon(');
}

const required = [
  'src/App.tsx',
  'src/pages/Today.tsx',
  'src/pages/TodayStable.tsx',
  'scripts/check-closeflow-danger-style-contract.cjs',
  'docs/ui/CLOSEFLOW_LEGACY_TODAY_ROUTE_STAGE15_2026-05-08.md',
  'docs/ui/CLOSEFLOW_TODAY_STABLE_REMAINING_SEVERITY_STAGE14_2026-05-08.md',
];

for (const rel of required) assert(exists(rel), 'Missing required file: ' + rel);

const app = read('src/App.tsx');
const today = read('src/pages/Today.tsx');
const stable = read('src/pages/TodayStable.tsx');
const danger = read('scripts/check-closeflow-danger-style-contract.cjs');
const doc = read('docs/ui/CLOSEFLOW_LEGACY_TODAY_ROUTE_STAGE15_2026-05-08.md');
const pkg = read('package.json');

assert(routeUsesTodayStable(app), 'Active / and /today route must point to TodayStable via App.tsx lazy alias');
assert(stable.includes(STAGE14_MARKER), 'TodayStable is missing Stage14 marker');
assert(sectionHeaderIconIsSafe(stable), 'SectionHeaderIcon recursion detected');
assert(today.includes(LEGACY_MARKER), 'Today.tsx is not marked as legacy inactive');
assert(doc.includes(LEGACY_MARKER), 'Stage15 document does not record Today.tsx legacy marker');
assert(doc.includes('Aktywny route Dzi\u015B'), 'Stage15 document missing active route section');
assert(doc.includes('legacy inactive'), 'Stage15 document missing legacy inactive decision');
assert(danger.includes('legacy inactive Today.tsx exception'), 'Danger audit does not separate legacy Today.tsx exception');
assert(danger.includes('blockingFindings.length'), 'Danger audit blocking logic appears weakened');
assert(danger.includes('localDangerGlobalPattern'), 'Danger audit local danger scan appears weakened');
assert(JSON.parse(pkg).scripts['check:closeflow-legacy-today-route-contract'] === 'node scripts/check-closeflow-legacy-today-route-contract.cjs', 'package.json missing Stage15 command');

for (const rel of ['scripts/check-closeflow-legacy-today-route-contract.cjs', 'docs/ui/CLOSEFLOW_LEGACY_TODAY_ROUTE_STAGE15_2026-05-08.md']) {
  const text = read(rel);
  assertNoControlChars(rel, text);
  assertNoMojibake(rel, text);
}

console.log('CLOSEFLOW_LEGACY_TODAY_ROUTE_CONTRACT_STAGE15_OK: active=TodayStable legacyToday=inactive dangerAudit=legacy-exception');
