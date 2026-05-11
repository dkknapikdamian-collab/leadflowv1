const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

function fail(message) {
  console.error('CLOSEFLOW_CASE_ROADMAP_SOURCE_OF_TRUTH_CHECK_FAILED');
  console.error(message);
  process.exit(1);
}

const requiredFiles = [
  'src/lib/activity-roadmap.ts',
  'src/components/ActivityRoadmap.tsx',
  'src/pages/CaseDetail.tsx',
  'docs/bugs/CLOSEFLOW_CASE_ROADMAP_SOT_REPAIR_2026-05-10.md',
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`Missing required file: ${file}`);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const roadmapLib = read('src/lib/activity-roadmap.ts');
const roadmapComponent = read('src/components/ActivityRoadmap.tsx');
const pkg = JSON.parse(read('package.json'));

if (!caseDetail.includes('ActivityRoadmap')) fail('CaseDetail.tsx must use ActivityRoadmap.');
if (!caseDetail.includes('buildCaseActivityRoadmap')) fail('CaseDetail.tsx must use buildCaseActivityRoadmap.');
if (caseDetail.includes("'Dodano ruch w sprawie'") || caseDetail.includes('"Dodano ruch w sprawie"')) {
  fail('CaseDetail.tsx still contains hardcoded fallback: Dodano ruch w sprawie.');
}
if (!caseDetail.includes('Roadmapa sprawy')) fail('CaseDetail.tsx must expose Roadmapa sprawy copy.');
if (!roadmapLib.includes("export type ActivityRoadmapEntityType = 'lead' | 'client' | 'case'")) {
  fail('activity-roadmap.ts must export ActivityRoadmapEntityType contract.');
}
if (!roadmapLib.includes('export type ActivityRoadmapItemKind')) fail('activity-roadmap.ts must export ActivityRoadmapItemKind.');
if (!roadmapLib.includes('export type ActivityRoadmapItem')) fail('activity-roadmap.ts must export ActivityRoadmapItem.');
if (!roadmapLib.includes('export function buildCaseActivityRoadmap')) fail('activity-roadmap.ts must export buildCaseActivityRoadmap.');
if (!roadmapLib.includes('sourceTable') || !roadmapLib.includes('sourceId') || !roadmapLib.includes('kind')) {
  fail('activity-roadmap.ts must keep dedupe fields sourceTable/sourceId/kind.');
}
if (!roadmapLib.includes('caseId') || !roadmapLib.includes('belongsToExactCase')) {
  fail('Case roadmap must be scoped by exact caseId, not global client relation.');
}
if (!roadmapComponent.includes('data-closeflow-activity-roadmap')) {
  fail('ActivityRoadmap component must expose data-closeflow-activity-roadmap marker.');
}
if (!pkg.scripts || pkg.scripts['check:closeflow-case-roadmap-sot'] !== 'node scripts/check-closeflow-case-roadmap-source-of-truth.cjs') {
  fail('package.json must include check:closeflow-case-roadmap-sot script.');
}

console.log('CLOSEFLOW_CASE_ROADMAP_SOURCE_OF_TRUTH_CHECK_OK');
