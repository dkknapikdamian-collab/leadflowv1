# Stage227E3 — Decision Cards Cleanup

Status: local-only, bez pushu

## Cel

Top cards LeadDetail mają być czystą warstwą decyzji sprzedażowej.

## Decyzja

Zostają cztery karty:
- Następny krok
- Potencjał
- Cisza / ryzyko
- Blokada

## Zasady

- Blokada jest osobnym sygnałem na górze.
- Potencjał nie dubluje już metadanych typu źródło/status.
- Kontekst sprzedażowy pozostaje usunięty po Stage227E2.
- Work center, notatki i historia nie są ruszane w tym etapie.

## Testy

- check:stage227e3-decision-cards-cleanup
- test:stage227e3-decision-cards-cleanup
- regresje E2/E1/E0/E3 shared quick actions
- npm run build
