const fs = require('fs');
const path = require('path');

const root = process.cwd();
const target = path.join(root, 'src/server/ai-drafts.ts');
const report = path.join(root, '_project/reports/STAGE216C2_AI_DRAFTS_AUTH_JSON_HOTFIX_2026-06-01.md');
const obsidian = path.join(root, 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-06-01 - CloseFlow Stage216-C2 AI drafts auth JSON hotfix.md');

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''; }

const text = read(target);
check('target exists: src/server/ai-drafts.ts', fs.existsSync(target));
check('imports writeAuthErrorResponse', text.includes("import { writeAuthErrorResponse } from './_supabase-auth.js';"));
check('catch delegates auth errors to writeAuthErrorResponse', text.includes('writeAuthErrorResponse(res, error);'));
check('catch returns after auth error response', /writeAuthErrorResponse\(res, error\);\s*return;/s.test(text));
check('keeps AI_DRAFT_WORKSPACE_REQUIRED 401 branch', text.includes("res.status(401).json({ error: 'AI_DRAFT_WORKSPACE_REQUIRED' });"));
check('keeps existing workspace AI access mapping', text.includes("WORKSPACE_AI_ACCESS_REQUIRED") && text.includes("AI_NOT_AVAILABLE_ON_FREE"));
check('does not add SQL/RLS/GRANT mutation text', !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(text));
check('report exists', fs.existsSync(report));
check('obsidian update exists', fs.existsSync(obsidian));

for (const item of checks) {
  console.log(`${item.pass ? 'PASS' : 'FAIL'} - ${item.name}`);
}
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);
