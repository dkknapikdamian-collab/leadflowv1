#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const fail = (message) => {
  console.error('FAIL task reminders:', message);
  process.exit(1);
};
const pass = (message) => console.log('PASS task reminders:', message);

const tasks = read('src/pages/Tasks.tsx');
const options = read('src/lib/options.ts');

function getBetween(source, startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle);
  if (start === -1) return '';
  const end = source.indexOf(endNeedle, start);
  return source.slice(start, end === -1 ? source.length : end);
}

const toggleBlock = getBetween(tasks, 'const toggleTask = async', 'const rescheduleTask = async');
const rescheduleBlock = getBetween(tasks, 'const rescheduleTask = async', 'const deleteTask = async');

if (!tasks.includes('TASK_REMINDERS_STAGE45A_GUARD')) fail('missing Stage45A guard marker in Tasks.tsx');
if (!tasks.includes('TASK_REMINDER_OPTIONS_STAGE45A_NEW')) fail('new task form does not expose reminder editor');
if (!tasks.includes('TASK_REMINDER_OPTIONS_STAGE45A_EDIT')) fail('edit task form does not expose reminder editor');
if (!toggleBlock.includes('TASK_REMINDER_PRESERVE_ON_STATUS_TOGGLE_STAGE45A')) fail('toggle task status may drop reminder fields');
if (!toggleBlock.includes('scheduledAt: task?.scheduledAt') || !toggleBlock.includes('reminderAt: task?.reminderAt') || !toggleBlock.includes('recurrenceRule: task?.recurrenceRule')) fail('toggle task status does not preserve scheduling/reminder fields');
if (!rescheduleBlock.includes('TASK_REMINDER_SHIFT_WITH_RESCHEDULE_STAGE45A')) fail('reschedule task does not handle reminderAt');
if (!rescheduleBlock.includes('inferredReminderMinutes')) fail('reschedule task must infer reminder offset from stored reminderAt');
if (!tasks.includes('toReminderAtIso(payload.dueAt, payload.reminder)')) fail('task create/edit does not calculate reminderAt from reminder config');
if (!rescheduleBlock.includes('reminderAt: nextReminderAt')) fail('reschedule flow must write nextReminderAt');

const localAddTaskCta = /<Button\b(?=[\s\S]{0,900}?setIsNewTaskOpen\(true\))(?=[\s\S]{0,900}?(?:\+\s*)?Dodaj zadanie)[\s\S]{0,1200}?<\/Button>/m;
if (localAddTaskCta.test(tasks)) fail('local Dodaj zadanie CTA still exists in /tasks page');

if (!options.includes("{ value: 15, label: '15 minut wcześniej' }")) fail('REMINDER_OFFSET_OPTIONS misses 15 minutes option');
if (/Odpisac|Wyslij oferte|Wlasne wydarzenie|Co tydzien|Co miesiac|wczesniej|Sredni/.test(options)) fail('options.ts still contains known mojibake/no-diacritic labels');

pass('Tasks page has reminder editor, preserved reminder fields, shifted reminderAt on reschedule, and no local add-task CTA.');
