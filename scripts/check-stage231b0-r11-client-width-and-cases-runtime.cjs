const fs = require('fs');

function fail(message) {
  console.error('STAGE231B0_R11_CLIENT_WIDTH_AND_CASES_RUNTIME_GUARD FAIL: ' + message);
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function requireIncludes(text, token, label) {
  if (!text.includes(token)) fail(label + ': missing "' + token + '"');
}

const cases = read('src/pages/Cases.tsx');
const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');

const freeClosedRecordUsages = cases.split(/\r?\n/).filter((line) => {
  if (!line.includes('closedRecordStage231B0R8')) return false;
  const trimmed = line.trim();
  return !(
    trimmed.startsWith('//') ||
    trimmed.startsWith('/*') ||
    trimmed.includes('const closedRecordStage231B0R8') ||
    trimmed.includes('void closedRecordStage231B0R8') ||
    trimmed.includes('closedRecordStage231B0R8:')
  );
});

if (freeClosedRecordUsages.length) {
  fail('free runtime closedRecordStage231B0R8 usages remain: ' + freeClosedRecordUsages.join(' | '));
}

requireIncludes(cases, 'isClosedCaseStatus(record?.status)', 'Cases closed banner runtime-safe status check');
requireIncludes(cases, 'cf-case-closed-banner-stage231b0-r9', 'Cases closed banner class');
requireIncludes(cases, 'SPRAWA ZAMKNIĘTA', 'Cases closed banner label');
requireIncludes(cases, 'data-stage231b0-r9-closed-case-banner', 'Cases closed banner data marker');
requireIncludes(cases, "searchParams.get('view')", 'Cases URL view reader');
requireIncludes(cases, "caseView === 'all' ? cases :", 'Cases all/open/closed source model');
requireIncludes(cases, 'Otwarte sprawy', 'Cases right rail open view');
requireIncludes(cases, 'Sprawy zamknięte', 'Cases right rail closed view');
requireIncludes(cases, 'Wszystkie sprawy', 'Cases right rail all view');

requireIncludes(clientCss, 'STAGE231B0_R11_CLIENT_WIDTH_AND_CASES_RUNTIME_GUARD', 'ClientDetail R11 CSS marker');
requireIncludes(clientCss, 'width: min(calc(100vw - 260px), 1760px) !important;', 'ClientDetail wide desktop width');
requireIncludes(clientCss, 'max-width: none !important;', 'ClientDetail no max-width clamp');
requireIncludes(clientCss, 'margin-left: 0 !important;', 'ClientDetail left aligned layout');
requireIncludes(clientCss, 'grid-template-columns: minmax(280px, 320px) minmax(760px, 1fr) minmax(300px, 340px) !important;', 'ClientDetail wide 3-column grid');
requireIncludes(clientCss, '@media (max-width: 1500px)', 'ClientDetail scaling breakpoint');
requireIncludes(clientCss, '@media (max-width: 1180px)', 'ClientDetail stacked breakpoint');

console.log('STAGE231B0_R11_CLIENT_WIDTH_AND_CASES_RUNTIME_GUARD PASS');
