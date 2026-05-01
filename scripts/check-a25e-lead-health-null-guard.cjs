const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const filePath = path.join(root, 'src', 'lib', 'lead-health.ts');

function fail(message) {
  console.error(`A25E guard failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  fail('src/lib/lead-health.ts is missing');
}

const content = fs.readFileSync(filePath, 'utf8');

const required = [
  "const A25E_LEAD_HEALTH_NULL_GUARD_LOCK = 'Lead health helpers accept null lead during route loading';",
  'export type LeadHealthInput = LeadHealthRecord | null | undefined;',
  'function normalizeLeadHealthInput(lead: LeadHealthInput): LeadHealthRecord | null',
  'if (!safeLead) return false;',
  'if (!safeLead) return null;',
  "if (!safeLead) return 'Brak danych leada';",
];

for (const marker of required) {
  if (!content.includes(marker)) {
    fail(`missing marker: ${marker}`);
  }
}

const forbidden = [
  'export type LeadHealthInput = Record<string, unknown> & {',
  'export function isLeadMovedToService(lead: LeadHealthInput) {\n  const status = asText(lead.status);',
  'export function isActiveSalesLead(lead: LeadHealthInput) {\n  const status = String(lead.status ||',
];

for (const marker of forbidden) {
  if (content.includes(marker)) {
    fail(`old unsafe pattern still exists: ${marker}`);
  }
}

console.log('OK: A25E lead health null guard passed.');
