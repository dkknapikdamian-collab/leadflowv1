const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = process.cwd();
const marker = 'STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE';
const errors = [];

function read(rel) {
  const p = path.join(repo, rel);
  if (!fs.existsSync(p)) {
    errors.push(`missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(p, 'utf8');
}
function requireToken(content, token, label) {
  if (!content.includes(token)) errors.push(`missing ${label}: ${token}`);
}
function requireRegex(content, regex, label) {
  if (!regex.test(content)) errors.push(`missing ${label}: ${regex}`);
}
function blockAfter(content, token) {
  const i = content.indexOf(token);
  if (i < 0) return '';
  const next = content.indexOf('\n/* STAGE', i + token.length);
  return next >= 0 ? content.slice(i, next) : content.slice(i);
}
function checkNoMojibake(label, content) {
  const bad = ['\u0102', '\u0139', '\u00C4', '\u00C5', '\u00C2', '\uFFFD', '\u010F\u017C\u02DD'];
  for (const token of bad) {
    if (content.includes(token)) errors.push(`mojibake detected in ${label}: ${token}`);
  }
}

const tsx = read('src/pages/ClientDetail.tsx');
const css = read('src/styles/visual-stage12-client-detail-vnext.css');
const dict = read('_project/UI_DICTIONARY_STAGE231D0A.md');
const guardSelf = read('scripts/check-stage231d0c-r2-client-detail-header-freeze.cjs');
const testSelf = read('tests/stage231d0c-r2-client-detail-header-freeze.test.cjs');

requireToken(tsx, 'client-detail-header', 'ClientDetail header class');
requireToken(tsx, 'client-detail-header-copy', 'ClientDetail header copy class');
requireToken(tsx, 'client-detail-header-actions', 'ClientDetail header actions class');
requireToken(tsx, 'client-detail-header-action-soft', 'ClientDetail soft action class');
requireToken(tsx, 'client-detail-header-action-primary', 'ClientDetail primary action class');
requireToken(tsx, 'Zapytaj AI', 'Zapytaj AI action label');
requireToken(tsx, 'Otwórz główną sprawę', 'Otwórz główną sprawę action label');

requireToken(css, marker, 'R2 marker');
requireToken(css, 'client-detail-header-action-soft svg', 'soft action svg selector');
requireToken(css, 'client-detail-header-action-primary svg', 'primary action svg selector');
requireToken(css, 'opacity: 1', 'icon opacity visible');
requireToken(css, 'visibility: visible', 'icon visibility visible');
requireToken(css, 'stroke: currentColor', 'icon currentColor stroke');
requireRegex(css, /client-detail-header-actions[\s\S]*justify-content:\s*flex-end/, 'header actions flex-end');
requireRegex(css, /client-detail-header-action-primary[\s\S]*color:\s*#ffffff/i, 'primary action white foreground');

requireToken(dict, '## DetailHeader', 'UI Dictionary DetailHeader heading');
requireToken(dict, 'client-detail-header-baseline', 'UI Dictionary DetailHeader variant');
requireToken(dict, 'ClientDetailHeader', 'UI Dictionary source pattern');
requireToken(dict, 'ikony w akcjach zawsze widoczne', 'UI Dictionary visible icons rule');

const r2CssBlock = blockAfter(css, marker);
const detailHeaderBlock = blockAfter(dict, '## DetailHeader');
checkNoMojibake('R2 CSS block', r2CssBlock);
checkNoMojibake('DetailHeader UI Dictionary block', detailHeaderBlock);
checkNoMojibake('R2 guard', guardSelf);
checkNoMojibake('R2 test', testSelf);

const markerCount = (css.match(new RegExp(marker, 'g')) || []).length;
if (markerCount !== 1) errors.push(`expected one ${marker} in CSS, found ${markerCount}`);

if (!fs.existsSync(path.join(repo, 'scripts/check-stage231d0c-client-detail-workspace-baseline.cjs'))) {
  errors.push('missing D0C baseline guard');
} else {
  const baseline = spawnSync('node', ['scripts/check-stage231d0c-client-detail-workspace-baseline.cjs'], {
    cwd: repo,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (baseline.status !== 0) {
    errors.push(`D0C baseline guard failed from R2 guard:\n${baseline.stdout || ''}${baseline.stderr || ''}`);
  }
}

if (errors.length) {
  console.error('STAGE231D0C-R2 ClientDetailHeader freeze guard: FAIL');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('STAGE231D0C-R2 ClientDetailHeader freeze guard: PASS');
