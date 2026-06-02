const fs = require('fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/stage216m-r15-r2-client-notes-source-truth-actual-repair.css', 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');

function mustInclude(source, token, label) {
  if (!source.includes(token)) throw new Error(`${label} missing token: ${token}`);
}
function mustNotInclude(source, token, label) {
  if (source.includes(token)) throw new Error(`${label} forbidden token still present: ${token}`);
}

mustInclude(client, 'STAGE216M_R15_R2_CLIENT_NOTES_SOURCE_TRUTH_ACTUAL_REPAIR', 'ClientDetail');
mustInclude(client, 'insertActivityToSupabase', 'ClientDetail');
mustInclude(client, 'const [clientNoteDraft, setClientNoteDraft]', 'ClientDetail');
mustInclude(client, 'const handleAddClientNote = useCallback(async () =>', 'ClientDetail');
mustInclude(client, 'data-stage216m-r15-r2-client-notes-source', 'ClientDetail');
mustInclude(client, 'data-stage216m-r15-r2-client-note-composer', 'ClientDetail');
mustInclude(client, "eventType: 'client_note_added'", 'ClientDetail');
mustInclude(client, 'setClientNoteDraft((current) => joinTranscript(current, finalTranscript));', 'ClientDetail');
mustInclude(client, 'Brak zapisanych notatek dla klienta.', 'ClientDetail');

mustNotInclude(client, '<Label>Notatka</Label>', 'ClientDetail');
mustNotInclude(client, 'setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }));', 'ClientDetail');
mustNotInclude(client, 'await updateClientInSupabase({ id: clientId, notes: form.notes.trim() });', 'ClientDetail');
mustNotInclude(client, "setContactEditing(true);\n      toast.success('Dyktowanie notatki włączone');", 'ClientDetail');

mustInclude(css, 'STAGE216M_R15_R2_CLIENT_NOTES_SOURCE_TRUTH_ACTUAL_REPAIR', 'CSS');
mustInclude(css, '[data-stage216m-r15-r2-client-note-composer="true"]', 'CSS');
mustInclude(adapters, "stage216m-r15-r2-client-notes-source-truth-actual-repair.css", 'page-adapters');

console.log('PASS stage216m-r15-r2-client-notes-source-truth-actual-repair-contract');