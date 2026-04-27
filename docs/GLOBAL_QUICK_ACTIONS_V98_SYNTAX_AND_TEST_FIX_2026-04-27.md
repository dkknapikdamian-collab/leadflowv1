# CloseFlow v98 - hotfix składni globalnych szybkich akcji

Naprawia błąd po v97:

- błędne `onClick={() = aria-label=...}` w `src/components/GlobalQuickActions.tsx`,
- brakujące atrybuty `role="toolbar"`, `aria-label` i `data-global-quick-actions-contract`,
- niepoprawne regexy w testach `.cjs`, gdzie ścieżka z `/` była traktowana jako flagi regexa.

Zakres:

- `src/components/GlobalQuickActions.tsx`
- `tests/global-quick-actions-no-duplicates.test.cjs`
- `tests/global-quick-actions-toolbar-a11y.test.cjs`

Po wdrożeniu uruchomić:

```powershell
node tests/global-quick-actions-no-duplicates.test.cjs
node tests/global-quick-actions-toolbar-a11y.test.cjs
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```