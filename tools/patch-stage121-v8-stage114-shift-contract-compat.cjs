const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(repo, rel), 'utf8');
const write = (rel, text) => fs.writeFileSync(path.join(repo, rel), text, 'utf8');

function replaceBetween(text, startNeedle, endNeedle, replacement, label) {
  const start = text.indexOf(startNeedle);
  if (start === -1) throw new Error('Missing start anchor: ' + label);
  const end = text.indexOf(endNeedle, start);
  if (end === -1) throw new Error('Missing end anchor: ' + label);
  return text.slice(0, start) + replacement + text.slice(end);
}

function insertAfterOnce(text, anchor, addition, marker, label) {
  if (text.includes(marker)) return text;
  const index = text.indexOf(anchor);
  if (index === -1) throw new Error('Missing insert anchor: ' + label);
  return text.slice(0, index + anchor.length) + addition + text.slice(index + anchor.length);
}

function ensureImport(text) {
  const importRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/lib\/supabase-fallback['"];?/m;
  const match = importRegex.exec(text);
  if (!match) throw new Error('Missing supabase-fallback import block');
  const fullImport = match[0];
  const body = match[1];
  if (/\bupdateLeadInSupabase\b/.test(body)) return text;

  const lineBreak = fullImport.includes('\r\n') ? '\r\n' : '\n';
  const lines = body.split(/\r?\n/);
  const insertAfterIndex = lines.findIndex((line) => /\bupdateEventInSupabase\b/.test(line));
  const formattedLine = '  updateLeadInSupabase,';

  if (insertAfterIndex >= 0) {
    lines.splice(insertAfterIndex + 1, 0, formattedLine);
  } else {
    lines.push(formattedLine);
  }

  const nextImport = 'import {' + lines.join(lineBreak) + lineBreak + "} from '../lib/supabase-fallback';";
  return text.slice(0, match.index) + nextImport + text.slice(match.index + fullImport.length);
}

function patchCalendarPage() {
  const rel = 'src/pages/Calendar.tsx';
  let text = read(rel);
  text = ensureImport(text);

  const helper = [
"",
"",
"  function applyCalendarShiftOptimisticState(entry: ScheduleEntry, nextStartAt: string, nextEndAt?: string | null) {",
"    // STAGE121_CALENDAR_SHIFT_LEAD_BRANCH_AND_OPTIMISTIC_STATE:",
"    // Do not show a success toast while the visible calendar still points at the old date.",
"    const sourceId = String(entry.sourceId || entry.raw?.id || entry.id || '');",
"    const rawLeadId = String(entry.leadId || entry.raw?.leadId || entry.raw?.lead_id || entry.sourceId || '');",
"    const nextDate = parseISO(nextStartAt);",
"    if (!Number.isNaN(nextDate.getTime())) {",
"      setSelectedDate(nextDate);",
"      setCurrentMonth(nextDate);",
"    }",
"",
"    setLeads((previousLeads: any[]) => previousLeads.map((lead: any) => {",
"      const leadId = String(lead?.id || '');",
"      if (!rawLeadId || leadId !== rawLeadId) return lead;",
"      const currentItemId = String(lead?.nextActionItemId || lead?.next_action_item_id || '');",
"      const canUpdateLeadShadow = !currentItemId || !sourceId || currentItemId === sourceId || entry.kind === 'lead';",
"      if (!canUpdateLeadShadow) return lead;",
"      return {",
"        ...lead,",
"        nextActionAt: nextStartAt,",
"        next_action_at: nextStartAt,",
"        nextActionTitle: lead?.nextActionTitle || lead?.next_action_title || entry.title,",
"        next_action_title: lead?.next_action_title || lead?.nextActionTitle || entry.title,",
"        nextActionItemId: currentItemId || sourceId || null,",
"        next_action_item_id: currentItemId || sourceId || null,",
"      };",
"    }));",
"",
"    if (entry.kind === 'event') {",
"      setEvents((previousEvents: any[]) => previousEvents.map((row: any) => {",
"        const rowId = String(row?.id || '');",
"        if (rowId !== sourceId) return row;",
"        return {",
"          ...row,",
"          startAt: nextStartAt,",
"          startsAt: nextStartAt,",
"          scheduledAt: nextStartAt,",
"          endAt: nextEndAt ?? row?.endAt ?? null,",
"        };",
"      }));",
"      return;",
"    }",
"",
"    if (entry.kind === 'task') {",
"      setTasks((previousTasks: any[]) => previousTasks.map((row: any) => {",
"        const rowId = String(row?.id || '');",
"        if (rowId !== sourceId) return row;",
"        return {",
"          ...row,",
"          dueAt: nextStartAt,",
"          scheduledAt: nextStartAt,",
"          startAt: nextStartAt,",
"          startsAt: nextStartAt,",
"          date: nextStartAt.slice(0, 10),",
"          time: nextStartAt.slice(11, 16),",
"        };",
"      }));",
"    }",
"  }"
  ].join('\n');

  if (!text.includes('STAGE121_CALENDAR_SHIFT_LEAD_BRANCH_AND_OPTIMISTIC_STATE')) {
    const subscriptionMarker = /\n\s*useEffect\(\(\) => \{\r?\n\s*\/\/ STAGE114B_CALENDAR_LIVE_REFRESH_WORKSPACE_READY_CONTRACT/;
    const markerMatch = subscriptionMarker.exec(text);
    if (!markerMatch || markerMatch.index < 0) {
      throw new Error('Missing regex insert anchor: Stage121 optimistic helper before live refresh useEffect');
    }
    text = text.slice(0, markerMatch.index) + helper + text.slice(markerMatch.index);
  }

  const newShiftEntry = [
"  const handleShiftEntry = async (entry: ScheduleEntry, days: number) => {",
"    if (!hasAccess) {",
"      toast.error('Trial wygasł.');",
"      return;",
"    }",
"",
"    try {",
"      setActionPendingId(String(entry.id) + ':' + String(days));",
"      const sourceId = String(entry.sourceId || entry.raw?.id || entry.id);",
"      let shiftedStartAt = '';",
"      let shiftedEndAt: string | null = null;",
"",
"      if (entry.kind === 'event') {",
"        const baseStart = parseISO(toCalendarDateInput(entry.raw?.startAt, entry.startsAt));",
"        shiftedStartAt = toDateTimeLocalValue(addDays(baseStart, days));",
"        shiftedEndAt = entry.raw?.endAt",
"          ? toDateTimeLocalValue(addDays(parseISO(toCalendarDateInput(entry.raw.endAt, entry.endsAt || entry.startsAt)), days))",
"          : null;",
"",
"        await updateEventInSupabase({",
"          id: sourceId,",
"          title: readCalendarRawText(entry.raw?.title, entry.title),",
"          type: readCalendarRawText(entry.raw?.type, 'meeting'),",
"          startAt: shiftedStartAt,",
"          endAt: shiftedEndAt,",
"          leadId: readCalendarRawText(entry.raw?.leadId) || null,",
"          caseId: readCalendarRawText(entry.raw?.caseId) || null,",
"        });",
"      } else if (entry.kind === 'task') {",
"        const nextStart = addDays(parseISO(getTaskStartAt(entry.raw) || entry.startsAt), days);",
"        const taskPayload = syncTaskDerivedFields({",
"          ...entry.raw,",
"          dueAt: toDateTimeLocalValue(nextStart),",
"          date: format(nextStart, 'yyyy-MM-dd'),",
"          time: format(nextStart, 'HH:mm'),",
"        });",
"        shiftedStartAt = String(taskPayload.dueAt || toDateTimeLocalValue(nextStart));",
"",
"        await updateTaskInSupabase({",
"          id: sourceId,",
"          title: taskPayload.title,",
"          type: readScheduleRawText(entry.raw, 'type', 'follow_up'),",
"          date: taskPayload.date,",
"          scheduledAt: taskPayload.dueAt,",
"          dueAt: taskPayload.dueAt,",
"          time: taskPayload.time,",
"          status: taskPayload.status,",
"          priority: readScheduleRawText(entry.raw, 'priority', 'medium'),",
"          leadId: taskPayload.leadId ?? null,",
"          caseId: readCalendarRawText(entry.raw?.caseId) || null,",
"        });",
"      } else if (entry.kind === 'lead') {",
"        const nextStart = addDays(parseISO(entry.startsAt), days);",
"        shiftedStartAt = toDateTimeLocalValue(nextStart);",
"        await updateLeadInSupabase({",
"          id: sourceId,",
"          nextActionAt: shiftedStartAt,",
"          nextActionTitle: readCalendarRawText(entry.raw?.nextActionTitle || entry.raw?.next_action_title, entry.title),",
"        });",
"      } else {",
"        toast.error('Nie można przesunąć tego typu wpisu.');",
"        return;",
"      }",
"",
"      applyCalendarShiftOptimisticState(entry, shiftedStartAt, shiftedEndAt);",
"      await refreshSupabaseBundle();",
"      applyCalendarShiftOptimisticState(entry, shiftedStartAt, shiftedEndAt);",
"      toast.success(days === 1 ? 'Przesunięto o 1 dzień' : 'Przesunięto o 1 tydzień');",
"    } catch (error: any) {",
"      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');",
"    } finally {",
"      setActionPendingId(null);",
"    }",
"  };"
  ].join('\n');

  const newShiftHours = [
"  const handleShiftEntryHours = async (entry: ScheduleEntry, hours: number) => {",
"    if (!hasAccess) {",
"      toast.error('Trial wygasł.');",
"      return;",
"    }",
"",
"    try {",
"      setActionPendingId(String(entry.id) + ':h' + String(hours));",
"      const sourceId = String(entry.sourceId || entry.raw?.id || entry.id);",
"      let shiftedStartAt = '';",
"      let shiftedEndAt: string | null = null;",
"",
"      if (entry.kind === 'event') {",
"        const baseStart = parseISO(toCalendarDateInput(entry.raw?.startAt, entry.startsAt));",
"        shiftedStartAt = toDateTimeLocalValue(addHours(baseStart, hours));",
"        shiftedEndAt = entry.raw?.endAt",
"          ? toDateTimeLocalValue(addHours(parseISO(toCalendarDateInput(entry.raw.endAt, entry.endsAt || entry.startsAt)), hours))",
"          : null;",
"",
"        await updateEventInSupabase({",
"          id: sourceId,",
"          title: readCalendarRawText(entry.raw?.title, entry.title),",
"          type: readCalendarRawText(entry.raw?.type, 'meeting'),",
"          startAt: shiftedStartAt,",
"          endAt: shiftedEndAt,",
"          leadId: readCalendarRawText(entry.raw?.leadId) || null,",
"          caseId: readCalendarRawText(entry.raw?.caseId) || null,",
"        });",
"      } else if (entry.kind === 'task') {",
"        const baseStart = parseISO(getTaskStartAt(entry.raw) || entry.startsAt);",
"        const nextStart = addHours(baseStart, hours);",
"        const taskPayload = syncTaskDerivedFields({",
"          ...entry.raw,",
"          dueAt: toDateTimeLocalValue(nextStart),",
"          date: format(nextStart, 'yyyy-MM-dd'),",
"          time: format(nextStart, 'HH:mm'),",
"        });",
"        shiftedStartAt = String(taskPayload.dueAt || toDateTimeLocalValue(nextStart));",
"",
"        await updateTaskInSupabase({",
"          id: sourceId,",
"          title: taskPayload.title,",
"          type: readScheduleRawText(entry.raw, 'type', 'follow_up'),",
"          date: taskPayload.date,",
"          scheduledAt: taskPayload.dueAt,",
"          dueAt: taskPayload.dueAt,",
"          time: taskPayload.time,",
"          status: taskPayload.status,",
"          priority: readScheduleRawText(entry.raw, 'priority', 'medium'),",
"          leadId: taskPayload.leadId ?? null,",
"          caseId: readCalendarRawText(entry.raw?.caseId) || null,",
"        });",
"      } else if (entry.kind === 'lead') {",
"        const nextStart = addHours(parseISO(entry.startsAt), hours);",
"        shiftedStartAt = toDateTimeLocalValue(nextStart);",
"        await updateLeadInSupabase({",
"          id: sourceId,",
"          nextActionAt: shiftedStartAt,",
"          nextActionTitle: readCalendarRawText(entry.raw?.nextActionTitle || entry.raw?.next_action_title, entry.title),",
"        });",
"      } else {",
"        toast.error('Nie można przesunąć tego typu wpisu.');",
"        return;",
"      }",
"",
"      applyCalendarShiftOptimisticState(entry, shiftedStartAt, shiftedEndAt);",
"      await refreshSupabaseBundle();",
"      applyCalendarShiftOptimisticState(entry, shiftedStartAt, shiftedEndAt);",
"      toast.success(hours === 1 ? 'Przesunięto o 1 godzinę' : 'Przesunięto o ' + String(hours) + ' godz.');",
"    } catch (error: any) {",
"      toast.error('Nie udało się zapisać wydarzenia. Spróbuj ponownie.');",
"    } finally {",
"      setActionPendingId(null);",
"    }",
"  };"
  ].join('\n');

  text = replaceBetween(text, '  const handleShiftEntry = async (entry: ScheduleEntry, days: number) => {', '  const handleShiftEntryHours = async (entry: ScheduleEntry, hours: number) => {', newShiftEntry + '\n\n', 'handleShiftEntry');
  text = replaceBetween(text, '  const handleShiftEntryHours = async (entry: ScheduleEntry, hours: number) => {', '  const handleCompleteEntry = async (entry: ScheduleEntry) => {', newShiftHours + '\n\n', 'handleShiftEntryHours');

  if (!text.includes('/* CALENDAR_STAGE08D_NO_FIREBASE_BOOT_BLOCK GLOBAL_QUICK_ACTIONS_STAGE08D_CALENDAR_MODAL_EVENT_BUS */')) {
    throw new Error('Calendar tail marker missing after Stage121 patch');
  }
  write(rel, text);
}

function patchPackageJson() {
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['test:stage121-calendar-shift-lead-branch'] = 'node --test tests/stage121-calendar-shift-lead-branch-contract.test.cjs';
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
}

function patchQuietGate() {
  const rel = 'scripts/closeflow-release-check-quiet.cjs';
  let text = read(rel);
  const testPath = 'tests/stage121-calendar-shift-lead-branch-contract.test.cjs';
  if (!text.includes(testPath)) {
    const anchor = "  'tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs',";
    if (text.includes(anchor)) text = text.replace(anchor, anchor + "\n  '" + testPath + "',");
    else {
      const fallback = "  'tests/stage119-calendar-release-gate-trust.test.cjs',";
      if (!text.includes(fallback)) throw new Error('Missing quiet gate insertion anchor for Stage121');
      text = text.replace(fallback, fallback + "\n  '" + testPath + "',");
    }
  }
  const count = text.split(testPath).length - 1;
  if (count !== 1) throw new Error('Stage121 quiet gate entry count must be 1, got ' + count);
  write(rel, text);
}

patchCalendarPage();
patchPackageJson();
patchQuietGate();
console.log('Stage121 V8 calendar shift Stage114 contract compat patch applied.');
