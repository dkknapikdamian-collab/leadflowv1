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
  if (source.includes(needle)) throw new Error(`Zakazany fragment po 14C Repair1: ${label} (${needle})`);
}
function countIn(source, needle) {
  return String(source || '').split(needle).length - 1;
}
function getHeaderBlock(source) {
  const start = source.indexOf('<header');
  const end = start >= 0 ? source.indexOf('</header>', start) : -1;
  return start >= 0 && end >= 0 ? source.slice(start, end + '</header>'.length) : '';
}
function getRightRailBlock(source) {
  const idx = source.indexOf('case-detail-right-rail');
  if (idx < 0) return '';
  const start = Math.max(source.lastIndexOf('<aside', idx), source.lastIndexOf('<div', idx), source.lastIndexOf('<section', idx));
  if (start < 0) return '';
  const endCandidates = ['</aside>', '</div>', '</section>']
    .map((tag) => source.indexOf(tag, idx))
    .filter((item) => item >= 0)
    .sort((a, b) => a - b);
  const end = endCandidates[0];
  return end >= 0 ? source.slice(start, end + 10) : '';
}

const source = read(casePath);
const header = getHeaderBlock(source);
const rightRail = getRightRailBlock(source);

assertIncludes(source, 'STAGE14C_CASE_DETAIL_CLEANUP_REPAIR1', 'guard Stage14C Repair1 w CaseDetail');
assertIncludes(source, '<h1', 'glowny tytul sprawy zostaje');
assertIncludes(source, 'CaseSettlementPanel', 'rozliczenia/historia wplat zostaja');
assertIncludes(source, 'fetchTasksFromSupabase', 'zadania zostaja');
assertIncludes(source, 'fetchEventsFromSupabase', 'wydarzenia zostaja');
assertIncludes(source, 'createClientPortalTokenInSupabase', 'mechanika portalu/API zostaje w pliku');

assertNotIncludes(source, "import { ActivityRoadmap } from '../components/ActivityRoadmap';", 'import ActivityRoadmap');
assertNotIncludes(source, "import { buildCaseActivityRoadmap } from '../lib/activity-roadmap';", 'import buildCaseActivityRoadmap');
assertNotIncludes(source, '<ActivityRoadmap', 'render ActivityRoadmap');
assertNotIncludes(source, 'buildCaseActivityRoadmap(', 'budowanie roadmapy w CaseDetail');
assertNotIncludes(source, 'Roadmapa sprawy', 'tytul roadmapy');
assertNotIncludes(source, 'case-detail-roadmap-panel', 'panel roadmapy');
assertNotIncludes(source, 'cf-activity-roadmap', 'roadmap class');
assertNotIncludes(source, 'Sprawy /', 'powtarzany breadcrumb z nazwa sprawy');

if (!header) throw new Error('Nie znaleziono headera CaseDetail do kontroli duplikacji.');
if (countIn(header, 'getCaseTitle(caseData)') > 1) {
  throw new Error('Header nadal powtarza getCaseTitle(caseData) wi\u0119cej ni\u017C raz.');
}
if (countIn(header, 'getCaseStatusLabel(caseData?.status)') + countIn(header, 'getCaseStatusLabel(caseData.status)') > 1) {
  throw new Error('Header nadal powtarza status sprawy wi\u0119cej ni\u017C raz.');
}

if (rightRail) {
  for (const forbidden of ['Portal i \u017Ar\u00F3d\u0142a', 'Portal i zrodla', 'Portal klienta', 'Kopiuj portal', 'Powi\u0105zany lead', 'Powiazany lead', 'case-detail-roadmap-helper', 'case-detail-purple-panel']) {
    if (rightRail.includes(forbidden)) {
      throw new Error(`Prawy rail nadal zawiera zb\u0119dny panel/tekst: ${forbidden}`);
    }
  }
}

console.log('\u2714 Stage14C Repair1 actual CaseDetail cleanup guard passed');
