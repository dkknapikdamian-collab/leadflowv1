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

const cssRel = 'src/styles/closeflow-calendar-skin-only-v1.css';
let css = read(cssRel);
if (!css) throw new Error(`${cssRel} not found`);

css = css
  .replace(/\.cf-html-shell:has\(\[data-cf-page-header-v2="calendar"\]\)/g, 'the old broad app-shell calendar scope')
  .replace(/:has\(\[data-cf-page-header-v2="calendar"\]\)/g, 'old broad calendar scope');

write(cssRel, css);

const calendarRel = 'src/pages/Calendar.tsx';
let calendar = read(calendarRel);
if (!calendar) throw new Error(`${calendarRel} not found`);

const marker = "const CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1 = 'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_2026_05_12';";
if (!calendar.includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_2026_05_12')) {
  const anchor = "const CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2";
  const idx = calendar.indexOf(anchor);
  if (idx >= 0) {
    const lineEnd = calendar.indexOf('\n', idx);
    calendar = calendar.slice(0, lineEnd + 1) + marker + '\n' + calendar.slice(lineEnd + 1);
  } else {
    const anchor2 = "const CLOSEFLOW_CALENDAR_SKIN_ONLY_V1";
    const idx2 = calendar.indexOf(anchor2);
    if (idx2 >= 0) {
      const lineStart = calendar.lastIndexOf('\n', idx2) + 1;
      calendar = calendar.slice(0, lineStart) + marker + '\n' + calendar.slice(lineStart);
    }
  }
}
write(calendarRel, calendar.replace(/\n{3,}/g, '\n\n'));

console.log('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_PATCH_OK');
