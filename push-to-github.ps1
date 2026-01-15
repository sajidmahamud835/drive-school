# PowerShell script to authenticate GitHub CLI and push to GitHub

Write-Host "Step 1: Authenticating with GitHub..." -ForegroundColor Yellow
gh auth login

Write-Host "`nStep 2: Creating repository and pushing code..." -ForegroundColor Yellow
gh repo create drive-school --public --source=. --remote=origin --description "A Next.js-based landing page and booking system for a driving training center" --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/sajidmahamud835/drive-school" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Failed to push. Please check the error above." -ForegroundColor Red
}
