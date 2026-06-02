const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(root, 'src/styles/stage216m-r13-client-right-rail-finance-inline-refactor.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

const failures = [];
const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
const client = read(clientPath);
const css = read(cssPath);
const adapters = read(adaptersPath);

if (!client.includes('data-stage216m-r13-client-finance-inline-card="true"')) failures.push('ClientDetail missing R13 inline finance card marker.');
if (!client.includes('client-detail-finance-inline-metrics')) failures.push('ClientDetail missing inline finance metrics.');
if (client.includes('Robocze notatki klienta są w centrum pracy')) failures.push('ClientDetail still contains old notes intro copy.');
if (client.includes('5 najbliższych zadań i wydarzeń')) failures.push('ClientDetail still contains old upcoming intro copy.');
if (!css.includes('STAGE216M_R13_CLIENT_RIGHT_RAIL_FINANCE_INLINE_REFACTOR')) failures.push('R13 CSS marker missing.');
if (!css.includes("[data-stage216m-r13-client-finance-inline-card='true']")) failures.push('R13 CSS does not target inline finance card.');
if (!adapters.includes("@import '../stage216m-r13-client-right-rail-finance-inline-refactor.css';")) failures.push('page-adapters missing R13 import.');

if (failures.length) {
  console.error('FAIL stage216m-r13-r1-client-right-rail-finance-inline-pssafe-contract');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('PASS stage216m-r13-r1-client-right-rail-finance-inline-pssafe-contract');
