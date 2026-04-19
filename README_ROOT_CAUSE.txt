ROOT CAUSE

Problem nie był w samym overlayu, tylko w warstwie kolorów używanej przez komponenty UI.

W repo:
- DialogContent używał klasy bg-background
- SelectContent używał bg-popover
- DropdownMenu używał bg-popover / text-popover-foreground
- część inputów i kart używała border-input, ring-ring, text-muted-foreground itd.

Jednocześnie w src/index.css nie były zdefiniowane semantyczne tokeny:
- --color-background
- --color-popover
- --color-card
- --color-border
- --color-input
- --color-ring
- itd.

Efekt:
powierzchnie dialogów i popupów wpadały w transparent / niepełne tło, bo komponenty odwoływały się do tokenów, których aplikacja nie miała ustawionych.

CO ZROBIŁEM

1. Dodałem brakujące tokeny semantyczne do src/index.css.
2. Utwardziłem kluczowe komponenty overlay/popup:
   - src/components/ui/dialog.tsx
   - src/components/ui/select.tsx
   - src/components/ui/dropdown-menu.tsx

Czyli:
nawet jeśli ktoś później znowu rozjedzie theme tokens, modale i popupy nadal zostaną nieprzeźroczyste.
