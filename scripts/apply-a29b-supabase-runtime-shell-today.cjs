const fs = require('fs');
const path = require('path');

const root = process.cwd();
const layoutPath = path.join(root, 'src', 'components', 'Layout.tsx');
const todayPath = path.join(root, 'src', 'pages', 'Today.tsx');
const firebasePath = path.join(root, 'src', 'firebase.ts');
const packagePath = path.join(root, 'package.json');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing file: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function ensureImport(content, importLine, afterLine) {
  if (content.includes(importLine)) return content;
  if (content.includes(afterLine)) {
    return content.replace(afterLine, `${afterLine}\n${importLine}`);
  }
  const firstImportMatch = content.match(/^import .+;$/m);
  if (!firstImportMatch) throw new Error(`Cannot add import: ${importLine}`);
  return content.replace(firstImportMatch[0], `${firstImportMatch[0]}\n${importLine}`);
}

function removeImport(content, importLine) {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== importLine.trim())
    .join('\n');
}

function patchLayout() {
  let content = read(layoutPath);
  const before = content;

  content = removeImport(content, "import { auth } from '../firebase';");
  content = ensureImport(
    content,
    "import { useSupabaseSession } from '../hooks/useSupabaseSession';",
    "import { useWorkspace } from '../hooks/useWorkspace';",
  );
  content = ensureImport(
    content,
    "import { signOutFromSupabase } from '../lib/supabase-auth';",
    "import { useSupabaseSession } from '../hooks/useSupabaseSession';",
  );

  content = content.replace(
    /\n\s*const user = auth\.currentUser;\n/,
    '\n  const [supabaseUser] = useSupabaseSession();\n',
  );

  content = content.replace(
    /const \{ workspace, hasAccess \} = useWorkspace\(\);/,
    'const { workspace, hasAccess, profile } = useWorkspace();',
  );

  const userLabelsBlock = [
    "  const userEmail = profile?.email || supabaseUser?.email || '';",
    "  const userName = profile?.fullName || supabaseUser?.displayName || userEmail || 'U\u017Cytkownik';",
    "  const userInitial = (userName.trim().charAt(0) || userEmail.trim().charAt(0) || 'U').toUpperCase();",
  ].join('\n');

  if (!content.includes('const userEmail = profile?.email || supabaseUser?.email')) {
    const legacyUserBlock = /  const userInitial = [^\n;]+;\n  const userName = [^\n;]+;/;
    if (legacyUserBlock.test(content)) {
      content = content.replace(legacyUserBlock, userLabelsBlock);
    } else {
      const trialLine = /  const trialDaysLeft = workspace\?\.trialEndsAt \? differenceInDays\(parseISO\(workspace\.trialEndsAt\), new Date\(\)\) : 0;\n/;
      if (!trialLine.test(content)) {
        throw new Error('Layout.tsx: cannot find a safe insertion point for Supabase user labels');
      }
      content = content.replace(trialLine, (match) => `${match}${userLabelsBlock}\n`);
    }
  }

  if (!content.includes('const handleSignOut = async () =>')) {
    const marker = '  const handleSidebarPointerRouter = (event: any) => {';
    const handler = [
      '  const handleSignOut = async () => {',
      '    try {',
      '      await signOutFromSupabase();',
      '    } catch (error) {',
      "      console.error('SUPABASE_SIGN_OUT_FAILED', error);",
      '    }',
      '  };',
      '',
    ].join('\n');

    if (!content.includes(marker)) throw new Error('Layout.tsx: cannot find handleSidebarPointerRouter insertion point');
    content = content.replace(marker, `${handler}${marker}`);
  }

  content = content.replace(/email=\{user\?\.email\}/g, 'email={userEmail}');
  content = content.replace(/onClick=\{\(\) => auth\.signOut\(\)\}/g, 'onClick={() => void handleSignOut()}');
  content = content.replace(/auth\.signOut\(\)/g, 'signOutFromSupabase()');

  const forbidden = [
    "../firebase",
    'auth.currentUser',
    'auth.signOut',
  ];
  const foundForbidden = forbidden.filter((item) => content.includes(item));
  if (foundForbidden.length > 0) {
    throw new Error(`Layout.tsx still contains forbidden Firebase runtime markers: ${foundForbidden.join(', ')}`);
  }

  const required = [
    'useSupabaseSession',
    'signOutFromSupabase',
    'profile',
    'userEmail',
    'handleSignOut',
    'email={userEmail}',
  ];
  const missing = required.filter((item) => !content.includes(item));
  if (missing.length > 0) {
    throw new Error(`Layout.tsx missing required Supabase runtime markers: ${missing.join(', ')}`);
  }

  if (content !== before) write(layoutPath, content);
}

function patchToday() {
  let content = read(todayPath);
  const before = content;

  content = removeImport(content, "import { auth } from '../firebase';");

  if (content.includes("../firebase") || /\bauth\s*\./.test(content)) {
    throw new Error('Today.tsx still contains Firebase Auth runtime usage');
  }

  if (content !== before) write(todayPath, content);
}

function patchFirebaseLegacyMarker() {
  if (!fs.existsSync(firebasePath)) return;
  let content = read(firebasePath);
  const marker = 'A29_LEGACY_FIREBASE_RUNTIME_MARKER';
  if (!content.includes(marker)) {
    content = content.replace(
      'const app = initializeApp(firebaseConfig);',
      `// ${marker}: Firebase zostaje tylko jako legacy compatibility do p\u00F3\u017Aniejszego wygaszenia.\n// Runtime shell i ekran Dzi\u015B nie mog\u0105 u\u017Cywa\u0107 Firebase Auth.\nconst app = initializeApp(firebaseConfig);`,
    );
    write(firebasePath, content);
  }
}

function patchPackageScript() {
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:a29-supabase-runtime-shell'] = 'node scripts/check-a29-supabase-runtime-shell.cjs';
  write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

patchLayout();
patchToday();
patchFirebaseLegacyMarker();
patchPackageScript();
console.log('OK: A29b Supabase runtime shell/Today patch applied.');
