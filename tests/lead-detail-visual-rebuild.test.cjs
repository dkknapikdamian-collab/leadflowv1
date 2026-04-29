const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'LeadDetail.tsx');

function fail(message) {
  console.error('FAIL lead detail visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing LeadDetail.tsx');
const page = fs.readFileSync(pagePath, 'utf8');

const required = [
  'LEAD_DETAIL_VISUAL_REBUILD_STAGE14',
  'Leady <span className="mx-1 text-slate-300">/</span>',
  'Ten temat jest już w obsłudze',
  'Otwórz sprawę',
  'Brak zaplanowanych działań',
  '!leadOperationalArchive ?',
  '<LeadAiNextAction',
];

for (const needle of required) {
  if (!page.includes(needle)) fail(`missing marker/copy/pattern: ${needle}`);
}

for (const forbidden of ['Następny krok', 'Nastepny krok', 'next step']) {
  if (page.includes(forbidden)) fail(`forbidden copy found: ${forbidden}`);
}

for (const dark of ['bg-slate-900', 'bg-black', '#000', '#020617', '#0b1220', '#101828']) {
  if (page.includes(dark)) fail(`possible dark wrapper token found: ${dark}`);
}

console.log('PASS lead detail visual rebuild');

