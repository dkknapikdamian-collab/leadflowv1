const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const supportPath = path.join(repo, 'src/pages/SupportCenter.tsx');
if (!fs.existsSync(supportPath)) {
  console.error('STAGE180M_SUPPORT_REMOVE_TOP_METRICS_FAIL: missing SupportCenter.tsx');
  process.exit(1);
}
const support = fs.readFileSync(supportPath, 'utf8');
const forbidden = [
  'className="support-hero-grid"',
  '<section className="support-hero-grid"',
  'support-hero-card-blue',
];
for (const item of forbidden) {
  if (support.includes(item)) {
    console.error('STAGE180M_SUPPORT_REMOVE_TOP_METRICS_FAIL: top metrics section still rendered: ' + item);
    process.exit(1);
  }
}
console.log('STAGE180M_SUPPORT_REMOVE_TOP_METRICS_PASS');
