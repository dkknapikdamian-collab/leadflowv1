import { findWorkspaceId, updateById } from './_supabase.js';

function parseBody(body: unknown) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return body as Record<string, unknown>;
}

function asNullableString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'PATCH') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req.body);
    const workspaceId = (await findWorkspaceId(body.workspaceId)) || asNullableString(body.workspaceId);
    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
      return;
    }

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.planId !== undefined) payload.plan_id = body.planId;
    if (body.subscriptionStatus !== undefined) payload.subscription_status = body.subscriptionStatus;
    if (body.trialEndsAt !== undefined) {
      payload.trial_ends_at = body.trialEndsAt ? new Date(String(body.trialEndsAt)).toISOString() : null;
    }

    const updated = await updateById(String('workspaces'), String(workspaceId), payload);
    const row = Array.isArray(updated) && updated[0] ? updated[0] : null;

    res.status(200).json({
      ok: true,
      workspace: {
        id: workspaceId,
        planId: (row as any)?.plan_id ?? body.planId ?? null,
        subscriptionStatus: (row as any)?.subscription_status ?? body.subscriptionStatus ?? null,
        trialEndsAt: (row as any)?.trial_ends_at ?? body.trialEndsAt ?? null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'WORKSPACE_SUBSCRIPTION_UPDATE_FAILED' });
  }
}
