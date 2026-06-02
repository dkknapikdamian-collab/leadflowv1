const fs = require('fs');

const file = 'src/pages/ClientDetail.tsx';
const text = fs.readFileSync(file, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

assert(text.includes('clientNoteModalOpen'), 'Client note modal state is missing.');
assert(text.includes('data-stage216m-r16-r2-client-note-modal="true"'), 'Client note modal marker is missing.');
assert(text.includes('data-stage216m-r16-r2-client-note-add="true"'), 'Add note button marker is missing.');
assert(text.includes('data-stage216m-r16-r2-client-note-dictate="true"'), 'Dictate note button marker is missing.');
assert(text.includes('setClientNoteModalOpen(true);'), 'Dictation/add flow must open the modal.');
assert(text.includes("eventType: 'client_note_added'"), 'Client notes must persist as client_note_added activity.');
assert(text.includes('Zapisz notatkę'), 'Modal save action copy is missing.');
assert(!text.includes('className="client-detail-note-composer"'), 'Inline client note composer must be removed.');
assert(!text.includes('placeholder="Wpisz roboczą notatkę klienta..."'), 'Inline composer placeholder must be removed.');

const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');
assert(adapters.includes("stage216m-r16-r2-client-note-modal-source-truth.css"), 'R16-R2 CSS import is missing.');

console.log('OK Stage216M-R16-R2 client note modal source truth contract');
