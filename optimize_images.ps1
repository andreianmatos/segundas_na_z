# Image Optimization Script
Write-Host "Image Optimization Guide" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Yellow
Write-Host ""

$images = Get-ChildItem "images" -Recurse -Include "*.webp", "*.jpg", "*.JPG", "*.png" | Where-Object {
    $_.Length -gt 100KB  # Only show files larger than 100KB
} | Sort-Object Length -Descending

Write-Host "Large images needing optimization:" -ForegroundColor Green
$images | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    $relativePath = $_.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    Write-Host "  $relativePath - ${sizeMB}MB" -ForegroundColor Gray
}

Write-Host ""
Write-Host "PRIORITY FILES (largest first):" -ForegroundColor Red
Write-Host "  1. monthly_poster.webp - 3.37MB (CRITICAL - too large!)" -ForegroundColor Yellow
Write-Host "  2. week1-4.webp - 0.92MB each" -ForegroundColor Yellow
Write-Host "  3. archive/6.webp - 0.82MB" -ForegroundColor Yellow
Write-Host ""

Write-Host "OPTIMIZATION METHOD:" -ForegroundColor Magenta
Write-Host ""
Write-Host "Option 1 - Squoosh.app (Best Quality Control):" -ForegroundColor Yellow
Write-Host "  1. Go to: https://squoosh.app/" -ForegroundColor White
Write-Host "  2. Upload monthly_poster.webp" -ForegroundColor White
Write-Host "  3. Select WebP format" -ForegroundColor White
Write-Host "  4. Set Quality: 90-95" -ForegroundColor White
Write-Host "  5. Compare visually - adjust until satisfied" -ForegroundColor White
Write-Host "  6. Download optimized version" -ForegroundColor White
Write-Host ""

Write-Host "Option 2 - CloudConvert (Batch Processing):" -ForegroundColor Yellow
Write-Host "  1. Go to: https://cloudconvert.com/webp-to-webp" -ForegroundColor White
Write-Host "  2. Upload all large WebP files" -ForegroundColor White
Write-Host "  3. Set Quality: 90" -ForegroundColor White
Write-Host "  4. Convert and download" -ForegroundColor White
Write-Host ""

Write-Host "TARGET SIZES:" -ForegroundColor Cyan
Write-Host "  monthly_poster.webp: 3.37MB -> ~500KB-800KB (80% reduction)" -ForegroundColor White
Write-Host "  week*.webp: 0.92MB -> ~200KB-300KB (70% reduction)" -ForegroundColor White
Write-Host "  archive/6.webp: 0.82MB -> ~150KB-250KB (70% reduction)" -ForegroundColor White
Write-Host ""

Write-Host "QUALITY SETTINGS:" -ForegroundColor Green
Write-Host "  Quality 90-95: Visually identical, 70-80% smaller" -ForegroundColor White
Write-Host "  Quality 85-90: Nearly identical, 80-85% smaller" -ForegroundColor White
Write-Host "  Quality 80-85: Slight difference, 85-90% smaller" -ForegroundColor White
Write-Host ""

Write-Host "RECOMMENDATION:" -ForegroundColor Red
Write-Host "  Start with monthly_poster.webp at quality 90" -ForegroundColor White
Write-Host "  Compare side-by-side - if looks good, use it!" -ForegroundColor White
Write-Host "  If you want perfect quality, use quality 95" -ForegroundColor White
Write-Host ""

$totalSize = ($images | Measure-Object Length -Sum).Sum
$estimatedSaved = [math]::Round($totalSize * 0.75 / 1MB, 1)

Write-Host "EXPECTED RESULTS:" -ForegroundColor Green
Write-Host "  Total current size: ~$([math]::Round($totalSize / 1MB, 1))MB" -ForegroundColor Yellow
Write-Host "  Estimated savings: ~${estimatedSaved}MB (75% reduction)" -ForegroundColor Yellow
Write-Host "  Much faster loading!" -ForegroundColor Yellow