# Stage35 - kompaktowy panel Asystenta AI

## Cel
Odchudzić panel Asystenta AI przed testami użytkownika. Panel ma wyglądać jak narzędzie do działania, a nie jak ekran diagnostyczny.

## Zmieniono
- Usunięto stare przykłady `Dorota Kołodziej` i `Mam leada Warszawa`.
- Dodano praktyczne przykłady: dodanie leada, plan dnia i zadanie z datą.
- Usunięto długie instrukcje między polem tekstowym a odpowiedzią.
- Ograniczono rząd akcji do przycisków `Zapytaj asystenta` i `Dyktuj`.
- Zostawiono krótki wybór trybu zapisu AI.
- Usunięto techniczne badge z panelu odpowiedzi.

## Nie zmieniono
- Nie zmieniono parsera AI.
- Nie zmieniono logiki bezpośredniego zapisu Stage28.
- Nie zmieniono zapisu do Szkiców AI.
- Nie dodano SQL.

## Test
`tests/stage35-ai-assistant-compact-ui.test.cjs`

## Kryterium zakończenia
Panel Asystenta AI jest krótszy, czytelniejszy i nadal zachowuje tryb `Szkice AI` oraz `Jasne rekordy od razu`.
