# STAGE231D0B-R8B — EOF cleanup after R8 guard PASS

Data: 2026-06-10 Europe/Warsaw
Status: LOCAL_ONLY / EOF_CLEANUP_AFTER_R8 / DO_NOT_PUSH_BEFORE_FULL_PASS

## Powód

R8 naprawił encoding i guard przeszedł, ale etap zatrzymał się na `git diff --check` przez dodatkową pustą linię na końcu centralnych plików `_project`.

## Zakres

- Nie resetowano zmian R8.
- Usunięto trailing spaces i nadmiarowe puste linie EOF w plikach allowlisty STAGE231D0B.
- Usunięto artefakty failed retry R2-R7, jeśli występowały lokalnie.
- Dodano tę notatkę jako domknięcie R8B.

## Wymagane testy

- `npm run check:stage231d0b-client-list-card-freeze`
- `git diff --check`
- `npm run build`
- ręczny test `/clients`

## Audyt ryzyk

- Ryzyko główne: stary historyczny mojibake w centralnych plikach `_project` nadal istnieje, ale nie dotyczy widocznego UI STAGE231D0B. Ma być osobnym etapem globalnego cleanupu, nie blokadą kafelka klienta.
- Ryzyko drugie: jeśli po R8B `git diff --check` nadal failuje, trzeba wkleić pełny log, nie commitować.
