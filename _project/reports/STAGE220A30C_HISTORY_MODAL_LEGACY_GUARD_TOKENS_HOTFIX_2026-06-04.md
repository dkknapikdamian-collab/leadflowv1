# STAGE220A30C - history modal legacy guard tokens hotfix

## Cel
NaprawiÄ‡ build po STAGE220A30/STAGE220A30B bez cofania nowego stylu modalĂłw finansowych.

## Fakt z testu
`npm run build` zatrzymaĹ‚ siÄ™ na guardzie `STAGE220A27B_R3_PAYMENT_HISTORY_ONE_LINE_GUARD`, bo w `CaseDetail.tsx` brakowaĹ‚o tokenu klasy:

```text
case-payment-history-modal-stage220a27b-r3-light
```

## Zakres zmiany
- PrzywrĂłcono token R3 modala historii wpĹ‚at.
- PrzywrĂłcono tokeny A28 ĹşrĂłdĹ‚a formularza dla modala historii.
- Zachowano nowe tokeny STAGE220A30: `event-form-vnext-content closeflow-event-modal-readable`.
- Zachowano zgodnoĹ›Ä‡ z A26 footer tokenem po STAGE220A30B.
- Dodano lokalny guard `scripts/check-stage220a30c-history-modal-guard-tokens.cjs`.

## Czego nie ruszano
- API pĹ‚atnoĹ›ci.
- Supabase.
- Logiki korekty/usuwania wpĹ‚aty.
- WyliczeĹ„ finansĂłw sprawy.

## Testy
Do uruchomienia po wdroĹĽeniu:

```powershell
node scripts/check-stage220a27b-r3-payment-history-one-line.cjs
node scripts/check-stage220a28-modal-focus-trash.cjs
node scripts/check-stage220a30c-history-modal-guard-tokens.cjs
npm run build
```

## Status
Do potwierdzenia po peĹ‚nym buildzie.