const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}

function expect(file, needle, label) {
  const body = read(file);
  if (!body.includes(needle)) {
    throw new Error(`${file}: missing ${label || needle}`);
  }
  console.log(`OK: ${file} contains ${label || needle}`);
}

function reject(file, needle, label) {
  const body = read(file);
  if (body.includes(needle)) {
    throw new Error(`${file}: forbidden ${label || needle}`);
  }
  console.log(`OK: ${file} excludes ${label || needle}`);
}

JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
reject('src/index.css', 'visual-stage16-today-html-reset.css', 'inactive Stage16 global CSS import');
expect('src/App.tsx', "import('./pages/TodayStable')", 'active TodayStable route');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual owner entrypoint');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-page-header-runtime.css", 'current Today page-header adapter');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-runtime.css", 'current Today canvas adapter');
expect('src/styles/owners/closeflow-page-adapters.css', 'cf-html-shell', 'canonical shell adapter');
expect('src/styles/owners/closeflow-page-header-responsive.css', 'page-header', 'canonical page-header adapter');
expect('src/styles/owners/closeflow-responsive-adapters.css', 'grid-template-columns', 'canonical responsive shell adapter');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists due_at', 'due_at SQL hotfix');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists client_id', 'client_id SQL hotfix');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', "pg_notify('pgrst', 'reload schema')", 'PostgREST schema reload');
expect('package.json', 'check:visual-stage16-today-html-reset', 'Stage16 package script');
console.log('OK: Visual Stage16 Today guard reconciled with current TodayStable source truth.');
