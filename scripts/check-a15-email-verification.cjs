const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];

function mustContain(file, needle, label) {
  const text = read(file);
  if (!text.includes(needle)) failures.push(`${file}: missing ${label || needle}`);
}

function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(rel);
    return rel;
  });
}

if (!exists('src/components/EmailVerificationGate.tsx')) {
  failures.push('missing src/components/EmailVerificationGate.tsx');
}

mustContain('src/lib/supabase-auth.ts', 'emailConfirmedAt: string | null', 'session emailConfirmedAt');
mustContain('src/lib/supabase-auth.ts', 'emailVerified: boolean', 'session emailVerified');
mustContain('src/lib/supabase-auth.ts', 'isSupabaseEmailVerificationRequiredForUser', 'frontend verification decision helper');
mustContain('src/lib/supabase-auth.ts', 'resendEmailConfirmation', 'resend confirmation helper');
mustContain('src/lib/supabase-auth.ts', 'supabase.auth.resend', 'Supabase resend API');
mustContain('src/lib/supabase-auth.ts', 'email_confirmed_at', 'Supabase email_confirmed_at check');
mustContain('src/lib/supabase-auth.ts', 'email_verified', 'OAuth verified email check');

mustContain('src/components/EmailVerificationGate.tsx', 'Potwierd e-mail', 'confirmation screen title');
mustContain('src/components/EmailVerificationGate.tsx', 'Wylij ponownie', 'resend button');
mustContain('src/components/EmailVerificationGate.tsx', 'Sprawdziem, odwie', 'refresh button');
mustContain('src/components/EmailVerificationGate.tsx', 'Google OAuth nie jest blokowany', 'Google OAuth copy');

mustContain('src/App.tsx', 'EmailVerificationGate', 'App gate component');
mustContain('src/App.tsx', 'isSupabaseEmailVerificationRequiredForUser(user)', 'App gate condition');
mustContain('src/App.tsx', 'return;', 'App avoids profile bootstrap for unconfirmed user');

mustContain('src/server/_supabase-auth.ts', 'EMAIL_CONFIRMATION_REQUIRED', 'server error code');
mustContain('src/server/_supabase-auth.ts', 'assertSupabaseEmailVerifiedForMutation', 'server mutation assertion');
mustContain('src/server/_supabase-auth.ts', 'email_confirmed_at', 'server email_confirmed_at check');
mustContain('src/server/_supabase-auth.ts', 'confirmed_at', 'server confirmed_at check');
mustContain('src/server/_supabase-auth.ts', 'email_verified', 'server verified email check');
mustContain('src/server/_supabase-auth.ts', 'authProviders', 'server providers');

mustContain('src/server/_access-gate.ts', 'assertSupabaseEmailVerifiedForMutation', 'access gate email assertion');
mustContain('src/server/_access-gate.ts', 'assertWorkspaceWriteAccess(workspaceId: string, req?: any)', 'access gate optional request argument');

mustContain('api/me.ts', 'email_unconfirmed', '/api/me unconfirmed status');
mustContain('api/me.ts', 'emailVerification', '/api/me email verification payload');

const apiFiles = walk('api').filter((file) => file.endsWith('.ts'));
for (const file of apiFiles) {
  const text = read(file);
  const bad = [...text.matchAll(/assertWorkspaceWriteAccess\(([^,\n\r\)]*)\);/g)];
  if (bad.length) failures.push(`${file}: assertWorkspaceWriteAccess call without req`);
}

const packageJson = JSON.parse(read('package.json'));
if (!packageJson.scripts || packageJson.scripts['check:a15-email-verification'] !== 'node scripts/check-a15-email-verification.cjs') {
  failures.push('package.json: missing check:a15-email-verification script');
}

if (failures.length) {
  console.error('A15 email verification guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: A15 email verification guard passed.');
