const fs = require('fs');

const rel = 'src/lib/data-contract.ts';
let text = fs.readFileSync(rel, 'utf8');

const badImportSingle = "import { normalizeCommissionBase, normalizeCommissionMode, normalizeCommissionStatus, normalizePaymentStatus, normalizePaymentType } from './finance/finance-normalize.js';\n";
text = text.replace(badImportSingle, '');

text = text.replace(
  /import\s*\{\s*normalizeCommissionBase,\s*normalizeCommissionMode,\s*normalizeCommissionStatus,\s*normalizePaymentStatus,\s*normalizePaymentType\s*\}\s*from\s*['"]\.\/finance\/finance-normalize\.js['"];\r?\n/g,
  ''
);

const marker = 'function normalizeCurrency(value: unknown, fallback = \'PLN\') {';
if (!text.includes(marker)) {
  throw new Error(`${rel}: missing normalizeCurrency marker`);
}

if (!text.includes('DATA_CONTRACT_SERVER_SAFE_FINANCE_NORMALIZERS')) {
  const fnStart = text.indexOf(marker);
  const nextFn = text.indexOf('\n\nexport function normalizeLeadContract', fnStart);
  if (nextFn < 0) {
    throw new Error(`${rel}: missing normalizeLeadContract marker after normalizeCurrency`);
  }

  const localNormalizers = `

const DATA_CONTRACT_SERVER_SAFE_FINANCE_NORMALIZERS = 'API_RUNTIME_DATA_CONTRACT_SERVER_SAFE_FINANCE_NORMALIZERS_V1' as const;

const DATA_CONTRACT_COMMISSION_MODES = new Set(['none', 'percent', 'fixed']);
const DATA_CONTRACT_COMMISSION_BASES = new Set(['contract_value', 'paid_amount', 'custom']);
const DATA_CONTRACT_COMMISSION_STATUSES = new Set(['not_set', 'expected', 'due', 'partially_paid', 'paid', 'overdue']);
const DATA_CONTRACT_PAYMENT_TYPES = new Set(['deposit', 'partial', 'final', 'commission', 'refund', 'other']);
const DATA_CONTRACT_PAYMENT_STATUSES = new Set(['planned', 'due', 'paid', 'cancelled']);

function normalizeFinanceEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeCommissionMode(value: unknown) {
  return normalizeFinanceEnum(value, DATA_CONTRACT_COMMISSION_MODES, 'none');
}

function normalizeCommissionBase(value: unknown) {
  return normalizeFinanceEnum(value, DATA_CONTRACT_COMMISSION_BASES, 'contract_value');
}

function normalizeCommissionStatus(value: unknown) {
  return normalizeFinanceEnum(value, DATA_CONTRACT_COMMISSION_STATUSES, 'not_set');
}

function normalizePaymentType(value: unknown) {
  return normalizeFinanceEnum(value, DATA_CONTRACT_PAYMENT_TYPES, 'other');
}

function normalizePaymentStatus(value: unknown) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'pending' || normalized === 'awaiting_payment') return 'due';
  if (normalized === 'done' || normalized === 'completed' || normalized === 'settled') return 'paid';
  if (normalized === 'canceled') return 'cancelled';
  return normalizeFinanceEnum(normalized, DATA_CONTRACT_PAYMENT_STATUSES, 'planned');
}
`;
  text = text.slice(0, nextFn) + localNormalizers + text.slice(nextFn);
}

if (text.includes("from './finance/finance-normalize.js'")) {
  throw new Error(`${rel}: still imports finance-normalize`);
}
if (!text.includes('DATA_CONTRACT_SERVER_SAFE_FINANCE_NORMALIZERS')) {
  throw new Error(`${rel}: server-safe finance normalizer marker missing`);
}
if (!text.includes('function normalizePaymentStatus(value: unknown)')) {
  throw new Error(`${rel}: local normalizePaymentStatus missing`);
}

fs.writeFileSync(rel, text, 'utf8');
console.log('CLOSEFLOW_API_RUNTIME_DATA_CONTRACT_SERVER_SAFE_PATCH_OK');
