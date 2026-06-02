const fs = require('fs');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');
const css = fs.readFileSync('src/styles/stage216m-r15-r1-client-notes-source-truth-repair.css', 'utf8');

function mustContain(source, token, label) {
  if (!source.includes(token)) throw new Error(`${label} missing token: ${token}`);
}
function mustNotContain(source, token, label) {
  if (source.includes(token)) throw new Error(`${label} still contains forbidden token: ${token}`);
}

mustContain(client, 'data-stage216m-r15-r1-client-notes-source="true"', 'ClientDetail');
mustContain(client, 'data-stage216m-r15-r1-client-note-composer="true"', 'ClientDetail');
mustContain(client, 'const [clientNoteDraft, setClientNoteDraft] = useState', 'ClientDetail');
mustContain(client, 'const handleSaveClientNote = useCallback', 'ClientDetail');
mustContain(client, 'insertActivityToSupabase', 'ClientDetail');
mustContain(client, "eventType: 'client_note_added'", 'ClientDetail');
mustContain(client, 'onClick={handleSaveClientNote}', 'ClientDetail');
mustContain(client, 'setClientNoteDraft((current) => joinTranscript(current, finalTranscript))', 'ClientDetail');

mustNotContain(client, 'setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }))', 'ClientDetail');
mustNotContain(client, '<Label>Notatka</Label>', 'ClientDetail');
mustNotContain(client, 'updateClientInSupabase({ id: clientId, notes: form.notes.trim() })', 'ClientDetail');

mustContain(adapters, "@import '../stage216m-r15-r1-client-notes-source-truth-repair.css';", 'page-adapters.css');
mustContain(css, 'STAGE216M_R15_R1_CLIENT_NOTES_SOURCE_TRUTH_REPAIR', 'R15-R1 css');

console.log('PASS stage216m-r15-r1-client-notes-source-truth-repair-contract');
