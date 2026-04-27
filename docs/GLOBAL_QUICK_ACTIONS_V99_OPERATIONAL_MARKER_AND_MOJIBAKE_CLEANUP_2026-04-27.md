# CloseFlow v99 - operational marker and Polish encoding cleanup

Ten hotfix naprawia stan po v98:

- usuwa rozsypane polskie znaki z globalnego paska szybkich akcji,
- usuwa rozsypane polskie znaki z dokumentu v98,
- przywraca kontrakt tekstowy centrum operacyjnego klienta V1: Następny ruch, Zadania klienta, Wydarzenia klienta, Aktywność klienta,
- zostawia jeden globalny pasek szybkich akcji u góry aplikacji,
- nie dodaje nowych funkcji Vercel.

Po wdrożeniu uruchomić:

```powershell
node scripts/check-polish-mojibake.cjs --repo . --check
node tests/global-quick-actions-no-duplicates.test.cjs
node tests/global-quick-actions-toolbar-a11y.test.cjs
node tests/client-detail-v1-operational-center.test.cjs
node tests/client-relation-command-center.test.cjs
node tests/client-detail-final-operating-model.test.cjs
node tests/relation-funnel-value.test.cjs
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```
