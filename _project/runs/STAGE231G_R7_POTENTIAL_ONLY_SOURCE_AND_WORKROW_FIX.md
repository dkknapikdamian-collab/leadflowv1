# STAGE231G R7 - potential-only modal + value source + work-row alignment

Data: 2026-06-14 10:45 Europe/Warsaw

## AUDYT PRZED ETAPEM

FAKTY:
- AGENTS wymaga scan-first, guardów/testów i aktualizacji _project.
- LeadDetail po STAGE231G R6 otwierał z CTA potencjału pełny dialog Edytuj leada.
- API PATCH /api/leads zapisywał tylko value dla dealValue, a normalizeLeadContract preferuje deal_value przed value.
- Ręczny test Damiana: potencjał po zapisie pozostał bez zmiany, a akcja Zrobione w wierszu działań nie była wyrównana.

DECYZJA:
- Potencjał z kafelka/finansów ma otwierać tylko mały modal wartości.
- Source of truth wartości leada musi synchronizować value i deal_value.

## ZMIANY

- LeadDetail: potential-only modal i dedykowany handler zapisu.
- api/leads: PATCH/POST zapisują value + deal_value.
- CSS: desktopowe wyrównanie work-row actions.
- Guard/test R7.

## AUDYT PO ETAPIE

Ryzyka:
- API zapisuje dodatkowo deal_value; zakładamy, że kolumna istnieje, bo lista leadów już ją selectuje.
- Na wąskich ekranach akcje nadal mogą zawijać się celowo.
- Manualny test w przeglądarce jest wymagany, bo build nie sprawdza realnej mutacji Supabase.
