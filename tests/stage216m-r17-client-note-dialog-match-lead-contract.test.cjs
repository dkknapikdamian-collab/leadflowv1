const fs = require('fs');
const path = require('path');

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');

assert(client.includes("import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';"), 'ClientDetail must import shared Dialog primitives.');
assert(client.includes('modalFooterClass'), 'ClientDetail must import/use modalFooterClass like LeadDetail.');
assert(!client.includes("import { createPortal } from 'react-dom';"), 'ClientDetail note dialog must not use createPortal custom shell.');
assert(!client.includes('createPortal('), 'ClientDetail note dialog must not call createPortal.');
assert(!client.includes('client-note-modal-backdrop'), 'ClientDetail custom note backdrop must be removed.');
assert(!client.includes('client-note-modal-card'), 'ClientDetail custom note modal card must be removed.');
assert(client.includes('data-stage216m-r17-client-note-dialog-source="lead-detail"'), 'R17 client note dialog marker missing.');
assert(client.includes('className="lead-detail-add-note-dialog-form client-detail-add-note-dialog-form"'), 'Client note dialog must reuse LeadDetail note form class.');
assert(client.includes('className="lead-detail-note-input client-detail-note-input"'), 'Client note dialog textarea must reuse LeadDetail note input class.');
assert(client.includes('Zapisz notatkę po rozmowie, telefonie, spotkaniu albo ustaleniach z klientem.'), 'Client note dialog copy must match LeadDetail style with client context.');
assert(client.includes("{clientNoteListening ? 'Zatrzymaj dyktowanie' : 'Dyktuj'}"), 'Client modal speech button copy must match LeadDetail modal.');
assert(client.includes('data-stage216m-r17-client-note-dictate-lead-pattern="true"'), 'Header dictate button must use LeadDetail pattern marker.');
assert(client.includes('window.setTimeout(() => handleToggleClientNoteSpeech(), 0);'), 'Header dictate must open dialog before starting speech, matching LeadDetail pattern.');
assert(client.includes("eventType: 'client_note_added'"), 'Client notes must persist as client_note_added.');
assert(client.includes('clientId,'), 'Client note persistence/context must include clientId.');
assert(lead.includes('data-stage216j3f-add-note-dialog="true"'), 'LeadDetail reference note dialog marker missing.');
assert(lead.includes('className="lead-detail-add-note-dialog-form"'), 'LeadDetail reference note dialog form class missing.');
assert(lead.includes('className="lead-detail-note-input"'), 'LeadDetail reference note input class missing.');
assert(adapters.includes("stage216m-r17-client-note-dialog-match-lead.css"), 'R17 CSS import missing.');

// Audit quick contextual actions: actions opened from lead/client detail must carry the record context.
assert(client.includes("recordType: 'client'") && client.includes('recordId: clientId') && client.includes('clientId,'), 'Client context quick actions must carry client context.');
assert(lead.includes("recordType: 'lead'") && lead.includes('recordId: leadId') && lead.includes('leadId,'), 'Lead context quick actions must carry lead context.');

// Guard all CSS imports in page-adapters resolve from src/styles/page-adapters/page-adapters.css.
for (const match of adapters.matchAll(/@import\s+['"]([^'"]+)['"];?/g)) {
  const target = path.resolve('src/styles/page-adapters', match[1]);
  assert(fs.existsSync(target), `Missing CSS import target: ${match[1]}`);
}

console.log('OK Stage216M-R17 client note dialog matches LeadDetail contract');
