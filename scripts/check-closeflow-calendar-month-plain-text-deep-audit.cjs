const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

const read = (rel) => {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
};
const expect = (label, ok) => { if (!ok) failures.push(label); };

const tool = read('tools/audit-closeflow-calendar-month-plain-text-deep.cjs');
const report = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.md');
const json = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.json');

expect('audit tool exists', tool.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT_2026_05_12'));
expect('report md generated', report.includes('Calendar Month Plain Text Deep Audit'));
expect('report has verdict', report.includes('## Werdykt'));
expect('report recommends plain text rows', report.includes('plain text rows'));
expect('report contains next implementation DOM', report.includes('cf-calendar-month-text-row'));
expect('json generated', json.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT_2026_05_12'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT_CHECK_OK');
