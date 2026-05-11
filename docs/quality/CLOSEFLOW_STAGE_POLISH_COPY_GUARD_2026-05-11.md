# CLOSEFLOW_STAGE_POLISH_COPY_GUARD_2026-05-11

## Cel
Nowe etapy mają zbiorczo pilnować polskich znaków, zamiast poprawiać pojedyncze słowa po fakcie.

## Zakres
Guard `check:closeflow-stage-polish-guard` skanuje pliki zmieniane przez bieżący etap i blokuje typowe ślady mojibake:

- `Ĺ`
- `Ä`
- `Ă`
- `Â`
- `â`
- `�`

## Zasada
Jeżeli etap dodaje dokument, check albo tekst UI, musi przejść przez ten guard przed commitem.
