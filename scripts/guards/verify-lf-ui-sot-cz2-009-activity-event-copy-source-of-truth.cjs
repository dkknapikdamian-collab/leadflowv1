const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const stage = 'LF-UI-SOT-CZ2-009';
const canonical = 'src/lib/source-of-truth/activity-options.ts';
const activityPath = 'src/pages/Activity.tsx';
const guardPath = 'scripts/guards/verify-lf-ui-sot-cz2-009-activity-event-copy-source-of-truth.cjs';
const testPath = 'tests/lf-ui-sot-cz2-009-activity-event-copy-source-of-truth.test.cjs';

const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function addError(message) {
  errors.push(message);
}

function runGit(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

function getChangedFiles() {
  const status = runGit(['status', '--short']);
  return status
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const raw = line.slice(3).trim();
      const normalized = raw.includes(' -> ') ? raw.split(' -> ').pop() : raw;
      return normalized.replace(/^"|"$/g, '').replace(/\\/g, '/');
    });
}

function hasMojibake(text) {
  return /[\u00c5\u00c4\u0139\ufffd]/.test(text);
}

if (!exists(canonical)) addError(`missing canonical SOT: ${canonical}`);
if (!exists(activityPath)) addError(`missing activity page: ${activityPath}`);
if (!exists(guardPath)) addError(`missing guard: ${guardPath}`);
if (!exists(testPath)) addError(`missing test: ${testPath}`);

const activity = exists(activityPath) ? read(activityPath) : '';
const source = exists(canonical) ? read(canonical) : '';
const routes = exists('src/lib/routes.ts') ? read('src/lib/routes.ts') : '';
const app = exists('src/App.tsx') ? read('src/App.tsx') : '';
const pkg = exists('package.json') ? read('package.json') : '';

if (!activity.includes("from '../lib/source-of-truth/activity-options'")) {
  addError('Activity.tsx does not import activity-options.ts');
}

const forbiddenLocalPatterns = [
  ['sourceOptions', /const\s+sourceOptions\s*=/],
  ['activityTypeOptions', /const\s+activityTypeOptions\s*=/],
  ['relationOptions', /const\s+relationOptions\s*=/],
  ['activityFilters', /const\s+activityFilters\s*=/],
  ['normalizeText', /function\s+normalizeText\s*\(/],
  ['normalizeLower', /function\s+normalizeLower\s*\(/],
  ['parseActivityDate', /function\s+parseActivityDate\s*\(/],
  ['formatActivityTime', /function\s+formatActivityTime\s*\(/],
  ['getActorLabel', /function\s+getActorLabel\s*\(/],
  ['getActivityEntity', /function\s+getActivityEntity\s*\(/],
  ['getActivityPillLabel', /function\s+getActivityPillLabel\s*\(/],
  ['getActivityIconTone', /function\s+getActivityIconTone\s*\(/],
  ['getActivityTitle', /function\s+getActivityTitle\s*\(/],
  ['getActivityMeta', /function\s+getActivityMeta\s*\(/],
  ['getActivityRelation', /function\s+getActivityRelation\s*\(/],
  ['getActivitySearchText', /function\s+getActivitySearchText\s*\(/],
  ['getActivitySource', /function\s+getActivitySource\s*\(/],
  ['getActivityType', /function\s+getActivityType\s*\(/],
  ['getActivityRelationKind', /function\s+getActivityRelationKind\s*\(/],
  ['requiresAttention', /function\s+requiresAttention\s*\(/],
  ['getActivitySeverity', /function\s+getActivitySeverity\s*\(/],
  ['shouldShowByFilter', /function\s+shouldShowByFilter\s*\(/],
];

for (const [name, pattern] of forbiddenLocalPatterns) {
  if (pattern.test(activity)) addError(`Activity.tsx still defines local SOT helper/option: ${name}`);
}

const requiredExports = [
  'ActivityEntityValue',
  'ActivitySourceFilterValue',
  'ActivityTypeFilterValue',
  'ActivityRelationFilterValue',
  'ACTIVITY_SOURCE_OPTIONS',
  'ACTIVITY_TYPE_OPTIONS',
  'ACTIVITY_RELATION_OPTIONS',
  'ACTIVITY_FILTER_OPTIONS',
  'normalizeActivityText',
  'normalizeActivityLower',
  'parseActivityDate',
  'formatActivityTime',
  'getActivityActorLabel',
  'getActivityEntity',
  'getActivityPillLabel',
  'getActivityIconTone',
  'getActivityTitle',
  'getActivityMetaText',
  'getActivitySource',
  'getActivityType',
  'getActivityRelationKind',
  'requiresActivityAttention',
  'getActivitySeverity',
  'shouldShowActivityByFilter',
];

for (const symbol of requiredExports) {
  if (!source.includes(symbol)) addError(`activity-options.ts missing export/symbol: ${symbol}`);
}

for (const token of ['fetchActivitiesFromSupabase', 'fetchLeadsFromSupabase', 'fetchCasesFromSupabase']) {
  if (!activity.includes(token)) addError(`Activity.tsx lost fetch dependency: ${token}`);
}

if (!routes.includes("activity: '/activity'") || !routes.includes("screen: 'Activity'") || !routes.includes("status: 'canonical'")) {
  addError('/activity route is not canonical in routes.ts');
}
if (!app.includes('const Activity = lazyPage') || !app.includes('CLOSEFLOW_ROUTES.activity')) {
  addError('/activity is not active in App.tsx');
}

if (!pkg.includes('verify:lf-ui-sot-cz2-009-activity-event-copy-source-of-truth')) {
  addError('package.json missing CZ2-009 verify script');
}

const changedFiles = getChangedFiles();
const allowedChanged = new Set([
  'package.json',
  activityPath,
  canonical,
  guardPath,
  testPath,
]);
const forbiddenTouched = changedFiles.filter((file) => {
  if (allowedChanged.has(file)) return false;
  if (file.startsWith('.tmp')) return false;
  return (
    file.startsWith('src/styles/') ||
    file.startsWith('supabase/') ||
    file.startsWith('migrations/') ||
    file.endsWith('.sql') ||
    file === 'src/App.tsx' ||
    file === 'src/lib/routes.ts' ||
    file === 'src/lib/supabase-fallback.ts' ||
    file === 'src/pages/LeadDetail.tsx' ||
    file === 'src/pages/CaseDetail.tsx' ||
    file === 'src/pages/TodayStable.tsx' ||
    file === 'src/pages/Calendar.tsx' ||
    file === 'src/pages/TasksStable.tsx' ||
    file === 'src/pages/Billing.tsx' ||
    file === 'src/pages/Templates.tsx' ||
    file === 'src/pages/Clients.tsx' ||
    file === 'src/lib/source-of-truth/template-options.ts' ||
    file === 'src/lib/source-of-truth/client-options.ts' ||
    file.includes('billing') ||
    file.includes('Billing')
  );
});

if (forbiddenTouched.length) {
  addError(`forbidden files touched: ${forbiddenTouched.join(', ')}`);
}

for (const file of [canonical, activityPath, guardPath, testPath]) {
  if (exists(file) && hasMojibake(read(file))) addError(`mojibake detected in ${file}`);
}

const result = {
  ok: errors.length === 0,
  stage,
  decision: 'ACTIVITY_ACTIVE_AND_CANONICAL / ACTIVITY_OPTIONS_SOT_REQUIRED',
  canonical,
  checked: [
    'src/App.tsx',
    'src/lib/routes.ts',
    activityPath,
    canonical,
    'package.json',
    guardPath,
    testPath,
  ],
  changedFiles,
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
