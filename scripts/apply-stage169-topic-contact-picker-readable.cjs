const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage169-topic-contact-picker-readable.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

const appPath = 'src/App.tsx';
let app = read(appPath);
const importLine = "import './styles/closeflow-topic-contact-picker-readable-stage169.css';";
if (!app.includes(importLine)) {
  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    "closeflow-modal-footer-in-flow-no-overlay-stage166.css",
    "closeflow-modal-unified-event-motif-source-truth-stage165.css",
    "closeflow-cf-modal-top-anchor-light-surface-stage164.css",
    "closeflow-cf-modal-main-center-tall-compact-stage163.css"
  ]) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(marker)) { insertAfter = i; break; }
    }
  }
  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i++) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
    }
  }
  if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found.');
  lines.splice(insertAfter + 1, 0, importLine);
  app = lines.join('\n');
  write(appPath, app);
  console.log('UPDATED src/App.tsx: added Stage169 CSS import');
} else {
  console.log('SKIPPED src/App.tsx: Stage169 import already present');
}

const pickerPath = 'src/components/topic-contact-picker.tsx';
let picker = read(pickerPath);
const originalPicker = picker;

if (!picker.includes('data-topic-contact-picker="true"')) {
  picker = picker.replace(
    '<div className="space-y-2">',
    '<div className="space-y-2" data-topic-contact-picker="true">'
  );
}

if (!picker.includes('data-topic-contact-picker-input="true"')) {
  picker = picker.replace(
    'className="pl-10 pr-10"',
    'className="cf-topic-contact-picker-input pl-10 pr-10"\n          data-topic-contact-picker-input="true"'
  );
}

if (!picker.includes('data-topic-contact-picker-dropdown="true"')) {
  picker = picker.replace(
    'className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border bg-white p-1 shadow-xl"',
    'className="cf-topic-contact-picker-dropdown absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border bg-white p-1 text-slate-900 shadow-xl"\n            data-topic-contact-picker-dropdown="true"'
  );
}

if (!picker.includes('data-topic-contact-picker-option="true"')) {
  picker = picker.replace(
    'className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors ${',
    'data-topic-contact-picker-option="true"\n                    className={`cf-topic-contact-picker-option flex w-full items-start justify-between gap-3 rounded-lg bg-white px-3 py-2 text-left text-slate-900 transition-colors ${'
  );
}

if (!picker.includes('data-topic-contact-picker-option-title="true"')) {
  picker = picker.replace(
    '<span className="truncate text-sm font-semibold text-slate-900">{option.label}</span>',
    '<span className="cf-topic-contact-picker-option-title truncate text-sm font-semibold text-slate-900" data-topic-contact-picker-option-title="true">{option.label}</span>'
  );
}

picker = picker.replace(
  '<div className="mt-1 truncate text-xs text-slate-500">{option.subLabel}</div>',
  '<div className="cf-topic-contact-picker-option-subtitle mt-1 truncate text-xs text-slate-500">{option.subLabel}</div>'
);

picker = picker.replace(
  '<div className="mt-1 text-[11px] text-slate-400">{option.resolutionLabel}</div>',
  '<div className="cf-topic-contact-picker-option-resolution mt-1 text-[11px] text-slate-400">{option.resolutionLabel}</div>'
);

picker = picker.replace(
  '<div className="px-3 py-2 text-sm text-slate-500">{emptyLabel}</div>',
  '<div className="cf-topic-contact-picker-empty px-3 py-2 text-sm text-slate-500">{emptyLabel}</div>'
);

picker = picker.replace(
  '<p className="text-xs text-slate-500">{selectedOption.resolutionLabel}</p>',
  '<p className="cf-topic-contact-picker-selected-note text-xs text-slate-500">{selectedOption.resolutionLabel}</p>'
);

if (picker !== originalPicker) {
  write(pickerPath, picker);
  console.log('UPDATED src/components/topic-contact-picker.tsx: added Stage169 explicit picker markers/classes');
} else {
  console.log('SKIPPED src/components/topic-contact-picker.tsx: Stage169 markers already present');
}
