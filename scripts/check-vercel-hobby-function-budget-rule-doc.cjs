const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function assert(condition, message) {
  if (!condition) problems.push(message);
}

const doc = 'docs/architecture/VERCEL_HOBBY_API_FUNCTION_BUDGET_RULE_2026-05-03.md';
assert(exists(doc), 'missing architecture doc: ' + doc);

const content = exists(doc) ? read(doc) : '';

for (const marker of [
  'maksymalnie 12 Serverless Functions',
  'Nie dodawac nowych plikow `api/*.ts`',
  'api/system.ts',
  '/api/system?kind=nazwa-funkcji',
  'vercel.json',
  'check:vercel-hobby-function-budget',
  'src/server/google-calendar-handler.ts',
  "kind === 'google-calendar'",
  '/api/google-calendar -> /api/system?kind=google-calendar',
]) {
  assert(content.includes(marker), 'architecture doc missing marker: ' + marker);
}

const budgetGuard = 'scripts/check-vercel-hobby-function-budget.cjs';
assert(exists(budgetGuard), 'missing Vercel Hobby function budget guard');
const budgetGuardContent = exists(budgetGuard) ? read(budgetGuard) : '';
assert(budgetGuardContent.includes('api/google-calendar.ts must not exist'), 'budget guard must keep standalone Google Calendar API ban');
assert(budgetGuardContent.includes('files.length <= 12'), 'budget guard must enforce max 12 api function files');

const pkg = JSON.parse(read('package.json'));
assert(Boolean(pkg.scripts && pkg.scripts['check:vercel-hobby-function-budget']), 'package.json missing check:vercel-hobby-function-budget');
assert(Boolean(pkg.scripts && pkg.scripts['check:vercel-hobby-function-budget-rule-doc']), 'package.json missing check:vercel-hobby-function-budget-rule-doc');

if (problems.length) {
  console.error('Vercel Hobby API function budget rule doc guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS Vercel Hobby API function budget rule doc');
