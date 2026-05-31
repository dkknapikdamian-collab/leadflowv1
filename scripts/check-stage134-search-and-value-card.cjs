/* CLOSEFLOW_STAGE134_SEARCH_AND_VALUE_CARD_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function mustInclude(file, marker) {
  const content = read(file);
  if (!content.includes(marker)) {
    throw new Error(`${file} missing required marker: ${marker}`);
  }
}

function mustNotInclude(file, marker) {
  const content = read(file);
  if (content.includes(marker)) {
    throw new Error(`${file} contains forbidden marker: ${marker}`);
  }
}

mustInclude('src/App.tsx', "import './styles/closeflow-search-source-truth-stage134.css';");
mustInclude('src/styles/closeflow-search-source-truth-stage134.css', 'CLOSEFLOW_STAGE134_SEARCH_SOURCE_TRUTH');

mustInclude('src/pages/Leads.tsx', 'CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER');
mustInclude('src/pages/Leads.tsx', 'data-cf-main-search="true"');
mustInclude('src/pages/Leads.tsx', 'data-leads-search="true"');
mustInclude('src/pages/Leads.tsx', '<Search className="w-4 h-4" />');
mustInclude('src/pages/Leads.tsx', 'placeholder={showTrash ? CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER : CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER}');
mustInclude('src/pages/Leads.tsx', 'aria-label="Szukaj w leadach"');
mustInclude('src/pages/Leads.tsx', 'description="5 leadów z największą wartością."');
mustNotInclude('src/pages/Leads.tsx', '<span aria-hidden="true">?</span>');
mustNotInclude('src/pages/Leads.tsx', "headerAside={<span className=\"pill dark\">Lejek razem:");

mustInclude('src/pages/Clients.tsx', 'CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER');
mustInclude('src/pages/Clients.tsx', 'data-cf-main-search="true"');
mustInclude('src/pages/Clients.tsx', 'data-clients-search="true"');
mustInclude('src/pages/Clients.tsx', 'placeholder={showArchived ? CLOSEFLOW_STAGE134_TRASH_SEARCH_PLACEHOLDER : CLOSEFLOW_STAGE134_MAIN_SEARCH_PLACEHOLDER}');
mustInclude('src/pages/Clients.tsx', 'aria-label="Szukaj w klientach"');

[
  '_project/STAGE134_SEARCH_AND_LEADS_VALUE_CARD_CLEANUP_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage134 search and leads value card cleanup.md',
].forEach((file) => {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`missing documentation file: ${file}`);
  }
});

console.log('OK: Stage134 search and leads value card cleanup guard passed.');
