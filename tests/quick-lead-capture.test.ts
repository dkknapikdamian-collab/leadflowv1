import assert from 'node:assert/strict';
import {
  cancelQuickLeadDraft,
  confirmQuickLeadDraft,
  createQuickLeadDraft,
  parseQuickLeadNote,
  validateQuickLeadRawText,
} from '../src/lib/quick-lead-capture';

const fixedNow = new Date('2026-04-26T12:00:00+02:00');

const marek = parseQuickLeadNote('Pan Marek z Facebooka chce ofertę na stronę, oddzwonić jutro po 10, pilne.', fixedNow);
assert.equal(marek.contactName, 'Pan Marek');
assert.equal(marek.source, 'facebook');
assert.equal(marek.priority, 'high');
assert.equal(marek.nextAction, 'oddzwonić');
assert.ok(marek.need?.includes('ofertę na stronę') || marek.need?.includes('oferta na stronę'));
assert.ok(marek.nextActionAt?.startsWith('2026-04-27T08:00:00.000Z') || marek.nextActionAt?.startsWith('2026-04-27T10:00:00'));

const anna = parseQuickLeadNote('Pani Anna chce wycenę mieszkania, zadzwonić dziś wieczorem.', fixedNow);
assert.equal(anna.contactName, 'Pani Anna');
assert.equal(anna.nextAction, 'zadzwonić');
assert.ok(anna.need?.includes('wycenę mieszkania') || anna.need?.includes('wycene mieszkania'));
assert.ok(anna.nextActionAt, 'termin wieczorny powinien być rozpoznany orientacyjnie');

const robert = parseQuickLeadNote('Robert, zadzwonić w przyszłym tygodniu.', fixedNow);
assert.equal(robert.contactName, 'Robert');
assert.equal(robert.nextAction, 'zadzwonić');
assert.ok(robert.nextActionAt, 'przyszły tydzień powinien dać orientacyjny termin');
assert.ok(['low', 'medium'].includes(robert.confidence.nextActionAt));

assert.equal(validateQuickLeadRawText('').ok, false);
assert.equal(validateQuickLeadRawText('abc').ok, false);
assert.equal(validateQuickLeadRawText('Pan Marek oddzwonić jutro').ok, true);

const draft = createQuickLeadDraft('Pan Marek z Facebooka, oddzwonić jutro po 10.', fixedNow);
const confirmed = confirmQuickLeadDraft(draft, fixedNow);
assert.equal(confirmed.status, 'confirmed');
assert.equal(confirmed.rawText, null);

const cancelled = cancelQuickLeadDraft(draft, fixedNow);
assert.equal(cancelled.status, 'cancelled');
assert.equal(cancelled.rawText, null);

console.log('OK quick lead capture parser and privacy tests passed');
