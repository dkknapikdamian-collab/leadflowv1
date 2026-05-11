const fs = require('fs');

let pass = 0;
let fail = 0;

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function check(condition, label, detail = '') {
  if (condition) {
    pass += 1;
    console.log(`PASS ${label}`);
  } else {
    fail += 1;
    console.log(`FAIL ${label}${detail ? ` :: ${detail}` : ''}`);
  }
}

const app = read('src/App.tsx');
const client = read('src/pages/ClientDetail.tsx');
const css = read('src/styles/closeflow-action-tokens.css');
const doc = read('docs/feedback/CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_2026-05-09.md');

const toasterTags = app.match(/<Toaster\b[^>]*\/>/g) || [];
check(toasterTags.length >= 1, 'App has Toaster tags');
check(toasterTags.every((tag) => /position=["']top-center["']/.test(tag)), 'all Toasters use top-center', toasterTags.join(' | '));
check(toasterTags.every((tag) => /\brichColors\b/.test(tag)), 'all Toasters keep richColors');
check(toasterTags.every((tag) => /\bcloseButton\b/.test(tag)), 'all Toasters keep closeButton');
check(!/position=["']top-right["']/.test(app), 'no top-right toaster remains');

check(client.includes('actionIconClass'), 'ClientDetail imports/uses actionIconClass');
check(client.includes("actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')"), 'ClientDetail trash uses global danger icon class');
check(client.includes('data-fb5-danger-source="client-detail-trash"'), 'ClientDetail trash has FB-5 source marker');
check(!/bg-primary|text-white/.test(client), 'ClientDetail does not contain primary danger drift tokens');
check(!/<article`|<span`|`}>|article`}/.test(client), 'ClientDetail has no known broken JSX fragments');

const trashBlocks = client.match(/<(button|Button|EntityActionButton)\b[^>]*>[\s\S]*?<Trash2\b[\s\S]*?<\/\1>/g) || [];
check(trashBlocks.length >= 1, 'ClientDetail has Trash2 action blocks');
check(trashBlocks.every((block) => block.includes("actionIconClass('danger'")), 'each ClientDetail Trash2 block uses actionIconClass danger');
check(trashBlocks.every((block) => !/variant=\{?["'](?:default|primary)["']\}?/.test(block)), 'no ClientDetail Trash2 block uses primary/default variant');

check(css.includes('CLOSEFLOW_DANGER_STYLE_CONTRACT'), 'danger style contract marker retained');
check(css.includes('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_STYLE'), 'FB-5 CSS marker present');
check(css.includes('.client-detail-note-delete-action'), 'FB-5 note delete CSS class present');
check(css.includes('var(--cf-action-danger-text)'), 'FB-5 CSS uses danger token text');
check(css.includes('var(--cf-action-danger-bg-hover)'), 'FB-5 CSS uses danger hover token');

check(doc.includes('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE'), 'FB-5 doc marker');
check(doc.includes('top-center'), 'FB-5 doc documents top-center');
check(doc.includes('actionIconClass'), 'FB-5 doc documents actionIconClass danger');

console.log(`\nSummary: ${pass} pass, ${fail} fail.`);
if (fail > 0) {
  console.log('FAIL CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_OK');
