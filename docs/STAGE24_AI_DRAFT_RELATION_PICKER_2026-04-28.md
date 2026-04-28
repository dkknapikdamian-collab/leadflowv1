# Stage 24 — Szkice AI: wyszukiwanie powiązań zamiast ręcznego ID

Data: 2026-04-28
Status: paczka wdrożeniowa

## Cel

Poprawić zatwierdzanie szkiców AI do zadania, wydarzenia albo notatki tak, aby użytkownik nie musiał wpisywać ręcznie ID leada, klienta ani sprawy.

Użytkownik ma widzieć proste wyszukiwanie klienta, leada i sprawy z istniejącej bazy aplikacji, a po kliknięciu wybranego rekordu aplikacja ma sama podstawić właściwe ID pod zapis finalny.

## Pliki do sprawdzenia

- `src/pages/AiDrafts.tsx`
- `tests/ai-draft-relation-picker-stage24.test.cjs`

## Zmień

- Dodać pobieranie klientów, leadów i spraw z Supabase do ekranu `Szkice AI`.
- W panelu zatwierdzania szkicu usunąć pola ręcznego wpisywania `ID leada`, `ID sprawy`, `ID klienta`.
- Zastąpić je trzema wyszukiwarkami:
  - Lead,
  - Sprawa,
  - Klient.
- Każda wyszukiwarka ma filtrować po nazwie, telefonie, emailu, statusie i podstawowych danych rekordu.
- Po wyborze rekordu zapis finalny dalej używa ID w tle, ale użytkownik tego ID nie wpisuje.

## Nie zmieniaj

- Nie twórz finalnych rekordów automatycznie bez zatwierdzenia użytkownika.
- Nie zmieniaj działania Supabase sync szkiców.
- Nie usuwaj zatwierdzania szkicu do leadów, zadań, wydarzeń i notatek.
- Nie zmieniaj flow kalendarza ani listy zadań poza polem powiązania.

## Po wdrożeniu sprawdź

1. Wejdź w `Szkice AI`.
2. Otwórz szkic.
3. Kliknij przeniesienie do aplikacji.
4. Wybierz typ `Zadanie` albo `Wydarzenie`.
5. W sekcji powiązań wyszukaj istniejącego klienta, leada albo sprawę po nazwie.
6. Wybierz rekord z listy.
7. Zatwierdź.
8. Sprawdź, czy zadanie albo wydarzenie powstało i jest powiązane z wybranym rekordem.

## Kryterium zakończenia

- `npm.cmd run lint` przechodzi.
- `npm.cmd run verify:closeflow:quiet` przechodzi.
- `npm.cmd run build` przechodzi.
- `node tests/ai-draft-relation-picker-stage24.test.cjs` przechodzi.
- W `Szkicach AI` nie ma już ręcznego wpisywania ID relacji.
