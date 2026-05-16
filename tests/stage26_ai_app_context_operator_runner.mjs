import assert from 'node:assert/strict';
import { buildAiApplicationOperatorAnswer, dedupeIncrementalTranscript, detectAssistantIntent } from '../src/server/ai-application-operator.ts';

const now = '2026-04-30T08:00:00+02:00';
const baseContext = {
  operatorSnapshot: { workspaceId: 'w1' },
  leads: [
    { id: 'lead-marek', workspaceId: 'w1', name: 'Marek Nowak', phone: '516 111 222', email: 'marek@example.pl', status: 'new' },
    { id: 'lead-risk', workspaceId: 'w1', name: 'Anna Ryzyko', phone: '500 000 000', status: 'waiting', riskLevel: 'high', dealValue: 25000 },
    { id: 'lead-w2', workspaceId: 'w2', name: 'Marek Obcy', phone: '999 999 999', status: 'new' },
  ],
  clients: [
    { id: 'client-1', workspaceId: 'w1', name: 'Klient Testowy', phone: '600 600 600' },
  ],
  cases: [],
  tasks: [
    { id: 'task-tomorrow', workspaceId: 'w1', title: 'Oddzwoni\u0107 do Marka', status: 'todo', scheduledAt: '2026-05-01T10:00:00+02:00', leadId: 'lead-marek' },
    { id: 'task-overdue', workspaceId: 'w1', title: 'Wys\u0142a\u0107 ofert\u0119', status: 'todo', scheduledAt: '2026-04-28T12:00:00+02:00', leadId: 'lead-risk' },
    { id: 'task-foreign', workspaceId: 'w2', title: 'Obce zadanie', status: 'todo', scheduledAt: '2026-05-01T11:00:00+02:00' },
  ],
  events: [
    { id: 'event-tomorrow', workspaceId: 'w1', title: 'Spotkanie z Ann\u0105', status: 'scheduled', startAt: '2026-05-01T14:00:00+02:00', leadId: 'lead-risk' },
  ],
  drafts: [],
};

function ask(rawText, context = baseContext) {
  return buildAiApplicationOperatorAnswer({ rawText, context, now });
}

{
  const result = ask('Co mam jutro?');
  assert.equal(result.mode, 'read');
  assert.equal(result.operatorIntent, 'summarize_tomorrow');
  assert.equal(result.items.length, 2);
  assert.ok(result.items.some((item) => item.label.includes('Oddzwoni\u0107 do Marka')));
  assert.ok(result.items.some((item) => item.label.includes('Spotkanie z Ann\u0105')));
  assert.ok(!result.items.some((item) => item.label.includes('Obce zadanie')));
}

{
  const result = ask('Znajd\u017A numer do Marka');
  assert.equal(result.mode, 'read');
  assert.equal(result.operatorIntent, 'find_contact');
  assert.equal(result.items.length, 1);
  assert.match(result.items[0].detail || '', /516 111 222/);
}

{
  const result = ask('Znajd\u017A numer do Nieistniej\u0105cy');
  assert.equal(result.mode, 'read');
  assert.equal(result.answer, 'Nie znalaz\u0142em tego w danych aplikacji.');
  assert.equal(result.items.length, 0);
}

{
  const result = ask('zapisz zadanie jutro o 10 rozgraniczenie');
  assert.equal(result.mode, 'draft');
  assert.equal(result.operatorIntent, 'create_draft_task');
  assert.equal(result.draft?.type, 'task');
  assert.equal(result.draft?.status, 'draft');
  assert.ok(result.noAutoWrite);
  assert.match(String(result.draft?.parsedDraft?.title || ''), /Rozgraniczenie/i);
}

{
  const merged = dedupeIncrementalTranscript(['Zapisz', 'Zapisz mi', 'Zapisz mi zadanie', 'Zapisz mi zadanie jutro']);
  assert.equal(merged, 'Zapisz mi zadanie jutro');
}

{
  const result = ask('Kt\u00F3re leady s\u0105 zagro\u017Cone?');
  assert.equal(result.operatorIntent, 'at_risk_leads');
  assert.ok(result.items.some((item) => item.label.includes('Anna Ryzyko')));
}

{
  const result = ask('Co mam jutro?', { ...baseContext, operatorSnapshot: { workspaceId: 'w1' } });
  assert.equal(result.snapshotMeta.workspaceId, 'w1');
  assert.equal(result.snapshotMeta.sourceCounts.tasks, 3);
  assert.equal(result.snapshotMeta.filteredCounts.tasks, 2);
  assert.ok(!result.items.some((item) => item.label.includes('Obce zadanie')));
}

assert.equal(detectAssistantIntent('zapisz wydarzenie jutro o 15 spotkanie z klientem'), 'create_draft_event');
assert.equal(detectAssistantIntent('poka\u017C leady bez zaplanowanej akcji'), 'no_planned_action');
