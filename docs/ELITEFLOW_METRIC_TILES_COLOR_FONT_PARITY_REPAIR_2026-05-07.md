# EliteFlow / CloseFlow â€” metric tiles color + font parity repair â€” 2026-05-07

## Problem

Poprzedni hard lock naprawiĹ‚ bryĹ‚Ä™ kafelkĂłw, ale wizualnie nadal nie byĹ‚o peĹ‚nej zgodnoĹ›ci z kafelkami `DziĹ›`:

- wartoĹ›ci i ikonki byĹ‚y zbyt jednolicie szare/czarne,
- label wyglÄ…daĹ‚ ciÄ™ĹĽej niĹĽ w `DziĹ›`,
- na czÄ™Ĺ›ci kafelkĂłw pojawiaĹ‚y siÄ™ jasne paski / artefakty po starych reguĹ‚ach CSS,
- wczeĹ›niejsza paczka miaĹ‚a bĹ‚Ä…d skĹ‚adni PowerShell w regexie importu.

## Fix

- Dodano `data-eliteflow-metric-tone` w `StatShortcutCard`.
- Ton kafelka jest wyliczany z labela oraz klas `valueClassName` / `iconClassName`.
- Dodano koĹ„cowÄ… warstwÄ™ CSS:
  `src/styles/eliteflow-metric-tiles-color-font-parity.css`.
- Warstwa ta Ĺ‚aduje siÄ™ jako ostatnia w `src/index.css`.
- Zaktualizowano guard finalnego hard locka, ĹĽeby dopuszczaĹ‚ warstwÄ™ kolor/font po hard locku.
- Dodano guard `scripts/check-eliteflow-metric-color-font-parity.cjs`.

## Verification

```powershell
node scripts/check-eliteflow-final-metric-tiles.cjs
node scripts/check-eliteflow-metric-color-font-parity.cjs
npm run build
```

## Manual smoke

Najpierw sprawdĹş `/leads`. Kafelki majÄ… zachowaÄ‡ bryĹ‚Ä™ jak `DziĹ›`, ale odzyskaÄ‡ kolory wartoĹ›ci i ikon.