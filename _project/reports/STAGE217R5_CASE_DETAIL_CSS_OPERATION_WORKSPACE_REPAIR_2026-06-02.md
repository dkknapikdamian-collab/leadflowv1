# STAGE217R5_CASE_DETAIL_CSS_OPERATION_WORKSPACE_REPAIR

## Cel
Naprawić ostatni guard Stage217 po R4: `Stage217 CSS operation workspace styles missing`.

## Fakty
- R4 naprawił UTF-8 note summary.
- Guard Stage217 przeszedł dalej i zatrzymał się wyłącznie na tokenie CSS `stage217-case-operation-workspace`.
- Build przechodził po zmianach Stage217.

## Zmiana
- Dopisano alias/styl `.stage217-case-operation-workspace` do `src/styles/closeflow-case-detail-stage217-operation-workspace.css`.
- Dopisano `.stage217-case-operation-head` jako drobne wsparcie layoutu.

## Testy
- `node scripts/check-stage217-case-detail-operation-workspace.cjs`
- `npm run build`

## Zakres nieruszany
- Supabase
- SQL
- API
- Push
- Wcześniejsze zmiany Stage216

## Następny krok
Po przejściu guarda i builda wykonać test ręczny ekranu Sprawy.
