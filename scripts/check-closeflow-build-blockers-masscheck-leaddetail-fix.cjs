const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}
function expect(label, ok) {
  if (!ok) failures.push(label);
}

const leadDetail = read('src/pages/LeadDetail.tsx');
const auditJson = read('docs/release/CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_AUDIT.generated.json');

expect('LeadDetail marker present', leadDetail.includes('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026_05_12'));
expect('broken fallback removed', !leadDetail.includes("Brak powiązanej sprawy}</small>"));
expect('fixed fallback present', leadDetail.includes("Brak powiązanej sprawy'}</small>"));
expect('audit generated', auditJson.includes('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_2026_05_12'));
expect('audit verdict pass', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_BUILD_BLOCKERS_MASSCHECK_LEADDETAIL_FIX_CHECK_OK');
