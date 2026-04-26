# CloseFlow — Stage: centrum powiadomień i snooze

## Cel

Dodać praktyczną warstwę przypomnień V1:

- alerty w aplikacji,
- deduplikację,
- centrum powiadomień,
- snooze 15 min / 1h / jutro,
- historię lokalną pokazanych alertów,
- ustawienia przypomnień w panelu ustawień.

## Zmienione pliki

- `src/lib/record-normalizers.ts`
- `src/lib/lead-actions.ts`
- `src/lib/notifications.ts`
- `src/components/notifications/NotificationRuntime.tsx`
- `src/pages/NotificationsCenter.tsx`
- `src/pages/Settings.tsx`
- `src/components/Layout.tsx`
- `src/App.tsx`
- `src/pages/Today.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `tests/record-normalizers.test.ts`
- `tests/lead-actions.test.ts`
- `tests/notifications.test.ts`
- `package.json`

## Co działa

- Aplikacja liczy alerty z tasków, eventów i leadów.
- Alerty są widoczne w runtime jako toast.
- Alerty trafiają do centrum `Powiadomienia`.
- Użytkownik może odłożyć alert na 15 min, 1h albo do jutra.
- Użytkownik może zamknąć alert.
- Powtórne pokazywanie tego samego alertu jest ograniczone oknem deduplikacji.
- Ustawienia przypomnień zapisują się lokalnie per użytkownik.

## Czego jeszcze nie ma

- backendowej historii powiadomień,
- e-mail digestu,
- push przez service worker,
- synchronizacji snooze między urządzeniami.

Te elementy są następnym etapem po PWA / backend mail.
