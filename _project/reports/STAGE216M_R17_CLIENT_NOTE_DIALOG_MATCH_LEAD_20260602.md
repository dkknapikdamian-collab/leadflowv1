# STAGE216M-R17 Client note dialog matches LeadDetail

## Cel
Ujednolicić modal dodawania/dyktowania notatki klienta z modalem notatki leada. Klient nie ma mieć własnego ciemnego/custom modala ani lewego panelu notatki.

## Fakty
- R16-R3/R16-R4 naprawiły portal/deploy, ale modal klienta nadal wyglądał inaczej niż modal leada.
- LeadDetail używa `Dialog`, `DialogContent`, `DialogFooter`, `modalFooterClass()`, `lead-detail-add-note-dialog-form` i `lead-detail-note-input`.
- ClientDetail miał custom modal przez `createPortal` i klasy `client-note-modal-*`.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r17-client-note-dialog-match-lead.css`
- `tests/stage216m-r17-client-note-dialog-match-lead-contract.test.cjs`

## Zmiany
- ClientDetail używa tych samych prymitywów dialogu co LeadDetail.
- Przycisk `Dyktuj notatkę` w kliencie najpierw otwiera modal, potem uruchamia dyktowanie, jak w LeadDetail.
- Usunięto custom `createPortal`/`client-note-modal-*` dla notatki klienta.
- Dialog klienta zachowuje własny kontekst: copy mówi o kliencie, zapis zostaje jako `client_note_added` z `clientId`.
- Dodano guard, który sprawdza kontekst lead/client dla szybkich akcji oraz rozwiązywalność importów CSS page-adapters.

## Czego nie ruszano
API, Supabase SQL, płatności, prawa szyna finansów, inne widoki poza ClientDetail.

## Testy
- `node tests/stage216m-r17-client-note-dialog-match-lead-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Next step
Po deployu sprawdzić ręcznie: klient > Dodaj notatkę, klient > Dyktuj notatkę, lead > Dodaj notatkę, lead > Dyktuj notatkę.
