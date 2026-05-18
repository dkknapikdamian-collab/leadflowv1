const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const quietPath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content.replace(/[ \t]+$/gm, '').replace(/\r?\n/g, '\n'));
}

function replaceOnce(text, needle, replacement, label) {
  const index = text.indexOf(needle);
  if (index === -1) throw new Error('Missing replacement anchor: ' + label);
  if (text.indexOf(needle, index + needle.length) !== -1) throw new Error('Non-unique replacement anchor: ' + label);
  return text.slice(0, index) + replacement + text.slice(index + needle.length);
}

function replaceBetween(text, startNeedle, endNeedle, replacement, label, occurrence = 1) {
  let from = -1;
  let searchFrom = 0;
  for (let i = 0; i < occurrence; i += 1) {
    from = text.indexOf(startNeedle, searchFrom);
    if (from === -1) throw new Error('Missing start anchor: ' + label + ' #' + String(occurrence));
    searchFrom = from + startNeedle.length;
  }
  const to = text.indexOf(endNeedle, from);
  if (to === -1) throw new Error('Missing end anchor: ' + label);
  return text.slice(0, from) + replacement + text.slice(to);
}

function patchCalendar() {
  let text = read(calendarPath);

  // If V3 already applied locally before failing Stage114, repair only the payload fields.
  if (text.includes('STAGE123_CALENDAR_TASK_SHIFT_PAYLOAD_SOURCE')) {
    text = text.replace(/date: shiftedDate,\n\s*scheduledAt: shiftedStartAt,\n\s*dueAt: shiftedStartAt,\n\s*time: shiftedTime,/g, "date: taskPayload.date,\n          scheduledAt: taskPayload.dueAt,\n          dueAt: taskPayload.dueAt,\n          time: taskPayload.time,");
    text = text.replace(/date: taskPayload\.date,\n\s*scheduledAt: shiftedStartAt,\n\s*dueAt: shiftedStartAt,\n\s*time: taskPayload\.time,/g, "date: taskPayload.date,\n          scheduledAt: taskPayload.dueAt,\n          dueAt: taskPayload.dueAt,\n          time: taskPayload.time,");
    console.log('Stage123 Calendar patch already present. Applied Stage114 compatibility payload repair.');
  } else {
    const oldEventOptimistic = `        return {\n          ...row,\n          startAt: nextStartAt,\n          startsAt: nextStartAt,\n          scheduledAt: nextStartAt,\n          endAt: nextEndAt ?? row?.endAt ?? null,\n        };`;
    const newEventOptimistic = `        return {\n          ...row,\n          startAt: nextStartAt,\n          start_at: nextStartAt,\n          startsAt: nextStartAt,\n          starts_at: nextStartAt,\n          scheduledAt: nextStartAt,\n          scheduled_at: nextStartAt,\n          endAt: nextEndAt ?? row?.endAt ?? row?.end_at ?? null,\n          end_at: nextEndAt ?? row?.end_at ?? row?.endAt ?? null,\n        };`;
    text = replaceOnce(text, oldEventOptimistic, newEventOptimistic, 'event optimistic snake_case dates');

    const oldTaskOptimistic = `        return {\n          ...row,\n          dueAt: nextStartAt,\n          scheduledAt: nextStartAt,\n          startAt: nextStartAt,\n          startsAt: nextStartAt,\n          date: nextStartAt.slice(0, 10),\n          time: nextStartAt.slice(11, 16),\n        };`;
    const newTaskOptimistic = `        return {\n          ...row,\n          dueAt: nextStartAt,\n          due_at: nextStartAt,\n          scheduledAt: nextStartAt,\n          scheduled_at: nextStartAt,\n          startAt: nextStartAt,\n          start_at: nextStartAt,\n          startsAt: nextStartAt,\n          starts_at: nextStartAt,\n          date: nextStartAt.slice(0, 10),\n          time: nextStartAt.slice(11, 16),\n        };`;
    text = replaceOnce(text, oldTaskOptimistic, newTaskOptimistic, 'task optimistic snake_case dates');

    const dayTaskStart = `      } else if (entry.kind === 'task') {\n        const nextStart = addDays(parseISO(getTaskStartAt(entry.raw) || entry.startsAt), days);`;
    const dayLeadAnchor = `      } else if (entry.kind === 'lead') {`;
    const dayTaskReplacement = `      } else if (entry.kind === 'task') {\n        // STAGE123_CALENDAR_TASK_SHIFT_PAYLOAD_SOURCE:\n        // syncTaskDerivedFields prefers scheduledAt, so the shifted value must overwrite\n        // scheduledAt/scheduled_at before normalization. Otherwise dueAt loses to the old date.\n        const baseStart = parseISO(getTaskStartAt(entry.raw) || entry.startsAt);\n        const nextStart = addDays(baseStart, days);\n        const shiftedDate = format(nextStart, 'yyyy-MM-dd');\n        const shiftedTime = format(nextStart, 'HH:mm');\n        shiftedStartAt = toDateTimeLocalValue(nextStart);\n        const shiftedTaskDraft = {\n          ...entry.raw,\n          scheduledAt: shiftedStartAt,\n          scheduled_at: shiftedStartAt,\n          dueAt: shiftedStartAt,\n          due_at: shiftedStartAt,\n          date: shiftedDate,\n          time: shiftedTime,\n        };\n        const taskPayload = syncTaskDerivedFields(shiftedTaskDraft);\n        shiftedStartAt = String(taskPayload.scheduledAt || taskPayload.dueAt || shiftedStartAt);\n\n        await updateTaskInSupabase({\n          id: sourceId,\n          title: taskPayload.title,\n          type: readScheduleRawText(entry.raw, 'type', 'follow_up'),\n          date: shiftedDate,\n          scheduledAt: shiftedStartAt,\n          dueAt: shiftedStartAt,\n          time: shiftedTime,\n          status: taskPayload.status,\n          priority: readScheduleRawText(entry.raw, 'priority', 'medium'),\n          leadId: (taskPayload as any).leadId ?? (taskPayload as any).lead_id ?? null,\n          caseId: readCalendarRawText(entry.raw?.caseId || entry.raw?.case_id) || null,\n        });\n`;
    text = replaceBetween(text, dayTaskStart, dayLeadAnchor, dayTaskReplacement, 'day task shift branch', 1);

    const hourTaskStart = `      } else if (entry.kind === 'task') {\n        const baseStart = parseISO(getTaskStartAt(entry.raw) || entry.startsAt);\n        const nextStart = addHours(baseStart, hours);`;
    const hourLeadAnchor = `      } else if (entry.kind === 'lead') {`;
    const hourTaskReplacement = `      } else if (entry.kind === 'task') {\n        // STAGE123_CALENDAR_TASK_SHIFT_PAYLOAD_SOURCE_HOURS:\n        // See day shift branch: scheduledAt/scheduled_at must be overwritten before normalization.\n        const baseStart = parseISO(getTaskStartAt(entry.raw) || entry.startsAt);\n        const nextStart = addHours(baseStart, hours);\n        const shiftedDate = format(nextStart, 'yyyy-MM-dd');\n        const shiftedTime = format(nextStart, 'HH:mm');\n        shiftedStartAt = toDateTimeLocalValue(nextStart);\n        const shiftedTaskDraft = {\n          ...entry.raw,\n          scheduledAt: shiftedStartAt,\n          scheduled_at: shiftedStartAt,\n          dueAt: shiftedStartAt,\n          due_at: shiftedStartAt,\n          date: shiftedDate,\n          time: shiftedTime,\n        };\n        const taskPayload = syncTaskDerivedFields(shiftedTaskDraft);\n        shiftedStartAt = String(taskPayload.scheduledAt || taskPayload.dueAt || shiftedStartAt);\n\n        await updateTaskInSupabase({\n          id: sourceId,\n          title: taskPayload.title,\n          type: readScheduleRawText(entry.raw, 'type', 'follow_up'),\n          date: shiftedDate,\n          scheduledAt: shiftedStartAt,\n          dueAt: shiftedStartAt,\n          time: shiftedTime,\n          status: taskPayload.status,\n          priority: readScheduleRawText(entry.raw, 'priority', 'medium'),\n          leadId: (taskPayload as any).leadId ?? (taskPayload as any).lead_id ?? null,\n          caseId: readCalendarRawText(entry.raw?.caseId || entry.raw?.case_id) || null,\n        });\n`;
    text = replaceBetween(text, hourTaskStart, hourLeadAnchor, hourTaskReplacement, 'hour task shift branch', 1);
  }

  write(calendarPath, text);
}

function patchPackageJson() {
  const packageJson = JSON.parse(read(packagePath));
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['test:stage123-calendar-task-shift-payload-source'] = 'node --test tests/stage123-calendar-task-shift-payload-source-contract.test.cjs';
  write(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}

function patchQuietGate() {
  let text = read(quietPath);
  const stage123Path = 'tests/stage123-calendar-task-shift-payload-source-contract.test.cjs';
  const stage123 = "  '" + stage123Path + "',";
  if (!text.includes(stage123Path)) {
    const preferredAnchors = [
      /^(\s*['"]tests\/stage122-runtime-auth-api-pwa-hardening\.test\.cjs['"],\s*)$/m,
      /^(\s*['"]tests\/stage121-calendar-shift-lead-branch-contract\.test\.cjs['"],\s*)$/m,
      /^(\s*['"]tests\/stage120-calendar-local-first-sync-and-focus-contract\.test\.cjs['"],\s*)$/m,
    ];

    let patched = false;
    for (const anchor of preferredAnchors) {
      if (anchor.test(text)) {
        text = text.replace(anchor, (match) => match + '\n' + stage123);
        patched = true;
        break;
      }
    }

    if (!patched) {
      const arrayStart = text.indexOf('const requiredTests = [');
      if (arrayStart === -1) throw new Error('Missing requiredTests array for Stage123 quiet gate registration');
      const insertAt = text.indexOf('\n', arrayStart);
      if (insertAt === -1) throw new Error('Missing requiredTests array newline for Stage123 quiet gate registration');
      text = text.slice(0, insertAt + 1) + stage123 + '\n' + text.slice(insertAt + 1);
    }
  }

  const matches = text.match(/tests\/stage123-calendar-task-shift-payload-source-contract\.test\.cjs/g) || [];
  if (matches.length !== 1) throw new Error('Stage123 quiet gate registration count is ' + String(matches.length));
  write(quietPath, text);
}

patchCalendar();
patchPackageJson();
patchQuietGate();
console.log('Stage123 V4 calendar task shift payload source repair applied with Stage114 compatibility.');
