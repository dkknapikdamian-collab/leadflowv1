const fs = require('fs');
const path = require('path');

const root = process.cwd();
const rel = 'src/lib/calendar-items.ts';
const file = path.join(root, rel);
const body = fs.readFileSync(file, 'utf8');

function expect(text, label) {
  if (!body.includes(text)) {
    throw new Error(`${rel}: missing ${label}`);
  }
  console.log(`OK: ${rel} contains ${label}`);
}

expect('leads: Record<string, unknown>[];', 'CalendarBundle leads record type');
expect('leads: leadItems as Record<string, unknown>[]', 'lead items returned in calendar bundle');
expect('fetchLeadsFromSupabase', 'lead fetch for calendar bundle');

if (body.includes('leads: never[];')) {
  throw new Error(`${rel}: old leads never[] type still present`);
}

console.log('stage34c-calendar-leads-typefix: PASS');
