const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('CLOSEFLOW_ACTIVITY_ROADMAP_LABELS_CHECK_FAIL:', msg); process.exit(1); }
const lib = read('src/lib/activity-roadmap.ts');
const component = read('src/components/ActivityRoadmap.tsx');
const pkg = JSON.parse(read('package.json'));
if (!lib.includes('export function formatRoadmapActivityTitle')) fail('missing formatRoadmapActivityTitle export');
for (const phrase of ['Dodano wpłatę', 'Usunięto wpłatę', 'Zmieniono wpłatę', 'Wykonano zadanie', 'Zakończono wydarzenie', 'Zaktualizowano sprawę']) {
  if (!lib.includes(phrase)) fail('missing label phrase: ' + phrase);
}
if (!component.includes('formatRoadmapActivityTitle(item)')) fail('ActivityRoadmap must render formatter output');
if (component.includes('<strong>{item.title}</strong>')) fail('ActivityRoadmap still renders raw item.title');
if (lib.includes('Dodano ruch w sprawie') || component.includes('Dodano ruch w sprawie')) fail('dead useless label remains in roadmap UI');
if (pkg.scripts?.['check:closeflow-activity-roadmap-labels'] !== 'node scripts/check-closeflow-activity-roadmap-labels.cjs') fail('missing package script');
console.log('CLOSEFLOW_ACTIVITY_ROADMAP_LABELS_CHECK_OK');
