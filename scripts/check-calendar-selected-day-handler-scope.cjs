#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const calendarPath = path.join(repo, 'src', 'pages', 'Calendar.tsx');
const packagePath = path.join(repo, 'package.json');

function fail(message) {
  console.error('ERROR: ' + message);
  process.exit(1);
}

function ok(message) {
  console.log('OK ' + message);
}

if (!fs.existsSync(calendarPath)) {
  fail('Brak src/pages/Calendar.tsx');
}

const source = fs.readFileSync(calendarPath, 'utf8');

const requiredAnchors = [
  'CalendarSelectedDayTileV9',
  'ScheduleEntryCard',
  'buildEditDraft',
  'const [editEntry, setEditEntry]',
  'const [editDraft, setEditDraft]',
];

for (const anchor of requiredAnchors) {
  if (!source.includes(anchor)) {
    fail('Calendar.tsx nie zawiera wymaganego elementu: ' + anchor);
  }
}

const jsxHandlerRefs = [...source.matchAll(/\b(onEdit|onShift|onShiftHours|onComplete|onDelete)=\{([A-Za-z_$][\w$]*)\}/g)]
  .map((match) => ({ prop: match[1], name: match[2], index: match.index || 0 }))
  .filter((item) => /^handle[A-Z]/.test(item.name));

const uniqueNames = [...new Set(jsxHandlerRefs.map((item) => item.name))];

for (const name of uniqueNames) {
  const declaration = new RegExp('(?:const|function)\\s+' + name + '\\b');
  if (!declaration.test(source)) {
    const locations = jsxHandlerRefs
      .filter((item) => item.name === name)
      .map((item) => item.prop + '={' + name + '}@' + item.index)
      .join(', ');
    fail('Calendar.tsx przekazuje ' + name + ', ale handler nie jest zdefiniowany. Miejsca: ' + locations);
  }
}

if (source.includes('onEdit={handleEditEntry}') && !/(?:const|function)\s+handleEditEntry\b/.test(source)) {
  fail('onEdit={handleEditEntry} istnieje, ale brakuje const/function handleEditEntry. To powoduje runtime ReferenceError.');
}

if (!fs.existsSync(packagePath)) {
  fail('Brak package.json');
}

const pkgText = fs.readFileSync(packagePath, 'utf8');
if (!/"build"\s*:\s*"[^"]*vite build[^"]*"/.test(pkgText)) {
  fail('package.json nie ma rozpoznawalnego skryptu build z vite build. Nie dokładam fałszywego sukcesu.');
}
if (!pkgText.includes('check:calendar-selected-day-handler-scope')) {
  fail('package.json nie ma check:calendar-selected-day-handler-scope. Guard nie jest podpięty.');
}
if (!pkgText.includes('prebuild') || !pkgText.includes('check-calendar-selected-day-handler-scope.cjs')) {
  fail('prebuild nie uruchamia check-calendar-selected-day-handler-scope.cjs. Vercel/build może przepuścić ten sam błąd.');
}

ok('Calendar handler scope guard passed');
