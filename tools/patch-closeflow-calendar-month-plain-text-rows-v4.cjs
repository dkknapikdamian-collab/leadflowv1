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

const importLine = "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';";
if (!text.includes(importLine)) {
  const after = "import '../styles/closeflow-calendar-month-entry-structural-fix-v3.css';";
  if (text.includes(after)) {
    text = text.replace(after, `${after}\n${importLine}`);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4 = 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12')) {
  const anchor = 'const CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2';
  const idx = text.indexOf(anchor);
  if (idx >= 0) {
    const lineEnd = text.indexOf('\n', idx);
    text = text.slice(0, lineEnd + 1) + marker + '\n' + text.slice(lineEnd + 1);
  } else {
    const idx2 = text.indexOf('const CALENDAR_VIEW_STORAGE_KEY');
    if (idx2 >= 0) {
      const lineStart = text.lastIndexOf('\n', idx2) + 1;
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
    const closeMarkers = [
      '  }, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);',
      '  }, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients]);'
    ];
    let effectEnd = -1;
    let effectEndMarker = '';
    for (const candidate of closeMarkers) {
      const found = result.indexOf(candidate, markerIndex);
      if (found >= 0 && (effectEnd < 0 || found < effectEnd)) {
        effectEnd = found;
        effectEndMarker = candidate;
      }
    }
    if (effectEnd < 0) break;
    const removeEnd = effectEnd + effectEndMarker.length;
    result = result.slice(0, effectStart) + result.slice(removeEnd);
  }
  return result;
}

for (const markerText of [
  'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT'
]) {
  text = removeEffectIfPresent(text, markerText);
}

const effect = [
  "  useEffect(() => {",
  "    // CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT:",
  "    // Month cells must use plain one-line text rows, not mini-cards.",
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
  "    const stripLeadingType = (fullText: string, label: string) => {",
  "      const lower = fullText.toLowerCase();",
  "      const normalizedLabel = label.toLowerCase();",
  "      if (lower.startsWith(normalizedLabel)) {",
  "        return cleanText(fullText.slice(label.length));",
  "      }",
  "      return fullText;",
  "    };",
  "",
  "    const chooseRowCandidate = (labelNode: HTMLElement) => {",
  "      let current: HTMLElement | null = labelNode;",
  "      for (let depth = 0; current && depth < 7; depth += 1) {",
  "        const raw = cleanText(current.innerText || current.textContent || '');",
  "        const directLabel = cleanText(labelNode.innerText || labelNode.textContent || '');",
  "        const labelCount = Array.from(current.querySelectorAll<HTMLElement>('span, strong, p, div, small, em, b'))",
  "          .filter((node) => Boolean(normalizeLabel(cleanText(node.innerText || node.textContent || '')))).length;",
  "",
  "        if (raw && raw !== directLabel && raw.length <= 120 && labelCount === 1 && !/^\\+\\s*\\d+\\s*więcej$/i.test(raw)) {",
  "          return current;",
  "        }",
  "",
  "        current = current.parentElement;",
  "      }",
  "      return null;",
  "    };",
  "",
  "    const normalizeMonthPlainRows = () => {",
  "      const header = document.querySelector('[data-cf-page-header-v2=\"calendar\"]');",
  "      const scope = header?.parentElement;",
  "      if (!scope) return;",
  "",
  "      const moreRows = Array.from(scope.querySelectorAll<HTMLElement>('a,button,div,span,p,strong'));",
  "      for (const node of moreRows) {",
  "        const raw = cleanText(node.innerText || node.textContent || '');",
  "        if (/^\\+\\s*\\d+\\s*więcej$/i.test(raw)) {",
  "          node.classList.add('cf-calendar-month-more-row');",
  "          node.setAttribute('title', raw);",
  "        }",
  "      }",
  "",
  "      const labelNodes = Array.from(scope.querySelectorAll<HTMLElement>('span, strong, p, div, small, em, b'))",
  "        .filter((node) => Boolean(normalizeLabel(cleanText(node.innerText || node.textContent || ''))));",
  "",
  "      const seen = new Set<HTMLElement>();",
  "",
  "      for (const labelNode of labelNodes) {",
  "        const normalized = normalizeLabel(cleanText(labelNode.innerText || labelNode.textContent || ''));",
  "        if (!normalized) continue;",
  "",
  "        const row = chooseRowCandidate(labelNode);",
  "        if (!row || seen.has(row)) continue;",
  "        seen.add(row);",
  "",
  "        const fullText = cleanText(row.innerText || row.textContent || '');",
  "        if (!fullText || fullText.length < 4) continue;",
  "",
  "        const titleText = stripLeadingType(fullText, normalized.label);",
  "        if (!titleText || titleText.length < 2) continue;",
  "",
  "        const completed = Boolean(",
  "          row.matches('[data-calendar-entry-completed=\"true\"], .calendar-entry-completed') ||",
  "          row.querySelector('[data-calendar-entry-completed=\"true\"], .calendar-entry-completed, .line-through, [class*=\"line-through\"], s, del')",
  "        );",
  "",
  "        row.className = 'cf-calendar-month-text-row';",
  "        row.dataset.cfMonthTextKind = normalized.kind;",
  "        row.dataset.cfMonthTextCompleted = completed ? 'true' : 'false';",
  "        row.dataset.cfMonthTextRow = 'v4';",
  "        row.setAttribute('title', fullText);",
  "        row.setAttribute('aria-label', fullText);",
  "",
  "        row.replaceChildren();",
  "",
  "        const type = document.createElement('span');",
  "        type.className = 'cf-calendar-month-text-type';",
  "        type.textContent = normalized.label;",
  "",
  "        const title = document.createElement('span');",
  "        title.className = 'cf-calendar-month-text-title';",
  "        title.textContent = titleText;",
  "",
  "        row.appendChild(type);",
  "        row.appendChild(title);",
  "      }",
  "    };",
  "",
  "    const raf = window.requestAnimationFrame(normalizeMonthPlainRows);",
  "    const timerA = window.setTimeout(normalizeMonthPlainRows, 120);",
  "    const timerB = window.setTimeout(normalizeMonthPlainRows, 420);",
  "    const timerC = window.setTimeout(normalizeMonthPlainRows, 900);",
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
  throw new Error('Could not find refreshSupabaseBundle insertion point for plain text month effect.');
}
text = text.slice(0, insertionPoint) + effect + '\n' + text.slice(insertionPoint);

write(rel, text.replace(/\n{3,}/g, '\n\n'));

fs.mkdirSync(p('docs/ui'), { recursive: true });
const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-month-plain-text-rows-v4.css'
  ],
  effect: 'Month entries are normalized to plain text rows with nowrap, ellipsis and title hover.',
  notChanged: ['API', 'Supabase', 'handlers', 'left sidebar', 'Calendar side panel', 'routing']
};

fs.writeFileSync(
  p('docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_AUDIT.generated.json'),
  JSON.stringify(audit, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_PATCH_OK');
console.log(JSON.stringify(audit, null, 2));
