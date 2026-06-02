const fs = require('fs');
const page = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL Stage216M-R16:', message);
    process.exit(1);
  }
}

assert(page.includes("../components/ui/dialog"), 'ClientDetail must import shared Dialog primitives');
assert(page.includes('isClientNoteDialogOpen'), 'ClientDetail must keep note modal open state');
assert(page.includes('data-stage216m-r16-client-note-header-actions="true"'), 'Client notes header must have R16 action row');
assert(page.includes('Dodaj notatkę'), 'Client notes must expose Dodaj notatkę action');
assert(page.includes('data-stage216m-r16-client-note-modal-source="true"'), 'Client notes must render modal source truth marker');
assert(page.includes('DialogTitle>Dodaj notatkę</DialogTitle>'), 'Modal title must match lead note modal copy');
assert(page.includes('setIsClientNoteDialogOpen(true);'), 'Dictation must open the same note modal');
assert(page.includes('setClientNoteDraft((current) => joinTranscript(current, finalTranscript))'), 'Dictation must write to client note draft');
assert(!page.includes('setForm((current) => ({ ...current, notes: joinTranscript(current.notes, finalTranscript) }))'), 'Dictation must not write to client data notes');
assert(!page.includes('setContactEditing(true);'), 'Dictation must not open client data edit panel');
assert(!page.includes('data-stage216m-r15-r5-client-note-composer="true"'), 'Inline composer must be removed from the page');
assert(!page.includes('<Label>Notatka</Label>'), 'Client data edit form must not contain Notatka field');
assert(adapters.includes("@import '../stage216m-r16-client-note-modal-source-truth.css';"), 'R16 CSS must be imported');
console.log('OK Stage216M-R16 client note modal source truth contract');
