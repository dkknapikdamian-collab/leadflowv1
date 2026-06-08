const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function fail(message) {
  console.error('STAGE228R18R5_MISSING_ITEM_HARD_DELETE_MASS_PREFLIGHT_FAIL: ' + message);
  process.exit(1);
}

function findMatching(text, openIndex, openChar, closeChar) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = openIndex; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === openChar) depth += 1;
    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findFunctionBody(text, fnName) {
  const nameIndex = text.indexOf(fnName);
  if (nameIndex < 0) fail('missing function ' + fnName);
  const arrowIndex = text.indexOf('=>', nameIndex);
  const open = text.indexOf('{', arrowIndex);
  const close = findMatching(text, open, '{', '}');
  if (open < 0 || close < 0) fail('cannot parse function ' + fnName);
  return text.slice(open + 1, close);
}

const lead = read('src/pages/LeadDetail.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const pkg = JSON.parse(read('package.json'));
const body = findFunctionBody(lead, 'handleDeleteLeadMissingItemStage228R15');

const checks = [
  ['LeadDetail marker missing', lead.includes('STAGE228R18R5_MISSING_ITEM_HARD_DELETE_MASS_PREFLIGHT')],
  ['hardDeleteTaskFromSupabase import missing', /import\s*\{[\s\S]*hardDeleteTaskFromSupabase[\s\S]*\}\s*from\s*'\.\.\/lib\/supabase-fallback';/m.test(lead)],
  ['delete handler must hard delete task', body.includes('await hardDeleteTaskFromSupabase(taskId);')],
  ['delete handler must not soft delete', !body.includes('await softDeleteTaskInSupabase(')],
  ['delete handler must not update task as deleted', !body.includes('await updateTaskInSupabase(')],
  ['delete handler must optimistically filter linked tasks', body.includes('setLinkedTasks((previous) => previous.filter')],
  ['delete handler must silently refresh', body.includes('loadLead({ silent: true })')],
  ['hardDeleteTaskFromSupabase export missing', fallback.includes('export async function hardDeleteTaskFromSupabase')],
  ['hard delete route/method missing', fallback.includes("'/api/system?apiRoute=tasks&id=' + encodeURIComponent(id), 'DELETE'")],
  ['prebuild guard not wired', String(pkg.scripts && pkg.scripts.prebuild || '').includes('check-stage228r18r5-missing-item-hard-delete-source-truth.cjs')]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) fail(failed.join('; '));

console.log(JSON.stringify({ ok: true, stage: 'STAGE228R18R5_MISSING_ITEM_HARD_DELETE_MASS_PREFLIGHT', contract: 'Lead missing item delete uses hard DELETE, optimistic remove and silent refresh; guard is wired into prebuild.' }, null, 2));
