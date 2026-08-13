#!/usr/bin/env node
'use strict';

/*
 * STAGE231D0A is a historical inventory gate. The runtime architecture it
 * documented was retired by LF-UI-SOT-007, so this compatibility checker must
 * validate the current registry rather than resurrecting old stage CSS.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const MARKER = 'STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY';
const repoRoot = process.cwd();
const failures = [];

function absolute(relativePath) {
  return path.join(repoRoot, ...relativePath.split('/'));
}

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function read(relativePath) {
  const filePath = absolute(relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`missing file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

function fail(message) {
  failures.push(message);
}

function requireText(relativePath, tokens, reason) {
  const source = read(relativePath);
  for (const token of tokens) {
    if (!source.includes(token)) fail(`${relativePath}: missing ${JSON.stringify(token)} (${reason})`);
  }
  return source;
}

function parseJson(relativePath) {
  const source = read(relativePath);
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${relativePath}: invalid JSON: ${error.message}`);
    return null;
  }
}

function parseOwnerMetadata(source, relativePath) {
  const match = String(source).match(/LF-UI-SOT-007_OWNER\s+(\{[^\n]*\})/);
  if (!match) {
    fail(`${relativePath}: missing LF-UI-SOT-007_OWNER metadata`);
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    fail(`${relativePath}: invalid owner metadata: ${error.message}`);
    return null;
  }
}

function checkPackageScripts() {
  const packageJson = parseJson('package.json');
  const scripts = packageJson?.scripts || {};
  const expected = {
    'check:stage231d0a-visual-source-truth-consistency': 'node scripts/check-stage231d0a-visual-source-truth-consistency.cjs',
    'test:stage231d0a-visual-source-truth-consistency': 'node --test tests/stage231d0a-visual-source-truth-consistency.test.cjs',
  };
  for (const [name, command] of Object.entries(expected)) {
    if (scripts[name] !== command) fail(`package.json: missing or changed script ${name}`);
  }
}

function checkHistoricalInventoryArtifacts() {
  // These are retained records of the older D0A inventory, not runtime source
  // of truth. Keep only existence/identity checks here; current ownership is
  // proved by the LF-UI-SOT-007 registry and guard below.
  requireText('_project/VISUAL_SOURCE_OF_TRUTH.md', [
    'STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY',
    'VISUAL SOURCE OF TRUTH MAP',
    'Ryzyka:',
  ], 'retained historical inventory identity');
  requireText('_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md', [
    'STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY',
    'VISUAL SOURCE OF TRUTH MAP',
  ], 'retained historical inventory run identity');
  requireText('_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md', [
    'STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY',
    'Zapis do Obsidiana',
    'Visual Source of Truth',
  ], 'retained historical Obsidian payload identity');
}

function checkCurrentRegistry() {
  const registry = parseJson('src/lib/source-of-truth/visual-owner-registry.json');
  if (!registry) return;

  if (registry.stage !== 'LF-UI-SOT-007') fail('registry: unexpected stage');
  if (registry.runtimeEntry !== 'src/main.tsx') fail('registry: runtimeEntry must be src/main.tsx');
  if (registry.visualEntry !== 'src/styles/closeflow-visual-source-truth.css') {
    fail('registry: visualEntry must be the canonical CloseFlow visual entry');
  }
  if (registry.ownerModel?.oneOwnerPerConcern !== true) fail('registry: oneOwnerPerConcern must be true');
  if (!exists(registry.visualEntry)) fail(`registry visualEntry missing: ${registry.visualEntry}`);
  if (!read('src/App.tsx').includes("./styles/closeflow-visual-source-truth.css")) {
    fail('src/App.tsx: canonical visual entry is not imported by the runtime app');
  }

  const concerns = registry.concerns || {};
  const ownersByConcern = new Map();
  for (const [concern, definition] of Object.entries(concerns)) {
    if (!definition?.owner) {
      fail(`registry: concern has no owner: ${concern}`);
      continue;
    }
    if (ownersByConcern.has(concern)) fail(`registry: duplicate concern: ${concern}`);
    ownersByConcern.set(concern, definition.owner);
    if (!exists(definition.owner)) fail(`registry owner missing: ${definition.owner}`);
  }
  if (ownersByConcern.size < 1) fail('registry: no semantic concerns registered');

  const ownerDirectory = absolute('src/styles/owners');
  for (const entry of fs.readdirSync(ownerDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.css') || entry.name.includes('.sync-conflict-')) continue;
    const relativePath = `src/styles/owners/${entry.name}`;
    const metadata = parseOwnerMetadata(read(relativePath), relativePath);
    if (!metadata) continue;
    if (!metadata.role) fail(`${relativePath}: missing runtime role`);
    if (!Array.isArray(metadata.consumerRoots) || metadata.consumerRoots.length === 0) {
      fail(`${relativePath}: missing consumerRoots`);
    }
    if (metadata.role === 'canonical-owner') {
      const declaredOwner = [...ownersByConcern.values()].find((owner) => owner === relativePath);
      if (!declaredOwner) fail(`${relativePath}: canonical owner is not registered for a concern`);
    }
    if (metadata.role === 'scoped-adapter') {
      const realRoots = (metadata.consumerRoots || []).filter((root) =>
        root !== registry.visualEntry && !String(root).endsWith('.css'));
      if (!realRoots.length) fail(`${relativePath}: scoped adapter has no route/component consumer root`);
    }
  }
}

function metricIsZero(output, metric) {
  const jsonPattern = new RegExp(`"${metric}"\\s*:\\s*0`);
  const textPattern = new RegExp(`${metric}\\s+0`);
  return jsonPattern.test(output) || textPattern.test(output);
}

function checkCurrentRuntimeGuard() {
  const result = spawnSync(process.execPath, [
    path.join(repoRoot, 'scripts', 'check-closeflow-ui-ssot.cjs'),
    'css-owners',
  ], { cwd: repoRoot, encoding: 'utf8' });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  if (result.status !== 0) {
    fail(`current LF-UI-SOT-007 css-owner guard failed:\n${output.trim()}`);
    return;
  }
  for (const metric of [
    'ACTIVE_RUNTIME_PATCH_LAYERS',
    'HISTORICAL_STAGE_RUNTIME_OWNERS',
    'COMPETING_VISUAL_OWNERS',
    'UNKNOWN_VISUAL_OWNERS',
    'DUPLICATE_SEMANTIC_OWNERS',
    'UNCLASSIFIED_IMPORTANT',
    'SPECIFICITY_PATCH_IMPORTANT',
  ]) {
    if (!metricIsZero(output, metric)) fail(`current LF-UI-SOT-007 guard: ${metric} is not zero`);
  }
  if (!/"ONE_OWNER_PER_VISUAL_CONCERN"\s*:\s*"PASS"/.test(output)) {
    fail('current LF-UI-SOT-007 guard: ONE_OWNER_PER_VISUAL_CONCERN is not PASS');
  }
}

function checkD0ADoesNotCreateRuntimeSource() {
  if (exists('src/styles/visual-source-truth.css')) {
    fail('src/styles/visual-source-truth.css: retired D0A artifact must not become a second runtime source');
  }
  for (const relativePath of [
    'scripts/check-stage231d0a-visual-source-truth-consistency.cjs',
    'tests/stage231d0a-visual-source-truth-consistency.test.cjs',
  ]) {
    if (!exists(relativePath)) fail(`missing D0A compatibility artifact: ${relativePath}`);
  }
}

function main() {
  console.log(`${MARKER}: start`);
  checkPackageScripts();
  checkHistoricalInventoryArtifacts();
  checkCurrentRegistry();
  checkCurrentRuntimeGuard();
  checkD0ADoesNotCreateRuntimeSource();

  if (failures.length) {
    console.error(`${MARKER}: FAIL`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`${MARKER}: CURRENT_REGISTRY=LF-UI-SOT-007`);
  console.log(`${MARKER}: PASS`);
}

main();
