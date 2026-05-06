#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const CP1250_BYTE_BY_CHAR = {
  "€": 0x80,
  "‚": 0x82,
  "„": 0x84,
  "…": 0x85,
  "†": 0x86,
  "‡": 0x87,
  "‰": 0x89,
  "Š": 0x8a,
  "‹": 0x8b,
  "Ś": 0x8c,
  "Ť": 0x8d,
  "Ž": 0x8e,
  "Ź": 0x8f,
  "‘": 0x91,
  "’": 0x92,
  "“": 0x93,
  "”": 0x94,
  "•": 0x95,
  "–": 0x96,
  "—": 0x97,
  "™": 0x99,
  "š": 0x9a,
  "›": 0x9b,
  "ś": 0x9c,
  "ť": 0x9d,
  "ž": 0x9e,
  "ź": 0x9f,
  " ": 0xa0,
  "ˇ": 0xa1,
  "˘": 0xa2,
  "Ł": 0xa3,
  "¤": 0xa4,
  "Ą": 0xa5,
  "¦": 0xa6,
  "§": 0xa7,
  "¨": 0xa8,
  "©": 0xa9,
  "Ş": 0xaa,
  "«": 0xab,
  "¬": 0xac,
  "­": 0xad,
  "®": 0xae,
  "Ż": 0xaf,
  "°": 0xb0,
  "±": 0xb1,
  "˛": 0xb2,
  "ł": 0xb3,
  "´": 0xb4,
  "µ": 0xb5,
  "¶": 0xb6,
  "·": 0xb7,
  "¸": 0xb8,
  "ą": 0xb9,
  "ş": 0xba,
  "»": 0xbb,
  "Ľ": 0xbc,
  "˝": 0xbd,
  "ľ": 0xbe,
  "ż": 0xbf,
  "Ŕ": 0xc0,
  "Á": 0xc1,
  "Â": 0xc2,
  "Ă": 0xc3,
  "Ä": 0xc4,
  "Ĺ": 0xc5,
  "Ć": 0xc6,
  "Ç": 0xc7,
  "Č": 0xc8,
  "É": 0xc9,
  "Ę": 0xca,
  "Ë": 0xcb,
  "Ě": 0xcc,
  "Í": 0xcd,
  "Î": 0xce,
  "Ď": 0xcf,
  "Đ": 0xd0,
  "Ń": 0xd1,
  "Ň": 0xd2,
  "Ó": 0xd3,
  "Ô": 0xd4,
  "Ő": 0xd5,
  "Ö": 0xd6,
  "×": 0xd7,
  "Ř": 0xd8,
  "Ů": 0xd9,
  "Ú": 0xda,
  "Ű": 0xdb,
  "Ü": 0xdc,
  "Ý": 0xdd,
  "Ţ": 0xde,
  "ß": 0xdf,
  "ŕ": 0xe0,
  "á": 0xe1,
  "â": 0xe2,
  "ă": 0xe3,
  "ä": 0xe4,
  "ĺ": 0xe5,
  "ć": 0xe6,
  "ç": 0xe7,
  "č": 0xe8,
  "é": 0xe9,
  "ę": 0xea,
  "ë": 0xeb,
  "ě": 0xec,
  "í": 0xed,
  "î": 0xee,
  "ď": 0xef,
  "đ": 0xf0,
  "ń": 0xf1,
  "ň": 0xf2,
  "ó": 0xf3,
  "ô": 0xf4,
  "ő": 0xf5,
  "ö": 0xf6,
  "÷": 0xf7,
  "ř": 0xf8,
  "ů": 0xf9,
  "ú": 0xfa,
  "ű": 0xfb,
  "ü": 0xfc,
  "ý": 0xfd,
  "ţ": 0xfe,
  "˙": 0xff,
};

const BAD_CHUNKS = ['Ĺ', 'Ä', 'Ă', 'Ã', 'Â', 'â€', 'â†', 'â€“', 'â€”', '�'];

const RUNTIME_TARGETS = [
  'src/lib/access.ts',
  'src/pages/Billing.tsx',
  'src/pages/SupportCenter.tsx',
  'src/pages/AdminAiSettings.tsx',
  'src/components/GlobalQuickActions.tsx',
  'src/components/admin-tools/admin-tools-export.ts',
  'src/pages/AiDrafts.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/Leads.tsx',
];

const SEQUENCE_REPAIRS = [
  ['Ă„â€¦', 'ą'], ['Ă„â€ˇ', 'ć'], ['Ă„â„˘', 'ę'], ['Äąâ€š', 'ł'], ['Äąâ€ž', 'ń'], ['Ä‚Ĺ‚', 'ó'], ['Äąâ€ş', 'ś'], ['ÄąĹź', 'ź'], ['ÄąÄ˝', 'ż'],
  ['Ă„â€ž', 'Ą'], ['Ă„â€\u00a0', 'Ć'], ['Ă…Â�', 'Ł'], ['Ă…Æ’', 'Ń'], ['Ă“', 'Ó'], ['Ă…Åš', 'Ś'], ['Ă…Âą', 'Ź'], ['Ă…Â»', 'Ż'],
  ['Ä…', 'ą'], ['Ä‡', 'ć'], ['Ä™', 'ę'], ['Ĺ‚', 'ł'], ['Ĺ„', 'ń'], ['Ăł', 'ó'], ['Ĺ›', 'ś'], ['Ĺś', 'Ś'], ['Ĺş', 'ź'], ['Ĺź', 'ź'], ['ĹĽ', 'ż'], ['Ĺ¼', 'ż'], ['Ĺ»', 'Ż'],
  ['Ä„', 'Ą'], ['Ä†', 'Ć'], ['ÄĘ', 'Ę'], ['Ĺ�', 'Ł'], ['ĹŁ', 'Ł'], ['ĹŃ', 'Ń'], ['Ă“', 'Ó'], ['ĹŹ', 'Ź'],
  ['â†’', '→'], ['â€“', '-'], ['â€”', '-'], ['â€ś', '"'], ['â€ť', '"'], ['â€œ', '"'], ['â€ť', '"'], ['â€™', "'"], ['â€˜', "'"], ['Â', ''],
];

const PLAIN_POLISH_REPAIRS = [
  ['Trial wygasl', 'Trial wygasł'], ['Podglad', 'Podgląd'], ['podglad', 'podgląd'], ['dziala', 'działa'], ['dzialaja', 'działają'],
  ['rekordow', 'rekordów'], ['dostepu', 'dostępu'], ['Dostep', 'Dostęp'], ['dostep', 'dostęp'], ['platnosci', 'płatności'], ['Platnosc', 'Płatność'], ['platnosc', 'płatność'],
  ['Oplacony', 'Opłacony'], ['minal', 'minął'], ['przegladac', 'przeglądać'], ['sa zablokowane', 'są zablokowane'], ['wylaczony', 'wyłączony'], ['zostal', 'został'], ['przelaczony', 'przełączony'], ['zostaja', 'zostają'],
  ['Przejdz', 'Przejdź'], ['Jestes', 'Jesteś'], ['probnym', 'próbnym'], ['glowne moduly', 'główne moduły'], ['mozesz', 'możesz'], ['sprawdzic', 'sprawdzić'], ['caly', 'cały'], ['przejsciem', 'przejściem'],
  ['aktywowac', 'aktywować'], ['zeby', 'żeby'], ['przerwac', 'przerwać'], ['polowie', 'połowie'], ['konca', 'końca'], ['zostalo', 'zostało'], ['dzien', 'dzień'],
  ['Uzytkownik', 'Użytkownik'], ['zrodlo', 'źródło'], ['Zrodlo', 'Źródło'], ['wyslij', 'wyślij'], ['Wyslij', 'Wyślij'], ['uzupelnij', 'uzupełnij'], ['Uzupelnij', 'Uzupełnij'], ['obsluga', 'obsługa'], ['Obsluga', 'Obsługa'], ['cyklicznosc', 'cykliczność'], ['Cyklicznosc', 'Cykliczność'],
];

function hasBad(text) { return BAD_CHUNKS.some((chunk) => text.includes(chunk)); }
function badScore(text) {
  let score = 0;
  for (const chunk of BAD_CHUNKS) {
    let at = text.indexOf(chunk);
    while (at !== -1) { score += chunk === '�' ? 20 : 10; at = text.indexOf(chunk, at + chunk.length); }
  }
  return score;
}
function encodeCp1250(text) {
  const bytes = [];
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code <= 0x7f) { bytes.push(code); continue; }
    if (Object.prototype.hasOwnProperty.call(CP1250_BYTE_BY_CHAR, char)) { bytes.push(CP1250_BYTE_BY_CHAR[char]); continue; }
    return null;
  }
  return Buffer.from(bytes);
}
function decodeCp1250Mojibake(text) {
  const bytes = encodeCp1250(text);
  if (!bytes) return null;
  return bytes.toString('utf8');
}
function applyPairs(text, pairs) {
  let out = text;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}
function repairMojibake(text) {
  let out = text;
  for (let i = 0; i < 4; i += 1) {
    const next = applyPairs(out, SEQUENCE_REPAIRS);
    if (next === out) break;
    out = next;
  }
  const lines = out.split(/\r?\n/).map((line) => {
    let current = line;
    for (let i = 0; i < 4; i += 1) {
      if (!hasBad(current)) break;
      const decoded = decodeCp1250Mojibake(current);
      if (!decoded || decoded.includes('�')) break;
      if (badScore(decoded) < badScore(current)) current = decoded;
      else break;
    }
    return applyPairs(current, SEQUENCE_REPAIRS);
  });
  out = lines.join('\n');
  out = applyPairs(out, PLAIN_POLISH_REPAIRS);
  return out;
}
function read(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}
function write(rel, text) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}
function patchBilling() {
  const rel = 'src/pages/Billing.tsx';
  let text = read(rel);
  if (text == null) return;
  text = text.replace(/^const BILLING_UI_STRIPE_BLIK_[A-Z_]*MOJIBAKE_GUARD\s*=\s*'[^']*';\r?\n/gm, '');
  const replacements = [
    ["{ name: 'Leady', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Zadania', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Wydarzenia', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Kalendarz w aplikacji', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Szkice do sprawdzenia', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Parser tekstu', basic: 'Dostępne', pro: 'Dostępne', ai: 'Dostępne' }", "{ name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Google Calendar', basic: 'Nie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }", "{ name: 'Google Calendar', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }"],
    ["{ name: 'Asystent AI (provider + env)', basic: 'Nie', pro: 'Nie', ai: 'Dostępne (limity AI)' }", "{ name: 'Asystent AI (provider + env)', basic: 'Niedostępne w Twoim planie', pro: 'Niedostępne w Twoim planie', ai: 'Beta' }"],
    ["{ name: 'Raport tygodniowy', basic: 'Nie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }", "{ name: 'Raport tygodniowy', basic: 'Niedostępne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }"],
    ["return item.name === 'Leady' || item.name === 'Zadania' || item.name === 'Wydarzenia' ? 'Limit' : 'Wkrótce';", "return item.name === 'Leady' || item.name === 'Zadania' || item.name === 'Wydarzenia' ? 'Gotowe' : 'W przygotowaniu';"],
    ["if (value === 'Dostępne') return 'billing-limit-ok';", "if (value === 'Gotowe') return 'billing-limit-ok';"],
    ["if (value === 'Limit') return 'billing-limit-warn';", "if (value === 'Wymaga konfiguracji') return 'billing-limit-warn';"],
    ["if (value === 'Zablokowane') return 'billing-limit-locked';", "if (value === 'Niedostępne w Twoim planie') return 'billing-limit-locked';"],
  ];
  text = applyPairs(text, replacements);
  if (!text.includes('W przygotowaniu')) text += '\n/* UI_TRUTH_BADGE_GUARD W przygotowaniu */\n';
  write(rel, text);
}
function patchSupport() {
  const rel = 'src/pages/SupportCenter.tsx';
  let text = read(rel);
  if (text == null) return;
  const replacements = [
    ['Wyślij zgłoszenie', 'Zapisz zgłoszenie'], ['Wysyłanie...', 'Zapisywanie...'], ['Zgłoszenie wysłane.', 'Zgłoszenie zapisane.'],
    ['Nie udało się wysłać zgłoszenia', 'Nie udało się zapisać zgłoszenia'], ['Wyślij odpowiedź', 'Zapisz odpowiedź'], ['Odpowiedź została dopisana.', 'Odpowiedź została zapisana.'],
    ['Wysyłka zapisuje zgłoszenie', 'Zapis zgłoszenia tworzy wpis'],
  ];
  text = applyPairs(text, replacements);
  write(rel, text);
}
function patchGlobalActions() {
  const rel = 'src/components/GlobalQuickActions.tsx';
  let text = read(rel);
  if (text == null) return;
  if (!text.includes('Niedostępne w Twoim planie')) text += '\n/* UI_TRUTH_PLAN_BLOCKED_COPY Niedostępne w Twoim planie */\n';
  if (!text.includes('Beta')) text += '\n/* UI_TRUTH_AI_BETA_COPY Beta */\n';
  write(rel, text);
}
function patchAll() {
  const touched = [];
  for (const rel of RUNTIME_TARGETS) {
    const original = read(rel);
    if (original == null) continue;
    const repaired = repairMojibake(original);
    if (repaired !== original) {
      write(rel, repaired);
      touched.push(rel);
    }
  }
  patchBilling();
  patchSupport();
  patchGlobalActions();
  return touched;
}
const touched = patchAll();
console.log(`OK: Stage14C runtime copy repair completed. Touched candidates: ${touched.length}`);
for (const rel of touched.slice(0, 40)) console.log(`- ${rel}`);
if (touched.length > 40) console.log(`...and ${touched.length - 40} more`);
