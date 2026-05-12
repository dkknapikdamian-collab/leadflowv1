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

const calendarRel = 'src/pages/Calendar.tsx';
let calendar = read(calendarRel);
if (!calendar) throw new Error(`${calendarRel} not found`);

const importLine = "import '../styles/closeflow-calendar-skin-only-v1.css';";
if (!calendar.includes(importLine)) {
  const cssImport = "import '../styles/closeflow-page-header-v2.css';";
  if (calendar.includes(cssImport)) {
    calendar = calendar.replace(cssImport, `${cssImport}\n${importLine}`);
  } else {
    const imports = [...calendar.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    calendar = calendar.slice(0, at) + `\n${importLine}` + calendar.slice(at);
  }
}

const marker = "const CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2 = 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12';";
if (!calendar.includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12')) {
  const anchor = "const CLOSEFLOW_CALENDAR_SKIN_ONLY_V1";
  const idx = calendar.indexOf(anchor);
  if (idx >= 0) {
    const lineStart = calendar.lastIndexOf('\n', idx) + 1;
    calendar = calendar.slice(0, lineStart) + marker + '\n' + calendar.slice(lineStart);
  } else {
    const imports = [...calendar.matchAll(/^import[\s\S]*?;\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    calendar = calendar.slice(0, at) + '\n' + marker + '\n' + calendar.slice(at);
  }
}

write(calendarRel, calendar.replace(/\n{3,}/g, '\n\n'));

fs.mkdirSync(p('src/styles'), { recursive: true });
// CSS is copied by apply script before this patch runs. This patch only validates the copied file exists.
if (!read('src/styles/closeflow-calendar-skin-only-v1.css').includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2')) {
  throw new Error('Expected repaired CSS was not copied before patch.');
}

console.log('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_PATCH_OK');
