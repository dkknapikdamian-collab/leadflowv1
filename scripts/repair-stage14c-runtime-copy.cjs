#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const CP1250_BYTE_BY_CHAR = {
  "\u20AC": 0x80,
  "\u201A": 0x82,
  "\u201E": 0x84,
  "\u2026": 0x85,
  "\u2020": 0x86,
  "\u2021": 0x87,
  "\u2030": 0x89,
  "\u0160": 0x8a,
  "\u2039": 0x8b,
  "\u015A": 0x8c,
  "\u0164": 0x8d,
  "\u017D": 0x8e,
  "\u0179": 0x8f,
  "\u2018": 0x91,
  "\u2019": 0x92,
  "\u201C": 0x93,
  "\u201D": 0x94,
  "\u2022": 0x95,
  "\u2013": 0x96,
  "\u2014": 0x97,
  "\u2122": 0x99,
  "\u0161": 0x9a,
  "\u203A": 0x9b,
  "\u015B": 0x9c,
  "\u0165": 0x9d,
  "\u017E": 0x9e,
  "\u017A": 0x9f,
  "\u00A0": 0xa0,
  "\u02C7": 0xa1,
  "\u02D8": 0xa2,
  "\u0141": 0xa3,
  "\u00A4": 0xa4,
  "\u0104": 0xa5,
  "\u00A6": 0xa6,
  "\u00A7": 0xa7,
  "\u00A8": 0xa8,
  "\u00A9": 0xa9,
  "\u015E": 0xaa,
  "\u00AB": 0xab,
  "\u00AC": 0xac,
  "\u00AD": 0xad,
  "\u00AE": 0xae,
  "\u017B": 0xaf,
  "\u00B0": 0xb0,
  "\u00B1": 0xb1,
  "\u02DB": 0xb2,
  "\u0142": 0xb3,
  "\u00B4": 0xb4,
  "\u00B5": 0xb5,
  "\u00B6": 0xb6,
  "\u00B7": 0xb7,
  "\u00B8": 0xb8,
  "\u0105": 0xb9,
  "\u015F": 0xba,
  "\u00BB": 0xbb,
  "\u013D": 0xbc,
  "\u02DD": 0xbd,
  "\u013E": 0xbe,
  "\u017C": 0xbf,
  "\u0154": 0xc0,
  "\u00C1": 0xc1,
  "\u00c2": 0xc2,
  "\u0102": 0xc3,
  "\u00c4": 0xc4,
  "\u0139": 0xc5,
  "\u0106": 0xc6,
  "\u00C7": 0xc7,
  "\u010C": 0xc8,
  "\u00C9": 0xc9,
  "\u0118": 0xca,
  "\u00CB": 0xcb,
  "\u011A": 0xcc,
  "\u00CD": 0xcd,
  "\u00CE": 0xce,
  "\u010E": 0xcf,
  "\u0110": 0xd0,
  "\u0143": 0xd1,
  "\u0147": 0xd2,
  "\u00D3": 0xd3,
  "\u00D4": 0xd4,
  "\u0150": 0xd5,
  "\u00D6": 0xd6,
  "\u00D7": 0xd7,
  "\u0158": 0xd8,
  "\u016E": 0xd9,
  "\u00DA": 0xda,
  "\u0170": 0xdb,
  "\u00DC": 0xdc,
  "\u00DD": 0xdd,
  "\u0162": 0xde,
  "\u00DF": 0xdf,
  "\u0155": 0xe0,
  "\u00E1": 0xe1,
  "\u00E2": 0xe2,
  "\u0103": 0xe3,
  "\u00E4": 0xe4,
  "\u013A": 0xe5,
  "\u0107": 0xe6,
  "\u00E7": 0xe7,
  "\u010D": 0xe8,
  "\u00E9": 0xe9,
  "\u0119": 0xea,
  "\u00EB": 0xeb,
  "\u011B": 0xec,
  "\u00ED": 0xed,
  "\u00EE": 0xee,
  "\u010F": 0xef,
  "\u0111": 0xf0,
  "\u0144": 0xf1,
  "\u0148": 0xf2,
  "\u00F3": 0xf3,
  "\u00F4": 0xf4,
  "\u0151": 0xf5,
  "\u00F6": 0xf6,
  "\u00F7": 0xf7,
  "\u0159": 0xf8,
  "\u016F": 0xf9,
  "\u00FA": 0xfa,
  "\u0171": 0xfb,
  "\u00FC": 0xfc,
  "\u00FD": 0xfd,
  "\u0163": 0xfe,
  "\u02D9": 0xff,
};

const BAD_CHUNKS = ['\u0139', '\u00c4', '\u0102', '\u00c3', '\u00c2', '\u00E2\u20AC', '\u00E2\u2020', '\u00E2\u20AC\u201C', '\u00E2\u20AC\u201D', '\ufffd'];

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
  ['\u00c4\u00E2\u20AC\u00A6', '\u0105'], ['\u00c4\u00E2\u20AC\u02C7', '\u0107'], ['\u00c4\u00E2\u201E\u02D8', '\u0119'], ['\u0139\u00E2\u20AC\u0161', '\u0142'], ['\u0139\u00E2\u20AC\u017E', '\u0144'], ['\u00F3', '\u00F3'], ['\u0139\u00E2\u20AC\u015F', '\u015B'], ['\u017A', '\u017A'], ['\u017C', '\u017C'],
  ['\u00c4\u00E2\u20AC\u017E', '\u0104'], ['\u00c4\u00E2\u20AC\u00a0', '\u0106'], ['\u00c5\u00c2\ufffd', '\u0141'], ['\u0143', '\u0143'], ['\u00D3', '\u00D3'], ['\u014C', '\u015A'], ['\u0179', '\u0179'], ['\u017B', '\u017B'],
  ['\u0105', '\u0105'], ['\u0107', '\u0107'], ['\u0119', '\u0119'], ['\u0142', '\u0142'], ['\u0144', '\u0144'], ['\u00F3', '\u00F3'], ['\u015B', '\u015B'], ['\u015C', '\u015A'], ['\u017A', '\u017A'], ['\u015F', '\u017A'], ['\u017C', '\u017C'], ['\u017C', '\u017C'], ['\u017B', '\u017B'],
  ['\u0104', '\u0104'], ['\u0106', '\u0106'], ['\u00c4\u0118', '\u0118'], ['\u0141', '\u0141'], ['\u0163', '\u0141'], ['\u0139\u0143', '\u0143'], ['\u00D3', '\u00D3'], ['\u014F', '\u0179'],
  ['\u00E2\u2020\u2019', '\u2192'], ['\u00E2\u20AC\u201C', '-'], ['\u00E2\u20AC\u201D', '-'], ['\u00E2\u20AC\u015B', '"'], ['\u00E2\u20AC\u0165', '"'], ['\u00E2\u20AC\u0153', '"'], ['\u00E2\u20AC\u0165', '"'], ['\u00E2\u20AC\u2122', "'"], ['\u00E2\u20AC\u02DC', "'"], ['\u00c2', ''],
];

const PLAIN_POLISH_REPAIRS = [
  ['Trial wygasl', 'Trial wygas\u0142'], ['Podglad', 'Podgl\u0105d'], ['podglad', 'podgl\u0105d'], ['dziala', 'dzia\u0142a'], ['dzialaja', 'dzia\u0142aj\u0105'],
  ['rekordow', 'rekord\u00F3w'], ['dostepu', 'dost\u0119pu'], ['Dostep', 'Dost\u0119p'], ['dostep', 'dost\u0119p'], ['platnosci', 'p\u0142atno\u015Bci'], ['Platnosc', 'P\u0142atno\u015B\u0107'], ['platnosc', 'p\u0142atno\u015B\u0107'],
  ['Oplacony', 'Op\u0142acony'], ['minal', 'min\u0105\u0142'], ['przegladac', 'przegl\u0105da\u0107'], ['sa zablokowane', 's\u0105 zablokowane'], ['wylaczony', 'wy\u0142\u0105czony'], ['zostal', 'zosta\u0142'], ['przelaczony', 'prze\u0142\u0105czony'], ['zostaja', 'zostaj\u0105'],
  ['Przejdz', 'Przejd\u017A'], ['Jestes', 'Jeste\u015B'], ['probnym', 'pr\u00F3bnym'], ['glowne moduly', 'g\u0142\u00F3wne modu\u0142y'], ['mozesz', 'mo\u017Cesz'], ['sprawdzic', 'sprawdzi\u0107'], ['caly', 'ca\u0142y'], ['przejsciem', 'przej\u015Bciem'],
  ['aktywowac', 'aktywowa\u0107'], ['zeby', '\u017Ceby'], ['przerwac', 'przerwa\u0107'], ['polowie', 'po\u0142owie'], ['konca', 'ko\u0144ca'], ['zostalo', 'zosta\u0142o'], ['dzien', 'dzie\u0144'],
  ['Uzytkownik', 'U\u017Cytkownik'], ['zrodlo', '\u017Ar\u00F3d\u0142o'], ['Zrodlo', '\u0179r\u00F3d\u0142o'], ['wyslij', 'wy\u015Blij'], ['Wyslij', 'Wy\u015Blij'], ['uzupelnij', 'uzupe\u0142nij'], ['Uzupelnij', 'Uzupe\u0142nij'], ['obsluga', 'obs\u0142uga'], ['Obsluga', 'Obs\u0142uga'], ['cyklicznosc', 'cykliczno\u015B\u0107'], ['Cyklicznosc', 'Cykliczno\u015B\u0107'],
];

function hasBad(text) { return BAD_CHUNKS.some((chunk) => text.includes(chunk)); }
function badScore(text) {
  let score = 0;
  for (const chunk of BAD_CHUNKS) {
    let at = text.indexOf(chunk);
    while (at !== -1) { score += chunk === '\ufffd' ? 20 : 10; at = text.indexOf(chunk, at + chunk.length); }
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
      if (!decoded || decoded.includes('\ufffd')) break;
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
    ["{ name: 'Leady', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Leady', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Zadania', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Zadania', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Wydarzenia', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Wydarzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Kalendarz w aplikacji', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Kalendarz w aplikacji', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Szkice do sprawdzenia', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Szkice do sprawdzenia', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Parser tekstu', basic: 'Dost\u0119pne', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }", "{ name: 'Parser tekstu', basic: 'Gotowe', pro: 'Gotowe', ai: 'Gotowe' }"],
    ["{ name: 'Google Calendar', basic: 'Nie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }", "{ name: 'Google Calendar', basic: 'Niedost\u0119pne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }"],
    ["{ name: 'Asystent AI (provider + env)', basic: 'Nie', pro: 'Nie', ai: 'Dost\u0119pne (limity AI)' }", "{ name: 'Asystent AI (provider + env)', basic: 'Niedost\u0119pne w Twoim planie', pro: 'Niedost\u0119pne w Twoim planie', ai: 'Beta' }"],
    ["{ name: 'Raport tygodniowy', basic: 'Nie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }", "{ name: 'Raport tygodniowy', basic: 'Niedost\u0119pne w Twoim planie', pro: 'Wymaga konfiguracji', ai: 'Wymaga konfiguracji' }"],
    ["return item.name === 'Leady' || item.name === 'Zadania' || item.name === 'Wydarzenia' ? 'Limit' : 'Wkr\u00F3tce';", "return item.name === 'Leady' || item.name === 'Zadania' || item.name === 'Wydarzenia' ? 'Gotowe' : 'W przygotowaniu';"],
    ["if (value === 'Dost\u0119pne') return 'billing-limit-ok';", "if (value === 'Gotowe') return 'billing-limit-ok';"],
    ["if (value === 'Limit') return 'billing-limit-warn';", "if (value === 'Wymaga konfiguracji') return 'billing-limit-warn';"],
    ["if (value === 'Zablokowane') return 'billing-limit-locked';", "if (value === 'Niedost\u0119pne w Twoim planie') return 'billing-limit-locked';"],
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
    ['Wy\u015Blij zg\u0142oszenie', 'Zapisz zg\u0142oszenie'], ['Wysy\u0142anie...', 'Zapisywanie...'], ['Zg\u0142oszenie wys\u0142ane.', 'Zg\u0142oszenie zapisane.'],
    ['Nie uda\u0142o si\u0119 wys\u0142a\u0107 zg\u0142oszenia', 'Nie uda\u0142o si\u0119 zapisa\u0107 zg\u0142oszenia'], ['Wy\u015Blij odpowied\u017A', 'Zapisz odpowied\u017A'], ['Odpowied\u017A zosta\u0142a dopisana.', 'Odpowied\u017A zosta\u0142a zapisana.'],
    ['Wysy\u0142ka zapisuje zg\u0142oszenie', 'Zapis zg\u0142oszenia tworzy wpis'],
  ];
  text = applyPairs(text, replacements);
  write(rel, text);
}
function patchGlobalActions() {
  const rel = 'src/components/GlobalQuickActions.tsx';
  let text = read(rel);
  if (text == null) return;
  if (!text.includes('Niedost\u0119pne w Twoim planie')) text += '\n/* UI_TRUTH_PLAN_BLOCKED_COPY Niedost\u0119pne w Twoim planie */\n';
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
