# Stage 14 — Leads trash copy cleanup

## Cel

Usunąć martwy tekst informacyjny z widoku kosza w zakładce `Leady`:

> To jest kosz leadów. Rekordy są ukryte z aktywnej listy, ale można je przywrócić. Nie kasujemy ich trwale w V1.

## Zakres

- `src/pages/Leads.tsx`
- `tests/leads-trash-copy-cleanup-stage14.test.cjs`

## Zmiana

- Usunięto widoczny opis kosza leadów.
- Zachowano działanie kosza, licznik, przełącznik `Kosz` / `Pokaż aktywne`, przywracanie leadów i pusty stan kosza.
- Dodano marker `LEADS_TRASH_COPY_REMOVED_STAGE14`, żeby checker mógł pilnować, że martwy opis nie wróci.

## Nie zmieniaj

- Nie usuwaj funkcji kosza.
- Nie usuwaj przywracania leadów.
- Nie zmieniaj statusów `archived`, `leadVisibility`, `salesOutcome`.
- Nie ruszaj przepływu lead → klient → sprawa.

## Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/leads-trash-copy-cleanup-stage14.test.cjs
```

## Kryterium zakończenia

- W koszu leadów nie ma już starego opisu V1.
- Kosz nadal działa.
- Test Stage 14 przechodzi.
- Bramka `lint`, `verify:closeflow:quiet` i `build` przechodzą.
