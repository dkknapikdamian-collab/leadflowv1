const fs = require('fs');

function fail(message) {
  console.error('STAGE220A18_SHARED_MODAL_FORM_VST_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const dialog = read('src/components/ui/dialog.tsx');
const input = read('src/components/ui/input.tsx');
const textarea = read('src/components/ui/textarea.tsx');
const button = read('src/components/ui/button.tsx');
const select = read('src/components/ui/select.tsx');
const css = read('src/styles/closeflow-visual-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

requireText(dialog, 'STAGE220A18_SHARED_MODAL_FORM_VST', 'dialog marker');
requireText(dialog, 'cf-vst-overlay', 'DialogOverlay VST class');
requireText(dialog, 'cf-vst-dialog cf-modal-surface', 'DialogContent VST class');
requireText(dialog, 'data-cf-vst-dialog="true"', 'DialogContent data marker');
requireText(dialog, 'cf-vst-dialog-header', 'DialogHeader VST class');
requireText(dialog, 'cf-vst-dialog-footer', 'DialogFooter VST class');
requireText(dialog, 'cf-vst-dialog-title', 'DialogTitle VST class');
requireText(dialog, 'cf-vst-dialog-description', 'DialogDescription VST class');

requireText(input, 'STAGE220A18_SHARED_MODAL_FORM_VST', 'input marker');
requireText(input, 'data-cf-vst-input="true"', 'Input data marker');
requireText(input, 'cf-vst-input flex', 'Input VST class');

requireText(textarea, 'STAGE220A18_SHARED_MODAL_FORM_VST', 'textarea marker');
requireText(textarea, 'data-cf-vst-input="textarea"', 'Textarea data marker');
requireText(textarea, 'cf-vst-input cf-vst-textarea', 'Textarea VST class');

requireText(button, 'STAGE220A18_SHARED_MODAL_FORM_VST', 'button marker');
requireText(button, 'data-cf-vst-button="true"', 'Button data marker');
requireText(button, 'cf-vst-button', 'Button VST class');
requireText(button, 'cf-vst-button-primary', 'Button primary VST class');
requireText(button, 'cf-vst-button-delete', 'Button delete VST class');

requireText(select, 'STAGE220A18_SHARED_MODAL_FORM_VST', 'select marker');
requireText(select, 'data-cf-vst-input="select"', 'SelectTrigger data marker');
requireText(select, 'cf-vst-input cf-vst-select-trigger', 'SelectTrigger VST class');
requireText(select, 'cf-vst-select-content cf-vst-card', 'SelectContent VST class');

requireText(css, 'STAGE220A18_SHARED_MODAL_FORM_VST', 'A18 CSS marker');
requireText(css, '.cf-vst-dialog', 'dialog CSS');
requireText(css, '.cf-vst-input', 'input CSS');
requireText(css, '.cf-vst-textarea', 'textarea CSS');
requireText(css, '.cf-vst-select-trigger', 'select CSS');
requireText(css, '.cf-vst-button', 'button CSS');

requireText(doc, 'STAGE220A18 - wspólne modale i formularze', 'doc A18 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a18-shared-modal-form-vst.cjs', 'prebuild A18 guard');

console.log('STAGE220A18_SHARED_MODAL_FORM_VST_GUARD: OK');
