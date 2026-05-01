const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function check(name, fn) {
  try {
    fn();
  } catch (error) {
    failures.push(name + ': ' + error.message);
  }
}

function mustContain(file, needle) {
  const source = read(file);
  assert.ok(source.includes(needle), file + ' missing ' + needle);
}

function mustMatch(file, pattern, label) {
  const source = read(file);
  assert.match(source, pattern, file + ' missing ' + (label || pattern));
}

function mustNotMatch(file, pattern, label) {
  const source = read(file);
  assert.doesNotMatch(source, pattern, file + ' contains forbidden ' + (label || pattern));
}

check('domain statuses exist', () => {
  mustContain('src/lib/domain-statuses.ts', 'export type BillingStatus');
  mustContain('src/lib/domain-statuses.ts', 'export type AccessState');
  mustContain('src/lib/domain-statuses.ts', 'trial_active');
  mustContain('src/lib/domain-statuses.ts', 'free_active');
});

check('business DTOs are exported from data contract', () => {
  for (const dto of ['LeadDto', 'TaskDto', 'EventDto', 'CaseDto', 'ClientDto', 'ActivityDto', 'AiDraftDto']) {
    mustMatch('src/lib/data-contract.ts', new RegExp('export\\s+type\\s+' + dto + '\\b'), dto);
  }
});

check('Supabase fallback typed case template inputs', () => {
  mustContain('src/lib/supabase-fallback.ts', 'CaseTemplateItemInput');
  mustNotMatch('src/lib/supabase-fallback.ts', /items:\s*any\[\]/, 'items: any[]');
});

check('scheduling uses typed raw records', () => {
  mustContain('src/lib/scheduling.ts', 'export type ScheduleRawRecord');
  mustNotMatch('src/lib/scheduling.ts', /raw:\s*any\b/, 'raw: any');
  mustNotMatch('src/lib/scheduling.ts', /\b(events|tasks|leads):\s*any\[\]/, 'schedule any arrays');
  mustNotMatch('src/lib/scheduling.ts', /function\s+\w+\([^)]*:\s*any/, 'function any parameter');
});

check('lead health uses typed input', () => {
  mustContain('src/lib/lead-health.ts', 'export type LeadHealthInput');
  mustNotMatch('src/lib/lead-health.ts', /\(lead:\s*any\)/, 'lead: any');
});

check('access gate exposes typed state', () => {
  mustContain('src/server/_access-gate.ts', 'WorkspaceWriteAccess');
  mustContain('src/server/_access-gate.ts', 'AccessState');
  mustContain('src/server/_access-gate.ts', 'BillingStatus');
});

check('tsconfig does not enable strict blindly', () => {
  const tsconfig = JSON.parse(read('tsconfig.json'));
  assert.notEqual(tsconfig.compilerOptions && tsconfig.compilerOptions.strict, true, 'strict:true must not be enabled in this stage');
});

if (failures.length) {
  console.error('A14 business type guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: A14 business type guard passed.');
