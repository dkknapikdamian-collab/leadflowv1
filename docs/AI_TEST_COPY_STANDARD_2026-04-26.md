# CloseFlow — standard krótkich tekstów testowych AI

## Status
Zasada nadrzędna dla modułu AI assistant / quick capture.

## Zasada
Testy kontraktowe AI mają sprawdzać zachowanie i stałe znaczniki, a nie długie teksty marketingowe.

## Przykłady krótkich tekstów do testów
- Co mam jutro?
- Co mam dzisiaj zrobić?
- Mam leada Warszawa
- Dorota Kołodziej

## Czego unikać
- Długich zdań jako wymaganych matcherów w testach.
- Testów łamiących release gate po zmianie copy, gdy logika nadal działa.
- Ukrywania ważnych markerów kontraktowych w niestabilnym tekście UI.

## Markery kontraktowe, które mogą zostać w kodzie
- AI_ASSISTANT_AUTO_SAVE_LEAD_DRAFT
- AI_ASSISTANT_CLEAR_INPUT_AFTER_RESULT

## Cel
Release gate ma łapać regresję działania asystenta, nie kosmetyczną zmianę zdania w UI.


## V73 doprecyzowanie

- Testy AI nie powinny wymuszać długich tekstów UI.
- Długie historyczne frazy trzymamy jako stabilne markery źródłowe, najlepiej w komentarzu.
- Widoczny tekst w aplikacji ma być krótki.
- Logika ma być sprawdzana po zachowaniu, a copy tylko tam, gdzie jest to świadomy kontrakt.

## V74 legacy marker rule

- Legacy tests mogą czasem szukać starej nazwy komponentu albo markera tekstowego.
- Jeżeli logika została przeniesiona do wrappera, dopuszczalny jest krótki komentarz-kompatybilność zamiast cofania architektury.
- Nie przywracamy długiego copy w UI tylko po to, żeby zadowolić test.

- v77: release gate dopina test 	ests/ai-safety-gates-direct-write.test.cjs odpornie na zmiany kolejności listy testów.

## v79: wyrównanie testu command center po bramkach bezpieczeństwa

- Test `ai-assistant-command-center` nie może już zakładać, że `insertTaskToSupabase` i `insertEventToSupabase` nigdy nie występują w asystencie.
- Aktualny kontrakt: leady nie są zapisywane bezpośrednio, a zadania i wydarzenia mogą być zapisane tylko za trybem `direct_task_event`.
- Tryb bezpośredni musi mieć widoczne markery: `AI_DIRECT_WRITE_MODE_STATE`, `parseAiDirectWriteCommand`, `getStoredAiDirectWriteMode`, `persistAiDirectWriteMode`.
## v80 capture handoff contract

- Stary kontrakt `assistant must not save tasks directly` był poprawny dla trybu bez bramek bezpieczeństwa.
- Po dodaniu trybu `direct_task_event` asystent może zapisać zadanie lub wydarzenie bezpośrednio tylko po świadomym włączeniu bramki.
- Lead nadal nie jest tworzony finalnie przez asystenta. Oczywiste leady trafiają do Szkiców AI.
- Test `ai-assistant-capture-handoff` ma pilnować rozdziału: handoff/szkice dla leadów, direct write tylko dla task/event i tylko za bramką.
