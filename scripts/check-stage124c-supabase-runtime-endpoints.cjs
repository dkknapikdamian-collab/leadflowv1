#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const reportPath = path.join(repo, '_project', 'runs', '2026-05-19_stage124c_supabase_runtime_endpoint_audit_result.md');
if (!fs.existsSync(reportPath)) {
  console.error('Stage124C guard failed: audit result missing. Run tools/audit-stage124c-supabase-runtime-endpoints.cjs first.');
  process.exit(1);
}
const text = fs.readFileSync(reportPath, 'utf8');
if (!/Runtime files scanned: \d+/.test(text)) {
  console.error('Stage124C guard failed: runtime scan summary missing.');
  process.exit(1);
}
if (!/API route candidates found:/.test(text)) {
  console.error('Stage124C guard failed: API route candidate summary missing.');
  process.exit(1);
}
if (!/blockers: \d+/.test(text)) {
  console.error('Stage124C guard failed: blocker summary missing.');
  process.exit(1);
}
console.log('✔ Stage124C runtime endpoint audit contract holds');
