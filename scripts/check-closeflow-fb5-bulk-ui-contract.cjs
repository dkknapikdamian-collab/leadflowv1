const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const fail = [];
function read(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { fail.push(`missing ${rel}`); return ''; }
  return fs.readFileSync(p, 'utf8');
}
function assert(cond, msg) { if (!cond) fail.push(msg); }
const app = read('src/App.tsx');
assert(!/position\s*=\s*['"]top-right['"]/.test(app), 'No Toaster can stay top-right');
const dialog = read('src/components/EntityConflictDialog.tsx');
assert(!/text-rose-|text-red-|bg-rose-|bg-red-|border-rose-|border-red-/.test(dialog), 'EntityConflictDialog must not contain local red/rose classes');
const client = read('src/pages/ClientDetail.tsx');
assert(!/onClick=\{\(\)\s*=|data-fb5-danger-source/.test(client), 'ClientDetail contains broken FB5 injection residue');
if (fail.length) { console.error('CLOSEFLOW_FB5_BULK_UI_CONTRACT_FAILED'); for (const f of fail) console.error(`- ${f}`); process.exit(1); }
console.log('CLOSEFLOW_FB5_BULK_UI_CONTRACT_OK');
