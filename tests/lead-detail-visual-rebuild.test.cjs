const fs = require('node:fs');
const path = require('node:path');

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
  'SZCZEGÓŁY LEADA',
  'Najbliższa akcja',
  'Brak zaplanowanych działań.',
  'Ten temat jest już w obsłudze',
  'Otwórz sprawę',
  'Rozpocznij obsługę',
  'Dane kontaktowe',
  'Zadania i wydarzenia',
  'Historia kontaktu',
  '+1H',
  '+1D',
  '+1W',
  'Zrobione',
  'Usuń',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page copy: ${needle}`);
}

if (page.includes('Następny krok')) fail('sales next step field returned');

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

for (const mojibake of ['BĹ‚Ä…d', 'OtwĂłrz', 'Å¹rĂłdło', 'CyklicznoĹ›Ä‡']) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS lead detail visual rebuild');
