const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseDetailPath = path.join(repo, 'src', 'pages', 'CaseDetail.tsx');
function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(repo, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function mustContain(text, needle, label) {
  if (!text.includes(needle)) throw new Error(`STAGE220A29 guard failed: missing ${label}`);
}

const caseDetail = read(caseDetailPath);
mustContain(caseDetail, "STAGE220A29_PAYMENT_DELETE_FROM_HISTORY_MODAL", 'stage marker');
mustContain(caseDetail, "deletePaymentFromSupabase", 'deletePaymentFromSupabase import/use');
mustContain(caseDetail, "paymentDeleteTargetStage220A29", 'delete target state');
mustContain(caseDetail, "paymentDeleteSubmittingStage220A29", 'delete submitting state');
mustContain(caseDetail, "openPaymentDeleteConfirmStage220A29", 'open delete confirm handler');
mustContain(caseDetail, "handleConfirmDeletePaymentStage220A29", 'confirm delete handler');
mustContain(caseDetail, "await deletePaymentFromSupabase(paymentId);", 'actual payment delete call');
mustContain(caseDetail, "eventType: 'payment_deleted'", 'activity trace after delete');
mustContain(caseDetail, "await reloadCaseFinanceData(caseData);", 'finance reload after delete');
mustContain(caseDetail, "data-stage220a29-delete-payment-from-history=\"true\"", 'delete button marker in history modal');
mustContain(caseDetail, "data-stage220a29-delete-payment-confirm=\"true\"", 'confirm dialog marker');
mustContain(caseDetail, "confirmTone=\"destructive\"", 'destructive confirm tone');
mustContain(caseDetail, "paymentDeleteSubmittingStage220A29 || paymentCorrectionSubmittingStage220A27", 'delete/correction concurrency guard');

console.log('STAGE220A29 guard OK: payment history modal can delete selected payment/correction with confirm and finance reload.');
