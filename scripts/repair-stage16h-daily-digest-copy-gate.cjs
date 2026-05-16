#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const target = path.join(root, "src/pages/Settings.tsx");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.writeFileSync(file, text, "utf8");
}

if (!fs.existsSync(target)) {
  console.error("src/pages/Settings.tsx missing");
  process.exit(1);
}

let text = read(target);
const before = text;

const replacements = [
  ["Na darmowym Vercel cron dzia\u0142a raz dzie\u0144nie", "Na darmowym Vercel cron dzia\u0142a raz dziennie"],
  ["Na darmowym Vercel cron dziala raz dzie\u0144nie", "Na darmowym Vercel cron dziala raz dziennie"],
  ["Na darmowym Vercel cron dzia\\u0142a raz dzie\\u0144nie", "Na darmowym Vercel cron dzia\u0142a raz dziennie"],
  ["dzia\u0142a raz dzie\u0144nie", "dzia\u0142a raz dziennie"],
  ["dziala raz dzie\u0144nie", "dziala raz dziennie"],
  ["raz dzie\u0144nie", "raz dziennie"],
];

for (const [from, to] of replacements) {
  text = text.split(from).join(to);
}

if (text === before && text.includes("DAILY_DIGEST_EMAIL_CRON_HINT_GUARD")) {
  text = text.replace(
    /const\s+DAILY_DIGEST_EMAIL_CRON_HINT_GUARD\s*=\s*['\"][^'\"]*['\"];?/,
    "const DAILY_DIGEST_EMAIL_CRON_HINT_GUARD = 'Na darmowym Vercel cron dzia\u0142a raz dziennie';",
  );
}

if (!/Na darmowym Vercel cron dzia(?:\u0142|l)a raz dziennie/.test(text)) {
  console.error("Daily digest cron hint repair did not produce required copy.");
  process.exit(1);
}

if (text !== before) {
  write(target, text);
  console.log("OK: Stage16H daily digest cron hint copy repaired.");
  console.log("Touched files:\n- src/pages/Settings.tsx");
} else {
  console.log("OK: Stage16H daily digest cron hint already compatible.");
  console.log("Touched files: 0");
}
