const fs = require('fs');
const path = require('path');

const root = process.cwd();
const todayPath = path.join(root, 'src', 'pages', 'Today.tsx');
const packagePath = path.join(root, 'package.json');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing file: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function removeExactImport(content, importLine) {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== importLine.trim())
    .join('\n');
}

function ensureImportAfter(content, importLine, afterLine) {
  if (content.includes(importLine)) return content;
  if (!content.includes(afterLine)) {
    throw new Error(`Cannot add import. Missing anchor: ${afterLine}`);
  }
  return content.replace(afterLine, `${afterLine}\n${importLine}`);
}

function insertSupabaseUserHook(content) {
  if (content.includes('const activeUserId = supabaseUser?.uid || supabaseUser?.id ||')) return content;

  const lines = content.split(/\n/);
  const workspaceHookIndex = lines.findIndex((line) =>
    /^\s*const\s+\{/.test(line) && line.includes('useWorkspace()') && line.trim().endsWith(';'),
  );

  if (workspaceHookIndex === -1) {
    throw new Error('Today.tsx: cannot find single-line useWorkspace() hook anchor for Supabase user runtime');
  }

  const indentMatch = lines[workspaceHookIndex].match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : '  ';
  lines.splice(workspaceHookIndex + 1, 0,
    `${indent}const [supabaseUser, supabaseSessionLoading] = useSupabaseSession();`,
    `${indent}const activeUserId = supabaseUser?.uid || supabaseUser?.id || '';`,
  );

  return lines.join('\n');
}

function collectFirebaseRuntimeMarkers(content) {
  const markers = [];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes("../firebase") || /\bauth\s*\./.test(line) || /\bauth\s*\?\./.test(line)) {
      markers.push(`line ${index + 1}: ${line.trim()}`);
    }
  });
  return markers;
}

function patchToday() {
  let content = read(todayPath);
  const before = content;

  content = removeExactImport(content, "import { auth } from '../firebase';");
  content = ensureImportAfter(
    content,
    "import { useSupabaseSession } from '../hooks/useSupabaseSession';",
    "import { useWorkspace } from '../hooks/useWorkspace';",
  );
  content = insertSupabaseUserHook(content);

  content = content.replace(/!auth\.currentUser/g, 'supabaseSessionLoading || !activeUserId');
  content = content.replace(/auth\.currentUser\?\.uid\s*\?\?\s*null/g, '(activeUserId || null)');
  content = content.replace(/auth\.currentUser\?\.uid\s*\|\|\s*null/g, '(activeUserId || null)');
  content = content.replace(/auth\.currentUser\?\.uid/g, '(activeUserId || undefined)');
  content = content.replace(/auth\.currentUser\.uid/g, 'activeUserId');

  const markers = collectFirebaseRuntimeMarkers(content);
  if (markers.length > 0) {
    console.error('Today.tsx still contains Firebase Auth runtime markers after A29e patch:');
    for (const marker of markers) console.error(`- ${marker}`);
    throw new Error('A29e Today Firebase runtime replacement incomplete');
  }

  const required = [
    "import { useSupabaseSession } from '../hooks/useSupabaseSession';",
    'const [supabaseUser, supabaseSessionLoading] = useSupabaseSession();',
    "const activeUserId = supabaseUser?.uid || supabaseUser?.id || '';",
  ];
  const missing = required.filter((marker) => !content.includes(marker));
  if (missing.length > 0) {
    throw new Error(`Today.tsx missing required Supabase user runtime markers: ${missing.join(', ')}`);
  }

  if (content !== before) write(todayPath, content);
}

function patchPackageScript() {
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:a29-supabase-runtime-shell'] = 'node scripts/check-a29-supabase-runtime-shell.cjs';
  write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

patchToday();
patchPackageScript();
console.log('OK: A29e Today runtime now uses Supabase user id instead of Firebase Auth.');
