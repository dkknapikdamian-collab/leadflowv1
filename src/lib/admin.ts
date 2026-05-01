export type AdminProfileInput = {
  role?: string | null;
  isAdmin?: boolean | null;
  is_admin?: boolean | null;
};

export function isAdminProfile(profile?: AdminProfileInput | null) {
  if (!profile) return false;
  return profile.isAdmin === true || profile.is_admin === true || String(profile.role || '').trim().toLowerCase() === 'admin';
}

// Legacy compatibility only.
// Admin must come from /api/me profile.isAdmin / profile.role, not from a client-side email allowlist.
export function isAdminEmail(_email?: string | null) {
  return false;
}
