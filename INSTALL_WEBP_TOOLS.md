# Installing WebP Tools for Image Compression

## Quick Installation Guide

### Option 1: Download Pre-built Binary (Easiest)

1. **Download WebP Tools:**
   - Go to: https://developers.google.com/speed/webp/download
   - Scroll down to "Precompiled Utilities"
   - Download: `libwebp-1.x.x-windows-x64.zip` (latest version)

2. **Extract the ZIP file:**
   - Extract to: `C:\webp\` (or any folder you prefer)

3. **Add to PATH:**
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" → Click "Edit"
   - Click "New" → Add: `C:\webp\bin` (or wherever you extracted the bin folder)
   - Click OK on all dialogs

4. **Verify Installation:**
   - Open new PowerShell/Command Prompt
   - Type: `cwebp -version`
   - Should show version number

5. **Run Compression:**
   - Navigate to your project folder
   - Run: `.\compress_webp.bat`

---

### Option 2: Using Chocolatey (If you have it)

```powershell
choco install webp
```

---

### Option 3: Using Scoop (If you have it)

```powershell
scoop install webp
```

---

## After Installation

Once `cwebp` is installed, you can:

1. **Run the batch script:**
   ```cmd
   .\compress_webp.bat
   ```

2. **Or compress manually:**
   ```cmd
   cwebp -q 90 input.webp -o output.webp
   ```

---

## Troubleshooting

**"cwebp is not recognized":**
- Make sure you added the `bin` folder to PATH
- Restart your terminal/PowerShell
- Verify with: `where cwebp`

**Still not working:**
- Use the full path: `C:\webp\bin\cwebp.exe -q 90 file.webp -o output.webp`
- Or use online tools: https://squoosh.app/

---

## Quick Test

After installation, test with:
```cmd
cwebp -version
```

If it works, you're ready to compress images!