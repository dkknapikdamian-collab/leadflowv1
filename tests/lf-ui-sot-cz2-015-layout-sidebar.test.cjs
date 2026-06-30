const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const MOJIBAKE_PATTERN = new RegExp(['\\u00c5', '\\u00c4', '\\u0102', '\\u00e2\\u20ac', '\\uFFFD'].join('|'));

const layoutFiles = [
  'src/components/layout/app-shell.tsx',
  'src/components/layout/page-shell.tsx',
  'src/components/layout/page-header.tsx',
  'src/components/layout/content-rail-layout.tsx',
  'src/components/layout/sidebar-nav.tsx',
];

test('CZ2-015 layout/sidebar SOT files exist', () => {
  for (const file of layoutFiles) assert.equal(exists(file), true, `${file} must exist`);
});

test('CZ2-015 AppShell exports stable API', () => {
  const source = read('src/components/layout/app-shell.tsx');
  for (const token of ['export type AppShellProps', 'children: ReactNode', 'sidebar?: ReactNode', 'mobileNav?: ReactNode', 'className?: string', 'dataAttrs?: LayoutDataAttrs', 'data-cf-layout-source-truth="lf-ui-sot-cz2-015"', 'data-cf-layout-variant="app-shell"']) {
    assert.equal(source.includes(token), true, `AppShell missing ${token}`);
  }
});

test('CZ2-015 PageShell exports stable API', () => {
  const source = read('src/components/layout/page-shell.tsx');
  for (const token of ['export type PageShellProps', 'children: ReactNode', 'header?: ReactNode', 'rail?: ReactNode', 'contentClassName?: string', 'dataAttrs?: LayoutDataAttrs', 'data-cf-layout-source-truth="lf-ui-sot-cz2-015"', 'data-cf-layout-variant="page-shell"']) {
    assert.equal(source.includes(token), true, `PageShell missing ${token}`);
  }
});

test('CZ2-015 PageHeader exports stable API', () => {
  const source = read('src/components/layout/page-header.tsx');
  for (const token of ['export type PageHeaderProps', 'title: ReactNode', 'description?: ReactNode', 'eyebrow?: ReactNode', 'actions?: ReactNode', 'meta?: ReactNode', 'data-cf-layout-source-truth="lf-ui-sot-cz2-015"', 'data-cf-layout-variant="page-header"']) {
    assert.equal(source.includes(token), true, `PageHeader missing ${token}`);
  }
});

test('CZ2-015 ContentRailLayout exports stable API', () => {
  const source = read('src/components/layout/content-rail-layout.tsx');
  for (const token of ['export type ContentRailLayoutProps', 'main: ReactNode', 'rail?: ReactNode', 'mainClassName?: string', 'railClassName?: string', 'data-cf-layout-source-truth="lf-ui-sot-cz2-015"', 'data-cf-layout-variant="content-rail"']) {
    assert.equal(source.includes(token), true, `ContentRailLayout missing ${token}`);
  }
});

test('CZ2-015 SidebarNav uses IconName/AppIcon and has stable API', () => {
  const source = read('src/components/layout/sidebar-nav.tsx');
  for (const token of ['export type SidebarNavItem', 'export type SidebarNavProps', 'items: SidebarNavItem[]', 'footer?: ReactNode', 'iconName?: IconName', 'AppIcon', 'data-cf-layout-source-truth="lf-ui-sot-cz2-015"', 'data-cf-layout-variant="sidebar-nav"']) {
    assert.equal(source.includes(token), true, `SidebarNav missing ${token}`);
  }
  assert.equal(source.includes('lucide-react'), false, 'SidebarNav must not import lucide-react directly');
});

test('CZ2-015 scoped migration uses PageShell and preserves existing header/data paths', () => {
  const source = read('src/pages/ResponseTemplates.tsx');
  for (const token of ["import { PageShell } from '../components/layout/page-shell'", '<PageShell', 'data-cf-layout-scoped-migration', '<CloseFlowPageHeaderV2 pageKey="responseTemplates" />', 'fetchResponseTemplatesFromSupabase', 'createResponseTemplateInSupabase']) {
    assert.equal(source.includes(token), true, `ResponseTemplates scoped migration missing ${token}`);
  }
});

test('CZ2-015 layout components do not import forbidden runtime layers', () => {
  for (const file of layoutFiles) {
    const source = read(file);
    assert.equal(source.includes('lucide-react'), false, `${file} must not import lucide-react`);
    assert.equal(/supabase|data-provider|useWorkspace|useSupabaseSession|workspace-context/i.test(source), false, `${file} must not import forbidden runtime layers`);
    assert.equal(/\.css['"]/i.test(source), false, `${file} must not import CSS`);
  }
});

test('CZ2-015 does not introduce CZ2-016 markers', () => {
  for (const file of [...layoutFiles, 'src/pages/ResponseTemplates.tsx', 'scripts/guards/verify-lf-ui-sot-cz2-015-layout-sidebar.cjs']) {
    assert.equal(read(file).includes('CZ2-016'), false, `${file} must not contain CZ2-016 marker`);
  }
});

test('CZ2-015 source has no mojibake markers', () => {
  for (const file of [...layoutFiles, 'src/pages/ResponseTemplates.tsx', 'scripts/guards/verify-lf-ui-sot-cz2-015-layout-sidebar.cjs']) {
    assert.equal(MOJIBAKE_PATTERN.test(read(file)), false, `${file} contains mojibake marker`);
  }
});
