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
  if (!matches.length) return "_Brak trafień._";
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
    "# Audyt ClientDetail / CaseDetail — stare warstwy, style i helpery",
    "",
    `**Data wygenerowania:** ${timestamp}`,
    `**Repo root:** ${code(REPO_ROOT)}`,
    "",
    "## Werdykt techniczny",
    "",
    "Ten raport jest tylko mapą audytową. Skrypt nie zmienia UI, logiki ani danych. Jego zadanie to pokazać, które stare warstwy mogą nadal wpływać na `ClientDetail` i `CaseDetail`, zanim zaczniemy kolejne poprawki.",
    "",
    "## 1. Pliki objęte audytem",
    "",
    table(
      ["Plik", "Status"],
      TARGET_FILES.map((file) => [code(file), exists(file) ? "OK" : "BRAK"])
    ),
    "",
    missing.length
      ? `**Uwaga:** brakuje ${missing.length} plików z listy wejściowej. To nie blokuje raportu, ale wymaga ręcznej oceny, czy ścieżki są stare, przeniesione albo usunięte.`
      : "**Status:** wszystkie pliki z listy wejściowej istnieją.",
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
      : "_Brak importów CSS w audytowanych stronach albo pliki stron nie istnieją._",
    "",
    "## 3. Klasy `client-detail-*`, `case-detail-*`, `right-card`",
    "",
    "### 3.1. Podsumowanie tokenów klas",
    "",
    classSummaryRows.length
      ? table(["Klasa / token", "Liczba wystąpień"], classSummaryRows)
      : "_Brak trafień._",
    "",
    "### 3.2. Wystąpienia z lokalizacją",
    "",
    matchesTable(classMatches, [{ title: "Token", value: (item) => code(item.label) }]),
    "",
    "## 4. Wystąpienia `!important`",
    "",
    importantMatches.length
      ? matchesTable(importantMatches)
      : "_Brak `!important` w audytowanych plikach._",
    "",
    "## 5. Lokalne helpery finansowe w ClientDetail / CaseDetail",
    "",
    "### 5.1. Kandydaci na lokalne definicje helperów finansowych",
    "",
    financeStrict.length ? matchesTable(financeStrict) : "_Brak kandydatów na lokalne definicje helperów finansowych._",
    "",
    "### 5.2. Luźne referencje finansowe do ręcznej oceny",
    "",
    financeLoose.length ? matchesTable(financeLoose) : "_Brak luźnych referencji finansowych._",
    "",
    "## 6. Lokalne helpery notatek w ClientDetail / CaseDetail",
    "",
    noteHelpers.length ? matchesTable(noteHelpers) : "_Brak kandydatów na lokalne helpery notatek._",
    "",
    "## 7. Lokalne formularze / dialogi task/event/note w ClientDetail / CaseDetail",
    "",
    localForms.length ? matchesTable(localForms, [{ title: "Token", value: (item) => code(item.label) }]) : "_Brak trafień formularzy/dialogów task/event/note._",
    "",
    "## 8. `getCaseFinanceSummary` poza źródłem prawdy",
    "",
    "Docelowe źródło prawdy: `src/lib/finance/case-finance-source.ts`.",
    "",
    summaryOccurrences.length
      ? table(
          ["Plik", "Linia", "Poza źródłem prawdy?", "Fragment"],
          summaryOccurrences.map((item) => [
            code(item.file),
            String(item.line),
            item.allowedSource ? "NIE" : "TAK",
            code(item.text),
          ])
        )
      : "_Brak wystąpień `getCaseFinanceSummary` w skanowanych katalogach._",
    "",
    summaryOutsideSource.length
      ? `**Do oceny:** znaleziono ${summaryOutsideSource.length} wystąpień poza źródłem prawdy. Nie każde jest błędem, bo import/wywołanie w UI może być poprawne, ale trzeba sprawdzić, czy nie powstała druga logika liczenia finansów.`
      : "**Status:** brak wystąpień poza źródłem prawdy albo wywołania są tylko w dozwolonym pliku.",
    "",
    "## 9. Interpretacja dla kolejnego etapu",
    "",
    "- Jeśli `!important` jest w aktywnych warstwach `visual-stage12` / `visual-stage13`, nie dokładamy kolejnego CSS-a na wierzch. Najpierw trzeba zdecydować, która warstwa jest źródłem prawdy.",
    "- Jeśli notatki lub formularze są renderowane lokalnie w `ClientDetail.tsx` w więcej niż jednym miejscu, nie maskować duplikatu CSS-em. Trzeba usunąć drugi render albo przenieść go do jednego komponentu.",
    "- Jeśli wartości finansowe są liczone lokalnie w ekranach, przenieść je do `src/lib/finance/case-finance-source.ts` albo używać wyłącznie `getCaseFinanceSummary`.",
    "- Jeśli `right-card` jest używany w wielu warstwach stylu, kolejny etap musi wskazać jedną klasę bazową i jedną warstwę override.",
    "",
    "## 10. Kryterium zamknięcia ETAPU 0",
    "",
    "- Raport został wygenerowany w `docs/audits/client-case-legacy-layers-2026-05-14.md`.",
    "- Skrypt audytu istnieje w `scripts/audit-client-case-legacy-layers.cjs`.",
    "- UI, dane i logika biznesowa nie zostały zmienione.",
    "- Wynik raportu jest gotowy jako mapa do REPAIR4 / kolejnego etapu naprawy.",
    "",
  ].join("\n");

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("OK: wygenerowano raport audytu");
  console.log(rel(REPORT_PATH));
  console.log("");
  console.log("Podsumowanie:");
  console.log(`- Pliki istniejące: ${existing.length}/${TARGET_FILES.length}`);
  console.log(`- Brakujące pliki: ${missing.length}`);
  console.log(`- Importy CSS w stronach: ${cssImports.length}`);
  console.log(`- Tokeny klas client/case/right-card: ${classMatches.length}`);
  console.log(`- !important: ${importantMatches.length}`);
  console.log(`- Kandydaci finance helper: ${financeStrict.length}`);
  console.log(`- Kandydaci note helper: ${noteHelpers.length}`);
  console.log(`- Formularze/dialogi task/event/note: ${localForms.length}`);
  console.log(`- getCaseFinanceSummary poza źródłem prawdy: ${summaryOutsideSource.length}`);
}

main();
