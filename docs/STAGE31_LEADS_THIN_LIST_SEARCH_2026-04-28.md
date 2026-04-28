# Stage31 - leady jako cienka, numerowana lista i wyszukiwarka z podpowiedziami

## Cel

Uprościć zakładkę `Leady`, żeby tester widział listę operacyjną zamiast ciężkich kart. Etap dodaje układ: cienka, numerowana lista, jednowierszowe podsumowanie leada oraz podpowiedzi wyszukiwania.

## Zmienione pliki

- `src/pages/Leads.tsx`
- `tests/stage31-leads-thin-list-search.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `scripts/closeflow-release-check.cjs`

## Zakres

- Każdy lead dostaje automatyczny numer widoczny w wierszu.
- Wyszukiwarka działa po nazwie, telefonie, e-mailu, firmie, źródle i powiązanej sprawie.
- Pod wyszukiwarką pojawiają się szybkie podpowiedzi leadów.
- Główny wiersz leada jest bardziej zwarty i ma jedną linię podstawowych informacji.
- Usunięto hałaśliwy komunikat pustego wyszukiwania.

## Nie zmieniono

- Nie zmieniono zapisu leadów.
- Nie zmieniono kosza leadów poza wcześniejszym Stage30.
- Nie zmieniono SQL ani Supabase schema.
- Nie ruszono liczenia wartości relacji. Osobne przeniesienie `Najcenniejsze` na prawą stronę zostaje na Stage32.

## Komendy sprawdzające

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/stage31-leads-thin-list-search.test.cjs
```

## Kryterium zakończenia

Zakładka `Leady` ma lżejszy, numerowany układ, a wyszukiwarka podpowiada rekordy podczas wpisywania.
