# 07_NEXT_STEPS

<!-- STAGE24Z15T_R2_NEXT_START -->
## Aktualny nastepny krok po Stage24Z15T-R2

Data: 2026-06-05 19:25 Europe/Warsaw

Status: Stage24Z15T-R2 = PASS / PUSHED / CANON_ROADMAP_SYNCED.

Ten plik jest pomocniczy. Nie jest nadrzedna roadmapa etapow.

Zrodlo prawdy dla kolejnosci etapow:

```text
_project/handoffs/codex/AI_SZEFCIO_STAGE_RUNNER/01_KOLEJNOSC_WDROZEN - AI Szefcio Stage Runner.md
```

Zasada wyboru nastepnego etapu:

```text
Wybrac pierwszy etap z master-roadmapy, ktory nie ma statusu PASS / NOT_APPLICABLE z dowodem.
```

Nie wdrazac etapow z czatu jako biezacej kolejki. Nie uzywac 24Z15U ani 24Z15X jako nastepnego etapu, dopoki nie zostana wpisane w master-roadmape jako wlasciwa kolejnosc.

Wymagane przed kolejnym etapem:

```text
1. Przeczytac master prompt.
2. Przeczytac detection matrix.
3. Przeczytac master-roadmape.
4. Przeczytac konkretny plik etapu ze stages/, jesli istnieje.
5. Zweryfikowac status etapu w raportach/ledgerach.
6. Wdrozyc tylko jeden etap.
7. Po etapie wykonac testy, guardy, audyt ryzyk, aktualizacje _project, obsidian_updates i push.
```
<!-- STAGE24Z15T_R2_NEXT_END -->

## Historia / pomocnicze wpisy

Starsze wpisy w tym pliku byly helperami po poszczegolnych etapach. Nie sa aktywna kolejka i nie moga zastepowac master-roadmapy.
