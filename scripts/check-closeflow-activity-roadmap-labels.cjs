const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error('CLOSEFLOW_ACTIVITY_ROADMAP_LABELS_CHECK_FAILED:', message);
  process.exit(1);
};

const lib = read('src/lib/activity-roadmap.ts');
const component = read('src/components/ActivityRoadmap.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const pkg = JSON.parse(read('package.json'));

if (!lib.includes('export function formatRoadmapActivityTitle(item: ActivityRoadmapItem): string')) {
  fail('missing exported formatRoadmapActivityTitle(item: ActivityRoadmapItem): string');
}

const expectedLabels = [
  'Dodano notatkę',
  'Dodano zadanie:',
  'Wykonano zadanie:',
  'Dodano wydarzenie:',
  'Zakończono wydarzenie:',
  'Dodano wpłatę',
  'Usunięto wpłatę',
  'Zmieniono wpłatę',
  'Utworzono sprawę',
  'Zmieniono sprawę',
  'Usunięto sprawę',
  'Dodano brak:',
  'Uzupełniono brak:',
  'Zmieniono status:',
  'Zaktualizowano sprawę',
];
for (const label of expectedLabels) {
  if (!lib.includes(label)) fail(`formatter missing label: ${label}`);
}

if (!component.includes('formatRoadmapActivityTitle')) fail('ActivityRoadmap component does not import/use formatter');
if (!component.includes('const roadmapTitle = formatRoadmapActivityTitle(item);')) fail('ActivityRoadmap row does not derive rendered title through formatter');
if (component.includes('<strong>{item.title}</strong>')) fail('ActivityRoadmap still renders raw item.title');

const forbidden = 'Dodano ruch w sprawie';
const uiFiles = [
  ['src/components/ActivityRoadmap.tsx', component],
  ['src/pages/CaseDetail.tsx', caseDetail],
  ['src/lib/activity-roadmap.ts', lib],
];
for (const [file, content] of uiFiles) {
  if (content.includes(forbidden)) fail(`${file} still contains forbidden UI fallback: ${forbidden}`);
}

const scriptValue = pkg.scripts?.['check:closeflow-activity-roadmap-labels'];
if (scriptValue !== 'node scripts/check-closeflow-activity-roadmap-labels.cjs') {
  fail('package.json missing check:closeflow-activity-roadmap-labels script');
}

if (!fs.existsSync(path.join(root, 'docs/bugs/CLOSEFLOW_ACTIVITY_ROADMAP_LABELS_REPAIR_2026-05-10.md'))) {
  fail('missing repair document docs/bugs/CLOSEFLOW_ACTIVITY_ROADMAP_LABELS_REPAIR_2026-05-10.md');
}

console.log('CLOSEFLOW_ACTIVITY_ROADMAP_LABELS_CHECK_OK');
