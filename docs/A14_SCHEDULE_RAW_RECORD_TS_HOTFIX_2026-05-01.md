# A14 — hotfix typów ScheduleRawRecord

## Cel

Domknąć A14 business type hardening po błędach TypeScript w kalendarzu i harmonogramie.

## Problem

Po usunięciu luźnego `any` w warstwie scheduling typ `ScheduleRawRecord` był za szeroki:

- `id?: string | number`,
- pola takie jak `type`, `caseId`, `priority` wpadały jako `unknown`.

To powodowało błędy w `Calendar.tsx`, bo edycja wydarzeń i zadań oczekuje pól tekstowych.

## Zmiana

- `ScheduleRawRecord.id` jest tekstowe.
- Pola biznesowe używane przez kalendarz mają jawne typy `string | null`.
- `raw` w `ScheduleEntry` pozostaje typowany, ale nie blokuje dodatkowych pól przez `[key: string]: unknown`.

## Nie zmieniono

- UI.
- Logiki zapisu.
- Źródeł danych.
- Supabase helperów.
- Trybu `strict` w TypeScript.

## Walidacja

Po wdrożeniu uruchamiane są:

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run check:a14-business-types
npm.cmd run test:critical
npm.cmd run lint
npm.cmd run build
```
