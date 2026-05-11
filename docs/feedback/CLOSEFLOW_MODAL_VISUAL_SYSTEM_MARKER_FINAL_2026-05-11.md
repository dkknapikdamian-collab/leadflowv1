# CLOSEFLOW_MODAL_VISUAL_SYSTEM_MARKER_FINAL — 2026-05-11

## Cel

Domknięcie częściowo wdrożonego etapu `CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1` po tym, jak poprzedni hotfix zatrzymał się na lokalnym etapie `stage changes`.

## Co naprawiono

- `src/components/ui/dialog.tsx` ma marker `data-closeflow-modal-visual-system="true"` bezpośrednio na `DialogPrimitive.Content`.
- Guard `check:modal-visual-system` przechodzi.
- Build Vite przechodzi.
- Usunięto niedokończone artefakty pierwszego hotfixa markerowego, żeby nie zanieczyszczać repo.

## Dlaczego to ważne

Modal visual system działa tylko wtedy, gdy CSS może celować w jedno wspólne źródło prawdy. Bez atrybutu na `DialogContent` style mogły być częściowe, a guard słusznie krzyczał.

## Nie zmieniono

- danych,
- API,
- relacji lead/client/case,
- flow zapisu formularzy.
