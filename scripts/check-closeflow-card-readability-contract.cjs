const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (message) => {
  console.error('CLOSEFLOW_CARD_READABILITY_CONTRACT_FAIL: ' + message);
  process.exit(1);
};

const cssPath = 'src/styles/closeflow-card-readability.css';
if (!exists(cssPath)) fail('brakuje globalnego CSS closeflow-card-readability.css');

const css = read(cssPath);
for (const token of [
  '--cf-readable-card-bg',
  '--cf-readable-card-border',
  '--cf-readable-title',
  '--cf-readable-text',
  '--cf-readable-muted',
  '--cf-readable-empty-bg',
]) {
  if (!css.includes(token)) fail('CSS nie zawiera tokena ' + token);
}

for (const cls of [
  'cf-card-readable',
  'cf-empty-state',
  'cf-readable-panel',
  'cf-readable-card',
  'cf-readable-muted',
  'cf-readable-title',
]) {
  if (!css.includes('.' + cls)) fail('CSS nie zawiera klasy .' + cls);
}

const app = read('src/App.tsx');
if (!app.includes("import './styles/closeflow-card-readability.css';")) {
  fail('App.tsx nie importuje closeflow-card-readability.css');
}

const required = [
  {
    file: 'src/pages/Templates.tsx',
    marker: 'CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_TEMPLATES',
    must: ['cf-readable-card', 'cf-empty-state'],
  },
  {
    file: 'src/pages/ResponseTemplates.tsx',
    marker: 'CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_RESPONSE_TEMPLATES',
    must: ['cf-readable-card', 'cf-empty-state', 'cf-readable-panel'],
  },
  {
    file: 'src/pages/Calendar.tsx',
    marker: 'CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_CALENDAR',
    must: ['cf-readable-card', 'cf-readable-panel'],
  },
];

const optional = [
  {
    file: 'src/pages/AdminAiSettings.tsx',
    marker: 'CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_ADMIN_AI',
    must: ['cf-readable-card'],
  },
];

for (const target of [...required, ...optional]) {
  if (!exists(target.file)) continue;
  const text = read(target.file);
  if (!text.includes(target.marker)) fail(target.file + ' nie zawiera markera kontraktu ' + target.marker);
  for (const cls of target.must) {
    if (!text.includes(cls)) fail(target.file + ' nie używa wspólnej klasy ' + cls);
  }
}

const inspectedFiles = [...required, ...optional]
  .filter((entry) => exists(entry.file))
  .map((entry) => entry.file);

const forbiddenClass = /(?:card|readability|empty-state)[-_](?:fix|v2|repair)|(?:fix|v2|repair)[-_](?:card|readability|empty-state)/i;
const mojibake = /(?:Ä|Å|Æ|Ĺ|Â|â€|Ă|ďż˝)/;
const badControlChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const whiteOnWhite = /(?:bg-white[^"'`]*text-white|text-white[^"'`]*bg-white)/;

for (const file of [cssPath, ...inspectedFiles]) {
  const text = read(file);
  if (forbiddenClass.test(text)) fail(file + ' zawiera lokalną klasę fix/v2/repair dla card/readability/empty-state');
  if (mojibake.test(text)) fail(file + ' zawiera podejrzany mojibake');
  if (badControlChars.test(text)) fail(file + ' zawiera control chars');
  if (whiteOnWhite.test(text)) fail(file + ' zawiera oczywisty wzorzec białe-na-białym');
}

const responseTemplates = read('src/pages/ResponseTemplates.tsx');
if (/Card className="border-none app-surface-strong/.test(responseTemplates)) {
  fail('ResponseTemplates ma app-surface-strong Card bez cf-readable-card');
}

console.log('CLOSEFLOW_CARD_READABILITY_CONTRACT_OK: Templates, ResponseTemplates, Calendar, AdminAiSettings');
