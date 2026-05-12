const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const rel = 'src/pages/Calendar.tsx';
const full = path.join(repo, rel);
let text = fs.readFileSync(full, 'utf8');

const oldCssImports = [
  "import '../styles/closeflow-calendar-color-tooltip-v2.css';",
  "import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';",
  "import '../styles/closeflow-calendar-month-rows-no-overlap-repair2.css';",
  "import '../styles/closeflow-calendar-month-entry-structural-fix-v3.css';",
  "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';",
  "import '../styles/closeflow-calendar-selected-day-readability-v5.css';",
  "import '../styles/closeflow-calendar-selected-day-full-labels-v6.css';",
  "import '../styles/closeflow-calendar-v6-repair1-scope-text.css';",
  "import '../styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css';"
];

const removedImports = [];
for (const imp of oldCssImports) {
  if (text.includes(imp)) {
    text = text.replace(imp + '\n', '');
    text = text.replace(imp, '');
    removedImports.push(imp);
  }
}

const importLine = "import '../styles/closeflow-calendar-render-pipeline-repair3.css';";
if (!text.includes(importLine)) {
  const anchor = "import '../styles/closeflow-calendar-skin-only-v1.css';";
  if (text.includes(anchor)) {
    text = text.replace(anchor, `${anchor}\n${importLine}`);
  } else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3 = 'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12')) {
  const anchor = 'const CLOSEFLOW_CALENDAR_SKIN_ONLY_V1';
  const idx = text.indexOf(anchor);
  if (idx >= 0) {
    const end = text.indexOf('\n', idx);
    text = text.slice(0, end + 1) + marker + '\n' + text.slice(end + 1);
  } else {
    text = marker + '\n' + text;
  }
}

function removeEffectByMarker(source, markerText) {
  let result = source;
  let removed = 0;
  while (result.includes(markerText)) {
    const markerIndex = result.indexOf(markerText);
    const start = result.lastIndexOf('  useEffect(() => {', markerIndex);
    if (start < 0) break;

    const closeStart = result.indexOf('\n  }, [', markerIndex);
    if (closeStart < 0) break;
    const closeEnd = result.indexOf(']);', closeStart);
    if (closeEnd < 0) break;

    result = result.slice(0, start) + result.slice(closeEnd + 3);
    removed += 1;
  }
  return { text: result, removed };
}

const dangerousEffectMarkers = [
  'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT',
  'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_EFFECT',
  'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2',
  'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3',
  'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4',
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5',
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'
];

const removedEffects = [];
for (const markerText of dangerousEffectMarkers) {
  const result = removeEffectByMarker(text, markerText);
  text = result.text;
  if (result.removed) removedEffects.push({ marker: markerText, removed: result.removed });
}

/*
  Extra safety: any surviving useEffect that mutates calendar rows by replaceChildren
  is a visual normalizer, not source-of-truth render. Remove it.
*/
function removeEffectContaining(source, needle) {
  let result = source;
  let removed = 0;
  let index = result.indexOf(needle);
  while (index >= 0) {
    const start = result.lastIndexOf('  useEffect(() => {', index);
    const closeStart = result.indexOf('\n  }, [', index);
    const closeEnd = closeStart >= 0 ? result.indexOf(']);', closeStart) : -1;
    if (start < 0 || closeStart < 0 || closeEnd < 0) break;
    result = result.slice(0, start) + result.slice(closeEnd + 3);
    removed += 1;
    index = result.indexOf(needle);
  }
  return { text: result, removed };
}

for (const needle of ['replaceChildren();', 'cf-calendar-selected-day-row-v6', 'cf-calendar-month-text-row']) {
  const result = removeEffectContaining(text, needle);
  text = result.text;
  if (result.removed) removedEffects.push({ marker: `contains:${needle}`, removed: result.removed });
}

text = text.replace(/\n{3,}/g, '\n\n');
fs.writeFileSync(full, text, 'utf8');

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });

const audit = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12',
  changed: ['src/pages/Calendar.tsx', 'src/styles/closeflow-calendar-render-pipeline-repair3.css'],
  removedImports,
  removedEffects,
  fixed: [
    'removed old experimental calendar visual CSS imports except base skin',
    'removed DOM visual normalizers that rewrote real entry cards into badge-only rows',
    'added final Calendar-only source-of-truth CSS for month chips and selected-day/list cards'
  ],
  notChanged: ['API', 'Supabase', 'calendar data', 'create/edit/delete handlers', 'sidebar', 'routing']
};
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_AUDIT.generated.json'), JSON.stringify(audit, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_AUDIT.generated.md'), [
  '# CloseFlow — Calendar Render Pipeline Repair3 Audit',
  '',
  '## Removed CSS imports',
  ...removedImports.map((x) => `- ${x}`),
  '',
  '## Removed runtime effects',
  ...removedEffects.map((x) => `- ${x.marker}: ${x.removed}`),
  ''
].join('\n'), 'utf8');

console.log('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_PATCH_OK');
console.log(JSON.stringify({ removedImports: removedImports.length, removedEffects }, null, 2));
