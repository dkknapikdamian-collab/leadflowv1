const fs = require('fs');

const file = 'src/pages/Calendar.tsx';
let src = fs.readFileSync(file, 'utf8');

if (!src.includes('CLOSEFLOW_STAGE181I_LOCAL_CALENDAR_DIRECT_SEED')) {
  const helper = `
  // CLOSEFLOW_STAGE181I_LOCAL_CALENDAR_DIRECT_SEED
  // Local-only calendar preview data. Dev/test only. Do not commit as production data.
  function getStage181ILocalCalendarSeed() {
    const now = new Date();

    const at = (offsetDays: number, hour: number, minute = 0) => {
      const d = new Date(now);
      d.setDate(now.getDate() + offsetDays);
      d.setHours(hour, minute, 0, 0);
      return d.toISOString();
    };

    const dateOnly = (offsetDays: number) => {
      const d = new Date(now);
      d.setDate(now.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };

    return {
      tasks: [
        {
          id: 'local-calendar-task-181i-1',
          title: 'Roboczy test kalendarza - dokumenty od klienta',
          status: 'todo',
          priority: 'high',
          type: 'task',
          date: dateOnly(0),
          time: '10:00',
          dueAt: at(0, 10, 0),
          due_at: at(0, 10, 0),
          scheduledAt: at(0, 10, 0),
          scheduled_at: at(0, 10, 0),
          clientId: 'local-client-181i',
          caseId: 'local-case-181i',
        },
        {
          id: 'local-calendar-task-181i-2',
          title: 'Roboczy follow-up z bardzo długą nazwą do testu ucinania tekstu w kalendarzu',
          status: 'todo',
          priority: 'medium',
          type: 'follow_up',
          date: dateOnly(0),
          time: '15:30',
          dueAt: at(0, 15, 30),
          due_at: at(0, 15, 30),
          scheduledAt: at(0, 15, 30),
          scheduled_at: at(0, 15, 30),
          clientId: 'local-client-181i',
        },
        {
          id: 'local-calendar-task-181i-3',
          title: 'Robocze zadanie jutro - test tygodnia',
          status: 'todo',
          priority: 'low',
          type: 'task',
          date: dateOnly(1),
          time: '08:45',
          dueAt: at(1, 8, 45),
          due_at: at(1, 8, 45),
          scheduledAt: at(1, 8, 45),
          scheduled_at: at(1, 8, 45),
        },
        {
          id: 'local-calendar-task-181i-4',
          title: 'Robocze zaległe zadanie - test czerwonego statusu',
          status: 'todo',
          priority: 'high',
          type: 'phone',
          date: dateOnly(-2),
          time: '11:15',
          dueAt: at(-2, 11, 15),
          due_at: at(-2, 11, 15),
          scheduledAt: at(-2, 11, 15),
          scheduled_at: at(-2, 11, 15),
        },
      ],
      events: [
        {
          id: 'local-calendar-event-181i-1',
          title: 'Robocze spotkanie demo - kalendarz widok tygodnia',
          type: 'meeting',
          status: 'scheduled',
          startAt: at(0, 12, 0),
          start_at: at(0, 12, 0),
          scheduledAt: at(0, 12, 0),
          scheduled_at: at(0, 12, 0),
          endAt: at(0, 13, 0),
          end_at: at(0, 13, 0),
          clientId: 'local-client-181i',
          caseId: 'local-case-181i',
        },
        {
          id: 'local-calendar-event-181i-2',
          title: 'Roboczy telefon kontrolny z klientem - długi tytuł do tooltipa',
          type: 'call',
          status: 'scheduled',
          startAt: at(0, 17, 0),
          start_at: at(0, 17, 0),
          scheduledAt: at(0, 17, 0),
          scheduled_at: at(0, 17, 0),
          endAt: at(0, 17, 30),
          end_at: at(0, 17, 30),
        },
        {
          id: 'local-calendar-event-181i-3',
          title: 'Roboczy przegląd pipeline na jutro',
          type: 'meeting',
          status: 'scheduled',
          startAt: at(1, 12, 0),
          start_at: at(1, 12, 0),
          scheduledAt: at(1, 12, 0),
          scheduled_at: at(1, 12, 0),
          endAt: at(1, 13, 0),
          end_at: at(1, 13, 0),
        },
      ],
    };
  }

  function appendStage181ILocalCalendarSeed(rows: any[], kind: 'tasks' | 'events') {
    if (!import.meta.env.DEV) return rows;
    const seed = getStage181ILocalCalendarSeed()[kind];
    const seen = new Set((rows || []).map((row: any) => String(row?.id || '')));
    const missing = seed.filter((row: any) => !seen.has(String(row.id)));
    return [...(rows || []), ...missing];
  }

`;

  const anchor = '  async function refreshSupabaseBundle() {';
  if (!src.includes(anchor)) {
    throw new Error('Could not find refreshSupabaseBundle anchor in Calendar.tsx');
  }

  src = src.replace(anchor, helper + anchor);

  const oldEvents = `    setEvents((bundle.events || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[]);`;
  const newEvents = `    setEvents(appendStage181ILocalCalendarSeed((bundle.events || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[], 'events') as any[]);`;

  const oldTasks = `    setTasks((bundle.tasks || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[]);`;
  const newTasks = `    setTasks(appendStage181ILocalCalendarSeed((bundle.tasks || []).map((row: any) => ({ ...row, ...normalizeWorkItem(row) })) as any[], 'tasks') as any[]);`;

  if (!src.includes(oldEvents)) throw new Error('Could not find setEvents line to patch.');
  if (!src.includes(oldTasks)) throw new Error('Could not find setTasks line to patch.');

  src = src.replace(oldEvents, newEvents);
  src = src.replace(oldTasks, newTasks);

  fs.writeFileSync(file, src, 'utf8');
  console.log('Patched Stage181I direct local calendar seed.');
} else {
  console.log('Stage181I direct local calendar seed already exists.');
}

const next = fs.readFileSync(file, 'utf8');

const failures = [];
for (const token of [
  'CLOSEFLOW_STAGE181I_LOCAL_CALENDAR_DIRECT_SEED',
  'appendStage181ILocalCalendarSeed',
  'local-calendar-task-181i-1',
  'local-calendar-task-181i-2',
  'local-calendar-task-181i-3',
  'local-calendar-task-181i-4',
  'local-calendar-event-181i-1',
  'local-calendar-event-181i-2',
  'local-calendar-event-181i-3',
  "setEvents(appendStage181ILocalCalendarSeed",
  "setTasks(appendStage181ILocalCalendarSeed",
]) {
  if (!next.includes(token)) failures.push('Missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181I local direct seed failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181I local: Calendar.tsx appends direct local task/event seed.');
