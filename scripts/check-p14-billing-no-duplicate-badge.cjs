const fs = require('fs');
const path = require('path');
const root = process.cwd();
const billing = fs.readFileSync(path.join(root, 'src/pages/Billing.tsx'), 'utf8').replace(/^\uFEFF/, '');
const problems = [];
const aiPlanMatch = billing.match(/id:\s*'closeflow_ai'[\s\S]*?availabilityHint:/);
if (!aiPlanMatch) {
  problems.push('Billing.tsx: AI plan block not found.');
} else {
  const block = aiPlanMatch[0];
  const betaBadgeCount = (block.match(/badge:\s*'Beta'/g) || []).length;
  if (betaBadgeCount !== 1) problems.push('Billing.tsx: AI plan must contain exactly one Beta badge, found ' + betaBadgeCount + '.');
  if (/badge:\s*'Beta',\s*\r?\n\s*badge:\s*'Beta',/.test(block)) problems.push('Billing.tsx: duplicate consecutive Beta badge key found.');
}
if (problems.length) {
  console.error('P14 billing duplicate badge guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}
console.log('OK: P14 billing duplicate badge guard passed.');
