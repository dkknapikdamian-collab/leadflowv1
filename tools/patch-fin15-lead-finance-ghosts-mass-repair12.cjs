const fs = require('node:fs');
const path = require('node:path');

function fail(message) {
  throw new Error(message);
}

const file = path.join(process.cwd(), 'src/pages/LeadDetail.tsx');
let source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const original = source;

function removeImportName(name) {
  source = source.replace(new RegExp(`\\n\\s*${name},`, 'g'), '');
  source = source.replace(new RegExp(`${name},\\n`, 'g'), '');
}

function removeConstFunctionContaining(token) {
  let guard = 0;
  while (source.includes(token) && guard < 20) {
    guard += 1;
    const idx = source.indexOf(token);
    const start = source.lastIndexOf('\n  const ', idx);
    if (start < 0) break;
    const arrow = source.indexOf('=>', start);
    const brace = source.indexOf('{', arrow);
    if (arrow < 0 || brace < 0 || brace > idx + 3000) break;

    let depth = 0;
    let end = -1;
    for (let i = brace; i < source.length; i += 1) {
      const ch = source[i];
      if (ch === '{') depth += 1;
      if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          const semi = source.indexOf(';', i);
          end = semi >= 0 ? semi + 1 : i + 1;
          break;
        }
      }
    }
    if (end < 0) break;
    source = source.slice(0, start) + '\n' + source.slice(end);
  }
}

function removeDialogContaining(token) {
  let guard = 0;
  while (source.includes(token) && guard < 20) {
    guard += 1;
    const idx = source.indexOf(token);
    const dialogStart = source.lastIndexOf('<Dialog', idx);
    const close = source.indexOf('</Dialog>', idx);
    if (dialogStart < 0 || close < 0) break;
    const end = close + '</Dialog>'.length;
    source = source.slice(0, dialogStart) + source.slice(end);
  }
}

removeImportName('fetchPaymentsFromSupabase');
removeImportName('createPaymentInSupabase');

source = source.replace(/\n\s*const \[leadPayments,\s*setLeadPayments\]\s*=\s*useState<any\[\]>\(\[\]\);/g, '');
source = source.replace(/\n\s*const \[isLeadPaymentOpen,\s*setIsLeadPaymentOpen\]\s*=\s*useState\(false\);/g, '');
source = source.replace(/\n\s*const \[leadPaymentSubmitting,\s*setLeadPaymentSubmitting\]\s*=\s*useState\(false\);/g, '');
source = source.replace(/\n\s*const \[leadPaymentDraft,\s*setLeadPaymentDraft\]\s*=\s*useState\(\{[\s\S]*?\n\s*\}\);/g, '');

source = source.replace(
  'const [leadRow, caseRows, taskRows, eventRows, activityRows, paymentRows] = await Promise.all([',
  'const [leadRow, caseRows, taskRows, eventRows, activityRows] = await Promise.all([',
);
source = source.replace(/\n\s*fetchPaymentsFromSupabase\(\{ leadId \}\),/g, '');

source = source.replace(
  /\n\s*\/\/ CLOSEFLOW_LEAD_SETTLEMENT_DYNAMIC_V29_PAYMENTS\n\s*const basePaymentRows[\s\S]*?\n\s*const linkedTaskRows = dedupeById\(/,
  '\n      const linkedTaskRows = dedupeById(',
);

source = source.replace(/\n\s*setLeadPayments\(mergedPaymentRows\);/g, '');

const financeStart = source.indexOf('  const leadFinancePanel = useMemo(() => {');
if (financeStart >= 0) {
  const financeEndMarker = '\n  }, [associatedCase, lead?.partialPayments, leadFinance.dealValue, leadPayments]);';
  const financeEnd = source.indexOf(financeEndMarker, financeStart);
  if (financeEnd >= 0) {
    const replacement = `  const leadFinancePanel = useMemo(() => {
    const potential = Math.max(0, Number(leadFinance.dealValue || 0));
    return {
      potential,
      paid: 0,
      remaining: potential,
      billingStatus: 'source_only',
    };
  }, [leadFinance.dealValue]);`;
    source = source.slice(0, financeStart) + replacement + source.slice(financeEnd + financeEndMarker.length);
  }
}

removeConstFunctionContaining('createPaymentInSupabase');
removeDialogContaining('isLeadPaymentOpen');
removeDialogContaining('leadPaymentDraft');

source = source.replace(/\n\s*setLeadPaymentDraft\([\s\S]*?\);\n/g, '\n');
source = source.replace(/\n\s*setLeadPaymentSubmitting\([\s\S]*?\);\n/g, '\n');
source = source.replace(/\n\s*setIsLeadPaymentOpen\([^)]*\);\n/g, '\n');

// Remove empty button fragments that were only opening the lead payment dialog.
source = source.replace(/<LeadActionButton[\s\S]{0,500}?(?:Dodaj zaliczkę|Dodaj wpłatę|Dodaj płatność)[\s\S]{0,500}?<\/LeadActionButton>/g, '');

// Force the old route contract required by lead-service-mode-v1.
source = source.replace('navigate(`/cases/${startServiceSuccess.caseId}`);', 'navigate(`/case/${startServiceSuccess.caseId}`);');

if (!source.includes('navigate(`/case/${startServiceSuccess.caseId}`);')) {
  const anchorCandidates = [
    '  const showServiceBanner = leadInService;\n',
    '  const leadInService = Boolean(leadOperationalArchive || isLeadInServiceStatus(lead?.status));\n',
  ];
  let inserted = false;
  for (const anchor of anchorCandidates) {
    const at = source.indexOf(anchor);
    if (at >= 0) {
      const insertAt = at + anchor.length;
      const effect = `
  useEffect(() => {
    if (startServiceSuccess?.caseId) {
      navigate(\`/case/\${startServiceSuccess.caseId}\`);
    }
  }, [navigate, startServiceSuccess?.caseId]);

`;
      source = source.slice(0, insertAt) + effect + source.slice(insertAt);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    fail('Nie znaleziono kotwicy do dodania redirectu /case/:id po starcie obsługi.');
  }
}

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

const remaining = forbidden.filter((token) => source.includes(token));
if (remaining.length) {
  const details = remaining.map((token) => {
    const idx = source.indexOf(token);
    const snippet = source.slice(Math.max(0, idx - 80), idx + token.length + 120).replace(/\s+/g, ' ');
    return `${token}: ${snippet}`;
  }).join('\n');
  fail(`LeadDetail nadal zawiera finansowe duchy:\n${details}`);
}

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

const missing = required.filter((token) => !source.includes(token));
if (missing.length) {
  fail(`LeadDetail utracił wymagane kontrakty lead-service-mode:\n${missing.join('\n')}`);
}

if (source.includes('navigate(`/cases/${startServiceSuccess.caseId}`);')) {
  fail('LeadDetail nadal ma błędny redirect /cases/:id.');
}

if (source === original) {
  console.log('[FIN-15 MASS REPAIR12] LeadDetail bez zmian po patchu.');
} else {
  fs.writeFileSync(file, source.replace(/\n/g, '\r\n'));
  console.log('[FIN-15 MASS REPAIR12] LeadDetail: finansowe duchy wycięte, kontrakty handoff zachowane.');
}
