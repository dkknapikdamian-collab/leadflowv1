const fs = require('fs');
const path = require('path');
const root = process.cwd();
const marker = 'CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR_2026_05_08';
const commandName = 'check:closeflow-client-event-modal-runtime-repair';
const commandValue = 'node scripts/check-closeflow-client-event-modal-runtime-repair.cjs';
const files = {
  doc: 'docs/ui/CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR_2026-05-08.md',
  script: 'scripts/check-closeflow-client-event-modal-runtime-repair.cjs',
  packageJson: 'package.json',
  clientDetail: 'src/pages/ClientDetail.tsx',
  eventDialog: 'src/components/EventCreateDialog.tsx',
  indexCss: 'src/index.css',
  css: 'src/styles/closeflow-client-event-modal-runtime-repair.css',
  supabase: 'src/lib/supabase-fallback.ts',
};
function fail(message){ console.error('[closeflow-client-event-modal-runtime-repair] FAIL: ' + message); process.exit(1); }
function assert(condition, message){ if(!condition) fail(message); }
function abs(rel){ return path.join(root, rel); }
function exists(rel){ return fs.existsSync(abs(rel)); }
function read(rel){ return fs.readFileSync(abs(rel), 'utf8'); }
function bytes(rel){ return fs.readFileSync(abs(rel)); }
function assertNoBom(rel){ const b = bytes(rel); assert(!(b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf), rel + ' must be UTF-8 without BOM'); }
function assertNoControl(rel, text){ assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars'); }
function assertNoMojibake(rel, text){ const markers = [String.fromCharCode(0x00c4), String.fromCharCode(0x00c5), String.fromCharCode(0x0139), String.fromCharCode(0xfffd)]; for (const item of markers) assert(!text.includes(item), rel + ' contains mojibake-like marker U+' + item.charCodeAt(0).toString(16).toUpperCase()); }
for (const rel of Object.values(files)) assert(exists(rel), 'Missing required file: ' + rel);
for (const rel of [files.doc, files.script, files.css, files.packageJson]) { assertNoBom(rel); const text = read(rel); assertNoControl(rel, text); assertNoMojibake(rel, text); }
const doc = read(files.doc);
const script = read(files.script);
const pkg = JSON.parse(read(files.packageJson).replace(/^\uFEFF/, ''));
const clientDetail = read(files.clientDetail);
const eventDialog = read(files.eventDialog);
const indexCss = read(files.indexCss);
const css = read(files.css);
const supabase = read(files.supabase);
assert(doc.includes(marker), 'doc missing marker');
assert(css.includes(marker), 'css missing marker');
assert(script.includes(marker), 'check missing marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);
assert(supabase.includes('export async function deleteActivityFromSupabase'), 'supabase-fallback missing deleteActivityFromSupabase export');
assert(clientDetail.includes('deleteActivityFromSupabase'), 'ClientDetail missing deleteActivityFromSupabase import/reference');
assert(!/ReferenceError:\s*deleteActivityFromSupabase/.test(clientDetail), 'ClientDetail contains bad ReferenceError literal');
assert(indexCss.includes("@import './styles/closeflow-client-event-modal-runtime-repair.css';"), 'index.css missing runtime repair css import');
for (const token of [
  'CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR',
  'data-event-create-dialog-stage22b="true"',
  'closeflow-event-modal-readable',
  'event-form-vnext-content',
  'event-form-vnext-header',
  'event-form-vnext space-y-4',
  'event-form-footer',
  'data-event-modal-save-footer="true"',
  'Zapisz wydarzenie',
]) assert(eventDialog.includes(token), 'EventCreateDialog missing token: ' + token);
for (const token of [
  'background: #ffffff !important',
  'color: #0f172a !important',
  '-webkit-text-fill-color: #0f172a !important',
  'position: sticky !important',
  'button[type="submit"]',
  'Zapisz wydarzenie',
]) {
  if (token === 'Zapisz wydarzenie') assert(eventDialog.includes(token), 'event dialog missing save button copy');
  else assert(css.includes(token), 'repair css missing token: ' + token);
}
for (const token of ['deleteActivityFromSupabase', 'modal wydarze\u0144', 'widoczny save footer', 'nie zmienia danych']) {
  assert(doc.toLowerCase().includes(token.toLowerCase()), 'doc missing decision token: ' + token);
}
console.log('CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR_OK: ClientDetail note delete and event modal readability are guarded');
