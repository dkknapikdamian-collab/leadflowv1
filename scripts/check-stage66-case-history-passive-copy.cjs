const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const caseDetailPath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const releaseDocPath = path.join(repoRoot, 'docs', 'release', 'STAGE66_CASE_HISTORY_PASSIVE_COPY_2026-05-04.md');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function fail(message) {
  console.error(`FAIL STAGE66_CASE_HISTORY_PASSIVE_COPY: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

if (!fs.existsSync(caseDetailPath)) fail('missing src/pages/CaseDetail.tsx');
if (!fs.existsSync(packagePath)) fail('missing package.json');
if (!fs.existsSync(releaseDocPath)) fail('missing Stage66 release doc');

const source = read(caseDetailPath);
const pkgRaw = read(packagePath);
let pkg;
try {
  pkg = JSON.parse(pkgRaw);
} catch (error) {
  fail(`package.json is not valid JSON: ${error.message}`);
}

const requiredFragments = [
  'STAGE66_CASE_HISTORY_PASSIVE_COPY',
  "if (activity.eventType === 'item_added') return `Dodano brak: ${title}`;",
  "if (activity.eventType === 'status_changed') return `Zmieniono status \u201E${title}\u201D na: ${getItemStatusLabel(activity.payload?.status)}`;",
  "if (activity.eventType === 'file_uploaded') return `Dodano plik: ${title}`;",
  "if (activity.eventType === 'decision_made') return `Dodano decyzj\u0119: ${title}`;",
  "if (activity.eventType === 'operator_note') return 'Dodano notatk\u0119';",
  "if (activity.eventType === 'task_added') return `Dodano zadanie: ${title}`;",
  "if (activity.eventType === 'event_added') return `Dodano wydarzenie: ${title}`;",
  "if (activity.eventType === 'task_status_changed') return `Zmieniono status zadania \u201E${title}\u201D na: ${getTaskStatusLabel(activity.payload?.status)}`;",
  "if (activity.eventType === 'event_status_changed') return `Zmieniono status wydarzenia \u201E${title}\u201D na: ${getEventStatusLabel(activity.payload?.status)}`;",
  "if (activity.eventType === 'task_rescheduled') return `Prze\u0142o\u017Cono zadanie \u201E${title}\u201D na: ${formatDateTime(activity.payload?.scheduledAt)}`;",
  "if (activity.eventType === 'event_rescheduled') return `Prze\u0142o\u017Cono wydarzenie \u201E${title}\u201D na: ${formatDateTime(activity.payload?.startAt)}`;",
  "return 'Dodano ruch w sprawie';",
];

for (const fragment of requiredFragments) {
  if (!source.includes(fragment)) fail(`CaseDetail.tsx does not contain: ${fragment}`);
  pass(`CaseDetail.tsx contains: ${fragment}`);
}

const forbiddenFragments = [
  "const actor = activity.actorType === 'operator' ? 'Ty' : 'Klient';",
  "${actor} doda\u0142",
  "${actor} zmieni\u0142",
  "${actor} wgra\u0142",
  "${actor} podj\u0105\u0142",
  "${actor} prze\u0142o\u017Cy\u0142",
  "${actor} wykona\u0142",
  'Ty doda\u0142',
  'Ty podj\u0105\u0142',
  'Ty zmieni\u0142',
];

for (const fragment of forbiddenFragments) {
  if (source.includes(fragment)) fail(`CaseDetail.tsx still contains robotic history copy: ${fragment}`);
  pass(`CaseDetail.tsx does not contain robotic history copy: ${fragment}`);
}

const scripts = pkg.scripts || {};
if (!scripts['check:stage66-case-history-passive-copy']) fail('missing package script check:stage66-case-history-passive-copy');
if (!scripts['test:stage66-case-history-passive-copy']) fail('missing package script test:stage66-case-history-passive-copy');
pass('package.json contains Stage66 scripts');

if (/^\uFEFF/.test(fs.readFileSync(packagePath, 'utf8'))) fail('package.json still starts with BOM');
pass('package.json has no BOM');

console.log('PASS STAGE66_CASE_HISTORY_PASSIVE_COPY');
