const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outJson = "docs/release/closeflow_mobile_tiles_source_inspect_2026-05-12.json";
const outMd = "docs/release/CLOSEFLOW_MOBILE_TILES_SOURCE_INSPECT_2026-05-12.md";

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
function rel(p){ return path.relative(root,p).replaceAll(path.sep,"/"); }
function read(p){ return fs.readFileSync(p,"utf8"); }
function snippet(lines, idx, radius=5){
  const start = Math.max(0, idx-radius);
  const end = Math.min(lines.length, idx+radius+1);
  return lines.slice(start,end).map((line,i)=>({line:start+i+1,text:line}));
}

const files = walk(path.join(root,"src"))
  .filter(p => /\.(tsx|jsx|ts|js|css)$/.test(p));

const patterns = [
  "OperatorMetricTiles",
  "StatShortcutCard",
  "Centrum dnia",
  "centrum dnia",
  "Leady",
  "Zadania",
  "Kalendarz",
  "data-cf-mobile-start-tile-trim",
  "cf-mobile-start-tile-trim",
  "TodayStable",
  "Today",
  "metricTiles",
  "operatorMetrics",
  "shortcut"
];

const hits = [];
const candidateFiles = [];
for (const file of files) {
  const text = read(file);
  const lines = text.split(/\r?\n/);
  let score = 0;
  const fileHits = [];
  for (let i=0;i<lines.length;i++) {
    const line = lines[i];
    const matched = patterns.filter(p => line.includes(p));
    if (matched.length) {
      score += matched.length;
      if (matched.includes("OperatorMetricTiles")) score += 20;
      if (matched.includes("StatShortcutCard")) score += 10;
      if (matched.includes("Centrum dnia") || matched.includes("centrum dnia")) score += 12;
      if (matched.includes("data-cf-mobile-start-tile-trim")) score += 30;
      if (/href=\{?['\"]\/?(leads|tasks|calendar)/i.test(line)) score += 8;
      fileHits.push({ line: i+1, matched, text: line.trim(), snippet: snippet(lines,i,4) });
    }
  }
  const r = rel(file);
  if (score || /Today|OperatorMetricTiles|StatShortcutCard|Layout/.test(r)) {
    const summary = {
      file: r,
      score,
      size: text.length,
      hasOperatorMetricTiles: text.includes("OperatorMetricTiles"),
      operatorMetricTilesCount: (text.match(/OperatorMetricTiles/g)||[]).length,
      hasStatShortcutCard: text.includes("StatShortcutCard"),
      statShortcutCardCount: (text.match(/StatShortcutCard/g)||[]).length,
      hasDataTrim: text.includes("data-cf-mobile-start-tile-trim"),
      hasCentrumDnia: text.includes("Centrum dnia") || text.includes("centrum dnia"),
      hits: fileHits.slice(0,25)
    };
    if (score) hits.push(summary);
    if (/Today|OperatorMetricTiles|StatShortcutCard|Layout/.test(r) || score >= 20) candidateFiles.push(summary);
  }
}

hits.sort((a,b)=>b.score-a.score || a.file.localeCompare(b.file));
candidateFiles.sort((a,b)=>b.score-a.score || a.file.localeCompare(b.file));

const cssFiles = files.filter(p=>p.endsWith('.css'));
const cssImportant = [];
for (const file of cssFiles) {
  const text = read(file);
  if (/display\s*:\s*(grid|flex|block|contents|inline-flex)[^;]*!important/.test(text) || text.includes('data-cf-mobile-start-tile-trim')) {
    const lines = text.split(/\r?\n/);
    const local = [];
    lines.forEach((line,i)=>{
      if (/display\s*:\s*(grid|flex|block|contents|inline-flex)[^;]*!important/.test(line) || line.includes('data-cf-mobile-start-tile-trim') || line.includes('cf-mobile-start-tile-trim')) {
        local.push({line:i+1,text:line.trim(),snippet:snippet(lines,i,3)});
      }
    });
    cssImportant.push({file:rel(file),hits:local.slice(0,20)});
  }
}

const indexCss = fs.existsSync(path.join(root,'src/index.css')) ? read(path.join(root,'src/index.css')) : '';
const indexImports = indexCss.split(/\r?\n/).map((line,i)=>({line:i+1,text:line.trim()})).filter(x=>x.text.startsWith('@import'));

const result = {
  verdict: "INSPECT_ONLY: nie zmieniono runtime UI. Raport ma wskazać realny plik/wrapper przed następnym patchem.",
  generatedAt: new Date().toISOString(),
  topHits: hits.slice(0,30).map(h=>({file:h.file,score:h.score,hasOperatorMetricTiles:h.hasOperatorMetricTiles,operatorMetricTilesCount:h.operatorMetricTilesCount,hasStatShortcutCard:h.hasStatShortcutCard,statShortcutCardCount:h.statShortcutCardCount,hasDataTrim:h.hasDataTrim,hasCentrumDnia:h.hasCentrumDnia})),
  candidateFiles: candidateFiles.slice(0,20),
  cssImportant: cssImportant.slice(0,50),
  indexImports,
  counts: {
    scannedFiles: files.length,
    hitFiles: hits.length,
    candidateFiles: candidateFiles.length,
    cssImportantFiles: cssImportant.length,
    dataTrimFiles: hits.filter(h=>h.hasDataTrim).map(h=>h.file)
  }
};

fs.writeFileSync(path.join(root,outJson), JSON.stringify(result,null,2), 'utf8');

function mdSnippet(snip){
  return snip.map(x => `${String(x.line).padStart(4,' ')} | ${x.text}`).join('\n');
}
let md = `# CLOSEFLOW MOBILE TILES SOURCE INSPECT — 2026-05-12\n\n`;
md += `## Werdykt\n\n${result.verdict}\n\n`;
md += `## Top pliki po score\n\n`;
for (const h of result.topHits.slice(0,15)) {
  md += `- \`${h.file}\` score=${h.score} operator=${h.hasOperatorMetricTiles}/${h.operatorMetricTilesCount} stat=${h.hasStatShortcutCard}/${h.statShortcutCardCount} dataTrim=${h.hasDataTrim} centrum=${h.hasCentrumDnia}\n`;
}
md += `\n## Kandydaci i fragmenty\n\n`;
for (const f of result.candidateFiles.slice(0,10)) {
  md += `### ${f.file} — score ${f.score}\n\n`;
  for (const hit of f.hits.slice(0,8)) {
    md += `Patterny: ${hit.matched.join(', ')} @ line ${hit.line}\n\n\`\`\`tsx\n${mdSnippet(hit.snippet)}\n\`\`\`\n\n`;
  }
}
md += `\n## CSS / display important / trim\n\n`;
for (const c of result.cssImportant.slice(0,15)) {
  md += `### ${c.file}\n\n`;
  for (const hit of c.hits.slice(0,5)) {
    md += `line ${hit.line}\n\n\`\`\`css\n${mdSnippet(hit.snippet)}\n\`\`\`\n\n`;
  }
}
md += `\n## src/index.css imports\n\n\`\`\`css\n${indexImports.map(x=>`${x.line}: ${x.text}`).join('\n')}\n\`\`\`\n`;

fs.writeFileSync(path.join(root,outMd), md, 'utf8');

console.log('CLOSEFLOW_MOBILE_TILES_SOURCE_INSPECT_OK');
console.log(JSON.stringify({report: outMd, json: outJson, topHits: result.topHits.slice(0,10), counts: result.counts}, null, 2));
