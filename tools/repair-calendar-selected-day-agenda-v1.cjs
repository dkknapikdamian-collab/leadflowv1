#!/usr/bin/env node
/*
  CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V1_2026_05_13

  Cel:
  - naprawić panel "Wybrany dzień" pod kalendarzem miesięcznym,
  - wymusić pełny render wpisów przez ScheduleEntryCard,
  - odciąć panel dnia od mini-wierszy miesiąca,
  - zostawić widok miesiąca bez zmiany logiki.
*/

const fs = require('fs');
const path = require('path');

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const calendarPath = path.join(root, 'src', 'pages', 'Calendar.tsx');
const packagePath = path.join(root, 'package.json');

const MARKER = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V1_2026_05_13';
const IMPORT_LINE = "import '../styles/closeflow-calendar-selected-day-agenda-actions-v1.css';";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readFile(filePath) {
  if (!fs.existsSync(filePath)) fail(`Nie znaleziono pliku: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function writeIfChanged(filePath, before, after) {
  if (before !== after) {
    fs.writeFileSync(filePath, after, 'utf8');
    console.log(`UPDATED ${path.relative(root, filePath)}`);
  } else {
    console.log(`OK unchanged ${path.relative(root, filePath)}`);
  }
}

function ensureStyleImport(source) {
  if (source.includes(IMPORT_LINE)) return source;

  const preferred = "import '../styles/closeflow-calendar-selected-day-full-text-repair11.css';";
  if (source.includes(preferred)) {
    return source.replace(preferred, `${preferred}\n${IMPORT_LINE}`);
  }

  const lastStyleImport = [...source.matchAll(/^import ['\"][^'\"]+\.css['\"];\s*$/gm)].pop();
  if (!lastStyleImport) fail('Nie znaleziono importów CSS w Calendar.tsx. Przerywam, żeby nie robić ślepej zmiany.');

  const insertAt = lastStyleImport.index + lastStyleImport[0].length;
  return source.slice(0, insertAt) + `\n${IMPORT_LINE}` + source.slice(insertAt);
}

function findJsxSelfClosingTag(source, startIndex, tagName) {
  const start = source.indexOf(`<${tagName}`, startIndex);
  if (start < 0) return null;
  const end = source.indexOf('/>', start);
  if (end < 0) return null;
  return {
    start,
    end: end + 2,
    text: source.slice(start, end + 2),
  };
}

function indentBlock(block, spaces) {
  const pad = ' '.repeat(spaces);
  return block
    .split('\n')
    .map((line, index) => (index === 0 ? line.trimStart() : pad + line.trimStart()))
    .join('\n');
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
  if (attrIndex < 0) fail('Nie znaleziono data-cf-calendar-selected-day="true". Najpierw trzeba ustalić realny render panelu wybranego dnia.');

  const openingStart = source.lastIndexOf('<', attrIndex);
  if (openingStart < 0) fail('Nie udało się znaleźć początku taga panelu wybranego dnia.');

  const tagMatch = /^<([A-Za-z][A-Za-z0-9]*)\b/.exec(source.slice(openingStart, openingStart + 80));
  if (!tagMatch) fail('Nie udało się odczytać nazwy taga panelu wybranego dnia.');

  const tagName = tagMatch[1];
  const element = findMatchingJsxElement(source, openingStart, tagName);
  if (!element) fail(`Nie udało się znaleźć zamknięcia taga ${tagName} dla panelu wybranego dnia.`);

  return { ...element, tagName };
}

function findScheduleEntryCardTemplate(source) {
  const firstIndex = source.indexOf('<ScheduleEntryCard');
  if (firstIndex < 0) fail('Nie znaleziono użycia <ScheduleEntryCard />. To oznacza, że karta agendy została usunięta albo nazwana inaczej.');

  const tag = findJsxSelfClosingTag(source, firstIndex, 'ScheduleEntryCard');
  if (!tag) fail('Nie udało się przechwycić pełnego self-closing <ScheduleEntryCard />.');

  let text = tag.text.trim();
  if (!/entry=\{entry\}/.test(text)) {
    fail('Pierwszy znaleziony ScheduleEntryCard nie używa entry={entry}. Nie ryzykuję złego podpięcia.');
  }

  if (!/onEdit=\{/.test(text) || !/onShift=\{/.test(text) || !/onShiftHours=\{/.test(text) || !/onComplete=\{/.test(text) || !/onDelete=\{/.test(text)) {
    fail('Znaleziony ScheduleEntryCard nie ma pełnego kompletu akcji: onEdit/onShift/onShiftHours/onComplete/onDelete.');
  }

  return text;
}

function findEntriesVariable(source) {
  const match = source.match(/const\s+([A-Za-z_$][\w$]*)\s*=\s*useMemo\s*\([^;]*?combineScheduleEntries\s*\(/s);
  if (!match) {
    fail('Nie znaleziono zmiennej useMemo(...) opartej o combineScheduleEntries(...). Nie wiem, z jakiego źródła pobrać wpisy dla panelu dnia.');
  }
  return match[1];
}

function insertSelectedDayEntriesConst(source, entriesVar) {
  if (source.includes('selectedDayAgendaEntries')) return source;

  const calendarFunctionIndex = source.indexOf('export default function Calendar()');
  if (calendarFunctionIndex < 0) fail('Nie znaleziono export default function Calendar().');

  const returnIndex = source.indexOf('\n  return (', calendarFunctionIndex);
  if (returnIndex < 0) fail('Nie znaleziono głównego return w Calendar().');

  const snippet = `\n  const selectedDayAgendaEntries = sortCalendarEntriesForDisplay(getEntriesForDay(${entriesVar}, selectedDate)); // ${MARKER}\n`;
  return source.slice(0, returnIndex) + snippet + source.slice(returnIndex);
}

function replaceSelectedDayPanel(source, cardTemplate) {
  const current = findSelectedDayElement(source);

  if (current.text.includes('data-cf-calendar-selected-day-agenda-v1="true"')) {
    console.log('OK selected-day agenda already patched');
    return source;
  }

  const card = indentBlock(cardTemplate, 18);
  const replacement = `
        <section
          data-cf-calendar-selected-day="true"
          data-cf-calendar-selected-day-agenda-v1="true"
          className="cf-selected-day-agenda-v1 mt-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Wybrany dzień</p>
              <h2 className="mt-1 text-lg font-black text-slate-950">
                {format(selectedDate, 'd MMMM yyyy', { locale: pl })}
              </h2>
            </div>
            <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-black text-slate-700 shadow-sm">
              {formatCalendarItemCount(selectedDayAgendaEntries.length)}
            </Badge>
          </div>

          {selectedDayAgendaEntries.length > 0 ? (
            <div className="grid gap-2" data-cf-selected-day-entry-list="true">
              {selectedDayAgendaEntries.map((entry) => (
                ${card}
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm font-semibold text-slate-500">
              Brak zadań i wydarzeń w tym dniu.
            </div>
          )}
        </section>`;

  return source.slice(0, current.start) + replacement + source.slice(current.end);
}

function updatePackageJson() {
  if (!fs.existsSync(packagePath)) return;
  const before = readFile(packagePath);
  let pkg;
  try {
    pkg = JSON.parse(before);
  } catch (error) {
    fail(`package.json nie jest poprawnym JSON: ${error.message}`);
  }

  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:calendar:selected-day-agenda-v1'] = 'node scripts/check-calendar-selected-day-agenda-v1.cjs';

  const after = JSON.stringify(pkg, null, 2) + '\n';
  writeIfChanged(packagePath, before, after);
}

const before = readFile(calendarPath);
let after = before;
after = ensureStyleImport(after);
const entriesVar = findEntriesVariable(after);
const cardTemplate = findScheduleEntryCardTemplate(after);
after = insertSelectedDayEntriesConst(after, entriesVar);
after = replaceSelectedDayPanel(after, cardTemplate);

if (!after.includes(MARKER)) fail('Marker naprawy nie został dodany do Calendar.tsx.');
if (!after.includes('data-cf-calendar-selected-day-agenda-v1="true"')) fail('Nowy panel agendy dnia nie został dodany.');

writeIfChanged(calendarPath, before, after);
updatePackageJson();
console.log('OK calendar selected day agenda repair applied');
