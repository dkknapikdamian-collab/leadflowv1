# POLECENIE KONTROLNE PO WDROŻENIU
$Repo="C:\Users\malim\Desktop\biznesy_ai\2.closeflow";
$Branch="dev-rollout-freeze";
Set-Location $Repo;
git checkout $Branch;
git status --short;
npm run build;
npm run check:admin-debug-toolbar;
npm run check:admin-review-mode;
npm run check:admin-button-matrix;
npm run check:admin-feedback-export;
npm run test:admin-tools;
