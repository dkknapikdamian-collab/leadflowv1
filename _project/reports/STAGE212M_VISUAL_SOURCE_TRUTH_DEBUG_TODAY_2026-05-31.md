# STAGE212M Visual Source Truth + Debug + Today backgrounds

## Fakty
- Input admin feedback wskazał route / i trzy sekcje Today jako problem tła.
- Debug toolbar był zbyt jasny/niewidoczny po resetach tła.
- Sidebar active icon robił biały kwadrat.

## Zmiany
- Dodano VisualFoundationRuntimeStage212M jako runtime source-truth.
- Dodano src/styles/closeflow-visual-foundation-stage212m.css jako tekstowe źródło prawdy motywu.
- Canvas: #f1f5f9; surface: #ffffff; soft: #f8fafc; border: #e2e8f0.
- Wymuszono kontrast admin debug toolbar.
- Ujednolicono Today section backgrounds z canvasem.
- Naprawiono active sidebar icon bez białego kwadratu.
- Wykonano mojibake sweep w src.

## Testy
- node scripts/check-stage212m-visual-source-truth-debug-today.cjs
- npm run build
