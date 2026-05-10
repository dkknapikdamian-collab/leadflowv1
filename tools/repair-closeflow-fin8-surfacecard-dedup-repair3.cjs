const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const rel = 'src/components/finance/FinanceSnapshot.tsx';
const file = path.join(repo, rel);
if (!fs.existsSync(file)) throw new Error(`${rel}: missing`);
let text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');

function splitSpecifiers(spec) {
  return spec
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function removeSurfaceCardFromImportBlocks(source) {
  return source.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"](\.\.\/ui-system|\.\.\/ui-system\/SurfaceCard)['"];?\r?\n?/g, (full, spec, moduleName) => {
    const kept = splitSpecifiers(spec).filter((item) => {
      const localName = item.includes(' as ') ? item.split(/\s+as\s+/).pop().trim() : item.trim();
      const importedName = item.includes(' as ') ? item.split(/\s+as\s+/)[0].trim() : item.trim();
      return localName !== 'SurfaceCard' && importedName !== 'SurfaceCard';
    });
    if (kept.length === 0) return '';
    return `import { ${kept.join(', ')} } from '${moduleName}';\n`;
  });
}

text = removeSurfaceCardFromImportBlocks(text);
text = text.replace(/\n{3,}/g, '\n\n');

const surfaceImport = "import { SurfaceCard } from '../ui-system';\n";
if (!text.includes(surfaceImport)) {
  const buttonImport = "import { Button } from '../ui/button';\n";
  if (text.includes(buttonImport)) {
    text = text.replace(buttonImport, buttonImport + surfaceImport);
  } else {
    const firstImportEnd = text.indexOf('\n');
    if (firstImportEnd >= 0) {
      text = text.slice(0, firstImportEnd + 1) + surfaceImport + text.slice(firstImportEnd + 1);
    } else {
      text = surfaceImport + text;
    }
  }
}

// Normalize accidental duplicated specifier variants if any survived.
text = text.replace(/import\s*\{\s*SurfaceCard\s*,\s*SurfaceCard\s*\}\s*from\s*['"]\.\.\/ui-system['"];?/g, surfaceImport.trim());
text = text.replace(/\n{3,}/g, '\n\n');
fs.writeFileSync(file, text, 'utf8');

const after = fs.readFileSync(file, 'utf8');
const importMatches = after.match(/import\s*\{[^}]*\bSurfaceCard\b[^}]*\}\s*from\s*['"]\.\.\/ui-system['"]/g) || [];
if (importMatches.length !== 1) {
  throw new Error(`${rel}: expected exactly one SurfaceCard import from ../ui-system, got ${importMatches.length}`);
}
if (/SurfaceCard\s*,\s*SurfaceCard/.test(after)) {
  throw new Error(`${rel}: duplicate SurfaceCard specifier remains`);
}
if (!/\bSurfaceCard\b/.test(after)) {
  throw new Error(`${rel}: SurfaceCard missing`);
}
console.log('CLOSEFLOW_FIN8_SURFACECARD_DEDUP_REPAIR3_OK');
