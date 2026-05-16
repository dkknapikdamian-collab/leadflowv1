#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const storage = read('src/components/admin-tools/admin-tools-storage.ts');
const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
const pkg = JSON.parse(read('package.json'));

expect(toolbar.includes('ADMIN_EXPORT_CLEARS_COUNTERS_STAGE89'), 'toolbar must carry Stage89 export clear marker');
expect(toolbar.includes('clearAdminFeedbackItems'), 'toolbar must import/use clearAdminFeedbackItems');
expect(toolbar.includes('refreshAdminFeedbackCounters'), 'toolbar must refresh local counters after export');
expect(toolbar.includes('exportJsonAndClear'), 'JSON export must clear counters');
expect(toolbar.includes('exportMarkdownAndClear'), 'Markdown export must clear counters');
expect(toolbar.includes('Pobierz JSON i wyczy\u015B\u0107 licznik'), 'JSON export button copy must be explicit');
expect(toolbar.includes('Pobierz Markdown i wyczy\u015B\u0107 licznik'), 'Markdown export button copy must be explicit');
expect(toolbar.includes('Wyeksportowano ${kind} i wyczyszczono licznik zg\u0142osze\u0144'), 'success toast must tell counters were cleared');
expect(storage.includes('ADMIN_FEEDBACK_EXPORT_CLEAR_COUNTERS_STAGE89'), 'storage must carry Stage89 clear marker');
expect(storage.includes('export function clearAdminFeedbackItems()'), 'storage must expose clearAdminFeedbackItems');
expect(storage.includes('writeReviewItems([])'), 'clearAdminFeedbackItems must clear review items');
expect(storage.includes('writeBugItems([])'), 'clearAdminFeedbackItems must clear bug items');
expect(storage.includes('writeCopyItems([])'), 'clearAdminFeedbackItems must clear copy items');
expect(storage.includes('writeButtonSnapshots([])'), 'clearAdminFeedbackItems must clear button snapshots');
expect(css.includes('STAGE89_RIGHT_RAIL_WORK_CENTER_UNCRAMP'), 'CSS must carry Stage89 right rail marker');
expect(css.includes('grid-template-columns: minmax(0, 1fr) minmax(400px, 440px)'), 'right rail must be wider on desktop');
expect(css.includes('.lead-detail-right-rail .lead-detail-work-center-grid'), 'right rail work center grid override missing');
expect(css.includes('overflow-wrap: normal !important'), 'right rail labels must not break every letter');
expect(css.includes('hyphens: none !important'), 'right rail labels must disable hyphenation/letter split');
expect(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'medium desktop must switch to 2 columns');
expect(Boolean(pkg.scripts?.['check:stage89-right-rail-export-clear']), 'package missing Stage89 check script');
expect(Boolean(pkg.scripts?.['test:stage89-right-rail-export-clear']), 'package missing Stage89 test script');
expect(String(pkg.scripts?.['verify:admin-tools'] || '').includes('check:stage89-right-rail-export-clear'), 'verify:admin-tools must include Stage89 check');

if (fail.length) {
  console.error('Stage89 right rail/export clear guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS STAGE89_RIGHT_RAIL_EXPORT_CLEAR');
