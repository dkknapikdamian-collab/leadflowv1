# A29F - keep all changes + Vercel deploy hotfix

## Cel

Nie cofamy branchy i nie tracimy etapów A26/A27/A28/A29.

Naprawiamy aktualny HEAD na `dev-rollout-freeze`, żeby Vercel mógł wystawić najnowszy kod.

## Diagnoza

Po A25 pojawiły się dodatkowe fizyczne pliki API:

- `api/response-templates.ts`
- `api/daily-digest.ts`
- `api/weekly-report.ts`

Repo ma już konsolidację przez `api/system.ts` i `vercel.json`. Takie pliki mogą tworzyć dodatkowe funkcje Vercel, mimo że routing może iść przez `/api/system`.

## Zmiana

- zachowujemy funkcje response templates, daily digest i weekly report,
- usuwamy zbędne stubs z `api/`,
- dodajemy rewrite `/api/weekly-report` -> `/api/system?kind=weekly-report`,
- dodajemy obsługę `weekly-report` w `api/system.ts`,
- crony zostają na tych samych ścieżkach.

## Nie zmieniono

- Nie robimy rollbacku.
- Nie kasujemy zmian A26/A27/A28/A29.
- Nie zmieniamy UI.
- Nie zmieniamy Supabase schema.

## Check

```powershell
npm.cmd run check:a29f-vercel-deploy-hotfix
```
