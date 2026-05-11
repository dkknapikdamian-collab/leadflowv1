const fs = require('fs');

let pass = 0;
let fail = 0;

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
}

function check(condition, area, name, detail = '') {
  if (condition) {
    pass += 1;
    console.log(`PASS ${area} :: ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${area} :: ${name}${detail ? ` :: ${detail}` : ''}`);
  }
}

const files = {
  app: 'src/App.tsx',
  client: 'src/pages/ClientDetail.tsx',
  css: 'src/styles/closeflow-action-tokens.css',
  entityActions: 'src/components/entity-actions.tsx',
  fb4: 'src/pages/TodayStable.tsx',
  doc: 'docs/feedback/CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_2026-05-09.md',
};

for (const [key, file] of Object.entries(files)) {
  check(fs.existsSync(file), 'files', file);
}

const app = read(files.app);
const client = read(files.client);
const css = read(files.css);
const entityActions = read(files.entityActions);
const fb4 = read(files.fb4);
const doc = read(files.doc);

const toasterTags = app.match(/<Toaster\b[^>]*\/>/g) || [];
check(toasterTags.length >= 1, 'toast', 'Toaster tags found');
check(toasterTags.every((tag) => /position=["']top-center["']/.test(tag)), 'toast', 'all Toasters top-center', toasterTags.join(' | '));
check(toasterTags.every((tag) => /\brichColors\b/.test(tag)), 'toast', 'richColors retained');
check(toasterTags.every((tag) => /\bcloseButton\b/.test(tag)), 'toast', 'closeButton retained');
check(!/position=["']top-right["']/.test(app), 'toast', 'top-right absent');

const brokenFragments = ['<article`', '<span`', '`}>', 'article`}', 'span`}'];
for (const needle of brokenFragments) {
  check(!client.includes(needle), 'jsx', `broken fragment absent ${needle}`);
}

check(entityActions.includes('actionIconClass'), 'danger-source', 'actionIconClass exists in entity-actions');
check(client.includes('actionIconClass'), 'danger-source', 'ClientDetail uses actionIconClass');
check(client.includes("actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')"), 'danger-source', 'ClientDetail uses danger tone class');
check(client.includes('data-fb5-danger-source="client-detail-trash"'), 'danger-source', 'ClientDetail data source marker');

const trashBlocks = client.match(/<(button|Button|EntityActionButton)\b[^>]*>[\s\S]*?<Trash2\b[\s\S]*?<\/\1>/g) || [];
check(trashBlocks.length >= 1, 'danger-source', 'Trash2 action blocks found');
trashBlocks.forEach((block, index) => {
  check(block.includes("actionIconClass('danger'"), 'danger-source', `Trash2 block ${index + 1} uses danger class`);
  check(!/bg-primary|text-white|from-primary|to-primary/.test(block), 'danger-source', `Trash2 block ${index + 1} no primary visual drift`);
  check(!/variant=\{?["'](?:default|primary)["']\}?/.test(block), 'danger-source', `Trash2 block ${index + 1} no primary/default variant`);
});

check(css.includes('CLOSEFLOW_DANGER_STYLE_CONTRACT'), 'css', 'global danger style contract retained');
check(css.includes('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_STYLE'), 'css', 'FB-5 style marker present');
check(css.includes('.client-detail-note-delete-action'), 'css', 'note delete class present');
check(css.includes('var(--cf-action-danger-text)'), 'css', 'uses danger text token');
check(css.includes('var(--cf-action-danger-bg-hover)'), 'css', 'uses danger hover token');
check(!/client-detail-note-delete-action[\s\S]{0,500}(#[0-9a-fA-F]{3,8}|rgb\(|rgba\()/.test(css), 'css', 'FB-5 block has no local raw color');

check(fb4.includes('CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP'), 'carry-forward', 'FB-4 marker retained');
check(doc.includes('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE'), 'docs', 'FB-5 doc marker');
check(doc.includes('top-center'), 'docs', 'toast placement documented');
check(doc.includes('actionIconClass'), 'docs', 'danger source documented');

console.log(`\npassed=${pass}`);
console.log(`failed=${fail}`);
if (fail > 0) {
  console.log(`FAIL CLOSEFLOW_FB5_HEAVY_UI_GUARDS_FAILED failed=${fail}`);
  process.exit(1);
}
console.log('CLOSEFLOW_FB5_HEAVY_UI_GUARDS_OK');
