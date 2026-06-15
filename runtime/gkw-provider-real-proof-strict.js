const fs = require('node:fs');
const base = require('./gkw-provider-real-proof');

const SAME_PROVIDER_FALLBACK_BLOCKER = 'NO_SECOND_PROVIDER_MODEL_ACCOUNT';

function writeJson(filePath, payload) {
  fs.mkdirSync(require('node:path').dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function validateProofArtifact(artifact = {}) {
  const errors = [];
  if (artifact.noRawSecrets !== true) errors.push('NO_RAW_SECRETS_FLAG_MISSING');
  if (base.hasRawSecret(artifact)) errors.push('RAW_SECRET_DETECTED_IN_PROOF');
  if (artifact.quotaDecisionBeforeCall?.quotaSource === 'unknown') {
    if (artifact.quotaDecisionBeforeCall.remainingTokens !== null) errors.push('UNKNOWN_QUOTA_WITH_REMAINING_TOKENS');
    if (artifact.quotaDecisionBeforeCall.remainingRequests !== null) errors.push('UNKNOWN_QUOTA_WITH_REMAINING_REQUESTS');
  }
  if (artifact.fallbackAttemptStatus === base.PROOF_STATUSES.FALLBACK_EXECUTED_AND_VALIDATED) {
    if (!artifact.fallbackProvider || !artifact.fallbackModel || !artifact.fallbackAccountRef) errors.push('FALLBACK_PROOF_MISSING_SECOND_PROVIDER_MODEL_ACCOUNT');
    if (artifact.fallbackProvider === artifact.primaryProvider && artifact.fallbackAccountRef === artifact.primaryAccountRef) {
      errors.push('FALLBACK_REUSED_PRIMARY_PROVIDER_ACCOUNT');
    }
    if (artifact.realProof !== true) errors.push('REAL_FALLBACK_WITHOUT_REAL_PROOF_FLAG');
  }
  if (artifact.primaryAttemptStatus && /^CONTROLLED_SKIP/.test(artifact.primaryAttemptStatus)) {
    if (artifact.primaryErrorClass === base.BLOCKERS.QUOTA_EXHAUSTED_CONFIRMED || artifact.primaryErrorClass === base.BLOCKERS.RATE_LIMITED_CONFIRMED) {
      errors.push('CONTROLLED_SKIP_LABELED_AS_REAL_QUOTA_EVIDENCE');
    }
  }
  return { ok: errors.length === 0, errors };
}

async function runQuotaFallbackProof(opts = {}) {
  const result = await base.runQuotaFallbackProof(opts);
  const artifact = result.artifact || {};

  if (artifact.fallbackAttempted === true && artifact.fallbackProvider === artifact.primaryProvider && artifact.fallbackAccountRef === artifact.primaryAccountRef) {
    artifact.fallbackAttemptStatus = base.PROOF_STATUSES.FALLBACK_NOT_READY;
    artifact.fallbackReason = SAME_PROVIDER_FALLBACK_BLOCKER;
    artifact.realProof = false;
    result.status = base.PROOF_STATUSES.FALLBACK_NOT_READY;
    result.exitCode = 3;
  }

  const validation = validateProofArtifact(artifact);
  artifact.validation = validation;
  if (!validation.ok && artifact.fallbackAttemptStatus === base.PROOF_STATUSES.FALLBACK_EXECUTED_AND_VALIDATED) {
    artifact.fallbackAttemptStatus = base.PROOF_STATUSES.FALLBACK_NOT_READY;
    artifact.fallbackReason = validation.errors.join(',');
    artifact.realProof = false;
    result.status = base.PROOF_STATUSES.FALLBACK_NOT_READY;
    result.exitCode = 3;
  }

  if (opts.outputFile) writeJson(opts.outputFile, artifact);
  return result;
}

module.exports = {
  ...base,
  SAME_PROVIDER_FALLBACK_BLOCKER,
  runQuotaFallbackProof,
  validateProofArtifact,
};
