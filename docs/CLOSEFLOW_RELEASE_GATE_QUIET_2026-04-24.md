# CloseFlow quiet release gate

Data: 2026-04-24

## Po co to jest

PeĹ‚na bramka `verify:closeflow` dziaĹ‚a, ale wypisuje duĹĽo logĂłw z builda i testĂłw.

Do codziennej pracy dodano krĂłtszÄ… komendÄ™:

```powershell
npm.cmd run verify:closeflow:quiet
```

## Jak dziaĹ‚a

Pokazuje tylko skrĂłcony wynik:

```text
âś“ production build
âś“ tests/...
CloseFlow quiet release gate passed.
```

PeĹ‚ny log pokazuje dopiero wtedy, gdy build albo test siÄ™ wysypie.

## Zasada

- przed wiÄ™kszym commitem moĹĽna uĹĽywaÄ‡ `verify:closeflow:quiet`,
- przy podejrzanych bĹ‚Ä™dach nadal moĹĽna odpaliÄ‡ peĹ‚ne `verify:closeflow`,
- oba warianty sprawdzajÄ… produkcyjny build i zestaw testĂłw regresji.

