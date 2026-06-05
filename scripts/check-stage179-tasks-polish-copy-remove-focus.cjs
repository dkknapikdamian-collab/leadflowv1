const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) {
    throw new Error(rel + " missing marker: " + marker);
  }
}

function mustNotInclude(rel, marker) {
  if (read(rel).includes(marker)) {
    throw new Error(rel + " must not contain marker: " + marker);
  }
}

const tasks = "src/pages/TasksStable.tsx";

[
  "label: 'Zaleg\\u0142e'",
  "label: 'Dzi\\u015b'",
  "label: 'Nadchodz\\u0105ce'",
  "hint: 'do uporz\\u0105dkowania'",
  "hint: 'zamkni\\u0119te dzia\\u0142ania'",
  "label: 'Bez powi\\u0105zania'",
  "<h2>Filtry zadań</h2>",
  "<h3>Najpilniejsze zadania</h3>",
  "data-stage178-tasks-filter-card=\"true\"",
  "data-stage178-tasks-urgent-card=\"true\""
].forEach((marker) => mustInclude(tasks, marker));

[
  "Szybki fokus",
  "data-stage178-tasks-focus-card=\"true\"",
  "tasks-stage178-focus-row",
  "nextTaskMoment",
  "Bez klikania po zakładkach. Najpierw to, co wymaga ruchu.",
  "5 zadań, które najłatwiej zgubić w pracy operacyjnej.",
  "Zaległe",
  "Zaległe",
  "Dziś",
  "Dziś",
  "zadań",
  "zadań",
  "powiązania",
  "zakładkach",
  "zakładkach",
  "ł",
  "ł",
  "ś",
  "ś",
  "ą",
  "ę",
  "\u0102",
  "Ã"
].forEach((marker) => mustNotInclude(tasks, marker));

console.log("OK: Stage180 final tasks rail copy guard passed.");
