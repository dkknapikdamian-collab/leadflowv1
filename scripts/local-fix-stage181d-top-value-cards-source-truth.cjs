const fs = require('fs');

const componentPath = 'src/components/operator-rail/TopValueRecordsCard.tsx';
const cssPath = 'src/styles/closeflow-right-rail-source-truth.css';

let component = fs.readFileSync(componentPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const beforeComponent = component;
const beforeCss = css;

// Safety cleanup if a bad self-import exists locally.
component = component.replace(
  /import\s+\{\s*OperatorSideCard,\s*TopValueRecordsCard\s*\}\s+from\s+['"]\.\.\/components\/operator-rail['"];\r?\n/g,
  ''
);

// Ensure all top value cards carry shared class.
if (!component.includes("className={className?.includes('operator-top-value-card')")) {
  component = component.replace(
    'className={className}',
    "className={className?.includes('operator-top-value-card') ? className : ['operator-top-value-card', className].filter(Boolean).join(' ')}"
  );
}

// Ensure shared data marker.
if (!component.includes("'data-cf-top-value-records-card': true")) {
  component = component.replace(
    'dataAttrs={dataAttrs}',
    "dataAttrs={{ ...(dataAttrs || {}), 'data-cf-top-value-records-card': true }}"
  );
}

// Add truncation/tooltip classes to label and value.
if (!component.includes('cf-top-value-label-wrap')) {
  const rowRe = /<span className="lead-relation-label-wrap">\s*<strong className="lead-relation-label">\{item\.label\}<\/strong>\s*\{item\.description \? <small className="lead-relation-description">\{item\.description\}<\/small> : null\}\s*<\/span>\s*<strong className="lead-relation-money">\{item\.valueLabel\}<\/strong>/m;

  const rowNext = `<span
                className="lead-relation-label-wrap cf-top-value-label-wrap"
                title={item.description ? item.label + ' - ' + item.description : item.label}
              >
                <strong className="lead-relation-label cf-top-value-label" title={item.label}>{item.label}</strong>
                {item.description ? <small className="lead-relation-description cf-top-value-description" title={item.description}>{item.description}</small> : null}
              </span>
              <strong className="lead-relation-money cf-top-value-money">{item.valueLabel}</strong>`;

  if (!rowRe.test(component)) {
    throw new Error('Could not find TopValueRecordsCard row markup to patch.');
  }

  component = component.replace(rowRe, rowNext);
}

const cssBlock = `

/* CLOSEFLOW_STAGE181D_MOBILE_TOP_VALUE_CARDS_SHARED_SOURCE_TRUTH
   LOCAL ONLY
   Scope: phone viewport only.
   Decision: Lead top-value card is the visual source. Clients use the same row height, label weight, value rhythm and truncation.
   Rule: long lead/client names are ellipsized; hover title shows the full name.
   Desktop remains frozen.
*/
@media (max-width: 760px) {
  #root .cf-html-view:is(.main-leads-html, .main-clients-html)
  :is([data-testid="leads-top-value-records-card"], [data-testid="clients-top-value-records-card"], .operator-top-value-card) .quick-list {
    display: grid !important;
    gap: 8px !important;
    margin: 0 !important;
  }

  #root .cf-html-view:is(.main-leads-html, .main-clients-html)
  :is([data-testid="leads-top-value-records-card"], [data-testid="clients-top-value-records-card"], .operator-top-value-card) .quick-list > a {
    width: 100% !important;
    min-height: 50px !important;
    box-sizing: border-box !important;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 9px 12px !important;
    border-radius: 14px !important;
    border: 1px solid #e4e7ec !important;
    background: #ffffff !important;
    color: #111827 !important;
    text-decoration: none !important;
  }

  #root .cf-html-view:is(.main-leads-html, .main-clients-html)
  :is([data-testid="leads-top-value-records-card"], [data-testid="clients-top-value-records-card"], .operator-top-value-card) .cf-top-value-label-wrap {
    min-width: 0 !important;
    max-width: 100% !important;
    display: block !important;
    overflow: hidden !important;
    border-radius: 12px !important;
    background: #f8fafc !important;
    padding: 7px 12px !important;
  }

  #root .cf-html-view:is(.main-leads-html, .main-clients-html)
  :is([data-testid="leads-top-value-records-card"], [data-testid="clients-top-value-records-card"], .operator-top-value-card) .cf-top-value-label {
    display: block !important;
    min-width: 0 !important;
    max-width: 100% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    color: #111827 !important;
    font-size: 13px !important;
    font-weight: 950 !important;
    line-height: 1.15 !important;
    text-align: center !important;
    letter-spacing: -0.015em !important;
  }

  #root .cf-html-view:is(.main-leads-html, .main-clients-html)
  :is([data-testid="leads-top-value-records-card"], [data-testid="clients-top-value-records-card"], .operator-top-value-card) .cf-top-value-description {
    display: none !important;
  }

  #root .cf-html-view:is(.main-leads-html, .main-clients-html)
  :is([data-testid="leads-top-value-records-card"], [data-testid="clients-top-value-records-card"], .operator-top-value-card) .cf-top-value-money {
    min-width: max-content !important;
    white-space: nowrap !important;
    color: #111827 !important;
    font-size: 13px !important;
    font-weight: 950 !important;
    line-height: 1 !important;
    text-align: right !important;
  }
}
`;

if (!css.includes('CLOSEFLOW_STAGE181D_MOBILE_TOP_VALUE_CARDS_SHARED_SOURCE_TRUTH')) {
  css += cssBlock;
}

fs.writeFileSync(componentPath, component, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

const failures = [];
const nextComponent = fs.readFileSync(componentPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

for (const token of [
  'cf-top-value-label-wrap',
  'cf-top-value-label',
  'cf-top-value-money',
  "'data-cf-top-value-records-card': true",
]) {
  if (!nextComponent.includes(token)) failures.push('TopValueRecordsCard missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181D_MOBILE_TOP_VALUE_CARDS_SHARED_SOURCE_TRUTH',
  'leads-top-value-records-card',
  'clients-top-value-records-card',
  'text-overflow: ellipsis',
  'white-space: nowrap',
  'grid-template-columns: minmax(0, 1fr) auto',
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181D local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (beforeComponent === nextComponent && beforeCss === nextCss) {
  console.log('No changes needed. Stage181D already present.');
} else {
  console.log('Patched Stage181D locally.');
}

console.log('OK Stage181D local: TopValueRecordsCard has shared mobile source truth and ellipsis/title behavior.');
