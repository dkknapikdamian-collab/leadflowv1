const fs = require('fs');
const path = require('path');

const marker = 'STAGE52_UI_CONTRAST_REGRESSION_GUARD';

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8').replace(/^\uFEFF/, '');
}

function pass(message) {
  console.log('PASS ' + message);
}

function fail(message) {
  console.error('FAIL ' + message);
  process.exitCode = 1;
}

function assertContains(file, expected, label = expected) {
  const value = read(file);
  if (value.includes(expected)) pass(file + ': contains ' + label);
  else fail(file + ': missing ' + label);
}

function assertScript(file, name) {
  const pkg = JSON.parse(read('package.json'));
  if (pkg.scripts && typeof pkg.scripts[name] === 'string') pass('package.json: contains script ' + name);
  else fail('package.json: missing script ' + name);
}

assertScript('package.json', 'verify:ui-contrast');
assertScript('package.json', 'check:stage52-ui-contrast-regression-guard');
assertScript('package.json', 'test:stage52-ui-contrast-regression-guard');

assertContains('scripts/check-stage49-client-detail-visible-actions.cjs', 'CLIENT_DETAIL_STAGE49_VISIBLE_NEXT_ACTION_AND_NOTE_ACTIONS', 'Stage49 contrast guard marker');
assertContains('scripts/check-stage50-client-detail-edit-header-polish.cjs', 'STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH', 'Stage50 contrast/edit guard marker');
assertContains('scripts/check-stage51-clients-case-contrast-hotfix.cjs', 'STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX', 'Stage51 contrast guard marker');

assertContains('src/pages/ClientDetail.tsx', 'STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH', 'Stage50 client detail marker');
assertContains('src/pages/ClientDetail.tsx', 'STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX', 'Stage51 client detail marker');

assertContains('src/styles/visual-stage12-client-detail-vnext.css', 'CLIENT_DETAIL_STAGE49_VISIBLE_NEXT_ACTION_AND_NOTE_ACTIONS', 'Stage49 CSS marker');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', 'STAGE50_CLIENT_DETAIL_EDIT_HEADER_POLISH', 'Stage50 CSS marker');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', 'STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX', 'Stage51 CSS marker');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', '.client-detail-vnext-page .client-detail-edit-form input', 'client edit input selector');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', '-webkit-text-fill-color: #111827 !important;', 'client edit dark text fill');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', 'button[aria-label*="dykt" i]', 'dictation button readable contrast selector');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', 'button[aria-label*="notat" i]', 'note button readable contrast selector');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', '.client-detail-note-inline button', 'note inline button readable selector');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', 'color: #111827 !important;', 'dark text contrast token');
assertContains('src/styles/visual-stage12-client-detail-vnext.css', 'color: #475467 !important;', 'muted text contrast token');

assertContains('src/styles/visual-stage05-clients.css', 'STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX', 'Stage51 clients CSS marker');
assertContains('src/styles/visual-stage05-clients.css', '[data-clients-simple-filters="true"] p', 'clients simple filters readable p selector');
assertContains('src/styles/visual-stage05-clients.css', '[data-clients-simple-filters="true"] small', 'clients simple filters readable small selector');
assertContains('src/styles/visual-stage05-clients.css', '.clients-page .right-card p,', 'clients right card readable p selector');
assertContains('src/styles/visual-stage05-clients.css', 'color: #475467 !important;', 'clients readable muted text token');
assertContains('src/styles/visual-stage05-clients.css', 'color: #111827 !important;', 'clients readable strong text token');

assertContains('src/styles/visual-stage08-case-detail.css', 'STAGE51_CLIENTS_CASE_CONTRAST_HOTFIX', 'Stage51 case CSS marker');
assertContains('src/styles/visual-stage08-case-detail.css', '.case-detail-page p,', 'case readable p selector');
assertContains('src/styles/visual-stage08-case-detail.css', '.case-detail-vnext-page p,', 'case vnext readable p selector');
assertContains('src/styles/visual-stage08-case-detail.css', '.case-detail-page button,', 'case readable button selector');
assertContains('src/styles/visual-stage08-case-detail.css', 'font-size: 12px !important;', 'case compact helper text size');
assertContains('tests/stage52-ui-contrast-regression-guard.test.cjs', marker, 'Stage52 test marker');
assertContains('docs/release/STAGE52_UI_CONTRAST_REGRESSION_GUARD_2026-05-04.md', marker, 'Stage52 release marker');

if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + marker);
