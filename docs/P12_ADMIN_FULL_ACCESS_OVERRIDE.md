# P12 — Admin full access override

## Cel

Admin/twórca aplikacji ma mieć pełny dostęp do funkcji niezależnie od przypisanego pakietu.

## Problem

Pakiet `pro` nie ma funkcji AI. Dotychczas `useWorkspace` robił:

```ts
hasAccess: access.hasAccess || isAdmin
```

To dawało adminowi wejście do aplikacji, ale nie zmieniało `access.features`. Efekt: admin mógł mieć `planId = pro` i jednocześnie `features.ai = false`.

## Co zmieniono

W `src/hooks/useWorkspace.ts` dodano finalny override:

- `adminOverride: true`,
- `hasAccess: true`,
- `isPaidActive: true`,
- wszystkie funkcje włączone:
  - AI,
  - fullAi,
  - digest,
  - lightParser,
  - lightDrafts,
  - Google Calendar,
  - weeklyReport,
  - CSV import,
  - recurring reminders,
  - browser notifications,
- limity ustawione jako unlimited:
  - `activeLeads: null`,
  - `activeTasks: null`,
  - `activeEvents: null`,
  - `activeDrafts: null`.

## Czego nie zmieniono

- Nie zmieniono definicji pakietu Pro dla zwykłych klientów.
- Nie odblokowano AI wszystkim użytkownikom Pro.
- Nie zmieniono cennika.
- Nie zmieniono Stripe ani plan IDs.

## Test ręczny

1. Zaloguj się jako admin.
2. Sprawdź funkcje AI i Szkice AI.
3. Nawet jeśli workspace ma `planId = pro`, admin powinien widzieć funkcje AI jako dostępne.
4. Zwykły użytkownik Pro nadal nie powinien mieć pełnego AI, jeśli nie ma pakietu AI.
