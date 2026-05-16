const fs = require('fs');
const path = require('path');
const assert = require('assert');

const repoRoot = path.resolve(__dirname, '..');
const templatesPath = path.join(repoRoot, 'src', 'pages', 'Templates.tsx');
const entityActionsPath = path.join(repoRoot, 'src', 'components', 'entity-actions.tsx');
const recordListCssPath = path.join(repoRoot, 'src', 'styles', 'closeflow-record-list-source-truth.css');

const read = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');

const templates = read(templatesPath);
const entityActions = read(entityActionsPath);
const recordListCss = read(recordListCssPath);

assert(templates.includes('EntityTrashButton'), 'Templates.tsx must use shared EntityTrashButton for destructive delete actions.');
assert(templates.includes('trashActionIconClass'), 'Templates.tsx must use shared trash icon class for delete icon color/source.');
assert(templates.includes('data-cf-template-delete-action="true"'), 'Template card must expose a visible delete action.');
assert(templates.includes('data-cf-template-delete-action="menu"'), 'Template overflow menu delete must keep shared destructive action marker.');
assert(templates.includes('deleteCaseTemplateFromSupabase(template.id)'), 'Delete handler must delete by template.id from a TemplateRecord, not a loose id string.');
assert(templates.includes('window.confirm'), 'Template delete must require an explicit confirmation.');
assert(templates.includes('getTemplateItemCount(template)'), 'Delete confirmation must account for checklist items stored in the template.');
assert(templates.includes('Pozycje ju\u017C skopiowane do istniej\u0105cych spraw nie s\u0105 usuwane z tego ekranu'), 'Delete copy must state that existing case checklist items are not deleted from this screen.');

assert(templates.includes('main-templates-html'), 'Templates page must have a stable visual scope class.');
assert(templates.includes('data-cf-templates-page-source="record-list-source-truth"'), 'Templates page must declare record-list source of truth.');
assert(templates.includes('data-cf-template-card-source="record-list-source-truth"'), 'Template cards must use record-list source-of-truth marker.');
assert(templates.includes('cf-template-card cf-readable-card'), 'Template cards must use readable card styling.');
assert(!templates.includes('data-a16-template-light-ui'), 'Templates page must not use old random stage/debug visual marker as active styling source.');

assert(entityActions.includes('CLOSEFLOW_TRASH_ACTION_SOURCE_OF_TRUTH'), 'Entity action source of truth must expose trash action contract.');
assert(entityActions.includes('data-cf-destructive-source="trash-action-source"'), 'EntityTrashButton must carry destructive source marker.');
assert(entityActions.includes('cf-trash-action-button'), 'Shared trash action button class must exist.');
assert(entityActions.includes('cf-trash-action-icon'), 'Shared trash action icon class must exist.');

assert(recordListCss.includes('STAGE105_TEMPLATES_DELETE_AND_VISUAL_CONTRACT'), 'Record list CSS must include Stage105 templates visual contract.');
assert(recordListCss.includes('.main-templates-html'), 'Record list CSS must target templates visual scope.');
assert(recordListCss.includes('[data-cf-template-card-source="record-list-source-truth"]'), 'Record list CSS must style template cards via source marker.');
assert(!recordListCss.includes('admin-debug'), 'Template visual contract must not rely on admin-debug styling.');

console.log('OK: Stage105 templates delete and visual contract passed.');
