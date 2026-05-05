# PROMPT DLA WYKONAWCY / CODEX — ADMIN DEBUG TOOLBAR

Wdróż pełny Admin Debug Toolbar w CloseFlow zgodnie z FULL_ADMIN_DEBUG_TOOLBAR_SPEC.md.

Warunki:
- branch: dev-rollout-freeze
- nie twórz nowej gałęzi
- nie pushuj sam, jeżeli workflow wymaga ZIP
- wszystko widoczne tylko dla isAdmin || isAppOwner
- wszystko w górnym pasku Layout
- V1 bez backendu i bez Supabase tabel
- zapis tylko localStorage
- eksport JSON/Markdown przez download do Downloads
- OFF nie zmienia zachowania aplikacji
- Collect blokuje klik i otwiera notatkę
- Browse przepuszcza klik
- target selection musi używać event.composedPath i candidate scoring
- klik ikony w buttonie musi wybrać button
- narzędzie admina ignoruje samo siebie przez data-admin-tool-ui="true"
- dodać guardy, testy i dokument release

Wymagane skrypty:
npm run check:admin-debug-toolbar
npm run check:admin-review-mode
npm run check:admin-button-matrix
npm run check:admin-feedback-export
npm run test:admin-tools

Po wdrożeniu:
npm run build
npm run check:admin-debug-toolbar
npm run check:admin-review-mode
npm run check:admin-button-matrix
npm run check:admin-feedback-export
npm run test:admin-tools

Commit:
feat(admin): add debug toolbar and local UI feedback tools
