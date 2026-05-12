const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const rel = 'src/pages/Calendar.tsx';
const full = path.join(repo, rel);
let text = fs.readFileSync(full, 'utf8');

const importLine = "import '../styles/closeflow-calendar-selected-day-readability-v5.css';";
if (!text.includes(importLine)) {
  const after = "import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';";
  if (text.includes(after)) text = text.replace(after, `${after}\n${importLine}`);
  else {
    const imports = [...text.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    text = text.slice(0, at) + `\n${importLine}` + text.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5 = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_2026_05_12';";
if (!text.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_2026_05_12')) {
  const anchors = ['const CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4', 'const CALENDAR_VIEW_STORAGE_KEY'];
  let done = false;
  for (const anchor of anchors) {
    const idx = text.indexOf(anchor);
    if (idx >= 0) {
      const end = text.indexOf('\n', idx);
      text = text.slice(0, end + 1) + marker + '\n' + text.slice(end + 1);
      done = true;
      break;
    }
  }
  if (!done) text = marker + '\n' + text;
}

fs.writeFileSync(full, text, 'utf8');

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_AUDIT.generated.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_2026_05_12',
  changed: ['src/pages/Calendar.tsx', 'src/styles/closeflow-calendar-selected-day-readability-v5.css'],
  fixed: ['selected day panel entries readable', 'no invisible white bars', 'ellipsis retained']
}, null, 2), 'utf8');
console.log('CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_PATCH_OK');
