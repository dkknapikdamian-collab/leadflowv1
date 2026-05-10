# CLOSEFLOW A2 Duplicate warning UX finalizer — 2026-05-09

Marker: CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER

## Cel

Domknąć ostrzeżenia o duplikatach dla leadów i klientów bez automatycznego scalania.

## Zasada produktu

Przed zapisem leada albo klienta aplikacja ma sprawdzić podobne rekordy przez:

```ts
findEntityConflictsInSupabase({
  targetType: 'lead' | 'client',
  name,
  company,
  email,
  phone,
  workspaceId,
})
```

Jeśli są kandydaci, aplikacja zamyka modal tworzenia i otwiera `EntityConflictDialog`.

## UX

Dialog pokazuje powody dopasowania:

- e-mail,
- telefon,
- nazwa,
- firma.

Akcje:

- Pokaż,
- Przywróć,
- Dodaj mimo to,
- Anuluj.

## Zakazy

- Nie scalać automatycznie.
- nie blokować zapisu.
- Nie usuwać automatycznie.
- Nie robić AI dedupe.

Zasada operacyjna: ostrzegać, ale nie blokować zapisu.

## Flaga duplikatu

API ma dostawać jedną flagę: `allowDuplicate`.

Jeśli UI lokalnie używa `forceDuplicate`, musi być jawnie mapowane do `allowDuplicate` przed wywołaniem API.

## Backend

`api/system.ts` dla `kind=entity-conflicts` deleguje do handlera konfliktów, który:

- szuka w leadach,
- szuka w klientach,
- normalizuje e-mail,
- normalizuje telefon,
- normalizuje nazwę,
- normalizuje firmę,
- zwraca `matchFields`.

## Kryterium zakończenia

```bash
npm run check:a2-duplicate-warning-ux-finalizer
npm run build
```

Lead i klient z tym samym mailem, telefonem, nazwą albo firmą pokazują warning, ale można dodać mimo to.
