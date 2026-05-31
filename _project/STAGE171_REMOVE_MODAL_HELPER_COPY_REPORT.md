# STAGE171 Remove Modal Helper Copy — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal helper copy removal

## Cel

Usunąć z modalnych zakładek / paneli widoczne teksty pomocnicze wskazane przez Damiana:

- `Ustaw termin, powiązanie, przypomnienia i cykliczność wydarzenia w kalendarzu.`
- `Od do`
- `Najpierw ustaw start i koniec. Koniec pilnuje się automatycznie przy zmianie startu.`
- `Możesz zostawić brak albo ustawić powtarzanie, np. co miesiąc.`
- `Na końcu ustaw sposób przypominania i jego cykliczność.`
- `Wpisz minimum danych i zapisz kontakt. Szczegóły możesz uzupełnić później.`
- `Najważniejsze pola do szybkiego zapisania kontaktu.`

## FAKTY

- W `src/pages/Calendar.tsx` występuje opis dialogu wydarzenia oraz sekcja `Od do` z opisem start/koniec.
- `DialogDescription` nie powinien być usuwany bez zastępstwa, bo Radix może ostrzegać o braku opisu.
- Stage171 robi removal visible copy i zostawia neutralne hidden descriptions dla a11y.

## DECYZJE DAMIANA

- Kasujemy wskazane teksty wszędzie.
- Jesteśmy dalej w tych samych modalnych zakładkach.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Najbezpieczniej usuwać konkretne frazy z `src`, nie całe sekcje formularzy.
- Widoczne pomocnicze opisy pogarszają czytelność i zajmują miejsce.
- DialogDescription trzeba ukrywać, nie usuwać.

## Pliki

- `src/App.tsx`
- `src/styles/closeflow-remove-modal-helper-copy-stage171.css`
- `scripts/apply-stage171-remove-modal-helper-copy.cjs`
- `scripts/check-stage171-remove-modal-helper-copy.cjs`
- `docs/ui/CLOSEFLOW_STAGE171_REMOVE_MODAL_HELPER_COPY.md`
- `docs/ui/CLOSEFLOW_STAGE171_RUNTIME_MODAL_HELPER_COPY_AUDIT.js`
- `_project/STAGE171_REMOVE_MODAL_HELPER_COPY_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage171 remove modal helper copy.md`

## Testy automatyczne

```powershell
node scripts/check-stage171-remove-modal-helper-copy.cjs
npm.cmd run build
```

## Testy ręczne

- `/calendar` → `+ Wydarzenie`
- `/leads` → `+ Lead`
- globalne `+ Zadanie`

Sprawdzić:
- wymienione teksty nie są widoczne,
- pola i labelki zostają,
- brak warningu o braku description dla DialogContent,
- bez regresji Stage170.

## Czego nie ruszano

- deploy
- push
- auth
- Supabase schema
- Google Calendar
- Stripe
- AI
