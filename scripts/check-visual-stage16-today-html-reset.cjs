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

JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
expect('src/index.css', '@import "./styles/visual-stage16-today-html-reset.css";', 'Stage 16 CSS import');
expect('src/styles/visual-stage16-today-html-reset.css', 'VISUAL_STAGE16_TODAY_HTML_RESET_CSS', 'Stage 16 CSS marker');
expect('src/styles/visual-stage16-today-html-reset.css', '.main-today', 'Today route styling');
expect('src/styles/visual-stage16-today-html-reset.css', 'cf-html-shell', 'HTML shell compatibility styling');
expect('src/styles/visual-stage16-today-html-reset.css', 'grid-template-columns: 286px minmax(0, 1fr)', 'HTML sidebar grid width');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists due_at', 'due_at SQL hotfix');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists client_id', 'client_id SQL hotfix');
expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', "pg_notify('pgrst', 'reload schema')", 'PostgREST schema reload');
expect('package.json', 'check:visual-stage16-today-html-reset', 'Stage 16 package script');
console.log('OK: Visual Stage 16 Today HTML reset + work_items SQL guard passed.');
