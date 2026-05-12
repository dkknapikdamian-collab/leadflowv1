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

const importLine = "import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';";
if (!text.includes(importLine)) {
  const after = "import '../styles/closeflow-calendar-color-tooltip-v2.css';";
  const fallback = "import '../styles/closeflow-calendar-skin-only-v1.css';";
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

const marker = "const CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1 = 'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12')) {
  const anchor = "const CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2";
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

/* Make tooltip enhancer rerun after month view has painted fully.
   This is visual-only: no data mutation, no handler changes. */
const rerunMarker = 'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_TOOLTIP_RERUN';
if (!text.includes(rerunMarker) && text.includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT')) {
  const needle = "const timer = window.setTimeout(applyCalendarTextEnhancements, 180);";
  if (text.includes(needle)) {
    text = text.replace(
      needle,
      `${needle}\n    const lateTimer = window.setTimeout(applyCalendarTextEnhancements, 520); // ${rerunMarker}`
    );
  }

  const cleanupNeedle = "window.clearTimeout(timer);";
  if (text.includes(cleanupNeedle)) {
    text = text.replace(
      cleanupNeedle,
      `${cleanupNeedle}\n      window.clearTimeout(lateTimer);`
    );
  }
}

write(rel, text.replace(/\n{3,}/g, '\n\n'));

fs.mkdirSync(p('docs/ui'), { recursive: true });
const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12',
  changed: [
    'src/pages/Calendar.tsx',
    'src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css'
  ],
  scope: 'Calendar month chip visual overlap fix only',
  notChanged: [
    'API',
    'Supabase',
    'create/edit/delete handlers',
    'global left sidebar',
    'Calendar data model'
  ]
};

fs.writeFileSync(
  p('docs/ui/CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_AUDIT.generated.json'),
  JSON.stringify(audit, null, 2),
  'utf8'
);

console.log('CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_PATCH_OK');
console.log(JSON.stringify(audit, null, 2));
