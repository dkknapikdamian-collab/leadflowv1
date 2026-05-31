# CloseFlow Stage175 — Extend Main Search Source Truth to Secondary Pages

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / main search bars / secondary pages

## FAKTY

- Stage174 został zastosowany lokalnie i build przeszedł.
- Search bary w drugorzędnych zakładkach mają własne klasy i układy.
- Zakładki do objęcia: Zadania, Szablony, Odpowiedzi, Aktywność, Inbox szkiców, Powiadomienia, Pomoc.

## DECYZJE DAMIANA

- Podpiąć wszystkie wymienione paski do tego samego źródła prawdy co wcześniejsze paski.
- Nie robić osobnych wizualnych wysp.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Wspólny marker `data-cf-main-search-source="stage173"` i Stage175 CSS wystarczą, żeby utrzymać jeden styl.
- Search icons powinny być ukryte jako dekoracyjne.
- Wrapper powinien być transparentny, input powinien rysować jedyną powierzchnię.

## TESTY

```powershell
node scripts/check-stage175-extend-main-search-source-truth-secondary-pages.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Test wizualny: `/tasks`, `/templates`, `/response-templates`, `/activity`, `/ai-drafts`, `/notifications`, `/support`.
