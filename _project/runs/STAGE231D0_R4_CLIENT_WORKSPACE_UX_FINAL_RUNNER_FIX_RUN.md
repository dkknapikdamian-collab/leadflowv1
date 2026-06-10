# STAGE231D0-R4 — Client workspace UX final runner fix

Data i godzina: 2026-06-10 18:55 Europe/Warsaw
Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

## FAKTY
- R3 zatrzymał się przed patchem, bo runner PowerShell uruchomił samo git bez argumentów.
- R4 usuwa wrapper funkcji z PowerShell i wykonuje jawne komendy.
- R4 patchuje ClientDetail przez stabilny skan lokalnego pliku, nie przez kruchy marker wcześniejszego etapu.

## VISUAL SOURCE OF TRUTH
- Cards: korzysta z istniejącego ClientDetail i D0A mapy VST.
- Buttons: bez nowych przycisków.
- Badges: bez nowych badge'y.
- Icons: finance tile używa EntityIcon entity=payment.
- Finance rows: nie zmieniano modelu finansów, tylko usunięto zdublowany right-rail hard-render label.
- Typography/spacing: bez nowych lokalnych tokenów.

## TESTY
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

## AUDYT RYZYK
- Ryzyko: fallback rename duplikatu aria-label może zostawić element wizualny, jeśli legacy block ma inną strukturę niż oczekiwana. Guard blokuje jednak więcej niż jedno aria-label=Finanse klienta.
- Ryzyko: istniejące ostrzeżenie build o duplicate savedRecord nie jest częścią D0 i zostaje jako osobny dług techniczny.
- Ryzyko: D0 nie rozwiązuje modelu kosztów; to idzie dopiero w D1.

## NASTĘPNY KROK
Po PASS i push przejść do STAGE231D1 — model kosztów.

## audyt ryzyk

- R4 częściowo naprawił ClientDetail, ale guard zatrzymał etap na ikonie finansów oraz brakujących tokenach raportowych.
- R5 domyka tylko guard/doc/ikona; nie zmienia modelu danych, kosztów, SQL, Supabase, Google Calendar ani delete/restore.
- Ryzyko regresji: kafel finansów klienta może dalej wymagać ręcznej oceny wizualnej po buildzie.

## następny krok

- Po PASS guardów, buildzie i git diff --check wykonać selektywny commit/push D0.
