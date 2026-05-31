const fs = require("fs");
const path = require("path");

const repo = process.cwd();

function p(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), "utf8") : "";
}

function write(rel, content) {
  fs.writeFileSync(p(rel), content, "utf8");
}

function removeIfExists(rel) {
  if (fs.existsSync(p(rel))) {
    fs.rmSync(p(rel), { force: true });
    console.log("REMOVED " + rel);
  }
}

const appPath = "src/App.tsx";
let app = read(appPath);

[
  "import './styles/closeflow-main-panel-density-scale-stage155.css';",
  "import './styles/closeflow-panel-zoom-density-stage153.css';",
  "import './styles/closeflow-revert-global-zoom-keep-card-density-stage154.css';"
].forEach((line) => {
  if (app.includes(line)) {
    app = app
      .replace(line + "\n", "")
      .replace(line + "\r\n", "")
      .replace(line, "");
    console.log("REMOVED App import: " + line);
  }
});

write(appPath, app);

const layoutPath = "src/components/Layout.tsx";
let layout = read(layoutPath);

const before = layout;

layout = layout.replace(
  /(\s*)<div className="cf155-main-density-frame" data-cf155-main-density-frame="true">\s*\r?\n\s*\{children\}\s*\r?\n\s*<\/div>/m,
  "$1{children}"
);

layout = layout.replace(
  /<div className="cf155-main-density-frame" data-cf155-main-density-frame="true">\s*\{children\}\s*<\/div>/m,
  "{children}"
);

if (layout !== before) {
  write(layoutPath, layout);
  console.log("UPDATED Layout.tsx: removed Stage155 density frame");
} else {
  console.log("SKIPPED Layout.tsx: Stage155 frame not found");
}

[
  "src/styles/closeflow-main-panel-density-scale-stage155.css",
  "scripts/apply-stage155-main-panel-density-scale.cjs",
  "scripts/check-stage155-main-panel-density-scale.cjs",
  "docs/ui/CLOSEFLOW_STAGE155_MAIN_PANEL_DENSITY_SCALE_SOURCE_TRUTH.md",
  "docs/ui/CLOSEFLOW_STAGE155_RUNTIME_MAIN_PANEL_DENSITY_AUDIT.js",
  "_project/STAGE155_MAIN_PANEL_DENSITY_SCALE_SOURCE_TRUTH_REPORT.md",
  "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage155 main panel density scale source truth.md"
].forEach(removeIfExists);

console.log("DONE: Stage155 removed.");
