# Stage28b — AI direct write respects mode

Data: 2026-04-28

## Cel

Naprawić tryb Asystenta AI, w którym użytkownik wybiera zapis od razu zamiast wszystkiego przez Szkice AI.

## Co zmieniono

- tryb bezpośredniego zapisu respektuje ustawienie użytkownika,
- jasne leady/kontakty mogą zostać zapisane od razu,
- jasne zadania i wydarzenia z datą oraz godziną nadal mogą zostać zapisane od razu,
- niejasne komendy nadal trafiają do Szkiców AI,
- parser rozumie naturalne komendy typu `jutro po 10`,
- copy w UI nie sugeruje już, że każde `zapisz` zawsze oznacza szkic.

## SQL

Brak nowego SQL.

## Kontrola

- `npm.cmd run lint`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run build`
- `node tests/ai-safety-gates-direct-write.test.cjs`
- `node tests/ai-direct-write-respects-mode-stage28.test.cjs`
