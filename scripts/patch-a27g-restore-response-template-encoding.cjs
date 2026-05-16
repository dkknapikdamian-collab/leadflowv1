const fs = require('node:fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function replaceRegexOrFail(file, content, regex, to, label) {
  if (!regex.test(content)) {
    throw new Error(`${file} missing replacement target: ${label}`);
  }
  return content.replace(regex, to);
}

const layoutFile = 'src/components/Layout.tsx';
let layout = read(layoutFile);

if (!layout.includes('MessageSquareText')) {
  layout = replaceRegexOrFail(
    layoutFile,
    layout,
    /(\s+FolderKanban,\r?\n)/,
    '$1  MessageSquareText,\n',
    'FolderKanban import line',
  );
}

if (!layout.includes("path: '/response-templates'")) {
  layout = replaceRegexOrFail(
    layoutFile,
    layout,
    /(\s+\{ icon: FolderKanban, label: 'Szablony', path: '\/templates' \},\r?\n)/,
    "$1        { icon: MessageSquareText, label: 'Odpowiedzi', path: '/response-templates' },\n",
    'templates nav item',
  );
}

write(layoutFile, layout);

const pageFile = 'src/pages/ResponseTemplates.tsx';
let page = read(pageFile);

page = page.replace(
  /import \{ Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags, Trash2 \} from 'lucide-react';/,
  "import { Archive, Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags } from 'lucide-react';",
);

page = page.replace(
  /import \{ Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags, Archive \} from 'lucide-react';/,
  "import { Archive, Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags } from 'lucide-react';",
);

page = page.replace(
  /import \{ Archive, Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags \} from 'lucide-react';/,
  "import { Archive, Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags } from 'lucide-react';",
);

page = page.replace("toast.success('Usuni\u0119to szablon.');", "toast.success('Zarchiwizowano szablon.');");
page = page.replace('Nie uda\u0142o si\u0119 usun\u0105\u0107:', 'Nie uda\u0142o si\u0119 zarchiwizowa\u0107:');
page = page.replace('text-rose-500 hover:bg-rose-500/10 hover:text-rose-500', 'text-amber-600 hover:bg-amber-500/10 hover:text-amber-700');
page = page.replace('<Trash2 className="h-4 w-4" />', '<Archive className="h-4 w-4" />');

if (!page.includes("import { Archive, Copy, MessageSquareText, Plus, Save, Search, ShieldAlert, Sparkles, Tags } from 'lucide-react';")) {
  throw new Error('ResponseTemplates.tsx archive import missing');
}
if (page.includes('Trash2')) {
  throw new Error('ResponseTemplates.tsx still references Trash2');
}
if (!page.includes('Zarchiwizowano szablon.')) {
  throw new Error('ResponseTemplates.tsx archive success copy missing');
}
if (!page.includes('<Archive className="h-4 w-4" />')) {
  throw new Error('ResponseTemplates.tsx archive icon missing');
}
if (!layout.includes("label: 'Odpowiedzi', path: '/response-templates'")) {
  throw new Error('Layout.tsx response templates nav missing');
}

write(pageFile, page);

console.log('OK: A27G restored clean UTF-8 files and reapplied response template changes.');
