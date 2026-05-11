#!/usr/bin/env node
/* CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_PATCHER_2026_05_11 */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function file(rel) {
  return path.join(repo, rel);
}

function read(rel) {
  return fs.readFileSync(file(rel), 'utf8');
}

function write(rel, content) {
  fs.mkdirSync(path.dirname(file(rel)), { recursive: true });
  fs.writeFileSync(file(rel), content, 'utf8');
}

function exists(rel) {
  return fs.existsSync(file(rel));
}

function replaceBlock(content, key, block) {
  const re = new RegExp(key + "\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},", "m");
  if (!re.test(content)) throw new Error(`Cannot find page header block: ${key}`);
  return content.replace(re, block);
}

function copyFile(fromRel, toRel) {
  fs.mkdirSync(path.dirname(file(toRel)), { recursive: true });
  fs.copyFileSync(path.join(__dirname, '..', fromRel), file(toRel));
}

copyFile('src/styles/closeflow-page-header-stage6-final-lock.css', 'src/styles/closeflow-page-header-stage6-final-lock.css');
copyFile('scripts/check-closeflow-page-header-stage6-final-lock.cjs', 'scripts/check-closeflow-page-header-stage6-final-lock.cjs');
copyFile('docs/ui/CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_2026-05-11.md', 'docs/ui/CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_2026-05-11.md');

// 1) import final CSS as the last emergency layer, after previous failed/weak header imports.
{
  const rel = 'src/styles/emergency/emergency-hotfixes.css';
  let content = read(rel);
  const marker = "CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_IMPORT_2026_05_11";
  const importLine = "\n/* " + marker + " */\n@import '../closeflow-page-header-stage6-final-lock.css';\n";
  if (!content.includes(marker)) {
    content = content.replace(/\s*$/, '') + importLine;
    write(rel, content);
  }
}

// 2) make page header copy clean in the source of truth.
{
  const rel = 'src/lib/page-header-content.ts';
  let content = read(rel);

  content = replaceBlock(content, 'responseTemplates', `responseTemplates: {
    kicker: 'ODPOWIEDZI',
    title: 'Biblioteka odpowiedzi',
    description: 'Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. Źródłem prawdy jest Twoja biblioteka.',
  },`);

  content = replaceBlock(content, 'aiDrafts', `aiDrafts: {
    kicker: 'SZKICE DO SPRAWDZENIA',
    title: 'Szkice AI',
    description: 'Sprawdź, popraw i zatwierdź szkice przed zapisem.',
  },`);

  content = replaceBlock(content, 'notifications', `notifications: {
    kicker: 'POWIADOMIENIA',
    title: 'Powiadomienia',
    description: 'Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.',
  },`);

  content = replaceBlock(content, 'adminAi', `adminAi: {
    kicker: 'AI ADMIN',
    title: 'Konfiguracja AI',
    description: 'Diagnostyka Quick Lead Capture i operatora AI. Ekran techniczny, bez providerów i kluczy dla użytkownika końcowego.',
  },`);

  write(rel, content);
}

// 3) remove explicit duplicate response template description in JSX.
{
  const rel = 'src/pages/ResponseTemplates.tsx';
  if (exists(rel)) {
    let content = read(rel);
    const duplicate = `<p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.responseTemplates.description}</p>
              <p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.responseTemplates.description}</p>`;
    if (content.includes(duplicate)) {
      content = content.replace(duplicate, `<p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.responseTemplates.description}</p>`);
    }
    content = content.replace(
      `<div className="flex flex-col gap-2 sm:flex-row sm:items-center">`,
      `<div data-cf-page-header-part="actions" className="flex flex-col gap-2 sm:flex-row sm:items-center">`
    );
    content = content.replace(
      `<Button className="rounded-2xl" onClick={openCreate}>`,
      `<Button className="rounded-2xl" data-cf-header-action="primary" onClick={openCreate}>`
    );
    content = content.replace(
      `<Button variant="outline" size="icon" className="rounded-2xl text-amber-600 hover:bg-amber-500/10 hover:text-amber-700" onClick={() => void remove(item.id)}>`,
      `<Button variant="outline" size="icon" data-cf-header-action="danger" className="rounded-2xl text-amber-600 hover:bg-amber-500/10 hover:text-amber-700" onClick={() => void remove(item.id)}>`
    );
    write(rel, content);
  }
}

// 4) normalize Templates header actions and prevent green CTA from controlling the header palette.
{
  const rel = 'src/pages/Templates.tsx';
  if (exists(rel)) {
    let content = read(rel);
    content = content.replace(
      `<div className="flex flex-col gap-2 sm:flex-row sm:items-center">`,
      `<div data-cf-page-header-part="actions" className="flex flex-col gap-2 sm:flex-row sm:items-center">`
    );
    content = content.replace(
      `<Button className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={openCreateDialog}>`,
      `<Button className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700" data-cf-header-action="primary" onClick={openCreateDialog}>`
    );
    write(rel, content);
  }
}

// 5) Tasks header: add Nowe zadanie to the page header, not only global bar.
{
  const rel = 'src/pages/TasksStable.tsx';
  if (exists(rel)) {
    let content = read(rel);
    if (!content.includes('data-page-header-new-task-stage6="true"')) {
      content = content.replace(
        /(\bTrash2)(\s*\}\s*from 'lucide-react';)/,
        '$1, Plus$2'
      );
      const needle = `<div className="cf-page-hero-actions flex flex-wrap gap-2" data-cf-page-header-part="actions">`;
      const insert = `${needle}
              <Button type="button" variant="outline" className={actionButtonClass('neutral', 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800')} onClick={openNewTask} data-cf-header-action="primary" data-page-header-new-task-stage6="true">
                <Plus className="mr-2 h-4 w-4" />
                Nowe zadanie
              </Button>`;
      if (!content.includes(needle)) throw new Error('Cannot find TasksStable header actions container');
      content = content.replace(needle, insert);
      write(rel, content);
    }
  }
}

// 6) Calendar header: add Dodaj wydarzenie and Dodaj zadanie if local page-head exists.
{
  const rel = 'src/pages/Calendar.tsx';
  if (exists(rel)) {
    let content = read(rel);
    if (!content.includes('data-calendar-header-add-event-stage6="true"')) {
      content = content.replace(
        /(\bTrash2)(\s*\}\s*from 'lucide-react';)/,
        '$1, Plus$2'
      );
      const openTagRe = /(<div\s+className="head-actions[^"]*"[^>]*>)/;
      if (openTagRe.test(content)) {
        content = content.replace(openTagRe, `$1
            <button type="button" className={createEntryActionClass()} data-cf-header-action="primary" data-calendar-header-add-event-stage6="true" onClick={() => setIsNewEventOpen(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Dodaj wydarzenie
            </button>
            <button type="button" className={createEntryActionClass()} data-cf-header-action="primary" data-calendar-header-add-task-stage6="true" onClick={() => setIsNewTaskOpen(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Dodaj zadanie
            </button>`);
      } else {
        // Calendar has been rebuilt and no longer exposes .head-actions. CSS still normalizes the header.
        content += `\n/* CLOSEFLOW_STAGE6_CALENDAR_HEADER_ACTIONS_NOTE: no .head-actions marker found during patch; CSS final lock still applies. */\n`;
      }
      write(rel, content);
    }
  }
}

// 7) Add package script without disturbing the large scripts object order more than needed.
{
  const rel = 'package.json';
  let pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:page-header-stage6-final-lock'] = 'node scripts/check-closeflow-page-header-stage6-final-lock.cjs';
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
}

console.log('CLOSEFLOW_PAGE_HEADER_STAGE6_FINAL_LOCK_PATCH_OK');
