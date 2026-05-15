const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src', 'pages', 'TodayStable.tsx');
const text = fs.readFileSync(file, 'utf8');
let start = text.indexOf('noActionLeads.length');
if (start < 0) start = text.indexOf('noActionLeads.map');
if (start < 0) throw new Error('TodayStable noActionLeads render block not found');
let end = text.indexOf('</StableCard>', start);
if (end < 0) throw new Error('TodayStable noActionLeads StableCard end not found');
const slice = text.slice(start, end);
if (/taskId\s*=\s*\{[^}]*\btask\b[^}]*\}/.test(slice)) {
  throw new Error('TodayStable noActionLeads render block still contains taskId from free task variable');
}
if (/doneKind\s*=\s*"task"/.test(slice)) {
  throw new Error('TodayStable noActionLeads render block still contains task-only doneKind');
}
if (/\btask\./.test(slice) || /\btask\?\./.test(slice)) {
  throw new Error('TodayStable noActionLeads render block still references free task variable');
}
console.log('OK TodayStable noActionLeads render has no free task reference');