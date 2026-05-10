const fs = require('fs');
const path = require('path');

const FB1_MARKER = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function stripParagraphsContaining(text, needles) {
  for (const needle of needles) {
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    text = text.replace(new RegExp(`\\n\\s*<p[^>]*>\\s*${escaped}\\s*<\\/p>`, 'g'), '');
    text = text.replace(new RegExp(`\\n\\s*<small[^>]*>\\s*${escaped}\\s*<\\/small>`, 'g'), '');
    text = text.replace(new RegExp(`\\n\\s*<span[^>]*>\\s*${escaped}\\s*<\\/span>`, 'g'), '');
  }
  return text;
}

function findBalancedBlock(text, start, tagName) {
  const tagRe = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'g');
  tagRe.lastIndex = start;
  let depth = 0;
  let first = -1;
  let match;
  while ((match = tagRe.exec(text))) {
    const token = match[0];
    if (!token.startsWith(`</${tagName}`)) {
      if (first < 0) first = match.index;
      depth += 1;
    } else {
      depth -= 1;
      if (depth === 0 && first >= 0) {
        return { start: first, end: tagRe.lastIndex };
      }
    }
  }
  return null;
}

function removeBalancedBlockContaining(text, needle, tagName, startHintBefore = 4000) {
  const idx = text.indexOf(needle);
  if (idx < 0) return text;
  const startSearch = Math.max(0, idx - startHintBefore);
  const tagOpen = `<${tagName}`;
  const start = text.lastIndexOf(tagOpen, idx);
  if (start < startSearch || start < 0) return text;
  const block = findBalancedBlock(text, start, tagName);
  if (!block) return text;
  return text.slice(0, block.start) + text.slice(block.end);
}

function replaceBalancedSectionByClass(text, classNeedle, replacement) {
  const idx = text.indexOf(classNeedle);
  if (idx < 0) return text;
  const start = text.lastIndexOf('<section', idx);
  if (start < 0) return text;
  const block = findBalancedBlock(text, start, 'section');
  if (!block) return text;
  return text.slice(0, block.start) + replacement + text.slice(block.end);
}

function patchSettings() {
  const file = 'src/pages/Settings.tsx';
  if (!exists(file)) return;
  let text = read(file);
  const before = text;

  text = stripParagraphsContaining(text, [
    'Konto, workspace, powiadomienia i preferencje aplikacji.',
    'Konto, workspace, powiadomienia i preferencje aplikacji',
  ]);

  text = removeBalancedBlockContaining(text, '<h2>Dostęp</h2>', 'section');
  text = removeBalancedBlockContaining(text, '<h2>Stan dostępu</h2>', 'section');
  text = removeBalancedBlockContaining(text, 'Stan dostępu pochodzi z istniejącego useWorkspace i access.', 'section');

  if (!text.includes(FB1_MARKER)) {
    text = text.replace(
      "const GOOGLE_CALENDAR_CONFIG_REQUIRED_IS_NOT_USER_ERROR_STAGE86 = 'Google Calendar wymaga konfiguracji w Vercel';",
      "const GOOGLE_CALENDAR_CONFIG_REQUIRED_IS_NOT_USER_ERROR_STAGE86 = 'Google Calendar wymaga konfiguracji w Vercel';\nconst CLOSEFLOW_FB1_SETTINGS_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';",
    );
  }

  if (text !== before) {
    write(file, text);
    console.log(`patched: ${file}`);
  } else {
    console.log(`no-op: ${file}`);
  }
}

function patchSupport() {
  const file = 'src/pages/SupportCenter.tsx';
  if (!exists(file)) return;
  let text = read(file);
  const before = text;

  text = replaceAll(text, '<p>Zgłoszenia, odpowiedzi i kontakt w jednym miejscu.</p>', '<p>Zgłoszenia i status.</p>');
  text = stripParagraphsContaining(text, [
    'Wszystkie Twoje zgłoszenia widoczne w tym workspace.',
    'Tematy, które wymagają dalszej obsługi.',
    'Krótkie odpowiedzi bez ściany tekstu.',
  ]);

  text = removeBalancedBlockContaining(text, '<h2>Co sprawdzić najpierw</h2>', 'section');
  text = removeBalancedBlockContaining(text, '<h2>Najczęstsze pytania</h2>', 'section');

  if (!text.includes('CLOSEFLOW_FB1_SUPPORT_COPY_NOISE_CLEANUP')) {
    text = text.replace(
      "const SUPPORT_VISUAL_REBUILD_STAGE17 = 'SUPPORT_VISUAL_REBUILD_STAGE17';",
      "const SUPPORT_VISUAL_REBUILD_STAGE17 = 'SUPPORT_VISUAL_REBUILD_STAGE17';\nconst CLOSEFLOW_FB1_SUPPORT_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';",
    );
  }

  if (text !== before) {
    write(file, text);
    console.log(`patched: ${file}`);
  } else {
    console.log(`no-op: ${file}`);
  }
}

function patchHelpIfExists() {
  const file = 'src/pages/Help.tsx';
  if (!exists(file)) return;
  let text = read(file);
  const before = text;

  for (const phrase of [
    'Zgłoszenia, odpowiedzi i kontakt w jednym miejscu.',
    'Wszystkie Twoje zgłoszenia widoczne w tym workspace.',
    'Tematy, które wymagają dalszej obsługi.',
    'Krótkie odpowiedzi bez ściany tekstu.',
    'Co sprawdzić najpierw',
    'Najczęstsze pytania',
  ]) {
    text = replaceAll(text, phrase, '');
  }

  if (!text.includes('CLOSEFLOW_FB1_HELP_COPY_NOISE_CLEANUP')) {
    text = `// CLOSEFLOW_FB1_HELP_COPY_NOISE_CLEANUP ${FB1_MARKER}\n` + text;
  }

  if (text !== before) {
    write(file, text);
    console.log(`patched: ${file}`);
  }
}

function patchBilling() {
  const file = 'src/pages/Billing.tsx';
  if (!exists(file)) return;
  let text = read(file);
  const before = text;

  text = stripParagraphsContaining(text, [
    'Plan, dostęp i status subskrypcji w jednym miejscu.',
    'Masz aktywny dostęp do pracy w aplikacji.',
  ]);
  text = replaceAll(text, "description: 'Masz aktywny dostęp do pracy w aplikacji.',", "description: 'Plan aktywny.',");

  const metricsReplacement = `              <section className="billing-metrics-grid" aria-label="Podsumowanie rozliczeń">
                <article className="billing-metric-card">
                  <small>Plan</small>
                  <strong>{currentPlanName}</strong>
                  <span>{accessCopy.label}</span>
                </article>
                <article className="billing-metric-card">
                  <small>Następna płatność / status płatności</small>
                  <strong>{nextBillingAtLabel}</strong>
                  <span>{workspace.cancelAtPeriodEnd ? 'Anulowanie na koniec okresu' : accessCopy.label}</span>
                </article>
              </section>`;
  text = replaceBalancedSectionByClass(text, 'billing-metrics-grid', metricsReplacement);

  if (!text.includes('CLOSEFLOW_FB1_BILLING_COPY_NOISE_CLEANUP')) {
    text = text.replace(
      "const BILLING_VISUAL_REBUILD_STAGE16 = 'BILLING_VISUAL_REBUILD_STAGE16';",
      "const BILLING_VISUAL_REBUILD_STAGE16 = 'BILLING_VISUAL_REBUILD_STAGE16';\nconst CLOSEFLOW_FB1_BILLING_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';",
    );
  }

  if (text !== before) {
    write(file, text);
    console.log(`patched: ${file}`);
  } else {
    console.log(`no-op: ${file}`);
  }
}

function patchCalendar() {
  const file = 'src/pages/Calendar.tsx';
  if (!exists(file)) return;
  let text = read(file);
  const before = text;

  text = stripParagraphsContaining(text, [
    'Oś czasu pokazuje ostatnie działania w czytelnej kolejności.',
  ]);
  text = replaceAll(text, 'Oś czasu pokazuje ostatnie działania w czytelnej kolejności.', '');

  if (!text.includes('CLOSEFLOW_FB1_CALENDAR_COPY_NOISE_CLEANUP')) {
    text = text.replace(
      "const CALENDAR_SCALE_STORAGE_KEY = 'leadflow-calendar-scale';",
      "const CLOSEFLOW_FB1_CALENDAR_COPY_NOISE_CLEANUP = 'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09';\nconst CALENDAR_SCALE_STORAGE_KEY = 'leadflow-calendar-scale';",
    );
  }

  if (text !== before) {
    write(file, text);
    console.log(`patched: ${file}`);
  } else {
    console.log(`no-op: ${file}`);
  }
}

patchSettings();
patchSupport();
patchHelpIfExists();
patchBilling();
patchCalendar();

console.log('CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_PATCH_OK');
