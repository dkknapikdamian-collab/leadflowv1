const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'LeadDetail.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage14-lead-detail-vnext.css');

function fail(message) {
  console.error('FAIL lead detail visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing LeadDetail.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage14-lead-detail-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'LEAD_DETAIL_VISUAL_REBUILD_STAGE14',
  'Leady /',
  'SZCZEG\u00D3\u0139\u0081Y LEADA',
  'Najbli\u017Csza zaplanowana akcja',
  'Brak zaplanowanych dzia\u0142a\u0144.',
  'Ten temat jest ju\u017C w obs\u0142udze',
  'Otw\u00F3rz spraw\u0119',
  'Rozpocznij obs\u0142ug\u0119',
  'Dane kontaktowe',
  'Zadania i wydarzenia',
  'Historia kontaktu',
  '+1H',
  '+1D',
  '+1W',
  'Zrobione',
  'Usu\u0144',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page copy: ${needle}`);
}

if (page.includes('Nast\u0119pny krok')) fail('sales next step field returned');

const technicalLabels = ['task_updated', 'lead_status_changed', 'event_deleted'];
for (const label of technicalLabels) {
  const renderArea = page.slice(page.indexOf('return ('), page.length);
  if (renderArea.includes(`>${label}<`) || renderArea.includes(`{${label}}`)) fail(`technical label rendered: ${label}`);
}

const requiredCss = [
  '.lead-detail-right-rail',
  '.lead-detail-right-card',
  'background: transparent !important',
  'background-image: none !important',
  'box-shadow: none !important',
  'content: none !important',
  'background: rgba(255, 255, 255, 0.92) !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const scopedBlocks = css
  .split('}')
  .filter((block) => /lead-detail-(right|side|rail|card)/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (scopedBlocks.includes(dark)) fail(`dark color in lead detail side/right/card css: ${dark}`);
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS lead detail visual rebuild');
