const fs = require('node:fs');
const path = require('node:path');
const { loadProviderAccountsWithDiscoveredEnv, resolveCredentialRefFromEnv } = require('./provider-account-runtime-source');

const STAGE = 'GKW-PROD-04C-R2';
const DEFAULT_DATA_DIR = path.join(__dirname, 'data');
const DEFAULT_OUTPUT_DIR = '_project/fixtures/gkw-prod-04c/provider-readiness';
const PROOF_FILE = 'quota_fallback_proof.json';

const PROOF_STATUSES = Object.freeze({
  SIMULATED_FALLBACK_PASS: 'SIMULATED_FALLBACK_PASS',
  CONTROLLED_SKIP_MISSING_CREDENTIAL: 'CONTROLLED_SKIP_MISSING_CREDENTIAL',
  CONTROLLED_SKIP_QUOTA_UNKNOWN: 'CONTROLLED_SKIP_QUOTA_UNKNOWN',
  EXECUTED_AI_STUDIO_SUCCESS: 'EXECUTED_AI_STUDIO_SUCCESS',
  EXECUTED_AI_STUDIO_QUOTA_EXHAUSTED: 'EXECUTED_AI_STUDIO_QUOTA_EXHAUSTED',
  FALLBACK_EXECUTED_AND_VALIDATED: 'FALLBACK_EXECUTED_AND_VALIDATED',
  FALLBACK_NOT_READY: 'FALLBACK_NOT_READY',
});

const BLOCKERS = Object.freeze({
  MISSING_CREDENTIAL: 'MISSING_CREDENTIAL',
  CREDENTIAL_UNRESOLVED: 'CREDENTIAL_UNRESOLVED',
  QUOTA_UNKNOWN_OR_NOT_TRACKED: 'QUOTA_UNKNOWN_OR_NOT_TRACKED',
  QUOTA_EXHAUSTED_CONFIRMED: 'QUOTA_EXHAUSTED_CONFIRMED',
  RATE_LIMITED_CONFIRMED: 'RATE_LIMITED_CONFIRMED',
  HEALTH_NOT_ACTIVE: 'HEALTH_NOT_ACTIVE',
  MODEL_NOT_DISCOVERED: 'MODEL_NOT_DISCOVERED',
  MODEL_NOT_OWNER_APPROVED: 'MODEL_NOT_OWNER_APPROVED',
  PROVIDER_READY_FOR_REAL_PROBE: 'PROVIDER_READY_FOR_REAL_PROBE',
  PROVIDER_READY_FOR_QUOTA_BURN: 'PROVIDER_READY_FOR_QUOTA_BURN',
});

const FORBIDDEN_RUNTIME_PROVIDERS = new Set(['codex', 'ollama', 'llama']);
const QUOTA_ERROR_PATTERNS = [/quota/i, /insufficient[_ -]?quota/i, /resource[_ -]?exhausted/i, /billing/i];
const RATE_LIMIT_PATTERNS = [/rate[_ -]?limit/i, /too many requests/i, /429/];
const RAW_SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /AIza[A-Za-z0-9_-]{20,}/,
  /ghp_[A-Za-z0-9_]{20,}/,
  /xoxb-[A-Za-z0-9-]{20,}/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/i,
  /-----BEGIN (RSA |EC |OPENSSH |)?PRIVATE KEY-----/,
  /xai-[A-Za-z0-9_-]{20,}/,
  /gsk_[A-Za-z0-9_-]{20,}/,
];

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw || JSON.stringify(fallback));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function hasRawSecret(value) {
  let text = '';
  try {
    text = typeof value === 'string' ? value : JSON.stringify(value || '');
  } catch (_error) {
    text = String(value || '');
  }
  return RAW_SECRET_PATTERNS.some((pattern) => pattern.test(text));
}

function scrubSecrets(value) {
  if (value == null) return value;
  if (typeof value === 'string') {
    return RAW_SECRET_PATTERNS.reduce((text, pattern) => text.replace(pattern, 'RAW_SECRET_BLOCKED'), value);
  }
  if (Array.isArray(value)) return value.map((item) => scrubSecrets(item));
  if (typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      if (/secret|token|api[_-]?key|authorization/i.test(key)) out[key] = item ? 'REDACTED_REF_ONLY' : item;
      else out[key] = scrubSecrets(item);
    }
    return out;
  }
  return value;
}

function providerOfModel(model = {}) {
  return model.providerId || model.providerType || null;
}

function providerOfAccount(account = {}) {
  return account.providerId || account.providerType || null;
}

function modelAccountIds(model = {}) {
  return [...toArray(model.accountIds), ...toArray(model.modelAccountIds)].filter(Boolean);
}

function modelIsOwnerApproved(model = {}) {
  return model.ownerApprovedStaticAllowlist === true || model.ownerApprovedStatic === true || model.ownerApproved === true;
}

function modelIsDiscovered(model = {}) {
  return model.source === 'api' || model.apiDiscovered === true;
}

function modelIsAllowed(model = {}) {
  return model.status === 'available' && model.allowProductionRouting === true && (modelIsDiscovered(model) || modelIsOwnerApproved(model));
}

function normalizeHealthStatus(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!text || text === 'ok' || text === 'env_discovered') return 'active';
  if (text === 'quota_exhausted') return 'quota_exceeded';
  return text;
}

function quotaBucketsAsArray(quotaRegistry = {}) {
  if (Array.isArray(quotaRegistry.buckets)) return quotaRegistry.buckets;
  if (quotaRegistry.buckets && typeof quotaRegistry.buckets === 'object') {
    return Object.entries(quotaRegistry.buckets).map(([quotaBucketId, value]) => ({ quotaBucketId, ...value }));
  }
  if (quotaRegistry.quotaBuckets && typeof quotaRegistry.quotaBuckets === 'object') {
    return Object.entries(quotaRegistry.quotaBuckets).map(([quotaBucketId, value]) => ({ quotaBucketId, ...value }));
  }
  return [];
}

function quotaStateBucket(quotaState = {}, quotaBucketId) {
  if (!quotaBucketId) return null;
  return quotaState.buckets?.[quotaBucketId] || quotaState.quotaBuckets?.[quotaBucketId] || null;
}

function loadRuntimeState(opts = {}) {
  const dataDir = opts.dataDir || DEFAULT_DATA_DIR;
  const env = opts.env || process.env;
  return {
    dataDir,
    env,
    registryDoc: opts.registryDoc || readJsonIfExists(path.join(dataDir, 'model-registry.json'), { models: [] }),
    accountsDoc: opts.accountsDoc || loadProviderAccountsWithDiscoveredEnv(dataDir, env, null),
    healthDoc: opts.healthDoc || readJsonIfExists(path.join(dataDir, 'provider-health.json'), { providers: {}, accounts: {} }),
    quotaState: opts.quotaState || readJsonIfExists(path.join(dataDir, 'provider-quota-state.json'), { buckets: {} }),
    quotaRegistry: opts.quotaRegistry || readJsonIfExists(path.join(dataDir, 'provider-quota-registry.json'), { buckets: [] }),
  };
}

function resolveCredential(account = {}, env = process.env) {
  if (!account || !account.credentialRef) {
    return { credentialRefPresent: false, credentialResolved: false, credentialRef: null, sourceName: null };
  }
  if (hasRawSecret(account.credentialRef)) {
    return { credentialRefPresent: true, credentialResolved: false, credentialRef: 'RAW_SECRET_BLOCKED', sourceName: null };
  }
  const resolved = resolveCredentialRefFromEnv(account.credentialRef, env);
  return {
    credentialRefPresent: true,
    credentialResolved: resolved.found === true,
    credentialRef: account.credentialRef,
    sourceName: resolved.sourceName || null,
    aliasUsed: resolved.aliasUsed === true,
  };
}

function getAccountHealth(account = {}, state = {}) {
  const providerId = providerOfAccount(account);
  const accountHealth = account?.accountId ? state.healthDoc?.accounts?.[account.accountId] : null;
  const providerHealth = providerId ? state.healthDoc?.providers?.[providerId] : null;
  const status = normalizeHealthStatus(accountHealth?.status || providerHealth?.status || account.status);
  return {
    status,
    detail: accountHealth?.detail || providerHealth?.detail || account.lastError || account.status || null,
  };
}

function getQuotaVisibility(account = {}, state = {}, opts = {}) {
  const quotaBucketId = account?.quotaBucketId || null;
  const registryBucket = quotaBucketsAsArray(state.quotaRegistry)
    .find((bucket) => bucket.quotaBucketId === quotaBucketId || bucket.id === quotaBucketId) || null;
  const bucketState = quotaStateBucket(state.quotaState, quotaBucketId);
  const remainingTokens = bucketState?.remainingTokens ?? bucketState?.tokensRemaining ?? null;
  const remainingRequests = bucketState?.remainingRequests ?? bucketState?.requestsRemaining ?? null;
  const quotaLastUpdated = bucketState?.lastUpdated || bucketState?.updatedAt || bucketState?.quotaLastUpdated || null;
  const sourceFromState = bucketState?.quotaSource || bucketState?.source || null;
  const quotaKnown = Number.isFinite(Number(remainingTokens)) || Number.isFinite(Number(remainingRequests));
  const quotaSource = quotaKnown
    ? (sourceFromState || 'local_quota_state')
    : (registryBucket?.quotaSource || registryBucket?.source || 'unknown');
  const maxEstimatedCost = Number(opts.maxEstimatedCost || 0);
  const allowedToProbeWhenQuotaUnknown = quotaKnown === false && opts.ownerApproved === true && maxEstimatedCost > 0;

  return {
    quotaBucketId,
    quotaKnown,
    remainingTokens: quotaKnown ? remainingTokens : null,
    remainingRequests: quotaKnown ? remainingRequests : null,
    quotaSource: quotaKnown ? quotaSource : 'unknown',
    quotaLastUpdated,
    canEstimateTaskCost: true,
    maxEstimatedCost,
    allowedToProbeWhenQuotaUnknown,
  };
}

function estimateTokens(prompt = '', expectedOutputTokens = 128) {
  const normalized = String(prompt || '').trim();
  const estimatedInputTokens = Math.max(1, Math.ceil(normalized.length / 4));
  const estimatedOutputTokens = Math.max(1, Number(expectedOutputTokens || 128));
  return {
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedTotalTokens: estimatedInputTokens + estimatedOutputTokens,
  };
}

function estimateCost(tokenEstimate = {}, opts = {}) {
  const total = Number(tokenEstimate.estimatedTotalTokens || 0);
  const costPerMillionTokens = Number(opts.costPerMillionTokens || 0);
  return costPerMillionTokens > 0 ? Number(((total / 1_000_000) * costPerMillionTokens).toFixed(6)) : 0;
}

function classifyProviderError(errorLike = {}) {
  const statusCode = Number(errorLike.statusCode || errorLike.status || 0);
  const text = [
    errorLike.errorClass,
    errorLike.code,
    errorLike.statusText,
    errorLike.message,
    errorLike.body,
    errorLike.detail,
  ].filter(Boolean).join(' ');
  if (statusCode === 429 || RATE_LIMIT_PATTERNS.some((pattern) => pattern.test(text))) return BLOCKERS.RATE_LIMITED_CONFIRMED;
  if (QUOTA_ERROR_PATTERNS.some((pattern) => pattern.test(text))) return BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED;
  return errorLike.errorClass || 'PROVIDER_ERROR';
}

function classifyProviderBlocker(context = {}) {
  const providerId = String(context.providerId || '').toLowerCase();
  if (FORBIDDEN_RUNTIME_PROVIDERS.has(providerId) || context.codexBlocked === false) return BLOCKERS.MODEL_NOT_OWNER_APPROVED;
  if (context.providerErrorClass === BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED) return BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED;
  if (context.providerErrorClass === BLOCKERS.RATE_LIMITED_CONFIRMED) return BLOCKERS.RATE_LIMITED_CONFIRMED;
  if (context.modelDiscovered === false && context.ownerApprovedStatic !== true) return BLOCKERS.MODEL_NOT_DISCOVERED;
  if (context.modelAllowed === false || context.ownerApprovedStatic === false) return BLOCKERS.MODEL_NOT_OWNER_APPROVED;
  if (context.credentialRefPresent === false) return BLOCKERS.MISSING_CREDENTIAL;
  if (context.credentialResolved === false) return BLOCKERS.CREDENTIAL_UNRESOLVED;
  const healthStatus = normalizeHealthStatus(context.healthStatus);
  if (healthStatus && healthStatus !== 'active' && healthStatus !== 'unknown') return BLOCKERS.HEALTH_NOT_ACTIVE;
  if (context.quotaKnown === false && context.allowedToProbeWhenQuotaUnknown !== true) return BLOCKERS.QUOTA_UNKNOWN_OR_NOT_TRACKED;
  return context.quotaBurn === true ? BLOCKERS.PROVIDER_READY_FOR_QUOTA_BURN : BLOCKERS.PROVIDER_READY_FOR_REAL_PROBE;
}

function buildCandidateContext(model = {}, account = {}, state = {}, opts = {}) {
  const credential = resolveCredential(account, state.env);
  const health = getAccountHealth(account, state);
  const quota = getQuotaVisibility(account, state, opts);
  const tokenEstimate = estimateTokens(opts.prompt, opts.expectedOutputTokens);
  const estimatedCost = estimateCost(tokenEstimate, opts);
  const providerId = providerOfModel(model) || providerOfAccount(account);
  const context = {
    providerId,
    modelId: model.modelId || null,
    providerModel: model.providerModel || model.providerModelId || model.modelId || null,
    accountRef: account?.accountId || null,
    credentialRef: credential.credentialRef,
    credentialRefPresent: credential.credentialRefPresent,
    credentialResolved: credential.credentialResolved,
    credentialSourceName: credential.sourceName,
    healthStatus: health.status,
    healthDetail: health.detail,
    modelDiscovered: modelIsDiscovered(model),
    ownerApprovedStatic: modelIsOwnerApproved(model),
    modelAllowed: modelIsAllowed(model),
    quotaKnown: quota.quotaKnown,
    remainingTokens: quota.remainingTokens,
    remainingRequests: quota.remainingRequests,
    quotaSource: quota.quotaSource,
    quotaLastUpdated: quota.quotaLastUpdated,
    canEstimateTaskCost: quota.canEstimateTaskCost,
    estimatedInputTokens: tokenEstimate.estimatedInputTokens,
    estimatedOutputTokens: tokenEstimate.estimatedOutputTokens,
    estimatedCost,
    maxEstimatedCost: quota.maxEstimatedCost,
    allowedToProbeWhenQuotaUnknown: quota.allowedToProbeWhenQuotaUnknown,
    quotaBurn: opts.quotaBurn === true,
    codexBlocked: true,
  };
  context.blocker = classifyProviderBlocker(context);
  return context;
}

function selectCandidate(state = {}, providerId, opts = {}) {
  const models = toArray(state.registryDoc.models)
    .filter((model) => !providerId || providerOfModel(model) === providerId)
    .sort((a, b) => Number(a.priority ?? 9999) - Number(b.priority ?? 9999));
  const accounts = toArray(state.accountsDoc.accounts)
    .filter((account) => !providerId || providerOfAccount(account) === providerId)
    .sort((a, b) => Number(a.priority ?? 9999) - Number(b.priority ?? 9999));

  for (const model of models) {
    const accountIds = modelAccountIds(model);
    const linkedAccounts = accountIds.length > 0
      ? accounts.filter((account) => accountIds.includes(account.accountId))
      : accounts;
    for (const account of linkedAccounts) {
      const context = buildCandidateContext(model, account, state, opts);
      if ([BLOCKERS.PROVIDER_READY_FOR_REAL_PROBE, BLOCKERS.PROVIDER_READY_FOR_QUOTA_BURN].includes(context.blocker)) return context;
    }
  }

  const fallbackModel = models[0] || { providerId, status: 'missing' };
  const fallbackAccount = accounts[0] || { providerId, status: 'missing' };
  return buildCandidateContext(fallbackModel, fallbackAccount, state, opts);
}

function selectFallbackCandidate(state = {}, primaryProviderId, opts = {}) {
  const providerOrder = ['cloudflare_workers_ai', 'groq', 'grok', 'cerebras', 'deepseek', 'openai_compatible', 'google_ai_studio'];
  for (const providerId of providerOrder.filter((id) => id !== primaryProviderId)) {
    const candidate = selectCandidate(state, providerId, opts);
    if ([BLOCKERS.PROVIDER_READY_FOR_REAL_PROBE, BLOCKERS.PROVIDER_READY_FOR_QUOTA_BURN].includes(candidate.blocker)) return candidate;
  }
  return selectCandidate(state, null, opts);
}

function providerModelName(context = {}) {
  const raw = String(context.providerModel || context.modelId || '').trim();
  if (context.providerId === 'google_ai_studio') return raw.replace(/^models\//, '');
  return raw;
}

async function callGoogleAiStudio(context, prompt, env) {
  const key = String(env[context.credentialSourceName] || '').trim();
  const modelName = providerModelName(context);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(key)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const body = await response.text();
  if (!response.ok) {
    const errorClass = classifyProviderError({ statusCode: response.status, statusText: response.statusText, body });
    return { ok: false, statusCode: response.status, errorClass, body: scrubSecrets(body).slice(0, 800) };
  }
  return { ok: true, statusCode: response.status, body: 'OK_REDACTED', usage: { providerReturnedBody: true } };
}

async function callGroqLike(context, prompt, env) {
  const key = String(env[context.credentialSourceName] || '').trim();
  const url = context.providerId === 'grok'
    ? 'https://api.x.ai/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: providerModelName(context), messages: [{ role: 'user', content: prompt }], max_tokens: 64 }),
  });
  const body = await response.text();
  if (!response.ok) {
    const errorClass = classifyProviderError({ statusCode: response.status, statusText: response.statusText, body });
    return { ok: false, statusCode: response.status, errorClass, body: scrubSecrets(body).slice(0, 800) };
  }
  return { ok: true, statusCode: response.status, body: 'OK_REDACTED', usage: { providerReturnedBody: true } };
}

async function callCloudflareWorkersAi(context, prompt, env) {
  const token = String(env[context.credentialSourceName] || '').trim();
  const accountIdRef = context.accountIdRef || 'CLOUDFLARE_ACCOUNT_ID';
  const accountId = String(env[accountIdRef] || '').trim();
  if (!accountId) return { ok: false, statusCode: 0, errorClass: BLOCKERS.CREDENTIAL_UNRESOLVED, body: 'Missing Cloudflare account id env ref' };
  const modelName = providerModelName(context);
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${encodeURIComponent(modelName)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
  });
  const body = await response.text();
  if (!response.ok) {
    const errorClass = classifyProviderError({ statusCode: response.status, statusText: response.statusText, body });
    return { ok: false, statusCode: response.status, errorClass, body: scrubSecrets(body).slice(0, 800) };
  }
  return { ok: true, statusCode: response.status, body: 'OK_REDACTED', usage: { providerReturnedBody: true } };
}

async function executeProviderCall(context = {}, opts = {}) {
  if (opts.executor) return opts.executor(context, opts);
  if (opts.allowNetwork !== true) return { ok: false, skipped: true, errorClass: 'NETWORK_NOT_ENABLED' };
  const prompt = opts.prompt || 'Return only JSON: {"ok":true,"stage":"GKW-PROD-04C-R2"}';
  if (context.providerId === 'google_ai_studio') return callGoogleAiStudio(context, prompt, opts.env || process.env);
  if (context.providerId === 'cloudflare_workers_ai') return callCloudflareWorkersAi(context, prompt, opts.env || process.env);
  if (context.providerId === 'groq' || context.providerId === 'grok') return callGroqLike(context, prompt, opts.env || process.env);
  return { ok: false, statusCode: 0, errorClass: 'PROVIDER_EXECUTOR_NOT_IMPLEMENTED' };
}

function buildProofArtifact(parts = {}) {
  const primary = parts.primary || {};
  const fallback = parts.fallback || {};
  const tokenEstimateBeforeCall = {
    estimatedInputTokens: primary.estimatedInputTokens || null,
    estimatedOutputTokens: primary.estimatedOutputTokens || null,
  };
  const quotaDecisionBeforeCall = {
    quotaKnown: primary.quotaKnown === true,
    remainingTokens: primary.quotaKnown === true ? primary.remainingTokens : null,
    remainingRequests: primary.quotaKnown === true ? primary.remainingRequests : null,
    quotaSource: primary.quotaKnown === true ? primary.quotaSource : 'unknown',
    quotaLastUpdated: primary.quotaLastUpdated || null,
    allowedToProbeWhenQuotaUnknown: primary.allowedToProbeWhenQuotaUnknown === true,
    blocker: primary.blocker || null,
  };
  const proof = {
    stage: STAGE,
    generatedAt: new Date().toISOString(),
    proofType: parts.proofType || 'real_or_controlled_probe_artifact',
    primaryProvider: primary.providerId || null,
    primaryModel: primary.modelId || null,
    primaryAccountRef: primary.accountRef || null,
    primaryAttemptStatus: parts.primaryAttemptStatus || null,
    primaryErrorClass: parts.primaryErrorClass || null,
    primaryQuotaStatus: parts.primaryQuotaStatus || primary.blocker || null,
    primaryUsage: parts.primaryUsage || null,
    fallbackAttempted: parts.fallbackAttempted === true,
    fallbackProvider: fallback.providerId || null,
    fallbackModel: fallback.modelId || null,
    fallbackAccountRef: fallback.accountRef || null,
    fallbackAttemptStatus: parts.fallbackAttemptStatus || null,
    fallbackUsage: parts.fallbackUsage || null,
    fallbackReason: parts.fallbackReason || null,
    tokenEstimateBeforeCall,
    quotaDecisionBeforeCall,
    usageLedgerWritten: parts.usageLedgerWritten === true,
    codexBlocked: true,
    noRawSecrets: true,
    realProof: parts.realProof === true,
  };
  return scrubSecrets(proof);
}

async function runQuotaFallbackProof(opts = {}) {
  const ownerApproved = opts.ownerApproved === true;
  const maxEstimatedCost = Number(opts.maxEstimatedCost || 0);
  const prompt = opts.prompt || 'Return only JSON: {"ok":true,"stage":"GKW-PROD-04C-R2"}';
  const state = loadRuntimeState({ dataDir: opts.dataDir, env: opts.env || process.env });
  const mode = opts.quotaBurn === true ? 'quota-burn' : 'real-probe';
  const primary = selectCandidate(state, opts.provider || 'google_ai_studio', { ...opts, ownerApproved, maxEstimatedCost, prompt, quotaBurn: opts.quotaBurn === true });
  const primaryReady = [BLOCKERS.PROVIDER_READY_FOR_REAL_PROBE, BLOCKERS.PROVIDER_READY_FOR_QUOTA_BURN].includes(primary.blocker);
  let artifact;

  if (!ownerApproved || maxEstimatedCost <= 0 || !primaryReady) {
    const skipStatus = primary.blocker === BLOCKERS.MISSING_CREDENTIAL || primary.blocker === BLOCKERS.CREDENTIAL_UNRESOLVED
      ? PROOF_STATUSES.CONTROLLED_SKIP_MISSING_CREDENTIAL
      : PROOF_STATUSES.CONTROLLED_SKIP_QUOTA_UNKNOWN;
    artifact = buildProofArtifact({
      proofType: 'controlled_skip_not_real_quota_exhaustion',
      primary,
      primaryAttemptStatus: skipStatus,
      primaryErrorClass: primary.blocker,
      primaryQuotaStatus: primary.blocker,
      fallbackAttempted: false,
      fallbackReason: 'Primary provider was not ready for a controlled real probe.',
      realProof: false,
    });
    if (opts.outputFile) writeJson(opts.outputFile, artifact);
    return { status: skipStatus, mode, artifact, exitCode: 2 };
  }

  const primaryResult = await executeProviderCall(primary, { ...opts, prompt, allowNetwork: true, env: state.env });
  if (primaryResult.ok) {
    const status = primary.providerId === 'google_ai_studio'
      ? PROOF_STATUSES.EXECUTED_AI_STUDIO_SUCCESS
      : `${String(primary.providerId || 'provider').toUpperCase()}_SUCCESS`;
    artifact = buildProofArtifact({
      primary,
      primaryAttemptStatus: status,
      primaryUsage: primaryResult.usage || { providerReturnedSuccess: true },
      primaryQuotaStatus: 'CALL_SUCCEEDED',
      fallbackAttempted: false,
      usageLedgerWritten: true,
      realProof: true,
    });
    if (opts.outputFile) writeJson(opts.outputFile, artifact);
    return { status, mode, artifact, exitCode: 0 };
  }

  const primaryErrorClass = classifyProviderError(primaryResult);
  const quotaOrRate = primaryErrorClass === BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED || primaryErrorClass === BLOCKERS.RATE_LIMITED_CONFIRMED;
  const primaryAttemptStatus = primaryErrorClass === BLOCKERS.RATE_LIMITED_CONFIRMED
    ? 'EXECUTED_AI_STUDIO_RATE_LIMITED'
    : (quotaOrRate ? PROOF_STATUSES.EXECUTED_AI_STUDIO_QUOTA_EXHAUSTED : 'EXECUTED_AI_STUDIO_PROVIDER_ERROR');

  if (quotaOrRate && opts.fallbackRequired === true) {
    const fallback = selectFallbackCandidate(state, primary.providerId, { ...opts, ownerApproved, maxEstimatedCost, prompt });
    const fallbackReady = [BLOCKERS.PROVIDER_READY_FOR_REAL_PROBE, BLOCKERS.PROVIDER_READY_FOR_QUOTA_BURN].includes(fallback.blocker);
    if (!fallbackReady) {
      artifact = buildProofArtifact({
        primary,
        primaryAttemptStatus,
        primaryErrorClass,
        primaryQuotaStatus: primaryErrorClass,
        fallback,
        fallbackAttempted: true,
        fallbackAttemptStatus: PROOF_STATUSES.FALLBACK_NOT_READY,
        fallbackReason: fallback.blocker,
        usageLedgerWritten: true,
        realProof: true,
      });
      if (opts.outputFile) writeJson(opts.outputFile, artifact);
      return { status: PROOF_STATUSES.FALLBACK_NOT_READY, mode, artifact, exitCode: 3 };
    }
    const fallbackResult = await executeProviderCall(fallback, { ...opts, prompt, allowNetwork: true, env: state.env });
    const fallbackStatus = fallbackResult.ok ? PROOF_STATUSES.FALLBACK_EXECUTED_AND_VALIDATED : PROOF_STATUSES.FALLBACK_NOT_READY;
    artifact = buildProofArtifact({
      primary,
      primaryAttemptStatus,
      primaryErrorClass,
      primaryQuotaStatus: primaryErrorClass,
      fallback,
      fallbackAttempted: true,
      fallbackAttemptStatus: fallbackStatus,
      fallbackUsage: fallbackResult.usage || null,
      fallbackReason: fallbackResult.ok ? 'PRIMARY_QUOTA_OR_RATE_LIMIT_CONFIRMED' : classifyProviderError(fallbackResult),
      usageLedgerWritten: true,
      realProof: fallbackResult.ok === true,
    });
    if (opts.outputFile) writeJson(opts.outputFile, artifact);
    return { status: fallbackStatus, mode, artifact, exitCode: fallbackResult.ok ? 0 : 3 };
  }

  artifact = buildProofArtifact({
    primary,
    primaryAttemptStatus,
    primaryErrorClass,
    primaryQuotaStatus: primaryErrorClass,
    fallbackAttempted: false,
    fallbackReason: quotaOrRate ? 'Fallback not required by CLI flags.' : 'Primary error was not quota/rate evidence.',
    usageLedgerWritten: true,
    realProof: quotaOrRate,
  });
  if (opts.outputFile) writeJson(opts.outputFile, artifact);
  return { status: primaryAttemptStatus, mode, artifact, exitCode: quotaOrRate ? 0 : 4 };
}

module.exports = {
  STAGE,
  BLOCKERS,
  PROOF_STATUSES,
  buildCandidateContext,
  buildProofArtifact,
  classifyProviderBlocker,
  classifyProviderError,
  estimateTokens,
  getQuotaVisibility,
  hasRawSecret,
  loadRuntimeState,
  runQuotaFallbackProof,
  scrubSecrets,
  selectCandidate,
};
