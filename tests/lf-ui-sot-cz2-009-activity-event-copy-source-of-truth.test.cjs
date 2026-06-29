const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const root = process.cwd();
const sourcePath = path.join(root, 'src/lib/source-of-truth/activity-options.ts');
const activityPath = path.join(root, 'src/pages/Activity.tsx');
const routesPath = path.join(root, 'src/lib/routes.ts');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function noMojibake(text) {
  return !/[\u00c5\u00c4\u0139\ufffd]/.test(text);
}

test('CZ2-009 activity-options exports canonical activity metadata and helpers', () => {
  const source = read(sourcePath);
  for (const symbol of [
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
  ]) {
    assert.match(source, new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('CZ2-009 filter option labels are preserved', () => {
  const source = read(sourcePath);
  for (const text of [
    "{ value: 'all', label: 'Wszystko' }",
    "{ value: 'today', label: 'Dziś' }",
    "{ value: 'calendar', label: 'Kalendarz' }",
    "{ value: 'completed', label: 'Wykonane' }",
    "{ value: 'restored', label: 'Przywrócone' }",
    "{ value: 'deleted', label: 'Usunięte' }",
    "{ value: 'lead', label: 'Z leadem' }",
    "{ value: 'case', label: 'Ze sprawą' }",
    "{ value: 'system', label: 'Systemowe' }",
  ]) {
    assert.ok(source.includes(text), `missing option label: ${text}`);
  }
});

test('CZ2-009 known activity titles and pill labels are preserved', () => {
  const source = read(sourcePath);
  for (const text of [
    "Kalendarz: oznaczono wpis jako zrobiony",
    "Dziś: oznaczono zadanie jako zrobione",
    "Dziś: oznaczono wydarzenie jako zrobione",
    "Lead",
    "Sprawa",
    "Zadanie",
    "Wydarzenie",
    "Klient",
    "System",
  ]) {
    assert.ok(source.includes(text), `missing copy: ${text}`);
  }
});

test('CZ2-009 classification still covers task event lead case client system', () => {
  const source = read(sourcePath);
  for (const text of [
    "return 'task';",
    "return 'event';",
    "return 'lead';",
    "return 'case';",
    "return 'client';",
    "return 'system';",
    "payloadSource === 'calendar'",
    "eventType.startsWith('today_')",
  ]) {
    assert.ok(source.includes(text), `missing classifier token: ${text}`);
  }
});

test('CZ2-009 Activity.tsx consumes SOT without local option arrays or moved helpers', () => {
  const activity = read(activityPath);
  assert.ok(activity.includes("from '../lib/source-of-truth/activity-options'"));
  for (const pattern of [
    /const\s+sourceOptions\s*=/,
    /const\s+activityTypeOptions\s*=/,
    /const\s+relationOptions\s*=/,
    /const\s+activityFilters\s*=/,
    /function\s+getActivityEntity\s*\(/,
    /function\s+getActivityTitle\s*\(/,
    /function\s+getActivityMeta\s*\(/,
    /function\s+getActivityRelation\s*\(/,
    /function\s+getActivitySearchText\s*\(/,
    /function\s+shouldShowByFilter\s*\(/,
  ]) {
    assert.equal(pattern.test(activity), false, `forbidden local SOT remains: ${pattern}`);
  }
});

test('CZ2-009 Activity.tsx keeps activity fetch runtime dependencies', () => {
  const activity = read(activityPath);
  for (const token of ['fetchActivitiesFromSupabase', 'fetchLeadsFromSupabase', 'fetchCasesFromSupabase']) {
    assert.ok(activity.includes(token), `missing runtime fetch dependency: ${token}`);
  }
});

test('CZ2-009 /activity remains canonical route', () => {
  const routes = read(routesPath);
  assert.ok(routes.includes("activity: '/activity'"));
  assert.ok(routes.includes("screen: 'Activity'"));
  assert.ok(routes.includes("path: CLOSEFLOW_ROUTES.activity"));
  assert.ok(routes.includes("status: 'canonical'"));
});

test('CZ2-009 changed source files are UTF-8 clean', () => {
  for (const file of [sourcePath, activityPath, path.join(root, 'scripts/guards/verify-lf-ui-sot-cz2-009-activity-event-copy-source-of-truth.cjs')]) {
    assert.ok(noMojibake(read(file)), `${file} contains mojibake`);
  }
});
