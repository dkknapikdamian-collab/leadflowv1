const fs = require('fs');
const path = require('path');

const root = process.cwd();
const leadPath = path.join(root, 'src', 'pages', 'LeadDetail.tsx');
const clientPath = path.join(root, 'src', 'pages', 'ClientDetail.tsx');

const lead = fs.readFileSync(leadPath, 'utf8');
const client = fs.readFileSync(clientPath, 'utf8');

const forbidden = 'Ostatnie 5 zdarzeń powiązanych z tym leadem.';
const failures = [];

if (lead.includes(forbidden)) {
  failures.push('LeadDetail still contains intro copy: ' + forbidden);
}

if (!lead.includes('<h2>Historia aktywności</h2>')) {
  failures.push('LeadDetail activity history heading is missing.');
}

if (!lead.includes('lead-detail-left-activity-history-card')) {
  failures.push('LeadDetail left activity history card is missing.');
}

if (!client.includes('<h2>Historia aktywności</h2>')) {
  failures.push('ClientDetail activity history heading is missing.');
}

if (client.includes(forbidden)) {
  failures.push('ClientDetail must not inherit lead-specific intro copy.');
}

if (failures.length) {
  console.error('FAIL stage216m-r10-r1-remove-activity-intro-contract');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('PASS stage216m-r10-r1-remove-activity-intro-contract');
