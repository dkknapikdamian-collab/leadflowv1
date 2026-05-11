# CloseFlow modal safe skin-only restore position — 2026-05-11

## Cel

Naprawić zły efekt poprzedniej paczki: modal nie może zmieniać położenia, transformacji ani geometrii okna. Zmieniamy tylko skórkę.

## Co zmienia paczka

- nadpisuje `src/styles/closeflow-modal-visual-system.css`,
- usuwa wadliwe przesunięcie / nudge pozycji,
- nie zmienia komponentów React,
- nie zmienia akcji, submitów, routingu ani logiki,
- dopina ciemną skórkę do lokalnych klas formularzy:
  - `lead-form-vnext-content`,
  - `lead-form-section`,
  - `lead-form-planning-note`,
  - `client-case-form-content`,
  - `client-case-form-section`,
  - `client-case-form-suggestions`,
  - `client-case-form-disabled-note`.

## Dlaczego poprzednia paczka była zła

Poprzednia paczka miała zbyt szeroką próbę wymuszenia ciemnych wnętrz oraz zawierała korektę położenia modala. To narusza zasadę skin-only.

## Kryterium zakończenia

Modale zostają w tym samym miejscu i rozmiarze co wcześniej, a różnią się tylko kolorem tła, tekstów, ramek, pól i calloutów.
