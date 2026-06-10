# STAGE231D0A-R3 — Guard payload + EOF rescue

Marker: STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE
Status: LOCAL_RESCUE_PREPARED / DO_TEST_AND_PUSH
Data i godzina: 2026-06-10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY
- STAGE231D0A-R2 runner miał błąd składni PowerShell, więc nie mógł naprawić D0A.
- Bazowy D0A został wypchnięty mimo FAIL guarda/testu i FAIL diff hygiene.
- Build przechodził, ale to nie wystarcza do zamknięcia etapu.

## DECYZJE
- Nie rozpoczynać D0, dopóki D0A nie ma PASS: guard, test, build i diff hygiene.
- R3 nie zmienia runtime UI, danych, finansów, kosztów, Supabase ani Google Calendar.

## ZAKRES NAPRAWY
- Naprawiono payload Obsidiana, aby zawierał wymagane tokeny: audyt ryzyk i następny krok.
- Znormalizowano EOF w centralnych plikach projektu dotkniętych D0A.
- Usunięto z VST doc literalny przykład wartości CSS, który powodował ostrzeżenie guarda.
- Dodano run report R3 i wpisy w centralnych plikach projektu.

## TESTY
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

## audyt ryzyk po etapie
- Ryzyko 1: poprzedni commit D0A istnieje na branchu z historią FAIL; R3 ma domknąć stan bez przepisywania historii.
- Ryzyko 2: build pokazuje unrelated warning o duplicate key savedRecord w ContextActionDialogs.tsx; nie naprawiać go w D0A-R3, zaplanować osobny mikro-bugfix, jeśli utrzymuje się po D0A.
- Ryzyko 3: jeśli D0 zacznie stylować ClientDetail lokalnie, złamie sens D0A. D0 musi korzystać z mapy VST.

## następny krok
Po PASS i pushu R3 przejść do STAGE231D0 — Client workspace UX cleanup + mojibake guard.
