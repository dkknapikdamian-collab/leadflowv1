# CloseFlow FIN-14 REPAIR5 — Tasks header Plus guard

Data: 2026-05-13  
Branch: `dev-rollout-freeze`

## Cel

Naprawić kolejny czerwony guard po FIN-14 REPAIR4.

Po REPAIR4 zniknął statyczny handler `onClick={openNewTask}`, ale pełny `verify:closeflow:quiet`
przeszedł dalej i wykrył następny stary kontrakt UI:

```text
doesNotMatch /<Plus[\s\S]{0,120}Nowe zadanie[\s\S]{0,180}<\/Button>/
```

## Zakres

- `src/pages/TasksStable.tsx`
- usuwa dekoracyjną ikonę `<Plus />` z przycisku `Nowe zadanie`
- zostawia działanie przycisku bez zmian
- nie dotyka finansów, płatności, Supabase ani logiki formularza zadania

## Decyzja

To jest naprawa guardu UI, nie zmiana produktu. Przycisk nadal istnieje i nadal otwiera modal nowego zadania.
