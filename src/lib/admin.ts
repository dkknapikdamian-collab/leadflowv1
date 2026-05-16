export type AdminProfileLike = {
  role?: string | null;
  isAdmin?: boolean | null;
  is_admin?: boolean | null;
};

export function isAdminProfile(profile?: AdminProfileLike | null) {
  if (!profile) return false;
  const role = String(profile.role || '').trim().toLowerCase();
  return role === 'admin' || profile.isAdmin === true || profile.is_admin === true;
}

export function isAdminEmail(_email?: string | null) {
  return false;
}

export function isClientSideAdminFallbackDisabled() {
  return true;
}
