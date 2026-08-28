const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('FRT-015 pins the Lead Detail note contract and its visual reference', () => {
  const contract = read('_project/contracts/forteca-clean/FRT-015_LEAD_NOTE.md');
  const referenceMatch = contract.match(/^REFERENCE_FILE:\s*(.+)$/m);

  assert.match(contract, /STAGE_ID: FRT-015/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(contract, /TARGET_STATE: Lead Detail — add note modal/);
  assert.ok(referenceMatch, 'FRT-015 must declare a reference file');

  const referenceFile = referenceMatch[1].trim();
  const referencePath = path.join(root, referenceFile);
  assert.ok(fs.existsSync(referencePath), `FRT-015 reference is missing: ${referenceFile}`);
  assert.equal(
    sha256(referencePath),
    '55701572395DAF1339B67ACA1179FCBCCE67BDC75C7F31DBDB6A4652015F9740',
    'FRT-015 reference changed without an explicit SOT update',
  );
});

test('FRT-015 exposes the reference copy and stage markers on the real note owner', () => {
  const dialog = read('src/components/ContextNoteDialog.tsx');
  const dialogCss = read('src/styles/owners/closeflow-dialogs.css');
  const expectedCopy = [
    'Dodaj notatkę',
    'Tytuł notatki',
    'Np. Rozmowa telefoniczna – potrzeby klienta',
    'Treść notatki',
    'Wpisz treść notatki...',
    'Normalny',
    'Sugerowane tagi',
    'Rozmowa',
    'Oferta',
    'Spotkanie',
    'Feedback klienta',
    'Tagi',
    'Wybierz lub wpisz tagi...',
    'Widoczność',
    'Tylko dla mnie',
    'Data wpisu',
    'Powiązanie z aktywnością',
    'Wybierz lub wyszukaj aktywność...',
    'Ostatnie notatki',
    'Anuluj',
    'Zapisz notatkę',
  ];

  assert.match(dialog, /data-forteca-frt-015-lead-note="true"/);
  assert.match(dialog, /data-forteca-frt-015-form="true"/);
  assert.match(dialog, /data-forteca-frt-015-editor="true"/);
  assert.match(dialog, /data-forteca-frt-015-recent-notes="true"/);
  assert.match(dialogCss, /\[data-forteca-frt-015-lead-note="true"\][\s\S]*\.cf-vst-dialog-close/);
  assert.match(dialog, /type="date"/);
  assert.match(dialog, /contentEditable|<Textarea/);

  for (const copy of expectedCopy) {
    assert.ok(dialog.includes(copy), `FRT-015 copy is missing: ${copy}`);
  }
});

test('FRT-015 keeps note persistence and refresh on the real activities path', () => {
  const dialog = read('src/components/ContextNoteDialog.tsx');
  const host = read('src/components/ContextActionDialogs.tsx');
  const leadDetail = read('src/pages/LeadDetail.tsx');
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.match(fallback, /export async function insertActivityToSupabase\(/);
  assert.match(fallback, /export async function fetchActivitiesFromSupabase\(/);
  assert.match(dialog, /insertActivityToSupabase\(/);
  assert.match(dialog, /fetchActivitiesFromSupabase\(/);
  assert.match(dialog, /context\?\.leadId/);
  assert.match(dialog, /eventTypeForContext/);
  assert.match(dialog, /workspaceId/);
  assert.match(dialog, /payload:\s*\{/);
  assert.match(dialog, /closeflow:context-note-saved/);

  const fetchCall = dialog.match(/fetchActivitiesFromSupabase\([\s\S]{0,320}?\)/);
  assert.ok(fetchCall && /leadId/.test(fetchCall[0]), 'recent notes must reload by the current lead relation');
  assert.match(host, /<ContextNoteDialog open=\{openNote\}/);
  assert.equal((host.match(/<ContextNoteDialog\s/g) || []).length, 1, 'the shared host must keep one note dialog owner');
  assert.match(leadDetail, /closeflow:context-action-saved/);
  assert.match(leadDetail, /loadLead\(\{ silent: true \}\)/);
});

test('FRT-015 stores dynamic note metadata and keeps the generic note marker intact', () => {
  const dialog = read('src/components/ContextNoteDialog.tsx');
  const dynamicPayloadKeys = ['content', 'note', 'title', 'contentHtml', 'tags', 'visibility', 'entryDate', 'relatedActivityId', 'recordLabel'];

  for (const key of dynamicPayloadKeys) {
    assert.match(dialog, new RegExp(`\\b${escaped(key)}\\s*:`), `FRT-015 payload metadata is missing: ${key}`);
  }

  for (const key of ['title', 'contentHtml', 'tags', 'visibility', 'entryDate', 'relatedActivityId', 'recordLabel']) {
    assert.doesNotMatch(
      dialog,
      new RegExp(`\\b${escaped(key)}\\s*:\\s*['"][^'"]+['"]`),
      `FRT-015 ${key} must come from current user/context state, not a fixture literal`,
    );
  }

  assert.doesNotMatch(dialog, /ACME Logistics|Jan Kowalski|Damian Knapik|16\.05\.2025|2025-05-16/);
  assert.match(dialog, /data-context-note-dialog-stage85="true"/);
  assert.match(dialog, /data-stage85-context-relation="true"/);
  assert.match(dialog, /Powiązanie:/);
  assert.match(dialog, /context\?\.recordType|isFortecaLead/);
  assert.match(dialog, /context\?\.recordLabel/);
});

test('FRT-015 binds semantic colors to the canonical token source', () => {
  const dialog = read('src/components/ContextNoteDialog.tsx');
  const dialogCss = read('src/styles/owners/closeflow-dialogs.css');
  const stageStart = dialogCss.indexOf('/* FRT-015 —');
  assert.ok(stageStart >= 0, 'FRT-015 style owner must be present');
  const stageCss = dialogCss.slice(stageStart);

  assert.match(dialog, /data-forteca-frt-015-tag=\{tag\}/);
  assert.match(stageCss, /data-forteca-frt-015-tag="Rozmowa"[\s\S]*--cf-vst-color-task/);
  assert.match(stageCss, /data-forteca-frt-015-tag="Oferta"[\s\S]*--cf-vst-color-payment/);
  assert.match(stageCss, /data-forteca-frt-015-tag="Spotkanie"[\s\S]*--cf-vst-color-note/);
  assert.match(stageCss, /data-forteca-frt-015-tag="Feedback klienta"[\s\S]*--cf-vst-color-event/);
  assert.doesNotMatch(
    stageCss,
    /(?:#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/i,
    'FRT-015 semantic colors must resolve through canonical --cf-vst-* tokens',
  );
});

test('FRT-015 keeps its visual rules scoped to the canonical dialog owner', () => {
  const dialogCss = read('src/styles/owners/closeflow-dialogs.css');

  assert.match(dialogCss, /FRT-015 — Forteca calm-light Lead Detail note drawer/);
  assert.match(dialogCss, /\[data-forteca-frt-015-lead-note="true"\]\.cf-vst-dialog/);
  assert.match(dialogCss, /\[data-forteca-frt-015-lead-note="true"\][\s\S]*\.forteca-frt-015-form/);
  assert.match(dialogCss, /\.forteca-frt-015-footer/);
  assert.match(dialogCss, /\.forteca-frt-015-toolbar/);
  assert.match(dialogCss, /\.forteca-frt-015-editor/);
  assert.match(dialogCss, /inset:\s*0 0 0 auto/);
  assert.match(dialogCss, /width:\s*min\(/);
  assert.match(dialogCss, /height:\s*100dvh/);
  assert.match(dialogCss, /border-radius:\s*0\s*!important/);

  const unscopedStageSelectors = dialogCss.match(/(?:^|\n)\s*\.forteca-frt-015-[^{\n]+\{/g) || [];
  assert.equal(unscopedStageSelectors.length, 0, 'FRT-015 selectors must stay behind the stage data marker');
});
