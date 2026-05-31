# STAGE166 Modal Footer In Flow No Overlay — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal footer flow

## Cel
Naprawić objaw po Stage165:
- footer/submit row floats nad treścią,
- `Zaplanuj` wygląda jakby był zawieszony 1-2 cm nad końcem,
- podczas scrolla treść/pola przejeżdżają pod paskiem.

## FAKTY
- Stage165 poprawił motyw i spójność modalnych okien.
- Wspólny modal target: `[data-closeflow-modal-visual-system="true"].cf-modal-surface`.
- `DialogFooter` w kalendarzu jest po sekcjach formularza, więc może być w normalnym flow.
- Problem generuje sticky/floating footer, nie rozmiar okna.

## DECYZJE DAMIANA
- Skupić się tylko na tym problemie.
- Nie zmieniać szerzej motywu/rozmiaru.
- Wszystkie modale mają zachować jedno źródło prawdy.

## HIPOTEZY AI
- Sticky footer w scrollowanym formularzu jest źródłem problemu.
- Footer powinien wrócić do normalnego flow.
- Prawdziwy zawsze-widoczny footer wymaga później przebudowy struktury DOM na header/body/footer.

## Testy automatyczne
```powershell
node scripts/check-stage166-modal-footer-in-flow-no-overlay.cjs
npm.cmd run build
```

## Testy ręczne
- `/calendar` → `+ Wydarzenie`
- `/leads` → `+ Lead`
- `/tasks` → `+ Zadanie`

## Czego nie ruszano
Push, deploy, dane, auth, Supabase, Google Calendar, Stripe, AI.
