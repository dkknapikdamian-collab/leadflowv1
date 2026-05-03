#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertNotIncludes(scope, content, needle, message) {
  if (!content.includes(needle)) pass(scope, message || 'Forbidden text absent: ' + needle);
  else fail(scope, (message || 'Forbidden text found: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}

function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message || 'Forbidden pattern absent: ' + regex);
  else fail(scope, (message || 'Forbidden pattern found: ' + regex) + ' [regex=' + regex + ']');
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const files = {
  layout: 'src/components/Layout.tsx',
  globalActions: 'src/components/GlobalQuickActions.tsx',
  quickAi: 'src/components/QuickAiCapture.tsx',
  aiDrafts: 'src/pages/AiDrafts.tsx',
  releaseDoc: 'docs/release/FAZA3_ETAP32D_PLAN_BASED_UI_VISIBILITY_2026-05-03.md',
  technicalDoc: 'docs/technical/PLAN_BASED_UI_VISIBILITY_STAGE32D_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const layout = readRequired(files.layout);
const globalActions = readRequired(files.globalActions);
const quickAi = readRequired(files.quickAi);
const aiDrafts = readRequired(files.aiDrafts);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Layout sidebar visibility');
assertIncludes(files.layout, layout, 'access } = useWorkspace()', 'Layout reads access from workspace');
assertIncludes(files.layout, layout, 'canUseAiDraftsByPlan', 'Layout computes Szkice AI visibility');
assertRegex(files.layout, layout, /canUseAiDraftsByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*fullAi[\s\S]*\)/, 'Szkice AI visibility uses lightDrafts/fullAi');
assertRegex(files.layout, layout, /\.\.\.\(canUseAiDraftsByPlan\s*\?\s*\[\{ icon: CheckCircle2, label: 'Szkice AI', path: '\/ai-drafts' \}\]\s*:\s*\[\]\)/, 'Szkice AI nav item is conditional');
assertRegex(files.layout, layout, /useMemo<NavGroup\[\]>\(\(\) =>[\s\S]*\[isAdmin, canUseAiDraftsByPlan\]/, 'Nav groups depend on plan visibility');

section('Global quick action visibility');
assertIncludes(files.globalActions, globalActions, 'canUseFullAiAssistantByPlan', 'Global actions compute full AI visibility');
assertIncludes(files.globalActions, globalActions, 'canUseQuickAiCaptureByPlan', 'Global actions compute quick capture visibility');
assertIncludes(files.globalActions, globalActions, 'canUseAiDraftsByPlan', 'Global actions compute draft link visibility');
assertRegex(files.globalActions, globalActions, /canUseFullAiAssistantByPlan\s*=\s*Boolean\([\s\S]*fullAi[\s\S]*\)/, 'Full AI uses fullAi feature');
assertRegex(files.globalActions, globalActions, /canUseQuickAiCaptureByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*lightParser[\s\S]*fullAi[\s\S]*\)/, 'Quick capture uses lightDrafts/lightParser/fullAi');
assertRegex(files.globalActions, globalActions, /canUseAiDraftsByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*fullAi[\s\S]*\)/, 'AI draft link uses lightDrafts/fullAi');
assertRegex(files.globalActions, globalActions, /\{canUseFullAiAssistantByPlan \? \([\s\S]*<GlobalAiAssistant \/>[\s\S]*\) : null\}/, 'Global assistant hidden outside full AI');
assertRegex(files.globalActions, globalActions, /\{canUseQuickAiCaptureByPlan \? <QuickAiCapture \/> : null\}/, 'Quick capture hidden outside allowed plans');
assertRegex(files.globalActions, globalActions, /\{canUseAiDraftsByPlan \? \([\s\S]*to="\/ai-drafts"[\s\S]*\) : null\}/, 'AI drafts link hidden outside allowed plans');
assertNotIncludes(files.globalActions, globalActions, 'data-global-quick-action="ai-locked"', 'Normal flow no longer shows locked AI button');
assertNotIncludes(files.globalActions, globalActions, 'Asystent AI jest w planie AI', 'Normal flow does not show AI upsell button');

section('Quick AI capture safety');
assertIncludes(files.quickAi, quickAi, 'quickAiVisibleByPlan', 'QuickAiCapture has own plan safety guard');
assertRegex(files.quickAi, quickAi, /quickAiVisibleByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*lightParser[\s\S]*fullAi[\s\S]*\)/, 'QuickAiCapture own guard uses lightDrafts/lightParser/fullAi');
assertIncludes(files.quickAi, quickAi, 'if (!quickAiVisibleByPlan) return null;', 'QuickAiCapture returns null outside allowed plans');

section('AiDrafts route blocker');
assertIncludes(files.aiDrafts, aiDrafts, 'function AiDraftsInner()', 'AiDrafts original page moved to inner component');
assertIncludes(files.aiDrafts, aiDrafts, 'export default function AiDrafts()', 'AiDrafts wrapper exists');
assertIncludes(files.aiDrafts, aiDrafts, 'data-plan-route-blocker="ai-drafts"', 'AiDrafts direct route blocker exists');
assertRegex(files.aiDrafts, aiDrafts, /canUseAiDraftsByPlan\s*=\s*Boolean\([\s\S]*lightDrafts[\s\S]*fullAi[\s\S]*\)/, 'AiDrafts route blocker uses lightDrafts/fullAi');
assertIncludes(files.aiDrafts, aiDrafts, 'Dostępne od planu Basic', 'AiDrafts route blocker has user-facing plan message');
assertIncludes(files.aiDrafts, aiDrafts, 'href="/billing"', 'AiDrafts route blocker links to Billing');

section('Documentation');
for (const marker of [
  'FAZA 3 - Etap 3.2D - Plan-based UI visibility',
  'Free nie widzi AI',
  'Basic widzi lekkie szkice',
  'Pro widzi lekkie szkice',
  'AI i Trial widzą pełny AI',
  'FAZA 3 - Etap 3.2E - Settings/Digest/Billing plan visibility smoke',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}

for (const marker of [
  'PLAN-BASED UI VISIBILITY',
  'canUseAiDraftsByPlan',
  'canUseFullAiAssistantByPlan',
  'quickAiVisibleByPlan',
  'data-plan-route-blocker="ai-drafts"',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try {
  pkg = JSON.parse(pkgRaw);
  pass(files.pkg, 'package.json parses');
} catch (error) {
  fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error)));
}
const scripts = pkg.scripts || {};
if (scripts['check:faza3-etap32d-plan-based-ui-visibility'] === 'node scripts/check-faza3-etap32d-plan-based-ui-visibility.cjs') {
  pass(files.pkg, 'check:faza3-etap32d-plan-based-ui-visibility is wired');
} else {
  fail(files.pkg, 'missing check:faza3-etap32d-plan-based-ui-visibility');
}
if (scripts['test:faza3-etap32d-plan-based-ui-visibility'] === 'node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs') {
  pass(files.pkg, 'test:faza3-etap32d-plan-based-ui-visibility is wired');
} else {
  fail(files.pkg, 'missing test:faza3-etap32d-plan-based-ui-visibility');
}
assertIncludes(files.quiet, quiet, 'tests/faza3-etap32d-plan-based-ui-visibility.test.cjs', 'Quiet release gate includes Faza3 Etap3.2D test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2D plan-based UI visibility guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.2D plan-based UI visibility guard');
