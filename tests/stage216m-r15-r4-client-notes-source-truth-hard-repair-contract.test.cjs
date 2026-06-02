const fs = require('fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');

function mustContain(token) {
  if (!client.includes(token)) throw new Error(`ClientDetail missing token: ${token}`);
}

function mustNotContain(token) {
  if (client.includes(token)) throw new Error(`ClientDetail still contains forbidden token: ${token}`);
}

mustContain('insertActivityToSupabase');
mustContain("eventType: 'client_note_added'");
mustContain('data-stage216m-r15-r4-client-notes-source');
mustContain('data-client-note-composer="true"');
mustContain('clientNoteDraft');
mustContain('handleAddClientNote');
mustContain('Dodaj notatkę');
mustContain('Dyktuj notatkę');

const speechStart = client.indexOf('const handleToggleClientNoteSpeech');
const speechEnd = client.indexOf('useEffect(() => () => stopClientNoteSpeech()', speechStart);
if (speechStart < 0 || speechEnd < 0) throw new Error('Could not isolate client speech block');
const speechBlock = client.slice(speechStart, speechEnd);
if (speechBlock.includes('setContactEditing(true)')) throw new Error('Speech still opens data edit mode');
if (speechBlock.includes('setForm((current) => ({ ...current, notes:')) throw new Error('Speech still writes to form.notes');

if (client.includes('<Label>Notatka</Label>')) throw new Error('Client data edit form still renders Notatka field');

if (!adapters.includes("@import '../stage216m-r15-r4-client-notes-source-truth-hard-repair.css';")) {
  throw new Error('page-adapters missing R15-R4 import');
}

console.log('OK Stage216M-R15-R4 client notes source truth hard repair guard');
