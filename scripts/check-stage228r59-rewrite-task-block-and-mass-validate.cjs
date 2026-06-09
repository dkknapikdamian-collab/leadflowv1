const fs = require('fs');
const path = require('path');
const { spawnSync } = require('node:child_process');
const root = process.cwd();
function must(label, condition) { if (!condition) throw new Error(label); }
const content = fs.readFileSync(path.join(root, 'src/lib/supabase-fallback.ts'), 'utf8');
must('R59 marker update task exists', content.includes('stage228r59_updateTaskInSupabase_no_flicker_update'));
must('R59 marker soft delete exists', content.includes('stage228r59_softDeleteTaskInSupabase_no_flicker_delete'));
must('No malformed task block tail remains', !/\}\)\s*\{/.test(content.slice(content.indexOf('export async function updateTaskInSupabase'), content.indexOf('export async function updateEventInSupabase'))));
const check = spawnSync(process.execPath, ['--check', 'src/lib/supabase-fallback.ts'], { cwd: root, encoding: 'utf8' });
must('node --check supabase-fallback passes: ' + (check.stderr || check.stdout), check.status === 0);
console.log('STAGE228R59_REWRITE_TASK_BLOCK_AND_MASS_VALIDATE PASS');
