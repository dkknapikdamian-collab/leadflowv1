# STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX — report

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ: test-fix po Stage226R11 apply

## Diagnoza

R11 apply poprawnie przepisał kod i guard R11 przeszedł, ale test padł na assert.deepEqual/deepStrictEqual mimo identycznej struktury obiektu:

- actual: { dateTime: '2026-06-15T12:00:00', timeZone: 'Europe/Warsaw' }
- expected: { dateTime: '2026-06-15T12:00:00', timeZone: 'Europe/Warsaw' }

Powód: kontrakt TS był ładowany przez vm.runInNewContext, więc zwracany object miał inny realm/prototype niż literal expected w teście.

## Zmiana

Test normalizuje wynik przez JSON.parse(JSON.stringify(value)) przed deepStrictEqual.

## Ryzyko

Niskie. Nie zmienia logiki aplikacji. Ryzyko pozostaje po stronie ręcznego smoke Google Calendar po deployu.
