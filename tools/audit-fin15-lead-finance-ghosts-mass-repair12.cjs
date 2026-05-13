const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const repoRoot = process.cwd();
const stage = process.argv[2] || 'audit';
const strict = process.argv.includes('--strict');
const leadPath = path.join(repoRoot, 'src/pages/LeadDetail.tsx');
const source = fs.readFileSync(leadPath, 'utf8');

const forbidden = [
  'createPaymentInSupabase',
  'fetchPaymentsFromSupabase',
  'leadPayments',
  'setLeadPayments',
  'isLeadPaymentOpen',
  'setIsLeadPaymentOpen',
  'leadPaymentDraft',
  'setLeadPaymentDraft',
  'leadPaymentSubmitting',
  'setLeadPaymentSubmitting',
  'CLOSEFLOW_LEAD_SETTLEMENT_DYNAMIC_V29_PAYMENTS',
];

const required = [
  'const leadOperationalArchive = Boolean',
  'leadMovedToService || associatedCase || startServiceSuccess',
  'const handleCreateQuickTask',
  'const handleCreateQuickEvent',
  'const openLinkedTaskEditor',
  'Dodawaj dalsze zadania w sprawie',
  'Dodawaj dalsze wydarzenia w sprawie',
  'Ten temat jest już w obsłudze',
  'Otwórz sprawę',
  'navigate(`/case/${startServiceSuccess.caseId}`);',
];

const issues = [];
console.log(`[FIN-15 MASS AUDIT ${stage}]`);

for (const token of forbidden) {
  if (source.includes(token)) {
    const idx = source.indexOf(token);
    const snippet = source.slice(Math.max(0, idx - 70), idx + token.length + 90).replace(/\s+/g, ' ');
    issues.push(`forbidden:${token} :: ${snippet}`);
    console.log(`FAIL forbidden:${token}`);
  } else {
    console.log(`OK forbidden absent:${token}`);
  }
}

for (const token of required) {
  if (!source.includes(token)) {
    issues.push(`missing:${token}`);
    console.log(`FAIL required:${token}`);
  } else {
    console.log(`OK required:${token}`);
  }
}

if (source.includes('navigate(`/cases/${startServiceSuccess.caseId}`);')) {
  issues.push('redirect:plural-cases');
  console.log('FAIL redirect:no-cases-plural');
} else {
  console.log('OK redirect:no-cases-plural');
}

try {
  const status = cp.execSync('git status --short', { cwd: repoRoot, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter((line) => line.includes('FIN15') || line.includes('fin15') || line.includes('LeadDetail') || line.includes('package.json'));
  console.log('INFO fin15-related workspace lines:');
  for (const line of status) console.log(`  ${line}`);
} catch (error) {
  console.log(`WARN git status failed: ${error.message}`);
}

if (issues.length > 0) {
  console.log(`[FIN-15 MASS AUDIT ${stage}] issues=${issues.length}`);
  if (strict) {
    process.exitCode = 1;
  }
} else {
  console.log(`[FIN-15 MASS AUDIT ${stage}] passed`);
}
