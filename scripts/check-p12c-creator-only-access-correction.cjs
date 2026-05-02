#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const apiMe = read('api/me.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const useWorkspace = read('src/hooks/useWorkspace.ts');
const todayAi = read('src/components/TodayAiAssistant.tsx');
const pkg = JSON.parse(read('package.json'));

expect(apiMe.includes('type AppOwnerIdentity'), 'api/me must define AppOwnerIdentity');
expect(apiMe.includes('resolveAppOwnerIdentity'), 'api/me must resolve app owner identity');
expect(apiMe.includes('fetchAppOwnerGrant'), 'api/me must support app_owners backend lookup');
expect(apiMe.includes('app_owners?status=eq.active'), 'api/me must query active app_owners grants');
expect(apiMe.includes('CLOSEFLOW_APP_OWNER_UIDS'), 'api/me must support UID owner env');
expect(apiMe.includes('CLOSEFLOW_SERVER_APP_OWNER_UIDS'), 'api/me must support server UID owner env');
expect(apiMe.includes('isAppOwner: appOwner'), 'api/me must return isAppOwner');
expect(apiMe.includes("appRole: appOwner ? appOwnerRole : 'workspace'"), 'api/me must expose resolved app owner role or workspace');
expect(apiMe.includes('appOwnerSource'), 'api/me must expose appOwnerSource diagnostics');
expect(!apiMe.includes("const appOwner = isServerConfiguredAdminEmail(email);"), 'api/me must not resolve app owner from email only');

expect(fallback.includes('isAppOwner?: boolean'), 'client MeResponse type must include isAppOwner');
expect(fallback.includes('appRole?: string'), 'client MeResponse type must include appRole');

expect(useWorkspace.includes('CREATOR_FULL_FEATURES'), 'useWorkspace must define creator feature override');
expect(useWorkspace.includes('CREATOR_UNLIMITED_LIMITS'), 'useWorkspace must define creator unlimited limits');
expect(useWorkspace.includes('function isCreatorProfile'), 'useWorkspace must distinguish creator from workspace admin');
expect(useWorkspace.includes('const isAppOwner = isCreatorProfile(profile);'), 'useWorkspace must compute isAppOwner');
expect(useWorkspace.includes('const finalAccess = isAppOwner ? buildCreatorAccessOverride(access) : access;'), 'full override must be creator-only');
expect(useWorkspace.includes('creatorOverride: true'), 'final access must mark creatorOverride');
expect(useWorkspace.includes('adminOverride: false'), 'final access must avoid broad adminOverride meaning');
expect(useWorkspace.includes('ai: true'), 'creator override must enable AI');
expect(useWorkspace.includes('fullAi: true'), 'creator override must enable full AI');
expect(useWorkspace.includes('activeLeads: null'), 'creator override must make lead limit unlimited');
expect(useWorkspace.includes('activeDrafts: null'), 'creator override must make draft limit unlimited');
expect(useWorkspace.includes('isAppOwner,'), 'useWorkspace must expose isAppOwner');
expect(useWorkspace.includes('access: finalAccess'), 'useWorkspace must return finalAccess');

expect(!useWorkspace.includes('ADMIN_FULL_FEATURES'), 'old broad ADMIN_FULL_FEATURES must not remain');
expect(!useWorkspace.includes('buildAdminAccessOverride'), 'old broad buildAdminAccessOverride must not remain');
expect(!useWorkspace.includes('const finalAccess = isAdmin ?'), 'workspace admin must not trigger full creator access');
expect(!useWorkspace.includes('hasAccess: access.hasAccess || isAdmin'), 'old workspace admin access bypass must not remain');

expect(todayAi.includes('const { workspace, profile, isAppOwner } = useWorkspace();'), 'Today AI must use isAppOwner');
expect(todayAi.includes('const aiUsageAdminExempt = Boolean(isAppOwner);'), 'AI usage exemption must be creator-based');
expect(todayAi.includes('{ isAdmin: aiUsageAdminExempt }'), 'AI usage guard must receive creator-based exemption');
expect(!todayAi.includes('const { workspace, profile, isAdmin } = useWorkspace();'), 'Today AI must not read workspace isAdmin for AI exemption');

expect(pkg.scripts && pkg.scripts['check:p12c-creator-only-access-correction'], 'package.json missing check:p12c-creator-only-access-correction');
expect(pkg.scripts && pkg.scripts['check:p12-admin-full-access-override'] === 'node scripts/check-p12c-creator-only-access-correction.cjs', 'old P12 script must point to corrected creator-only guard');

if (fail.length) {
  console.error('P12C/P13 creator-only identity guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P12C/P13 creator-only identity guard passed.');
