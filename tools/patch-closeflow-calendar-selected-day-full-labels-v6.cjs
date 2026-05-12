const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const rel = 'src/pages/Calendar.tsx';
const full = path.join(repo, rel);
let text = fs.readFileSync(full, 'utf8');

const importLine = "import '../styles/closeflow-calendar-selected-day-full-labels-v6.css';";
if (!text.includes(importLine)) {
  const after = "import '../styles/closeflow-calendar-selected-day-readability-v5.css';";
  if (text.includes(after)) {
    text = text.replace(after, `${after}\n${importLine}`);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6 = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_2026_05_12')) {
  const anchors = ['const CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5', 'const CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4', 'const CALENDAR_VIEW_STORAGE_KEY'];
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
    let end = -1, close = '';
    for (const candidate of closeMarkers) {
      const found = result.indexOf(candidate, markerIndex);
      if (found >= 0 && (end < 0 || found < end)) { end = found; close = candidate; }
    }
    if (end < 0) break;
    result = result.slice(0, start) + result.slice(end + close.length);
  }
  return result;
}

text = removeEffect(text, 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT');

const effect = [
  "  useEffect(() => {",
  "    // CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT:",
  "    // Selected day rows need full labels and real item text, not only short badges.",
  "    if (calendarView !== 'month') return;",
  "    if (typeof document === 'undefined') return;",
  "",
  "    const normalizeKindV6 = (rawLabel: string) => {",
  "      const value = rawLabel.trim().toLowerCase();",
  "      if (value === 'zad' || value === 'zadanie') return { short: 'Zad', full: 'Zadanie', kind: 'task' };",
  "      if (value === 'wyd' || value === 'wy' || value === 'wydarzenie') return { short: 'Wyd', full: 'Wydarzenie', kind: 'event' };",
  "      if (value === 'tel' || value === 'telefon') return { short: 'Tel', full: 'Telefon', kind: 'phone' };",
  "      if (value === 'lead') return { short: 'Lead', full: 'Lead', kind: 'lead' };",
  "      return null;",
  "    };",
  "",
  "    const cleanText = (value: string) => value.replace(/\\s+/g, ' ').trim();",
  "",
  "    const stripKindPrefixV6 = (value: string, kind: { short: string; full: string; kind: string }) => {",
  "      let output = cleanText(value);",
  "      for (const prefix of [kind.full, kind.short]) {",
  "        if (output.toLowerCase().startsWith(prefix.toLowerCase())) {",
  "          output = cleanText(output.slice(prefix.length));",
  "        }",
  "      }",
  "      return output;",
  "    };",
  "",
  "    const rebuildSelectedDayRowsV6 = () => {",
  "      const header = document.querySelector('[data-cf-page-header-v2=\"calendar\"]');",
  "      const scope = header?.parentElement;",
  "      if (!scope) return;",
  "",
  "      const rows = Array.from(scope.querySelectorAll<HTMLElement>('.cf-calendar-month-text-row, .cf-calendar-selected-day-row-v6'));",
  "      for (const row of rows) {",
  "        const rawKind = cleanText(row.querySelector<HTMLElement>('.cf-calendar-month-text-type, .cf-calendar-selected-day-kind-v6')?.innerText || row.querySelector<HTMLElement>('.cf-calendar-month-text-type, .cf-calendar-selected-day-kind-v6')?.textContent || '');",
  "        const kind = normalizeKindV6(rawKind);",
  "        if (!kind) continue;",
  "",
  "        const titleNodeText = cleanText(row.querySelector<HTMLElement>('.cf-calendar-month-text-title, .cf-calendar-selected-day-title-v6')?.innerText || row.querySelector<HTMLElement>('.cf-calendar-month-text-title, .cf-calendar-selected-day-title-v6')?.textContent || '');",
  "        const attrText = cleanText(row.getAttribute('title') || row.getAttribute('aria-label') || '');",
  "        const rowText = cleanText(row.innerText || row.textContent || '');",
  "",
  "        let itemText = titleNodeText || stripKindPrefixV6(attrText, kind) || stripKindPrefixV6(rowText, kind);",
  "        itemText = stripKindPrefixV6(itemText, kind);",
  "        if (!itemText) itemText = attrText || rowText || kind.full;",
  "",
  "        const fullHoverText = cleanText(attrText || `${kind.full} ${itemText}`);",
  "        const completed = row.dataset.cfMonthTextCompleted === 'true' || row.dataset.cfSelectedCompletedV6 === 'true' || Boolean(row.querySelector('.line-through, [class*=\"line-through\"], s, del'));",
  "",
  "        row.className = 'cf-calendar-selected-day-row-v6';",
  "        row.dataset.cfSelectedKindV6 = kind.kind;",
  "        row.dataset.cfSelectedCompletedV6 = completed ? 'true' : 'false';",
  "        row.setAttribute('title', fullHoverText);",
  "        row.setAttribute('aria-label', fullHoverText);",
  "",
  "        row.replaceChildren();",
  "",
  "        const kindSpan = document.createElement('span');",
  "        kindSpan.className = 'cf-calendar-selected-day-kind-v6';",
  "        kindSpan.textContent = kind.full;",
  "",
  "        const titleSpan = document.createElement('span');",
  "        titleSpan.className = 'cf-calendar-selected-day-title-v6';",
  "        titleSpan.textContent = itemText;",
  "",
  "        row.appendChild(kindSpan);",
  "        row.appendChild(titleSpan);",
  "      }",
  "    };",
  "",
  "    const raf = window.requestAnimationFrame(rebuildSelectedDayRowsV6);",
  "    const timerA = window.setTimeout(rebuildSelectedDayRowsV6, 120);",
  "    const timerB = window.setTimeout(rebuildSelectedDayRowsV6, 420);",
  "    const timerC = window.setTimeout(rebuildSelectedDayRowsV6, 900);",
  "",
  "    return () => {",
  "      window.cancelAnimationFrame(raf);",
  "      window.clearTimeout(timerA);",
  "      window.clearTimeout(timerB);",
  "      window.clearTimeout(timerC);",
  "    };",
  "  }, [calendarView, selectedDate, currentMonth, events, tasks, leads, cases, clients, loading]);"
].join('\n') + '\n';
const insertionPoint = text.indexOf('  async function refreshSupabaseBundle()');
if (insertionPoint < 0) throw new Error('Could not find refreshSupabaseBundle insertion point.');
text = text.slice(0, insertionPoint) + effect + '\n' + text.slice(insertionPoint);

fs.writeFileSync(full, text.replace(/\n{3,}/g, '\n\n'), 'utf8');

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_AUDIT.generated.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_2026_05_12',
  changed: ['src/pages/Calendar.tsx', 'src/styles/closeflow-calendar-selected-day-full-labels-v6.css'],
  fixed: ['selected day uses full labels', 'selected day shows item title after kind', 'ellipsis and hover title retained'],
  notChanged: ['API', 'Supabase', 'handlers', 'sidebar', 'routing']
}, null, 2), 'utf8');

console.log('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_PATCH_OK');
