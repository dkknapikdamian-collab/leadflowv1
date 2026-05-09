# CloseFlow A2 — Duplicate warning UX full finalizer

**Data:** 2026-05-09  
**Etap:** A2 — Duplicate warning UX full  
**Tryb:** finalizer / guard / runtime smoke checklist

## Werdykt

A2 nie jest przepisywany od zera. Istniejący flow konfliktów zostaje, a ten finalizer dopina guard oraz ujednolica kopię modala.

## Zakres

- Lead i klient używają `EntityConflictDialog`.
- Przed zapisem wywoływany jest `findEntityConflictsInSupabase`.
- Backend `api/system?kind=entity-conflicts` wykrywa konflikt po: `email`, `phone`, `name`, `company`.
- Modal pokazuje powody przez `matchFields`.
- Użytkownik może kliknąć `Pokaż`, `Przywróć` jeśli dotyczy, `Dodaj mimo to` albo anulować.

## Nie robimy

- Brak automatycznego scalania.
- Brak automatycznego usuwania.
- Brak AI dedupe.
- Brak blokady zapisu po świadomym kliknięciu `Dodaj mimo to`.

## Check automatyczny

`npm run check:closeflow-duplicate-warning-ux-full`

Sprawdza:

- dialog konfliktu,
- flow dla leadów,
- flow dla klientów,
- backend fields: email / phone / name / company,
- routing `entity-conflicts` w `api/system.ts`,
- konsekwencję override `allowDuplicate / forceDuplicate` na poziomie typów/ścieżek tworzenia.

## Runtime smoke po wdrożeniu

1. W `Leady` dodaj lead z telefonem istniejącego leada.
2. Ma pojawić się modal `Możliwy duplikat`.
3. Lista powodów ma pokazać `telefon`.
4. Kliknij `Pokaż` i sprawdź, czy prowadzi do istniejącego rekordu.
5. Powtórz i kliknij `Dodaj mimo to`; zapis ma przejść dopiero po tym kliknięciu.
6. W `Klienci` dodaj klienta z telefonem istniejącego klienta.
7. Ma pojawić się modal `Możliwy duplikat`.
8. Powód ma obejmować `telefon` albo inne zgodne pole.
9. Jeśli kandydat jest archiwalny, ma być dostępne `Przywróć`.
10. `Anuluj` nie zapisuje nowego rekordu.

## Kryterium zamknięcia

A2 jest domknięte dopiero, gdy check przechodzi, build przechodzi i ręcznie zobaczysz modal duplikatu dla leada oraz klienta.
