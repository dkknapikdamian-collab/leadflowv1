const fs = require('fs');

const clients = fs.readFileSync('src/pages/Clients.tsx', 'utf8');
const leads = fs.readFileSync('src/pages/Leads.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-right-rail-source-truth.css', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');

const failures = [];

if (!leads.includes('dataTestId="leads-simple-filters-card"')) {
  failures.push('Leads source card marker missing.');
}

if (!leads.includes('operator-simple-filters-card')) {
  failures.push('Leads source card class marker missing.');
}

if (!clients.includes('dataTestId="clients-simple-filters-card"')) {
  failures.push('Clients simple filters marker missing.');
}

if (!clients.includes('operator-simple-filters-card')) {
  failures.push('Clients are not attached to shared simple filter source truth class.');
}

if (!css.includes('CLOSEFLOW_STAGE181C_MOBILE_SIMPLE_FILTERS_SHARED_SOURCE_TRUTH')) {
  failures.push('Shared CSS Stage181C marker missing.');
}

for (const token of [
  'leads-simple-filters-card',
  'clients-simple-filters-card',
  '--cf-mobile-simple-filter-row-min-height',
  '--cf-mobile-simple-filter-label-weight',
  '--cf-mobile-simple-filter-value-weight',
  '@media (max-width: 760px)',
]) {
  if (!css.includes(token)) failures.push('CSS token missing: ' + token);
}

const importRe = /import\s+['"]\.\/styles\/([^'"]+\.css)['"];?/g;
let match;
while ((match = importRe.exec(app))) {
  const file = 'src/styles/' + match[1];
  if (!fs.existsSync(file)) failures.push('Missing App CSS import: ' + file);
}

if (failures.length) {
  console.error('Stage181C local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181C local: mobile simple filters use shared source truth and App CSS imports exist locally.');
