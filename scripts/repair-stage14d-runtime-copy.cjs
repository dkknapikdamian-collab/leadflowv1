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
  ['Trial wygasl', 'Trial wygasł'],
  ['Podglad', 'Podgląd'],
  ['dziala', 'działa'],
  ['Platnosc', 'Płatność'],
  ['Oplacony', 'Opłacony'],
  ['dostepu', 'dostępu'],
  ['minal', 'minął'],
  ['Mozesz', 'Możesz'],
  ['przegladac', 'przeglądać'],
  ['sa zablokowane', 'są zablokowane'],
  ['platnosci', 'płatności'],
  ['Platnosc wymagana', 'Płatność wymagana'],
  ['Platnosc nieudana', 'Płatność nieudana'],
  ['Wznow plan', 'Wznów plan'],
  ['wylaczony', 'wyłączony'],
  ['zostal', 'został'],
  ['przelaczony', 'przełączony'],
  ['zostaja', 'zostają'],
  ['Tryb Free aktywny', 'Tryb Free aktywny'],
  ['Tryb demo z limitami. Podglad', 'Tryb demo z limitami. Podgląd'],
  ['czesc', 'część'],
  ['Przejdz', 'Przejdź'],
  ['konczy', 'kończy'],
  ['zostalo', 'zostało'],
  ['dzien', 'dzień'],
  ['zeby', 'żeby'],
  ['aktywowac', 'aktywować'],
  ['przerwac', 'przerwać'],
  ['polowie', 'połowie'],
  ['Jestes', 'Jesteś'],
  ['okresie probnym', 'okresie próbnym'],
  ['glowne moduly', 'główne moduły'],
  ['odblokowane, wiec mozesz', 'odblokowane, więc możesz'],
  ['sprawdzic', 'sprawdzić'],
  ['caly workflow przed przejsciem', 'cały workflow przed przejściem'],
  ['Dostep', 'Dostęp'],
  ['dostep', 'dostęp'],
  ['wlaczony', 'włączony'],
  ['Brak dostepu', 'Brak dostępu'],
  ['Uruchom trial', 'Uruchom trial'],

  ['PrzejdĹş do pĹ‚atnoĹ›ci', 'Przejdź do płatności'],
  ['BĹ‚Ä…d uruchamiania pĹ‚atnoĹ›ci Stripe/BLIK', 'Błąd uruchamiania płatności Stripe/BLIK'],
  ['PrzejdĹş', 'Przejdź'],
  ['pĹ‚atnoĹ›ci', 'płatności'],
  ['BĹ‚Ä…d', 'Błąd'],

  ['Ĺaduję', 'Ładuję'],
  ['Ĺadowanie', 'Ładowanie'],
  ['Ĺąródło', 'Źródło'],
  ['Najbli�sza', 'Najbliższa'],
  ['â†’', '→'],
  ['â€ž', '„'],
  ['„${title}"', '„${title}”'],
  ['„${title}`', '„${title}`'],

  ['Nie udaBo si pobra szablon�w', 'Nie udało się pobrać szablonów'],
  ['Nie udaBo się pobra szablon�w', 'Nie udało się pobrać szablonów'],
  ['Tryb podgldu blokuje zapis szablon�w', 'Tryb podglądu blokuje zapis szablonów'],
  ['Aadowanie szablon�w', 'Ładowanie szablonów'],
  ['Brak szablon�w w tym widoku', 'Brak szablonów w tym widoku'],
  ['Bez opisu. Warto dopisa kr�tkie wyja[nienie dla klienta.', 'Bez opisu. Warto dopisać krótkie wyjaśnienie dla klienta.'],
  ['Utw�rz szablon', 'Utwórz szablon'],
  ['szablon�w', 'szablonów'],
  ['podgldu', 'podglądu'],
  ['kr�tkie', 'krótkie'],
  ['wyja[nienie', 'wyjaśnienie'],
  ['Utw�rz', 'Utwórz'],
  ['ju�', 'już'],
  ['obs�udze', 'obsłudze'],
  ['obs�ug�', 'obsługę'],

  ['Ä…', 'ą'], ['Ä‡', 'ć'], ['Ä™', 'ę'], ['Äł', 'ł'], ['Ĺ‚', 'ł'], ['Ĺ„', 'ń'],
  ['Ăł', 'ó'], ['Äś', 'ś'], ['Ĺ›', 'ś'], ['Ĺş', 'ź'], ['ĹĽ', 'ż'], ['Ĺ»', 'Ż'],
  ['Ä„', 'Ą'], ['ÄĆ', 'Ć'], ['ÄĘ', 'Ę'], ['ĹŁ', 'Ł'], ['ĹŃ', 'Ń'], ['Ă“', 'Ó'], ['Ĺš', 'Ś'], ['ĹŹ', 'Ź'],
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
  text = text.replace(/Wyślij zgłoszenie/g, 'Zapisz zgłoszenie');
  text = text.replace(/Wyślij odpowiedź/g, 'Zapisz odpowiedź');
  text = text.replace(/Wysyłka zapisuje zgłoszenie/g, 'Zapis zgłoszenia tworzy wpis');
  text = text.replace(/Wysyłanie\.\.\./g, 'Zapisywanie...');
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
  text = text.replace("{ name: 'Leady', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Zadania', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Wydarzenia', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Kalendarz w aplikacji', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Szkice do sprawdzenia', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace("{ name: 'Parser tekstu', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }");
  text = text.replace(/basic: 'Nie'/g, "basic: 'Niedostępne w Twoim planie'");
  text = text.replace(/pro: 'Nie'/g, "pro: 'Niedostępne w Twoim planie'");
  text = text.replace(/if \(value === 'Dostępne'\) return 'billing-limit-ok';/, "if (value === 'Gotowe' || value === 'Dostępne') return 'billing-limit-ok';");
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
      "const QUICK_ACTION_EVENT = 'closeflow:global-quick-action';\nconst STAGE14_UI_TRUTH_GLOBAL_ACTIONS = 'Beta / Wymaga konfiguracji / Niedostępne w Twoim planie';"
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
