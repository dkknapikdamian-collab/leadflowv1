# Stage216M-R17 - Client note dialog matches LeadDetail

## FAKTY
- ClientDetail po R16 miał modal notatki, ale wizualnie i technicznie był osobny od LeadDetail.
- Damian wymaga jednego stylu wizualnego i jednego wzorca zachowania: `Dodaj notatkę` / `Dyktuj notatkę` otwiera modal jak w leadzie.

## DECYZJE DAMIANA
- Notatki klienta mają działać jak notatki leada.
- Dodanie notatki, wydarzenia i zadania z poziomu leada/klienta ma być automatycznie przypisane do tego rekordu.

## ZAKRES
- `src/pages/ClientDetail.tsx`
- `src/styles/stage216m-r17-client-note-dialog-match-lead.css`
- `tests/stage216m-r17-client-note-dialog-match-lead-contract.test.cjs`

## TESTY
- Guard R17 sprawdza wspólny wzorzec modala, zapis `client_note_added`, kontekst `clientId`, kontekst `leadId` oraz importy CSS.
- Build ma przejść lokalnie i na Vercelu.

## NASTĘPNY KROK
Po deployu zrobić test ręczny w UI: klient i lead, `Dodaj notatkę` oraz `Dyktuj notatkę`.
