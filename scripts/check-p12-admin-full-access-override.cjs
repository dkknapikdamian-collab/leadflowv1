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

const useWorkspace = read('src/hooks/useWorkspace.ts');
const plans = read('src/lib/plans.ts');
const pkg = JSON.parse(read('package.json'));

expect(useWorkspace.includes('ADMIN_FULL_FEATURES'), 'useWorkspace must define admin full feature override');
expect(useWorkspace.includes('ai: true'), 'admin override must enable AI');
expect(useWorkspace.includes('fullAi: true'), 'admin override must enable fullAi');
expect(useWorkspace.includes('googleCalendar: true'), 'admin override must enable Google Calendar');
expect(useWorkspace.includes('weeklyReport: true'), 'admin override must enable weekly report');
expect(useWorkspace.includes('csvImport: true'), 'admin override must enable CSV import');
expect(useWorkspace.includes('recurringReminders: true'), 'admin override must enable recurring reminders');
expect(useWorkspace.includes('browserNotifications: true'), 'admin override must enable browser notifications');
expect(useWorkspace.includes('ADMIN_UNLIMITED_LIMITS'), 'useWorkspace must define admin unlimited limits override');
expect(useWorkspace.includes('activeLeads: null'), 'admin override must set activeLeads to unlimited');
expect(useWorkspace.includes('activeTasks: null'), 'admin override must set activeTasks to unlimited');
expect(useWorkspace.includes('activeEvents: null'), 'admin override must set activeEvents to unlimited');
expect(useWorkspace.includes('activeDrafts: null'), 'admin override must set activeDrafts to unlimited');
expect(useWorkspace.includes('buildAdminAccessOverride(access)'), 'useWorkspace must build final admin access');
expect(useWorkspace.includes('const finalAccess = isAdmin ? buildAdminAccessOverride(access) : access;'), 'useWorkspace must compute finalAccess after isAdmin');
expect(useWorkspace.includes('hasAccess: finalAccess.hasAccess'), 'useWorkspace return must use finalAccess.hasAccess');
expect(useWorkspace.includes('isPaidActive: finalAccess.isPaidActive'), 'useWorkspace return must use finalAccess.isPaidActive');
expect(useWorkspace.includes('access: finalAccess'), 'useWorkspace must return finalAccess');
expect(useWorkspace.includes('adminOverride: true'), 'admin access should be visibly marked as adminOverride');
expect(!useWorkspace.includes('hasAccess: access.hasAccess || isAdmin'), 'old admin-only hasAccess bypass should not remain');

expect(plans.includes('const PRO_FEATURES'), 'plans.ts must still keep Pro feature definition');
expect(plans.includes('const AI_FEATURES'), 'plans.ts must still keep AI feature definition');
expect(plans.includes('ai: true'), 'plans.ts must still contain AI feature plan');
expect(pkg.scripts && pkg.scripts['check:p12-admin-full-access-override'], 'package.json missing check:p12-admin-full-access-override');

if (fail.length) {
  console.error('P12 admin full access override guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P12 admin full access override guard passed.');
