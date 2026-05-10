# CloseFlow API-0 — Vercel Hobby function consolidation

Status: wdrożenie redukcji liczby Serverless Functions z 13 do maksymalnie 12.

Marker: `API0_VERCEL_HOBBY_DIGEST_CONSOLIDATION`

## Problem

Vercel Hobby blokuje deploy, gdy projekt ma więcej niż 12 funkcji API. Heavy QA pokazał 13 funkcji.

## Decyzja

Usuwamy fizyczny plik `api/daily-digest.ts`, bo publiczny URL `/api/daily-digest` już jest utrzymany przez rewrite w `vercel.json` do `/api/system?kind=daily-digest`.

`api/system.ts` obsługuje teraz jawnie:

- `kind=daily-digest` przez `dailyDigestHandler`,
- `kind=weekly-report` przez `weeklyReportHandler`.

## Nie zmieniamy

- nie wycinamy digestu,
- nie zmieniamy publicznego URL crona,
- nie zmieniamy logiki wysyłki maili,
- nie ruszamy Stripe / billing / webhooków,
- nie mieszamy z FIN-5.

## Kryterium

- `api/daily-digest.ts` nie istnieje,
- `vercel.json` ma rewrite `/api/daily-digest -> /api/system?kind=daily-digest`,
- liczba plików funkcji w `api/*` jest <= 12,
- guard `check:closeflow-api0-vercel-hobby-functions` przechodzi,
- `tsc --noEmit` przechodzi.
