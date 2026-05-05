function walkFiles(fs, path, root, options = {}) {
  const maxBytes = options.maxBytes || 512000;
  const allowedExt = options.allowedExt || new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.json', '.md']);
  const out = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === 'node_modules' || item.name === 'dist' || item.name === '.git') continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(full);
        continue;
      }
      const ext = path.extname(item.name);
      if (!allowedExt.has(ext)) continue;
      const stat = fs.statSync(full);
      if (stat.size > maxBytes) continue;
      out.push(full);
    }
  }
  walk(root);
  return out;
}

function readSafe(fs, file) {
  try {
    return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  } catch {
    return '';
  }
}

function joinedRelevantText(fs, path, root, hints) {
  const files = walkFiles(fs, path, root);
  const lowerHints = hints.map((h) => h.toLowerCase());
  const selected = [];
  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const relLower = rel.toLowerCase();
    const text = readSafe(fs, file);
    const lower = text.toLowerCase();
    if (lowerHints.some((hint) => relLower.includes(hint) || lower.includes(hint))) {
      selected.push({ rel, text });
    }
  }
  return selected;
}

module.exports = { walkFiles, readSafe, joinedRelevantText };
