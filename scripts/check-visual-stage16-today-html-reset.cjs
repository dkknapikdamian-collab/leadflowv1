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
expect('src/pages/TodayStable.tsx', "../styles/closeflow-page-header-v2.css", 'current Today page header CSS import');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Stage211C canvas import');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Stage211E canvas source import');
expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-runtime-source-truth-stage211j.css", 'current Stage211J runtime canvas import');
expect('src/pages/TodayStable.tsx', 'P0_TODAY_STABLE_REBUILD', 'current TodayStable rebuild marker');
expect('src/pages/TodayStable.tsx', 'STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH', 'current Today production UI source marker');
expect('src/styles/visual-stage16-today-html-reset.css', 'VISUAL_STAGE16_TODAY_HTML_RESET_CSS', 'Stage16 reference CSS marker');
expect('src/styles/visual-stage16-today-html-reset.css', '.main-today', 'historical Today route selector');
expect('src/styles/visual-stage16-today-html-reset.css', 'cf-html-shell', 'historical HTML shell compatibility selector');
expect('src/styles/visual-stage16-today-html-reset.css', 'grid-template-columns: 286px minmax(0, 1fr)', 'historical HTML sidebar grid width');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists due_at', 'due_at SQL hotfix');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists client_id', 'client_id SQL hotfix');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', "pg_notify('pgrst', 'reload schema')", 'PostgREST schema reload');
expect('package.json', 'check:visual-stage16-today-html-reset', 'Stage16 package script');
console.log('OK: Visual Stage16 Today guard reconciled with current TodayStable source truth.');
