#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const calendarPath = path.join(ROOT, 'src', 'pages', 'Calendar.tsx');
const cssPath = path.join(ROOT, 'src', 'styles', 'closeflow-calendar-selected-day-full-text-repair11.css');
const marker = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11_2026_05_12';

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}

function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing file: ${path.relative(ROOT, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

function writeIfChanged(filePath, next) {
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (prev !== next) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, next, 'utf8');
    console.log(`[OK] saved ${path.relative(ROOT, filePath)}`);
  } else {
    console.log(`- unchanged ${path.relative(ROOT, filePath)}`);
  }
}

function insertOnce(source, needle, insert, label) {
  if (source.includes(insert.trim())) return source;
  const index = source.indexOf(needle);
  if (index === -1) fail(`Nie znaleziono anchoru: ${label}`);
  return source.slice(0, index + needle.length) + insert + source.slice(index + needle.length);
}

function addImport(source) {
  const cssImport = "import '../styles/closeflow-calendar-selected-day-full-text-repair11.css';";
  if (source.includes(cssImport)) return source;
  const anchor = "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';";
  if (!source.includes(anchor)) {
    fail('Brak importu V4 month baseline. Nie ruszam kalendarza, bo baseline nie jest aktywny.');
  }
  return source.replace(anchor, `${anchor}\n${cssImport}`);
}

function addConstant(source) {
  if (source.includes(`const CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11`)) return source;
  const anchor = "const CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4 = 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12';";
  if (!source.includes(anchor)) {
    fail('Brak stałej V4 month baseline. Najpierw sprawdź, czy Calendar.tsx jest po restore V4.');
  }
  return source.replace(anchor, `${anchor}\nconst CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11 = '${marker}';`);
}

function addSelectedDayScope(source) {
  if (source.includes('data-cf-calendar-selected-day="true"')) return source;
  const headingIndex = source.indexOf('Wybrany dzień');
  if (headingIndex === -1) {
    fail('Nie znaleziono tekstu sekcji "Wybrany dzień". To znaczy, że renderer zmienił anchor. Nie robię ślepego patcha.');
  }

  const searchStart = Math.max(0, headingIndex - 3500);
  const beforeHeading = source.slice(searchStart, headingIndex);
  const sectionLocal = Math.max(beforeHeading.lastIndexOf('<section'), beforeHeading.lastIndexOf('<div'));
  if (sectionLocal === -1) {
    fail('Nie znalazłem wrappera <section>/<div> przed "Wybrany dzień".');
  }

  const wrapperStart = searchStart + sectionLocal;
  const openEnd = source.indexOf('>', wrapperStart);
  if (openEnd === -1 || openEnd > headingIndex) {
    fail('Nie mogę domknąć tagu wrappera sekcji "Wybrany dzień".');
  }

  const openTag = source.slice(wrapperStart, openEnd + 1);
  if (openTag.includes('data-cf-calendar-selected-day')) return source;

  const patchedOpenTag = openTag.replace(/>$/, ' data-cf-calendar-selected-day="true" data-cf-calendar-selected-day-repair11="true">');
  return source.slice(0, wrapperStart) + patchedOpenTag + source.slice(openEnd + 1);
}

function addCardDataHooks(source) {
  let next = source;

  if (!next.includes('data-cf-entry-type-label="true"')) {
    next = next.replace(
      /data-cf-entity-type=\{getCalendarEntryTypeValue\(entry\)\}>/,
      'data-cf-entity-type={getCalendarEntryTypeValue(entry)} data-cf-entry-type-label="true" title={getCalendarEntryTypeLabel(entry)}>'
    );
  }

  if (!next.includes('data-cf-entry-title="true"')) {
    next = next.replace(
      /title=\{entry\.title\}>\s*\n\s*\{entry\.title\}/,
      'title={entry.title} data-cf-entry-title="true">\n            {entry.title}'
    );
  }

  if (!next.includes('data-cf-calendar-entry-card-repair11="true"')) {
    next = next.replace(
      /<div data-calendar-entry-completed=\{isCompletedEntry \? 'true' : undefined\} className=\{`calendar-entry-card/,
      '<div data-calendar-entry-completed={isCompletedEntry ? \'true\' : undefined} data-cf-calendar-entry-card-repair11="true" className={`calendar-entry-card'
    );
  }

  return next;
}

function addDomNormalizerGuards(source) {
  let next = source;

  // 1) Tooltip/type enhancer used to touch .calendar-entry-card directly. Keep month chips alive, skip full cards.
  const tooltipLoop = 'for (const node of contentCandidates) {\n';
  if (next.includes(tooltipLoop) && !next.includes('SELECTED_DAY_FULL_TEXT_REPAIR11_TOOLTIP_GUARD')) {
    next = next.replace(
      tooltipLoop,
      `${tooltipLoop}        const __tooltipGuardRepair11 = node as unknown as HTMLElement;\n        if (\n          typeof __tooltipGuardRepair11.closest === 'function' &&\n          (__tooltipGuardRepair11.closest('.calendar-entry-card') ||\n            __tooltipGuardRepair11.closest('[data-cf-calendar-selected-day="true"]') ||\n            __tooltipGuardRepair11.closest('[data-cf-selected-day-entry="true"]'))\n        ) {\n          continue; // SELECTED_DAY_FULL_TEXT_REPAIR11_TOOLTIP_GUARD\n        }\n\n`
    );
  }

  // 2) Structural month normalizer must never normalize selected-day cards. Patch only a narrow window after its marker.
  const structuralMarker = 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT';
  const markerIndex = next.indexOf(structuralMarker);
  if (markerIndex === -1) {
    fail('Brak markeru V3 structural normalizer. Nie wiem, gdzie dodać guard, więc przerywam.');
  }

  const windowEnd = Math.min(next.length, markerIndex + 9000);
  let chunk = next.slice(markerIndex, windowEnd);
  if (!chunk.includes('SELECTED_DAY_FULL_TEXT_REPAIR11_STRUCTURAL_GUARD')) {
    chunk = chunk.replace(/for \(const ([a-zA-Z_$][\w$]*) of ([^)]+)\) \{\n/g, (match, varName) => {
      const guard = `      const __structuralGuardRepair11 = ${varName} as unknown as HTMLElement;\n      if (\n        typeof __structuralGuardRepair11.closest === 'function' &&\n        (__structuralGuardRepair11.closest('.calendar-entry-card') ||\n          __structuralGuardRepair11.closest('[data-cf-calendar-selected-day="true"]') ||\n          __structuralGuardRepair11.closest('[data-cf-selected-day-entry="true"]'))\n      ) {\n        continue; // SELECTED_DAY_FULL_TEXT_REPAIR11_STRUCTURAL_GUARD\n      }\n\n`;
      return match + guard;
    });
    next = next.slice(0, markerIndex) + chunk + next.slice(windowEnd);
  }

  return next;
}

function assertNoPostV4Imports(source) {
  const forbidden = [
    'closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
    'closeflow-calendar-month-tooltip-actions-repair4.css',
    'closeflow-calendar-render-pipeline-repair3.css',
    'closeflow-calendar-selected-day-full-labels-v6.css',
    'closeflow-calendar-selected-day-readability-v5.css',
    'closeflow-calendar-text-ellipsis-selected-day-repair5.css',
    'closeflow-calendar-v6-repair1-scope-text.css'
  ];
  const active = forbidden.filter((item) => source.includes(item));
  if (active.length) {
    fail(`W Calendar.tsx dalej są aktywne stare importy post-V4: ${active.join(', ')}`);
  }
}

const css = `/* ${marker}
   Cel: naprawić wyłącznie sekcję "Wybrany dzień" pod miesiącem.
   Nie dotyka V4 month grid ani src/styles/closeflow-calendar-month-plain-text-rows-v4.css.
*/

#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card {
  display: block !important;
  width: 100% !important;
  min-height: 52px !important;
  overflow: visible !important;
  background: #ffffff !important;
  color: #0f172a !important;
  border-color: rgba(148, 163, 184, 0.45) !important;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08) !important;
}

#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card > div,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card > div {
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto !important;
  align-items: center !important;
  gap: 10px !important;
  min-width: 0 !important;
}

#root .cf-html-shell [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"],
#root [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"],
#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: auto !important;
  min-width: 94px !important;
  max-width: none !important;
  height: 26px !important;
  padding: 0 12px !important;
  overflow: visible !important;
  text-overflow: clip !important;
  white-space: nowrap !important;
  text-indent: 0 !important;
  font-size: 12px !important;
  line-height: 1 !important;
  letter-spacing: 0 !important;
  color: #1e3a8a !important;
  background: #eff6ff !important;
  border: 1px solid #bfdbfe !important;
  border-radius: 999px !important;
}

#root .cf-html-shell [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"]::before,
#root .cf-html-shell [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"]::after,
#root [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"]::before,
#root [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"]::after,
#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill::before,
#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill::after,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill::before,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill::after {
  content: none !important;
  display: none !important;
}

#root .cf-html-shell [data-cf-calendar-selected-day="true"] [data-cf-entry-title="true"],
#root [data-cf-calendar-selected-day="true"] [data-cf-entry-title="true"] {
  display: block !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: visible !important;
  white-space: normal !important;
  text-overflow: clip !important;
  color: #0f172a !important;
  font-size: 14px !important;
  line-height: 1.35 !important;
  font-weight: 800 !important;
}

#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card a,
#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card p,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card a,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card p {
  max-width: 100% !important;
}

#root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card .truncate,
#root [data-cf-calendar-selected-day="true"] .calendar-entry-card .truncate {
  overflow: visible !important;
  text-overflow: clip !important;
}

@media (max-width: 900px) {
  #root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card > div,
  #root [data-cf-calendar-selected-day="true"] .calendar-entry-card > div {
    grid-template-columns: 1fr !important;
    align-items: stretch !important;
  }

  #root .cf-html-shell [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"],
  #root [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"] {
    width: fit-content !important;
    min-width: 94px !important;
  }
}
`;

let source = read(calendarPath);
assertNoPostV4Imports(source);
source = addImport(source);
source = addConstant(source);
source = addSelectedDayScope(source);
source = addCardDataHooks(source);
source = addDomNormalizerGuards(source);
assertNoPostV4Imports(source);
writeIfChanged(calendarPath, source);
writeIfChanged(cssPath, css);
console.log('[OK] Repair11 patch complete. Month V4 was not modified directly.');
