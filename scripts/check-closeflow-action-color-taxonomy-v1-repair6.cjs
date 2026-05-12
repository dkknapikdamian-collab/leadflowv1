#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
function p(...parts){ return path.join(ROOT, ...parts); }
function stripBom(s){ return s && s.charCodeAt(0) === 0xfeff ? s.slice(1) : s; }
function read(rel){ return stripBom(fs.readFileSync(p(rel), 'utf8')); }
function exists(rel){ return fs.existsSync(p(rel)); }
function assert(condition, message){ if(!condition) throw new Error(message); }

const packageRaw = fs.readFileSync(p('package.json'), 'utf8');
assert(packageRaw.charCodeAt(0) !== 0xfeff, 'package.json still has BOM after Repair6');
const pkg = JSON.parse(packageRaw);
assert(pkg.scripts['check:closeflow:action-colors:v1'] === 'node scripts/check-closeflow-action-color-taxonomy-v1.cjs', 'base action color check script mismatch');
assert(pkg.scripts['check:closeflow:action-colors:v1:repair6'] === 'node scripts/check-closeflow-action-color-taxonomy-v1-repair6.cjs', 'repair6 action color check script mismatch');

const repairDoc = 'docs/release/CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_2026-05-12.md';
assert(exists(repairDoc), 'Repair6 doc missing');
assert(read(repairDoc).includes('BOM-safe'), 'Repair6 doc must mention BOM-safe package handling');

const tool = 'tools/repair-closeflow-action-color-taxonomy-v1-repair6-2026-05-12.cjs';
assert(exists(tool), 'Repair6 tool missing');
assert(read(tool).includes('stripBom'), 'Repair6 tool must strip BOM before JSON.parse');

const lib = read('src/lib/action-visual-taxonomy.ts');
assert(lib.includes('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_BOM_SAFE'), 'Repair6 taxonomy marker missing');
assert(lib.includes("return 'cf-action-kind-' + normalizeCloseFlowActionVisualKind(kind);"), 'taxonomy class helper must avoid nested template literal generator bug');

const css = read('src/styles/action-color-taxonomy-v1.css');
const requiredSelectors = ['task','event','note','followup','deadline','meeting','call','email','payment','system','default'];
for (const kind of requiredSelectors) {
  assert(css.includes('.cf-action-kind-' + kind), 'CSS missing class selector for ' + kind);
}

const coverage = [
  ['src/pages/Calendar.tsx', 'calendarActionVisualKind'],
  ['src/pages/TasksStable.tsx', 'tasksActionVisualKind'],
  ['src/pages/TodayStable.tsx', 'todayActionVisualKind'],
  ['src/pages/Activity.tsx', 'activityActionVisualKind'],
  ['src/pages/ClientDetail.tsx', 'clientDetailActionVisualKind'],
  ['src/pages/LeadDetail.tsx', 'leadDetailActionVisualKind'],
  ['src/pages/CaseDetail.tsx', 'caseDetailActionVisualKind'],
].map(([file, marker]) => {
  if (!exists(file)) return { file, exists: false, marker, ok: true };
  const src = read(file);
  const ok = src.includes('action-visual-taxonomy') && src.includes(marker);
  assert(ok, file + ' missing visual taxonomy helper marker ' + marker);
  return { file, exists: true, marker, ok };
});

console.log('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_CHECK_OK');
console.log(JSON.stringify({
  bomSafePackageJson: true,
  nestedTemplateLiteralBugAvoided: true,
  baseCheck: 'scripts/check-closeflow-action-color-taxonomy-v1.cjs',
  repairCheck: 'scripts/check-closeflow-action-color-taxonomy-v1-repair6.cjs',
  coverage,
  mode: 'action_color_taxonomy_v1_repair6',
}, null, 2));
