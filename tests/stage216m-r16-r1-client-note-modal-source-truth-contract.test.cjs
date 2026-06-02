const fs = require('fs');

const file = 'src/pages/ClientDetail.tsx';
const text = fs.readFileSync(file, 'utf8');

function mustInclude(token) {
  if (!text.includes(token)) {
    throw new Error(`Missing token: ${token}`);
  }
}

function mustNotInclude(token) {
  if (text.includes(token)) {
    throw new Error(`Forbidden token still present: ${token}`);
  }
}

mustInclude('STAGE216M_R16_R1_CLIENT_NOTE_MODAL_SOURCE_TRUTH');
mustInclude('clientNoteModalOpen');
mustInclude('setClientNoteModalOpen(true);');
mustInclude('setClientNoteModalOpen(false);');
mustInclude('data-stage216m-r16-r1-client-note-actions="true"');
mustInclude('data-stage216m-r16-r1-client-note-modal="true"');
mustInclude('Dodaj notatkę');
mustInclude('Zapisz notatkę');
mustInclude('client_note_added');
mustInclude('insertActivityToSupabase');
mustNotInclude('data-stage216m-r15-r5-client-note-composer="true"');
mustNotInclude('<Label>Notatka</Label>');

const toggleMatch = text.match(/const handleToggleClientNoteSpeech = \(\) => \{[\s\S]*?\n  \};/);
if (!toggleMatch) throw new Error('Missing handleToggleClientNoteSpeech block');
const toggleBlock = toggleMatch[0];
if (toggleBlock.includes('setContactEditing(true)')) throw new Error('Dictation still opens contact editing');
if (!toggleBlock.includes('setClientNoteModalOpen(true);')) throw new Error('Dictation does not open client note modal');

console.log('OK Stage216M-R16-R1 client note modal source truth contract');
