const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const marker = 'CLOSEFLOW_LEADS_RIGHT_RAIL_LAYOUT_LOCK_STAGE71_2026_05_14';

function read(file) {
  return fs.readFileSync(path.join(repo, file), 'utf8');
}

function write(file, content) {
  const target = path.join(repo, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function ensureFileContains(file, needle, label = needle) {
  const content = read(file);
  if (!content.includes(needle)) {
    throw new Error(`${file} does not contain required marker/class: ${label}`);
  }
}

ensureFileContains('src/pages/Leads.tsx', 'main-leads-html', 'main leads wrapper');
ensureFileContains('src/pages/Leads.tsx', 'lead-top-relations', 'lead-top-relations');
ensureFileContains('src/pages/Leads.tsx', 'lead-right-rail', 'lead-right-rail');
ensureFileContains('src/pages/Leads.tsx', 'layout-list', 'layout-list');

const cssPath = 'src/styles/closeflow-leads-right-rail-layout-lock.css';
const css = `/* ${marker}
   owner: CloseFlow Visual System
   scope: /leads right rail alignment only
   reason: stage 3 feedback - the "Najcenniejsze leady" rail card must start at the same vertical line as the search/list area, not with an empty top offset.
   rule: fix the grid/flex placement. Do not use absolute top offsets, negative translateY or visual hacks.
*/

@media (min-width: 1221px) {
  #root .cf-html-view.main-leads-html .layout-list:has(.lead-right-rail),
  #root .cf-html-view.main-leads-html .layout-list:has(.lead-top-relations) {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 315px) !important;
    align-items: start !important;
    column-gap: 18px !important;
  }

  #root .cf-html-view.main-leads-html .lead-right-rail {
    grid-column: 2 !important;
    grid-row: 1 !important;
    align-self: start !important;
    align-content: start !important;
    justify-content: flex-start !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    top: auto !important;
    transform: none !important;
  }

  #root .cf-html-view.main-leads-html .lead-right-rail > .lead-top-relations {
    order: -10 !important;
    margin-top: 0 !important;
    padding-top: 16px !important;
    align-self: stretch !important;
    top: auto !important;
    transform: none !important;
  }

  #root .cf-html-view.main-leads-html .layout-list > aside.right-card.lead-top-relations {
    grid-column: 2 !important;
    grid-row: 1 !important;
    align-self: start !important;
    margin-top: 0 !important;
    top: auto !important;
    transform: none !important;
  }

  #root .cf-html-view.main-leads-html .layout-list > aside.right-card.lead-right-card:not(.lead-top-relations) {
    grid-column: 2 !important;
    align-self: start !important;
    margin-top: 0 !important;
    top: auto !important;
    transform: none !important;
  }

  #root .cf-html-view.main-leads-html .lead-top-relations {
    margin-top: 0 !important;
    top: auto !important;
    transform: none !important;
  }
}

@media (max-width: 1220px) {
  #root .cf-html-view.main-leads-html .lead-right-rail,
  #root .cf-html-view.main-leads-html .layout-list > aside.right-card.lead-top-relations {
    grid-column: auto !important;
    grid-row: auto !important;
    min-width: 0 !important;
    width: 100% !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    top: auto !important;
    transform: none !important;
  }
}
`;
write(cssPath, css);

const mainPath = 'src/main.tsx';
let main = read(mainPath);
const sourceTruthImport = "import './styles/closeflow-right-rail-source-truth.css';";
const layoutLockImport = "import './styles/closeflow-leads-right-rail-layout-lock.css';";

if (!main.includes(sourceTruthImport)) {
  const anchor = "import './styles/action-color-taxonomy-v1.css';";
  if (!main.includes(anchor)) {
    throw new Error('Cannot find action-color-taxonomy import anchor in src/main.tsx');
  }
  main = main.replace(anchor, `${anchor}\n${sourceTruthImport}`);
}

if (!main.includes(layoutLockImport)) {
  if (main.includes(sourceTruthImport)) {
    main = main.replace(sourceTruthImport, `${sourceTruthImport}\n${layoutLockImport}`);
  } else {
    const anchor = "import './styles/action-color-taxonomy-v1.css';";
    main = main.replace(anchor, `${anchor}\n${layoutLockImport}`);
  }
}
write(mainPath, main);

const guardPath = 'scripts/check-stage71-leads-right-rail-layout-lock.cjs';
const guard = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/closeflow-leads-right-rail-layout-lock.css');
const mainPath = path.join(root, 'src/main.tsx');
const leadsPath = path.join(root, 'src/pages/Leads.tsx');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(fs.existsSync(cssPath), 'missing src/styles/closeflow-leads-right-rail-layout-lock.css');
const css = read(cssPath);
const main = read(mainPath);
const leads = read(leadsPath);

assert(css.includes('${marker}'), 'missing stage71 marker');
assert(css.includes('.layout-list:has(.lead-right-rail)'), 'missing layout-list rail selector');
assert(css.includes('.layout-list:has(.lead-top-relations)'), 'missing layout-list lead-top-relations selector');
assert(css.includes('.lead-right-rail'), 'missing lead-right-rail selector');
assert(css.includes('.lead-top-relations'), 'missing lead-top-relations selector');
assert(css.includes('grid-column: 2'), 'right rail must be placed in grid column 2');
assert(css.includes('grid-row: 1'), 'right rail/top relations must start in grid row 1 on desktop');
assert(css.includes('align-items: start'), 'layout must align items to start');
assert(css.includes('order: -10'), 'lead-top-relations must be first inside right rail when nested');
assert(css.includes('margin-top: 0'), 'rail/top relations margin-top must be reset');
assert(!/position\\s*:\\s*absolute/i.test(css), 'do not use position:absolute for this fix');
assert(!/top\\s*:\\s*-\\s*\\d/i.test(css), 'do not use negative top offsets');
assert(!/translateY\\s*\\(\\s*-/i.test(css), 'do not use negative translateY hacks');
assert(main.includes("import './styles/closeflow-right-rail-source-truth.css';"), 'main.tsx must import right rail source truth');
assert(main.includes("import './styles/closeflow-leads-right-rail-layout-lock.css';"), 'main.tsx must import stage71 layout lock');
assert(main.indexOf("closeflow-right-rail-source-truth.css") < main.indexOf("closeflow-leads-right-rail-layout-lock.css"), 'layout lock must load after source truth');
assert(leads.includes('lead-top-relations'), 'Leads.tsx no longer contains lead-top-relations');
assert(leads.includes('lead-right-rail'), 'Leads.tsx no longer contains lead-right-rail');
assert(leads.includes('layout-list'), 'Leads.tsx no longer contains layout-list');
assert(!/package\\.json/.test(css), 'css guard sanity check');

console.log('OK: Stage71 /leads right rail layout lock guard passed.');
`;
write(guardPath, guard);

const testPath = 'tests/stage71-leads-right-rail-layout-lock.test.cjs';
const test = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-leads-right-rail-layout-lock.css'), 'utf8');

test('Stage71 uses grid/flex alignment instead of visual top hacks', () => {
  assert.match(css, /layout-list:has\\(\\.lead-right-rail\\)/);
  assert.match(css, /layout-list:has\\(\\.lead-top-relations\\)/);
  assert.match(css, /grid-column:\\s*2/);
  assert.match(css, /grid-row:\\s*1/);
  assert.match(css, /align-items:\\s*start/);
  assert.doesNotMatch(css, /position\\s*:\\s*absolute/i);
  assert.doesNotMatch(css, /top\\s*:\\s*-\\s*\\d/i);
  assert.doesNotMatch(css, /translateY\\s*\\(\\s*-/i);
});

test('Stage71 keeps nested Najcenniejsze leady at the start of the right rail', () => {
  assert.match(css, /lead-right-rail\\s*>\\s*\\.lead-top-relations/);
  assert.match(css, /order:\\s*-10/);
  assert.match(css, /margin-top:\\s*0/);
});
`;
write(testPath, test);

const docsPath = 'docs/audits/leads-right-rail-layout-stage71-manual-check.md';
const docs = [
  '# Stage71 - ręczny check /leads right rail alignment',
  '',
  '## Cel',
  '',
  'Karta **Najcenniejsze leady** na /leads ma startować równo z paskiem wyszukiwania/listy, bez pustego uskoku nad prawą kolumną.',
  '',
  '## Co zostało dopięte',
  '',
  '- src/styles/closeflow-leads-right-rail-layout-lock.css',
  '- import w src/main.tsx po closeflow-right-rail-source-truth.css',
  '- guard scripts/check-stage71-leads-right-rail-layout-lock.cjs',
  '- test tests/stage71-leads-right-rail-layout-lock.test.cjs',
  '',
  '## Sprawdź ręcznie',
  '',
  '1. Otwórz /leads na desktopie około 2048x972.',
  '2. Sprawdź przy 100% zoomu:',
  '   - prawa karta startuje równo z paskiem wyszukiwania/listy,',
  '   - nie ma pustego uskoku nad kartą,',
  '   - karta jest jasna i czytelna.',
  '3. Sprawdź przy około 80% zoomu:',
  '   - nie robi się schodek,',
  '   - prawa kolumna nie ucieka niżej.',
  '4. Sprawdź mobile:',
  '   - rail przechodzi pod listę,',
  '   - nie rozwala szerokości,',
  '   - nie powstaje poziomy scroll.',
  '',
  '## Czego ta poprawka nie zmienia',
  '',
  '- danych w leadach,',
  '- filtrów,',
  '- listy leadów,',
  '- miesięcznego kalendarza,',
  '- zawartości karty **Najcenniejsze leady**.',
  '',
].join('\n');
write(docsPath, docs);

console.log('OK: Stage71 leads right rail layout lock files written.');
console.log('OK: Stage71 patch bootstrap complete.');
