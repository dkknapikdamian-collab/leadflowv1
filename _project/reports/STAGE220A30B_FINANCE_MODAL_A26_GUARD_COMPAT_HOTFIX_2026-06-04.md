# STAGE220A30B - Finance modal A26 guard compatibility hotfix

## Cel
Naprawić regresję po STAGE220A30: `npm run build` zatrzymywał się na guardzie `STAGE220A26_CASE_FINANCE_DISPLAY_MODAL_GUARD`, bo STAGE220A30 zastąpił klasę `case-finance-modal-stage220a26-footer` zamiast zostawić ją jako token kompatybilności.

## Fakty
- STAGE220A30 poprawił wygląd modalów finansowych i dodał nowy styl `case-finance-source-footer-stage220a30`.
- Guard STAGE220A26 nadal wymaga obecności tekstu `case-finance-modal-stage220a26-footer` w `src/pages/CaseDetail.tsx`.
- Brak tego tokenu blokuje `npm run build` w prebuild.

## Zmiana
- Dodano marker `STAGE220A30B_FINANCE_MODAL_A26_GUARD_COMPAT`.
- Przywrócono klasę `case-finance-modal-stage220a26-footer` jako kompatybilny token obok nowej klasy `case-finance-source-footer-stage220a30`.
- Nie cofnięto nowego stylu STAGE220A30.

## Testy
Wymagane po wdrożeniu:

```powershell
node scripts/check-stage220a26-case-finance-display-modal.cjs
node scripts/check-stage220a30-case-finance-modal-vst.cjs
node scripts/check-stage220a30b-finance-modal-a26-guard-compat.cjs
npm run build
```

## Czego nie ruszano
- API płatności.
- Supabase schema.
- Logika zapisu/usuwania/korekty wpłat.
- CSS STAGE220A30 poza dołożeniem kompatybilnego tokenu w JSX.

## Następny krok
Po przejściu builda zrobić selektywny commit hotfixa i push na `dev-rollout-freeze`.
