# CloseFlow — TypeScript fix po etapie powiadomień — 2026-04-26

## Cel

Naprawić błędy `tsc --noEmit` po dopchnięciu etapu powiadomień i snooze.

## Co poprawiono

- dodano kompatybilny plik `src/components/NotificationRuntime.tsx`, który przekierowuje do aktualnego runtime w `src/components/notifications/NotificationRuntime.tsx`,
- dodano kompatybilne eksporty w `src/lib/notifications.ts` dla starszych importów,
- dopisano `isAdmin` do wyniku `useWorkspace()`, żeby starszy `SupportCenter.tsx` nie wywalał typowania,
- poprawiono typ propsów `ReminderCard` i `HistoryRow`, żeby lokalny TypeScript nie traktował `key` jako niedozwolonego propsa.

## Nie zmieniono

- logiki biznesowej powiadomień,
- UI centrum powiadomień,
- modelu przypomnień,
- routingu.

## Weryfikacja po stronie użytkownika

```powershell
npm.cmd run lint
npm.cmd run test:stage
npm.cmd run build
```
