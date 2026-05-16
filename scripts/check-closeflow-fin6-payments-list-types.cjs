const fs=require('fs');
const checks=[];function pass(l){checks.push({ok:true,l});console.log('PASS '+l)}function fail(l){checks.push({ok:false,l});console.error('FAIL '+l)}function read(r){if(!fs.existsSync(r)){fail(r+': exists');return ''}pass(r+': exists');return fs.readFileSync(r,'utf8')}function has(r,n,l){const t=read(r); if(t.includes(n))pass(r+': '+l);else fail(r+': missing '+l+' [needle='+n+']'); return t}
const labels=has('src/lib/finance/finance-payment-labels.ts','FIN-6_PAYMENTS_LIST_AND_PAYMENT_TYPES_V1','contract marker');
for(const pair of [['deposit','Zaliczka'],['partial','Cz\u0119\u015Bciowa wp\u0142ata'],['final','Ko\u0144cowa wp\u0142ata'],['commission','Prowizja'],['refund','Zwrot'],['other','Inne']]){ if(labels.includes(pair[0])&&labels.includes(pair[1])) pass(pair[0]+': '+pair[1]); else fail(pair[0]+': '+pair[1]); }
for(const n of ['PAYMENT_TYPE_OPTIONS','PAYMENT_STATUS_OPTIONS','getPaymentTypeLabel','getPaymentStatusLabel']){ if(labels.includes(n)) pass('labels contains '+n); else fail('labels missing '+n); }
const list=read('src/components/finance/PaymentList.tsx');
for(const n of ['getPaymentTypeLabel','getPaymentStatusLabel','StatusPill','getPaymentStatusTone']){ if(list.includes(n)) pass('PaymentList contains '+n); else fail('PaymentList missing '+n); }
for(const old of ['Wp\u0142ata cz\u0119\u015Bciowa','Wp\u0142ata ko\u0144cowa','Inna wp\u0142ata']){ if(!list.includes(old)) pass('PaymentList no old label '+old); else fail('PaymentList old label '+old); }
const form=read('src/components/finance/PaymentFormDialog.tsx');
for(const n of ['PAYMENT_TYPE_OPTIONS','PAYMENT_STATUS_OPTIONS','FormFooter']){ if(form.includes(n)) pass('PaymentFormDialog contains '+n); else fail('PaymentFormDialog missing '+n); }
if(!form.includes('DialogFooter')) pass('PaymentFormDialog no DialogFooter'); else fail('PaymentFormDialog no DialogFooter');
const casePanel=read('src/components/finance/CaseSettlementPanel.tsx');
for(const n of ['PaymentList','type="commission"','type="partial"']){ if(casePanel.includes(n)) pass('CaseSettlementPanel contains '+n); else fail('CaseSettlementPanel missing '+n); }
const api=read('api/payments.ts'); if(api.includes('normalizePaymentType')) pass('api/payments normalizes payment type'); else fail('api/payments normalizes payment type'); if(api.includes('normalizePaymentStatus')) pass('api/payments normalizes payment status'); else fail('api/payments normalizes payment status');
const srv=read('src/server/payments.ts'); for(const n of ['refund','other','planned','cancelled']){ if(srv.includes(n)) pass('server payments accepts '+n); else fail('server payments accepts '+n); } for(const old of ['recurring','manual']){ if(!srv.includes(old)) pass('server no legacy '+old); else fail('server no legacy '+old); }
const pkg=JSON.parse(read('package.json').replace(/^\uFEFF/,'')); if(pkg.scripts&&pkg.scripts['check:closeflow-fin6-payments-list-types']) pass('package script present'); else fail('package script present');
const failed=checks.filter(x=>!x.ok); console.log(`\nSummary: ${checks.length-failed.length} pass, ${failed.length} fail.`); if(failed.length){console.error('FAIL CLOSEFLOW_FIN6_PAYMENTS_LIST_TYPES_FAILED'); process.exit(1)} console.log('CLOSEFLOW_FIN6_PAYMENTS_LIST_TYPES_OK');
