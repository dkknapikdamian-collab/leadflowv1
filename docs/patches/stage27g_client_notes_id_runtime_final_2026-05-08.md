# Stage27G — Client note listener id runtime final

## Problem

Stage27F zatrzymał się przez zbyt agresywny check, który wykrywał każde `id` w okolicy listenera. Produkcyjny błąd po Stage27E był konkretny:

`ReferenceError: id is not defined`

## Zmiana

- Naprawiane są tylko konkretne wadliwe wzorce:
  - `client?.id || id`
  - `String(id || '')`
  - `[client?.id, id]`
  - `[id]`
- Listener używa wyłącznie `client?.id`.
- Usuwane są lokalne ślady failującego Stage27F.
- Apply odpala guard, build, commit i push.

## Zakres

Tylko runtime hotfix notatek klienta. Finanse zostają na Stage28.
