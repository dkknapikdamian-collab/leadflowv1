const fs = require('fs');
const checks=[];
function pass(label){checks.push({ok:true,label});console.log('PASS '+label)}
function fail(label){checks.push({ok:false,label});console.error('FAIL '+label)}
function read(rel){if(!fs.existsSync(rel)){fail(rel+': exists'); return ''} pass(rel+': exists'); return fs.readFileSync(rel,'utf8')}
function has(rel, needle, label){const text=read(rel); if(text.includes(needle)) pass(rel+': '+label); else fail(rel+': missing '+label+' [needle='+needle+']'); return text}
const files=['src/components/finance/FinanceSnapshot.tsx','src/components/finance/FinanceMiniSummary.tsx','src/components/finance/PaymentList.tsx','src/components/finance/PaymentFormDialog.tsx','src/components/finance/CommissionFormDialog.tsx','src/components/finance/CaseSettlementPanel.tsx','src/styles/finance/closeflow-finance.css'];
const content=Object.fromEntries(files.map(f=>[f,read(f)]));
if(content['src/components/finance/FinanceSnapshot.tsx'].includes('SurfaceCard')) pass('FinanceSnapshot uses SurfaceCard'); else fail('FinanceSnapshot uses SurfaceCard');
if(content['src/components/finance/FinanceMiniSummary.tsx'].includes('SurfaceCard')) pass('FinanceMiniSummary uses SurfaceCard'); else fail('FinanceMiniSummary uses SurfaceCard');
if(content['src/components/finance/FinanceMiniSummary.tsx'].includes('StatusPill')) pass('FinanceMiniSummary uses StatusPill'); else fail('FinanceMiniSummary uses StatusPill');
if(content['src/components/finance/FinanceMiniSummary.tsx'].includes('getCommissionStatusTone')) pass('FinanceMiniSummary commission tone mapper'); else fail('FinanceMiniSummary commission tone mapper');
if(content['src/components/finance/PaymentList.tsx'].includes('StatusPill')) pass('PaymentList uses StatusPill'); else fail('PaymentList uses StatusPill');
if(content['src/components/finance/PaymentList.tsx'].includes('getPaymentStatusTone')) pass('PaymentList payment tone mapper'); else fail('PaymentList payment tone mapper');
if(content['src/components/finance/PaymentFormDialog.tsx'].includes('FormFooter')) pass('PaymentFormDialog uses FormFooter'); else fail('PaymentFormDialog uses FormFooter');
if(!content['src/components/finance/PaymentFormDialog.tsx'].includes('DialogFooter')) pass('PaymentFormDialog no DialogFooter'); else fail('PaymentFormDialog no DialogFooter');
if(content['src/components/finance/CommissionFormDialog.tsx'].includes('FormFooter')) pass('CommissionFormDialog uses FormFooter'); else fail('CommissionFormDialog uses FormFooter');
if(!content['src/components/finance/CommissionFormDialog.tsx'].includes('DialogFooter')) pass('CommissionFormDialog no DialogFooter'); else fail('CommissionFormDialog no DialogFooter');
if(content['src/components/finance/CaseSettlementPanel.tsx'].includes('SurfaceCard')) pass('CaseSettlementPanel uses SurfaceCard'); else fail('CaseSettlementPanel uses SurfaceCard');
if(content['src/components/finance/CaseSettlementPanel.tsx'].includes('FormFooter')) pass('CaseSettlementPanel uses FormFooter'); else fail('CaseSettlementPanel uses FormFooter');
if(!content['src/components/finance/CaseSettlementPanel.tsx'].includes('DialogFooter')) pass('CaseSettlementPanel no DialogFooter'); else fail('CaseSettlementPanel no DialogFooter');
const css=content['src/styles/finance/closeflow-finance.css'];
if(css.includes('FIN-8_FINANCE_VISUAL_INTEGRATION_REPAIR1') || css.includes('FIN-8_FINANCE_VISUAL_INTEGRATION')) pass('finance CSS FIN-8 marker present'); else fail('finance CSS FIN-8 marker present');
if(css.includes('FIN-7_CLIENT_FINANCE_SUMMARY_STYLE')) pass('finance CSS FIN-7 marker retained'); else fail('finance CSS FIN-7 marker retained');
if(!/(#[0-9a-fA-F]{3,8}\b|rgba?\s*\()/g.test(css)) pass('finance CSS has no raw rgb/rgba/hex colors'); else fail('finance CSS has no raw rgb/rgba/hex colors');
if(css.includes('var(--') || css.includes('cf-surface-card') || css.includes('cf-status-pill')) pass('finance CSS uses design tokens/system hooks'); else fail('finance CSS uses design tokens/system hooks');
const source=files.map(f=>content[f]).join('\n');
for(const token of ['finance-card-v2','commission-fix','payment-hotfix']){ if(!source.includes(token)) pass('forbidden visual drift token absent in finance source: '+token); else fail('forbidden visual drift token absent in finance source: '+token); }
has('docs/finance/CLOSEFLOW_FIN8_FINANCE_VISUAL_INTEGRATION_REPAIR1_2026-05-10.md','SurfaceCard','doc SurfaceCard');
has('docs/finance/CLOSEFLOW_FIN8_FINANCE_VISUAL_INTEGRATION_REPAIR1_2026-05-10.md','StatusPill','doc StatusPill');
has('docs/finance/CLOSEFLOW_FIN8_FINANCE_VISUAL_INTEGRATION_REPAIR1_2026-05-10.md','FormFooter','doc FormFooter');
const failed=checks.filter(x=>!x.ok);
console.log(`\nSummary: ${checks.length-failed.length} pass, ${failed.length} fail.`);
if(failed.length){ console.error('FAIL CLOSEFLOW_FIN8_FINANCE_VISUAL_INTEGRATION_FAILED'); process.exit(1); }
console.log('CLOSEFLOW_FIN8_FINANCE_VISUAL_INTEGRATION_OK');
