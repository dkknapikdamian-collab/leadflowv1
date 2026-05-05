# TEST MATRIX — ADMIN DEBUG TOOLBAR

## Role
- [ ] App owner widzi toolbar.
- [ ] Admin widzi toolbar.
- [ ] Zwykły user nie widzi toolbar.
- [ ] Brak workspace nie wywala Layout.

## Review Mode
- [ ] OFF: klik Dodaj lead działa normalnie.
- [ ] Collect: klik Dodaj lead nie otwiera modala, tylko formularz uwagi.
- [ ] Browse: klik Dodaj lead działa normalnie.
- [ ] Klik w ikonę w przycisku wybiera cały button.
- [ ] Klik w tekst w karcie wybiera kartę lub sensowny element.
- [ ] Większy element wybiera parent.
- [ ] Mniejszy element wraca do child.
- [ ] Klik w toolbar admina nie zapisuje uwagi na toolbarze.
- [ ] Scroll nie psuje rect.
- [ ] Mobile viewport zapisuje viewport.

## Button Matrix
- [ ] Wykrywa buttony.
- [ ] Wykrywa linki.
- [ ] Wykrywa nav itemy.
- [ ] Wykrywa disabled.
- [ ] Wykrywa hidden jako nieklikalne lub pomija.
- [ ] Dla każdego elementu ma text lub ariaLabel.

## Copy Review
- [ ] Klik tekstu zapisuje oldText.
- [ ] Można wpisać proposedText.
- [ ] Eksport MD pokazuje starą i nową wersję.

## Bug Recorder
- [ ] Zapisuje manualny opis.
- [ ] Zapisuje route.
- [ ] Zapisuje viewport.
- [ ] Nie zapisuje tokenów.

## Eksport
- [ ] JSON pobiera się do Downloads.
- [ ] MD pobiera się do Downloads.
- [ ] JSON da się ponownie zaimportować mentalnie/odczytać.
- [ ] MD jest gotowy do wklejenia w ChatGPT.
