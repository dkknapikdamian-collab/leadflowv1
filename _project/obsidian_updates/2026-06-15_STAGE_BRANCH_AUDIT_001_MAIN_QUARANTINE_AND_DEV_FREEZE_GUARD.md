# STAGE_BRANCH_AUDIT_001_MAIN_QUARANTINE_AND_DEV_FREEZE_GUARD

Data: 2026-06-15 18:35 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch kanoniczny: dev-rollout-freeze
Branch zablokowany: main

## FAKTY Z AUDYTU

- Lokalny branch roboczy: dev-rollout-freeze.
- Working tree przed etapem: clean.
- main i dev-rollout-freeze są diverged.
- dev-rollout-freeze jest główną gałęzią roboczą CloseFlow.
- main nie jest podpięty jako aktualna gałąź pracy aplikacji.
- main ma unikalne zmiany względem dev-rollout-freeze, ale pełny merge/rebase grozi regresją.
- Różnica Today.tsx między main i dev jest bardzo duża: main ma inną/mniejszą wersję pliku, więc nie wolno przenosić całego pliku automatycznie.

## DECYZJA DAMIANA

- Nie pushować nic na main.
- Nie merge'ować main do dev-rollout-freeze.
- Nie rebase'ować dev-rollout-freeze na main.
- Nie robić git push bez jawnego wskazania dev-rollout-freeze.
- Wszystkie przyszłe prace CloseFlow mają iść przez dev-rollout-freeze.
- Ewentualne wartościowe rzeczy z main wolno przenosić tylko ręcznie, małymi etapami, po audycie i z guardem.

## NOWY GUARD

Dodano:

- scripts/check-closeflow-branch-scope.cjs

Guard blokuje pracę, jeżeli aktualna gałąź nie jest dev-rollout-freeze.

## PUSH POLICY

Dozwolony push dla CloseFlow:

git push origin HEAD:dev-rollout-freeze

Zakazane:

git push origin main
git push
git push --all
git push --force
git merge main
git rebase main

## RYZYKA

- Pełne scalenie main może cofnąć albo usunąć aktualne pliki aplikacji, AGENTS, workflow i instrukcje.
- Today.tsx z main może zawierać pojedyncze wartościowe rzeczy, ale całościowe przeniesienie pliku jest ryzykowne.
- main zostaje tylko do read-only audytu.

## NASTĘPNY KROK

- Osobny etap read-only: przejrzeć 34 commity main-only.
- Osobno ocenić Today.tsx.
- Przenosić tylko ręcznie wybrane fragmenty, nigdy merge.
