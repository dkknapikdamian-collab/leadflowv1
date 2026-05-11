#!/usr/bin/env node
/* CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_CHECK_2026_05_11 */
const fs = require('fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}
function must(path, needle) {
  const content = read(path);
  if (!content.includes(needle)) {
    console.error(`Missing in ${path}: ${needle}`);
    process.exit(1);
  }
}
function mustNot(path, needle) {
  const content = read(path);
  if (content.includes(needle)) {
    console.error(`Forbidden in ${path}: ${needle}`);
    process.exit(1);
  }
}

must('src/styles/emergency/emergency-hotfixes.css', 'CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_IMPORT_2026_05_11');
must('src/styles/closeflow-page-header-stage6-final-lock.css', 'CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_2026_05_11');
must('src/styles/closeflow-page-header-stage6-final-lock.css', '.page-head');
must('src/styles/closeflow-page-header-stage6-final-lock.css', 'header.billing-header');
must('src/styles/closeflow-page-header-stage6-final-lock.css', 'header.support-header');
must('src/styles/closeflow-page-header-stage6-final-lock.css', 'data-cf-command-action="ai"');
must('src/styles/closeflow-page-header-stage6-final-lock.css', 'button:has(svg.lucide-trash-2)');
must('src/lib/page-header-content.ts', "Źródłem prawdy jest Twoja biblioteka.");
must('src/lib/page-header-content.ts', "Sprawdź, popraw i zatwierdź szkice przed zapisem.");
must('src/lib/page-header-content.ts', "Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.");
mustNot('src/lib/page-header-content.ts', 'w CRM');
must('src/pages/TasksStable.tsx', 'data-page-header-new-task-stage6="true"');
must('src/pages/TasksStable.tsx', 'Nowe zadanie');
must('package.json', 'check:page-header-stage6-final-lock');

const responseTemplates = read('src/pages/ResponseTemplates.tsx');
const duplicateCount = (responseTemplates.match(/PAGE_HEADER_CONTENT\.responseTemplates\.description/g) || []).length;
if (duplicateCount > 1) {
  console.error(`ResponseTemplates header still has duplicate description references: ${duplicateCount}`);
  process.exit(1);
}

console.log('CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_CHECK_OK');
