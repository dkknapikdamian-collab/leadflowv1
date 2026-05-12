const fs = require('fs');
const cp = require('child_process');

const SCRIPT_NAME = 'check:stage14i-calendar-snake-case-task-dates';
const SCRIPT_CMD = 'node scripts/check-stage14i-calendar-snake-case-task-dates.cjs';

function fail(message) {
  throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function showParseContext(text, error) {
  const match = String(error && error.message || '').match(/position (\d+)/i);
  if (!match) return String(error && error.message || error);
  const pos = Number(match[1]);
  const start = Math.max(0, pos - 220);
  const end = Math.min(text.length, pos + 220);
  return String(error.message) + '\n--- package.json context ---\n' + text.slice(start, end);
}

function parseJsonOrNull(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

function removeExistingStage14IScriptLine(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => !line.includes('"' + SCRIPT_NAME + '"'))
    .join('\n');
}

function patchPackageJson() {
  let text = read('package.json');
  text = removeExistingStage14IScriptLine(text);

  let parsed = parseJsonOrNull(text);
  if (!parsed) {
    try {
      text = cp.execFileSync('git', ['show', 'HEAD:package.json'], { encoding: 'utf8' });
      parsed = JSON.parse(text);
    } catch (error) {
      fail('package.json is not parseable and HEAD fallback failed: ' + showParseContext(text, error));
    }
  }

  const lines = text.split(/\r?\n/);
  const targetIndex = lines.findIndex((line) => line.includes('"check:page-header-stage6-final-lock"'));
  const scriptLine = '    "' + SCRIPT_NAME + '": "' + SCRIPT_CMD + '",';

  if (targetIndex >= 0) {
    lines.splice(targetIndex, 0, scriptLine);
    text = lines.join('\n');
  } else {
    parsed.scripts = parsed.scripts || {};
    parsed.scripts[SCRIPT_NAME] = SCRIPT_CMD;
    text = JSON.stringify(parsed, null, 2) + '\n';
  }

  try {
    JSON.parse(text);
  } catch (error) {
    fail('package.json still invalid after Stage14I script patch: ' + showParseContext(text, error));
  }

  write('package.json', text.endsWith('\n') ? text : text + '\n');
}

function ensureTypeFields(file, typeName, fields) {
  let source = read(file);
  const pattern = new RegExp('export type ' + typeName + ' = \\{[\\s\\S]*?\\n\\};');
  const match = source.match(pattern);
  if (!match) fail('Missing type block: ' + typeName + ' in ' + file);

  let block = match[0];
  const missing = fields.filter((field) => !block.includes(field + '?:'));
  if (missing.length === 0) return;

  const insert = missing.map((field) => '  ' + field + '?: string | Date | null;').join('\n') + '\n';
  block = block.replace(/\n\};$/, '\n' + insert + '};');
  source = source.replace(match[0], block);
  write(file, source);
}

function ensureCombineHelper() {
  let source = read('src/lib/work-items/normalize.ts');
  if (source.includes('function combineDateAndTimeFields(')) return;

  const pickIsoMatch = source.match(/function pickIso\(row: Record<string, unknown>, keys: string\[\]\) \{[\s\S]*?\n\}/);
  if (!pickIsoMatch) fail('Missing pickIso helper in normalize.ts');

  const helper = [
    '',
    'function combineDateAndTimeFields(row: Record<string, unknown>, dateKeys: string[], timeKeys: string[], fallbackTime = \'09:00\') {',
    '  const date = pickIso(row, dateKeys);',
    '  if (!date) return null;',
    "  if (date.includes('T')) return date;",
    '  const time = pickIso(row, timeKeys) || fallbackTime;',
    "  return date + 'T' + time;",
    '}',
  ].join('\n');

  source = source.replace(pickIsoMatch[0], pickIsoMatch[0] + helper);
  write('src/lib/work-items/normalize.ts', source);
}

function patchNormalizeWorkItemDateBlock() {
  let source = read('src/lib/work-items/normalize.ts');

  const replacement = [
    "  const scheduledAt = pickIso(row, ['scheduledAt', 'scheduled_at', 'dueAt', 'due_at', 'dateTime', 'date_time', 'startsAt', 'starts_at', 'startAt', 'start_at', 'scheduledDate', 'scheduled_date'])",
    "    || combineDateAndTimeFields(row, ['scheduledDate', 'scheduled_date', 'dueDate', 'due_date', 'date'], ['scheduledTime', 'scheduled_time', 'dueTime', 'due_time', 'time']);",
    '',
    "  const startAt = pickIso(row, ['startAt', 'start_at', 'startsAt', 'starts_at', 'scheduledAt', 'scheduled_at'])",
    "    || combineDateAndTimeFields(row, ['startDate', 'start_date'], ['startTime', 'start_time', 'time'])",
    '    || scheduledAt;',
    "  const endAt = pickIso(row, ['endAt', 'end_at', 'endsAt', 'ends_at'])",
    "    || combineDateAndTimeFields(row, ['endDate', 'end_date'], ['endTime', 'end_time'], '10:00');",
    "  const reminderAt = pickIso(row, ['reminderAt', 'reminder_at', 'reminder']);",
  ].join('\n');

  const blockRegex = /  const scheduledAt = [\s\S]*?\n  const reminderAt = [^\n]*;/;
  if (!blockRegex.test(source)) {
    fail('Missing normalizeWorkItem date block from scheduledAt to reminderAt');
  }

  source = source.replace(blockRegex, replacement);
  write('src/lib/work-items/normalize.ts', source);
}

function assertIncludes(file, needle) {
  const source = read(file);
  if (!source.includes(needle)) fail('Missing in ' + file + ': ' + needle);
}

patchPackageJson();

ensureTypeFields('src/lib/task-event-contract.ts', 'TaskEventDateSource', [
  'scheduled_at',
  'due_at',
  'date_time',
  'starts_at',
  'start_at',
  'ends_at',
  'end_at',
  'reminder_at',
  'scheduledDate',
  'scheduled_date',
  'scheduledTime',
  'scheduled_time',
  'dueDate',
  'due_date',
  'dueTime',
  'due_time',
  'startDate',
  'start_date',
  'startTime',
  'start_time',
  'endDate',
  'end_date',
  'endTime',
  'end_time',
]);

ensureCombineHelper();
patchNormalizeWorkItemDateBlock();

assertIncludes('src/lib/work-items/normalize.ts', "'due_at'");
assertIncludes('src/lib/work-items/normalize.ts', "'date_time'");
assertIncludes('src/lib/work-items/normalize.ts', "'starts_at'");
assertIncludes('src/lib/work-items/normalize.ts', "'scheduled_date'");
assertIncludes('src/lib/work-items/normalize.ts', "'due_time'");
assertIncludes('src/lib/work-items/normalize.ts', "'start_time'");
assertIncludes('src/lib/work-items/normalize.ts', "'reminder_at'");
assertIncludes('src/lib/work-items/normalize.ts', "return date + 'T' + time;");
assertIncludes('src/lib/task-event-contract.ts', 'due_at?:');
assertIncludes('src/lib/task-event-contract.ts', 'date_time?:');
assertIncludes('src/lib/task-event-contract.ts', 'start_time?:');

console.log('OK: Stage14I Repair6 source/package patch applied.');
