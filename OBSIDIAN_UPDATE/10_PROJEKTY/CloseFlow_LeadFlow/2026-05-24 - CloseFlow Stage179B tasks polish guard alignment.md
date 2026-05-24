# CloseFlow Stage179B — Tasks Polish Guard Alignment

Data: 2026-05-24  
Status: przygotowano ZIP lokalny  
Typ: hotfix / tasks copy / guard alignment przed pushem

## FAKTY

- Stage179 build przeszedł, ale guardy nie.
- Stage179 guard znalazł resztkę mojibake: `zadaĹ`.
- Stage178 i Stage178B guardy oczekiwały literalnego `Filtry zadań`, którego nie było po zamianie tekstu na escape.
- Ręczne testy po apply były odpalone z `C:\Windows\System32`, dlatego nie znalazły `scripts/` ani `package.json`.

## DECYZJE DAMIANA

- Poprawić polskie znaki.
- Usunąć `Szybki fokus`.
- Nie pushować bez przejścia guardów.
- Każda poprawka ma mieć guard.

## HIPOTEZY AI

- Najlepsza naprawa to Stage179B: wyrównać teksty i guardy, nie omijać testów.
- Literalne nagłówki w JSX są OK i stabilizują Stage178/178B guardy.
- Etykiety w tablicach zostają jako unicode escapes dla odporności na mojibake.

## TESTY

```powershell
node scripts/check-stage179b-tasks-polish-guard-alignment.cjs
node scripts/check-stage179-tasks-polish-copy-remove-focus.cjs
node scripts/check-stage178b-tasks-rail-guard-repair.cjs
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Odpalić Stage179B. Jeżeli wszystkie guardy i build przejdą, wrócić do commit + push.
