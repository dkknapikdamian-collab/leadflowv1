const fs = require('fs');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');

function mustInclude(source, token) {
  if (!source.includes(token)) throw new Error(`Missing token: ${token}`);
}
function mustNotInclude(source, token) {
  if (source.includes(token)) throw new Error(`Forbidden token still present: ${token}`);
}

mustInclude(client, 'insertActivityToSupabase');
mustInclude(client, 'clientNoteDraft');
mustInclude(client, 'clientNoteSaving');
mustInclude(client, 'handleAddClientNote');
mustInclude(client, 'client_note_added');
mustInclude(client, 'data-stage216m-r15-r5-client-notes-source');
mustInclude(client, 'data-stage216m-r15-r5-client-note-composer');
mustInclude(client, 'Dodaj notatkę');
mustInclude(client, 'setClientNoteDraft((current) => joinTranscript(current, finalTranscript))');
mustInclude(client, "await insertActivityToSupabase({");

mustNotInclude(client, 'setContactEditing(true);\n      toast.success(\'Dyktowanie notatki włączone\')');
mustNotInclude(client, 'setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }))');
mustNotInclude(client, 'await updateClientInSupabase({ id: clientId, notes: form.notes.trim() })');
mustNotInclude(client, '<Label>Notatka</Label>');

mustInclude(adapters, "@import '../stage216m-r15-r5-client-notes-source-truth-final-repair.css';");
console.log('OK Stage216M-R15-R5 client notes source truth final repair contract');
