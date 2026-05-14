const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendarPath = path.join(repoRoot, 'src/pages/Calendar.tsx');
const source = fs.readFileSync(calendarPath, 'utf8');

const requiredNames = [
  'handleSelectedDayEditEntryV9',
  'handleSelectedDayShiftEntryV9',
  'handleSelectedDayShiftEntryHoursV9',
  'handleSelectedDayCompleteEntryV9',
  'handleSelectedDayDeleteEntryV9',
  'handleEditEntry',
  'handleShiftEntry',
  'handleShiftEntryHours',
  'handleCompleteEntry',
  'handleDeleteEntry'
];

for (const name of requiredNames) {
  assert.ok(source.includes(name), `Missing handler/alias name: ${name}`);
}

const requiredProps = [
  'onEdit={handleEditEntry}',
  'onShift={handleShiftEntry}',
  'onShiftHours={handleShiftEntryHours}',
  'onComplete={handleCompleteEntry}',
  'onDelete={handleDeleteEntry}'
];

for (const prop of requiredProps) {
  assert.ok(source.includes(prop), `Missing selected-day prop wiring: ${prop}`);
}

const requiredUi = [
  'Edytuj',
  '+1D',
  '+1W',
  '+1H',
  'Zrobione',
  'Usuń',
  'Otwórz lead',
  'Otwórz sprawę',
  'data-cf-calendar-selected-day-new-tile-v9'
];

for (const text of requiredUi) {
  assert.ok(source.includes(text), `Missing selected-day UI/contract text: ${text}`);
}

assert.ok(source.includes("isCompletedEntry ? 'Przywróć' : 'Zrobione'"), 'Done/restore label contract must remain stable');

// Check JSX-bound handler references, not prop names such as onEdit inside component props.
const boundHandlerNames = Array.from(source.matchAll(/\bon[A-Z][A-Za-z0-9]*=\{([A-Za-z_$][A-Za-z0-9_$]*)\}/g)).map((match) => match[1]);
const functionLikeDeclarations = new Set();
for (const match of source.matchAll(/\b(?:const|function)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g)) {
  functionLikeDeclarations.add(match[1]);
}

const allowedExternal = new Set([
  'setCurrentMonth',
  'setSelectedDate',
  'setCalendarScale',
  'setCalendarView',
  'setIsNewEventOpen',
  'setIsNewTaskOpen',
  'setSearchParams'
]);

for (const name of boundHandlerNames) {
  if (name.startsWith('handleSelectedDay') || name.startsWith('handleEdit') || name.startsWith('handleShift') || name.startsWith('handleComplete') || name.startsWith('handleDelete')) {
    assert.ok(functionLikeDeclarations.has(name) || allowedExternal.has(name), `JSX references undefined selected-day handler: ${name}`);
  }
}

console.log('OK: selected-day handlers runtime fix v10 finalize guard passed');
