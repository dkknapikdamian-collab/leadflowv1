# P14H BOM-safe final

Zakres: domknięcie P14 po błędach runnera i generatora guardów.

- package.json jest czytany po usunięciu BOM.
- guard P14 sprawdza sens copy/menu, nie idealny układ jednej linijki.
- realny mojibake dalej sprawdza scripts/check-polish-mojibake.cjs.
- commit/push następuje dopiero po P14 guard, mojibake guard i build.
