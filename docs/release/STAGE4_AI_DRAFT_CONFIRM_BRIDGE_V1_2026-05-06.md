# STAGE4 — AI Draft Confirm Bridge V1

## Cel

Domknąć most między `AI Application Brain V1` a istniejącym ekranem `Szkice AI`.

Po tym etapie komenda zapisu z asystenta nie zostaje w osobnym lokalnym koszyku. Trafia do wspólnego mechanizmu szkiców, który użytkownik może przejrzeć, poprawić i dopiero potem zatwierdzić do finalnego rekordu.

## Zakres

- `src/lib/ai-draft-assistant-bridge.ts`
- `src/lib/ai-drafts.ts`
- `src/components/TodayAiAssistant.tsx`
- zachowany endpoint `/api/assistant/query`
- zachowany backendowy snapshot danych aplikacji

## Zasada bezpieczeństwa

AI nadal nie tworzy finalnych rekordów.

Asystent może tylko:

1. odpowiedzieć na podstawie danych aplikacji,
2. przygotować szkic,
3. zapisać szkic do wspólnego mechanizmu `Szkice AI`.

Finalny zapis powstaje dopiero po akcji użytkownika w ekranie `Szkice AI`.

## Naprawione ryzyko

Poprzedni etap mógł tworzyć lokalny szkic w osobnym storage. To było bezpieczne, ale słabe produktowo, bo szkic mógł nie trafić do głównego flow zatwierdzania.

Ten etap spina zapis szkicu z `saveAiLeadDraftAsync()` i Supabase-backed draft source of truth.

## Testy

- `npm.cmd run check:stage4-ai-draft-confirm-bridge-v1`
- `npm.cmd run test:stage4-ai-draft-confirm-bridge-v1`

## Manualny test

1. Otwórz asystenta.
2. Wpisz: `Zapisz zadanie jutro 12 rozgraniczenie`.
3. Sprawdź, że nie powstał finalny task.
4. Otwórz `Szkice AI`.
5. Sprawdź, popraw i zatwierdź szkic.
6. Dopiero po zatwierdzeniu powinien powstać finalny rekord.
