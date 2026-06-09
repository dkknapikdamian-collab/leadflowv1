const fs = require('fs');
const path = require('path');
const root = process.cwd();
function must(label, condition) { if (!condition) throw new Error(label); }
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
must('R58B package script exists', Boolean(pkg.scripts && pkg.scripts['check:stage228r58b-skip-tsx-nodecheck-continue']));
must('R58B test script exists', Boolean(pkg.scripts && pkg.scripts['test:stage228r58b-skip-tsx-nodecheck-continue']));
console.log('STAGE228R58B_SKIP_TSX_NODECHECK_CONTINUE PASS');
