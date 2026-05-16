#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const exportFile = read('src/components/admin-tools/admin-tools-export.ts');
const storage = read('src/components/admin-tools/admin-tools-storage.ts');
const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');

expect(exportFile.includes('closeflow_admin_feedback_'), 'Export filename prefix missing');
expect(exportFile.includes('.json') && exportFile.includes('.md'), 'Export must support JSON and Markdown');
expect(exportFile.includes('downloadAdminFeedbackFile'), 'Browser download helper missing');
expect(exportFile.includes('buildAdminFeedbackMarkdown'), 'Markdown export builder missing');
expect(exportFile.includes('Blokery P0'), 'Markdown must include P0 section');
expect(exportFile.includes('Button Matrix'), 'Markdown must include Button Matrix section');
expect(exportFile.includes('Zmiany tekst\u00F3w do wdro\u017Cenia'), 'Markdown must include Copy Changes section');
expect(storage.includes('readFullAdminFeedbackExport'), 'Storage must expose full export reader');
expect(toolbar.includes('exportAdminFeedbackJson') && toolbar.includes('exportAdminFeedbackMarkdown'), 'Toolbar must call export actions');
expect(!exportFile.includes('fetch('), 'Export must not send data to backend');

if (fail.length) {
  console.error('Admin Feedback Export guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}
console.log('PASS ADMIN_FEEDBACK_EXPORT_STAGE87');
