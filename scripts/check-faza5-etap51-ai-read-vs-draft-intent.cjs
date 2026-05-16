#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function section(title) { console.log('\n== ' + title + ' =='); }
function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}
function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message);
  else fail(scope, message + ' [needle=' + JSON.stringify(needle) + ']');
}
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message);
  else fail(scope, message + ' [regex=' + regex + ']');
}
function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message);
  else fail(scope, message + ' [forbidden=' + regex + ']');
}

const files = {
  intents: 'src/lib/assistant-intents.ts',
  releaseDoc: 'docs/release/FAZA5_ETAP51_AI_READ_VS_DRAFT_INTENT_2026-05-04.md',
  technicalDoc: 'docs/technical/AI_READ_VS_DRAFT_INTENT_STAGE51_2026-05-04.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
  test: 'tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs',
};

const intents = readRequired(files.intents);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);
readRequired(files.test);

section('Intent contract source');
for (const marker of [
  'export const AI_ASSISTANT_INTENTS',
  "read: 'read'",
  "search: 'search'",
  "answer: 'answer'",
  "createDraftLead: 'create_draft_lead'",
  "createDraftTask: 'create_draft_task'",
  "createDraftEvent: 'create_draft_event'",
  "createDraftNote: 'create_draft_note'",
  "unknown: 'unknown'",
  'export const READ_ONLY_INTENTS',
  'export const WRITE_DRAFT_INTENTS',
  'export const UNKNOWN_INTENT',
  'export function classifyAssistantIntent',
  'export function isWriteDraftIntent',
  'export function isReadOnlyIntent',
  'export function shouldCreateDraftForIntent',
  'export const STAGE51_INTENT_FIXTURES',
]) assertIncludes(files.intents, intents, marker, 'assistant-intents.ts contains: ' + marker);

section('Safety rules');
assertRegex(files.intents, intents, /mayCreateFinalRecord:\s*false/g, 'Classifier outputs never allow final record write');
assertIncludes(files.intents, intents, 'READ_ONLY_INTENTS.includes(intent)', 'Read-only helper uses read-only set');
assertIncludes(files.intents, intents, 'WRITE_DRAFT_INTENTS.includes(intent)', 'Write helper uses write-draft set');
assertIncludes(files.intents, intents, 'return isWriteDraftIntent(intent)', 'shouldCreateDraftForIntent delegates to write-draft check');
assertNotRegex(files.intents, intents, /mayCreateFinalRecord:\s*true/, 'No final write true flag exists');

section('Required examples');
const requiredExamples = [
  'Co mam jutro?',
  'Znajd\u017A numer do Marka',
  'Dorota Ko\u0142odziej',
  'Zapisz zadanie jutro 12:00 oddzwoni\u0107 do Anny',
  'Dodaj wydarzenie spotkanie z klientem jutro o 12:00',
  'Zapisz kontakt Jan Kowalski, dzwoni\u0142 w sprawie strony',
  'Zanotuj notatk\u0119: klient chce ofert\u0119 do pi\u0105tku',
  'Zapisz to',
  'expectedMayCreateDraft: false',
  'expectedMayCreateDraft: true',
];
for (const marker of requiredExamples) assertIncludes(files.intents, intents, marker, 'Fixture contains: ' + marker);

section('Documentation');
for (const marker of [
  'FAZA 5 - Etap 5.1 - AI read vs draft intent',
  'src/lib/assistant-intents.ts',
  'read/search/answer/unknown = zero draft, zero final write',
  'create_draft_* = tylko szkic',
  'FAZA 5 - Etap 5.2 - Backendowy guard: tylko szkice, final write po approve',
]) assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);

for (const marker of [
  'AI READ VS DRAFT INTENT STAGE51',
  'AI_ASSISTANT_INTENTS',
  'READ_ONLY_INTENTS',
  'WRITE_DRAFT_INTENTS',
  'mayCreateFinalRecord: false',
  'The next package should wire this contract into assistant/draft creation endpoints',
]) assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }

const scripts = pkg.scripts || {};
if (scripts['check:faza5-etap51-ai-read-vs-draft-intent'] === 'node scripts/check-faza5-etap51-ai-read-vs-draft-intent.cjs') pass(files.pkg, 'check:faza5-etap51-ai-read-vs-draft-intent is wired');
else fail(files.pkg, 'missing check:faza5-etap51-ai-read-vs-draft-intent');

if (scripts['test:faza5-etap51-ai-read-vs-draft-intent'] === 'node --test tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs') pass(files.pkg, 'test:faza5-etap51-ai-read-vs-draft-intent is wired');
else fail(files.pkg, 'missing test:faza5-etap51-ai-read-vs-draft-intent');

assertIncludes(files.quiet, quiet, 'tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs', 'Quiet release gate includes Faza5 Etap5.1 static test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 5 - Etap 5.1 AI read vs draft intent guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 5 - Etap 5.1 AI read vs draft intent guard');
