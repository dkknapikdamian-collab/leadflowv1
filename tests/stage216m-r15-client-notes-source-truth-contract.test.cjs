const fs = require('fs');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const adapter = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');
const css = fs.readFileSync('src/styles/stage216m-r15-client-notes-source-truth.css', 'utf8');

const required = [
  'data-stage216m-r15-client-notes-source',
  'data-stage216m-r15-client-note-compose',
  'handleSaveClientCenterNote',
  'insertActivityToSupabase',
  "eventType: 'client_note_added'",
  'setClientNoteDraft((current) => joinTranscript(current, finalTranscript))',
];
for (const token of required) {
  if (!client.includes(token)) throw new Error(`ClientDetail missing token: ${token}`);
}
if (client.includes('<Label>Notatka</Label>')) throw new Error('Client data card still has duplicated Notatka edit field');
if (client.includes('setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }))')) throw new Error('Voice dictation still writes into client data notes');
if (!adapter.includes("@import '../stage216m-r15-client-notes-source-truth.css';")) throw new Error('page-adapters missing R15 import');
if (!css.includes('STAGE216M_R15_CLIENT_NOTES_SOURCE_TRUTH')) throw new Error('R15 CSS marker missing');
console.log('PASS stage216m-r15-client-notes-source-truth-contract');
