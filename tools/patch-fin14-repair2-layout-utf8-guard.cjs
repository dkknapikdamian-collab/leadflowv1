const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/components/Layout.tsx');

function fail(message) {
  throw new Error(message);
}

if (!fs.existsSync(file)) {
  fail('Brak src/components/Layout.tsx');
}

let source = fs.readFileSync(file, 'utf8');
const before = source;

const replacements = [
  ['Inbox szkicĂłw', 'Inbox szkiców'],
  ['DziĹ›', 'Dziś'],
  ['Czas i obowiÄ…zki', 'Czas i obowiązki'],
  ['AktywnoĹ›Ä‡', 'Aktywność'],
  ['UĹĽytkownik', 'Użytkownik'],
  ['zostaĹ‚', 'został'],
  ['przepiÄ™ty', 'przepięty'],
  ['AI, auth ani billing/access', 'AI, auth ani billing/access'],
];

for (const [bad, good] of replacements) {
  source = source.split(bad).join(good);
}

const expected = "...(canUseAiDraftsByPlan ? [{ icon: CheckCircle2, label: 'Inbox szkiców', path: '/ai-drafts' }] : [])";
if (!source.includes(expected)) {
  const hasCorrectLabel = source.includes("label: 'Inbox szkiców', path: '/ai-drafts'");
  const hasOldMojibake = source.includes("label: 'Inbox szkicĂłw', path: '/ai-drafts'");
  if (hasOldMojibake) {
    fail('Layout nadal ma mojibake Inbox szkicĂłw');
  }
  if (!hasCorrectLabel) {
    fail('Nie znaleziono poprawnej pozycji nav Inbox szkiców w Layout.tsx');
  }
}

if (!source.includes("const FIN14_REPAIR2_LAYOUT_UTF8_GUARD = 'FIN-14_REPAIR2_LAYOUT_UTF8_GUARD_Inbox szkiców';")) {
  source = source.replace(
    "const CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR = 'tasks cases visual mobile repair scoped to /cases';",
    "const CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR = 'tasks cases visual mobile repair scoped to /cases';\nconst FIN14_REPAIR2_LAYOUT_UTF8_GUARD = 'FIN-14_REPAIR2_LAYOUT_UTF8_GUARD_Inbox szkiców';\nvoid FIN14_REPAIR2_LAYOUT_UTF8_GUARD;"
  );
}

fs.writeFileSync(file, source, 'utf8');

if (source === before) {
  console.log('[FIN-14 REPAIR2] Layout.tsx już był zgodny z guardem UTF-8');
} else {
  console.log('[FIN-14 REPAIR2] Layout.tsx: naprawiono mojibake w pozycji Inbox szkiców i dodano marker guard');
}
