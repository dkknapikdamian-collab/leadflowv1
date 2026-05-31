# CloseFlow Stage166 — Modal Footer In Flow No Overlay

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / modal footer flow

## FAKTY
- Po Stage165 motyw/rozmiar jest lepszy.
- Problem: przycisk submit/footer pływa nad treścią formularza.
- Wspólny selector: `[data-closeflow-modal-visual-system="true"].cf-modal-surface`.

## DECYZJE DAMIANA
- Skupić się tylko na tym problemie.
- Footer nie ma zasłaniać pól/etykiet podczas scrolla.

## HIPOTEZY AI
- Sticky footer w scrollowanym formularzu jest źródłem problemu.
- Footer powinien wrócić do normalnego flow.

## TESTY
```powershell
node scripts/check-stage166-modal-footer-in-flow-no-overlay.cjs
npm.cmd run build
```

## NASTĘPNY KROK
Sprawdzić `+ Wydarzenie`, `+ Lead`, `+ Zadanie`.
