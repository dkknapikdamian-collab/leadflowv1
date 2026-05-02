# P14I - encoding docs cleanup

## Cel
Domkniecie P14 po zielonym guardzie UI truth/copy/menu i czerwonym checku mojibake na starych dokumentach P14D/P14E.

## Co zrobiono
- Usunieto posrednie dokumenty P14 z mojibake, jesli byly w working tree.
- Package.json jest czytany i zapisywany bez BOM.
- Guard P14 zostaje prosty i sprawdza sens UI/copy, a nie format jednej linii.
- Prawdziwy check kodowania zostaje w npm run check:polish-mojibake.

## Kryterium zakonczenia
Commit i push sa wykonywane dopiero po zielonym:
- check:p14-ui-truth-copy-menu
- check:polish-mojibake
- build
