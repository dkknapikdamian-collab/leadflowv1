const fs = require('fs');
const path = require('path');

const roots = ['src'];
const include = /\.(ts|tsx|css|md)$/i;

const replacements = [
  ['OdświeĹĽ', 'Odśwież'],
  ['ĹĽeby', 'żeby'],
  ['NajwaĹĽniejsze', 'Najważniejsze'],
  ['DziĹ›', 'Dziś'],
  ['ZalegĹ‚e', 'Zaległe'],
  ['ZgĹ‚oszenia', 'Zgłoszenia'],
  ['AktywnoĹ›Ä‡', 'Aktywność'],
  ['Inbox szkicĂłw', 'Inbox szkiców'],
  ['uĹĽytkownik', 'użytkownik'],
  ['UĹĽytkownik', 'Użytkownik'],

  ['Ä…', 'ą'],
  ['Ä‡', 'ć'],
  ['Ä™', 'ę'],
  ['Äł', 'ł'],
  ['Äń', 'ń'],
  ['Ä›', 'ę'],
  ['Ä„', 'Ą'],
  ['Ä†', 'Ć'],
  ['Ä˜', 'Ę'],

  ['Å‚', 'ł'],
  ['Å„', 'ń'],
  ['Å›', 'ś'],
  ['Åº', 'ź'],
  ['Å¼', 'ż'],
  ['Åš', 'Ś'],
  ['Å¹', 'Ź'],
  ['Å»', 'Ż'],

  ['Ĺ‚', 'ł'],
  ['Ĺ„', 'ń'],
  ['Ĺ›', 'ś'],
  ['Ĺº', 'ź'],
  ['Ĺş', 'ź'],
  ['ĹĽ', 'ż'],

  ['Ã³', 'ó'],
  ['Ã“', 'Ó'],
  ['Ăł', 'ó'],

  ['Usu┼ä', 'Usuń'],
  ['zada┼ä', 'zadań'],
  ['wydarze┼ä', 'wydarzeń'],
  ['dzi┼Ť', 'dziś'],
  ['dzia┼éa┼ä', 'działań'],
  ['dzia┼éa', 'działa'],
  ['tydzie┼ä', 'tydzień'],
  ['lead├│w', 'leadów'],

  ['┼ä', 'ń'],
  ['┼Ť', 'ś'],
  ['┼é', 'ł'],
  ['├│', 'ó'],

  ['ÔÇó', '•'],
  ['ÔÇô', '–'],
  ['ÔÇö', '—'],
  ['ÔÇÖ', '’'],
  ['ÔÇ£', '“'],
  ['ÔÇØ', '”'],
  ['ÔÇť', '”'],
  ['ÔÇ', '•'],

  ['Â ', ' '],
  ['Â', '']
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '_project', '.git'].includes(entry.name)) continue;
      walk(full, out);
      continue;
    }

    if (entry.isFile() && include.test(full)) {
      out.push(full);
    }
  }

  return out;
}

function applyTextFixes(text) {
  let next = text;
  for (const [bad, good] of replacements) {
    next = next.split(bad).join(good);
  }
  return next;
}

const changed = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const before = fs.readFileSync(file, 'utf8');
    const after = applyTextFixes(before);

    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changed.push(file);
    }
  }
}

// Dziś: kwadratowa ikona LayoutDashboard -> Home.
const layoutPath = 'src/components/Layout.tsx';
if (fs.existsSync(layoutPath)) {
  const before = fs.readFileSync(layoutPath, 'utf8');
  let after = before.replace(/\bLayoutDashboard\b/g, 'Home');

  if (after !== before) {
    fs.writeFileSync(layoutPath, after, 'utf8');
    changed.push(layoutPath);
  }
}

// Guard source truth dla filtrów zadań i ikonki Dziś musi być obecny też w CSS.
const foundationPath = 'src/styles/closeflow-visual-foundation-stage212m.css';
if (fs.existsSync(foundationPath)) {
  let css = fs.readFileSync(foundationPath, 'utf8');

  if (!css.includes('STAGE212T_POLISH_AND_VISUAL_GUARDS')) {
    css += `

/* STAGE212T_POLISH_AND_VISUAL_GUARDS */
body .sidebar a[data-nav-path="/"] .nav-ico,
body a[data-nav-path="/"] .nav-ico,
body .sidebar .nav-btn.active .nav-ico,
body .nav-btn.active .nav-ico {
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
  outline: 0 !important;
  border-radius: 0 !important;
  color: currentColor !important;
}

body .sidebar a[data-nav-path="/"] .nav-ico svg,
body a[data-nav-path="/"] .nav-ico svg,
body .sidebar .nav-btn.active .nav-ico svg,
body .nav-btn.active .nav-ico svg {
  width: 15px !important;
  height: 15px !important;
  stroke: currentColor !important;
  fill: none !important;
}

body #root .tasks-stage178-filter-list,
body #root .tasks-stage178-filter-button > span,
body #root .tasks-stage178-filter-label {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
}

body #root .tasks-stage178-filter-count {
  width: 24px !important;
  min-width: 24px !important;
  height: 22px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, 0.72) !important;
  background-color: rgba(255, 255, 255, 0.72) !important;
  border: 1px solid rgba(148, 163, 184, 0.22) !important;
  box-shadow: none !important;
}
`;
    fs.writeFileSync(foundationPath, css, 'utf8');
    changed.push(foundationPath);
  }
}

console.log('STAGE212T_POLISH_AND_VISUAL_FIX_PASS');
console.log('Changed files:');
for (const file of [...new Set(changed)]) console.log('- ' + file);
