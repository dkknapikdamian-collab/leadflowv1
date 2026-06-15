#!/usr/bin/env node
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { runQuotaFallbackProof } = require('../runtime/gkw-provider-real-proof-strict');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const out = {
    provider: 'google_ai_studio',
    dataDir: path.join(repoRoot, 'runtime', 'data'),
    outputFile: path.join(repoRoot, '_project', 'fixtures', 'gkw-prod-04c', 'provider-readiness', 'quota_fallback_proof.json'),
    expectedOutputTokens: 128,
    prompt: 'Return only JSON: {"ok":true,"stage":"GKW-PROD-04C-R2"}',
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--provider') { out.provider = next; i += 1; }
    else if (arg === '--data-dir') { out.dataDir = path.resolve(next); i += 1; }
    else if (arg === '--out') { out.outputFile = path.resolve(next); i += 1; }
    else if (arg === '--prompt') { out.prompt = next; i += 1; }
    else if (arg === '--expected-output-tokens') { out.expectedOutputTokens = Number(next); i += 1; }
    else if (arg === '--max-estimated-cost') { out.maxEstimatedCost = Number(next); i += 1; }
    else if (arg === '--max-attempts') { out.maxAttempts = Number(next); i += 1; }
    else if (arg === '--owner-approved') out.ownerApproved = true;
    else if (arg === '--real-probe') out.realProbe = true;
    else if (arg === '--quota-burn') out.quotaBurn = true;
    else if (arg === '--fallback-required') out.fallbackRequired = true;
    else if (arg === '--json') out.json = true;
    else if (arg === '--help' || arg === '-h') out.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return out;
}

function usage() {
  return `GKW-PROD-04C-R2 strict real quota/fallback proof

Real probe:
  node scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs --provider google_ai_studio --real-probe --owner-approved --max-estimated-cost 5

Quota burn / fallback proof:
  node scripts/gkw-prod-04c-r2-real-quota-fallback-proof.mjs --provider google_ai_studio --quota-burn --fallback-required --owner-approved --max-attempts 20 --max-estimated-cost 5

This command does not use Codex, Ollama or Llama. It writes only a redacted proof artifact.
`;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.realProbe && !args.quotaBurn)) {
    console.log(usage());
    process.exit(args.help ? 0 : 2);
  }
  if (!args.ownerApproved) throw new Error('STOP: --owner-approved is required for any real provider probe.');
  if (!(Number(args.maxEstimatedCost) > 0)) throw new Error('STOP: --max-estimated-cost > 0 is required for controlled probe.');

  const result = await runQuotaFallbackProof({
    provider: args.provider,
    dataDir: args.dataDir,
    outputFile: args.outputFile,
    ownerApproved: args.ownerApproved,
    maxEstimatedCost: args.maxEstimatedCost,
    maxAttempts: args.maxAttempts,
    realProbe: args.realProbe,
    quotaBurn: args.quotaBurn,
    fallbackRequired: args.fallbackRequired,
    prompt: args.prompt,
    expectedOutputTokens: args.expectedOutputTokens,
  });

  const summary = {
    status: result.status,
    mode: result.mode,
    outputFile: args.outputFile,
    primaryProvider: result.artifact?.primaryProvider || null,
    primaryAttemptStatus: result.artifact?.primaryAttemptStatus || null,
    primaryErrorClass: result.artifact?.primaryErrorClass || null,
    fallbackAttempted: result.artifact?.fallbackAttempted === true,
    fallbackAttemptStatus: result.artifact?.fallbackAttemptStatus || null,
    fallbackReason: result.artifact?.fallbackReason || null,
    validation: result.artifact?.validation || null,
    realProof: result.artifact?.realProof === true,
    noRawSecrets: result.artifact?.noRawSecrets === true,
  };

  console.log(JSON.stringify(args.json ? result.artifact : summary, null, 2));
  process.exit(result.exitCode || 0);
}

main().catch((error) => {
  console.error(JSON.stringify({ status: 'FAILED', error: error.message }, null, 2));
  process.exit(1);
});
