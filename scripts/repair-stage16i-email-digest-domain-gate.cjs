#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text, "utf8");
}

function replaceExact(text, from, to, label, changes) {
  if (text.includes(to)) return text;
  if (!text.includes(from)) {
    throw new Error("MISSING_PATTERN: " + label);
  }
  changes.push(label);
  return text.split(from).join(to);
}

const rel = "src/pages/Settings.tsx";
let settings = read(rel);
const changes = [];

settings = replaceExact(
  settings,
  "const DAILY_DIGEST_EMAIL_UI_VISIBLE = true;",
  "const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;",
  "hide daily digest UI until sender domain is ready",
  changes
);

// Keep the digest runtime hint aligned with daily-digest-email-runtime.test.cjs.
settings = settings.replace(
  /Na darmowym Vercel cron dzia\u0142a raz dzie\u0144nie/g,
  "Na darmowym Vercel cron dzia\u0142a raz dziennie"
);
settings = settings.replace(
  /Na darmowym Vercel cron dzia\u0142a raz dzie\u0144nie/g,
  "Na darmowym Vercel cron dzia\u0142a raz dziennie"
);

write(rel, settings);

console.log("OK: Stage16I email digest domain gate repair completed.");
console.log("Touched files:");
console.log("- " + rel);
console.log("Changes:");
for (const change of changes) console.log("- " + change);
