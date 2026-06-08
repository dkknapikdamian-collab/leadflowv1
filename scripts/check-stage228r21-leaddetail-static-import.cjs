const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

const app = read('src/App.tsx');
const pkg = read('package.json');

const checks = [
  ['R21 marker missing', app.includes('STAGE228R21_LEADDETAIL_STATIC_IMPORT_UNBLOCK')],
  ['LeadDetailStatic import missing', app.includes('LeadDetailStatic')],
  ['LeadDetail must not use lazyPage', !app.includes("const LeadDetail = lazyPage(() => import('./pages/LeadDetail'), 'LeadDetail');")],
  ['Lead route must still render LeadDetail', app.includes('path="/leads/:leadId"') && app.includes('<LeadDetail />')],
  ['prebuild guard missing', pkg.includes('check-stage228r21-leaddetail-static-import.cjs')],
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) {
  console.error('STAGE228R21_LEADDETAIL_STATIC_IMPORT_FAIL: ' + failed.join('; '));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R21_LEADDETAIL_STATIC_IMPORT_UNBLOCK',
  contract: 'LeadDetail is statically imported and no longer depends on lazy export/chunk resolution.'
}, null, 2));
