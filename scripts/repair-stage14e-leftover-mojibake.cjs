#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text, 'utf8');
}

function replaceAll(text, replacements) {
  let next = text;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  return next;
}

function patchFile(rel, patcher) {
  const before = read(rel);
  if (before === null) {
    console.warn(`SKIP missing ${rel}`);
    return false;
  }
  const after = patcher(before);
  if (after !== before) {
    write(rel, after);
    touched.push(rel);
    return true;
  }
  return false;
}

const touched = [];

/**
 * STAGE14E: narrow leftover repair after Stage14D.
 * Do not change architecture, data, billing logic, AI logic or Google Calendar logic.
 * This only repairs runtime UI strings and truth-copy labels.
 */
patchFile('src/pages/AiDrafts.tsx', (text) => replaceAll(text, [
  ['Ĺaduję dane z bazy...', 'Ładuję dane z bazy...'],
  ['Ĺadowanie szkiców...', 'Ładowanie szkiców...'],
  ['Ĺadowanie dostępu...', 'Ładowanie dostępu...'],
  ['Ĺąródło', 'Źródło'],
  ['Ĺaduję', 'Ładuję'],
  ['Ĺadowanie', 'Ładowanie'],
]));

patchFile('src/pages/Templates.tsx', (text) => replaceAll(text, [
  ['Nie udaBo si pobra szablonów', 'Nie udało się pobrać szablonów'],
  ['Nie udaBo si zapisa szablonu', 'Nie udało się zapisać szablonu'],
  ['Nie udaBo si skopiowa szablonu', 'Nie udało się skopiować szablonu'],
  ['Nie udaBo si usun szablonu', 'Nie udało się usunąć szablonu'],
  ['Tryb podgldu blokuje zapis szablonów', 'Tryb podglądu blokuje zapis szablonów'],
  ['Aadowanie szablonów...', 'Ładowanie szablonów...'],
  ['Brak szablonów w tym widoku', 'Brak szablonów w tym widoku'],
  ['krótkie wyja[nienie', 'krótkie wyjaśnienie'],
  ['Utwórz szablon', 'Utwórz szablon'],
]));

patchFile('src/pages/SupportCenter.tsx', (text) => replaceAll(text, [
  ['Wyślij zgłoszenie', 'Zapisz zgłoszenie'],
  ['Wyślij odpowiedź', 'Zapisz odpowiedź'],
  ['Wysyłanie...', 'Zapisywanie...'],
  ['Zgłoszenie wysłane.', 'Zgłoszenie zapisane.'],
  ['Nie udało się wysłać zgłoszenia', 'Nie udało się zapisać zgłoszenia'],
  ['Wysyłka zapisuje zgłoszenie w systemie supportu.', 'Zapis tworzy zgłoszenie w systemie supportu.'],
]));

patchFile('src/pages/Billing.tsx', (text) => {
  let next = text;
  next = next
    .split("const BILLING_UI_STRIPE_BLIK_MOJIBAKE_GUARD = 'PrzejdĹş do pĹ‚atnoĹ›ci';\n").join('')
    .split("const BILLING_UI_STRIPE_BLIK_ERROR_MOJIBAKE_GUARD = 'BĹ‚Ä…d uruchamiania pĹ‚atnoĹ›ci Stripe/BLIK';\n").join('');

  if (!next.includes('UI_TRUTH_BADGE_LABELS_STAGE14E')) {
    next = next.replace(
      "type PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';",
      "type PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';\n\nconst UI_TRUTH_BADGE_LABELS_STAGE14E = ['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedostępne w Twoim planie', 'W przygotowaniu'] as const;"
    );
  }

  // Normalize the feature matrix wording to the required truth-badge language.
  next = next
    .split("'Dostępne (limity AI)'").join("'Beta'")
    .split("'Nie'").join("'Niedostępne w Twoim planie'");

  return next;
});

patchFile('src/lib/ui-truth.ts', (text) => {
  if (text.includes('UI_TRUTH_STATUSES_STAGE14E')) return text;
  return `${text.trim()}

export const UI_TRUTH_STATUSES_STAGE14E = [
  'Gotowe',
  'Beta',
  'Wymaga konfiguracji',
  'Niedostępne w Twoim planie',
  'W przygotowaniu',
] as const;
`;
});

console.log('OK: Stage14E leftover mojibake/truth repair completed.');
if (touched.length) {
  console.log(`Touched files: ${touched.length}`);
  for (const rel of touched) console.log(`- ${rel}`);
} else {
  console.log('No files changed. Everything was already repaired.');
}
