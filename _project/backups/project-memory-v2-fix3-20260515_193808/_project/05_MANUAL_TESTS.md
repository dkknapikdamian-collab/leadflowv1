# TESTY RĘCZNE - CloseFlow lead app

## Zasada

Test ręczny zapisujemy dopiero, gdy Damian go wykona albo gdy jest wymagany jako instrukcja do sprawdzenia.

## Minimalna ścieżka smoke po większym etapie

1. Uruchom aplikację lokalnie.
2. Wejdź w `Dziś`.
3. Sprawdź, czy nie ma white screen.
4. Sprawdź polskie znaki.
5. Dodaj leada.
6. Dodaj task powiązany z leadem.
7. Dodaj wydarzenie.
8. Sprawdź, czy task/wydarzenie widać w Today, Tasks, Calendar i LeadDetail.
9. Przejdź lead -> sprawa, jeśli flow jest w zakresie danego etapu.
10. Odśwież stronę.
11. Sprawdź, czy dane wracają.
12. Sprawdź mobile width.

## Testy ekranów

### Today
- zaległe,
- dzisiejsze,
- szkice do sprawdzenia,
- sekcje ryzyka,
- top staty zgodne z listami.

### Leads
- lista,
- filtry,
- wyszukiwarka,
- aktywne vs pozyskane,
- brak starych kafli / pozostałości, jeśli dotyczy etapu.

### LeadDetail
- aktywny lead pokazuje najbliższą zaplanowaną akcję,
- lead pozyskany pokazuje `Ten temat jest już w obsłudze`,
- po pozyskaniu nie pokazuje sprzedażowych akcji, które sugerują dalszą pracę na leadzie.

### ClientDetail
- klient jest rekordem łączącym tematy,
- nie staje się głównym ekranem pracy po pozyskaniu leadu.

### CaseDetail
- sprawa jest głównym ekranem pracy operacyjnej,
- notatki, zadania, wydarzenia i checklisty są w sprawie.

### AI Drafts / Assistant
- pytanie `co mam jutro?` odpowiada na podstawie danych,
- komenda `zapisz zadanie...` tworzy szkic, nie finalny rekord,
- dyktowanie nie dubluje narastających fragmentów mowy.

### Billing
- stan planu zgodny z backendem,
- Free ograniczony,
- płatne funkcje blokowane zgodnie z planem.

## Potwierdzenia Damiana

Potwierdzone wyniki przenosić do `_project/11_USER_CONFIRMED_TESTS.md`.
