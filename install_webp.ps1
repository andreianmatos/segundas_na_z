# WebP Tools Installation Helper
Write-Host "WebP Tools Installation Guide" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Yellow
Write-Host ""

# Check if already installed
$cwebpPath = Get-Command cwebp -ErrorAction SilentlyContinue
if ($cwebpPath) {
    Write-Host "cwebp is already installed!" -ForegroundColor Green
    Write-Host "Location: $($cwebpPath.Source)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "You can now run: .\compress_webp.bat" -ForegroundColor Yellow
    exit
}

Write-Host "cwebp is NOT installed." -ForegroundColor Red
Write-Host ""
Write-Host "INSTALLATION STEPS:" -ForegroundColor Magenta
Write-Host ""
Write-Host "1. Download WebP Tools:" -ForegroundColor Yellow
Write-Host "   https://developers.google.com/speed/webp/download" -ForegroundColor White
Write-Host "   Download: libwebp-1.x.x-windows-x64.zip" -ForegroundColor White
Write-Host ""
Write-Host "2. Extract the ZIP file:" -ForegroundColor Yellow
Write-Host "   Extract to: C:\webp\" -ForegroundColor White
Write-Host ""
Write-Host "3. Add to PATH:" -ForegroundColor Yellow
Write-Host "   - Press Win + X -> System -> Advanced system settings" -ForegroundColor White
Write-Host "   - Click 'Environment Variables'" -ForegroundColor White
Write-Host "   - Under 'System variables', find 'Path' -> Click 'Edit'" -ForegroundColor White
Write-Host "   - Click 'New' -> Add: C:\webp\bin" -ForegroundColor White
Write-Host "   - Click OK on all dialogs" -ForegroundColor White
Write-Host ""
Write-Host "4. Restart PowerShell/Command Prompt" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Verify installation:" -ForegroundColor Yellow
Write-Host "   Run: cwebp -version" -ForegroundColor White
Write-Host ""
Write-Host "6. Run compression:" -ForegroundColor Yellow
Write-Host "   Run: .\compress_webp.bat" -ForegroundColor White
Write-Host ""
Write-Host "ALTERNATIVE: Use online tools (no installation needed):" -ForegroundColor Green
Write-Host "   https://squoosh.app/ - Best for quality control" -ForegroundColor White
Write-Host "   https://cloudconvert.com/webp-to-webp - Batch processing" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to open download page..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "https://developers.google.com/speed/webp/download"