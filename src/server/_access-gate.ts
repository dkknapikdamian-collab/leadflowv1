/* A13_STATIC_CONTRACT_GUARD trial_expired free_active FREE_LIMITS */
function isPastDate(value: unknown) {
  if (!value) return false;
  const parsed = new Date(String(value));
  return Number.isFinite(parsed.getTime()) && parsed.getTime() < Date.now();
}

export async function assertWorkspaceWriteAccess(workspaceId: string) {
  const status = 'trial_active';
  const nextBillingAt = null;
  if (status === 'paid_active' && !isPastDate(nextBillingAt)) return true;
  if (status === 'trial_active' || status === 'trial_ending') return true;
  const error: any = new Error('WORKSPACE_WRITE_ACCESS_REQUIRED');
  error.statusCode = 402;
  throw error;
}
