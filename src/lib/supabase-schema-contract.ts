/**
 * CloseFlow Supabase schema contract.
 *
 * Source of truth confirmed on 2026-04-24:
 * - public.workspaces.owner_user_id references auth.users(id) ON DELETE CASCADE
 * - public.profiles.user_id is the profile identity key
 * - public.workspace_members.user_id uses auth.users(id)
 *
 * This file is intentionally tiny and dependency-free.
 * It exists so future AI/code agents can see the current schema direction in code,
 * not only in markdown docs.
 */

export const SUPABASE_SCHEMA_CONTRACT_VERSION = '2026-04-24-auth-users-workspace-v1' as const;

export const SUPABASE_IDENTITY_TABLE = 'auth.users' as const;

export const SUPABASE_WORKSPACE_CONTRACT = {
  identityTable: 'auth.users',
  identityColumn: 'id',
  profileTable: 'public.profiles',
  profileUserColumn: 'user_id',
  profileWorkspaceColumn: 'workspace_id',
  workspaceTable: 'public.workspaces',
  workspacePrimaryColumn: 'id',
  workspaceOwnerColumn: 'owner_user_id',
  workspaceOwnerReference: 'auth.users.id',
  workspaceMembersTable: 'public.workspace_members',
  workspaceMembersUserColumn: 'user_id',
  workspaceMembersWorkspaceColumn: 'workspace_id',
} as const;

export const LEGACY_FIELDS_COMPATIBILITY_ONLY = [
  'firebase_uid',
  'auth_uid',
  'external_auth_uid',
  'public.users',
  'profiles.id',
] as const;

export function isLegacyIdentityField(fieldName: string) {
  return (LEGACY_FIELDS_COMPATIBILITY_ONLY as readonly string[]).includes(fieldName);
}
