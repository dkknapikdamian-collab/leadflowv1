const fs = require('fs');
const path = require('path');

const root = process.cwd();
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(rel, out);
    } else if (/\.(tsx?|jsx?|mdx?|html)$/.test(entry.name)) {
      out.push(rel);
    }
  }
  return out;
}

const files = [
  ...walk('src'),
  ...walk('public'),
].filter((file) => !file.includes('product-truth'));

const banned = [
  { label: 'SOC 2 certified', pattern: /SOC\s*2\s*certified/i },
  { label: 'SOC2 certified', pattern: /SOC2\s*certified/i },
  { label: 'ISO certified without proof', pattern: /ISO\s*27001\s*certified/i },
  { label: 'GDPR/RODO guaranteed compliant', pattern: /(GDPR|RODO)\s*(certified|guaranteed|gwarantowane|w pełni zgodne)/i },
  { label: 'bank level security', pattern: /bank[- ]?level security|bezpieczeństwo bankowe/i },
];

for (const file of files) {
  const content = read(file);
  for (const claim of banned) {
    if (claim.pattern.test(content)) {
      problems.push(file + ': banned public/security claim found: ' + claim.label);
    }
  }
}

const truthPath = path.join(root, 'src/lib/product-truth.ts');
const truth = fs.existsSync(truthPath) ? read('src/lib/product-truth.ts') : '';
if (!truth.includes("key: 'soc_security_claims'")) {
  problems.push('product truth registry missing soc_security_claims');
}
const socIndex = truth.indexOf("key: 'soc_security_claims'");
const socSlice = socIndex >= 0 ? truth.slice(socIndex, socIndex + 900) : '';
if (!/SOC\s*2\s*certified/i.test(socSlice)) {
  problems.push('product truth registry missing SOC 2 certified warning reference');
}
if (!/(certyfikat|certyfikatu|dowód|dowodu|dokument)/i.test(socSlice)) {
  problems.push('product truth registry missing proof/document requirement for SOC/security claims');
}

if (problems.length) {
  console.error('Public/security claims guard failed:');
  for (const problem of problems) console.error('- ' + problem);
  process.exit(1);
}

console.log('PASS check-public-security-claims');
