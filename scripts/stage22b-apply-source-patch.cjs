const fs = require('fs');
const path = require('path');
const root = process.argv[2] || process.cwd();
function file(rel){ return path.join(root, rel); }
function read(rel){ return fs.readFileSync(file(rel), 'utf8').replace(/^\uFEFF/, ''); }
function write(rel, text){ fs.writeFileSync(file(rel), text, 'utf8'); }
function ensureContains(rel, text, needle, message){ if(!text.includes(needle)) throw new Error(message || `${rel} missing ${needle}`); }

function patchClientDetail(){
  const rel = 'src/pages/ClientDetail.tsx';
  let text = read(rel);
  if (!text.includes('deleteActivityFromSupabase')) {
    text = text.replace(
      'fetchActivitiesFromSupabase,',
      'fetchActivitiesFromSupabase,\n  deleteActivityFromSupabase,'
    );
  }
  ensureContains(rel, text, 'deleteActivityFromSupabase', 'ClientDetail import patch failed');
  write(rel, text);
}

function patchEventCreateDialog(){
  const rel = 'src/components/EventCreateDialog.tsx';
  let text = read(rel);
  if (!text.includes('CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR')) {
    text = text.replace(
      "const STAGE85_EVENT_CREATE_DIALOG_SHARED = 'Shared event create dialog for global and detail context actions';",
      "const STAGE85_EVENT_CREATE_DIALOG_SHARED = 'Shared event create dialog for global and detail context actions';\nconst CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR = 'event create dialog readable save footer repair';\nvoid CLOSEFLOW_CLIENT_EVENT_MODAL_RUNTIME_REPAIR;"
    );
  }
  text = text.replace(
    '<DialogContent className="max-w-2xl" data-event-create-dialog-stage85="true">',
    '<DialogContent className="max-w-2xl event-form-vnext-content closeflow-event-modal-readable" data-event-create-dialog-stage85="true" data-event-create-dialog-stage22b="true">'
  );
  text = text.replace(
    '<DialogHeader>',
    '<DialogHeader className="event-form-vnext-header">'
  );
  text = text.replace(
    '<form onSubmit={handleSubmit} className="space-y-4">',
    '<form onSubmit={handleSubmit} className="event-form-vnext space-y-4">'
  );
  text = text.replace(
    '<DialogFooter>',
    '<DialogFooter className="event-form-footer" data-event-modal-save-footer="true">'
  );
  ensureContains(rel, text, 'data-event-create-dialog-stage22b="true"', 'EventCreateDialog missing stage22b attr');
  ensureContains(rel, text, 'event-form-footer', 'EventCreateDialog missing event-form-footer');
  write(rel, text);
}

function patchIndexCss(){
  const rel = 'src/index.css';
  let text = read(rel);
  const line = "@import './styles/closeflow-client-event-modal-runtime-repair.css';";
  if (!text.includes(line)) {
    text = text.trimEnd() + '\n' + line + '\n';
  }
  write(rel, text);
}

patchClientDetail();
patchEventCreateDialog();
patchIndexCss();
console.log('STAGE22B_SOURCE_PATCH_OK');
