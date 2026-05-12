#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendarPath = path.join(root, 'src/pages/Calendar.tsx');

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}
function ok(message) {
  console.log(`[OK] ${message}`);
}
function write(file, value) {
  fs.writeFileSync(file, value, 'utf8');
  ok(`saved ${path.relative(root, file)}`);
}
function replaceOnce(source, needle, replacement, label) {
  if (!source.includes(needle)) fail(`Missing patch anchor: ${label}`);
  return source.replace(needle, replacement);
}

if (!fs.existsSync(calendarPath)) fail('Missing src/pages/Calendar.tsx');
let calendar = fs.readFileSync(calendarPath, 'utf8');

if (!calendar.includes("closeflow-calendar-month-plain-text-rows-v4.css")) {
  fail('V4 month import missing. Aborting because month baseline is not confirmed.');
}

const oldImport = "import '../styles/closeflow-calendar-selected-day-full-text-repair11.css';";
const newImport = "import '../styles/closeflow-calendar-selected-day-full-text-repair12.css';";
if (calendar.includes(oldImport)) {
  calendar = calendar.replace(oldImport, newImport);
  ok('replaced Repair11 CSS import with Repair12 CSS import');
} else if (!calendar.includes(newImport)) {
  const v4Import = "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';";
  calendar = replaceOnce(calendar, v4Import, `${v4Import}\n${newImport}`, 'V4 import for Repair12 CSS');
  ok('added Repair12 CSS import after V4 import');
}

if (!calendar.includes("CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR12")) {
  const constAnchor = "const CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11 = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11_2026_05_12';";
  const constInsert = `${constAnchor}\nconst CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR12 = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR12_2026_05_12';`;
  if (calendar.includes(constAnchor)) {
    calendar = calendar.replace(constAnchor, constInsert);
  } else {
    const v4Const = "const CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4 = 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12';";
    calendar = replaceOnce(calendar, v4Const, `${v4Const}\nconst CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR12 = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR12_2026_05_12';`, 'V4 const for Repair12 marker');
  }
  ok('added Repair12 const marker');
}

// Strengthen the selected day card root marker without changing its visual layout.
if (calendar.includes('data-cf-calendar-entry-card-repair11="true"') && !calendar.includes('data-cf-calendar-entry-card-repair12="true"')) {
  calendar = calendar.replace(
    'data-cf-calendar-entry-card-repair11="true"',
    'data-cf-calendar-entry-card-repair11="true" data-cf-calendar-entry-card-repair12="true"'
  );
  ok('added Repair12 card marker');
}

// Tooltip enhancer previously scanned .calendar-entry-card and could mark selected-day cards like compact month badges.
if (!calendar.includes('SELECTED_DAY_FULL_TEXT_REPAIR12_TOOLTIP_GUARD')) {
  const tooltipAnchor = "      for (const node of contentCandidates) {\n        const raw = (node.innerText || node.textContent || '').replace(/\\s+/g, ' ').trim();";
  const tooltipReplacement = "      for (const node of contentCandidates) {\n        if (\n          node.closest('[data-cf-calendar-selected-day=\"true\"]') ||\n          node.closest('[data-cf-calendar-entry-card-repair11=\"true\"]') ||\n          node.closest('[data-cf-calendar-entry-card-repair12=\"true\"]') ||\n          node.closest('.calendar-entry-card')\n        ) {\n          // SELECTED_DAY_FULL_TEXT_REPAIR12_TOOLTIP_GUARD\n          continue;\n        }\n\n        const raw = (node.innerText || node.textContent || '').replace(/\\s+/g, ' ').trim();";
  calendar = replaceOnce(calendar, tooltipAnchor, tooltipReplacement, 'tooltip contentCandidates loop');
  ok('added tooltip guard for selected-day cards');
}

// Structural month normalizer must never transform selected-day cards. Patch only the structural effect section.
if (!calendar.includes('SELECTED_DAY_FULL_TEXT_REPAIR12_STRUCTURAL_GUARD')) {
  const structuralMarker = '// CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT:';
  const start = calendar.indexOf(structuralMarker);
  if (start < 0) fail('Missing structural effect marker');

  const nextEffect = calendar.indexOf('  useEffect(() => {', start + structuralMarker.length);
  const end = nextEffect > start ? nextEffect : calendar.indexOf('  const allEntries', start);
  if (end <= start) fail('Could not isolate structural effect section');

  let before = calendar.slice(0, start);
  let section = calendar.slice(start, end);
  let after = calendar.slice(end);

  let inserted = 0;
  section = section.replace(/for \(const ([A-Za-z_$][\w$]*) of ([^)]+)\) \{\n/g, (match, variable) => {
    inserted += 1;
    return `${match}        if (${variable} instanceof HTMLElement && (\n          ${variable}.closest('[data-cf-calendar-selected-day=\"true\"]') ||\n          ${variable}.closest('[data-cf-calendar-entry-card-repair11=\"true\"]') ||\n          ${variable}.closest('[data-cf-calendar-entry-card-repair12=\"true\"]') ||\n          ${variable}.closest('.calendar-entry-card')\n        )) {\n          // SELECTED_DAY_FULL_TEXT_REPAIR12_STRUCTURAL_GUARD\n          continue;\n        }\n\n`;
  });

  if (inserted < 1) fail('No structural loop patched. Aborting to avoid fake guard.');
  calendar = before + section + after;
  ok(`added structural guard to ${inserted} loop(s)`);
}

// Selected day wrapper marker from Repair11 is required; Repair12 does not alter the month V4 renderer.
if (!calendar.includes('data-cf-calendar-selected-day="true"')) {
  fail('Selected day wrapper marker missing after patch.');
}

if (calendar.includes("closeflow-calendar-selected-day-full-text-repair11.css")) {
  fail('Repair11 CSS import is still active.');
}

write(calendarPath, calendar);
console.log('[OK] Repair12 patch complete. V4 month CSS file was not modified.');
