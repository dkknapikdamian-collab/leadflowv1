# Stage27E — Client notes event final

## Cel

Naprawić stan po nieudanych Stage27A-D.

## Problem

Stage27D wymagał własnego eventu `STAGE27D_CONTEXT_NOTE_SAVED_EVENT`, a w repo mogła już istnieć wcześniejsza emisja eventu albo inny wariant. Naprawa była zbyt sztywna.

## Zrobione

- `Trash2` jest w imporcie `lucide-react`.
- `ClientDetail` ma helper `getClientVisibleNotes`.
- `ClientDetail` słucha `closeflow:context-note-saved`.
- `ContextNoteDialog` emituje `CustomEvent` po zapisie notatki.
- Lista notatek jest widoczna pod kartą notatki.
- Usuwane są lokalne ślady failujących Stage27A-D.
- Apply odpala guard, build, commit i push.

## Działa na stanie

Po nieudanych Stage27A/B/C/D. Nie resetować repo.
