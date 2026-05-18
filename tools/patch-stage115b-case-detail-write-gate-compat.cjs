const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const caseDetailPath = path.join(root, 'src', 'pages', 'CaseDetail.tsx');
let text = fs.readFileSync(caseDetailPath, 'utf8');

const expectedImport = "import { useWorkspace } from '../hooks/useWorkspace';";
if (!text.includes(expectedImport)) {
  throw new Error('Stage115B v2 requires CaseDetail to import useWorkspace from ../hooks/useWorkspace. Run Stage115 first.');
}

if (/import\s+\{[^}]*\buseWorkspace\b[^}]*\}\s+from\s+['"]react['"]/.test(text)) {
  throw new Error('Invalid React import still contains useWorkspace. Run Stage115 first.');
}

const desiredBlock = `  const handleAddTask = async () => {
    if (!guardCaseDetailWriteAccess('dodać zadania')) return;
    openCaseContextAction('task');
  };

  const handleAddEvent = async () => {
    if (!guardCaseDetailWriteAccess('dodać wydarzenia')) return;
    openCaseContextAction('event');
  };

  const handleAddNote = async () => {
    if (!guardCaseDetailWriteAccess('dodać notatki')) return;
    openCaseContextAction('note');
  };

  const openCaseTaskDialog = () => {
    void handleAddTask();
  };

  const openCaseEventDialog = () => {
    void handleAddEvent();
  };

  const openCaseNoteDialog = () => {
    void handleAddNote();
  };
`;

const currentBlockPattern = /  const openCaseTaskDialog = \(\) => \{\r?\n    if \(!guardCaseDetailWriteAccess\('dodać zadania'\)\) return;\r?\n    openCaseContextAction\('task'\);\r?\n  \};\r?\n\r?\n  const openCaseEventDialog = \(\) => \{\r?\n    if \(!guardCaseDetailWriteAccess\('dodać wydarzenia'\)\) return;\r?\n    openCaseContextAction\('event'\);\r?\n  \};\r?\n\r?\n  const openCaseNoteDialog = \(\) => \{\r?\n    if \(!guardCaseDetailWriteAccess\('dodać notatki'\)\) return;\r?\n    openCaseContextAction\('note'\);\r?\n  \};\r?\n/;

let changed = false;
if (currentBlockPattern.test(text)) {
  text = text.replace(currentBlockPattern, desiredBlock);
  changed = true;
} else if (!/const\s+handleAddTask\s*=\s*async[\s\S]*?guardCaseDetailWriteAccess/.test(text)) {
  const anchor = "  const openCasePaymentDialog = (type: 'deposit' | 'partial') => {";
  const index = text.indexOf(anchor);
  if (index === -1) {
    throw new Error('Could not find openCasePaymentDialog anchor for Stage115B v2 patch.');
  }
  text = text.slice(0, index) + desiredBlock + '\n' + text.slice(index);
  changed = true;
}

const requiredHandlers = ['handleAddTask', 'handleAddEvent', 'handleAddNote'];
for (const functionName of requiredHandlers) {
  const pattern = new RegExp('const\\s+' + functionName + '\\s*=\\s*async[\\s\\S]*?guardCaseDetailWriteAccess');
  if (!pattern.test(text)) {
    throw new Error(functionName + ' does not satisfy write gate compatibility contract.');
  }
}

if (!/const\s+openCaseTaskDialog\s*=\s*\(\)\s*=>\s*\{\s*void\s+handleAddTask\(\)/s.test(text)) {
  throw new Error('openCaseTaskDialog does not delegate to handleAddTask.');
}
if (!/const\s+openCaseEventDialog\s*=\s*\(\)\s*=>\s*\{\s*void\s+handleAddEvent\(\)/s.test(text)) {
  throw new Error('openCaseEventDialog does not delegate to handleAddEvent.');
}
if (!/const\s+openCaseNoteDialog\s*=\s*\(\)\s*=>\s*\{\s*void\s+handleAddNote\(\)/s.test(text)) {
  throw new Error('openCaseNoteDialog does not delegate to handleAddNote.');
}

if (changed) {
  fs.writeFileSync(caseDetailPath, text, 'utf8');
  console.log('Stage115B v2 patched CaseDetail write-gate handler compatibility.');
} else {
  console.log('Stage115B v2 already present; no source patch needed.');
}
