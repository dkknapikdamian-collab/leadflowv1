const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];
const read = (rel) => {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
};
const expect = (label, ok) => { if (!ok) failures.push(label); };

const auditTool = read('tools/audit-closeflow-calendar-month-overlap-deep.cjs');
const reportMd = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT.generated.md');
const reportJson = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT.generated.json');

expect('audit tool exists', auditTool.includes('CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT_2026_05_12'));
expect('report md exists', reportMd.includes('Calendar Month Overlap Deep Audit'));
expect('report json exists', reportJson.includes('CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT_2026_05_12'));
expect('report contains structural recommendation', reportMd.includes('MonthEntryChip'));
expect('report contains high-risk CSS section', reportMd.includes('High-risk CSS rows for overlap'));
expect('report contains import order section', reportMd.includes('Calendar.tsx CSS import order'));
expect('report contains active visual imports section', reportMd.includes('Active visual CSS imports'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_OVERLAP_DEEP_AUDIT_CHECK_OK');
