@echo off
echo WebP Recompression Script
echo =========================
echo.

echo Checking for cwebp tool...
where cwebp >nul 2>nul
if %errorlevel% neq 0 (
    echo cwebp not found!
    echo.
    echo Please use online tools instead:
    echo 1. Squoosh.app - https://squoosh.app/ (best for quality control)
    echo 2. CloudConvert - https://cloudconvert.com/webp-to-webp (batch processing)
    echo.
    echo Priority: Compress monthly_poster.webp (3.37MB) first!
    echo.
    pause
    exit /b 1
)

echo cwebp found! Starting compression...
echo.

echo CRITICAL: Compressing monthly_poster.webp (3.37MB)...
if exist "images\programming\monthly_poster.webp" (
    echo Creating backup...
    copy "images\programming\monthly_poster.webp" "images\programming\monthly_poster.webp.backup"
    echo Compressing with quality 90...
    cwebp -q 90 "images\programming\monthly_poster.webp.backup" -o "images\programming\monthly_poster.webp"
    echo Done! Check file size.
)

echo.
echo Compressing other large WebP files...
for %%f in (images\programming\week*.webp) do (
    echo Compressing %%~nf%%~xf
    copy "%%f" "%%f.backup"
    cwebp -q 90 "%%f.backup" -o "%%f"
)

for %%f in (images\archive\*.webp) do (
    echo Compressing %%~nf%%~xf
    copy "%%f" "%%f.backup"
    cwebp -q 90 "%%f.backup" -o "%%f"
)

echo.
echo Compression complete!
echo Original files saved as .backup
echo Check the results and delete backups if satisfied.
echo.
pause