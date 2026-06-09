# CloseFlow / LeadFlow - STAGE230C R15 guard split + visual source truth

Data: 2026-06-09 Europe/Warsaw
Status: DO_APPLY_LOCAL_ONLY_AND_TEST
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY
- Problem dublowania dyktowania nie występuje na drugim telefonie, więc nie traktujemy go jako ogólnego błędu aplikacji.
- Białe litery na białym tle i niespójny kolor przycisków są błędem wizualnym Szybkiego szkicu.
- Źródło prawdy wizualnej dla pól formularzy to styl lead/client form: visual-stage20-lead-form-vnext.css.

## DECYZJE
- Szybki szkic ma używać klas i kontrastu zgodnych z formularzami dodaj lead/klient.
- Nie robimy automatycznej deduplikacji.

## TESTY
- Stage230B guard/test
- Stage230C guard/test
- Stage230C-R2 guard/test
- Stage230C-R10 guard/test
- build
- git diff --check

## NASTĘPNY KROK
- Po PASS sprawdzić telefon: kolor wpisywanego tekstu, placeholder, przycisk Zapisz szkic, disabled state i przyciski diagnostyczne.
