const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const clientsPath = path.join(repo, 'src', 'pages', 'Clients.tsx');
const testPath = path.join(repo, 'tests', 'stage81-clients-top-value-records-card.test.cjs');
const reportPath = path.join(repo, 'docs', 'audits', 'clients-top-value-stage2-2026-05-15.md');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${path.relative(repo, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function timestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function findStatementEnd(source, startIndex) {
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let quote = null;
  let escaped = false;

  for (let i = startIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if ((ch === '/' && next === '/') || (ch === '/' && next === '*')) {
      if (next === '/') {
        const end = source.indexOf('\n', i + 2);
        if (end === -1) return source.length;
        i = end;
        continue;
      }
      const end = source.indexOf('*/', i + 2);
      if (end === -1) fail('Unterminated block comment while scanning Clients.tsx.');
      i = end + 1;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '(') depthParen += 1;
    if (ch === ')') depthParen -= 1;
    if (ch === '{') depthBrace += 1;
    if (ch === '}') depthBrace -= 1;
    if (ch === '[') depthBracket += 1;
    if (ch === ']') depthBracket -= 1;

    if (ch === ';' && depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
      return i + 1;
    }
  }
  fail('Could not find statement end in Clients.tsx.');
}

function ensureTopValueImport(source) {
  const importRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/operator-rail['"];?/m;
  const match = source.match(importRegex);

  if (match) {
    const names = match[1]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    if (!names.includes('TopValueRecordsCard')) names.push('TopValueRecordsCard');
    const ordered = Array.from(new Set(names)).sort((a, b) => {
      const order = ['SimpleFiltersCard', 'TopValueRecordsCard', 'OperatorSideCard'];
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return a.localeCompare(b);
    });
    return source.replace(importRegex, `import { ${ordered.join(', ')} } from '../components/operator-rail';`);
  }

  const firstStyleImport = source.search(/import\s+['"][^'"]+\.css['"];?/);
  const line = `import { TopValueRecordsCard } from '../components/operator-rail';\n`;
  if (firstStyleImport !== -1) return source.slice(0, firstStyleImport) + line + source.slice(firstStyleImport);
  return line + source;
}

function ensureFormatClientMoney(source) {
  if (/function\s+formatClientMoney\s*\(/.test(source) || /const\s+formatClientMoney\s*=/.test(source)) return source;
  const fn = `\nfunction formatClientMoney(value: number) {\n  return `${Math.round(Number(value || 0)).toLocaleString('pl-PL')} PLN`;\n}\n`;
  const typeMatch = source.match(/type\s+ClientRecord\s*=\s*\{[\s\S]*?\};/);
  if (typeMatch) {
    const insertAt = source.indexOf(typeMatch[0]) + typeMatch[0].length;
    return source.slice(0, insertAt) + fn + source.slice(insertAt);
  }
  const exportIndex = source.indexOf('export default function Clients');
  if (exportIndex === -1) fail('Could not locate export default function Clients in Clients.tsx.');
  return source.slice(0, exportIndex) + fn + '\n' + source.slice(exportIndex);
}

function insertOrReplaceMostValuableClients(source) {
  const block = `\n  const mostValuableClients = useMemo(() => {\n    return clients\n      .filter((client) => !client.archivedAt)\n      .map((client) => ({\n        client,\n        value: clientValueByClientId.get(client.id) || 0,\n      }))\n      .filter((entry) => entry.value > 0)\n      .sort((a, b) => b.value - a.value)\n      .slice(0, 5);\n  }, [clients, clientValueByClientId]);\n`;

  const existingIndex = source.indexOf('const mostValuableClients = useMemo');
  if (existingIndex !== -1) {
    const start = source.lastIndexOf('\n', existingIndex) + 1;
    const end = findStatementEnd(source, existingIndex);
    return source.slice(0, start) + block.trimStart() + source.slice(end);
  }

  const clientValueIndex = source.indexOf('const clientValueByClientId = useMemo');
  if (clientValueIndex === -1) {
    fail('Clients.tsx does not contain const clientValueByClientId = useMemo(...). Stage 2 should use the existing client value source, not invent a new calculation.');
  }
  const insertAt = findStatementEnd(source, clientValueIndex);
  return source.slice(0, insertAt) + block + source.slice(insertAt);
}

function topValueCardBlock(indent = '            ') {
  return `${indent}<TopValueRecordsCard\n${indent}  title="Najcenniejsi klienci"\n${indent}  description="5 klientów z największą wartością."\n${indent}  dataTestId="clients-top-value-records-card"\n${indent}  items={mostValuableClients.map(({ client, value }) => ({\n${indent}    key: client.id,\n${indent}    href: \`/clients/\${client.id}\`,\n${indent}    label: client.name || 'Klient',\n${indent}    valueLabel: formatClientMoney(value),\n${indent}    description: client.company || client.email || client.phone || 'Klient',\n${indent}    title: \`${'${client.name || \'Klient\'}'} - ${'${formatClientMoney(value)}'}\`,\n${indent}  }))}\n${indent}/>\n`;
}

function removeExistingClientsTopValueCard(source) {
  const marker = 'dataTestId="clients-top-value-records-card"';
  const idx = source.indexOf(marker);
  if (idx === -1) return source;

  const start = source.lastIndexOf('<TopValueRecordsCard', idx);
  if (start === -1) fail('Found clients-top-value-records-card marker, but could not locate opening TopValueRecordsCard tag.');
  const end = source.indexOf('/>', idx);
  if (end === -1) fail('Found clients-top-value-records-card marker, but could not locate closing />.');

  let lineStart = source.lastIndexOf('\n', start) + 1;
  let lineEnd = end + 2;
  if (source[lineEnd] === '\n') lineEnd += 1;
  return source.slice(0, lineStart) + source.slice(lineEnd);
}

function insertTopValueCard(source) {
  source = removeExistingClientsTopValueCard(source);

  const simpleIndex = source.indexOf('<SimpleFiltersCard');
  if (simpleIndex === -1) fail('Could not locate <SimpleFiltersCard on /clients right rail.');
  const simpleEnd = source.indexOf('/>', simpleIndex);
  if (simpleEnd === -1) fail('Could not locate closing /> for SimpleFiltersCard.');

  const lineStart = source.lastIndexOf('\n', simpleIndex) + 1;
  const indent = source.slice(lineStart, simpleIndex).match(/^\s*/)?.[0] || '            ';
  const insertAt = simpleEnd + 2;
  return source.slice(0, insertAt) + '\n' + topValueCardBlock(indent) + source.slice(insertAt);
}

function assertFinalSource(source) {
  const required = [
    'const mostValuableClients = useMemo',
    'clientValueByClientId.get(client.id) || 0',
    '.slice(0, 5)',
    '<TopValueRecordsCard',
    'title="Najcenniejsi klienci"',
    'description="5 klientów z największą wartością."',
    'dataTestId="clients-top-value-records-card"',
    'href: `/clients/${client.id}`',
    'valueLabel: formatClientMoney(value)',
  ];
  for (const token of required) {
    if (!source.includes(token)) fail(`Clients.tsx missing required Stage 2 token: ${token}`);
  }

  const forbidden = [
    'data-clients-lead-attention-rail',
    'clients-lead-attention-card',
    'data-right-rail-list="lead-attention"',
    'Leady do spięcia',
    'Brak klienta albo sprawy przy aktywnym temacie',
  ];
  for (const token of forbidden) {
    if (source.includes(token)) fail(`Stage 1 cleanup regressed. Forbidden token still exists in Clients.tsx: ${token}`);
  }
}

const before = read(clientsPath);
const backupDir = path.join(repo, 'docs', 'audits', `clients-top-value-stage2-backup-${timestamp()}`);
fs.mkdirSync(backupDir, { recursive: true });
write(path.join(backupDir, 'Clients.tsx.before'), before);

let next = before;
next = ensureTopValueImport(next);
next = ensureFormatClientMoney(next);
next = insertOrReplaceMostValuableClients(next);
next = insertTopValueCard(next);
assertFinalSource(next);

if (next !== before) write(clientsPath, next);

const testContent = `const fs = require('fs');\nconst path = require('path');\nconst test = require('node:test');\nconst assert = require('node:assert/strict');\n\nconst repo = path.resolve(__dirname, '..');\nconst clientsPath = path.join(repo, 'src', 'pages', 'Clients.tsx');\n\nfunction read(file) {\n  return fs.readFileSync(file, 'utf8');\n}\n\ntest('clients right rail renders top 5 valuable clients instead of lead attention rail', () => {\n  const source = read(clientsPath);\n\n  assert.match(source, /import\\s*\\{[^}]*TopValueRecordsCard[^}]*\\}\\s*from\\s*['\"]\\.\\.\\/components\\/operator-rail['\"]/s);\n  assert.match(source, /const\\s+mostValuableClients\\s*=\\s*useMemo/);\n  assert.match(source, /clientValueByClientId\\.get\\(client\\.id\\)\\s*\\|\\|\\s*0/);\n  assert.match(source, /\\.filter\\(\\(entry\\)\\s*=>\\s*entry\\.value\\s*>\\s*0\\)/);\n  assert.match(source, /\\.sort\\(\\(a, b\\)\\s*=>\\s*b\\.value\\s*-\\s*a\\.value\\)/);\n  assert.match(source, /\\.slice\\(0,\\s*5\\)/);\n\n  assert.includes(source, 'title="Najcenniejsi klienci"');\n  assert.includes(source, 'description="5 klientów z największą wartością."');\n  assert.includes(source, 'dataTestId="clients-top-value-records-card"');\n  assert.includes(source, 'items={mostValuableClients.map(({ client, value }) => ({');\n  assert.includes(source, 'href: \\`/clients/\\${client.id}\\`');\n  assert.includes(source, 'valueLabel: formatClientMoney(value)');\n\n  assert.doesNotMatch(source, /data-clients-lead-attention-rail/);\n  assert.doesNotMatch(source, /clients-lead-attention-card/);\n  assert.doesNotMatch(source, /data-right-rail-list="lead-attention"/);\n  assert.doesNotMatch(source, /Leady do spięcia/);\n  assert.doesNotMatch(source, /Brak klienta albo sprawy przy aktywnym temacie/);\n});\n`;
write(testPath, testContent);

const report = [
  '# CloseFlow — ETAP 2 — /clients Najcenniejsi klienci',
  '',
  '## Zakres',
  '- Dodano helper `mostValuableClients` oparty o istniejące `clientValueByClientId`.',
  '- Dodano prawy kafel `TopValueRecordsCard` z tytułem `Najcenniejsi klienci`.',
  '- Kafel pokazuje maksymalnie 5 niearchiwalnych klientów z wartością większą od 0.',
  '- Nie zmieniono sposobu liczenia wartości klienta w aplikacji.',
  '',
  '## Pliki dotknięte przez etap',
  '- `src/pages/Clients.tsx`',
  '- `tests/stage81-clients-top-value-records-card.test.cjs`',
  '- `tools/patch-clients-top-value-stage2.cjs`',
  '',
  '## Test automatyczny',
  '- `node --test tests/stage81-clients-top-value-records-card.test.cjs`',
  '- `npm run verify:closeflow:quiet` jeśli skrypt istnieje w `package.json`.',
  '',
  '## Test ręczny',
  '- Wejść na `/clients`.',
  '- Prawy rail ma pokazać: `Filtry proste` oraz `Najcenniejsi klienci`.',
  '- Nie ma wrócić kafel `Leady do spięcia`.',
].join('\n');
write(reportPath, report + '\n');

console.log('OK: Stage 2 /clients top value card patch applied.');
