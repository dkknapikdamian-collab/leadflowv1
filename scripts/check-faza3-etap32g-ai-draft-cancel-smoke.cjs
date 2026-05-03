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
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}
function section(title) { console.log('\n== ' + title + ' =='); }

const files = {
  serverDrafts: 'src/server/ai-drafts.ts',
  libDrafts: 'src/lib/ai-drafts.ts',
  pageDrafts: 'src/pages/AiDrafts.tsx',
  releaseDoc: 'docs/release/FAZA3_ETAP32G_AI_DRAFT_CANCEL_HOTFIX_2026-05-03.md',
  technicalDoc: 'docs/technical/AI_DRAFT_CANCEL_SMOKE_STAGE32G_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const serverDrafts = readRequired(files.serverDrafts);
const libDrafts = readRequired(files.libDrafts);
const pageDrafts = readRequired(files.pageDrafts);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Backend cleanup mutation gate');
assertIncludes(files.serverDrafts, serverDrafts, 'function isAiDraftCleanupMutation', 'Cleanup mutation helper exists');
assertIncludes(files.serverDrafts, serverDrafts, "req?.method === 'DELETE'", 'DELETE is treated as cleanup');
assertIncludes(files.serverDrafts, serverDrafts, "'archive'", 'Archive action is treated as cleanup');
assertIncludes(files.serverDrafts, serverDrafts, "'cancel'", 'Cancel action is treated as cleanup');
assertIncludes(files.serverDrafts, serverDrafts, "'archived'", 'Archived status is treated as cleanup');
assertRegex(files.serverDrafts, serverDrafts, /await assertWorkspaceWriteAccess\(workspaceId\);[\s\S]{0,300}if \(!isAiDraftCleanupMutation\(req, body\)\) \{[\s\S]{0,160}await assertWorkspaceAiAllowed\(workspaceId\);[\s\S]{0,80}\}/, 'AI feature gate is skipped only for cleanup');
assertIncludes(files.serverDrafts, serverDrafts, 'WORKSPACE_AI_ACCESS_REQUIRED', 'AI access error is handled explicitly');
assertIncludes(files.serverDrafts, serverDrafts, 'WORKSPACE_ENTITY_LIMIT_REACHED', 'Entity limit error is handled explicitly');

section('Client archive flow');
assertIncludes(files.libDrafts, libDrafts, 'action: (patch as any).action', 'Client forwards draft action to backend');
assertRegex(files.pageDrafts, pageDrafts, /const handleArchive = async \(draft: AiLeadDraft\) => \{[\s\S]{0,700}archiveAiLeadDraftAsync\(draft\.id\)[\s\S]{0,700}Nie udało się anulować szkicu/, 'AiDrafts page has single-call archive flow with visible error');

section('Documentation');
for (const marker of [
  'FAZA 3 - Etap 3.2G - AI draft cancellation hotfix',
  'PATCH cancel/archive/expire',
  'DELETE draft',
  'WORKSPACE_AI_ACCESS_REQUIRED',
  'FAZA 4 - Etap 4.1 - Data contract map',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'AI DRAFT CANCEL SMOKE',
  'src/server/ai-drafts.ts',
  'src/lib/ai-drafts.ts',
  'src/pages/AiDrafts.tsx',
  'isAiDraftCleanupMutation',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza3-etap32g-ai-draft-cancel-smoke'] === 'node scripts/check-faza3-etap32g-ai-draft-cancel-smoke.cjs') pass(files.pkg, 'check:faza3-etap32g-ai-draft-cancel-smoke is wired');
else fail(files.pkg, 'missing check:faza3-etap32g-ai-draft-cancel-smoke');
if (scripts['test:faza3-etap32g-ai-draft-cancel-smoke'] === 'node --test tests/faza3-etap32g-ai-draft-cancel-smoke.test.cjs') pass(files.pkg, 'test:faza3-etap32g-ai-draft-cancel-smoke is wired');
else fail(files.pkg, 'missing test:faza3-etap32g-ai-draft-cancel-smoke');
assertIncludes(files.quiet, quiet, 'tests/faza3-etap32g-ai-draft-cancel-smoke.test.cjs', 'Quiet release gate includes Faza3 Etap3.2G test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2G AI draft cancel smoke guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.2G AI draft cancel smoke guard');
