# CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1 — mapowanie okienek operatora

Data: 2026-05-11
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel

Wszystkie okienka typu modal/dialog mają korzystać z jednego źródła prawdy:

- `src/components/ui/dialog.tsx` — wspólny komponent `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`.
- `src/styles/closeflow-modal-visual-system.css` — wspólne tło, header, footer, inputy, selecty, textarea i focus ring.

## Problem zgłoszony

Modal `Nowy lead` miał białą kartę, czarne pola wpisywania i słabą czytelność etykiet. To tworzyło rozjazd względem lepiej wyglądających okienek, np. zadania albo szablonu.

## Mapowanie okienek do jednego stylu

| Obszar | Plik | Typ okienka | Status po tym etapie |
|---|---|---|---|
| Szybkie akcje operatora | `src/components/GlobalQuickActions.tsx` | Lead / Zadanie / Wydarzenie / Szybki szkic | przez wspólne DialogContent |
| Szybki szkic | `src/components/QuickAiCapture.tsx` | Dialog AI draft | przez wspólne DialogContent |
| Nowe zadanie | `src/components/TaskCreateDialog.tsx` | Dialog task | przez wspólne DialogContent |
| Nowy lead | `src/pages/Leads.tsx` | Dialog lead | przez wspólne DialogContent + override pól formularza |
| Nowy klient | `src/pages/Clients.tsx` | Dialog client | przez wspólne DialogContent + override pól formularza |
| Nowa sprawa | `src/pages/Cases.tsx` | Dialog case | przez wspólne DialogContent |
| Nowe wydarzenie | `src/pages/Calendar.tsx` | Dialog event | przez wspólne DialogContent |
| Szablony spraw | `src/pages/Templates.tsx` | Dialog template | przez wspólne DialogContent |
| Szablony odpowiedzi | `src/pages/ResponseTemplates.tsx` | Dialog response template | przez wspólne DialogContent |
| Szkice AI | `src/pages/AiDrafts.tsx` | dialogi/akcje szkiców | przez wspólne DialogContent, jeśli używają komponentu bazowego |
| Konflikty/duplikaty | `src/components/EntityConflictDialog.tsx` | Dialog konfliktu | przez wspólne DialogContent |

## Zasada od teraz

Nie stylować każdego modala osobno. Jeżeli powstaje nowe okienko, ma używać `DialogContent`. Jeżeli formularz wymaga wyjątkowego układu, można dodać klasę lokalną, ale kolory pól, czytelność, focus i footer mają zostać ze wspólnego systemu.

## Czego nie robić

- Nie przywracać ciemnego tła w inputach i textarea w modalach.
- Nie ustawiać lokalnie białych etykiet na jasnym tle.
- Nie robić osobnego systemu dla `Nowy lead`, `Nowy klient`, `Nowa sprawa`.
- Nie przepinać danych ani logiki zapisu. To jest etap UI contract, nie etap CRUD.

## Test ręczny

1. Otwórz z górnych szybkich akcji: `Lead`, `Zadanie`, `Wydarzenie`, `Szybki szkic`.
2. Wejdź w `/clients` i kliknij `Dodaj klienta`.
3. Wejdź w `/cases` i kliknij dodanie sprawy.
4. Wejdź w `/templates` oraz `/response-templates` i sprawdź dodawanie/edycję.
5. Pola tekstowe mają być jasne, czytelne, z ciemnym tekstem i zielonym focusem.
6. Header i footer modala mają wyglądać spójnie.
7. Mobile: brak poziomego scrolla, stopka z przyciskami jest dostępna.
