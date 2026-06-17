# STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE

- data i godzina: 2026-06-17 05:05 Europe/Warsaw
- status: DO_APPLY_ZIP
- typ: screenshot-driven CSS-only header repair
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Audyt
Poprzednie R13 probowaly mutowac TSX i padaly na kotwicach.
Realny problem wizualny mozna naprawic stabilniej CSS-em:
- ukryc kicker/span/p w headerze modala Brak,
- zostawic h2 jako jedyny widoczny tytul,
- dopasowac font i tlo do Nowy lead.

## Manual smoke
1. Otworz Brak.
2. W lewym gornym rogu ma byc jedna linia: Dodaj brak.
3. Nie ma byc widoczne: Brak ani typ siedliska.
4. Porownaj z Nowy lead / Nowy klient.
