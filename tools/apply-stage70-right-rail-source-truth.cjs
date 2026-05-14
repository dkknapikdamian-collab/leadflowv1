const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const mainPath = path.join(repo, 'src', 'main.tsx');
const sourceTruthPath = path.join(repo, 'src', 'styles', 'closeflow-right-rail-source-truth.css');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(mainPath)) fail('Brak src/main.tsx. Uruchom skrypt z katalogu repo.');
if (!fs.existsSync(sourceTruthPath)) fail('Brak src/styles/closeflow-right-rail-source-truth.css. Najpierw musi istnieć źródło prawdy styli.');

let main = fs.readFileSync(mainPath, 'utf8');
const importLine = "import './styles/closeflow-right-rail-source-truth.css';";

if (!main.includes(importLine)) {
  const afterActionColor = "import './styles/action-color-taxonomy-v1.css';";
  const afterIndex = "import './index.css';";

  if (main.includes(afterActionColor)) {
    main = main.replace(afterActionColor, `${afterActionColor}\n${importLine}`);
  } else if (main.includes(afterIndex)) {
    main = main.replace(afterIndex, `${afterIndex}\n${importLine}`);
  } else {
    fail('Nie znaleziono stabilnego punktu importu CSS w src/main.tsx.');
  }

  fs.writeFileSync(mainPath, main, 'utf8');
  console.log('OK: dopięto finalny import src/styles/closeflow-right-rail-source-truth.css w src/main.tsx');
} else {
  console.log('OK: finalny import right rail source truth już istnieje w src/main.tsx');
}
