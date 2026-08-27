const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-014 renders the real Lead Detail task drawer from the Forteca reference', () => {
  const contract = read('_project/contracts/forteca-clean/FRT-014_LEAD_TASK.md');
  const dialog = read('src/components/TaskCreateDialog.tsx');
  const picker = read('src/components/topic-contact-picker.tsx');
  const fallback = read('src/lib/supabase-fallback.ts');
  const dialogCss = read('src/styles/owners/closeflow-dialogs.css');

  assert.match(contract, /STAGE_ID: FRT-014/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(contract, /TARGET_STATE: Lead Detail — add task modal/);
  assert.match(dialog, /data-forteca-frt-014-lead-task="true"/);
  assert.match(dialog, /data-forteca-frt-014-form="true"/);
  assert.match(dialog, /DialogTitle>Dodaj zadanie/);
  assert.match(dialog, /Tytuł zadania <span aria-hidden="true">\*<\/span>/);
  assert.match(dialog, /Powiązane z leadem/);
  assert.match(dialog, /Wybierz typ zadania/);
  assert.match(dialog, /type="date"/);
  assert.match(dialog, /type="time"/);
  assert.match(dialog, /Wybierz priorytet/);
  assert.match(dialog, /Cykliczność/);
  assert.match(dialog, /Przypomnienie/);
  assert.match(dialog, /Notatka/);
  assert.match(dialog, /Dodaj notatkę do zadania\.\.\./);
  assert.match(dialog, /description: form\.description\.trim\(\)/);
  assert.match(dialog, /recurrenceRule: resolveRecurrenceRule/);
  assert.match(dialog, /reminderAt: calculateReminderAt/);
  assert.match(dialog, /leadId: relation\.leadId \|\| form\.leadId \|\| undefined/);
  assert.match(dialog, /insertTaskToSupabase/);
  assert.match(dialog, /Button type="submit"[\s\S]*Dodaj zadanie/);
  assert.match(picker, /appearance\?: 'default' \| 'forteca-select'/);
  assert.match(picker, /ChevronDown/);
  assert.match(fallback, /workspaceId\?: string; description\?: string/);
  assert.match(dialogCss, /FRT-014 — Forteca calm-light Lead Detail task creation drawer/);
  assert.match(dialogCss, /width: min\(412px, 100vw\)/);
  assert.match(dialogCss, /inset: 0 0 0 auto/);
  assert.match(dialogCss, /border-radius: 0 !important/);
  assert.match(dialogCss, /\.forteca-frt-014-footer/);
  assert.doesNotMatch(dialog, /ACME Logistics|Jan Kowalski|Damian Knapik/);
});

test('FRT-014 keeps legacy shared-form source markers while preserving default task status', () => {
  const dialog = read('src/components/TaskCreateDialog.tsx');

  assert.match(dialog, /TASK_CREATE_DIALOG_STAGE105_FORM_SOURCE = 'event-form-vnext'/);
  assert.match(dialog, /className="event-form-vnext-content sm:max-w-2xl"/);
  assert.match(dialog, /className="event-form-vnext"/);
  assert.match(dialog, /data-forteca-frt-014-status="todo"/);
  assert.match(dialog, /status: 'todo'/);
});
