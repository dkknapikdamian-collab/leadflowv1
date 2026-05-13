# CloseFlow FIN-14 REPAIR2 — Layout UTF-8 guard

Data: 2026-05-13  
Branch: `dev-rollout-freeze`

## Cel

Naprawić czerwony test `tests/faza3-etap32d-plan-based-ui-visibility.test.cjs`, który oczekuje poprawnego UTF-8 w pozycji menu:

```ts
...(canUseAiDraftsByPlan ? [{ icon: CheckCircle2, label: 'Inbox szkiców', path: '/ai-drafts' }] : [])
```

W logu widoczny był mojibake:

```text
Inbox szkicĂłw
```

## Zakres

- `src/components/Layout.tsx`
- tylko naprawa tekstu/guardu UTF-8
- bez zmian w finansach, routingu, planach i billing/access

## Weryfikacja

```powershell
node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs
npm.cmd run verify:closeflow:quiet
```
