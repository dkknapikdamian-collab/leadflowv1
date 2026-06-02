const fs = require('fs');
const path = require('path');

const root = process.cwd();
const client = fs.readFileSync(path.join(root, 'src/pages/ClientDetail.tsx'), 'utf8');
const adapters = fs.readFileSync(path.join(root, 'src/styles/page-adapters/page-adapters.css'), 'utf8');

const requiredClientTokens = [
  'insertActivityToSupabase',
  'const [clientNoteDraft, setClientNoteDraft]',
  'const handleAddClientNote = useCallback',
  'data-stage216m-r15-r3-client-notes-source',
  'data-client-note-text-composer',
  "eventType: 'client_note_added'",
  'setClientNoteDraft((current) => joinTranscript(current, finalTranscript))',
  'Dodaj notatkę',
];
for (const token of requiredClientTokens) {
  if (!client.includes(token)) throw new Error(`ClientDetail missing token: ${token}`);
}

const forbiddenClientTokens = [
  '<Label>Notatka</Label>',
  'setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }))',
  'setContactEditing(true);\n      toast.success(\'Dyktowanie notatki włączone\')',
];
for (const token of forbiddenClientTokens) {
  if (client.includes(token)) throw new Error(`ClientDetail still contains forbidden token: ${token}`);
}

if (!adapters.includes("@import '../stage216m-r15-r3-client-notes-source-truth-nonfragile.css';")) {
  throw new Error('page-adapters missing R15-R3 import');
}

console.log('PASS stage216m-r15-r3-client-notes-source-truth-nonfragile-contract');
