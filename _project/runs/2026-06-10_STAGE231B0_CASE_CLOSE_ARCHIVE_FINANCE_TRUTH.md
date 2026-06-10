# 2026-06-10 — STAGE231B0 CASE CLOSE / ARCHIVE / FINANCE TRUTH

## Status
LOCAL_ONLY_R5_PRE_PUSH

## FAKTY z kodu
- CaseDetail miał destrukcyjną akcję "Usuń sprawę" jako główny przycisk w headerze.
- Istnieje bezpieczny helper updateCaseInSupabase.
- Istnieje historia aktywności przez insertActivityToSupabase / recordActivity.
- Finanse sprawy są liczone przez CaseSettlementSection i case finance source; Stage231B0 nie usuwa ani nie zeruje płatności/prowizji.

## DECYZJE Damiana
- Zakończenie sprawy nie jest usunięciem.
- Sprawa ma dostać akcję "Zamknij sprawę".
- Zamknięta sprawa zostaje przy kliencie.
- Historia i rozliczenia zostają zachowane.
- Lifetime earnings klienta będzie Stage231B1.

## Wdrożenie R5
- Dodano marker STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH.
- Dodano stan i handler handleConfirmCloseCaseRecord.
- Flow zamykania używa updateCaseInSupabase z status: completed i lastActivityAt.
- Flow zamykania dodaje aktywność "Sprawa zamknięta".
- Główny przycisk pokazuje "Zamknij sprawę" albo "Sprawa zamknięta".
- Awaryjne "Usuń sprawę" zostaje jako osobna destrukcyjna akcja, ale nie jest już głównym zakończeniem procesu.

## Guardy / testy
Do uruchomienia przed pushem:
- node scripts/check-stage231b0-case-close-archive-finance-truth.cjs
- node --test tests/stage231b0-case-close-archive-finance-truth.test.cjs
- node scripts/check-stage228r25-delete-flow-source-truth.cjs
- node scripts/check-stage228r41-delete-flow-final-validate.cjs
- npm run build
- git diff --check

## Ryzyka
- Pole closed_at / archived_at nie zostało użyte, bo bez potwierdzenia schematu bezpieczniejszy jest status completed + lastActivityAt.
- Pełne lifetime earnings klienta nie jest częścią Stage231B0.
- Miesięczny dashboard finansowy nie jest częścią Stage231B0.
