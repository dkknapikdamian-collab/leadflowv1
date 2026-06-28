#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

const SCAN_ROOTS = ['src/pages', 'src/components', 'src/lib'];
const UI_EXTENSIONS = new Set(['.ts', '.tsx']);

const DOM_PATCH_ALLOWLIST = new Map([
  ['src/components/AppChunkErrorBoundary.tsx', 'existing modal/input guard before patch-layer contract'],
  ['src/components/ContextActionDialogs.tsx', 'existing context title fallback'],
  ['src/components/Layout.tsx', 'existing shell runtime layout enforcement'],
  ['src/components/OperatorTopBarRuntime.tsx', 'existing header runtime consolidation'],
  ['src/components/VisualFoundationRuntimeStage212M.tsx', 'existing visual runtime compatibility layer'],
  ['src/components/admin-tools/AdminDebugToolbar.tsx', 'admin/debug tooling, not production UI contract'],
  ['src/components/admin-tools/dom-candidates.ts', 'admin/debug tooling, not production UI contract'],
  ['src/components/ui/card.tsx', 'existing card title fallback'],
  ['src/components/ui-system/OperatorMetricToneRuntime.tsx', 'existing metric tone runtime'],
  ['src/lib/stage30-today-cleanup.ts', 'legacy stage runtime debt'],
  ['src/lib/stage31-today-tiles-interaction.ts', 'legacy stage runtime debt'],
  ['src/lib/stage32-today-relations-loading-polish.ts', 'legacy stage runtime debt'],
  ['src/pages/Calendar.tsx', 'existing calendar runtime patches; do not extend'],
  ['src/pages/Today.tsx', 'inactive legacy Today page'],
  ['src/pages/TodayStable.tsx', 'existing TodayStable runtime patches; do not extend'],
  ['src/pages/UiPreviewVNextFull.tsx', 'dev preview embedded HTML'],
]);

const REPLACE_CHILDREN_ALLOWLIST = new Map([
  ['src/pages/Calendar.tsx', 2],
]);

const DIRECT_TRASH2_ALLOWLIST = new Map([
  ['src/components/work-item-card.tsx', 'uses EntityTrashButton but still owns icon rendering'],
  ['src/components/ui-system/action-icon-registry.ts', 'central icon registry'],
  ['src/pages/AiDrafts.tsx', 'known delete-action debt'],
  ['src/pages/Calendar.tsx', 'known delete-action debt'],
  ['src/pages/CaseDetail.tsx', 'known delete-action debt'],
  ['src/pages/Cases.tsx', 'uses EntityTrashButton but still owns icon rendering'],
  ['src/pages/ClientDetail.tsx', 'known delete-action debt'],
  ['src/pages/Clients.tsx', 'known delete-action debt'],
  ['src/pages/LeadDetail.tsx', 'known delete-action debt'],
  ['src/pages/Leads.tsx', 'known delete-action debt'],
  ['src/pages/NotificationsCenter.tsx', 'known delete-action debt'],
  ['src/pages/Tasks.tsx', 'inactive legacy Tasks page'],
  ['src/pages/TasksStable.tsx', 'uses EntityTrashButton but still owns icon rendering'],
  ['src/pages/Templates.tsx', 'uses EntityTrashButton but still owns icon rendering'],
  ['src/pages/TodayStable.tsx', 'known delete-action debt'],
]);

const DELETE_COMPONENT_ALLOWLIST = new Map([
  ['src/components/entity-actions.tsx', 'canonical EntityActionButton and EntityTrashButton source'],
  ['src/components/ActivityItemPreviewDialog.tsx', 'existing dialog delete debt'],
  ['src/components/ActivityRoadmap.tsx', 'existing activity roadmap delete debt'],
  ['src/components/detail/MissingItemsManagerDialog.tsx', 'existing missing item manager delete debt'],
  ['src/pages/CaseDetail.tsx', 'existing CaseDetailTrashButton alias to EntityTrashButton'],
]);

const INLINE_ACTION_STYLE_ALLOWLIST = new Map([
  ['src/pages/UiPreviewVNext.tsx', 'dev preview, not production route styling SOT'],
]);

const RAW_PAGE_BUTTON_ALLOWLIST = new Map([
  ['src/pages/Activity.tsx', 'existing raw button debt'],
  ['src/pages/AdminAiSettings.tsx', 'existing raw button debt'],
  ['src/pages/AiDrafts.tsx', 'existing raw button debt'],
  ['src/pages/Billing.tsx', 'existing raw button debt'],
  ['src/pages/Calendar.tsx', 'existing raw button debt'],
  ['src/pages/CaseDetail.tsx', 'existing raw button debt'],
  ['src/pages/Cases.tsx', 'existing raw button debt'],
  ['src/pages/ClientDetail.tsx', 'existing raw button debt'],
  ['src/pages/ClientPortal.tsx', 'existing raw button debt'],
  ['src/pages/Clients.tsx', 'existing raw button debt'],
  ['src/pages/Dashboard.tsx', 'existing raw button debt'],
  ['src/pages/LeadDetail.tsx', 'existing raw button debt'],
  ['src/pages/Leads.tsx', 'existing raw button debt'],
  ['src/pages/Login.tsx', 'existing raw button debt'],
  ['src/pages/NotificationsCenter.tsx', 'existing raw button debt'],
  ['src/pages/ResponseTemplates.tsx', 'existing raw button debt'],
  ['src/pages/SalesFunnel.tsx', 'existing raw button debt'],
  ['src/pages/Settings.tsx', 'existing raw button debt'],
  ['src/pages/SupportCenter.tsx', 'existing raw button debt'],
  ['src/pages/Tasks.tsx', 'inactive legacy raw button debt'],
  ['src/pages/TasksStable.tsx', 'existing raw button debt'],
  ['src/pages/Templates.tsx', 'existing raw button debt'],
  ['src/pages/Today.tsx', 'inactive legacy raw button debt'],
  ['src/pages/TodayStable.tsx', 'existing raw button debt'],
]);

const LUCIDE_REACT_IMPORT_ALLOWLIST = new Map([
  ['src/components/confirm-dialog.tsx', 'existing direct icon import debt'],
  ['src/components/Layout.tsx', 'existing direct icon import debt'],
  ['src/components/lead-picker.tsx', 'existing direct icon import debt'],
  ['src/components/sidebar-mini-calendar.tsx', 'existing direct icon import debt'],
  ['src/components/ui/checkbox.tsx', 'existing UI primitive direct icon import debt'],
  ['src/components/ui/dialog.tsx', 'existing UI primitive direct icon import debt'],
  ['src/components/ui/dropdown-menu.tsx', 'existing UI primitive direct icon import debt'],
  ['src/components/ui/select.tsx', 'existing UI primitive direct icon import debt'],
  ['src/components/ui/sonner.tsx', 'existing UI primitive direct icon import debt'],
  ['src/lib/options.ts', 'existing option icon mapping debt'],
  ['src/pages/Activity.tsx', 'existing direct icon import debt'],
  ['src/pages/Billing.tsx', 'existing direct icon import debt'],
  ['src/pages/Calendar.tsx', 'existing direct icon import debt'],
  ['src/pages/CaseDetail.tsx', 'existing direct icon import debt'],
  ['src/pages/Cases.tsx', 'existing direct icon import debt'],
  ['src/pages/ClientDetail.tsx', 'existing direct icon import debt'],
  ['src/pages/ClientPortal.tsx', 'existing direct icon import debt'],
  ['src/pages/Clients.tsx', 'existing direct icon import debt'],
  ['src/pages/Dashboard.tsx', 'existing direct icon import debt'],
  ['src/pages/LeadDetail.tsx', 'existing direct icon import debt'],
  ['src/pages/Leads.tsx', 'existing direct icon import debt'],
  ['src/pages/Login.tsx', 'existing direct icon import debt'],
  ['src/pages/Settings.tsx', 'existing direct icon import debt'],
  ['src/pages/Tasks.tsx', 'existing direct icon import debt'],
  ['src/pages/Templates.tsx', 'existing direct icon import debt'],
  ['src/pages/Today.tsx', 'inactive legacy direct icon import debt'],
]);

const GENERAL_INLINE_STYLE_ALLOWLIST = new Map([
  ['src/pages/UiPreviewVNext.tsx', 'dev preview, not production route styling SOT'],
  ['src/pages/UiPreviewVNextFull.tsx', 'dev preview embedded HTML'],
]);

const DISPLAY_STACK_IMPORTANT_ALLOWLIST = new Map([
  ['src/components/Layout.tsx', 'existing shell layering debt'],
  ['src/components/AppChunkErrorBoundary.tsx', 'existing chunk-error overlay debt'],
  ['src/pages/Calendar.tsx', 'existing calendar layering debt'],
  ['src/pages/Today.tsx', 'inactive legacy Today page'],
  ['src/pages/TodayStable.tsx', 'existing TodayStable layering debt'],
  ['src/pages/UiPreviewVNext.tsx', 'dev preview, not production route styling SOT'],
  ['src/pages/UiPreviewVNextFull.tsx', 'dev preview embedded HTML'],
]);

const APP_STYLES_IMPORT_MAX = new Map([
  ['src/App.tsx', 45],
]);

const LOCAL_ICON_BUTTON_CLONE_ALLOWLIST = new Map([
  ['src/components/entity-actions.tsx', 'canonical shared action buttons'],
  ['src/components/ui/button.tsx', 'canonical UI Button primitive'],
]);

const LOCAL_COLOR_MAP_ALLOWLIST = new Map([
  ['src/lib/options.ts', 'central option/icon mapping debt'],
]);

const ROUTE_LITERAL_ALLOWLIST = new Map([
  ['src/pages/Activity.tsx', 'existing route literal debt'],
  ['src/pages/AdminAiSettings.tsx', 'existing route literal debt'],
  ['src/pages/AiDrafts.tsx', 'existing route literal debt'],
  ['src/pages/Billing.tsx', 'existing route literal debt'],
  ['src/pages/Calendar.tsx', 'existing route literal debt'],
  ['src/pages/CaseDetail.tsx', 'existing route literal debt'],
  ['src/pages/Cases.tsx', 'existing route literal debt'],
  ['src/pages/ClientDetail.tsx', 'existing route literal debt'],
  ['src/pages/ClientPortal.tsx', 'existing route literal debt'],
  ['src/pages/Clients.tsx', 'existing route literal debt'],
  ['src/pages/Dashboard.tsx', 'existing route literal debt'],
  ['src/pages/LeadDetail.tsx', 'existing route literal debt'],
  ['src/pages/Leads.tsx', 'existing route literal debt'],
  ['src/pages/Login.tsx', 'existing route literal debt'],
  ['src/pages/NotificationsCenter.tsx', 'existing route literal debt'],
  ['src/pages/ResponseTemplates.tsx', 'existing route literal debt'],
  ['src/pages/SalesFunnel.tsx', 'existing route literal debt'],
  ['src/pages/Settings.tsx', 'existing route literal debt'],
  ['src/pages/SupportCenter.tsx', 'existing route literal debt'],
  ['src/pages/Tasks.tsx', 'existing route literal debt'],
  ['src/pages/TasksStable.tsx', 'existing route literal debt'],
  ['src/pages/Templates.tsx', 'existing route literal debt'],
  ['src/pages/Today.tsx', 'inactive legacy route literal debt'],
  ['src/pages/TodayStable.tsx', 'existing route literal debt'],
]);

const STYLE_LAYER_ALLOWLIST_MAX = new Map([
  ['src/App.tsx', 50],
  ['src/components/ClientCreateDialog.tsx', 2],
  ['src/components/ContextActionButton.tsx', 1],
  ['src/components/GlobalQuickActions.tsx', 1],
  ['src/components/Layout.tsx', 3],
  ['src/components/QuickAiCapture.tsx', 1],
  ['src/components/TaskCreateDialog.tsx', 1],
  ['src/components/detail/MissingItemQuickActionModal.tsx', 2],
  ['src/components/detail/QuickActionsBar.tsx', 1],
  ['src/components/quick-lead/QuickLeadCaptureModal.tsx', 1],
  ['src/components/task-editor-dialog.tsx', 1],
  ['src/components/ui/sonner.tsx', 1],
  ['src/pages/Activity.tsx', 6],
  ['src/pages/AdminAiSettings.tsx', 2],
  ['src/pages/AiDrafts.tsx', 6],
  ['src/pages/Billing.tsx', 6],
  ['src/pages/Calendar.tsx', 4],
  ['src/pages/CaseDetail.tsx', 8],
  ['src/pages/Cases.tsx', 4],
  ['src/pages/ClientDetail.tsx', 2],
  ['src/pages/Clients.tsx', 4],
  ['src/pages/LeadDetail.tsx', 4],
  ['src/pages/Leads.tsx', 4],
  ['src/pages/NotificationsCenter.tsx', 6],
  ['src/pages/ResponseTemplates.tsx', 4],
  ['src/pages/SalesFunnel.tsx', 3],
  ['src/pages/Settings.tsx', 9],
  ['src/pages/SupportCenter.tsx', 4],
  ['src/pages/Tasks.tsx', 2],
  ['src/pages/TasksStable.tsx', 2],
  ['src/pages/Templates.tsx', 6],
  ['src/pages/Today.tsx', 2],
  ['src/pages/TodayStable.tsx', 4],
]);

const STAGE_CLASS_ALLOWLIST_MAX = new Map([
  ['src/components/ClientCreateDialog.tsx', 6],
  ['src/components/ContextActionDialogs.tsx', 30],
  ['src/components/ContextNoteDialog.tsx', 2],
  ['src/components/detail/MissingItemQuickActionModal.tsx', 3],
  ['src/components/detail/MissingItemsManagerDialog.tsx', 9],
  ['src/components/EventCreateDialog.tsx', 2],
  ['src/components/finance/CaseFinanceEditorDialog.tsx', 4],
  ['src/components/finance/FinanceMiniSummary.tsx', 4],
  ['src/components/Layout.tsx', 60],
  ['src/components/quick-lead/QuickLeadCaptureModal.tsx', 21],
  ['src/components/task-editor-dialog.tsx', 1],
  ['src/components/TaskCreateDialog.tsx', 1],
  ['src/components/TodayAiAssistant.tsx', 1],
  ['src/components/ui/sonner.tsx', 1],
  ['src/components/work-item-card.tsx', 10],
  ['src/pages/Activity.tsx', 30],
  ['src/pages/AdminAiSettings.tsx', 1],
  ['src/pages/AiDrafts.tsx', 30],
  ['src/pages/Billing.tsx', 30],
  ['src/pages/Calendar.tsx', 80],
  ['src/pages/CaseDetail.tsx', 220],
  ['src/pages/Cases.tsx', 80],
  ['src/pages/ClientDetail.tsx', 140],
  ['src/pages/Clients.tsx', 60],
  ['src/pages/LeadDetail.tsx', 180],
  ['src/pages/Leads.tsx', 60],
  ['src/pages/NotificationsCenter.tsx', 40],
  ['src/pages/ResponseTemplates.tsx', 2],
  ['src/pages/SalesFunnel.tsx', 16],
  ['src/pages/Settings.tsx', 80],
  ['src/pages/SupportCenter.tsx', 1],
  ['src/pages/Tasks.tsx', 40],
  ['src/pages/TasksStable.tsx', 40],
  ['src/pages/Templates.tsx', 40],
  ['src/pages/Today.tsx', 80],
  ['src/pages/TodayStable.tsx', 120],
  ['src/pages/UiPreviewVNext.tsx', 1],
]);

function walk(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];

  const results = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (entry.name.endsWith('.bak')) continue;
    const child = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      results.push(...walk(child));
    } else if (UI_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(child);
    }
  }
  return results;
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function countMatches(source, regex) {
  return (source.match(regex) || []).length;
}

function lineFindings(file, source, predicate) {
  return source.split(/\r?\n/).flatMap((line, index) => predicate(line, index + 1) ? [`${file}:${index + 1}: ${line.trim()}`] : []);
}

const files = SCAN_ROOTS.flatMap(walk);
const errors = [];
const debt = {
  domPatchFiles: [],
  directTrash2Files: [],
  styleLayerFiles: [],
  stageClassFiles: [],
  rawButtonFiles: [],
  lucideImportFiles: [],
  inlineStyleFiles: [],
  displayStackImportantFiles: [],
  appStyleImportFiles: [],
  localIconButtonCloneFiles: [],
  localColorMapFiles: [],
  routeLiteralFiles: [],
};

for (const file of files) {
  const source = read(file);
  const domPatchCount = countMatches(source, /\bquerySelector(?:All)?\b/g);
  if (domPatchCount > 0) {
    if (!DOM_PATCH_ALLOWLIST.has(file)) {
      errors.push(`${file}: querySelector/querySelectorAll in UI code requires a real component/data contract, not a runtime patch.`);
    } else {
      debt.domPatchFiles.push({ file, count: domPatchCount, reason: DOM_PATCH_ALLOWLIST.get(file) });
    }
  }

  const replaceChildrenCount = countMatches(source, /\breplaceChildren\s*\(/g);
  if (replaceChildrenCount > 0) {
    const allowed = REPLACE_CHILDREN_ALLOWLIST.get(file) || 0;
    if (replaceChildrenCount > allowed) {
      errors.push(`${file}: replaceChildren count ${replaceChildrenCount} exceeds allowed baseline ${allowed}.`);
    }
  }

  const rawPageButtonFindings = lineFindings(file, source, (line) => /<button\b/.test(line));
  if (file.startsWith('src/pages/') && rawPageButtonFindings.length > 0) {
    if (!RAW_PAGE_BUTTON_ALLOWLIST.has(file)) {
      errors.push(`${file}: raw <button> in page component is not allowed for new UI work. Use the central Button/action primitive.\n${rawPageButtonFindings.join('\n')}`);
    } else {
      debt.rawButtonFiles.push({ file, count: rawPageButtonFindings.length, reason: RAW_PAGE_BUTTON_ALLOWLIST.get(file) });
    }
  }

  const lucideImportFindings = lineFindings(file, source, (line) =>
    /from\s+['"]lucide-react['"]/.test(line)
    || /import\s+[^'"]+['"]lucide-react['"]/.test(line)
  );
  if (lucideImportFindings.length > 0) {
    if (!LUCIDE_REACT_IMPORT_ALLOWLIST.has(file)) {
      errors.push(`${file}: direct lucide-react import is not allowed for new UI work. Use the central icon registry/primitive or add a scoped stage decision.\n${lucideImportFindings.join('\n')}`);
    } else {
      debt.lucideImportFiles.push({ file, count: lucideImportFindings.length, reason: LUCIDE_REACT_IMPORT_ALLOWLIST.get(file) });
    }
  }

  if ((file.startsWith('src/pages/') || file.startsWith('src/components/')) && source.includes('Trash2')) {
    if (!DIRECT_TRASH2_ALLOWLIST.has(file)) {
      errors.push(`${file}: direct Trash2 import/use is not allowed for new delete actions. Use EntityTrashButton or EntityActionButton tone="danger".`);
    } else {
      debt.directTrash2Files.push({ file, reason: DIRECT_TRASH2_ALLOWLIST.get(file) });
    }
  }

  const deleteComponentDefinitions = lineFindings(file, source, (line) =>
    /\b(?:function|const|export\s+(?:function|const))\s+\w*(?:Delete|Trash)\w*(?:Button|Action)\b/.test(line)
  );
  if (deleteComponentDefinitions.length > 0 && !DELETE_COMPONENT_ALLOWLIST.has(file)) {
    errors.push(`${file}: local delete button/action component detected. Reuse EntityTrashButton or EntityActionButton tone="danger".\n${deleteComponentDefinitions.join('\n')}`);
  }

  const iconButtonCloneDefinitions = lineFindings(file, source, (line) =>
    /\b(?:function|const|export\s+(?:function|const))\s+\w*(?:IconButton|ActionIcon|ToolbarButton|QuickActionButton)\b/.test(line)
  );
  if (iconButtonCloneDefinitions.length > 0 && !LOCAL_ICON_BUTTON_CLONE_ALLOWLIST.has(file)) {
    errors.push(`${file}: local IconButton/ActionIcon clone detected. Use the shared action primitive or make the canonical component explicit.\n${iconButtonCloneDefinitions.join('\n')}`);
  } else if (iconButtonCloneDefinitions.length > 0) {
    debt.localIconButtonCloneFiles.push({ file, count: iconButtonCloneDefinitions.length, reason: LOCAL_ICON_BUTTON_CLONE_ALLOWLIST.get(file) });
  }

  const inlineActionStyle = lineFindings(file, source, (line) =>
    line.includes('style={{') && /(<Button\b|<button\b|Trash2|Loader2|EntityTrashButton|EntityActionButton|aria-label=.*Usu|title=.*Usu)/.test(line)
  );
  if (inlineActionStyle.length > 0 && !INLINE_ACTION_STYLE_ALLOWLIST.has(file)) {
    errors.push(`${file}: inline style on action/icon/delete control is not allowed.\n${inlineActionStyle.join('\n')}`);
  }

  const pageInlineStyle = lineFindings(file, source, (line) =>
    file.startsWith('src/pages/') && line.includes('style={{')
  );
  if (pageInlineStyle.length > 0 && !GENERAL_INLINE_STYLE_ALLOWLIST.has(file)) {
    errors.push(`${file}: inline style in page component is not allowed for new UI work. Move this into the canonical component/CSS source.\n${pageInlineStyle.join('\n')}`);
  } else if (pageInlineStyle.length > 0) {
    debt.inlineStyleFiles.push({ file, count: pageInlineStyle.length, reason: GENERAL_INLINE_STYLE_ALLOWLIST.get(file) });
  }

  const inlineHideOrStacking = lineFindings(file, source, (line) =>
    /style=\{\{[^}]*display:\s*['"]none['"]/.test(line)
    || /style=\{\{[^}]*zIndex\s*:/.test(line)
    || /['"]z-index['"]\s*:/.test(line)
  );
  if (inlineHideOrStacking.length > 0 && !DOM_PATCH_ALLOWLIST.has(file)) {
    errors.push(`${file}: inline display:none/z-index workaround requires a named UI contract or CSS source, not a local patch.\n${inlineHideOrStacking.join('\n')}`);
  }

  const displayStackImportantFindings = lineFindings(file, source, (line) =>
    /display\s*:\s*['"]?none['"]?/.test(line)
    || /\bzIndex\s*:/.test(line)
    || /['"]z-index['"]\s*:/.test(line)
    || /!important\b/.test(line)
  );
  if (displayStackImportantFindings.length > 0) {
    if (!DISPLAY_STACK_IMPORTANT_ALLOWLIST.has(file)) {
      errors.push(`${file}: display:none/z-index/!important workaround is not allowed for new UI work.\n${displayStackImportantFindings.join('\n')}`);
    } else {
      debt.displayStackImportantFiles.push({ file, count: displayStackImportantFindings.length, reason: DISPLAY_STACK_IMPORTANT_ALLOWLIST.get(file) });
    }
  }

  const appStyleImportCount = file === 'src/App.tsx'
    ? countMatches(source, /^import\s+['"]\.\/styles\/[^'"]+\.css['"];?$/gm)
    : 0;
  if (appStyleImportCount > 0) {
    const allowed = APP_STYLES_IMPORT_MAX.get(file) || 0;
    if (appStyleImportCount > allowed) {
      errors.push(`${file}: ${appStyleImportCount} App CSS imports exceeds approved baseline ${allowed}. Do not add another global CSS layer; consolidate the source.`);
    } else {
      debt.appStyleImportFiles.push({ file, count: appStyleImportCount, allowed });
    }
  }

  const localColorMapFindings = lineFindings(file, source, (line) =>
    /\b(?:statusColorMap|badgeColorMap|statusToneMap|badgeToneMap|priorityColorMap)\b/.test(line)
  );
  if (localColorMapFindings.length > 0) {
    if (!LOCAL_COLOR_MAP_ALLOWLIST.has(file)) {
      errors.push(`${file}: local status/badge color map detected. Use the central status/tone config instead of a page-local map.\n${localColorMapFindings.join('\n')}`);
    } else {
      debt.localColorMapFiles.push({ file, count: localColorMapFindings.length, reason: LOCAL_COLOR_MAP_ALLOWLIST.get(file) });
    }
  }

  const routeLiteralFindings = lineFindings(file, source, (line) =>
    file.startsWith('src/pages/')
    && /['"`]\/(?:case|cases|lead|leads|client|clients)\/[^'"`]*['"`]/.test(line)
  );
  if (routeLiteralFindings.length > 0) {
    if (!ROUTE_LITERAL_ALLOWLIST.has(file)) {
      errors.push(`${file}: manual route literal detected. Use src/lib/routes helpers where a helper exists.\n${routeLiteralFindings.join('\n')}`);
    } else {
      debt.routeLiteralFiles.push({ file, count: routeLiteralFindings.length, reason: ROUTE_LITERAL_ALLOWLIST.get(file) });
    }
  }

  const styleLayerCount = countMatches(source, /import\s+['"][^'"]*styles\/[^'"]*(?:stage|source-truth|legacy|temporary|emergency)[^'"]*\.css['"]/g);
  if (styleLayerCount > 0) {
    const allowed = STYLE_LAYER_ALLOWLIST_MAX.get(file) || 1;
    if (styleLayerCount > allowed) {
      errors.push(`${file}: ${styleLayerCount} stage/source-truth CSS imports exceeds allowed baseline ${allowed}. Do not stack another CSS layer; consolidate the source.`);
    } else {
      debt.styleLayerFiles.push({ file, count: styleLayerCount });
    }
  }

  const stageClassCount = countMatches(source, /className=\{?[^}\n]*(?:stage\d+|stage-\d+|stage[0-9a-z-]*-|visual-stage|source-truth)/gi);
  if (stageClassCount > 0) {
    const allowed = STAGE_CLASS_ALLOWLIST_MAX.get(file) || 0;
    if (stageClassCount > allowed) {
      errors.push(`${file}: ${stageClassCount} stage-only/source-truth className usages exceeds allowed baseline ${allowed}. Stage classes cannot become final styling.`);
    } else {
      debt.stageClassFiles.push({ file, count: stageClassCount });
    }
  }
}

assert.equal(errors.length, 0, errors.join('\n\n'));

console.log(JSON.stringify({
  ok: true,
  guard: 'guard:ui:patch-layers',
  contract: {
    deleteAction: 'EntityTrashButton or EntityActionButton tone="danger"',
    buttonAction: 'central Button/action primitive instead of raw page <button>',
    iconAction: 'central icon registry/primitive instead of new direct lucide-react imports',
    routeAction: 'src/lib/routes helpers instead of manual route literals where helper exists',
    forbiddenNewPatterns: [
      'querySelector/querySelectorAll runtime UI patches',
      'replaceChildren DOM rewrites',
      'inline style on action/icon/delete controls',
      'inline style in page components',
      'raw <button> in src/pages outside explicit debt allowlist',
      'new direct lucide-react imports',
      'local delete button abstractions',
      'local IconButton/ActionIcon clones',
      'local status/badge color maps',
      'manual route literals where route helpers exist',
      'new direct Trash2 delete controls',
      'new stacked App/global CSS imports',
      'new stacked stage/source-truth CSS imports',
      'new stage-only className final styling',
      'display:none/z-index/!important workarounds',
    ],
  },
  knownDebt: {
    domPatchFiles: debt.domPatchFiles.length,
    directTrash2Files: debt.directTrash2Files.length,
    styleLayerFiles: debt.styleLayerFiles.length,
    stageClassFiles: debt.stageClassFiles.length,
    rawButtonFiles: debt.rawButtonFiles.length,
    lucideImportFiles: debt.lucideImportFiles.length,
    inlineStyleFiles: debt.inlineStyleFiles.length,
    displayStackImportantFiles: debt.displayStackImportantFiles.length,
    appStyleImportFiles: debt.appStyleImportFiles.length,
    localIconButtonCloneFiles: debt.localIconButtonCloneFiles.length,
    localColorMapFiles: debt.localColorMapFiles.length,
    routeLiteralFiles: debt.routeLiteralFiles.length,
  },
}, null, 2));
