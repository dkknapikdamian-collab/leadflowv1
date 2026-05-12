const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const rel = 'src/pages/Calendar.tsx';
const full = path.join(repo, rel);
let text = fs.readFileSync(full, 'utf8');

const importLine = "import '../styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css';";
if (!text.includes(importLine)) {
  const anchors = [
    "import '../styles/closeflow-calendar-v6-repair1-scope-text.css';",
    "import '../styles/closeflow-calendar-selected-day-full-labels-v6.css';",
    "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';"
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (text.includes(anchor)) {
      text = text.replace(anchor, `${anchor}\n${importLine}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2 = 'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12')) {
  const anchors = [
    'const CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT',
    'const CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6',
    'const CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4',
    'const CALENDAR_VIEW_STORAGE_KEY'
  ];
  let inserted = false;
  for (const anchor of anchors) {
    const idx = text.indexOf(anchor);
    if (idx >= 0) {
      const end = text.indexOf('\n', idx);
      text = text.slice(0, end + 1) + marker + '\n' + text.slice(end + 1);
      inserted = true;
      break;
    }
  }
  if (!inserted) text = marker + '\n' + text;
}

function removeEffect(source, markerText) {
  let result = source;
  while (result.includes(markerText)) {
    const markerIndex = result.indexOf(markerText);
    const start = result.lastIndexOf('  useEffect(() => {', markerIndex);
    if (start < 0) break;

    const closeMarkers = [
      '  }, [calendarView, selectedDate, currentMonth, events, tasks, leads, cases, clients, loading]);',
      '  }, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);'
    ];

    let end = -1;
    let close = '';
    for (const candidate of closeMarkers) {
      const found = result.indexOf(candidate, markerIndex);
      if (found >= 0 && (end < 0 || found < end)) {
        end = found;
        close = candidate;
      }
    }
    if (end < 0) break;
    result = result.slice(0, start) + result.slice(end + close.length);
  }
  return result;
}

/*
  Stop the broad DOM normalizers from touching the bottom selected-day ScheduleEntryCard.
  This is the real source of "only Zad" in the selected-day panel.
*/
text = removeEffect(text, 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT');

/*
  Narrow V4 plain-text enhancer so it never rewrites selected-day real cards.
  It may still normalize month grid rows, but must skip ScheduleEntryCard / cf-readable-card.
*/
if (text.includes("const labelNodes = Array.from(scope.querySelectorAll<HTMLElement>('span, strong, p, div, small, em, b'))\n        .filter((node) => Boolean(normalizeLabel(cleanText(node.innerText || node.textContent || ''))));")) {
  text = text.replace(
    "const labelNodes = Array.from(scope.querySelectorAll<HTMLElement>('span, strong, p, div, small, em, b'))\n        .filter((node) => Boolean(normalizeLabel(cleanText(node.innerText || node.textContent || ''))));",
    "const labelNodes = Array.from(scope.querySelectorAll<HTMLElement>('span, strong, p, div, small, em, b'))\n        .filter((node) => !node.closest('.calendar-entry-card, .cf-readable-card, [data-calendar-entry-completed]'))\n        .filter((node) => Boolean(normalizeLabel(cleanText(node.innerText || node.textContent || ''))));"
  );
}

/* Ensure candidate chooser also refuses selected-day cards if the V4 code shape changed. */
if (text.includes('const chooseRowCandidate = (labelNode: HTMLElement) => {') && !text.includes("if (labelNode.closest('.calendar-entry-card, .cf-readable-card, [data-calendar-entry-completed]')) return null;")) {
  text = text.replace(
    'const chooseRowCandidate = (labelNode: HTMLElement) => {',
    "const chooseRowCandidate = (labelNode: HTMLElement) => {\n      if (labelNode.closest('.calendar-entry-card, .cf-readable-card, [data-calendar-entry-completed]')) return null;"
  );
}

fs.writeFileSync(full, text.replace(/\n{3,}/g, '\n\n'), 'utf8');

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_AUDIT.generated.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css'
  ],
  fixed: [
    'month grid entries forced back to light background with black text',
    'V4 normalizer skips selected-day ScheduleEntryCard',
    'broad V6 full-label effect removed',
    'selected-day real cards remain readable with actual task/event title'
  ],
  notChanged: ['API', 'Supabase', 'create/edit/delete handlers', 'sidebar', 'routing']
}, null, 2), 'utf8');

console.log('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_PATCH_OK');
