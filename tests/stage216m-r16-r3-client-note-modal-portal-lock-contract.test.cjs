const fs = require('fs');

const file = 'src/pages/ClientDetail.tsx';
const text = fs.readFileSync(file, 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

assert(text.includes("import { createPortal } from 'react-dom';"), 'createPortal import is missing.');
assert(text.includes('openClientNoteModalStage216M_R16_R3'), 'Shared modal opener is missing.');
assert(text.includes('setContactEditing(false);\n    setClientNoteModalOpen(true);'), 'Dictation must close data edit and open modal.');
assert(text.includes("void 'data-stage216m-r16-r3-speech-opens-modal';"), 'R16-R3 speech marker is missing.');
assert(text.includes('data-stage216m-r16-r3-client-note-modal-portal="true"'), 'Portal modal marker is missing.');
assert(text.includes('document.body'), 'Client note modal must be portaled to document.body.');
assert(text.includes('(clientNoteModalOpen || clientNoteListening)'), 'Modal must render while dictation is active.');
assert(!text.includes("useState({ name: '', company: '', email: '', phone: '', notes: '' })"), 'Client data form still contains notes state.');
assert(!text.includes('<Label>Notatka</Label>'), 'Client data edit form still renders Notatka label.');
assert(text.includes("eventType: 'client_note_added'"), 'Client notes must still persist as client_note_added.');
assert(adapters.includes("stage216m-r16-r3-client-note-modal-portal-lock.css"), 'R16-R3 CSS import is missing.');

console.log('OK Stage216M-R16-R3 client note modal portal hard lock contract');
