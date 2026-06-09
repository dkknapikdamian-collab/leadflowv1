const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const STAGE = 'STAGE228R43_R42_GUARD_REPAIR';
function file(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { throw new Error(STAGE + ' FAIL: ' + message); }
function mustInclude(source, token, label) {
  if (!source.includes(token)) fail(label + ' missing token: ' + token);
}

const r42 = file('scripts/check-stage228r42-runtime-delete-status-contract.cjs');
const domain = file('src/lib/domain-statuses.ts');
const workItems = file('api/work-items.ts');

if (r42.includes('new RegExp')) fail('R42 guard must not use brittle/generated RegExp for TS const array parsing');
mustInclude(r42, 'blockOfConstArray', 'R42 repaired guard');
mustInclude(r42, 'TASK_STATUS_VALUES', 'R42 repaired guard');
mustInclude(r42, 'EVENT_STATUS_VALUES', 'R42 repaired guard');
mustInclude(domain, "'deleted'", 'domain deleted status contract');
mustInclude(workItems, 'normalizeTaskStatus', 'work-items task status normalization');
mustInclude(workItems, 'normalizeEventStatus', 'work-items event status normalization');

console.log(STAGE + ' PASS');
