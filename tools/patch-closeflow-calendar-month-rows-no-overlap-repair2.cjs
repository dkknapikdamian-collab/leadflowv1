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

const importLine = "import '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css';";
if (!text.includes(importLine)) {
  const after = "import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';";
  const fallback = "import '../styles/closeflow-calendar-color-tooltip-v2.css';";
  if (text.includes(after)) {
    text = text.replace(after, `${after}\n${importLine}`);
  } else if (text.includes(fallback)) {
    text = text.replace(fallback, `${fallback}\n${importLine}`);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2 = 'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12')) {
  const anchor = "const CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1";
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

/* Improve tooltip enhancer: if a row has multiple text children,
   move the full visible row text to the row title too. */
const repairMarker = 'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_TOOLTIP_ROW_TITLE';
if (!text.includes(repairMarker) && text.includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT')) {
  const needle = "if (!node.getAttribute('title')) {\n            node.setAttribute('title', raw);\n          }\n          node.dataset.cfCalendarTooltip = 'true';";
  if (text.includes(needle)) {
    text = text.replace(
      needle,
      `if (!node.getAttribute('title')) {\n            node.setAttribute('title', raw);\n          }\n          const row = node.closest('[data-cf-calendar-row-kind]') as HTMLElement | null;\n          if (row && !row.getAttribute('title')) {\n            row.setAttribute('title', (row.innerText || row.textContent || raw).replace(/\\\\s+/g, ' ').trim()); // ${repairMarker}\n          }\n          node.dataset.cfCalendarTooltip = 'true';`
    );
  }
}

write(rel, text.replace(/\n{3,}/g, '\n\n'));

fs.mkdirSync(p('docs/ui'), { recursive: true });
const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css'
  ],
  purpose: 'force month entries to be separate non-overlapping rows with ellipsis and hover title',
  notChanged: ['API', 'Supabase', 'handlers', 'sidebar', 'data model']
};

fs.writeFileSync(
  p('docs/ui/CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_AUDIT.generated.json'),
  JSON.stringify(audit, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_PATCH_OK');
console.log(JSON.stringify(audit, null, 2));
