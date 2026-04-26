# CloseFlow — fix: stale ZIP / TypeScript notification imports

Ten patch dopina poprawki błędów TypeScript zgłoszonych po paczce powiadomień.

Naprawia:
- brakujące eksporty kompatybilności w `src/lib/notifications.ts`,
- konflikt starszego importu `src/components/NotificationRuntime.tsx`,
- props `key` w `NotificationsCenter`,
- brak `isAdmin` w `useWorkspace`.

Jeśli po zastosowaniu paczki dalej pojawiają się identyczne błędy, lokalny folder dostał starą wersję ZIP-a. Trzeba ponownie pobrać paczkę i po rozpakowaniu sprawdzić:

```powershell
Get-Content .\src\components\NotificationRuntime.tsx -TotalCount 5
Select-String -Path .\src\lib\notifications.ts -Pattern "buildRuntimeNotificationItems"
```

Pierwszy plik powinien zawierać tylko re-export:

```ts
export { default } from './notifications/NotificationRuntime';
```
