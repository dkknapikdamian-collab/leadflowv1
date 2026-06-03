# STAGE220A9 - Case Detail Production Tabs

## Cel etapu

Naprawa zakĹ‚adek w widoku sprawy tak, ĹĽeby nie byĹ‚y martwymi pastylkami pod treĹ›ciÄ…, tylko produkcyjnÄ… nawigacjÄ… na gĂłrze widoku sprawy.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- obszar: src/pages/CaseDetail.tsx
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- entity_id/workspace_id/project_id: DO_POTWIERDZENIA

## Fakty z kodu

- CaseDetail miaĹ‚ aktywny stan zakĹ‚adek: service/path/checklists/history.
- TreĹ›ci zakĹ‚adek byĹ‚y renderowane warunkowo.
- Warstwa CSS chowaĹ‚a zwykĹ‚e .case-detail-section-card poza workspace obsĹ‚ugi i notatkami.
- ZakĹ‚adka ĹšcieĹĽka miaĹ‚a tylko liczniki i ogĂłlny opis, bez prawdziwego lifecycle procesu.

## Decyzje etapu

- ZakĹ‚adki przeniesiono pod nagĹ‚Ăłwek sprawy, nad ukĹ‚ad kolumnowy.
- Zostawiono trzy zakĹ‚adki produkcyjne: ObsĹ‚uga, Checklisty, Historia.
- UsuniÄ™to martwÄ…/pustÄ… ĹšcieĹĽkÄ™ do czasu prawdziwego moduĹ‚u etapĂłw.
- Historia korzysta z ujednoliconego caseHistoryItems, a nie z samego activities.map.
- CSS dostaĹ‚ nadpisanie, ĹĽeby aktywne treĹ›ci zakĹ‚adek nie byĹ‚y chowane przez wczeĹ›niejszÄ… warstwÄ™ Stage217/218.

## Zakres plikĂłw

- src/pages/CaseDetail.tsx
- src/styles/closeflow-case-detail-stage217-operation-workspace.css
- scripts/check-stage220a9-case-detail-production-tabs.cjs
- _project/reports/STAGE220A9_CASE_DETAIL_PRODUCTION_TABS_2026-06-03.md

## Czego nie ruszano

- Supabase
- migracje SQL
- RLS
- routing aplikacji
- finanse sprawy poza widocznoĹ›ciÄ… zakĹ‚adek
- API
- dane produkcyjne

## Testy

Automatyczne:

```powershell
node scripts/check-stage220a9-case-detail-production-tabs.cjs
npm run build
```

RÄ™czne:

1. OtwĂłrz sprawÄ™.
2. SprawdĹş, czy zakĹ‚adki sÄ… pod nagĹ‚Ăłwkiem, nad kartÄ… pracy.
3. Kliknij ObsĹ‚uga - widoczne dziaĹ‚ania i notatki.
4. Kliknij Checklisty - widoczne braki i akcje statusĂłw.
5. Kliknij Historia - widoczna ujednolicona historia sprawy.
6. SprawdĹş, ĹĽe nie ma zakĹ‚adki ĹšcieĹĽka.
7. SprawdĹş prawy panel finansĂłw i szybkie akcje.

## NastÄ™pny krok

JeĹĽeli ukĹ‚ad wizualnie przejdzie test Damiana, moĹĽna zrobiÄ‡ drobny polish: lepsza wysokoĹ›Ä‡ paska zakĹ‚adek, status aktywnej zakĹ‚adki, ewentualnie pĂłĹşniej osobny moduĹ‚ Etapy tylko po wprowadzeniu prawdziwego lifecycle.