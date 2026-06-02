# Stage217 R2 - CaseDetail Operation Workspace UX marker repair

## Cel
Naprawić nieudany apply Stage217/R1 i wdrożyć mniej kruchy wariant przebudowy widoku sprawy.

## Fakty
- R1 zatrzymał się na markerze `notes tab trigger`.
- Guard Stage217 istniał po kopiowaniu payloadu, ale `CaseDetail.tsx` nie miał markerów etapu.
- Build po błędzie R1 przechodził, ale nie potwierdzał wdrożenia Stage217.

## Zakres R2
- Kopiuje CSS Stage217 i guard.
- Dodaje import CSS do `CaseDetail.tsx`.
- Dodaje marker `STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX`.
- Dodaje panel `data-stage217-case-operation-workspace="true"` w głównej kolumnie sprawy.
- Dodaje panel `data-stage217-case-notes-panel="true"` z pełnymi notatkami sprawy.
- W historii aktywności notatka dostaje skrót zamiast pełnej treści.
- Usuwa prosty duplikat modala płatności, jeśli występuje drugi dialog `isCasePaymentOpen`.

## Czego nie ruszano
- Supabase schema.
- SQL/migracje.
- Logika LeadDetail/ClientDetail.
- Push do GitHub.

## Testy
- `node scripts/check-stage217-case-detail-operation-workspace.cjs`
- `npm run build`
- test ręczny wejścia w sprawę i sprawdzenia paneli: Obsługa, Notatki, Historia, szybkie akcje, wpłata.

## Status
ZIP R2 przygotowany do lokalnego apply.
