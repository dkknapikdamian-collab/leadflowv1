# STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN

Data: 2026-06-14 12:45 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: PRZYJETE_DO_KOLEJKI / DO_WDROZENIA_PO_UI_DETAIL_CLOSEOUT_I_GOOGLE_CALENDAR_DECISION
Typ: etap infrastruktury produkcyjnej / mail / domena / digest / support

## Decyzja Damiana

Do kolejki rozwoju dopisujemy osobny lancuch produkcyjnych etapow mailowych. Nie mieszac tego z obecnymi etapami UI/detail mapping ani z Google Calendar.

Kolejnosc biznesowo-techniczna:

1. Najpierw domena produkcyjna i DNS.
2. Potem realny dostawca maila/transakcyjnych wysylek i skrzynki.
3. Potem maile systemowe: reset hasla, zmiana maila, potwierdzenie rejestracji, potwierdzenie platnosci, statusy operacyjne.
4. Potem poranny digest i tygodniowe podsumowanie.
5. Potem produkcyjna zakladka Pomoc/Support z realnym przeplywem zgloszen i mailami.

## Etapy do dopisania do centralnego pliku `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`

### STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION

Status: DO_WDROZENIA PO OBECNYM UI/DETAIL CLOSEOUT I PO DECYZJI, CZY WYPRZEDZA GOOGLE CALENDAR

Cel:
- wybrac i zarejestrowac/wskazac domenę produkcyjna aplikacji,
- skonfigurowac DNS,
- przygotowac realne maile/sender identity,
- skonfigurowac SPF/DKIM/DMARC/MX,
- ustawic bezpieczne env dla wysylki transakcyjnej,
- dodac status diagnostyczny mail setup w aplikacji/adminie albo guardzie.

Nie ruszac:
- tresci maili systemowych poza placeholderami,
- digestow,
- support tab,
- platnosci runtime,
- AI Drafts.

Guard/test:
- env mail provider nie moze byc wymagany w dev bez fallbacku,
- produkcja nie moze wysylac z niezweryfikowanej domeny,
- brak domeny/mail env ma dawac jasny komunikat, nie silent fail,
- zapisac wynik testu DNS/mail w `_project/15_SQL_LEDGER_AND_TESTED_SQL.md` tylko jesli etap wymaga SQL; inaczej wpis `SQL nie ruszany` w payloadzie.

### STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS

Status: PO STAGE231K1

Cel:
- przygotowac maile systemowe i transakcyjne:
  - reset hasla,
  - potwierdzenie zmiany maila,
  - potwierdzenie rejestracji,
  - potwierdzenie platnosci,
  - status platnosci / blad platnosci,
  - podstawowe powiadomienie operacyjne, jesli potrzebne.

Zasada:
- maile musza byc naturalne, krotkie, nie plastikowe,
- kazdy mail ma miec template id, temat, trigger, odbiorce, warunek wysylki, guard/test,
- nie wysylac nic bez realnego zweryfikowanego sendera.

Guard/test:
- kazdy template ma test renderowania,
- linki reset/confirm nie moga byc puste,
- w dev/test trybie wysylka idzie do outbox/logu, nie do klientow,
- platnosc nie moze pokazac sukcesu maila, jesli wysylka padla bez retry/logu.

### STAGE231K3_OWNER_DIGEST_EMAILS_DAILY_AND_WEEKLY

Status: PO STAGE231K1 I PO DANYCH OWNER-CONTROL

Cel:
- uruchomic poranny digest i tygodniowe podsumowanie jako maile wlasciciela,
- digest ma byc lista decyzji i ryzyk, nie newsletter ani ozdobny wykres.

Zakres daily:
- co dzis ruszyc,
- leady/sprawy bez next step,
- 7/14 dni ciszy,
- sprawy bez ruchu,
- pieniadze/koszty/wplaty wymagajace ruchu,
- szkice do zatwierdzenia, jesli sa gotowe.

Zakres weekly:
- najwazniejsze ryzyka tygodnia,
- ile leadow/spraw bez ruchu,
- ile pieniedzy wymaga reakcji,
- zalegle follow-upy,
- rekomendowane 3-5 decyzji wlasciciela.

Guard/test:
- digest nie moze byc wyslany, jesli dane sa puste bez jasnego komunikatu,
- mail nie moze duplikowac wysylek,
- musi byc outbox/log i status wysylki.

### STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING

Status: PO STAGE231K1 / PO PODSTAWOWYCH MAILACH SYSTEMOWYCH

Cel:
- zrobic produkcyjna zakladke Pomoc/Support,
- podpiac zgloszenia do realnego maila/support inbox,
- dodac kategorie zgloszen i statusy,
- zapewnic potwierdzenie przyjecia zgloszenia.

Zakres:
- widoczna zakladka Pomoc/Support,
- formularz kontaktu/zgloszenia problemu,
- typ zgloszenia: blad, platnosc, konto, sugestia, inne,
- opcjonalny kontekst: workspace, user, URL ekranu, timestamp,
- wysylka do support mailbox/outbox,
- mail potwierdzajacy do uzytkownika,
- log zgloszenia po stronie aplikacji, jesli istnieje tabela/outbox; SQL tylko po osobnej decyzji.

Nie robic:
- rozbudowanego helpdesku enterprise,
- live chatu,
- automatycznych obietnic czasu odpowiedzi bez procesu.

Guard/test:
- brak mail env nie moze powodowac zgubienia zgloszenia,
- user dostaje jasny status: wyslane / zapisane do outbox / blad,
- support email nie moze byc hardcodowany w wielu miejscach.

## Relacja z istniejącymi etapami

- `STAGE-A44-OWNER-DIGEST-WEEKLY-REPORT` zostaje etapem produktowym digestu, ale realna wysylka mailowa wymaga `STAGE231K1`.
- `STAGE-A36-DRAFTS-REBUILD` i `STAGE231J2` nie sa tym samym co maile systemowe. Szkice AI moga generowac tresci, ale wysylka maili wymaga osobnych gate'ow i potwierdzenia.
- Support/help produkcyjny wymaga realnego maila, ale nie musi czekac na pelny AI Drafts.

## Kolejnosc robocza po aktualnych etapach

Aktualnie nie przerywac:
1. UI/detail closeout CaseDetail,
2. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`,
3. `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`,
4. `STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT`,
5. `STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT`.

Lancuch mailowy:
6. `STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION`,
7. `STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS`,
8. `STAGE231K3_OWNER_DIGEST_EMAILS_DAILY_AND_WEEKLY`,
9. `STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING`.

Kolejnosc moze zostac przyspieszona, jesli produkcyjna rejestracja/platnosci wymagaja maili przed Google Calendar. Decyzja wymaga osobnego potwierdzenia Damiana.

## Ryzyka

- Realne maile bez domeny i SPF/DKIM/DMARC moga trafic do spamu.
- Maile auth/payment sa wysokiego ryzyka: nie moga udawac wysylki, jesli provider padnie.
- Digest wysylany za wczesnie bedzie bezuzyteczny, jesli owner-control data nie jest stabilna.
- Support tab bez realnego inboxa/outboxa bedzie martwa funkcja.
- Jesli potrzebna bedzie tabela outbox/support tickets, SQL musi byc osobnym blokiem/plikiem i wpisem w SQL ledger.

## Status zapisu

- Run decision zapisany.
- Payload Obsidiana zapisac osobno.
- Centralny plik etapow wymaga dopisania powyzszego bloku przy najblizszym bezpiecznym update; nie wolno zostawiac tej decyzji tylko w czacie.
