const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`Brak: ${label} (${needle})`);
}
function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) throw new Error(`Zakazany fragment po 14C: ${label} (${needle})`);
}
function countIn(value, needle) {
  return value.split(needle).length - 1;
}
function getHeaderBlock(source) {
  const start = source.indexOf('<header');
  if (start < 0) return '';
  const end = source.indexOf('</header>', start);
  if (end < 0) return '';
  return source.slice(start, end + '</header>'.length);
}

const source = read(casePath);
const header = getHeaderBlock(source);

assertIncludes(source, 'STAGE14C_CASE_DETAIL_CLEANUP', 'guard Stage14C w CaseDetail');
assertNotIncludes(source, "import { ActivityRoadmap } from '../components/ActivityRoadmap';", 'import ActivityRoadmap nie powinien zostac w CaseDetail');
assertNotIncludes(source, "import { buildCaseActivityRoadmap } from '../lib/activity-roadmap';", 'import buildCaseActivityRoadmap nie powinien zostac w CaseDetail');
assertNotIncludes(source, '<ActivityRoadmap', 'render ActivityRoadmap');
assertNotIncludes(source, 'buildCaseActivityRoadmap(', 'budowanie roadmapy w CaseDetail');
assertNotIncludes(source, 'Roadmapa sprawy', 'tytul roadmapy');
assertNotIncludes(source, 'case-detail-roadmap-panel', 'panel roadmapy');
assertNotIncludes(source, 'cf-activity-roadmap', 'roadmap class');
assertNotIncludes(source, 'Portal i \u017Ar\u00F3d\u0142a', 'panel Portal i \u017Ar\u00F3d\u0142a');
assertNotIncludes(source, 'Kopiuj portal', 'przycisk kopiowania portalu w usunietym panelu');
assertNotIncludes(source, 'Sprawy /', 'powtarzany breadcrumb z nazwa sprawy');

if (!header) throw new Error('Nie znaleziono headera CaseDetail do kontroli duplikacji.');
if (countIn(header, 'getCaseTitle(caseData)') > 1) {
  throw new Error('Header nadal powtarza getCaseTitle(caseData) wi\u0119cej ni\u017C raz.');
}
if (countIn(header, 'getCaseStatusLabel(caseData?.status)') + countIn(header, 'getCaseStatusLabel(caseData.status)') > 1) {
  throw new Error('Header nadal powtarza status sprawy wi\u0119cej ni\u017C raz.');
}

assertIncludes(source, '<h1', 'glowny tytul sprawy zostaje');
assertIncludes(source, 'CaseSettlementPanel', 'historia/rozliczenia finansowe nie zostaly usuniete');
assertIncludes(source, 'fetchTasksFromSupabase', 'zadania nie zostaly usuniete');
assertIncludes(source, 'fetchEventsFromSupabase', 'wydarzenia nie zostaly usuniete');

console.log('\u2714 Stage14C CaseDetail cleanup guard passed');
