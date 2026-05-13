# CloseFlow FIN-14 REPAIR4 — Tasks header click guard

Data: 2026-05-13  
Branch: `dev-rollout-freeze`

## Cel

Naprawić kolejny czerwony guard po FIN-14, niezwiązany z finansami.

Test oczekuje, że `TasksStable.tsx` nie będzie już miał statycznego handlera:

```tsx
onClick={openNewTask}
```

Zamiast tego ma być inline callback:

```tsx
onClick={() => openNewTask()}
```

## Zakres

- `src/pages/TasksStable.tsx`
- tylko handler przycisku `Nowe zadanie`
- bez zmian w finansach, płatnościach, taskach, Supabase ani logice formularza

## Dlaczego REPAIR3 padł

REPAIR3 szukał kotwicy markerów, której nie było w aktualnym pliku. REPAIR4 nie zależy od markerów. Patchuje realny wzorzec `onClick={openNewTask}`.

## Weryfikacja

```powershell
node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs
npm.cmd run verify:closeflow:quiet
```
