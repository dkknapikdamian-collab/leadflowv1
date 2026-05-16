import { normalizeWorkspaceContextId } from './supabase-fallback';

export function requireWorkspaceId(workspace: any) {
  return normalizeWorkspaceContextId(workspace?.id);
}
