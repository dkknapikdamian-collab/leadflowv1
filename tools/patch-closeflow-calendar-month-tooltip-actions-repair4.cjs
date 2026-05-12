const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const rel = 'src/pages/Calendar.tsx';
const full = path.join(repo, rel);
let text = fs.readFileSync(full, 'utf8');

const importLine = "import '../styles/closeflow-calendar-month-tooltip-actions-repair4.css';";
if (!text.includes(importLine)) {
  const anchor = "import '../styles/closeflow-calendar-render-pipeline-repair3.css';";
  if (text.includes(anchor)) {
    text = text.replace(anchor, `${anchor}\n${importLine}`);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4 = 'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12';";
if (!text.includes("CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12")) {
  const anchor = "const CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3";
  const idx = text.indexOf(anchor);
  if (idx >= 0) {
    const lineEnd = text.indexOf('\n', idx);
    text = text.slice(0, lineEnd + 1) + marker + '\n' + text.slice(lineEnd + 1);
  } else {
    text = marker + '\n' + text;
  }
}

/*
  Add native title tooltip support without rewriting DOM content.
  This is deliberately read-only:
  - no replaceChildren
  - no text mutation
  - only title/aria-label attributes for hover and accessibility
*/
const effectMarker = 'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_EFFECT';
if (!text.includes(effectMarker)) {
  const insertAfter = "const [editSubmitting, setEditSubmitting] = useState(false);";
  const effect = `
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const raf = window.requestAnimationFrame(() => {
      const calendarHeader = document.querySelector('[data-cf-page-header-v2="calendar"]');
      if (!calendarHeader) return;

      const candidates = document.querySelectorAll<HTMLElement>([
        '.cf-calendar-month-text-row',
        '.cf-calendar-month-text-title',
        '[data-cf-month-text-kind]',
        '[data-cf-calendar-row-kind]',
        '.calendar-entry-card p',
        '.calendar-entry-card a',
        '.cf-calendar-selected-day-title-v6'
      ].join(','));

      candidates.forEach((element) => {
        const fullText = (element.textContent || '').replace(/\\s+/g, ' ').trim();
        if (!fullText) return;
        if (!element.getAttribute('title')) {
          element.setAttribute('title', fullText);
        }
        if (!element.getAttribute('aria-label')) {
          element.setAttribute('aria-label', fullText);
        }
      });
    });

    return () => window.cancelAnimationFrame(raf);
  }, [calendarView, calendarScale, currentMonth, selectedDate, events.length, tasks.length, leads.length]);
  // ${effectMarker}
`;
  if (!text.includes(insertAfter)) {
    throw new Error('Could not find editSubmitting state anchor for Repair4 effect.');
  }
  text = text.replace(insertAfter, insertAfter + '\n' + effect);
}

/*
  Make selected-day/week ScheduleEntryCard actions semantically identifiable.
  CSS can then target the action rail without relying only on Tailwind utility strings.
*/
if (!text.includes('data-cf-calendar-entry-actions="true"')) {
  const old = '<div className="flex flex-wrap gap-1.5 lg:justify-end">';
  const next = '<div data-cf-calendar-entry-actions="true" className="flex flex-wrap gap-1.5 lg:justify-end">';
  if (text.includes(old)) {
    text = text.replace(old, next);
  } else {
    throw new Error('Could not find ScheduleEntryCard action rail.');
  }
}

text = text.replace(/\n{4,}/g, '\n\n\n');
fs.writeFileSync(full, text, 'utf8');

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-month-tooltip-actions-repair4.css'
  ],
  fix: [
    'month entries one-line ellipsis',
    'native title tooltip on hover',
    'selected-day/week action rail kept in one line',
    'selected-day/week cards remain readable white cards'
  ],
  notChanged: [
    'API',
    'Supabase',
    'calendar data',
    'sidebar',
    'create/edit/delete logic',
    'routing'
  ]
};

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_AUDIT.generated.json'), JSON.stringify(audit, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_AUDIT.generated.md'), [
  '# CloseFlow Calendar Month Tooltip + Actions Repair4',
  '',
  '## Cel',
  '- Tekst w kafelkach kalendarza miesięcznego ma być jedną linią z `...`.',
  '- Po najechaniu ma być dostępny pełny tekst przez natywny `title`.',
  '- Przy zaznaczonym dniu akcje mają być czytelnie ułożone w jednej linii.',
  '',
  '## Zakres',
  '- `src/pages/Calendar.tsx`',
  '- `src/styles/closeflow-calendar-month-tooltip-actions-repair4.css`',
  '',
  '## Poza zakresem',
  '- API',
  '- Supabase',
  '- sidebar',
  '- logika tworzenia/edycji/usuwania wpisów',
  ''
].join('\n'), 'utf8');

console.log('CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_PATCH_OK');
console.log(JSON.stringify(audit, null, 2));
