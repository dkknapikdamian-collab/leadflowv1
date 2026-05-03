#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const file = 'src/server/_access-gate.ts';
const source = fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const results = [];

function pass(message) { results.push({ level: 'PASS', message }); }
function fail(message) { results.push({ level: 'FAIL', message }); }
function assertIncludes(needle, message) {
  if (source.includes(needle)) pass(message);
  else fail(message + ' [missing=' + JSON.stringify(needle) + ']');
}
function assertNotIncludes(needle, message) {
  if (!source.includes(needle)) pass(message);
  else fail(message + ' [forbidden=' + JSON.stringify(needle) + ']');
}
function assertRegex(regex, message) {
  if (regex.test(source)) pass(message);
  else fail(message + ' [regex=' + regex + ']');
}
function assertNotRegex(regex, message) {
  if (!regex.test(source)) pass(message);
  else fail(message + ' [forbiddenRegex=' + regex + ']');
}

console.log('== Faza3 Etap3.2C access gate runtime hotfix v3 ==');

assertIncludes('export async function assertWorkspaceFeatureAccess', 'Generic feature gate exists');
assertIncludes('export async function assertWorkspaceAiAllowed', 'AI gate exists');
assertIncludes("assertWorkspaceFeatureAccess(workspaceInput, 'fullAi', planInput)", 'AI gate delegates to fullAi feature');
assertIncludes('WORKSPACE_FEATURE_ACCESS_REQUIRED', 'Generic feature error remains stable');
assertIncludes('WORKSPACE_AI_ACCESS_REQUIRED', 'AI error code remains stable');

const featureMatches = source.match(/export async function assertWorkspaceFeatureAccess/g) || [];
if (featureMatches.length === 1) pass('Exactly one assertWorkspaceFeatureAccess function exists');
else fail('Expected exactly one assertWorkspaceFeatureAccess function, found ' + featureMatches.length);

const aiMatches = source.match(/export async function assertWorkspaceAiAllowed/g) || [];
if (aiMatches.length === 1) pass('Exactly one assertWorkspaceAiAllowed function exists');
else fail('Expected exactly one assertWorkspaceAiAllowed function, found ' + aiMatches.length);

assertNotRegex(/\n\}, planInput\?: unknown\) \{/, 'Orphaned old TypeScript tail is removed precisely');
assertNotIncludes('const row = asRecord(workspace);\n  const status = readWorkspaceStatus(workspace);', 'Legacy AI body row/status block is removed');
assertNotIncludes("plan === 'pro')) return true", 'Old Pro full-AI shortcut is removed');
assertNotIncludes("plan === 'pro' || plan.includes('ai')", 'Old Pro/AI shortcut is removed');
assertNotRegex(/export async function assertWorkspaceAiAllowed[\s\S]*status === 'paid_active'[\s\S]*plan === 'pro'/, 'AI gate does not allow Pro by legacy condition');
assertRegex(
  /export async function assertWorkspaceFeatureAccess\([\s\S]*WORKSPACE_FEATURE_ACCESS_REQUIRED[\s\S]*isPlanFeatureEnabled\(plan, featureName as any, status\)[\s\S]*throw makeGateError\('WORKSPACE_FEATURE_ACCESS_REQUIRED', 402\);[\s\S]*\n\}/,
  'Feature gate body is present',
);
assertRegex(
  /export async function assertWorkspaceAiAllowed\([\s\S]*workspaceInput: unknown = \{\},[\s\S]*planInput\?: unknown,[\s\S]*\) \{[\s\S]*assertWorkspaceFeatureAccess\(workspaceInput, 'fullAi', planInput\)[\s\S]*WORKSPACE_AI_ACCESS_REQUIRED[\s\S]*\n\}/,
  'AI gate body is clean multiline fullAi implementation',
);
assertRegex(/function normalizeLimitKey\(entityName: unknown\)/, 'normalizeLimitKey remains after gates');

for (const item of results) console.log(item.level + ' ' + file + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');

if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2C access gate runtime hotfix v3 guard failed.');
  process.exit(1);
}

console.log('\nPASS FAZA 3 - Etap 3.2C access gate runtime hotfix v3 guard');
