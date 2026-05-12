const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function p(rel) {
  return path.join(repo, rel);
}
function read(rel) {
  return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : '';
}
function write(rel, text) {
  fs.writeFileSync(p(rel), text, 'utf8');
}

const rel = 'src/pages/Calendar.tsx';
let text = read(rel);
if (!text) throw new Error(`${rel} not found`);

const importLine = "import '../styles/closeflow-calendar-month-entry-structural-fix-v3.css';";
if (!text.includes(importLine)) {
  const after = "import '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css';";
  if (text.includes(after)) {
    text = text.replace(after, `${after}\n${importLine}`);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2 = 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12')) {
  const anchors = [
    'const CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR1',
    'const CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3',
    'const CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2'
  ];
  let inserted = false;
  for (const anchor of anchors) {
    const idx = text.indexOf(anchor);
    if (idx >= 0) {
      const lineEnd = text.indexOf('\n', idx);
      text = text.slice(0, lineEnd + 1) + marker + '\n' + text.slice(lineEnd + 1);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    const idx = text.indexOf('const CALENDAR_VIEW_STORAGE_KEY');
    if (idx >= 0) {
      const lineStart = text.lastIndexOf('\n', idx) + 1;
      text = text.slice(0, lineStart) + marker + '\n' + text.slice(lineStart);
    }
  }
}

function removeEffectIfPresent(source, markerText) {
  let result = source;
  while (result.includes(markerText)) {
    const markerIndex = result.indexOf(markerText);
    const effectStart = result.lastIndexOf('  useEffect(() => {', markerIndex);
    if (effectStart < 0) break;
    const effectEndMarker = '  }, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);';
    const effectEnd = result.indexOf(effectEndMarker, markerIndex);
    if (effectEnd < 0) break;
    const removeEnd = effectEnd + effectEndMarker.length;
    result = result.slice(0, effectStart) + result.slice(removeEnd);
  }
  return result;
}

for (const markerText of [
  'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_EFFECT',
  'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR1_EFFECT',
  'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT'
]) {
  text = removeEffectIfPresent(text, markerText);
}

const effect = [
  "  useEffect(() => {",
  "    // CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT:",
  "    // normalize compact month entries into stable one-row chips.",
  "    if (calendarView !== 'month') return;",
  "    if (typeof document === 'undefined') return;",
  "",
  "    const normalizeLabel = (rawLabel: string) => {",
  "      const value = rawLabel.trim().toLowerCase();",
  "      if (value === 'wyd' || value === 'wydarzenie') return { label: 'Wyd', kind: 'event' };",
  "      if (value === 'zad' || value === 'zadanie') return { label: 'Zad', kind: 'task' };",
  "      if (value === 'tel' || value === 'telefon') return { label: 'Tel', kind: 'phone' };",
  "      if (value === 'lead') return { label: 'Lead', kind: 'lead' };",
  "      return null;",
  "    };",
  "",
  "    const cleanText = (value: string) => value.replace(/\\s+/g, ' ').trim();",
  "",
  "    const escapeRegExp = (value: string) => value.replace(/[|\\\\{}()[\\]^$+*?.]/g, '\\\\$&');",
  "",
  "    const normalizeMonthEntries = () => {",
  "      const header = document.querySelector('[data-cf-page-header-v2=\"calendar\"]');",
  "      const scope = header?.parentElement;",
  "      if (!scope) return;",
  "",
  "      const candidates = Array.from(scope.querySelectorAll<HTMLElement>([",
  "        '[class*=\"month\"] [class*=\"entry\"]',",
  "        '[class*=\"month\"] [class*=\"item\"]',",
  "        '[class*=\"month\"] [class*=\"chip\"]',",
  "        '[class*=\"month\"] [class*=\"event\"]',",
  "        '[class*=\"month\"] [class*=\"task\"]',",
  "        '[class*=\"calendar\"] [class*=\"chip\"]'",
  "      ].join(',')));",
  "",
  "      for (const candidate of candidates) {",
  "        if (candidate.classList.contains('cf-month-entry-chip-structural')) continue;",
  "        if (candidate.closest('.cf-month-entry-chip-structural')) continue;",
  "",
  "        const fullText = cleanText(candidate.innerText || candidate.textContent || '');",
  "        if (!fullText) continue;",
  "",
  "        if (/^\\+\\s*\\d+\\s*więcej$/i.test(fullText)) {",
  "          candidate.classList.add('cf-month-entry-more');",
  "          continue;",
  "        }",
  "",
  "        const labelNode = Array.from(candidate.querySelectorAll<HTMLElement>('span, strong, p, div, small, em, b'))",
  "          .find((node) => {",
  "            const value = cleanText(node.innerText || node.textContent || '');",
  "            return Boolean(normalizeLabel(value));",
  "          });",
  "",
  "        const labelText = cleanText(labelNode?.innerText || labelNode?.textContent || '');",
  "        const directMatch = fullText.match(/^(Wyd|Wydarzenie|Zad|Zadanie|Tel|Telefon|Lead)\\b\\s*(.*)$/i);",
  "        const normalized = normalizeLabel(labelText) || normalizeLabel(directMatch?.[1] || '');",
  "        if (!normalized) continue;",
  "",
  "        let titleText = '';",
  "        if (labelNode && labelText) {",
  "          titleText = cleanText(fullText.replace(new RegExp('^' + escapeRegExp(labelText) + '\\\\b\\\\s*', 'i'), ''));",
  "        } else {",
  "          titleText = cleanText(directMatch?.[2] || '');",
  "        }",
  "",
  "        if (!titleText || titleText.length < 2) continue;",
  "",
  "        const completed = Boolean(",
  "          candidate.matches('[data-calendar-entry-completed=\"true\"], .calendar-entry-completed') ||",
  "          candidate.querySelector('[data-calendar-entry-completed=\"true\"], .calendar-entry-completed, .line-through, [class*=\"line-through\"], s, del')",
  "        );",
  "",
  "        candidate.classList.add('cf-month-entry-chip-structural');",
  "        candidate.dataset.cfMonthEntryKind = normalized.kind;",
  "        candidate.dataset.cfMonthEntryCompleted = completed ? 'true' : 'false';",
  "        candidate.dataset.cfMonthEntryStructural = 'v3-repair2';",
  "        candidate.setAttribute('title', fullText);",
  "        candidate.setAttribute('aria-label', fullText);",
  "",
  "        candidate.replaceChildren();",
  "",
  "        const badge = document.createElement('span');",
  "        badge.className = 'cf-month-entry-chip-structural__badge';",
  "        badge.textContent = normalized.label;",
  "",
  "        const title = document.createElement('span');",
  "        title.className = 'cf-month-entry-chip-structural__title';",
  "        title.textContent = titleText;",
  "",
  "        candidate.appendChild(badge);",
  "        candidate.appendChild(title);",
  "      }",
  "    };",
  "",
  "    const raf = window.requestAnimationFrame(normalizeMonthEntries);",
  "    const timerA = window.setTimeout(normalizeMonthEntries, 120);",
  "    const timerB = window.setTimeout(normalizeMonthEntries, 420);",
  "    const timerC = window.setTimeout(normalizeMonthEntries, 900);",
  "",
  "    return () => {",
  "      window.cancelAnimationFrame(raf);",
  "      window.clearTimeout(timerA);",
  "      window.clearTimeout(timerB);",
  "      window.clearTimeout(timerC);",
  "    };",
  "  }, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);"
].join('\n') + '\n';

const insertionPoint = text.indexOf('  async function refreshSupabaseBundle()');
if (insertionPoint < 0) {
  throw new Error('Could not find refreshSupabaseBundle insertion point for structural month effect.');
}
text = text.slice(0, insertionPoint) + effect + '\n' + text.slice(insertionPoint);

write(rel, text.replace(/\n{3,}/g, '\n\n'));

fs.mkdirSync(p('docs/ui'), { recursive: true });
const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-month-entry-structural-fix-v3.css'
  ],
  repair: 'Mass-checked patch script. Removes old V3/V3 Repair1 effects and inserts repaired structural month normalizer.',
  notChanged: ['API', 'Supabase', 'handlers', 'left sidebar', 'Calendar side panel', 'routing']
};

fs.writeFileSync(
  p('docs/ui/CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_AUDIT.generated.json'),
  JSON.stringify(audit, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_PATCH_OK');
console.log(JSON.stringify(audit, null, 2));
