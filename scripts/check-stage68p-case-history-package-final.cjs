const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const casePath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const releaseDocPath = path.join(repoRoot, 'docs', 'release', 'STAGE68P_CASE_HISTORY_PACKAGE_FINAL_2026-05-05.md');

function fail(message) {
  console.error(`FAIL STAGE68P_CASE_HISTORY_PACKAGE_FINAL: ${message}`);
  process.exit(1);
}
function pass(message) { console.log(`PASS ${message}`); }
function read(file) { return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); }
function extractGetActivityText(source) {
  const start = source.indexOf('function getActivityText(activity: CaseActivity) {');
  if (start < 0) fail('missing getActivityText');
  const end = source.indexOf('function sortCaseItems', start);
  if (end < 0) fail('missing sortCaseItems boundary');
  return source.slice(start, end);
}

if (!fs.existsSync(casePath)) fail('missing src/pages/CaseDetail.tsx');
if (!fs.existsSync(packagePath)) fail('missing package.json');
if (!fs.existsSync(releaseDocPath)) fail('missing Stage68P release doc');

const source = read(casePath);
const block = extractGetActivityText(source);
const packageBytes = fs.readFileSync(packagePath);
if (packageBytes[0] === 0xef && packageBytes[1] === 0xbb && packageBytes[2] === 0xbf) fail('package.json has BOM');
const packageRaw = packageBytes.toString('utf8');
if (packageRaw.includes('\\u0026')) fail('package.json contains escaped ampersands');
const pkg = JSON.parse(packageRaw.replace(/^\uFEFF/, ''));

const expected = [
  "if (activity.eventType === 'item_added') return `Dodano brak: ${title}`;",
  "if (activity.eventType === 'status_changed') return `Zmieniono status „${title}” na: ${getItemStatusLabel(activity.payload?.status)}`;",
  "if (activity.eventType === 'file_uploaded') return `Dodano plik: ${title}`;",
  "if (activity.eventType === 'decision_made') return `Dodano decyzję: ${title}`;",
  "if (activity.eventType === 'operator_note') return 'Dodano notatkę';",
  "if (activity.eventType === 'task_added') return `Dodano zadanie: ${title}`;",
  "if (activity.eventType === 'event_added') return `Dodano wydarzenie: ${title}`;",
  "if (activity.eventType === 'task_status_changed') return `Zmieniono status zadania „${title}” na: ${getTaskStatusLabel(activity.payload?.status)}`;",
  "if (activity.eventType === 'event_status_changed') return `Zmieniono status wydarzenia „${title}” na: ${getEventStatusLabel(activity.payload?.status)}`;",
  "if (activity.eventType === 'task_rescheduled') return `Przełożono zadanie „${title}” na: ${formatDateTime(activity.payload?.scheduledAt)}`;",
  "if (activity.eventType === 'event_rescheduled') return `Przełożono wydarzenie „${title}” na: ${formatDateTime(activity.payload?.startAt)}`;",
  "if (activity.eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';",
  "if (activity.eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';",
  "if (activity.eventType === 'case_lifecycle_reopened') return 'Przywrócono sprawę do pracy';",
  "return 'Dodano ruch w sprawie';",
];
for (const fragment of expected) {
  if (!block.includes(fragment)) fail(`getActivityText missing expected copy: ${fragment}`);
  pass(`getActivityText contains: ${fragment}`);
}
for (const marker of ['â', 'Ä', 'Ĺ', 'Ă', 'ď', '�', '${actor}', 'Ty dodał', 'Ty podjął']) {
  if (block.includes(marker)) fail(`getActivityText still contains forbidden marker: ${marker}`);
}
pass('getActivityText has no known mojibake or actor grammar markers');

const requiredSourceFragments = [
  'STAGE68P_CASE_HISTORY_PACKAGE_FINAL',
  'STAGE66_CASE_HISTORY_PASSIVE_COPY',
  "activity.actorType === 'operator' ? 'Operator' : 'Klient'",
  'getCaseRecentMoveMeta(activity)',
];
for (const fragment of requiredSourceFragments) {
  if (!source.includes(fragment)) fail(`CaseDetail.tsx missing required contract fragment: ${fragment}`);
  pass(`CaseDetail.tsx contains contract fragment: ${fragment}`);
}

const scripts = pkg.scripts || {};
if (scripts['check:stage68p-case-history-package-final'] !== 'node scripts/check-stage68p-case-history-package-final.cjs') fail('missing Stage68P check script');
if (scripts['test:stage68p-case-history-package-final'] !== 'node --test tests/stage68p-case-history-package-final.test.cjs') fail('missing Stage68P test script');
const verify = scripts['verify:case-operational-ui'] || '';
const matches = verify.match(/check:stage68[a-z0-9-]*/gi) || [];
if (matches.length !== 1 || matches[0] !== 'check:stage68p-case-history-package-final') fail(`verify:case-operational-ui has wrong Stage68 guards: ${matches.join(', ')}`);
pass('verify:case-operational-ui contains only final Stage68P guard');

const scriptDir = path.join(repoRoot, 'scripts');
const testDir = path.join(repoRoot, 'tests');
const releaseDir = path.join(repoRoot, 'docs', 'release');
for (const [dir, regex] of [[scriptDir, /^check-stage68(?!p-).*\.cjs$/i], [testDir, /^stage68(?!p-).*\.test\.cjs$/i], [releaseDir, /^STAGE68(?!P_).*\.md$/i]]) {
  if (!fs.existsSync(dir)) continue;
  const bad = fs.readdirSync(dir).filter((name) => regex.test(name));
  if (bad.length) fail(`failed Stage68 artifact files remain in ${dir}: ${bad.join(', ')}`);
}
pass('no failed Stage68 artifact files remain');

console.log('PASS STAGE68P_CASE_HISTORY_PACKAGE_FINAL');
