#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function s(...codes) {
  return String.fromCharCode(...codes);
}

const REPLACEMENTS = [
  [s(0x00e2, 0x20ac, 0x017e), s(0x201e)],
  [s(0x00e2, 0x20ac, 0x0153), s(0x201c)],
  [s(0x00e2, 0x20ac, 0x0165), s(0x201d)],
  [s(0x00e2, 0x20ac, 0x009d), s(0x201d)],
  [s(0x00e2, 0x20ac, 0x2122), s(0x2019)],
  [s(0x00e2, 0x20ac, 0x02dc), s(0x2018)],
  [s(0x00e2, 0x20ac, 0x00a6), s(0x2026)],
  [s(0x00e2, 0x20ac, 0x201c), s(0x2013)],
  [s(0x00e2, 0x20ac, 0x201d), s(0x2014)],
  [s(0x00e2, 0x20ac, 0x02d8), s(0x2022)],
  [s(0x00e2, 0x20ac, 0x00a2), s(0x2022)],
  [s(0x00e2, 0x20ac, 0x015f), s(0x203a)],
  [s(0x00e2, 0x20ac, 0x0161), s(0x201a)],
  [s(0x00e2, 0x201e, 0x02dc), s(0x2122)],

  [s(0x00c4, 0x2026), s(0x0105)],
  [s(0x00c4, 0x2021), s(0x0107)],
  [s(0x00c4, 0x2122), s(0x0119)],
  [s(0x0139, 0x201a), s(0x0142)],
  [s(0x0139, 0x201e), s(0x0144)],
  [s(0x0102, 0x0142), s(0x00f3)],
  [s(0x0139, 0x203a), s(0x015b)],
  [s(0x0139, 0x015f), s(0x017a)],
  [s(0x0139, 0x013d), s(0x017c)],

  [s(0x00c4, 0x201e), s(0x0104)],
  [s(0x00c4, 0x2020), s(0x0106)],
  [s(0x00c4, 0xfffd), s(0x0118)],
  [s(0x0102, 0x201c), s(0x00d3)],
  [s(0x0139, 0x0161), s(0x015a)],
  [s(0x0139, 0x0105), s(0x0179)],
  [s(0x0139, 0x00bb), s(0x017b)],

  [s(0x00c2, 0x00a0), " "],
  [s(0x00c2, 0x0020), " "],
];

const SUSPICIOUS_REGEXES = [
  new RegExp(`${s(0x0139)}[${s(0x201a)}${s(0x201e)}${s(0x203a)}${s(0x015f)}${s(0x013d)}${s(0x00bb)}${s(0x0161)}${s(0x0105)}\\uFFFD]`),
  new RegExp(`${s(0x00c4)}[${s(0x2026)}${s(0x2021)}${s(0x2122)}${s(0x201e)}${s(0x2020)}\\uFFFD]`),
  new RegExp(`${s(0x0102)}[${s(0x0142)}${s(0x201c)}]`),
  new RegExp(`${s(0x00e2)}${s(0x20ac)}[A-Za-z${s(0x201e)}${s(0x201d)}${s(0x0165)}${s(0x2122)}${s(0x02dc)}${s(0x0161)}${s(0x203a)}${s(0x02d8)}${s(0x00a2)}]`),
  new RegExp(`${s(0x00c2)}(?:\\s|${s(0x00a0)})`),
];

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
  ".css",
  ".scss",
  ".html",
  ".md",
  ".json",
]);

function parseArgs(argv) {
  const args = { repo: null, write: false, check: false };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];

    if (key === "--repo") {
      args.repo = value;
      i += 1;
    } else if (key === "--write") {
      args.write = true;
    } else if (key === "--check") {
      args.check = true;
    }
  }

  return args;
}

function shouldIgnore(fullPath) {
  const normalized = fullPath.replace(/\\/g, "/");

  return (
    normalized.includes("/node_modules/") ||
    normalized.includes("/.git/") ||
    normalized.includes("/dist/") ||
    normalized.includes("/build/") ||
    normalized.includes("/coverage/") ||
    normalized.includes("/.next/") ||
    normalized.includes("/.vercel/") ||
    normalized.includes("/.tests-dist/") ||
    normalized.endsWith(".zip") ||
    normalized.endsWith(".png") ||
    normalized.endsWith(".jpg") ||
    normalized.endsWith(".jpeg") ||
    normalized.endsWith(".webp") ||
    normalized.endsWith(".ico") ||
    normalized.endsWith(".pdf")
  );
}

function walkFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (shouldIgnore(fullPath)) continue;

    if (entry.isDirectory()) walkFiles(fullPath, out);
    else out.push(fullPath);
  }

  return out;
}

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function applyFixes(input) {
  let output = input;

  for (const [bad, good] of REPLACEMENTS) {
    output = output.split(bad).join(good);
  }

  return output;
}

function findSuspiciousLines(content) {
  const lines = content.split(/\r?\n/);
  const result = [];

  lines.forEach((line, index) => {
    if (SUSPICIOUS_REGEXES.some((pattern) => pattern.test(line))) {
      result.push({ line: index + 1, text: line.trim().slice(0, 260) });
    }
  });

  return result;
}

function main() {
  const args = parseArgs(process.argv);
  const repo = args.repo ? path.resolve(args.repo) : process.cwd();

  if (!fs.existsSync(repo)) {
    console.error(`Nie znaleziono repo: ${repo}`);
    process.exit(1);
  }

  if (!args.write && !args.check) {
    console.error("Uzyj --write albo --check.");
    process.exit(1);
  }

  const files = walkFiles(repo).filter(isTextFile);
  const changed = [];
  const suspiciousBefore = [];
  const suspiciousAfter = [];

  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const beforeSuspicious = findSuspiciousLines(before);

    if (beforeSuspicious.length > 0) suspiciousBefore.push({ file, lines: beforeSuspicious });

    const after = applyFixes(before);

    if (args.write && after !== before) {
      fs.writeFileSync(file, after, "utf8");
      changed.push(file);
    }

    const checkedContent = args.write ? after : before;
    const afterSuspicious = findSuspiciousLines(checkedContent);

    if (afterSuspicious.length > 0) suspiciousAfter.push({ file, lines: afterSuspicious });
  }

  if (args.write) {
    if (changed.length === 0) console.log("Nie znaleziono sekwencji do automatycznej naprawy.");
    else {
      console.log("Naprawione pliki:");
      for (const file of changed) console.log(`- ${path.relative(repo, file)}`);
    }
  }

  if (suspiciousBefore.length > 0) {
    console.log("");
    console.log("Podejrzane sekwencje przed/obecnie:");
    for (const item of suspiciousBefore.slice(0, 120)) {
      console.log(`- ${path.relative(repo, item.file)}`);
      for (const line of item.lines.slice(0, 10)) console.log(`  L${line.line}: ${line.text}`);
    }
  }

  if (suspiciousAfter.length > 0) {
    console.log("");
    console.log("Po automatycznej naprawie nadal zostaly podejrzane sekwencje:");
    for (const item of suspiciousAfter.slice(0, 120)) {
      console.log(`- ${path.relative(repo, item.file)}`);
      for (const line of item.lines.slice(0, 10)) console.log(`  L${line.line}: ${line.text}`);
    }
    process.exit(1);
  }

  console.log("");
  console.log("OK: nie wykryto rozsypanych polskich znakow po skanie.");
}

main();
