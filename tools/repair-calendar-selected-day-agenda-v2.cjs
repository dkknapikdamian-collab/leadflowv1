#!/usr/bin/env node
/*
  CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V2_2026_05_13

  Cel:
  - wymusic realny osobny panel agendy dla "Wybrany dzien",
  - uzyc pelnej karty ScheduleEntryCard z akcjami,
  - nie uzywac mini-wierszy miesiaca w panelu dnia,
  - zostawic widok miesieczny bez zmiany logiki.
*/

const fs = require('fs');
const path = require('path');

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const calendarPath = path.join(root, 'src', 'pages', 'Calendar.tsx');
const packagePath = path.join(root, 'package.json');

const MARKER = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V2_2026_05_13';
const IMPORT_LINE = "import '../styles/closeflow-calendar-selected-day-agenda-actions-v2.css';";
const CHECK_SCRIPT = 'check:calendar:selected-day-agenda-v2';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readFile(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeIfChanged(filePath, before, after) {
  if (before !== after) {
    writeFile(filePath, after);
    console.log(`UPDATED ${path.relative(root, filePath)}`);
    return true;
  }
  console.log(`UNCHANGED ${path.relative(root, filePath)}`);
  return false;
}

function ensureStyleImport(source) {
  if (source.includes(IMPORT_LINE)) return source;

  const anchors = [
    "import '../styles/closeflow-calendar-selected-day-agenda-actions-v1.css';",
    "import '../styles/closeflow-calendar-selected-day-full-text-repair11.css';",
    "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';",
  ];

  for (const anchor of anchors) {
    if (source.includes(anchor)) {
      return source.replace(anchor, `${anchor}\n${IMPORT_LINE}`);
    }
  }

  const lastStyleImport = [...source.matchAll(/^import ['\"][^'\"]+\.css['\"];\s*$/gm)].pop();
  if (!lastStyleImport) fail('Calendar.tsx has no CSS imports. Stop to avoid blind patch.');
  const insertAt = lastStyleImport.index + lastStyleImport[0].length;
  return source.slice(0, insertAt) + `\n${IMPORT_LINE}` + source.slice(insertAt);
}

function findMatchingJsxElement(source, openingStart, tagName) {
  const tagRegex = new RegExp(`<\\/?${tagName}\\b[^>]*?>`, 'g');
  tagRegex.lastIndex = openingStart;
  let depth = 0;
  let match;

  while ((match = tagRegex.exec(source))) {
    const tag = match[0];
    const isClosing = tag.startsWith(`</${tagName}`);
    const isSelfClosing = /\/\s*>$/.test(tag);
    if (!isClosing && !isSelfClosing) depth += 1;
    if (isClosing) depth -= 1;
    if (depth === 0) {
      return {
        start: openingStart,
        end: match.index + tag.length,
        text: source.slice(openingStart, match.index + tag.length),
      };
    }
  }
  return null;
}

function findSelectedDayElement(source) {
  const attrIndex = source.indexOf('data-cf-calendar-selected-day="true"');
  if (attrIndex < 0) {
    fail('Calendar.tsx has no data-cf-calendar-selected-day="true". Need manual mapping of selected day panel.');
  }
  const openingStart = source.lastIndexOf('<', attrIndex);
  if (openingStart < 0) fail('Cannot find selected-day opening tag.');
  const tagMatch = /^<([A-Za-z][A-Za-z0-9]*)\b/.exec(source.slice(openingStart, openingStart + 120));
  if (!tagMatch) fail('Cannot detect selected-day tag name.');
  const tagName = tagMatch[1];
  const element = findMatchingJsxElement(source, openingStart, tagName);
  if (!element) fail(`Cannot find matching closing tag for selected-day ${tagName}.`);
  return { ...element, tagName };
}

function findJsxSelfClosingTag(source, startIndex, tagName) {
  const start = source.indexOf(`<${tagName}`, startIndex);
  if (start < 0) return null;

  let cursor = start;
  let quote = null;
  let braceDepth = 0;
  while (cursor < source.length) {
    const ch = source[cursor];
    const next = source[cursor + 1];
    if (quote) {
      if (ch === quote && source[cursor - 1] !== '\\') quote = null;
      cursor += 1;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      cursor += 1;
      continue;
    }
    if (ch === '{') braceDepth += 1;
    if (ch === '}') braceDepth = Math.max(0, braceDepth - 1);
    if (braceDepth === 0 && ch === '/' && next === '>') {
      return { start, end: cursor + 2, text: source.slice(start, cursor + 2) };
    }
    cursor += 1;
  }
  return null;
}

function normalizeCardTemplate(text) {
  const trimmed = text.trim();
  if (!trimmed.includes('entry={entry}')) {
    fail('Found ScheduleEntryCard, but it does not use entry={entry}. Stop to avoid wrong render.');
  }
  for (const prop of ['onEdit={', 'onShift={', 'onShiftHours={', 'onComplete={', 'onDelete={']) {
    if (!trimmed.includes(prop)) fail(`ScheduleEntryCard is missing ${prop}`);
  }
  return trimmed;
}

function findScheduleEntryCardTemplate(source) {
  const selectedPanelIndex = source.indexOf('data-cf-calendar-selected-day="true"');
  const firstAfterSelected = selectedPanelIndex >= 0 ? source.indexOf('<ScheduleEntryCard', selectedPanelIndex) : -1;
  const firstGlobal = source.indexOf('<ScheduleEntryCard');
  const startIndex = firstAfterSelected >= 0 ? firstAfterSelected : firstGlobal;
  if (startIndex < 0) fail('No <ScheduleEntryCard /> usage found in Calendar.tsx.');
  const tag = findJsxSelfClosingTag(source, startIndex, 'ScheduleEntryCard');
  if (!tag) fail('Could not extract full self-closing <ScheduleEntryCard />.');
  return normalizeCardTemplate(tag.text);
}

function findEntriesVariable(source) {
  const candidates = [
    /const\s+([A-Za-z_$][\w$]*)\s*=\s*useMemo\s*\([\s\S]*?combineScheduleEntries\s*\(/,
    /const\s+([A-Za-z_$][\w$]*)\s*=\s*combineScheduleEntries\s*\(/,
  ];
  for (const rx of candidates) {
    const match = source.match(rx);
    if (match) return match[1];
  }
  // last-resort detection by known local names used in prior patches
  for (const name of ['scheduleEntries', 'calendarEntries', 'entries', 'allEntries']) {
    if (new RegExp(`\\bconst\\s+${name}\\b`).test(source)) return name;
  }
  fail('Cannot find schedule entries variable based on combineScheduleEntries(...).');
}

function ensureSelectedDayEntriesConst(source, entriesVar) {
  const constLine = `const selectedDayAgendaEntriesV2 = sortCalendarEntriesForDisplay(getEntriesForDay(${entriesVar}, selectedDate));`;
  if (source.includes('selectedDayAgendaEntriesV2')) return source;

  const functionIndex = source.indexOf('export default function Calendar()');
  if (functionIndex < 0) fail('Cannot find Calendar component function.');
  const returnIndex = source.indexOf('\n  return (', functionIndex);
  if (returnIndex < 0) fail('Cannot find main return in Calendar component.');

  return source.slice(0, returnIndex) + `\n  ${constLine} // ${MARKER}\n` + source.slice(returnIndex);
}

function indentBlock(block, spaces) {
  const pad = ' '.repeat(spaces);
  return block.split('\n').map((line, idx) => (idx === 0 ? line.trimStart() : pad + line.trimStart())).join('\n');
}

function buildReplacementPanel(cardTemplate) {
  const card = indentBlock(cardTemplate, 18);
  return `
        <section
          data-cf-calendar-selected-day="true"
          data-cf-calendar-selected-day-agenda-v2="true"
          className="cf-selected-day-agenda-v2 mt-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Wybrany dzien</p>
              <h2 className="mt-1 text-lg font-black text-slate-950">
                {format(selectedDate, 'd MMMM yyyy', { locale: pl })}
              </h2>
            </div>
            <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-black text-slate-700 shadow-sm">
              {formatCalendarItemCount(selectedDayAgendaEntriesV2.length)}
            </Badge>
          </div>

          {selectedDayAgendaEntriesV2.length > 0 ? (
            <div className="grid gap-2" data-cf-selected-day-entry-list-v2="true">
              {selectedDayAgendaEntriesV2.map((entry) => (
                ${card}
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm font-semibold text-slate-500">
              Brak zadan i wydarzen w tym dniu.
            </div>
          )}
        </section>`;
}

function replaceSelectedDayPanel(source, cardTemplate) {
  const selected = findSelectedDayElement(source);
  const replacement = buildReplacementPanel(cardTemplate);
  return source.slice(0, selected.start) + replacement + source.slice(selected.end);
}

function updatePackageJson() {
  if (!fs.existsSync(packagePath)) return false;
  const before = readFile(packagePath);
  let pkg;
  try { pkg = JSON.parse(before); } catch (error) { fail(`package.json parse failed: ${error.message}`); }
  pkg.scripts = pkg.scripts || {};
  pkg.scripts[CHECK_SCRIPT] = 'node scripts/check-calendar-selected-day-agenda-v2.cjs';
  const after = JSON.stringify(pkg, null, 2) + '\n';
  return writeIfChanged(packagePath, before, after);
}

const before = readFile(calendarPath);
let after = before;
after = ensureStyleImport(after);
const entriesVar = findEntriesVariable(after);
const cardTemplate = findScheduleEntryCardTemplate(after);
after = ensureSelectedDayEntriesConst(after, entriesVar);
after = replaceSelectedDayPanel(after, cardTemplate);

if (!after.includes(MARKER)) fail('V2 marker not found in Calendar.tsx after patch.');
if (!after.includes('data-cf-calendar-selected-day-agenda-v2="true"')) fail('V2 selected-day agenda marker not found.');
if (!after.includes('selectedDayAgendaEntriesV2.map')) fail('V2 selected-day agenda does not render entry map.');
if (!after.includes('<ScheduleEntryCard')) fail('V2 selected-day agenda does not render ScheduleEntryCard.');

writeIfChanged(calendarPath, before, after);
updatePackageJson();
console.log('OK calendar selected-day agenda v2 repair applied');
