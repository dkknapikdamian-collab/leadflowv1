# DECYZJE - CloseFlow lead app

## Aktywne decyzje

### D1 - Produkt nie jest zwykłym CRM-em
CloseFlow ma być panelem codziennej egzekucji leadów, spraw, zadań i terminów.

### D2 - `Dziś` jest centrum decyzji
Ekran `Dziś` ma pokazywać, co zrobić teraz i dlaczego.

### D3 - Model domenowy
- Lead = temat do pozyskania.
- Sprawa = temat prowadzony operacyjnie.
- Klient = osoba / firma w tle.

### D4 - Po pozyskaniu lead przechodzi do sprawy
Po kliknięciu `Rozpocznij obsługę` dalsza praca odbywa się na sprawie, nie na leadzie ani kliencie.

### D5 - AI nie tworzy finalnych rekordów bez potwierdzenia
AI może czytać dane, porządkować notatki i tworzyć szkice. Finalny zapis wymaga potwierdzenia użytkownika.

### D6 - Google Calendar później
Google Calendar sync ma sens dopiero po stabilizacji modelu tasków i eventów.

### D7 - Nie tworzyć nowych gałęzi
Domyślna gałąź robocza to `dev-rollout-freeze`.

## Decyzje z konfliktem / do potwierdzenia

### C1 - Trial 7 dni vs 21 dni
Starsze ustalenia mówią o 7-dniowym trialu. Dokument planów z 2026-04-26 wskazuje Trial Pro/AI 21 dni. Nie zmieniać kodu bez potwierdzenia Damiana albo jednoznacznego nowszego źródła w repo.

### C2 - `Next step` legacy vs `Najbliższa zaplanowana akcja`
Nowsza specyfikacja usuwa tekstowe `Następny krok` z głównej logiki. Jeśli kod nadal używa `nextStep`, trzeba sprawdzić, czy jest to legacy compatibility, czy stary błąd do usunięcia.

## Hipotezy / propozycje, nie decyzje

- Lead Opportunity Radar jako osobny produkt lub późniejszy moduł.
- AI outbound / lead intelligence jako późniejszy etap.
- Rozszerzenia segmentowe dla nieruchomości i usług lokalnych.

## Decyzje porzucone lub ograniczone

- Nie budować enterprise CRM w V1.
- Nie robić natywnej aplikacji Android/iOS w V1.
- Nie robić automatycznego nagrywania rozmów.
- Nie robić WhatsApp / social scraping w V1.
- Nie robić AI zapisującego dane bez potwierdzenia.
