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
