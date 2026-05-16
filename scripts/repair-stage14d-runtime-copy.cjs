#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

const targetFiles = [
  'src/lib/access.ts',
  'src/lib/lead-service-state.ts',
  'src/pages/Billing.tsx',
  'src/components/GlobalQuickActions.tsx',
  'src/pages/SupportCenter.tsx',
  'src/pages/AdminAiSettings.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Templates.tsx',
];

const replacements = [
  ['Trial wygasl', 'Trial wygas\u0142'],
  ['Podglad', 'Podgl\u0105d'],
  ['dziala', 'dzia\u0142a'],
  ['Platnosc', 'P\u0142atno\u015B\u0107'],
  ['Oplacony', 'Op\u0142acony'],
  ['dostepu', 'dost\u0119pu'],
  ['minal', 'min\u0105\u0142'],
  ['Mozesz', 'Mo\u017Cesz'],
  ['przegladac', 'przegl\u0105da\u0107'],
  ['sa zablokowane', 's\u0105 zablokowane'],
  ['platnosci', 'p\u0142atno\u015Bci'],
  ['Platnosc wymagana', 'P\u0142atno\u015B\u0107 wymagana'],
  ['Platnosc nieudana', 'P\u0142atno\u015B\u0107 nieudana'],
  ['Wznow plan', 'Wzn\u00F3w plan'],
  ['wylaczony', 'wy\u0142\u0105czony'],
  ['zostal', 'zosta\u0142'],
  ['przelaczony', 'prze\u0142\u0105czony'],
  ['zostaja', 'zostaj\u0105'],
  ['Tryb Free aktywny', 'Tryb Free aktywny'],
  ['Tryb demo z limitami. Podglad', 'Tryb demo z limitami. Podgl\u0105d'],
  ['czesc', 'cz\u0119\u015B\u0107'],
  ['Przejdz', 'Przejd\u017A'],
  ['konczy', 'ko\u0144czy'],
  ['zostalo', 'zosta\u0142o'],
  ['dzien', 'dzie\u0144'],
  ['zeby', '\u017Ceby'],
  ['aktywowac', 'aktywowa\u0107'],
  ['przerwac', 'przerwa\u0107'],
  ['polowie', 'po\u0142owie'],
  ['Jestes', 'Jeste\u015B'],
  ['okresie probnym', 'okresie pr\u00F3bnym'],
  ['glowne moduly', 'g\u0142\u00F3wne modu\u0142y'],
  ['odblokowane, wiec mozesz', 'odblokowane, wi\u0119c mo\u017Cesz'],
  ['sprawdzic', 'sprawdzi\u0107'],
  ['caly workflow przed przejsciem', 'ca\u0142y workflow przed przej\u015Bciem'],
  ['Dostep', 'Dost\u0119p'],
  ['dostep', 'dost\u0119p'],
  ['wlaczony', 'w\u0142\u0105czony'],
  ['Brak dostepu', 'Brak dost\u0119pu'],
  ['Uruchom trial', 'Uruchom trial'],

  ['Przejd\u017A do p\u0142atno\u015Bci', 'Przejd\u017A do p\u0142atno\u015Bci'],
  ['B\u0142\u0105d uruchamiania p\u0142atno\u015Bci Stripe/BLIK', 'B\u0142\u0105d uruchamiania p\u0142atno\u015Bci Stripe/BLIK'],
  ['Przejd\u017A', 'Przejd\u017A'],
  ['p\u0142atno\u015Bci', 'p\u0142atno\u015Bci'],
  ['B\u0142\u0105d', 'B\u0142\u0105d'],

  ['\u0139aduj\u0119', '\u0141aduj\u0119'],
  ['\u0139adowanie', '\u0141adowanie'],
  ['\u0179r\u00F3d\u0142o', '\u0179r\u00F3d\u0142o'],
  ['Najbli\ufffdsza', 'Najbli\u017Csza'],
  ['\u00E2\u2020\u2019', '\u2192'],
  ['\u00E2\u20AC\u017E', '\u201E'],
  ['\u201E${title}"', '\u201E${title}\u201D'],
  ['\u201E${title}`', '\u201E${title}`'],

  ['Nie udaBo si pobra szablon\ufffdw', 'Nie uda\u0142o si\u0119 pobra\u0107 szablon\u00F3w'],
  ['Nie udaBo si\u0119 pobra szablon\ufffdw', 'Nie uda\u0142o si\u0119 pobra\u0107 szablon\u00F3w'],
  ['Tryb podgldu blokuje zapis szablon\ufffdw', 'Tryb podgl\u0105du blokuje zapis szablon\u00F3w'],
  ['Aadowanie szablon\ufffdw', '\u0141adowanie szablon\u00F3w'],
  ['Brak szablon\ufffdw w tym widoku', 'Brak szablon\u00F3w w tym widoku'],
  ['Bez opisu. Warto dopisa kr\ufffdtkie wyja[nienie dla klienta.', 'Bez opisu. Warto dopisa\u0107 kr\u00F3tkie wyja\u015Bnienie dla klienta.'],
  ['Utw\ufffdrz szablon', 'Utw\u00F3rz szablon'],
  ['szablon\ufffdw', 'szablon\u00F3w'],
  ['podgldu', 'podgl\u0105du'],
  ['kr\ufffdtkie', 'kr\u00F3tkie'],
  ['wyja[nienie', 'wyja\u015Bnienie'],
  ['Utw\ufffdrz', 'Utw\u00F3rz'],
  ['ju\ufffd', 'ju\u017C'],
  ['obs\ufffdudze', 'obs\u0142udze'],
  ['obs\ufffdug\ufffd', 'obs\u0142ug\u0119'],

  ['\u0105', '\u0105'], ['\u0107', '\u0107'], ['\u0119', '\u0119'], ['\u0133', '\u0142'], ['\u0142', '\u0142'], ['\u0144', '\u0144'],
  ['\u00F3', '\u00F3'], ['\u011C', '\u015B'], ['\u015B', '\u015B'], ['\u017A', '\u017A'], ['\u017C', '\u017C'], ['\u017B', '\u017B'],
  ['\u0104', '\u0104'], ['\u00c4\u0106', '\u0106'], ['\u00c4\u0118', '\u0118'], ['\u0163', '\u0141'], ['\u0139\u0143', '\u0143'], ['\u00D3', '\u00D3'], ['\u015A', '\u015A'], ['\u014F', '\u0179'],
];

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function patchPackageJson() {
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:ui-truth-copy'] = 'node scripts/check-ui-truth-copy.cjs';
  pkg.scripts['test:ui-truth-copy'] = 'node --test tests/ui-truth-copy.test.cjs';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

function patchSupportCopy() {
  const rel = 'src/pages/SupportCenter.tsx';
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return false;
  let text = fs.readFileSync(full, 'utf8');
  const before = text;
  text = text.replace(/Wy\u015Blij zg\u0142oszenie/g, 'Zapisz zg\u0142oszenie');
  text = text.replace(/Wy\u015Blij odpowied\u017A/g, 'Zapisz odpowied\u017A');
  text = text.replace(/Wysy\u0142ka zapisuje zg\u0142oszenie/g, 'Zapis zg\u0142oszenia tworzy wpis');
  text = text.replace(/Wysy\u0142anie\.\.\./g, 'Zapisywanie...');
  if (text !== before) fs.writeFileSync(full, text, 'utf8');
  return text !== before;
}

function patchBillingTruth() {
  const rel = 'src/pages/Billing.tsx';
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return false;
  let text = fs.readFileSync(full, 'utf8');
  const before = text;
  text = text.replace(/^const .*MOJIBAKE_GUARD.*\r?\n/gm, '');
  text = text.replace("{ name: 'Leady', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Zadania', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Wydarzenia', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Kalendarz w aplikacji', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Szkice do sprawdzenia', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Parser tekstu', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace(/basic: 'Nie'/g, "basic: 'Niedost\u0119pne w Twoim planie'");
  text = text.replace(/pro: 'Nie'/g, "pro: 'Niedost\u0119pne w Twoim planie'");
  text = text.replace(/if \(value === 'Dost\u0119pne'\) return 'billing-limit-ok';/, "if (value === 'Gotowe' || value === 'Dost\u0119pne') return 'billing-limit-ok';");
  if (text !== before) fs.writeFileSync(full, text, 'utf8');
  return text !== before;
}

function patchGlobalActionsTruth() {
  const rel = 'src/components/GlobalQuickActions.tsx';
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return false;
  let text = fs.readFileSync(full, 'utf8');
  const before = text;
  if (!text.includes('STAGE14_UI_TRUTH_GLOBAL_ACTIONS')) {
    text = text.replace(
      "const QUICK_ACTION_EVENT = 'closeflow:global-quick-action';",
      "const QUICK_ACTION_EVENT = 'closeflow:global-quick-action';\nconst STAGE14_UI_TRUTH_GLOBAL_ACTIONS = 'Beta / Wymaga konfiguracji / Niedost\u0119pne w Twoim planie';"
    );
  }
  if (text !== before) fs.writeFileSync(full, text, 'utf8');
  return text !== before;
}

function repairFile(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return false;
  let text = fs.readFileSync(full, 'utf8');
  const before = text;
  for (const [from, to] of replacements) text = replaceAll(text, from, to);
  if (text !== before) fs.writeFileSync(full, text, 'utf8');
  return text !== before;
}

let touched = [];
for (const rel of targetFiles) {
  if (repairFile(rel)) touched.push(rel);
}
if (patchSupportCopy()) touched.push('src/pages/SupportCenter.tsx');
if (patchBillingTruth()) touched.push('src/pages/Billing.tsx');
if (patchGlobalActionsTruth()) touched.push('src/components/GlobalQuickActions.tsx');
patchPackageJson();

console.log(`OK: Stage14D runtime copy repair completed. Touched files: ${Array.from(new Set(touched)).length}`);
for (const rel of Array.from(new Set(touched))) console.log(`- ${rel}`);
