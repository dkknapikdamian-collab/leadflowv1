const fs = require('fs');
const path = require('path');
const { spawnSync } = require('node:child_process');
const root = process.cwd();
function must(label, condition) { if (!condition) throw new Error(label); }
const fallback = fs.readFileSync(path.join(root, 'src/lib/supabase-fallback.ts'), 'utf8');
const r60b = fs.readFileSync(path.join(root, 'scripts/check-stage228r60b-runner-quote-repair-and-r25-contract.cjs'), 'utf8');
const start = fallback.indexOf('export async function hardDeleteTaskFromSupabase');
const end = fallback.indexOf('export async function softDeleteTaskInSupabase', start);
must('hardDeleteTaskFromSupabase block exists', start >= 0 && end > start);
const block = fallback.slice(start, end);
must('runtime has R25 literal /api/system?apiRoute=tasks&id= contract', block.includes('/api/system?apiRoute=tasks&id='));
must('R60B guard has been reconciled to R25 literal route', r60b.includes('/api/system?apiRoute=tasks&id='));
must('R60B guard no longer requires obsolete apiRoute helper', r60b.includes('does not require obsolete helper apiRoute tasks'));
const guard = spawnSync(process.execPath, ['scripts/check-stage228r60b-runner-quote-repair-and-r25-contract.cjs'], { cwd: root, encoding: 'utf8' });
must('R60B guard passes after reconciliation: ' + (guard.stderr || guard.stdout), guard.status === 0);
console.log('STAGE228R62_RECONCILE_R60B_GUARD_WITH_R25_LITERAL PASS');
