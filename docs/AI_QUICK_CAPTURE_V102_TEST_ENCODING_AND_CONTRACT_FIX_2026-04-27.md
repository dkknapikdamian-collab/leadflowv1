# CloseFlow v102 - Quick Capture voice test encoding and contract fix

## Co naprawia

Ten hotfix domyka etap po v100/v101:

- usuwa rozsypane polskie znaki z testu Quick Capture voice,
- usuwa rozsypane polskie znaki z dokumentacji v101,
- zmienia test tak, żeby pilnował właściwego modelu produktu: `QuickAiCapture` jest renderowany tylko w globalnym pasku `GlobalQuickActions`, a nie kopiowany lokalnie w `Today` i `Leads`,
- zostawia bramkę bezpieczeństwa Quick Capture: notatka źródłowa, zapis szkicu i osobne zatwierdzenie jako lead.

## Dlaczego

Po przebudowie globalnych akcji nie chcemy wracać do lokalnych duplikatów. Test ma pilnować jednego źródła prawdy, a nie starego układu.

## Kryterium zakończenia

- `node tests/ai-quick-capture-voice-and-today.test.cjs` przechodzi,
- `node scripts/check-polish-mojibake.cjs --repo . --check` przechodzi,
- `npm.cmd run lint` przechodzi,
- `npm.cmd run verify:closeflow:quiet` przechodzi.