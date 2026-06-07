# STAGE227E2_REMOVE_SALES_CONTEXT_BLOCK

## Cel
Usunąć z runtime duży blok "Kontekst sprzedażowy", bo po E0/E1 ekran LeadDetail ma być szybszym ekranem decyzji, a nie formularzem-audytem.

## Zakres
- Usunięto renderowaną sekcję sales context z LeadDetail.
- Zostawiono Work Action Center jako główne miejsce pracy: najbliższe działania, braki i blokady, wszystkie aktywne.
- Nie ruszano top card "Blokada" — to osobny podetap.
- Nie ruszano rozdzielenia notatek i historii — to osobny podetap.
- Nie ruszano SQL/Supabase.

## Guard
- scripts/check-stage227e2-remove-sales-context-block.cjs

## Test
- tests/stage227e2-remove-sales-context-block.test.cjs

## Status
Local-only. Nie pushować. Zbieramy większą paczkę lokalnie.
