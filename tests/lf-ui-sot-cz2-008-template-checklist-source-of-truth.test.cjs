const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mojibakePattern = /[\u00c5\u00c4\u0139\ufffd]/;
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('CZ2-008 template-options exports canonical template metadata', () => {
  const source = read('src/lib/source-of-truth/template-options.ts');
  for (const token of ['TemplateItemTypeValue','TemplateItemDraft','TemplateRecord','TemplateItemTypeMeta','TEMPLATE_ITEM_TYPE_OPTIONS','EMPTY_TEMPLATE_ITEM','getTemplateItemTypeMeta','getTemplateItemTypeLabel','normalizeTemplateItems','createEmptyTemplateItem','createEmptyTemplateDraft','getTemplateItemCount','getRequiredTemplateItemCount']) {
    assert.match(source, new RegExp(`export\\s+(type|const|function)\\s+${token}\\b`));
  }
});

test('CZ2-008 TEMPLATE_ITEM_TYPE_OPTIONS preserves values labels and badges', () => {
  const source = read('src/lib/source-of-truth/template-options.ts');
  for (const value of ['file', 'text', 'decision', 'access', 'meeting', 'payment', 'materials', 'other']) assert.match(source, new RegExp(`value:\\s*'${value}'`));
  for (const label of ['Plik','Tekst / brief','Decyzja / akceptacja','Dostęp / login','Spotkanie / telefon','Płatność / faktura','Materiały / zdjęcia','Inne']) assert.match(source, new RegExp(`label:\\s*'${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
  for (const className of ['border-sky-200 bg-sky-50 text-sky-700','border-indigo-200 bg-indigo-50 text-indigo-700','border-amber-200 bg-amber-50 text-amber-700','border-emerald-200 bg-emerald-50 text-emerald-700','border-blue-200 bg-blue-50 text-blue-700','border-rose-200 bg-rose-50 text-rose-700','border-violet-200 bg-violet-50 text-violet-700','border-slate-200 bg-slate-50 text-slate-700']) assert.match(source, new RegExp(`badgeClassName:\\s*'${className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
});

test('CZ2-008 template helpers preserve old normalize and empty draft behavior', () => {
  const source = read('src/lib/source-of-truth/template-options.ts');
  assert.match(source, /title:\s*item\.title\?\.trim\(\) \|\| ''/);
  assert.match(source, /description:\s*item\.description\?\.trim\(\) \|\| ''/);
  assert.match(source, /type:\s*getTemplateItemTypeMeta\(item\.type\)\.value/);
  assert.match(source, /isRequired:\s*item\.isRequired !== false/);
  assert.match(source, /name:\s*''/);
  assert.match(source, /items:\s*\[createEmptyTemplateItem\(\)\]/);
  assert.match(source, /filter\(\(item\) => item\.isRequired\)\.length/);
});

test('CZ2-008 Templates.tsx consumes template-options without local SOT helpers', () => {
  const source = read('src/pages/Templates.tsx');
  assert.match(source, /from '\.\.\/lib\/source-of-truth\/template-options'/);
  assert.match(source, /TEMPLATE_ITEM_TYPE_OPTIONS\.map/);
  assert.match(source, /createEmptyTemplateDraft\(\)/);
  assert.match(source, /createEmptyTemplateItem\(\)/);
  assert.match(source, /getTemplateItemTypeMeta\(item\.type\)/);
  assert.doesNotMatch(source, /^type\s+TemplateItemType\b/m);
  assert.doesNotMatch(source, /^type\s+TemplateItemDraft\b/m);
  assert.doesNotMatch(source, /^type\s+TemplateRecord\b/m);
  assert.doesNotMatch(source, /^const\s+ITEM_TYPE_OPTIONS\b/m);
  assert.doesNotMatch(source, /^const\s+EMPTY_ITEM\b/m);
  assert.doesNotMatch(source, /^function\s+cloneEmptyItem\b/m);
  assert.doesNotMatch(source, /^function\s+createEmptyDraft\b/m);
  assert.doesNotMatch(source, /^function\s+normalizeTemplateItems\b/m);
  assert.doesNotMatch(source, /^function\s+itemTypeMeta\b/m);
  assert.doesNotMatch(source, /^function\s+getTemplateItemTypeLabel\b/m);
  assert.doesNotMatch(source, /^function\s+getTemplateItemCount\b/m);
  assert.doesNotMatch(source, /^function\s+getRequiredItemCount\b/m);
});

test('CZ2-008 routes and case item status SOT remain intact', () => {
  const app = read('src/App.tsx');
  const routes = read('src/lib/routes.ts');
  const caseOptions = read('src/lib/source-of-truth/case-options.ts');
  const caseStatus = read('src/lib/config/case-status.ts');
  assert.match(app, /path=\{CLOSEFLOW_ROUTES\.templates\}/);
  assert.match(app, /path=\{CLOSEFLOW_ROUTES\.caseTemplates\}/);
  assert.match(app, /<Navigate to=\{templatesPath\(\)\} replace/);
  assert.match(routes, /templates:\s*'\/templates'/);
  assert.match(routes, /caseTemplates:\s*'\/case-templates'/);
  assert.match(routes, /path:\s*CLOSEFLOW_ROUTES\.templates,\s*status:\s*'canonical'/);
  assert.match(routes, /path:\s*CLOSEFLOW_ROUTES\.caseTemplates,\s*status:\s*'alias'/);
  assert.match(routes, /aliasFor:\s*CLOSEFLOW_ROUTES\.templates/);
  for (const token of ['CASE_ITEM_STATUS_LABELS','CASE_ITEM_STATUS_OPTIONS','CASE_ITEM_STATUS_META_BY_VALUE','normalizeCaseItemStatus','getCaseItemStatusMeta','getCaseItemStatusLabel']) assert.match(caseOptions, new RegExp(`export\\s+(const|function)\\s+${token}\\b`));
  assert.match(caseStatus, /from '\.\.\/source-of-truth\/case-options'/);
  assert.match(caseStatus, /getCaseItemStatusLabel/);
  assert.match(caseStatus, /getCaseItemStatusMeta/);
});

test('CZ2-008 changed source files are UTF-8 clean', () => {
  for (const rel of ['src/lib/source-of-truth/template-options.ts','src/pages/Templates.tsx','scripts/guards/verify-lf-ui-sot-cz2-008-template-checklist-source-of-truth.cjs','tests/lf-ui-sot-cz2-008-template-checklist-source-of-truth.test.cjs']) assert.doesNotMatch(read(rel), mojibakePattern, `${rel} contains mojibake`);
});
