# CloseFlow Stage179 — Tasks Polish Copy + Remove Focus Card

Data: 2026-05-24  
Status: przygotowano ZIP lokalny  
Typ: UI / tasks copy cleanup / pre-push fix

## FAKTY

- Stage178B przeszedł: guard Stage178B, guard Stage178 i build.
- Przed pushem Damian zgłosił dwie poprawki:
  - polskie znaki,
  - usunięcie `Szybki fokus`.
- Prawy panel zadań ma zostać lżejszy.

## DECYZJE DAMIANA

- Poprawić polskie znaki w zakładce `Zadania`.
- Usunąć kartę `Szybki fokus`.
- Zostawić `Filtry zadań` i `Najpilniejsze zadania`.
- Każda poprawka ma mieć guard.
- Bez pusha przed przejściem guardów i builda.

## HIPOTEZY AI

- Unicode escapes w `TasksStable.tsx` zabezpieczą tekst UI przed mojibake.
- Trzeba zaktualizować też Stage178 i Stage178B guardy, bo wcześniej wymagały `Szybki fokus`.

## TESTY

```powershell
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Po przejściu testów można wrócić do commit + push na `dev-rollout-freeze`.
