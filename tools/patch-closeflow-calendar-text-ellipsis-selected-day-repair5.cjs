const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const rel = 'src/pages/Calendar.tsx';
const full = path.join(repo, rel);
let text = fs.readFileSync(full, 'utf8');

const cssImport = "import '../styles/closeflow-calendar-text-ellipsis-selected-day-repair5.css';";
if (!text.includes(cssImport)) {
  const anchor = "import '../styles/closeflow-calendar-month-tooltip-actions-repair4.css';";
  if (text.includes(anchor)) {
    text = text.replace(anchor, `${anchor}\n${cssImport}`);
  } else {
    const alt = "import '../styles/closeflow-calendar-render-pipeline-repair3.css';";
    if (!text.includes(alt)) throw new Error('Cannot find Calendar CSS import anchor.');
    text = text.replace(alt, `${alt}\n${cssImport}`);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5 = 'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_2026_05_12';";
if (!text.includes("CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_2026_05_12")) {
  const anchor = "const CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4";
  const idx = text.indexOf(anchor);
  if (idx >= 0) {
    const lineEnd = text.indexOf('\n', idx);
    text = text.slice(0, lineEnd + 1) + marker + '\n' + text.slice(lineEnd + 1);
  } else {
    text = marker + '\n' + text;
  }
}

if (!text.includes('data-cf-calendar-entry-actions="true"')) {
  const old = '<div className="flex flex-wrap gap-1.5 lg:justify-end">';
  const next = '<div data-cf-calendar-entry-actions="true" className="flex flex-wrap gap-1.5 lg:justify-end">';
  if (!text.includes(old)) throw new Error('Cannot find ScheduleEntryCard action rail.');
  text = text.replace(old, next);
}

const effectMarker = 'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_EFFECT';
if (!text.includes(effectMarker)) {
  const insertAfter = "const [editSubmitting, setEditSubmitting] = useState(false);";
  if (!text.includes(insertAfter)) throw new Error('Cannot find editSubmitting state anchor.');

  const effect = `
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const body = document.body;
    body.classList.add('cf-calendar-route-active');

    const addTitle = (element: HTMLElement | null | undefined) => {
      if (!element) return;
      const fullText = (element.textContent || '').replace(/\\s+/g, ' ').trim();
      if (!fullText) return;
      element.setAttribute('title', fullText);
      element.setAttribute('aria-label', fullText);
    };

    const looksLikeCalendarEntry = (element: HTMLElement) => {
      if (element.closest('.calendar-entry-card')) return false;
      if (element.closest('.cf-cal-r5-selected-day-section')) return false;
      if (element.matches('button, [role="button"]') && element.textContent?.includes('+')) return false;

      const textValue = (element.textContent || '').replace(/\\s+/g, ' ').trim();
      if (!textValue) return false;
      if (textValue.length < 6) return false;
      if (/^\\+\\s*\\d+\\s*więcej$/i.test(textValue)) return false;
      if (/^(pon|wt|śro|czw|pt|sob|ndz)$/i.test(textValue)) return false;

      const hasKindSignal =
        element.matches('[data-action-kind], [data-closeflow-action-kind], [data-cf-calendar-row-kind], [data-cf-month-text-kind], .cf-action-kind-task, .cf-action-kind-event, .cf-action-color-chip') ||
        Boolean(element.querySelector('[data-action-kind], [data-closeflow-action-kind], [data-cf-entity-type], [data-cf-calendar-kind], .cf-action-color-chip'));

      const hasTextSignal = /\\b(Zad|Wyd|Lead|Tel|Mail|Spot)\\b/i.test(textValue) || /\\b\\d{1,2}:\\d{2}\\b/.test(textValue);

      let rectOk = true;
      try {
        const rect = element.getBoundingClientRect();
        rectOk = rect.width >= 40 && rect.height >= 10 && rect.height <= 42;
      } catch {
        rectOk = true;
      }

      return rectOk && (hasKindSignal || hasTextSignal);
    };

    const annotate = () => {
      const calendarHeader = document.querySelector('[data-cf-page-header-v2="calendar"]');
      if (!calendarHeader) return;

      const root =
        calendarHeader.closest('main') ||
        calendarHeader.closest('[role="main"]') ||
        calendarHeader.closest('.cf-html-shell') ||
        document.querySelector('#root') ||
        document.body;

      root.querySelectorAll<HTMLElement>('*').forEach((node) => {
        if (!looksLikeCalendarEntry(node)) return;

        const textValue = (node.textContent || '').replace(/\\s+/g, ' ').trim();
        if (!textValue) return;

        node.classList.add('cf-cal-r5-month-entry');
        addTitle(node);

        const lower = textValue.toLowerCase();
        const kind =
          lower.includes('wyd') || lower.includes('spotkanie') ? 'event' :
          lower.includes('lead') ? 'lead' :
          'task';

        node.setAttribute('data-cf-r5-kind', kind);

        Array.from(node.children).forEach((child) => {
          if (!(child instanceof HTMLElement)) return;
          const childText = (child.textContent || '').replace(/\\s+/g, ' ').trim();
          if (!childText) return;

          if (/^(Zad|Wyd|Lead|Tel|Mail)$/i.test(childText) || child.hasAttribute('data-cf-entity-type') || child.hasAttribute('data-cf-calendar-kind') || child.hasAttribute('data-action-kind') || child.hasAttribute('data-closeflow-action-kind') || child.classList.contains('cf-action-color-chip')) {
            child.classList.add('cf-cal-r5-month-badge');
            return;
          }

          child.classList.add('cf-cal-r5-month-title');
          addTitle(child);
        });

        const titleChild = node.querySelector<HTMLElement>('.cf-cal-r5-month-title');
        if (!titleChild && node.children.length === 0) {
          node.classList.add('cf-cal-r5-month-title');
        }
      });

      const labelNodes = Array.from(root.querySelectorAll<HTMLElement>('*')).filter((node) =>
        /WYBRANY\\s+DZIEŃ/i.test((node.textContent || '').replace(/\\s+/g, ' '))
      );

      labelNodes.forEach((label) => {
        let section: HTMLElement | null = label;
        for (let i = 0; i < 8 && section; i += 1) {
          if (section.querySelector('.calendar-entry-card')) break;
          section = section.parentElement;
        }

        if (!section || !section.querySelector('.calendar-entry-card')) return;
        section.classList.add('cf-cal-r5-selected-day-section');

        const cards = Array.from(section.querySelectorAll<HTMLElement>('.calendar-entry-card'));
        const commonParent = cards[0]?.parentElement;
        if (commonParent && cards.every((card) => card.parentElement === commonParent)) {
          commonParent.classList.add('cf-cal-r5-selected-day-list');
        }

        cards.forEach((card) => {
          addTitle(card.querySelector<HTMLElement>('p[title], p, a[title], a'));
          const actions = card.querySelector<HTMLElement>('[data-cf-calendar-entry-actions="true"]');
          actions?.classList.add('cf-cal-r5-selected-day-actions');
        });
      });
    };

    const raf = window.requestAnimationFrame(annotate);
    const timeout = window.setTimeout(annotate, 180);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      body.classList.remove('cf-calendar-route-active');
    };
  }, [calendarView, calendarScale, currentMonth, selectedDate, events.length, tasks.length, leads.length]);
  // ${effectMarker}
`;

  text = text.replace(insertAfter, insertAfter + '\n' + effect);
}

text = text.replace(/\n{4,}/g, '\n\n\n');
fs.writeFileSync(full, text, 'utf8');

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-text-ellipsis-selected-day-repair5.css'
  ],
  whyRepair4WasNotEnough: [
    'older Calendar skins did not expose stable class names for every month chip',
    'the previous selector relied too much on sibling scope from the page header',
    'selected-day cards were still two columns, so action buttons had no horizontal room'
  ],
  fix: [
    'Calendar route body class while Calendar is mounted',
    'runtime classes for month entries based on actual rendered nodes',
    'native title tooltip on month and selected-day text',
    'selected day cards forced into one full-width column',
    'selected-day action rail kept on one line on desktop'
  ],
  notChanged: [
    'API',
    'Supabase',
    'calendar data',
    'sidebar',
    'routing',
    'create/edit/delete logic'
  ]
};

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_AUDIT.generated.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_AUDIT.generated.md'), [
  '# Calendar Text Ellipsis + Selected Day Repair5',
  '',
  '## Werdykt',
  'Naprawa Repair4 była za słaba, bo nie trafiała stabilnie w faktycznie wyrenderowane małe wpisy miesiąca i zostawiała zaznaczony dzień w dwóch kolumnach.',
  '',
  '## Co robi Repair5',
  '- nadaje klasę `cf-calendar-route-active` na `body` tylko podczas montowania kalendarza,',
  '- oznacza realnie wyrenderowane wpisy miesiąca klasą `cf-cal-r5-month-entry`,',
  '- wymusza jedną linię + `text-overflow: ellipsis`,',
  '- dodaje `title`/`aria-label`, żeby hover pokazywał cały tekst,',
  '- zaznaczony dzień układa jako jedną kolumnę pełnej szerokości, żeby przyciski się mieściły.',
  '',
  '## Poza zakresem',
  '- API',
  '- Supabase',
  '- sidebar',
  '- logika CRUD',
  ''
].join('\n'), 'utf8');

console.log('CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_PATCH_OK');
console.log(JSON.stringify(report, null, 2));
