# Stage 25 - Client edit save close and multi contact

## Cel

Domknac dwa problemy z panelu klienta:
- przycisk `Zapisz` w edycji danych klienta po udanym zapisie automatycznie zamyka tryb edycji,
- email i telefon w edycji klienta maja przycisk `+`, ktory dodaje kolejne pole.

## Pliki do sprawdzenia

- `src/pages/ClientDetail.tsx`
- `tests/client-detail-edit-save-and-multi-contact-stage25.test.cjs`

## Zmien

- Dodaj komponent wielopolowy dla emaila i telefonu klienta.
- Nie wymagaj wpisywania dodatkowych danych w osobnych technicznych polach.
- Po zapisie klienta wywolaj zamkniecie trybu edycji.
- Kilka emaili lub telefonow zapisuj w aktualnych polach tekstowych jako lista rozdzielana srednikiem.

## Nie zmieniaj

- Nie dodawaj nowej tabeli SQL.
- Nie zmieniaj modelu klienta w bazie.
- Nie ruszaj logiki spraw, leadow, zadan i kalendarza.
- Nie usuwaj istniejacych danych kontaktowych.

## Po wdrozeniu sprawdz

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/client-detail-edit-save-and-multi-contact-stage25.test.cjs
```

## Kryterium zakonczenia

- `Zapisz` w edycji klienta zapisuje dane i wraca do zwyklego widoku klienta.
- Przy emailu i telefonie jest przycisk `+`.
- Uzytkownik moze dodac kilka emaili i kilka telefonow bez wpisywania technicznych ID.
- Test Stage 25 przechodzi.
