const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const leadDetailPath = path.join(root, 'src', 'pages', 'LeadDetail.tsx');
const componentPath = path.join(root, 'src', 'components', 'LeadAiFollowupDraft.tsx');
const aiLibPath = path.join(root, 'src', 'lib', 'ai-followup.ts');
const packagePath = path.join(root, 'package.json');
const quietRunnerPath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');
const guardPath = path.join(root, 'scripts', 'check-stage78-lead-detail-no-static-ai-followup-card.cjs');
const testPath = path.join(root, 'tests', 'stage78-lead-detail-no-static-ai-followup-card.test.cjs');

function fail(message) {
  console.error('STAGE78_GUARD_FINAL_REPAIR_FAIL:', message);
  process.exit(1);
}
function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + path.relative(root, file));
  return fs.readFileSync(file, 'utf8');
}
function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}

let leadDetail = read(leadDetailPath);

// Keep this idempotent: if the failed previous patch already removed the usage, this does nothing.
leadDetail = leadDetail.replace(/\nimport\s+LeadAiFollowupDraft\s+from\s+['"]\.\.\/components\/LeadAiFollowupDraft['"];\r?\n/g, '\n');
leadDetail = leadDetail.replace(/\r?\n\s*<LeadAiFollowupDraft\b[\s\S]*?\/\>\s*/g, '\n');
write(leadDetailPath, leadDetail);

const guard = String.raw`const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function fail(message) {
  console.error('STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_FAIL:', message);
  process.exit(1);
}
function read(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) fail('missing file: ' + relativePath);
  return fs.readFileSync(file, 'utf8');
}

const leadDetail = read('src/pages/LeadDetail.tsx');
const component = read('src/components/LeadAiFollowupDraft.tsx');
const aiLib = read('src/lib/ai-followup.ts');
const quietRunner = read('scripts/closeflow-release-check-quiet.cjs');
const pkg = JSON.parse(read('package.json'));

const forbiddenLeadDetailTokens = [
  "from '../components/LeadAiFollowupDraft'",
  'from "../components/LeadAiFollowupDraft"',
  '<LeadAiFollowupDraft',
  'data-ai-followup-draft-card=',
];
for (const token of forbiddenLeadDetailTokens) {
  if (leadDetail.includes(token)) fail('LeadDetail still renders/imports the static AI follow-up card token: ' + token);
}

// Important: do NOT ban the phrase "AI follow-up" globally. The reusable component may still own it.
// Stage78 removes the static right-rail usage from LeadDetail, not the AI draft capability itself.
if (!component.includes('data-ai-followup-draft-card="true"')) fail('LeadAiFollowupDraft component was removed or lost its DOM marker');
if (!component.includes('AI follow-up')) fail('LeadAiFollowupDraft component was unexpectedly changed');
if (!component.includes('Szkic odpowiedzi')) fail('LeadAiFollowupDraft component lost draft action copy');
if (!aiLib.includes('createLeadFollowupDraft')) fail('AI follow-up engine was removed');

if (pkg.scripts['check:stage78-lead-detail-no-static-ai-followup-card'] !== 'node scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs') {
  fail('package.json missing Stage78 check script');
}
if (pkg.scripts['test:stage78-lead-detail-no-static-ai-followup-card'] !== 'node --test tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs') {
  fail('package.json missing Stage78 test script');
}
if (!quietRunner.includes("'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs'")) {
  fail('verify:closeflow:quiet is not wired to Stage78 regression test');
}

console.log('OK stage78 lead detail no static ai followup card');
`;
write(guardPath, guard);

const test = String.raw`const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function runNode(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
}

test('Stage78 checker and quiet runner are syntactically valid', () => {
  for (const file of [
    'scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs',
    'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs',
    'scripts/closeflow-release-check-quiet.cjs',
  ]) {
    const result = runNode(['--check', file]);
    assert.equal(result.status, 0, file + '\n' + result.stderr);
  }
});

test('Stage78 guard passes current repo', () => {
  const result = runNode(['scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('LeadDetail no longer imports or renders the static AI follow-up card', () => {
  const leadDetail = read('src/pages/LeadDetail.tsx');
  assert.equal(leadDetail.includes("from '../components/LeadAiFollowupDraft'"), false);
  assert.equal(leadDetail.includes('from "../components/LeadAiFollowupDraft"'), false);
  assert.equal(leadDetail.includes('<LeadAiFollowupDraft'), false);
  assert.equal(leadDetail.includes('data-ai-followup-draft-card='), false);
});

test('AI follow-up capability remains available outside the static LeadDetail rail', () => {
  const component = read('src/components/LeadAiFollowupDraft.tsx');
  const aiLib = read('src/lib/ai-followup.ts');
  assert.ok(component.includes('data-ai-followup-draft-card="true"'));
  assert.ok(component.includes('AI follow-up'));
  assert.ok(component.includes('Szkic odpowiedzi'));
  assert.ok(aiLib.includes('createLeadFollowupDraft'));
});

test('Stage78 is wired into package scripts and quiet verify gate', () => {
  const pkg = JSON.parse(read('package.json'));
  const quietRunner = read('scripts/closeflow-release-check-quiet.cjs');
  assert.equal(pkg.scripts['check:stage78-lead-detail-no-static-ai-followup-card'], 'node scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs');
  assert.equal(pkg.scripts['test:stage78-lead-detail-no-static-ai-followup-card'], 'node --test tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs');
  assert.ok(quietRunner.includes("'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs'"));
});
`;
write(testPath, test);

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:stage78-lead-detail-no-static-ai-followup-card'] = 'node scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs';
pkg.scripts['test:stage78-lead-detail-no-static-ai-followup-card'] = 'node --test tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

let quiet = read(quietRunnerPath);
const testEntry = "  'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs',";
if (!quiet.includes(testEntry.trim())) {
  const anchor = 'const requiredTests = [\n';
  const index = quiet.indexOf(anchor);
  if (index === -1) fail('cannot find requiredTests array in quiet runner');
  quiet = quiet.slice(0, index + anchor.length) + testEntry + '\n' + quiet.slice(index + anchor.length);
  write(quietRunnerPath, quiet);
}

console.log('OK: Stage78 guard final repair applied.');
