# CloseFlow — packet 1: tekst + kolory + semantyka akcji dla głównych kafelków/headerów

## Co robimy teraz

Nie rozbijam tego na milion etapów.
Robimy **jeden pierwszy pakiet porządkowy**, który ustawia fundament pod dalsze dopinanie menu.

Ten pakiet robi 2 rzeczy naraz, ale w dwóch osobnych źródłach prawdy:

1. **Źródło prawdy dla tekstu i ułożenia copy**
   - `src/styles/closeflow-page-header-copy-source-truth.css`
2. **Źródło prawdy dla semantyki akcji / kolorów przycisków**
   - `src/styles/closeflow-page-header-action-semantics-packet1.css`

## Cel pakietu

- AI = **fiolet**
- neutralne akcje = **biały przycisk + niebieski tekst/ikonka**
- kosz / usuń = **czerwony**, podpięty pod tokeny kosza
- tekst w headerach wraca do układu jak w „Dziś”
- duplikaty opisów są wygaszane w samym headerze
- układ akcji ma jeden wspólny wzór

## Co dokładnie obejmuje ten pakiet

### Tekst / copy
- wymusza lewą kolumnę copy jak w „Dziś”
- czyści powtórzone opisy w headerze
- poprawia tekst `Szkice AI` z końcówki `w CRM` na `przed zapisem`
- poprawia bazowe opisy z `page-header-content.ts`, jeśli są tam obecne

### Przyciski / kolory / ikonki
- AI buttony dostają semantykę fioletową
- delete / trash / danger są spięte z tokenami kosza
- wszystkie ikonki w przyciskach dziedziczą `currentColor`, więc zielone lokalne ikonki (np. w rozliczeniach) nie powinny już przełamywać source-of-truth
- `Szybki szkic` dostaje znacznik AI i idzie tym samym torem co inne AI akcje

## Czego ten pakiet jeszcze nie rozwiązuje w 100%

To jest świadome:
- nie dokładam tu jeszcze nowych akcji do kalendarza (`Dodaj wydarzenie`, `Dodaj zadanie`) jeśli obecna struktura headera ich nie ma — to będzie następne dopięcie po stabilizacji tego źródła prawdy,
- nie ruszam logiki modali,
- nie ruszam routingu i backendu.

## Dlaczego tak

Najpierw porządkujemy **semantykę i konflikt CSS**, bo bez tego każda kolejna poprawka przycisku lub tekstu będzie znów nadpisywana przez stare warstwy.

## Po wdrożeniu sprawdź

1. `Zapytaj AI` i `Szybki szkic` mają fioletową ikonę i tekst.
2. `Zarządzaj planem` nie ma zielonej ikonki.
3. `Szkice AI`, `Powiadomienia`, `Biblioteka odpowiedzi` nie pokazują zdublowanego opisu.
4. `Zadania` i `Aktywność` mają tekst ustawiony jak „Dziś”, a nie przesunięty/wycentrowany.
5. `Usuń` / kosz w headerach ma czerwony tekst/ikonę, zgodny z tokenami kosza.
