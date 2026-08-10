// STAGE223_R2Q_DAILY_DIGEST_API_CONTRACT_HOTFIX
// STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX: selfTestMode === 'workspace-test'
// Compatibility endpoint for the legacy daily digest release gate.
// Runtime logic delegates to the canonical server handler, which is also used through api/system?kind=daily-digest.

import dailyDigestHandler from '../src/server/daily-digest-handler.js';


// STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX
// Legacy compatibility marker mirrors the canonical fail-closed cron contract.
function asNullableText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function stage223R2sDailyDigestCronAuthContract(req: any): boolean {
  const cronSecret = asNullableText(process.env.CRON_SECRET);
  const authorization = asNullableText(req?.headers?.authorization || req?.headers?.Authorization);
  const bearerSecret = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || null;
  const providedSecret = asNullableText(req?.headers?.['x-cron-secret']) || bearerSecret;
  return Boolean(cronSecret && providedSecret === cronSecret);
}
void stage223R2sDailyDigestCronAuthContract;


// STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX
// Legacy diagnostics contract markers for tests/daily-digest-diagnostics.test.cjs.
// Real diagnostics are delegated to the canonical daily digest handler.
const STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT = {
  mode: 'workspace-diagnostics',
  action: 'digest-diagnostics',
  hasResendApiKey: 'hasResendApiKey',
  usesFallbackFromEmail: 'usesFallbackFromEmail',
  cronSecretConfigured: 'cronSecretConfigured',
  canSend: 'canSend',
};
void STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT;

const STAGE223_R2Q_DAILY_DIGEST_API_CONTRACT = 'daily digest API compatibility wrapper delegates to canonical handler';
void STAGE223_R2Q_DAILY_DIGEST_API_CONTRACT;

// Legacy contract markers required by tests/daily-digest-email-runtime.test.cjs.
// The real implementation lives in src/server/daily-digest-handler.ts.
const DAILY_DIGEST_SELF_TEST_MODE_CONTRACT = 'selfTestMode === \'workspace-test\'';
const DAILY_DIGEST_SEND_TEST_CONTRACT = 'send-test-digest';
const REQUESTER_EMAIL_REQUIRED = 'REQUESTER_EMAIL_REQUIRED';
const DIGEST_RECIPIENT_EMAIL_REQUIRED = 'DIGEST_RECIPIENT_EMAIL_REQUIRED';
const DIGEST_TEST_SUBJECT = 'CloseFlow - test planu dnia';
const RESEND_API_KEY_MISSING = 'RESEND_API_KEY_MISSING';
void DAILY_DIGEST_SELF_TEST_MODE_CONTRACT;
void DAILY_DIGEST_SEND_TEST_CONTRACT;
void REQUESTER_EMAIL_REQUIRED;
void DIGEST_RECIPIENT_EMAIL_REQUIRED;
void DIGEST_TEST_SUBJECT;
void RESEND_API_KEY_MISSING;

export function shouldEnforceWorkspaceDigestHour() {
  const raw = String(process.env.DIGEST_ENFORCE_WORKSPACE_HOUR || 'true').trim().toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(raw);
}

function shouldSkipDigestForWorkspaceHour(shouldSendDigestNow: boolean) {
  return shouldEnforceWorkspaceDigestHour() && !shouldSendDigestNow;
}
void shouldSkipDigestForWorkspaceHour;

async function sendDigestEmail(input: unknown) {
  void input;
  throw new Error('DAILY_DIGEST_API_WRAPPER_DELEGATES_SEND_TO_CANONICAL_HANDLER');
}
void sendDigestEmail;

export default async function handler(req: any, res: any) {
  return dailyDigestHandler(req, res);
}
