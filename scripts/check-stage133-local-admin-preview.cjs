/* CLOSEFLOW_STAGE133_LOCAL_ADMIN_PREVIEW_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(file, marker) {
  const content = read(file);
  if (!content.includes(marker)) {
    throw new Error(`${file} missing required marker: ${marker}`);
  }
}

function mustNotInclude(file, marker) {
  const content = read(file);
  if (content.includes(marker)) {
    throw new Error(`${file} contains forbidden marker: ${marker}`);
  }
}

mustInclude('src/hooks/useWorkspace.ts', 'CLOSEFLOW_STAGE133_LOCAL_ADMIN_PREVIEW');
mustInclude('src/hooks/useWorkspace.ts', 'buildLocalAdminPreviewProfile');
mustInclude('src/hooks/useWorkspace.ts', "role: 'admin'");
mustInclude('src/hooks/useWorkspace.ts', 'isAdmin: true');
mustInclude('src/hooks/useWorkspace.ts', 'isAppOwner: true');
mustInclude('src/hooks/useWorkspace.ts', "appRole: 'creator'");
mustInclude('src/hooks/useWorkspace.ts', 'import.meta.env.DEV ? buildLocalAdminPreviewProfile');

mustInclude('src/components/Layout.tsx', 'const canUseAdminDebugToolbar = Boolean(isAdmin || isAppOwner);');
mustInclude('src/components/Layout.tsx', "label: 'Admin AI'");
mustInclude('src/components/Layout.tsx', '<AdminDebugToolbar currentSection={currentSection} />');

[
  'VITE_CLOSEFLOW_UI_PREVIEW_AUTH',
  'UiPreviewModeBadge',
  'closeflow-ui-preview-auth-stage131.css',
].forEach((marker) => {
  if (fs.existsSync(path.join(root, 'src/App.tsx'))) {
    mustNotInclude('src/App.tsx', marker);
  }
});

[
  'src/lib/ui-preview-auth.ts',
  'src/components/UiPreviewModeBadge.tsx',
  'src/styles/closeflow-ui-preview-auth-stage131.css',
  'scripts/check-stage131-ui-preview-auth.cjs',
].forEach((rel) => {
  if (fs.existsSync(path.join(root, rel))) {
    throw new Error(`Stage131 leftover still exists: ${rel}`);
  }
});

console.log('OK: Stage133 local admin preview guard passed.');
