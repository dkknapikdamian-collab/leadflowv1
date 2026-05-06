# STAGE5 — AI Read Query Hardening V1

## Cel

Utwardzić odpowiedzi odczytowe asystenta po Stage3/Stage4, szczególnie dla pytań testowych użytkownika:

- `Co mam jutro?`
- `Czy jutro o 17 coś mam?`
- `Czy w przeciągu 4 godzin mam spotkanie?`
- `Na kiedy mam najbliższy akt notarialny?`
- `Znajdź numer do Marka.`
- `Zapisz zadanie jutro 12 rozgraniczenie.`

## Co zmieniono

- naprawiono błąd kompilacji w `src/server/ai-assistant.ts`: zdublowana deklaracja `const prefixed`,
- pytania o godzinę używają overlapu czasu, więc event `16:30-17:30` pasuje do pytania `jutro o 17`,
- pytania `w przeciągu X godzin` także używają overlapu, nie tylko startu wydarzenia,
- kontakt lookup rozpoznaje podstawowe odmiany imion, np. `Marka` -> `Marek`,
- zachowano zasadę: AI czyta dane aplikacji albo tworzy szkic, ale nie zapisuje finalnego rekordu.

## Nie zmieniono

- UI asystenta,
- ekranu `Szkice AI`,
- billing/access,
- finalnego zatwierdzania rekordów.

## Testy

- `npm.cmd run check:stage5-ai-read-query-hardening-v1`
- `npm.cmd run test:stage5-ai-read-query-hardening-v1`

## Manualny test po wdrożeniu

1. Dodaj wydarzenie jutro `16:30-17:30`.
2. Zapytaj: `Czy jutro o 17 coś mam?`
3. Asystent powinien zwrócić to wydarzenie.
4. Dodaj kontakt `Marek` z telefonem.
5. Zapytaj: `Znajdź numer do Marka.`
6. Asystent powinien znaleźć numer bez tworzenia szkicu.
7. Zapytaj: `Zapisz zadanie jutro 12 rozgraniczenie.`
8. Asystent ma stworzyć szkic, nie finalne zadanie.
