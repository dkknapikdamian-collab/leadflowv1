# STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN

Data: 2026-06-11 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Typ: visual spacing fix / ClientDetail
Status: LOCAL_APPLIED / NEED_PUSH

## Decyzja
Po manualnej kontroli użytkownika R7/R8 nie dał widocznego wyrównania lewego raila. Lewy rail w ClientDetail nadal zaczynał się za wysoko względem prawego raila.

## Zmiana
Dodano R9 CSS override dla desktopu:
- większy offset lewego raila: clamp(58px, 3.75vw, 72px),
- ten sam gap kart: 22px,
- silniejszy selektor na .client-detail-shell > .client-detail-left-rail,
- reset offsetu na max-width 1179px.

## Nie ruszano
- JSX,
- danych,
- aktywnej sprawy,
- top overview tiles,
- SQL,
- kosztów,
- wykresów,
- Google Calendar,
- LeadListCard runtime,
- CaseDetail.

## Testy
- R9 guard/test,
- R7 spacing regression,
- ClientDetail baseline regression,
- ClientListCard freeze regression,
- git diff --check,
- npm run build.

## Ryzyko
Finalnie wymaga screenshotu po deployu, bo to korekta wizualnego offsetu.
