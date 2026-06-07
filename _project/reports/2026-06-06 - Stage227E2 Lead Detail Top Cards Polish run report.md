# Run report — Stage227E2 Lead Detail Top Cards Polish

Data: 2026-06-06 15:20 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Branch: dev-rollout-freeze
Tryb: local-only ZIP, bez pushu

## Zakres

Etap naprawia top cards w `src/pages/LeadDetail.tsx` i dodaje guard/test dla kontraktu.

## Pliki

- `src/pages/LeadDetail.tsx`
- `docs/stages/STAGE227E2_LEAD_DETAIL_TOP_CARDS_POLISH.md`
- `scripts/check-stage227e2-lead-detail-top-cards-polish.cjs`
- `tests/stage227e2-lead-detail-top-cards-polish.test.cjs`
- `package.json`
- `_project/roadmap/2026-06-06 - Stage227E2 Lead Detail Top Cards Polish.md`
- `_project/reports/2026-06-06 - Stage227E2 Lead Detail Top Cards Polish run report.md`
- `_project/obsidian_updates/2026-06-06 - Stage227E2 Lead Detail Top Cards Polish.md`

## Oczekiwane komendy po apply

```powershell
npm run check:stage227e2-lead-detail-top-cards-polish
npm run test:stage227e2-lead-detail-top-cards-polish
git diff --check
```

## Audyt ryzyk po etapie

1. Największe ryzyko: stare dane mogą nie mieć daty kontaktu. Wtedy `Cisza / ryzyko` może użyć `createdAt` jako fallback, co jest bezpieczniejsze niż `updatedAt`, ale nadal nie jest idealnym źródłem kontaktu.
2. Ten etap nie naprawia całej aplikacji, jeśli inne ekrany liczą ruch z `updatedAt`.
3. Zmiana jest ograniczona do top cards i źródła ciszy. Nie rozwiązuje jeszcze całej IA LeadDetail.
4. Guard zabezpiecza przed powrotem kafelka `Aktywny lead`, powrotem `Wartość` w top grid i przypadkowym użyciem `updatedAt` w ciszy.

## Czego nie ruszano

- SQL / migracje,
- Supabase schema,
- CaseDetail runtime,
- Action Center runtime,
- Google Calendar,
- finanse spraw,
- push/commit.
