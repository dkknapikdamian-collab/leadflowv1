const fs = require('fs');
const path = require('path');

const marker = 'STAGE69H_SOFT_NEXT_STEP_PACKAGE_FINAL';
const repoRoot = process.cwd();
const tasksPath = path.join(repoRoot, 'src', 'pages', 'Tasks.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const releaseDocPath = path.join(repoRoot, 'docs', 'release', 'STAGE69H_SOFT_NEXT_STEP_PACKAGE_FINAL_2026-05-05.md');

function fail(message) { console.error(`FAIL ${marker}: ${message}`); process.exit(1); }
function pass(message) { console.log(`PASS ${message}`); }
function read(file) { return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); }
function count(value, needle) { return String(value || '').split(needle).length - 1; }

if (!fs.existsSync(tasksPath)) fail('missing src/pages/Tasks.tsx');
if (!fs.existsSync(packagePath)) fail('missing package.json');
if (!fs.existsSync(releaseDocPath)) fail('missing release doc');
const source = read(tasksPath);
const start = source.indexOf('const handleSoftNextStepAfterTaskCompletion = async');
const end = source.indexOf('const openEditTask = (task: any) =>', start === -1 ? 0 : start);
if (start === -1 || end === -1 || end <= start) fail('missing soft next-step function block');
const block = source.slice(start, end);

const requiredSource = [
  marker,
  'window.prompt(promptText,',
  'isActiveSalesLead(lead)',
  'if (lead.nextActionAt) return;',
  'insertTaskToSupabase({',
  "type: 'follow_up'",
  'updateLeadInSupabase({',
  'nextActionAt: scheduledAt',
  'insertActivityToSupabase({',
  "eventType: 'lead_next_step_created'",
  "eventType: 'lead_next_step_skipped'",
  'await refreshSupabaseData();',
  'SOFT_NEXT_STEP_AFTER_TASK_COMPLETION_FAILED',
];
for (const fragment of requiredSource) {
  if (!source.includes(fragment) && !block.includes(fragment)) fail(`missing source fragment: ${fragment}`);
  pass(`contains source fragment: ${fragment}`);
}

const forbiddenRootArtifacts = fs.readdirSync(repoRoot).filter((name) => /^stage69[a-z0-9_-]*_patch\.cjs$/i.test(name));
if (forbiddenRootArtifacts.length) fail(`root contains leftover Stage69 patch artifacts: ${forbiddenRootArtifacts.join(', ')}`);
pass('no root Stage69 patch artifacts remain');

const packageRaw = fs.readFileSync(packagePath, 'utf8');
if (packageRaw.charCodeAt(0) === 0xfeff) fail('package.json starts with BOM');
pass('package.json has no BOM');
if (packageRaw.includes('\\u0026')) fail('package.json contains escaped ampersands');
pass('package.json has plain ampersands');
let pkg;
try { pkg = JSON.parse(packageRaw); } catch (error) { fail(`package.json invalid JSON: ${error.message}`); }
const canonical = JSON.stringify(pkg, null, 2) + '\n';
if (packageRaw !== canonical) fail('package.json is not canonical JSON.stringify(..., null, 2) + newline');
pass('package.json is canonical JSON');
const scripts = pkg.scripts || {};
if (scripts['check:stage69h-soft-next-step-package-final'] !== 'node scripts/check-stage69h-soft-next-step-package-final.cjs') fail('missing Stage69H check script');
if (scripts['test:stage69h-soft-next-step-package-final'] !== 'node --test tests/stage69h-soft-next-step-package-final.test.cjs') fail('missing Stage69H test script');
pass('package.json contains Stage69H scripts');
const verify = String(scripts['verify:case-operational-ui'] || '');
if (count(verify, 'check:stage69h-soft-next-step-package-final') !== 1) fail('verify:case-operational-ui must include Stage69H once');
pass('verify:case-operational-ui includes Stage69H once');
const releaseDoc = read(releaseDocPath);
if (!releaseDoc.includes(marker)) fail('release doc missing marker');
pass('release doc contains marker');
console.log(`PASS ${marker}`);
