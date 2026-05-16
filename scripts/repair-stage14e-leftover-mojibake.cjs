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
  ['\u0139aduj\u0119 dane z bazy...', '\u0141aduj\u0119 dane z bazy...'],
  ['\u0139adowanie szkic\u00F3w...', '\u0141adowanie szkic\u00F3w...'],
  ['\u0139adowanie dost\u0119pu...', '\u0141adowanie dost\u0119pu...'],
  ['\u0179r\u00F3d\u0142o', '\u0179r\u00F3d\u0142o'],
  ['\u0139aduj\u0119', '\u0141aduj\u0119'],
  ['\u0139adowanie', '\u0141adowanie'],
]));

patchFile('src/pages/Templates.tsx', (text) => replaceAll(text, [
  ['Nie udaBo si pobra szablon\u00F3w', 'Nie uda\u0142o si\u0119 pobra\u0107 szablon\u00F3w'],
  ['Nie udaBo si zapisa szablonu', 'Nie uda\u0142o si\u0119 zapisa\u0107 szablonu'],
  ['Nie udaBo si skopiowa szablonu', 'Nie uda\u0142o si\u0119 skopiowa\u0107 szablonu'],
  ['Nie udaBo si usun szablonu', 'Nie uda\u0142o si\u0119 usun\u0105\u0107 szablonu'],
  ['Tryb podgldu blokuje zapis szablon\u00F3w', 'Tryb podgl\u0105du blokuje zapis szablon\u00F3w'],
  ['Aadowanie szablon\u00F3w...', '\u0141adowanie szablon\u00F3w...'],
  ['Brak szablon\u00F3w w tym widoku', 'Brak szablon\u00F3w w tym widoku'],
  ['kr\u00F3tkie wyja[nienie', 'kr\u00F3tkie wyja\u015Bnienie'],
  ['Utw\u00F3rz szablon', 'Utw\u00F3rz szablon'],
]));

patchFile('src/pages/SupportCenter.tsx', (text) => replaceAll(text, [
  ['Wy\u015Blij zg\u0142oszenie', 'Zapisz zg\u0142oszenie'],
  ['Wy\u015Blij odpowied\u017A', 'Zapisz odpowied\u017A'],
  ['Wysy\u0142anie...', 'Zapisywanie...'],
  ['Zg\u0142oszenie wys\u0142ane.', 'Zg\u0142oszenie zapisane.'],
  ['Nie uda\u0142o si\u0119 wys\u0142a\u0107 zg\u0142oszenia', 'Nie uda\u0142o si\u0119 zapisa\u0107 zg\u0142oszenia'],
  ['Wysy\u0142ka zapisuje zg\u0142oszenie w systemie supportu.', 'Zapis tworzy zg\u0142oszenie w systemie supportu.'],
]));

patchFile('src/pages/Billing.tsx', (text) => {
  let next = text;
  next = next
    .split("const BILLING_UI_STRIPE_BLIK_MOJIBAKE_GUARD = 'Przejd\u017A do p\u0142atno\u015Bci';\n").join('')
    .split("const BILLING_UI_STRIPE_BLIK_ERROR_MOJIBAKE_GUARD = 'B\u0142\u0105d uruchamiania p\u0142atno\u015Bci Stripe/BLIK';\n").join('');

  if (!next.includes('UI_TRUTH_BADGE_LABELS_STAGE14E')) {
    next = next.replace(
      "type PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';",
      "type PlanAvailability = 'current' | 'available' | 'disabled' | 'soon';\n\nconst UI_TRUTH_BADGE_LABELS_STAGE14E = ['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedost\u0119pne w Twoim planie', 'W przygotowaniu'] as const;"
    );
  }

  // Normalize the feature matrix wording to the required truth-badge language.
  next = next
    .split("'Dost\u0119pne (limity AI)'").join("'Beta'")
    .split("'Nie'").join("'Niedost\u0119pne w Twoim planie'");

  return next;
});

patchFile('src/lib/ui-truth.ts', (text) => {
  if (text.includes('UI_TRUTH_STATUSES_STAGE14E')) return text;
  return `${text.trim()}

export const UI_TRUTH_STATUSES_STAGE14E = [
  'Gotowe',
  'Beta',
  'Wymaga konfiguracji',
  'Niedost\u0119pne w Twoim planie',
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
