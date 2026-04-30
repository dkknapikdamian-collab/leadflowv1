const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const tasksPath = path.join(root, 'src', 'pages', 'Tasks.tsx');
const editorPath = path.join(root, 'src', 'components', 'task-editor-dialog.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage21-task-form-vnext.css');

function fail(message) {
  console.error('FAIL task form visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(tasksPath)) fail('missing Tasks.tsx');
if (!fs.existsSync(editorPath)) fail('missing task-editor-dialog.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage21-task-form-vnext.css');

const tasks = fs.readFileSync(tasksPath, 'utf8');
const editor = fs.readFileSync(editorPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const combined = `${tasks}\n${editor}`;

const requiredContent = [
  'TASK_FORM_VISUAL_REBUILD_STAGE21',
  'Nowe zadanie',
  'Edytuj zadanie',
  'Tytuł',
  'Typ',
  'Termin',
  'Priorytet',
  'Powiązanie',
  'Zapisz zadanie',
  '+1H',
  '+1D',
  '+1W',
  'Zrobione',
  'Podaj tytuł zadania.',
  'Nie udało się zapisać zadania. Spróbuj ponownie.',
];

for (const needle of requiredContent) {
  if (!combined.includes(needle)) fail(`missing task form content: ${needle}`);
}

const requiredCss = [
  '.task-form-vnext-content',
  'background: rgba(255, 255, 255, 0.96) !important',
  'border: 1px solid #e4e7ec !important',
  'border-radius: 28px !important',
  'content: none !important',
  '.task-form-section',
  '.task-form-footer',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const taskFormBlocks = css
  .split('}')
  .filter((block) => /task-form/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (taskFormBlocks.includes(dark)) fail(`dark color in task form css: ${dark}`);
}

for (const mojibake of ['BĹ‚Ä…d', 'OtwĂłrz', 'Å¹rĂłdło', 'CyklicznoĹ›Ä‡']) {
  if (combined.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS task form visual rebuild');
