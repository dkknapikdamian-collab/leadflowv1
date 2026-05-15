# CloseFlow lead app - final checks v7

## Test results
- OK - node scripts/check-json-no-bom-stage73b.cjs
- OK - node scripts/check-project-memory.cjs
- OK - npm run check:project-memory
- SKIP - npm run typecheck
- FAIL - npm run build
- FAIL - npm run verify:closeflow:quiet

## Details

### OK - node scripts/check-json-no-bom-stage73b.cjs
~~~text
OK json no BOM stage73b
~~~

### OK - node scripts/check-project-memory.cjs
~~~text
OK: project memory files are complete for CloseFlow Lead App.
~~~

### OK - npm run check:project-memory
~~~text
> closeflow@0.0.0 check:project-memory
> node scripts/check-project-memory.cjs

OK: project memory files are complete for CloseFlow Lead App.
~~~

### SKIP - npm run typecheck
~~~text
Script not present in package.json.
~~~

### FAIL - npm run build
~~~text
> closeflow@0.0.0 prebuild
> node scripts/check-json-no-bom-stage73b.cjs && node scripts/check-calendar-selected-day-handler-scope.cjs && node scripts/check-right-rail-source-truth.cjs && node scripts/check-clients-leads-only-attention-stage71.cjs && node scripts/check-clients-attention-rail-visual-stage72.cjs && node scripts/check-stage74-clients-leads-to-link-panel.cjs && node scripts/check-closeflow-repo-hygiene-stage73.cjs

OK json no BOM stage73b
OK Calendar handler scope guard passed
OK right rail source truth stage70
OK: legacy clients lead-linking rail compatibility guard passed.
OK: legacy clients lead-linking rail compatibility guard passed.
OK: legacy clients lead-linking rail compatibility guard passed.
OK closeflow repo hygiene stage73

> closeflow@0.0.0 build
> vite build

[36mvite v6.4.2 [32mbuilding for production...[36m[39m
transforming...
[32mâś“[39m 24 modules transformed.

[31mâś—[39m Build failed in 1.05s
[31merror during build:
[31m[vite:esbuild] Transform failed with 1 error:
C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/pages/Leads.tsx:352:4: ERROR: Unexpected "if"[31m
file: [36mC:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/pages/Leads.tsx:352:4[31m
[33m
[33mUnexpected "if"[33m
350|    useEffect(() => {
351|      const allowDevPreview = 
352|      if ((!isSupabaseConfigured() && !allowDevPreview) || workspaceLoading || !workspace?.id) {
   |      ^
353|        setLoading(workspaceLoading);
354|        return;
[31m
    at failureErrorWithLog (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\node_modules\vite\node_modules\esbuild\lib\main.js:1467:15)
    at C:\Users\malim\Desktop\biznesy_ai\2.closeflow\node_modules\vite\node_modules\esbuild\lib\main.js:736:50
    at responseCallbacks.<computed> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\node_modules\vite\node_modules\esbuild\lib\main.js:603:9)
    at handleIncomingPacket (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\node_modules\vite\node_modules\esbuild\lib\main.js:658:12)
    at Socket.readFromStdout (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\node_modules\vite\node_modules\esbuild\lib\main.js:581:7)
    at Socket.emit (node:events:508:28)
    at addChunk (node:internal/streams/readable:563:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)
    at Readable.push (node:internal/streams/readable:394:5)
    at Pipe.onStreamRead (node:internal/stream_base_commons:189:23)[39m
~~~

### FAIL - npm run verify:closeflow:quiet
~~~text
rs\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\core\\core-contracts.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\page-adapters\\page-adapters.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\legacy\\legacy-imports.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\temporary\\temporary-overrides.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\emergency\\emergency-hotfixes.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-mobile-start-tile-trim.css',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/App.tsx',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/components/ErrorBoundary.tsx',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/pwa/register-service-worker.ts',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/styles/action-color-taxonomy-v1.css',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/styles/closeflow-right-rail-source-truth.css',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/styles/closeflow-leads-right-rail-layout-lock.css',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/components/appearance-provider.tsx',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/pwa/chunk-asset-reload-guard.ts',
    'C:/Users/malim/Desktop/biznesy_ai/2.closeflow/src/styles/stage80-today-task-done-desktop-visibility.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage01-shell.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-html-theme-v14.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-vnext-ui-contract.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-form-actions.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-action-tokens.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-entity-type-tokens.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-stage16c-tasks-cases-parity.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-stage16d-tasks-metric-final-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-metric-tiles.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-operator-metric-tiles.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-operator-semantic-tones.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-final-metric-tiles-hard-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-metric-tiles-color-font-parity.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-metric-text-clip-tasks-repair.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-desktop-compact-scale.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-semantic-badges-and-today-sections.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-sidebar-footer-contrast-repair.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-sidebar-user-footer-below-nav.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stageA19v2-sidebar-nav-contrast-fix.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stageA20-sidebar-today-click-fix.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stageA20c-sidebar-today-hitbox-fix.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stageA20d-sidebar-unified-nav-tone.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stageA20e-sidebar-today-tone-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage30a-mobile-contrast-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage31-full-mobile-polish.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage33a-ai-drafts-generated-text-contrast.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage34-calendar-readability-status-forms.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage34b-calendar-complete-polish.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage35-clients-value-detail-cleanup.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stageA24-today-relations-label-align.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stageA25-today-relations-lead-badge-inline.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\design-system\\closeflow-tokens.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\design-system\\closeflow-icons.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\design-system\\closeflow-layout.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\design-system\\closeflow-components.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\design-system\\closeflow-utilities.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage02-today.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage03-leads.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage04-lead-detail.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage05-clients.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage06-client-detail.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage07-cases.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage08-case-detail.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage13-case-detail-vnext.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage18-leads-hard-1to1.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage19-clients-safe-css.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage20-lead-form-vnext.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage20-tasks-safe-css.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage21-today-final-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage23-client-case-forms-vnext.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage25-leads-full-jsx-html-rebuild.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage26-leads-visual-alignment-fix.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage27-cases-vnext.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage28-tasks-vnext.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage29-calendar-vnext.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\visual-stage30-tasks-compact-after-calendar.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\quick-lead-capture-stage27.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\tasks-header-stage45b-cleanup.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage37-unified-page-head-and-metrics.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage38-metrics-and-relations-polish.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage39-page-headers-copy-visual-system.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\stage40-page-header-action-overflow-hardening.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\hotfix-lead-client-right-rail-dark-wrappers.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\hotfix-ai-drafts-right-rail-stage28.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\eliteflow-admin-feedback-p1-hotfix.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-client-event-modal-runtime-repair.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-a1-client-note-event-lead-visibility-finalizer.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-metric-tile-visual-source-truth.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-page-header-card-source-truth.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-command-actions-source-truth.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-page-header-copy-source-truth.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-page-header-action-semantics-packet1.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-page-header-stage6-final-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-page-header-final-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-page-header-structure-lock.css',
    'C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow\\src\\styles\\closeflow-page-header-copy-left-only.css',
    ... 2875 more items
  ]
}
~~~