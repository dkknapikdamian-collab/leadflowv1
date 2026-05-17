const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const count = (text, needle) => text.split(needle).length - 1;

function getDeleteHandler(templates) {
  const start = templates.indexOf('async function handleDeleteTemplate');
  assert.notEqual(start, -1, 'missing handleDeleteTemplate');
  const end = templates.indexOf('\n\n  return (', start);
  assert.notEqual(end, -1, 'missing return marker after handleDeleteTemplate');
  return templates.slice(start, end);
}

test('Stage107 templates delete action uses shared destructive source of truth', () => {
  const templates = read('src/pages/Templates.tsx');
  assert.ok(templates.includes('EntityTrashButton'), 'Templates must use EntityTrashButton');
  assert.ok(templates.includes('trashActionIconClass'), 'Templates must use trashActionIconClass');
  assert.ok(templates.includes('data-cf-template-delete-action="true"'), 'visible delete button marker missing');
  assert.ok(templates.includes('data-cf-template-delete-action="menu"'), 'menu delete marker missing');
  assert.ok(templates.includes('data-cf-template-card-delete-visible="true"'), 'card delete visibility marker missing');
});

test('Stage107 templates delete has conscious confirmation and reloads list', () => {
  const templates = read('src/pages/Templates.tsx');
  const block = getDeleteHandler(templates);
  assert.ok(block.includes('deleteCaseTemplateFromSupabase(template.id)'), 'delete should call Supabase delete helper');
  assert.ok(block.includes('await loadTemplates()'), 'delete should refresh list after delete');
  assert.ok(block.includes('if (itemCount > 0)'), 'templates with checklist items need second confirmation');
  assert.ok(count(block, 'window.confirm(') >= 2, 'delete should have two confirms');
});

test('Stage107 templates card uses readable record-list visual source', () => {
  const templates = read('src/pages/Templates.tsx');
  const css = read('src/styles/closeflow-record-list-source-truth.css');
  assert.ok(templates.includes('data-cf-template-card-source="record-list-source-truth"'), 'template card source marker missing');
  assert.ok(templates.includes('data-cf-template-card-actions="true"'), 'template actions marker missing');
  assert.ok(templates.includes('data-cf-template-card-items="true"'), 'template items marker missing');
  assert.ok(css.includes('STAGE107_TEMPLATES_DELETE_AND_VISUAL_CONTRACT'), 'Stage107 templates CSS marker missing');
  assert.ok(css.includes('.cf-template-card-actions'), 'template actions CSS missing');
  assert.ok(css.includes('[data-cf-template-delete-action="true"]'), 'template delete CSS missing');
});

test('Stage107 templates guard is wired into quiet release gate once', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const entry = 'tests/stage107-templates-delete-and-visual-contract.test.cjs';
  assert.equal(count(quiet, entry), 1, 'Stage107 templates test must be listed once');
});
