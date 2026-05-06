# STAGE16T AI static contract marker repair

Marker: `STAGE16T_AI_ASSISTANT_STATIC_CONTRACT_MARKERS_REPAIR`

## Cel
Naprawić regresję po Stage16S, gdzie build przechodził, ale statyczne testy AI asystenta nie znajdowały literalnych markerów:

- `const result = await askTodayAiAssistant`
- `speechSupported`

## Zakres
Ten etap dotyka tylko kontraktu statycznych testów dla `src/components/TodayAiAssistant.tsx`.
Nie wykonuje publikacji, nie dotyka API, nie dotyka bazy i nie tworzy rekordów.

## Pliki
- `src/components/TodayAiAssistant.tsx`
- `scripts/repair-stage16t-ai-static-contract-markers.cjs`
- `docs/release/STAGE16T_AI_STATIC_CONTRACT_MARKER_REPAIR_2026-05-06.md`

## Bezpieczeństwo
- `NO_PUBLISH_PERFORMED=True`
- `TOKEN_ACCESS_PERFORMED=False`
- `CHANNEL_API_CALLED=False`
- `REAL_WORKSPACE_MUTATED=False`
- `AUTO_PUBLISH_PERFORMED=False`

## Kryterium zakończenia
Po naprawie muszą przejść:

- `npm run build`
- `npm run check:stage16p:focused`

