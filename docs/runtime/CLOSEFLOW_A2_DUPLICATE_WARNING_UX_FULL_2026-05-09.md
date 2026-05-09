# CloseFlow A2 - Duplicate warning UX full

Data: 2026-05-09
Etap: A2
Zakres: runtime UX dla ostrzezen o mozliwych duplikatach leadow i klientow.

## Cel

Przy dodawaniu leada albo klienta aplikacja ostrzega o mozliwym duplikacie po:
- e-mail,
- telefon,
- nazwa,
- firma.

## Decyzje

- Nie scalamy automatycznie.
- Nie usuwamy automatycznie.
- Nie robimy AI dedupe.
- Ostrzezenie nie blokuje zapisu na stale.
- Zapis mimo konfliktu wymaga swiadomego klikniecia: Dodaj mimo to.

## Pliki

- src/pages/Leads.tsx
- src/pages/Clients.tsx
- src/components/EntityConflictDialog.tsx
- src/lib/supabase-fallback.ts
- api/system.ts
- package.json
- scripts/check-closeflow-a2-duplicate-warning-ux-full.cjs

## Check

- npm run check:a2-duplicate-warning-ux-full
- npm run build

## Manualny smoke test

1. Wejdz w Leady.
2. Dodaj leada z mailem lub telefonem istniejacego rekordu.
3. Ma pokazac sie modal: Mozliwy duplikat / Mozliwy duplikat.
4. Kliknij Pokaz - ma otworzyc istniejacy rekord.
5. Wroc i kliknij Dodaj mimo to - rekord zapisuje sie dopiero po tym kliknieciu.
6. Wejdz w Klienci.
7. Dodaj klienta z tym samym mailem, telefonem, nazwa albo firma.
8. Ma pokazac sie modal duplikatu.
9. Jesli kandydat jest archiwalny i mozliwy do przywrocenia, widac Przywroc.
10. Anuluj wraca do formularza klienta.
