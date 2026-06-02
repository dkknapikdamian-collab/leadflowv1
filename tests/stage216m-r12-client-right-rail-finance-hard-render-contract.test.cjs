const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(root, 'src/styles/stage216m-r12-client-right-rail-finance-hard-render.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

const client = fs.readFileSync(clientPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');
const errors = [];

if (!adapters.includes("stage216m-r12-client-right-rail-finance-hard-render.css")) {
  errors.push('page-adapters import missing');
}

if (!client.includes('data-stage216m-r12-client-finance-hard-render="true"')) {
  errors.push('ClientDetail finance hard render marker missing');
}

if (client.includes('Robocze notatki klienta są w centrum pracy')) {
  errors.push('ClientDetail still contains notes helper copy');
}

if (client.includes('5 najbliższych zadań i wydarzeń z datą powiązanych z tym klientem')) {
  errors.push('ClientDetail still contains right rail upcoming helper copy');
}

if (!css.includes("[data-stage216m-r12-client-finance-hard-render='true']")) {
  errors.push('R12 CSS hard render selector missing');
}

if (!css.includes('order: 30')) {
  errors.push('R12 CSS finance order token missing');
}

if (!css.includes('.client-detail-right-card-intro')) {
  errors.push('R12 CSS defensive intro hide selector missing');
}

if (errors.length) {
  console.error('FAIL stage216m-r12-client-right-rail-finance-hard-render-contract');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('PASS stage216m-r12-client-right-rail-finance-hard-render-contract');
