#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';
const write = (rel, content) => {
  const full = path.join(repo, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
};

function patchFile(rel, patcher) {
  const before = read(rel);
  if (!before) throw new Error(`Missing ${rel}`);
  const after = patcher(before);
  if (after !== before) {
    write(rel, after);
    console.log(`patched: ${rel}`);
  } else {
    console.log(`unchanged: ${rel}`);
  }
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

patchFile('src/pages/Clients.tsx', (source) => {
  let text = source;
  text = replaceAll(text, 'title="Możliwy duplikat klienta lub leada"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'title="Mozliwy duplikat klienta lub leada"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'title="Możliwy duplikat w bazie"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'title="Mozliwy duplikat w bazie"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'createAnywayLabel="Dodaj klienta mimo to"', 'createAnywayLabel="Dodaj mimo to"');
  text = replaceAll(text, 'createAnywayLabel="Dodaj klienta pomimo ostrzeżenia"', 'createAnywayLabel="Dodaj mimo to"');
  text = replaceAll(text, 'createAnywayLabel="Dodaj klienta pomimo ostrzezenia"', 'createAnywayLabel="Dodaj mimo to"');
  return text;
});

patchFile('src/pages/Leads.tsx', (source) => {
  let text = source;
  text = replaceAll(text, 'title="Możliwy duplikat leada lub klienta"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'title="Mozliwy duplikat leada lub klienta"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'title="Możliwy duplikat w bazie"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'title="Mozliwy duplikat w bazie"', 'title="Możliwy duplikat"');
  text = replaceAll(text, 'createAnywayLabel="Dodaj leada mimo to"', 'createAnywayLabel="Dodaj mimo to"');
  text = replaceAll(text, 'createAnywayLabel="Dodaj lead mimo to"', 'createAnywayLabel="Dodaj mimo to"');
  text = replaceAll(text, 'createAnywayLabel="Dodaj leada pomimo ostrzeżenia"', 'createAnywayLabel="Dodaj mimo to"');
  text = replaceAll(text, 'createAnywayLabel="Dodaj leada pomimo ostrzezenia"', 'createAnywayLabel="Dodaj mimo to"');
  return text;
});

patchFile('src/lib/supabase-fallback.ts', (source) => {
  let text = source;
  text = text.replace(
    /type LeadInsertInput = \{([^}]+)allowDuplicate\?: boolean([^}]*)\};/,
    (match) => match.includes('forceDuplicate?: boolean') ? match : match.replace('allowDuplicate?: boolean', 'allowDuplicate?: boolean; forceDuplicate?: boolean')
  );
  text = text.replace(
    /type ClientUpsertInput = \{([^}]+)allowDuplicate\?: boolean([^}]*)\};/,
    (match) => match.includes('forceDuplicate?: boolean') ? match : match.replace('allowDuplicate?: boolean', 'allowDuplicate?: boolean; forceDuplicate?: boolean')
  );
  return text;
});

const checkScript = String.raw`#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) fail('Missing file: ' + rel);
  return fs.readFileSync(full, 'utf8');
}
function fail(message) {
  console.error('CLOSEFLOW_DUPLICATE_WARNING_UX_FULL_FAIL: ' + message);
  process.exit(1);
}
function assert(condition, message) { if (!condition) fail(message); }
function has(text, needle, label) { assert(text.includes(needle), label + ' missing: ' + needle); }
function hasAny(text, needles, label) { assert(needles.some((needle) => text.includes(needle)), label + ' missing any of: ' + needles.join(' | ')); }

const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const dialog = read('src/components/EntityConflictDialog.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const systemApi = read('api/system.ts');
const leadApi = read('api/leads.ts');
const clientApi = read('api/clients.ts');
const entityHandler = read('src/server/entity-conflicts-handler.ts');
const pkg = JSON.parse(read('package.json'));

has(dialog, 'EntityConflictDialog', 'EntityConflictDialog export');
has(dialog, 'matchFields', 'EntityConflictDialog reason list');
has(dialog, 'Pokaż', 'EntityConflictDialog show action');
has(dialog, 'Przywróć', 'EntityConflictDialog restore action');
has(dialog, 'Dodaj mimo to', 'EntityConflictDialog create anyway action');

for (const [name, source, targetType] of [['Leads', leads, 'lead'], ['Clients', clients, 'client']]) {
  has(source, 'EntityConflictDialog', name + ' dialog usage');
  has(source, 'findEntityConflictsInSupabase', name + ' conflict lookup');
  has(source, "targetType: '" + targetType + "'", name + ' targetType');
  has(source, 'name:', name + ' sends name');
  has(source, 'email:', name + ' sends email');
  has(source, 'phone:', name + ' sends phone');
  has(source, 'company:', name + ' sends company');
  has(source, 'Dodaj mimo to', name + ' create anyway label');
  hasAny(source, ['onCreateAnyway', 'handleCreate', 'CreateAnyway'], name + ' create anyway flow');
}

has(systemApi, 'entityConflictsHandler', 'api/system routes entity conflicts handler');
has(systemApi, 'entity-conflicts', 'api/system entity-conflicts kind');

for (const field of ['email', 'phone', 'name', 'company']) {
  has(entityHandler, "matches.push('" + field + "')", 'backend conflict field ' + field);
}
has(entityHandler, 'matchFields', 'backend returns matchFields');
has(entityHandler, 'buildLeadCandidate', 'backend lead candidates');
has(entityHandler, 'buildClientCandidate', 'backend client candidates');
has(entityHandler, 'canRestore', 'backend restore flag');
has(entityHandler, 'url:', 'backend show URL');

has(fallback, 'findEntityConflictsInSupabase', 'frontend API conflict helper');
has(fallback, "targetType: 'lead' | 'client'", 'frontend conflict input target types');
hasAny(fallback, ['allowDuplicate?: boolean; forceDuplicate?: boolean', 'allowDuplicate?: boolean'], 'duplicate override typing');
hasAny(leadApi, ['sanitizeFreshLeadCreatePayloadA1', 'allowDuplicate', 'forceDuplicate'], 'lead API duplicate/create safety marker');
hasAny(clientApi, ['insertWithSchemaFallback', 'allowDuplicate', 'forceDuplicate'], 'client API create path marker');

assert(pkg.scripts && pkg.scripts['check:closeflow-duplicate-warning-ux-full'] === 'node scripts/check-closeflow-duplicate-warning-ux-full.cjs', 'package script check:closeflow-duplicate-warning-ux-full missing');

console.log('CLOSEFLOW_DUPLICATE_WARNING_UX_FULL_CHECK_OK');
console.log('fields=email,phone,name,company');
console.log('entities=lead,client');
`;
write('scripts/check-closeflow-duplicate-warning-ux-full.cjs', checkScript + '\n');

const doc = `# CloseFlow A2 — Duplicate warning UX full finalizer

**Data:** 2026-05-09  
**Etap:** A2 — Duplicate warning UX full  
**Tryb:** finalizer / guard / runtime smoke checklist

## Werdykt

A2 nie jest przepisywany od zera. Istniejący flow konfliktów zostaje, a ten finalizer dopina guard oraz ujednolica kopię modala.

## Zakres

- Lead i klient używają \`EntityConflictDialog\`.
- Przed zapisem wywoływany jest \`findEntityConflictsInSupabase\`.
- Backend \`api/system?kind=entity-conflicts\` wykrywa konflikt po: \`email\`, \`phone\`, \`name\`, \`company\`.
- Modal pokazuje powody przez \`matchFields\`.
- Użytkownik może kliknąć \`Pokaż\`, \`Przywróć\` jeśli dotyczy, \`Dodaj mimo to\` albo anulować.

## Nie robimy

- Brak automatycznego scalania.
- Brak automatycznego usuwania.
- Brak AI dedupe.
- Brak blokady zapisu po świadomym kliknięciu \`Dodaj mimo to\`.

## Check automatyczny

\`npm run check:closeflow-duplicate-warning-ux-full\`

Sprawdza:

- dialog konfliktu,
- flow dla leadów,
- flow dla klientów,
- backend fields: email / phone / name / company,
- routing \`entity-conflicts\` w \`api/system.ts\`,
- konsekwencję override \`allowDuplicate / forceDuplicate\` na poziomie typów/ścieżek tworzenia.

## Runtime smoke po wdrożeniu

1. W \`Leady\` dodaj lead z telefonem istniejącego leada.
2. Ma pojawić się modal \`Możliwy duplikat\`.
3. Lista powodów ma pokazać \`telefon\`.
4. Kliknij \`Pokaż\` i sprawdź, czy prowadzi do istniejącego rekordu.
5. Powtórz i kliknij \`Dodaj mimo to\`; zapis ma przejść dopiero po tym kliknięciu.
6. W \`Klienci\` dodaj klienta z telefonem istniejącego klienta.
7. Ma pojawić się modal \`Możliwy duplikat\`.
8. Powód ma obejmować \`telefon\` albo inne zgodne pole.
9. Jeśli kandydat jest archiwalny, ma być dostępne \`Przywróć\`.
10. \`Anuluj\` nie zapisuje nowego rekordu.

## Kryterium zamknięcia

A2 jest domknięte dopiero, gdy check przechodzi, build przechodzi i ręcznie zobaczysz modal duplikatu dla leada oraz klienta.
`;
write('docs/runtime/CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL_FINALIZER_2026-05-09.md', doc);

const pkgPath = 'package.json';
const pkg = JSON.parse(read(pkgPath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-duplicate-warning-ux-full'] = 'node scripts/check-closeflow-duplicate-warning-ux-full.cjs';
// Keep compatibility with earlier A2 attempts, but do not force users to use this alias.
pkg.scripts['check:a2-duplicate-warning-ux-full'] = 'node scripts/check-closeflow-duplicate-warning-ux-full.cjs';
write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log('CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL_FINALIZER_PATCH_OK');
