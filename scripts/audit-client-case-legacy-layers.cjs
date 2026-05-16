#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * CloseFlow / LeadFlow
 * ETAP 0: audit ClientDetail + CaseDetail legacy layers
 *
 * Ten skrypt NIE zmienia UI, logiki ani danych.
 * Tworzy raport techniczny:
 * docs/audits/client-case-legacy-layers-2026-05-14.md
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = process.cwd();
const REPORT_PATH = path.join(
  REPO_ROOT,
  "docs",
  "audits",
  "client-case-legacy-layers-2026-05-14.md"
);

const TARGET_FILES = [
  "src/pages/ClientDetail.tsx",
  "src/pages/CaseDetail.tsx",
  "src/styles/visual-stage12-client-detail-vnext.css",
  "src/styles/visual-stage13-case-detail-vnext.css",
  "src/styles/closeflow-case-history-visual-source-truth.css",
  "src/components/ContextActionDialogs.tsx",
  "src/components/entity-actions.tsx",
  "src/components/ui-system.tsx",
  "src/lib/finance/case-finance-source.ts",
];

const PAGE_FILES = [
  "src/pages/ClientDetail.tsx",
  "src/pages/CaseDetail.tsx",
];

const STYLE_FILES = [
  "src/styles/visual-stage12-client-detail-vnext.css",
  "src/styles/visual-stage13-case-detail-vnext.css",
  "src/styles/closeflow-case-history-visual-source-truth.css",
];

const SEARCH_ROOTS = ["src", "api", "scripts", "tests"];

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".vercel",
  "coverage",
  ".turbo",
]);

function rel(abs) {
  return path.relative(REPO_ROOT, abs).replaceAll("\\", "/");
}

function filePath(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function readFile(relativePath) {
  const abs = filePath(relativePath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

function linesOf(text) {
  return String(text || "").split(/\r?\n/);
}

function escapeMd(text) {
  return String(text)
    .replaceAll("|", "\\|")
    .replace(/\r?\n/g, " ");
}

function code(value) {
  return "`" + String(value).replaceAll("`", "\\`") + "`";
}

function unique(items) {
  return [...new Set(items)];
}

function collectLineMatches(relativePath, regex, labelFactory) {
  const text = readFile(relativePath);
  if (!text) return [];
  return linesOf(text).flatMap((line, index) => {
    regex.lastIndex = 0;
    const matches = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push({
        file: relativePath,
        line: index + 1,
        text: line.trim(),
        label: labelFactory ? labelFactory(match, line, index + 1) : match[0],
      });
      if (match.index === regex.lastIndex) regex.lastIndex += 1;
    }
    return matches;
  });
}

function collectCssImports(relativePath) {
  const text = readFile(relativePath);
  if (!text) return [];
  const imports = [];
  const regex = /^\s*import\s+(?:[^'"]+\s+from\s+)?["']([^"']+\.css)["'];?/gm;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(0, match.index);
    const line = before.split(/\r?\n/).length;
    imports.push({
      file: relativePath,
      line,
      importPath: match[1],
      raw: match[0].trim(),
    });
  }
  return imports;
}

function collectClassTokens(relativePath) {
  return collectLineMatches(
    relativePath,
    /\b(?:client-detail-[A-Za-z0-9_-]+|case-detail-[A-Za-z0-9_-]+|right-card)\b/g,
    (match) => match[0]
  );
}

function collectImportant(relativePath) {
  return collectLineMatches(relativePath, /!important\b/g, () => "!important");
}

function collectLocalFinanceHelpers(relativePath) {
  const text = readFile(relativePath);
  if (!text) return [];
  const financeWords =
    "(finance|payment|settlement|commission|contractValue|dealValue|caseValue|paidAmount|remainingAmount|expectedRevenue|getCaseFinanceSummary)";
  const definitionRegex = new RegExp(
    "\\b(function|const|let|var)\\s+[A-Za-z0-9_$]*" + financeWords + "[A-Za-z0-9_$]*|\\b(function|const|let|var)\\s+[A-Za-z0-9_$]+\\s*=\\s*\\(?[^\\n]*" + financeWords,
    "i"
  );

  const looseRegex = new RegExp(financeWords, "i");

  const lines = linesOf(text);
  const strict = [];
  const loose = [];

  lines.forEach((line, idx) => {
    if (definitionRegex.test(line)) {
      strict.push({
        file: relativePath,
        line: idx + 1,
        text: line.trim(),
        label: "local-finance-helper-candidate",
      });
    } else if (looseRegex.test(line)) {
      loose.push({
        file: relativePath,
        line: idx + 1,
        text: line.trim(),
        label: "finance-reference",
      });
    }
  });

  return { strict, loose };
}

function collectLocalNoteHelpers(relativePath) {
  const text = readFile(relativePath);
  if (!text) return [];
  const noteWords = "(note|notes|notat|clientNote|caseNote|activityNote|voiceNote)";
  const definitionRegex = new RegExp(
    "\\b(function|const|let|var)\\s+[A-Za-z0-9_$]*" + noteWords + "[A-Za-z0-9_$]*|\\b(function|const|let|var)\\s+[A-Za-z0-9_$]+\\s*=\\s*\\(?[^\\n]*" + noteWords,
    "i"
  );
  return linesOf(text)
    .map((line, idx) => ({ line, idx }))
    .filter(({ line }) => definitionRegex.test(line))
    .map(({ line, idx }) => ({
      file: relativePath,
      line: idx + 1,
      text: line.trim(),
      label: "local-note-helper-candidate",
    }));
}

function collectLocalForms(relativePath) {
  const text = readFile(relativePath);
  if (!text) return [];
  const formRegex =
    /\b(?:Task|Event|Note|ClientNote|CaseNote|LeadNote)(?:Form|Dialog|Modal)\b|\b(?:taskForm|eventForm|noteForm|taskDialog|eventDialog|noteDialog)\b|\b(?:open|set|is|show|hide)[A-Za-z0-9_$]*(?:Task|Event|Note)[A-Za-z0-9_$]*(?:Form|Dialog|Modal)?\b/g;

  return collectLineMatches(relativePath, formRegex, (match) => match[0]);
}

function walk(dirAbs, out = []) {
  if (!fs.existsSync(dirAbs)) return out;
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dirAbs, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(abs, out);
      continue;
    }
    if (!/\.(ts|tsx|js|jsx|cjs|mjs|css)$/.test(entry.name)) continue;
    out.push(abs);
  }
  return out;
}

function collectGetCaseFinanceSummaryOccurrences() {
  const files = SEARCH_ROOTS.flatMap((root) => walk(path.join(REPO_ROOT, root)));
  const occurrences = [];

  for (const abs of unique(files)) {
    const relativePath = rel(abs);
    const text = fs.readFileSync(abs, "utf8");
    linesOf(text).forEach((line, idx) => {
      if (!line.includes("getCaseFinanceSummary")) return;
      occurrences.push({
        file: relativePath,
        line: idx + 1,
        text: line.trim(),
        allowedSource:
          relativePath === "src/lib/finance/case-finance-source.ts",
      });
    });
  }

  return occurrences;
}

function table(headers, rows) {
  const header = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(escapeMd).join(" | ")} |`);
  return [header, sep, ...body].join("\n");
}

function matchesTable(matches, extraColumns = []) {
  if (!matches.length) return "_Brak trafie\u0144._";
  const headers = ["Plik", "Linia", ...extraColumns.map((c) => c.title), "Fragment"];
  const rows = matches.map((item) => [
    code(item.file),
    String(item.line),
    ...extraColumns.map((c) => c.value(item)),
    code(item.text || item.raw || item.importPath || ""),
  ]);
  return table(headers, rows);
}

function summarizeByLabel(matches) {
  const map = new Map();
  for (const item of matches) {
    map.set(item.label, (map.get(item.label) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function main() {
  const timestamp = new Date().toISOString();

  const missing = TARGET_FILES.filter((file) => !exists(file));
  const existing = TARGET_FILES.filter((file) => exists(file));

  const cssImports = PAGE_FILES.flatMap(collectCssImports);
  const classMatches = TARGET_FILES.flatMap(collectClassTokens);
  const importantMatches = [...TARGET_FILES, ...PAGE_FILES].flatMap(collectImportant);

  const financeByPage = PAGE_FILES.map((file) => ({
    file,
    ...collectLocalFinanceHelpers(file),
  }));

  const financeStrict = financeByPage.flatMap((entry) => entry.strict || []);
  const financeLoose = financeByPage.flatMap((entry) => entry.loose || []);

  const noteHelpers = PAGE_FILES.flatMap(collectLocalNoteHelpers);
  const localForms = PAGE_FILES.flatMap(collectLocalForms);
  const summaryOccurrences = collectGetCaseFinanceSummaryOccurrences();
  const summaryOutsideSource = summaryOccurrences.filter((item) => !item.allowedSource);

  const classSummaryRows = summarizeByLabel(classMatches)
    .slice(0, 80)
    .map(([label, count]) => [code(label), String(count)]);

  const report = [
    "# Audyt ClientDetail / CaseDetail \u2014 stare warstwy, style i helpery",
    "",
    `**Data wygenerowania:** ${timestamp}`,
    `**Repo root:** ${code(REPO_ROOT)}`,
    "",
    "## Werdykt techniczny",
    "",
    "Ten raport jest tylko map\u0105 audytow\u0105. Skrypt nie zmienia UI, logiki ani danych. Jego zadanie to pokaza\u0107, kt\u00F3re stare warstwy mog\u0105 nadal wp\u0142ywa\u0107 na `ClientDetail` i `CaseDetail`, zanim zaczniemy kolejne poprawki.",
    "",
    "## 1. Pliki obj\u0119te audytem",
    "",
    table(
      ["Plik", "Status"],
      TARGET_FILES.map((file) => [code(file), exists(file) ? "OK" : "BRAK"])
    ),
    "",
    missing.length
      ? `**Uwaga:** brakuje ${missing.length} plik\u00F3w z listy wej\u015Bciowej. To nie blokuje raportu, ale wymaga r\u0119cznej oceny, czy \u015Bcie\u017Cki s\u0105 stare, przeniesione albo usuni\u0119te.`
      : "**Status:** wszystkie pliki z listy wej\u015Bciowej istniej\u0105.",
    "",
    "## 2. Importy CSS w ClientDetail.tsx i CaseDetail.tsx",
    "",
    cssImports.length
      ? table(
          ["Plik", "Linia", "Import CSS", "Fragment"],
          cssImports.map((item) => [
            code(item.file),
            String(item.line),
            code(item.importPath),
            code(item.raw),
          ])
        )
      : "_Brak import\u00F3w CSS w audytowanych stronach albo pliki stron nie istniej\u0105._",
    "",
    "## 3. Klasy `client-detail-*`, `case-detail-*`, `right-card`",
    "",
    "### 3.1. Podsumowanie token\u00F3w klas",
    "",
    classSummaryRows.length
      ? table(["Klasa / token", "Liczba wyst\u0105pie\u0144"], classSummaryRows)
      : "_Brak trafie\u0144._",
    "",
    "### 3.2. Wyst\u0105pienia z lokalizacj\u0105",
    "",
    matchesTable(classMatches, [{ title: "Token", value: (item) => code(item.label) }]),
    "",
    "## 4. Wyst\u0105pienia `!important`",
    "",
    importantMatches.length
      ? matchesTable(importantMatches)
      : "_Brak `!important` w audytowanych plikach._",
    "",
    "## 5. Lokalne helpery finansowe w ClientDetail / CaseDetail",
    "",
    "### 5.1. Kandydaci na lokalne definicje helper\u00F3w finansowych",
    "",
    financeStrict.length ? matchesTable(financeStrict) : "_Brak kandydat\u00F3w na lokalne definicje helper\u00F3w finansowych._",
    "",
    "### 5.2. Lu\u017Ane referencje finansowe do r\u0119cznej oceny",
    "",
    financeLoose.length ? matchesTable(financeLoose) : "_Brak lu\u017Anych referencji finansowych._",
    "",
    "## 6. Lokalne helpery notatek w ClientDetail / CaseDetail",
    "",
    noteHelpers.length ? matchesTable(noteHelpers) : "_Brak kandydat\u00F3w na lokalne helpery notatek._",
    "",
    "## 7. Lokalne formularze / dialogi task/event/note w ClientDetail / CaseDetail",
    "",
    localForms.length ? matchesTable(localForms, [{ title: "Token", value: (item) => code(item.label) }]) : "_Brak trafie\u0144 formularzy/dialog\u00F3w task/event/note._",
    "",
    "## 8. `getCaseFinanceSummary` poza \u017Ar\u00F3d\u0142em prawdy",
    "",
    "Docelowe \u017Ar\u00F3d\u0142o prawdy: `src/lib/finance/case-finance-source.ts`.",
    "",
    summaryOccurrences.length
      ? table(
          ["Plik", "Linia", "Poza \u017Ar\u00F3d\u0142em prawdy?", "Fragment"],
          summaryOccurrences.map((item) => [
            code(item.file),
            String(item.line),
            item.allowedSource ? "NIE" : "TAK",
            code(item.text),
          ])
        )
      : "_Brak wyst\u0105pie\u0144 `getCaseFinanceSummary` w skanowanych katalogach._",
    "",
    summaryOutsideSource.length
      ? `**Do oceny:** znaleziono ${summaryOutsideSource.length} wyst\u0105pie\u0144 poza \u017Ar\u00F3d\u0142em prawdy. Nie ka\u017Cde jest b\u0142\u0119dem, bo import/wywo\u0142anie w UI mo\u017Ce by\u0107 poprawne, ale trzeba sprawdzi\u0107, czy nie powsta\u0142a druga logika liczenia finans\u00F3w.`
      : "**Status:** brak wyst\u0105pie\u0144 poza \u017Ar\u00F3d\u0142em prawdy albo wywo\u0142ania s\u0105 tylko w dozwolonym pliku.",
    "",
    "## 9. Interpretacja dla kolejnego etapu",
    "",
    "- Je\u015Bli `!important` jest w aktywnych warstwach `visual-stage12` / `visual-stage13`, nie dok\u0142adamy kolejnego CSS-a na wierzch. Najpierw trzeba zdecydowa\u0107, kt\u00F3ra warstwa jest \u017Ar\u00F3d\u0142em prawdy.",
    "- Je\u015Bli notatki lub formularze s\u0105 renderowane lokalnie w `ClientDetail.tsx` w wi\u0119cej ni\u017C jednym miejscu, nie maskowa\u0107 duplikatu CSS-em. Trzeba usun\u0105\u0107 drugi render albo przenie\u015B\u0107 go do jednego komponentu.",
    "- Je\u015Bli warto\u015Bci finansowe s\u0105 liczone lokalnie w ekranach, przenie\u015B\u0107 je do `src/lib/finance/case-finance-source.ts` albo u\u017Cywa\u0107 wy\u0142\u0105cznie `getCaseFinanceSummary`.",
    "- Je\u015Bli `right-card` jest u\u017Cywany w wielu warstwach stylu, kolejny etap musi wskaza\u0107 jedn\u0105 klas\u0119 bazow\u0105 i jedn\u0105 warstw\u0119 override.",
    "",
    "## 10. Kryterium zamkni\u0119cia ETAPU 0",
    "",
    "- Raport zosta\u0142 wygenerowany w `docs/audits/client-case-legacy-layers-2026-05-14.md`.",
    "- Skrypt audytu istnieje w `scripts/audit-client-case-legacy-layers.cjs`.",
    "- UI, dane i logika biznesowa nie zosta\u0142y zmienione.",
    "- Wynik raportu jest gotowy jako mapa do REPAIR4 / kolejnego etapu naprawy.",
    "",
  ].join("\n");

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("OK: wygenerowano raport audytu");
  console.log(rel(REPORT_PATH));
  console.log("");
  console.log("Podsumowanie:");
  console.log(`- Pliki istniej\u0105ce: ${existing.length}/${TARGET_FILES.length}`);
  console.log(`- Brakuj\u0105ce pliki: ${missing.length}`);
  console.log(`- Importy CSS w stronach: ${cssImports.length}`);
  console.log(`- Tokeny klas client/case/right-card: ${classMatches.length}`);
  console.log(`- !important: ${importantMatches.length}`);
  console.log(`- Kandydaci finance helper: ${financeStrict.length}`);
  console.log(`- Kandydaci note helper: ${noteHelpers.length}`);
  console.log(`- Formularze/dialogi task/event/note: ${localForms.length}`);
  console.log(`- getCaseFinanceSummary poza \u017Ar\u00F3d\u0142em prawdy: ${summaryOutsideSource.length}`);
}

main();
