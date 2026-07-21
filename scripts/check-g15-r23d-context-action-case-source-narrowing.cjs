#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const sourcePath = path.join(root, 'src/components/ContextActionDialogs.tsx');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(sourcePath)) fail('missing ContextActionDialogs.tsx');
const source = fs.readFileSync(sourcePath, 'utf8');
const impossible = "source: request.recordType === 'client' ? 'STAGE232I2_CONTEXT_ACTION_CLIENT_MISSING_ITEM_SOURCE' : 'context_action_dialogs_blocker',";
if (source.includes(impossible)) fail('impossible case/client comparison remains');

const caseStart = source.indexOf("if (request.recordType === 'case') {");
const elseStart = source.indexOf('      } else {', caseStart);
if (caseStart < 0 || elseStart < 0) fail('case branch boundaries missing');
const caseBranch = source.slice(caseStart, elseStart);
if (!caseBranch.includes("source: 'context_action_dialogs_blocker',")) fail('case task payload source literal missing');
if (caseBranch.includes("request.recordType === 'client'")) fail('case branch still compares recordType with client');
if (!caseBranch.includes("source: 'STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME',")) fail('case activity source changed');
if (!source.includes("const clientId = request.clientId || (request.recordType === 'client' ? request.recordId : null);")) fail('valid client narrowing changed');
if (!source.includes('item: createdMissingTaskRecordStage232N,')) fail('next TS2353 item debt was modified');
if (!source.includes('record: createdMissingTaskRecordStage232N,')) fail('existing no-flicker record field changed');
console.log('PASS: R23D removes only the impossible case/client source comparison and preserves runtime behavior.');
