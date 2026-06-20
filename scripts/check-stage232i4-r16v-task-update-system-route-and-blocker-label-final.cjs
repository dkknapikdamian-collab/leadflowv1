
const fs = require('fs');
const stage = 'STAGE232I4_R16V_TASK_UPDATE_SYSTEM_ROUTE_AND_BLOCKER_LABEL_FINAL';
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx','utf8');
const fallback = fs.readFileSync('src/lib/supabase-fallback.ts','utf8');
const errors = [];
function req(label, ok) { if (!ok) errors.push({ type:'required', label }); }
function forbid(label, needle, text=manager) { if (text.includes(needle)) errors.push({ type:'forbidden', label, needle }); }
const start = fallback.indexOf('export async function updateTaskInSupabase');
const end = fallback.indexOf('export async function hardDeleteTaskFromSupabase', start);
const block = start >= 0 && end > start ? fallback.slice(start, end) : '';
req('manager R16V marker exists', manager.includes(stage));
req('visible Blokuje label exists beside checkbox', manager.includes('data-stage232i4-r16v-manager-blocker-text="true">Blokuje</span>'));
req('blocker checkbox+label column width is fixed', manager.includes('grid-cols-[92px_minmax(120px,1fr)_66px_54px]'));
req('R16S compact layout preserved', manager.includes('data-stage232i4-r16s-r2-manager-row="aligned-compact-fixed-columns"'));
req('R16T no-badge layout preserved', manager.includes('data-stage232i4-r16t-manager-card-layout="checkbox-title-done-delete-fixed-columns-no-badges"'));
forbid('visual Klient badge must not return', '>Klient<');
forbid('old visual red Blokuje badge must not return', 'border-red-300/30');
req('updateTask block found', Boolean(block));
req('updateTask uses api/system apiRoute tasks', block.includes("'/api/system?apiRoute=tasks'"));
req('updateTask includes sourceId task mutation metadata', block.includes('sourceId: taskId'));
req('updateTask includes mutation cache category', block.includes("mutationCacheCategory: 'task'"));
req('updateTask emit source changed to R16V', block.includes('stage232i4_r16v_updateTaskInSupabase_system_route_no_existing_runtime_error'));
if (block.includes("'/api/tasks'")) errors.push({ type:'forbidden', label:'updateTask must not use legacy /api/tasks route' });
// Scope guard: only task update helper is switched; hard/soft delete can keep their explicit routes.
if (fallback.includes('STAGE232I4_R16V_FORBIDDEN_SQL')) errors.push({ type:'forbidden', label:'SQL marker unexpectedly present' });
if (errors.length) { console.error(JSON.stringify({ ok:false, stage, errors }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ ok:true, stage, contract:'Missing manager keeps approved compact layout with visible Blokuje label, and task PATCH uses api/system?apiRoute=tasks to avoid existing runtime error.' }, null, 2));
