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

const importLine = "import '../styles/closeflow-calendar-color-tooltip-v2.css';";
if (!text.includes(importLine)) {
  const after = "import '../styles/closeflow-calendar-skin-only-v1.css';";
  if (text.includes(after)) {
    text = text.replace(after, `${after}\n${importLine}`);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2 = 'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12')) {
  const anchor = "const CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1";
  const idx = text.indexOf(anchor);
  if (idx >= 0) {
    const lineEnd = text.indexOf('\n', idx);
    text = text.slice(0, lineEnd + 1) + marker + '\n' + text.slice(lineEnd + 1);
  } else {
    const anchor2 = "const CALENDAR_VIEW_STORAGE_KEY";
    const idx2 = text.indexOf(anchor2);
    if (idx2 >= 0) {
      const lineStart = text.lastIndexOf('\n', idx2) + 1;
      text = text.slice(0, lineStart) + marker + '\n' + text.slice(lineStart);
    }
  }
}

const effectMarker = "CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT";
if (!text.includes(effectMarker)) {
  const effect = `
  useEffect(() => {
    // ${effectMarker}: native hover tooltips for clipped calendar text + visual type hints.
    if (typeof document === 'undefined') return;

    const inferKind = (value: string) => {
      const textValue = value.trim().toLowerCase();
      if (!textValue) return '';
      if (textValue === 'wyd' || textValue === 'wydarzenie' || textValue.startsWith('wydarzenie')) return 'event';
      if (textValue === 'zad' || textValue === 'zadanie' || textValue.startsWith('zadanie')) return 'task';
      if (textValue === 'tel' || textValue === 'telefon' || textValue.startsWith('telefon')) return 'phone';
      if (textValue === 'lead' || textValue.startsWith('lead')) return 'lead';
      return '';
    };

    const applyCalendarTextEnhancements = () => {
      const header = document.querySelector('[data-cf-page-header-v2=\"calendar\"]');
      const scope = header?.parentElement;
      if (!scope) return;

      const contentCandidates = Array.from(scope.querySelectorAll<HTMLElement>([
        '.calendar-entry-card',
        '.calendar-entry-card *',
        '[class*=\"month\"] [class*=\"entry\"]',
        '[class*=\"month\"] [class*=\"entry\"] *',
        '[class*=\"month\"] [class*=\"item\"]',
        '[class*=\"month\"] [class*=\"item\"] *',
        '[class*=\"month\"] [class*=\"chip\"]',
        '[class*=\"month\"] [class*=\"chip\"] *',
        '[class*=\"calendar\"] [class*=\"chip\"]',
        '[class*=\"calendar\"] [class*=\"chip\"] *'
      ].join(',')));

      for (const node of contentCandidates) {
        const raw = (node.innerText || node.textContent || '').replace(/\\s+/g, ' ').trim();
        if (!raw) continue;

        const kind = inferKind(raw);
        if (kind) {
          node.dataset.cfCalendarKind = kind;
          node.classList.add('cf-calendar-type-badge');

          const parent = node.parentElement;
          if (parent && parent !== scope) {
            parent.dataset.cfCalendarRowKind = kind;
          }
        }

        const isProbablyText = raw.length >= 8;
        const isClipped = node.scrollWidth > node.clientWidth + 2 || node.scrollHeight > node.clientHeight + 2;
        const isCompactCalendarText = node.matches('p,span,strong,a,button,div');

        if (isCompactCalendarText && isProbablyText && (isClipped || raw.length >= 28)) {
          if (!node.getAttribute('title')) {
            node.setAttribute('title', raw);
          }
          node.dataset.cfCalendarTooltip = 'true';
        }
      }
    };

    const raf = window.requestAnimationFrame(applyCalendarTextEnhancements);
    const timer = window.setTimeout(applyCalendarTextEnhancements, 180);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [calendarView, calendarScale, currentMonth, selectedDate, events, tasks, leads, cases, clients, loading]);
`;

  const insertionPoint = text.indexOf("  async function refreshSupabaseBundle()");
  if (insertionPoint < 0) {
    throw new Error('Could not find refreshSupabaseBundle insertion point for calendar tooltip effect.');
  }
  text = text.slice(0, insertionPoint) + effect + '\n' + text.slice(insertionPoint);
}

write(rel, text.replace(/\n{3,}/g, '\n\n'));

fs.mkdirSync(p('docs/ui'), { recursive: true });
const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-color-tooltip-v2.css'
  ],
  scope: 'Calendar content only',
  behavior: [
    'native title tooltip added when text is clipped or long',
    'task/event/lead/phone type badges get strong colors',
    'parent chips receive light color accents'
  ],
  notChanged: [
    'API',
    'Supabase',
    'create/edit/delete handlers',
    'global left sidebar',
    'Calendar layout structure'
  ]
};
fs.writeFileSync(
  p('docs/ui/CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_AUDIT.generated.json'),
  JSON.stringify(audit, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_PATCH_OK');
console.log(JSON.stringify(audit, null, 2));
