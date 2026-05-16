const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const sourcePath = path.join(process.cwd(), 'src/lib/today-sections.ts');
const outputPath = path.join(process.cwd(), 'dist-test-today-sections.cjs');
const source = fs.readFileSync(sourcePath, 'utf8');
const out = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
fs.writeFileSync(outputPath, out.outputText, 'utf8');
