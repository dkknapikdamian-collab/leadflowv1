const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcRoot = path.join(root, 'src');

const targets = [
  'Ustaw termin, powiązanie, przypomnienia i cykliczność wydarzenia w kalendarzu.',
  'Od do',
  'Najpierw ustaw start i koniec. Koniec pilnuje się automatycznie przy zmianie startu.',
  'Możesz zostawić brak albo ustawić powtarzanie, np. co miesiąc.',
  'Na końcu ustaw sposób przypominania i jego cykliczność.',
  'Wpisz minimum danych i zapisz kontakt. Szczegóły możesz uzupełnić później.',
  'Najważniejsze pola do szybkiego zapisania kontaktu.',
];

const exts = new Set(['.tsx', '.jsx', '.ts', '.js']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(p, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(p);
    }
  }
  return out;
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

const offenders = [];
for (const file of walk(srcRoot)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const target of targets) {
    if (text.includes(target)) {
      offenders.push(`${path.relative(root, file)} contains "${target}"`);
    }
  }
}

if (offenders.length) {
  throw new Error('Stage171 guard failed:\n' + offenders.join('\n'));
}

mustInclude('src/App.tsx', "import './styles/closeflow-remove-modal-helper-copy-stage171.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-task-dialog-relation-and-field-readability-stage170.css")) {
  if (app.indexOf("closeflow-remove-modal-helper-copy-stage171.css") < app.indexOf("closeflow-task-dialog-relation-and-field-readability-stage170.css")) {
    throw new Error('Stage171 CSS import must be after Stage170 CSS import.');
  }
}

[
  '--closeflow-stage171-remove-modal-helper-copy: "active"',
  '[data-stage171-hidden-copy="true"]',
  'clip: rect(0, 0, 0, 0) !important',
].forEach((marker) => mustInclude('src/styles/closeflow-remove-modal-helper-copy-stage171.css', marker));

[
  'scripts/apply-stage171-remove-modal-helper-copy.cjs',
  'scripts/check-stage171-remove-modal-helper-copy.cjs',
  'docs/ui/CLOSEFLOW_STAGE171_REMOVE_MODAL_HELPER_COPY.md',
  '_project/STAGE171_REMOVE_MODAL_HELPER_COPY_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage171 remove modal helper copy.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage171 file: ${rel}`);
});

console.log('OK: Stage171 modal helper copy removed from src and accessibility helper CSS is present.');
