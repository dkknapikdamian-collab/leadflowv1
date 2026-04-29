# Prompt dla AI developera: CloseFlow UI 1:1

Masz wdrożyć nowy wygląd CloseFlow na podstawie wzorca HTML i repo aplikacji.

Aplikacja jest w React + TypeScript + Vite. Widoki są w `.tsx`, style są w `.css`, część stylu jest przez Tailwind utility classes. HTML jest wzorcem wizualnym. Nie wklejaj HTML-a do aplikacji jako gotowego kodu.

## Cel

- czytelność w 5 sekund
- stała lewa nawigacja
- stały globalny pasek akcji
- listy z tym samym rytmem kafli, wyszukiwarki i rekordów
- karty szczegółowe: dane po lewej, praca w środku, akcje po prawej
- AI jako prosty przycisk otwierający szufladę/modal
- bez stałego wielkiego panelu AI na ekranie

## Zakaz

Nie wolno usuwać funkcji, zmieniać logiki Supabase/Firebase, zmieniać routingu biznesowego, nazw pól danych, usuwać formularzy ani zmieniać działania AI ze szkicu na automatyczny zapis.

## Kolejność

1. Layout + GlobalQuickActions
2. Leady
3. Karta leada
4. Klienci
5. Karta klienta
6. Sprawy
7. Karta sprawy
8. Zadania
9. Kalendarz
10. Aktywność
11. Szkice AI
12. Powiadomienia
13. Rozliczenia
14. Pomoc
15. Ustawienia
16. Dziś jako ostatni lekki polish

Po każdym etapie uruchom build i test polskich znaków.
