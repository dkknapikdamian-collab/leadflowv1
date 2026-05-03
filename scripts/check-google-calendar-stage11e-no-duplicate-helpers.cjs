const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = fs.readFileSync(path.join(root, 'src/server/google-calendar-sync.ts'), 'utf8').replace(/^\uFEFF/, '');
const helpers = [
  'normalizeExactGoogleReminderOverrides',
  'normalizeGoogleDateOnly',
  'addOneGoogleDateOnly',
  'buildGoogleTimeFields',
];
const problems = [];
for (const name of helpers) {
  const re = new RegExp('(?:export\\s+)?(?:async\\s+)?function\\s+' + name + '\\s*\\(', 'g');
  const count = [...file.matchAll(re)].length;
  if (count !== 1) problems.push(`${name} expected exactly 1 implementation, found ${count}`);
}
if (!file.includes('GOOGLE_CALENDAR_STAGE11') && !file.includes('google_reminders_use_default')) {
  problems.push('Stage11 reminder/all-day markers missing');
}
if (problems.length) {
  console.error('Stage11E no duplicate helper guard failed:');
  for (const p of problems) console.error('- ' + p);
  process.exit(1);
}
console.log('PASS Google Calendar Stage11E no duplicate reminder/all-day helpers');
