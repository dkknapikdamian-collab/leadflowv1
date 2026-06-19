#!/usr/bin/env node
/* STAGE232I4_R14_R6 runtime-behavior guard: catches the exact smoke failure that R5 missed. */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
const errors = [];
function read(file) { return fs.readFileSync(file, 'utf8'); }
function expect(condition, message) { if (!condition) errors.push(message); }
const client = read(clientPath);

const topStart = client.indexOf('<ClientTopTiles');
const topEnd = topStart >= 0 ? client.indexOf('/>', topStart) : -1;
const topBlock = topStart >= 0 && topEnd > topStart ? client.slice(topStart, topEnd) : '';
const addMatch = topBlock.match(/onAddMissing=\{\(\) => \{[\s\S]*?\n\s*\}\}/);
const addBlock = addMatch ? addMatch[0] : '';

expect(addBlock.includes('setClientMissingModalOpen(true)'), 'Client top tile Dodaj brak must open quick modal.');
expect(addBlock.includes('setClientMissingListOpenStage232I6(false)'), 'Client top tile Dodaj brak must close manager before quick add.');
expect(!addBlock.includes('setClientMissingListOpenStage232I6(true)'), 'Client top tile Dodaj brak must not open all-missing manager.');
expect(client.includes('data-stage232i4-r14-r6-client-quick-add-no-manager="true"'), 'ClientDetail missing R6 quick-add runtime marker.');

const saveStart = client.indexOf('const handleSaveClientMissingItemStage227C3B = useCallback(async () => {');
const saveEnd = saveStart >= 0 ? client.indexOf('  }, [client, clientId, clientMissingBlocksProgress', saveStart) : -1;
const saveBlock = saveStart >= 0 && saveEnd > saveStart ? client.slice(saveStart, saveEnd) : '';
expect(saveBlock.includes('setClientMissingModalOpen(false)'), 'Client save handler must close quick modal after create.');
expect(saveBlock.includes('setClientMissingListOpenStage232I6(false)'), 'Client save handler must keep/close all-missing manager after create.');
expect(!/\bvoid\s+reload\(\);/.test(saveBlock), 'Client save handler must not immediate void reload() after create; it hides optimistic missing item.');
expect(!/\bawait\s+reload\(\);/.test(saveBlock), 'Client save handler must not await reload() after create; it hides optimistic missing item.');
expect(saveBlock.includes("sourceEntityType: 'client'") || saveBlock.includes('sourceEntityType: "client"'), 'Client save handler must write sourceEntityType client.');
expect(saveBlock.includes('sourceEntityId: safeClientId'), 'Client save handler must write sourceEntityId safeClientId.');
expect(saveBlock.includes('recordId: safeClientId'), 'Client save handler must write recordId safeClientId.');
expect(saveBlock.includes('clientId: safeClientId'), 'Client save handler must write clientId safeClientId.');
expect(saveBlock.includes('setTasks((previous) => [optimisticTask, ...previous])'), 'Client save handler must keep optimistic task visible immediately.');

if (errors.length) {
  console.error('STAGE232I4_R14_R6 runtime guard FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('STAGE232I4_R14_R6 runtime guard PASS');
