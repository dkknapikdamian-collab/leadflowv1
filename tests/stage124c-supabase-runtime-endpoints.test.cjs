const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Stage124C writes runtime endpoint audit with explicit blocker state', () => {
  const report = path.join(process.cwd(), '_project', 'runs', '2026-05-19_stage124c_supabase_runtime_endpoint_audit_result.md');
  assert.equal(fs.existsSync(report), true, 'audit report must exist');
  const text = fs.readFileSync(report, 'utf8');
  assert.match(text, /# Stage124C - Supabase runtime endpoint audit result/);
  assert.match(text, /\/api\/tasks\|\/api\/events call sites: \d+/);
  assert.match(text, /API route candidates found:/);
  assert.match(text, /blockers: \d+/);
});
