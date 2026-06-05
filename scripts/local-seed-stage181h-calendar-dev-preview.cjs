const fs = require('fs');

const file = 'src/lib/supabase-fallback.ts';
let src = fs.readFileSync(file, 'utf8');

if (src.includes('CLOSEFLOW_STAGE181H_LOCAL_CALENDAR_SEED')) {
  console.log('Stage181H local calendar seed already exists.');
} else {
  const taskSeed = `
    // CLOSEFLOW_STAGE181H_LOCAL_CALENDAR_SEED
    { id: 'dev-task-181h-1', title: 'Roboczy test kalendarza - dokumenty i termin klienta', status: 'todo', date: dateOnly(0), time: '10:00', priority: 'high', type: 'task', leadId: 'dev-lead-1', caseId: 'dev-case-1', clientId: 'dev-client-1' },
    { id: 'dev-task-181h-2', title: 'Roboczy follow-up z bardzo długą nazwą do sprawdzenia ucinania tekstu w kalendarzu', status: 'todo', date: dateOnly(0), time: '15:30', priority: 'medium', type: 'follow_up', leadId: 'dev-lead-2', caseId: 'dev-case-2', clientId: 'dev-client-2' },
    { id: 'dev-task-181h-3', title: 'Robocze zadanie jutro - sprawdzić widok tygodnia', status: 'todo', date: dateOnly(1), time: '08:45', priority: 'low', type: 'task', clientId: 'dev-client-3' },
    { id: 'dev-task-181h-4', title: 'Robocze zaległe zadanie - test czerwonego statusu', status: 'todo', date: dateOnly(-2), time: '11:15', priority: 'high', type: 'phone', caseId: 'dev-case-2', clientId: 'dev-client-2' },`;

  const eventSeed = `
    // CLOSEFLOW_STAGE181H_LOCAL_CALENDAR_SEED
    { id: 'dev-event-181h-1', title: 'Robocze spotkanie demo - kalendarz widok tygodnia', startAt: iso(2), endAt: iso(3), type: 'meeting', leadId: 'dev-lead-1', caseId: 'dev-case-1', clientId: 'dev-client-1' },
    { id: 'dev-event-181h-2', title: 'Roboczy telefon kontrolny z klientem - długi tytuł do tooltipa', startAt: iso(7), endAt: iso(8), type: 'call', leadId: 'dev-lead-2', caseId: 'dev-case-2', clientId: 'dev-client-2' },
    { id: 'dev-event-181h-3', title: 'Roboczy przegląd pipeline na jutro', startAt: iso(26), endAt: iso(27), type: 'meeting', clientId: 'dev-client-3' },
    { id: 'dev-event-181h-4', title: 'Robocze wydarzenie za trzy dni - test miesiąca', startAt: new Date(Date.now() + 3 * 86_400_000 + 12 * 3_600_000).toISOString(), endAt: new Date(Date.now() + 3 * 86_400_000 + 13 * 3_600_000).toISOString(), type: 'meeting', leadId: 'dev-lead-3' },`;

  const tasksRe = /(const tasks = \[\n)([\s\S]*?)(\n\s*\];\n\n\s*const events = \[)/m;
  if (!tasksRe.test(src)) throw new Error('Could not find dev preview tasks array.');

  src = src.replace(tasksRe, (match, start, body, end) => {
    return start + body.replace(/\s*$/, '') + taskSeed + end;
  });

  const eventsRe = /(const events = \[\n)([\s\S]*?)(\n\s*\];\n\n\s*const payments = \[)/m;
  if (!eventsRe.test(src)) throw new Error('Could not find dev preview events array.');

  src = src.replace(eventsRe, (match, start, body, end) => {
    return start + body.replace(/\s*$/, '') + eventSeed + end;
  });

  fs.writeFileSync(file, src, 'utf8');
  console.log('Patched Stage181H local calendar dev seed.');
}

const next = fs.readFileSync(file, 'utf8');

const failures = [];
for (const token of [
  'CLOSEFLOW_STAGE181H_LOCAL_CALENDAR_SEED',
  'dev-task-181h-1',
  'dev-task-181h-2',
  'dev-task-181h-3',
  'dev-task-181h-4',
  'dev-event-181h-1',
  'dev-event-181h-2',
  'dev-event-181h-3',
  'dev-event-181h-4',
]) {
  if (!next.includes(token)) failures.push('Missing seed token: ' + token);
}

if (failures.length) {
  console.error('Stage181H local seed failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181H local: calendar has extra dev tasks/events.');
