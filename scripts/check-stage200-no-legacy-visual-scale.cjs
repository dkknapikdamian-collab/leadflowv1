const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

const forbiddenTargets = [
  "closeflow-viewport-zoom-80-source-truth-stage157.css",
  "closeflow-desktop-density-source-truth.css",
  "eliteflow-sidebar-user-footer-below-nav.css",
  "closeflow-sidebar-full-height-stage188.css",
  "closeflow-sidebar-left-rail-stage189.css",
  "closeflow-sidebar-actual-panel-stage190.css",
  "closeflow-sidebar-real-panel-stage190b.css",
  "closeflow-sidebar-height-only-stage191.css",
  "closeflow-sidebar-fit-height-stage192.css",
  "closeflow-sidebar-layout-contract-stage194.css",
  "closeflow-sidebar-fixed-viewport-stage196.css"
];

const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".scss"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === "dist" || item.name === "node_modules" || item.name === "_project") continue;
      walk(full, out);
    } else if (exts.has(path.extname(item.name))) {
      if (/\.bak$|\.removed\.bak$/.test(item.name)) continue;
      out.push(full);
    }
  }
  return out;
}

function isActiveImportLine(line) {
  const t = line.trim();
  if (!t) return false;
  if (t.startsWith("//")) return false;
  if (t.startsWith("/*")) return false;
  return (
    t.startsWith("import ") ||
    t.startsWith("@import ") ||
    t.includes("import './styles/") ||
    t.includes('import "./styles/') ||
    t.includes("import '../styles/") ||
    t.includes('import "../styles/')
  );
}

const failures = [];
const files = walk(SRC);

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    if (!isActiveImportLine(line)) return;

    for (const target of forbiddenTargets) {
      if (line.includes(target)) {
        failures.push(`${rel}:${index + 1} active forbidden visual/sidebar import: ${line.trim()}`);
      }
    }
  });
}

if (failures.length) {
  console.error("STAGE200 guard failed. Forbidden old visual/sidebar imports are still active:");
  for (const f of failures) console.error("- " + f);
  process.exit(1);
}

console.log("OK STAGE200: no active legacy 80% zoom/density/sidebar fit-content imports.");
