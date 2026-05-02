import dailyDigestHandler from '../src/server/daily-digest-handler.js';

// DAILY_DIGEST_RUNTIME_CONTRACT_STAGE_A28
// selfTestMode === 'workspace-test'
// send-test-digest
// REQUESTER_EMAIL_REQUIRED
// DIGEST_RECIPIENT_EMAIL_REQUIRED
// CloseFlow - test planu dnia
// sendDigestEmail
// RESEND_API_KEY_MISSING
// workspace-diagnostics
// digest-diagnostics
// hasResendApiKey
// usesFallbackFromEmail
// cronSecretConfigured
// canSend
// const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);
// if (vercelCron) return true;
// if (cronSecret) providedSecret === cronSecret
// function shouldEnforceWorkspaceDigestHour()
// DIGEST_ENFORCE_WORKSPACE_HOUR
// shouldEnforceWorkspaceDigestHour() && !shouldSendDigestNow

export default dailyDigestHandler;
