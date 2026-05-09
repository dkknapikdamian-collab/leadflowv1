#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error('CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR_V2_FAIL: ' + message);
  process.exit(1);
}

const root = process.cwd();
const leads = fs.readFileSync(path.join(root, 'api/leads.ts'), 'utf8');
if (!leads.includes('CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR_V2')) {
  fail('Missing repair marker in api/leads.ts');
}
if (/company:\s*asText\(body\.company\)\s*\|\|\s*null\s*,/.test(leads)) {
  fail('Lead POST still writes company as null fallback');
}
if (!/company:\s*asText\(body\.company\)\s*,/.test(leads) && !/company:\s*asText\(body\.company\s*\|\|\s*body\.companyName\)\s*,/.test(leads)) {
  fail('Could not find safe company fallback in lead POST payload');
}
if (!leads.includes('insertLeadWithSchemaFallback')) {
  fail('Lead insert path missing insertLeadWithSchemaFallback');
}
console.log('CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR_V2_CHECK_OK');
