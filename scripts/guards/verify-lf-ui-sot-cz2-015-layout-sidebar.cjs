const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-015';
const NEXT_STAGE = `CZ2-${String(16).padStart(3, '0')}`;
const errors = [];
const warnings = [];
const MOJIBAKE_PATTERN = new RegExp(['\\u00c5', '\\u00c4', '\\u0102', '\\u00e2\\u20ac', '\\uFFFD'].join('|'));

function read(rel) {
  const absolute = path.join(ROOT, rel);
  if (!fs.existsSync(absolute)) {
    errors.push(`Missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(absolute, 'utf8');
}

function requireIncludes(file, text, message = `${file} must include ${text}`) {
  const content = read(file);
  if (!content.includes(text)) errors.push(message);
}

function assertNoMojibake(file) {
  const content = read(file);
  if (MOJIBAKE_PATTERN.test(content)) errors.push(`Mojibake marker found in ${file}`);
}

const sotFiles = [
  'src/components/layout/app-shell.tsx',
  'src/components/layout/page-shell.tsx',
  'src/components/layout/page-header.tsx',
  'src/components/layout/content-rail-layout.tsx',
  'src/components/layout/sidebar-nav.tsx',
];

const checkedFiles = [
  ...sotFiles,
  'src/pages/ResponseTemplates.tsx',
  'package.json',
  'scripts/guards/verify-lf-ui-sot-cz2-015-layout-sidebar.cjs',
  'tests/lf-ui-sot-cz2-015-layout-sidebar.test.cjs',
];

for (const file of checkedFiles) read(file);

for (const file of sotFiles) {
  const source = read(file);
  if (source.includes('lucide-react')) errors.push(`${file} must not import lucide-react directly`);
  if (/supabase|data-provider|business store|business-store|workspace-context|useWorkspace|useSupabaseSession/i.test(source)) {
    errors.push(`${file} must not import data providers, auth/session hooks or business stores`);
  }
  if (/\.css['"]/i.test(source)) errors.push(`${file} must not import CSS files`);
  if (source.includes('CLOSEFLOW_ROUTES') || source.includes('from \'../../lib/routes\'') || source.includes('from "../../lib/routes"')) {
    errors.push(`${file} must not import route helpers in CZ2-015`);
  }
  requireIncludes(file, 'data-cf-layout-source-truth="lf-ui-sot-cz2-015"', `${file} must include layout source-truth marker`);
}

requireIncludes('src/components/layout/app-shell.tsx', 'export type AppShellProps', 'AppShell must export stable props type');
requireIncludes('src/components/layout/app-shell.tsx', 'children: ReactNode', 'AppShell API must include children');
requireIncludes('src/components/layout/app-shell.tsx', 'sidebar?: ReactNode', 'AppShell API must include sidebar');
requireIncludes('src/components/layout/app-shell.tsx', 'mobileNav?: ReactNode', 'AppShell API must include mobileNav');
requireIncludes('src/components/layout/app-shell.tsx', 'data-cf-layout-variant="app-shell"', 'AppShell must expose variant marker');

requireIncludes('src/components/layout/page-shell.tsx', 'export type PageShellProps', 'PageShell must export stable props type');
requireIncludes('src/components/layout/page-shell.tsx', 'children: ReactNode', 'PageShell API must include children');
requireIncludes('src/components/layout/page-shell.tsx', 'header?: ReactNode', 'PageShell API must include header');
requireIncludes('src/components/layout/page-shell.tsx', 'rail?: ReactNode', 'PageShell API must include rail');
requireIncludes('src/components/layout/page-shell.tsx', 'contentClassName?: string', 'PageShell API must include contentClassName');
requireIncludes('src/components/layout/page-shell.tsx', 'data-cf-layout-variant="page-shell"', 'PageShell must expose variant marker');

requireIncludes('src/components/layout/page-header.tsx', 'export type PageHeaderProps', 'PageHeader must export stable props type');
requireIncludes('src/components/layout/page-header.tsx', 'title: ReactNode', 'PageHeader API must include title');
requireIncludes('src/components/layout/page-header.tsx', 'description?: ReactNode', 'PageHeader API must include description');
requireIncludes('src/components/layout/page-header.tsx', 'eyebrow?: ReactNode', 'PageHeader API must include eyebrow');
requireIncludes('src/components/layout/page-header.tsx', 'actions?: ReactNode', 'PageHeader API must include actions');
requireIncludes('src/components/layout/page-header.tsx', 'meta?: ReactNode', 'PageHeader API must include meta');
requireIncludes('src/components/layout/page-header.tsx', 'data-cf-layout-variant="page-header"', 'PageHeader must expose variant marker');

requireIncludes('src/components/layout/content-rail-layout.tsx', 'export type ContentRailLayoutProps', 'ContentRailLayout must export stable props type');
requireIncludes('src/components/layout/content-rail-layout.tsx', 'main: ReactNode', 'ContentRailLayout API must include main');
requireIncludes('src/components/layout/content-rail-layout.tsx', 'rail?: ReactNode', 'ContentRailLayout API must include rail');
requireIncludes('src/components/layout/content-rail-layout.tsx', 'mainClassName?: string', 'ContentRailLayout API must include mainClassName');
requireIncludes('src/components/layout/content-rail-layout.tsx', 'railClassName?: string', 'ContentRailLayout API must include railClassName');
requireIncludes('src/components/layout/content-rail-layout.tsx', 'data-cf-layout-variant="content-rail"', 'ContentRailLayout must expose variant marker');

requireIncludes('src/components/layout/sidebar-nav.tsx', 'export type SidebarNavItem', 'SidebarNav must export item type');
requireIncludes('src/components/layout/sidebar-nav.tsx', 'export type SidebarNavProps', 'SidebarNav must export stable props type');
requireIncludes('src/components/layout/sidebar-nav.tsx', 'items: SidebarNavItem[]', 'SidebarNav API must include items');
requireIncludes('src/components/layout/sidebar-nav.tsx', 'footer?: ReactNode', 'SidebarNav API must include footer');
requireIncludes('src/components/layout/sidebar-nav.tsx', 'iconName?: IconName', 'SidebarNav items must use IconName');
requireIncludes('src/components/layout/sidebar-nav.tsx', 'AppIcon', 'SidebarNav must use AppIcon');
requireIncludes('src/components/layout/sidebar-nav.tsx', "import { Button } from '../ui/button'", 'SidebarNav must use Button primitive for button actions');
requireIncludes('src/components/layout/sidebar-nav.tsx', '<Button', 'SidebarNav must render Button primitive for non-link items');
requireIncludes('src/components/layout/sidebar-nav.tsx', 'data-cf-layout-variant="sidebar-nav"', 'SidebarNav must expose variant marker');

const migrated = read('src/pages/ResponseTemplates.tsx');
requireIncludes('src/pages/ResponseTemplates.tsx', "import { PageShell } from '../components/layout/page-shell'", 'Scoped migrated file must import PageShell');
requireIncludes('src/pages/ResponseTemplates.tsx', '<PageShell', 'Scoped migrated file must render PageShell');
requireIncludes('src/pages/ResponseTemplates.tsx', 'data-cf-layout-scoped-migration', 'Scoped migrated file must expose scoped layout migration marker');
requireIncludes('src/pages/ResponseTemplates.tsx', '<CloseFlowPageHeaderV2 pageKey="responseTemplates" />', 'Scoped migration must preserve existing page header component');
requireIncludes('src/pages/ResponseTemplates.tsx', 'fetchResponseTemplatesFromSupabase', 'Scoped migration must preserve response template data provider path');
requireIncludes('src/pages/ResponseTemplates.tsx', 'createResponseTemplateInSupabase', 'Scoped migration must preserve create path');

const packageJson = read('package.json');
if (!packageJson.includes('verify:lf-ui-sot-cz2-015-layout-sidebar')) {
  errors.push('package.json must register verify:lf-ui-sot-cz2-015-layout-sidebar before closing CZ2-015');
}

let changedFiles = [];
try {
  changedFiles = execSync('git diff --name-only HEAD~12..HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
} catch (error) {
  warnings.push('Could not inspect recent changed files with git diff HEAD~12..HEAD.');
}

const forbiddenNextStagePattern = new RegExp(`migrations|data-provider|${NEXT_STAGE.toLowerCase()}`, 'i');
for (const file of changedFiles) {
  if (/\.(css|sql)$/i.test(file)) errors.push(`CZ2-015 must not touch CSS/SQL: ${file}`);
  if (forbiddenNextStagePattern.test(file)) errors.push(`CZ2-015 must not touch migrations/data-provider/next-stage scope: ${file}`);
  if (file === 'src/lib/routes.ts') errors.push('CZ2-015 must not change src/lib/routes.ts');
}

for (const file of checkedFiles) assertNoMojibake(file);

const result = {
  ok: errors.length === 0,
  stage: STAGE,
  decision: 'LAYOUT_SIDEBAR_SOURCE_OF_TRUTH / SCOPED_NO_REDESIGN',
  canonical: sotFiles,
  scopedMigration: 'src/pages/ResponseTemplates.tsx',
  changedFiles,
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length) process.exit(1);
