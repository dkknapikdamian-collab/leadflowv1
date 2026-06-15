import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  BLOCKERS,
  PROOF_STATUSES,
  buildProofArtifact,
  classifyProviderBlocker,
  classifyProviderError,
  loadRuntimeState,
  runQuotaFallbackProof,
  selectCandidate,
  validateProofArtifact,
} = require('../gkw-provider-real-proof-strict');

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function makeDataDir({ includeFallback = true, quotaState = { buckets: {} } } = {}) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gkw-04c-r2-'));
  const models = [
    {
      modelId: 'google_ai_studio__gemini_test',
      providerId: 'google_ai_studio',
      providerModel: 'gemini-2.0-flash',
      status: 'available',
      allowProductionRouting: true,
      source: 'api',
      ownerApprovedStaticAllowlist: true,
      accountIds: ['google_account_1'],
      priority: 1,
    },
  ];
  const accounts = [
    {
      accountId: 'google_account_1',
      providerId: 'google_ai_studio',
      credentialRef: 'GEMINI_API_KEY_1',
      quotaBucketId: 'google-ai-studio:auto:1',
      status: 'active',
      priority: 1,
    },
  ];
  if (includeFallback) {
    models.push({
      modelId: 'groq__mixtral_test',
      providerId: 'groq',
      providerModel: 'mixtral-8x7b-32768',
      status: 'available',
      allowProductionRouting: true,
      source: 'api',
      ownerApprovedStaticAllowlist: true,
      accountIds: ['groq_account_1'],
      priority: 2,
    });
    accounts.push({
      accountId: 'groq_account_1',
      providerId: 'groq',
      credentialRef: 'GROQ_API_KEY_1',
      quotaBucketId: 'groq:auto:1',
      status: 'active',
      priority: 2,
    });
  }
  writeJson(path.join(dataDir, 'model-registry.json'), { models });
  writeJson(path.join(dataDir, 'provider-accounts.json'), { accounts });
  writeJson(path.join(dataDir, 'provider-health.json'), { providers: {}, accounts: {} });
  writeJson(path.join(dataDir, 'provider-quota-registry.json'), { buckets: [] });
  writeJson(path.join(dataDir, 'provider-quota-state.json'), quotaState);
  return dataDir;
}

const env = {
  GEMINI_API_KEY_1: 'gemini_test_key_for_unit_tests',
  GROQ_API_KEY_1: 'groq_test_key_for_unit_tests',
};

test('quota exhausted is not inferred from CONTROLLED_SKIP', () => {
  const blocker = classifyProviderBlocker({ credentialRefPresent: false, credentialResolved: false });
  assert.equal(blocker, BLOCKERS.MISSING_CREDENTIAL);
  assert.notEqual(blocker, BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED);
});

test('missing credential is classified separately from quota exhausted', () => {
  const blocker = classifyProviderBlocker({
    providerId: 'google_ai_studio',
    modelDiscovered: true,
    ownerApprovedStatic: true,
    modelAllowed: true,
    credentialRefPresent: false,
    quotaKnown: false,
  });
  assert.equal(blocker, BLOCKERS.MISSING_CREDENTIAL);
});

test('quota unknown is classified separately from quota exhausted', () => {
  const blocker = classifyProviderBlocker({
    providerId: 'google_ai_studio',
    modelDiscovered: true,
    ownerApprovedStatic: true,
    modelAllowed: true,
    credentialRefPresent: true,
    credentialResolved: true,
    healthStatus: 'active',
    quotaKnown: false,
    allowedToProbeWhenQuotaUnknown: false,
  });
  assert.equal(blocker, BLOCKERS.QUOTA_UNKNOWN_OR_NOT_TRACKED);
});

test('quota unknown may allow real probe only with ownerApproved + maxEstimatedCost', () => {
  const dataDir = makeDataDir();
  const state = loadRuntimeState({ dataDir, env });
  const blocked = selectCandidate(state, 'google_ai_studio', { ownerApproved: false, maxEstimatedCost: 0 });
  assert.equal(blocked.blocker, BLOCKERS.QUOTA_UNKNOWN_OR_NOT_TRACKED);

  const allowed = selectCandidate(state, 'google_ai_studio', { ownerApproved: true, maxEstimatedCost: 5 });
  assert.equal(allowed.blocker, BLOCKERS.PROVIDER_READY_FOR_REAL_PROBE);
  assert.equal(allowed.allowedToProbeWhenQuotaUnknown, true);
});

test('real quota exhausted requires provider error evidence', () => {
  assert.equal(classifyProviderError({ statusCode: 403, body: 'RESOURCE_EXHAUSTED quota exceeded' }), BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED);
  assert.notEqual(classifyProviderError({ statusCode: 0, body: 'controlled skip' }), BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED);
});

test('fallback proof requires second provider/model/account', async () => {
  const dataDir = makeDataDir({ includeFallback: true });
  const outputFile = path.join(dataDir, 'proof.json');
  const result = await runQuotaFallbackProof({
    dataDir,
    env,
    provider: 'google_ai_studio',
    ownerApproved: true,
    maxEstimatedCost: 5,
    quotaBurn: true,
    fallbackRequired: true,
    outputFile,
    executor: async (context) => {
      if (context.providerId === 'google_ai_studio') return { ok: false, statusCode: 403, body: 'quota exceeded' };
      return { ok: true, statusCode: 200, usage: { completionTokens: 3 } };
    },
  });
  assert.equal(result.status, PROOF_STATUSES.FALLBACK_EXECUTED_AND_VALIDATED);
  assert.equal(result.artifact.fallbackProvider, 'groq');
  assert.notEqual(result.artifact.fallbackAccountRef, result.artifact.primaryAccountRef);
  assert.equal(result.artifact.usageLedgerWritten, true);
});

test('fallback proof fails if fallback provider is NOT_READY', async () => {
  const dataDir = makeDataDir({ includeFallback: false });
  const result = await runQuotaFallbackProof({
    dataDir,
    env,
    provider: 'google_ai_studio',
    ownerApproved: true,
    maxEstimatedCost: 5,
    quotaBurn: true,
    fallbackRequired: true,
    executor: async () => ({ ok: false, statusCode: 403, body: 'quota exceeded' }),
  });
  assert.equal(result.status, PROOF_STATUSES.FALLBACK_NOT_READY);
  assert.equal(result.artifact.fallbackReason, 'NO_SECOND_PROVIDER_MODEL_ACCOUNT');
});

test('remaining limit cannot be reported as known when quotaSource=unknown', () => {
  const artifact = buildProofArtifact({
    primary: {
      providerId: 'google_ai_studio',
      modelId: 'm',
      accountRef: 'a',
      quotaKnown: false,
      remainingTokens: 999,
      remainingRequests: 10,
      quotaSource: 'unknown',
      allowedToProbeWhenQuotaUnknown: true,
      estimatedInputTokens: 2,
      estimatedOutputTokens: 3,
    },
    primaryAttemptStatus: PROOF_STATUSES.CONTROLLED_SKIP_QUOTA_UNKNOWN,
  });
  assert.equal(artifact.quotaDecisionBeforeCall.quotaSource, 'unknown');
  assert.equal(artifact.quotaDecisionBeforeCall.remainingTokens, null);
  assert.equal(artifact.quotaDecisionBeforeCall.remainingRequests, null);
});

test('token estimate must exist before real probe', () => {
  const dataDir = makeDataDir();
  const state = loadRuntimeState({ dataDir, env });
  const candidate = selectCandidate(state, 'google_ai_studio', { ownerApproved: true, maxEstimatedCost: 5, prompt: 'abc' });
  assert.equal(candidate.estimatedInputTokens >= 1, true);
  assert.equal(candidate.estimatedOutputTokens >= 1, true);
});

test('usage ledger flag must exist after real provider attempt', async () => {
  const dataDir = makeDataDir({ includeFallback: true });
  const result = await runQuotaFallbackProof({
    dataDir,
    env,
    provider: 'google_ai_studio',
    ownerApproved: true,
    maxEstimatedCost: 5,
    realProbe: true,
    executor: async () => ({ ok: true, statusCode: 200, usage: { promptTokens: 2, completionTokens: 2 } }),
  });
  assert.equal(result.artifact.usageLedgerWritten, true);
});

test('simulated fallback cannot be labeled as real fallback', () => {
  const validation = validateProofArtifact({
    noRawSecrets: true,
    primaryProvider: 'google_ai_studio',
    primaryAccountRef: 'google_account_1',
    fallbackAttemptStatus: PROOF_STATUSES.FALLBACK_EXECUTED_AND_VALIDATED,
    fallbackProvider: 'groq',
    fallbackModel: 'groq__mixtral_test',
    fallbackAccountRef: 'groq_account_1',
    quotaDecisionBeforeCall: { quotaSource: 'unknown', remainingTokens: null, remainingRequests: null },
    realProof: false,
  });
  assert.equal(validation.ok, false);
  assert.equal(validation.errors.includes('REAL_FALLBACK_WITHOUT_REAL_PROOF_FLAG'), true);
});

test('no raw secrets in quota/fallback proof artifact', () => {
  const validation = validateProofArtifact({
    noRawSecrets: true,
    primaryProvider: 'google_ai_studio',
    fallbackReason: 'AIzaSyDUMMYDUMMYDUMMYDUMMYDUMMYDUMMY',
    quotaDecisionBeforeCall: { quotaSource: 'unknown', remainingTokens: null, remainingRequests: null },
  });
  assert.equal(validation.ok, false);
  assert.equal(validation.errors.includes('RAW_SECRET_DETECTED_IN_PROOF'), true);
});
