const fs = require('fs');

function fail(message) {
  throw new Error(message);
}
function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) fail('Missing ' + label + ': ' + needle);
}
function assertRegex(source, regex, label) {
  if (!regex.test(source)) fail('Missing pattern ' + label + ': ' + regex);
}

const pkgText = read('package.json');
let pkg;
try {
  pkg = JSON.parse(pkgText);
} catch (error) {
  fail('package.json does not parse: ' + error.message);
}
if (!pkg.scripts || pkg.scripts['check:stage14i-calendar-snake-case-task-dates'] !== 'node scripts/check-stage14i-calendar-snake-case-task-dates.cjs') {
  fail('package.json missing check:stage14i-calendar-snake-case-task-dates script');
}

const contract = read('src/lib/task-event-contract.ts');
const normalize = read('src/lib/work-items/normalize.ts');

[
  'scheduled_at?:',
  'due_at?:',
  'date_time?:',
  'starts_at?:',
  'start_at?:',
  'ends_at?:',
  'end_at?:',
  'reminder_at?:',
  'scheduled_date?:',
  'scheduled_time?:',
  'due_date?:',
  'due_time?:',
  'start_date?:',
  'start_time?:',
  'end_date?:',
  'end_time?:',
].forEach((needle) => assertIncludes(contract, needle, 'TaskEventDateSource field'));

assertIncludes(normalize, 'function combineDateAndTimeFields(', 'combine helper');
assertIncludes(normalize, "return date + 'T' + time;", 'safe date time join without template trap');
[
  "'scheduled_at'",
  "'due_at'",
  "'date_time'",
  "'starts_at'",
  "'start_at'",
  "'scheduled_date'",
  "'scheduled_time'",
  "'due_date'",
  "'due_time'",
  "'start_date'",
  "'start_time'",
  "'end_date'",
  "'end_time'",
  "'reminder_at'",
].forEach((needle) => assertIncludes(normalize, needle, 'normalizeWorkItem alias'));

assertRegex(normalize, /const scheduledAt = pickIso\(row, \[[^\]]*'due_at'[^\]]*'date_time'[^\]]*'starts_at'[^\]]*'start_at'/s, 'scheduledAt snake_case aliases');
assertRegex(normalize, /const startAt = pickIso\(row, \[[^\]]*'start_at'[^\]]*'starts_at'[^\]]*'scheduled_at'/s, 'startAt snake_case aliases');
assertRegex(normalize, /const reminderAt = pickIso\(row, \[[^\]]*'reminder_at'/s, 'reminderAt snake_case alias');

console.log('OK: Stage14I calendar snake_case task date guard passed');
