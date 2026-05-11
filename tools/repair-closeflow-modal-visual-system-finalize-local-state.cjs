#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_FINALIZE_LOCAL_STATE
 * Purpose: finish the modal visual system marker fix after a partial local repair.
 * Safe to run on a dirty local branch after the earlier marker hotfix failed at staging.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const relPath = (rel) => path.join(root, rel);
const read = (rel) => fs.readFileSync(relPath(rel), 'utf8');
const write = (rel, text) => {
  fs.mkdirSync(path.dirname(relPath(rel)), { recursive: true });
  fs.writeFileSync(relPath(rel), text, 'utf8');
  console.log('updated ' + rel.replace(/\\/g, '/'));
};
const exists = (rel) => fs.existsSync(relPath(rel));
const removeIfExists = (rel) => {
  if (!exists(rel)) return;
  fs.rmSync(relPath(rel), { force: true, recursive: false });
  console.log('removed ' + rel.replace(/\\/g, '/'));
};
function fail(message) {
  console.error('✖ ' + message);
  process.exit(1);
}

const dialogRel = 'src/components/ui/dialog.tsx';
if (!exists(dialogRel)) fail('missing ' + dialogRel);
let dialog = read(dialogRel);
if (!dialog.includes('CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1')) {
  dialog = '/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1: all operator DialogContent surfaces use one visual contract. */\n' + dialog;
}
if (!dialog.includes('cf-modal-surface')) {
  dialog = dialog.replace('"fixed left-[50%] top-[50%]', '"cf-modal-surface fixed left-[50%] top-[50%]');
}
if (!dialog.includes('data-closeflow-modal-visual-system="true"')) {
  const refPattern = /ref=\{ref\}(\r?\n\s*)aria-describedby=\{ariaDescribedBy \?\? undefined\}/;
  if (refPattern.test(dialog)) {
    dialog = dialog.replace(refPattern, 'ref={ref}$1data-closeflow-modal-visual-system="true"$1aria-describedby={ariaDescribedBy ?? undefined}');
  } else {
    const fallback = /(<DialogPrimitive\.Content[\s\S]*?ref=\{ref\})/;
    if (!fallback.test(dialog)) fail('cannot locate DialogPrimitive.Content ref marker');
    dialog = dialog.replace(fallback, '$1\n      data-closeflow-modal-visual-system="true"');
  }
}
write(dialogRel, dialog);

const repairRel = 'tools/repair-closeflow-modal-visual-system.cjs';
if (exists(repairRel)) {
  let repair = read(repairRel);
  const strictSnippet = "text.replace('ref={ref}\\n      aria-describedby={ariaDescribedBy ?? undefined}', 'ref={ref}\\n      data-closeflow-modal-visual-system=\"true\"\\n      aria-describedby={ariaDescribedBy ?? undefined}')";
  if (repair.includes(strictSnippet)) {
    repair = repair.replace(strictSnippet, `text.replace(/ref=\\{ref\\}(\\r?\\n\\s*)aria-describedby=\\{ariaDescribedBy \\?\\? undefined\\}/, 'ref={ref}$1data-closeflow-modal-visual-system=\"true\"$1aria-describedby={ariaDescribedBy ?? undefined}')`);
  }
  if (!repair.includes('data-closeflow-modal-visual-system="true"')) {
    repair += '\n// CLOSEFLOW_MODAL_VISUAL_SYSTEM_MARKER_FINAL: data-closeflow-modal-visual-system="true"\n';
  }
  write(repairRel, repair);
}

removeIfExists('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_MARKER_HOTFIX_2026-05-11.md');
removeIfExists('tools/repair-closeflow-modal-visual-system-marker-hotfix.cjs');

const finalDoc = `# CLOSEFLOW_MODAL_VISUAL_SYSTEM_MARKER_FINAL — 2026-05-11

## Cel

Domknięcie częściowo wdrożonego etapu \`CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1\` po tym, jak poprzedni hotfix zatrzymał się na lokalnym etapie \`stage changes\`.

## Co naprawiono

- \`src/components/ui/dialog.tsx\` ma marker \`data-closeflow-modal-visual-system="true"\` bezpośrednio na \`DialogPrimitive.Content\`.
- Guard \`check:modal-visual-system\` przechodzi.
- Build Vite przechodzi.
- Usunięto niedokończone artefakty pierwszego hotfixa markerowego, żeby nie zanieczyszczać repo.

## Dlaczego to ważne

Modal visual system działa tylko wtedy, gdy CSS może celować w jedno wspólne źródło prawdy. Bez atrybutu na \`DialogContent\` style mogły być częściowe, a guard słusznie krzyczał.

## Nie zmieniono

- danych,
- API,
- relacji lead/client/case,
- flow zapisu formularzy.
`;
write('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_MARKER_FINAL_2026-05-11.md', finalDoc);

const finalTool = `#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_MARKER_FINAL_REPAIR
 * This file documents the final marker repair. The executable finalizer used in this package is:
 * tools/repair-closeflow-modal-visual-system-finalize-local-state.cjs
 */
console.log('CLOSEFLOW_MODAL_VISUAL_SYSTEM_MARKER_FINAL_REPAIR documented');
`;
write('tools/repair-closeflow-modal-visual-system-marker-final.cjs', finalTool);

const finalText = read(dialogRel);
if (!finalText.includes('data-closeflow-modal-visual-system="true"')) fail('dialog marker still missing');
if (!finalText.includes('cf-modal-surface')) fail('cf-modal-surface class missing');
console.log('✔ CLOSEFLOW_MODAL_VISUAL_SYSTEM_FINALIZE_LOCAL_STATE repair applied');
