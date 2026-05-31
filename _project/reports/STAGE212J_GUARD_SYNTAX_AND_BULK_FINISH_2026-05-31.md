# STAGE212J Guard Syntax and Bulk Finish

## Cel
Naprawa po Stage212I, który przerwał się przez błąd składni w guardzie JS, po wcześniejszych masowych naprawach UI.

## Zakres
- naprawiono import order w src/index.css,
- wyczyszczono mojibake w Layout/Today/TasksStable,
- usunięto stare visual runtime importy/tagi,
- zostawiono VisualFoundationRuntimeStage212G,
- naprawiono aktywną ikonę sidebaru bez białego kwadratu,
- utrzymano canvas #f1f5f9 oraz surface #ffffff.

## Testy
- node scripts/check-stage212j-guard-syntax-and-bulk-finish.cjs
- npm run build, jeśli APPLY uruchomiono z -Build
