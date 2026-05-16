#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');
const expect = (condition, message) => { if (!condition) fail.push(message); };

const toolbar = read('src/components/admin-tools/AdminDebugToolbar.tsx');
const css = read('src/styles/admin-tools.css');
const pkg = JSON.parse(read('package.json'));

expect(toolbar.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D'), 'toolbar must carry Stage87D click-to-annotate marker');
expect(toolbar.includes("mode: 'review' | 'copy' | 'bug'"), 'Target dialog must support review/copy/bug modes');
expect(toolbar.includes("activeTool === 'bug'"), 'Bug mode must be element-picking mode');
expect(toolbar.includes("activeTool === 'copy'"), 'Copy mode must be element-picking mode');
expect(!toolbar.includes('setBugOpen(true)'), 'Bug button must not open a standalone modal immediately');
expect(!toolbar.includes('const [bugOpen'), 'bugOpen modal state must be removed');
expect(toolbar.includes('pickAdminTargetCandidate'), 'click-to-annotate must use DOM target picker');
expect(toolbar.includes('event.preventDefault()'), 'selection click must prevent underlying action');
expect(toolbar.includes('event.stopPropagation()'), 'selection click must stop propagation');
expect(toolbar.includes('saveOnEnter'), 'quick editor must support Enter-to-save');
expect(toolbar.includes("event.key !== 'Enter'"), 'Enter key handling must be explicit');
expect(toolbar.includes('finishSave(candidate'), 'save must produce feedback and keep mode active');
expect(toolbar.includes('Zapisano:'), 'save feedback text missing');
expect(toolbar.includes('data-admin-debug-selected-stage87d'), 'selected element marker missing');
expect(toolbar.includes('data-admin-debug-saved-stage87d'), 'saved element marker missing');
expect(toolbar.includes('admin-tool-quick-editor'), 'quick editor UI missing');
expect(toolbar.includes('Bug Note Recorder'), 'Bug quick editor title missing');
expect(toolbar.includes('Copy Review'), 'Copy quick editor title missing');
expect(toolbar.includes('UI Review'), 'Review quick editor title missing');
expect(css.includes('ADMIN_CLICK_TO_ANNOTATE_STAGE87D'), 'CSS must carry Stage87D marker');
expect(css.includes('.admin-tool-quick-editor'), 'quick editor CSS missing');
expect(css.includes('[data-admin-debug-selected-stage87d="true"]'), 'selected outline CSS missing');
expect(css.includes('[data-admin-debug-saved-stage87d="true"]'), 'saved outline CSS missing');
expect(Boolean(pkg.scripts?.['check:admin-click-to-annotate']), 'package.json missing check:admin-click-to-annotate');
expect(Boolean(pkg.scripts?.['test:admin-click-to-annotate']), 'package.json missing test:admin-click-to-annotate');
expect(String(pkg.scripts?.['verify:admin-tools'] || '').includes('check:admin-click-to-annotate'), 'verify:admin-tools must include Stage87D guard');

if (fail.length) {
  console.error('Admin click-to-annotate guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS ADMIN_CLICK_TO_ANNOTATE_STAGE87D');
