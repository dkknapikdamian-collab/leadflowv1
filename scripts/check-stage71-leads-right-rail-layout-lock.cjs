const fs = require('fs');
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

assert(css.includes('CLOSEFLOW_LEADS_RIGHT_RAIL_LAYOUT_LOCK_STAGE71_2026_05_14'), 'missing stage71 marker');
assert(css.includes('.layout-list:has(.lead-right-rail)'), 'missing layout-list rail selector');
assert(css.includes('.layout-list:has(.lead-top-relations)'), 'missing layout-list lead-top-relations selector');
assert(css.includes('.lead-right-rail'), 'missing lead-right-rail selector');
assert(css.includes('.lead-top-relations'), 'missing lead-top-relations selector');
assert(css.includes('grid-column: 2'), 'right rail must be placed in grid column 2');
assert(css.includes('grid-row: 1'), 'right rail/top relations must start in grid row 1 on desktop');
assert(css.includes('align-items: start'), 'layout must align items to start');
assert(css.includes('order: -10'), 'lead-top-relations must be first inside right rail when nested');
assert(css.includes('margin-top: 0'), 'rail/top relations margin-top must be reset');
assert(!/position\s*:\s*absolute/i.test(css), 'do not use position:absolute for this fix');
assert(!/top\s*:\s*-\s*\d/i.test(css), 'do not use negative top offsets');
assert(!/translateY\s*\(\s*-/i.test(css), 'do not use negative translateY hacks');
assert(main.includes("import './styles/closeflow-right-rail-source-truth.css';"), 'main.tsx must import right rail source truth');
assert(main.includes("import './styles/closeflow-leads-right-rail-layout-lock.css';"), 'main.tsx must import stage71 layout lock');
assert(main.indexOf("closeflow-right-rail-source-truth.css") < main.indexOf("closeflow-leads-right-rail-layout-lock.css"), 'layout lock must load after source truth');
assert(leads.includes('lead-top-relations'), 'Leads.tsx no longer contains lead-top-relations');
assert(leads.includes('lead-right-rail'), 'Leads.tsx no longer contains lead-right-rail');
assert(leads.includes('layout-list'), 'Leads.tsx no longer contains layout-list');
assert(!/package\.json/.test(css), 'css guard sanity check');

console.log('OK: Stage71 /leads right rail layout lock guard passed.');
